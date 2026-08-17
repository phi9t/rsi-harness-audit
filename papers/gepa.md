# GEPA (Genetic-Pareto)

**Venue:** ICLR 2026 Oral  
**arXiv:** 2507.19457  
**Preprint:** https://arxiv.org/abs/2507.19457  
**Code:** https://github.com/gepa-ai/gepa (library implementing the loop; paper HotpotQA/IFBench/HoVer/PUPA scripts are not in this repo)

## Experiments scored

| Experiment | See | Eval | Search method | Evolved object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Main four tasks, Qwen3-8B / GPT-4.1 Mini | 2 | **B−** | **B** | **C+** | 0 | Train/val/test exist (HoVer 150/300/300). Val is \(D_{pareto}\), scored every round. “Optimal test” envelopes fail test monitoring, so matched MIPROv2 rollouts cannot supply plus. Search not repeated. Prompts are task recipes (taxonomy 4). |
| Inference-time search: KernelBench 35 kernels (+ NPUEval) | 3 | **D** | **B** | **C** | 0 | Paper puts the same task list in both \(D_{train}\) and \(D_{pareto}\) so GEPA can “overfit” that set. Search and headline share the 35 KernelBench kernels. |

Letters match the [`GRADE_BOARD.md`](../GRADE_BOARD.md) grade board. The preprint does **not** contain AIME / LiveBench-Math splits or an adversarial AIME prepend; those rows are not graded.

## What they claim

Abstract: reflective prompt evolution beats GRPO by up to 19% (body; abstract says “up to 20%”) with up to 35× fewer rollouts, and beats MIPROv2 by over 10% across two LLMs.

Table 1 (test):

| | HotpotQA | IFBench | HoVer | PUPA | Aggregate |
|---|---|---|---|---|---|
| Qwen3-8B baseline | 42.33 | 36.90 | 35.33 | 80.82 | 48.85 |
| Qwen3-8B GRPO | 43.33 | 35.88 | 38.67 | 86.66 | 51.14 |
| Qwen3-8B MIPROv2 | 55.33 | 36.22 | 47.33 | 81.55 | 55.11 |
| Qwen3-8B GEPA | **62.33** | 38.61 | **52.33** | **91.85** | **61.28** |
| Qwen3-8B GEPA+Merge | 64.33 | **28.23** | 51.67 | 86.26 | 57.62 |
| GPT-4.1 Mini baseline | 38.00 | 47.79 | 46.33 | 78.57 | 52.67 |
| GPT-4.1 Mini MIPROv2 | 58.00 | 49.15 | 48.33 | 83.37 | 59.71 |
| GPT-4.1 Mini GEPA | 69.00 | 52.72 | 51.67 | 94.47 | 66.97 |
| GPT-4.1 Mini GEPA+Merge | 65.67 | **55.95** | **56.67** | **96.46** | **68.69** |

HotpotQA 62.33 − 43.33 is the “up to 19%” vs GRPO. GEPA+Merge **hurts** Qwen IFBench (28.23 vs baseline 36.90). That is a number-reading issue, not an Eval-letter change.

**35× is IFBench-only:** GEPA’s reported “optimal test” rollout counts are 6,438 / **678** / 6,858 / 2,157 vs GRPO’s fixed 24,000. 24,000/678 ≈ 35.4×. Mean of those four GEPA counts ≈ 4,033 vs 24,000 (~6×), not 35×. Most of GEPA’s counted rollouts are validation “solely for candidate selection”; train-only counts to those same test peaks are 737 / 79 / 558 / 269.

MIPROv2 `auto=heavy` (18 instructions × 18 few-shot sets) spent 2,270–6,926 rollouts; GEPA is capped to that budget, discrepancy always within 10.15%. Experimental controls in Table 1 are Baseline, MIPROv2, GRPO, GEPA, GEPA+Merge, plus SelectBestCandidate in Table 2. Trace and TextGrad are related-work mentions, not rerun rows.

## Eval / search method / evolved object / RSI

**Eval B− (main).** Level 2: test is held out; validation is not. Paper §4: train is fully readable; val scores may be monitored but val *text* is restricted; the algorithm does not score test for parent pick. Table 1 winner is val. Test-vs-budget figures and “optimal test” rollout counts (6,438 / 678 / 6,858 / 2,157) fail test monitoring: plus cannot be claimed from that envelope, and with no search repeats that is two hygiene misses → B−. MIPROv2 budgets still keep Search at B. Missing: independent full GEPA searches; no ± over search.

**Eval D (KernelBench / NPUEval).** Level 3. §6: pass the tasks to be solved as the training set, “ensuring that both \(D_{train}\) and \(D_{pareto}\) contain the full set of tasks” so GEPA can “overfit” them. KernelBench: 35 tasks from the representative subset, Sequential5 agent, GPT-4o, \(fast_1\) from ~0% to >20%. Same PDF, different experiment. Do not fold into the main B−.

