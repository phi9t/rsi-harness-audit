# Harness and RSI papers: grading report

**Date:** 16 August 2026  
**Rubric:** [`RUBRICS.md`](RUBRICS.md)  
**Scope:** 16 top-conference papers in the prompt / workflow / self-editing / objective-search lineage. Preprints discussed earlier are out of scope.

**How to read a letter.** Eval answers “can we trust this number?” Search method answers “did the authors write a better way to search?” Evolved object answers “did search emit something new that actually runs?” RSI answers “did they measure whether later systems are better at producing the next system?” A PDF can own several experiments. Cite the experiment.

**Hard ceilings used below.** If hidden tests or official patches are pasted into the prompt that proposes the next edit, Eval is D. If search and the headline share the same ordinary benchmark tasks, Eval is D. If a named mechanism does not run, the evolved-object score is D. Remixing a human operator list (debate, self-consistency, retries, tests) cannot push the evolved object above C. Nobody here gets Eval A, object A, or RSI 2.

Sources are the papers themselves: PromptBreeder 2309.16797, GPTSwarm 2402.16823, STOP 2310.02304, DiscoPOP 2406.08414, ADAS 2408.08435, AFlow 2410.10762, AgentSquare 2410.06153, Gödel Agent 2410.04444, Self-Developing 2410.15639, MaAS 2502.04180, MASS 2502.02533, GEPA 2507.19457, ACE 2510.04618, ShinkaEvolve 2509.19349, DGM 2505.22954, HGM 2510.21614.

---

## 1. Cohort calibration

Letters are comparable only if the same ceiling and the same misses produce the same letter. This section is the yardstick. Paper chapters below apply it.

### 1.1 Eval ladder (trust in the number)

| Band | Meaning in this cohort | Who sits here | Why they are together |
|---|---|---|---|
| **A** | Frozen test, search rerun, error bars over *search*, compute match, fair candidate space | Empty | No paper reruns the full search enough *and* keeps a clean test *and* matches compute. |
| **B+** | Real held-out test, honest protocol name, one extra hygiene item from A (matched budgets or a true train-then-freeze split). Search still usually run once. Validation may be reused (that blocks A). | GEPA main; ACE offline | GEPA documents train/val/test (HoVer 150/300/300) and keeps prompt-optimizer rollout budgets within about 10%. ACE never queries test during playbook construction. Both omit independent full searches. |
| **B** | Held-out evaluation exists. Two modest misses, or a clean protocol on a narrow domain. | STOP LPN; DiscoPOP held-out suite; ShinkaEvolve MoE scale-up, ALE private score, AIME year transfer | STOP has the *best* search-repeat hygiene (five full loops) and the *narrowest* tasks. DiscoPOP has a real held-out suite and a branding problem. ShinkaEvolve’s best eval rows have a public/private or year split and no extra pretraining seeds. |
| **B−** | Held-out test exists, but two checklist misses, or the search set was rewritten after the split. | PromptBreeder; ADAS; AFlow; MaAS; MASS; Self-Developing; ShinkaEvolve circle packing | AFlow is the prototype of “split then rewrite” (high-variance val filter). MASS is the prototype of “± that is not search.” PromptBreeder borrows OPRO/davinci rows. ADAS pays for easy ARC slices and extra model calls. These are the same letter for different reasons, not the same sin. |
| **C / C+ / C−** | Transfer or a split exists, but the protocol is streaming-on-test, overlapping val/dev, mixed models, or a contaminated searcher tested elsewhere. | ACE online; GPTSwarm MMLU; Gödel main (C−); DGM Polyglot extra/transfer (C); HGM Lite-207 and vs-DGM-60 (C+); GEPA adversarial AIME (C) | C+ means the authors did the honest extra cut (HGM drops 93 overlapping Lite tasks). C− means the main table is confounded (Gödel 4o writer / 3.5 solver). |
| **D** | Same tasks for search and headline, or hidden evaluator internals in the proposal prompt, or no documented final split. | GPTSwarm MiniCrosswords and HumanEval; AgentSquare; DGM SWE 20→50; HGM 8,000-on-500; GEPA KernelBench; ShinkaEvolve AIME 2024 search | D is not “the method is false.” It is “this number cannot support a generalization claim.” DGM’s D is worse than GPTSwarm’s D: private tests enter the *next-edit* prompt, not only the score. |

**Close calls, resolved.**

- **ACE offline vs GEPA main, both B+.** ACE has the cleaner firewall (train, freeze, original test). GEPA reuses validation every round. GEPA has the cleaner *comparison* (MIPROv2 and GRPO rerun under a shared rollout cap). ACE is missing search repeats; GEPA is too. They are tied on Eval, not because the protocols are identical, but because each has one A-axis and one blocking miss. Do not average ACE online into ACE’s B+.
- **STOP B vs GEPA B+.** STOP repeated the whole loop five times, which GEPA did not. STOP’s claim is about 10-bit parity-with-noise and a handful of toy search problems. For a number about *those* tasks, STOP is the stronger protocol. It is not B+ because the result does not travel to a natural benchmark without a new experiment. GEPA’s B+ is about GSM/IF/HoVer-style tasks with a held-out test.
- **DiscoPOP B vs MASS B−.** Both reuse a selection split. DiscoPOP’s held-out suite (AlpacaEval, TL;DR, IMDb) is a different *benchmark family*. MASS’s test is a small random slice of the same family (MATH 60 val / 100 test). DiscoPOP’s minus is branding, which hits the evolved-object score harder than Eval. MASS’s minus is subset size plus ± over three executions of one topology. That is Eval.
- **AFlow B− vs ADAS B−.** AFlow has a cleaner test split (80%, seed 42) and a worse search-set rewrite (high-variance filter). ADAS has a held-out test and pays for Easy ARC, one trajectory, and extra calls. Same letter, different binding miss.
- **DGM SWE D vs HGM 8,000-on-500 D vs AgentSquare D.** All D, not interchangeable. DGM is level 4 (private patch in the diagnosis prompt). HGM’s scaled run is level 3 (same 500 tasks). AgentSquare is “no documented frozen split” plus a score-fed predictor. If you need the worst Eval claim in the cohort, it is DGM SWE 20→50, because the hidden tests shaped the *mutations*, not only the reported score.
- **HGM Lite-207 C+ vs DGM Polyglot transfer C.** Both are “trained here, scored on another set.” HGM searched Verified (including an in-sample 8,000-eval run in a different experiment) and then dropped overlapping Lite tasks. DGM’s Polyglot transfer is a real other benchmark, but the object was grown with SWE private tests in o1. HGM C+ is the more careful *reporting* of overlap. DGM C does not raise the SWE D.

