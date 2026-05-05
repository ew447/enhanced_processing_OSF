library(dplyr)
library(readxl)
library(ggplot2)
library(janitor)
library(tidyr)
library(broom)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# --- Load Bayes-factor function (Dienes, 2019) ---
source("<PATH_TO_REPO>/Bayesian/bayes_factor_function.R")

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

# Load the LTMI data
controls_ltmi <- read.csv("<PATH_TO_DATA>/Controls/LTMI.csv")
controls_ltmi <- filter_exclusions(controls_ltmi)

rels_ltmi <- read.csv("<PATH_TO_DATA>/Relatives/LTMI.csv")
rels_ltmi <- filter_exclusions(rels_ltmi)

syn_ltmi <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")
syn_ltmi <- filter_exclusions(syn_ltmi)

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

controls_stm <- controls_stm %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_stm <- rels_stm %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_stm <- syn_stm %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_ltmi <- controls_ltmi %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmi <- rels_ltmi %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmi <- syn_ltmi %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_ltmd <- controls_ltmd %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmd <- rels_ltmd %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmd <- syn_ltmd %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_quest <- controls_quest %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_quest <- rels_quest %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_quest <- syn_quest %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

observation_list <- observation_list %>% mutate(participant_id = as.character(participant_id))

# Combine the data
vp_data <- bind_rows(controls_vp, rels_vp, syn_vp)
stm_data <- bind_rows(controls_stm, rels_stm, syn_stm)
ltmi_data <- bind_rows(controls_ltmi, rels_ltmi, syn_ltmi)
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

# Get load values
load_values <- sort(unique(stm_data$load_n))

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

# LTMI Colour means (average across ALL repetitions 1-4)
ltmi_colour_mean <- ltmi_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMI Location means (average across ALL repetitions 1-4)
ltmi_location_mean <- ltmi_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMI Colour means for outlier detection only (repetition 4 only)
ltmi_colour_rep4 <- ltmi_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_colour_rep4 = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMI Location means for outlier detection only (repetition 4 only)
ltmi_location_rep4 <- ltmi_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_location_rep4 = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMD Colour means 
ltmd_colour_mean <- ltmd_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMD Location means 
ltmd_location_mean <- ltmd_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

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
# APPLY OUTLIER EXCLUSION
# ===============================================================================

vp_colour_mean_clean   <- exclude_high_outliers(vp_colour_mean, "mean_vp_colour")
vp_location_mean_clean <- exclude_high_outliers(vp_location_mean, "mean_vp_location")

stm_colour_by_load_clean <- list()
stm_location_by_load_clean <- list()

for (load in load_values) {
  stm_colour_by_load_clean[[as.character(load)]] <- exclude_high_outliers(stm_colour_by_load[[as.character(load)]],
                                                                          paste0("mean_stm_colour_load", load))
  stm_location_by_load_clean[[as.character(load)]] <- exclude_high_outliers(stm_location_by_load[[as.character(load)]],
                                                                            paste0("mean_stm_location_load", load))
}

# LTMI: identify outliers based on repetition 4 scores only,
# then apply those exclusions to the all-repetition means
ltmi_colour_rep4_clean   <- exclude_high_outliers(ltmi_colour_rep4, "mean_ltmi_colour_rep4")
ltmi_location_rep4_clean <- exclude_high_outliers(ltmi_location_rep4, "mean_ltmi_location_rep4")

ltmi_colour_mean_clean <- ltmi_colour_mean %>%
  semi_join(ltmi_colour_rep4_clean, by = c("participant_id", "group"))

ltmi_location_mean_clean <- ltmi_location_mean %>%
  semi_join(ltmi_location_rep4_clean, by = c("participant_id", "group"))

ltmd_colour_mean_clean <- exclude_high_outliers(ltmd_colour_mean, "mean_ltmd_colour")
ltmd_location_mean_clean <- exclude_high_outliers(ltmd_location_mean, "mean_ltmd_location")

# ===============================================================================
# FUNCTIONS FOR BF AND REGRESSION EXTRACTION
# ===============================================================================

compute_ratio <- function(data, y, x) {
  yr <- max(data[[y]], na.rm = TRUE) - min(data[[y]], na.rm = TRUE)
  xr <- max(data[[x]], na.rm = TRUE) - min(data[[x]], na.rm = TRUE)
  yr / xr
}

