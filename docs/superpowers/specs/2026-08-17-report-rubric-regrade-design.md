# Report-driven rubric upgrade and regrade — design

**Date:** 17 August 2026  
**Status:** approved in chat (approach 1; architecture; recipe delta; regrade protocol; proceed to implementation)  
**Repo job this serves:** fold [`REPORT.md`](../../../REPORT.md) into the four-axis recipe, re-run every experiment row, rewrite paper files as evidence, then merge onto one official board.

## 1. Problem

[`REPORT.md`](../../../REPORT.md) is a captured long-form audit. It uses a two-axis table (evaluation + discovery) plus RSI. The live board is four-axis (Eval, Search, Object, RSI). Several §2.0 letters disagree with [`GRADE_BOARD.md`](../../../GRADE_BOARD.md) Best Eval. The report also names hygiene the recipe does not yet state as checkable rows: researcher-level test monitoring, outer-loop search variance, reported-gain decomposition, winner’s curse after many adaptive queries, task granularity, and a 1–6 discovery taxonomy.

A later grading round was requested. Letters unfreeze for this round only. Rubric wording lands first. Then every experiment is re-run. Then papers. Then one official board.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Destination | Approach 1. Absorb the report into the current recipe. Do not adopt §2.0 as the official table. Do not renumber see-levels to 0–4. |
| Axes | Keep Eval, Search method, Evolved object, RSI. Keep plus/minus. Keep Plover Lab / Nock-100. No cohort names in `RUBRICS.md`. |
| Numeric cutoffs | Keep `≥5` cheap full searches, `≥3` expensive. No new ratios or overlap percents. |
| §2.0 | Evidence. A letter may stay, rise, or fall. Official preprint/code still beats the capture. |
| Papers | Depth B. Each file takes in reconstructable protocol, train/test audit, artifact audit, and verdict, rewritten with paper facts and official-code control flow. Do not paste the report. |
| Working board | Score into `GRADES_ROUND2.md` (old → new → recipe step). |
| Merge | Last step of this round. Fold letters and the change log into `GRADE_BOARD.md`. `GRADES_ROUND2.md` becomes a pointer again. |
| v1 trail | `PEDANTIC_CORRECTION_PASS.md` stays the source check of the capture. One live-path sentence at most. |
| `REPORT.md` body | Frozen. Banner updates after merge. |
| Canvases, vendor repos, historical `docs/superpowers/` specs | Out of scope |

## 3. Files

| File | Action |
|---|---|
| `RUBRICS.md` | Recipe upgrade only in the first phase. Glossary, hygiene, object ceilings, cap sketches, worksheet fields. No 16 paper names. |
| `GRADES_ROUND2.md` | Working scored record during the round. Glance table, experiment rows, change log, held rows. |
| `GRADE_BOARD.md` | Cite-this table until merge. Then replace with the new letters, calibration, and “what changed this round.” |
| `papers/*.md` (16 grade cards; not `gepa-loop.md` as a letter table) | Rewrite evidence sections; tables match the working board then the merged board. |
| `papers/README.md` | Glance letters after merge. |
| `README.md`, `AGENTS.md` | After merge: letters frozen again until the next requested round. |
| `REPORT.md` | Banner only after merge: historical capture used as evidence for this round; board wins. |
| `PEDANTIC_CORRECTION_PASS.md` | Optional one-line pointer that round-2 letters live on the board. |

## 4. Sequence

1. Change the recipe. No letter edits in the same step.
2. Re-run every experiment row into `GRADES_ROUND2.md`. Grade each paper alone, then calibrate so the same letter is the same kind of miss.
3. Rewrite the paper files to match those letters.
4. Fold into `GRADE_BOARD.md`. Pointer-ize `GRADES_ROUND2.md`. Update banners. Freeze letters.

Official-code papers: re-read the repo when a report claim or a candidate letter depends on search, mutation, evaluation, or promotion. Quote only if it changes a letter. PromptBreeder, Self-Developing, and MASS stay preprint-only.

## 5. Rubric upgrades

Keep see-levels **1 / 2 / 2-rewrite / 3 / 4**. Map the report’s 0–4 onto them. Do not use a second numbering in worksheets.

| Report | Recipe | Change |
|---|---|---|
| 0 clean final test | See 1 | None. Only path to Eval A. |
| 1 adaptive validation | See 2 | None. Blocks A. |
| 2 researcher test monitoring | new hygiene fail | Plotting test, tuning defaults on test, or scoring every candidate on test does not prove the optimizer ate test labels. Blocks Eval A and the “untouched confirmatory” reading. Plus cannot be claimed from a test-oracle envelope. Not automatic D if selection was validation-only. |
| 3 same-population | See 3 | None. Eval D, except checkable math (cap C). |
| 4 evaluator internals | See 4 | None. Hidden tests/patches in the *proposer* prompt stay Eval D. |

**New glossary entries** (lab facts only): researcher-level test monitoring; outer-loop search variance \(\operatorname{Var}_s[Q(\operatorname{Search}(s))]\); reported-gain split (artifact + test-time compute + model substitution + selection noise + benchmark exposure + baseline mismatch); winner’s curse after \(K\) adaptive queries; granularity (when one task is a large fraction of the reported percentage).

**New or tightened hygiene rows**