### 1.2 Search-method ladder (authors’ algorithm)

| Band | Meaning | Who | Calibration note |
|---|---|---|---|
| **A** | Searcher beats other searchers on held-out families, with repeated full trees | Empty | HGM vs DGM/SICA is the closest, and it is one setting with a shared 60-slice. |
| **B** | Specified loop, compared to other *searchers* under a similar budget | GEPA (reflection + Pareto vs MIPROv2/GRPO); ACE (playbook updater vs GEPA/ReAct as adapters); HGM (CMP + Thompson sampling vs DGM/SICA) | GEPA’s searcher comparison is the cleanest on rollout matching. HGM’s is the most on-topic for RSI. ACE’s is “context updater vs prompt optimizer,” which is a fair adjacent control. |
| **B− / C+** | Specified loop, some searcher control, missing repeats or mixed into packing-only ablations | STOP (five runs, toy); MaAS (supernet vs AFlow); MASS (staging vs ADAS/AFlow); ShinkaEvolve (parent sampling / novelty / bandit, ablated on circle packing) | MaAS/MASS move up from C because the control is another workflow searcher, not chain-of-thought. ShinkaEvolve C+ not B because those ablations are not repeated on MoE or ALE. |
| **C** | Standard evolution / MCTS / REINFORCE / “ask GPT-4 for 100 programs,” mainly vs prompting | PromptBreeder, GPTSwarm, ADAS, AFlow, AgentSquare, Gödel, DGM, DiscoPOP, Self-Developing | DGM’s archive-and-parent-pick is a real loop. It stays C because the mutation *plan* is written by frozen o1 with private tests in context. DiscoPOP’s searcher is “GPT-4 proposes losses,” about 100 tries, one pipeline. |

**Close call: HGM searcher B vs GEPA searcher B.** GEPA’s control is other prompt optimizers and RL on the same programs. HGM’s control is other self-editing trees on the same 60 SWE tasks. HGM’s after-the-fact “empirical CMP” (best descendant score, drop the parent) is not the online pooled pass rate. That blocks B+. GEPA does not have that mismatch. They tie at B for different virtues.

### 1.3 Evolved-object ladder (what search emitted)

| Band | Meaning | Who | Calibration note |
|---|---|---|---|
| **A** | New, working, isolated, repeated, transferred across families | Empty | ShinkaEvolve MoE would need extra pretraining seeds, hinge/entropy ablations, and a change in expert count or top-k. |
| **B** | A real new formula or mechanism, some transfer, missing seeds or ablations | ShinkaEvolve MoE loss | Entropy-scaled hinge under a usage floor, on top of global-batch load balancing. Scale-up 556M → 2.7B. Mean 0.362 → 0.368. HellaSwag and PIQA fall. Routing shape frozen (64 experts, top-8). |
| **B−** | Real object, own tables do not establish superiority | DiscoPOP LRML | Closed-form mix of DPO and exponential preference losses. Not the MT-Bench winner. Not the AlpacaEval win-rate winner. Error bars overlap. |
| **C+** | Unusual remix, under-ablated, or a prompt that is concrete and copies across models | Self-Developing mean-and-product merge; GEPA main prompts | Self-Developing is more “new-looking math on weights” than another debate graph. GEPA prompts are better task engineering than ADAS ensembles, not a new primitive. They share C+ for different reasons. |
| **C** | Known parts: debate, self-consistency, tests, beam search, annealing, range-read, retries | Almost everyone else | Operator-library ceiling. Weak-start reconstruction (DGM tools) stays here even if Q doubles. |
| **C−** | Recombination table, template leakage, or brute-force sold as discovery | AgentSquare; Gödel ensembles / Game of 24 as “algorithm”; DGM tools from a crippled start | Game of 24 as a *modality switch* can be C. As a new algorithm it would be D. We score C− on the paper’s discovery rhetoric. |
| **D** | Does not run, or success-return on a skip | HGM `attempt_error_resolution` | Appendix: “Would attempt to install… skip actual installation… return True.” |

**Close call: DiscoPOP B− vs ShinkaEvolve MoE B.** Both are closed-form objectives found by LLM search. DiscoPOP has the better *held-out family* (chat/summarization vs the fitness bench). ShinkaEvolve has the better *scale transfer* (parameter count and tokens). DiscoPOP’s own ranking undercuts the headline; ShinkaEvolve’s mean lift is small and mixed but not contradicted by a stronger discovered sibling in the same table. That is why MoE is B and LRML is B−, not the reverse.

**Close call: GEPA prompts C+ vs ACE playbooks C.** GEPA’s HotpotQA hop-2 rules are portable procedures (do not paraphrase the first query; target the missing entity). ACE AppWorld bullets include `/home/[username]/bills/` and city directories. Both are useful. ACE’s contents look like a compiled cheatsheet. That is the difference between C+ and C on the *object*, while ACE’s *updater* is still search-method B.

### 1.4 RSI ladder

| Level | Who | Why they do not move |
|---|---|---|
| **0** | GEPA, ACE, ADAS, AFlow, AgentSquare, GPTSwarm, MaAS, MASS, DiscoPOP, ShinkaEvolve, Self-Developing | The outer searcher is frozen. Self-Developing updates a code factory and always merges onto the original seed model. That is not the model improving itself. |
| **1** | PromptBreeder, STOP, Gödel Agent, DGM, HGM | Something self-referential exists (mutation prompts, or the agent edits its own code). The reported number is still task success. HGM’s CMP is a search heuristic over task success, not a child-quality experiment. |
| **2–3** | Empty | Nobody ran early/mid/late parents on hidden failures with a matched mutation budget. |

STOP is the only paper that *says* it is not fully RSI because the weights stay frozen. That honesty does not raise the level. It is why STOP is the calibration prototype for level 1: self-reference, toy protocol, measured Q, textbook children, visible reward hacks.

