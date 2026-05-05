library(dplyr)
library(readr)
library(readxl)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# --- Load Bayes-factor function (Dienes, 2019) ---
source("<PATH_TO_REPO>/Bayesian/bayes_factor_function.R")

# Load subtype information including syn_num_types
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
  Num_Types = integer(),
  Mean_Colour_SD = character(),
  Mean_Location_SD = character(),
  N_Colour = integer(),
  N_Location = integer(),
  stringsAsFactors = FALSE
)

# Initialize correlation results dataframe
correlation_df <- data.frame(
  Task = character(),
  Condition = character(),
  Load_STM = character(),
  Correlation_r = numeric(),
  Correlation_p = character(),
  N = integer(),
  stringsAsFactors = FALSE
)

# Function to prepare synaesthete data with num_types
prepare_syn_data <- function(data) {
  data$participant_id <- as.character(data$participant_id)
  data <- data %>%
    left_join(subtype_data %>% select(participant_id, syn_num_types),
              by = "participant_id") %>%
    filter(!is.na(syn_num_types))
  return(data)
}

# Function to apply z-score filtering AFTER participant averaging
apply_zscore_after_averaging <- function(averaged_data, measure_col) {
  averaged_data %>%
    mutate(
      z_score = (!!sym(measure_col) - mean(!!sym(measure_col), na.rm = TRUE)) /
        sd(!!sym(measure_col), na.rm = TRUE)
    ) %>%
    filter(is.na(z_score) | z_score <= 2.5) %>%
    select(-z_score)
}

