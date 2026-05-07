# Synaesthesia, Visual Perception, and Memory

R code accompanying the Stage 2 Registered Report submission:

> Whelan, E., Sachdeva, C., Ovalle-Fresa, R., Rothen, N., & Ward, J.
> *Synaesthesia as a Model for Assessing Individual Differences in
> Visual Perception and Memory Performance.*

This repository contains the scripts needed to reproduce the results reported
in the manuscript (model-free ANOVAs and regressions, Bayes factors,
mixture-model fits, Mahalanobis D, and Random Forest classification).
Minimally-processed CSVs, including participants who were later excluded
(one per task per group), are deposited as data on OSF.

The Lab.js experiment code used to collect the data is also hosted at
<https://github.com/ew447/enhanced_processing_OSF/tree/main/experiments>.

The preprint of the manuscript is available here: <https://zenodo.org/records/20060879>
The data is available here: <https://osf.io/pjb6e>

---

## Repository layout

```
OSF/
├── OSF.Rproj
├── README.md
├── .gitignore
│
├── Data/                                # all data lives here
│   ├── observation_list.xlsx            # sheets: Synaesthetes, Relatives, Controls
│   ├── exclusions.xlsx                  # task-level exclusions (observation hashes)
│   ├── Synaesthetes/
│   │   ├── VP.csv                       # visual perception 
│   │   ├── STM.csv                      # short-term memory, loads 1/3/5
│   │   ├── LTMI.csv                     # long-term memory immediate (reps 1–4)
│   │   ├── LTMD.csv                     # long-term memory delayed (rep 5)
│   │   └── questionnaires.csv           # SCSQ + SMS scored item-by-item
│   ├── Relatives/
│   │   └── (same five files)
│   └── Controls/
│       └── (same five files)
│
├── preprocessing/
│   └── exclusions_function.R            # shared exclusion filter (sourced everywhere)
│
├── bayesian/
│   ├── bayes_factor_function.R          # Dienes (2019) Bf() function
│   ├── bayesian_group_comparisons.R     # BFs for group comparisons
│   ├── bayesian_regressions.R           # BFs for regressions (H2a, H2b)
│   └── bayesian_num_types.R             # BFs by syn_num_types
│
├── model-based/
│   ├── mixture_model_fits.R             # mixtur fits, kappa / p_t / p_u
│   └── mixture_model_num_types.R        # few-vs-many split (mixtur)
│
├── multivariate/
│   ├── mahalanobis_D_bias_corrected.R   # bias-corrected Mahalanobis D
│   ├── multivariate_cogstyle.R          # cognitive-style multivariate analyses
│   └── multivariate_syntypes.R          # Random-Forest + correlations by num_types
│
└── model-free/
    ├── VP/                              # visual perception 
    │   ├── VP_hyp_1_4.R
    │   ├── VP_hyp_3.R
    │   ├── VP_2x2x2.R
    │   └── mediation_motivation.R       # mediation: motivation → VP
    ├── STM/
    │   ├── STM_hyp_1_4.R
    │   ├── STM_hyp_2a.R
    │   ├── STM_hyp_2b.R
    │   ├── STM_hyp_3.R
    │   └── STM_2x2x2.R
    ├── LTMI/
    │   ├── LTMI_hyp_1_4.R
    │   ├── LTMI_hyp_2a.R
    │   ├── LTMI_hyp_2b.R
    │   ├── LTMI_hyp_3.R
    │   └── LTMI_2x2x2.R
    └── LTMD/
        ├── LTMD_hyp_1_4.R
        ├── LTMD_hyp_2a.R
        ├── LTMD_hyp_2b.R
        ├── LTMD_hyp_3.R
        └── LTMD_2x2x2.R
```

Every CSV has a column called `observation` (used by `exclusions_function.R`
to drop fast/partial sessions) and a column called `participant_id` (used to
merge with `observation_list.xlsx`). Output CSVs from the analyses
(descriptive statistics, Bayes-factor tables, mixture-model parameter
estimates, etc.) are written back into `Data/`.

