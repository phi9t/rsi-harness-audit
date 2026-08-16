# Slice firewall and entry-point pointers — design

**Date:** 16 August 2026  
**Status:** approved in chat; awaiting spec review before the implementation plan  
**Repo job this serves:** make the two-file benchmark layout true at every entry point, and stop a cohort slice from being read as the official task set, without moving any letter.

This is **piece 1** of a larger doc-quality pass. Piece 2 (prose rewrite of `papers/*`) and piece 3 (`PEDANTIC_CORRECTION_PASS.md` as archive vs rewrite) are later specs.

## 1. Problem

`UPSTREAM_BENCHMARKS.md` is the 47-suite map. `BENCHMARKS.md` is the short file for how these 16 papers used a slice. `README.md` and `AGENTS.md` already name both.

Three leftover lines still send readers to the old one-file layout:

- `RUBRICS.md` grade board: “Upstream suite notes live in `BENCHMARKS.md`.”
- `papers/README.md`: “Suites and upstream SOTA live in `BENCHMARKS.md`.”
- `REPORT.md`: “Upstream suites live in `BENCHMARKS.md`.”

The map’s 47 cards sit in one flat `## Cards` list. The map spec asked for groups. Known wording nits: CIMemories still needs a first-use for privacy personas; the `AST` glossary row says “BFCL V4” before the Berkeley name.

The rubric already knows some slices (MATH 617, Verified 500 vs HGM’s same-set 500, GPQA val 32). It does not yet point at the map, so a reader can still treat DGM/HGM’s 60 as SWE-bench Verified, or Shinka’s AIME 2024 as AIME 2026.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Scope | Piece 1 only: entry points, map grouping/nits, rubric wording |
| Letters | Frozen. No Eval / Search / Object / RSI change |
| Rubric form | A wording section, **not** a new Eval row or hard cap |
| Paper files | Untouched (`papers/*.md` except `papers/README.md`) |
| v1 trail | `PEDANTIC_CORRECTION_PASS.md` untouched |
| Map cards | Keep all 47; do not re-fetch; do not add a 48th |
| Canvases | Out of scope |
| Later specs | Piece 2 paper prose; piece 3 PEDANTIC archive vs rewrite |

## 3. Files to change

| File | Action |
|---|---|
| `UPSTREAM_BENCHMARKS.md` | Insert group `##` headings; fix CIMemories and `AST` first-use |
| `BENCHMARKS.md` | One sentence in “How to read a row”: Official matches the map card when the suite is one of the 47; otherwise this file’s Official column is the definition |
| `RUBRICS.md` | Pointer line; new wording section; no table numbers or letters |
| `README.md` | Only if a sentence still implies one benchmark file |
| `papers/README.md` | Pointer to both files |
| `REPORT.md` | Pointer to both files |
| `AGENTS.md` | No change unless the two-file bullet is wrong (it is already right). Do not record “this pass” |
| `papers/*.md` (the 16) | Unchanged |
| `PEDANTIC_CORRECTION_PASS.md` | Unchanged |
| `docs/superpowers/specs/2026-08-16-slice-firewall-and-pointers-design.md` | This spec |

## 4. Pointers (exact job)

Replace every remaining “upstream suites live in `BENCHMARKS.md`” claim with two facts:

- **Cohort slices and SOTA pointers** live in [`BENCHMARKS.md`](BENCHMARKS.md).
- **Official task sets, pins, and L/R** live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).

Do not dump 47 cards into the rubric, README, or `papers/README.md`.

## 5. Map grouping

Keep every `###` card heading. The closed-list check is `^### ` count **47**. Group names must be `##`, not `###`, so they do not inflate that count.

Replace the single undifferentiated card dump with this order (current card order, headings inserted, cards not reshuffled):

| `##` heading | Cards |
|---|---|
| Cards | Keep as the stub: “Cards follow…” then immediately the first group. Do not leave 47 cards under this heading alone. |
| General agents | MCP Atlas; DeepSearchQA; τ-Knowledge / τ-Banking; WildClawBench; GDPval; GAIA2; SkillsBench; OSWorld v1 |
| Coding | SWE-bench Pro; SWE-bench Verified; Terminal-Bench 2.1; SciCode |
| Multimodal, safety, and reasoning | CharXiv; ScreenSpot-Pro; OmniDocBench v1.5; MMMU-Pro; CIMemories; AgentDojo; IFBench; AIME 2026; GPQA Diamond; Humanity’s Last Exam; AA-LCR; BEAM |
| Coverage: tools, web, and computer | GAIA; Berkeley Function-Calling Leaderboard V4; ToolSandbox; τ-bench; WebArena; VisualWebArena; AppWorld; MCP-Universe; BrowseComp; OSWorld 2.0 |
| Coverage: coding, research, long context, and frontier | LiveCodeBench; BigCodeBench; SWE-bench Multilingual; PaperBench; ResearchClawBench; MathVista; Video-MMMU; LongBench v2; RULER; LongMemEval-V2; AgentHarm; FrontierMath; ARC-AGI-2 |