bf_slope <- function(model, pred, ratio) {
  est <- coef(model)[pred]
  se  <- summary(model)$coefficients[pred, 2]
  Bf(sd = se, obtained = est, likelihood = "normal",
     modeoftheory = 0, scaleoftheory = ratio,
     modeloftheory = "normal", tail = 1) |> as.numeric()
}

interpret_bf <- function(bf_value) {
  bf_num <- as.numeric(bf_value)
  
  dplyr::case_when(
    is.na(bf_num) ~ "",
    bf_num >= 100 ~ "Decisive (effect)",
    bf_num >= 30  ~ "Very strong (effect)",
    bf_num >= 10  ~ "Strong (effect)",
    bf_num >= 6   ~ "Substantial (effect)",
    bf_num > 0.167 ~ "Inconclusive",
    bf_num >= 0.10  ~ "Substantial (null)",
    bf_num >= 0.033 ~ "Strong (null)",
    bf_num >= 0.01  ~ "Very strong (null)",
    TRUE ~ "Decisive (null)"
  )
}

# Updated covariates list with four motivation subscales
covariates <- c("synaesthesia", "age", 
                "intrinsic_motivation", "identified_regulation", 
                "external_regulation", "amotivation",
                "imagery_ability", "technical_cognition", "word_forms",
                "organisation", "global_bias", "systemising_tendency")

fit_with_covariate <- function(data, outcome, vp_pred, covar, model_label) {
  vars <- c(outcome, vp_pred, covar)
  d <- data |> select(all_of(vars)) |> drop_na()
  ratio <- compute_ratio(d, outcome, vp_pred)
  fml <- as.formula(paste(outcome, "~", vp_pred, "+", covar))
  m <- lm(fml, data = d)
  
  broom::tidy(m) |>
    mutate(Model = model_label,
           BF = ifelse(term == vp_pred,
                       bf_slope(m, vp_pred, ratio),
                       NA_real_)) |>
    select(Model, Predictor = term,
           `B (slope)` = estimate,
           SE = std.error, t = statistic, p.value, BF)
}

# ===============================================================================
# FUNCTION TO RUN ALL 4 REGRESSION COMBINATIONS (WITHIN + CROSS DOMAIN)
# ===============================================================================

