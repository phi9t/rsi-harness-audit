# How we score these papers

The original audit gave each PDF one Eval letter, one Discovery letter, and one RSI number. That hid real differences. GEPA's main experiment uses a held-out test; its KernelBench demo searches on the same 35 kernels it reports. Those are not one result.

This revision scores **one experiment at a time**. Letters are built from a checklist and from **hard caps** (automatic ceilings). We do not average a clean experiment with a dirty one.

If you only remember four rules:

1. Grade the experiment, not the PDF.
2. Give the search method and the evolved object separate Discovery scores.
3. A hard cap beats a good story. Private tests shown to the proposer make Eval D, even if the authors inspected logs and saw no hardcoding (DGM, §C.3).
4. Getting better at the benchmark used for search is not recursive self-improvement. None of these papers measures whether later systems are better at producing the *next* system.

---

## Words we use, with evidence

**Experiment / claim.** One method, one thing being changed, one protocol, one reported number, and the interpretation the authors want. GPTSwarm's MMLU run (five training seeds, +2.1±1.1) is a different experiment from MiniCrosswords (same 20 puzzles for search and score).

**Harness.** The wrapper around a frozen model: prompts, tools, retries, routing, extra models. DGM's starting harness is a bash tool plus whole-file view/edit. That is a harness, not a new model.

**Search (the outer loop).** The full process that proposes candidates, scores them, and picks a winner. Rerunning "the agent three times on the test set" is not rerunning search. MASS reports mean±SD over three executions of the *final* workflow. That is noise in answering questions, not noise in finding the workflow.

**Held-out test.** Examples the search process is not allowed to query. GEPA's main tables use explicit train / validation / test splits (HoVer 150/300/300). The test set is held out. The validation set is not: GEPA keeps scoring it to pick the next prompt.

**Validation set, used adaptively.** A split that is not the final test, but is queried many times during search. Each extra look makes it easier to overfit that split. GEPA is honest about this: most of its rollout budget is spent on validation "solely for candidate selection." That is why Eval A is off the table even when test is clean.

**Rollout.** One full run of the system on one example (model calls, tools, score). GEPA's "up to 35× fewer rollouts" is 24,000 GRPO rollouts vs 678 on IFBench, not the typical ratio. The aggregate GEPA budget is about 3,936 vs 24,000 (~6×).

**Firewall.** A rule about what the search process is allowed to see. "Train/test split" is not enough. DGM's *coding agent* does not see SWE-bench private tests at evaluation time. The separate o1 diagnostic prompt does: it is given the official private test patch and the private-test result, then asked what to change next (§C.3). The leak is in the proposal channel.

**Same-set search.** The tasks used to search are the tasks used to report the headline. GPTSwarm MiniCrosswords: 20 puzzles for both. HGM's scaled run: 8,000 evaluations on all 500 SWE-bench Verified tasks, then 61.4% on that same set.

**Prequential / online-on-test.** Predict on a test example, then update from that example's outcome, then move to the next. ACE's online setting does this on the shuffled test split. That is a real learning protocol. It is not the accuracy of one frozen system on untouched test items. ACE's offline setting (build playbook on train, freeze, test) is.

**Compute match.** The evolved system and the baseline use the same model, the same number of calls, similar tokens, the same tools. ADAS agents often make tens of model calls per example while basic prompting makes one or a few. A higher score can just be more test-time compute.

**Search-space match.** Automated search and the human/random baseline are allowed the same kind of candidate and the same evaluation budget. Self-Developing can emit thousands of merge programs. Task Arithmetic and TIES are tuned on a small coefficient grid. That comparison mixes "LLM search is good" with "we searched a much larger space."

**Selection winner vs branded favorite.** The candidate the fitness rule actually picked, versus the one the abstract names. DiscoPOP selects losses on MT-Bench. DBAQL is best among discovered losses there (7.978). LRML is sixth (7.916). On held-out AlpacaEval win rate vs GPT-4, PADLL is 14.07, AQFL 13.63, LRML 13.21. The paper still leads with LRML as DiscoPOP because of its "unconventional" shape. We grade that as a branding choice, not as table-winning discovery.

**Operator library.** The human-written menu the searcher is allowed to wire up (chain-of-thought, debate, self-consistency, test-then-select, and so on). AFlow lists six operator families. MaAS and MASS do the same kind of thing. Connecting those operators is useful engineering. It is not a new operator.

