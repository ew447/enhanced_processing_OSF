library(tidyverse)
library(readxl)
library(ggplot2)
library(gridExtra)
library(corrplot)
library(RColorBrewer)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# ===============================================================================
# FILE PATHS
# ===============================================================================

# Task data paths - SYNAESTHETES ONLY
syn_ltmi_path <- "<PATH_TO_DATA>/Synaesthetes/LTMI.csv"
syn_ltmd_path <- "<PATH_TO_DATA>/Synaesthetes/LTMD.csv"
syn_vp_path <- "<PATH_TO_DATA>/Synaesthetes/VP.csv"
syn_stm_path <- "<PATH_TO_DATA>/Synaesthetes/STM.csv"

# Questionnaire data paths - SYNAESTHETES ONLY
syn_quest_path <- "<PATH_TO_DATA>/Synaesthetes/questionnaires.csv"

# File for synaesthesia subtypes
observation_list_path <- "<PATH_TO_PARTICIPANTS>/observation_list.xlsx"

# ===============================================================================
# FUNCTIONS
# ===============================================================================

# Function to load and prepare task data
load_task_data <- function(path, task_name) {
  data <- read.csv(path) %>%
    mutate(participant_id = as.character(participant_id))
  data <- filter_exclusions(data)
  return(data)
}

# Function to calculate accuracy from task data
calculate_accuracy <- function(data, colour_var, location_var) {
  data %>%
    mutate(
      colour_accuracy = 1 - !!sym(colour_var),
      location_accuracy = 1 - !!sym(location_var)
    )
}

# ===============================================================================
# LOAD ALL DATA
# ===============================================================================

cat("Loading synaesthete data...\n")

# Load task data for synaesthetes only
syn_ltmi <- load_task_data(syn_ltmi_path, "LTMI")
syn_ltmd <- load_task_data(syn_ltmd_path, "LTMD")
syn_vp <- load_task_data(syn_vp_path, "VP")
syn_stm <- load_task_data(syn_stm_path, "STM")

# Load questionnaire data
syn_quest <- read.csv(syn_quest_path) %>% 
  mutate(participant_id = as.character(participant_id))

# Load observation list for synaesthesia subtypes
observation_list <- read_excel(observation_list_path, sheet = "Synaesthetes") %>%
  mutate(participant_id = as.character(participant_id))

cat("Data loaded successfully!\n\n")

# ===============================================================================
# CALCULATE TASK ACCURACY MEASURES
# ===============================================================================

cat("Calculating accuracy measures...\n")