**Search method B.** Specified loop: Pareto parent sampling, round-robin module pick, reflective mutation, optional system-aware merge. Compared to other *searchers* (MIPROv2, GRPO) under a shared rollout cap, plus an ablation vs SelectBestCandidate (+6.4 aggregate on Qwen). That is the cohort’s cleanest prompt-searcher comparison. Not B+: one search per cell; merge hyperparameters were not retuned for Qwen.

**Evolved object C+.** Appendix I prompts are detailed task procedures. HotpotQA hop-2 (Qwen, GEPA+Merge): target documents not found in hop 1; identify missing entities; do not duplicate the original question. Portable relative to “just add CoT.” Not B: not a new operator; hop-2 text also names example entities (“Carhartt,” “Aubrey O’Day”). Cross-model *copy* of a Qwen prompt onto GPT-4.1 Mini is not a Table 1/2 result in this preprint (Table 2 is Pareto vs SelectBestCandidate).

**RSI 0.** Frozen outer algorithm. Weights of the task model are not the searcher (GRPO is the weight-space *baseline*). No child-quality experiment.

## Control flow (from published code)

How the published optimizer runs, in code order, is in [`gepa-loop.md`](gepa-loop.md). Official `gepa-ai/gepa` is the optimizer library. The paper’s four-task harnesses are not checked in. The loop in `src/gepa/core/engine.py` matches Algorithm 1.

**Models.** Task modules: Qwen3-8B (T=0.6, top-p 0.95, top-k 20) or GPT-4.1 Mini (T=1.0), same model in every module of a run. Reflection LM: a separate callable (`reflection_lm` / `StatelessReflectionLM`) that rewrites one module’s instruction from traces. GRPO baseline: LoRA on Qwen3-8B, 500 steps × group 12 × 4 instances = 24,000 rollouts; val every 20 steps for early stopping. Merge is not an LLM: it splices module strings from two lineages that share an ancestor.

**Parent pick.** `ParetoCandidateSelector` samples a candidate in proportion to how often it is undominated-best on a val instance (`select_program_candidate_from_pareto_front`). Ablation: `CurrentBestCandidateSelector` = argmax mean val.

**Mutation.** `RoundRobinReflectionComponentSelector` picks the next named module. `ReflectiveMutationProposer` draws a train minibatch (paper: size 3), rolls out the parent with traces, then the reflection LM writes a new instruction. Default reflection template tells the LM to “identify all niche and domain specific factual information about the task and include it in the instruction.” Merge (`MergeProposer`), when enabled, is attempted first if the previous iteration added a program, at most 5 times in the paper.

**Score / promote.** Reflective child: `StrictImprovementAcceptance` — sum of minibatch scores must be **strictly greater** than the parent’s, then full valset eval and add to the pool. Merge child: subsample sum must be ≥ both parents, then full valset. Returned program: `FullEvaluationPolicy.get_best_program` = highest mean val score among candidates.

Code vs paper (does not move letters): the public repo has grown extra engines (optimize-anything, AIME tutorial). Paper experiments remain the four-task + KernelBench/NPUEval protocols above. Merge acceptance is ≥ on the subsample (code) vs the paper’s “improved on the minibatch” language.

Quote that locks Eval B− rather than A or B+:

> “the majority of GEPA’s counted rollouts are allocated to the validation set, where scores are utilized solely for candidate selection and not for producing learning signals.”

Quote that locks KernelBench D:

> “ensuring that both \(D_{train}\) and \(D_{pareto}\) contain the full set of tasks. This way, GEPA can ‘overfit’ the set of tasks”

## Reconstructable protocol

Population of module instructions. Each round: Pareto parent sample from val instance-wise undominated set; round-robin module; minibatch traces on train (\(D_{feedback}\), size 3); reflection LM rewrites one instruction; StrictImprovementAcceptance on the minibatch then full val; optional ancestor merge. Returned program: highest mean val. KernelBench/NPUEval put the same tasks in \(D_{train}\) and \(D_{pareto}\).

## Train/test audit

Main four tasks: documented train / val / test (HoVer 150/300/300; IFBench 150/300/294). Selection is val. Test-vs-budget and “optimal test” envelopes are researcher-level test monitoring. KernelBench 35: See 3.

## Artifact audit

Taxonomy 4: hop-2 retrieval rules (do not paraphrase hop 1; target the missing entity; avoid duplicate queries). Portable relative to CoT. Not a new operator. Merge can hurt (Qwen IFBench 28.23).

## Precise verdict

Supported: trace-driven prompt evolution with a real test split, vs MIPROv2/GRPO under a shared rollout cap. Not established: untouched confirmatory test, 35× as a typical ratio, KernelBench transfer, RSI.

## Cite as / do not cite as

**Cite as.** Best practical prompt-optimizer protocol in this cohort that still has a real test split: honest adaptive-val, MIPROv2/GRPO under a shared rollout cap. Eval B− because of test-oracle envelopes. Human-designed searcher (reflection + Pareto).

**Do not cite as.** Typical 35× savings (that is IFBench 678 vs 24,000). KernelBench/NPUEval as held-out kernel generalization. Merge as uniformly helpful (Qwen IFBench 28.23). RSI. AIME or LiveBench results from this PDF. Trace/TextGrad as Table 1 controls.
