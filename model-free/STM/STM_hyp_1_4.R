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
syn_path <- "<PATH_TO_DATA>/Synaesthetes/STM.csv"
con_path <- "<PATH_TO_DATA>/Controls/STM.csv"
rel_path <- "<PATH_TO_DATA>/Relatives/STM.csv"

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

# --- Participant-level averages ---
syn_averages <- syn_data %>%
  group_by(participant_id, load_n) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "synaesthete")

con_averages <- con_data %>%
  group_by(participant_id, load_n) %>%
  summarise(
    avg_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE),
    avg_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE),
    .groups = 'drop'
  ) %>%
  mutate(group = "control")

rel_averages <- rel_data %>%
  group_by(participant_id, load_n) %>%
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

# --- Perform Z-score filtering by load ---
z_score_data <- combined_averages %>%
  group_by(group, load_n) %>%  
  mutate(
    z_score_colour = (avg_colour_angle_abs_deviation - mean(avg_colour_angle_abs_deviation, na.rm = TRUE)) / 
      sd(avg_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_location = (avg_location_angle_abs_deviation - mean(avg_location_angle_abs_deviation, na.rm = TRUE)) / 
      sd(avg_location_angle_abs_deviation, na.rm = TRUE)
  ) %>%
  ungroup()

# Track exclusions
cat("Exclusions by load and condition:\n")
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
  select(-z_score_colour, -z_score_location)

# --- Get final participant count ---
final_participants <- length(unique(combined_averages$participant_id))
cat("Final number of unique participants with valid data:", final_participants, "\n")

# Count by group after filtering
group_counts_final <- combined_averages %>%
  group_by(group) %>%
  summarise(n_participants = n_distinct(participant_id), .groups = "drop")
print(group_counts_final)
cat("\n")

# Convert factors for ANOVA
z_score_data$group <- factor(z_score_data$group, levels = c("control", "relative", "synaesthete"))
z_score_data$load_n <- as.factor(z_score_data$load_n)
z_score_data$participant_id <- as.factor(z_score_data$participant_id)

# ===============================================================================
# MAIN ANALYSIS (with load_n as within-subject factor)
# ===============================================================================

cat(
  if (include_relatives)
    "=== MAIN ANALYSIS: 3 Groups (Synaesthetes vs Relatives vs Controls) with Load as Within-Subject Factor ===\n"
  else
    "=== MAIN ANALYSIS: 2 Groups (Synaesthetes vs Controls) with Load as Within-Subject Factor ===\n"
)

# --- Mixed ANOVA for colour angle deviation ---
cat("\n=== Mixed ANOVA for Colour Angle Deviation ===\n")
colour_mixed_anova <- aov(avg_colour_angle_abs_deviation ~ group * load_n + Error(participant_id/load_n), 
                         data = z_score_data)
print(summary(colour_mixed_anova))

# Extract p-values for colour
colour_results <- summary(colour_mixed_anova)
# Between-subjects effects
colour_group_p <- colour_results$`Error: participant_id`[[1]]$`Pr(>F)`[1]
# Within-subjects effects
colour_load_p <- colour_results$`Error: participant_id:load_n`[[1]]$`Pr(>F)`[1]
colour_interaction_p <- colour_results$`Error: participant_id:load_n`[[1]]$`Pr(>F)`[2]

# --- Post-hoc tests for colour ---
# Main effect of group
if (!is.na(colour_group_p) && colour_group_p < 0.05) {
  cat("\n=== Colour: Main Effect of Group - Pairwise Comparisons ===\n")
  colour_emm_group <- emmeans(aov(avg_colour_angle_abs_deviation ~ group, data = z_score_data), 
                             specs = "group")
  print(pairs(colour_emm_group, adjust = "tukey"))
}

# Main effect of load
if (!is.na(colour_load_p) && colour_load_p < 0.05) {
  cat("\n=== Colour: Main Effect of Load - Pairwise Comparisons ===\n")
  colour_emm_load <- emmeans(aov(avg_colour_angle_abs_deviation ~ load_n, data = z_score_data), 
                            specs = "load_n")
  print(pairs(colour_emm_load, adjust = "tukey"))
}

# Interaction: simple effects
if (!is.na(colour_interaction_p) && colour_interaction_p < 0.05) {
  cat("\n=== Colour: Group × Load Interaction - Simple Effects ===\n")
  colour_emm_interaction <- emmeans(aov(avg_colour_angle_abs_deviation ~ group * load_n, data = z_score_data),
                                   specs = ~ group | load_n)
  cat("\nEffect of Group at each Load level:\n")
  print(pairs(colour_emm_interaction, adjust = "tukey"))
  
  colour_emm_interaction2 <- emmeans(aov(avg_colour_angle_abs_deviation ~ group * load_n, data = z_score_data),
                                    specs = ~ load_n | group)
  cat("\nEffect of Load within each Group:\n")
  print(pairs(colour_emm_interaction2, adjust = "tukey"))
}

# --- Mixed ANOVA for location angle deviation ---
cat("\n\n=== Mixed ANOVA for Location Angle Deviation ===\n")
location_mixed_anova <- aov(avg_location_angle_abs_deviation ~ group * load_n + Error(participant_id/load_n), 
                            data = z_score_data)
print(summary(location_mixed_anova))

# Extract p-values for location
location_results <- summary(location_mixed_anova)
# Between-subjects effects
location_group_p <- location_results$`Error: participant_id`[[1]]$`Pr(>F)`[1]
# Within-subjects effects
location_load_p <- location_results$`Error: participant_id:load_n`[[1]]$`Pr(>F)`[1]
location_interaction_p <- location_results$`Error: participant_id:load_n`[[1]]$`Pr(>F)`[2]

# --- Post-hoc tests for location ---
# Main effect of group
if (!is.na(location_group_p) && location_group_p < 0.05) {
  cat("\n=== Location: Main Effect of Group - Pairwise Comparisons ===\n")
  location_emm_group <- emmeans(aov(avg_location_angle_abs_deviation ~ group, data = z_score_data), 
                                specs = "group")
  print(pairs(location_emm_group, adjust = "tukey"))
}

# Main effect of load
if (!is.na(location_load_p) && location_load_p < 0.05) {
  cat("\n=== Location: Main Effect of Load - Pairwise Comparisons ===\n")
  location_emm_load <- emmeans(aov(avg_location_angle_abs_deviation ~ load_n, data = z_score_data), 
                               specs = "load_n")
  print(pairs(location_emm_load, adjust = "tukey"))
}

# Interaction: simple effects
if (!is.na(location_interaction_p) && location_interaction_p < 0.05) {
  cat("\n=== Location: Group × Load Interaction - Simple Effects ===\n")
  location_emm_interaction <- emmeans(aov(avg_location_angle_abs_deviation ~ group * load_n, data = z_score_data),
                                      specs = ~ group | load_n)
  cat("\nEffect of Group at each Load level:\n")
  print(pairs(location_emm_interaction, adjust = "tukey"))
  
  location_emm_interaction2 <- emmeans(aov(avg_location_angle_abs_deviation ~ group * load_n, data = z_score_data),
                                       specs = ~ load_n | group)
  cat("\nEffect of Load within each Group:\n")
  print(pairs(location_emm_interaction2, adjust = "tukey"))
}

# --- Data summary for main analysis ---
cat("\n=== Data Summary by Group and Load ===\n")
summary_stats_main <- z_score_data %>%
  group_by(group, load_n) %>%
  summarise(
    n = n(),
    colour_mean = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
    colour_sd = sd(avg_colour_angle_abs_deviation, na.rm = TRUE),
    location_mean = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
    location_sd = sd(avg_location_angle_abs_deviation, na.rm = TRUE),
    .groups = "drop"
  )
print(summary_stats_main)

# ===============================================================================
# FINAL SUMMARY
# ===============================================================================

cat("\n\n================================================================================\n")
cat("=== FINAL SUMMARY ===\n")
cat("================================================================================\n")

cat(
  if (include_relatives)
    "Main analysis: 3 groups (synaesthete vs relative vs control) × 3 loads (1, 3, 5)\n"
  else
    "Main analysis: 2 groups (synaesthete vs control) × 3 loads (1, 3, 5)\n"
)
cat("Total observations in main analysis:", nrow(z_score_data), "\n")
cat("Unique participants in main analysis:", length(unique(z_score_data$participant_id)), "\n")

# --- Per-load one-way ANOVAs: Syns vs Controls (for robustness check compatibility) ---
for (ld in c(1, 3, 5)) {
  d <- z_score_data[z_score_data$load_n == ld, ]
  assign(paste0("colour_anova_load",   ld), aov(avg_colour_angle_abs_deviation   ~ group, data = d))
  assign(paste0("location_anova_load", ld), aov(avg_location_angle_abs_deviation ~ group, data = d))
}
