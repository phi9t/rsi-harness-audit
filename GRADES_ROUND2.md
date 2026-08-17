# Grade board (working, round of 17 August 2026)

Scoring rules live in [`RUBRICS.md`](RUBRICS.md). Official letters still live in [`GRADE_BOARD.md`](GRADE_BOARD.md) until this file is merged. Paper evidence lives in [`papers/`](papers/).

This is the working scored record for the report-driven regrade. Do not cite these rows as official until merge.

## Paper at a glance

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
| [GEPA](papers/gepa.md) | B− | B− | B | C+ | 0 |
| [ACE](papers/ace.md) | B− offline | mixed | B | C | 0 |
| [MASS](papers/mass.md) | B− | B− | B− | C | 0 |
| [ShinkaEvolve](papers/shinkaevolve.md) | B (MoE, ALE) | mixed | C+ | B MoE / C else | 0 |
| [DGM](papers/dgm.md) | C (Polyglot extra / transfer) | D (SWE 20→50) | C | C− | 1 |
| [HGM](papers/hgm.md) | C+ (Lite-207) | mixed | B | C / D showcased | 1 |

## Change log

| Experiment | Axis | Old | New | Recipe step |
|---|---|---|---|---|
| GEPA main, four tasks | Eval | B+ | B− | Test monitoring: “optimal test” envelopes and test-vs-budget figures. Two hygiene misses (no search repeats + test monitoring). Matched MIPROv2 rollouts cannot supply plus once minus is required. |
| ACE offline AppWorld / finance | Eval | B+ | B− | Test monitoring: Appendix A.6 reports reflection-iteration, dedup, and length sweeps on AppWorld test-normal and FiNER test, then treats 3–5 rounds / 50–90% / 10K–100K as reasonable defaults. Two hygiene misses (no construction repeats + test monitoring). Train-then-freeze is not an A-axis item once defaults were read off test. |

No other letter moved. Binding reasons below add test monitoring, gain split, granularity, and object taxonomy where they apply without changing the letter.

## Held

