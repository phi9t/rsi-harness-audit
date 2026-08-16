# Upstream Benchmark Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a source-fetched 47-benchmark map in ordinary English, and keep `BENCHMARKS.md` as the short file that says how the 16 papers used a slice.

**Architecture:** Two top-level markdown files. `UPSTREAM_BENCHMARKS.md` holds the glossary, the task-set / harness / scoring-protocol split, L0–L7 and R1–R5, 47 half-page cards, capability ladders, and pin rules. `BENCHMARKS.md` stays the cohort-slice file and only gains a pointer. Official pages win over the draft report. No paper grades change.

**Tech Stack:** Markdown in `/Users/phi9t/rsi-harness-audit`. Fetch with `curl` / arXiv HTML / official project pages. No new runtime.

**Spec:** `docs/superpowers/specs/2026-08-16-upstream-benchmark-map-design.md`

---

## File map

| File | Responsibility |
|---|---|
| Create: `UPSTREAM_BENCHMARKS.md` | Glossary, three objects, L/R, 47 cards, ladders, pins |
| Modify: `BENCHMARKS.md` | Pointer to the map; do not add 47 cards or extra SOTA rows |
| Modify: `README.md` | Table row for the map |
| Modify: `AGENTS.md` | One line: cohort slices vs upstream map |
| Unchanged | `RUBRICS.md`, `papers/*` |

## Card skeleton (every card uses this)

```markdown
### Official name

**Diagram / vendor label:** …
**Source:** URL (fetched YYYY-MM-DD).

**Given:** …
**Success:** …
**Size / pin:** …
**Level:** Lx / Ry. One sentence why.
**Sketch (not a real item):** …
**Do not mix:** …   # omit this line if there is no usual mix-up
```

Hard cap: about half a page. If the official source disagrees with the numbers below, follow the source and add one sentence: “Draft said X; official page says Y.” If fetch fails: keep the heading, write `**Source:** source not fetched.`, and do not invent counts or metrics.

Do not copy real benchmark instances. Sketches stay synthetic.

Fetch date: the calendar date of the curl, ISO `YYYY-MM-DD`.

## Language check (run after every card batch)

- Jargon only if the card needs it.
- First use in the file must be ordinary words + term + suite fact (see spec §4).
- Glossary at top must list every term used in cards.

---

### Task 1: Scaffold map, glossary, three objects, L/R

**Files:**
- Create: `UPSTREAM_BENCHMARKS.md`
- Modify: `BENCHMARKS.md` (opening paragraph only)
- Modify: `README.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Create `UPSTREAM_BENCHMARKS.md` through the complexity model (no cards yet)**

Write exactly this opening (adjust only if a later fetch contradicts a glossary example; then fix in Task 9):

```markdown
# Upstream benchmarks

This file is the **task set** map: what the benchmark authors released, how they score it, and which version to pin. It is not a leaderboard and not a grade of the 16 papers.

How those papers used a slice (SWE 60, MATH 617, AIME 2024 in-sample) lives in [`BENCHMARKS.md`](BENCHMARKS.md).

A vendor table often mixes three objects. The **task set** is the items, environment, and official metric. SWE-bench Verified is 500 human-checked issues scored by repository tests. The **harness** is the wrapper around a frozen model: tools, retries, context policy, time budget. A Codex or OpenHands score on SWE-bench is model plus harness, not a model-only number. The **scoring protocol** is how answers are checked. Replacing OSWorld’s filesystem grader with a judge that reads the model’s write-up changes the benchmark.

## Glossary

| Term | Meaning |
|---|---|
| Task set | Items, environment, and official metric the authors released. SWE-bench Verified: 500 issues, repository tests. |
| Harness | Tools, retries, context policy, time budget around a frozen model. |
| Scoring protocol | Hidden tests, final database state, point-in-box, rubric, or a model judge. |
| Public split | The subset released for inspection. MCP Atlas: 1,000 tasks, 500 public. |
| pass^k | Chance that k independent runs all succeed. τ-bench uses this instead of one lucky chat. |
| Claim coverage | MCP Atlas credit on required atomic claims; pass if coverage is at least 0.75. |
| Skill lift | SkillsBench: same task with vs without a curated skill bundle. |
| L0–L7 | How much of a changing world the agent must act in. FrontierMath is L0. OSWorld v1 is L5. |
| R1–R5 | How deep the reasoning is. ScreenSpot-Pro is R2. FrontierMath is R5. |

