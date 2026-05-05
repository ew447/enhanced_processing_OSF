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

# Load the LTMD data
controls_ltmd <- read.csv("<PATH_TO_DATA>/Controls/LTMD.csv")
controls_ltmd <- filter_exclusions(controls_ltmd)

rels_ltmd <- read.csv("<PATH_TO_DATA>/Relatives/LTMD.csv")
rels_ltmd <- filter_exclusions(rels_ltmd)

syn_ltmd <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMD.csv")
syn_ltmd <- filter_exclusions(syn_ltmd)

# Add group labels and ensure participant_id is character
controls_vp <- controls_vp %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_vp <- rels_vp %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_vp <- syn_vp %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_ltmd <- controls_ltmd %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmd <- rels_ltmd %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmd <- syn_ltmd %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

# Combine the VP data
vp_data <- bind_rows(controls_vp, rels_vp, syn_vp)

# Combine the LTMD data
ltmd_data <- bind_rows(controls_ltmd, rels_ltmd, syn_ltmd)

# ===============================================================================
# PROCESS VP DATA
# ===============================================================================

# Calculate the mean VP deviation for each participant - COLOUR
vp_data_colour_mean <- vp_data %>%
  select(participant_id, colour_angle_abs_deviation, group) %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track VP COLOUR exclusions by group (only high outliers)
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

# Exclude VP COLOUR outliers (only those > 2.5 SD above group mean)
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
vp_data_location_mean <- vp_data %>%
  select(participant_id, location_angle_abs_deviation, group) %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track VP LOCATION exclusions by group (only high outliers)
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

# Exclude VP LOCATION outliers (only those > 2.5 SD above group mean)
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
# PROCESS LTMD DATA
# ===============================================================================

# Calculate the mean LTMD deviation for each participant - COLOUR
ltmd_data_colour_mean <- ltmd_data %>%
  select(participant_id, colour_angle_abs_deviation, group) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track LTMD COLOUR exclusions by group (only high outliers)
ltmd_colour_exclusions <- ltmd_data_colour_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmd_colour_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmd_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmd_colour_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  summarize(
    total = n(),
    excluded = sum(z_score_high > 2.5),
    remaining = sum(z_score_high <= 2.5),
    .groups = 'drop'
  )

cat("LTMD COLOUR exclusions by group (high outliers only):\n")
print(ltmd_colour_exclusions)
cat("\n")

# Exclude LTMD COLOUR outliers (only those > 2.5 SD above group mean)
ltmd_data_colour_mean <- ltmd_data_colour_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmd_colour_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmd_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmd_colour_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  filter(z_score_high <= 2.5) %>%
  select(-group_mean, -group_sd, -z_score_high) %>%
  ungroup()

# Calculate the mean LTMD deviation for each participant - LOCATION
ltmd_data_location_mean <- ltmd_data %>%
  select(participant_id, location_angle_abs_deviation, group) %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmd_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track LTMD LOCATION exclusions by group (only high outliers)
ltmd_location_exclusions <- ltmd_data_location_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmd_location_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmd_location_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmd_location_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  summarize(
    total = n(),
    excluded = sum(z_score_high > 2.5),
    remaining = sum(z_score_high <= 2.5),
    .groups = 'drop'
  )

cat("LTMD LOCATION exclusions by group (high outliers only):\n")
print(ltmd_location_exclusions)
cat("\n")

# Exclude LTMD LOCATION outliers (only those > 2.5 SD above group mean)
ltmd_data_location_mean <- ltmd_data_location_mean %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmd_location_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmd_location_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmd_location_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  filter(z_score_high <= 2.5) %>%
  select(-group_mean, -group_sd, -z_score_high) %>%
  ungroup()

# ===============================================================================
# MERGE DATA
# ===============================================================================

# Merge the mean VP and LTMD data - COLOUR
merged_data_colour_mean <- ltmd_data_colour_mean %>%
  left_join(vp_data_colour_mean, by = c("participant_id", "group")) %>%
  filter(!is.na(mean_vp_colour_angle_abs_deviation) & !is.na(mean_ltmd_colour_angle_abs_deviation))

# Merge the mean VP and LTMD data - LOCATION
merged_data_location_mean <- ltmd_data_location_mean %>%
  left_join(vp_data_location_mean, by = c("participant_id", "group")) %>%
  filter(!is.na(mean_vp_location_angle_abs_deviation) & !is.na(mean_ltmd_location_angle_abs_deviation))

# ===============================================================================
# WITHIN-DOMAIN CORRELATIONS
# ===============================================================================

# Calculate correlation and perform significance test - COLOUR
correlation_colour <- cor(merged_data_colour_mean$mean_vp_colour_angle_abs_deviation, 
                         merged_data_colour_mean$mean_ltmd_colour_angle_abs_deviation, 
                         use = "complete.obs")
cor_test_colour <- cor.test(merged_data_colour_mean$mean_vp_colour_angle_abs_deviation, 
                           merged_data_colour_mean$mean_ltmd_colour_angle_abs_deviation)

cat("COLOUR correlation (VP vs LTMD):\n")
cat("r =", round(correlation_colour, 3), "\n")
cat("p =", format(cor_test_colour$p.value, scientific = TRUE), "\n")
cat("n =", nrow(merged_data_colour_mean), "\n\n")

# Calculate correlation and perform significance test - LOCATION
correlation_location <- cor(merged_data_location_mean$mean_vp_location_angle_abs_deviation, 
                            merged_data_location_mean$mean_ltmd_location_angle_abs_deviation, 
                            use = "complete.obs")
