library(dplyr)
library(readr)
library(readxl)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# --- Load Bayes-factor function (Dienes, 2019) ---
source("<PATH_TO_REPO>/Bayesian/bayes_factor_function.R")

# Load subtype information
subtype_data <- read_excel("<PATH_TO_PARTICIPANTS>/observation_list.xlsx")
subtype_data$participant_id <- as.character(subtype_data$participant_id)

# Initialize results dataframe for Bayesian analysis
results_df <- data.frame(
  Task = character(),
  Group_Comparison = character(),
  Condition = character(),
  Load_STM = character(),
  M1 = numeric(),
  M2 = numeric(),
  t_df = character(),
  p = character(),
  BF = character(),
  Interpretation = character(),
  stringsAsFactors = FALSE
)

# Initialize descriptive statistics dataframe
descriptive_df <- data.frame(
  Task = character(),
  Group = character(),
  Mean_Colour_SD = character(),
  Mean_Location_SD = character(),
  N_Colour = integer(),
  N_Location = integer(),
  stringsAsFactors = FALSE
)

# Function to prepare synaesthete data with subtypes
prepare_syn_data <- function(data) {
  data$participant_id <- as.character(data$participant_id)
  data <- data %>%
    left_join(subtype_data, by = "participant_id") %>%
    mutate(
      subtype_group = case_when(
        has_GCS == 1 & has_SSS == 0 ~ "GCS_only",
        has_GCS == 0 & has_SSS == 1 ~ "SSS_only",
        has_GCS == 1 & has_SSS == 1 ~ "GCS_SSS",
        TRUE ~ NA_character_
      )
    )
  return(data)
}

# Function to apply z-score filtering AFTER participant averaging
apply_zscore_after_averaging <- function(averaged_data, measure_col, group_col = "group") {
  averaged_data %>%
    group_by(!!sym(group_col)) %>%
    mutate(
      z_score = (!!sym(measure_col) - mean(!!sym(measure_col), na.rm = TRUE)) /
        sd(!!sym(measure_col), na.rm = TRUE)
    ) %>%
    ungroup() %>%
    filter(is.na(z_score) | z_score <= 2.5) %>%
    select(-z_score)
}

# Function to run t-test and calculate Bayes Factor
run_comparison <- function(group1_data, group2_data, measure_name) {
  t_result <- t.test(group1_data, group2_data)
  
  semdiff <- t_result$stderr
  group2_mean <- t_result$estimate[2]
  group1_mean <- t_result$estimate[1]
  observed_diff <- group2_mean - group1_mean
  df_values <- t_result$parameter
  
  bf_value <- Bf(sd=semdiff, obtained=observed_diff, dfdata=df_values,
                 likelihood="normal", modeoftheory=0, scaleoftheory=group2_mean,
                 modeloftheory="normal", tail=1)
  
  if (bf_value >= 100) {
    interpretation <- "Decisive (effect)"
  } else if (bf_value >= 30) {
    interpretation <- "Very strong (effect)"
  } else if (bf_value >= 10) {
    interpretation <- "Strong (effect)"
  } else if (bf_value >= 6) {
    interpretation <- "Substantial (effect)"
  } else if (bf_value > 0.167) {
    interpretation <- "Inconclusive"
  } else if (bf_value > 0.10) {
    interpretation <- "Substantial (null)"
  } else if (bf_value > 0.033) {
    interpretation <- "Strong (null)"
  } else if (bf_value >= 0.01) {
    interpretation <- "Very strong (null)"
  } else {
    interpretation <- "Decisive (null)"
  }
  
  return(list(
    M1 = group1_mean,
    M2 = group2_mean,
    t_stat = t_result$statistic,
    df = df_values,
    p = t_result$p.value,
    BF = bf_value,
    interpretation = interpretation
  ))
}