L0–L7 and R1–R5 are labels for this repo, not official ratings from the benchmark authors.

## What a diagram label usually is

| Label | Upstream object |
|---|---|
| MCP Atlas | Task set with 1,000 tasks over 36 MCP servers; diagrams often show the 500-task public split. |
| τ³-Banking / τ-Banking | The banking domain from τ-Knowledge, in the τ³-bench line. Not the original τ-bench airline/retail pair. |
| GDPval-AA | GDPval tasks plus Artificial Analysis (AA) harness and pairwise ranking. Not a second task set. |
| SkillsBench — With Skills | One condition of SkillsBench. Compare with vs without the skill bundle. |
| OSWorld-Verified | A snapshot of OSWorld v1 tasks/graders, not a different family from OSWorld 2.0. |
| Siren AgentDojo | AgentDojo is the task set. Prompt Siren builds stronger injection attacks. Report both. |
| HLE — Text, No Tools | A slice of Humanity’s Last Exam. Full HLE is 2,500 multimodal questions. |
| BEAM-128K | Twenty of BEAM’s 100 dialogues. Not the whole memory benchmark. |
| OmniDocBench v1.5 | Pin v1.5 data and matcher. Current main is a different release. |
| AIME 2026 | Two 15-question contests, integer answers 000–999. Independent of AIME 2025. |

## Operational level (the changing world)

A static research math problem and a 200-step desktop job are hard in different ways. Do not put them on one “easy to hard” line.

| Level | Meaning | Example |
|---|---|---|
| **L0** | One prompt, no tools, short answer. | FrontierMath |
| **L1** | Code or other output with a deterministic check. | ARC-AGI-2 (exact grid) |
| **L2** | Charts, documents, video, or long context; world does not keep changing. | CharXiv |
| **L3** | Narrow tools, search, or memory, limited state. | BFCL V4 |
| **L4** | Domain APIs, user simulator, persistent database, policy. | τ-bench |
| **L5** | Web, desktop, repos, terminals, many MCP servers. | OSWorld v1 |
| **L6** | Events, other agents, injection, time. | GAIA2 |
| **L7** | Professional or scientific deliverable, many valid paths, rubric. | PaperBench |

## Reasoning depth

| Level | Meaning | Example |
|---|---|---|
| **R1** | Lookup or extraction. | — |
| **R2** | Local composition, formatting, pick a control. | ScreenSpot-Pro |
| **R3** | Multi-step planning and recovery. | SWE-bench Verified |
| **R4** | Expert, policy, or cross-source synthesis. | DeepSearchQA |
| **R5** | Frontier specialist or research-level work. | FrontierMath |

FrontierMath is L0/R5. OSWorld v1 is L5/R3. The first is deeper; the second is a much larger world.

## Cards

Cards follow. Each was checked against the official page on the fetch date. Sketches are not real items.
```

- [ ] **Step 2: Point the cohort file at the map**

Replace the first paragraph of `BENCHMARKS.md` with:

```markdown
# Benchmarks this cohort used

Definitions, version pins, and the L/R ladder for 47 upstream suites are in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).

SOTA here means the **upstream** suite, not the best number inside these 16 papers. Snapshot date: **16 August 2026**.

