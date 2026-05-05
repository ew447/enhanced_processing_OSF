# Load libraries
library(dplyr)
library(tidyr)
library(stats)
library(readxl)
library(ggplot2)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# File paths
syn_path <- "<PATH_TO_DATA>/Synaesthetes/VP.csv"
con_path <- "<PATH_TO_DATA>/Controls/VP.csv"
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

# Calculate participant-level averages for each subtype group
syn_averages <- syn_data_with_subtypes %>%
  group_by(participant_id, subtype_group) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  )

# Add control group to the dataset
con_averages <- con_data %>%
  group_by(participant_id) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    subtype_group = "Control",
    .groups = 'drop'
  )

# Combine datasets
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
# TASK-SPECIFIC Z-SCORE FILTERING
# ===============================================================================

# COLOUR-filtered dataset
colour_filtered <- combined_averages %>%
  group_by(subtype_group) %>%
  mutate(
    z_score_colour = (avg_colour_angle_abs_deviation -
                        mean(avg_colour_angle_abs_deviation, na.rm = TRUE)) /
      sd(avg_colour_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup() %>%
  filter(z_score_colour <= 2.5) %>%
  select(participant_id, subtype_group, avg_colour_angle_abs_deviation)

# LOCATION-filtered dataset
location_filtered <- combined_averages %>%
  group_by(subtype_group) %>%
  mutate(
    z_score_location = (avg_location_angle_abs_deviation -
                          mean(avg_location_angle_abs_deviation, na.rm = TRUE)) /
      sd(avg_location_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup() %>%
  filter(z_score_location <= 2.5) %>%
  select(participant_id, subtype_group, avg_location_angle_abs_deviation)

# --- TRACKING: Final participant counts ---
final_participants_colour <- length(unique(colour_filtered$participant_id))
excluded_participants_colour <- initial_participants - final_participants_colour
cat("COLOUR analysis - Final participants:", final_participants_colour, "| Excluded:", excluded_participants_colour, "\n")

final_participants_location <- length(unique(location_filtered$participant_id))
excluded_participants_location <- initial_participants - final_participants_location
cat("LOCATION analysis - Final participants:", final_participants_location, "| Excluded:", excluded_participants_location, "\n\n")

# Count by subtype_group after filtering
cat("COLOUR analysis by subtype:\n")
print(colour_filtered %>% group_by(subtype_group) %>% summarise(n = n_distinct(participant_id)))
cat("\n")

cat("LOCATION analysis by subtype:\n")
print(location_filtered %>% group_by(subtype_group) %>% summarise(n = n_distinct(participant_id)))
cat("\n")

# Add has_GCS and has_SSS factors
colour_filtered <- colour_filtered %>%
  mutate(
    has_GCS = factor(ifelse(subtype_group %in% c("GCS_only", "GCS_SSS"), 1, 0)),
    has_SSS = factor(ifelse(subtype_group %in% c("SSS_only", "GCS_SSS"), 1, 0))
  )

location_filtered <- location_filtered %>%
  mutate(
    has_GCS = factor(ifelse(subtype_group %in% c("GCS_only", "GCS_SSS"), 1, 0)),
    has_SSS = factor(ifelse(subtype_group %in% c("SSS_only", "GCS_SSS"), 1, 0))
  )

# ===============================================================================
# 2×2×2 MIXED ANOVA (Condition × GCS × SSS)
# ===============================================================================

# Convert to long format
colour_long <- colour_filtered %>%
  mutate(condition = "Colour",
         deviation = avg_colour_angle_abs_deviation)

location_long <- location_filtered %>%
  mutate(condition = "Location",
         deviation = avg_location_angle_abs_deviation)

anova_long <- bind_rows(colour_long, location_long) %>%
  mutate(
    condition = factor(condition),
    has_GCS = factor(has_GCS),
    has_SSS = factor(has_SSS)
  )

cat("=== 2×2×2 Mixed ANOVA ===\n\n")

anova_2x2x2 <- aov(
  deviation ~ condition * has_GCS * has_SSS +
    Error(participant_id / condition),
  data = anova_long
)

print(summary(anova_2x2x2))

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
for (comparison in combn(unique(colour_filtered$subtype_group), 2, simplify = FALSE)) {
  group1 <- comparison[1]
  group2 <- comparison[2]
  cohens_d <- calculate_cohens_d(colour_filtered, "avg_colour_angle_abs_deviation", group1, group2)
  effect_sizes_colour <- rbind(effect_sizes_colour, data.frame(
    comparison = paste(group1, "-", group2),
    cohens_d = cohens_d
  ))
}
print(effect_sizes_colour)

cat("\n=== Effect Sizes for LOCATION (Cohen's d) ===\n")
effect_sizes_location <- data.frame()
for (comparison in combn(unique(location_filtered$subtype_group), 2, simplify = FALSE)) {
  group1 <- comparison[1]
  group2 <- comparison[2]
  cohens_d <- calculate_cohens_d(location_filtered, "avg_location_angle_abs_deviation", group1, group2)
  effect_sizes_location <- rbind(effect_sizes_location, data.frame(
    comparison = paste(group1, "-", group2),
    cohens_d = cohens_d
  ))
}
print(effect_sizes_location)

# ===============================================================================
# PLOTTING
# ===============================================================================

colour_data <- colour_filtered %>%
  mutate(measure = "Colour") %>%
  rename(deviation = avg_colour_angle_abs_deviation)

location_data <- location_filtered %>%
  mutate(measure = "Location") %>%
  rename(deviation = avg_location_angle_abs_deviation)

plot_data_combined <- bind_rows(colour_data, location_data)

vp_plot <- ggplot(plot_data_combined, aes(x = deviation, fill = subtype_group)) +
  geom_density(alpha = 0.6) +
  facet_wrap(~ measure) +
  scale_x_continuous(limits = c(-2, 15)) +
  labs(title = "VP - Deviation Distribution",
       x = "Absolute Deviation (degrees)",
       y = "Density",
       fill = "Subtype Group") +
  theme_minimal() +
  theme(legend.position = "bottom")

print(vp_plot)