run_all_domain_combinations <- function(merged_data, 
                                        outcome_colour, outcome_location,
                                        vp_colour_var = "mean_vp_colour", 
                                        vp_location_var = "mean_vp_location",
                                        covariates_list,
                                        model_prefix) {
  
  # 1. VP colour → Memory colour (within-domain)
  lm_col_col <- lm(as.formula(paste(outcome_colour, "~", vp_colour_var)), data = merged_data)
  ratio_col_col <- compute_ratio(merged_data, outcome_colour, vp_colour_var)
  BF_col_col <- bf_slope(lm_col_col, vp_colour_var, ratio_col_col)
  
  raw_col_col <- tibble(
    Model = paste(model_prefix, "colour → colour"),
    Predictor = "VP Colour",
    `B (slope)` = round(coef(lm_col_col)[vp_colour_var], 2),
    SE = round(summary(lm_col_col)$coefficients[vp_colour_var, 2], 2),
    t = round(summary(lm_col_col)$coefficients[vp_colour_var, 3], 2),
    p = ifelse(summary(lm_col_col)$coefficients[vp_colour_var, 4] < 0.001,
               "<.001",
               sprintf("%.3f", summary(lm_col_col)$coefficients[vp_colour_var, 4])),
    BF = formatC(BF_col_col, format = "e", digits = 2),
    Interpretation = interpret_bf(BF_col_col)
  )
  
  results_col_col <- bind_rows(lapply(covariates_list, function(cov) {
    fit_with_covariate(merged_data, outcome_colour, vp_colour_var, cov,
                       paste(model_prefix, "colour → colour"))
  }))
  
  extended_col_col <- results_col_col |>
    filter(Predictor != "(Intercept)") |>
    mutate(Predictor = dplyr::recode(Predictor,
                                     "mean_vp_colour" = "VP Colour",
                                     "mean_vp_location" = "VP Location",
                                     "synaesthesia" = "Synaesthesia",
                                     "age" = "Age",
                                     "intrinsic_motivation" = "Intrinsic Motivation",
                                     "identified_regulation" = "Identified Regulation",
                                     "external_regulation" = "External Regulation",
                                     "amotivation" = "Amotivation",
                                     "imagery_ability" = "Imagery Ability",
                                     "technical_cognition" = "Technical Cognition",
                                     "word_forms" = "Word Forms",
                                     "organisation" = "Organisation",
                                     "global_bias" = "Global Bias",
                                     "systemising_tendency" = "Systemising Tendency",
                                     "ltmi_ltmd_gap_hours" = "LTMI–LTMD Gap (hours)")) |>
    group_by(Model) |>
    mutate(RowType = ifelse(Predictor %in% c("VP Colour","VP Location"),
                            paste(Predictor, "+", dplyr::lead(Predictor)),
                            Predictor),
           BF_formatted = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                 formatC(BF, format = "e", digits = 2),
                                 ""),
           Interpretation = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                   interpret_bf(BF),
                                   "")) |>
    ungroup() |>
    mutate(`B (slope)` = round(`B (slope)`, 2),
           SE = round(SE, 2),
           t = round(t, 2),
           p = ifelse(p.value < 0.001, "<.001", sprintf("%.3f", p.value))) |>
    select(Model, Predictor = RowType, `B (slope)`, SE, t, p, BF = BF_formatted, Interpretation)
  
  # 2. VP location → Memory location (within-domain)
  lm_loc_loc <- lm(as.formula(paste(outcome_location, "~", vp_location_var)), data = merged_data)
  ratio_loc_loc <- compute_ratio(merged_data, outcome_location, vp_location_var)
  BF_loc_loc <- bf_slope(lm_loc_loc, vp_location_var, ratio_loc_loc)
  
  raw_loc_loc <- tibble(
    Model = paste(model_prefix, "location → location"),
    Predictor = "VP Location",
    `B (slope)` = round(coef(lm_loc_loc)[vp_location_var], 2),
    SE = round(summary(lm_loc_loc)$coefficients[vp_location_var, 2], 2),
    t = round(summary(lm_loc_loc)$coefficients[vp_location_var, 3], 2),
    p = ifelse(summary(lm_loc_loc)$coefficients[vp_location_var, 4] < 0.001,
               "<.001",
               sprintf("%.3f", summary(lm_loc_loc)$coefficients[vp_location_var, 4])),
    BF = formatC(BF_loc_loc, format = "e", digits = 2),
    Interpretation = interpret_bf(BF_loc_loc)
  )
  
  results_loc_loc <- bind_rows(lapply(covariates_list, function(cov) {
    fit_with_covariate(merged_data, outcome_location, vp_location_var, cov,
                       paste(model_prefix, "location → location"))
  }))
  
  extended_loc_loc <- results_loc_loc |>
    filter(Predictor != "(Intercept)") |>
    mutate(Predictor = dplyr::recode(Predictor,
                                     "mean_vp_colour" = "VP Colour",
                                     "mean_vp_location" = "VP Location",
                                     "synaesthesia" = "Synaesthesia",
                                     "age" = "Age",
                                     "intrinsic_motivation" = "Intrinsic Motivation",
                                     "identified_regulation" = "Identified Regulation",
                                     "external_regulation" = "External Regulation",
                                     "amotivation" = "Amotivation",
                                     "imagery_ability" = "Imagery Ability",
                                     "technical_cognition" = "Technical Cognition",
                                     "word_forms" = "Word Forms",
                                     "organisation" = "Organisation",
                                     "global_bias" = "Global Bias",
                                     "systemising_tendency" = "Systemising Tendency",
                                     "ltmi_ltmd_gap_hours" = "LTMI–LTMD Gap (hours)")) |>
    group_by(Model) |>
    mutate(RowType = ifelse(Predictor %in% c("VP Colour","VP Location"),
                            paste(Predictor, "+", dplyr::lead(Predictor)),
                            Predictor),
           BF_formatted = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                 formatC(BF, format = "e", digits = 2),
                                 ""),
           Interpretation = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                   interpret_bf(BF),
                                   "")) |>
    ungroup() |>
    mutate(`B (slope)` = round(`B (slope)`, 2),
           SE = round(SE, 2),
           t = round(t, 2),
           p = ifelse(p.value < 0.001, "<.001", sprintf("%.3f", p.value))) |>
    select(Model, Predictor = RowType, `B (slope)`, SE, t, p, BF = BF_formatted, Interpretation)
  
  # 3. VP colour → Memory location (cross-domain)
  lm_col_loc <- lm(as.formula(paste(outcome_location, "~", vp_colour_var)), data = merged_data)
  ratio_col_loc <- compute_ratio(merged_data, outcome_location, vp_colour_var)
  BF_col_loc <- bf_slope(lm_col_loc, vp_colour_var, ratio_col_loc)
  
  raw_col_loc <- tibble(
    Model = paste(model_prefix, "colour → location"),
    Predictor = "VP Colour",
    `B (slope)` = round(coef(lm_col_loc)[vp_colour_var], 2),
    SE = round(summary(lm_col_loc)$coefficients[vp_colour_var, 2], 2),
    t = round(summary(lm_col_loc)$coefficients[vp_colour_var, 3], 2),
    p = ifelse(summary(lm_col_loc)$coefficients[vp_colour_var, 4] < 0.001,
               "<.001",
               sprintf("%.3f", summary(lm_col_loc)$coefficients[vp_colour_var, 4])),
    BF = formatC(BF_col_loc, format = "e", digits = 2),
    Interpretation = interpret_bf(BF_col_loc)
  )
  
  results_col_loc <- bind_rows(lapply(covariates_list, function(cov) {
    fit_with_covariate(merged_data, outcome_location, vp_colour_var, cov,
                       paste(model_prefix, "colour → location"))
  }))
  
  extended_col_loc <- results_col_loc |>
    filter(Predictor != "(Intercept)") |>
    mutate(Predictor = dplyr::recode(Predictor,
                                     "mean_vp_colour" = "VP Colour",
                                     "mean_vp_location" = "VP Location",
                                     "synaesthesia" = "Synaesthesia",
                                     "age" = "Age",
                                     "intrinsic_motivation" = "Intrinsic Motivation",
                                     "identified_regulation" = "Identified Regulation",
                                     "external_regulation" = "External Regulation",
                                     "amotivation" = "Amotivation",
                                     "imagery_ability" = "Imagery Ability",
                                     "technical_cognition" = "Technical Cognition",
                                     "word_forms" = "Word Forms",
                                     "organisation" = "Organisation",
                                     "global_bias" = "Global Bias",
                                     "systemising_tendency" = "Systemising Tendency",
                                     "ltmi_ltmd_gap_hours" = "LTMI–LTMD Gap (hours)")) |>
    group_by(Model) |>
    mutate(RowType = ifelse(Predictor %in% c("VP Colour","VP Location"),
                            paste(Predictor, "+", dplyr::lead(Predictor)),
                            Predictor),
           BF_formatted = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                 formatC(BF, format = "e", digits = 2),
                                 ""),
           Interpretation = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                   interpret_bf(BF),
                                   "")) |>
    ungroup() |>
    mutate(`B (slope)` = round(`B (slope)`, 2),
           SE = round(SE, 2),
           t = round(t, 2),
           p = ifelse(p.value < 0.001, "<.001", sprintf("%.3f", p.value))) |>
    select(Model, Predictor = RowType, `B (slope)`, SE, t, p, BF = BF_formatted, Interpretation)
  
  # 4. VP location → Memory colour (cross-domain)
  lm_loc_col <- lm(as.formula(paste(outcome_colour, "~", vp_location_var)), data = merged_data)
  ratio_loc_col <- compute_ratio(merged_data, outcome_colour, vp_location_var)
  BF_loc_col <- bf_slope(lm_loc_col, vp_location_var, ratio_loc_col)
  
  raw_loc_col <- tibble(
    Model = paste(model_prefix, "location → colour"),
    Predictor = "VP Location",
    `B (slope)` = round(coef(lm_loc_col)[vp_location_var], 2),
    SE = round(summary(lm_loc_col)$coefficients[vp_location_var, 2], 2),
    t = round(summary(lm_loc_col)$coefficients[vp_location_var, 3], 2),
    p = ifelse(summary(lm_loc_col)$coefficients[vp_location_var, 4] < 0.001,
               "<.001",
               sprintf("%.3f", summary(lm_loc_col)$coefficients[vp_location_var, 4])),
    BF = formatC(BF_loc_col, format = "e", digits = 2),
    Interpretation = interpret_bf(BF_loc_col)
  )
  
  results_loc_col <- bind_rows(lapply(covariates_list, function(cov) {
    fit_with_covariate(merged_data, outcome_colour, vp_location_var, cov,
                       paste(model_prefix, "location → colour"))
  }))
  
  extended_loc_col <- results_loc_col |>
    filter(Predictor != "(Intercept)") |>
    mutate(Predictor = dplyr::recode(Predictor,
                                     "mean_vp_colour" = "VP Colour",
                                     "mean_vp_location" = "VP Location",
                                     "synaesthesia" = "Synaesthesia",
                                     "age" = "Age",
                                     "intrinsic_motivation" = "Intrinsic Motivation",
                                     "identified_regulation" = "Identified Regulation",
                                     "external_regulation" = "External Regulation",
                                     "amotivation" = "Amotivation",
                                     "imagery_ability" = "Imagery Ability",
                                     "technical_cognition" = "Technical Cognition",
                                     "word_forms" = "Word Forms",
                                     "organisation" = "Organisation",
                                     "global_bias" = "Global Bias",
                                     "systemising_tendency" = "Systemising Tendency",
                                     "ltmi_ltmd_gap_hours" = "LTMI–LTMD Gap (hours)")) |>
    group_by(Model) |>
    mutate(RowType = ifelse(Predictor %in% c("VP Colour","VP Location"),
                            paste(Predictor, "+", dplyr::lead(Predictor)),
                            Predictor),
           BF_formatted = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                 formatC(BF, format = "e", digits = 2),
                                 ""),
           Interpretation = ifelse(Predictor %in% c("VP Colour","VP Location"),
                                   interpret_bf(BF),
                                   "")) |>
    ungroup() |>
    mutate(`B (slope)` = round(`B (slope)`, 2),
           SE = round(SE, 2),
           t = round(t, 2),
           p = ifelse(p.value < 0.001, "<.001", sprintf("%.3f", p.value))) |>
    select(Model, Predictor = RowType, `B (slope)`, SE, t, p, BF = BF_formatted, Interpretation)
  
  # Create subheaders
  within_domain_header <- tibble(
    Model = "WITHIN-DOMAIN",
    Predictor = "",
    `B (slope)` = NA_real_,
    SE = NA_real_,
    t = NA_real_,
    p = "",
    BF = "",
    Interpretation = ""
  )
  
  cross_domain_header <- tibble(
    Model = "CROSS-DOMAIN",
    Predictor = "",
    `B (slope)` = NA_real_,
    SE = NA_real_,
    t = NA_real_,
    p = "",
    BF = "",
    Interpretation = ""
  )
  
  # Combine all results with subheadings
  final_table <- bind_rows(
    within_domain_header,
    raw_col_col,
    extended_col_col,
    raw_loc_loc,
    extended_loc_loc,
    cross_domain_header,
    raw_col_loc,
    extended_col_loc,
    raw_loc_col,
    extended_loc_col
  )
  
  return(final_table)
}