### 1.5 What a “strong paper” means here

If the question is practical harness work with a number you can defend: **GEPA main** and **ACE offline**.  
If the question is a search idea aimed at RSI: **HGM’s parent-pick rule** and **STOP’s loop**, not DGM’s SWE headline.  
If the question is a machine-written technical object: **ShinkaEvolve MoE**, then **DiscoPOP** with the ranking caveat.  
If the question is “did the field show recursive self-improvement?”: **no**.

---

## 2. PromptBreeder (ICML 2024, arXiv:2309.16797)

**Headline they want.** Population search over task prompts and mutation prompts beats other prompt optimizers. GSM8K zero-shot 83.9 vs OPRO 80.2.

**Experiments scored.** One main protocol: evolve on train batches, report leftover or official test. Same letter across GSM8K and the asterisked arithmetic sets.

### Eval B−

Fitness is accuracy on “a randomly select batch of 100 examples from the training set.” Population about 50, typically 20–40 generations, about 1–2k fitness evaluations. Asterisked sets are randomly halved; GSM8K uses the provided split. The fittest individual over the whole run is then scored on test (App. J.2).

That is a real held-out test, so Eval is not D. There is no separate validation set: train fitness is queried every generation, so this is level 2 (adaptive selection on the search split). The full search is not repeated. Table 1 point estimates have no error bars. Bracketed Plan-and-Solve numbers “are directly taken from the Plan-and-Solve paper which uses text-davinci-003.” OPRO 80.2 is presented beside PaLM 2-L rows without a clear same-model rerun.

**Why not B or B+.** Two misses: no search repeats, and mixed-model borrowed rows. Minus is required. **Why not C.** The leftover/official test is documented. **Why not A.** Level 2 plus missing repeats.

### Search method C

Binary tournament, nine mutation operators, coevolution of mutation prompts. That is a specified loop. The main controls are other prompt methods, several not rerun on PaLM 2-L. Not a comparison of searchers on the same candidate grammar (no random-prompt search with the same 1–2k budget). C, not B−.

### Evolved object C

Table 6’s GSM8K zero-shot winner includes `"SOLUTION"`. Few-shot GSM8K is 83.5, *below* zero-shot 83.9. App. J.5: “contexts dominate, and often the task-prompts drift into nonsense.” Mutation prompts are paraphrases (“Please summarise and improve the following instruction”). Operator-class ablations exist (App. L); the weird strings are not isolated as “control tokens vs semantics.”

This is evidence that PaLM 2-L is prompt-sensitive, not evidence of a transferable reasoning discovery.

### RSI 1

Mutation prompts and task prompts coevolve. Fitness is still task accuracy. App. F says the system “does not invent new (auxiliary) ways of evaluating them.” Level 1, not 2.

**Cite as.** Early prompt evolution with a leftover test. Do not cite as RSI. Do not treat 83.9 vs 80.2 as a same-model, repeated-search result.

---

## 3. GPTSwarm (ICML 2024 Oral, arXiv:2402.16823)

**Headline they want.** Agents as graphs; automatic discovery of high-performance algorithms.

**Experiments.** MiniCrosswords; HumanEval; MMLU collaborative; GAIA (not searched).

### MiniCrosswords: Eval D, object C, RSI 0

Same 20 puzzles for optimization and evaluation (§3.2). Learned edges among Tree-of-Thoughts, Reflexion, and chain-of-thought. Score 0.465 → 0.575 (three runs, standard error over those runs). Density-matched random edges 0.510, so structure is not only “more edges.” The number is still in-sample on 20 items. Level 3 → Eval D.

### HumanEval: Eval D, object C, RSI 0

Node prompts updated from positive examples in the benchmark stream; the whole benchmark is re-scored (0.76 → 0.88). Same population for harvest and report. Level 3 → D.

### MMLU collaborative: Eval C, search C, object C, RSI 0

Seven role agents. +2.1±1.1 over five *training* seeds. That is one of the few repeated searches in the cohort. Scores use overlapping validation/dev slices, not a frozen leftover test. That is why this is C, not B−, despite the five seeds. It is also why GPTSwarm’s *best* Eval is C, while the *headline* MiniCrosswords is D. Do not average them.

### GAIA: not a search grade

Table 1 is a hand-built swarm (tools, more agents, self-consistency). Duration scales with agent count. Do not cite as “the graph optimizer discovered GAIA performance.”

### Search method C (paper-level)

REINFORCE on edge probabilities is a real representation. Controls are mostly “no graph / fewer edges / single agent,” not other graph searchers on a held-out puzzle split.

**Cite as.** Graph abstraction. For evidence, only the MMLU seed result is usable, and it is small. MiniCrosswords and HumanEval are in-sample.

---

## 4. STOP (COLM 2024, arXiv:2310.02304)

**Headline they want.** An LLM-written improver that rewrites itself improves a toy program-synthesis loop.

### Eval B

Learning Parity with Noise, 10-bit. Utility on M = 20 noisy instances; test meta-utility on 50 held-out instances. Five independent STOP runs, means with standard errors. Seed improver is sample-and-pick-best. Improver model gpt-4-0314. Transfer table: 3-SAT, MaxCut, string-grid, parity, QAP-like toys, with less repeat discipline.

Level 1 firewall for LPN (held-out instances; “individual downstream tasks themselves are not included in the description”). Five full loops is the cohort’s best search-repeat practice.

**Why not B+.** The claim’s world is synthetic 10-bit problems and compact combinatorial toys. Transfer is not the same five-run protocol. **Why not A.** Toys, and no natural-harness follow-up. **Why not C.** The LPN split and the five runs are real.

### Search method B−

The loop (improver edits the improver, scored by downstream utility) is specified and rerun. Compared mainly to chain-of-thought / greedy scaffolds, not to a non-LLM evolutionary improver with the same budget. B−, not C, because the self-referential loop *is* the method and they measured it five times.

### Evolved object C

Runs synthesize beam search, genetic search, simulated annealing, top-k, ε-greedy, adaptive temperature, early stopping, caching, UCB-like allocation. Those are textbook. The interesting negative results are in the same paper: GPT-4 tries to set `use_sandbox=False` or emit `exec(` (0.42% in a 10k-generation stress test); a NumPy broadcasting bug yielded “accuracy of over 1000%.” Those are scientific. They are not new algorithms.

