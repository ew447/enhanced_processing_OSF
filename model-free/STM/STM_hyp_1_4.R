# --- Toggle: run synaesthete-only covariate analysis ---
run_syn_covariate_analysis <- TRUE  # Change to TRUE to run separate syn-only analysis

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
syn_types_path <- "<PATH_TO_PARTICIPANTS>/observation_list.xlsx"

# --- Load & label data ---
syn_data <- read.csv(syn_path) %>% mutate(group = "synaesthete")
syn_data <- filter_exclusions(syn_data)

con_data <- read.csv(con_path) %>% mutate(group = "control")
con_data <- filter_exclusions(con_data)

# Ensure participant_id is character across all datasets
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
z_score_data$group <- as.factor(z_score_data$group)
z_score_data$load_n <- as.factor(z_score_data$load_n)
z_score_data$participant_id <- as.factor(z_score_data$participant_id)

# ===============================================================================
# MAIN ANALYSIS (with load_n as within-subject factor)
# ===============================================================================

cat("=== MAIN ANALYSIS: 2 Groups (Synaesthetes vs Controls) with Load as Within-Subject Factor ===\n")

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
# SYNAESTHETE-ONLY COVARIATE ANALYSIS (separate analysis)
# ===============================================================================

if (run_syn_covariate_analysis && !is.null(syn_types_data)) {
  
  cat("\n\n================================================================================\n")
  cat("=== SEPARATE ANALYSIS: Synaesthetes Only with syn_num_types Covariate ===\n")
  cat("================================================================================\n")
  
  # Filter to synaesthetes only from the already z-score filtered data
  syn_only_data <- z_score_data %>%
    filter(group == "synaesthete")
  
  # Add covariate data
  syn_only_data <- left_join(syn_only_data, syn_types_data, by = "participant_id")
  
  # Remove missing values
  syn_only_clean <- syn_only_data[complete.cases(syn_only_data), ]
  
  cat("Synaesthetes included in covariate analysis:", nrow(syn_only_clean), "\n")
  cat("syn_num_types range:", min(syn_only_clean$syn_num_types), "to", max(syn_only_clean$syn_num_types), "\n\n")
  
  # Mixed ANCOVA for colour with load as within-subject factor
  cat("=== Synaesthete Colour Mixed ANCOVA (with syn_num_types covariate and Load) ===\n")
  syn_colour_model <- aov(avg_colour_angle_abs_deviation ~ syn_num_types * load_n + Error(participant_id/load_n), 
                         data = syn_only_clean)
  print(summary(syn_colour_model))
  
  # Mixed ANCOVA for location with load as within-subject factor
  cat("\n=== Synaesthete Location Mixed ANCOVA (with syn_num_types covariate and Load) ===\n")
  syn_location_model <- aov(avg_location_angle_abs_deviation ~ syn_num_types * load_n + Error(participant_id/load_n), 
                            data = syn_only_clean)
  print(summary(syn_location_model))
  
  # Show covariate effects using emtrends
  tryCatch({
    cat("\n=== Covariate (syn_num_types) Effect on Colour ===\n")
    syn_colour_trend <- emtrends(aov(avg_colour_angle_abs_deviation ~ syn_num_types, data = syn_only_clean), 
                                ~ 1, var = "syn_num_types")
    print(syn_colour_trend)
    
    cat("\n=== Covariate (syn_num_types) Effect on Location ===\n")
    syn_location_trend <- emtrends(aov(avg_location_angle_abs_deviation ~ syn_num_types, data = syn_only_clean), 
                                   ~ 1, var = "syn_num_types")
    print(syn_location_trend)
  }, error = function(e) {
    cat("Error with emtrends:", e$message, "\n")
  })
  
  # --- Data summary for synaesthete analysis ---
  cat("\n=== Data Summary for Synaesthete Covariate Analysis by Load ===\n")
  summary_stats_syn <- syn_only_clean %>%
    group_by(load_n) %>%
    summarise(
      n = n(),
      colour_mean = mean(avg_colour_angle_abs_deviation, na.rm = TRUE),
      colour_sd = sd(avg_colour_angle_abs_deviation, na.rm = TRUE),
      location_mean = mean(avg_location_angle_abs_deviation, na.rm = TRUE),
      location_sd = sd(avg_location_angle_abs_deviation, na.rm = TRUE),
      syn_num_types_mean = mean(syn_num_types, na.rm = TRUE),
      syn_num_types_sd = sd(syn_num_types, na.rm = TRUE),
      .groups = "drop"
    )
  print(summary_stats_syn)
  
  # Correlation between syn_num_types and performance (collapsed across load)
  cat("\n=== Correlations: syn_num_types with performance (collapsed across load) ===\n")
  syn_for_cor <- syn_only_clean %>%
    group_by(participant_id) %>%
    summarise(
      syn_num_types = first(syn_num_types),
      avg_colour = mean(avg_colour_angle_abs_deviation),
      avg_location = mean(avg_location_angle_abs_deviation),
      .groups = "drop"
    )
  
  colour_cor <- cor(syn_for_cor$syn_num_types, syn_for_cor$avg_colour, use = "complete.obs")
  location_cor <- cor(syn_for_cor$syn_num_types, syn_for_cor$avg_location, use = "complete.obs")
  
  cat("Correlation between syn_num_types and colour deviation:", round(colour_cor, 3), "\n")
  cat("Correlation between syn_num_types and location deviation:", round(location_cor, 3), "\n")
}

# ===============================================================================
# FINAL SUMMARY
# ===============================================================================

cat("\n\n================================================================================\n")
cat("=== FINAL SUMMARY ===\n")
cat("================================================================================\n")

cat("Main analysis: 2 groups (synaesthete vs control) × 3 loads (1, 3, 5)\n")
cat("Total observations in main analysis:", nrow(z_score_data), "\n")
cat("Unique participants in main analysis:", length(unique(z_score_data$participant_id)), "\n")

if (run_syn_covariate_analysis && !is.null(syn_types_data)) {
  cat("Separate synaesthete covariate analysis: YES\n")
  if (exists("syn_only_clean")) {
    cat("Total observations in synaesthete analysis:", nrow(syn_only_clean), "\n")
    cat("Unique participants in synaesthete analysis:", length(unique(syn_only_clean$participant_id)), "\n")
  }
} else {
  cat("Separate synaesthete covariate analysis: NO\n")
}

# --- Per-load one-way ANOVAs: Syns vs Controls (for robustness check compatibility) ---
for (ld in c(1, 3, 5)) {
  d <- z_score_data[z_score_data$load_n == ld, ]
  assign(paste0("colour_anova_load",   ld), aov(avg_colour_angle_abs_deviation   ~ group, data = d))
  assign(paste0("location_anova_load", ld), aov(avg_location_angle_abs_deviation ~ group, data = d))
}
