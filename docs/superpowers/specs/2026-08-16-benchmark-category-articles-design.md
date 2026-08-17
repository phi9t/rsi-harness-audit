# Frontier-eval category articles — design

**Date:** 16 August 2026  
**Status:** approved in chat; awaiting spec review before the implementation plan  
**Repo job this serves:** make it easy to understand the latest task sets used in frontier evaluation, then compare them with what these 16 papers actually ran.

This pass splits the 47 cards out of `UPSTREAM_BENCHMARKS.md` into five category files and adds a category essay plus a short cohort tail. It does not re-grade papers.

The map spec’s layout lock (“two top-level files, not a `benchmarks/` folder”) is **replaced for this pass only**. The two jobs stay split: cohort slices in `BENCHMARKS.md`; official task sets in `benchmarks/*.md`, indexed from `UPSTREAM_BENCHMARKS.md`.

## 1. Problem

`UPSTREAM_BENCHMARKS.md` is a working catalog: glossary, L/R, and 47 half-page cards in one file. That is the right definition store and the wrong reading path.

A reader who wants “what frontier eval uses now” has to scan 47 cards. A reader who wants “how that differs from these papers” has to bounce to `BENCHMARKS.md` with no category-level contrast. The five `##` groups exist, but they are dump headings (`Coverage: …`), not articles.

Vendor tables still mix task set, harness, and scoring protocol. The papers still run slices (SWE 60, MATH 617, AIME 2024) and suites that are not in the 47 (GSM8K, HumanEval). The map already knows those facts; they are not visible next to the family they belong to.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Categories | The five existing map groups. Same card membership. Drop the word `Coverage:` from the last two titles. |
| Layout | Root index + `benchmarks/` folder (parallel to `papers/`) |
| Cards | Live once, in the category file. Root index has names, L/R, and links. No Given/Success bodies at root. |
| Essay | About a page per file: family measure, shared Given/Success, usual mix-ups, easy-to-confuse cards |
| Cohort contrast | Short tail at the end of each category file. Details and SOTA stay in `BENCHMARKS.md`. |
| Depth | Do not re-fetch unless a moved card is factually wrong. Do not expand the card template. |
| Closed list | 47 `###` headings. One BEAM. No Prompt Siren / With Skills / AA as task sets. |
| Letters | Frozen. No Eval / Search / Object / RSI change. |
| Paper files | Untouched (`papers/*.md` except `papers/README.md`) |
| v1 trail | `PEDANTIC_CORRECTION_PASS.md` untouched |
| Canvases | Out of scope |

## 3. Files to create or change

| File | Action |
|---|---|
| `UPSTREAM_BENCHMARKS.md` | Keep purpose, glossary, three-object split, diagram-label table, L/R definitions, operational ladder, capability tracks, pin checklist. Replace card bodies with a five-row “where the cards live” table and a 47-name list (name, category link with heading anchor, L/R). |
| `benchmarks/README.md` | Create. Pointer up to the root index; cohort slices stay in `BENCHMARKS.md`; five-file table with counts. |
| `benchmarks/general-agents.md` | Create. Essay + 8 cards + cohort tail. |
| `benchmarks/coding.md` | Create. Essay + 4 cards + cohort tail. |
| `benchmarks/multimodal-safety-reasoning.md` | Create. Essay + 12 cards + cohort tail. |
| `benchmarks/tools-web-computer.md` | Create. Essay + 10 cards + cohort tail. Title: **Tools, web, and computer**. |
| `benchmarks/coding-research-context-frontier.md` | Create. Essay + 13 cards + cohort tail. Title: **Coding, research, long context, and frontier**. |
| `BENCHMARKS.md` | Point at the root index **and** `benchmarks/` for card bodies. Do not copy cards. Do not add SOTA rows for suites the cohort never ran. |
| `README.md` | Name `benchmarks/` in the table. Root map remains the glossary/L-R/index. |
| `AGENTS.md` | Replace the “two root files hold the definitions” line. Official cards live under `benchmarks/`; `UPSTREAM_BENCHMARKS.md` is the index. |
| `papers/README.md` | Same three-place pointer: slices, index, category files. |
| `REPORT.md` | Same three-place pointer if it still says cards live only in the root map. |
| `RUBRICS.md` | Retarget the slice-section map anchors to the category files. Do not change letters, ceilings, or mix-up facts. Grade-board pointer line: cards live under `benchmarks/`, indexed from `UPSTREAM_BENCHMARKS.md`. |
| `docs/superpowers/specs/2026-08-16-benchmark-category-articles-design.md` | This spec |
| `papers/promptbreeder.md` … `papers/hgm.md` | Unchanged |
| `PEDANTIC_CORRECTION_PASS.md` | Unchanged |