Then the existing `## Operational ladder`, `## Capability tracks`, and `## How to keep the authors’ definition` stay as they are.

## 6. Map wording nits

- **CIMemories Given:** scored labels stay binary (`necessary` vs `inappropriate`). If “privacy personas” remains, first use is ordinary words, then the term, then a suite fact (Westin-style attitude prompts that must agree before a pair is scored). Unlabeled pairs drop when they disagree.
- **AST glossary:** first mention the Berkeley Function-Calling Leaderboard, then BFCL V4. Same meaning as the card: call structure, not a string match.

Do not re-fetch sources. Do not edit Success/Size/pin numbers. Do not add glossary rows unless a nit introduces a necessary term.

## 7. Rubric wording section

Add a short section to `RUBRICS.md` **immediately before** the grade board (after the RSI material, not inside the Eval level table). Title: **Official suite versus this experiment’s slice**.

Plain English. Not a new Max Eval level. Letters stay. Content:

1. The official task set (items, metric, pin) is in `UPSTREAM_BENCHMARKS.md` when the suite is one of the 47.
2. What these 16 papers actually ran is in `BENCHMARKS.md` and the paper file.
3. A headline on a slice is not a score on the official set.

Name only mix-ups this cohort actually hit. Link the map card when the suite is in the 47; link `BENCHMARKS.md` when it is not (MATH, GSM8K, HumanEval, and the rest of the cohort-only list).

| Mix-up | Official fact | This cohort |
|---|---|---|
| SWE-bench Verified | 500 human-checked issues ([map](UPSTREAM_BENCHMARKS.md)) | DGM/HGM bake-off is 60 (35 Django / 25 Sphinx). HGM’s 8,000-eval run is all 500, same-set, already Eval D |
| MATH | Not one of the 47; definition stays in `BENCHMARKS.md` | AFlow / MaAS / MASS reuse a 617 level-5, four-category slice. MASS 60 val / 100 test. Not full MATH |
| GPQA Diamond | 198 Diamond / 448 main ([map](UPSTREAM_BENCHMARKS.md)) | ADAS / Gödel val is 32 items |
| AIME | Map card is **AIME 2026** (two 15-question contests). 2023/2024/2025 are different contests | ShinkaEvolve searches AIME 2024, then reports 2023/2025 |
| OSWorld | v1 is 369 Ubuntu tasks; 2.0 is 108 long workflows ([map](UPSTREAM_BENCHMARKS.md)) | Cohort did not run OSWorld; include so the two names are not merged later |
| GAIA vs GAIA2 | 466 short answers vs 800 event-driven scenarios ([map](UPSTREAM_BENCHMARKS.md)) | Same: pin the name |

Do not add OSWorld or GAIA2 as if the 16 papers ran them. The last two rows exist so the names stay distinct when someone pastes a vendor table.

Do **not** change: Eval level table, plus/minus rules, grade-board letters, calibration table numbers, paper-file evidence.

## 8. Language

Same as the map spec: concise, precise, plain English. Jargon only if needed; first use is ordinary words, then the term, then a suite fact. No unexplained acronym stacks.

## 9. Out of scope

- Moving any letter, or adding a Max Eval row that would force a letter
- Rewriting `papers/promptbreeder.md` through `papers/hgm.md`
- Rewriting `PEDANTIC_CORRECTION_PASS.md`
- Re-fetching the 47 sources
- A 48th benchmark
- Extra SOTA rows
- Interactive canvases
- Piece 2 and piece 3

## 10. Done when

- `rg -n 'live in.*BENCHMARKS' RUBRICS.md papers/README.md REPORT.md` no longer claims that official suites live only there
- `RUBRICS.md` has the slice section; the grade board still has the same letters
- `UPSTREAM_BENCHMARKS.md` has the five group `##` headings; `^### ` count is still 47; one BEAM; no Prompt Siren heading; no With Skills heading
- CIMemories and AST first-use nits are fixed
- `git diff` for this pass does not include `papers/*.md` except `papers/README.md`, and does not include `PEDANTIC_CORRECTION_PASS.md`

## 11. Implementation note

After this spec is approved, the next step is a writing-plans pass, then the edits. No new runtime. Closed-list Python from the map plan still applies after grouping.