When a paper reports a slice (MATH 617 level-5, ARC Easy ≤5×5, SWE 60 Django/Sphinx, AIME 2024 in-sample), that number is not the official leaderboard. Grade the experiment; look here for what the suite actually is.
```

Leave the rest of `BENCHMARKS.md` unchanged.

- [ ] **Step 3: Update README and AGENTS.md**

In `README.md`, change the benchmarks table row to two rows:

```markdown
| [BENCHMARKS.md](BENCHMARKS.md) | How these 16 papers used a slice (not the official leaderboard) |
| [UPSTREAM_BENCHMARKS.md](UPSTREAM_BENCHMARKS.md) | 47 official task sets, how they are scored, L/R, version pins |
```

In `AGENTS.md` Learned Workspace Facts, replace the entry-points bullet with:

```markdown
- Current entry points are `RUBRICS.md` (rules, ceilings, grade board, calibration), `papers/` (one file per paper, preprint plus official code), `BENCHMARKS.md` (how this cohort used a slice), `UPSTREAM_BENCHMARKS.md` (47 official task sets, scoring rules, L/R, pins), and `PEDANTIC_CORRECTION_PASS.md` (historical verification trail). `REPORT.md` and `GRADES_ROUND2.md` are stubs. Interactive boards live in the Cursor canvas folder.
```

Also add to Learned User Preferences (or keep the existing benchmarks bullet and extend it):

```markdown
- Keep `BENCHMARKS.md` for cohort slices and `UPSTREAM_BENCHMARKS.md` for official task-set definitions. Jargon in the map only if a card needs it; define it with a suite fact and list it in that file’s glossary.
```

- [ ] **Step 4: Commit**

```bash
git add UPSTREAM_BENCHMARKS.md BENCHMARKS.md README.md AGENTS.md
git commit -m "$(cat <<'EOF'
Add the upstream-benchmark map scaffold and point the cohort file at it.

EOF
)"
```

Expected: commit succeeds; `UPSTREAM_BENCHMARKS.md` has glossary + L/R and no `###` cards yet.

---

### Task 2: Fetch and write general-agent cards (8)

**Files:**
- Modify: `UPSTREAM_BENCHMARKS.md` (append under `## Cards`)

Fetch each URL. Confirm counts and metric. Then append a `###` card using the skeleton.

| Official name | Start URL | Draft facts to confirm | Level | Mix-up |
|---|---|---|---|---|
| MCP Atlas | https://arxiv.org/html/2602.00933v3 | 1,000 tasks, 36 servers, 220 tools, 500 public, 98.6% multi-server, claim coverage ≥ 0.75 | L5/R3 | Public 500 vs full 1,000 |
| DeepSearchQA | https://arxiv.org/html/2601.20975v1 | 900 questions, 17 fields, set P/R/F1 | L5/R4 | Not a prose-quality judge |
| τ-Knowledge / τ-Banking | https://arxiv.org/abs/2603.04370 | 698 docs, 21 product categories, DB state, pass^k | L5/R4 | Not original τ-bench airline/retail |
| WildClawBench | https://arxiv.org/html/2605.10912v1 | 60 bilingual/multimodal tasks, containers, minutes of work | L6/R4 | Safety content is in-task, not a separate suite |
| GDPval | https://openai.com/index/gdpval/ | 1,320 tasks, 220 public gold, 44 occupations, rubric / pairwise | L7/R4 | GDPval-AA is harness+ranker, not a second set |
| GAIA2 | https://facebookresearch.github.io/meta-agents-research-environments/ | 800 scenarios, 10 universes, events/time, state + oracle events | L6/R4 | Not original GAIA (466 questions) |
| SkillsBench | https://www.skillsbench.ai/blogs/skillsbench-1-1 | v1.1: 87 tasks, 8 domains, skill lift | L5/R3 | “With skills” is a condition |
| OSWorld v1 | https://osworld-v1.xlang.ai/ | 369 desktop tasks, screen + mouse/keyboard, state graders | L5/R3 | Not OSWorld 2.0; “Verified” is a snapshot |

Sketches (not real items):

- MCP Atlas: Read a supplier CSV, query products, get shipping rates, compute landed cost, list suppliers meeting four constraints.
- DeepSearchQA: Find every public company meeting three financial and geographic conditions; reconcile renamed subsidiaries; return the deduplicated set.
- τ-Banking: Credit-limit increase plus a dispute; filing the dispute first blocks the increase; do not trust a false user claim.
- WildClawBench: Inspect a launch video and files, extract three clips, write a report, ignore a hidden instruction asking for credentials.
- GDPval: From requirements and photos, design a one-person cable-spooling fixture and deliver a review-ready presentation.
- GAIA2: Schedule a meeting; a participant’s availability changes mid-run; revise invite and notify only those affected before a deadline.
- SkillsBench: Use a mounted packet-analysis skill to reconstruct flows, compute anomaly stats, write a verified incident report.
- OSWorld v1: Fix spreadsheet formulas, chart them, insert into a document, export PDF to the requested path.