**Weak start / weak root.** A starting harness that omits tools every serious coding agent already has. DGM says the base agent is "intentionally lightweight." Later descendants add line-range viewing, string replacement, retries, and a second model to rank patches. Those are standard coding-agent parts. Doubling the score mostly shows the start was crippled.

**Ablation.** Change one piece, keep the rest, see whether the gain moves. Forward: add the piece to the parent. Reverse: remove it from the child. Without that, a "discovered" file can be along for the ride. HGM's showcased `attempt_error_resolution` logs that it "would" install a module or fix a syntax error, skips the action, and still returns success. An ablation, or a unit test, would have caught that it does not repair anything.

**Transfer.** The artifact is tested on a set that was not used to choose it, and not picked by looking at the target scores. ShinkaEvolve searches AIME 2024, then reports AIME 2023 and 2025. That is year transfer. ADAS transferring the "top 3 agents" already ranked on the target is not.

**Recursive self-improvement (RSI).** Later systems are better at carrying out the *next* improvement cycle, not merely better at the benchmark used to select them. Task score of a system A is Q(A): average success on tasks. Improvement ability I(A) is how good the children of A are, under a fixed model, tool set, mutation budget, and hidden evaluator. No paper here measures I(A).

**Clade metaproductivity (CMP).** HGM's name for "how good is this lineage," estimated as the pooled pass rate of an agent and its descendants, then used with Thompson sampling to pick whom to expand. That is a search heuristic over task scores. It is not an I(A) experiment. HGM also reports a different, after-the-fact number: the best descendant's score, excluding the node itself, computed on the finished tree. Those two quantities are not the same.

---

## The three grades

| Grade | Question | Typical ceiling in this corpus |
|---|---|---|
| **Eval** | Can we trust the number? | No A. Best main claims sit at B / B+. |
| **Discovery (search method)** | Did the authors design a better way to search? | HGM's CMP policy and GEPA's reflection+Pareto can reach B. |
| **Discovery (evolved object)** | Did search produce a new, working artifact? | ShinkaEvolve's MoE loss is the high-water mark at B. Most workflows are C. |
| **RSI** | Did they measure improvement of improvement? | 0 or 1. Never 2 or 3. |

Plus and minus are defined, not decorative:

- **Plus:** meets the letter, and also hits one requirement of the letter above (example: B with unusually clean splits and matched prompt-optimizer budgets → B+).
- **Minus:** meets the letter's main firewall, but fails two other checklist items (no search repeats *and* a tiny subset is already two).
- If two experiments disagree, they get two rows. Do not average them into B±.

---

## Eval: can we trust the number?

### What the searcher was allowed to see

This sets the maximum Eval letter for that experiment.

| Level | Meaning in plain words | Evidence | Max Eval |
|---|---|---|---|
| **1** | Search uses a train (or public) split. The reported test is never queried. Private tests and gold patches are not in any prompt that proposes the next change. | ACE offline: playbook from train, frozen, original test. STOP: 20 train instances, 50 held-out. | No cap from this row |
| **2** | A validation split is scored again and again to accept or reject candidates. Final test stays hidden. | GEPA validation = the Pareto set used for selection. MASS runs all three stages on validation, then a held-out test. | Cannot be A. B or B+ is possible. |
| **2-rewrite** | There is a split, then the search *distribution* is changed using evaluation signal: keep only high-variance items, train a predictor on scores, or promote only top-k on the same pool. | AFlow: 20% validation (seed 42), run a blank workflow five times, keep high-variance examples as the actual search set. DGM: 10 tasks → ~60 → if >40% and top two, then 200, including the previous 60. AgentSquare: an LLM predictor, fed past scores, skips recombinations. | B− even if a test split exists |
| **3** | Search and the headline share the same tasks. | GPTSwarm MiniCrosswords, 20 puzzles both ways. HumanEval: prompts updated from the stream, whole benchmark re-scored. HGM: 8,000 evals on all 500 Verified, 53.2% → 61.4%. ShinkaEvolve AIME: all 30 AIME 2024 questions. | D, with one exception below |
| **4** | Hidden tests, official patches, or judge internals are pasted into the prompt that decides the next edit. | DGM §C.3: "While the private test patch is included in the diagnosis prompt…" plus `{test_patch}` and `{eval_log}`. Authors report no hardcoding on inspection. Exposure still happened. | D. A clean transfer experiment does not raise *this* number. |

**Score the prompt that chose the edit, not only the agent that solves tasks.** DGM's Polyglot coding agent is told not to see hidden tests. That does not clean the SWE-bench o1 diagnosis loop.

