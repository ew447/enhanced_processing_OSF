
# NOTES LTMI ONLY:
#   - Mixture model fitted separately per repetition (1-4), then parameters
#     (kappa, p_t, p_u) averaged across reps 1-4 per participant.
#   - Z-score exclusion is based on each participant's mean absolute deviation
#     at repetition 4 only, computed separately per condition (Colour / Location),
#     and applied within group.

# ==============================================================================

library(mixtur)
library(tidyverse)
library(readxl)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# Load subtype information
subtype_data <- read_excel("<PATH_TO_PARTICIPANTS>/observation_list.xlsx")
subtype_data$participant_id <- as.character(subtype_data$participant_id)

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

# Function to prepare synaesthete data with subtypes
prepare_syn_data <- function(data) {
  data$participant_id <- as.character(data$participant_id)
  data <- data %>%
    left_join(subtype_data, by = "participant_id") %>%
    mutate(
      subtype_group = case_when(
        has_GCS == 1 & has_SSS == 0 ~ "GCS_only",
        has_GCS == 0 & has_SSS == 1 ~ "SSS_only",
        has_GCS == 1 & has_SSS == 1 ~ "GCS_SSS",
        TRUE ~ NA_character_
      )
    )
  return(data)
}

# Function to apply z-score filtering AFTER participant averaging BY GROUP
# Used for all tasks except LTMI
apply_zscore_after_averaging <- function(averaged_data, measure_col, group_col = "group") {
  averaged_data %>%
    group_by(!!sym(group_col)) %>%
    mutate(
      z_score = (!!sym(measure_col) - mean(!!sym(measure_col), na.rm = TRUE)) /
        sd(!!sym(measure_col), na.rm = TRUE)
    ) %>%
    ungroup() %>%
    filter(is.na(z_score) | z_score <= 2.5) %>%
    select(-z_score)
}

# Function to format p-values
format_p_value <- function(p) {
  if (p < 0.001) {
    return("<.001")
  } else if (p < 0.01) {
    return(sprintf("%.3f", p))
  } else {
    return(sprintf("%.3f", p))
  }
}

# Function to fit mixture model for a dataset
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

# ==============================================================================
# LTMI-SPECIFIC FUNCTIONS
# ==============================================================================

# Fit mixture model per rep (1-4), average parameters across reps per participant.
# Also computes per-participant mean absolute deviation at rep 4 for z-score exclusion.
# Returns one row per participant with columns:
#   id, kappa, p_t, p_u  (averaged across reps 1-4)
#   abs_dev_rep4         (mean abs deviation at rep 4, for exclusion)
#   group                (carried through)
fit_mixture_model_ltmi_averaged <- function(data, condition, group_label) {
  
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
  
  # --- Join rep 4 abs deviation and group label ---
  averaged_fits <- averaged_fits %>%
    left_join(rep4_abs_dev, by = "id") %>%
    mutate(group = group_label)
  
  return(averaged_fits)
}

# Apply z-score exclusion for LTMI using rep 4 mean abs deviation, within group.
# Drops the abs_dev_rep4 helper column after filtering.
apply_zscore_ltmi <- function(averaged_data, group_col = "group") {
  averaged_data %>%
    group_by(!!sym(group_col)) %>%
    mutate(
      z_score = (abs_dev_rep4 - mean(abs_dev_rep4, na.rm = TRUE)) /
        sd(abs_dev_rep4, na.rm = TRUE)
    ) %>%
    ungroup() %>%
    filter(is.na(z_score) | z_score <= 2.5) %>%
    select(-z_score, -abs_dev_rep4)
}

# ==============================================================================
# RESULTS DATAFRAME & HELPER
# ==============================================================================

results_df <- data.frame(
  Task               = character(),
  Group              = character(),
  Condition          = character(),
  Load               = character(),
  Dependent_Variable = character(),
  M_SD               = character(),
  t_df_vs_0          = character(),
  p                  = character(),
  stringsAsFactors   = FALSE
)