- [ ] **Step 1: Fetch all eight URLs** (`curl -sL` or arXiv HTML). Record item counts and metrics.
- [ ] **Step 2: Append eight cards** after `## Cards`.
- [ ] **Step 3: Count `^### ` headings.** Expected: 8.
- [ ] **Step 4: Commit**

```bash
git add UPSTREAM_BENCHMARKS.md
git commit -m "$(cat <<'EOF'
Add eight general-agent upstream cards from official sources.

EOF
)"
```

---

### Task 3: Fetch and write coding cards from the diagram (4)

**Files:** Modify `UPSTREAM_BENCHMARKS.md`

| Official name | Start URL | Draft facts | Level | Mix-up |
|---|---|---|---|---|
| SWE-bench Pro | https://labs.scale.com/leaderboard/swe_bench_pro_public | 1,865 tasks: 731 public, 276 commercial, 858 held out; fail-to-pass + regression | L5/R4 | Not Verified’s 500 |
| SWE-bench Verified | https://www.swebench.com/verified.html | 500 human-validated; patch + repo tests | L5/R3 | Not Lite; not DGM’s 60 |
| Terminal-Bench 2.1 | https://github.com/harbor-framework/terminal-bench-2-1 | 89 shell tasks; hidden state verifiers | L5/R4 | Pin 2.1, not 2.0 |
| SciCode | https://arxiv.org/abs/2407.13168 | 80 mains, 338 subproblems, 16 fields; numeric tests | L1/R5 | Functions, not repo repair |

Sketches: large-service auth bug across modules; Django ORM query fix; recover SQLite+WAL; implement a stable numerical solver with hidden tolerances.

- [ ] **Step 1: Fetch four URLs.**
- [ ] **Step 2: Append four cards.** Running `^### ` count expected: 12.
- [ ] **Step 3: Commit** with message `Add SWE-Pro, Verified, Terminal-Bench 2.1, and SciCode cards.`

---

### Task 4: Fetch and write multimodal + safety + reasoning cards from the diagram (12)

**Files:** Modify `UPSTREAM_BENCHMARKS.md`

| Official name | Start URL | Draft facts | Level |
|---|---|---|---|
| CharXiv | https://arxiv.org/abs/2406.18521 | 2,323 charts; descriptive vs reasoning | L2/R4 |
| ScreenSpot-Pro | https://arxiv.org/html/2504.07981v1 | 1,581 screenshots, 23 apps; point in box | L1/R2 |
| OmniDocBench v1.5 | https://github.com/opendatalab/OmniDocBench | Pin v1.5 parser/matcher | L2/R2 |
| MMMU-Pro | https://arxiv.org/html/2409.02813v1 | Harder MMMU; vision-only variant | L2/R4 |
| CIMemories | https://arxiv.org/abs/2511.14937 | 100+ attributes; disclose vs withhold | L2/R4 |
| AgentDojo | https://arxiv.org/html/2406.13352v3 | 97 benign + security cases; utility vs attack success | L6/R3 |
| IFBench | https://arxiv.org/html/2507.02833v1 | 58 constraint families; deterministic checkers | L1/R2 |
| AIME 2026 | https://matharena.ai/competitions | 30 problems, two exams, 000–999 | L0/R4 |
| GPQA Diamond | https://arxiv.org/abs/2311.12022 | Full 448; Diamond 198 | L0/R5 |
| Humanity’s Last Exam | https://agi.safe.ai/ | 2,500 questions, 100+ subjects | L2/R5; text-only slice L0/R5 |
| AA-LCR | https://artificialanalysis.ai/articles/announcing-aa-lcr | 100 questions, ~100K tokens, no external retrieval | L2/R4 |
| BEAM | https://github.com/mohammadtavakoli78/BEAM | 100 dialogues, 2,000 questions; 20 in 128K | L2/R4 |

Mix-ups: AgentDojo vs Prompt Siren; HLE full vs text-no-tools; BEAM-128K vs 100 dialogues; AIME year and tools-allowed; OmniDocBench version; Diamond 198 vs 32-item paper vals.