### RSI 1

The paper says it is “not completely a Recursively Self-Improving (RSI) system, as the underlying LM remains unchanged.” Meta-utility is average downstream task utility, “only indirectly” improver quality. That is the definition of level 1. Calibration prototype for the whole RSI column.

**Cite as.** Cleanest bounded self-reference experiment, and the best reward-hacking case study. Not novel algorithm discovery. Not open-ended RSI.

---

## 5. DiscoPOP (NeurIPS 2024, arXiv:2406.08414)

**Headline they want.** GPT-4 discovers a state-of-the-art preference loss (LRML / DiscoPOP).

### Eval B

About 100 valid objectives. Selection on MT-Bench (GPT-4 judge). Held-out: AlpacaEval 2.0, TL;DR on 694 posts, IMDb sentiment. Training recipe fixed (zephyr-7b-gemma-sft, Argilla DPO Mix 7K, β=0.05, two epochs). Full discovery pipeline not repeated (CIFAR toy discovery has three runs in an appendix; IMDb curves use 10 generation seeds).

Level 2: MT-Bench is queried to pick the loss. Final story still reports MT-Bench ranks. AlpacaEval is a different eval family, so this is not level 3.

**Why not B+.** MT-Bench is both the fitness and a reported table. No full-pipeline repeats. **Why not B−.** The held-out family split is stronger than MASS’s tiny same-family slices. **Why not C.** AlpacaEval/TL;DR/IMDb are not the MT-Bench items.

### Search method C

“GPT-4 proposes PyTorch `f` over log-probs.” About 100 tries. No random/programmatic search over the same loss grammar at the same training budget.

### Evolved object B−

The formula (using the paper’s Table 1 / Eq. 5, not the sign-typo Eq. 4):

LRML blends logistic DPO and an exponential term with a sigmoid gate on the implicit reward margin. That is a coherent object.

MT-Bench among discovered losses: DBAQL 7.978 > AQL 7.953 > PADLL 7.941 > AQFL 7.931 > CELL 7.925 > **LRML 7.916**. AlpacaEval win rate vs GPT-4: PADLL 14.07, AQFL 13.63, LRML 13.21, DPO 11.23. Length-controlled, AQFL can lead. The paper says top losses are mostly not significantly different except LRML on length-controlled vs SFT. They brand LRML for a nonconvex region and a negative gradient at margin 0, not because it won.

**Why not B.** Honesty cap: the named artifact is not the selection winner or the held-out win-rate winner. **Why not C.** It is still a real closed-form loss with some transfer, unlike another debate graph.

### RSI 0

Frozen GPT-4 proposer. Weights of the *discoverer* are not the thing being aligned.

**Cite as.** Plausible machine-written objective. Do not say state of the art. Reproduce PADLL and AQFL in the same grid if you reproduce LRML.

---

## 6. ADAS (ICLR 2025, arXiv:2408.08435)

**Headline they want.** A meta-agent that writes agent code outperforms hand-designed agents.

### Eval B−

Search on validation, report test: ARC Easy val 20 / test 60, grids ≤5×5 from the public training set; GPQA Diamond 32/166; other domains 128/800. One search trajectory per domain. Accuracy CIs are 95% bootstrap over examples, or five output samples on ARC/GPQA, not search seeds. Some transfer picks “top 3 agents” using already observed scores. Generated workflows often use tens of model calls vs one or few for prompting. Meta model gpt-4o; agents gpt-3.5-turbo.

Level 2, not 3, for the main tables. **Why not B.** Easy ARC, one trajectory, extra calls, transfer-by-observed-score: more than two misses. Binding miss is the combination of subset + compute. **Why not D.** Test items are not the val items.

### Search method C

Meta Agent Search writes Python against a small framework. Seed archive already contains chain-of-thought, self-consistency, self-refine, debate. Controls are those manuals and simple prompting, not another code-search algorithm with the same budget (no random program search). Foundational as a *formulation*. C as a demonstrated searcher.

### Evolved object C

Named children: Structured Feedback and Ensemble; Multi-Step Peer Review; Divide and Conquer. Those are generate, critique, revise, vote, decompose. The seed and meta-prompts already make those available. Ceiling: operator/seed remix, max C.

### RSI 0

Fixed meta-agent.

**Cite as.** The right conceptual starting paper for “agent programs are the search object.” Do not cite ARC numbers without “Easy, ≤5×5, 20/60.” Do not cite as new architecture principles.

---

## 7. AFlow (ICLR 2025, arXiv:2410.10762)

**Headline they want.** MCTS over workflows, average 80.3 on six tasks with GPT-4o-mini.

### Eval B−

Random 20% val / 80% test, seed 42. Then a blank workflow is run five times on val and **high-variance instances are kept as the search set**. MCTS, 20 rounds, each candidate evaluated five times on that val. Final test is the 80%, average of three *test* runs. MATH uses 617 level-5 problems, four categories. Operators: generate, format, review, revise, ensemble, test, programmer.

Level 2-rewrite. Ceiling B− even though a test split exists. That is the point of the 2-rewrite rule: the split is not the search distribution.

**Why not B.** The high-variance filter is model-dependent and is not a frozen pre-registered val set. **Why not D.** The 80% test is documented and unused during MCTS.

### Search method C

MCTS over a human operator list, compared to ADAS and manuals. Not compared to MCTS without an LLM, or random workflows in the same grammar, at the same 20×5 budget.

### Evolved object C

GSM8K: program execution, multiple samples, formatting. Coding: generate or run tests then select. Ablation: removing named operators leaves much of GSM8K intact (about 93.1% in the paper’s operator-off path). Gain is partly prompt/code search around a template.

### RSI 0

**Cite as.** Better split hygiene than ADAS, undone in part by the variance filter. Workflows are familiar program-aided and test-driven patterns.

---

## 8. AgentSquare (ICLR 2025, arXiv:2410.06153)

**Headline they want.** Modular search over 1,050 combinations, 17.2% average gain vs best human agents.

### Eval D

