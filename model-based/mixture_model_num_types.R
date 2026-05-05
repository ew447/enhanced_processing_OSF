
# Few vs Many comparison of mixture model precision (kappa)
# Median split on syn_num_types
#
# LTMI ONLY:
#   - Mixture model fitted separately per repetition (1-4), then parameters
#     (kappa, p_t, p_u) averaged across reps 1-4 per participant.
#   - Z-score exclusion based on each participant's mean absolute deviation
#     at repetition 4, computed separately per condition (Colour / Location),
#     applied across all synaesthetes together (no group split).

# ==============================================================================

library(mixtur)
library(tidyverse)
library(readxl)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# Load synaesthesia type information
subtype_data <- read_excel("<PATH_TO_PARTICIPANTS>/observation_list.xlsx")
subtype_data$participant_id <- as.character(subtype_data$participant_id)

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

prepare_syn_data <- function(data) {
  data$participant_id <- as.character(data$participant_id)
  data %>%
    left_join(subtype_data %>% select(participant_id, syn_num_types),
              by = "participant_id") %>%
    filter(!is.na(syn_num_types))
}

apply_zscore_after_averaging <- function(averaged_data, measure_col) {
  averaged_data %>%
    mutate(
      z_score = (!!sym(measure_col) - mean(!!sym(measure_col), na.rm = TRUE)) /
        sd(!!sym(measure_col), na.rm = TRUE)
    ) %>%
    filter(is.na(z_score) | z_score <= 2.5) %>%
    select(-z_score)
}

format_p_value <- function(p) {
  if (p < 0.001) "<.001"
  else sprintf("%.3f", p)
}

fit_mixture_model <- function(data, condition) {
  if (condition == "Colour") {
    data <- data %>%
      mutate(
        response = colour_angle_test,
        target   = colour_angle_study,
        error    = colour_angle_abs_deviation,
        id       = participant_id
      )
  } else if (condition == "Location") {
    data <- data %>%
      mutate(
        response = location_angle_test,
        target   = location_angle_study,
        error    = location_angle_abs_deviation,
        id       = participant_id
      )
  }
  
  data <- data %>%
    select(response, target, error, id) %>%
    filter(complete.cases(.))
  
  if (nrow(data) == 0) return(NULL)
  
  tryCatch({
    fit_mixtur(
      data         = data,
      model        = "2_component",
      unit         = "degrees",
      id_var       = "id",
      response_var = "response",
      target_var   = "target",
      return_fit   = FALSE
    )
  }, error = function(e) {
    cat("  ERROR fitting model:", e$message, "\n")
    NULL
  })
}

median_split_groups <- function(df) {
  med <- median(df$syn_num_types, na.rm = TRUE)
  df %>%
    mutate(type_group = ifelse(syn_num_types <= med, "Few", "Many"))
}

# ==============================================================================
# LTMI-SPECIFIC FUNCTIONS
# ==============================================================================

# Fit mixture model per rep (1-4), average parameters (kappa, p_t, p_u) across
# reps per participant. Also computes per-participant mean absolute deviation at
# rep 4 for z-score exclusion (separately per condition).
fit_mixture_model_ltmi_averaged <- function(data, condition) {
  
  abs_dev_col <- if (condition == "Colour") "colour_angle_abs_deviation" else "location_angle_abs_deviation"
  
  # --- Rep 4 mean absolute deviation per participant (for z-score exclusion) ---
  rep4_abs_dev <- data %>%
    filter(repetition == 4) %>%
    group_by(participant_id) %>%
    summarise(abs_dev_rep4 = mean(!!sym(abs_dev_col), na.rm = TRUE), .groups = "drop") %>%
    rename(id = participant_id)
  
  # --- Fit model separately for each repetition ---
  rep_fits_list <- list()
  
  for (rep in 1:4) {
    rep_data <- data %>% filter(repetition == rep)
    rep_fits <- fit_mixture_model(rep_data, condition)
    
    if (!is.null(rep_fits) && nrow(rep_fits) > 0) {
      rep_fits$repetition <- rep
      rep_fits_list[[as.character(rep)]] <- rep_fits
    } else {
      cat(sprintf("    WARNING: No model fits for repetition %d\n", rep))
    }
  }
  
  if (length(rep_fits_list) == 0) return(NULL)
  
  all_rep_fits <- bind_rows(rep_fits_list)
  
  # --- Average parameters across reps 1-4 per participant ---
  averaged_fits <- all_rep_fits %>%
    group_by(id) %>%
    summarise(
      kappa = mean(kappa, na.rm = TRUE),
      p_t   = mean(p_t,   na.rm = TRUE),
      p_u   = mean(p_u,   na.rm = TRUE),
      .groups = "drop"
    )
  
  # --- Join rep 4 abs deviation ---
  averaged_fits <- averaged_fits %>%
    left_join(rep4_abs_dev, by = "id")
  
  return(averaged_fits)
}

# Apply z-score exclusion for LTMI using rep 4 mean abs deviation,
# across all synaesthetes together. Drops helper column after filtering.
apply_zscore_ltmi <- function(averaged_data) {
  averaged_data %>%
    mutate(
      z_score = (abs_dev_rep4 - mean(abs_dev_rep4, na.rm = TRUE)) /
        sd(abs_dev_rep4, na.rm = TRUE)
    ) %>%
    filter(is.na(z_score) | z_score <= 2.5) %>%
    select(-z_score, -abs_dev_rep4)
}