## 4. Reader path

1. **What does frontier eval use?** Start at `UPSTREAM_BENCHMARKS.md` (glossary, L/R, which family). Open one `benchmarks/*.md` for the essay and cards.
2. **What did these papers run?** `BENCHMARKS.md` still owns slice rows and SOTA pointers. Each category file ends with a tail that names overlap, famous slices, and skipped suites, then links here.
3. **Do not merge the jobs.** A category essay is not a leaderboard. A cohort tail is not a second card catalog.

`benchmarks/README.md` exists so a GitHub folder view is not a dead end. It does not duplicate the glossary.

## 5. Root index (`UPSTREAM_BENCHMARKS.md`)

Keep, in this order:

1. Title and purpose (task-set map, not a leaderboard, not a grade of the 16 papers).
2. Glossary.
3. Three objects and the diagram-label table.
4. L0–L7 and R1–R5.
5. **Where the cards live** — five rows:

| File | Title | Cards |
|---|---|---|
| [`benchmarks/general-agents.md`](benchmarks/general-agents.md) | General agents | 8 |
| [`benchmarks/coding.md`](benchmarks/coding.md) | Coding | 4 |
| [`benchmarks/multimodal-safety-reasoning.md`](benchmarks/multimodal-safety-reasoning.md) | Multimodal, safety, and reasoning | 12 |
| [`benchmarks/tools-web-computer.md`](benchmarks/tools-web-computer.md) | Tools, web, and computer | 10 |
| [`benchmarks/coding-research-context-frontier.md`](benchmarks/coding-research-context-frontier.md) | Coding, research, long context, and frontier | 13 |

6. **The 47 names** — one table, grouped by those files. Columns: official name (link to `benchmarks/<file>.md#anchor`) | L/R. No Given, Success, sketch, or source URL here.
7. Operational ladder (all 47). After the split, names in this table may stay plain text; the 47-name list is the clickable index.
8. Capability tracks.
9. How to keep the authors’ definition.

Delete the `## Cards` stub and every `###` card body from this file.

## 6. Category file template

```markdown
# <Title>

Official task sets for this family. Glossary, L/R definitions, and the 47-name index: [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). How these 16 papers used a slice: [`BENCHMARKS.md`](../BENCHMARKS.md).

## What this family measures

<about a page: shared Given/Success; task set vs harness vs scoring protocol in this family; which cards in this file are easy to confuse>

## Cards

<existing card template, one `###` per task set>

## This cohort

