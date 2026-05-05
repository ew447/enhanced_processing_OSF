library(dplyr)
library(tidyr)
library(stats)
library(readxl)
library(ggplot2)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# File paths
syn_path <- "<PATH_TO_DATA>/Synaesthetes/STM.csv"
con_path <- "<PATH_TO_DATA>/Controls/STM.csv"
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

# Calculate participant-level averages for each subtype group and load condition
syn_averages <- syn_data_with_subtypes %>%
  group_by(participant_id, load_n, subtype_group) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  )

# Add control group to the dataset
con_averages <- con_data %>%
  group_by(participant_id, load_n) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    subtype_group = "Control",
    .groups = 'drop'
  )

# Combine datasets
combined_averages <- bind_rows(syn_averages, con_averages)

# --- Get initial participant count ---
initial_participants <- length(unique(combined_averages$participant_id))
cat("Initial number of unique participants:", initial_participants, "\n")

# Count by subtype_group
group_counts_initial <- combined_averages %>%
  group_by(subtype_group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
print(group_counts_initial)
cat("\n")

# --- Perform Z-score filtering (separately for each load_n and condition) ---

# Calculate Z-scores grouped by subtype_group and load_n
z_score_data <- combined_averages %>%
  group_by(subtype_group, load_n) %>%
  mutate(
    z_score_colour = (avg_colour_angle_abs_deviation - mean(avg_colour_angle_abs_deviation, na.rm = TRUE)) / 
      sd(avg_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_location = (avg_location_angle_abs_deviation - mean(avg_location_angle_abs_deviation, na.rm = TRUE)) / 
      sd(avg_location_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup()

# Track exclusions
cat("Exclusions by load and measure:\n")
exclusion_summary <- z_score_data %>%
  group_by(load_n) %>%
  summarise(
    n_colour_exclusions = sum(z_score_colour > 2.5, na.rm = TRUE),
    n_location_exclusions = sum(z_score_location > 2.5, na.rm = TRUE),
    .groups = 'drop'
  )
print(exclusion_summary)
cat("\n")

# Set values to NA where Z-score exceeds threshold (separately for each condition)
combined_averages <- z_score_data %>%
  mutate(
    avg_colour_angle_abs_deviation = ifelse(z_score_colour > 2.5, NA, avg_colour_angle_abs_deviation),
    avg_location_angle_abs_deviation = ifelse(z_score_location > 2.5, NA, avg_location_angle_abs_deviation)
  ) %>%
  select(-z_score_colour, -z_score_location)  # Remove z-score columns

# --- Get final participant count (participants with at least some valid data) ---
final_participants <- length(unique(combined_averages$participant_id))
cat("Final number of unique participants with valid data:", final_participants, "\n")

# Count by subtype_group after filtering
group_counts_final <- combined_averages %>%
  group_by(subtype_group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
print(group_counts_final)
cat("\n")

# Add has_GCS and has_SSS factors for 2x2 factorial ANOVA
combined_averages <- combined_averages %>%
  mutate(
    has_GCS = factor(ifelse(subtype_group %in% c("GCS_only", "GCS_SSS"), 1, 0)),
    has_SSS = factor(ifelse(subtype_group %in% c("SSS_only", "GCS_SSS"), 1, 0)),
    load_n = factor(load_n)  # Make load_n a factor for ANOVA
  )

# 2x2x3 Factorial ANOVA for all load conditions
cat("=== 2x2x3 Factorial ANOVA Results (All Load Conditions) ===\n\n")

# Colour measure
cat("--- COLOUR ---\n")
colour_anova <- aov(avg_colour_angle_abs_deviation ~ has_GCS * has_SSS * load_n, data = combined_averages)
print(summary(colour_anova))

# Location measure
cat("\n--- LOCATION ---\n")
location_anova <- aov(avg_location_angle_abs_deviation ~ has_GCS * has_SSS * load_n, data = combined_averages)
print(summary(location_anova))

# Effect Size Calculation for each load separately
cat("\n=== Effect Sizes (Cohen's d) by Load ===\n\n")

calculate_cohens_d <- function(data, dv, group1_var, group2_var) {
  group1 <- data[[dv]][data$subtype_group == group1_var]
  group2 <- data[[dv]][data$subtype_group == group2_var]
  m1 <- mean(group1, na.rm = TRUE)
  m2 <- mean(group2, na.rm = TRUE)
  s1 <- sd(group1, na.rm = TRUE)
  s2 <- sd(group2, na.rm = TRUE)
  n1 <- sum(!is.na(group1))
  n2 <- sum(!is.na(group2))
  pooled_sd <- sqrt(((n1 - 1) * s1^2 + (n2 - 1) * s2^2) / (n1 + n2 - 2))
  d <- (m1 - m2) / pooled_sd
  return(d)
}

effect_sizes <- data.frame()

# Get unique load values
load_values <- sort(unique(combined_averages$load_n))

for (load in load_values) {
  load_data <- combined_averages %>% filter(load_n == load)
  
  for (measure in c("avg_colour_angle_abs_deviation", "avg_location_angle_abs_deviation")) {
    for (comparison in combn(unique(load_data$subtype_group), 2, simplify = FALSE)) {
      group1 <- comparison[1]
      group2 <- comparison[2]
      cohens_d <- calculate_cohens_d(load_data, measure, group1, group2)
      effect_sizes <- rbind(effect_sizes, data.frame(
        load_n = load,
        measure = ifelse(measure == "avg_colour_angle_abs_deviation", "colour", "location"),
        comparison = paste(group1, "-", group2),
        cohens_d = cohens_d
      ))
    }
  }
  
  cat("Load", load, "effect sizes calculated\n")
}

cat("\nEffect Sizes (Cohen's d) by Load:\n")
print(effect_sizes)

# Print organised by load
cat("\n=== Effect Sizes Organised by Load ===\n")
for (load in load_values) {
  cat("\nLoad", load, ":\n")
  load_effects <- effect_sizes %>% filter(load_n == load)
  print(load_effects %>% select(-load_n))
}

# ===============================================================================
# PLOTTING - Line plots by load (facet wrapped)
# ===============================================================================

# Calculate means and SE for colour (only non-NA values)
plot_data_colour <- combined_averages %>%
  filter(!is.na(avg_colour_angle_abs_deviation)) %>%
  group_by(load_n, subtype_group) %>%
  summarise(
    mean_deviation = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
    se_deviation = sd(avg_colour_angle_abs_deviation, na.rm = TRUE) / sqrt(n()),
    .groups = 'drop'
  ) %>%
  mutate(measure = "Colour")

# Calculate means and SE for location (only non-NA values)
plot_data_location <- combined_averages %>%
  filter(!is.na(avg_location_angle_abs_deviation)) %>%
  group_by(load_n, subtype_group) %>%
  summarise(
    mean_deviation = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
    se_deviation = sd(avg_location_angle_abs_deviation, na.rm = TRUE) / sqrt(n()),
    .groups = 'drop'
  ) %>%
  mutate(measure = "Location")

# Combine both measures
plot_data_combined <- bind_rows(plot_data_colour, plot_data_location)

# Create facet wrapped plot
stm_plot <- ggplot(plot_data_combined, aes(x = load_n, y = mean_deviation, 
                                           color = subtype_group, group = subtype_group)) +
  geom_line(size = 1) +
  geom_point(size = 3) +
  geom_errorbar(aes(ymin = mean_deviation - se_deviation, 
                    ymax = mean_deviation + se_deviation), 
                width = 0.2) +
  facet_wrap(~ measure) +
  scale_y_continuous(limits = c(0, 60)) +
  labs(title = "STM - Deviation by Load",
       x = "Load",
       y = "Mean Absolute Deviation (degrees)",
       color = "Subtype Group") +
  theme_minimal() +
  theme(legend.position = "bottom")

print(stm_plot)