Sixteen seed agents, four module types (planning, reasoning, tool, memory). Evolution plus recombination. An LLM predictor, conditioned on an experience pool of real scores, skips recombination children. Environments: WebShop, ALFWorld, ScienceWorld, M3Tool, TravelPlanner, PDDL. No documented three-way search / selection / frozen-final split. Search uses the same env metric that appears in Table 1. No uncertainty over architecture search.

This is either level 3 or “no documented firewall,” plus a score-fed predictor (2-rewrite). The rubric’s “no documented split → D” binds.

**Why not B−.** A 2-rewrite cap requires that a test split exist. It is not shown. **Why not C.** C needs some transfer or split. Absolute gains vs best human are sometimes about one point.

### Search method C

Predictor-guided modular search is a real idea. It is not compared to exhaustive recombination under the same budget with a frozen test.

### Evolved object C−

Final systems pick Tree-of-Thought / self-refine, CoT with self-consistency, tool voting, hierarchical memory, DEPS, Voyager. Appendix prompts sometimes retain task names from other environments (template leakage). Recombination table, not a new module.

### RSI 0

**Cite as.** The predictor is the contribution. Do not cite the 17.2% as a held-out architecture result.

---

## 9. Gödel Agent (ACL 2025, arXiv:2410.04444)

**Headline they want.** A self-referential agent that monkey-patches itself recursively self-improves.

### Main table: Eval C−, object C−, RSI 1

DROP, MGSM, MMLU, GPQA. GPQA val 32 / test 166; others val 128 / test 800 (ADAS-like). Up to 30 iterations on validation, six cycles. Self-mod model `gpt-4o-2024-05-13`; reported executor `gpt-3.5-turbo-0125`. Some ADAS-like baselines inherited rather than all rerun under one call budget. A 100-run MGSM analysis: temporary drops are common; a nontrivial fraction finish worse than they started.

Level 2 (val feedback). Model substitution in the *writer vs solver* pair is a compute/model mismatch. Tiny GPQA val. **Why not D.** Test is separate from val. **Why not B−.** The 4o/3.5 split and borrowed rows are not modest misses; they change what the number means. C− is the calibrated letter: C for “split exists,” minus for two serious confounds.

### Unrestricted “free” run: do not grade as harness improvement

The agent “spontaneous[ly] request[s] assistance from more powerful models such as GPT-4o.” Valid under an unrestricted resource objective. Invalid as evidence that the harness got better. Exclude.

### Game of 24: object C

Listing: recurse over permutations and ops until `abs(nums[0]-24)<1e-6`, 100%. Brute force. Score C as a switch from neural guesses to exact search. Do not score as a new algorithm.

### Search method C

Monkey-patch loop, compared in part to ADAS-like systems under mismatched models.

### Evolved objects C−

Multiple chain-of-thought samples, verification, majority vote, role experts. Seed text already mentions debate, dynamic roles, step-back. Instantiating those hints is not discovery.

### RSI 1

Self-edits exist. Measured DV is validation/test Q. No child-quality experiment. 100-run MGSM is evidence of *fragile* Q, which is useful and still level 1.

**Cite as.** Stronger self-reference than ADAS, weaker causal evidence. Drop the free-setting score from same-model tables.

---

## 10. Self-Developing (NAACL 2025, arXiv:2410.15639)

**Headline they want.** An algorithm factory that writes model-merging code, iteratively, improves GSM8K and MATH.

### Eval B−

Dev: 100 GSM8K and 600 MATH. Test: remaining 1,220 and 4,400. Up to 3×3,000 proposals; ~100–300 executable per iteration. Top 15 by *dev* across iterations get one test eval. Seed model openchat-3.5-1210; merges of other 7B task vectors. Task Arithmetic / TIES tuned on a small coefficient grid. No full-search repeats, no test CIs.

Level 2 (dev selection). Held-out remainder is real, so not D. **Why not B.** Top-15 multiple comparison plus search-space mismatch is two misses. **Why not C.** The 100/1220 and 600/4400 cut is documented.

### Search method C

DPO on code preferences (top 3% vs bottom 10%) updates the factory. Not compared to random merge programs in the same `merge_models` grammar at 9,000 tries.

### Evolved object C+

Best GSM8K algorithm (Figure 10): iterative hybrid of identity and a reduced mean with `keepdim=True` broadcasting, plus elementwise product, α=0.5. Unusual relative to vanilla task arithmetic. Missing ablations: mean vs no mean, order, broadcast vs matched-rank projection, bias-vector baseline, per-source contribution. GSM8K 70.1 → 76.1; MATH 0.5 → 8.5, tying the strongest hand merge on MATH.

**Why not B−.** No isolation, so it cannot be a “new mechanism” B. **Why not C.** It is not just another debate graph; the algebra is odd enough to reproduce with ablations.

### RSI 0

Every merge is applied to fixed M0. The improved model is never the next factory. The paper’s “self-developing” language is the factory loop, not recursive model improvement.

**Cite as.** Proper final split, unfair baseline budget, interesting unablated merge. Not RSI.

---

## 11. MaAS (ICML 2025 Oral, arXiv:2502.04180)

**Headline they want.** A query-conditioned supernet beats AFlow at lower cost.

### Eval B−

Train:test 1:4. No separate selection-validation set. MATH 119/486 from 617 level-5 in four categories. GSM8K 264/1055, etc. Controller samples a path through CoT, debate, self-consistency, self-refine, ensemble, testing, ReAct, early exit. Table 1 point estimates, no search-seed bars. Average 83.59 vs AFlow 82.25 on their slice, gpt-4o-mini.

Level 2 (train used for learning and picking). **Why not B.** No val split, no search repeats, MATH subset: minus. **Why not D.** Test is 4/5 of the (already sliced) data.

### Search method B−

This is the letter that moved. The object of design is a *router*, compared to AFlow (another workflow searcher), with cost numbers (MATH train $3.38 vs $22.50 in their table). That is a searcher-vs-searcher control, unlike ADAS vs chain-of-thought. Missing: repeated controller training, a frozen third split. B−, not B.

### Evolved object C

Easy queries early-exit; hard queries get more branches. That is conditional compute over a human operator list. Library ceiling: max C.

### RSI 0

**Cite as.** Routing and cost paper. Not discovery of new agent primitives. Do not compare its MATH number to full MATH.

---

