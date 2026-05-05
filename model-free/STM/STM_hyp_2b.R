# Load libraries
library(dplyr)
library(readxl)
library(ggplot2)
library(janitor)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# ===============================================================================
# LOAD DATA
# ===============================================================================
# Load the VP data
controls_vp <- read.csv("<PATH_TO_DATA>/Controls/VP.csv")
controls_vp <- filter_exclusions(controls_vp)

rels_vp <- read.csv("<PATH_TO_DATA>/Relatives/VP.csv")
rels_vp <- filter_exclusions(rels_vp)

syn_vp <- read.csv("<PATH_TO_DATA>/Synaesthetes/VP.csv")
syn_vp <- filter_exclusions(syn_vp)

# Load the STM data
controls_stm <- read.csv("<PATH_TO_DATA>/Controls/STM.csv")
controls_stm <- filter_exclusions(controls_stm)

rels_stm <- read.csv("<PATH_TO_DATA>/Relatives/STM.csv")
rels_stm <- filter_exclusions(rels_stm)

syn_stm <- read.csv("<PATH_TO_DATA>/Synaesthetes/STM.csv")
syn_stm <- filter_exclusions(syn_stm)

# Load the questionnaire data
controls_quest <- read.csv("<PATH_TO_DATA>/Controls/questionnaires.csv")
rels_quest <- read.csv("<PATH_TO_DATA>/Relatives/questionnaires.csv")
syn_quest <- read.csv("<PATH_TO_DATA>/Synaesthetes/questionnaires.csv")

# Load the observation list for age
syn_obs <- read_excel("<PATH_TO_PARTICIPANTS>/observation_list.xlsx", sheet = "Synaesthetes") %>%
  clean_names() %>%
  mutate(participant_id = as.character(participant_id)) %>%
  select(participant_id, age)

rels_obs <- read_excel("<PATH_TO_PARTICIPANTS>/observation_list.xlsx", sheet = "Relatives") %>%
  clean_names() %>%
  mutate(participant_id = as.character(participant_id)) %>%
  select(participant_id, age)

controls_obs <- read_excel("<PATH_TO_PARTICIPANTS>/observation_list.xlsx", sheet = "Controls") %>%
  clean_names() %>%
  mutate(participant_id = as.character(participant_id)) %>%
  select(participant_id, age)

observation_list <- bind_rows(syn_obs, rels_obs, controls_obs)

# ===============================================================================
# PREPARE DATA
# ===============================================================================

# Add group labels and ensure participant_id is character
controls_vp <- controls_vp %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_vp <- rels_vp %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_vp <- syn_vp %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_stm <- controls_stm %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_stm <- rels_stm %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_stm <- syn_stm %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_quest <- controls_quest %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_quest <- rels_quest %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_quest <- syn_quest %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

observation_list <- observation_list %>% mutate(participant_id = as.character(participant_id))

# Combine the data
vp_data <- bind_rows(controls_vp, rels_vp, syn_vp)
stm_data <- bind_rows(controls_stm, rels_stm, syn_stm)
quest_data <- bind_rows(controls_quest, rels_quest, syn_quest)

# ===============================================================================
# CALCULATE MEAN SCORES
# ===============================================================================

# VP Colour means
vp_colour_mean <- vp_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# VP Location means
vp_location_mean <- vp_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Get load values
load_values <- sort(unique(stm_data$load_n))
cat("Processing STM data for loads:", paste(load_values, collapse = ", "), "\n\n")

# STM Colour means by load
stm_colour_by_load <- list()
for (load in load_values) {
  stm_colour_by_load[[as.character(load)]] <- stm_data %>%
    filter(load_n == load) %>%
    group_by(participant_id, group) %>%
    summarize(!!paste0("mean_stm_colour_load", load) := mean(colour_angle_abs_deviation, na.rm = TRUE), 
              .groups = 'drop')
}

# STM Location means by load
stm_location_by_load <- list()
for (load in load_values) {
  stm_location_by_load[[as.character(load)]] <- stm_data %>%
    filter(load_n == load) %>%
    group_by(participant_id, group) %>%
    summarize(!!paste0("mean_stm_location_load", load) := mean(location_angle_abs_deviation, na.rm = TRUE), 
              .groups = 'drop')
}

