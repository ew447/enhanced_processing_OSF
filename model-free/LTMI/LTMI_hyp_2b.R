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

# Load the LTMI data
controls_ltmi <- read.csv("<PATH_TO_DATA>/Controls/LTMI.csv")
controls_ltmi <- filter_exclusions(controls_ltmi)

rels_ltmi <- read.csv("<PATH_TO_DATA>/Relatives/LTMI.csv")
rels_ltmi <- filter_exclusions(rels_ltmi)

syn_ltmi <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")
syn_ltmi <- filter_exclusions(syn_ltmi)

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

controls_vp <- controls_vp %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_vp <- rels_vp %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_vp <- syn_vp %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_ltmi <- controls_ltmi %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmi <- rels_ltmi %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmi <- syn_ltmi %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_quest <- controls_quest %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_quest <- rels_quest %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_quest <- syn_quest %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

observation_list <- observation_list %>% mutate(participant_id = as.character(participant_id))

vp_data <- bind_rows(controls_vp, rels_vp, syn_vp)
ltmi_data <- bind_rows(controls_ltmi, rels_ltmi, syn_ltmi)
quest_data <- bind_rows(controls_quest, rels_quest, syn_quest)

# ===============================================================================
# CALCULATE MEAN SCORES
# ===============================================================================

# VP means (no repetition structure)
vp_colour_mean <- vp_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

vp_location_mean <- vp_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMI rep-4 means --- for exclusion decisions only
ltmi_colour_mean_rep4 <- ltmi_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

ltmi_location_mean_rep4 <- ltmi_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMI reps 1-4 means --- actual DVs
ltmi_colour_mean <- ltmi_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

ltmi_location_mean <- ltmi_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# ===============================================================================
# SELECT QUESTIONNAIRE VARIABLES WITH FALLBACK LOGIC FOR MOTIVATION SUBSCALES
# ===============================================================================