# Function to add result to Bayesian dataframe
add_result <- function(task, comparison_name, condition, result, load = NA) {
  p_formatted <- ifelse(result$p < .001, "<.001", sprintf("%.3f", result$p))
  
  if (result$BF > 1e6) {
    bf_formatted <- sprintf("%.2e", result$BF)
  } else {
    bf_formatted <- sprintf("%.2f", result$BF)
  }
  
  load_formatted <- ifelse(is.na(load), "—", as.character(load))
  
  t_df_formatted <- sprintf(
    "%.2f (%.2f)",
    round(result$t_stat, 2),
    round(result$df, 2)
  )
  
  new_row <- data.frame(
    Task = task,
    Group_Comparison = comparison_name,
    Condition = condition,
    Load_STM = load_formatted,
    M1 = round(result$M1, 2),
    M2 = round(result$M2, 2),
    t_df = t_df_formatted,
    p = p_formatted,
    BF = bf_formatted,
    Interpretation = result$interpretation,
    stringsAsFactors = FALSE
  )
  
  results_df <<- rbind(results_df, new_row)
}

# Function to add descriptive statistics
add_descriptive_stats <- function(task, group_name, colour_data, location_data, load = NA) {
  task_label <- if (is.na(load)) {
    task
  } else {
    paste0(task, " (Load ", load, ")")
  }
  
  mean_colour <- mean(colour_data, na.rm = TRUE)
  sd_colour <- sd(colour_data, na.rm = TRUE)
  n_colour <- length(colour_data)
  
  mean_location <- mean(location_data, na.rm = TRUE)
  sd_location <- sd(location_data, na.rm = TRUE)
  n_location <- length(location_data)
  
  new_row <- data.frame(
    Task = task_label,
    Group = group_name,
    Mean_Colour_SD = sprintf("%.2f (%.2f)", mean_colour, sd_colour),
    Mean_Location_SD = sprintf("%.2f (%.2f)", mean_location, sd_location),
    N_Colour = n_colour,
    N_Location = n_location,
    stringsAsFactors = FALSE
  )
  
  descriptive_df <<- rbind(descriptive_df, new_row)
}

# ============================================================================
# VP ANALYSIS
# ============================================================================
cat("Processing VP data...\n")

syn_VP <- read.csv("<PATH_TO_DATA>/Synaesthetes/VP.csv")
syn_VP <- filter_exclusions(syn_VP)
syn_VP <- prepare_syn_data(syn_VP)

con_VP <- read.csv("<PATH_TO_DATA>/Controls/VP.csv")
con_VP <- filter_exclusions(con_VP)

rel_VP <- read.csv("<PATH_TO_DATA>/Relatives/VP.csv")
rel_VP <- filter_exclusions(rel_VP)

syn_VP$group <- "Synaesthete"
con_VP$group <- "Control"
rel_VP$group <- "Relative"

colour_syn_all_raw <- syn_VP %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
            .groups = 'drop') %>%
  mutate(group = "Synaesthete")

colour_con_raw <- con_VP %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
            .groups = 'drop') %>%
  mutate(group = "Control")

colour_rel_raw <- rel_VP %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
            .groups = 'drop') %>%
  mutate(group = "Relative")

location_syn_all_raw <- syn_VP %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
            .groups = 'drop') %>%
  mutate(group = "Synaesthete")

location_con_raw <- con_VP %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
            .groups = 'drop') %>%
  mutate(group = "Control")

location_rel_raw <- rel_VP %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
            .groups = 'drop') %>%
  mutate(group = "Relative")

combined_colour <- bind_rows(colour_syn_all_raw, colour_con_raw, colour_rel_raw)
combined_colour_filtered <- apply_zscore_after_averaging(combined_colour, "colour_angle_abs_deviation", "group")

combined_location <- bind_rows(location_syn_all_raw, location_con_raw, location_rel_raw)
combined_location_filtered <- apply_zscore_after_averaging(combined_location, "location_angle_abs_deviation", "group")

