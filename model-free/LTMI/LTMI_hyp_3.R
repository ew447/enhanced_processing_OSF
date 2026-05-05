library(dplyr)
library(tidyr)
library(stats)
library(readxl)
library(ggplot2)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# File paths
syn_path <- "<PATH_TO_DATA>/Synaesthetes/LTMI.csv"
con_path <- "<PATH_TO_DATA>/Controls/LTMI.csv"
subtype_path <- "<PATH_TO_PARTICIPANTS>/observation_list.xlsx"

# Load datasets
syn_data <- read.csv(syn_path)
syn_data <- filter_exclusions(syn_data)
subtype_data <- read_excel(subtype_path)

con_data <- read.csv(con_path)
con_data <- filter_exclusions(con_data)

# Ensure participant_id is character across all datasets
syn_data$participant_id <- as.character(syn_data$participant_id)
con_data$participant_id <- as.character(con_data$participant_id)
subtype_data$participant_id <- as.character(subtype_data$participant_id)

# Merge subtype information with synaesthete data
syn_data_with_subtypes <- syn_data %>%
  left_join(subtype_data, by = "participant_id") %>%
  mutate(
    subtype_group = case_when(
      has_GCS == 0 & has_SSS == 0 ~ "Control",
      has_GCS == 1 & has_SSS == 0 ~ "GCS_only",
      has_GCS == 0 & has_SSS == 1 ~ "SSS_only",
      has_GCS == 1 & has_SSS == 1 ~ "GCS_SSS",
      TRUE ~ NA_character_
    )
  )

# ===============================================================================
# STEP 1: Compute rep-4-only averages for exclusion decisions
# ===============================================================================

syn_rep4 <- syn_data_with_subtypes %>%
  filter(repetition == 4) %>%
  group_by(participant_id, subtype_group) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  )

con_rep4 <- con_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    subtype_group = "Control",
    .groups = 'drop'
  )

final_block_averages <- bind_rows(syn_rep4, con_rep4)

# ===============================================================================
# STEP 2: Compute averages across ALL repetitions (1-4) — these are the DVs
# ===============================================================================

syn_averages <- syn_data_with_subtypes %>%
  group_by(participant_id, subtype_group) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  )

con_averages <- con_data %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    subtype_group = "Control",
    .groups = 'drop'
  )

combined_averages <- bind_rows(syn_averages, con_averages)

# --- TRACKING: Get initial participant count ---
initial_participants <- length(unique(combined_averages$participant_id))
cat("Initial number of unique participants:", initial_participants, "\n")