| Experiment | Axis | Letter | Recipe step that kept it |
|---|---|---|---|
| PromptBreeder, arithmetic/GSM8K held-out half | Eval / Search / Object / RSI | B− / C / C / 1 | See 2. Two misses already (no search repeats; borrowed OPRO/davinci rows). Taxonomy 1 strings stay C. |
| GEPA KernelBench, 35 kernels | Eval / Search / Object / RSI | D / B / C / 0 | See 3. Same 35 kernels in \(D_{train}\) and \(D_{pareto}\). |
| GEPA main | Search / Object / RSI | B / C+ / 0 | Searcher vs MIPROv2/GRPO. Prompts are portable task recipes (taxonomy 4, not isolated) → C+. |
| ACE offline | Search / Object / RSI | B / C / 0 | Updater vs GEPA/ReAct. Playbook stores app APIs → C. |
| ACE online | Eval / Search / Object / RSI | C / B / C / 0 | Prequential-on-test cap. |
| GPTSwarm MiniCrosswords / HumanEval | Eval | D | See 3. Same 20 puzzles; HumanEval stream updates from the reported set. |
| GPTSwarm MMLU | Eval | C | Five training seeds on overlapping val/dev, not official test. +2.1±1.1 on 153 items is about two questions. |
| GPTSwarm GAIA | n/a | n/a | Hand-built swarm. |
| ADAS main tables | Eval | B− | See 2. Already two-plus misses. Evaluating every archive child on test is test monitoring, not See 3. Extra calls fail gain-split. Object taxonomy 2 → C. |
| AFlow 20/80 | Eval | B− | See 2-rewrite already caps B−. Test curves during search add monitoring; they do not raise the cap to D. |
| AgentSquare | Eval | D | No documented frozen final split. |
| MaAS 1:4 | Eval | B− | Held-out test exists. No val split, no search repeats, MATH 119/486, ablations on the reported test. Still B−, not C−: a 4/5 test split is real. HumanEval 131 items, one problem ≈ 0.76 points. |
| MASS staged | Eval | B− | Distinct val/test. Tiny subsets (MATH 60/100: one test item = 1 point) and ± over three executions of one topology. |
| STOP LPN five runs | Eval | B | See 1, five complete loops. Toys keep it off B+. Object taxonomy 3 (beam, annealing, UCB) → C. |
| STOP transfer | Eval | B− | One selected improver, not the five-run distribution. |
| Gödel main | Eval | C− | GPT-4o writer / GPT-3.5 solver. Do not adopt report §2.0 B−. |
| Gödel free | n/a | n/a | Stronger-model substitution. Drop from same-model tables. |
| Gödel Game of 24 | Object | C | Brute-force enumeration until `abs(nums[0]-24)<1e-6`. Taxonomy 3. |
| DGM SWE 20→50 | Eval | D | See 4: o1 diagnosis includes official private test patch and log. |
| DGM Polyglot extra / SWE→Polyglot | Eval | C | Extra eval / transfer of a See-4 object. Does not clean SWE D. |
| HGM vs DGM/SICA 60 | Eval | C+ | Same 60-slice. 56.7 vs 53.3 is two of 60 tasks (1.67 points each). Search B held (CMP vs greedy). Diagnoser still gets DGM’s private-test template. |
| HGM 8,000 on 500 | Eval | D | See 3. |
| HGM Lite-207 | Eval | C+ | Honest overlap cut. 40.1 vs SWE-agent 39.6 is about one of 207 tasks (0.48 points). Unpaired 0.5 cannot carry superiority. |
| HGM Lite GPT-5 | Eval | C | Harness and backbone both change. |
| HGM `attempt_error_resolution` | Object | D | Logs “Would attempt to install…”, skips, `return True`. |
| DiscoPOP held-out suite | Eval / Object | B / B− | Family transfer exists. LRML is 6th on MT-Bench (7.916 vs DBAQL 7.978). Winner’s curse / branded favorite stay on the object, not a new Eval minus. |
| Self-Developing | Eval / Object | B− / C+ | Dev then remainder. Thousands of programs vs a small merge grid (search-space mismatch). Figure 11 Algorithm A under-ablated (taxonomy 4) → C+. RSI 0: always merge onto the original seed. |
| ShinkaEvolve packing | Eval | B− | Checkable-math exception to See 3 (cap C), then two misses (one search; slack ~1e−8). Taxonomy 3 composition → C. |
| ShinkaEvolve AIME 2024 | Eval | D | See 3. All 30 questions; one item = 3.33 points. |
| ShinkaEvolve AIME 2023/2025 | Eval | B | Year held out. Seven-call ensemble (taxonomy 2) stays object C. |
| ShinkaEvolve ALE | Eval | B | Public search, private report. Ten tasks, one trajectory each. |
| ShinkaEvolve MoE | Eval / Object | B / B | 556M → 2.7B. Mean 0.362 → 0.368. Paper \(\tau=0.064/N_E\) vs code \(0.64/N_E\) (tenfold) stays in the binding reason; it does not make the object a no-op. No extra pretraining seeds. |

## Experiment grades

Columns: **See** = what the proposer was allowed to see (1 clean test, 2 validation reused, 2r split then rewritten, 3 same tasks, 4 hidden tests in the proposal prompt).

#### Prompt and context

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| PromptBreeder, arithmetic/GSM8K held-out half | 2 | **B−** | C | C | 1 | See 2, leftover test. No search repeats; borrowed OPRO/davinci rows. `SOLUTION` is a control string (taxonomy 1). RSI 1: mutation prompts coevolve. No official code. |
| GEPA main, four tasks, Qwen / GPT-4.1 Mini | 2 | **B−** | B | C+ | 0 | See 2: val is \(D_{pareto}\) every round; Table 1 winner is val. Test-vs-budget / “optimal test” envelopes fail test monitoring, so plus from matched MIPROv2 rollouts does not apply. Two misses → B−. Prompts are task recipes (taxonomy 4). Table 1: Qwen 48.85 → 61.28; GPT-4.1 Mini GEPA 66.97. |
| GEPA KernelBench, 35 kernels | 3 | **D** | B | C | 0 | Search and report use the same 35 kernels (`D_train` = `D_pareto`). |
| ACE offline AppWorld / finance | 1 | **B−** | B | C | 0 | Playbook from train, freeze, original test (See 1). Appendix A.6 sweeps reflection rounds on AppWorld test-normal and length/dedup on FiNER test. Test monitoring + no construction repeats → B−. Figure 3 stores app APIs (object C). |
| ACE online, shuffled test stream | — | **C** | B | C | 0 | Predict, then learn from that test outcome. Real streaming protocol. Not frozen held-out accuracy. |

