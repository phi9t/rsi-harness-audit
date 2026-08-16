# Upstream benchmark map — design

**Date:** 16 August 2026  
**Status:** approved for spec review; not yet implemented  
**Repo job this serves:** keep scoring the 16 harness/RSI papers honest about *which suite they ran*, and publish a separate, checkable map of 47 upstream benchmarks written in ordinary words.

## 1. Problem

`BENCHMARKS.md` today only lists suites the 16 papers used, plus a thin “this is not that leaderboard” note. That is the right job for the audit, and the wrong job for a capability map.

A diagram or vendor table often mixes three different objects:

1. The **task set** the benchmark authors released (items, environment, canonical metric).
2. An **agent harness** (tools, retries, context policy, time budget).
3. A **third-party scoring protocol** (model judge, sampling, filtering, aggregation).

This work splits those jobs into two files and rewrites the 47-bench report so a reader can tell which object a number is about.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Layout | Two top-level files, not a `benchmarks/` folder, not folded into `RUBRICS.md` |
| Cohort file | Keep `BENCHMARKS.md` as the short “this paper used this slice” file |
| Map file | New `UPSTREAM_BENCHMARKS.md` |
| Card depth | Full card, about half a page, one file |
| Synthetic tasks | Keep, labeled **not a real item** |
| Sources | Fetch the official page, paper, or repo for all 47. Source wins if it disagrees with the draft report |
| SOTA snapshots | Stay in `BENCHMARKS.md` only, and only for suites this cohort actually ran |
| Language | Ordinary words. Jargon only if a card needs it. First use: definition + suite fact. Same terms in a glossary at the top of the map |
| Grades | Do not re-grade the 16 papers in this pass |
| Copying | Do not copy real benchmark instances |

## 3. Files to create or change

| File | Action |
|---|---|
| `UPSTREAM_BENCHMARKS.md` | Create. Glossary, three-object split, L/R, 47 cards, ladders, pins |
| `BENCHMARKS.md` | Keep as cohort file. Add a pointer to the map. Do not grow it into 47 cards |
| `README.md` | Name both files in the table |
| `AGENTS.md` | One line: cohort slices vs upstream map |
| `docs/superpowers/specs/2026-08-16-upstream-benchmark-map-design.md` | This spec |
| `RUBRICS.md`, `papers/*` | Unchanged in this pass |

## 4. Language rules

Write like the rubric: concise, precise, plain English.

- Prefer “what the agent is given” and “what counts as success” over “eval harness” until the glossary has defined those words.
- If a term is necessary, introduce it once in running text: ordinary words, then the term, then a suite fact. Example: “τ-bench checks the final database against the goal state, not whether the conversation sounded right. Repeated success is pass^k: the chance that k independent trials all succeed.”
- Put every such term in the glossary. The glossary must not invent a second vocabulary. Same sentence meaning as the first-use definition, shorter.
- Do not stack unexplained acronyms. “AA” is written out as Artificial Analysis the first time, then “AA” is allowed.
- L0–L7 and R1–R5 are glossary entries. In a card, write `L5 / R3` and one sentence why, not a new nickname.

## 5. Glossary (minimum set)

The map file opens with a glossary. Add a term only if a card uses it. Start with:

| Term | Meaning, with a suite fact |
|---|---|
| Task set | The items, environment, and official metric the benchmark authors released. SWE-bench Verified is 500 human-checked issues scored by repository tests. |
| Harness | The wrapper around a frozen model: tools, retries, context policy, time budget. A Codex or OpenHands score on SWE-bench is model + harness, not a model-only number. |
| Scoring protocol | How answers are checked: hidden tests, final database state, point-in-box, rubric, or a model judge. Replacing OSWorld’s filesystem grader with a prose judge changes the benchmark. |
| Public split | The subset released for inspection. MCP Atlas has 1,000 tasks; 500 are public. |
| pass^k | Probability that k independent runs all succeed. τ-bench uses this instead of a single lucky chat. |
| Claim coverage | MCP Atlas credit on required atomic claims; main pass threshold is coverage at least 0.75. |
| Skill lift | SkillsBench: same task with vs without a curated skill bundle. |
| L0–L7 | How much of a changing world the agent must act in. FrontierMath is L0 (one answer, no tools). OSWorld v1 is L5 (real desktop). |
| R1–R5 | How deep the reasoning is. ScreenSpot-Pro is R2 (point at a control). FrontierMath is R5 (research-level math). |

L/R are analytical labels for this repo, not official ratings from the benchmark authors.

## 6. Map file structure (`UPSTREAM_BENCHMARKS.md`)

