# Load libraries
library(dplyr)
library(ggplot2)

# --- Load shared exclusion functions ---
source("<PATH_TO_REPO>/Preprocessing/exclusions_function.R")

# Load the VP data
controls_vp <- read.csv("<PATH_TO_DATA>/Controls/VP.csv")
controls_vp <- filter_exclusions(controls_vp)

rels_vp <- read.csv("<PATH_TO_DATA>/Relatives/VP.csv")
rels_vp <- filter_exclusions(rels_vp)

syn_vp <- read.csv("<PATH_TO_DATA>/Synaesthetes/VP.csv")
syn_vp <- filter_exclusions(syn_vp)

# Load the STM data
controls_stm <- read.csv("<PATH_TO_DATA>/Controls/STM.csv")
controls_stm <- filter_exclusions(controls_stm)

rels_stm <- read.csv("<PATH_TO_DATA>/Relatives/STM.csv")
rels_stm <- filter_exclusions(rels_stm)

syn_stm <- read.csv("<PATH_TO_DATA>/Synaesthetes/STM.csv")
syn_stm <- filter_exclusions(syn_stm)

# Add group labels and ensure participant_id is character
controls_vp <- controls_vp %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_vp <- rels_vp %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_vp <- syn_vp %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_stm <- controls_stm %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_stm <- rels_stm %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_stm <- syn_stm %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

# Combine the VP data
vp_data <- bind_rows(controls_vp, rels_vp, syn_vp)

# Combine the STM data
stm_data <- bind_rows(controls_stm, rels_stm, syn_stm)

# ===============================================================================
# VP DATA PROCESSING 
# ===============================================================================

# Filter for colour trials and select relevant columns for VP data
vp_data_colour <- vp_data %>%
  select(participant_id, colour_angle_abs_deviation, group) %>%
  rename(vp_colour_angle_abs_deviation = colour_angle_abs_deviation)

# Filter for location trials and select relevant columns for VP data
vp_data_location <- vp_data %>%
  select(participant_id, location_angle_abs_deviation, group) %>%
  rename(vp_location_angle_abs_deviation = location_angle_abs_deviation)