<tail: ran / skipped / famous slice; link to BENCHMARKS.md>
```

### Essay rules

- Plain English. Jargon only if a card in this file needs it; first use is ordinary words, then the term, then a suite fact. Do not invent a second glossary; the root glossary remains canonical.
- Name mix-ups that belong to **this file’s cards**. Examples that must appear in the matching essay:
  - **General agents:** OSWorld v1 vs a vendor “OSWorld” cell; SkillsBench with vs without skills is one task set, two conditions; GDPval vs GDPval-AA (AA is harness/protocol).
  - **Coding:** SWE-bench Verified vs Pro vs (in the other coding file) Multilingual; fail-to-pass is not “the tests passed.”
  - **Multimodal, safety, and reasoning:** AIME 2026 vs other years; HLE full vs text-only; BEAM vs BEAM-128K; Prompt Siren is an attack on AgentDojo, not a task set.
  - **Tools, web, and computer:** τ-bench airline/retail vs τ-Knowledge / τ-Banking; GAIA vs GAIA2; OSWorld v1 vs 2.0; MCP Atlas (general agents) vs MCP-Universe; BFCL V4 scores call structure, not a string match.
  - **Coding, research, long context, and frontier:** LiveCodeBench vs HumanEval (HumanEval is not in the 47); ARC-AGI-2 vs this cohort’s ARC Easy ≤5×5; SWE-bench Multilingual vs Verified.
- Do not paste vendor scores. Do not add SOTA.

### Card rules

Move the existing body. Keep the skeleton:

- Diagram / vendor label
- Source (URL, fetched date)
- Given
- Success
- Size / pin
- Level
- Sketch (not a real item)
- Do not mix (or omit if the current card has none)

Re-fetch only if the moved text is wrong against the cited source. Do not copy real benchmark instances. Do not add a 48th `###`.

### Cohort tail rules

Source of truth is `BENCHMARKS.md`, not memory. The tail may name:

- Which of **this file’s** suites the 16 papers ran, with the paper names.
- The famous slice in one line (SWE 60 not 500; GPQA val 32; IFBench GEPA splits; AppWorld offline vs online; LiveCodeBench MASS subset; AIME year vs the AIME 2026 card).
- Which of this file’s suites they skipped.
- Cohort-only suites a reader will look for in this family and will not find in the 47 (MATH, GSM8K, HumanEval, SWE-bench Lite, KernelBench, Polyglot). One line each, then a link to `BENCHMARKS.md`.

The tail must **not** contain: SOTA numbers, grade letters, copied Official/This cohort/Upstream SOTA table rows, or a claim that a skipped frontier suite was run.

Seed (must match `BENCHMARKS.md` at implementation time; if they disagree, `BENCHMARKS.md` wins):

| Category file | Ran (slice in one line) | Skipped (this file) | Cohort-only lookalikes |
|---|---|---|---|
| General agents | None of the 8 | All 8, including OSWorld v1 | Do not treat GPTSwarm’s GAIA row as GAIA2 (GAIA2 is in this file; GAIA is in tools/web) |
| Coding | SWE-bench Verified: DGM/HGM bake-off 60 (35 Django / 25 Sphinx); HGM 8,000-eval run is all 500, same-set | SWE-bench Pro; Terminal-Bench 2.1; SciCode | SWE-bench Lite, HumanEval, KernelBench, Polyglot, ALE-Bench LITE |
| Multimodal, safety, and reasoning | IFBench (GEPA); GPQA Diamond (ADAS/Gödel 32 val / 166 test); AIME **2026 card** vs Shinka 2023/2024/2025 | The other 9 in this file | MATH, GSM8K, MMLU, HotpotQA/HoVer, MiniCrosswords |
| Tools, web, and computer | AppWorld (ACE offline vs online); GAIA (GPTSwarm Table 1, hand-built, not search) | The other 8, including OSWorld 2.0 and τ-bench | — |
| Coding, research, long context, and frontier | LiveCodeBench (MASS small subset, not search) | The other 12 | ARC Easy ≤5×5 is not ARC-AGI-2; MATH is not FrontierMath |

GAIA2 lives under general agents; GAIA lives under tools/web. The general-agents tail must not say the cohort ran GAIA2.

## 7. Card membership (closed)

Do not reshuffle cards across files.