group_counts_initial <- combined_averages %>%
  group_by(subtype_group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
print(group_counts_initial)
cat("\n")

# ===============================================================================
# TASK-SPECIFIC Z-SCORE FILTERING (based on rep 4 only)
# ===============================================================================

# Create COLOUR-filtered list of participants
colour_filtered_participants <- final_block_averages %>%
  group_by(subtype_group) %>%
  mutate(
    z_score_colour = (avg_colour_angle_abs_deviation - mean(avg_colour_angle_abs_deviation, na.rm = TRUE)) / sd(avg_colour_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup() %>%
  filter(z_score_colour <= 2.5) %>%
  select(participant_id, subtype_group)

# Create LOCATION-filtered list of participants
location_filtered_participants <- final_block_averages %>%
  group_by(subtype_group) %>%
  mutate(
    z_score_location = (avg_location_angle_abs_deviation - mean(avg_location_angle_abs_deviation, na.rm = TRUE)) / sd(avg_location_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup() %>%
  filter(z_score_location <= 2.5) %>%
  select(participant_id, subtype_group)

# Filter combined_averages (reps 1-4) based on exclusions
combined_averages_colour <- combined_averages %>%
  semi_join(colour_filtered_participants, by = c("participant_id", "subtype_group"))

combined_averages_location <- combined_averages %>%
  semi_join(location_filtered_participants, by = c("participant_id", "subtype_group"))

# --- Get final participant counts ---
final_participants_colour <- length(unique(combined_averages_colour$participant_id))
excluded_participants_colour <- initial_participants - final_participants_colour
cat("COLOUR analysis - Final participants:", final_participants_colour, "| Excluded:", excluded_participants_colour, "\n")

final_participants_location <- length(unique(combined_averages_location$participant_id))
excluded_participants_location <- initial_participants - final_participants_location
cat("LOCATION analysis - Final participants:", final_participants_location, "| Excluded:", excluded_participants_location, "\n\n")

group_counts_final_colour <- combined_averages_colour %>%
  group_by(subtype_group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
cat("COLOUR analysis by subtype:\n")
print(group_counts_final_colour)
cat("\n")

group_counts_final_location <- combined_averages_location %>%
  group_by(subtype_group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
cat("LOCATION analysis by subtype:\n")
print(group_counts_final_location)
cat("\n")

# Add has_GCS and has_SSS factors for 2x2 factorial ANOVA
combined_averages_colour <- combined_averages_colour %>%
  mutate(
    has_GCS = factor(ifelse(subtype_group %in% c("GCS_only", "GCS_SSS"), 1, 0)),
    has_SSS = factor(ifelse(subtype_group %in% c("SSS_only", "GCS_SSS"), 1, 0))
  )

combined_averages_location <- combined_averages_location %>%
  mutate(
    has_GCS = factor(ifelse(subtype_group %in% c("GCS_only", "GCS_SSS"), 1, 0)),
    has_SSS = factor(ifelse(subtype_group %in% c("SSS_only", "GCS_SSS"), 1, 0))
  )

# ===============================================================================
# 2x2 FACTORIAL ANOVA (DVs are averages across reps 1-4)
# ===============================================================================

cat("=== 2x2 Factorial ANOVA Results (averaged across reps 1-4) ===\n\n")

cat("--- COLOUR ---\n")
colour_anova <- aov(avg_colour_angle_abs_deviation ~ has_GCS * has_SSS, data = combined_averages_colour)
print(summary(colour_anova))

cat("\n--- LOCATION ---\n")
location_anova <- aov(avg_location_angle_abs_deviation ~ has_GCS * has_SSS, data = combined_averages_location)
print(summary(location_anova))

# ===============================================================================
# EFFECT SIZE CALCULATIONS
# ===============================================================================

calculate_cohens_d <- function(data, dv, group1_var, group2_var) {
  group1 <- data[[dv]][data$subtype_group == group1_var]
  group2 <- data[[dv]][data$subtype_group == group2_var]
  m1 <- mean(group1, na.rm = TRUE)
  m2 <- mean(group2, na.rm = TRUE)
  s1 <- sd(group1, na.rm = TRUE)
  s2 <- sd(group2, na.rm = TRUE)
  n1 <- length(group1)
  n2 <- length(group2)
  pooled_sd <- sqrt(((n1 - 1) * s1^2 + (n2 - 1) * s2^2) / (n1 + n2 - 2))
  d <- (m1 - m2) / pooled_sd
  return(d)
}

cat("\n=== Effect Sizes for COLOUR (Cohen's d) ===\n")
effect_sizes_colour <- data.frame()
for (comparison in combn(unique(combined_averages_colour$subtype_group), 2, simplify = FALSE)) {
  group1 <- comparison[1]
  group2 <- comparison[2]
  cohens_d <- calculate_cohens_d(combined_averages_colour, "avg_colour_angle_abs_deviation", group1, group2)
  effect_sizes_colour <- rbind(effect_sizes_colour, data.frame(
    comparison = paste(group1, "-", group2),
    cohens_d = cohens_d
  ))
}
print(effect_sizes_colour)

cat("\n=== Effect Sizes for LOCATION (Cohen's d) ===\n")
effect_sizes_location <- data.frame()
for (comparison in combn(unique(combined_averages_location$subtype_group), 2, simplify = FALSE)) {
  group1 <- comparison[1]
  group2 <- comparison[2]
  cohens_d <- calculate_cohens_d(combined_averages_location, "avg_location_angle_abs_deviation", group1, group2)
  effect_sizes_location <- rbind(effect_sizes_location, data.frame(
    comparison = paste(group1, "-", group2),
    cohens_d = cohens_d
  ))
}
print(effect_sizes_location)

# ===============================================================================
# PLOTTING - Bar plot (no repetition dimension)
# ===============================================================================

plot_data_colour <- combined_averages_colour %>%
  group_by(subtype_group) %>%
  summarise(
    mean_deviation = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
    se_deviation = sd(avg_colour_angle_abs_deviation, na.rm = TRUE) / sqrt(n()),
    .groups = 'drop'
  ) %>%
  mutate(measure = "Colour")

plot_data_location <- combined_averages_location %>%
  group_by(subtype_group) %>%
  summarise(
    mean_deviation = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
    se_deviation = sd(avg_location_angle_abs_deviation, na.rm = TRUE) / sqrt(n()),
    .groups = 'drop'
  ) %>%
  mutate(measure = "Location")

plot_data_combined <- bind_rows(plot_data_colour, plot_data_location)

ltmi_plot <- ggplot(plot_data_combined, aes(x = subtype_group, y = mean_deviation, 
                                            fill = subtype_group)) +
  geom_bar(stat = "identity", position = position_dodge()) +
  geom_errorbar(aes(ymin = mean_deviation - se_deviation, 
                    ymax = mean_deviation + se_deviation), 
                width = 0.2) +
  facet_wrap(~ measure) +
  scale_y_continuous(limits = c(0, 60)) +
  labs(title = "LTMI - Mean Deviation by Subtype (averaged across reps 1-4)",
       x = "Subtype Group",
       y = "Mean Absolute Deviation (degrees)",
       fill = "Subtype Group") +
  theme_minimal() +
  theme(legend.position = "bottom")

print(ltmi_plot)

# --- Final summaries ---
combined_averages_colour %>%
  group_by(subtype_group) %>%
  summarise(
    n = n_distinct(participant_id),
    mean = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
    sd = sd(avg_colour_angle_abs_deviation, na.rm = TRUE)
  )

combined_averages_location %>%
  group_by(subtype_group) %>%
  summarise(
    n = n_distinct(participant_id),
    mean = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
    sd = sd(avg_location_angle_abs_deviation, na.rm = TRUE)
  )
