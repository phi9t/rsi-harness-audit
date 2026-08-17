# Objective rubrics — design

**Date:** 16 August 2026  
**Status:** approved in chat; awaiting spec review before the implementation plan  
**Repo job this serves:** make the scoring rules usable on a paper that is not in this audit, without defining letters by pointing at the 16.

## 1. Problem

`RUBRICS.md` currently does three jobs in one file: the scoring rules, the 16-paper grade board, and cohort calibration. The rules are illustrated with the same papers they grade (GEPA for reused validation, DGM for a hidden-test leak, HGM for same-set search). A new experiment cannot be scored without reading the cohort. That is circular, and it hides the actual procedure (caps, then checklist, then plus/minus) inside “who sits here.”

This pass rewrites the **rules** so they are an ordered recipe plus fictitious examples. It does **not** re-grade. A later grading round may re-apply the recipe; that round is out of this spec.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Letters | Frozen. No Eval / Search / Object / RSI edits on the board or in `papers/` |
| Numeric cutoffs | Keep the ones already written (`≥5` cheap full searches, `≥3` expensive). No new ratios or overlap percents |
| File split | `RUBRICS.md` = rules only. `GRADE_BOARD.md` = scored 16-paper record + paper-citing calibration |
| Procedure | Caps first, then remaining checklist, then plus/minus. A new paper can be run through without opening the board |
| Examples | Invented lab (four fake papers, stable names). Hybrid placement: 2-sentence pass/fail on hard caps; four full worksheets at the end of `RUBRICS.md` |
| Cohort names in rules | None. `RUBRICS.md` may point at `GRADE_BOARD.md` without naming the 16 papers |
| Later grading round | In scope for the repo later. Not this spec |
| v1 trail | `PEDANTIC_CORRECTION_PASS.md` body untouched except one live-path sentence: scoring rules in `RUBRICS.md`, scored rows in `GRADE_BOARD.md` |

## 3. Files to create or change

| File | Action |
|---|---|
| Create: `GRADE_BOARD.md` | Move the scored record out of `RUBRICS.md`. Letters in the tables stay byte-identical |
| Rewrite: `RUBRICS.md` | Rules, glossary with lab evidence, caps, checklists, ordered recipes, cap sketches, four worksheets. Pointer to `GRADE_BOARD.md` |
| `README.md`, `AGENTS.md`, `papers/README.md`, `REPORT.md`, `GRADES_ROUND2.md` | Job split in the entry-point lines |
| `papers/gepa.md`, `papers/ace.md`, `papers/dgm.md`, `papers/hgm.md` | Retarget “letters match the `RUBRICS.md` grade board” to `GRADE_BOARD.md`. No other prose |
| `PEDANTIC_CORRECTION_PASS.md` | One live-path sentence: rules vs board. No restatement of v1 letters |
| `papers/*.md` other than the four above | Unchanged unless another file uses the same “grade board” pointer (then retarget that sentence only) |
| Other `papers/*.md` grade tables | Unchanged |

Historical spec/plan files under `docs/superpowers/` are not rewritten.

## 4. `GRADE_BOARD.md`

New file. Open with: rules live in `RUBRICS.md`; this file is the scored record.

Move, in order, from current `RUBRICS.md`:

1. `## Official suite versus this experiment’s slice` (including the mix-up table)
2. `## Grade board` through `### How to cite (short)`
3. `## Cohort calibration` through `## What would move a letter` (including the closing paragraph)

Do not rewrite binding reasons. Do not change letters. A new H1/title and the rules pointer are the only new prose at the top.

`AGENTS.md` learned-preference bullet becomes: one `RUBRICS.md` for scoring rules; one `GRADE_BOARD.md` for the scored rows and paper-citing calibration; papers under `papers/`; rest unchanged.

## 5. `RUBRICS.md` — spine

Keep the four remembered rules, restated without cohort names:

1. Grade the experiment, not the PDF.
2. Give the search method and the evolved object separate Discovery scores.
3. A hard cap beats a good story. Hidden tests in the proposal prompt make Eval D even if logs show no hardcoding.
4. Getting better at the benchmark used for search is not recursive self-improvement. RSI requires measuring whether later systems are better at producing the next system.

Then: glossary, Eval, Discovery (object then search), RSI, a short official-set-vs-slice *rule* (cards under `benchmarks/`; what a paper ran is in `BENCHMARKS.md`; a slice headline is not an official-set score), the fill-in worksheet, cap sketches, worked lab, pointer to `GRADE_BOARD.md`.