#### Workflows

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| GPTSwarm MiniCrosswords | 3 | **D** | C | C | 0 | Same 20 puzzles for search and score. Edges among ToT / Reflexion / CoT (taxonomy 2). Three final runs are execution noise, not search variance. |
| GPTSwarm HumanEval stream | 3 | **D** | C | C | 0 | Prompts updated from the benchmark being reported. 0.76 → 0.88. |
| GPTSwarm MMLU collaborative | 2 | **C** | C | C | 0 | Five training seeds, +2.1±1.1. Search on official dev, report first 153 of shuffled val. One item ≈ 0.65 points; the gain is a handful of questions. Only GPTSwarm experiment with repeated *search*. |
| GPTSwarm GAIA | — | n/a | n/a | n/a | 0 | Hand-built swarm. Not graph search. |
| ADAS Meta Agent Search, main tables | 2 | **B−** | C | C | 0 | Search on validation, report test. After search, `evaluate()` walks the archive on test (test monitoring; not See 3). One trajectory per domain. ARC Easy ≤5×5, 20/60. Generated agents use tens of calls vs CoT (gain split). Seed archive already lists CoT-SC, debate, self-refine (taxonomy 2). |
| AFlow, 20/80 seed 42 | 2r | **B−** | C | C | 0 | Test is 80%. Blank run five times keeps high-variance val items. Operators are human. Paper plots test across MCTS rounds (monitoring; still not D). Ablation: GSM8K still high with named operators removed. |
| AgentSquare, six environments | 3? | **D** | C | C− | 0 | No documented frozen final split. Predictor is fed past scores. Final agents recombine named modules. Some prompts keep other environments’ names. |
| MaAS supernet, 1:4 split | 2 | **B−** | B− | C | 0 | Train used for router learning and path pick. MATH 119/486 from 617 level-5. Ablations appear on the same test (monitoring). HumanEval 131 test, one problem ≈ 0.76 points. Router vs AFlow is a searcher comparison. Paths still walk CoT, debate, self-consistency, test, ReAct, early exit. |
| MASS staged prompt + topology | 2 | **B−** | B− | C | 0 | Validation then held-out test. MATH 60/100: one test item = 1 point. ± is three test runs of one topology. Staging vs ADAS/AFlow/debate is a searcher comparison. Fixed block vocabulary. No official code. |