colour_syn_all <- combined_colour_filtered %>% filter(group == "Synaesthete")
colour_con <- combined_colour_filtered %>% filter(group == "Control")
colour_rel <- combined_colour_filtered %>% filter(group == "Relative")

location_syn_all <- combined_location_filtered %>% filter(group == "Synaesthete")
location_con <- combined_location_filtered %>% filter(group == "Control")
location_rel <- combined_location_filtered %>% filter(group == "Relative")

syn_VP_with_subtypes <- syn_VP %>% filter(!is.na(subtype_group))

colour_syn_gc <- colour_syn_all %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
colour_syn_ss <- colour_syn_all %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
colour_syn_both <- colour_syn_all %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")

location_syn_gc <- location_syn_all %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
location_syn_ss <- location_syn_all %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
location_syn_both <- location_syn_all %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")

add_descriptive_stats("VP", "Syn (all)", colour_syn_all$colour_angle_abs_deviation, location_syn_all$location_angle_abs_deviation)
add_descriptive_stats("VP", "Syn (GC)", colour_syn_gc$colour_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation)
add_descriptive_stats("VP", "Syn (SS)", colour_syn_ss$colour_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation)
add_descriptive_stats("VP", "Syn (GC+SS)", colour_syn_both$colour_angle_abs_deviation, location_syn_both$location_angle_abs_deviation)
add_descriptive_stats("VP", "Con", colour_con$colour_angle_abs_deviation, location_con$location_angle_abs_deviation)
add_descriptive_stats("VP", "Rel", colour_rel$colour_angle_abs_deviation, location_rel$location_angle_abs_deviation)

result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "VP Colour")
add_result("VP", "Syn (all) vs Con", "Colour", result)
result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "VP Location")
add_result("VP", "Syn (all) vs Con", "Location", result)

result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "VP Colour GC")
add_result("VP", "Syn (GC) vs Con", "Colour", result)
result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "VP Location GC")
add_result("VP", "Syn (GC) vs Con", "Location", result)

result <- run_comparison(colour_syn_ss$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "VP Colour SS")
add_result("VP", "Syn (SS) vs Con", "Colour", result)
result <- run_comparison(location_syn_ss$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "VP Location SS")
add_result("VP", "Syn (SS) vs Con", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "VP Colour Both")
add_result("VP", "Syn (GC+SS) vs Con", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "VP Location Both")
add_result("VP", "Syn (GC+SS) vs Con", "Location", result)

result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "VP Colour")
add_result("VP", "Syn (GC) vs Syn (SS)", "Colour", result)
result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "VP Location")
add_result("VP", "Syn (GC) vs Syn (SS)", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_gc$colour_angle_abs_deviation, "VP Colour")
add_result("VP", "Syn (GC+SS) vs Syn (GC)", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation, "VP Location")
add_result("VP", "Syn (GC+SS) vs Syn (GC)", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "VP Colour")
add_result("VP", "Syn (GC+SS) vs Syn (SS)", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "VP Location")
add_result("VP", "Syn (GC+SS) vs Syn (SS)", "Location", result)

result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_rel$colour_angle_abs_deviation, "VP Colour")
add_result("VP", "Syn (all) vs Rel", "Colour", result)
result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_rel$location_angle_abs_deviation, "VP Location")
add_result("VP", "Syn (all) vs Rel", "Location", result)

result <- run_comparison(colour_rel$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "VP Colour")
add_result("VP", "Rel vs Con", "Colour", result)
result <- run_comparison(location_rel$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "VP Location")
add_result("VP", "Rel vs Con", "Location", result)

# ============================================================================
# STM ANALYSIS
# ============================================================================
cat("Processing STM data...\n")

syn_STM <- read.csv("<PATH_TO_DATA>/Synaesthetes/STM.csv")
syn_STM <- filter_exclusions(syn_STM)
syn_STM <- prepare_syn_data(syn_STM)

con_STM <- read.csv("<PATH_TO_DATA>/Controls/STM.csv")
con_STM <- filter_exclusions(con_STM)

