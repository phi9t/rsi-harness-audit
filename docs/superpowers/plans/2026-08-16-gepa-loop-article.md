# GEPA Loop Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `papers/gepa-loop.md`, a code-first walk of the published GEPA optimizer in `gepa-ai/gepa`, without changing letters.

**Architecture:** Fetch the official library to a throwaway clone (do not vendor it). Walk `GEPAEngine.run` in code order. Keep `papers/gepa.md` as the grade card with one pointer. Pin URL, commit, and fetch date on the article.

**Tech Stack:** Markdown in `/Users/phi9t/rsi-harness-audit`. Official source: https://github.com/gepa-ai/gepa. No new runtime.

**Spec:** `docs/superpowers/specs/2026-08-16-gepa-loop-article-design.md`

---

## File map

| File | Responsibility |
|---|---|
| Create: `papers/gepa-loop.md` | Loop walk, pin, code-vs-paper, later extras named as not ICLR |
| Modify: `papers/gepa.md` | One pointer to `gepa-loop.md` in the control-flow section; no grade-table edits |
| Modify: `papers/README.md` | Link the loop article next to GEPA |
| Unchanged | `RUBRICS.md`, other `papers/*.md`, `PEDANTIC_CORRECTION_PASS.md` |

## Frozen letters

Do not edit Eval / Search / Object / RSI letters, plus/minus rules, or calibration. `papers/gepa.md` grade table and binding reasons stay byte-identical except the new pointer sentence.

## Pin recorded while writing this plan

Shallow clone of https://github.com/gepa-ai/gepa on 16 August 2026:

- **Commit:** `a477710bb605e5e8cf0b75afa2832aeb5da256aa` (`a477710`, message: Fix trace-aware batch evaluation for accepted candidates)
- **Loop file:** `src/gepa/core/engine.py` (`GEPAEngine.run`, from “Main loop”)
- **Parent pick:** `src/gepa/strategies/candidate_selector.py`, `src/gepa/gepa_utils.py` (`select_program_candidate_from_pareto_front`)
- **Module pick:** `src/gepa/strategies/component_selector.py`
- **Reflection:** `src/gepa/proposer/reflective_mutation/reflective_mutation.py`, default template in `src/gepa/strategies/instruction_proposal.py`
- **Merge:** `src/gepa/proposer/merge.py`; engine gate at `engine.py` (`new_sum >= max(parent_sums)`)
- **Minibatch gate (reflective):** `src/gepa/strategies/acceptance.py` (`StrictImprovementAcceptance`)
- **Return:** `src/gepa/strategies/eval_policy.py` (`FullEvaluationPolicy.get_best_program`); engine calls it at end of `run`

If HEAD at implementation time is still `a477710`, paste the article in Task 1 as written. If HEAD moved, re-read those same paths, update the pin, and change only sentences that the new code falsifies.

Do not clone into this git repo. Use `/tmp/gepa-ai-gepa` or equivalent.

---

### Task 1: Fetch pin and write `papers/gepa-loop.md`

**Files:**
- Create: `papers/gepa-loop.md`

- [ ] **Step 1: Clone and confirm the pin**

```bash
rm -rf /tmp/gepa-ai-gepa
git clone --depth 1 https://github.com/gepa-ai/gepa.git /tmp/gepa-ai-gepa
git -C /tmp/gepa-ai-gepa rev-parse HEAD
git -C /tmp/gepa-ai-gepa log -1 --oneline
```

Expected: a SHA printed. If it equals `a477710bb605e5e8cf0b75afa2832aeb5da256aa`, use the article body in Step 3 unchanged (update only the fetch date if the calendar day changed). If it differs, open `src/gepa/core/engine.py` around `def run` / “Main loop”, plus the strategy files listed above, and patch only falsified sentences in Step 3.

- [ ] **Step 2: Confirm the four-task harness is still absent**

```bash
rg -n 'HotpotQA|IFBench|HoVer|PUPA' /tmp/gepa-ai-gepa --glob '!tests/**' --glob '!*.md' | head
```

Expected: no paper four-task training scripts. Mentions in docs/tests are fine. Do not invent harness files.

- [ ] **Step 3: Write `papers/gepa-loop.md`**

Write this file. Keep Unicode (curly apostrophes, ≥). Do not retype grade letters. Do not add SOTA tables.

If the pin is still `a477710`, the body is:

```markdown
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
```

- [ ] **Step 4: Confirm required headings and pin**

```bash
rg -n '^# GEPA loop|^## What this library is|^## What a candidate is|^## One pass|^### Parent pick|^### Merge vs mutate|^### Module pick|^### Reflective rewrite|^### Minibatch gate|^### Promote|^### Return|^## Code vs paper|^## Not the ICLR experiment' /Users/phi9t/rsi-harness-audit/papers/gepa-loop.md
rg -n 'a477710|fetched 2026-08-16|B\+|Eval D' /Users/phi9t/rsi-harness-audit/papers/gepa-loop.md
```

