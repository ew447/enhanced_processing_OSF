# ===============================================================================
# MEDIATION AND MODERATION ANALYSES
# ===============================================================================
# Research Questions:
# (1) Does motivation explain synaesthesia differences in VP (syn → motivation → VP)?
# (2) Does VP mediate synaesthesia → memory relationship (syn → VP → memory)?
# (3) Does VP moderate synaesthesia → memory relationship (syn × VP → memory)?
# ===============================================================================

# Load libraries
library(dplyr)
library(readxl)
library(janitor)
library(mediation)
library(interactions)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# ===============================================================================
# LOAD DATA
# ===============================================================================

cat("===============================================================================\n")
cat("LOADING DATA\n")
cat("===============================================================================\n\n")

controls_vp <- read.csv("<PATH_TO_DATA>/Controls/VP.csv")
controls_vp <- filter_exclusions(controls_vp)

rels_vp <- read.csv("<PATH_TO_DATA>/Relatives/VP.csv")
rels_vp <- filter_exclusions(rels_vp)

syn_vp <- read.csv("<PATH_TO_DATA>/Synaesthetes/VP.csv")
syn_vp <- filter_exclusions(syn_vp)

controls_stm <- read.csv("<PATH_TO_DATA>/Controls/STM.csv")
controls_stm <- filter_exclusions(controls_stm)

rels_stm <- read.csv("<PATH_TO_DATA>/Relatives/STM.csv")
rels_stm <- filter_exclusions(rels_stm)

syn_stm <- read.csv("<PATH_TO_DATA>/Synaesthetes/STM.csv")
syn_stm <- filter_exclusions(syn_stm)

controls_ltmi <- read.csv("<PATH_TO_DATA>/Controls/LTMI.csv")
controls_ltmi <- filter_exclusions(controls_ltmi)

rels_ltmi <- read.csv("<PATH_TO_DATA>/Relatives/LTMI.csv")
rels_ltmi <- filter_exclusions(rels_ltmi)

syn_ltmi <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")
syn_ltmi <- filter_exclusions(syn_ltmi)

controls_ltmd <- read.csv("<PATH_TO_DATA>/Controls/LTMD.csv")
controls_ltmd <- filter_exclusions(controls_ltmd)

rels_ltmd <- read.csv("<PATH_TO_DATA>/Relatives/LTMD.csv")
rels_ltmd <- filter_exclusions(rels_ltmd)

syn_ltmd <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMD.csv")
syn_ltmd <- filter_exclusions(syn_ltmd)

controls_quest <- read.csv("<PATH_TO_DATA>/Controls/questionnaires.csv")
rels_quest     <- read.csv("<PATH_TO_DATA>/Relatives/questionnaires.csv")
syn_quest      <- read.csv("<PATH_TO_DATA>/Synaesthetes/questionnaires.csv")

# ===============================================================================
# PREPARE DATA
# ===============================================================================

cat("Preparing data...\n\n")

controls_vp <- controls_vp %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_vp     <- rels_vp     %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_vp      <- syn_vp      %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_stm <- controls_stm %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_stm     <- rels_stm     %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_stm      <- syn_stm      %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_ltmi <- controls_ltmi %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmi     <- rels_ltmi     %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmi      <- syn_ltmi      %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_ltmd <- controls_ltmd %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmd     <- rels_ltmd     %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmd      <- syn_ltmd      %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_quest <- controls_quest %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_quest     <- rels_quest     %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_quest      <- syn_quest      %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

vp_data    <- bind_rows(controls_vp,   rels_vp,   syn_vp)
stm_data   <- bind_rows(controls_stm,  rels_stm,  syn_stm)
ltmi_data  <- bind_rows(controls_ltmi, rels_ltmi, syn_ltmi)
ltmd_data  <- bind_rows(controls_ltmd, rels_ltmd, syn_ltmd)
quest_data <- bind_rows(controls_quest, rels_quest, syn_quest)

# ===============================================================================
# CALCULATE MEAN SCORES
# ===============================================================================

cat("Calculating mean scores...\n\n")

# VP means
vp_colour_mean <- vp_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