rel_STM <- read.csv("<PATH_TO_DATA>/Relatives/STM.csv")
rel_STM <- filter_exclusions(rel_STM)

syn_STM$group <- "Synaesthete"
con_STM$group <- "Control"
rel_STM$group <- "Relative"

for (load in c(1, 3, 5)) {
  colour_syn_all_raw <- syn_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
    mutate(group = "Synaesthete")
  
  colour_con_raw <- con_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
    mutate(group = "Control")
  
  colour_rel_raw <- rel_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
    mutate(group = "Relative")
  
  location_syn_all_raw <- syn_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
    mutate(group = "Synaesthete")
  
  location_con_raw <- con_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
    mutate(group = "Control")
  
  location_rel_raw <- rel_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
    mutate(group = "Relative")
  
  combined_colour <- bind_rows(colour_syn_all_raw, colour_con_raw, colour_rel_raw)
  combined_colour_filtered <- apply_zscore_after_averaging(combined_colour, "colour_angle_abs_deviation", "group")
  
  combined_location <- bind_rows(location_syn_all_raw, location_con_raw, location_rel_raw)
  combined_location_filtered <- apply_zscore_after_averaging(combined_location, "location_angle_abs_deviation", "group")
  
  colour_syn_all <- combined_colour_filtered %>% filter(group == "Synaesthete")
  colour_con <- combined_colour_filtered %>% filter(group == "Control")
  colour_rel <- combined_colour_filtered %>% filter(group == "Relative")
  
  location_syn_all <- combined_location_filtered %>% filter(group == "Synaesthete")
  location_con <- combined_location_filtered %>% filter(group == "Control")
  location_rel <- combined_location_filtered %>% filter(group == "Relative")
  
  syn_STM_with_subtypes <- syn_STM %>% filter(load_n == load, !is.na(subtype_group))
  
  colour_syn_gc <- colour_syn_all %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
  colour_syn_ss <- colour_syn_all %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
  colour_syn_both <- colour_syn_all %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")
  
  location_syn_gc <- location_syn_all %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
  location_syn_ss <- location_syn_all %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
  location_syn_both <- location_syn_all %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")
  
  add_descriptive_stats("STM", "Syn (all)", colour_syn_all$colour_angle_abs_deviation, location_syn_all$location_angle_abs_deviation, load)
  add_descriptive_stats("STM", "Syn (GC)", colour_syn_gc$colour_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation, load)
  add_descriptive_stats("STM", "Syn (SS)", colour_syn_ss$colour_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, load)
  add_descriptive_stats("STM", "Syn (GC+SS)", colour_syn_both$colour_angle_abs_deviation, location_syn_both$location_angle_abs_deviation, load)
  add_descriptive_stats("STM", "Con", colour_con$colour_angle_abs_deviation, location_con$location_angle_abs_deviation, load)
  add_descriptive_stats("STM", "Rel", colour_rel$colour_angle_abs_deviation, location_rel$location_angle_abs_deviation, load)
  
  result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "STM Colour")
  add_result("STM", "Syn (all) vs Con", "Colour", result, load)
  result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "STM Location")
  add_result("STM", "Syn (all) vs Con", "Location", result, load)
  
  result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "STM Colour GC")
  add_result("STM", "Syn (GC) vs Con", "Colour", result, load)
  result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "STM Location GC")
  add_result("STM", "Syn (GC) vs Con", "Location", result, load)
  
  result <- run_comparison(colour_syn_ss$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "STM Colour SS")
  add_result("STM", "Syn (SS) vs Con", "Colour", result, load)
  result <- run_comparison(location_syn_ss$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "STM Location SS")
  add_result("STM", "Syn (SS) vs Con", "Location", result, load)
  
  result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "STM Colour Both")
  add_result("STM", "Syn (GC+SS) vs Con", "Colour", result, load)
  result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "STM Location Both")
  add_result("STM", "Syn (GC+SS) vs Con", "Location", result, load)
  
  result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "STM Colour")
  add_result("STM", "Syn (GC) vs Syn (SS)", "Colour", result, load)
  result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "STM Location")
  add_result("STM", "Syn (GC) vs Syn (SS)", "Location", result, load)
  
  result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_gc$colour_angle_abs_deviation, "STM Colour")
  add_result("STM", "Syn (GC+SS) vs Syn (GC)", "Colour", result, load)
  result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation, "STM Location")
  add_result("STM", "Syn (GC+SS) vs Syn (GC)", "Location", result, load)
  
  result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "STM Colour")
  add_result("STM", "Syn (GC+SS) vs Syn (SS)", "Colour", result, load)
  result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "STM Location")
  add_result("STM", "Syn (GC+SS) vs Syn (SS)", "Location", result, load)
  
  result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_rel$colour_angle_abs_deviation, "STM Colour")
  add_result("STM", "Syn (all) vs Rel", "Colour", result, load)
  result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_rel$location_angle_abs_deviation, "STM Location")
  add_result("STM", "Syn (all) vs Rel", "Location", result, load)
  
  result <- run_comparison(colour_rel$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "STM Colour")
  add_result("STM", "Rel vs Con", "Colour", result, load)
  result <- run_comparison(location_rel$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "STM Location")
  add_result("STM", "Rel vs Con", "Location", result, load)
}