# ===============================================================================
# STM ANALYSIS - LOOP ACROSS LOADS WITH ALL 4 DOMAIN COMBINATIONS
# ===============================================================================

all_stm_results <- list()

for (load in load_values) {
  
  stm_colour_var <- paste0("mean_stm_colour_load", load)
  stm_location_var <- paste0("mean_stm_location_load", load)
  
  # Select questionnaire variables for STM with four motivation subscales
  quest_selected_stm <- quest_data %>%
    select(participant_id, group,
           STM_intrinsic_motivation,
           STM_identified_regulation,
           STM_external_regulation,
           STM_amotivation,
           LTMI_intrinsic_motivation,
           LTMI_identified_regulation,
           LTMI_external_regulation,
           LTMI_amotivation,
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
      mean_intrinsic_motivation = mean(c(LTMI_intrinsic_motivation, LTMD_VP_intrinsic_motivation), na.rm = TRUE),
      mean_identified_regulation = mean(c(LTMI_identified_regulation, LTMD_VP_identified_regulation), na.rm = TRUE),
      mean_external_regulation = mean(c(LTMI_external_regulation, LTMD_VP_external_regulation), na.rm = TRUE),
      mean_amotivation = mean(c(LTMI_amotivation, LTMD_VP_amotivation), na.rm = TRUE),
      intrinsic_motivation = coalesce(STM_intrinsic_motivation, mean_intrinsic_motivation),
      identified_regulation = coalesce(STM_identified_regulation, mean_identified_regulation),
      external_regulation = coalesce(STM_external_regulation, mean_external_regulation),
      amotivation = coalesce(STM_amotivation, mean_amotivation)
    ) %>%
    ungroup() %>%
    select(participant_id, group,
           intrinsic_motivation, identified_regulation, external_regulation, amotivation,
           imagery_ability, technical_cognition, word_forms,
           organisation, global_bias, systemising_tendency)
  
  # Merge data for this load
  merged_data_load <- vp_colour_mean_clean %>%
    inner_join(vp_location_mean_clean, by = c("participant_id", "group")) %>%
    inner_join(stm_colour_by_load_clean[[as.character(load)]], by = c("participant_id", "group")) %>%
    inner_join(stm_location_by_load_clean[[as.character(load)]], by = c("participant_id", "group")) %>%
    inner_join(quest_selected_stm, by = c("participant_id", "group")) %>%
    left_join(observation_list %>% select(participant_id, age), by = "participant_id") %>%
    mutate(synaesthesia = ifelse(group == "synaesthetes", 1, 0))
  
  stm_results_load <- run_all_domain_combinations(
    merged_data = merged_data_load,
    outcome_colour = stm_colour_var,
    outcome_location = stm_location_var,
    vp_colour_var = "mean_vp_colour",
    vp_location_var = "mean_vp_location",
    covariates_list = covariates,
    model_prefix = paste0("STM (Load ", load, "): VP")
  )
  
  all_stm_results[[as.character(load)]] <- stm_results_load
}

