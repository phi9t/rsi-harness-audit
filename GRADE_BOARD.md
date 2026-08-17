# Grade board

Scoring rules live in [`RUBRICS.md`](RUBRICS.md). This file is the scored record for this audit.

## Official suite versus this experiment’s slice

The official task set (items, metric, version pin) for each of the 47 mapped suites is the card under [`benchmarks/`](benchmarks/), indexed from [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). What these 16 papers actually ran is in [`BENCHMARKS.md`](BENCHMARKS.md) and the paper file. A headline on a slice is not a score on the official set.

This is wording, not a new Eval ceiling. Letters on the grade board below do not move in this pass.

| Mix-up | Official fact | This cohort |
|---|---|---|
| SWE-bench Verified | 500 human-checked issues ([map](benchmarks/coding.md#swe-bench-verified)) | DGM/HGM bake-off is 60 (35 Django / 25 Sphinx). HGM’s 8,000-eval run is all 500, same-set, already Eval D |
| MATH | Not one of the 47; definition stays in [`BENCHMARKS.md`](BENCHMARKS.md) | AFlow / MaAS / MASS reuse a 617 level-5, four-category slice. MASS 60 val / 100 test. Not full MATH |
| GPQA Diamond | 198 Diamond / 448 main ([map](benchmarks/multimodal-safety-reasoning.md#gpqa-diamond)) | ADAS / Gödel val is 32 items |
| AIME | Map card is **AIME 2026** ([map](benchmarks/multimodal-safety-reasoning.md#aime-2026)). 2023/2024/2025 are different contests | ShinkaEvolve searches AIME 2024, then reports 2023/2025 |
| OSWorld | v1 is 369 Ubuntu tasks ([map](benchmarks/general-agents.md#osworld-v1)); 2.0 is 108 long workflows ([map](benchmarks/tools-web-computer.md#osworld-20)) | These 16 papers did not run OSWorld. The two names are not one suite |
| GAIA vs GAIA2 | 466 short answers ([map](benchmarks/tools-web-computer.md#gaia)) vs 800 event-driven scenarios ([map](benchmarks/general-agents.md#gaia2)) | Pin the name. Do not treat a vendor “GAIA” cell as GAIA2 |

Do not read the last two rows as cohort results. They exist so a pasted vendor table cannot merge the names.

---

## Grade board (code-checked 16 August 2026)

Letters live here. Evidence lives in [`papers/`](papers/). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](benchmarks/).

**Cite the row, not the PDF.** GEPA is B+ only for the main train/validation/test tables. KernelBench in the same paper is D.

Preprints and official repos were fetched on 16 August 2026. **No letter moved.** Facts that did:

- GEPA Table 1 is Qwen 48.85 → 61.28 and GPT-4.1 Mini 66.97, not 45.23 → 54.85. The preprint has four tasks (HotpotQA, IFBench, HoVer, PUPA), not six. AIME / LiveBench / adversarial prepend are not in arXiv 2507.19457 v1, so those rows are dropped.
- ShinkaEvolve AIME-2024 in-sample is 34.4 vs base 24.4 / majority@5 32.2. Packing “three independent searches” is not in the preprint (three inner evals are the AIME candidate protocol).
- Self-Developing’s best GSM8K merge is Figure 11 Algorithm A, not Figure 10.
- DGM’s shipped `self_improve()` loads `big.json` but never runs it; the 200-task pass is paper/`test_swebench.py`, not the outer loop.
- HGM’s SWE diagnoser reuses DGM’s private-test template (`test_patch` + eval log) on the 60-slice. Shared leak; not a letter move.
- PromptBreeder, Self-Developing, and MASS have **no official public code**. Grade those from the preprint only. `Avalee21/promptbreeder` is a third-party reimplementation.

### What changed from the last letter board

The last board still gave most PDFs one Eval and one Discovery. This round splits them. Letters move only when a ceiling or the plus/minus rule forces it.

| Change | Why |
|---|---|
| MASS Eval **B → B−** | Held-out test is real. Two misses: tiny subsets (MATH 60/100) and ± over three *answers*, not three searches. Minus is required. |
| MaAS search method **C → B−** | The supernet router is specified and compared to AFlow, not only to chain-of-thought. The *workflows* stay C (fixed operator list). |
| MASS search method **C → B−** | Same reason: staged prompt-then-topology vs ADAS/AFlow/debate. Objects stay C. |
| ACE search method **(was mixed into C+) → B** | The playbook updater is the authors' method. The playbook *contents* stay C. |
| GEPA KernelBench now its own **Eval D** | Same 35 kernels for search and report. |
| GPTSwarm MMLU split out at **Eval C** | Five training seeds, overlapping val/dev, small gain. MiniCrosswords/HumanEval stay D. GAIA is not a search result. |
| DGM Polyglot full-set extra eval **Eval C**; SWE-bench 20→50 stays **D** | Hidden tests never enter the Polyglot *solver*. They do enter the SWE o1 diagnosis prompt. |
| HGM Lite-207 stays **C+**; 8,000-on-500 is **D**; error-resolution object is **D** | Three different experiments. |
| ShinkaEvolve is four rows | Circle packing B−; AIME-2024 score D with year-transfer B; ALE B; MoE B. |
| STOP evolved object **C+ → C** | Beam search, annealing, UCB are textbook. The *loop* (search method) is B− because they reran it five times. |

No Eval A, no Discovery A, no RSI 2.

### Paper at a glance

"Best" is the cleanest experiment we would let someone cite. "Headline" is the number the abstract leans on.

| Paper | Best Eval | Headline Eval | Search method | Typical object | RSI |
|---|---|---|---|---|---|
| [PromptBreeder](papers/promptbreeder.md) | B− | B− | C | C | 1 |
| [GPTSwarm](papers/gptswarm.md) | C (MMLU) | D (MiniCrosswords) | C | C | 0 |
| [STOP](papers/stop.md) | B | B | B− | C | 1 |
| [DiscoPOP](papers/discopop.md) | B | B | C | B− | 0 |
| [ADAS](papers/adas.md) | B− | B− | C | C | 0 |
| [AFlow](papers/aflow.md) | B− | B− | C | C | 0 |
| [AgentSquare](papers/agentsquare.md) | D | D | C | C− | 0 |
| [Gödel Agent](papers/godel-agent.md) | C− | C− | C | C− | 1 |
| [Self-Developing](papers/self-developing.md) | B− | B− | C | C+ | 0 |
| [MaAS](papers/maas.md) | B− | B− | B− | C | 0 |
| [GEPA](papers/gepa.md) | B+ | B+ | B | C+ | 0 |
| [ACE](papers/ace.md) | B+ offline | mixed | B | C | 0 |
| [MASS](papers/mass.md) | B− | B− | B− | C | 0 |
| [ShinkaEvolve](papers/shinkaevolve.md) | B (MoE, ALE) | mixed | C+ | B MoE / C else | 0 |
| [DGM](papers/dgm.md) | C (Polyglot extra / transfer) | D (SWE 20→50) | C | C− | 1 |
| [HGM](papers/hgm.md) | C+ (Lite-207) | mixed | B | C / D showcased | 1 |

### Experiment grades

Columns: **See** = what the proposer was allowed to see (1 clean test, 2 validation reused, 2r split then rewritten, 3 same tasks, 4 hidden tests in the proposal prompt).

#### Prompt and context

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| PromptBreeder, arithmetic/GSM8K held-out half | 2 | **B−** | C | C | 1 | Train-batch fitness, then leftover test. No search repeats. OPRO 80.2 and some davinci rows are borrowed. `SOLUTION` is a short control string, not a reasoning method. Mutation prompts coevolve, so RSI is 1. No official code. |
| GEPA main, four tasks, Qwen / GPT-4.1 Mini | 2 | **B+** | B | C+ | 0 | Train/val/test exist (HoVer 150/300/300). Validation is \(D_{pareto}\), scored every round. Prompt-optimizer budgets kept near MIPROv2 (≤10.15%). Search not repeated. Prompts are task recipes. Table 1: Qwen 48.85 → 61.28; GPT-4.1 Mini GEPA 66.97. |
| GEPA KernelBench, 35 kernels | 3 | **D** | B | C | 0 | Search and report use the same 35 kernels (`D_train` = `D_pareto`). |
| ACE offline AppWorld / finance | 1 | **B+** | B | C | 0 | Playbook from train, frozen, original test. No search repeats. Figure 3 stores app APIs and identity tactics. The updater (generator / reflector / curator) is the method. |
| ACE online, shuffled test stream | — | **C** | B | C | 0 | Predict, then learn from that test outcome, then continue. Real streaming protocol. Not frozen held-out accuracy. |

#### Workflows

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| GPTSwarm MiniCrosswords | 3 | **D** | C | C | 0 | Same 20 puzzles for search and score. Edges among ToT / Reflexion / CoT. |
| GPTSwarm HumanEval stream | 3 | **D** | C | C | 0 | Prompts updated from the benchmark being reported. 0.76 → 0.88. |
| GPTSwarm MMLU collaborative | 2 | **C** | C | C | 0 | Five training seeds, +2.1±1.1. Search on official dev, report first 153 of shuffled val. Only GPTSwarm experiment with repeated *search*. |
| GPTSwarm GAIA | — | n/a | n/a | n/a | 0 | Hand-built swarm. Not graph search. |
| ADAS Meta Agent Search, main tables | 2 | **B−** | C | C | 0 | Search on validation, report test. One trajectory per domain. ARC is Easy ≤5×5. Generated agents use many more calls than CoT. Transfer of "top 3" uses already seen scores. Seed archive already lists CoT-SC, debate, self-refine. |
| AFlow, 20/80 seed 42 | 2r | **B−** | C | C | 0 | Test is 80%. After the split, a blank run five times keeps only high-variance val items. Operators are human. Ablation: GSM8K still high with operators removed. |
| AgentSquare, six environments | 3? | **D** | C | C− | 0 | No documented frozen final split. Predictor is fed past scores. Final agents recombine named modules. Some prompts keep other environments' names. |
| MaAS supernet, 1:4 split | 2 | **B−** | B− | C | 0 | Train used for both learning the router and picking a path. MATH is 119/486 from 617 level-5. Router vs AFlow is a search-method comparison. Paths still walk CoT, debate, self-consistency, test, ReAct, early exit. |
| MASS staged prompt + topology | 2 | **B−** | B− | C | 0 | Validation then held-out test. Subsets are small (MATH 60/100). ± is three test runs of one topology. No official code. Staging vs ADAS/AFlow/debate is a searcher comparison. |

#### Self-editing agents

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| STOP, 10-bit LPN, 5 full runs | 1 | **B** | B− | C | 1 | 20 train copies, 50 held-out. Five complete loops. Tasks are toys. Children rediscover beam search, annealing, UCB. Reward hacks (unsandbox, >1000% from a NumPy shape bug) are the other scientific result. |
| STOP, transfer of one LPN-grown improver to five toys | 1 relative | **B−** | B− | C | 1 | One improver after T=4, not the five-run protocol. Same textbook children. |
| Gödel Agent, val then test, 4o writes / 3.5 runs | 2 | **C−** | C | C− | 1 | GPQA val is 32 items. Main table mixes a stronger writer with a weaker solver. Policies are majority vote, roles, few-shot. Grade from preprint + `results/` artifacts; HEAD `src/` has drifted. |
| Gödel Agent unrestricted "free" | — | n/a | C | — | — | Learns to call GPT-4o. Drop from same-model harness tables. |
| Gödel Game of 24 exact solver | 2 | C | C | C | 1 | Recursion over ops until `abs(nums[0]-24)<1e-6`. Modality switch to brute force, not a new algorithm. |
| DGM SWE-bench, 20% → 50% on staged subsets | 4 | **D** | C | C− | 1 | o1 diagnosis prompt includes official private test patch and private-test log (`get_diagnose_prompt_swe`). Staging 10 → 50 extra → 60 unique (35 Django, 25 Sphinx). Start is bash + whole-file edit. |
| DGM Polyglot, extra eval on the full set | 2r | **C** | C | C | 1 | Solver never sees hidden tests (pass@1). Search used a 10/50 slice; 14.2% → 30.7% is a later pass of the winner. One archive run. Diagnoser can still see `reference_tests` on the search slice. |
| DGM SWE-evolved agent on Polyglot | 4→holdout | **C** | C | C− | 1 | 14.2% → 28.9% on a benchmark the SWE loop never scored. Real transfer of an object grown with SWE private tests in the diagnoser. Does not clean the 20→50 number. |
| HGM vs DGM/SICA on Verified-60 / Polyglot | 2r | **C+** | B | C | 1 | Same 60-task slice as DGM. CMP + Thompson sampling vs greedy parent pick. After-the-fact "best descendant" on the finished tree is not the online pooled pass rate. Diagnoser still gets DGM's private-test template. |
| HGM 8,000 evals on all 500 Verified | 3 | **D** | B | C | 1 | 53.2% → 61.4% on the same 500. Authors note leaderboard scores can overfit. |
| HGM best Verified agent on Lite-207 | 1 relative | **C+** | B | C | 1 | 93 of 300 Lite overlap Verified; they report the 207. GPT-5-mini 34.8% → 40.1% vs SWE-agent 39.6. One run. 0.5 point over a human harness. |
| HGM same agent, Lite with GPT-5 | mixed | **C** | B | C | 1 | Harness and backbone both change vs the GPT-5-mini search. |
| HGM `attempt_error_resolution` | — | — | — | **D** | 1 | Logs "Would attempt to install…", skips the install, returns True (appendix). Not in shipped `best_agent/`. |

#### Objectives and algorithms

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| DiscoPOP, MT-Bench select, AlpacaEval/TL;DR/IMDb report | 2 | **B** | C | B− | 0 | Held-out suite exists. Use Eq. 5 / Table 1, not Eq. 4. LRML is 6th on MT-Bench (7.916 vs DBAQL 7.978). AlpacaEval WR vs GPT-4: PADLL 14.07, AQFL 13.63, LRML 13.21. Loss formula is a real object. GPT-4 proposed ~100 losses. One pipeline. |
| Self-Developing, GSM8K 100/1220, MATH 600/4400 | 2 | **B−** | C | C+ | 0 | Dev then remainder test. Top 15 by dev, one test pass. Thousands of LLM programs vs a small Task Arithmetic / TIES grid. Merge always applied to the original seed model (RSI 0). Best GSM8K rule is Figure 11 Algorithm A (identity plus reduced mean with `keepdim=True`). No official code. |
| ShinkaEvolve circle packing, 26 circles | 3-exact | **B−** | C+ | C | 0 | Search objective is the reported score, but the packing is checkable. Verifier slack ~1e−8. Recipe is golden-angle init, SLSQP, annealing, rotations. Parent-sampling ablations are on this task, not three published replicate searches. |
| ShinkaEvolve AIME 2024 scaffold search | 3 | **D** | C+ | C | 0 | All 30 AIME 2024 questions. In-sample 34.4 vs base 24.4 / majority@5 32.2. |
| ShinkaEvolve that scaffold on AIME 2023/2025 | 1 relative | **B** | C+ | C | 0 | Year held out. Scaffold is three experts, critics, synthesizer, majority fallback (7 calls). Paper flags weaker 2023 gains as possible model-memorization of old AIME. |
| ShinkaEvolve ALE-Bench LITE, 10 tasks | 2 | **B** | C+ | C | 0 | Public score for search, private for the report. Top-5 public → max private only 1923.5 → 1927.0. Ten tasks. Authors note staying close to ALE-Agent inits. |
| ShinkaEvolve MoE load-balancing loss | 2 | **B** | C+ | **B** | 0 | 556M → 2.7B, still 64 experts / top-8. Mean 0.362 → 0.368 at λ=0.01; HellaSwag and PIQA drop. No extra pretraining seeds. No hinge/entropy ablation. Search-method ablations were on packing, not on this loss. |

### How to cite (short)

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

## Cohort calibration

Letters are comparable only if the same ceiling and the same misses produce the same letter. Paper files apply this yardstick.

### Eval ladder

| Band | Meaning in this cohort | Who sits here | Why they are together |
|---|---|---|---|
| **A** | Frozen test, search rerun, error bars over *search*, compute match, fair candidate space | Empty | No paper reruns the full search enough *and* keeps a clean test *and* matches compute. |
| **B+** | Real held-out test, honest protocol name, one extra hygiene item from A (matched budgets or a true train-then-freeze split). Search still usually run once. Validation may be reused (that blocks A). | GEPA main; ACE offline | GEPA documents train/val/test (HoVer 150/300/300) and keeps prompt-optimizer rollout budgets within about 10%. ACE never queries test during playbook construction. Both omit independent full searches. |
| **B** | Held-out evaluation exists. Two modest misses, or a clean protocol on a narrow domain. | STOP LPN; DiscoPOP held-out suite; ShinkaEvolve MoE scale-up, ALE private score, AIME year transfer | STOP has the *best* search-repeat hygiene (five full loops) and the *narrowest* tasks. DiscoPOP has a real held-out suite and a branding problem. ShinkaEvolve’s best eval rows have a public/private or year split and no extra pretraining seeds. |
| **B−** | Held-out test exists, but two checklist misses, or the search set was rewritten after the split. | PromptBreeder; ADAS; AFlow; MaAS; MASS; Self-Developing; ShinkaEvolve circle packing | AFlow is the prototype of “split then rewrite” (high-variance val filter). MASS is the prototype of “± that is not search.” PromptBreeder borrows OPRO/davinci rows. ADAS pays for easy ARC slices and extra model calls. These are the same letter for different reasons, not the same sin. |
| **C / C+ / C−** | Transfer or a split exists, but the protocol is streaming-on-test, overlapping val/dev, mixed models, or a contaminated searcher tested elsewhere. | ACE online; GPTSwarm MMLU; Gödel main (C−); DGM Polyglot extra/transfer (C); HGM Lite-207 and vs-DGM-60 (C+) | C+ means the authors did the honest extra cut (HGM drops 93 overlapping Lite tasks). C− means the main table is confounded (Gödel 4o writer / 3.5 solver). |
| **D** | Same tasks for search and headline, or hidden evaluator internals in the proposal prompt, or no documented final split. | GPTSwarm MiniCrosswords and HumanEval; AgentSquare; DGM SWE 20→50; HGM 8,000-on-500; GEPA KernelBench; ShinkaEvolve AIME 2024 search | D is not “the method is false.” It is “this number cannot support a generalization claim.” DGM’s D is worse than GPTSwarm’s D: private tests enter the *next-edit* prompt, not only the score. |

**Close calls, resolved.**

- **ACE offline vs GEPA main, both B+.** ACE has the cleaner firewall (train, freeze, original test). GEPA reuses validation every round. GEPA has the cleaner *comparison* (MIPROv2 and GRPO rerun under a shared rollout cap). ACE is missing search repeats; GEPA is too. They are tied on Eval, not because the protocols are identical, but because each has one A-axis and one blocking miss. Do not average ACE online into ACE’s B+.
- **STOP B vs GEPA B+.** STOP repeated the whole loop five times, which GEPA did not. STOP’s claim is about 10-bit parity-with-noise and a handful of toy search problems. For a number about *those* tasks, STOP is the stronger protocol. It is not B+ because the result does not travel to a natural benchmark without a new experiment. GEPA’s B+ is about HotpotQA / IFBench / HoVer / PUPA with a held-out test.
- **DiscoPOP B vs MASS B−.** Both reuse a selection split. DiscoPOP’s held-out suite (AlpacaEval, TL;DR, IMDb) is a different *benchmark family*. MASS’s test is a small random slice of the same family (MATH 60 val / 100 test). DiscoPOP’s minus is branding, which hits the evolved-object score harder than Eval. MASS’s minus is subset size plus ± over three executions of one topology. That is Eval.
- **AFlow B− vs ADAS B−.** AFlow has a cleaner test split (80%, seed 42) and a worse search-set rewrite (high-variance filter). ADAS has a held-out test and pays for Easy ARC, one trajectory, and extra calls. Same letter, different binding miss.
- **DGM SWE D vs HGM 8,000-on-500 D vs AgentSquare D.** All D, not interchangeable. DGM is level 4 (private patch in the diagnosis prompt). HGM’s scaled run is level 3 (same 500 tasks). AgentSquare is “no documented frozen split” plus a score-fed predictor. If you need the worst Eval claim in the cohort, it is DGM SWE 20→50, because the hidden tests shaped the *mutations*, not only the reported score.
- **HGM Lite-207 C+ vs DGM Polyglot transfer C.** Both are “trained here, scored on another set.” HGM searched Verified and then dropped overlapping Lite tasks. DGM’s Polyglot transfer is a real other benchmark, but the object was grown with SWE private tests in o1. HGM C+ is the more careful *reporting* of overlap. DGM C does not raise the SWE D.

### Search-method ladder

| Band | Meaning | Who | Calibration note |
|---|---|---|---|
| **A** | Searcher beats other searchers on held-out families, with repeated full trees | Empty | HGM vs DGM/SICA is the closest, and it is one setting with a shared 60-slice. |
| **B** | Specified loop, compared to other *searchers* under a similar budget | GEPA (reflection + Pareto vs MIPROv2/GRPO); ACE (playbook updater vs GEPA/ReAct as adapters); HGM (CMP + Thompson sampling vs DGM/SICA) | GEPA’s searcher comparison is the cleanest on rollout matching. HGM’s is the most on-topic for RSI. ACE’s is “context updater vs prompt optimizer,” which is a fair adjacent control. |
| **B− / C+** | Specified loop, some searcher control, missing repeats or mixed into packing-only ablations | STOP (five runs, toy); MaAS (supernet vs AFlow); MASS (staging vs ADAS/AFlow); ShinkaEvolve (parent sampling / novelty / bandit, ablated on circle packing) | MaAS/MASS move up from C because the control is another workflow searcher, not chain-of-thought. ShinkaEvolve C+ not B because those ablations are not repeated on MoE or ALE. |
| **C** | Standard evolution / MCTS / REINFORCE / “ask GPT-4 for 100 programs,” mainly vs prompting | PromptBreeder, GPTSwarm, ADAS, AFlow, AgentSquare, Gödel, DGM, DiscoPOP, Self-Developing | DGM’s archive-and-parent-pick is a real loop. It stays C because the mutation *plan* is written by frozen o1 with private tests in context. DiscoPOP’s searcher is “GPT-4 proposes losses,” about 100 tries, one pipeline. |

**Close call: HGM searcher B vs GEPA searcher B.** GEPA’s control is other prompt optimizers and RL on the same programs. HGM’s control is other self-editing trees on the same 60 SWE tasks. HGM’s after-the-fact “empirical CMP” (best descendant score, drop the parent) is not the online pooled pass rate. That blocks B+. GEPA does not have that mismatch. They tie at B for different virtues.

### Evolved-object ladder

| Band | Meaning | Who | Calibration note |
|---|---|---|---|
| **A** | New, working, isolated, repeated, transferred across families | Empty | ShinkaEvolve MoE would need extra pretraining seeds, hinge/entropy ablations, and a change in expert count or top-k. |
| **B** | A real new formula or mechanism, some transfer, missing seeds or ablations | ShinkaEvolve MoE loss | Entropy-scaled hinge under a usage floor, on top of global-batch load balancing. Scale-up 556M → 2.7B. Mean 0.362 → 0.368. HellaSwag and PIQA fall. Routing shape frozen (64 experts, top-8). |
| **B−** | Real object, own tables do not establish superiority | DiscoPOP LRML | Closed-form mix of DPO and exponential preference losses. Not the MT-Bench winner. Not the AlpacaEval win-rate winner. Error bars overlap. |
| **C+** | Unusual remix, under-ablated, or a prompt that is concrete | Self-Developing mean-and-product merge; GEPA main prompts | Self-Developing is more “new-looking math on weights” than another debate graph. GEPA prompts are better task engineering than ADAS ensembles, not a new primitive. They share C+ for different reasons. |
| **C** | Known parts: debate, self-consistency, tests, beam search, annealing, range-read, retries | Almost everyone else | Operator-library ceiling. Weak-start reconstruction (DGM tools) stays here even if Q doubles. |
| **C−** | Recombination table, template leakage, or brute-force sold as discovery | AgentSquare; Gödel ensembles / Game of 24 as “algorithm”; DGM tools from a crippled start | Game of 24 as a *modality switch* can be C. As a new algorithm it would be D. We score C− on the paper’s discovery rhetoric. |
| **D** | Does not run, or success-return on a skip | HGM `attempt_error_resolution` | Appendix: “Would attempt to install… skip actual installation… return True.” |

**Close call: DiscoPOP B− vs ShinkaEvolve MoE B.** Both are closed-form objectives found by LLM search. DiscoPOP has the better *held-out family* (chat/summarization vs the fitness bench). ShinkaEvolve has the better *scale transfer* (parameter count and tokens). DiscoPOP’s own ranking undercuts the headline; ShinkaEvolve’s mean lift is small and mixed but not contradicted by a stronger discovered sibling in the same table. That is why MoE is B and LRML is B−, not the reverse.

**Close call: GEPA prompts C+ vs ACE playbooks C.** GEPA’s HotpotQA hop-2 rules are portable procedures (do not paraphrase the first query; target the missing entity). ACE Figure 3 stores AppWorld identity/API tactics (phone-contacts, auth username fallback). Both are useful. ACE’s contents look like a compiled cheatsheet. That is the difference between C+ and C on the *object*, while ACE’s *updater* is still search-method B.

### RSI ladder

| Level | Who | Why they do not move |
|---|---|---|
| **0** | GEPA, ACE, ADAS, AFlow, AgentSquare, GPTSwarm, MaAS, MASS, DiscoPOP, ShinkaEvolve, Self-Developing | The outer searcher is frozen. Self-Developing updates a code factory and always merges onto the original seed model. That is not the model improving itself. |
| **1** | PromptBreeder, STOP, Gödel Agent, DGM, HGM | Something self-referential exists (mutation prompts, or the agent edits its own code). The reported number is still task success. HGM’s CMP is a search heuristic over task success, not a child-quality experiment. |
| **2–3** | Empty | Nobody ran early/mid/late parents on hidden failures with a matched mutation budget. |

STOP is the only paper that *says* it is not fully RSI because the weights stay frozen. That honesty does not raise the level. It is why STOP is the calibration prototype for level 1: self-reference, toy protocol, measured Q, textbook children, visible reward hacks.

### What a “strong paper” means here

If the question is practical harness work with a number you can defend: **GEPA main** and **ACE offline**.  
If the question is a search idea aimed at RSI: **HGM’s parent-pick rule** and **STOP’s loop**, not DGM’s SWE headline.  
If the question is a machine-written technical object: **ShinkaEvolve MoE**, then **DiscoPOP** with the ranking caveat.  
If the question is “did the field show recursive self-improvement?”: **no**.

---

## What would move a letter

These are the cheapest experiments that would change the calibration, not a wish list.

| If someone did this | Letter that moves |
|---|---|
| Ten GEPA (or ACE) full searches, report median test | Those Eval B+ rows can contend for A if test stays untouched |
| DGM/HGM with no private-test return path, strong starting harness, leftover repos | DGM SWE could leave D; HGM object could leave C |
| Early/mid/late child-quality test, hidden traces, matched budget, two seeds | First RSI 2 in the cohort |
| ShinkaEvolve MoE, three pretraining seeds, hinge/entropy ablations, different N_E or k | Object B → B+ or A contention |
| DiscoPOP, three full discovery pipelines, report the fitness winner *and* LRML | Eval B → B+; object B− → B if LRML still holds up |
| AFlow without the high-variance filter, several split seeds | Eval B− → B |
| AgentSquare publishes frozen partitions and search seeds | Could leave D |
| Compute-matched Pareto for ADAS/Gödel/MASS (same calls as the evolved system) | Object C stays unless the gain survives; Eval minus may lift |

Until those exist: automated search can improve prompts, workflows, and wrappers. It can sometimes emit an interesting technical object (MoE loss; weaker preference loss and merge heuristic). It has not been shown to recursively become better at improving itself.