quest_selected <- quest_data %>%
  select(participant_id, group,
         LTMI_intrinsic_motivation,
         LTMI_identified_regulation,
         LTMI_external_regulation,
         LTMI_amotivation,
         STM_intrinsic_motivation,
         STM_identified_regulation,
         STM_external_regulation,
         STM_amotivation,
         LTMD_VP_intrinsic_motivation,
         LTMD_VP_identified_regulation,
         LTMD_VP_external_regulation,
         LTMD_VP_amotivation,
         imagery_ability,
         technical_cognition,
         word_forms,
         organisation,
         global_bias,
         systemising_tendency) %>%
  rowwise() %>%
  mutate(
    mean_intrinsic_motivation = mean(c(STM_intrinsic_motivation, LTMD_VP_intrinsic_motivation), na.rm = TRUE),
    mean_identified_regulation = mean(c(STM_identified_regulation, LTMD_VP_identified_regulation), na.rm = TRUE),
    mean_external_regulation = mean(c(STM_external_regulation, LTMD_VP_external_regulation), na.rm = TRUE),
    mean_amotivation = mean(c(STM_amotivation, LTMD_VP_amotivation), na.rm = TRUE),
    intrinsic_motivation = coalesce(LTMI_intrinsic_motivation, mean_intrinsic_motivation),
    identified_regulation = coalesce(LTMI_identified_regulation, mean_identified_regulation),
    external_regulation = coalesce(LTMI_external_regulation, mean_external_regulation),
    amotivation = coalesce(LTMI_amotivation, mean_amotivation)
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
# MERGE ALL DATA
# ===============================================================================

# Base merge using rep-4 LTMI for outlier exclusion reference,
# but we will apply DVs from reps 1-4 after exclusions are determined

merged_data <- vp_colour_mean %>%
  inner_join(vp_location_mean, by = c("participant_id", "group")) %>%
  inner_join(ltmi_colour_mean_rep4, by = c("participant_id", "group")) %>%
  inner_join(ltmi_location_mean_rep4, by = c("participant_id", "group")) %>%
  inner_join(quest_selected, by = c("participant_id", "group")) %>%
  left_join(observation_list %>% select(participant_id, age), by = "participant_id") %>%
  mutate(synaesthesia = ifelse(group == "synaesthetes", 1, 0))

# Also prepare a version with reps 1-4 LTMI DVs (same participants, different LTMI values)
ltmi_allreps <- ltmi_colour_mean %>%
  inner_join(ltmi_location_mean, by = c("participant_id", "group"))

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

# Helper: swap rep-4 LTMI values for reps 1-4 values after exclusions
apply_allreps_ltmi <- function(data) {
  data %>%
    select(-mean_ltmi_colour, -mean_ltmi_location) %>%
    inner_join(ltmi_allreps, by = c("participant_id", "group"))
}

# ===============================================================================
# MODEL 1: WITHIN-DOMAIN - VP COLOUR → LTMI COLOUR
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 1: WITHIN-DOMAIN - VP COLOUR → LTMI COLOUR\n")
cat("=======================================================================\n\n")

model1_data <- merged_data %>%
  exclude_high_outliers("mean_vp_colour") %>%
  exclude_high_outliers("mean_ltmi_colour") %>%
  apply_allreps_ltmi()

cat("Exclusions for Model 1:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model1_data), "| Excluded:", nrow(merged_data) - nrow(model1_data), "\n\n")

model1_data_complete <- model1_data %>%
  filter(complete.cases(mean_ltmi_colour, mean_vp_colour, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency))

cat("Complete cases for Model 1:", nrow(model1_data_complete), "\n\n")

model1 <- lm(mean_ltmi_colour ~ mean_vp_colour + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency,
             data = model1_data_complete)

cat("Model 1 Summary:\n")
print(summary(model1))
cat("\n")

# ===============================================================================
# MODEL 2: WITHIN-DOMAIN - VP LOCATION → LTMI LOCATION
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 2: WITHIN-DOMAIN - VP LOCATION → LTMI LOCATION\n")
cat("=======================================================================\n\n")

model2_data <- merged_data %>%
  exclude_high_outliers("mean_vp_location") %>%
  exclude_high_outliers("mean_ltmi_location") %>%
  apply_allreps_ltmi()

cat("Exclusions for Model 2:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model2_data), "| Excluded:", nrow(merged_data) - nrow(model2_data), "\n\n")

model2_data_complete <- model2_data %>%
  filter(complete.cases(mean_ltmi_location, mean_vp_location, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency))

cat("Complete cases for Model 2:", nrow(model2_data_complete), "\n\n")

model2 <- lm(mean_ltmi_location ~ mean_vp_location + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency,
             data = model2_data_complete)

cat("Model 2 Summary:\n")
print(summary(model2))
cat("\n")

# ===============================================================================
# MODEL 3: CROSS-DOMAIN - VP COLOUR → LTMI LOCATION
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 3: CROSS-DOMAIN - VP COLOUR → LTMI LOCATION\n")
cat("=======================================================================\n\n")

model3_data <- merged_data %>%
  exclude_high_outliers("mean_vp_colour") %>%
  exclude_high_outliers("mean_ltmi_location") %>%
  apply_allreps_ltmi()

cat("Exclusions for Model 3:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model3_data), "| Excluded:", nrow(merged_data) - nrow(model3_data), "\n\n")

model3_data_complete <- model3_data %>%
  filter(complete.cases(mean_ltmi_location, mean_vp_colour, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency))

cat("Complete cases for Model 3:", nrow(model3_data_complete), "\n\n")

model3 <- lm(mean_ltmi_location ~ mean_vp_colour + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency,
             data = model3_data_complete)

cat("Model 3 Summary:\n")
print(summary(model3))
cat("\n")

# ===============================================================================
# MODEL 4: CROSS-DOMAIN - VP LOCATION → LTMI COLOUR
# ===============================================================================

cat("=======================================================================\n")
cat("MODEL 4: CROSS-DOMAIN - VP LOCATION → LTMI COLOUR\n")
cat("=======================================================================\n\n")

model4_data <- merged_data %>%
  exclude_high_outliers("mean_vp_location") %>%
  exclude_high_outliers("mean_ltmi_colour") %>%
  apply_allreps_ltmi()

cat("Exclusions for Model 4:\n")
cat("Before:", nrow(merged_data), "| After:", nrow(model4_data), "| Excluded:", nrow(merged_data) - nrow(model4_data), "\n\n")

model4_data_complete <- model4_data %>%
  filter(complete.cases(mean_ltmi_colour, mean_vp_location, synaesthesia, age,
                        intrinsic_motivation, identified_regulation, external_regulation, amotivation,
                        imagery_ability, technical_cognition,
                        word_forms, organisation, global_bias, systemising_tendency))

cat("Complete cases for Model 4:", nrow(model4_data_complete), "\n\n")

model4 <- lm(mean_ltmi_colour ~ mean_vp_location + synaesthesia + age +
               intrinsic_motivation + identified_regulation + external_regulation + amotivation +
               imagery_ability + technical_cognition +
               word_forms + organisation + global_bias + systemising_tendency,
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

cat("VP Predictor Effects:\n")
vp_summary <- data.frame(
  Model = c("Model 1 (VP Col -> LTMI Col)",
            "Model 2 (VP Loc -> LTMI Loc)",
            "Model 3 (VP Col -> LTMI Loc)",
            "Model 4 (VP Loc -> LTMI Col)"),
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
  Model = c("Model 1 (VP Col -> LTMI Col)",
            "Model 2 (VP Loc -> LTMI Loc)",
            "Model 3 (VP Col -> LTMI Loc)",
            "Model 4 (VP Loc -> LTMI Col)"),
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
    Model = c("Model 1 (VP Col -> LTMI Col)",
              "Model 2 (VP Loc -> LTMI Loc)",
              "Model 3 (VP Col -> LTMI Loc)",
              "Model 4 (VP Loc -> LTMI Col)"),
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