#### Self-editing agents

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| STOP, 10-bit LPN, 5 full runs | 1 | **B** | B− | C | 1 | 20 train copies, 50 held-out. Five complete loops (search-± exists). Tasks are toys, so not B+. Children rediscover beam search, annealing, UCB (taxonomy 3). Reward hacks (unsandbox, >1000% from a NumPy shape bug) are the other scientific result. |
| STOP, transfer of one LPN-grown improver to five toys | 1 relative | **B−** | B− | C | 1 | One improver after T=4, not the five-run protocol. Same textbook children. |
| Gödel Agent, val then test, 4o writes / 3.5 runs | 2 | **C−** | C | C− | 1 | GPQA val is 32 items. Main table mixes a stronger writer with a weaker solver (gain split: model substitution). Policies are majority vote, roles, few-shot (taxonomy 2). Grade from preprint + `results/` artifacts; HEAD `src/` has drifted. |
| Gödel Agent unrestricted "free" | — | n/a | C | — | — | Learns to call GPT-4o. Drop from same-model harness tables. |
| Gödel Game of 24 exact solver | 2 | C | C | C | 1 | Recursion over ops until `abs(nums[0]-24)<1e-6`. Taxonomy 3, not a new algorithm. |
| DGM SWE-bench, 20% → 50% on staged subsets | 4 | **D** | C | C− | 1 | o1 diagnosis prompt includes official private test patch and private-test log (`get_diagnose_prompt_swe`). Staging 10 → 50 extra → 60 unique (35 Django, 25 Sphinx). Start is bash + whole-file edit (weak root; taxonomy 2 tools). |
| DGM Polyglot, extra eval on the full set | 2r | **C** | C | C | 1 | Solver never sees hidden tests (pass@1). Search used a 10/50 slice; 14.2% → 30.7% is a later pass of the winner. One archive run. Diagnoser can still see `reference_tests` on the search slice. |
| DGM SWE-evolved agent on Polyglot | 4→holdout | **C** | C | C− | 1 | 14.2% → 28.9% on a benchmark the SWE loop never scored. Real transfer of an object grown with SWE private tests in the diagnoser. Does not clean the 20→50 number. |
| HGM vs DGM/SICA on Verified-60 / Polyglot | 2r | **C+** | B | C | 1 | Same 60-task slice as DGM. 56.7% vs 53.3% is two of 60 tasks. CMP + Thompson sampling vs greedy parent pick. After-the-fact “best descendant” on the finished tree is not the online pooled pass rate. Diagnoser still gets DGM's private-test template. |
| HGM 8,000 evals on all 500 Verified | 3 | **D** | B | C | 1 | 53.2% → 61.4% on the same 500. Authors note leaderboard scores can overfit. |
| HGM best Verified agent on Lite-207 | 1 relative | **C+** | B | C | 1 | 93 of 300 Lite overlap Verified; they report the 207. GPT-5-mini 34.8% → 40.1% vs SWE-agent 39.6. One run. 0.5 point is about one of 207 tasks. |
| HGM same agent, Lite with GPT-5 | mixed | **C** | B | C | 1 | Harness and backbone both change vs the GPT-5-mini search. |
| HGM `attempt_error_resolution` | — | — | — | **D** | 1 | Logs "Would attempt to install…", skips the install, returns True (appendix). Not in shipped `best_agent/`. |

#### Objectives and algorithms

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| DiscoPOP, MT-Bench select, AlpacaEval/TL;DR/IMDb report | 2 | **B** | C | B− | 0 | Held-out suite exists. Use Eq. 5 / Table 1, not Eq. 4. LRML is 6th on MT-Bench (7.916 vs DBAQL 7.978). AlpacaEval WR vs GPT-4: PADLL 14.07, AQFL 13.63, LRML 13.21. One ~100-loss pipeline (winner’s curse on the branded pick). Loss formula is a real object (taxonomy 5, own tables do not establish superiority). |
| Self-Developing, GSM8K 100/1220, MATH 600/4400 | 2 | **B−** | C | C+ | 0 | Dev then remainder test. Top 15 by dev, one test pass. Thousands of LLM programs vs a small Task Arithmetic / TIES grid. Merge always applied to the original seed model (RSI 0). Best GSM8K rule is Figure 11 Algorithm A (taxonomy 4, under-ablated). No official code. |
| ShinkaEvolve circle packing, 26 circles | 3-exact | **B−** | C+ | C | 0 | Search objective is the reported score, but the packing is checkable. Verifier slack ~1e−8. Recipe is golden-angle init, SLSQP, annealing, rotations (taxonomy 3). Parent-sampling ablations are on this task, not three published replicate searches. |
| ShinkaEvolve AIME 2024 scaffold search | 3 | **D** | C+ | C | 0 | All 30 AIME 2024 questions. In-sample 34.4 vs base 24.4 / majority@5 32.2. One item = 3.33 points. Seven-call ensemble (taxonomy 2). |
| ShinkaEvolve that scaffold on AIME 2023/2025 | 1 relative | **B** | C+ | C | 0 | Year held out. Scaffold is three experts, critics, synthesizer, majority fallback (7 calls). Paper flags weaker 2023 gains as possible model-memorization of old AIME. |
| ShinkaEvolve ALE-Bench LITE, 10 tasks | 2 | **B** | C+ | C | 0 | Public score for search, private for the report. Top-5 public → max private only 1923.5 → 1927.0 (private peek is not the primary estimate). Ten tasks. Authors note staying close to ALE-Agent inits (taxonomy 4). |
| ShinkaEvolve MoE load-balancing loss | 2 | **B** | C+ | **B** | 0 | 556M → 2.7B, still 64 experts / top-8. Mean 0.362 → 0.368 at λ=0.01; HellaSwag and PIQA drop. Paper \(\tau=0.064/N_E\) vs published code \(0.64/N_E\). No extra pretraining seeds. No hinge/entropy ablation. Search-method ablations were on packing, not on this loss. |