- **Test monitoring.** Fail if authors inspect test trajectories, choose defaults on test, or evaluate every candidate on test before freeze. Stencil-peek: selection uses the 20 val items; the paper plots the 40 test items after every generation.
- **± is over search.** Already present. Restate as \(\operatorname{Var}_s[Q(\operatorname{Search}(s))]\). Repeating the selected harness is not this check.
- **Reported gain is the artifact.** Fail compute-match if the comparison does not isolate artifact from extra calls, a stronger model, or exposure.
- **Winner’s curse.** Honest-selection fails if the paper reports only the best lineage from one search with no outer repeats after many adaptive queries.
- **Granularity.** Honest-population (or the binding reason) must translate a close percentage into task counts when one task is ≥1 percentage point. Unpaired aggregates cannot carry that close call.

**Discovery taxonomy (object ceiling, lab-named)**

1. Parameter tuning → at most C  
2. Known-component composition → at most C  
3. Textbook algorithm rediscovery → at most C  
4. Task-specific engineering, not isolated → at most C+  
5. Mechanistically new artifact → B band possible  
6. Recursive research improvement → RSI, not Object  

Existing object caps stay (no-op D, operator library C, weak start C, extra calls/model C, instance facts C or D).

**RSI.** Keep 0–3. Level 2 is the \(I(A)\) experiment: early/mid/late parents, same hidden traces, same mutation budget, child-quality distribution. A lineage heuristic over descendant *task* success remains a search rule over Q (level 1), not level 2.

**Worksheet.** Add fields: test monitoring (yes/no); gain split (which terms mixed); one task equals how many points; object taxonomy 1–6.

**Cap sketches.** Add Stencil-peek (test monitoring). Do not add a fifth fake paper.

Eval A still requires See 1, no other cap, every hygiene item including repeated search and search-±. Test monitoring is a hygiene fail, so it blocks A even when See is 1 or 2. A test-oracle envelope (“best test along the search path”) is not an A-axis item for B+.

## 6. Regrade protocol

Unit: one experiment row. Do not average a clean experiment with a dirty one. Keep the current row set unless the recipe forces a split or drop (same protocols as today’s board: GEPA main vs KernelBench; ShinkaEvolve four programs; ACE offline vs online; GPTSwarm MMLU / MiniCrosswords / HumanEval; DGM SWE vs Polyglot vs transfer; HGM 60-slice vs 8,000-on-500 vs Lite-207 vs error-resolution object; Gödel main vs free vs Game of 24; STOP main vs transfer).

Per row: fill the worksheet; see-level; other caps; hygiene including the new rows; plus/minus; Search; Object; RSI. Binding reason cites a paper fact or a code fact.

`GRADES_ROUND2.md` while scoring:

- Glance table (Best Eval, Headline Eval, Search, Object, RSI)
- Experiment rows (See, four letters, binding reason)
- Change log: old letter → new letter → recipe step
- Unchanged rows listed as held, with the step that kept them

Empty bands remain allowed. After all papers, recalibrate ladders and close calls on the working board, then copy that calibration onto `GRADE_BOARD.md` at merge.

## 7. Paper files

Each grade card keeps venue, arXiv, code pointer, and “letters match the board.” Add or rewrite, in paper-fact language:

1. Experiments scored (table matches the working then merged board)
2. Reconstructable protocol
3. Train/test audit (see-level and test-monitoring)
4. Artifact audit (taxonomy 1–6; what actually runs)
5. Precise verdict (supported / not established / RSI relevance)
6. Control flow from official code when a repo exists
7. Cite as / do not cite as

Do not paste `REPORT.md`. Do not turn `gepa-loop.md` into a second grade table; keep it the code-first loop article. Third-party reimplementations stay named and unused as the harness.

## 8. Merge and freeze

When papers match the working board:

1. Replace `GRADE_BOARD.md` scored record with the new glance table, experiment rows, how-to-cite, calibration, what-changed-this-round, what-would-move-a-letter.
2. Set `GRADES_ROUND2.md` back to a pointer at `GRADE_BOARD.md` / `RUBRICS.md` / `papers/`.
3. Update `papers/README.md` glance letters.
4. Update `REPORT.md` banner: this capture was evidence for the round; official letters are the board.
5. `AGENTS.md`: letters frozen until the next requested round; `GRADES_ROUND2.md` is a pointer except during a round.

## 9. Language

`RUBRICS.md`: jargon with a lab fact. `GRADE_BOARD.md` and `papers/`: jargon with a paper fact. Plain English. No cohort names in the rules. Unicode allowed.

## 10. Out of scope

- Copying report §2.0 letters onto the board
- Collapsing Search and Object
- Renumbering see-levels to 0–4
- Restating `PEDANTIC_CORRECTION_PASS.md` as the round-2 trail
- Rewriting the `REPORT.md` body
- Interactive canvases
- Vendoring any repo
- New numeric cutoffs
- Rewriting historical specs and plans under `docs/superpowers/` except this spec and its plan

## 11. Done when

- `RUBRICS.md` contains the mapped hygiene, taxonomy ceilings, Stencil-peek sketch, and worksheet fields; `rg` still finds none of the 16 paper names as whole words (same firewall as the objective-rubrics spec, including no all-caps `STOP`)
- Every experiment row on the pre-round board has a working-board counterpart (new letter or held)
- `GRADE_BOARD.md` is the only live scored record; `GRADES_ROUND2.md` is a pointer
- Each of the 16 paper grade cards has protocol / train-test / artifact / verdict sections whose tables match the board
- `REPORT.md` banner says the board wins; body unchanged except that banner
- `git diff` of official-card files under `benchmarks/` is empty