# LTMI - all repetitions (1-4)
ltmi_accuracy <- syn_ltmi %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id) %>%
  summarise(
    LTMI_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    LTMI_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

# LTMD - colour and location separate
ltmd_accuracy <- syn_ltmd %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id) %>%
  summarise(
    LTMD_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    LTMD_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

# VP - colour and location separate
vp_accuracy <- syn_vp %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id) %>%
  summarise(
    VP_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    VP_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

# STM - colour and location separate, collapsed across load_n
stm_accuracy <- syn_stm %>%
  calculate_accuracy("colour_angle_abs_deviation", "location_angle_abs_deviation") %>%
  group_by(participant_id) %>%
  summarise(
    STM_colour_accuracy = mean(colour_accuracy, na.rm = TRUE),
    STM_location_accuracy = mean(location_accuracy, na.rm = TRUE),
    .groups = 'drop'
  )

cat("Accuracy measures calculated!\n\n")

# ===============================================================================
# PREPARE QUESTIONNAIRE DATA
# ===============================================================================

cat("Preparing questionnaire data...\n")

# Process questionnaire data and calculate mean self-determination index
questionnaires_all <- syn_quest %>%
  mutate(
    mean_selfdetermination_index = rowMeans(
      select(., LTMI_selfdetermination_index, LTMD_VP_selfdetermination_index, STM_selfdetermination_index),
      na.rm = TRUE
    )
  ) %>%
  select(participant_id, mean_selfdetermination_index, 
         imagery_ability, technical_cognition, word_forms, 
         organisation, global_bias, systemising_tendency)

cat("Questionnaire data prepared!\n\n")

# ===============================================================================
# GET SYNAESTHESIA SUBTYPE DATA
# ===============================================================================

cat("Preparing synaesthesia subtype data...\n")

# Get from observation list
subtype_data <- observation_list %>%
  select(participant_id, has_GCS, has_SSS, syn_num_types) %>%
  rename(number_of_types = syn_num_types)

cat("Synaesthesia subtype data prepared!\n\n")

# ===============================================================================
# MERGE ALL DATA
# ===============================================================================

cat("Merging all datasets...\n")

# Merge task accuracies
merged_data <- ltmi_accuracy %>%
  full_join(ltmd_accuracy, by = "participant_id") %>%
  full_join(vp_accuracy, by = "participant_id") %>%
  full_join(stm_accuracy, by = "participant_id") %>%
  full_join(questionnaires_all, by = "participant_id") %>%
  full_join(subtype_data, by = "participant_id")

cat("Data merged successfully!\n")
cat("Total synaesthetes:", nrow(merged_data), "\n\n")

# ===============================================================================
# EXAMINE NUMBER OF TYPES DISTRIBUTION
# ===============================================================================

cat("========================================\n")
cat("NUMBER OF SYNAESTHESIA TYPES DISTRIBUTION\n")
cat("========================================\n\n")

types_summary <- merged_data %>%
  count(number_of_types) %>%
  arrange(number_of_types)

cat("Distribution of number of types:\n")
print(types_summary)
cat("\n")

cat("Summary statistics:\n")
cat("  Mean:", mean(merged_data$number_of_types, na.rm = TRUE), "\n")
cat("  Median:", median(merged_data$number_of_types, na.rm = TRUE), "\n")
cat("  Range:", min(merged_data$number_of_types, na.rm = TRUE), "to", 
    max(merged_data$number_of_types, na.rm = TRUE), "\n\n")

# ===============================================================================
# CREATE GROUPING VARIABLE (OPTIONAL - for some analyses)
# ===============================================================================

cat("Creating optional grouping variable based on number of types...\n")
cat("(Primary analysis will use number of types as continuous 1-9)\n\n")

# Median split (for Mahalanobis D which requires groups)
median_types <- median(merged_data$number_of_types, na.rm = TRUE)

merged_data <- merged_data %>%
  mutate(
    types_group_median = factor(
      ifelse(number_of_types <= median_types, "few_types", "many_types"),
      levels = c("few_types", "many_types")
    )
  )

cat("Median split (threshold =", median_types, "):\n")
cat("  Few types (<=", median_types, "):", 
    sum(merged_data$types_group_median == "few_types", na.rm = TRUE), "\n")
cat("  Many types (>", median_types, "):", 
    sum(merged_data$types_group_median == "many_types", na.rm = TRUE), "\n\n")

# ===============================================================================
# PERFORMANCE EXCLUSIONS (UPPER TAIL ONLY: z > +2.5)
# ===============================================================================

cat("Applying UPPER 2.5 SD performance exclusions...\n\n")

performance_vars_for_exclusion <- c(
  "LTMI_colour_accuracy", "LTMI_location_accuracy",
  "LTMD_colour_accuracy", "LTMD_location_accuracy",
  "VP_colour_accuracy", "VP_location_accuracy",
  "STM_colour_accuracy", "STM_location_accuracy"
)

# Calculate z-scores
z_df <- merged_data %>%
  select(participant_id, all_of(performance_vars_for_exclusion)) %>%
  pivot_longer(cols = all_of(performance_vars_for_exclusion),
               names_to = "variable",
               values_to = "value") %>%
  group_by(variable) %>%
  mutate(
    mean_val = mean(value, na.rm = TRUE),
    sd_val   = sd(value, na.rm = TRUE),
    z        = (value - mean_val) / sd_val
  ) %>%
  ungroup()

outlier_ids <- z_df %>%
  filter(!is.na(z) & z > 2.5) %>%
  distinct(participant_id)

cat("Number of participants excluded by UPPER 2.5 SD rule:",
    nrow(outlier_ids), "\n")

if (nrow(outlier_ids) > 0) {
  cat("Excluded participant IDs:\n")
  print(outlier_ids)
}

# Apply exclusion
merged_data <- merged_data %>%
  filter(!participant_id %in% outlier_ids$participant_id)

cat("Remaining participants after performance exclusion:", nrow(merged_data), "\n\n")

# ===============================================================================
# PREPARE DATA FOR ANALYSIS
# ===============================================================================

cat("Preparing data for analysis...\n")

# Select predictor variables
predictor_vars <- c(
  "imagery_ability", "technical_cognition", "word_forms",
  "organisation", "global_bias", "systemising_tendency",
  "LTMI_colour_accuracy", "LTMI_location_accuracy",
  "LTMD_colour_accuracy", "LTMD_location_accuracy",
  "VP_colour_accuracy", "VP_location_accuracy",
  "STM_colour_accuracy", "STM_location_accuracy"
)

# Report missing data
cat("\nMissing data check:\n")
missing_counts <- merged_data %>%
  select(all_of(predictor_vars), number_of_types) %>%
  summarise(across(everything(), ~sum(is.na(.)))) %>%
  pivot_longer(everything(), names_to = "variable", values_to = "n_missing") %>%
  filter(n_missing > 0) %>%
  arrange(desc(n_missing))

if (nrow(missing_counts) > 0) {
  print(missing_counts)
} else {
  cat("  No missing data!\n")
}

# Create complete cases dataset
analysis_data <- merged_data %>%
  select(participant_id, number_of_types, has_GCS, has_SSS, 
         types_group_median, all_of(predictor_vars)) %>%
  drop_na()

cat("\nData prepared:\n")
cat("  Initial synaesthetes:", nrow(merged_data), "\n")
cat("  After complete case filtering:", nrow(analysis_data), "\n")
cat("  Participants excluded due to missing data:", 
    nrow(merged_data) - nrow(analysis_data), "\n\n")

# ===============================================================================
# CORRELATION ANALYSIS: Number of types vs cognitive variables
# ===============================================================================

cat("========================================\n")
cat("CORRELATION ANALYSIS\n")
cat("========================================\n\n")

cat("Correlations between number of types and cognitive variables:\n\n")

correlation_results <- data.frame(
  Variable = predictor_vars,
  Correlation = numeric(length(predictor_vars)),
  p_value = numeric(length(predictor_vars))
)

for (i in 1:length(predictor_vars)) {
  var <- predictor_vars[i]
  test <- cor.test(analysis_data$number_of_types, 
                   analysis_data[[var]], 
                   use = "complete.obs")
  correlation_results$Correlation[i] <- test$estimate
  correlation_results$p_value[i] <- test$p.value
}

correlation_results <- correlation_results %>%
  mutate(
    Significance = case_when(
      p_value < 0.001 ~ "***",
      p_value < 0.01 ~ "**",
      p_value < 0.05 ~ "*",
      TRUE ~ ""
    )
  ) %>%
  arrange(desc(abs(Correlation)))

print(correlation_results, row.names = FALSE)

cat("\nSignificance codes: *** p<0.001, ** p<0.01, * p<0.05\n\n")

# Save correlation results
write.csv(correlation_results,
          "<PATH_TO_DATA>/types_correlation_results.csv",
          row.names = FALSE)

# ===============================================================================
# VISUALIZATIONS: Number of types vs cognitive variables
# ===============================================================================

cat("========================================\n")
cat("CREATING VISUALIZATIONS\n")
cat("========================================\n\n")

cat("Generating plots for number of types (1-9) vs cognitive variables...\n\n")

# Create output directory for plots
plot_dir <- "<PATH_TO_DATA>/plots"
if (!dir.exists(plot_dir)) {
  dir.create(plot_dir, recursive = TRUE)
}

# Function to create scatter plot with regression line
create_scatter_plot <- function(data, x_var, y_var, y_label, correlation, p_value) {
  # Format p-value
  p_text <- if (p_value < 0.001) {
    "p < 0.001"
  } else if (p_value < 0.01) {
    sprintf("p = %.3f", p_value)
  } else {
    sprintf("p = %.3f", p_value)
  }
  
  # Create significance indicator
  sig_symbol <- if (p_value < 0.001) {
    "***"
  } else if (p_value < 0.01) {
    "**"
  } else if (p_value < 0.05) {
    "*"
  } else {
    ""
  }
  
  ggplot(data, aes(x = !!sym(x_var), y = !!sym(y_var))) +
    geom_point(alpha = 0.6, size = 3, color = "#2166ac") +
    geom_smooth(method = "lm", se = TRUE, color = "#b2182b", fill = "#fddbc7", alpha = 0.3) +
    labs(
      x = "Number of Synaesthesia Types",
      y = y_label,
      title = paste(y_label, "by Number of Types"),
      subtitle = sprintf("r = %.3f, %s %s", correlation, p_text, sig_symbol)
    ) +
    scale_x_continuous(breaks = 1:9) +
    theme_minimal() +
    theme(
      plot.title = element_text(size = 14, face = "bold"),
      plot.subtitle = element_text(size = 11),
      axis.title = element_text(size = 12),
      panel.grid.minor = element_blank()
    )
}

# Generate individual plots for each variable
plot_list <- list()

for (i in 1:length(predictor_vars)) {
  var <- predictor_vars[i]
  
  # Get correlation and p-value from earlier results
  corr <- correlation_results$Correlation[correlation_results$Variable == var]
  p_val <- correlation_results$p_value[correlation_results$Variable == var]
  
  # Create readable label
  y_label <- gsub("_", " ", var)
  y_label <- tools::toTitleCase(y_label)
  
  # Create plot
  p <- create_scatter_plot(
    analysis_data, 
    "number_of_types", 
    var, 
    y_label,
    corr,
    p_val
  )
  
  plot_list[[var]] <- p
  
  # Save individual plot
  ggsave(
    filename = file.path(plot_dir, paste0("types_vs_", var, ".png")),
    plot = p,
    width = 8,
    height = 6,
    dpi = 300
  )
}

cat("Individual scatter plots saved to:", plot_dir, "\n\n")

# Create a combined plot of the most significant correlations
cat("Creating combined plot of strongest correlations...\n")

# Get top 6 strongest correlations
top_vars <- correlation_results %>%
  arrange(desc(abs(Correlation))) %>%
  head(6) %>%
  pull(Variable)

combined_plots <- lapply(top_vars, function(var) plot_list[[var]])

combined_plot <- do.call(gridExtra::grid.arrange, c(combined_plots, ncol = 2))

ggsave(
  filename = file.path(plot_dir, "types_top_6_correlations.png"),
  plot = combined_plot,
  width = 14,
  height = 18,
  dpi = 300
)

cat("Combined plot saved!\n\n")

# ===============================================================================
# DISTRIBUTION PLOT: Number of types
# ===============================================================================

cat("Creating distribution plot for number of types...\n")

dist_plot <- ggplot(analysis_data, aes(x = number_of_types)) +
  geom_histogram(binwidth = 1, fill = "#2166ac", color = "white", alpha = 0.8) +
  geom_vline(xintercept = median(analysis_data$number_of_types), 
             linetype = "dashed", color = "#b2182b", size = 1) +
  annotate("text", 
           x = median(analysis_data$number_of_types) + 0.5, 
           y = Inf, 
           label = paste("Median =", median(analysis_data$number_of_types)),
           vjust = 2, hjust = 0, color = "#b2182b", size = 4) +
  labs(
    x = "Number of Synaesthesia Types",
    y = "Count",
    title = "Distribution of Number of Synaesthesia Types"
  ) +
  scale_x_continuous(breaks = 1:9) +
  theme_minimal() +
  theme(
    plot.title = element_text(size = 14, face = "bold"),
    axis.title = element_text(size = 12)
  )

ggsave(
  filename = file.path(plot_dir, "types_distribution.png"),
  plot = dist_plot,
  width = 10,
  height = 6,
  dpi = 300
)

cat("Distribution plot saved!\n\n")

# ===============================================================================
# HEATMAP: Correlations
# ===============================================================================

cat("Creating correlation heatmap...\n")

# Create correlation matrix
cor_matrix <- cor(analysis_data %>% select(number_of_types, all_of(predictor_vars)), 
                  use = "complete.obs")

# Extract just the row for number_of_types
types_cors <- cor_matrix["number_of_types", predictor_vars]

# Create a nice heatmap-style plot
cor_df <- data.frame(
  Variable = names(types_cors),
  Correlation = as.numeric(types_cors)
) %>%
  mutate(
    Variable = gsub("_", " ", Variable),
    Variable = tools::toTitleCase(Variable),
    Variable = reorder(Variable, Correlation)
  )

heatmap_plot <- ggplot(cor_df, aes(x = Correlation, y = Variable, fill = Correlation)) +
  geom_tile(color = "white", size = 1) +
  geom_text(aes(label = sprintf("%.2f", Correlation)), size = 4) +
  scale_fill_gradient2(
    low = "#2166ac", 
    mid = "white", 
    high = "#b2182b",
    midpoint = 0,
    limits = c(-1, 1)
  ) +
  labs(
    x = "Correlation with Number of Types",
    y = "",
    title = "Correlations: Number of Synaesthesia Types vs Cognitive Variables",
    fill = "Correlation"
  ) +
  theme_minimal() +
  theme(
    plot.title = element_text(size = 14, face = "bold"),
    axis.title = element_text(size = 12),
    axis.text.y = element_text(size = 10),
    legend.position = "right"
  )

ggsave(
  filename = file.path(plot_dir, "types_correlation_heatmap.png"),
  plot = heatmap_plot,
  width = 10,
  height = 8,
  dpi = 300
)

cat("Correlation heatmap saved!\n\n")

# ===============================================================================
# BOXPLOTS: By number of types
# ===============================================================================

cat("Creating boxplots by number of types...\n")

# Create boxplots for top variables
top_4_vars <- correlation_results %>%
  arrange(desc(abs(Correlation))) %>%
  head(4) %>%
  pull(Variable)

boxplot_list <- list()

for (var in top_4_vars) {
  y_label <- gsub("_", " ", var)
  y_label <- tools::toTitleCase(y_label)
  
  p <- ggplot(analysis_data, aes(x = factor(number_of_types), y = !!sym(var))) +
    geom_boxplot(fill = "#2166ac", alpha = 0.6, outlier.shape = NA) +
    geom_jitter(width = 0.2, alpha = 0.4, size = 2, color = "#b2182b") +
    labs(
      x = "Number of Synaesthesia Types",
      y = y_label,
      title = paste(y_label, "by Number of Types")
    ) +
    theme_minimal() +
    theme(
      plot.title = element_text(size = 12, face = "bold"),
      axis.title = element_text(size = 10),
      panel.grid.minor = element_blank()
    )
  
  boxplot_list[[var]] <- p
}

combined_boxplot <- do.call(gridExtra::grid.arrange, c(boxplot_list, ncol = 2))

ggsave(
  filename = file.path(plot_dir, "types_boxplots.png"),
  plot = combined_boxplot,
  width = 14,
  height = 10,
  dpi = 300
)

cat("Boxplots saved!\n\n")

# ===============================================================================
# MAHALANOBIS D: Few vs Many types
# ===============================================================================

cat("========================================\n")
cat("MAHALANOBIS D: FEW VS MANY TYPES\n")
cat("========================================\n\n")

# Source the Mahalanobis D function
maha_script_path <- "<PATH_TO_REPO>/Multivariate/mahalanobis_D_bias_corrected.R"

if (file.exists(maha_script_path)) {
  source(maha_script_path)
  cat("Mahalanobis D functions loaded successfully!\n\n")
  maha_available <- TRUE
} else {
  cat("WARNING: Could not find mahalanobis_D_bias_corrected.R\n")
  cat("Skipping Mahalanobis D calculations.\n\n")
  maha_available <- FALSE
}

if (exists("maha") && maha_available) {
  
  # Prepare data matrices
  few_types_matrix <- analysis_data %>%
    filter(types_group_median == "few_types") %>%
    select(all_of(predictor_vars)) %>%
    as.data.frame()
  
  many_types_matrix <- analysis_data %>%
    filter(types_group_median == "many_types") %>%
    select(all_of(predictor_vars)) %>%
    as.data.frame()
  
  cat("Sample sizes for Mahalanobis D:\n")
  cat("  Few types:", nrow(few_types_matrix), "\n")
  cat("  Many types:", nrow(many_types_matrix), "\n\n")
  
  # Calculate Mahalanobis D
  maha_types <- maha(many_types_matrix, few_types_matrix, 
                     conf.level = 0.95, boot.n = 5000, round.digits = 3)
  
  cat("COMPARISON: Many types vs Few types\n")
  cat("------------------------------------\n")
  cat("D (uncorrected):", maha_types$D, "\n")
  cat("Du (bias-corrected):", maha_types$Du, "\n")
  cat("95% CI (bootstrap):", maha_types$CI_boot_Du[1], "to", maha_types$CI_boot_Du[2], "\n")
  cat("Tucker's CC (correlation similarity):", maha_types$CC_cor, "\n")
  cat("OVL (overlap coefficient):", maha_types$OVLu, "\n")
  cat("CL (common language effect size):", maha_types$CLu, "\n")
  cat("PCC (probability of correct classification):", maha_types$PCCu, "\n")
  cat("H2 (heterogeneity coefficient):", maha_types$H2, "\n")
  cat("EPV2 (equivalent proportion of variables):", maha_types$EPV2, "\n\n")
  
  # Univariate effect sizes
  cat("========================================\n")
  cat("UNIVARIATE EFFECT SIZES (Cohen's d)\n")
  cat("========================================\n\n")
  
  d_values <- maha_types$du_values
  
  univariate_effects <- data.frame(
    Variable = predictor_vars,
    Cohens_d = round(d_values, 3)
  )
  
  interpret_d <- function(d) {
    abs_d <- abs(d)
    ifelse(abs_d < 0.2, "negligible",
           ifelse(abs_d < 0.5, "small",
                  ifelse(abs_d < 0.8, "medium", "large")))
  }
  
  univariate_effects$Interpretation <- interpret_d(univariate_effects$Cohens_d)
  univariate_effects <- univariate_effects %>% arrange(desc(abs(Cohens_d)))
  
  cat("Cohen's d values (positive = many types higher):\n\n")
  print(univariate_effects, row.names = FALSE)
  
  cat("\n\nEffect size interpretation: |d| < 0.2 = negligible, 0.2-0.5 = small, 0.5-0.8 = medium, >0.8 = large\n\n")
  
  # Key variables
  cat("========================================\n")
  cat("KEY VARIABLES DISTINGUISHING GROUPS\n")
  cat("========================================\n\n")
  
  large_effects <- univariate_effects %>%
    filter(abs(Cohens_d) >= 0.5) %>%
    arrange(desc(abs(Cohens_d)))
  
  cat("Variables with medium/large effects:\n")
  if (nrow(large_effects) > 0) {
    for (i in 1:nrow(large_effects)) {
      direction <- ifelse(large_effects$Cohens_d[i] > 0, "higher in many-types", "higher in few-types")
      cat("  -", large_effects$Variable[i], ": d =", large_effects$Cohens_d[i], 
          "(", large_effects$Interpretation[i], ") -", direction, "\n")
    }
  } else {
    cat("  No medium or large effects\n")
  }
  cat("\n")
  
  # Save results
  write.csv(univariate_effects,
            "<PATH_TO_DATA>/types_univariate_effect_sizes.csv",
            row.names = FALSE)
  
  maha_summary <- data.frame(
    Comparison = "Many types vs Few types",
    D_uncorrected = maha_types$D,
    Du_bias_corrected = maha_types$Du,
    CI_lower = maha_types$CI_boot_Du[1],
    CI_upper = maha_types$CI_boot_Du[2],
    Tuckers_CC = maha_types$CC_cor,
    OVL = maha_types$OVLu,
    CL = maha_types$CLu,
    PCC = maha_types$PCCu,
    H2 = maha_types$H2,
    EPV2 = maha_types$EPV2
  )
  
  write.csv(maha_summary,
            "<PATH_TO_DATA>/types_mahalanobis_D_summary.csv",
            row.names = FALSE)
  
  cat("Mahalanobis D results saved!\n\n")
}

# ===============================================================================
# LINEAR REGRESSION: Continuous analysis
# ===============================================================================

cat("========================================\n")
cat("LINEAR REGRESSION ANALYSIS\n")
cat("========================================\n\n")

cat("Testing whether number of types predicts each cognitive variable:\n\n")

regression_results <- data.frame(
  Variable = predictor_vars,
  Beta = numeric(length(predictor_vars)),
  SE = numeric(length(predictor_vars)),
  t_value = numeric(length(predictor_vars)),
  p_value = numeric(length(predictor_vars)),
  R_squared = numeric(length(predictor_vars))
)

for (i in 1:length(predictor_vars)) {
  var <- predictor_vars[i]
  formula <- as.formula(paste(var, "~ number_of_types"))
  model <- lm(formula, data = analysis_data)
  summary_model <- summary(model)
  
  regression_results$Beta[i] <- coef(summary_model)[2, 1]
  regression_results$SE[i] <- coef(summary_model)[2, 2]
  regression_results$t_value[i] <- coef(summary_model)[2, 3]
  regression_results$p_value[i] <- coef(summary_model)[2, 4]
  regression_results$R_squared[i] <- summary_model$r.squared
}

regression_results <- regression_results %>%
  mutate(
    Significance = case_when(
      p_value < 0.001 ~ "***",
      p_value < 0.01 ~ "**",
      p_value < 0.05 ~ "*",
      TRUE ~ ""
    )
  ) %>%
  arrange(desc(abs(Beta)))

cat("Regression results:\n\n")
print(regression_results, row.names = FALSE)

cat("\nSignificance codes: *** p<0.001, ** p<0.01, * p<0.05\n\n")

# Save regression results
write.csv(regression_results,
          "<PATH_TO_DATA>/types_regression_results.csv",
          row.names = FALSE)

# ===============================================================================
# MULTIVARIATE REGRESSION: Overall cognitive distinctiveness
# ===============================================================================

cat("========================================\n")
cat("MULTIVARIATE REGRESSION\n")
cat("========================================\n\n")

cat("Testing whether number of types predicts overall cognitive profile:\n\n")

# Create a principal component representing overall cognitive distinctiveness
pca_data <- analysis_data %>% select(all_of(predictor_vars))
pca_result <- prcomp(pca_data, scale. = TRUE, center = TRUE)

cat("PCA Results:\n")
cat("  PC1 explains", round(summary(pca_result)$importance[2, 1] * 100, 1), "% of variance\n")
cat("  PC2 explains", round(summary(pca_result)$importance[2, 2] * 100, 1), "% of variance\n\n")

# Add PC scores to data
analysis_data$PC1 <- pca_result$x[, 1]
analysis_data$PC2 <- pca_result$x[, 2]

# Regression with PC1
model_pc1 <- lm(PC1 ~ number_of_types, data = analysis_data)
summary_pc1 <- summary(model_pc1)

cat("Regression: PC1 ~ number_of_types\n")
cat("  Beta:", coef(summary_pc1)[2, 1], "\n")
cat("  SE:", coef(summary_pc1)[2, 2], "\n")
cat("  t:", coef(summary_pc1)[2, 3], "\n")
cat("  p:", coef(summary_pc1)[2, 4], "\n")
cat("  R²:", summary_pc1$r.squared, "\n\n")

# Regression with PC2
model_pc2 <- lm(PC2 ~ number_of_types, data = analysis_data)
summary_pc2 <- summary(model_pc2)

cat("Regression: PC2 ~ number_of_types\n")
cat("  Beta:", coef(summary_pc2)[2, 1], "\n")
cat("  SE:", coef(summary_pc2)[2, 2], "\n")
cat("  t:", coef(summary_pc2)[2, 3], "\n")
cat("  p:", coef(summary_pc2)[2, 4], "\n")
cat("  R²:", summary_pc2$r.squared, "\n\n")

# Save PCA loadings
pca_loadings <- data.frame(
  Variable = predictor_vars,
  PC1_loading = pca_result$rotation[, 1],
  PC2_loading = pca_result$rotation[, 2]
) %>%
  arrange(desc(abs(PC1_loading)))

write.csv(pca_loadings,
          "<PATH_TO_DATA>/types_pca_loadings.csv",
          row.names = FALSE)

cat("PCA loadings saved!\n\n")

# ===============================================================================
# SUMMARY STATISTICS BY GROUP
# ===============================================================================

cat("========================================\n")
cat("SUMMARY STATISTICS\n")
cat("========================================\n\n")

summary_stats <- analysis_data %>%
  group_by(types_group_median) %>%
  summarise(
    n = n(),
    mean_num_types = mean(number_of_types),
    sd_num_types = sd(number_of_types),
    range_num_types = paste(min(number_of_types), "-", max(number_of_types)),
    .groups = 'drop'
  )

cat("Summary by group:\n")
print(summary_stats)
cat("\n")

# Check for GCS and SSS by group
gcs_sss_summary <- analysis_data %>%
  group_by(types_group_median) %>%
  summarise(
    n_with_GCS = sum(has_GCS == 1, na.rm = TRUE),
    pct_with_GCS = 100 * mean(has_GCS == 1, na.rm = TRUE),
    n_with_SSS = sum(has_SSS == 1, na.rm = TRUE),
    pct_with_SSS = 100 * mean(has_SSS == 1, na.rm = TRUE),
    .groups = 'drop'
  )

cat("GCS and SSS by group:\n")
print(gcs_sss_summary)
cat("\n")

# ===============================================================================
# FINAL SUMMARY
# ===============================================================================

cat("========================================\n")
cat("ANALYSIS COMPLETE\n")
cat("========================================\n\n")

cat("CSV files saved:\n")
cat("  - types_correlation_results.csv\n")
cat("  - types_regression_results.csv\n")
cat("  - types_pca_loadings.csv\n")
if (exists("maha_available") && maha_available) {
  cat("  - types_mahalanobis_D_summary.csv\n")
  cat("  - types_univariate_effect_sizes.csv\n")
}

cat("\nVisualization files saved in:", plot_dir, "\n")
cat("  - Individual scatter plots for each variable\n")
cat("  - types_top_6_correlations.png (combined plot)\n")
cat("  - types_distribution.png\n")
cat("  - types_correlation_heatmap.png\n")
cat("  - types_boxplots.png\n")

cat("\nAnalysis focused on within-synaesthete differences based on number of types (1-9).\n")
cat("Key analyses:\n")
cat("  1. Correlations between number of types and cognitive variables\n")
cat("  2. Scatter plots with regression lines\n")
cat("  3. Mahalanobis D multivariate effect size (few vs many split)\n")
cat("  4. Linear regressions treating number of types as continuous\n")
cat("  5. PCA to examine overall cognitive profile\n")
cat("  6. Boxplots showing distribution by number of types\n\n")v