# ==============================================================================
# COMPARISON TABLE
# ==============================================================================

comparison_df <- data.frame(
  Task            = character(),
  Condition       = character(),
  Load            = character(),
  Kappa_Few_M_SD  = character(),
  Kappa_Many_M_SD = character(),
  t_df            = character(),
  p               = character(),
  stringsAsFactors = FALSE
)

add_few_many_comparison <- function(task, condition, few_data, many_data, load = NA) {
  if (nrow(few_data) >= 2 && nrow(many_data) >= 2) {
    
    few_mean  <- mean(few_data$kappa,  na.rm = TRUE)
    few_sd    <- sd(few_data$kappa,    na.rm = TRUE)
    many_mean <- mean(many_data$kappa, na.rm = TRUE)
    many_sd   <- sd(many_data$kappa,   na.rm = TRUE)
    
    few_msd  <- sprintf("%.2f (%.2f)", few_mean,  few_sd)
    many_msd <- sprintf("%.2f (%.2f)", many_mean, many_sd)
    
    t_res    <- t.test(few_data$kappa, many_data$kappa)
    t_string <- sprintf("%.2f (%.0f)", t_res$statistic, t_res$parameter)
    p_string <- format_p_value(t_res$p.value)
    
    load_formatted <- ifelse(is.na(load), "—", as.character(load))
    
    new_row <- data.frame(
      Task            = task,
      Condition       = condition,
      Load            = load_formatted,
      Kappa_Few_M_SD  = few_msd,
      Kappa_Many_M_SD = many_msd,
      t_df            = t_string,
      p               = p_string,
      stringsAsFactors = FALSE
    )
    
    comparison_df <<- rbind(comparison_df, new_row)
  }
}

# ==============================================================================
# STANDARD RUN FUNCTION (VP, STM, LTMD)
# ==============================================================================

run_analysis <- function(task_name, data_path, loads = NULL, filter_expr = NULL) {
  
  data <- read.csv(data_path)
  data <- filter_exclusions(data)
  
  if (!is.null(filter_expr)) {
    data <- data %>% filter(!!rlang::parse_expr(filter_expr))
  }
  
  data <- prepare_syn_data(data)
  
  if (is.null(loads)) loads <- NA
  
  for (load in loads) {
    
    if (!is.na(load)) {
      data_load <- data %>% filter(load_n == load)
    } else {
      data_load <- data
    }
    
    for (condition in c("Colour", "Location")) {
      
      fits <- fit_mixture_model(data_load, condition)
      if (is.null(fits)) next
      
      fits <- apply_zscore_after_averaging(fits, "kappa") %>%
        left_join(data_load %>% select(participant_id, syn_num_types) %>% distinct(),
                  by = c("id" = "participant_id"))
      
      groups <- median_split_groups(fits)
      few    <- groups %>% filter(type_group == "Few")
      many   <- groups %>% filter(type_group == "Many")
      
      add_few_many_comparison(task_name, condition, few, many, load)
    }
  }
}

# ==============================================================================
# LTMI RUN FUNCTION
# Fit per rep (1-4), average parameters, exclude on rep 4 abs deviation.
# ==============================================================================

run_analysis_ltmi <- function(data_path) {
  
  data <- read.csv(data_path)
  data <- filter_exclusions(data)
  data <- data %>% filter(repetition %in% 1:4)
  data <- prepare_syn_data(data)
  
  for (condition in c("Colour", "Location")) {
    cat(sprintf("  LTMI - %s\n", condition))
    
    # Fit per rep, average parameters, carry rep 4 abs deviation
    fits <- fit_mixture_model_ltmi_averaged(data, condition)
    if (is.null(fits)) next
    
    # Z-score exclusion across all synaesthetes together
    fits <- apply_zscore_ltmi(fits)
    
    # Join syn_num_types for median split
    fits <- fits %>%
      left_join(data %>% select(participant_id, syn_num_types) %>% distinct(),
                by = c("id" = "participant_id"))
    
    groups <- median_split_groups(fits)
    few    <- groups %>% filter(type_group == "Few")
    many   <- groups %>% filter(type_group == "Many")
    
    cat(sprintf("    Few: %d participants, Many: %d participants\n",
                nrow(few), nrow(many)))
    
    add_few_many_comparison("LTMI", condition, few, many)
  }
}

# ==============================================================================
# RUN ALL ANALYSES
# ==============================================================================

# VP
run_analysis("VP", "<PATH_TO_DATA>/Synaesthetes/VP.csv")

# STM (loads 1, 3, 5)
run_analysis("STM", "<PATH_TO_DATA>/Synaesthetes/STM.csv",
             loads = c(1, 3, 5))

# LTMI (reps 1-4 averaged, z-score on rep 4 abs deviation)
run_analysis_ltmi("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")

# LTMD
run_analysis("LTMD", "<PATH_TO_DATA>/Synaesthetes/LTMD.csv")

# ==============================================================================
# SAVE OUTPUT
# ==============================================================================

output_path <- "<PATH_TO_DATA>/few_vs_many_kappa_comparison.csv"
write.csv(comparison_df, output_path, row.names = FALSE)

cat("Few vs Many comparison table saved to:\n")
cat(output_path, "\n")