**Exact, checkable math is a limited exception to level 3.** Circle packing (sum of radii, no overlap) is the same objective for search and for the reported score, but anyone can re-check the packing. That is not like reusing GSM8K questions. Cap is C unless an independent check with tighter constraints is the headline. ShinkaEvolve notes that matching AlphaEvolve's verifier can require shrinking radii by ~1e−8.

### Other Eval checklist items

| Check | Pass | Fail, with evidence |
|---|---|---|
| **Search was repeated** | The whole search is rerun (we want ≥5 cheap methods, ≥3 expensive). Report median and spread of those runs. | Almost every headline is one search. STOP does five full self-improvement runs. GPTSwarm MMLU uses five training seeds. ShinkaEvolve shows three circle-packing runs. DGM does not repeat the SWE-bench search. |
| **The ± is about search** | Error bars over independent searches. | MASS ± is three test executions of one chosen topology. ADAS 95% intervals are bootstrap over examples. Those answer "would this harness get a different score if we resampled answers?", not "would another search find an equally good harness?" |
| **Compute match** | Same model, calls, tokens, tools. | Gödel Agent "free" learns to call GPT-4o while the nominal solver is GPT-3.5. Exclude that row from same-model harness comparisons. |
| **Fair search space** | Random search, evolution without an LLM, and humans get the same candidate language and budget. | Self-Developing: up to ~9,000 proposals vs a handful of merge coefficients. |
| **Honest population** | Full official split, or a split frozen before seeing results. | ADAS ARC: public training, Easy, grids ≤5×5, 20 val / 60 test. AFlow, MaAS, and related papers reuse a 617-problem MATH level-5 slice. Those MATH numbers are not full MATH. |
| **Honest selection** | Report the fitness winner on held-out data, or say in advance you will highlight a different object and why. | DiscoPOP: LRML is not the MT-Bench winner and not the AlpacaEval win-rate winner. Error bars among PADLL / AQFL / LRML overlap. |
| **Name the protocol** | Caption matches what was done. | ACE online sits in the same "test" columns as offline. GPTSwarm GAIA is a hand-built swarm, not an optimized graph. Do not grade GAIA as a search result. |

### How the Eval letter is built

1. Apply the lowest hard cap that triggers (table above, plus: prequential-on-test sold as frozen held-out accuracy → C; no documented split → D; hand-built demo labeled as search → do not give an Eval-as-discovery letter).
2. If nothing caps lower, use A/B/C/D from the remaining checks. **A** needs a clean test, repeated full searches, error bars over those searches, compute match, search-space match, and a pre-declared population. Nobody here has that.
3. Apply plus or minus.

Examples:

| Experiment | Cap | Letter | Why |
|---|---|---|---|
| GEPA main | Level 2, one search → max B+ | **B+** | Real test split; prompt-optimizer budgets kept near each other; KernelBench is a *separate* D. |
| AFlow main | Level 2-rewrite | **B−** | 80% test exists; high-variance filter still rewrites what is being optimized. |
| DiscoPOP | Level 2 | **B** | Held-out AlpacaEval/TL;DR exist; MT-Bench is both the selection metric and part of the story; branded loss is not the table winner. |
| ACE offline | Level 1 | **B+** | Train then frozen test. Missing search repeats. |
| ACE online | Prequential on test | **C** | Legitimate streaming protocol; not static held-out accuracy. |
| HGM 8,000 on 500 Verified | Level 3 | **D** | Search and report are the same 500 tasks. |
| HGM SWE-Lite, 207 non-overlap | Search was on Verified | **C+** | 93 of 300 Lite tasks overlap Verified; they also report the 207. GPT-5-mini: 34.8% → 40.1% vs SWE-agent 39.6. One run. |
| DGM SWE 20% → 50% | Level 4 | **D** | o1 sees private tests. Polyglot transfer (14.2% → 28.9% for a SWE-evolved agent) is a different, cleaner claim. |

---

## Discovery: what was found?

Issue **two** scores. Mixing them was the original rubric's worst habit.

