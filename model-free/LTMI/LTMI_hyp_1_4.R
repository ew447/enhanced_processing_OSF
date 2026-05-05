# --- Toggle: H1 vs H4 ---
include_relatives <- FALSE  # FALSE = H1 (Syn vs Con); TRUE = H4 (Syn vs Rel vs Con)

# --- Load libraries ---
library(dplyr)
library(tidyr)
library(readxl)
library(stats)
library(emmeans)  

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# --- File paths ---
syn_path <- "<PATH_TO_DATA>/Synaesthetes/LTMI.csv"
con_path <- "<PATH_TO_DATA>/Controls/LTMI.csv"
rel_path <- "<PATH_TO_DATA>/Relatives/LTMI.csv"

# --- Load & label data ---
syn_data <- read.csv(syn_path) %>% mutate(group = "synaesthete")
syn_data <- filter_exclusions(syn_data)

con_data <- read.csv(con_path) %>% mutate(group = "control")
con_data <- filter_exclusions(con_data)

rel_data <- read.csv(rel_path) %>% mutate(group = "relative")
rel_data <- filter_exclusions(rel_data)

# Ensure participant_id is character across all datasets
syn_data$participant_id <- as.character(syn_data$participant_id)
con_data$participant_id <- as.character(con_data$participant_id)
rel_data$participant_id <- as.character(rel_data$participant_id)

# --- Participant-level averages for FINAL BLOCK ONLY (used for exclusions) ---
syn_rep4 <- syn_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "synaesthete")

con_rep4 <- con_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "control")

rel_rep4 <- rel_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "relative")

# --- Combine rep4 data and run z-score exclusions on it ---
combined_rep4 <- bind_rows(syn_rep4, rel_rep4, con_rep4)

# --- Apply H1/H4 toggle ---
if (!include_relatives) {
  combined_rep4 <- combined_rep4 %>%
    filter(group %in% c("synaesthete", "control"))
}

initial_participants <- length(unique(combined_rep4$participant_id))
cat("Initial number of unique participants:", initial_participants, "\n")

group_counts_initial <- combined_rep4 %>%
  group_by(group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
print(group_counts_initial)
cat("\n")

# Z-score filtering based on rep4 values — identify who to KEEP
keep_ids_colour <- combined_rep4 %>%
  group_by(group) %>%
  mutate(z_score_colour = (avg_colour_angle_abs_deviation - mean(avg_colour_angle_abs_deviation, na.rm = TRUE)) / sd(avg_colour_angle_abs_deviation, na.rm = TRUE)) %>%
  ungroup() %>%
  filter(z_score_colour <= 2.5) %>%
  pull(participant_id)

keep_ids_location <- combined_rep4 %>%
  group_by(group) %>%
  mutate(z_score_location = (avg_location_angle_abs_deviation - mean(avg_location_angle_abs_deviation, na.rm = TRUE)) / sd(avg_location_angle_abs_deviation, na.rm = TRUE)) %>%
  ungroup() %>%
  filter(z_score_location <= 2.5) %>%
  pull(participant_id)

# --- Now compute averages across ALL repetitions (1-4) ---
all_averages <- bind_rows(syn_data, rel_data, con_data) %>%
  group_by(participant_id, group) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  )

# --- Apply H1/H4 toggle ---
if (!include_relatives) {
  all_averages <- all_averages %>%
    filter(group %in% c("synaesthete", "control"))
}

# --- Set group as ordered factor ---
all_averages$group <- factor(
  all_averages$group,
  levels = c("control", "relative", "synaesthete")
)

# --- Apply exclusions: keep only non-excluded participants, using reps 1-4 averages ---
z_score_data_colour <- all_averages %>%
  filter(participant_id %in% keep_ids_colour) %>%
  select(participant_id, group, avg_colour_angle_abs_deviation)

z_score_data_location <- all_averages %>%
  filter(participant_id %in% keep_ids_location) %>%
  select(participant_id, group, avg_location_angle_abs_deviation)

# --- TRACKING: Get final participant counts for each analysis ---
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