add_model_results <- function(task, group_label, condition, model_fits, load = NA) {
  
  if (is.null(model_fits) || nrow(model_fits) == 0) {
    cat("  WARNING: No model fits available\n")
    return()
  }
  
  mean_kappa <- mean(model_fits$kappa, na.rm = TRUE)
  sd_kappa   <- sd(model_fits$kappa,   na.rm = TRUE)
  mean_p_t   <- mean(model_fits$p_t,   na.rm = TRUE)
  sd_p_t     <- sd(model_fits$p_t,     na.rm = TRUE)
  mean_p_u   <- mean(model_fits$p_u,   na.rm = TRUE)
  sd_p_u     <- sd(model_fits$p_u,     na.rm = TRUE)
  
  t_test_result <- t.test(model_fits$kappa, mu = 0)
  t_value <- t_test_result$statistic
  df      <- t_test_result$parameter
  p_value <- t_test_result$p.value
  
  load_formatted <- ifelse(is.na(load), "—", as.character(load))
  
  new_rows <- data.frame(
    Task               = rep(task, 3),
    Group              = rep(group_label, 3),
    Condition          = rep(condition, 3),
    Load               = rep(load_formatted, 3),
    Dependent_Variable = c("Precision (κ)", "Target Prob (pₜ)", "Guess Rate (pᵤ)"),
    M_SD = c(
      sprintf("%.2f (%.2f)", mean_kappa, sd_kappa),
      sprintf("%.2f (%.2f)", mean_p_t,   sd_p_t),
      sprintf("%.2f (%.2f)", mean_p_u,   sd_p_u)
    ),
    t_df_vs_0 = c(sprintf("%.2f (%d)", t_value, df), "—", "—"),
    p         = c(format_p_value(p_value), "—", "—"),
    stringsAsFactors = FALSE
  )
  
  results_df <<- rbind(results_df, new_rows)
}

# ==============================================================================
# VP ANALYSIS
# ==============================================================================
cat("Processing VP data...\n")

syn_VP <- read.csv("<PATH_TO_DATA>/Synaesthetes/VP.csv")
syn_VP <- filter_exclusions(syn_VP)
syn_VP <- prepare_syn_data(syn_VP)

con_VP <- read.csv("<PATH_TO_DATA>/Controls/VP.csv")
con_VP <- filter_exclusions(con_VP)

rel_VP <- read.csv("<PATH_TO_DATA>/Relatives/VP.csv")
rel_VP <- filter_exclusions(rel_VP)

syn_VP$group <- "Synaesthete"
con_VP$group <- "Control"
rel_VP$group <- "Relative"

# --- VP Colour ---
cat("  VP - Colour\n")

colour_syn_all_fits <- fit_mixture_model(syn_VP, "Colour")
if (!is.null(colour_syn_all_fits)) colour_syn_all_fits$group <- "Synaesthete"

colour_con_fits <- fit_mixture_model(con_VP, "Colour")
if (!is.null(colour_con_fits)) colour_con_fits$group <- "Control"

colour_rel_fits <- fit_mixture_model(rel_VP, "Colour")
if (!is.null(colour_rel_fits)) colour_rel_fits$group <- "Relative"

combined_colour_fits     <- bind_rows(colour_syn_all_fits, colour_con_fits, colour_rel_fits)
combined_colour_filtered <- apply_zscore_after_averaging(combined_colour_fits, "kappa", "group")

colour_syn_all_filtered <- combined_colour_filtered %>% filter(group == "Synaesthete")
colour_con_filtered     <- combined_colour_filtered %>% filter(group == "Control")
colour_rel_filtered     <- combined_colour_filtered %>% filter(group == "Relative")

cat(sprintf("    Syn (all): %d → %d participants\n", nrow(colour_syn_all_fits), nrow(colour_syn_all_filtered)))
cat(sprintf("    Con: %d → %d participants\n",       nrow(colour_con_fits),     nrow(colour_con_filtered)))
cat(sprintf("    Rel: %d → %d participants\n",       nrow(colour_rel_fits),     nrow(colour_rel_filtered)))

