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
