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

# Load the LTMI data
controls_ltmi <- read.csv("<PATH_TO_DATA>/Controls/LTMI.csv")
controls_ltmi <- filter_exclusions(controls_ltmi)

rels_ltmi <- read.csv("<PATH_TO_DATA>/Relatives/LTMI.csv")
rels_ltmi <- filter_exclusions(rels_ltmi)

syn_ltmi <- read.csv("<PATH_TO_DATA>/Synaesthetes/LTMI.csv")
syn_ltmi <- filter_exclusions(syn_ltmi)

# Add group labels and ensure participant_id is character
controls_vp <- controls_vp %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_vp <- rels_vp %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_vp <- syn_vp %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

controls_ltmi <- controls_ltmi %>% mutate(participant_id = as.character(participant_id), group = "controls")
rels_ltmi <- rels_ltmi %>% mutate(participant_id = as.character(participant_id), group = "relatives")
syn_ltmi <- syn_ltmi %>% mutate(participant_id = as.character(participant_id), group = "synaesthetes")

# Combine the VP data
vp_data <- bind_rows(controls_vp, rels_vp, syn_vp)

# Combine the LTMI data
ltmi_data <- bind_rows(controls_ltmi, rels_ltmi, syn_ltmi)

# ===============================================================================
# VP DATA PREPARATION
# ===============================================================================

vp_data_colour <- vp_data %>%
  select(participant_id, colour_angle_abs_deviation, group) %>%
  rename(vp_colour_angle_abs_deviation = colour_angle_abs_deviation)

vp_data_location <- vp_data %>%
  select(participant_id, location_angle_abs_deviation, group) %>%
  rename(vp_location_angle_abs_deviation = location_angle_abs_deviation)

# ===============================================================================
# LTMI DATA PREPARATION
# Rep 4 used for exclusions; reps 1-4 used as DV
# ===============================================================================

# Rep 4 only --- for exclusion decisions
ltmi_data_colour_rep4 <- ltmi_data %>%
  filter(repetition == 4) %>%
  select(participant_id, colour_angle_abs_deviation, group)

ltmi_data_location_rep4 <- ltmi_data %>%
  filter(repetition == 4) %>%
  select(participant_id, location_angle_abs_deviation, group)

# All repetitions (1-4) --- actual DVs
ltmi_data_colour <- ltmi_data %>%
  select(participant_id, colour_angle_abs_deviation, group)

ltmi_data_location <- ltmi_data %>%
  select(participant_id, location_angle_abs_deviation, group)

# ===============================================================================
# VP EXCLUSIONS AND MEANS
# ===============================================================================

