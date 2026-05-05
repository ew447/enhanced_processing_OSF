library(tidyverse)
library(readxl)
library(caret)
library(randomForest)
library(pROC)
library(VSURF)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# ===============================================================================
# FILE PATHS
# ===============================================================================

# Task data paths
syn_ltmi_path <- "<PATH_TO_DATA>/Synaesthetes/LTMI.csv"
syn_ltmd_path <- "<PATH_TO_DATA>/Synaesthetes/LTMD.csv"
syn_vp_path <- "<PATH_TO_DATA>/Synaesthetes/VP.csv"
syn_stm_path <- "<PATH_TO_DATA>/Synaesthetes/STM.csv"

rel_ltmi_path <- "<PATH_TO_DATA>/Relatives/LTMI.csv"
rel_ltmd_path <- "<PATH_TO_DATA>/Relatives/LTMD.csv"
rel_vp_path <- "<PATH_TO_DATA>/Relatives/VP.csv"
rel_stm_path <- "<PATH_TO_DATA>/Relatives/STM.csv"

con_ltmi_path <- "<PATH_TO_DATA>/Controls/LTMI.csv"
con_ltmd_path <- "<PATH_TO_DATA>/Controls/LTMD.csv"
con_vp_path <- "<PATH_TO_DATA>/Controls/VP.csv"
con_stm_path <- "<PATH_TO_DATA>/Controls/STM.csv"

# Questionnaire data paths
syn_quest_path <- "<PATH_TO_DATA>/Synaesthetes/questionnaires.csv"
rel_quest_path <- "<PATH_TO_DATA>/Relatives/questionnaires.csv"
con_quest_path <- "<PATH_TO_DATA>/Controls/questionnaires.csv"

# File for synaesthesia subtypes
observation_list_path <- "<PATH_TO_PARTICIPANTS>/observation_list.xlsx"

# ===============================================================================
# FUNCTIONS
# ===============================================================================

# Function to load and prepare task data
load_task_data <- function(path, task_name, group_name) {
  data <- read.csv(path) %>%
    mutate(participant_id = as.character(participant_id),
           group = group_name)
  data <- filter_exclusions(data)
  return(data)
}

# Function to calculate accuracy from task data
calculate_accuracy <- function(data, colour_var, location_var) {
  data %>%
    mutate(
      colour_accuracy = 1 - !!sym(colour_var),
      location_accuracy = 1 - !!sym(location_var)
    )
}

# ===============================================================================
# LOAD ALL DATA
# ===============================================================================

cat("Loading data...\n")

# Load task data for all groups
syn_ltmi <- load_task_data(syn_ltmi_path, "LTMI", "synaesthetes")
syn_ltmd <- load_task_data(syn_ltmd_path, "LTMD", "synaesthetes")
syn_vp <- load_task_data(syn_vp_path, "VP", "synaesthetes")
syn_stm <- load_task_data(syn_stm_path, "STM", "synaesthetes")

rel_ltmi <- load_task_data(rel_ltmi_path, "LTMI", "relatives")
rel_ltmd <- load_task_data(rel_ltmd_path, "LTMD", "relatives")
rel_vp <- load_task_data(rel_vp_path, "VP", "relatives")
rel_stm <- load_task_data(rel_stm_path, "STM", "relatives")

con_ltmi <- load_task_data(con_ltmi_path, "LTMI", "controls")
con_ltmd <- load_task_data(con_ltmd_path, "LTMD", "controls")
con_vp <- load_task_data(con_vp_path, "VP", "controls")
con_stm <- load_task_data(con_stm_path, "STM", "controls")

# Load questionnaire data
syn_quest <- read.csv(syn_quest_path) %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")
rel_quest <- read.csv(rel_quest_path) %>% mutate(participant_id = as.character(participant_id), group = "relatives")
con_quest <- read.csv(con_quest_path) %>% mutate(participant_id = as.character(participant_id), group = "controls")

# Load observation list for synaesthesia subtypes
observation_list <- read_excel(observation_list_path, sheet = "Synaesthetes") %>%
  mutate(participant_id = as.character(participant_id))

cat("Data loaded successfully!\n\n")

# ===============================================================================
# CALCULATE TASK ACCURACY MEASURES
# ===============================================================================

cat("Calculating accuracy measures...\n")

