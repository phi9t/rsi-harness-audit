# Benchmarks this cohort used

SOTA here means the **upstream** suite, not the best number inside these 16 papers. Snapshot date: **16 August 2026**.

When a paper reports a slice (MATH 617 level-5, ARC Easy ≤5×5, SWE 60 Django/Sphinx, AIME 2024 in-sample), that number is not the official leaderboard. Grade the experiment; look here for what the suite actually is.

## How to read a row

- **Official** is the maintainer page or paper that defines the split.
- **This cohort** is how these 16 papers used it (often a subset, a rewrite, or the same set for search and score).
- **Upstream SOTA** is a pointer, not a second grade. Independent aggregators disagree; prefer the official board when it exists.

## Coding agents

| Suite | Official | This cohort | Upstream SOTA (16 Aug 2026) |
|---|---|---|---|
| SWE-bench Verified (500) | [swebench.com/verified](https://www.swebench.com/verified) | DGM: staged 10 → 60 (35 Django / 25 Sphinx) → optional 200, not the 500. HGM: same 60 for the bake-off; **all 500** for the 8,000-eval run (Eval D); Lite-207 after dropping 93 overlap. | Official board, not an aggregator. Frontier scaffolds are in the 90%+ band on the full 500 with heavy tools; DGM 50% and HGM 61.4% are not that comparison. HGM’s authors say leaderboard scores can overfit. |
| SWE-bench Lite (300) | same family | HGM reports 207 leftover tasks after dropping Verified overlap. | Same official site. Do not mix Lite with Verified. |
| Polyglot (Aider) | [Aider-AI/polyglot-benchmark](https://github.com/Aider-AI/polyglot-benchmark) | DGM/HGM: solver pass@1, no hidden tests at *solve* time. Search used 10 then 50; full-set number is a later pass. DGM diagnoser can still see `reference_tests` on the search slice. | Aider’s own leaderboard. Cohort numbers are not a submission there. |
| HumanEval | Chen et al. 2021 | GPTSwarm updates prompts from the stream and re-scores the whole set (Eval D). | Saturated for frontier models. A 0.76 → 0.88 in-sample walk is not a HumanEval SOTA claim. |
| KernelBench | [ScalingIntelligence/KernelBench](https://github.com/ScalingIntelligence/KernelBench) | GEPA: same 35 representative kernels for search and report (Eval D). | KernelBench leaderboards are kernel-family specific. GEPA’s 35-kernel walk is not a leftover-family result. |
| ALE-Bench LITE | Sakana ALE-Bench | ShinkaEvolve: 10 tasks, public score for search, private for the report. | Contest private scores are the right protocol. n=10, init hugging ALE-Agent. |

## Math and QA

| Suite | Official | This cohort | Upstream SOTA (16 Aug 2026) |
|---|---|---|---|
| GSM8K | Cobbe et al. 2021 | PromptBreeder leftover/official test; AFlow 20/80; Self-Developing 100/1220. | Saturated for frontier models. PromptBreeder 83.9 is PaLM 2-L vs a borrowed OPRO 80.2 row. |
| MATH | Hendrycks et al. 2021 | AFlow / MaAS / MASS reuse or echo a **617 level-5, four-category** slice. MASS 60 val / 100 test. MaAS 119/486 of that 617. | Full MATH and MATH-500 are different objects. These papers are not full MATH. |
| AIME 2023/2024/2025 | MAA contests | ShinkaEvolve searches all 30 AIME **2024** (Eval D for that score), then reports 2023/2025 (Eval B). In-sample 2024: 34.4 vs base 24.4 / majority@5 32.2. GEPA arXiv 2507.19457 v1 does **not** contain AIME. | Year transfer is the usable Shinka row. Frontier AIME numbers move quickly; do not paste an unofficial aggregator into a grade. |
| GPQA Diamond | Rein et al. | ADAS / Gödel: 32 val / 166 test. Tiny val. | Full Diamond is 198. 32-item val is not that. |
| HotpotQA / HoVer | Yang et al. / Jiang et al. | GEPA HoVer 150/300/300 train/val/test. | GEPA’s number is a held-out split of HoVer, not a HotpotQA leaderboard SOTA. |
| IFBench | IF-RLVR / IFBench | GEPA: 150/300/294, unseen constraint types in test. “35× rollouts” is this task only (24,000/678). | Constraint-type holdout is the interesting protocol. Merge can *hurt* Qwen IFBench (28.23 vs 36.90). |
| MMLU | Hendrycks et al. | GPTSwarm collaborative: five training seeds, overlapping val/dev (Eval C). | Saturated. +2.1±1.1 is a small graph-search result, not MMLU SOTA. |
| MiniCrosswords | Yao et al. ToT | GPTSwarm: same **20** puzzles for optimize and score (Eval D). | 20-item in-sample. Not a crossword leaderboard. |

## Preference, merge, pretraining

| Suite | Official | This cohort | Upstream SOTA (16 Aug 2026) |
|---|---|---|---|
| MT-Bench | LMSYS FastChat | DiscoPOP **selection** metric. LRML is 6th among discovered losses (7.916 vs DBAQL 7.978). | Judge is GPT-4. Do not read DiscoPOP as MT-Bench SOTA. |
| AlpacaEval 2.0 | tatsu-lab | DiscoPOP held-out win rate. PADLL 14.07 > AQFL 13.63 > LRML 13.21 vs GPT-4. | Length-controlled ranking can flip the winner. Still not “SOTA preference loss.” |
| AppWorld | [StonyBrookNLP/appworld](https://github.com/StonyBrookNLP/appworld) | ACE offline: train, freeze, original test (Eval B+). Online: prequential on shuffled test (Eval C). | CUGA-style leaderboard rows are a different estimand from ACE online. Compare frozen to frozen. |
| ARC | Chollet | ADAS: public training, Easy, grids ≤5×5, 20 val / 60 test. | Not ARC-AGI. Any “ARC SOTA” claim without Easy ≤5×5 is false. |
| FineWeb / MoE downstream | Pile-style LM evals | ShinkaEvolve MoE: 556M then 2.7B, **same 64 experts / top-8**. Mean 0.362 → 0.368; HellaSwag and PIQA drop. | Not an OLMo/Qwen pretraining SOTA. It is a loss-formula transfer at frozen routing shape. |

## Suites that are not search results

| Suite | Note |
|---|---|
| GAIA | GPTSwarm Table 1 is a **hand-built** swarm (`run_gaia.py` never calls the optimizer). Do not grade as graph search. |
| LiveCodeBench (MASS) | Small subset, three test executions of one topology. ± is not search. |

## Shared-slice warning

AFlow, MaAS, and MASS MATH numbers sit on the same 617-problem level-5 family. Cross-paper MATH comparisons in this cohort are not full MATH and are not independent draws from MATH.

DGM and HGM share the SWE-Verified **60** (35 Django / 25 Sphinx). HGM’s policy comparison on that slice is a searcher comparison, not a new SWE SOTA. Both diagnosers can see private tests on that slice.