**Search method (authors' algorithm).** How parents are chosen, how candidates are proposed, how validation is used. GEPA's contribution is trace-based reflection plus Pareto selection, written by the authors. HGM's contribution is CMP plus Thompson sampling, also written by the authors.

**Evolved object (what search spat out).** A prompt, a workflow graph, a loss, a merge rule, a tool. ShinkaEvolve's extra MoE penalty is an evolved object. HGM's `attempt_error_resolution` is an evolved object. They must not share a letter with the search method.

A paper can be B for the search method and D for the object. That is a valid outcome, not a contradiction.

### Evolved object checklist

| Check | Pass | Fail, with evidence |
|---|---|---|
| **It does what they said** | Code or math runs. A test can catch a no-op. | HGM appendix: `Would attempt to install Python module`, `# But we'll skip actual installation`, then `return True`. Grade D for that object. STOP: a NumPy broadcasting bug produced "accuracy of over 1000%." That is a bug, not a method. |
| **Not already on the menu** | New executable idea, or a new formula. | ADAS "Structured Feedback and Ensemble" / "Multi-Step Peer Review" are generate, critique, revise, vote. AFlow, MaAS, MASS, AgentSquare mostly place debate, self-consistency, tests, and aggregation. STOP rediscovers beam search, genetic search, simulated annealing, ε-greedy, UCB. ShinkaEvolve's AIME scaffold is three experts, critics, a synthesizer, majority fallback (7 calls). |
| **Isolated** | Add only that piece to the parent; also remove it from the child. | Self-Developing's best GSM8K merge blends tensors with a reduced mean (`keepdim=True`) and a product. No ablation of mean vs no mean, order, or a simple bias-vector baseline. |
| **Transfer that was not cherry-picked** | Held-out year, repo family, model, or scale, chosen in advance. | ShinkaEvolve MoE: 556M model (64 experts, 8 active, ~2B tokens) → 2.7B (still 64/8, ~30B tokens). Scale changed; routing shape did not. Mean downstream 0.362 → 0.368 at one coefficient; HellaSwag and PIQA fall. |
| **Honest ranking** | Headline object is the fitness winner, or the paper says it is a scientific pick and shows the winner too. | DiscoPOP "state of the art" is stronger than its own held-out ranking. |
| **The gain is the object, not extra calls or a bigger model** | Matched compute; same model registry. | Gödel Agent Game of 24 listing is exhaustive search until `abs(nums[0]-24)<1e-6`. That is switching from neural guesses to brute force, not a new algorithm. The unrestricted run's GPT-4o assist is extra resources. |

Hard caps on the evolved object:

- Does not actually run → **D**
- Hand-written, not searched → do not score as evolved
- Already in the operator list, seed prompt, or a textbook → at most **C**
- Rebuilt standard tools from a weak start → at most **C** (DGM 20% → 50%)
- Extra calls or a stronger model could explain the gain → at most **C**
- Stores instance facts (file paths, city names, app APIs) rather than a portable rule → **C** or **D** (ACE AppWorld playbooks mention bill paths and city folders)

Letters for the evolved object: **A** new, working, isolated, repeated, transferred across families (none here). **B** a real new formula or mechanism with some transfer and missing repeats or ablations (ShinkaEvolve MoE; DiscoPOP loss at B−). **C** useful remix of known parts. **D** cosmetic, unsupported, or nonfunctional.

### Search method checklist

| Check | Pass | Fail |
|---|---|---|
| **Stated as a method** | An estimator, a selection rule, a loop you could reimplement without one lucky child. | "We evolved a good agent." |
| **Beats other searchers, not just "no search"** | Same candidate language and budget. GEPA vs MIPROv2 and GRPO. HGM vs DGM and SICA on SWE-Verified-60 / Polyglot. ShinkaEvolve parent sampling vs hill-climbing on circle packing. | Only vs chain-of-thought. |
| **The number used in the loop is the number in the analysis** | HGM's online score is pooled descendant pass rate. | The correlation plot uses "best descendant score, drop the parent," computed after the tree exists. That after-the-fact number is not what Thompson sampling saw. |
| **Repeated** | Several full trees. | One tree. |

---

## RSI: did improvement ability improve?

| Level | Required | Not enough | Who is here |
|---|---|---|---|
| **0** | The searcher is a fixed external algorithm. Prompts or workflows may still change. | Naming the loop "self-improving." | GEPA, ACE, ADAS, AFlow, MASS, MaAS, AgentSquare, GPTSwarm, DiscoPOP, ShinkaEvolve, Self-Developing (the merge is always applied to the original seed model; only the code-generating factory is updated) |
| **1** | The system edits its own code or coevolves the prompts that mutate it. The measured number is still task score Q. | A large archive; "recursive rounds"; CMP on task scores. | PromptBreeder (task prompts and mutation prompts coevolve; fitness is train-batch accuracy). STOP, Gödel Agent, DGM, HGM. |
| **2** | Later snapshots produce better *children* under the same model, tools, mutation budget, and hidden tasks. Repeat the whole thing. | Best agent's task score went up. The best descendant on the finished tree scored higher. | Nobody. |
| **3** | Level 2 on at least two held-out task families, and later generations use their own searcher, not the authors' original outer loop. | A long DGM/HGM tree still diagnosed by the same frozen o1/GPT-5. | Nobody. |

**The level-2 experiment, in steps.** Take an early, middle, and late agent. Give each the same hidden failure traces, the same mutation budget, the same models and tools. Sample children. Score those children once on a hidden set, with no debug dump back to the proposer. The distribution of child scores should move up for later parents. We want the lower 95% bound on (late improvement minus early improvement) above zero, on at least two independent runs.

HGM's CMP is a way to pick whom to expand using descendant *task* success. It is the right *idea* for level 2. It is not the experiment.

Disqualifiers:

- Child calls a stronger model (Gödel unrestricted GPT-4o) → not RSI; drop from same-model tables.
- A frozen stronger model writes the improvement plan (DGM o1) → still level 1, and the search-method grade must name that external diagnoser.

---

## Fill this before assigning letters

If "does it actually run?" or "what did the proposer see?" is unknown, Eval cannot be A and the evolved-object score cannot be B.

```text
Experiment:
Paper:
What was allowed to change:
Headline number (table):
What the authors say that number means:

What the proposer saw (level 1–4, and which prompt: solver / diagnoser / predictor):
How many full searches:
What the ± is over:
Same model and call budget as the baseline?:
Same candidate language and budget as human/random?:
Which tasks (full set, subset, difficulty filter)?:
Fitness winner vs name in the abstract:
Protocol name (frozen test / streaming / same-set / hand-built):

Does the named object run? Quote or test:
Already in the seed prompt or operator list?:
Single-piece add/remove?:
Transfer set, chosen before seeing target scores?:
Leftover gain from extra calls or a bigger model?:

Is the authors' search method specified? Compared to another searcher?

Is the searcher frozen? Is the reported number task score or child quality?
Level-2 experiment present?:

Hard caps:
Eval / search-method Discovery / evolved-object Discovery / RSI:
```

Until a level-2 card is filled, RSI stays 0 or 1, including papers with "Gödel" in the title.

---

## Official suite versus this experiment’s slice

The official task set (items, metric, version pin) for each of the 47 mapped suites is in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). What these 16 papers actually ran is in [`BENCHMARKS.md`](BENCHMARKS.md) and the paper file. A headline on a slice is not a score on the official set.

