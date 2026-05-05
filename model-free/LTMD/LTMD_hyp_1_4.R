# --- Toggle: H1 vs H4 ---
include_relatives <- FALSE  # FALSE = H1 (Syn vs Con); TRUE = H4 (Syn vs Rel vs Con)

# --- Load necessary libraries ---
library(dplyr)
library(tidyr)
library(readxl)
library(stats)
library(emmeans) 

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# --- File paths ---
syn_path <- "<PATH_TO_DATA>/Synaesthetes/LTMD.csv"
con_path <- "<PATH_TO_DATA>/Controls/LTMD.csv"
rel_path <- "<PATH_TO_DATA>/Relatives/LTMD.csv"

# --- Load data ---
syn_data <- read.csv(syn_path) %>% mutate(group = "synaesthete")
con_data <- read.csv(con_path) %>% mutate(group = "control")
rel_data <- read.csv(rel_path) %>% mutate(group = "relative")

# Ensure IDs match type
syn_data$participant_id <- as.character(syn_data$participant_id)
con_data$participant_id <- as.character(con_data$participant_id)
rel_data$participant_id <- as.character(rel_data$participant_id)

# --- Apply exclusions ---
cat("Applying exclusions from exclusions.xlsx...\n")
syn_data <- filter_exclusions(syn_data)
con_data <- filter_exclusions(con_data)
rel_data <- filter_exclusions(rel_data)
cat("\n")

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

rel_averages <- rel_data %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "relative")

# --- Combine groups ---
combined_averages <- bind_rows(syn_averages, rel_averages, con_averages)

# --- Apply H1/H4 toggle ---
if (!include_relatives) {
  combined_averages <- combined_averages %>%
    filter(group %in% c("synaesthete", "control"))
}

# --- Set group as ordered factor ---
combined_averages$group <- factor(
  combined_averages$group,
  levels = c("control", "relative", "synaesthete")
)

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

cat(
  if (include_relatives)
    "=== MAIN ANALYSIS: 3 Groups (Synaesthetes vs Relatives vs Controls) ===\n"
  else
    "=== MAIN ANALYSIS: 2 Groups (Synaesthetes vs Controls) ===\n"
)

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
# FINAL SUMMARY
# ===============================================================================

cat("\n\n================================================================================\n")
cat("=== FINAL SUMMARY ===\n")
cat("================================================================================\n")

cat(
  if (include_relatives)
    "Main analysis: 3 groups (synaesthete vs relative vs control)\n"
  else
    "Main analysis: 2 groups (synaesthete vs control)\n"
)
cat("Participants in COLOUR analysis:", nrow(z_score_data_colour), "\n")
cat("Participants in LOCATION analysis:", nrow(z_score_data_location), "\n")
