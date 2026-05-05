# Load the necessary libraries
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

# Load the LTMD data
controls_ltmd <- read.csv("<PATH_TO_DATA>/Controls/LTMD.csv")
controls_ltmd <- filter_exclusions(controls_ltmd)

rels_ltmd <- read.csv("<PATH_TO_DATA>/Relatives/LTMD.csv")
rels_ltmd <- filter_exclusions(rels_ltmd)

syn_ltmd <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMD.csv")
syn_ltmd <- filter_exclusions(syn_ltmd)

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

controls_ltmd <- controls_ltmd %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmd <- rels_ltmd %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmd <- syn_ltmd %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_quest <- controls_quest %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_quest <- rels_quest %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_quest <- syn_quest %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

observation_list <- observation_list %>% mutate(participant_id = as.character(participant_id))

# Combine the data
vp_data <- bind_rows(controls_vp, rels_vp, syn_vp)
ltmd_data <- bind_rows(controls_ltmd, rels_ltmd, syn_ltmd)
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

# LTMD Colour means 
ltmd_colour_mean <- ltmd_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMD Location means 
ltmd_location_mean <- ltmd_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# ===============================================================================
# SELECT QUESTIONNAIRE VARIABLES WITH FALLBACK LOGIC FOR MOTIVATION SUBSCALES
# ===============================================================================

quest_selected <- quest_data %>%
  select(participant_id, group,
         # LTMD_VP motivation subscales
         LTMD_VP_intrinsic_motivation,
         LTMD_VP_identified_regulation,
         LTMD_VP_external_regulation,
         LTMD_VP_amotivation,
         # STM motivation subscales (for averaging)
         STM_intrinsic_motivation,
         STM_identified_regulation,
         STM_external_regulation,
         STM_amotivation,
         # LTMI motivation subscales (for averaging)
         LTMI_intrinsic_motivation,
         LTMI_identified_regulation,
         LTMI_external_regulation,
         LTMI_amotivation,
         # Other questionnaire variables
         imagery_ability,
         technical_cognition,
         word_forms,
         organisation,
         global_bias,
         systemising_tendency,
         ltmi_ltmd_gap_hours) %>%
  rowwise() %>%
  mutate(
    # Calculate mean motivation subscales from STM and LTMI sessions
    mean_intrinsic_motivation = mean(c(STM_intrinsic_motivation, LTMI_intrinsic_motivation), na.rm = TRUE),
    mean_identified_regulation = mean(c(STM_identified_regulation, LTMI_identified_regulation), na.rm = TRUE),
    mean_external_regulation = mean(c(STM_external_regulation, LTMI_external_regulation), na.rm = TRUE),
    mean_amotivation = mean(c(STM_amotivation, LTMI_amotivation), na.rm = TRUE),
    
    # Create fallback: use LTMD_VP subscales if available, otherwise use mean from other sessions
    intrinsic_motivation = coalesce(LTMD_VP_intrinsic_motivation, mean_intrinsic_motivation),
    identified_regulation = coalesce(LTMD_VP_identified_regulation, mean_identified_regulation),
    external_regulation = coalesce(LTMD_VP_external_regulation, mean_external_regulation),
    amotivation = coalesce(LTMD_VP_amotivation, mean_amotivation)
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
         systemising_tendency,
         ltmi_ltmd_gap_hours)

# ===============================================================================
# MERGE ALL DATA
# ===============================================================================

# Merge VP measures
merged_data <- vp_colour_mean %>%
  inner_join(vp_location_mean, by = c("participant_id", "group")) %>%
  inner_join(ltmd_colour_mean, by = c("participant_id", "group")) %>%
  inner_join(ltmd_location_mean, by = c("participant_id", "group")) %>%
  inner_join(quest_selected, by = c("participant_id", "group")) %>%
  left_join(observation_list %>% select(participant_id, age), by = "participant_id")

# Create binary synaesthesia variable (1 = synaesthete, 0 = control/relative)
merged_data <- merged_data %>%
  mutate(synaesthesia = ifelse(group == "synaesthetes", 1, 0))

cat("Total participants with all measures:", nrow(merged_data), "\n")
cat("Synaesthetes:", sum(merged_data$synaesthesia == 1), "\n")
cat("Non-synaesthetes (controls + relatives):", sum(merged_data$synaesthesia == 0), "\n\n")

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
# MODEL 1: WITHIN-DOMAIN - VP COLOUR → LTMD COLOUR
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 1: WITHIN-DOMAIN - VP COLOUR → LTMD COLOUR\n")
cat("=======================================================================\n\n")

# Exclude outliers on both VP colour and LTMD colour
model1_data <- merged_data %>%
  exclude_high_outliers("mean_vp_colour") %>%
  exclude_high_outliers("mean_ltmd_colour")