stm_final <- bind_rows(all_stm_results)

# ===============================================================================
# LTMI ANALYSIS WITH ALL 4 DOMAIN COMBINATIONS
# ===============================================================================

quest_selected_ltmi <- quest_data %>%
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
         intrinsic_motivation, identified_regulation, external_regulation, amotivation,
         imagery_ability, technical_cognition, word_forms,
         organisation, global_bias, systemising_tendency)

merged_ltmi <- vp_colour_mean_clean %>%
  inner_join(vp_location_mean_clean, by = c("participant_id","group")) %>%
  inner_join(ltmi_colour_mean_clean, by = c("participant_id","group")) %>%
  inner_join(ltmi_location_mean_clean, by = c("participant_id","group")) %>%
  inner_join(quest_selected_ltmi, by = c("participant_id","group")) %>%
  left_join(observation_list %>% select(participant_id, age), by = "participant_id") %>%
  mutate(synaesthesia = ifelse(group == "synaesthetes", 1, 0))

ltmi_final <- run_all_domain_combinations(
  merged_data = merged_ltmi,
  outcome_colour = "mean_ltmi_colour",
  outcome_location = "mean_ltmi_location",
  vp_colour_var = "mean_vp_colour",
  vp_location_var = "mean_vp_location",
  covariates_list = covariates,
  model_prefix = "LTMI: VP"
)