syn_VP_with_subtypes <- syn_VP %>% filter(!is.na(subtype_group))

colour_syn_gc_filtered <- colour_syn_all_filtered %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

colour_syn_ss_filtered <- colour_syn_all_filtered %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "SSS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

colour_syn_both_filtered <- colour_syn_all_filtered %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

cat(sprintf("    Syn (GC): %d participants\n",    nrow(colour_syn_gc_filtered)))
cat(sprintf("    Syn (SS): %d participants\n",    nrow(colour_syn_ss_filtered)))
cat(sprintf("    Syn (GC+SS): %d participants\n", nrow(colour_syn_both_filtered)))

# --- VP Location ---
cat("  VP - Location\n")

location_syn_all_fits <- fit_mixture_model(syn_VP, "Location")
if (!is.null(location_syn_all_fits)) location_syn_all_fits$group <- "Synaesthete"

location_con_fits <- fit_mixture_model(con_VP, "Location")
if (!is.null(location_con_fits)) location_con_fits$group <- "Control"

location_rel_fits <- fit_mixture_model(rel_VP, "Location")
if (!is.null(location_rel_fits)) location_rel_fits$group <- "Relative"

combined_location_fits     <- bind_rows(location_syn_all_fits, location_con_fits, location_rel_fits)
combined_location_filtered <- apply_zscore_after_averaging(combined_location_fits, "kappa", "group")

location_syn_all_filtered <- combined_location_filtered %>% filter(group == "Synaesthete")
location_con_filtered     <- combined_location_filtered %>% filter(group == "Control")
location_rel_filtered     <- combined_location_filtered %>% filter(group == "Relative")

cat(sprintf("    Syn (all): %d → %d participants\n", nrow(location_syn_all_fits), nrow(location_syn_all_filtered)))
cat(sprintf("    Con: %d → %d participants\n",       nrow(location_con_fits),     nrow(location_con_filtered)))
cat(sprintf("    Rel: %d → %d participants\n",       nrow(location_rel_fits),     nrow(location_rel_filtered)))

location_syn_gc_filtered <- location_syn_all_filtered %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

location_syn_ss_filtered <- location_syn_all_filtered %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "SSS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