Expected: all section headings present. Pin commit and fetch date present. No `B+` or `Eval D` in the loop article (letters stay on the grade card). `gepa.md` in the pointer line is required.

- [ ] **Step 5: Commit**

```bash
git add papers/gepa-loop.md
git commit -m "$(cat <<'EOF'
Add a code-first walk of the published GEPA optimizer loop.

Pin gepa-ai/gepa so parent pick, merge-vs-reflection, and the two minibatch gates are checkable.
EOF
)"
```

---

### Task 2: Pointers from the grade card and paper index

**Files:**
- Modify: `papers/gepa.md`
- Modify: `papers/README.md`

- [ ] **Step 1: Insert a pointer in `papers/gepa.md` immediately after the `## Control flow (from published code)` heading**

The heading is currently followed by:

```markdown
Official `gepa-ai/gepa` is the optimizer library. The paper’s four-task harnesses are not checked in. The loop in `src/gepa/core/engine.py` matches Algorithm 1.
```

Replace that first paragraph with:

```markdown
How the published optimizer runs, in code order, is in [`gepa-loop.md`](gepa-loop.md). Official `gepa-ai/gepa` is the optimizer library. The paper’s four-task harnesses are not checked in. The loop in `src/gepa/core/engine.py` matches Algorithm 1.
```

Do not change the experiments table, Table 1 numbers, Eval/Search/Object/RSI sections, or “Cite as / do not cite as.”

- [ ] **Step 2: Link the article in `papers/README.md`**

Replace the GEPA table row:

```markdown
| [GEPA](gepa.md) | 2507.19457 | [gepa-ai/gepa](https://github.com/gepa-ai/gepa) | B+ | B | C+ | 0 |
```

with:

```markdown
| [GEPA](gepa.md) ([loop](gepa-loop.md)) | 2507.19457 | [gepa-ai/gepa](https://github.com/gepa-ai/gepa) | B+ | B | C+ | 0 |
```

Do not change other rows.

- [ ] **Step 3: Confirm letters unchanged**

```bash
git diff -- papers/gepa.md papers/README.md
rg -n 'B\+|C\+|Eval D' /Users/phi9t/rsi-harness-audit/papers/gepa.md | head
```

Expected: `gepa.md` diff is one paragraph; grade table letters still B+ / B / C+ / 0. README diff is one table cell.

- [ ] **Step 4: Commit**

```bash
git add papers/gepa.md papers/README.md
git commit -m "$(cat <<'EOF'
Point the GEPA grade card and paper index at the loop article.

Keep letters on gepa.md; send readers who want the optimizer walk to gepa-loop.md.
EOF
)"
```

---

### Task 3: Done-when checks

**Files:** none unless a check fails — then fix only the named file.

- [ ] **Step 1: Article exists with pin and loop coverage**

```bash
test -f /Users/phi9t/rsi-harness-audit/papers/gepa-loop.md
rg -n 'a477710|fetched |Parent pick|Merge vs mutate|Module pick|Reflective rewrite|Minibatch gate|Promote|Return' /Users/phi9t/rsi-harness-audit/papers/gepa-loop.md
rg -n 'optimize_anything|AIME' /Users/phi9t/rsi-harness-audit/papers/gepa-loop.md
rg -n 'B\+|Eval D|61\.28' /Users/phi9t/rsi-harness-audit/papers/gepa-loop.md
```

Expected: file exists; all loop subsection names present; extras named; no grade letters or Table 1 aggregates in the loop article.

- [ ] **Step 2: Pointers**

```bash
rg -n 'gepa-loop.md' /Users/phi9t/rsi-harness-audit/papers/gepa.md /Users/phi9t/rsi-harness-audit/papers/README.md
```

Expected: both files mention `gepa-loop.md`.

- [ ] **Step 3: Diff scope**

```bash
git diff main --name-only
git diff main -- RUBRICS.md PEDANTIC_CORRECTION_PASS.md papers/ace.md papers/hgm.md
```

Expected: `RUBRICS.md`, `PEDANTIC_CORRECTION_PASS.md`, and other paper files show no diff. Allowed names: `papers/gepa-loop.md`, `papers/gepa.md`, `papers/README.md`, plus this spec/plan if they are on the branch.

- [ ] **Step 4: Commit only if a check forced a fix**

If all checks passed, do not make an empty commit.

---

## Self-review (spec coverage)

| Spec section | Task |
|---|---|
| `papers/gepa-loop.md` with pin | 1 |
| Loop walk in code order | 1 |
| Code vs paper quotes | 1 |
| Later extras, not ICLR | 1 |
| Missing four-task scripts | 1 |
| Pointers; letters frozen | 2–3 |
| No vendor of gepa-ai/gepa | 1 clone to `/tmp` |
| Out of scope (RUBRICS, PEDANTIC, other papers) | 3 |