# Function to run t-test and calculate Bayes Factor
run_comparison <- function(group1_data, group2_data, measure_name) {
  if (length(group1_data) < 2 || length(group2_data) < 2) {
    return(NULL)
  }
  
  t_result <- t.test(group1_data, group2_data)
  
  semdiff       <- t_result$stderr
  group2_mean   <- t_result$estimate[2]
  group1_mean   <- t_result$estimate[1]
  observed_diff <- group2_mean - group1_mean
  df_values     <- t_result$parameter
  
  bf_value <- Bf(sd = semdiff, obtained = observed_diff, dfdata = df_values,
                 likelihood = "normal", modeoftheory = 0, scaleoftheory = group2_mean,
                 modeloftheory = "normal", tail = 1)
  
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
  if (is.null(result)) {
    return(invisible(NULL))
  }
  
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
add_descriptive_stats <- function(task, num_types, colour_data, location_data, load = NA) {
  task_label <- if (is.na(load)) {
    task
  } else {
    paste0(task, " (Load ", load, ")")
  }
  
  mean_colour   <- mean(colour_data, na.rm = TRUE)
  sd_colour     <- sd(colour_data, na.rm = TRUE)
  n_colour      <- length(colour_data)
  
  mean_location <- mean(location_data, na.rm = TRUE)
  sd_location   <- sd(location_data, na.rm = TRUE)
  n_location    <- length(location_data)
  
  new_row <- data.frame(
    Task = task_label,
    Num_Types = num_types,
    Mean_Colour_SD = sprintf("%.2f (%.2f)", mean_colour, sd_colour),
    Mean_Location_SD = sprintf("%.2f (%.2f)", mean_location, sd_location),
    N_Colour = n_colour,
    N_Location = n_location,
    stringsAsFactors = FALSE
  )
  
  descriptive_df <<- rbind(descriptive_df, new_row)
}

# Function to run Pearson correlation analysis.
run_correlation <- function(num_types, performance_measure, measure_name) {
  valid_data <- data.frame(
    num_types   = num_types,
    performance = performance_measure
  ) %>%
    filter(!is.na(num_types) & !is.na(performance))
  
  if (nrow(valid_data) < 3) {
    return(list(r = NA, p = NA, n = nrow(valid_data)))
  }
  
  cor_result <- cor.test(valid_data$num_types, valid_data$performance)
  
  return(list(
    r = cor_result$estimate,
    p = cor_result$p.value,
    n = nrow(valid_data)
  ))
}

# Function to add correlation result
add_correlation_result <- function(task, condition, result, load = NA) {
  p_formatted    <- ifelse(is.na(result$p), "NA",
                           ifelse(result$p < .001, "<.001", sprintf("%.3f", result$p)))
  r_formatted    <- ifelse(is.na(result$r), NA, round(result$r, 3))
  load_formatted <- ifelse(is.na(load), "—", as.character(load))
  
  new_row <- data.frame(
    Task = task,
    Condition = condition,
    Load_STM = load_formatted,
    Correlation_r = r_formatted,
    Correlation_p = p_formatted,
    N = result$n,
    stringsAsFactors = FALSE
  )
  
  correlation_df <<- rbind(correlation_df, new_row)
}

# Function to run a median split comparison
run_median_split_comparison <- function(colour_data, location_data, task, load = NA) {
  
  task_load_label <- paste0(task, ifelse(is.na(load), "", paste0(" Load ", load)))
  
  # --- Colour: median split ---
  med_colour  <- median(colour_data$syn_num_types, na.rm = TRUE)
  colour_few  <- colour_data %>% filter(syn_num_types <= med_colour)
  colour_many <- colour_data %>% filter(syn_num_types >  med_colour)
  
  cat(sprintf("  %s | Colour   median = %g  (few n = %d, many n = %d)\n",
              task_load_label, med_colour, nrow(colour_few), nrow(colour_many)))
  
  result_colour <- run_comparison(colour_few$colour_angle_abs_deviation,
                                  colour_many$colour_angle_abs_deviation,
                                  paste0(task, " Colour"))
  add_result(task, "Few types vs Many types", "Colour", result_colour, load)
  
  # --- Location: median split ---
  med_location  <- median(location_data$syn_num_types, na.rm = TRUE)
  location_few  <- location_data %>% filter(syn_num_types <= med_location)
  location_many <- location_data %>% filter(syn_num_types >  med_location)
  
  cat(sprintf("  %s | Location median = %g  (few n = %d, many n = %d)\n",
              task_load_label, med_location, nrow(location_few), nrow(location_many)))
  
  result_location <- run_comparison(location_few$location_angle_abs_deviation,
                                    location_many$location_angle_abs_deviation,
                                    paste0(task, " Location"))
  add_result(task, "Few types vs Many types", "Location", result_location, load)
}

# ============================================================================
# VP ANALYSIS
# ============================================================================
cat("Processing VP data...\n")

syn_VP <- read.csv("<PATH_TO_DATA>/Synaesthetes/VP.csv")
syn_VP <- filter_exclusions(syn_VP)
syn_VP <- prepare_syn_data(syn_VP)

colour_syn_raw <- syn_VP %>%
  group_by(participant_id) %>%
  summarize(
    colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    syn_num_types = first(syn_num_types),
    .groups = 'drop'
  )

location_syn_raw <- syn_VP %>%
  group_by(participant_id) %>%
  summarize(
    location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    syn_num_types = first(syn_num_types),
    .groups = 'drop'
  )

colour_syn   <- apply_zscore_after_averaging(colour_syn_raw,   "colour_angle_abs_deviation")
location_syn <- apply_zscore_after_averaging(location_syn_raw, "location_angle_abs_deviation")

unique_types <- sort(unique(c(colour_syn$syn_num_types, location_syn$syn_num_types)))
for (num_type in unique_types) {
  colour_subset   <- colour_syn   %>% filter(syn_num_types == num_type)
  location_subset <- location_syn %>% filter(syn_num_types == num_type)
  add_descriptive_stats("VP", num_type,
                        colour_subset$colour_angle_abs_deviation,
                        location_subset$location_angle_abs_deviation)
}

run_median_split_comparison(colour_syn, location_syn, "VP")

result <- run_correlation(colour_syn$syn_num_types,
                          colour_syn$colour_angle_abs_deviation, "VP Colour")
add_correlation_result("VP", "Colour", result)

result <- run_correlation(location_syn$syn_num_types,
                          location_syn$location_angle_abs_deviation, "VP Location")
add_correlation_result("VP", "Location", result)

# ============================================================================
# STM ANALYSIS
# ============================================================================
cat("Processing STM data...\n")

syn_STM <- read.csv("<PATH_TO_DATA>/Synaesthetes/STM.csv")
syn_STM <- filter_exclusions(syn_STM)
syn_STM <- prepare_syn_data(syn_STM)

for (load in c(1, 3, 5)) {
  colour_syn_raw <- syn_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(
      colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
      syn_num_types = first(syn_num_types),
      .groups = 'drop'
    )
  
  location_syn_raw <- syn_STM %>%
    filter(load_n == load) %>%
    group_by(participant_id) %>%
    summarize(
      location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
      syn_num_types = first(syn_num_types),
      .groups = 'drop'
    )
  
  colour_syn   <- apply_zscore_after_averaging(colour_syn_raw,   "colour_angle_abs_deviation")
  location_syn <- apply_zscore_after_averaging(location_syn_raw, "location_angle_abs_deviation")
  
  unique_types <- sort(unique(c(colour_syn$syn_num_types, location_syn$syn_num_types)))
  for (num_type in unique_types) {
    colour_subset   <- colour_syn   %>% filter(syn_num_types == num_type)
    location_subset <- location_syn %>% filter(syn_num_types == num_type)
    add_descriptive_stats("STM", num_type,
                          colour_subset$colour_angle_abs_deviation,
                          location_subset$location_angle_abs_deviation, load)
  }
  
  run_median_split_comparison(colour_syn, location_syn, "STM", load)
  
  result <- run_correlation(colour_syn$syn_num_types,
                            colour_syn$colour_angle_abs_deviation, "STM Colour")
  add_correlation_result("STM", "Colour", result, load)
  
  result <- run_correlation(location_syn$syn_num_types,
                            location_syn$location_angle_abs_deviation, "STM Location")
  add_correlation_result("STM", "Location", result, load)
}

# ============================================================================
# LTMI ANALYSIS
# Z-score exclusion based on rep 4 abs deviation (group mean, two-tailed |z| <= 2.5).
# DV is the average abs deviation across reps 1-4 for non-excluded participants.
# Exclusion computed separately for Colour and Location.
# ============================================================================
cat("Processing LTMI data...\n")

syn_LTMI <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")
syn_LTMI <- filter_exclusions(syn_LTMI)
syn_LTMI <- prepare_syn_data(syn_LTMI)
syn_LTMI <- syn_LTMI %>% filter(repetition %in% 1:4)

# --- Step 1: Compute per-participant mean abs deviation at rep 4 only ---
rep4_colour_raw <- syn_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(
    colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    syn_num_types = first(syn_num_types),
    .groups = 'drop'
  )

rep4_location_raw <- syn_LTMI %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarize(
    location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    syn_num_types = first(syn_num_types),
    .groups = 'drop'
  )

# --- Step 2: Z-score filter on rep 4 values to get valid participant IDs ---
rep4_colour_keep   <- apply_zscore_after_averaging(rep4_colour_raw,   "colour_angle_abs_deviation")
rep4_location_keep <- apply_zscore_after_averaging(rep4_location_raw, "location_angle_abs_deviation")

cat(sprintf("  LTMI Colour:   %d → %d participants after rep 4 z-score exclusion\n",
            nrow(rep4_colour_raw), nrow(rep4_colour_keep)))
cat(sprintf("  LTMI Location: %d → %d participants after rep 4 z-score exclusion\n",
            nrow(rep4_location_raw), nrow(rep4_location_keep)))

# --- Step 3: Average reps 1-4 for non-excluded participants ---
allreps_avgs <- syn_LTMI %>%
  filter(repetition %in% 1:4) %>%
  group_by(participant_id) %>%
  summarize(
    colour_angle_abs_deviation   = mean(colour_angle_abs_deviation,   na.rm = TRUE),
    location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    syn_num_types = first(syn_num_types),
    .groups = 'drop'
  )

# --- Step 4: Apply exclusion IDs separately per condition ---
colour_syn <- allreps_avgs %>%
  semi_join(rep4_colour_keep, by = "participant_id") %>%
  select(participant_id, colour_angle_abs_deviation, syn_num_types)

location_syn <- allreps_avgs %>%
  semi_join(rep4_location_keep, by = "participant_id") %>%
  select(participant_id, location_angle_abs_deviation, syn_num_types)

# Descriptive statistics
unique_types <- sort(unique(c(colour_syn$syn_num_types, location_syn$syn_num_types)))
for (num_type in unique_types) {
  colour_subset   <- colour_syn   %>% filter(syn_num_types == num_type)
  location_subset <- location_syn %>% filter(syn_num_types == num_type)
  add_descriptive_stats("LTMI", num_type,
                        colour_subset$colour_angle_abs_deviation,
                        location_subset$location_angle_abs_deviation)
}

run_median_split_comparison(colour_syn, location_syn, "LTMI")

result <- run_correlation(colour_syn$syn_num_types,
                          colour_syn$colour_angle_abs_deviation, "LTMI Colour")
add_correlation_result("LTMI", "Colour", result)

result <- run_correlation(location_syn$syn_num_types,
                          location_syn$location_angle_abs_deviation, "LTMI Location")
add_correlation_result("LTMI", "Location", result)

# ============================================================================
# LTMD ANALYSIS
# ============================================================================
cat("Processing LTMD data...\n")

syn_LTMD <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMD.csv")
syn_LTMD <- filter_exclusions(syn_LTMD)
syn_LTMD <- prepare_syn_data(syn_LTMD)

colour_syn_raw <- syn_LTMD %>%
  group_by(participant_id) %>%
  summarize(
    colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    syn_num_types = first(syn_num_types),
    .groups = 'drop'
  )

location_syn_raw <- syn_LTMD %>%
  group_by(participant_id) %>%
  summarize(
    location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    syn_num_types = first(syn_num_types),
    .groups = 'drop'
  )

colour_syn   <- apply_zscore_after_averaging(colour_syn_raw,   "colour_angle_abs_deviation")
location_syn <- apply_zscore_after_averaging(location_syn_raw, "location_angle_abs_deviation")

unique_types <- sort(unique(c(colour_syn$syn_num_types, location_syn$syn_num_types)))
for (num_type in unique_types) {
  colour_subset   <- colour_syn   %>% filter(syn_num_types == num_type)
  location_subset <- location_syn %>% filter(syn_num_types == num_type)
  add_descriptive_stats("LTMD", num_type,
                        colour_subset$colour_angle_abs_deviation,
                        location_subset$location_angle_abs_deviation)
}

run_median_split_comparison(colour_syn, location_syn, "LTMD")

result <- run_correlation(colour_syn$syn_num_types,
                          colour_syn$colour_angle_abs_deviation, "LTMD Colour")
add_correlation_result("LTMD", "Colour", result)

result <- run_correlation(location_syn$syn_num_types,
                          location_syn$location_angle_abs_deviation, "LTMD Location")
add_correlation_result("LTMD", "Location", result)

# ============================================================================
# SAVE RESULTS TO CSV
# ============================================================================
cat("\nSaving results to CSV...\n")

write.csv(results_df,
          "<PATH_TO_DATA>/Syn_Types_Bayesian_Analysis_Results.csv",
          row.names = FALSE)

write.csv(descriptive_df,
          "<PATH_TO_DATA>/Syn_Types_Descriptive_Statistics.csv",
          row.names = FALSE)

write.csv(correlation_df,
          "<PATH_TO_DATA>/Syn_Types_Correlation_Results.csv",
          row.names = FALSE)

cat("\nAnalysis complete! Results saved to:\n")
cat("Bayesian analysis:      <PATH_TO_DATA>/Syn_Types_Bayesian_Analysis_Results.csv\n")
cat("Descriptive statistics: <PATH_TO_DATA>/Syn_Types_Descriptive_Statistics.csv\n")
cat("Correlation analysis:   <PATH_TO_DATA>/Syn_Types_Correlation_Results.csv\n")
cat("\nNotes:\n")
cat("Bayes Factor interpretations based on 1/6 and 6 sensitivity thresholds.\n")
cat("  BF >= 6  (evidence for effect):  6-10 Substantial, 10-30 Strong, 30-100 Very Strong, >100 Decisive.\n")
cat("  BF < 1/6 (evidence for null):    0.10-0.167 Substantial, 0.033-0.10 Strong, 0.01-0.033 Very Strong, <0.01 Decisive.\n")
cat("  BF between 0.167 and 6: Inconclusive.\n")
cat("Lower M values indicate better performance (higher accuracy).\n")
cat("Median split computed separately for colour and location after z-score filtering.\n")
cat("  'Few types' = <= median syn_num_types; 'Many types' = > median.\n")
cat("  Participants at the median are assigned to 'Few types' so no one is excluded.\n")
cat("Z-score filtering (|z| <= 2.5) applied AFTER calculating participant averages.\n")
cat("Correlation: Pearson's r between number of synaesthesia types and performance.\n")
cat("LTMI: DV = mean abs deviation averaged across reps 1-4.\n")
cat("  Exclusion based on rep 4 mean abs deviation only, separately per condition.\n")