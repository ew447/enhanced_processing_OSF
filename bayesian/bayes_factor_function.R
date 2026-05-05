# ===============================================================================
# Bayes-factor function (Dienes, 2008/2014/2019)
#
# Defines Bf(), which numerically integrates the likelihood of a parameter
# under a specified theoretical distribution and divides by the likelihood
# at the null. This is the function called by every script in the Bayesian/
# folder (bayesian_group_comparisons.R, bayesian_regressions.R,
# bayesian_num_types.R), so source this file before running any of them, e.g.
#
#     source("<PATH_TO_REPO>/Bayesian/bayes_factor_function.R")
#
# Arguments:
#   sd, obtained, dfdata  -- standard error, observed effect, residual df
#   likelihood            -- "normal" (default) or "t"
#   modeloftheory         -- "normal", "t", "cauchy", or "uniform" prior on H1
#   modeoftheory,
#   scaleoftheory,
#   dftheory              -- prior parameters (mode, SD/scale, df)
#   tail                  -- 1 (one-sided / half-distribution) or 2 (two-sided)
#   lower, upper          -- bounds when modeloftheory = "uniform"
#
# Heuristics used in this project (see manuscript Methods):
#   * Group comparisons      -> half-normal, room-to-move heuristic
#   * Regression slopes      -> half-normal, ratio-of-means heuristic
#   * Bayes factor cut-offs  -> BF >= 3 supports H1, BF <= 1/3 supports H0,
#                               otherwise inconclusive
#
# Reference:
#   Dienes, Z. (2019). How do I know what my theory predicts? Advances in
#   Methods and Practices in Psychological Science, 2(4), 364–377.
# ===============================================================================

# --- Examples (commented) -------------------------------------------------------
# # Example from Dienes (2019), Balzarini et al. (2019):
# # Bf(sd = 0.11, obtained = -0.05, dfdata = 2500,
# #    likelihood = "normal", modeoftheory = 0,
# #    scaleoftheory = 1.15, modeloftheory = "normal", tail = 1)
#
# # Group difference (room-to-move heuristic):
# # x <- t.test(column_to_use ~ group_labels)
# # semdiff       <- x$stderr
# # cont_mean     <- x$estimate[1]
# # syn_mean      <- x$estimate[2]
# # observed_diff <- syn_mean - cont_mean
# # df_values     <- x$parameter
# # Bf(sd = semdiff, obtained = observed_diff, dfdata = df_values,
# #    likelihood = "normal", modeoftheory = 0,
# #    scaleoftheory = cont_mean, modeloftheory = "normal", tail = 1)
#
# # Regression slope (ratio-of-means heuristic):
# # df       <- summary(lm_model)$df[2]
# # observed <- lm_model$coefficients[c("SMS_total")]
# # se       <- summary(lm_model)$coefficients[c("SMS_total"), 2]
# # ratio_of_scales <- MRS_range / SMS_range
# # Bf(sd = se, obtained = observed, dfdata = df,
# #    likelihood = "normal", modeoftheory = 0,
# #    scaleoftheory = ratio_of_scales, modeloftheory = "normal", tail = 1)
# -------------------------------------------------------------------------------


Bf <- function(sd, obtained, dfdata = 1,
               likelihood    = c("normal", "t"),
               modeloftheory = c("normal", "t", "cauchy", "uniform"),
               lower = 0, upper = 1,
               modeoftheory  = 0, scaleoftheory = 1, dftheory = 1,
               tail = 2) {

  if (likelihood == "normal") {
    dfdata <- 10^10
  }

  if (modeloftheory == "normal") {
    dftheory <- 10^10
  } else if (modeloftheory == "cauchy") {
    dftheory <- 1
  }

  area     <- 0
  normarea <- 0

  if (modeloftheory == "uniform") {
    theta <- lower
    range <- upper - lower
    incr  <- range / 2000

    for (A in -1000:1000) {
      theta      <- theta + incr
      dist_theta <- 1 / range
      height     <- dist_theta * dt((obtained - theta) / sd, df = dfdata)
      area       <- area + height * incr
    }

    LikelihoodTheory <- area

  } else {
    theta <- modeoftheory - 8 * scaleoftheory
    incr  <- scaleoftheory / 200

    for (A in -1600:1600) {
      theta      <- theta + incr
      dist_theta <- dt((theta - modeoftheory) / scaleoftheory, df = dftheory)

      if (identical(tail, 1)) {
        if (theta <= modeoftheory) {
          dist_theta <- 0
        } else {
          dist_theta <- dist_theta * 2
        }
      }

      height   <- dist_theta * dt((obtained - theta) / sd, df = dfdata)
      area     <- area + height * incr
      normarea <- normarea + dist_theta * incr
    }

    LikelihoodTheory <- area / normarea
  }

  Likelihoodnull <- dt(obtained / sd, df = dfdata)
  BayesFactor    <- LikelihoodTheory / Likelihoodnull

  BayesFactor
}