location_syn_both_filtered <- location_syn_all_filtered %>%
  inner_join(syn_VP_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

cat(sprintf("    Syn (GC): %d participants\n",    nrow(location_syn_gc_filtered)))
cat(sprintf("    Syn (SS): %d participants\n",    nrow(location_syn_ss_filtered)))
cat(sprintf("    Syn (GC+SS): %d participants\n", nrow(location_syn_both_filtered)))

# --- VP: add to results ---
add_model_results("VP", "Syn (all)",   "Colour",   colour_syn_all_filtered)
add_model_results("VP", "Syn (GC)",    "Colour",   colour_syn_gc_filtered)
add_model_results("VP", "Syn (SS)",    "Colour",   colour_syn_ss_filtered)
add_model_results("VP", "Syn (GC+SS)", "Colour",   colour_syn_both_filtered)
add_model_results("VP", "Con",         "Colour",   colour_con_filtered)
add_model_results("VP", "Rel",         "Colour",   colour_rel_filtered)

add_model_results("VP", "Syn (all)",   "Location", location_syn_all_filtered)
add_model_results("VP", "Syn (GC)",    "Location", location_syn_gc_filtered)
add_model_results("VP", "Syn (SS)",    "Location", location_syn_ss_filtered)
add_model_results("VP", "Syn (GC+SS)", "Location", location_syn_both_filtered)
add_model_results("VP", "Con",         "Location", location_con_filtered)
add_model_results("VP", "Rel",         "Location", location_rel_filtered)

# ==============================================================================
# STM ANALYSIS
# ==============================================================================
cat("\nProcessing STM data...\n")

syn_STM <- read.csv("<PATH_TO_DATA>/Synaesthetes/STM.csv")
syn_STM <- filter_exclusions(syn_STM)
syn_STM <- prepare_syn_data(syn_STM)

con_STM <- read.csv("<PATH_TO_DATA>/Controls/STM.csv")
con_STM <- filter_exclusions(con_STM)

rel_STM <- read.csv("<PATH_TO_DATA>/Relatives/STM.csv")
rel_STM <- filter_exclusions(rel_STM)

syn_STM$group <- "Synaesthete"
con_STM$group <- "Control"
rel_STM$group <- "Relative"

for (load in c(1, 3, 5)) {
  cat(sprintf("  STM - Load %d\n", load))
  
  syn_STM_load <- syn_STM %>% filter(load_n == load)
  con_STM_load <- con_STM %>% filter(load_n == load)
  rel_STM_load <- rel_STM %>% filter(load_n == load)
  
  # --- STM Colour ---
  cat(sprintf("    Load %d - Colour\n", load))
  
  colour_syn_all_fits <- fit_mixture_model(syn_STM_load, "Colour")
  if (!is.null(colour_syn_all_fits)) colour_syn_all_fits$group <- "Synaesthete"
  
  colour_con_fits <- fit_mixture_model(con_STM_load, "Colour")
  if (!is.null(colour_con_fits)) colour_con_fits$group <- "Control"
  
  colour_rel_fits <- fit_mixture_model(rel_STM_load, "Colour")
  if (!is.null(colour_rel_fits)) colour_rel_fits$group <- "Relative"
  
  combined_colour_fits     <- bind_rows(colour_syn_all_fits, colour_con_fits, colour_rel_fits)
  combined_colour_filtered <- apply_zscore_after_averaging(combined_colour_fits, "kappa", "group")
  
  colour_syn_all_filtered <- combined_colour_filtered %>% filter(group == "Synaesthete")
  colour_con_filtered     <- combined_colour_filtered %>% filter(group == "Control")
  colour_rel_filtered     <- combined_colour_filtered %>% filter(group == "Relative")
  
  cat(sprintf("      Syn (all): %d → %d participants\n", nrow(colour_syn_all_fits), nrow(colour_syn_all_filtered)))
  cat(sprintf("      Con: %d → %d participants\n",       nrow(colour_con_fits),     nrow(colour_con_filtered)))
  cat(sprintf("      Rel: %d → %d participants\n",       nrow(colour_rel_fits),     nrow(colour_rel_filtered)))
  
  syn_STM_with_subtypes <- syn_STM_load %>% filter(!is.na(subtype_group))
  
  colour_syn_gc_filtered <- colour_syn_all_filtered %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_only") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  colour_syn_ss_filtered <- colour_syn_all_filtered %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "SSS_only") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  colour_syn_both_filtered <- colour_syn_all_filtered %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  # --- STM Location ---
  cat(sprintf("    Load %d - Location\n", load))
  
  location_syn_all_fits <- fit_mixture_model(syn_STM_load, "Location")
  if (!is.null(location_syn_all_fits)) location_syn_all_fits$group <- "Synaesthete"
  
  location_con_fits <- fit_mixture_model(con_STM_load, "Location")
  if (!is.null(location_con_fits)) location_con_fits$group <- "Control"
  
  location_rel_fits <- fit_mixture_model(rel_STM_load, "Location")
  if (!is.null(location_rel_fits)) location_rel_fits$group <- "Relative"
  
  combined_location_fits     <- bind_rows(location_syn_all_fits, location_con_fits, location_rel_fits)
  combined_location_filtered <- apply_zscore_after_averaging(combined_location_fits, "kappa", "group")
  
  location_syn_all_filtered <- combined_location_filtered %>% filter(group == "Synaesthete")
  location_con_filtered     <- combined_location_filtered %>% filter(group == "Control")
  location_rel_filtered     <- combined_location_filtered %>% filter(group == "Relative")
  
  cat(sprintf("      Syn (all): %d → %d participants\n", nrow(location_syn_all_fits), nrow(location_syn_all_filtered)))
  cat(sprintf("      Con: %d → %d participants\n",       nrow(location_con_fits),     nrow(location_con_filtered)))
  cat(sprintf("      Rel: %d → %d participants\n",       nrow(location_rel_fits),     nrow(location_rel_filtered)))
  
  location_syn_gc_filtered <- location_syn_all_filtered %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_only") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  location_syn_ss_filtered <- location_syn_all_filtered %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "SSS_only") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  location_syn_both_filtered <- location_syn_all_filtered %>%
    inner_join(syn_STM_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  # --- STM: add to results ---
  add_model_results("STM", "Syn (all)",   "Colour",   colour_syn_all_filtered,  load)
  add_model_results("STM", "Syn (GC)",    "Colour",   colour_syn_gc_filtered,   load)
  add_model_results("STM", "Syn (SS)",    "Colour",   colour_syn_ss_filtered,   load)
  add_model_results("STM", "Syn (GC+SS)", "Colour",   colour_syn_both_filtered, load)
  add_model_results("STM", "Con",         "Colour",   colour_con_filtered,      load)
  add_model_results("STM", "Rel",         "Colour",   colour_rel_filtered,      load)
  
  add_model_results("STM", "Syn (all)",   "Location", location_syn_all_filtered,  load)
  add_model_results("STM", "Syn (GC)",    "Location", location_syn_gc_filtered,   load)
  add_model_results("STM", "Syn (SS)",    "Location", location_syn_ss_filtered,   load)
  add_model_results("STM", "Syn (GC+SS)", "Location", location_syn_both_filtered, load)
  add_model_results("STM", "Con",         "Location", location_con_filtered,      load)
  add_model_results("STM", "Rel",         "Location", location_rel_filtered,      load)
}

# ==============================================================================
# LTMI ANALYSIS
# Model fitted per rep (1-4), parameters averaged across reps.
# Z-score exclusion based on mean absolute deviation at rep 4, within group,
# computed separately for Colour and Location conditions.
# ==============================================================================
cat("\nProcessing LTMI data...\n")

syn_LTMI <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")
syn_LTMI <- filter_exclusions(syn_LTMI)
syn_LTMI <- prepare_syn_data(syn_LTMI)
syn_LTMI <- syn_LTMI %>% filter(repetition %in% 1:4)

con_LTMI <- read.csv("<PATH_TO_DATA>/Controls/LTMI.csv")
con_LTMI <- filter_exclusions(con_LTMI)
con_LTMI <- con_LTMI %>% filter(repetition %in% 1:4)

rel_LTMI <- read.csv("<PATH_TO_DATA>/Relatives/LTMI.csv")
rel_LTMI <- filter_exclusions(rel_LTMI)
rel_LTMI <- rel_LTMI %>% filter(repetition %in% 1:4)

syn_LTMI$group <- "Synaesthete"
con_LTMI$group <- "Control"
rel_LTMI$group <- "Relative"

for (condition in c("Colour", "Location")) {
  cat(sprintf("  LTMI - %s\n", condition))
  
  # --- Fit per-rep models and average parameters ---
  syn_fits <- fit_mixture_model_ltmi_averaged(syn_LTMI, condition, "Synaesthete")
  con_fits <- fit_mixture_model_ltmi_averaged(con_LTMI, condition, "Control")
  rel_fits <- fit_mixture_model_ltmi_averaged(rel_LTMI, condition, "Relative")
  
  # --- Combine and apply z-score exclusion based on rep 4 mean abs deviation ---
  combined_fits     <- bind_rows(syn_fits, con_fits, rel_fits)
  combined_filtered <- apply_zscore_ltmi(combined_fits, group_col = "group")
  
  # --- Split back into groups ---
  syn_all_filtered <- combined_filtered %>% filter(group == "Synaesthete")
  con_filtered     <- combined_filtered %>% filter(group == "Control")
  rel_filtered     <- combined_filtered %>% filter(group == "Relative")
  
  cat(sprintf("    Syn (all): %d → %d participants\n", nrow(syn_fits), nrow(syn_all_filtered)))
  cat(sprintf("    Con: %d → %d participants\n",       nrow(con_fits), nrow(con_filtered)))
  cat(sprintf("    Rel: %d → %d participants\n",       nrow(rel_fits), nrow(rel_filtered)))
  
  # --- Subtype subsets (from already-filtered synaesthete data) ---
  syn_LTMI_with_subtypes <- syn_LTMI %>% filter(!is.na(subtype_group))
  
  syn_gc_filtered <- syn_all_filtered %>%
    inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "GCS_only") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  syn_ss_filtered <- syn_all_filtered %>%
    inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "SSS_only") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  syn_both_filtered <- syn_all_filtered %>%
    inner_join(syn_LTMI_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>%
                 select(participant_id) %>% distinct(), by = c("id" = "participant_id"))
  
  cat(sprintf("    Syn (GC): %d participants\n",    nrow(syn_gc_filtered)))
  cat(sprintf("    Syn (SS): %d participants\n",    nrow(syn_ss_filtered)))
  cat(sprintf("    Syn (GC+SS): %d participants\n", nrow(syn_both_filtered)))
  
  # --- Add to results ---
  add_model_results("LTMI", "Syn (all)",   condition, syn_all_filtered)
  add_model_results("LTMI", "Syn (GC)",    condition, syn_gc_filtered)
  add_model_results("LTMI", "Syn (SS)",    condition, syn_ss_filtered)
  add_model_results("LTMI", "Syn (GC+SS)", condition, syn_both_filtered)
  add_model_results("LTMI", "Con",         condition, con_filtered)
  add_model_results("LTMI", "Rel",         condition, rel_filtered)
}