### How to cite (short)

| Question | Cite | Do not cite as |
|---|---|---|
| Can prompts be evolved with a real test split? | GEPA main, Eval B− | GEPA KernelBench; the 35× rollout line; an untouched confirmatory test |
| Can a frozen playbook help? | ACE offline, Eval B− | ACE online as the same kind of number; defaults chosen without looking at test |
| Can workflow shape be tuned inside a human operator list? | MASS or MaAS, Eval B−, object C | "Agents invented new architectures" |
| Can an LLM rewrite an improver that rewrites itself? | STOP, Eval B, object C | Open-ended RSI |
| Is lineage-aware parent pick better than greedy score? | HGM vs DGM on the 60-slice, search method B | The 61.4% on all 500 Verified; the error-resolution snippet; a two-task gap as a stable win |
| Did search write a technical object worth reproducing? | ShinkaEvolve MoE, object B | AIME scaffold; DGM tools; HGM resolver; an exact \(\tau\) without checking the code |
| Did search write a preference loss? | DiscoPOP object B− | "State of the art" |
| Did anyone measure better *improvers*? | Nobody | DGM/HGM/Gödel titles |

## Cohort calibration

Letters are comparable only if the same ceiling and the same misses produce the same letter.

### Eval ladder

| Band | Meaning in this cohort | Who sits here | Why they are together |
|---|---|---|---|
| **A** | Frozen test, search rerun, error bars over *search*, compute match, fair candidate space, no test monitoring | Empty | Nobody. |
| **B+** | Real held-out test, honest protocol, one A-axis item, no test-oracle plus | Empty this round | GEPA main and ACE offline left this band because test monitoring is a second hygiene miss. |
| **B** | Held-out evaluation exists. Two modest misses, or a clean protocol on a narrow domain. | STOP LPN; DiscoPOP held-out suite; ShinkaEvolve MoE scale-up, ALE private score, AIME year transfer | STOP has the best search-repeat hygiene and the narrowest tasks. DiscoPOP has family transfer and a branding problem on the object. ShinkaEvolve’s best eval rows have a public/private or year split and no extra pretraining seeds. |
| **B−** | Held-out test exists, but two checklist misses, See 2-rewrite, or test monitoring plus one other miss | PromptBreeder; GEPA main; ACE offline; ADAS; AFlow; MaAS; MASS; Self-Developing; ShinkaEvolve circle packing | GEPA and ACE join this band for test monitoring, not because their splits disappeared. AFlow remains the prototype of split-then-rewrite. MASS remains the prototype of ± that is not search. ADAS adds every-child-on-test on top of extra calls and Easy ARC. |
| **C / C+ / C−** | Transfer or a split exists, but streaming-on-test, overlapping val/dev, mixed models, or a contaminated searcher tested elsewhere | ACE online; GPTSwarm MMLU; Gödel main (C−); DGM Polyglot extra/transfer (C); HGM Lite-207 and vs-DGM-60 (C+) | C+ is the honest extra cut (HGM drops 93 overlapping Lite tasks). C− is a confounded main table (Gödel 4o writer / 3.5 solver). |
| **D** | Same tasks for search and headline, hidden evaluator internals in the proposal prompt, or no documented final split | GPTSwarm MiniCrosswords and HumanEval; AgentSquare; DGM SWE 20→50; HGM 8,000-on-500; GEPA KernelBench; ShinkaEvolve AIME 2024 search | DGM’s D is worse than GPTSwarm’s D: private tests enter the next-edit prompt. |