# ===============================================================================
# SELECT QUESTIONNAIRE VARIABLES WITH FALLBACK LOGIC FOR MOTIVATION SUBSCALES
# ===============================================================================

quest_selected <- quest_data %>%
  select(participant_id, group,
         # STM motivation subscales
         STM_intrinsic_motivation,
         STM_identified_regulation,
         STM_external_regulation,
         STM_amotivation,
         # LTMI motivation subscales (for averaging)
         LTMI_intrinsic_motivation,
         LTMI_identified_regulation,
         LTMI_external_regulation,
         LTMI_amotivation,
         # LTMD_VP motivation subscales (for averaging)
         LTMD_VP_intrinsic_motivation,
         LTMD_VP_identified_regulation,
         LTMD_VP_external_regulation,
         LTMD_VP_amotivation,
         # Other questionnaire variables
         imagery_ability,
         technical_cognition,
         word_forms,
         organisation,
         global_bias,
         systemising_tendency) %>%
  rowwise() %>%
  mutate(
    # Calculate mean motivation subscales from LTMI and LTMD_VP sessions
    mean_intrinsic_motivation = mean(c(LTMI_intrinsic_motivation, LTMD_VP_intrinsic_motivation), na.rm = TRUE),
    mean_identified_regulation = mean(c(LTMI_identified_regulation, LTMD_VP_identified_regulation), na.rm = TRUE),
    mean_external_regulation = mean(c(LTMI_external_regulation, LTMD_VP_external_regulation), na.rm = TRUE),
    mean_amotivation = mean(c(LTMI_amotivation, LTMD_VP_amotivation), na.rm = TRUE),
    
    # Create fallback: use STM subscales if available, otherwise use mean from other sessions
    intrinsic_motivation = coalesce(STM_intrinsic_motivation, mean_intrinsic_motivation),
    identified_regulation = coalesce(STM_identified_regulation, mean_identified_regulation),
    external_regulation = coalesce(STM_external_regulation, mean_external_regulation),
    amotivation = coalesce(STM_amotivation, mean_amotivation)
  ) %>%
  ungroup() %>%
  select(participant_id, group,
         intrinsic_motivation,
         identified_regulation,
         external_regulation,
         amotivation,
         imagery_ability,
         technical_cognition,
         word_forms,
         organisation,
         global_bias,
         systemising_tendency)

# ===============================================================================
# OUTLIER EXCLUSION FUNCTION (2.5 SD above group mean)
# ===============================================================================

exclude_high_outliers <- function(data, var_name) {
  data %>%
    group_by(group) %>%
    mutate(
      group_mean = mean(.data[[var_name]], na.rm = TRUE),
      group_sd = sd(.data[[var_name]], na.rm = TRUE),
      z_score_high = (.data[[var_name]] - group_mean) / group_sd
    ) %>%
    filter(z_score_high <= 2.5) %>%
    select(-group_mean, -group_sd, -z_score_high) %>%
    ungroup()
}

# ===============================================================================
# RUN REGRESSIONS FOR EACH LOAD
# ===============================================================================

# Storage for all results
all_model_results <- list()