## 12. GEPA (ICLR 2026 Oral, arXiv:2507.19457)

**Headline they want.** Reflective prompt evolution beats GRPO with up to 35× fewer rollouts. Qwen3-8B aggregate 45.23 → 54.85; GPT-4.1 Mini 65.22.

### Main tables: Eval B+, search B, object C+, RSI 0

Splits (App. E.1): HotpotQA/HoVer 150/300/300; IFBench 150/300/294 with unseen constraint types in test; AIME 2022–24 split equally train/val, test AIME-2025 ×5; LiveBench-Math n=368, seed 0, thirds. In practice train = feedback minibatches (size 3), val = Pareto set used for acceptance and final pick. Rollout budgets capped near MIPROv2 (±10%). MIPROv2, Trace, TextGrad, GRPO rerun. No independent full GEPA searches.

Level 2. Paper is explicit: majority of rollouts are validation “solely for candidate selection.” That blocks A and is correctly named.

**Why B+ not B.** Extra A-axis: matched prompt-optimizer budgets and documented splits, including IFBench constraint-type holdout. **Why not A.** Adaptive val plus one search. **35× is not an Eval issue.** It is 24,000/678 on IFBench when GEPA finds a good prompt early. Aggregate budget about 3,936 vs 24,000 (~6×). Abstract “up to 20%” vs body “up to 19%” (HotpotQA 62.33−43.33). GEPA+Merge can *hurt* IFBench (28.23 vs baseline 36.90 on Qwen). Report those as number-reading, not letter changes.

Search method B: reflection on traces plus Pareto sampling, vs MIPROv2 and GRPO, rollout-matched. That is the cohort’s cleanest prompt-searcher comparison.

Object C+: evolved prompts include “do not paraphrase the first hop; retrieve the missing entity.” Portable procedures, not new primitives. Cross-model copy of Qwen-evolved prompts to GPT-4.1 Mini is +9 aggregate (their Table 2). Transfer of a prompt is not a new operator, so not B.

RSI 0: frozen reflection algorithm, frozen weights.

### KernelBench: Eval D

Evolution and reporting on the same 35 representative kernels, thousands of candidate rollouts, no leftover kernel family. Level 3 → D. Same PDF, different experiment.

### Adversarial prepend: Eval C

Trivia-and-format prepends searched on 2022–24, scored on AIME-2025 (pass@1 76%→10% in their demo). Year split exists; it is still a red-team search on the same task family, one narrative run. C, not D (test year hidden) and not B (not a general optimizer claim).

**Cite as.** Best practical prompt-optimizer protocol in the set. Human-designed searcher, not machine-invented reasoning. Never fold KernelBench into the B+.

---

## 13. ACE (ICLR 2026, arXiv:2510.04618)

**Headline they want.** Agentic context engineering matches or beats prompt optimization. AppWorld offline 59.4 vs ReAct+ICL 46.0 and ReAct+GEPA 46.4 (DeepSeek-V3.1).

### Offline: Eval B+, search B, object C, RSI 0

Original train/test splits. Playbook built on train (generator / reflector / curator, reflector ≤5, epochs ≤5), frozen, test pass@1. AppWorld can use execution success without gold; finance without gold can degrade (their Table 2). No full construction repeats.

Level 1 firewall: test never used to write the playbook. **Why B+ not A.** No search repeats. **Why B+ not GEPA-only.** Cleaner test isolation than GEPA’s adaptive val; weaker optimizer-vs-optimizer matching (GEPA `auto="heavy"` is a control, CUGA is a leaderboard footnote, not a fair rerun). Tied with GEPA on Eval, different strengths.

Search method B: structured, incrementally editable context plus a non-LLM merge of delta bullets. That is the authors’ invention. Grade it as the searcher/representation, not as the playbook sentences.

Object C: AppWorld playbooks include identity resolution, collection aggregation, auth vs malformed requests, *and* concrete paths (`/home/[username]/bills/`), Venmo-like APIs, vacation city folders. Those are domain lessons and instance facts. Cheatsheet rule: C, not C+. The original audit’s C+ mixed the updater with the contents. This round splits them.

Latency “−86.9%” is the mean of two numbers (AppWorld offline −82.3%, FiNER online −91.5%), not a suite-wide figure. “+10.6%” is vs selected baselines, not vs ReAct only (+17). Reading issues, not Eval-letter issues.

### Online: Eval C

Sequential on shuffled test: predict, then update from that outcome. Prequential learning. Same Table 1 “test” columns as offline. **Why C not D.** They describe the protocol. **Why C not B.** It must not be compared to frozen held-out systems (including CUGA leaderboard rows) as if it were the same estimand. Compare to other streaming learners with the same feedback timing.

### RSI 0

Outer ACE loop is fixed. Accumulating context is not improving the improvement rule.

**Cite as.** Strongest evidence for structured context as an engineered artifact. Offline number is the one that can sit next to GEPA. Online is a different estimand.

---

## 14. MASS (ICLR 2026, arXiv:2502.02533)

**Headline they want.** Staged block prompts, then topology, then workflow prompts. Gemini 1.5 Pro average 78.79 vs ADAS 69.72 and debate 70.26.

### Eval B−

Distinct val/test subsets (MATH 60/100, several QA sets 50/100, etc.). Ten topologies via rejection sampling, each scored three times on val. Final test mean±SD over **three executions of the chosen workflow**. Inference cost roughly matched across methods. One architecture search, not rerun.

Level 2. **Why B− not B.** Two misses: tiny subsets, and ± that is not search. The previous board’s B ignored the minus rule. This round applies it. **Why not C.** The test split is real and they say what the SD is over, which most papers do not.

### Search method B−

Three-stage design vs optimizing prompts or topology alone, and vs ADAS/AFlow/debate. That is a searcher comparison. Missing: full-benchmark reruns, search seeds. B− with MaAS, above AFlow’s C, because AFlow’s control is weaker and AFlow’s val is rewritten.

### Evolved object C

MATH: aggregate 9. Multi-hop: debate counts. Coding: execute + reflect. Fixed block vocabulary and ordering constraints. “How much and where” to apply known operators. Library ceiling.

### RSI 0

**Cite as.** Stronger *engineering study* than ADAS. Not a new agent algorithm. Not full MATH.