# ===============================================================================
# LTMD ANALYSIS WITH ALL 4 DOMAIN COMBINATIONS
# ===============================================================================

quest_selected_ltmd <- quest_data %>%
  select(participant_id, group,
         LTMD_VP_intrinsic_motivation,
         LTMD_VP_identified_regulation,
         LTMD_VP_external_regulation,
         LTMD_VP_amotivation,
         STM_intrinsic_motivation,
         STM_identified_regulation,
         STM_external_regulation,
         STM_amotivation,
         LTMI_intrinsic_motivation,
         LTMI_identified_regulation,
         LTMI_external_regulation,
         LTMI_amotivation,
         imagery_ability,
         technical_cognition,
         word_forms,
         organisation,
         global_bias,
         systemising_tendency,
         ltmi_ltmd_gap_hours) %>%
  rowwise() %>%
  mutate(
    mean_intrinsic_motivation = mean(c(STM_intrinsic_motivation, LTMI_intrinsic_motivation), na.rm = TRUE),
    mean_identified_regulation = mean(c(STM_identified_regulation, LTMI_identified_regulation), na.rm = TRUE),
    mean_external_regulation = mean(c(STM_external_regulation, LTMI_external_regulation), na.rm = TRUE),
    mean_amotivation = mean(c(STM_amotivation, LTMI_amotivation), na.rm = TRUE),
    intrinsic_motivation = coalesce(LTMD_VP_intrinsic_motivation, mean_intrinsic_motivation),
    identified_regulation = coalesce(LTMD_VP_identified_regulation, mean_identified_regulation),
    external_regulation = coalesce(LTMD_VP_external_regulation, mean_external_regulation),
    amotivation = coalesce(LTMD_VP_amotivation, mean_amotivation)
  ) %>%
  ungroup() %>%
  select(participant_id, group,
         intrinsic_motivation, identified_regulation, external_regulation, amotivation,
         imagery_ability, technical_cognition, word_forms,
         organisation, global_bias, systemising_tendency,
         ltmi_ltmd_gap_hours)

