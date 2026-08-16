# Grades, round 2

Scored with [`RUBRICS.md`](RUBRICS.md). One row is one experiment. Search method and evolved object are separate. RSI is 0 or 1 everywhere.

**Cite the row, not the PDF.** GEPA is B+ only for the main train/validation/test tables. KernelBench in the same paper is D.

---

## What changed from the last letter board

The last board still gave most PDFs one Eval and one Discovery. This round splits them. Letters move only when a ceiling or the plus/minus rule forces it.

| Change | Why |
|---|---|
| MASS Eval **B → B−** | Held-out test is real. Two misses: tiny subsets (MATH 60/100) and ± over three *answers*, not three searches. Minus is required. |
| MaAS search method **C → B−** | The supernet router is specified and compared to AFlow, not only to chain-of-thought. The *workflows* stay C (fixed operator list). |
| MASS search method **C → B−** | Same reason: staged prompt-then-topology vs ADAS/AFlow/debate. Objects stay C. |
| ACE search method **(was mixed into C+) → B** | The playbook updater is the authors' method. The playbook *contents* stay C. |
| GEPA KernelBench now its own **Eval D** | Same 35 kernels for search and report. |
| GPTSwarm MMLU split out at **Eval C** | Five training seeds, overlapping val/dev, small gain. MiniCrosswords/HumanEval stay D. GAIA is not a search result. |
| DGM Polyglot full-set extra eval **Eval C**; SWE-bench 20→50 stays **D** | Hidden tests never enter the Polyglot solver. They do enter the SWE o1 diagnosis prompt. |
| HGM Lite-207 stays **C+**; 8,000-on-500 is **D**; error-resolution object is **D** | Three different experiments. |
| ShinkaEvolve is four rows | Circle packing B−; AIME-2024 score D with year-transfer B; ALE B; MoE B. |
| STOP evolved object **C+ → C** | Beam search, annealing, UCB are textbook. The *loop* (search method) is B− because they reran it five times. |

No Eval A, no Discovery A, no RSI 2.

---

## Paper at a glance

"Best" is the cleanest experiment we would let someone cite. "Headline" is the number the abstract leans on.

| Paper | Best Eval | Headline Eval | Search method | Typical object | RSI |
|---|---|---|---|---|---|
| PromptBreeder | B− | B− | C | C | 1 |
| GPTSwarm | C (MMLU) | D (MiniCrosswords) | C | C | 0 |
| STOP | B | B | B− | C | 1 |
| DiscoPOP | B | B | C | B− | 0 |
| ADAS | B− | B− | C | C | 0 |
| AFlow | B− | B− | C | C | 0 |
| AgentSquare | D | D | C | C− | 0 |
| Gödel Agent | C− | C− | C | C− | 1 |
| Self-Developing | B− | B− | C | C+ | 0 |
| MaAS | B− | B− | B− | C | 0 |
| GEPA | B+ | B+ | B | C+ | 0 |
| ACE | B+ offline | mixed | B | C | 0 |
| MASS | B− | B− | B− | C | 0 |
| ShinkaEvolve | B (MoE, ALE) | mixed | C+ | B MoE / C else | 0 |
| DGM | C (Polyglot extra / transfer) | D (SWE 20→50) | C | C− | 1 |
| HGM | C+ (Lite-207) | mixed | B | C / D showcased | 1 |

---

## Experiment grades

Columns: **See** = what the proposer was allowed to see (1 clean test, 2 validation reused, 2r split then rewritten, 3 same tasks, 4 hidden tests in the proposal prompt). **Eval / Search / Object / RSI** as in the rubric.

### Prompt and context

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| PromptBreeder, arithmetic/GSM8K held-out half | 2 | **B−** | C | C | 1 | Train-batch fitness, then leftover test. No search repeats. OPRO 80.2 and some davinci rows are borrowed. `SOLUTION` is a short control string, not a reasoning method. Mutation prompts coevolve, so RSI is 1. |
| GEPA main, six tasks, Qwen / GPT-4.1 Mini | 2 | **B+** | B | C+ | 0 | Train/val/test exist (HoVer 150/300/300). Validation is scored every round. Prompt-optimizer budgets kept near each other. Search not repeated. Prompts are concrete task recipes; cross-model copy of those prompts is real. Searcher is reflection + Pareto, compared to MIPROv2 and GRPO. |
| GEPA KernelBench, 35 kernels | 3 | **D** | B | C | 0 | Search and report use the same 35 kernels. |
| GEPA adversarial prepend, AIME 2025 | 2 | **C** | B | C | 0 | Attack is searched on 2022–24 then scored on 2025. One narrative run. Treat as a red-team demo, not as a general prompt-optimizer result. |
| ACE offline AppWorld / finance | 1 | **B+** | B | C | 0 | Playbook from train, frozen, original test. No search repeats. Playbooks include paths and app APIs (`/home/.../bills/`, city folders). The updater (generator / reflector / curator) is the method. |
| ACE online, shuffled test stream | — | **C** | B | C | 0 | Predict, then learn from that test outcome, then continue. Real streaming protocol. Not frozen held-out accuracy. Same table columns as offline invite misreading. |