# Calculate mean VP deviation - COLOUR
vp_data_colour_mean <- vp_data_colour %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_colour_angle_abs_deviation = mean(vp_colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track VP exclusions - COLOUR
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

# Exclude VP outliers - COLOUR
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

# Calculate mean VP deviation - LOCATION
vp_data_location_mean <- vp_data_location %>%
  group_by(participant_id, group) %>%
  summarize(mean_vp_location_angle_abs_deviation = mean(vp_location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track VP exclusions - LOCATION
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

cat("VP LOCATION exclusions by group:\n")
print(vp_location_exclusions)
cat("\n")

# Exclude VP outliers - LOCATION
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
# LTMI EXCLUSIONS AND MEANS
# ===============================================================================

# --- COLOUR ---

# Compute rep-4 means for exclusion
ltmi_data_colour_mean_rep4 <- ltmi_data_colour_rep4 %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Compute reps 1-4 means for DV
ltmi_data_colour_mean <- ltmi_data_colour %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_colour_angle_abs_deviation = mean(colour_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track LTMI exclusions - COLOUR
ltmi_colour_exclusions <- ltmi_data_colour_mean_rep4 %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmi_colour_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmi_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmi_colour_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  summarize(
    total = n(),
    excluded = sum(z_score_high > 2.5),
    remaining = sum(z_score_high <= 2.5),
    .groups = 'drop'
  )

cat("LTMI COLOUR exclusions by group:\n")
print(ltmi_colour_exclusions)
cat("\n")

# Get IDs to keep based on rep 4
keep_ids_ltmi_colour <- ltmi_data_colour_mean_rep4 %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmi_colour_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmi_colour_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmi_colour_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  filter(z_score_high <= 2.5) %>%
  select(participant_id, group)

# Apply exclusions to reps 1-4 DV
ltmi_data_colour_mean <- ltmi_data_colour_mean %>%
  semi_join(keep_ids_ltmi_colour, by = c("participant_id", "group"))

# --- LOCATION ---

# Compute rep-4 means for exclusion
ltmi_data_location_mean_rep4 <- ltmi_data_location_rep4 %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Compute reps 1-4 means for DV
ltmi_data_location_mean <- ltmi_data_location %>%
  group_by(participant_id, group) %>%
  summarize(mean_ltmi_location_angle_abs_deviation = mean(location_angle_abs_deviation, na.rm = TRUE), .groups = 'drop')

# Track LTMI exclusions - LOCATION
ltmi_location_exclusions <- ltmi_data_location_mean_rep4 %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmi_location_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmi_location_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmi_location_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  summarize(
    total = n(),
    excluded = sum(z_score_high > 2.5),
    remaining = sum(z_score_high <= 2.5),
    .groups = 'drop'
  )

cat("LTMI LOCATION exclusions by group:\n")
print(ltmi_location_exclusions)
cat("\n")

# Get IDs to keep based on rep 4
keep_ids_ltmi_location <- ltmi_data_location_mean_rep4 %>%
  group_by(group) %>%
  mutate(
    group_mean = mean(mean_ltmi_location_angle_abs_deviation, na.rm = TRUE),
    group_sd = sd(mean_ltmi_location_angle_abs_deviation, na.rm = TRUE),
    z_score_high = (mean_ltmi_location_angle_abs_deviation - group_mean) / group_sd
  ) %>%
  filter(z_score_high <= 2.5) %>%
  select(participant_id, group)

# Apply exclusions to reps 1-4 DV
ltmi_data_location_mean <- ltmi_data_location_mean %>%
  semi_join(keep_ids_ltmi_location, by = c("participant_id", "group"))

# ===============================================================================
# MERGE VP AND LTMI DATA
# ===============================================================================

# Merge - COLOUR
merged_data_colour_mean <- ltmi_data_colour_mean %>%
  left_join(vp_data_colour_mean, by = c("participant_id", "group")) %>%
  filter(!is.na(mean_vp_colour_angle_abs_deviation) & !is.na(mean_ltmi_colour_angle_abs_deviation))

# Merge - LOCATION
merged_data_location_mean <- ltmi_data_location_mean %>%
  left_join(vp_data_location_mean, by = c("participant_id", "group")) %>%
  filter(!is.na(mean_vp_location_angle_abs_deviation) & !is.na(mean_ltmi_location_angle_abs_deviation))

# ===============================================================================
# WITHIN-DOMAIN CORRELATIONS
# ===============================================================================

correlation_colour <- cor(merged_data_colour_mean$mean_vp_colour_angle_abs_deviation,
                          merged_data_colour_mean$mean_ltmi_colour_angle_abs_deviation,
                          use = "complete.obs")
cor_test_colour <- cor.test(merged_data_colour_mean$mean_vp_colour_angle_abs_deviation,
                            merged_data_colour_mean$mean_ltmi_colour_angle_abs_deviation)

cat("COLOUR correlation (VP vs LTMI reps 1-4):\n")
cat("r =", round(correlation_colour, 3), "\n")
cat("p =", format(cor_test_colour$p.value, scientific = TRUE), "\n")
cat("n =", nrow(merged_data_colour_mean), "\n\n")

correlation_location <- cor(merged_data_location_mean$mean_vp_location_angle_abs_deviation,
                            merged_data_location_mean$mean_ltmi_location_angle_abs_deviation,
                            use = "complete.obs")
cor_test_location <- cor.test(merged_data_location_mean$mean_vp_location_angle_abs_deviation,
                              merged_data_location_mean$mean_ltmi_location_angle_abs_deviation)

cat("LOCATION correlation (VP vs LTMI reps 1-4):\n")
cat("r =", round(correlation_location, 3), "\n")
cat("p =", format(cor_test_location$p.value, scientific = TRUE), "\n")
cat("n =", nrow(merged_data_location_mean), "\n\n")

# ===============================================================================
# CROSS-DOMAIN CORRELATIONS
# ===============================================================================

cross_domain_data <- vp_data_colour_mean %>%
  inner_join(vp_data_location_mean, by = c("participant_id", "group")) %>%
  inner_join(ltmi_data_colour_mean, by = c("participant_id", "group")) %>%
  inner_join(ltmi_data_location_mean, by = c("participant_id", "group"))

cat("Participants with all four measures:", nrow(cross_domain_data), "\n\n")

cor_colour_to_location <- cor(cross_domain_data$mean_vp_colour_angle_abs_deviation,
                              cross_domain_data$mean_ltmi_location_angle_abs_deviation,
                              use = "complete.obs")
cor_test_colour_to_location <- cor.test(cross_domain_data$mean_vp_colour_angle_abs_deviation,
                                        cross_domain_data$mean_ltmi_location_angle_abs_deviation)

cat("VP COLOUR -> LTMI LOCATION correlation:\n")
cat("r =", round(cor_colour_to_location, 3), "\n")
cat("p =", format(cor_test_colour_to_location$p.value, scientific = TRUE), "\n\n")

cor_location_to_colour <- cor(cross_domain_data$mean_vp_location_angle_abs_deviation,
                              cross_domain_data$mean_ltmi_colour_angle_abs_deviation,
                              use = "complete.obs")
cor_test_location_to_colour <- cor.test(cross_domain_data$mean_vp_location_angle_abs_deviation,
                                        cross_domain_data$mean_ltmi_colour_angle_abs_deviation)

cat("VP LOCATION -> LTMI COLOUR correlation:\n")
cat("r =", round(cor_location_to_colour, 3), "\n")
cat("p =", format(cor_test_location_to_colour$p.value, scientific = TRUE), "\n\n")

# ===============================================================================
# PLOTTING
# ===============================================================================

x_limits <- c(0, 20)
y_limits <- c(0, 70)

plot_data <- bind_rows(
  merged_data_colour_mean %>%
    rename(x = mean_vp_colour_angle_abs_deviation,
           y = mean_ltmi_colour_angle_abs_deviation) %>%
    mutate(Comparison = "VP Colour -> LTMI Colour"),
  
  merged_data_location_mean %>%
    rename(x = mean_vp_location_angle_abs_deviation,
           y = mean_ltmi_location_angle_abs_deviation) %>%
    mutate(Comparison = "VP Location -> LTMI Location"),
  
  cross_domain_data %>%
    rename(x = mean_vp_colour_angle_abs_deviation,
           y = mean_ltmi_location_angle_abs_deviation) %>%
    mutate(Comparison = "VP Colour -> LTMI Location"),
  
  cross_domain_data %>%
    rename(x = mean_vp_location_angle_abs_deviation,
           y = mean_ltmi_colour_angle_abs_deviation) %>%
    mutate(Comparison = "VP Location -> LTMI Colour")
)

plot_data$Comparison <- factor(plot_data$Comparison, levels = c(
  "VP Colour -> LTMI Colour",
  "VP Location -> LTMI Location",
  "VP Colour -> LTMI Location",
  "VP Location -> LTMI Colour"
))

facet_plot <- ggplot(plot_data, aes(x = x, y = y)) +
  geom_point(color = "grey20", alpha = 0.75) +
  geom_smooth(method = "lm", se = FALSE, color = "black", linetype = "longdash", size = 1) +
  facet_wrap(~Comparison, ncol = 2, strip.position = "top") +
  theme_minimal() +
  theme(
    legend.position = "none",
    strip.text = element_text(face = "bold", size = 9),
    strip.background = element_rect(fill = "grey95", color = NA)
  ) +
  labs(x = "VP Mean Deviation",
       y = "LTMI Mean Deviation (reps 1-4)") +
  scale_x_continuous(limits = x_limits) +
  scale_y_continuous(limits = y_limits)

print(facet_plot)

# ===============================================================================
# SUMMARY TABLE
# ===============================================================================

cat("=== CORRELATION SUMMARY ===\n")
correlation_summary <- data.frame(
  Predictor = c("VP Colour", "VP Location", "VP Colour", "VP Location"),
  Outcome = c("LTMI Colour", "LTMI Location", "LTMI Location", "LTMI Colour"),
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