# LTMI - all repetitions (1-4)
ltmi_accuracy <- bind_rows(syn_ltmi, rel_ltmi, con_ltmi) %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id, group) %>%
  summarise(
    LTMI_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    LTMI_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

# LTMD - colour and location separate
ltmd_accuracy <- bind_rows(syn_ltmd, rel_ltmd, con_ltmd) %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id, group) %>%
  summarise(
    LTMD_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    LTMD_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

# VP - colour and location separate
vp_accuracy <- bind_rows(syn_vp, rel_vp, con_vp) %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id, group) %>%
  summarise(
    VP_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    VP_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

# STM - colour and location separate, collapsed across load_n
stm_accuracy <- bind_rows(syn_stm, rel_stm, con_stm) %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id, group) %>%
  summarise(
    STM_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    STM_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

cat("Accuracy measures calculated!\n\n")

# ===============================================================================
# PREPARE QUESTIONNAIRE DATA
# ===============================================================================

cat("Preparing questionnaire data...\n")

# Combine questionnaire data and calculate mean self-determination index
questionnaires_all <- bind_rows(syn_quest, rel_quest, con_quest) %>%
  mutate(
    mean_selfdetermination_index = rowMeans(
      select(., LTMI_selfdetermination_index, LTMD_VP_selfdetermination_index, STM_selfdetermination_index),
      na.rm = TRUE
    )
  ) %>%
  select(participant_id, group, mean_selfdetermination_index, 
         imagery_ability, technical_cognition, word_forms, 
         organisation, global_bias, systemising_tendency)

cat("Questionnaire data prepared!\n\n")

# ===============================================================================
# GET SYNAESTHESIA SUBTYPE DATA
# ===============================================================================

cat("Preparing synaesthesia subtype data...\n")

# Get from observation list
subtype_data <- observation_list %>%
  select(participant_id, has_GCS, has_SSS, syn_num_types) %>%
  rename(number_of_types = syn_num_types)

cat("Synaesthesia subtype data prepared!\n\n")

# ===============================================================================
# MERGE ALL DATA
# ===============================================================================

cat("Merging all datasets...\n")

# Merge task accuracies
merged_data <- ltmi_accuracy %>%
  full_join(ltmd_accuracy, by = c("participant_id", "group")) %>%
  full_join(vp_accuracy, by = c("participant_id", "group")) %>%
  full_join(stm_accuracy, by = c("participant_id", "group")) %>%
  full_join(questionnaires_all, by = c("participant_id", "group"))

# Add synaesthesia subtype data (only for synaesthetes)
merged_data <- merged_data %>%
  left_join(subtype_data, by = "participant_id") %>%
  mutate(
    has_GCS = if_else(group == "synaesthetes", coalesce(has_GCS, 0), 0),
    has_SSS = if_else(group == "synaesthetes", coalesce(has_SSS, 0), 0),
    number_of_types = if_else(group == "synaesthetes", coalesce(number_of_types, 0L), 0L)
  )

cat("Data merged successfully!\n")
cat("Total participants:", nrow(merged_data), "\n")
cat("Synaesthetes:", sum(merged_data$group == "synaesthetes"), "\n")
cat("Relatives:", sum(merged_data$group == "relatives"), "\n")
cat("Controls:", sum(merged_data$group == "controls"), "\n\n")

# ===============================================================================
# GROUP-WISE PERFORMANCE EXCLUSIONS (UPPER TAIL ONLY: z > +2.5)
# ===============================================================================

cat("Applying group-wise UPPER 2.5 SD performance exclusions...\n\n")

performance_vars_for_exclusion <- c(
  "LTMI_colour_accuracy", "LTMI_location_accuracy",
  "LTMD_colour_accuracy", "LTMD_location_accuracy",
  "VP_colour_accuracy", "VP_location_accuracy",
  "STM_colour_accuracy", "STM_location_accuracy"
)

# Long format + group-wise z-scores
z_df <- merged_data %>%
  select(participant_id, group, all_of(performance_vars_for_exclusion)) %>%
  pivot_longer(cols = all_of(performance_vars_for_exclusion),
               names_to = "variable",
               values_to = "value") %>%
  group_by(group, variable) %>%
  mutate(
    mean_val = mean(value, na.rm = TRUE),
    sd_val   = sd(value, na.rm = TRUE),
    z        = (value - mean_val) / sd_val
  ) %>%
  ungroup()

outlier_ids <- z_df %>%
  filter(!is.na(z) & z > 2.5) %>%
  distinct(participant_id)

cat("Number of participants excluded by UPPER 2.5 SD rule:",
    nrow(outlier_ids), "\n")

if (nrow(outlier_ids) > 0) {
  cat("Excluded participant IDs:\n")
  print(outlier_ids)
}

# Apply exclusion globally
merged_data <- merged_data %>%
  filter(!participant_id %in% outlier_ids$participant_id)

cat("Remaining participants after performance exclusion:", nrow(merged_data), "\n\n")

# ===============================================================================
# PREPARE DATA FOR MACHINE LEARNING
# ===============================================================================

cat("Preparing data for machine learning...\n")

# Select predictor variables (training on 14 variables)
predictor_vars_ml <- c(
  "imagery_ability", "technical_cognition", "word_forms",
  "organisation", "global_bias", "systemising_tendency",
  "LTMI_colour_accuracy", "LTMI_location_accuracy",
  "LTMD_colour_accuracy", "LTMD_location_accuracy",
  "VP_colour_accuracy", "VP_location_accuracy",
  "STM_colour_accuracy", "STM_location_accuracy"
)

# For Mahalanobis D: exclude synaesthesia-specific variables 
# (they have zero variance in controls/relatives which was throwing an error)
predictor_vars_maha <- c(
  "imagery_ability", "technical_cognition", "word_forms",
  "organisation", "global_bias", "systemising_tendency",
  "LTMI_colour_accuracy", "LTMI_location_accuracy",
  "LTMD_colour_accuracy", "LTMD_location_accuracy",
  "VP_colour_accuracy", "VP_location_accuracy",
  "STM_colour_accuracy", "STM_location_accuracy"
)

cat("Machine learning will use", length(predictor_vars_ml), "variables\n")
cat("Mahalanobis D will use", length(predictor_vars_maha), "variables (excluding syn-specific)\n\n")

# ---------------------------------------------------------------
# TRAINING DATA: Complete cases only (synaesthetes vs controls)
# ---------------------------------------------------------------

training_data <- merged_data %>%
  filter(group %in% c("synaesthetes", "controls")) %>%
  mutate(group = factor(group, levels = c("controls", "synaesthetes"))) %>%
  select(participant_id, group, all_of(predictor_vars_ml))

# Report missing data before exclusion
cat("\nMissing data in training set (before exclusion):\n")
missing_counts <- training_data %>%
  select(all_of(predictor_vars_ml)) %>%
  summarise(across(everything(), ~sum(is.na(.)))) %>%
  pivot_longer(everything(), names_to = "variable", values_to = "n_missing") %>%
  filter(n_missing > 0) %>%
  arrange(desc(n_missing))

if (nrow(missing_counts) > 0) {
  print(missing_counts)
} else {
  cat("  No missing data!\n")
}

# Apply complete case filtering
training_data_complete <- training_data %>% drop_na()

cat("\nTraining data prepared:\n")
cat("  Initial: Controls =", sum(training_data$group == "controls"), 
    ", Synaesthetes =", sum(training_data$group == "synaesthetes"), "\n")
cat("  After complete case filtering: Controls =", sum(training_data_complete$group == "controls"),
    ", Synaesthetes =", sum(training_data_complete$group == "synaesthetes"), "\n")
cat("  Participants excluded due to missing data:", 
    nrow(training_data) - nrow(training_data_complete), "\n")
cat("  Predictor variables:", length(predictor_vars_ml), "\n\n")

# ---------------------------------------------------------------
# RELATIVES DATA: Complete cases only (no imputation)
# ---------------------------------------------------------------

relatives_data <- merged_data %>%
  filter(group == "relatives") %>%
  select(participant_id, all_of(predictor_vars_ml))

cat("Relatives data for prediction:\n")
cat("  Initial relatives:", nrow(relatives_data), "\n")

# Check for missing data in relatives
missing_relatives <- relatives_data %>%
  select(all_of(predictor_vars_ml)) %>%
  summarise(across(everything(), ~sum(is.na(.)))) %>%
  pivot_longer(everything(), names_to = "variable", values_to = "n_missing") %>%
  filter(n_missing > 0)

if (nrow(missing_relatives) > 0) {
  cat("\nMissing data in relatives (before exclusion):\n")
  print(missing_relatives)
}

# Apply complete case filtering to relatives
relatives_data_complete <- relatives_data %>% drop_na()

cat("\nAfter complete case filtering:\n")
cat("  Relatives with complete data: n =", nrow(relatives_data_complete), "\n")
cat("  Relatives excluded due to missing data:", 
    nrow(relatives_data) - nrow(relatives_data_complete), "\n\n")

cat("Final sample sizes:\n")
cat("  Training (complete cases): n =", nrow(training_data_complete), "\n")
cat("  Relatives (complete cases): n =", nrow(relatives_data_complete), "\n\n")

# ===============================================================================
# MACHINE LEARNING: RANDOM FOREST WITH 10-FOLD CROSS-VALIDATION
# ===============================================================================

cat("Running Random Forest classification...\n")

# Set parameters
metric <- "Accuracy"
preProcess <- "range"  # Scale variables to min=0 and max=1

# 10-fold cross-validation
control <- trainControl(
  method = "cv",
  number = 10,
  classProbs = TRUE,
  savePredictions = "final"
)

# Train Random Forest
set.seed(7)
fit.rf <- train(
  group ~ .,
  data = training_data_complete %>% select(-participant_id),
  method = "rf",
  metric = metric,
  trControl = control,
  preProcess = preProcess,
  tuneGrid = expand.grid(mtry = seq(2, 15))
)

cat("\nRandom Forest Results:\n")
print(fit.rf)
cat("\nBest mtry:", fit.rf$bestTune$mtry, "\n")
cat("Accuracy:", max(fit.rf$results$Accuracy), "\n\n")

# Variable importance
var_importance <- varImp(fit.rf)
cat("Variable Importance:\n")
print(var_importance)

# Plot variable importance
plot(var_importance, main = "Variable Importance - Random Forest")

# ===============================================================================
# ADDITIONAL CLASSIFIERS (not used here, but can uncomment to run additional classifiers)
# ===============================================================================

# # Linear Discriminant Analysis
# set.seed(7)
# fit.lda <- train(group~., data=training_data %>% select(-participant_id), 
#                  method="lda", metric=metric, trControl=control, preProcess=preProcess)
# 
# # k-Nearest Neighbors
# set.seed(7)
# fit.knn <- train(group~., data=training_data %>% select(-participant_id), 
#                  method="knn", metric=metric, trControl=control, preProcess=preProcess,
#                  tuneGrid = expand.grid(k = seq(3,29,2)))
# 
# # Support Vector Machine
# set.seed(7)
# fit.svm <- train(group~., data=training_data %>% select(-participant_id), 
#                  method="svmRadial", metric=metric, trControl=control, preProcess=preProcess,
#                  tuneGrid = expand.grid(sigma = c(0.01, 0.02, 0.03, 0.04, 0.05, .1, .2), 
#                                        C = c(0.01, 0.05, 0.1, .5, 1, 1.5, 3)))
# 
# # Compare models
# results <- resamples(list(lda=fit.lda, knn=fit.knn, svm=fit.svm, rf=fit.rf))
# summary(results)
# dotplot(results)

# ===============================================================================
# VARIABLE SELECTION WITH VSURF
# ===============================================================================

cat("Running VSURF variable selection...\n")

# Run VSURF for feature selection
RF.vsurf <- VSURF(
  training_data_complete %>% select(all_of(predictor_vars_ml)),
  training_data_complete$group
)

cat("\nVSURF Results:\n")
cat("Threshold step - variables selected:", length(RF.vsurf$varselect.thres), "\n")
cat("Variables:", predictor_vars_ml[RF.vsurf$varselect.thres], "\n\n")

cat("Interpretation step - variables selected:", length(RF.vsurf$varselect.interp), "\n")
cat("Variables:", predictor_vars_ml[RF.vsurf$varselect.interp], "\n\n")

cat("Prediction step - variables selected:", length(RF.vsurf$varselect.pred), "\n")
cat("Variables:", predictor_vars_ml[RF.vsurf$varselect.pred], "\n\n")

# Plot VSURF results
plot(RF.vsurf)

# ===============================================================================
# PREDICT RELATIVES CLASSIFICATION
# ===============================================================================

cat("Predicting relatives classification...\n")

# Get predictions for relatives (using complete cases only)
relatives_predictions <- predict(fit.rf, relatives_data_complete %>% select(-participant_id))
relatives_probabilities <- predict(fit.rf, relatives_data_complete %>% select(-participant_id), type = "prob")

# Combine results
relatives_results <- relatives_data_complete %>%
  select(participant_id) %>%
  mutate(
    predicted_group = relatives_predictions,
    prob_control = relatives_probabilities$controls,
    prob_synaesthete = relatives_probabilities$synaesthetes
  )

cat("\nRelatives Classification Results:\n")
cat("Classified as synaesthetes:", sum(relatives_predictions == "synaesthetes"), "\n")
cat("Classified as controls:", sum(relatives_predictions == "controls"), "\n")
cat("\nMean probability of synaesthete classification:", 
    mean(relatives_probabilities$synaesthetes), "\n\n")

# Display results
print(relatives_results)

# ===============================================================================
# MAHALANOBIS D CALCULATION
# ===============================================================================

cat("========================================\n")
cat("CALCULATING MAHALANOBIS D\n")
cat("========================================\n\n")

# Source the Del Giudice maha() function which is also in github repository
maha_script_path <- "<PATH_TO_REPO>/Multivariate/mahalanobis_D_bias_corrected.R"

if (file.exists(maha_script_path)) {
  source(maha_script_path)
  cat("Mahalanobis D functions loaded successfully!\n\n")
} else {
  cat("WARNING: Could not find mahalanobis_D_bias_corrected.R\n")
  cat("Please update the path in the script or source the file manually.\n")
  cat("Skipping Mahalanobis D calculations.\n\n")
  maha_available <- FALSE
}

if (exists("maha")) {
  maha_available <- TRUE
  
  # Prepare data matrices for Mahalanobis D (complete cases only)
  # NOTE: Using predictor_vars_maha which excludes synaesthesia-specific variables
  # (has_GCS, has_SSS, number_of_types have zero variance in controls/relatives so wouldn't work)
  
  control_matrix <- training_data_complete %>%
    filter(group == "controls") %>%
    select(all_of(predictor_vars_maha)) %>%
    as.data.frame()
  
  syn_matrix <- training_data_complete %>%
    filter(group == "synaesthetes") %>%
    select(all_of(predictor_vars_maha)) %>%
    as.data.frame()
  
  relatives_matrix <- relatives_data_complete %>%
    select(all_of(predictor_vars_maha)) %>%
    as.data.frame()
  
  cat("Sample sizes for Mahalanobis D:\n")
  cat("  Controls:", nrow(control_matrix), "\n")
  cat("  Synaesthetes:", nrow(syn_matrix), "\n")
  cat("  Relatives:", nrow(relatives_matrix), "\n\n")
  
  # ---------------------------------------------------------------
  # COMPARISON 1: Synaesthetes vs Controls
  # ---------------------------------------------------------------
  
  cat("COMPARISON 1: Synaesthetes vs Controls\n")
  cat("---------------------------------------\n")
  
  maha_syn_con <- maha(syn_matrix, control_matrix, 
                       conf.level = 0.95, boot.n = 5000, round.digits = 3)
  
  cat("D (uncorrected):", maha_syn_con$D, "\n")
  cat("Du (bias-corrected):", maha_syn_con$Du, "\n")
  cat("95% CI (bootstrap):", maha_syn_con$CI_boot_Du[1], "to", maha_syn_con$CI_boot_Du[2], "\n")
  cat("Tucker's CC (correlation similarity):", maha_syn_con$CC_cor, "\n")
  cat("OVL (overlap coefficient):", maha_syn_con$OVLu, "\n")
  cat("CL (common language effect size):", maha_syn_con$CLu, "\n")
  cat("PCC (probability of correct classification):", maha_syn_con$PCCu, "\n")
  cat("H2 (heterogeneity coefficient):", maha_syn_con$H2, "\n")
  cat("EPV2 (equivalent proportion of variables):", maha_syn_con$EPV2, "\n\n")
  
  # ---------------------------------------------------------------
  # COMPARISON 2: Relatives vs Controls
  # ---------------------------------------------------------------
  
  cat("COMPARISON 2: Relatives vs Controls\n")
  cat("------------------------------------\n")
  
  maha_rel_con <- maha(relatives_matrix, control_matrix, 
                       conf.level = 0.95, boot.n = 5000, round.digits = 3)
  
  cat("D (uncorrected):", maha_rel_con$D, "\n")
  cat("Du (bias-corrected):", maha_rel_con$Du, "\n")
  cat("95% CI (bootstrap):", maha_rel_con$CI_boot_Du[1], "to", maha_rel_con$CI_boot_Du[2], "\n")
  cat("Tucker's CC (correlation similarity):", maha_rel_con$CC_cor, "\n")
  cat("OVL (overlap coefficient):", maha_rel_con$OVLu, "\n")
  cat("CL (common language effect size):", maha_rel_con$CLu, "\n")
  cat("PCC (probability of correct classification):", maha_rel_con$PCCu, "\n")
  cat("H2 (heterogeneity coefficient):", maha_rel_con$H2, "\n")
  cat("EPV2 (equivalent proportion of variables):", maha_rel_con$EPV2, "\n\n")
  
  # ---------------------------------------------------------------
  # COMPARISON 3: Synaesthetes vs Relatives
  # ---------------------------------------------------------------
  
  cat("COMPARISON 3: Synaesthetes vs Relatives\n")
  cat("---------------------------------------\n")
  
  maha_syn_rel <- maha(syn_matrix, relatives_matrix, 
                       conf.level = 0.95, boot.n = 5000, round.digits = 3)
  
  cat("D (uncorrected):", maha_syn_rel$D, "\n")
  cat("Du (bias-corrected):", maha_syn_rel$Du, "\n")
  cat("95% CI (bootstrap):", maha_syn_rel$CI_boot_Du[1], "to", maha_syn_rel$CI_boot_Du[2], "\n")
  cat("Tucker's CC (correlation similarity):", maha_syn_rel$CC_cor, "\n")
  cat("OVL (overlap coefficient):", maha_syn_rel$OVLu, "\n")
  cat("CL (common language effect size):", maha_syn_rel$CLu, "\n")
  cat("PCC (probability of correct classification):", maha_syn_rel$PCCu, "\n")
  cat("H2 (heterogeneity coefficient):", maha_syn_rel$H2, "\n")
  cat("EPV2 (equivalent proportion of variables):", maha_syn_rel$EPV2, "\n\n")
  
  # ---------------------------------------------------------------
  # SUMMARY: More detail about relatives
  # ---------------------------------------------------------------
  
  cat("========================================\n")
  cat("SUMMARY: Relative Position of Relatives\n")
  cat("========================================\n\n")
  
  cat("Mahalanobis D (bias-corrected):\n")
  cat("  Synaesthetes vs Controls:  Du =", maha_syn_con$Du, "\n")
  cat("  Relatives vs Controls:     Du =", maha_rel_con$Du, "\n")
  cat("  Synaesthetes vs Relatives: Du =", maha_syn_rel$Du, "\n\n")
  
  # Calculate relative position
  # If relatives are intermediate, Du(rel-con) should be < Du(syn-con)
  # and Du(syn-rel) should be < Du(syn-con)
  
  rel_to_syn_ratio <- maha_rel_con$Du / maha_syn_con$Du
  syn_to_rel_ratio <- maha_syn_rel$Du / maha_syn_con$Du
  
  cat("Relative position metrics:\n")
  cat("  Relatives-Controls distance as % of Synaesthetes-Controls:", 
      round(rel_to_syn_ratio * 100, 1), "%\n")
  cat("  Synaesthetes-Relatives distance as % of Synaesthetes-Controls:", 
      round(syn_to_rel_ratio * 100, 1), "%\n\n")
  
  if (rel_to_syn_ratio < 0.5 && syn_to_rel_ratio < 0.5) {
    cat("INTERPRETATION: Relatives appear to be INTERMEDIATE between controls and synaesthetes,\n")
    cat("                but closer to controls.\n\n")
  } else if (rel_to_syn_ratio > 0.5 && syn_to_rel_ratio < 0.5) {
    cat("INTERPRETATION: Relatives appear to be INTERMEDIATE between controls and synaesthetes,\n")
    cat("                but closer to synaesthetes.\n\n")
  } else if (rel_to_syn_ratio < 0.3) {
    cat("INTERPRETATION: Relatives are very similar to controls.\n\n")
  } else if (syn_to_rel_ratio < 0.3) {
    cat("INTERPRETATION: Relatives are very similar to synaesthetes.\n\n")
  } else {
    cat("INTERPRETATION: Relatives show a complex pattern - examine individual metrics.\n\n")
  }
  
  # ---------------------------------------------------------------
  # UNIVARIATE EFFECT SIZES: I want to see which variables drive the differences
  # ---------------------------------------------------------------
  
  cat("========================================\n")
  cat("UNIVARIATE EFFECT SIZES (Cohen's d)\n")
  cat("========================================\n\n")
  
  # Extract the bias-corrected d values from each comparison
  d_syn_con <- maha_syn_con$du_values
  d_rel_con <- maha_rel_con$du_values
  d_syn_rel <- maha_syn_rel$du_values
  
  # Create a comparison table
  univariate_effects <- data.frame(
    Variable = predictor_vars_maha,
    Syn_vs_Con = round(d_syn_con, 3),
    Rel_vs_Con = round(d_rel_con, 3),
    Syn_vs_Rel = round(d_syn_rel, 3)
  )
  
  # Add interpretations (small/medium/large)
  interpret_d <- function(d) {
    abs_d <- abs(d)
    ifelse(abs_d < 0.2, "negligible",
           ifelse(abs_d < 0.5, "small",
                  ifelse(abs_d < 0.8, "medium", "large")))
  }
  
  univariate_effects$Syn_vs_Con_interp <- interpret_d(univariate_effects$Syn_vs_Con)
  univariate_effects$Rel_vs_Con_interp <- interpret_d(univariate_effects$Rel_vs_Con)
  univariate_effects$Syn_vs_Rel_interp <- interpret_d(univariate_effects$Syn_vs_Rel)
  
  cat("Cohen's d values (positive = first group higher):\n\n")
  print(univariate_effects, row.names = FALSE)
  
  cat("\n\nEffect size interpretation: |d| < 0.2 = negligible, 0.2-0.5 = small, 0.5-0.8 = medium, >0.8 = large\n\n")
  
  # Identify variables with largest effects for each comparison
  cat("========================================\n")
  cat("KEY VARIABLES DRIVING GROUP DIFFERENCES\n")
  cat("========================================\n\n")
  
  # Synaesthetes vs Controls
  syn_con_large <- univariate_effects %>%
    filter(abs(Syn_vs_Con) >= 0.5) %>%
    arrange(desc(abs(Syn_vs_Con)))
  
  cat("SYNAESTHETES vs CONTROLS (medium/large effects):\n")
  if (nrow(syn_con_large) > 0) {
    for (i in 1:nrow(syn_con_large)) {
      direction <- ifelse(syn_con_large$Syn_vs_Con[i] > 0, "higher", "lower")
      cat("  -", syn_con_large$Variable[i], ": d =", syn_con_large$Syn_vs_Con[i], 
          "(", syn_con_large$Syn_vs_Con_interp[i], ") - synaesthetes", direction, "\n")
    }
  } else {
    cat("  No medium or large effects\n")
  }
  cat("\n")
  
  # Relatives vs Controls
  rel_con_large <- univariate_effects %>%
    filter(abs(Rel_vs_Con) >= 0.5) %>%
    arrange(desc(abs(Rel_vs_Con)))
  
  cat("RELATIVES vs CONTROLS (medium/large effects):\n")
  if (nrow(rel_con_large) > 0) {
    for (i in 1:nrow(rel_con_large)) {
      direction <- ifelse(rel_con_large$Rel_vs_Con[i] > 0, "higher", "lower")
      cat("  -", rel_con_large$Variable[i], ": d =", rel_con_large$Rel_vs_Con[i], 
          "(", rel_con_large$Rel_vs_Con_interp[i], ") - relatives", direction, "\n")
    }
  } else {
    cat("  No medium or large effects\n")
  }
  cat("\n")
  
  # Synaesthetes vs Relatives
  syn_rel_large <- univariate_effects %>%
    filter(abs(Syn_vs_Rel) >= 0.5) %>%
    arrange(desc(abs(Syn_vs_Rel)))
  
  cat("SYNAESTHETES vs RELATIVES (medium/large effects):\n")
  if (nrow(syn_rel_large) > 0) {
    for (i in 1:nrow(syn_rel_large)) {
      direction <- ifelse(syn_rel_large$Syn_vs_Rel[i] > 0, "higher", "lower")
      cat("  -", syn_rel_large$Variable[i], ": d =", syn_rel_large$Syn_vs_Rel[i], 
          "(", syn_rel_large$Syn_vs_Rel_interp[i], ") - synaesthetes", direction, "\n")
    }
  } else {
    cat("  No medium or large effects\n")
  }
  cat("\n")
  
  # Pattern analysis
  cat("========================================\n")
  cat("PATTERN ANALYSIS\n")
  cat("========================================\n\n")
  
  # Check for endophenotype pattern (relatives intermediate)
  intermediate_vars <- c()
  for (var in predictor_vars_maha) {
    d_sc <- univariate_effects$Syn_vs_Con[univariate_effects$Variable == var]
    d_rc <- univariate_effects$Rel_vs_Con[univariate_effects$Variable == var]
    d_sr <- univariate_effects$Syn_vs_Rel[univariate_effects$Variable == var]
    
    # Intermediate means: |d_rc| < |d_sc| AND |d_sr| < |d_sc|
    # AND d_rc and d_sr have the same sign as d_sc
    if (abs(d_rc) < abs(d_sc) && abs(d_sr) < abs(d_sc) && 
        sign(d_rc) == sign(d_sc) && sign(d_sr) == sign(d_sc)) {
      intermediate_vars <- c(intermediate_vars, var)
    }
  }
  
  cat("Variables showing endophenotype pattern (relatives intermediate):\n")
  if (length(intermediate_vars) > 0) {
    for (var in intermediate_vars) {
      cat("  -", var, "\n")
    }
  } else {
    cat("  None\n")
  }
  cat("\n")
  
  # Check for unique relative pattern (relatives different from both)
  unique_rel_vars <- c()
  for (var in predictor_vars_maha) {
    d_sc <- univariate_effects$Syn_vs_Con[univariate_effects$Variable == var]
    d_rc <- univariate_effects$Rel_vs_Con[univariate_effects$Variable == var]
    d_sr <- univariate_effects$Syn_vs_Rel[univariate_effects$Variable == var]
    
    # Unique pattern means relatives differ from both (large effects with both)
    if (abs(d_rc) >= 0.5 && abs(d_sr) >= 0.5) {
      unique_rel_vars <- c(unique_rel_vars, var)
    }
  }
  
  cat("Variables showing unique pattern (relatives differ from both groups):\n")
  if (length(unique_rel_vars) > 0) {
    for (var in unique_rel_vars) {
      cat("  -", var, "\n")
    }
  } else {
    cat("  None\n")
  }
  cat("\n")
  
  # Save univariate effects
  write.csv(univariate_effects,
            "<PATH_TO_DATA>/univariate_effect_sizes.csv",
            row.names = FALSE)
  
  cat("Univariate effect sizes saved to univariate_effect_sizes.csv\n\n")
  
  # Save Mahalanobis D results
  maha_summary <- data.frame(
    Comparison = c("Synaesthetes vs Controls", 
                   "Relatives vs Controls", 
                   "Synaesthetes vs Relatives"),
    D_uncorrected = c(maha_syn_con$D, maha_rel_con$D, maha_syn_rel$D),
    Du_bias_corrected = c(maha_syn_con$Du, maha_rel_con$Du, maha_syn_rel$Du),
    CI_lower = c(maha_syn_con$CI_boot_Du[1], maha_rel_con$CI_boot_Du[1], maha_syn_rel$CI_boot_Du[1]),
    CI_upper = c(maha_syn_con$CI_boot_Du[2], maha_rel_con$CI_boot_Du[2], maha_syn_rel$CI_boot_Du[2]),
    Tuckers_CC = c(maha_syn_con$CC_cor, maha_rel_con$CC_cor, maha_syn_rel$CC_cor),
    OVL = c(maha_syn_con$OVLu, maha_rel_con$OVLu, maha_syn_rel$OVLu),
    CL = c(maha_syn_con$CLu, maha_rel_con$CLu, maha_syn_rel$CLu),
    PCC = c(maha_syn_con$PCCu, maha_rel_con$PCCu, maha_syn_rel$PCCu),
    H2 = c(maha_syn_con$H2, maha_rel_con$H2, maha_syn_rel$H2),
    EPV2 = c(maha_syn_con$EPV2, maha_rel_con$EPV2, maha_syn_rel$EPV2)
  )
  
  write.csv(maha_summary,
            "<PATH_TO_DATA>/mahalanobis_D_summary.csv",
            row.names = FALSE)
  
  cat("Mahalanobis D results saved!\n\n")
  
} else {
  cat("Mahalanobis D function not available. Skipping calculations.\n\n")
}

# ===============================================================================
# SAVE RESULTS
# ===============================================================================

cat("Saving results...\n")

# Save relatives classification results
write.csv(relatives_results, 
          "<PATH_TO_DATA>/relatives_classification_results.csv",
          row.names = FALSE)

# Save variable importance
var_imp_df <- data.frame(
  variable = rownames(var_importance$importance),
  importance = var_importance$importance$Overall
) %>%
  arrange(desc(importance))

write.csv(var_imp_df,
          "<PATH_TO_DATA>/variable_importance.csv",
          row.names = FALSE)

# Save model performance summary
model_summary <- data.frame(
  Metric = c("Accuracy", "Kappa", "Best_mtry", 
             "Relatives_classified_as_syn_N", 
             "Relatives_classified_as_syn_percent",
             "Mean_prob_syn_for_relatives"),
  Value = c(
    max(fit.rf$results$Accuracy),
    max(fit.rf$results$Kappa),
    fit.rf$bestTune$mtry,
    sum(relatives_predictions == "synaesthetes"),
    100 * mean(relatives_predictions == "synaesthetes"),
    mean(relatives_probabilities$synaesthetes)
  )
)

write.csv(model_summary,
          "<PATH_TO_DATA>/model_performance_summary.csv",
          row.names = FALSE)

cat("\nAll results saved successfully!\n")
cat("\nFiles created:\n")
cat("  - relatives_classification_results.csv\n")
cat("  - variable_importance.csv\n")
cat("  - model_performance_summary.csv\n")
if (exists("maha_available") && maha_available) {
  cat("  - mahalanobis_D_summary.csv\n")
  cat("  - univariate_effect_sizes.csv\n")
}