# ==============================================================================
# LTMD ANALYSIS
# ==============================================================================
cat("\nProcessing LTMD data...\n")

syn_LTMD <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMD.csv")
syn_LTMD <- filter_exclusions(syn_LTMD)
syn_LTMD <- prepare_syn_data(syn_LTMD)

con_LTMD <- read.csv("<PATH_TO_DATA>/Controls/LTMD.csv")
con_LTMD <- filter_exclusions(con_LTMD)

rel_LTMD <- read.csv("<PATH_TO_DATA>/Relatives/LTMD.csv")
rel_LTMD <- filter_exclusions(rel_LTMD)

syn_LTMD$group <- "Synaesthete"
con_LTMD$group <- "Control"
rel_LTMD$group <- "Relative"

# --- LTMD Colour ---
cat("  LTMD - Colour\n")

colour_syn_all_fits <- fit_mixture_model(syn_LTMD, "Colour")
if (!is.null(colour_syn_all_fits)) colour_syn_all_fits$group <- "Synaesthete"

colour_con_fits <- fit_mixture_model(con_LTMD, "Colour")
if (!is.null(colour_con_fits)) colour_con_fits$group <- "Control"

colour_rel_fits <- fit_mixture_model(rel_LTMD, "Colour")
if (!is.null(colour_rel_fits)) colour_rel_fits$group <- "Relative"