merged_ltmd <- vp_colour_mean_clean %>%
  inner_join(vp_location_mean_clean, by = c("participant_id","group")) %>%
  inner_join(ltmd_colour_mean_clean, by = c("participant_id","group")) %>%
  inner_join(ltmd_location_mean_clean, by = c("participant_id","group")) %>%
  inner_join(quest_selected_ltmd, by = c("participant_id","group")) %>%
  left_join(observation_list %>% select(participant_id, age), by = "participant_id") %>%
  mutate(synaesthesia = ifelse(group == "synaesthetes", 1, 0))

covariates_ltmd <- c("synaesthesia", "age", 
                     "intrinsic_motivation", "identified_regulation", 
                     "external_regulation", "amotivation",
                     "imagery_ability", "technical_cognition", "word_forms",
                     "organisation", "global_bias", "systemising_tendency",
                     "ltmi_ltmd_gap_hours")

ltmd_final <- run_all_domain_combinations(
  merged_data = merged_ltmd,
  outcome_colour = "mean_ltmd_colour",
  outcome_location = "mean_ltmd_location",
  vp_colour_var = "mean_vp_colour",
  vp_location_var = "mean_vp_location",
  covariates_list = covariates_ltmd,
  model_prefix = "LTMD: VP"
)

# ===============================================================================
# COMBINE ALL RESULTS AND ADD SECTION BREAKS
# ===============================================================================

stm_header <- tibble(
  Model = "=== STM ANALYSES ===", Predictor = "",
  `B (slope)` = NA_real_, SE = NA_real_, t = NA_real_,
  p = "", BF = "", Interpretation = ""
)

ltmi_header <- tibble(
  Model = "=== LTMI ANALYSES ===", Predictor = "",
  `B (slope)` = NA_real_, SE = NA_real_, t = NA_real_,
  p = "", BF = "", Interpretation = ""
)

ltmd_header <- tibble(
  Model = "=== LTMD ANALYSES ===", Predictor = "",
  `B (slope)` = NA_real_, SE = NA_real_, t = NA_real_,
  p = "", BF = "", Interpretation = ""
)

final_combined_table <- bind_rows(
  stm_header,
  stm_final,
  ltmi_header,
  ltmi_final,
  ltmd_header,
  ltmd_final
)

# Save to CSV
output_path <- "<PATH_TO_DATA>/combined_regression_results_all_domains.csv"
write.csv(final_combined_table, output_path, row.names = FALSE, na = "")

cat("\nAnalysis complete! Results saved to:", output_path, "\n")
cat("Total rows in output:", nrow(final_combined_table), "\n")
cat("\nFor each memory task, the following 4 domain combinations are included:\n")
cat("  1. VP colour → Memory colour (WITHIN-DOMAIN)\n")
cat("  2. VP location → Memory location (WITHIN-DOMAIN)\n")
cat("  3. VP colour → Memory location (CROSS-DOMAIN)\n")
cat("  4. VP location → Memory colour (CROSS-DOMAIN)\n")
cat("\nNote: LTMI dependent variables are averaged across repetitions 1-4.\n")
cat("      Outlier exclusion for LTMI is based on repetition 4 scores only.\n")