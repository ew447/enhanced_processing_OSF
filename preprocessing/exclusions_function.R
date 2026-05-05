# Shared exclusion functions for all analysis scripts

library(readxl)
library(dplyr)

# Function to filter out excluded observations
filter_exclusions <- function(df) {
  # Path to exclusions file
  excl_path <- "<PATH_TO_PARTICIPANTS>/exclusions.xlsx"
  
  # Read exclusions
  exclude_obs <- read_excel(excl_path)$observation
  exclude_obs <- as.character(exclude_obs)  
  
  # Ensure the observation column in df is also character
  df <- df %>%
    mutate(observation = as.character(observation))
  
  # Filter out excluded observations
  df_filtered <- df %>% 
    filter(!(observation %in% exclude_obs))
  
  # Report how many were excluded
  n_excluded <- nrow(df) - nrow(df_filtered)
  if (n_excluded > 0) {
    cat("Excluded", n_excluded, "observations from exclusions.xlsx\n")
  }
  
  return(df_filtered)
}
