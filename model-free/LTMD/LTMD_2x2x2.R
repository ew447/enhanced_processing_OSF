library(dplyr)
library(tidyr)
library(stats)
library(readxl)
library(ggplot2)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# File paths
syn_path <- "<PATH_TO_DATA>/Synaesthetes/LTMD.csv"
con_path <- "<PATH_TO_DATA>/Controls/LTMD.csv"
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

# Participant-level averages
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

# Combine datasets
combined_averages <- bind_rows(syn_averages, con_averages)

# Add GCS/SSS factors EARLY
combined_averages <- combined_averages %>%
  mutate(
    has_GCS = factor(ifelse(subtype_group %in% c("GCS_only", "GCS_SSS"), 1, 0)),
    has_SSS = factor(ifelse(subtype_group %in% c("SSS_only", "GCS_SSS"), 1, 0))
  )

# --- Z-score filtering ---
colour_filtered <- combined_averages %>%
  group_by(subtype_group) %>%
  mutate(z = (avg_colour_angle_abs_deviation - mean(avg_colour_angle_abs_deviation)) /
           sd(avg_colour_angle_abs_deviation)) %>%
  filter(z <= 2.5) %>%
  select(participant_id, subtype_group, avg_colour_angle_abs_deviation)

location_filtered <- combined_averages %>%
  group_by(subtype_group) %>%
  mutate(z = (avg_location_angle_abs_deviation - mean(avg_location_angle_abs_deviation)) /
           sd(avg_location_angle_abs_deviation)) %>%
  filter(z <= 2.5) %>%
  select(participant_id, subtype_group, avg_location_angle_abs_deviation)

# Add GCS/SSS to filtered datasets
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

cat("=== 2×2×2 Mixed ANOVA (Condition × GCS × SSS) ===\n\n")

# Long format
ltmd_colour_long <- combined_averages %>%
  mutate(condition = "Colour", deviation = avg_colour_angle_abs_deviation) %>%
  select(participant_id, subtype_group, has_GCS, has_SSS, condition, deviation)

ltmd_location_long <- combined_averages %>%
  mutate(condition = "Location", deviation = avg_location_angle_abs_deviation) %>%
  select(participant_id, subtype_group, has_GCS, has_SSS, condition, deviation)

ltmd_long <- bind_rows(ltmd_colour_long, ltmd_location_long) %>%
  mutate(
    condition = factor(condition),
    has_GCS = factor(has_GCS),
    has_SSS = factor(has_SSS)
  )

# Mixed ANOVA
ltmd_anova <- aov(
  deviation ~ condition * has_GCS * has_SSS +
    Error(participant_id / condition),
  data = ltmd_long
)

print(summary(ltmd_anova))

# ===============================================================================
# EFFECT SIZES
# ===============================================================================

calculate_d <- function(data, dv, g1, g2) {
  x <- data[[dv]][data$subtype_group == g1]
  y <- data[[dv]][data$subtype_group == g2]
  m1 <- mean(x); m2 <- mean(y)
  s1 <- sd(x); s2 <- sd(y)
  n1 <- length(x); n2 <- length(y)
  pooled <- sqrt(((n1-1)*s1^2 + (n2-1)*s2^2)/(n1+n2-2))
  (m1 - m2) / pooled
}

# ===============================================================================
# PLOTTING
# ===============================================================================

colour_data <- colour_filtered %>%
  mutate(measure = "Colour", deviation = avg_colour_angle_abs_deviation)

location_data <- location_filtered %>%
  mutate(measure = "Location", deviation = avg_location_angle_abs_deviation)

plot_data <- bind_rows(colour_data, location_data)

ltmd_plot <- ggplot(plot_data, aes(x = deviation, fill = subtype_group)) +
  geom_density(alpha = 0.6) +
  facet_wrap(~ measure) +
  scale_x_continuous(limits = c(-5, 60)) +
  labs(title = "LTMD – Deviation Distribution",
       x = "Absolute Deviation (degrees)",
       y = "Density",
       fill = "Subtype Group") +
  theme_minimal() +
  theme(legend.position = "bottom")

print(ltmd_plot)