**Close calls, resolved.**

- **GEPA main vs ACE offline, both B−.** ACE still has the cleaner algorithmic firewall (train, freeze, original test). GEPA still has the cleaner searcher comparison (MIPROv2/GRPO under a shared rollout cap). Both fail test monitoring. They are tied on Eval again, one band down, for different monitoring sins (optimal-test envelopes vs Appendix A.6 sweeps).
- **STOP B vs GEPA B−.** STOP repeated the whole loop five times and did not plot a hidden test as a selection envelope. It stays the stronger *protocol* on toys. GEPA stays the stronger *task* (natural-language held-out splits) with a dirtier paper-level test story.
- **DiscoPOP B vs MASS B−.** Unchanged logic: family transfer vs tiny same-family slice.
- **AFlow B− vs ADAS B−.** Unchanged letters. ADAS’s every-child test walk is now named as test monitoring; AFlow’s test-vs-round plots are the same kind of miss on top of 2-rewrite.
- **MaAS B− vs report §2.0 C−.** A 1:4 test split exists. Missing val and test-used ablations are B− hygiene, not “no documented final split.” Do not copy §2.0.
- **Gödel C− vs report §2.0 B−.** The 4o/3.5 mix is still C−. Do not copy §2.0.
- **DGM SWE D vs HGM 8,000-on-500 D vs AgentSquare D.** Unchanged ranking of Ds.
- **HGM Lite-207 C+ vs DGM Polyglot transfer C.** Unchanged. Granularity: Lite 0.5 points ≈ one task; 60-slice 3.4 points ≈ two tasks.

### Search-method ladder

Unchanged from the pre-round board: empty A; GEPA / ACE / HGM at B; STOP / MaAS / MASS / ShinkaEvolve at B− or C+; the rest C.

### Evolved-object ladder

Unchanged: empty A; ShinkaEvolve MoE B; DiscoPOP B−; Self-Developing and GEPA prompts C+; most others C; AgentSquare / Gödel / DGM tools C−; HGM resolver D.

### RSI ladder

Unchanged: 0 for frozen outer searchers including Self-Developing; 1 for PromptBreeder, STOP, Gödel, DGM, HGM; 2–3 empty. HGM CMP remains a search heuristic over Q, not an I(A) experiment.

### What a “strong paper” means here

If the question is practical harness work with a number you can defend: **GEPA main** and **ACE offline**, now as Eval B− (real splits, named monitoring).  
If the question is a search idea aimed at RSI: **HGM’s parent-pick rule** and **STOP’s loop**, not DGM’s SWE headline.  
If the question is a machine-written technical object: **ShinkaEvolve MoE**, then **DiscoPOP** with the ranking caveat.  
If the question is “did the field show recursive self-improvement?”: **no**.

## What would move a letter

| If someone did this | Letter that moves |
|---|---|
| Ten GEPA (or ACE) full searches, defaults chosen on val only, test queried once after freeze | Those Eval B− rows can contend for B+ or A |
| DGM/HGM with no private-test return path, strong starting harness, leftover repos | DGM SWE could leave D; HGM object could leave C |
| Early/mid/late child-quality test, hidden traces, matched budget, two seeds | First RSI 2 in the cohort |
| ShinkaEvolve MoE, three pretraining seeds, hinge/entropy ablations, different N_E or k, exact source hash for \(\tau\) | Object B → B+ or A contention |
| DiscoPOP, three full discovery pipelines, report the fitness winner *and* LRML | Eval B → B+; object B− → B if LRML still holds up |
| AFlow without the high-variance filter, several split seeds, no test curves during search | Eval B− → B |
| AgentSquare publishes frozen partitions and search seeds | Could leave D |
| Compute-matched Pareto for ADAS/Gödel/MASS (same calls as the evolved system) | Object C stays unless the gain survives; Eval minus may lift |

Until those exist: automated search can improve prompts, workflows, and wrappers. It can sometimes emit an interesting technical object (MoE loss; weaker preference loss and merge heuristic). It has not been shown to recursively become better at improving itself.