Sketches: four-panel ablation read; opacity field not toolbar; two-column page to Markdown; reaction-diagram MC; physician message omit salary; summarize doc ignore exfil instruction; 120-word + token placement + no “q”; combinatorial integer; quantum/biochem MC; specialist image; reconcile fiscal segments across reports; latest still-valid travel preference after corrections.

- [ ] **Step 1: Fetch twelve URLs.**
- [ ] **Step 2: Append twelve cards.** `^### ` count expected: 24.
- [ ] **Step 3: Commit** with message `Add multimodal, safety, and reasoning cards from the diagram set.`

---

### Task 5: Fetch and write coverage additions — tools, web, computer (10)

**Files:** Modify `UPSTREAM_BENCHMARKS.md`

| Official name | Start URL | Draft facts | Level |
|---|---|---|---|
| GAIA | https://ai.meta.com/research/publications/gaia-a-benchmark-for-general-ai-assistants/ | 466 questions, 3 levels, short verifiable answers | L3/R4 |
| Berkeley Function-Calling Leaderboard V4 | https://gorilla.cs.berkeley.edu/leaderboard.html | AST / executable / relevance / state; pin V4 | L3/R2 |
| ToolSandbox | https://machinelearning.apple.com/research/toolsandbox-stateful-conversational-llm-benchmark | 1,032 cases; milestones vs minefields | L4/R3 |
| τ-bench | https://arxiv.org/abs/2406.12045 | Airline/retail; DB state; pass^k | L4/R3 |
| WebArena | https://arxiv.org/html/2307.13854v4 | 812 tasks, self-hosted sites, functional state | L5/R3 |
| VisualWebArena | https://arxiv.org/html/2401.13649v2 | 910 visual web tasks | L5/R3 |
| AppWorld | https://arxiv.org/abs/2407.18901 | 9 apps, 457 APIs, 750 tasks, hidden state tests | L5/R4 |
| MCP-Universe | https://arxiv.org/abs/2508.14704 | 231 tasks, 11 servers, 6 domains | L5/R3 |
| BrowseComp | https://openai.com/index/browsecomp/ | 1,266 hard-to-find short answers | L5/R4 |
| OSWorld 2.0 | https://arxiv.org/abs/2606.29537 | 108 long workflows; ~1.6h human median; not v1 | L6/R4 |

- [ ] **Step 1: Fetch ten URLs.**
- [ ] **Step 2: Append ten cards.** `^### ` count expected: 34.
- [ ] **Step 3: Commit** with message `Add tool-use, web, and computer-use coverage cards.`

---

### Task 6: Fetch and write coverage additions — coding, research, rest (13)

**Files:** Modify `UPSTREAM_BENCHMARKS.md`

| Official name | Start URL | Draft facts | Level |
|---|---|---|---|
| LiveCodeBench | https://sky.cs.berkeley.edu/project/livecodebench/ | Continuously refreshed contest problems; pass@1 | L1/R3 |
| BigCodeBench | https://arxiv.org/html/2406.15877v2 | 1,140 tasks, 139 libraries, 723 APIs | L1/R3 |
| SWE-bench Multilingual | https://www.swebench.com/multilingual.html | 300 tasks, 9 languages | L5/R3 |
| PaperBench | https://openai.com/index/paperbench/ | 20 papers, 8,316 rubric components | L7/R5 |
| ResearchClawBench | https://arxiv.org/abs/2606.07591 | 40 tasks, 10 domains, withheld target paper | L7/R5 |
| MathVista | https://mathvista.github.io/ | 6,141 examples, 28+3 datasets | L2/R3 |
| Video-MMMU | https://arxiv.org/html/2501.13826v1 | 300 videos, 900 questions | L2/R4 |
| LongBench v2 | https://longbench2.github.io/ | 503 MC; 8K–2M words | L2/R4 |
| RULER | https://github.com/NVIDIA/RULER | 13 synthetic tasks, 4 categories | L2/R2 |
| LongMemEval-V2 | https://arxiv.org/html/2605.12493v1 | 451 tasks; memory over history, not just a long prompt | L3/R4 |
| AgentHarm | https://arxiv.org/abs/2410.09024 | 110 base → 440 variants, 11 harm categories | L6/R3 |
| FrontierMath | https://arxiv.org/abs/2411.04872 | Unpublished research-level math | L0/R5 |
| ARC-AGI-2 | https://github.com/arcprize/ARC-AGI-2 | 1,000 train, 120 public eval; exact grid; pass@2 | L1/R5 |