vp_location_mean <- vp_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# STM means by load
load_values <- sort(unique(stm_data$load_n))
stm_colour_by_load   <- list()
stm_location_by_load <- list()

for (load in load_values) {
  stm_colour_by_load[[as.character(load)]] <- stm_data %>%
    filter(load_n == load) %>%
    group_by(participant_id, group) %>%
    summarize(!!paste0("mean_stm_colour_load", load) := mean(colour_angle_abs_deviation, na.rm = TRUE),
              .groups = 'drop')
  
  stm_location_by_load[[as.character(load)]] <- stm_data %>%
    filter(load_n == load) %>%
    group_by(participant_id, group) %>%
    summarize(!!paste0("mean_stm_location_load", load) := mean(location_angle_abs_deviation, na.rm = TRUE),
              .groups = 'drop')
}

# LTMI means (average across repetitions 1-4; exclusion criteria based on rep 4 applied via filter_exclusions above)
ltmi_colour_mean <- ltmi_data %>%
  filter(repetition %in% 1:4) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

ltmi_location_mean <- ltmi_data %>%
  filter(repetition %in% 1:4) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# LTMD means
ltmd_colour_mean <- ltmd_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_colour = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

ltmd_location_mean <- ltmd_data %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_location = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# ===============================================================================
# PREPARE QUESTIONNAIRE DATA WITH MOTIVATION SUBSCALES
# ===============================================================================

quest_selected <- quest_data %>%
  dplyr::select(participant_id, group,
                LTMD_VP_intrinsic_motivation, LTMD_VP_identified_regulation,
                LTMD_VP_external_regulation,  LTMD_VP_amotivation,
                STM_intrinsic_motivation,  STM_identified_regulation,
                STM_external_regulation,   STM_amotivation,
                LTMI_intrinsic_motivation, LTMI_identified_regulation,
                LTMI_external_regulation,  LTMI_amotivation,
                ltmi_ltmd_gap_hours) %>%
  rowwise() %>%
  mutate(
    # STM: use STM motivation, fallback to mean of VP and LTMI
    mean_vp_ltmi_intrinsic  = mean(c(LTMD_VP_intrinsic_motivation, LTMI_intrinsic_motivation), na.rm = TRUE),
    mean_vp_ltmi_identified = mean(c(LTMD_VP_identified_regulation, LTMI_identified_regulation), na.rm = TRUE),
    mean_vp_ltmi_external   = mean(c(LTMD_VP_external_regulation,  LTMI_external_regulation),  na.rm = TRUE),
    mean_vp_ltmi_amotivation = mean(c(LTMD_VP_amotivation, LTMI_amotivation), na.rm = TRUE),
    
    stm_intrinsic_motivation  = coalesce(STM_intrinsic_motivation,  mean_vp_ltmi_intrinsic),
    stm_identified_regulation = coalesce(STM_identified_regulation, mean_vp_ltmi_identified),
    stm_external_regulation   = coalesce(STM_external_regulation,   mean_vp_ltmi_external),
    stm_amotivation           = coalesce(STM_amotivation,           mean_vp_ltmi_amotivation),
    
    # LTMI: use LTMI motivation, fallback to mean of STM and VP
    mean_stm_vp_intrinsic  = mean(c(STM_intrinsic_motivation, LTMD_VP_intrinsic_motivation), na.rm = TRUE),
    mean_stm_vp_identified = mean(c(STM_identified_regulation, LTMD_VP_identified_regulation), na.rm = TRUE),
    mean_stm_vp_external   = mean(c(STM_external_regulation,  LTMD_VP_external_regulation),  na.rm = TRUE),
    mean_stm_vp_amotivation = mean(c(STM_amotivation, LTMD_VP_amotivation), na.rm = TRUE),
    
    ltmi_intrinsic_motivation  = coalesce(LTMI_intrinsic_motivation,  mean_stm_vp_intrinsic),
    ltmi_identified_regulation = coalesce(LTMI_identified_regulation, mean_stm_vp_identified),
    ltmi_external_regulation   = coalesce(LTMI_external_regulation,   mean_stm_vp_external),
    ltmi_amotivation           = coalesce(LTMI_amotivation,           mean_stm_vp_amotivation)
  ) %>%
  ungroup() %>%
  dplyr::select(participant_id, group,
                LTMD_VP_intrinsic_motivation, LTMD_VP_identified_regulation,
                LTMD_VP_external_regulation,  LTMD_VP_amotivation,
                stm_intrinsic_motivation, stm_identified_regulation,
                stm_external_regulation,  stm_amotivation,
                ltmi_intrinsic_motivation, ltmi_identified_regulation,
                ltmi_external_regulation,  ltmi_amotivation,
                ltmi_ltmd_gap_hours)