| File | `###` cards |
|---|---|
| `general-agents.md` | MCP Atlas; DeepSearchQA; τ-Knowledge / τ-Banking; WildClawBench; GDPval; GAIA2; SkillsBench; OSWorld v1 |
| `coding.md` | SWE-bench Pro; SWE-bench Verified; Terminal-Bench 2.1; SciCode |
| `multimodal-safety-reasoning.md` | CharXiv; ScreenSpot-Pro; OmniDocBench v1.5; MMMU-Pro; CIMemories; AgentDojo; IFBench; AIME 2026; GPQA Diamond; Humanity’s Last Exam; AA-LCR; BEAM |
| `tools-web-computer.md` | GAIA; Berkeley Function-Calling Leaderboard V4; ToolSandbox; τ-bench; WebArena; VisualWebArena; AppWorld; MCP-Universe; BrowseComp; OSWorld 2.0 |
| `coding-research-context-frontier.md` | LiveCodeBench; BigCodeBench; SWE-bench Multilingual; PaperBench; ResearchClawBench; MathVista; Video-MMMU; LongBench v2; RULER; LongMemEval-V2; AgentHarm; FrontierMath; ARC-AGI-2 |

Counts: 8 + 4 + 12 + 10 + 13 = 47.

## 8. Pointers

Replace “official cards live in `UPSTREAM_BENCHMARKS.md`” with three facts, in this order:

- **Cohort slices and SOTA pointers** live in [`BENCHMARKS.md`](BENCHMARKS.md).
- **Glossary, L/R, and the 47-name index** live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).
- **Official cards** live under [`benchmarks/`](benchmarks/).

`RUBRICS.md` slice-section anchors must move with the cards:

| Mix-up | New map link |
|---|---|
| SWE-bench Verified | `benchmarks/coding.md#swe-bench-verified` |
| GPQA Diamond | `benchmarks/multimodal-safety-reasoning.md#gpqa-diamond` |
| AIME 2026 | `benchmarks/multimodal-safety-reasoning.md#aime-2026` |
| OSWorld v1 | `benchmarks/general-agents.md#osworld-v1` |
| OSWorld 2.0 | `benchmarks/tools-web-computer.md#osworld-20` |
| GAIA | `benchmarks/tools-web-computer.md#gaia` |
| GAIA2 | `benchmarks/general-agents.md#gaia2` |

MATH stays linked only to `BENCHMARKS.md`. Do not change the mix-up facts or the “wording, not a ceiling” sentence.

`AGENTS.md` learned-preference bullet becomes: one `RUBRICS.md`; papers under `papers/`; `BENCHMARKS.md` for cohort slices; `UPSTREAM_BENCHMARKS.md` for glossary, L/R, and the index; official cards under `benchmarks/`. Jargon still belongs in the index glossary, not in a second glossary per category file.

## 9. Language

Same as the map spec: concise, precise, plain English. L0–L7 and R1–R5 stay repo labels. Sketches stay labeled **not a real item**. Official source still wins if a card is corrected.

## 10. Out of scope

- Moving any letter
- Rewriting `papers/promptbreeder.md` through `papers/hgm.md`
- Rewriting `PEDANTIC_CORRECTION_PASS.md`
- Re-fetching all 47 sources
- A 48th benchmark
- Extra SOTA rows
- Interactive canvases
- Recutting categories by L/R or by capability track
- Paper-file prose (doc-quality piece 2) and PEDANTIC restatement (piece 3)

## 11. Done when

- `benchmarks/` has `README.md` plus the five category files
- `rg '^### ' UPSTREAM_BENCHMARKS.md` is 0
- `rg '^### ' benchmarks/*.md` is 47; one BEAM; no Prompt Siren heading; no With Skills heading
- Membership matches section 7
- Root index has the five-row table, the 47-name list with working relative links, glossary, L/R, ladder, tracks, and pin checklist
- Each category file has the essay, the cards, and a `## This cohort` tail with no SOTA numbers and no grade letters
- `RUBRICS.md` slice anchors point at category files; grade-board letters are unchanged
- `git diff` for this pass does not include `papers/*.md` except `papers/README.md`, and does not include `PEDANTIC_CORRECTION_PASS.md`

## 12. Implementation note

After this spec is approved, the next step is a writing-plans pass, then the edits. No new runtime. Closed-list check: Python count of `^### ` under `benchmarks/` equals 47 and the heading set equals section 7.