- [ ] **Step 1: Fetch thirteen URLs.**
- [ ] **Step 2: Append thirteen cards.** `^### ` count expected: **47**.
- [ ] **Step 3: Commit** with message `Add coding, research, long-context, safety, and frontier cards.`

---

### Task 7: Ladders, pin rules, and closed-list check

**Files:** Modify `UPSTREAM_BENCHMARKS.md` (append after cards)

- [ ] **Step 1: Append the unified L ladder** using the spec §8 grouping. Operational level first, R in parentheses. Within a level, keep the source-report order.

```markdown
## Operational ladder (all 47)

Order is by how much world the agent must handle, not by leaderboard hardness.

| Level | Benchmarks |
|---|---|
| L0 | AIME 2026 (R4); GPQA Diamond (R5); FrontierMath (R5) |
| L1 | IFBench (R2); ScreenSpot-Pro (R2); LiveCodeBench (R3); BigCodeBench (R3); SciCode (R5); ARC-AGI-2 (R5) |
| L2 | OmniDocBench v1.5 (R2); RULER (R2); MathVista (R3); CharXiv (R4); MMMU-Pro (R4); Video-MMMU (R4); AA-LCR (R4); BEAM (R4); LongBench v2 (R4); CIMemories (R4); Humanity’s Last Exam (R5) |
| L3 | BFCL V4 (R2); GAIA (R4); LongMemEval-V2 (R4) |
| L4 | ToolSandbox (R3); τ-bench (R3) |
| L5 | MCP Atlas (R3); SkillsBench (R3); OSWorld v1 (R3); SWE-bench Verified (R3); WebArena (R3); VisualWebArena (R3); MCP-Universe (R3); SWE-bench Multilingual (R3); DeepSearchQA (R4); BrowseComp (R4); τ-Knowledge / τ-Banking (R4); SWE-bench Pro (R4); Terminal-Bench 2.1 (R4); AppWorld (R4) |
| L6 | AgentDojo (R3); AgentHarm (R3); WildClawBench (R4); GAIA2 (R4); OSWorld 2.0 (R4) |
| L7 | GDPval (R4); PaperBench (R5); ResearchClawBench (R5) |
```

If a fetch moved a level, update this table to match the cards. Every `###` name must appear once.

- [ ] **Step 2: Append capability tracks** in ordinary words:

```markdown
## Capability tracks

Compare along a track, not as one leaderboard.

**Tools and state.** BFCL V4 (call shape) → ToolSandbox (dependencies, clarification, device state) → τ-bench (users, policy, pass^k) → MCP Atlas / AppWorld (many tools, cross-app) → GAIA2 (events and time).

**GUI and computer use.** ScreenSpot-Pro (where to click) → VisualWebArena (browser sequence) → OSWorld v1 (desktop completion) → OSWorld 2.0 / WildClawBench (long, changing workflows).

**Coding and research.** LiveCodeBench / BigCodeBench → SciCode → SWE-bench Verified → Terminal-Bench 2.1 → PaperBench → ResearchClawBench.

**Long context and memory.** RULER (controlled needles) → LongBench v2 / AA-LCR (realistic long input) → BEAM (conversation state) → LongMemEval-V2 (memory over accumulated agent history).

**Web research.** GAIA (short verifiable answer) → BrowseComp (one obscure fact) → DeepSearchQA (exhaustive set) → GDPval / ResearchClawBench (professional or scientific artifact).

**Safety.** CIMemories (wrong disclosure from trusted memory) → AgentDojo (injections in untrusted tool data) → Prompt Siren on AgentDojo (stronger attacks; not a separate task set) → AgentHarm (harmful user goals and whether the agent can carry them out).
```

- [ ] **Step 3: Append pin rules**