# ===============================================================================
# OUTLIER EXCLUSION FUNCTION
# ===============================================================================

exclude_high_outliers <- function(data, var_name) {
  data %>%
    group_by(group) %>%
    mutate(
      group_mean   = mean(.data[[var_name]], na.rm = TRUE),
      group_sd     = sd(.data[[var_name]],   na.rm = TRUE),
      z_score_high = (.data[[var_name]] - group_mean) / group_sd
    ) %>%
    filter(z_score_high <= 2.5) %>%
    dplyr::select(-group_mean, -group_sd, -z_score_high) %>%
    ungroup()
}

# ===============================================================================
# QUESTION 1: DOES MOTIVATION MEDIATE SYNAESTHESIA → VP?
# ===============================================================================

cat("\n===============================================================================\n")
cat("QUESTION 1: DOES MOTIVATION MEDIATE SYNAESTHESIA → VP?\n")
cat("===============================================================================\n\n")

vp_mediation_data <- vp_colour_mean %>%
  inner_join(vp_location_mean, by = c("participant_id", "group")) %>%
  inner_join(quest_selected,   by = c("participant_id", "group")) %>%
  mutate(synaesthesia = ifelse(group == "synaesthetes", 1, 0))

cat("Total participants with VP and motivation data:", nrow(vp_mediation_data), "\n\n")

motivation_subscales <- c("LTMD_VP_intrinsic_motivation", "LTMD_VP_identified_regulation",
                          "LTMD_VP_external_regulation",  "LTMD_VP_amotivation")
motivation_labels    <- c("Intrinsic Motivation", "Identified Regulation",
                          "External Regulation",  "Amotivation")

# --- VP COLOUR MEDIATION ---
cat("-----------------------------------------------------------------------\n")
cat("VP COLOUR MEDIATION ANALYSES\n")
cat("-----------------------------------------------------------------------\n\n")

for (i in 1:length(motivation_subscales)) {
  cat("Testing mediator:", motivation_labels[i], "\n")
  cat("...................................................................\n")
  
  analysis_data <- vp_mediation_data %>%
    exclude_high_outliers("mean_vp_colour") %>%
    filter(complete.cases(mean_vp_colour, synaesthesia, .data[[motivation_subscales[i]]]))
  
  cat("N =", nrow(analysis_data), "\n\n")
  
  total_model     <- lm(mean_vp_colour ~ synaesthesia, data = analysis_data)
  a_formula       <- as.formula(paste0(motivation_subscales[i], " ~ synaesthesia"))
  a_model         <- lm(a_formula, data = analysis_data)
  med_formula     <- as.formula(paste0("mean_vp_colour ~ synaesthesia + ", motivation_subscales[i]))
  mediation_model <- lm(med_formula, data = analysis_data)
  
  c_path       <- coef(summary(total_model))["synaesthesia", ]
  a_path       <- coef(summary(a_model))["synaesthesia", ]
  b_path       <- coef(summary(mediation_model))[motivation_subscales[i], ]
  c_prime_path <- coef(summary(mediation_model))["synaesthesia", ]
  indirect_effect <- a_path["Estimate"] * b_path["Estimate"]
  
  cat("Path c (total effect, syn → VP colour):", round(c_path["Estimate"], 4),
      ", p =", round(c_path["Pr(>|t|)"], 4), "\n")
  cat("Path a (syn → motivation):", round(a_path["Estimate"], 4),
      ", p =", round(a_path["Pr(>|t|)"], 4), "\n")
  cat("Path b (motivation → VP colour):", round(b_path["Estimate"], 4),
      ", p =", round(b_path["Pr(>|t|)"], 4), "\n")
  cat("Path c' (direct effect, syn → VP colour controlling for motivation):",
      round(c_prime_path["Estimate"], 4), ", p =", round(c_prime_path["Pr(>|t|)"], 4), "\n")
  cat("Indirect effect (a × b):", round(indirect_effect, 4), "\n")
  cat("Proportion mediated:", round(indirect_effect / c_path["Estimate"], 3), "\n\n")
  
  cat("Bootstrap mediation test (1000 iterations):\n")
  med_result <- mediate(a_model, mediation_model, treat = "synaesthesia",
                        mediator = motivation_subscales[i], boot = TRUE, sims = 1000)
  print(summary(med_result))
  cat("\n\n")
}