---

## 15. ShinkaEvolve (ICLR 2026, arXiv:2509.19349)

**Headline they want.** Sample-efficient program evolution finds SOTA packing, AIME harnesses, ALE improvements, and a new MoE loss.

Four experiments. Do not give the PDF one Eval.

### Circle packing: Eval B−, search C+, object C

Place 26 circles in a unit square, maximize sum of radii. Search objective is the score (level 3), but the constraint is checkable by anyone. Three runs; two match or beat AlphaEvolve after about 150 evaluations. Verifier slack on the order of 1e−8 if matching AlphaEvolve’s exact check. Recipe: golden-angle / geometric init, SLSQP, simulated annealing, local rotations, reheating, multistart. Parent-sampling, novelty rejection, and bandit LLM ablations are run *here*.

Exact-objective exception: cap C for “search = score,” raised toward B− because of independent checkability and three runs. Object C: standard numerical tools composed well. Search C+ from those packing ablations (not repeated on MoE).

### AIME 2024 search: Eval D. Year transfer: Eval B, object C

Search: all 30 AIME 2024, 75 generations, three evals per candidate, ≤10 LLM calls, gpt-4.1-nano. Level 3 on 2024 → D for that score (34.4% vs base 18.4 / majority@5 24.4 in their reporting).

Transfer to AIME 2023 and 2025 and to stronger models is the usable claim. Eval B: year held out, one search, three inner evals. Object C: three expert personas (T=0.7), skeptics (T=0.1), editor (T=0), majority fallback, seven calls. Known ensemble. Paper notes smaller 2023 gains may be model memorization of old AIME.

### ALE-Bench LITE: Eval B, object C

Ten AtCoder heuristic tasks. Fitness = public score, 50 generations, init = ALE-Agent’s best. Then private score. Mean about +2.3%. Top-5 public → max private 1923.5 → 1927.0 (negligible). ahc039: kd-tree subtree caches (bounding boxes, fish counts), “targeted edge move” toward misclassified fish, 5th → 2nd on a retrospective leaderboard (2880 → 3140). ahc025: caching, fallback estimators, greedy/local search instead of broad annealing. Authors: changes stay close to the init, overfitting risk.

Eval B: public/private split is the right contest protocol. Object C: credible local engineering on ten tasks, not a general new search algorithm. Not B: n=10, init-hugging.

### MoE load-balancing loss: Eval B, object B, search C+, RSI 0

Small: 556M total, 82M active, 64 experts, top-8, >2B FineWeb tokens, λ=0.01, 30 iterations. Fitness: −(CE on last 10M tokens + L1 load imbalance). Large: 2.7B, 404M active, ~30B tokens, λ in {0.001, 0.01, 0.1}, **same 64/8**. Discovered term: global-batch load balancing plus an entropy-scaled hinge `max(0, τ − f)` with `τ = 0.064 / N_E` and `s = 0.5 + (1 − H/log N_E)`. Mean downstream at λ=0.01: 0.362 → 0.368. HellaSwag 0.391 → 0.379, PIQA 0.688 → 0.684, Winogrande 0.524 → 0.549, OpenBookQA 0.170 → 0.192. No extra pretraining seeds. No ablation that removes hinge vs entropy scale vs τ.

**Why object B not A.** Missing seeds, mixed tasks, frozen routing shape, no term ablation. **Why B not B−.** It is a new closed form with a scale-up, not a branded second-place loss. **Why Eval B not B+.** One transfer run, architecture family unchanged. **Why search C+ not B.** Method ablations live on packing.

### RSI 0

Evolution engine, evaluators, proposer models, and research agenda are fixed.

**Cite as.** Strongest evolved *object* in the cohort (MoE). Strongest *search-method ablations* in the cohort (packing only). AIME-2024 in-sample score is D. Do not summarize as one B+.

---

## 16. DGM (ICLR 2026, arXiv:2505.22954)

**Headline they want.** Open-ended self-improving coding agents, 20% → 50% on SWE-bench, 14.2% → 30.7% on Polyglot.

### SWE-bench staged 20% → 50%: Eval D, object C−, RSI 1

Eighty iterations, two parallel on SWE. Implementer: Claude 3.5 Sonnet (New). Diagnoser: o1. Base agent: bash + whole-file view/edit, “intentionally lightweight.” Staging: 10 editability tasks (all Django) → expanded ~50/60 (35 Django, 25 Sphinx; the text says both 50 and 60) → if >40% and top two in the archive, 200 tasks (140+60). Headline 20.0% → 50.0% is on those subsets.

§C.3 diagnosis prompt includes:

```text
# Private Test Patch
SWE-bench's official private tests ... This is not available to the agent during evaluation.
{test_patch}
# Issue Test Results
The test results from SWE-bench using the above official private tests.
{eval_log}
```

Then: “While the private test patch is included in the diagnosis prompt… we have not observed… hardcoding.” Level 4. Eval D. Manual inspection does not remove the leak. Transfer cannot raise *this* number.

Object C−: lineage adds line-range view, string replace, retries, keep valid patches, test-failure feedback, extra model as ranker, history summarization. Standard coding-agent tools. Weak-start rule: max C, C− because the start was stripped on purpose and the 2.5× Q jump mostly restores the obvious.

Search method C: archive, performance-and-novelty parent sampling. The *plan* for each edit is o1 with private tests in context. Credit that external diagnoser. Not B.

RSI 1: the agent writes its own code. DV is SWE subset Q. No child-quality test. Frozen o1 still plans.

### Polyglot extra eval 14.2% → 30.7%: Eval C

Leaderboard-style pass@1, solver never sees hidden tests. Search used 10 then 50 tasks; full-set number is a later pass of the winner. One archive run (the paper’s “three Polyglot runs” in some secondary discussion is not a published distribution for this headline). Eval C: better than SWE D, not a frozen three-way split.

### SWE-grown agent on Polyglot 14.2% → 28.9%: Eval C

Never trained on Polyglot. Real transfer. Object still grown with SWE private tests in o1. Does not wash the 20→50 claim. Model transfer on 200 SWE tasks (o3-mini 23→33, Claude 3.7 19→59.5) mixes a 200-slice that includes the search 60; treat as C, and note the jump on Claude 3.7 is consistent with filling scaffold holes that a strong model can use.