for (load in load_values) {
  
  cat("\n=======================================================================\n")
  cat("LOAD", load, "REGRESSIONS\n")
  cat("=======================================================================\n\n")
  
  stm_colour_var <- paste0("mean_stm_colour_load", load)
  stm_location_var <- paste0("mean_stm_location_load", load)
  
  # ===============================================================================
  # MERGE DATA FOR THIS LOAD
  # ===============================================================================
  
  merged_data_load <- vp_colour_mean %>%
    inner_join(vp_location_mean, by = c("participant_id", "group")) %>%
    inner_join(stm_colour_by_load[[as.character(load)]], by = c("participant_id", "group")) %>%
    inner_join(stm_location_by_load[[as.character(load)]], by = c("participant_id", "group")) %>%
    inner_join(quest_selected, by = c("participant_id", "group")) %>%
    left_join(observation_list %>% select(participant_id, age), by = "participant_id")
  
  # Create binary synaesthesia variable
  merged_data_load <- merged_data_load %>%
    mutate(synaesthesia = ifelse(group == "synaesthetes", 1, 0))
  
  cat("Total participants with all measures (Load", load, "):", nrow(merged_data_load), "\n")
  cat("Synaesthetes:", sum(merged_data_load$synaesthesia == 1), "\n")
  cat("Non-synaesthetes:", sum(merged_data_load$synaesthesia == 0), "\n\n")
  
  # ===============================================================================
  # MODEL 1: WITHIN-DOMAIN - VP COLOUR → STM COLOUR
  # ===============================================================================
  
  cat("-----------------------------------------------------------------------\n")
  cat("MODEL 1 (Load", load, "): WITHIN-DOMAIN - VP COLOUR → STM COLOUR\n")
  cat("-----------------------------------------------------------------------\n\n")
  
  model1_data <- merged_data_load %>%
    exclude_high_outliers("mean_vp_colour") %>%
    exclude_high_outliers(stm_colour_var)
  
  cat("Exclusions: Before:", nrow(merged_data_load), "| After:", nrow(model1_data), 
      "| Excluded:", nrow(merged_data_load) - nrow(model1_data), "\n\n")
  
  model1_data_complete <- model1_data %>%
    filter(complete.cases(.data[[stm_colour_var]], mean_vp_colour, synaesthesia, age,
                          intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                          imagery_ability, technical_cognition,
                          word_forms, organisation, global_bias, systemising_tendency))
  
  cat("Complete cases:", nrow(model1_data_complete), "\n\n")
  
  formula1 <- as.formula(paste(stm_colour_var, "~ mean_vp_colour + synaesthesia + age +
                                intrinsic_motivation + identified_regulation + external_regulation + amotivation +
                                imagery_ability + technical_cognition +
                                word_forms + organisation + global_bias + systemising_tendency"))
  
  model1 <- lm(formula1, data = model1_data_complete)
  
  cat("Model 1 Summary:\n")
  print(summary(model1))
  cat("\n")
  
  # ===============================================================================
  # MODEL 2: WITHIN-DOMAIN - VP LOCATION → STM LOCATION
  # ===============================================================================
  
  cat("-----------------------------------------------------------------------\n")
  cat("MODEL 2 (Load", load, "): WITHIN-DOMAIN - VP LOCATION → STM LOCATION\n")
  cat("-----------------------------------------------------------------------\n\n")
  
  model2_data <- merged_data_load %>%
    exclude_high_outliers("mean_vp_location") %>%
    exclude_high_outliers(stm_location_var)
  
  cat("Exclusions: Before:", nrow(merged_data_load), "| After:", nrow(model2_data), 
      "| Excluded:", nrow(merged_data_load) - nrow(model2_data), "\n\n")
  
  model2_data_complete <- model2_data %>%
    filter(complete.cases(.data[[stm_location_var]], mean_vp_location, synaesthesia, age,
                          intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                          imagery_ability, technical_cognition,
                          word_forms, organisation, global_bias, systemising_tendency))
  
  cat("Complete cases:", nrow(model2_data_complete), "\n\n")
  
  formula2 <- as.formula(paste(stm_location_var, "~ mean_vp_location + synaesthesia + age +
                                intrinsic_motivation + identified_regulation + external_regulation + amotivation +
                                imagery_ability + technical_cognition +
                                word_forms + organisation + global_bias + systemising_tendency"))
  
  model2 <- lm(formula2, data = model2_data_complete)
  
  cat("Model 2 Summary:\n")
  print(summary(model2))
  cat("\n")
  
  # ===============================================================================
  # MODEL 3: CROSS-DOMAIN - VP COLOUR → STM LOCATION
  # ===============================================================================
  
  cat("-----------------------------------------------------------------------\n")
  cat("MODEL 3 (Load", load, "): CROSS-DOMAIN - VP COLOUR → STM LOCATION\n")
  cat("-----------------------------------------------------------------------\n\n")
  
  model3_data <- merged_data_load %>%
    exclude_high_outliers("mean_vp_colour") %>%
    exclude_high_outliers(stm_location_var)
  
  cat("Exclusions: Before:", nrow(merged_data_load), "| After:", nrow(model3_data), 
      "| Excluded:", nrow(merged_data_load) - nrow(model3_data), "\n\n")
  
  model3_data_complete <- model3_data %>%
    filter(complete.cases(.data[[stm_location_var]], mean_vp_colour, synaesthesia, age,
                          intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                          imagery_ability, technical_cognition,
                          word_forms, organisation, global_bias, systemising_tendency))
  
  cat("Complete cases:", nrow(model3_data_complete), "\n\n")
  
  formula3 <- as.formula(paste(stm_location_var, "~ mean_vp_colour + synaesthesia + age +
                                intrinsic_motivation + identified_regulation + external_regulation + amotivation +
                                imagery_ability + technical_cognition +
                                word_forms + organisation + global_bias + systemising_tendency"))
  
  model3 <- lm(formula3, data = model3_data_complete)
  
  cat("Model 3 Summary:\n")
  print(summary(model3))
  cat("\n")
  
  # ===============================================================================
  # MODEL 4: CROSS-DOMAIN - VP LOCATION → STM COLOUR
  # ===============================================================================
  
  cat("-----------------------------------------------------------------------\n")
  cat("MODEL 4 (Load", load, "): CROSS-DOMAIN - VP LOCATION → STM COLOUR\n")
  cat("-----------------------------------------------------------------------\n\n")
  
  model4_data <- merged_data_load %>%
    exclude_high_outliers("mean_vp_location") %>%
    exclude_high_outliers(stm_colour_var)
  
  cat("Exclusions: Before:", nrow(merged_data_load), "| After:", nrow(model4_data), 
      "| Excluded:", nrow(merged_data_load) - nrow(model4_data), "\n\n")
  
  model4_data_complete <- model4_data %>%
    filter(complete.cases(.data[[stm_colour_var]], mean_vp_location, synaesthesia, age,
                          intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                          imagery_ability, technical_cognition,
                          word_forms, organisation, global_bias, systemising_tendency))
  
  cat("Complete cases:", nrow(model4_data_complete), "\n\n")
  
  formula4 <- as.formula(paste(stm_colour_var, "~ mean_vp_location + synaesthesia + age +
                                intrinsic_motivation + identified_regulation + external_regulation + amotivation +
                                imagery_ability + technical_cognition +
                                word_forms + organisation + global_bias + systemising_tendency"))
  
  model4 <- lm(formula4, data = model4_data_complete)
  
  cat("Model 4 Summary:\n")
  print(summary(model4))
  cat("\n")
  
  # ===============================================================================
  # STORE RESULTS FOR THIS LOAD
  # ===============================================================================
  
  all_model_results[[as.character(load)]] <- list(
    model1 = model1,
    model2 = model2,
    model3 = model3,
    model4 = model4,
    n1 = nrow(model1_data_complete),
    n2 = nrow(model2_data_complete),
    n3 = nrow(model3_data_complete),
    n4 = nrow(model4_data_complete)
  )
}

# ===============================================================================
# SUMMARY TABLE ACROSS ALL LOADS
# ===============================================================================

cat("\n\n=======================================================================\n")
cat("SUMMARY TABLE: VP PREDICTOR EFFECTS ACROSS ALL LOADS\n")
cat("=======================================================================\n\n")

# Function to extract key stats
extract_stats <- function(model, predictor) {
  coefs <- summary(model)$coefficients
  if (predictor %in% rownames(coefs)) {
    return(c(
      B = round(coefs[predictor, "Estimate"], 3),
      SE = round(coefs[predictor, "Std. Error"], 3),
      t = round(coefs[predictor, "t value"], 3),
      p = coefs[predictor, "Pr(>|t|)"]
    ))
  } else {
    return(c(B = NA, SE = NA, t = NA, p = NA))
  }
}

# Create comprehensive summary table
summary_data <- data.frame()

for (load in load_values) {
  results <- all_model_results[[as.character(load)]]
  
  # Model 1: VP Colour → STM Colour
  stats1 <- extract_stats(results$model1, "mean_vp_colour")
  summary_data <- rbind(summary_data, data.frame(
    Load = load,
    Model = "VP Col → STM Col",
    Predictor = "VP Colour",
    B = stats1["B"],
    SE = stats1["SE"],
    t = stats1["t"],
    p = stats1["p"],
    N = results$n1,
    R2 = round(summary(results$model1)$r.squared, 3)
  ))
  
  # Model 2: VP Location → STM Location
  stats2 <- extract_stats(results$model2, "mean_vp_location")
  summary_data <- rbind(summary_data, data.frame(
    Load = load,
    Model = "VP Loc → STM Loc",
    Predictor = "VP Location",
    B = stats2["B"],
    SE = stats2["SE"],
    t = stats2["t"],
    p = stats2["p"],
    N = results$n2,
    R2 = round(summary(results$model2)$r.squared, 3)
  ))
  
  # Model 3: VP Colour → STM Location
  stats3 <- extract_stats(results$model3, "mean_vp_colour")
  summary_data <- rbind(summary_data, data.frame(
    Load = load,
    Model = "VP Col → STM Loc",
    Predictor = "VP Colour",
    B = stats3["B"],
    SE = stats3["SE"],
    t = stats3["t"],
    p = stats3["p"],
    N = results$n3,
    R2 = round(summary(results$model3)$r.squared, 3)
  ))
  
  # Model 4: VP Location → STM Colour
  stats4 <- extract_stats(results$model4, "mean_vp_location")
  summary_data <- rbind(summary_data, data.frame(
    Load = load,
    Model = "VP Loc → STM Col",
    Predictor = "VP Location",
    B = stats4["B"],
    SE = stats4["SE"],
    t = stats4["t"],
    p = stats4["p"],
    N = results$n4,
    R2 = round(summary(results$model4)$r.squared, 3)
  ))
}

print(summary_data)

# ===============================================================================
# SYNAESTHESIA EFFECTS ACROSS ALL LOADS
# ===============================================================================

cat("\n\n=======================================================================\n")
cat("SUMMARY TABLE: SYNAESTHESIA EFFECTS ACROSS ALL LOADS\n")
cat("=======================================================================\n\n")

syn_summary_data <- data.frame()

for (load in load_values) {
  results <- all_model_results[[as.character(load)]]
  
  for (model_num in 1:4) {
    model <- results[[paste0("model", model_num)]]
    model_name <- c("VP Col → STM Col", "VP Loc → STM Loc", 
                    "VP Col → STM Loc", "VP Loc → STM Col")[model_num]
    
    stats_syn <- extract_stats(model, "synaesthesia")
    syn_summary_data <- rbind(syn_summary_data, data.frame(
      Load = load,
      Model = model_name,
      B = stats_syn["B"],
      SE = stats_syn["SE"],
      t = stats_syn["t"],
      p = stats_syn["p"]
    ))
  }
}

print(syn_summary_data)

# ===============================================================================
# MOTIVATION SUBSCALE EFFECTS ACROSS ALL LOADS
# ===============================================================================

cat("\n\n=======================================================================\n")
cat("SUMMARY TABLE: MOTIVATION SUBSCALE EFFECTS ACROSS ALL LOADS\n")
cat("=======================================================================\n\n")

motivation_vars <- c("intrinsic_motivation", "identified_regulation", 
                     "external_regulation", "amotivation")
motivation_labels <- c("Intrinsic Motivation", "Identified Regulation", 
                       "External Regulation", "Amotivation")

for (i in 1:length(motivation_vars)) {
  cat("\n-----------------------------------------------------------------------\n")
  cat(motivation_labels[i], "\n")
  cat("-----------------------------------------------------------------------\n\n")
  
  motivation_summary <- data.frame()
  
  for (load in load_values) {
    results <- all_model_results[[as.character(load)]]
    
    for (model_num in 1:4) {
      model <- results[[paste0("model", model_num)]]
      model_name <- c("VP Col → STM Col", "VP Loc → STM Loc", 
                      "VP Col → STM Loc", "VP Loc → STM Col")[model_num]
      
      stats_mot <- extract_stats(model, motivation_vars[i])
      motivation_summary <- rbind(motivation_summary, data.frame(
        Load = load,
        Model = model_name,
        B = stats_mot["B"],
        SE = stats_mot["SE"],
        t = stats_mot["t"],
        p = stats_mot["p"]
      ))
    }
  }
  
  print(motivation_summary)
}

cat("\n=== Analysis Complete ===\n")