# --- VP LOCATION MEDIATION ---
cat("-----------------------------------------------------------------------\n")
cat("VP LOCATION MEDIATION ANALYSES\n")
cat("-----------------------------------------------------------------------\n\n")

for (i in 1:length(motivation_subscales)) {
  cat("Testing mediator:", motivation_labels[i], "\n")
  cat("...................................................................\n")
  
  analysis_data <- vp_mediation_data %>%
    exclude_high_outliers("mean_vp_location") %>%
    filter(complete.cases(mean_vp_location, synaesthesia, .data[[motivation_subscales[i]]]))
  
  cat("N =", nrow(analysis_data), "\n\n")
  
  total_model     <- lm(mean_vp_location ~ synaesthesia, data = analysis_data)
  a_formula       <- as.formula(paste0(motivation_subscales[i], " ~ synaesthesia"))
  a_model         <- lm(a_formula, data = analysis_data)
  med_formula     <- as.formula(paste0("mean_vp_location ~ synaesthesia + ", motivation_subscales[i]))
  mediation_model <- lm(med_formula, data = analysis_data)
  
  c_path       <- coef(summary(total_model))["synaesthesia", ]
  a_path       <- coef(summary(a_model))["synaesthesia", ]
  b_path       <- coef(summary(mediation_model))[motivation_subscales[i], ]
  c_prime_path <- coef(summary(mediation_model))["synaesthesia", ]
  indirect_effect <- a_path["Estimate"] * b_path["Estimate"]
  
  cat("Path c (total effect, syn → VP location):", round(c_path["Estimate"], 4),
      ", p =", round(c_path["Pr(>|t|)"], 4), "\n")
  cat("Path a (syn → motivation):", round(a_path["Estimate"], 4),
      ", p =", round(a_path["Pr(>|t|)"], 4), "\n")
  cat("Path b (motivation → VP location):", round(b_path["Estimate"], 4),
      ", p =", round(b_path["Pr(>|t|)"], 4), "\n")
  cat("Path c' (direct effect, syn → VP location controlling for motivation):",
      round(c_prime_path["Estimate"], 4), ", p =", round(c_prime_path["Pr(>|t|)"], 4), "\n")
  cat("Indirect effect (a × b):", round(indirect_effect, 4), "\n")
  cat("Proportion mediated:", round(indirect_effect / c_path["Estimate"], 3), "\n\n")
  
  cat("Bootstrap mediation test (1000 iterations):\n")
  med_result <- mediate(a_model, mediation_model, treat = "synaesthesia",
                        mediator = motivation_subscales[i], boot = TRUE, sims = 1000)
  print(summary(med_result))
  cat("\n\n")
}

# ===============================================================================
# QUESTION 2: DOES VP MEDIATE SYNAESTHESIA → MEMORY?
# ===============================================================================

cat("\n===============================================================================\n")
cat("QUESTION 2: DOES VP MEDIATE SYNAESTHESIA → MEMORY?\n")
cat("===============================================================================\n\n")

# ===============================================================================
# FIXED: Function to run VP mediation analysis for memory outcomes
# ===============================================================================