# ============================================================================
# LTMI ANALYSIS
# ============================================================================
cat("Processing LTMI data...\n")

syn_LTMI <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")
syn_LTMI <- filter_exclusions(syn_LTMI)
syn_LTMI <- prepare_syn_data(syn_LTMI)

con_LTMI <- read.csv("<PATH_TO_DATA>/Controls/LTMI.csv")
con_LTMI <- filter_exclusions(con_LTMI)

rel_LTMI <- read.csv("<PATH_TO_DATA>/Relatives/LTMI.csv")
rel_LTMI <- filter_exclusions(rel_LTMI)

syn_LTMI$group <- "Synaesthete"
con_LTMI$group <- "Control"
rel_LTMI$group <- "Relative"

# STEP 1: Rep-4 averages for exclusion decisions
colour_syn_all_rep4 <- syn_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Synaesthete")

colour_con_rep4 <- con_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Control")

colour_rel_rep4 <- rel_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Relative")

location_syn_all_rep4 <- syn_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Synaesthete")

location_con_rep4 <- con_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Control")

location_rel_rep4 <- rel_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Relative")

# Get participant IDs to keep based on rep 4 z-score filtering
combined_colour_rep4 <- bind_rows(colour_syn_all_rep4, colour_con_rep4, colour_rel_rep4)
combined_colour_rep4_filtered <- apply_zscore_after_averaging(combined_colour_rep4, "colour_angle_abs_deviation", "group")
keep_ids_colour <- combined_colour_rep4_filtered %>% select(participant_id, group)

combined_location_rep4 <- bind_rows(location_syn_all_rep4, location_con_rep4, location_rel_rep4)
combined_location_rep4_filtered <- apply_zscore_after_averaging(combined_location_rep4, "location_angle_abs_deviation", "group")
keep_ids_location <- combined_location_rep4_filtered %>% select(participant_id, group)

# STEP 2: All-reps averages (1-4) as actual DVs
colour_syn_all_raw <- syn_LTMI %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Synaesthete")

colour_con_raw <- con_LTMI %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Control")

colour_rel_raw <- rel_LTMI %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Relative")

location_syn_all_raw <- syn_LTMI %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Synaesthete")

location_con_raw <- con_LTMI %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Control")

location_rel_raw <- rel_LTMI %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Relative")

# Apply exclusions from rep 4 to all-reps DVs
combined_colour <- bind_rows(colour_syn_all_raw, colour_con_raw, colour_rel_raw) %>%
  semi_join(keep_ids_colour, by = c("participant_id", "group"))