```markdown
## How to keep the authors’ definition

A version is not only a JSON dump. Record:

```yaml
benchmark:
  task_release: exact tag or dataset revision
  task_manifest_hash: sha256
  evaluator_commit: exact git commit
  container_images: immutable digests
  official_metric: exact implementation
agent:
  harness_commit: exact git commit
  system_prompt_hash: sha256
  tool_schema_hash: sha256
  action_budget: exact limit
  context_policy: exact truncation and summarization
  retry_policy: exact behavior
```

Do not silently add capabilities: no tools on a no-tools set; no DOM on a screenshot-only set; no shell on a GUI set unless that condition is named; no RAG on a long-context set unless labeled as a RAG-system result.

Keep the authors’ metric: final-state checkers for OSWorld, WebArena, AppWorld, τ-bench, GAIA2; executable tests for SWE-bench, Terminal-Bench, LiveCodeBench, BigCodeBench, SciCode; point-in-box for ScreenSpot-Pro; set F1 for DeepSearchQA; claim coverage for MCP Atlas; rubrics for PaperBench and ResearchClawBench; benign utility **and** attack success for AgentDojo.

For interactive tasks, report pass^k, not only the mean. Keep traces, timeouts, environment errors, tokens, wall time, and tool-call counts.

Label the primary result as model + reasoning settings + harness + tools + environment version.
```

- [ ] **Step 4: Closed-list verification**

Run:

```bash
python3 - << 'PY'
from pathlib import Path
import re
text = Path('/Users/phi9t/rsi-harness-audit/UPSTREAM_BENCHMARKS.md').read_text()
heads = re.findall(r'^### (.+)$', text, re.M)
print('card count', len(heads))
print('\n'.join(heads))
assert len(heads) == 47, len(heads)
# BEAM once; no Prompt Siren heading; no SkillsBench With Skills heading
assert sum(1 for h in heads if 'BEAM' in h) == 1
assert not any('Siren' in h for h in heads)
assert not any('With Skills' in h for h in heads)
print('closed list ok')
PY
```

Expected: `card count 47` and `closed list ok`.

- [ ] **Step 5: Commit** with message `Add L/R ladders, capability tracks, and pin rules.`

---

### Task 8: Language pass and pointers

**Files:** `UPSTREAM_BENCHMARKS.md`, `BENCHMARKS.md`, `README.md`, `AGENTS.md`

- [ ] **Step 1: Glossary coverage.** Every glossary term must appear in running text with a suite fact (opening + three-object paragraph already does most). Search:

```bash
rg -n 'pass\^k|claim coverage|Skill lift|public split|harness|scoring protocol' /Users/phi9t/rsi-harness-audit/UPSTREAM_BENCHMARKS.md
```

If a term exists only in the glossary table, add one first-use sentence in the relevant card or in “What a diagram label usually is.”

- [ ] **Step 2: Forbidden content.** No real exam questions, no SWE private patches, no copied items. Sketches must keep the words `not a real item`.

```bash
rg -n 'Sketch \(not a real item\)' /Users/phi9t/rsi-harness-audit/UPSTREAM_BENCHMARKS.md | wc -l
```

Expected: 47.

- [ ] **Step 3: Confirm `RUBRICS.md` and `papers/` were not edited** (`git diff --stat`).
- [ ] **Step 4: Confirm `BENCHMARKS.md` still has cohort columns only** (no 47-card dump).
- [ ] **Step 5: Commit** with message `Tighten glossary first-use and verify the 47-card closed list.`

---

## Spec coverage

| Spec section | Task |
|---|---|
| Two files; not a folder; not rubric | 1 |
| Glossary + language rules | 1, 8 |
| Three objects + diagram labels | 1 |
| L/R model | 1, 7 |
| 47 cards + source fetch | 2–6 |
| BEAM one card; Siren not a card | 4, 7 |
| Ladders + pins | 7 |
| Cohort file pointer, no extra SOTA | 1, 8 |
| README / AGENTS | 1 |
| No re-grade, no copied instances | 8 |
| Done-when checklist | 7–8 |

## Placeholder scan

No TBD/TODO. Fetch failures use the explicit `source not fetched` line from the card skeleton.