run_vp_memory_mediation <- function(memory_data, memory_var, vp_var,
                                    motivation_vars, covariates, label) {
  
  cat("-----------------------------------------------------------------------\n")
  cat(label, "\n")
  cat("-----------------------------------------------------------------------\n\n")
  
  vars_to_keep <- c("participant_id", "group", memory_var, vp_var, "synaesthesia",
                    motivation_vars, covariates)
  analysis_data <- memory_data %>%
    dplyr::select(all_of(vars_to_keep))
  
  analysis_data <- analysis_data %>%
    exclude_high_outliers(vp_var) %>%
    exclude_high_outliers(memory_var) %>%
    filter(complete.cases(.data[[memory_var]], .data[[vp_var]], synaesthesia,
                          !!!syms(motivation_vars)))
  
  if (!is.null(covariates)) {
    analysis_data <- analysis_data %>%
      filter(complete.cases(!!!syms(covariates)))
  }
  
  cat("N =", nrow(analysis_data), "\n\n")
  
  # -------------------------------------------------------------------
  # Build mediation_df with ALL generic names FIRST, before any models
  # This prevents mediate() from searching for original variable names
  # -------------------------------------------------------------------
  mediation_df <- data.frame(
    Y_outcome   = analysis_data[[memory_var]],
    M_mediator  = analysis_data[[vp_var]],
    X_treatment = analysis_data$synaesthesia
  )
  
  mot_names <- character(0)
  for (i in seq_along(motivation_vars)) {
    mot_name <- paste0("MOT", i)
    mediation_df[[mot_name]] <- analysis_data[[motivation_vars[i]]]
    mot_names <- c(mot_names, mot_name)
  }
  
  cov_names <- character(0)
  if (!is.null(covariates) && length(covariates) > 0) {
    for (i in seq_along(covariates)) {
      cov_name <- paste0("COV", i)
      mediation_df[[cov_name]] <- analysis_data[[covariates[i]]]
      cov_names <- c(cov_names, cov_name)
    }
  }
  
  all_covs <- c(mot_names, cov_names)
  cov_string_generic <- if (length(all_covs) > 0) paste(all_covs, collapse = " + ") else NULL
  
  # Helper to build formulas that only reference generic names
  # env = baseenv() prevents stale environment capture by mediate()
  make_formula <- function(lhs, rhs_extra = NULL) {
    rhs <- paste(c("X_treatment", rhs_extra), collapse = " + ")
    as.formula(paste(lhs, "~", rhs), env = baseenv())
  }
  
  total_model     <- lm(make_formula("Y_outcome",  cov_string_generic),                    data = mediation_df)
  a_model         <- lm(make_formula("M_mediator", cov_string_generic),                    data = mediation_df)
  mediation_model <- lm(make_formula("Y_outcome",  c("M_mediator", cov_string_generic)),   data = mediation_df)
  
  c_path       <- coef(summary(total_model))["X_treatment", ]
  a_path       <- coef(summary(a_model))["X_treatment", ]
  b_path       <- coef(summary(mediation_model))["M_mediator", ]
  c_prime_path <- coef(summary(mediation_model))["X_treatment", ]
  indirect_effect <- a_path["Estimate"] * b_path["Estimate"]
  
  cat("Path c (total effect, syn → memory):", round(c_path["Estimate"], 4),
      ", p =", round(c_path["Pr(>|t|)"], 4), "\n")
  cat("Path a (syn → VP):", round(a_path["Estimate"], 4),
      ", p =", round(a_path["Pr(>|t|)"], 4), "\n")
  cat("Path b (VP → memory):", round(b_path["Estimate"], 4),
      ", p =", round(b_path["Pr(>|t|)"], 4), "\n")
  cat("Path c' (direct effect, syn → memory controlling for VP):",
      round(c_prime_path["Estimate"], 4), ", p =", round(c_prime_path["Pr(>|t|)"], 4), "\n")
  cat("Indirect effect (a × b):", round(indirect_effect, 4), "\n")
  
  if (c_path["Estimate"] != 0) {
    cat("Proportion mediated:", round(indirect_effect / c_path["Estimate"], 3), "\n\n")
  } else {
    cat("Proportion mediated: Cannot calculate (total effect = 0)\n\n")
  }
  
  cat("Bootstrap mediation test (1000 iterations):\n")
  med_result <- mediate(a_model, mediation_model,
                        treat    = "X_treatment",
                        mediator = "M_mediator",
                        boot = TRUE, sims = 1000)
  print(summary(med_result))
  cat("\n\n")
}