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
syn_data <- read.csv(syn_path) %>% filter_exclusions()
con_data <- read.csv(con_path) %>% filter_exclusions()
subtype_data <- read_excel(subtype_path)

# Ensure participant_id is character
syn_data$participant_id <- as.character(syn_data$participant_id)
con_data$participant_id <- as.character(con_data$participant_id)
subtype_data$participant_id <- as.character(subtype_data$participant_id)

# Merge subtype information
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
# STEP 1: Rep-4 averages for exclusion decisions
# ===============================================================================

syn_rep4 <- syn_data_with_subtypes %>%
  filter(repetition == 4) %>%
  group_by(participant_id, subtype_group) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = "drop"
  )

con_rep4 <- con_data %>%
  filter(repetition == 4) %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    subtype_group = "Control",
    .groups = "drop"
  )

final_block <- bind_rows(syn_rep4, con_rep4)

# ===============================================================================
# STEP 2: All-reps averages (1-4) as actual DVs — computed per condition
# ===============================================================================

syn_averages <- syn_data_with_subtypes %>%
  group_by(participant_id, subtype_group) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = "drop"
  )

con_averages <- con_data %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    subtype_group = "Control",
    .groups = "drop"
  )

combined_averages <- bind_rows(syn_averages, con_averages) %>%
  mutate(
    has_GCS = factor(ifelse(subtype_group %in% c("GCS_only", "GCS_SSS"), 1, 0)),
    has_SSS = factor(ifelse(subtype_group %in% c("SSS_only", "GCS_SSS"), 1, 0))
  )

# ===============================================================================
# Z-SCORE FILTERING (based on rep 4, applied separately per condition)
# ===============================================================================

colour_filtered_ids <- final_block %>%
  group_by(subtype_group) %>%
  mutate(z = (avg_colour_angle_abs_deviation - mean(avg_colour_angle_abs_deviation)) /
           sd(avg_colour_angle_abs_deviation)) %>%
  filter(z <= 2.5) %>%
  pull(participant_id)

location_filtered_ids <- final_block %>%
  group_by(subtype_group) %>%
  mutate(z = (avg_location_angle_abs_deviation - mean(avg_location_angle_abs_deviation)) /
           sd(avg_location_angle_abs_deviation)) %>%
  filter(z <= 2.5) %>%
  pull(participant_id)

combined_averages_colour <- combined_averages %>% filter(participant_id %in% colour_filtered_ids)
combined_averages_location <- combined_averages %>% filter(participant_id %in% location_filtered_ids)

# ===============================================================================
# 2×2 FACTORIAL ANOVA — separately for each condition
# ===============================================================================

cat("=== 2×2 Factorial ANOVA (averaged across reps 1-4) ===\n\n")

cat("--- COLOUR ---\n")
colour_anova <- aov(avg_colour_angle_abs_deviation ~ has_GCS * has_SSS,
                    data = combined_averages_colour)
print(summary(colour_anova))

cat("\n--- LOCATION ---\n")
location_anova <- aov(avg_location_angle_abs_deviation ~ has_GCS * has_SSS,
                      data = combined_averages_location)
print(summary(location_anova))

# ===============================================================================
# COMBINED CONDITION ANOVA (condition as within-subjects factor)
# Only includes participants present in BOTH filtered datasets
# ===============================================================================

cat("\n=== 2×2×Condition Mixed ANOVA (Colour vs Location as within-subjects) ===\n\n")

# Get participants present in both filtered datasets
both_ids <- intersect(colour_filtered_ids, location_filtered_ids)

# Build long-format data for these participants
combined_long <- bind_rows(
  combined_averages_colour %>%
    filter(participant_id %in% both_ids) %>%
    mutate(condition = "Colour", deviation = avg_colour_angle_abs_deviation),
  combined_averages_location %>%
    filter(participant_id %in% both_ids) %>%
    mutate(condition = "Location", deviation = avg_location_angle_abs_deviation)
) %>%
  mutate(condition = factor(condition)) %>%
  select(participant_id, subtype_group, has_GCS, has_SSS, condition, deviation)

cat("Participants in combined analysis:", length(both_ids), "\n\n")

mixed_anova <- aov(
  deviation ~ condition * has_GCS * has_SSS + Error(participant_id / condition),
  data = combined_long
)
print(summary(mixed_anova))

# ===============================================================================
# EFFECT SIZES
# ===============================================================================

calculate_d <- function(data, dv, g1, g2) {
  x <- data[[dv]][data$subtype_group == g1]
  y <- data[[dv]][data$subtype_group == g2]
  m1 <- mean(x); m2 <- mean(y)
  s1 <- sd(x); s2 <- sd(y)
  n1 <- length(x); n2 <- length(y)
  pooled <- sqrt(((n1-1)*s1^2 + (n2-1)*s2^2) / (n1+n2-2))
  (m1 - m2) / pooled
}

# ===============================================================================
# DESCRIPTIVE STATISTICS
# ===============================================================================

cat("\n=== Descriptive Statistics ===\n")
cat("\nCOLOUR:\n")
print(combined_averages_colour %>%
        group_by(subtype_group) %>%
        summarise(
          n = n(),
          mean = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
          sd = sd(avg_colour_angle_abs_deviation, na.rm = TRUE),
          .groups = "drop"
        ))

cat("\nLOCATION:\n")
print(combined_averages_location %>%
        group_by(subtype_group) %>%
        summarise(
          n = n(),
          mean = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
          sd = sd(avg_location_angle_abs_deviation, na.rm = TRUE),
          .groups = "drop"
        ))

# ===============================================================================
# PLOTTING
# ===============================================================================

plot_colour <- combined_averages_colour %>%
  group_by(subtype_group) %>%
  summarise(
    mean_dev = mean(avg_colour_angle_abs_deviation),
    se = sd(avg_colour_angle_abs_deviation) / sqrt(n()),
    .groups = "drop"
  ) %>%
  mutate(measure = "Colour")

plot_location <- combined_averages_location %>%
  group_by(subtype_group) %>%
  summarise(
    mean_dev = mean(avg_location_angle_abs_deviation),
    se = sd(avg_location_angle_abs_deviation) / sqrt(n()),
    .groups = "drop"
  ) %>%
  mutate(measure = "Location")

plot_data <- bind_rows(plot_colour, plot_location)

ltmi_plot <- ggplot(plot_data, aes(x = subtype_group, y = mean_dev, fill = subtype_group)) +
  geom_bar(stat = "identity", position = position_dodge()) +
  geom_errorbar(aes(ymin = mean_dev - se, ymax = mean_dev + se), width = 0.2) +
  facet_wrap(~ measure) +
  labs(title = "LTMI - Mean Deviation by Subtype (averaged across reps 1-4)",
       x = "Subtype Group", y = "Mean Absolute Deviation (degrees)") +
  theme_minimal() +
  theme(legend.position = "bottom")

print(ltmi_plot)