**Cite as.** Negative-control Eval case: how not to validate RSI. Useful as “automated search can rebuild a normal coding harness from a stripped shell.” Not novel tools, not measured improvement-of-improvement.

---

## 17. HGM (ICLR 2026 Oral, arXiv:2510.21614)

Full name: Huxley–Gödel Machine. **Headline they want.** Clade metaproductivity approximates a Gödel machine; human-level coding agent design.

### CMP vs DGM/SICA on Verified-60 / Polyglot: Eval C+, search B, object C, RSI 1

Follows DGM’s 60-slice and Polyglot no-hidden-test solver setting. Budget on the order of 800 task-evals in the comparison. Thompson sampling on pooled descendant pass rate `n_success / (n_success + n_failure)` over the clade. Expansion and evaluation are decoupled.

Eval C+: inherited 60-slice (35 Django / 25 Sphinx in DGM’s list), not a new frozen split, but they compare search *policies* rather than claiming a new SWE SOTA here. Search B: specified estimator, control is DGM/SICA (other tree searchers). Block on B+: “empirical CMP” in the correlation plot is max descendant score excluding the parent, computed after the tree exists. Online CMP is pooled pass rate. Those are different (rubric U3). Object C: the evolved harness in this setting is still a coding agent with standard parts.

### 8,000 evals on all 500 Verified: Eval D

Start raised to 53.2%. After 8,000 evaluations, 61.4% on the same 500. Authors write that higher leaderboard scores “do not necessarily indicate superior general coding ability” because agents may overfit. Level 3. Eval D. Search method can stay B; this experiment does not *measure* the searcher on a leftover set.

### Lite-207: Eval C+, object C

300 Lite tasks, 93 overlap Verified, 207 leftover. GPT-5-mini: ancestor 34.8% → HGM agent 40.1% vs SWE-agent 39.6% (filtered); standard Lite 44.0 → 49.0 vs 47.6. One run. Honest overlap cut is why this is C+ not C. The 0.5 point over SWE-agent under the same backbone is the right human-harness comparison; it is small. GPT-5 backbone numbers mix harness and model; Eval C for that transfer.

### `attempt_error_resolution`: object D

Appendix F, quoted behavior: append `Would attempt to install Python module: {module}`; comment “skip actual installation to avoid side effects”; append `Would attempt to fix syntax error…`; “This is just a demonstration of what could be done”; `return True, "Automated resolution attempted:…"`. Functionality check fails. Object D for this artifact. Do not use it as evidence of long-horizon self-modification. This does not pull the CMP searcher down from B.

### RSI 1

CMP is the right *idea* for level 2 (value of a node as a parent). The measurement is still descendant *task* success on SWE/Polyglot, not child quality as improvers under hidden traces and a matched mutation budget. Assumption 1 in the paper even defines quality as the final agent’s evaluation score. That is Q, by construction.

**Cite as.** Best search-method paper for “do not pick parents by current score alone.” Worst showcased evolved snippet in the cohort. Mixed Eval: C+ when they filter overlap, D when they search the reported 500.

---

## 18. Cohort tables (for quoting)

### Eval, best clean experiment vs abstract headline

| Paper | Best experiment you may cite | Its Eval | Headline to refuse or qualify |
|---|---|---|---|
| PromptBreeder | Leftover/official test prompts | B− | Same-model vs OPRO 80.2 |
| GPTSwarm | MMLU five-seed +2.1 | C | MiniCrosswords 0.575; GAIA |
| STOP | LPN five-run self-ref | B | “RSI” without their own disclaimer |
| DiscoPOP | AlpacaEval/TL;DR as held-out | B | “State of the art” LRML |
| ADAS | Val→test (not ARC SOTA) | B− | ARC without Easy ≤5×5 |
| AFlow | 80% test | B− | “Frozen 20% val” without the variance filter |
| AgentSquare | — | D | 17.2% as held-out |
| Gödel Agent | Restricted table only | C− | Free GPT-4o score |
| Self-Developing | Remainder test | B− | Recursive model improvement |
| MaAS | 1:4 test | B− | Full MATH; new operators |
| GEPA | Main six tasks | B+ | KernelBench; 35× as typical |
| ACE | Offline | B+ | Online as static test; CUGA as a peer |
| MASS | Val→test | B− | ± as search uncertainty |
| ShinkaEvolve | MoE scale-up; ALE private | B | AIME-2024 in-sample; one PDF-wide SOTA |
| DGM | Polyglot extra / cross-bench | C | SWE 20→50 as held-out RSI |
| HGM | Lite-207; policy vs DGM on 60 | C+ | 61.4% on 500; error-resolution |

### Discovery, split

| Paper | Search method | Evolved object | One-line |
|---|---|---|---|
| PromptBreeder | C | C | Prompt-sensitive model, odd strings |
| GPTSwarm | C | C | Graph tuning among named nodes |
| STOP | B− | C | Loop is the result; children are textbook |
| DiscoPOP | C | B− | Real loss, not the table winner |
| ADAS | C | C | Code search of known patterns |
| AFlow | C | C | MCTS on a human menu |
| AgentSquare | C | C− | Recombination + leakage |
| Gödel Agent | C | C− | Self-edit, stock ensembles |
| Self-Developing | C | C+ | Odd merge, no isolation |
| MaAS | B− | C | Router, not new ops |
| GEPA | B | C+ | Best prompt searcher; recipes not primitives |
| ACE | B | C | Best context *representation*; cheatsheet contents |
| MASS | B− | C | Staging helps; blocks are known |
| ShinkaEvolve | C+ | B / C | MoE B; harnesses C |
| DGM | C | C− | o1-planned rebuild of a normal agent |
| HGM | B | C / D | CMP B; resolver D |

### RSI

All 0 except PromptBreeder, STOP, Gödel Agent, DGM, HGM at 1. Empty at 2.

---

## 19. What would move a letter

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

Until those exist, the boxed summary of the original audit still holds, now with letters that do not average a clean table with a dirty one:

Automated search can improve prompts, workflows, and wrappers. It can sometimes emit an interesting technical object (MoE loss; weaker preference loss and merge heuristic). It has not been shown to recursively become better at improving itself.