combined_location <- bind_rows(location_syn_all_raw, location_con_raw, location_rel_raw) %>%
  semi_join(keep_ids_location, by = c("participant_id", "group"))

colour_syn_all <- combined_colour %>% filter(group == "Synaesthete")
colour_con <- combined_colour %>% filter(group == "Control")
colour_rel <- combined_colour %>% filter(group == "Relative")

location_syn_all <- combined_location %>% filter(group == "Synaesthete")
location_con <- combined_location %>% filter(group == "Control")
location_rel <- combined_location %>% filter(group == "Relative")

syn_LTMI_with_subtypes <- syn_LTMI %>% filter(!is.na(subtype_group))

colour_syn_gc <- colour_syn_all %>%
  inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
colour_syn_ss <- colour_syn_all %>%
  inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
colour_syn_both <- colour_syn_all %>%
  inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")

location_syn_gc <- location_syn_all %>%
  inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
location_syn_ss <- location_syn_all %>%
  inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
location_syn_both <- location_syn_all %>%
  inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")

add_descriptive_stats("LTMI", "Syn (all)", colour_syn_all$colour_angle_abs_deviation, location_syn_all$location_angle_abs_deviation)
add_descriptive_stats("LTMI", "Syn (GC)", colour_syn_gc$colour_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation)
add_descriptive_stats("LTMI", "Syn (SS)", colour_syn_ss$colour_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation)
add_descriptive_stats("LTMI", "Syn (GC+SS)", colour_syn_both$colour_angle_abs_deviation, location_syn_both$location_angle_abs_deviation)
add_descriptive_stats("LTMI", "Con", colour_con$colour_angle_abs_deviation, location_con$location_angle_abs_deviation)
add_descriptive_stats("LTMI", "Rel", colour_rel$colour_angle_abs_deviation, location_rel$location_angle_abs_deviation)

result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMI Colour")
add_result("LTMI", "Syn (all) vs Con", "Colour", result)
result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMI Location")
add_result("LTMI", "Syn (all) vs Con", "Location", result)

result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMI Colour GC")
add_result("LTMI", "Syn (GC) vs Con", "Colour", result)
result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMI Location GC")
add_result("LTMI", "Syn (GC) vs Con", "Location", result)

result <- run_comparison(colour_syn_ss$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMI Colour SS")
add_result("LTMI", "Syn (SS) vs Con", "Colour", result)
result <- run_comparison(location_syn_ss$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMI Location SS")
add_result("LTMI", "Syn (SS) vs Con", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMI Colour Both")
add_result("LTMI", "Syn (GC+SS) vs Con", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMI Location Both")
add_result("LTMI", "Syn (GC+SS) vs Con", "Location", result)

result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "LTMI Colour")
add_result("LTMI", "Syn (GC) vs Syn (SS)", "Colour", result)
result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "LTMI Location")
add_result("LTMI", "Syn (GC) vs Syn (SS)", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_gc$colour_angle_abs_deviation, "LTMI Colour")
add_result("LTMI", "Syn (GC+SS) vs Syn (GC)", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation, "LTMI Location")
add_result("LTMI", "Syn (GC+SS) vs Syn (GC)", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "LTMI Colour")
add_result("LTMI", "Syn (GC+SS) vs Syn (SS)", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "LTMI Location")
add_result("LTMI", "Syn (GC+SS) vs Syn (SS)", "Location", result)

result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_rel$colour_angle_abs_deviation, "LTMI Colour")
add_result("LTMI", "Syn (all) vs Rel", "Colour", result)
result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_rel$location_angle_abs_deviation, "LTMI Location")
add_result("LTMI", "Syn (all) vs Rel", "Location", result)