The mix-up table that names SWE-bench 60 vs 500, MATH 617, and the rest moves with the board. Do not keep those rows in the rules.

Drop from this file: “typical ceiling in this corpus,” “who sits here,” close-call paragraphs that name papers, and “what a strong paper means here.” Those stay on the board.

Empty bands are allowed in the rules (Eval A, Discovery A, RSI 2–3). “This audit has none” is a board sentence, not a rule.

## 6. Letter recipe (Eval)

Run in this order. Do not skip to calibration.

1. **Name the experiment.** One method, one changed object, one protocol, one headline number, one claimed meaning. Two protocols → two rows.
2. **Fill the worksheet** (keep the current fields; swap paper-flavored hints for lab-flavored ones).
3. **See-level** from what the *proposer* saw, not only the solver:
   - **1** — search on train/public; reported test never queried; hidden tests and gold patches not in any prompt that proposes the next change. No cap from this row.
   - **2** — validation scored repeatedly to accept/reject; final test hidden. Cannot be A.
   - **2-rewrite** — a split exists, then the search *distribution* is changed with evaluation signal (keep high-variance items, train a predictor on scores, promote only top-k on the same pool). Max **B−**.
   - **3** — search tasks = headline tasks. **D**, except exact checkable math (below).
   - **4** — hidden tests, official patches, or judge internals pasted into the prompt that chooses the next edit. **D**. A clean transfer row does not raise *this* row.
4. **Other automatic caps.** Prequential-on-test sold as frozen held-out accuracy → **C**. No documented split → **D**. Hand-built demo labeled as search → do not give an Eval-as-discovery letter.
5. **Exact checkable math.** Level 3 may cap at **C** (not D) when the reported number is an objective anyone can re-check from the artifact (constraint satisfaction with a published verifier). Not when the items are ordinary benchmark questions.
6. **Remaining hygiene (binary, already in the file).** Search repeated (`≥5` cheap / `≥3` expensive, median and spread of *searches*). The ± is over those searches. Compute match. Fair search space. Honest population. Honest selection. Protocol name matches the caption.
7. **Letter from what remains:**
   - **A** — See 1, no other cap, every hygiene item passes (including repeated search and search-±).
   - **B** — See 1 or 2, a held-out evaluation exists, not C/D-capped. Usual miss: search run once and/or ± is not over search.
   - **B+** — meets B, and also one A-axis item (matched searcher budgets, or true train-then-freeze with test never queried). Still missing full A (almost always repeats).
   - **B−** — held-out test exists, and either two hygiene misses or See 2-rewrite.
   - **C / C+ / C−** — a transfer or a split exists, but the protocol is streaming-on-test, overlapping val/dev as the only “held-out,” mixed models in the headline comparison, or an object grown under See 4 and then scored elsewhere. **C+** if they publish the honest extra cut (drop overlapping items). **C−** if the main table is confounded (writer and solver are different models sold as one harness).
   - **D** — See 3 (except checkable-math C) or See 4 or no documented final split.
8. **Plus/minus** (unchanged meaning): plus = meets the letter and one requirement of the letter above; minus = meets the letter’s main firewall but fails two other checklist items. Do not average two experiments into B±.

If “does it actually run?” or “what did the proposer see?” is unknown: Eval cannot be A; evolved object cannot be B.

## 7. Letter recipe (Search method, Object, RSI)

**Search method.** Specified, reimplementable loop (estimator, parent pick, proposal, acceptance). Compared to other *searchers* under the same candidate language and budget, not only to prompting. The number used in the loop is the number in the analysis. Repeated full trees.

- **A** — beats other searchers on held-out families, repeated full trees.
- **B** — specified loop, compared to other searchers under a similar budget; repeats may be missing.
- **B− / C+** — specified loop, some searcher control, missing repeats or ablations only on a toy.
- **C** — standard evolution / sample-from-an-LM, mainly vs prompting, or the mutation *plan* is written by a frozen external model that saw hidden tests.
- Do not score a hand-built demo as a search method.

**Evolved object.** Hard caps first: does not run → **D**; hand-written not searched → do not score as evolved; already in the operator list / seed / textbook → at most **C**; rebuilt standard tools from a weak start → at most **C**; extra calls or a stronger model could explain the gain → at most **C**; stores instance facts rather than a portable rule → **C** or **D**.