cor_test_location <- cor.test(merged_data_location_mean$mean_vp_location_angle_abs_deviation, 
                              merged_data_location_mean$mean_ltmd_location_angle_abs_deviation)

cat("LOCATION correlation (VP vs LTMD):\n")
cat("r =", round(correlation_location, 3), "\n")
cat("p =", format(cor_test_location$p.value, scientific = TRUE), "\n")
cat("n =", nrow(merged_data_location_mean), "\n\n")

# ===============================================================================
# CROSS-DOMAIN CORRELATIONS
# ===============================================================================

# Merge all four measures into one dataframe
cross_domain_data <- vp_data_colour_mean %>%
  inner_join(vp_data_location_mean, by = c("participant_id", "group")) %>%
  inner_join(ltmd_data_colour_mean, by = c("participant_id", "group")) %>%
  inner_join(ltmd_data_location_mean, by = c("participant_id", "group"))

cat("Participants with all four measures:", nrow(cross_domain_data), "\n\n")

# VP Colour predicting LTMD Location
cor_colour_to_location <- cor(cross_domain_data$mean_vp_colour_angle_abs_deviation, 
                             cross_domain_data$mean_ltmd_location_angle_abs_deviation, 
                             use = "complete.obs")
cor_test_colour_to_location <- cor.test(cross_domain_data$mean_vp_colour_angle_abs_deviation, 
                                       cross_domain_data$mean_ltmd_location_angle_abs_deviation)

cat("VP COLOUR → LTMD LOCATION correlation:\n")
cat("r =", round(cor_colour_to_location, 3), "\n")
cat("p =", format(cor_test_colour_to_location$p.value, scientific = TRUE), "\n\n")

# VP Location predicting LTMD Colour
cor_location_to_colour <- cor(cross_domain_data$mean_vp_location_angle_abs_deviation, 
                             cross_domain_data$mean_ltmd_colour_angle_abs_deviation, 
                             use = "complete.obs")
cor_test_location_to_colour <- cor.test(cross_domain_data$mean_vp_location_angle_abs_deviation, 
                                       cross_domain_data$mean_ltmd_colour_angle_abs_deviation)

cat("VP LOCATION → LTMD COLOUR correlation:\n")
cat("r =", round(cor_location_to_colour, 3), "\n")
cat("p =", format(cor_test_location_to_colour$p.value, scientific = TRUE), "\n\n")

# ===============================================================================
# PLOTS (formatted, all in one faceted figure)
# ===============================================================================

# Build combined plotting dataframe
plot_data <- bind_rows(
  merged_data_colour_mean %>%
    transmute(
      x = mean_vp_colour_angle_abs_deviation,
      y = mean_ltmd_colour_angle_abs_deviation,
      group,
      Type = "Within-domain",
      Comparison = "VP Colour → LTMD Colour"
    ),
  merged_data_location_mean %>%
    transmute(
      x = mean_vp_location_angle_abs_deviation,
      y = mean_ltmd_location_angle_abs_deviation,
      group,
      Type = "Within-domain",
      Comparison = "VP Location → LTMD Location"
    ),
  cross_domain_data %>%
    transmute(
      x = mean_vp_colour_angle_abs_deviation,
      y = mean_ltmd_location_angle_abs_deviation,
      group,
      Type = "Cross-domain",
      Comparison = "VP Colour → LTMD Location"
    ),
  cross_domain_data %>%
    transmute(
      x = mean_vp_location_angle_abs_deviation,
      y = mean_ltmd_colour_angle_abs_deviation,
      group,
      Type = "Cross-domain",
      Comparison = "VP Location → LTMD Colour"
    )
)

# Force facet order: Colour comparisons always left
plot_data <- plot_data %>%
  mutate(
    Comparison = factor(
      Comparison,
      levels = c("VP Colour → LTMD Colour",
                 "VP Location → LTMD Location",
                 "VP Colour → LTMD Location",
                 "VP Location → LTMD Colour")
    )
  )

# --- Faceted plot ---
facet_plot <- ggplot(plot_data, aes(x = x, y = y)) +
  geom_point(color = "grey20", alpha = 0.75) +   # dark grey points
  geom_smooth(method = "lm", se = FALSE, color = "black",
              linetype = "longdash", size = 1) +  # dashed regression line
  facet_wrap(~Comparison, ncol = 2) +            # only by Comparison
  theme_minimal() +
  theme(
    legend.position = "none",
    strip.text = element_text(face = "bold", size = 9),
    strip.background = element_rect(fill = "grey95", color = NA),  # light grey facet background
    plot.title = element_text(face = "bold", hjust = 0.5)
  ) +
  labs(x = "VP Mean Deviation",
       y = "LTMD Mean Deviation") +
  scale_x_continuous(limits = x_limits) +
  scale_y_continuous(limits = y_limits)

print(facet_plot)



# ===============================================================================
# SUMMARY TABLE
# ===============================================================================

cat("\n=== CORRELATION SUMMARY ===\n")
correlation_summary <- data.frame(
  Predictor = c("VP Colour", "VP Location", "VP Colour", "VP Location"),
  Outcome = c("LTMD Colour", "LTMD Location", "LTMD Location", "LTMD Colour"),
  Type = c("Within-domain", "Within-domain", "Cross-domain", "Cross-domain"),
  r = c(round(correlation_colour, 3), 
        round(correlation_location, 3), 
        round(cor_colour_to_location, 3), 
        round(cor_location_to_colour, 3)),
  p = c(cor_test_colour$p.value, 
        cor_test_location$p.value, 
        cor_test_colour_to_location$p.value, 
        cor_test_location_to_colour$p.value)
)
print(correlation_summary)
