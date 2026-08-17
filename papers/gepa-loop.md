# GEPA loop (published code)

Letters and the two scored experiments: [`gepa.md`](gepa.md).

**Code pin:** https://github.com/gepa-ai/gepa (commit [`a477710`](https://github.com/gepa-ai/gepa/commit/a477710bb605e5e8cf0b75afa2832aeb5da256aa), fetched 2026-08-16).

## What this library is

`gepa-ai/gepa` is an optimizer. It rewrites a dictionary of named instruction strings. It is not the ICLR 2026 HotpotQA / IFBench / HoVer / PUPA harness. Those scripts are not in this repository. KernelBench / NPUEval protocol facts stay on the grade card.

A **rollout** is one full run of the current instructions on one example (model calls, tools, score). The engine counts those calls against a budget.

## What a candidate is

A candidate is `dict[str, str]`: module name → instruction text. It is not model weights. The seed is that dictionary plus a first pass over validation.

Train examples produce traces for the reflection LM. Validation scores pick the next parent and the program the run returns. In the paper those splits are \(D_{feedback}\) (train minibatches) and \(D_{pareto}\) (validation). The library names them `trainset` on the reflective proposer and `valset` on `GEPAEngine`.

Code types at this pin, after the ordinary names: `ParetoCandidateSelector`, `CurrentBestCandidateSelector`, `RoundRobinReflectionComponentSelector`, `ReflectiveMutationProposer`, `MergeProposer`, `StrictImprovementAcceptance`, `FullEvaluationPolicy`. The orchestrator is `GEPAEngine.run` in `src/gepa/core/engine.py`.

## One pass

Order below is `GEPAEngine.run` after the seed has been scored on validation, not Algorithm 1 if they ever diverge.

### Parent pick

`ParetoCandidateSelector` builds, for each validation item, the set of candidates that are undominated-best on that item, drops dominated programs, then samples a parent in proportion to how often it appears on that front (`select_program_candidate_from_pareto_front` in `src/gepa/gepa_utils.py`). A candidate that is uniquely best on many val items is drawn more often.

`CurrentBestCandidateSelector` instead returns argmax mean val (`idxmax` on `program_full_scores_val_set`). That is the SelectBestCandidate ablation on the grade card, not the default.

**Sketch (not a real item):** Three candidates on two val items. A is best only on item 1; B is best only on item 2; C is never uniquely best. The next parent is A or B with equal chance, not C.

### Merge vs mutate

If a merge proposer is attached and `use_merge` is on, and `merges_due > 0`, and the previous iteration added a program, the engine tries merge **first**. Merge is not an LLM. `MergeProposer` picks two lineages that share an ancestor and splices module strings: keep a module from parent 1 or parent 2 when one still matches the ancestor and the two parents differ.

If the merge subsample passes the gate below, the engine full-evals, adds the child, and **skips reflection this iteration**. If merge is not scheduled, `propose` returns nothing, or the subsample fails, reflection runs (a failed merge still `continue`s and skips reflection in this pin — that is the “old behavior” comment in `engine.py`).

### Module pick

`RoundRobinReflectionComponentSelector` stores, per candidate, which named module to touch next. It returns that one name and advances the pointer modulo the number of modules.

### Reflective rewrite

`ReflectiveMutationProposer` samples a train minibatch (default `reflection_minibatch_size=3` in `src/gepa/api.py`), rolls out the parent with traces, then a reflection LM writes a new instruction for the chosen module. The default template in `src/gepa/strategies/instruction_proposal.py` tells the LM to identify niche and domain-specific facts from the traces and put them in the instruction, including a generalizable strategy if one showed up.

### Minibatch gate

Reflective child, default `StrictImprovementAcceptance`: sum of minibatch scores after the rewrite must be **strictly greater** than the parent’s sum on the same minibatch. Only then does selection send the child to full validation.

Merge child, in `GEPAEngine.run`: let `parent_sums` be the two parents’ subsample totals and `new_sum` the merged program’s subsample total. Accept if `new_sum >= max(parent_sums)` (at least as good as the better parent on that subsample). Then full val. This is ≥, not a strict improvement, and it is compared to the max parent, not to “improved on the minibatch” as a vague phrase.

### Promote

`_run_full_eval_and_add` scores the child on the validation ids the eval policy asks for. Default `FullEvaluationPolicy.get_eval_batch` returns every val id. The child is appended to the pool. Merge decrements `merges_due` only on accept.

### Return

When the stop callback fires, `val_evaluation_policy.get_best_program(state)` picks the returned program. `FullEvaluationPolicy` chooses the candidate with the highest mean of evaluated val scores, breaking ties toward more coverage.

## Code vs paper

Merge acceptance in this pin is `new_sum >= max(parent_sums)` in `src/gepa/core/engine.py`, not a strict minibatch improvement:

```python
if new_sum >= max(parent_sums):
    new_idx, _ = self._run_full_eval_and_add(
        new_program=proposal.candidate,
        state=state,
        parent_program_idx=proposal.parent_program_ids,
    )
```

Reflective acceptance is the strict sum test:

```python
old_sum = sum(proposal.subsample_scores_before or [])
new_sum = sum(proposal.subsample_scores_after or [])
return new_sum > old_sum
```

A failed merge still skips reflection for that iteration (`continue` after the reject log). The paper’s “improved on the minibatch” language does not distinguish those two gates.

The public tree also contains adapters and tutorials that are not Table 1 (next section). They do not change the scored ICLR protocols.

## Not the ICLR experiment

`optimize_anything`, the AIME prompt example (`src/gepa/examples/aime.py`), ComBEE large-minibatch reflection, Terminal-Bench / MCP / RAG / LangChain adapters, and `gskill` live in this library. They are not the ICLR 2026 four-task tables and not the KernelBench/NPUEval protocol on the grade card.