combined_colour_fits     <- bind_rows(colour_syn_all_fits, colour_con_fits, colour_rel_fits)
combined_colour_filtered <- apply_zscore_after_averaging(combined_colour_fits, "kappa", "group")

colour_syn_all_filtered <- combined_colour_filtered %>% filter(group == "Synaesthete")
colour_con_filtered     <- combined_colour_filtered %>% filter(group == "Control")
colour_rel_filtered     <- combined_colour_filtered %>% filter(group == "Relative")

cat(sprintf("    Syn (all): %d → %d participants\n", nrow(colour_syn_all_fits), nrow(colour_syn_all_filtered)))
cat(sprintf("    Con: %d → %d participants\n",       nrow(colour_con_fits),     nrow(colour_con_filtered)))
cat(sprintf("    Rel: %d → %d participants\n",       nrow(colour_rel_fits),     nrow(colour_rel_filtered)))

syn_LTMD_with_subtypes <- syn_LTMD %>% filter(!is.na(subtype_group))

colour_syn_gc_filtered <- colour_syn_all_filtered %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

colour_syn_ss_filtered <- colour_syn_all_filtered %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "SSS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

colour_syn_both_filtered <- colour_syn_all_filtered %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

# --- LTMD Location ---
cat("  LTMD - Location\n")