### Workflows

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| GPTSwarm MiniCrosswords | 3 | **D** | C | C | 0 | Same 20 puzzles for search and score. Edges among ToT / Reflexion / CoT. |
| GPTSwarm HumanEval stream | 3 | **D** | C | C | 0 | Prompts updated from the benchmark being reported. 0.76 → 0.88. |
| GPTSwarm MMLU collaborative | 2 | **C** | C | C | 0 | Five training seeds, +2.1±1.1. Scores sit on overlapping val/dev slices. Only GPTSwarm experiment with repeated *search*. |
| GPTSwarm GAIA | — | n/a | n/a | n/a | 0 | Hand-built swarm. Not graph search. |
| ADAS Meta Agent Search, main tables | 2 | **B−** | C | C | 0 | Search on validation, report test. One trajectory per domain. ARC is Easy ≤5×5. Generated agents use many more calls than CoT. Transfer of "top 3" uses already seen scores. Seed archive already lists CoT-SC, debate, self-refine. |
| AFlow, 20/80 seed 42 | 2r | **B−** | C | C | 0 | Test is 80%. After the split, a blank run five times keeps only high-variance val items. Operators are human (generate, format, review, ensemble, test, programmer). Ablation: GSM8K still high with operators removed. |
| AgentSquare, six environments | 3? | **D** | C | C− | 0 | No documented frozen final split. Predictor is fed past scores. Final agents recombine named modules (ToT, CoT-SC, DEPS, Voyager). Some prompts keep other environments' names. |
| MaAS supernet, 1:4 split | 2 | **B−** | B− | C | 0 | Train used for both learning the router and picking a path. MATH is 119/486 from 617 level-5. Router vs AFlow is a search-method comparison. Paths still walk CoT, debate, self-consistency, test, ReAct, early exit. |
| MASS staged prompt + topology | 2 | **B−** | B− | C | 0 | Validation then held-out test. Subsets are small (MATH 60/100). ± is three test runs of one topology. Staging vs ADAS/AFlow/debate is a searcher comparison. Topologies are how many aggregate/debate/reflect/execute blocks. |

### Self-editing agents

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| STOP, 10-bit LPN, 5 full runs | 1 | **B** | B− | C | 1 | 20 train copies, 50 held-out. Five complete loops. Tasks are toys. Children rediscover beam search, annealing, UCB. Reward hacks (unsandbox, >1000% from a NumPy shape bug) are the other scientific result. |
| Gödel Agent, val then test, 4o writes / 3.5 runs | 2 | **C−** | C | C− | 1 | GPQA val is 32 items. Main table mixes a stronger writer with a weaker solver. Policies are majority vote, roles, few-shot. |
| Gödel Agent unrestricted "free" | — | n/a | C | — | — | Learns to call GPT-4o. Drop from same-model harness tables. |
| Gödel Game of 24 exact solver | 2 | C | C | C | 1 | Recursion over ops until `abs(nums[0]-24)<1e-6`. Modality switch to brute force, not a new algorithm. |
| DGM SWE-bench, 20% → 50% on staged subsets | 4 | **D** | C | C− | 1 | o1 diagnosis prompt includes official private test patch and private-test log (§C.3). Staging 10 → ~60 (35 Django, 25 Sphinx) → 200 if >40% and top two. Start is bash + whole-file edit. Descendants add range view, string replace, retries, a ranker. |
| DGM Polyglot, extra eval on the full set | 2r | **C** | C | C | 1 | Solver never sees hidden tests. Search used a 10/50 slice; 14.2% → 30.7% is a later pass of the winner. One archive run. |
| DGM SWE-evolved agent on Polyglot | 4→holdout | **C** | C | C− | 1 | 14.2% → 28.9% on a benchmark the SWE loop never scored. Real transfer of an object grown with SWE private tests in the diagnoser. Does not clean the 20→50 number. |
| HGM vs DGM/SICA on Verified-60 / Polyglot | 2r | **C+** | B | C | 1 | Same 60-task slice as DGM. CMP + Thompson sampling vs greedy parent pick is the search-method claim. After-the-fact "best descendant" on the finished tree is not the online pooled pass rate. |
| HGM 8,000 evals on all 500 Verified | 3 | **D** | B | C | 1 | 53.2% → 61.4% on the same 500. Authors note leaderboard scores can overfit. |
| HGM best Verified agent on Lite-207 | 1 relative | **C+** | B | C | 1 | 93 of 300 Lite overlap Verified; they report the 207. GPT-5-mini 34.8% → 40.1% vs SWE-agent 39.6. One run. 0.5 point over a human harness. |
| HGM same agent, Lite with GPT-5 | mixed | **C** | B | C | 1 | Harness and backbone both change vs the GPT-5-mini search. |
| HGM `attempt_error_resolution` | — | — | — | **D** | 1 | Logs "Would attempt to install…", skips the install, returns True (appendix). |