result <- run_comparison(colour_rel$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMI Colour")
add_result("LTMI", "Rel vs Con", "Colour", result)
result <- run_comparison(location_rel$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMI Location")
add_result("LTMI", "Rel vs Con", "Location", result)

# ============================================================================
# LTMD ANALYSIS
# ============================================================================
cat("Processing LTMD data...\n")

syn_LTMD <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMD.csv")
syn_LTMD <- filter_exclusions(syn_LTMD)
syn_LTMD <- prepare_syn_data(syn_LTMD)

con_LTMD <- read.csv("<PATH_TO_DATA>/Controls/LTMD.csv")
con_LTMD <- filter_exclusions(con_LTMD)

rel_LTMD <- read.csv("<PATH_TO_DATA>/Relatives/LTMD.csv")
rel_LTMD <- filter_exclusions(rel_LTMD)

syn_LTMD$group <- "Synaesthete"
con_LTMD$group <- "Control"
rel_LTMD$group <- "Relative"

colour_syn_all_raw <- syn_LTMD %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Synaesthete")

colour_con_raw <- con_LTMD %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Control")

colour_rel_raw <- rel_LTMD %>%
  group_by(participant_id) %>%
  summarize(colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Relative")

location_syn_all_raw <- syn_LTMD %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Synaesthete")

location_con_raw <- con_LTMD %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Control")

location_rel_raw <- rel_LTMD %>%
  group_by(participant_id) %>%
  summarize(location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop') %>%
  mutate(group = "Relative")

combined_colour <- bind_rows(colour_syn_all_raw, colour_con_raw, colour_rel_raw)
combined_colour_filtered <- apply_zscore_after_averaging(combined_colour, "colour_angle_abs_deviation", "group")

combined_location <- bind_rows(location_syn_all_raw, location_con_raw, location_rel_raw)
combined_location_filtered <- apply_zscore_after_averaging(combined_location, "location_angle_abs_deviation", "group")

colour_syn_all <- combined_colour_filtered %>% filter(group == "Synaesthete")
colour_con <- combined_colour_filtered %>% filter(group == "Control")
colour_rel <- combined_colour_filtered %>% filter(group == "Relative")

location_syn_all <- combined_location_filtered %>% filter(group == "Synaesthete")
location_con <- combined_location_filtered %>% filter(group == "Control")
location_rel <- combined_location_filtered %>% filter(group == "Relative")

syn_LTMD_with_subtypes <- syn_LTMD %>% filter(!is.na(subtype_group))

colour_syn_gc <- colour_syn_all %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
colour_syn_ss <- colour_syn_all %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
colour_syn_both <- colour_syn_all %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")

location_syn_gc <- location_syn_all %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
location_syn_ss <- location_syn_all %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "SSS_only") %>% select(participant_id) %>% distinct(), by = "participant_id")
location_syn_both <- location_syn_all %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>% select(participant_id) %>% distinct(), by = "participant_id")

add_descriptive_stats("LTMD", "Syn (all)", colour_syn_all$colour_angle_abs_deviation, location_syn_all$location_angle_abs_deviation)
add_descriptive_stats("LTMD", "Syn (GC)", colour_syn_gc$colour_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation)
add_descriptive_stats("LTMD", "Syn (SS)", colour_syn_ss$colour_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation)
add_descriptive_stats("LTMD", "Syn (GC+SS)", colour_syn_both$colour_angle_abs_deviation, location_syn_both$location_angle_abs_deviation)
add_descriptive_stats("LTMD", "Con", colour_con$colour_angle_abs_deviation, location_con$location_angle_abs_deviation)
add_descriptive_stats("LTMD", "Rel", colour_rel$colour_angle_abs_deviation, location_rel$location_angle_abs_deviation)

result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMD Colour")
add_result("LTMD", "Syn (all) vs Con", "Colour", result)
result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMD Location")
add_result("LTMD", "Syn (all) vs Con", "Location", result)

result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMD Colour GC")
add_result("LTMD", "Syn (GC) vs Con", "Colour", result)
result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMD Location GC")
add_result("LTMD", "Syn (GC) vs Con", "Location", result)

result <- run_comparison(colour_syn_ss$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMD Colour SS")
add_result("LTMD", "Syn (SS) vs Con", "Colour", result)
result <- run_comparison(location_syn_ss$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMD Location SS")
add_result("LTMD", "Syn (SS) vs Con", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMD Colour Both")
add_result("LTMD", "Syn (GC+SS) vs Con", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMD Location Both")
add_result("LTMD", "Syn (GC+SS) vs Con", "Location", result)

result <- run_comparison(colour_syn_gc$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "LTMD Colour")
add_result("LTMD", "Syn (GC) vs Syn (SS)", "Colour", result)
result <- run_comparison(location_syn_gc$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "LTMD Location")
add_result("LTMD", "Syn (GC) vs Syn (SS)", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_gc$colour_angle_abs_deviation, "LTMD Colour")
add_result("LTMD", "Syn (GC+SS) vs Syn (GC)", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_gc$location_angle_abs_deviation, "LTMD Location")
add_result("LTMD", "Syn (GC+SS) vs Syn (GC)", "Location", result)

result <- run_comparison(colour_syn_both$colour_angle_abs_deviation, colour_syn_ss$colour_angle_abs_deviation, "LTMD Colour")
add_result("LTMD", "Syn (GC+SS) vs Syn (SS)", "Colour", result)
result <- run_comparison(location_syn_both$location_angle_abs_deviation, location_syn_ss$location_angle_abs_deviation, "LTMD Location")
add_result("LTMD", "Syn (GC+SS) vs Syn (SS)", "Location", result)

result <- run_comparison(colour_syn_all$colour_angle_abs_deviation, colour_rel$colour_angle_abs_deviation, "LTMD Colour")
add_result("LTMD", "Syn (all) vs Rel", "Colour", result)
result <- run_comparison(location_syn_all$location_angle_abs_deviation, location_rel$location_angle_abs_deviation, "LTMD Location")
add_result("LTMD", "Syn (all) vs Rel", "Location", result)

result <- run_comparison(colour_rel$colour_angle_abs_deviation, colour_con$colour_angle_abs_deviation, "LTMD Colour")
add_result("LTMD", "Rel vs Con", "Colour", result)
result <- run_comparison(location_rel$location_angle_abs_deviation, location_con$location_angle_abs_deviation, "LTMD Location")
add_result("LTMD", "Rel vs Con", "Location", result)

# ============================================================================
# SAVE RESULTS TO CSV
# ============================================================================
cat("\nSaving results to CSV...\n")

write.csv(results_df,
          "<PATH_TO_DATA>/Bayesian_Analysis_Results_Corrected.csv",
          row.names = FALSE)

write.csv(descriptive_df,
          "<PATH_TO_DATA>/Descriptive_Statistics_Table.csv",
          row.names = FALSE)

cat("\nAnalysis complete! Results saved to:\n")
cat("Bayesian analysis: <PATH_TO_DATA>/Bayesian_Analysis_Results_Corrected.csv\n")
cat("Descriptive statistics: <PATH_TO_DATA>/Descriptive_Statistics_Table.csv\n")
cat("\nNote: Bayes Factor (BF) interpretations based on 1/6 and 6 sensitivity thresholds.\n")
cat("For BF >= 6 (evidence for effect): 6-10 = Substantial, 10-30 = Strong, 30-100 = Very Strong, >100 = Decisive.\n")
cat("For BF < 1/6 (evidence for null hypothesis): 0.10-0.167 = Substantial, 0.033-0.10 = Strong, 0.01-0.033 = Very Strong, <0.01 = Decisive.\n")
cat("Values between 1/6 (0.167) and 6 are considered Inconclusive.\n")
cat("Lower M values indicate better performance (higher accuracy).\n")
cat("\nZ-score filtering (>2.5 SD) applied separately by group AFTER calculating participant averages.\n")
cat("LTMI: exclusions based on repetition 4, DVs averaged across repetitions 1-4.\n")