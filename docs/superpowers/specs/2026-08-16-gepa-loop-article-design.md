# GEPA loop article — design

**Date:** 16 August 2026  
**Status:** approved in chat; awaiting spec review before the implementation plan  
**Repo job this serves:** let a reader know a lot more about GEPA from the ICLR 2026 paper and, especially, from the official `gepa-ai/gepa` code, without reopening letters.

## 1. Problem

`papers/gepa.md` is a grade card. It already names the loop (Pareto parent pick, round-robin module, reflective mutation, optional merge, minibatch then full val) and notes that the four-task paper scripts are not in the public library. That is enough to score the paper. It is not enough to understand the optimizer.

A reader who wants “how GEPA actually searches” has to bounce between a short control-flow section, Algorithm 1 in the PDF, and a library that has since grown extras (optimize-anything, AIME tutorial) that are not the ICLR experiment.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Product | One new article, paper + code, code-first |
| Path | `papers/gepa-loop.md` |
| Grade card | `papers/gepa.md` stays. One pointer to the loop article. No letter edits |
| Grades in the article | Pointer only. Do not re-argue B+, KernelBench D, search B, object C+, RSI 0 |
| Code scope | Published loop in `gepa-ai/gepa`. Later extras: one sentence, not their own sections |
| Missing harness | State that HotpotQA / IFBench / HoVer / PUPA scripts are not in this repo. Do not invent them |
| Source | Fetch official `gepa-ai/gepa`. Code wins if it disagrees with the current control-flow paragraph. Still no letter change |
| Quotes | Snippets only when code differs from the paper, or when the paper leaves a step implicit |
| Letters | Frozen. No RUBRICS.md letter edits |
| Other papers | Untouched |
| v1 trail | `PEDANTIC_CORRECTION_PASS.md` untouched |
| Vendor | Do not copy the GEPA repo into this audit |

## 3. Files to create or change

| File | Action |
|---|---|
| `papers/gepa-loop.md` | Create. Loop walk pinned by fetch date and git commit |
| `papers/gepa.md` | Add a pointer to `gepa-loop.md` near the existing control-flow section. Do not change the grade table or binding reasons |
| `papers/README.md` | Link the loop article next to GEPA |
| `docs/superpowers/specs/2026-08-16-gepa-loop-article-design.md` | This spec |
| `RUBRICS.md` | Unchanged |
| `papers/*.md` except `gepa.md` and `README.md` | Unchanged |
| `PEDANTIC_CORRECTION_PASS.md` | Unchanged |

## 4. Reader path

1. Letters and “cite as / do not cite as”: `papers/gepa.md`.
2. How the published optimizer runs: `papers/gepa-loop.md`.
3. Official task sets GEPA used a slice of (IFBench; HotpotQA/HoVer stay cohort-only in `BENCHMARKS.md`): `BENCHMARKS.md` and the IFBench card under `benchmarks/`.

Do not merge those jobs. The loop article is not a second grade board.

## 5. Article outline (`papers/gepa-loop.md`)

```markdown
# GEPA loop (published code)

Letters and the two scored experiments: [`gepa.md`](gepa.md).
**Code pin:** https://github.com/gepa-ai/gepa (commit `…`, fetched YYYY-MM-DD).

## What this library is
## What a candidate is
## One pass
## Code vs paper
## Not the ICLR experiment
```

### What this library is

`gepa-ai/gepa` is the optimizer: it rewrites named instruction strings. It is not the paper’s HotpotQA / IFBench / HoVer / PUPA harness. Those scripts are not in this repo. KernelBench/NPUEval protocol facts stay on the grade card.

### What a candidate is

A candidate is a set of named module instruction strings, not model weights. A **rollout** is one full run of those modules on one example. Train minibatches produce traces for the reflection LM. Validation scores pick the next parent and the program the run returns.

Name the code types as they exist at the pin (for example `ParetoCandidateSelector`, `ReflectiveMutationProposer`, `MergeProposer`, `StrictImprovementAcceptance`, `FullEvaluationPolicy`) after the ordinary-words description.

### One pass

Walk the loop in **code order**, not Algorithm-1 order if they differ. Cover, each in its own short subsection:

1. **Parent pick.** How a candidate is sampled from the Pareto set (undominated-best on val instances). Contrast with argmax mean val only if that class exists in the pin.
2. **Merge vs mutate.** When merge runs (not an LLM: splice module strings from two lineages that share an ancestor). When reflection runs instead.
3. **Module pick.** Round-robin over named modules.
4. **Reflective rewrite.** Train minibatch, traces, reflection LM writes a new instruction. Default template: include niche/domain facts from traces.
5. **Minibatch gate.** Reflective child: sum of minibatch scores must be strictly greater than the parent’s. Merge child: the rule the pin actually implements (≥ both parents on a subsample, or whatever the code does).
6. **Promote.** Full valset eval; add to the pool.
7. **Return.** Highest mean val among candidates (`get_best_program` or the pin’s equivalent).

### Code vs paper

Only disagreements or paper-implicit steps. Quote a snippet only for those. Known starting points from the grade card (re-check at fetch; code wins):

- Merge acceptance language vs code.
- Extra engines in the public repo that are not Table 1.

If the fetch finds further diffs, add them here. Do not change letters.

### Not the ICLR experiment

One short section: optimize-anything, AIME tutorial, or other later engines exist in the library and are not the ICLR 2026 four-task or KernelBench protocols.

## 6. Language

Same as the map and grade files: concise, precise, plain English. First use of a needed term is ordinary words, then the term, then a GEPA fact. Do not invent a second glossary. Do not copy real benchmark items. Synthetic sketches only if a step needs an example, labeled **not a real item**.

## 7. Out of scope

- Moving any letter
- Rewriting the rest of `papers/gepa.md` (piece 2 for other papers; this pass is a companion article)
- Re-fetching the 47 benchmark cards
- Vendoring `gepa-ai/gepa`
- Reconstructing unpublished four-task scripts
- Canvases

## 8. Done when

- `papers/gepa-loop.md` exists with pin (URL, commit, fetch date)
- Loop walk covers parent pick, merge vs mutate, module pick, reflection, minibatch gate, val promotion, return
- Later extras are named as not the ICLR experiment, not as extra scored runs
- `papers/gepa.md` and `papers/README.md` point at the article
- `git diff` does not change grade-board letters, `PEDANTIC_CORRECTION_PASS.md`, or other `papers/*.md` except `gepa.md` and `README.md`

## 9. Implementation note

After this spec is approved, the next step is a writing-plans pass, then fetch `gepa-ai/gepa` and write the article from that pin. No new runtime.