Then: **A** new, working, isolated, repeated, transferred across families. **B** real new formula or mechanism, some transfer, missing repeats or ablations. **B−** real object whose own tables do not establish superiority (branded favorite ≠ fitness winner). **C+** unusual remix, under-ablated. **C** known parts. **C−** recombination table, template leakage, or brute force sold as a new algorithm. **D** cosmetic, unsupported, or nonfunctional.

**RSI.** Keep levels 0–3 and the level-2 experiment steps. Restate disqualifiers without paper names (child calls a stronger model; a frozen stronger model writes the improvement plan → still level 1, and the search-method grade must name that diagnoser).

## 8. Invented lab

All examples labeled **Fictitious. Not a cohort paper.** Do not use real suite names (no SWE-bench, HotpotQA, AIME, MATH, AppWorld). Do not copy distinctive cohort method names (no Pareto-reflection, CMP, MIPROv2, LRML).

**Suite: Nock-100.** One hundred latch-diagram items. Official split published before any method ran: 40 train / 20 validation / 40 test. Metric: exact match on a short repair string. Hidden oracles exist for the test split and must not enter proposal prompts.

**Lab: Plover Lab.** Four fake papers:

| Fake paper | What it is | What the worksheets demonstrate |
|---|---|---|
| **Stencil** | Search over named instruction strings | See 2, held-out test, matched prompt-optimizer budgets, one search → Eval **B+**. Searcher vs another prompt searcher → Search **B**. Prompts are task recipes → Object **C+**. Frozen outer loop → RSI **0** |
| **Rookery** | Wires a human operator list (debate, vote, retry) | Split, then keep high-variance val items (See **2-rewrite**) → Eval **B−**. Vs chain-of-thought only → Search **C**. Object **C**. RSI **0** |
| **Latchkey** | Agent edits its own tools | Headline: diagnoser prompt includes hidden oracles (See **4**) → Eval **D**. Weak start omitting a standard edit tool. Showcased child logs “would install,” skips, returns success → Object **D**. Self-edit, measured task score → RSI **1**. Search **C** (frozen external diagnoser). Same-set without a leak is a cap sketch, not this worksheet |
| **Plumb** | LM proposes closed-form objectives | Select on family A, report on family B → Eval **B**. Branded formula is not the val winner → Object **B−**. ~100 proposals, one pipeline → Search **C**. RSI **0** |

Cap sketches (two sentences, pass and fail) use extra lab variants, not a fifth fake paper: Stencil-online (prequential sold as frozen test), Latchkey without the leak but same-set (See 3), a checkable 12-magnet ring energy (level-3 math exception → C), compute mismatch (solver model ≠ writer model), operator-library remix.

Eval A and RSI 2 appear only as recipe clauses (“A needs …”; “level 2 is …”). Do not invent a fake published paper that earned them.

## 9. Language

Same house style as the map and paper files: concise, precise, plain English. First use of a needed term is ordinary words, then the term, then a **lab** fact. Do not invent a second glossary. Synthetic sketches only, labeled fictitious. Unicode allowed (curly apostrophes, ≥).

Plus and minus stay defined, not decorative, with the same meaning as today.

## 10. Out of scope

- Moving any letter
- New numeric cutoffs
- Re-running the 16 through the recipe (later grading round)
- Rewriting paper-file evidence sections
- Canvases
- Vendoring any repo
- Expanding the invented lab beyond the four papers plus cap variants
- Rewriting historical `docs/superpowers/` specs and plans

## 11. Done when

- `GRADE_BOARD.md` exists; experiment-table letters match current `RUBRICS.md` on `main`
- `RUBRICS.md` has the ordered recipes, Nock-100 / Plover Lab, four worksheets, cap sketches, and a pointer to `GRADE_BOARD.md`
- `rg` of `RUBRICS.md` finds none of the 16 paper names as whole words (PromptBreeder, GPTSwarm, DiscoPOP, ADAS, AFlow, AgentSquare, Gödel, Self-Developing, MaAS, GEPA, ACE, MASS, ShinkaEvolve, DGM, HGM). Do not write `STOP` in all caps in the rules (the English verb is fine in lowercase). Distinctive method tokens CMP, MIPROv2, LRML also absent
- `README.md` and `AGENTS.md` name both files
- Paper-file grade-board pointers that exist today point at `GRADE_BOARD.md`
- `git diff` of grade-table letters in `papers/` is empty

## 12. Implementation note

Sequence: cut `GRADE_BOARD.md` from current `RUBRICS.md` (letters frozen in that cut), rewrite `RUBRICS.md`, retarget pointers, then grep. No new runtime. After this spec is approved, the next step is a writing-plans pass.