### Objectives and algorithms

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| DiscoPOP, MT-Bench select, AlpacaEval/TL;DR/IMDb report | 2 | **B** | C | B− | 0 | Held-out suite exists. MT-Bench is the selection metric and is still in the story. LRML is 6th on MT-Bench (7.916 vs DBAQL 7.978). AlpacaEval WR vs GPT-4: PADLL 14.07, AQFL 13.63, LRML 13.21, overlapping error bars. Loss formula is a real object. GPT-4 proposed ~100 losses. One pipeline. |
| Self-Developing, GSM8K 100/1220, MATH 600/4400 | 2 | **B−** | C | C+ | 0 | Dev then remainder test. Top 15 of hundreds of executable merges then one test pass. Thousands of LLM programs vs a small Task Arithmetic / TIES grid. Merge always applied to the original seed model; only the factory is updated (RSI 0). Best GSM8K rule is iterative mean-and-product with broadcasting; no isolation of the mean. |
| ShinkaEvolve circle packing, 26 circles | 3-exact | **B−** | C+ | C | 0 | Search objective is the reported score, but the packing is checkable. Three runs; two match or beat AlphaEvolve after ~150 tries. Verifier slack ~1e−8. Recipe is golden-angle init, SLSQP, annealing, rotations. Parent-sampling ablations are on this task. |
| ShinkaEvolve AIME 2024 scaffold search | 3 | **D** | C+ | C | 0 | All 30 AIME 2024 questions, 75 generations, three evals each. |
| ShinkaEvolve that scaffold on AIME 2023/2025 | 1 relative | **B** | C+ | C | 0 | Year held out. Scaffold is three experts, critics, synthesizer, majority fallback (7 calls). Paper flags weaker 2023 gains as possible model-memorization of old AIME. |
| ShinkaEvolve ALE-Bench LITE, 10 tasks | 2 | **B** | C+ | C | 0 | Public score for search, private for the report. Top-5 public → max private only 1923.5 → 1927.0. Changes: kd-tree subtree cache, targeted edge moves, fallback estimators. Ten tasks. Authors note staying close to ALE-Agent inits. |
| ShinkaEvolve MoE load-balancing loss | 2 | **B** | C+ | **B** | 0 | Small model 556M / 82M active, 64 experts, top-8, ~2B tokens, 30 iterations. Larger check 2.7B / 404M, ~30B tokens, still 64/8. Mean 0.362 → 0.368 at λ=0.01; HellaSwag and PIQA drop. No extra pretraining seeds. No hinge/entropy ablation. Formula is new relative to global-batch LBL. Search-method ablations were on packing, not on this loss. |

---

## How to cite (short)

If the question is...

| Question | Cite | Do not cite as |
|---|---|---|
| Can prompts be evolved with a real test split? | GEPA main, Eval B+ | GEPA KernelBench; the 35× rollout line |
| Can a frozen playbook help? | ACE offline, Eval B+ | ACE online as the same kind of number |
| Can workflow shape be tuned inside a human operator list? | MASS or MaAS, Eval B−, object C | "Agents invented new architectures" |
| Can an LLM rewrite an improver that rewrites itself? | STOP, Eval B, object C | Open-ended RSI |
| Is lineage-aware parent pick better than greedy score? | HGM vs DGM on the 60-slice, search method B | The 61.4% on all 500 Verified; the error-resolution snippet |
| Did search write a technical object worth reproducing? | ShinkaEvolve MoE, object B | AIME scaffold; DGM tools; HGM resolver |
| Did search write a preference loss? | DiscoPOP object B− | "State of the art" |
| Did anyone measure better *improvers*? | Nobody | DGM/HGM/Gödel titles |

---

## Still empty

Eval A, evolved-object A, RSI 2. The missing measurement is unchanged: early / middle / late parents, same hidden failures, same mutation budget and models, child-score distributions, at least two full searches.
