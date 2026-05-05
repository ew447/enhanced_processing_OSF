# --- Toggle: run synaesthete-only covariate analysis ---
run_syn_covariate_analysis <- TRUE  # Change to TRUE to run separate syn-only analysis

# --- Load necessary libraries ---
library(dplyr)
library(tidyr)
library(readxl)
library(stats)
library(emmeans) 

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# --- File paths ---
syn_path <- "<PATH_TO_DATA>/Synaesthetes/VP.csv"
con_path <- "<PATH_TO_DATA>/Controls/VP.csv"
syn_types_path <- "<PATH_TO_PARTICIPANTS>/observation_list.xlsx"

# Load all datasets
syn_data <- read.csv(syn_path)
syn_data <- filter_exclusions(syn_data)

con_data <- read.csv(con_path)
con_data <- filter_exclusions(con_data)

# Ensure IDs match type
syn_data$participant_id <- as.character(syn_data$participant_id)
con_data$participant_id <- as.character(con_data$participant_id)

# --- Load covariate data (if needed) ---
syn_types_data <- NULL
if (run_syn_covariate_analysis) {
  syn_types_data <- read_excel(syn_types_path) %>%
    select(participant_id, syn_num_types) %>%
    mutate(participant_id = as.character(participant_id))
  
  cat("Loaded syn_types data for", nrow(syn_types_data), "participants\n")
  cat("syn_num_types range:", min(syn_types_data$syn_num_types, na.rm = TRUE), "to", 
      max(syn_types_data$syn_num_types, na.rm = TRUE), "\n\n")
}

# --- Calculate participant-level averages ---
syn_averages <- syn_data %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "synaesthete")

con_averages <- con_data %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "control")

# --- Combine groups ---
combined_averages <- bind_rows(syn_averages, con_averages)

# --- Get initial participant count ---
initial_participants <- length(unique(combined_averages$participant_id))
cat("Initial number of unique participants:", initial_participants, "\n")