1. Title and one-paragraph purpose.
2. Glossary.
3. The three objects (task set / harness / scoring protocol), with the diagram-label table (MCP Atlas public split, τ-Banking vs τ-bench, GDPval-AA, SkillsBench with-skills, OSWorld-Verified vs v1, Siren vs AgentDojo, HLE text-only, BEAM-128K, OmniDocBench v1.5, AIME year).
4. Complexity model: L0–L7 and R1–R5, each with one example. State that one “easy to hard” list is misleading (FrontierMath vs OSWorld).
5. The 47 cards, grouped as in the source report (general agents, coding, multimodal, safety, reasoning/long-context, then the coverage additions).
6. Unified L ladder (all 47, operational level, R in parentheses).
7. Capability tracks: tools, GUI, coding/research, long context/memory, web research, safety.
8. How to keep the upstream definition when running: pin YAML (task release, evaluator commit, container digest, metric); agent pin (harness commit, tool schema, budget, context policy); do not silently add tools; keep the author’s metric; report pass^k and traces for interactive work; label model + harness + tools + environment.

## 7. Card template

Hard cap: about half a page. Use this skeleton:

```markdown
### Official name

**Diagram / vendor label:** what that label actually is, or “same as official name.”
**Source:** URL (fetched YYYY-MM-DD). If source and draft disagree, say so and follow the source.

**Given:** what the agent sees (files, tools, screen, user simulator, documents).
**Success:** the released scoring rule in one or two sentences.
**Size / pin:** item count, public vs held-out, version tag that must not be swapped.
**Level:** Lx / Ry. One sentence why.
**Sketch (not a real item):** one synthetic task.
**Do not mix:** the usual harness/protocol/split error, or omit this line.
```

## 8. The 47 benchmarks (closed list)

Do not add a 48th in this pass. Do not drop one without a source-not-found note.

**From the diagram (24):** MCP Atlas; DeepSearchQA; τ-Knowledge / τ-Banking; WildClawBench; GDPval; GAIA2; SkillsBench; OSWorld v1; SWE-bench Pro; SWE-bench Verified; Terminal-Bench 2.1; SciCode; CharXiv; ScreenSpot-Pro; OmniDocBench v1.5; MMMU-Pro; CIMemories; AgentDojo; IFBench; AIME 2026; GPQA Diamond; Humanity’s Last Exam; AA-LCR; BEAM (including the 128K bucket as a slice, not a separate task set).

**Coverage additions (23):** GAIA; Berkeley Function-Calling Leaderboard V4; ToolSandbox; τ-bench; WebArena; VisualWebArena; AppWorld; MCP-Universe; BrowseComp; OSWorld 2.0; LiveCodeBench; BigCodeBench; SWE-bench Multilingual; PaperBench; ResearchClawBench; MathVista; Video-MMMU; LongBench v2; RULER; LongMemEval-V2; AgentHarm; FrontierMath; ARC-AGI-2.

Count rule: BEAM and BEAM-128K are one upstream benchmark with a length bucket, not two task sets. Prompt Siren is an attack framework, mentioned on the AgentDojo card, not a 48th benchmark. SkillsBench “with skills” is a condition, not a second suite. GDPval-AA is GDPval plus an AA harness/protocol.

If an official source cannot be fetched, keep the card, mark **source not fetched**, and do not invent size or metric numbers.

## 9. Fetch rule

For each of the 47:

1. Open the official page, paper, or repository cited in the source report (arxiv, project page, GitHub, maintainer site).
2. Confirm: item counts, metric, version name, public vs private split.
3. If the draft report is wrong, correct the card and note the disagreement in one line.
4. Write the URL and fetch date on the card.
5. Do not scrape or paste hidden test items, private patches, or full problem statements.

Starting URLs are those listed in the source report (MCP Atlas arXiv 2602.00933, τ-Knowledge 2603.04370, GDPval OpenAI index, SkillsBench 1.1 blog, OSWorld v1 site, AgentDojo 2406.13352, HLE agi.safe.ai, BEAM GitHub, OmniDocBench GitHub, MathArena for AIME, and the rest of the cited set). Implementation may follow redirects to the current canonical page.

## 10. Cohort file (`BENCHMARKS.md`)

Keep the current columns: Official / This cohort / Upstream SOTA pointer.

Changes in this pass:

- First paragraph points to `UPSTREAM_BENCHMARKS.md` for definitions, L/R, and pins.
- Do not duplicate the 47 cards here.
- Do not add SOTA rows for suites the cohort never ran.
- Existing cohort-use facts stay (SWE 60, MATH 617, AIME 2024 in-sample, AppWorld offline vs online, GAIA not searched).

## 11. Out of scope

- Interactive canvases (declined for this design).
- Re-running any benchmark.
- Dated leaderboard tables for all 47.
- Changing Eval / Search / Object / RSI letters.
- Copying real tasks from any suite.

## 12. Done when

- `UPSTREAM_BENCHMARKS.md` exists, opens with a glossary, contains 47 cards in the template, each with a source URL and fetch date or an explicit source-not-fetched line.
- Every glossary term appears in running text with a suite fact.
- Ladders and pin list are present.
- `BENCHMARKS.md` is still the short cohort file and links to the map.
- README and `AGENTS.md` name both files.
- No real benchmark instance is copied.
- A reader can tell GDPval from GDPval-AA, OSWorld v1 from 2.0, and AgentDojo from Prompt Siren without leaving the map.

## 13. Implementation note

After this spec is approved, the next step is a writing-plans pass, then fetch-and-write. Fetch may be batched (groups of suites) but every card still needs its own source check.