This is wording, not a new Eval ceiling. Letters on the grade board below do not move in this pass.

| Mix-up | Official fact | This cohort |
|---|---|---|
| SWE-bench Verified | 500 human-checked issues ([map](UPSTREAM_BENCHMARKS.md#swe-bench-verified)) | DGM/HGM bake-off is 60 (35 Django / 25 Sphinx). HGM’s 8,000-eval run is all 500, same-set, already Eval D |
| MATH | Not one of the 47; definition stays in [`BENCHMARKS.md`](BENCHMARKS.md) | AFlow / MaAS / MASS reuse a 617 level-5, four-category slice. MASS 60 val / 100 test. Not full MATH |
| GPQA Diamond | 198 Diamond / 448 main ([map](UPSTREAM_BENCHMARKS.md#gpqa-diamond)) | ADAS / Gödel val is 32 items |
| AIME | Map card is **AIME 2026** ([map](UPSTREAM_BENCHMARKS.md#aime-2026)). 2023/2024/2025 are different contests | ShinkaEvolve searches AIME 2024, then reports 2023/2025 |
| OSWorld | v1 is 369 Ubuntu tasks ([map](UPSTREAM_BENCHMARKS.md#osworld-v1)); 2.0 is 108 long workflows ([map](UPSTREAM_BENCHMARKS.md#osworld-20)) | These 16 papers did not run OSWorld. The two names are not one suite |
| GAIA vs GAIA2 | 466 short answers ([map](UPSTREAM_BENCHMARKS.md#gaia)) vs 800 event-driven scenarios ([map](UPSTREAM_BENCHMARKS.md#gaia2)) | Pin the name. Do not treat a vendor “GAIA” cell as GAIA2 |

Do not read the last two rows as cohort results. They exist so a pasted vendor table cannot merge the names.

---

## Grade board (code-checked 16 August 2026)

Letters live here. Evidence lives in [`papers/`](papers/). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Official task sets, pins, and L/R live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).

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