# Count by group
group_counts_initial <- combined_averages %>%
  group_by(group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
print(group_counts_initial)
cat("\n")

# ===============================================================================
# TASK-SPECIFIC Z-SCORE FILTERING
# ===============================================================================

# Create COLOUR-filtered dataset (only exclude colour outliers for colour analysis)
z_score_data_colour <- combined_averages %>%
  group_by(group) %>%
  mutate(
    z_score_colour = (avg_colour_angle_abs_deviation - mean(avg_colour_angle_abs_deviation, na.rm = TRUE)) / sd(avg_colour_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup() %>%
  filter(z_score_colour <= 2.5) %>%
  select(participant_id, group, avg_colour_angle_abs_deviation)

# Create LOCATION-filtered dataset (only exclude location outliers for location analysis)
z_score_data_location <- combined_averages %>%
  group_by(group) %>%
  mutate(
    z_score_location = (avg_location_angle_abs_deviation - mean(avg_location_angle_abs_deviation, na.rm = TRUE)) / sd(avg_location_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup() %>%
  filter(z_score_location <= 2.5) %>%
  select(participant_id, group, avg_location_angle_abs_deviation)

# --- Get final participant counts for each analysis ---
final_participants_colour <- length(unique(z_score_data_colour$participant_id))
excluded_participants_colour <- initial_participants - final_participants_colour
cat("COLOUR analysis - Final participants:", final_participants_colour, "| Excluded:", excluded_participants_colour, "\n")

final_participants_location <- length(unique(z_score_data_location$participant_id))
excluded_participants_location <- initial_participants - final_participants_location
cat("LOCATION analysis - Final participants:", final_participants_location, "| Excluded:", excluded_participants_location, "\n\n")

# Count by group after filtering - COLOUR
group_counts_final_colour <- z_score_data_colour %>%
  group_by(group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
cat("COLOUR analysis by group:\n")
print(group_counts_final_colour)
cat("\n")

# Count by group after filtering - LOCATION
group_counts_final_location <- z_score_data_location %>%
  group_by(group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
cat("LOCATION analysis by group:\n")
print(group_counts_final_location)
cat("\n")

# ===============================================================================
# MAIN ANALYSIS (no covariate)
# ===============================================================================

cat("=== MAIN ANALYSIS: 2 Groups (Synaesthetes vs Controls) ===\n")

# --- Analysis for colour angle deviation (using COLOUR-filtered data) ---
cat("=== Analysis for Colour Angle Deviation ===\n")
colour_anova <- aov(avg_colour_angle_abs_deviation ~ group, data = z_score_data_colour)
print(summary(colour_anova))

# Post-hoc tests for colour (if ANOVA is significant)
colour_p_value <- summary(colour_anova)[[1]]$`Pr(>F)`[1]
if (!is.na(colour_p_value) && colour_p_value < 0.05) {
  cat("\nColour Angle Deviation Post-Hoc Tests (Tukey HSD):\n")
  print(TukeyHSD(colour_anova, which = "group"))
} else {
  cat("\nNo significant main effect for colour, skipping post-hoc tests.\n")
}

# --- Analysis for location angle deviation (using LOCATION-filtered data) ---
cat("\n\n=== Analysis for Location Angle Deviation ===\n")
location_anova <- aov(avg_location_angle_abs_deviation ~ group, data = z_score_data_location)
print(summary(location_anova))

# Post-hoc tests for location (if ANOVA is significant)
location_p_value <- summary(location_anova)[[1]]$`Pr(>F)`[1]
if (!is.na(location_p_value) && location_p_value < 0.05) {
  cat("\nLocation Angle Deviation Post-Hoc Tests (Tukey HSD):\n")
  print(TukeyHSD(location_anova, which = "group"))
} else {
  cat("\nNo significant main effect for location, skipping post-hoc tests.\n")
}

# --- Data summary for main analysis ---
cat("\n=== Data Summary for Main Analysis ===\n")
cat("\nCOLOUR:\n")
summary_stats_main_colour <- z_score_data_colour %>%
  group_by(group) %>%
  summarise(
    n = n(),
    colour_mean = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
    colour_sd = sd(avg_colour_angle_abs_deviation, na.rm = TRUE),
    .groups = "drop"
  )
print(summary_stats_main_colour)

cat("\nLOCATION:\n")
summary_stats_main_location <- z_score_data_location %>%
  group_by(group) %>%
  summarise(
    n = n(),
    location_mean = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
    location_sd = sd(avg_location_angle_abs_deviation, na.rm = TRUE),
    .groups = "drop"
  )
print(summary_stats_main_location)

# ===============================================================================
# SYNAESTHETE-ONLY COVARIATE ANALYSIS (separate analysis)
# ===============================================================================

if (run_syn_covariate_analysis && !is.null(syn_types_data)) {
  
  cat("\n\n================================================================================\n")
  cat("=== SEPARATE ANALYSIS: Synaesthetes Only with syn_num_types Covariate ===\n")
  cat("================================================================================\n")
  
  # Filter to synaesthetes only from the COLOUR-filtered data
  syn_only_data_colour <- z_score_data_colour %>%
    filter(group == "synaesthete")
  
  # Filter to synaesthetes only from the LOCATION-filtered data
  syn_only_data_location <- z_score_data_location %>%
    filter(group == "synaesthete")
  
  # Add covariate data to COLOUR dataset
  syn_only_data_colour <- left_join(syn_only_data_colour, syn_types_data, by = "participant_id")
  syn_only_clean_colour <- syn_only_data_colour[complete.cases(syn_only_data_colour), ]
  
  # Add covariate data to LOCATION dataset
  syn_only_data_location <- left_join(syn_only_data_location, syn_types_data, by = "participant_id")
  syn_only_clean_location <- syn_only_data_location[complete.cases(syn_only_data_location), ]
  
  cat("Synaesthetes included in COLOUR covariate analysis:", nrow(syn_only_clean_colour), "\n")
  cat("Synaesthetes included in LOCATION covariate analysis:", nrow(syn_only_clean_location), "\n\n")
  
  # Run ANCOVA for colour
  cat("=== Synaesthete Colour ANCOVA Results (with syn_num_types covariate) ===\n")
  syn_colour_model <- aov(avg_colour_angle_abs_deviation ~ syn_num_types, data = syn_only_clean_colour)
  print(summary(syn_colour_model))
  
  # Run ANCOVA for location
  cat("\n=== Synaesthete Location ANCOVA Results (with syn_num_types covariate) ===\n")
  syn_location_model <- aov(avg_location_angle_abs_deviation ~ syn_num_types, data = syn_only_clean_location)
  print(summary(syn_location_model))
  
  # Show covariate effects using emmeans
  tryCatch({
    cat("\n=== Covariate (syn_num_types) Effect on Colour ===\n")
    syn_colour_trend <- emtrends(syn_colour_model, ~ 1, var = "syn_num_types")
    print(syn_colour_trend)
    
    cat("\n=== Covariate (syn_num_types) Effect on Location ===\n")
    syn_location_trend <- emtrends(syn_location_model, ~ 1, var = "syn_num_types")
    print(syn_location_trend)
  }, error = function(e) {
    cat("Error with emtrends:", e$message, "\n")
  })
  
  # --- Data summary for synaesthete analysis ---
  cat("\n=== Data Summary for Synaesthete Covariate Analysis ===\n")
  cat("\nCOLOUR:\n")
  summary_stats_syn_colour <- syn_only_clean_colour %>%
    summarise(
      n = n(),
      colour_mean = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
      colour_sd = sd(avg_colour_angle_abs_deviation, na.rm = TRUE),
      syn_num_types_mean = mean(syn_num_types, na.rm = TRUE),
      syn_num_types_sd = sd(syn_num_types, na.rm = TRUE)
    )
  print(summary_stats_syn_colour)
  
  cat("\nLOCATION:\n")
  summary_stats_syn_location <- syn_only_clean_location %>%
    summarise(
      n = n(),
      location_mean = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
      location_sd = sd(avg_location_angle_abs_deviation, na.rm = TRUE),
      syn_num_types_mean = mean(syn_num_types, na.rm = TRUE),
      syn_num_types_sd = sd(syn_num_types, na.rm = TRUE)
    )
  print(summary_stats_syn_location)
  
  # Correlation between syn_num_types and performance
  cat("\n=== Correlations: syn_num_types with performance ===\n")
  colour_cor <- cor(syn_only_clean_colour$syn_num_types, syn_only_clean_colour$avg_colour_angle_abs_deviation, use = "complete.obs")
  location_cor <- cor(syn_only_clean_location$syn_num_types, syn_only_clean_location$avg_location_angle_abs_deviation, use = "complete.obs")
  
  cat("Correlation between syn_num_types and colour deviation:", round(colour_cor, 3), "\n")
  cat("Correlation between syn_num_types and location deviation:", round(location_cor, 3), "\n")
}

# ===============================================================================
# FINAL SUMMARY
# ===============================================================================

cat("\n\n================================================================================\n")
cat("=== FINAL SUMMARY ===\n")
cat("================================================================================\n")

cat("Main analysis: 2 groups (synaesthete vs control)\n")
cat("Participants in COLOUR analysis:", nrow(z_score_data_colour), "\n")
cat("Participants in LOCATION analysis:", nrow(z_score_data_location), "\n")

if (run_syn_covariate_analysis && !is.null(syn_types_data)) {
  cat("Separate synaesthete covariate analysis: YES\n")
  if (exists("syn_only_clean_colour")) {
    cat("Participants in synaesthete COLOUR analysis:", nrow(syn_only_clean_colour), "\n")
  }
  if (exists("syn_only_clean_location")) {
    cat("Participants in synaesthete LOCATION analysis:", nrow(syn_only_clean_location), "\n")
  }
} else {
  cat("Separate synaesthete covariate analysis: NO\n")
}