location_syn_all_fits <- fit_mixture_model(syn_LTMD, "Location")
if (!is.null(location_syn_all_fits)) location_syn_all_fits$group <- "Synaesthete"

location_con_fits <- fit_mixture_model(con_LTMD, "Location")
if (!is.null(location_con_fits)) location_con_fits$group <- "Control"

location_rel_fits <- fit_mixture_model(rel_LTMD, "Location")
if (!is.null(location_rel_fits)) location_rel_fits$group <- "Relative"

combined_location_fits     <- bind_rows(location_syn_all_fits, location_con_fits, location_rel_fits)
combined_location_filtered <- apply_zscore_after_averaging(combined_location_fits, "kappa", "group")

location_syn_all_filtered <- combined_location_filtered %>% filter(group == "Synaesthete")
location_con_filtered     <- combined_location_filtered %>% filter(group == "Control")
location_rel_filtered     <- combined_location_filtered %>% filter(group == "Relative")

cat(sprintf("    Syn (all): %d → %d participants\n", nrow(location_syn_all_fits), nrow(location_syn_all_filtered)))
cat(sprintf("    Con: %d → %d participants\n",       nrow(location_con_fits),     nrow(location_con_filtered)))
cat(sprintf("    Rel: %d → %d participants\n",       nrow(location_rel_fits),     nrow(location_rel_filtered)))

location_syn_gc_filtered <- location_syn_all_filtered %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

location_syn_ss_filtered <- location_syn_all_filtered %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "SSS_only") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

location_syn_both_filtered <- location_syn_all_filtered %>%
  inner_join(syn_LTMD_with_subtypes %>% filter(subtype_group == "GCS_SSS") %>%
               select(participant_id) %>% distinct(), by = c("id" = "participant_id"))

# --- LTMD: add to results ---
add_model_results("LTMD", "Syn (all)",   "Colour",   colour_syn_all_filtered)
add_model_results("LTMD", "Syn (GC)",    "Colour",   colour_syn_gc_filtered)
add_model_results("LTMD", "Syn (SS)",    "Colour",   colour_syn_ss_filtered)
add_model_results("LTMD", "Syn (GC+SS)", "Colour",   colour_syn_both_filtered)
add_model_results("LTMD", "Con",         "Colour",   colour_con_filtered)
add_model_results("LTMD", "Rel",         "Colour",   colour_rel_filtered)

add_model_results("LTMD", "Syn (all)",   "Location", location_syn_all_filtered)
add_model_results("LTMD", "Syn (GC)",    "Location", location_syn_gc_filtered)
add_model_results("LTMD", "Syn (SS)",    "Location", location_syn_ss_filtered)
add_model_results("LTMD", "Syn (GC+SS)", "Location", location_syn_both_filtered)
add_model_results("LTMD", "Con",         "Location", location_con_filtered)
add_model_results("LTMD", "Rel",         "Location", location_rel_filtered)

# ==============================================================================
# SAVE RESULTS TO CSV
# ==============================================================================
cat("\n==============================================================================\n")
cat("Saving results to CSV...\n")

output_path <- "<PATH_TO_DATA>/mixture_model_statistics_with_zscore_filtering.csv"
write.csv(results_df, output_path, row.names = FALSE)

cat("COMPLETE! Table saved to:\n")
cat(output_path, "\n")
cat("Total rows:", nrow(results_df), "\n")
cat("==============================================================================\n")

cat("\nFirst 20 rows of the table:\n")
print(results_df %>% head(20), n = 20)