# Track exclusions
cat("Exclusions for Model 1:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model1_data), "| Excluded:", nrow(merged_data) - nrow(model1_data), "\n\n")

# Remove any rows with missing values in predictors
model1_data_complete <- model1_data %>%
  filter(complete.cases(mean_ltmd_colour, mean_vp_colour, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency, ltmi_ltmd_gap_hours))

cat("Complete cases for Model 1:", nrow(model1_data_complete), "\n\n")

# Run regression
model1 <- lm(mean_ltmd_colour ~ mean_vp_colour + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency + ltmi_ltmd_gap_hours,
             data = model1_data_complete)

cat("Model 1 Summary:\n")
print(summary(model1))
cat("\n")

# ===============================================================================
# MODEL 2: WITHIN-DOMAIN - VP LOCATION → LTMD LOCATION
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 2: WITHIN-DOMAIN - VP LOCATION → LTMD LOCATION\n")
cat("=======================================================================\n\n")

# Exclude outliers on both VP location and LTMD location
model2_data <- merged_data %>%
  exclude_high_outliers("mean_vp_location") %>%
  exclude_high_outliers("mean_ltmd_location")

# Track exclusions
cat("Exclusions for Model 2:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model2_data), "| Excluded:", nrow(merged_data) - nrow(model2_data), "\n\n")

# Remove any rows with missing values in predictors
model2_data_complete <- model2_data %>%
  filter(complete.cases(mean_ltmd_location, mean_vp_location, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency, ltmi_ltmd_gap_hours))

cat("Complete cases for Model 2:", nrow(model2_data_complete), "\n\n")

# Run regression
model2 <- lm(mean_ltmd_location ~ mean_vp_location + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency + ltmi_ltmd_gap_hours,
             data = model2_data_complete)

cat("Model 2 Summary:\n")
print(summary(model2))
cat("\n")

# ===============================================================================
# MODEL 3: CROSS-DOMAIN - VP COLOUR → LTMD LOCATION
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 3: CROSS-DOMAIN - VP COLOUR → LTMD LOCATION\n")
cat("=======================================================================\n\n")

# Exclude outliers on both VP colour and LTMD location
model3_data <- merged_data %>%
  exclude_high_outliers("mean_vp_colour") %>%
  exclude_high_outliers("mean_ltmd_location")

# Track exclusions
cat("Exclusions for Model 3:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model3_data), "| Excluded:", nrow(merged_data) - nrow(model3_data), "\n\n")

# Remove any rows with missing values in predictors
model3_data_complete <- model3_data %>%
  filter(complete.cases(mean_ltmd_location, mean_vp_colour, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency, ltmi_ltmd_gap_hours))

cat("Complete cases for Model 3:", nrow(model3_data_complete), "\n\n")

# Run regression
model3 <- lm(mean_ltmd_location ~ mean_vp_colour + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency + ltmi_ltmd_gap_hours,
             data = model3_data_complete)

cat("Model 3 Summary:\n")
print(summary(model3))
cat("\n")

# ===============================================================================
# MODEL 4: CROSS-DOMAIN - VP LOCATION → LTMD COLOUR
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 4: CROSS-DOMAIN - VP LOCATION → LTMD COLOUR\n")
cat("=======================================================================\n\n")

# Exclude outliers on both VP location and LTMD colour
model4_data <- merged_data %>%
  exclude_high_outliers("mean_vp_location") %>%
  exclude_high_outliers("mean_ltmd_colour")

# Track exclusions
cat("Exclusions for Model 4:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model4_data), "| Excluded:", nrow(merged_data) - nrow(model4_data), "\n\n")

# Remove any rows with missing values in predictors
model4_data_complete <- model4_data %>%
  filter(complete.cases(mean_ltmd_colour, mean_vp_location, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency, ltmi_ltmd_gap_hours))

cat("Complete cases for Model 4:", nrow(model4_data_complete), "\n\n")

# Run regression
model4 <- lm(mean_ltmd_colour ~ mean_vp_location + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency + ltmi_ltmd_gap_hours,
             data = model4_data_complete)

cat("Model 4 Summary:\n")
print(summary(model4))
cat("\n")

# ===============================================================================
# SUMMARY TABLE OF ALL MODELS
# ===============================================================================

cat("=======================================================================\n")
cat("SUMMARY TABLE: KEY PREDICTORS ACROSS ALL MODELS\n")
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

# Create summary for VP predictor and synaesthesia across models
cat("VP Predictor Effects:\n")
vp_summary <- data.frame(
  Model = c("Model 1 (VP Col → LTMD Col)", 
            "Model 2 (VP Loc → LTMD Loc)", 
            "Model 3 (VP Col → LTMD Loc)", 
            "Model 4 (VP Loc → LTMD Col)"),
  VP_Predictor = c("mean_vp_colour", "mean_vp_location", "mean_vp_colour", "mean_vp_location"),
  B = c(extract_stats(model1, "mean_vp_colour")["B"],
        extract_stats(model2, "mean_vp_location")["B"],
        extract_stats(model3, "mean_vp_colour")["B"],
        extract_stats(model4, "mean_vp_location")["B"]),
  SE = c(extract_stats(model1, "mean_vp_colour")["SE"],
         extract_stats(model2, "mean_vp_location")["SE"],
         extract_stats(model3, "mean_vp_colour")["SE"],
         extract_stats(model4, "mean_vp_location")["SE"]),
  t = c(extract_stats(model1, "mean_vp_colour")["t"],
        extract_stats(model2, "mean_vp_location")["t"],
        extract_stats(model3, "mean_vp_colour")["t"],
        extract_stats(model4, "mean_vp_location")["t"]),
  p = c(extract_stats(model1, "mean_vp_colour")["p"],
        extract_stats(model2, "mean_vp_location")["p"],
        extract_stats(model3, "mean_vp_colour")["p"],
        extract_stats(model4, "mean_vp_location")["p"])
)
print(vp_summary)
cat("\n")

cat("Synaesthesia Effects:\n")
syn_summary <- data.frame(
  Model = c("Model 1 (VP Col → LTMD Col)", 
            "Model 2 (VP Loc → LTMD Loc)", 
            "Model 3 (VP Col → LTMD Loc)", 
            "Model 4 (VP Loc → LTMD Col)"),
  B = c(extract_stats(model1, "synaesthesia")["B"],
        extract_stats(model2, "synaesthesia")["B"],
        extract_stats(model3, "synaesthesia")["B"],
        extract_stats(model4, "synaesthesia")["B"]),
  SE = c(extract_stats(model1, "synaesthesia")["SE"],
         extract_stats(model2, "synaesthesia")["SE"],
         extract_stats(model3, "synaesthesia")["SE"],
         extract_stats(model4, "synaesthesia")["SE"]),
  t = c(extract_stats(model1, "synaesthesia")["t"],
        extract_stats(model2, "synaesthesia")["t"],
        extract_stats(model3, "synaesthesia")["t"],
        extract_stats(model4, "synaesthesia")["t"]),
  p = c(extract_stats(model1, "synaesthesia")["p"],
        extract_stats(model2, "synaesthesia")["p"],
        extract_stats(model3, "synaesthesia")["p"],
        extract_stats(model4, "synaesthesia")["p"])
)
print(syn_summary)
cat("\n")

# Print R-squared for each model
cat("Model Fit (R-squared):\n")
r2_summary <- data.frame(
  Model = c("Model 1", "Model 2", "Model 3", "Model 4"),
  R_squared = c(round(summary(model1)$r.squared, 3),
                round(summary(model2)$r.squared, 3),
                round(summary(model3)$r.squared, 3),
                round(summary(model4)$r.squared, 3)),
  Adj_R_squared = c(round(summary(model1)$adj.r.squared, 3),
                    round(summary(model2)$adj.r.squared, 3),
                    round(summary(model3)$adj.r.squared, 3),
                    round(summary(model4)$adj.r.squared, 3)),
  N = c(nrow(model1_data_complete),
        nrow(model2_data_complete),
        nrow(model3_data_complete),
        nrow(model4_data_complete))
)
print(r2_summary)

# ===============================================================================
# MOTIVATION SUBSCALE EFFECTS ACROSS ALL MODELS
# ===============================================================================

cat("\n\n=======================================================================\n")
cat("SUMMARY TABLE: MOTIVATION SUBSCALE EFFECTS ACROSS ALL MODELS\n")
cat("=======================================================================\n\n")

motivation_vars <- c("intrinsic_motivation", "identified_regulation", 
                     "external_regulation", "amotivation")
motivation_labels <- c("Intrinsic Motivation", "Identified Regulation", 
                       "External Regulation", "Amotivation")

for (i in 1:length(motivation_vars)) {
  cat("-----------------------------------------------------------------------\n")
  cat(motivation_labels[i], "\n")
  cat("-----------------------------------------------------------------------\n")
  
  motivation_summary <- data.frame(
    Model = c("Model 1 (VP Col → LTMD Col)", 
              "Model 2 (VP Loc → LTMD Loc)", 
              "Model 3 (VP Col → LTMD Loc)", 
              "Model 4 (VP Loc → LTMD Col)"),
    B = c(extract_stats(model1, motivation_vars[i])["B"],
          extract_stats(model2, motivation_vars[i])["B"],
          extract_stats(model3, motivation_vars[i])["B"],
          extract_stats(model4, motivation_vars[i])["B"]),
    SE = c(extract_stats(model1, motivation_vars[i])["SE"],
           extract_stats(model2, motivation_vars[i])["SE"],
           extract_stats(model3, motivation_vars[i])["SE"],
           extract_stats(model4, motivation_vars[i])["SE"]),
    t = c(extract_stats(model1, motivation_vars[i])["t"],
          extract_stats(model2, motivation_vars[i])["t"],
          extract_stats(model3, motivation_vars[i])["t"],
          extract_stats(model4, motivation_vars[i])["t"]),
    p = c(extract_stats(model1, motivation_vars[i])["p"],
          extract_stats(model2, motivation_vars[i])["p"],
          extract_stats(model3, motivation_vars[i])["p"],
          extract_stats(model4, motivation_vars[i])["p"])
  )
  print(motivation_summary)
  cat("\n")
}

cat("=== Analysis Complete ===\n")