# Calculate the mean VP deviation for each participant - COLOUR
vp_data_colour_mean <- vp_data_colour %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_colour_angle_abs_deviation = mean(vp_colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track VP exclusions by group before excluding (only high outliers) - COLOUR
vp_colour_exclusions <- vp_data_colour_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_vp_colour_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_vp_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_vp_colour_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  summarize(
    total = n(),
    excluded = sum(z_score_high > 2.5),
    remaining = sum(z_score_high <= 2.5),
    .groups = 'drop'
  )

cat("VP COLOUR exclusions by group (high outliers only):\n")
print(vp_colour_exclusions)
cat("\n")

# Exclude VP outliers (only those > 2.5 SD above group mean) - COLOUR
vp_data_colour_mean <- vp_data_colour_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_vp_colour_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_vp_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_vp_colour_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  filter(z_score_high <= 2.5) %>%
  select(-group_mean, -group_sd, -z_score_high) %>%
  ungroup()

# Calculate the mean VP deviation for each participant - LOCATION
vp_data_location_mean <- vp_data_location %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_location_angle_abs_deviation = mean(vp_location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track VP exclusions by group before excluding (only high outliers) - LOCATION
vp_location_exclusions <- vp_data_location_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_vp_location_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_vp_location_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_vp_location_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  summarize(
    total = n(),
    excluded = sum(z_score_high > 2.5),
    remaining = sum(z_score_high <= 2.5),
    .groups = 'drop'
  )

cat("VP LOCATION exclusions by group (high outliers only):\n")
print(vp_location_exclusions)
cat("\n")

# Exclude VP outliers (only those > 2.5 SD above group mean) - LOCATION
vp_data_location_mean <- vp_data_location_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_vp_location_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_vp_location_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_vp_location_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  filter(z_score_high <= 2.5) %>%
  select(-group_mean, -group_sd, -z_score_high) %>%
  ungroup()

# ===============================================================================
# STM DATA PROCESSING - BY LOAD_N
# ===============================================================================

# Get unique load values
load_values <- sort(unique(stm_data$load_n))
cat("Processing STM data for loads:", paste(load_values, collapse = ", "), "\n\n")

# Process COLOUR data for each load
stm_data_colour_by_load <- list()
for (load in load_values) {
  # Filter for specific load
  stm_load <- stm_data %>%
    filter(load_n == load) %>%
    select(participant_id, colour_angle_abs_deviation, group)
  
  # Calculate mean for each participant
  stm_data_colour_mean <- stm_load %>%
    group_by(participant_id, group) %>%
    summarize(mean_stm_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')
  
  # Track exclusions
  stm_colour_exclusions <- stm_data_colour_mean %>%
    group_by(group) %>%
    mutate(
      group_mean = mean(mean_stm_colour_angle_abs_deviation, na.rm = TRUE),
      group_sd = sd(mean_stm_colour_angle_abs_deviation, na.rm = TRUE),
      z_score_high = (mean_stm_colour_angle_abs_deviation - group_mean) / group_sd
    ) %>%
    summarize(
      total = n(),
      excluded = sum(z_score_high > 2.5),
      remaining = sum(z_score_high <= 2.5),
      .groups = 'drop'
    )
  
  cat("STM COLOUR Load", load, "exclusions by group (high outliers only):\n")
  print(stm_colour_exclusions)
  cat("\n")
  
  # Exclude outliers
  stm_data_colour_mean <- stm_data_colour_mean %>%
    group_by(group) %>%
    mutate(
      group_mean = mean(mean_stm_colour_angle_abs_deviation, na.rm = TRUE),
      group_sd = sd(mean_stm_colour_angle_abs_deviation, na.rm = TRUE),
      z_score_high = (mean_stm_colour_angle_abs_deviation - group_mean) / group_sd
    ) %>%
    filter(z_score_high <= 2.5) %>%
    select(-group_mean, -group_sd, -z_score_high) %>%
    ungroup()
  
  stm_data_colour_by_load[[as.character(load)]] <- stm_data_colour_mean
}

# Process LOCATION data for each load
stm_data_location_by_load <- list()
for (load in load_values) {
  # Filter for specific load
  stm_load <- stm_data %>%
    filter(load_n == load) %>%
    select(participant_id, location_angle_abs_deviation, group)
  
  # Calculate mean for each participant
  stm_data_location_mean <- stm_load %>%
    group_by(participant_id, group) %>%
    summarize(mean_stm_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')
  
  # Track exclusions
  stm_location_exclusions <- stm_data_location_mean %>%
    group_by(group) %>%
    mutate(
      group_mean = mean(mean_stm_location_angle_abs_deviation, na.rm = TRUE),
      group_sd = sd(mean_stm_location_angle_abs_deviation, na.rm = TRUE),
      z_score_high = (mean_stm_location_angle_abs_deviation - group_mean) / group_sd
    ) %>%
    summarize(
      total = n(),
      excluded = sum(z_score_high > 2.5),
      remaining = sum(z_score_high <= 2.5),
      .groups = 'drop'
    )
  
  cat("STM LOCATION Load", load, "exclusions by group (high outliers only):\n")
  print(stm_location_exclusions)
  cat("\n")
  
  # Exclude outliers
  stm_data_location_mean <- stm_data_location_mean %>%
    group_by(group) %>%
    mutate(
      group_mean = mean(mean_stm_location_angle_abs_deviation, na.rm = TRUE),
      group_sd = sd(mean_stm_location_angle_abs_deviation, na.rm = TRUE),
      z_score_high = (mean_stm_location_angle_abs_deviation - group_mean) / group_sd
    ) %>%
    filter(z_score_high <= 2.5) %>%
    select(-group_mean, -group_sd, -z_score_high) %>%
    ungroup()
  
  stm_data_location_by_load[[as.character(load)]] <- stm_data_location_mean
}

# ===============================================================================
# WITHIN-DOMAIN CORRELATIONS - BY LOAD
# ===============================================================================

cat("\n========== WITHIN-DOMAIN CORRELATIONS ==========\n\n")

correlation_results <- data.frame()

for (load in load_values) {
  cat("===== LOAD", load, "=====\n\n")
  
  # COLOUR correlation
  merged_colour <- vp_data_colour_mean %>%
    inner_join(stm_data_colour_by_load[[as.character(load)]], by = c("participant_id", "group"))
  
  if (nrow(merged_colour) > 0) {
    cor_colour <- cor(merged_colour$mean_vp_colour_angle_abs_deviation, 
                     merged_colour$mean_stm_colour_angle_abs_deviation, 
                     use = "complete.obs")
    cor_test_colour <- cor.test(merged_colour$mean_vp_colour_angle_abs_deviation, 
                               merged_colour$mean_stm_colour_angle_abs_deviation)
    
    cat("COLOUR correlation (VP vs STM Load", load, "):\n")
    cat("r =", round(cor_colour, 3), "\n")
    cat("p =", format(cor_test_colour$p.value, scientific = TRUE), "\n")
    cat("n =", nrow(merged_colour), "\n\n")
    
    correlation_results <- rbind(correlation_results, data.frame(
      Load = load,
      Type = "Within-domain",
      Predictor = "VP Colour",
      Outcome = "STM Colour",
      r = round(cor_colour, 3),
      p = cor_test_colour$p.value,
      n = nrow(merged_colour)
    ))
  }
  
  # LOCATION correlation
  merged_location <- vp_data_location_mean %>%
    inner_join(stm_data_location_by_load[[as.character(load)]], by = c("participant_id", "group"))
  
  if (nrow(merged_location) > 0) {
    cor_location <- cor(merged_location$mean_vp_location_angle_abs_deviation, 
                        merged_location$mean_stm_location_angle_abs_deviation, 
                        use = "complete.obs")
    cor_test_location <- cor.test(merged_location$mean_vp_location_angle_abs_deviation, 
                                  merged_location$mean_stm_location_angle_abs_deviation)
    
    cat("LOCATION correlation (VP vs STM Load", load, "):\n")
    cat("r =", round(cor_location, 3), "\n")
    cat("p =", format(cor_test_location$p.value, scientific = TRUE), "\n")
    cat("n =", nrow(merged_location), "\n\n")
    
    correlation_results <- rbind(correlation_results, data.frame(
      Load = load,
      Type = "Within-domain",
      Predictor = "VP Location",
      Outcome = "STM Location",
      r = round(cor_location, 3),
      p = cor_test_location$p.value,
      n = nrow(merged_location)
    ))
  }
}

# ===============================================================================
# CROSS-DOMAIN CORRELATIONS - BY LOAD
# ===============================================================================

cat("\n========== CROSS-DOMAIN CORRELATIONS ==========\n\n")

for (load in load_values) {
  cat("===== LOAD", load, "=====\n\n")
  
  # Merge all four measures
  cross_domain <- vp_data_colour_mean %>%
    inner_join(vp_data_location_mean, by = c("participant_id", "group")) %>%
    inner_join(stm_data_colour_by_load[[as.character(load)]], by = c("participant_id", "group")) %>%
    inner_join(stm_data_location_by_load[[as.character(load)]], by = c("participant_id", "group"))
  
  cat("Participants with all four measures:", nrow(cross_domain), "\n\n")
  
  if (nrow(cross_domain) > 0) {
    # VP Colour → STM Location
    cor_c2l <- cor(cross_domain$mean_vp_colour_angle_abs_deviation, 
                   cross_domain$mean_stm_location_angle_abs_deviation, 
                   use = "complete.obs")
    cor_test_c2l <- cor.test(cross_domain$mean_vp_colour_angle_abs_deviation, 
                             cross_domain$mean_stm_location_angle_abs_deviation)
    
    cat("VP COLOUR → STM LOCATION correlation:\n")
    cat("r =", round(cor_c2l, 3), "\n")
    cat("p =", format(cor_test_c2l$p.value, scientific = TRUE), "\n\n")
    
    correlation_results <- rbind(correlation_results, data.frame(
      Load = load,
      Type = "Cross-domain",
      Predictor = "VP Colour",
      Outcome = "STM Location",
      r = round(cor_c2l, 3),
      p = cor_test_c2l$p.value,
      n = nrow(cross_domain)
    ))
    
    # VP Location → STM Colour
    cor_l2c <- cor(cross_domain$mean_vp_location_angle_abs_deviation, 
                   cross_domain$mean_stm_colour_angle_abs_deviation, 
                   use = "complete.obs")
    cor_test_l2c <- cor.test(cross_domain$mean_vp_location_angle_abs_deviation, 
                             cross_domain$mean_stm_colour_angle_abs_deviation)
    
    cat("VP LOCATION → STM COLOUR correlation:\n")
    cat("r =", round(cor_l2c, 3), "\n")
    cat("p =", format(cor_test_l2c$p.value, scientific = TRUE), "\n\n")
    
    correlation_results <- rbind(correlation_results, data.frame(
      Load = load,
      Type = "Cross-domain",
      Predictor = "VP Location",
      Outcome = "STM Colour",
      r = round(cor_l2c, 3),
      p = cor_test_l2c$p.value,
      n = nrow(cross_domain)
    ))
  }
}

# ===============================================================================
# SUMMARY TABLE
# ===============================================================================

cat("\n========== CORRELATION SUMMARY TABLE ==========\n")
print(correlation_results)

# ===============================================================================
# BUILD PLOT DATA
# ===============================================================================

# Initialize empty list to store rows
plot_data_list <- list()

for (load in load_values) {
  
  # Merge VP and STM data for COLOUR
  merged_colour <- vp_data_colour_mean %>%
    inner_join(stm_data_colour_by_load[[as.character(load)]], by = c("participant_id", "group"))
  
  if (nrow(merged_colour) > 0) {
    plot_data_list[[paste0("VP_Colour_STM_Colour_Load", load)]] <- merged_colour %>%
      mutate(
        x = mean_vp_colour_angle_abs_deviation,
        y = mean_stm_colour_angle_abs_deviation,
        Comparison = "VP Colour → STM Colour",
        Load = load
      ) %>%
      select(participant_id, group, x, y, Comparison, Load)
  }
  
  # Merge VP and STM data for LOCATION
  merged_location <- vp_data_location_mean %>%
    inner_join(stm_data_location_by_load[[as.character(load)]], by = c("participant_id", "group"))
  
  if (nrow(merged_location) > 0) {
    plot_data_list[[paste0("VP_Location_STM_Location_Load", load)]] <- merged_location %>%
      mutate(
        x = mean_vp_location_angle_abs_deviation,
        y = mean_stm_location_angle_abs_deviation,
        Comparison = "VP Location → STM Location",
        Load = load
      ) %>%
      select(participant_id, group, x, y, Comparison, Load)
  }
  
  # Merge cross-domain VP Colour → STM Location
  cross_c2l <- vp_data_colour_mean %>%
    inner_join(stm_data_location_by_load[[as.character(load)]], by = c("participant_id", "group"))
  
  if (nrow(cross_c2l) > 0) {
    plot_data_list[[paste0("VP_Colour_STM_Location_Load", load)]] <- cross_c2l %>%
      mutate(
        x = mean_vp_colour_angle_abs_deviation,
        y = mean_stm_location_angle_abs_deviation,
        Comparison = "VP Colour → STM Location",
        Load = load
      ) %>%
      select(participant_id, group, x, y, Comparison, Load)
  }
  
  # Merge cross-domain VP Location → STM Colour
  cross_l2c <- vp_data_location_mean %>%
    inner_join(stm_data_colour_by_load[[as.character(load)]], by = c("participant_id", "group"))
  
  if (nrow(cross_l2c) > 0) {
    plot_data_list[[paste0("VP_Location_STM_Colour_Load", load)]] <- cross_l2c %>%
      mutate(
        x = mean_vp_location_angle_abs_deviation,
        y = mean_stm_colour_angle_abs_deviation,
        Comparison = "VP Location → STM Colour",
        Load = load
      ) %>%
      select(participant_id, group, x, y, Comparison, Load)
  }
}

# Combine all rows into one data frame
plot_data <- bind_rows(plot_data_list)

# Make Comparison a factor to preserve order
plot_data <- plot_data %>%
  mutate(
    Comparison = factor(
      Comparison,
      levels = c(
        "VP Colour → STM Colour",
        "VP Location → STM Location",
        "VP Colour → STM Location",
        "VP Location → STM Colour"
      )
    )
  )

# Set x and y limits automatically
x_limits <- range(plot_data$x, na.rm = TRUE)
y_limits <- range(plot_data$y, na.rm = TRUE)

# ===============================================================================
# PLOT
# ===============================================================================

facet_plot <- ggplot(plot_data, aes(x = x, y = y)) +
  geom_point(color = "grey20", alpha = 0.75) +
  geom_smooth(method = "lm", se = FALSE, color = "black",
              linetype = "longdash", size = 1) +
  facet_wrap(~ Comparison + Load, nrow = 4, strip.position = "top") +
  theme_minimal() +
  theme(
    legend.position = "none",
    strip.text = element_text(face = "bold", size = 9),
    strip.background = element_rect(fill = "grey95", color = NA),
    plot.title = element_blank()
  ) +
  labs(x = "VP Mean Deviation",
       y = "STM Mean Deviation") +
  scale_x_continuous(limits = x_limits) +
  scale_y_continuous(limits = y_limits)

print(facet_plot)