---

## Placeholder paths

Every script that reads or writes files uses one of the placeholders below at
the top of the script (or in a `source()` call). Replace each placeholder with
an absolute path on your machine before running.

| Placeholder              | What to point it at                                                              |
|--------------------------|----------------------------------------------------------------------------------|
| `<PATH_TO_REPO>`         | Root of this repository (the folder that contains this README)                   |
| `<PATH_TO_DATA>`         | `Data/` folder inside the repo (holds `Synaesthetes/`, `Relatives/`, `Controls/`)|
| `<PATH_TO_PARTICIPANTS>` | `Data/` folder inside the repo (holds `observation_list.xlsx` and `exclusions.xlsx`) |

`<PATH_TO_DATA>` and `<PATH_TO_PARTICIPANTS>` point at the same folder
(`Data/`) — they're kept as separate placeholders only because the original
analysis project stored the participant Excel files separately from the task
CSVs.

A simple way to set everything at once (e.g. on macOS):

```r
PATH_TO_REPO         <- "~/Documents/OSF"
PATH_TO_DATA         <- "~/Documents/OSF/Data"
PATH_TO_PARTICIPANTS <- "~/Documents/OSF/Data"
```


---

## Mapping to the manuscript

| Section / Hypothesis                                                | Where to look                                                                    |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------|
| H1: Synaesthetes vs controls on VP / STM / LTMI / LTMD              | `model-free/<task>/<task>_hyp_1_4.R`                                             |
| H2a: Correlation between synaesthesia score and memory              | `model-free/<task>/<task>_hyp_2a.R` (STM/LTMI/LTMD)                              |
| H2b: Regression with VP entered as a predictor                      | `model-free/<task>/<task>_hyp_2b.R` (STM/LTMI/LTMD)                              |
| H3: GCS vs SSS subtype contrasts                                    | `model-free/<task>/<task>_hyp_3.R`                                               |
| H4: Relatives as an intermediate group                              | `model-free/<task>/<task>_hyp_1_4.R` (relatives included)                        |
| Bayesian re-analyses                                                | `bayesian/bayesian_group_comparisons.R`, `bayesian_regressions.R`                |
| Mixture-model precision (κ, p_target, p_uniform)                    | `model-based/mixture_model_fits.R`                                               |
| Multivariate (Mahalanobis D, Random Forest)                         | `multivariate/mahalanobis_D_bias_corrected.R`, `multivariate_syntypes.R`         |
| Exploratory 2×2×2 factorial (group × cognitive style × subtype)     | `model-free/<task>/<task>_2x2x2.R`                                               |
| Number-of-types analyses                                            | `bayesian/bayesian_num_types.R`, `model-based/mixture_model_num_types.R`, `multivariate/multivariate_syntypes.R` |
| Mediation: motivation → VP                                          | `model-free/VP/mediation_motivation.R`                                           |

---

## How to run

1. Open `OSF.Rproj` in RStudio.
2. Edit each `<PATH_TO_*>` placeholder to match your local paths.
3. The analysis scripts source `preprocessing/exclusions_function.R` and
   `bayesian/bayes_factor_function.R` automatically; no other setup needed.
4. Run any analysis script independently — they don't depend on each other.

A typical "reproduce everything" order would be:

- `model-free/<task>/*.R` (per-hypothesis ANOVAs and regressions per task)
- `bayesian/*.R`
- `model-based/*.R`
- `multivariate/*.R`

---

## R packages used

`dplyr`, `tidyr`, `tidyverse`, `readr`, `readxl`, `ggplot2`, `janitor`,
`broom`, `emmeans`, `mediation`, `interactions`, `mixtur`, `randomForest`.
Bayes factors follow Dienes (2019, 2020) using the room-to-move and
ratio-of-means heuristics — see `bayesian/bayes_factor_function.R` for
parameter setup.

