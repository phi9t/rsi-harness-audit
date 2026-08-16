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
| fail-to-pass | New tests that fail on the original code and must pass after the patch. SWE-bench Pro resolve rate requires this plus no regressions. |
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

### MCP Atlas

**Diagram / vendor label:** MCP Atlas; vendor tables often show the 500-task public split.
**Source:** https://arxiv.org/html/2602.00933v3 (fetched 2026-08-16).

**Given:** A single-turn natural-language request that does not name servers, tools, or parameters. Live MCP endpoints from 36 production servers exposing 220 tools. Each task shows 6–37 tools, of which only 2–8 are required; the rest are distractors.
**Success:** Each task lists atomic factual claims grounded in tool outputs. A judge scores each claim fulfilled, partial, or not. Task-level **claim coverage** is the mean claim score; the task passes if coverage is at least 0.75.
**Size / pin:** 1,000 tasks, randomly split 500 public / 500 private. 98.6% require two or more servers. Pin the full 1,000 unless the public split is named.
**Level:** L5 / R3. Many live MCP servers and multi-step cross-server recovery, not a single known API.
**Sketch (not a real item):** Read a supplier CSV, query products, get shipping rates, compute landed cost, and list suppliers that meet four constraints.
**Do not mix:** The 500-task public split is not the full 1,000-task set.

### DeepSearchQA

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2601.20975v1 (fetched 2026-08-16).

**Given:** A time-anchored information-seeking prompt on the open web. The agent must return an exhaustive answer set, not one fact.
**Success:** Set precision, recall, and F1 against a ground-truth answer set (order does not matter). F1 is the ranking metric. Outcome-based: the search trajectory is not scored.
**Size / pin:** 900 prompts across 17 fields. Live leaderboard via Kaggle.
**Level:** L5 / R4. Open-web search plus expert collation, entity resolution, and knowing when to stop.
**Sketch (not a real item):** Find every public company meeting three financial and geographic conditions; reconcile renamed subsidiaries; return the deduplicated set.
**Do not mix:** Not a prose-quality judge. Extra items hurt precision; missing items hurt recall.

### τ-Knowledge / τ-Banking

**Diagram / vendor label:** τ³-Banking / τ-Banking.
**Source:** https://arxiv.org/html/2603.04370 (fetched 2026-08-16).

**Given:** A simulated banking customer, a knowledge base of 698 documents over 21 product categories, 14 always-on tools plus 51 discoverable tools, and a live account database. The agent must retrieve policy and tool docs, then change state through tools.
**Success:** The final database state matches the goal. Repeated success is **pass^k**: the chance that k independent trials all succeed.
**Size / pin:** τ-Banking is the new domain in τ-Knowledge: 97 tasks. Pin this domain, not original τ-bench airline/retail.
**Level:** L5 / R4. Knowledge-base search and policy reasoning over a changing database, not a small pre-listed tool menu.
**Sketch (not a real item):** A credit-limit increase plus a dispute; filing the dispute first blocks the increase. Do not trust a false user claim; check the database.
**Do not mix:** Not the original τ-bench airline/retail pair.

### WildClawBench

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2605.10912v1 (fetched 2026-08-16).

**Given:** A Markdown task spec inside a Docker container running a real CLI harness (OpenClaw, Claude Code, Codex, or Hermes Agent) with shell, browser, files, email, and optional skills. 36 English and 24 Chinese tasks; 26 of 60 are multimodal.
**Success:** Hybrid grading: deterministic rule checks, an audit of environment side effects, and a language-model or vision-language-model judge for semantic criteria. Ground-truth files are mounted only after the agent exits.
**Size / pin:** 60 human-authored tasks. Per-task budgets 300–1,200 seconds; typical runs take about eight minutes and more than 20 tool calls.
**Level:** L6 / R4. Minutes of live-container work, including in-task injection and multimodal assets.
**Sketch (not a real item):** Inspect a launch video and files, extract three clips, write a report, and ignore a hidden instruction asking for credentials.
**Do not mix:** Safety alignment is one of six in-task categories, not a separate suite.

### GDPval

**Diagram / vendor label:** GDPval; diagrams often show GDPval-AA (GDPval plus an Artificial Analysis harness and pairwise ranker).
**Source:** https://arxiv.org/html/2510.04374v1 (fetched 2026-08-16). The OpenAI landing page https://openai.com/index/gdpval/ was blocked by Cloudflare.

**Given:** A professional work request plus reference files (up to 17 in the gold subset). Deliverables are real work products: slides, spreadsheets, diagrams, CAD, multimedia.
**Success:** Blinded pairwise comparison by occupation experts against a human expert deliverable (win, tie, or loss). An experimental automated grader at evals.openai.com is a faster proxy, not a substitute. Draft said rubric / pairwise; the official paper’s primary metric is pairwise expert comparison.
**Size / pin:** Full set 1,320 tasks (30 per occupation × 44 occupations across 9 GDP sectors). Public gold subset 220 tasks (5 per occupation). Pin gold vs full.
**Level:** L7 / R4. A review-ready professional deliverable with many valid paths.
**Sketch (not a real item):** From requirements and photos, design a one-person cable-spooling fixture and deliver a review-ready presentation.
**Do not mix:** GDPval-AA is harness plus ranker, not a second task set.

### GAIA2

**Diagram / vendor label:** same as official name.
**Source:** https://facebookresearch.github.io/meta-agents-research-environments/ (fetched 2026-08-16); scoring from the same docs’ Gaia2 evaluation page and ARE, https://arxiv.org/html/2509.17158v1.

**Given:** A simulated user universe (email, chats, calendar, files, shopping, cabs, and related apps). Time runs while the agent works; environment events change state. 11 apps across 10 universes.
**Success:** The Meta Agents Research Environments (ARE) verifier matches the agent’s write actions to annotated ground-truth write events (oracle events), checking tool identity, arguments (exact match or a model judge on free text), causality, and timing. Mean success over three independent runs (the paper’s Pass@1). That is not pass^k (all k runs succeed).
**Size / pin:** 800 core scenarios across 10 universes (160 per each of five core capabilities). Gaia2-mini is 160. Agent2Agent and Noise augmentations add 320 on mini (1,120 when counted together). Pin Gaia2, not original GAIA.
**Level:** L6 / R4. Events, time, and other agents, not a static Q&A page.
**Sketch (not a real item):** Schedule a meeting; a participant’s availability changes mid-run; revise the invite and notify only those affected before a deadline.
**Do not mix:** Not original GAIA (466 questions).

### SkillsBench

**Diagram / vendor label:** SkillsBench — With Skills is one condition, not a second suite.
**Source:** https://www.skillsbench.ai/blogs/skillsbench-1-1 (fetched 2026-08-16).

**Given:** A BenchFlow `task.md` package (environment, oracle, verifier) in a container. Condition A is instruction-only. Condition B mounts a curated skill bundle without naming the skills in the instruction.
**Success:** Deterministic tests against a withheld oracle. **Skill lift** is the same task with vs without the curated bundle.
**Size / pin:** SkillsBench 1.1: 87 tasks, 8 domains (GitHub release v1.1). Core / Extended / Extreme time tiers. Pin v1.1, not an earlier roster.
**Level:** L5 / R3. Containerized multi-step work with optional skills, not a one-shot prompt.
**Sketch (not a real item):** Use a mounted packet-analysis skill to reconstruct flows, compute anomaly stats, and write a verified incident report.
**Do not mix:** “With skills” is a condition of the same 87-task roster.

### OSWorld v1

**Diagram / vendor label:** OSWorld-Verified is a snapshot of OSWorld v1 tasks and graders, not a different family from OSWorld 2.0.
**Source:** https://osworld-v1.xlang.ai/ (fetched 2026-08-16).

**Given:** A real Ubuntu desktop with screen pixels plus mouse and keyboard. Windows and macOS environments exist; the 369-task set is the Ubuntu benchmark. A task config restores an initial desktop state across web and desktop apps.
**Success:** Custom execution-based evaluation scripts that inspect files and application state, not the agent’s write-up. 134 such graders for 369 tasks.
**Size / pin:** 369 computer tasks. Eight Google Drive tasks may be dropped (361) if they fail to initialize. Pin OSWorld v1 / OSWorld-Verified; OSWorld 2.0 is a later release.
**Level:** L5 / R3. Open desktop with many apps and recovery, not a single widget.
**Sketch (not a real item):** Fix spreadsheet formulas, chart them, insert the chart into a document, and export a PDF to the requested path.
**Do not mix:** Not OSWorld 2.0. “Verified” is a snapshot of this v1 set.

### SWE-bench Pro

**Diagram / vendor label:** same as official name; tables sometimes treat this as generic “SWE-bench.”
**Source:** https://labs.scale.com/leaderboard/swe_bench_pro_public (fetched 2026-08-16).

**Given:** A GitHub-style issue plus a Dockerized professional codebase (consumer apps, B2B services, developer tools). Human experts write a problem statement and a requirements brief. The agent submits a code patch.
**Success:** Resolve rate: the share of tasks marked resolved. New tests that fail on the original code (**fail-to-pass**) must pass after the patch, and existing tests that already passed must still pass (no regressions).
**Size / pin:** 1,865 tasks across 41 repositories: 731 public copyleft open-source, 276 private proprietary from startups, 858 held out. Pin the named split. Draft said 276 commercial; the official page calls that split private / proprietary.
**Level:** L5 / R4. Multi-file repair in real services (about 107 lines across four files on average), not a single-function edit.
**Sketch (not a real item):** An auth bug in a large service: tokens validate in the API module, but session revocation never reaches billing and admin.
**Do not mix:** Not SWE-bench Verified’s 500.

### SWE-bench Verified

**Diagram / vendor label:** same as official name.
**Source:** https://www.swebench.com/verified.html (fetched 2026-08-16); Lite and full sizes from https://www.swebench.com/.

**Given:** A real GitHub issue and the matching Python repository at a frozen commit. The agent writes a patch.
**Success:** % Resolved: apply the patch in Docker and run the repository’s tests. The issue is solved if the tests that encode the fix pass and previously passing tests still pass.
**Size / pin:** 500 human-filtered instances from SWE-bench (annotators checked that the description is clear, the tests are correct, and the task is solvable). The original SWE-bench test set is 2,294. SWE-bench Lite is a separate 300-instance cheaper subset.
**Level:** L5 / R3. Full repositories with multi-step recovery, not a one-file coding puzzle.
**Sketch (not a real item):** A Django object-relational mapping (ORM) query double-counts joined rows; fix the query so the project’s tests pass.
**Do not mix:** Not Lite (300). Not this cohort’s SWE 60 (the Django/Sphinx slice used by DGM).

### Terminal-Bench 2.1

**Diagram / vendor label:** same as official name.
**Source:** https://github.com/harbor-framework/terminal-bench-2-1 (fetched 2026-08-16); 89-task roster at https://hub.harborframework.com/datasets/terminal-bench/terminal-bench-2-1/latest; scoring from https://arxiv.org/html/2601.11868 (the 2.0 paper; 2.1 keeps the same count).

**Given:** A natural-language instruction inside a Docker container with a shell and files. The agent may use any commands; it is not shown the tests.
**Success:** Tests check properties of the final container state, not the command trace. A task is solved if those tests pass. The leaderboard requires five trials per task; report the mean. That is not pass^k (all five must succeed).
**Size / pin:** 89 container terminal tasks. Version 2.1 is a verified iteration of 2.0: 26 tasks were changed for bugs, timeouts, resources, or reward-hacking. Pin 2.1.
**Level:** L5 / R4. Long-horizon expert work in a live terminal, not a single script with public unit tests.
**Sketch (not a real item):** After a crash, restore a local SQLite database whose write-ahead log (WAL: extra files that hold uncommitted writes) is out of sync with the main file. The verifier checks recovered tables, not the commands used.
**Do not mix:** Pin 2.1, not 2.0.

### SciCode

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2407.13168 (fetched 2026-08-16).

**Given:** A scientist-written research coding problem with docstring inputs and outputs. Each of 80 main problems splits into subproblems (338 total) across 16 natural-science subfields. Optional scientist-written background. The model implements Python functions and composes them.
**Success:** Automatic tests: numerical input–output checks plus domain-specific cases that reproduce a published result or an analytical solution. A main problem counts only if every subproblem and the integrated solution pass. Reported metric is pass@1 (one sample succeeds). That is not pass^k (all k runs succeed). The headline is main-problem pass@1 under the paper’s standard setup: no scientist-written background, and later subproblems see the model’s generated code, not gold. Draft said numeric tests; the paper also uses those domain-specific cases.
**Size / pin:** 80 main problems, 338 subproblems. Development 15 mains / 50 subproblems; test 65 mains / 288 subproblems.
**Level:** L1 / R5. Deterministic function tests at research-level science, not repository repair.
**Sketch (not a real item):** Implement a stable numerical solver whose hidden tests check residuals against tight tolerances the prompt does not state.
**Do not mix:** Functions and numeric/domain tests, not SWE-bench repo repair. Not with-background pass@1 and not the subproblem rate.

### CharXiv

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2406.18521 (fetched 2026-08-16).

**Given:** A chart image from an arXiv paper. No caption, no surrounding text, and no specialist field knowledge. Two question types: descriptive (title, labels, ticks, counts) and reasoning (compare, approximate, or analyze across visual elements).
**Success:** A GPT-4o judge extracts the answer and scores it binary. Exact string match is not used, because math notation can be typed in more than one way. Report descriptive and reasoning accuracy separately; validation answers are public, test answers are held out.
**Size / pin:** 2,323 charts (validation 1,000 / test 1,323) across 8 subjects and 4 years. 9,292 descriptive questions from 19 templates plus one reasoning question per chart (2,323). Pin the named split.
**Level:** L2 / R4. Static charts; reasoning items need cross-element synthesis, not a lookup.
**Sketch (not a real item):** From a four-panel ablation figure, read which training recipe keeps validation loss lowest after epoch 50.
**Do not mix:** Descriptive accuracy is not reasoning accuracy. Not ChartQA or MathVista’s chart slice.

### ScreenSpot-Pro

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2504.07981v1 (fetched 2026-08-16).

**Given:** A high-resolution screenshot from a professional app and a short instruction naming the control to click. 23 applications across five industries (development, creative, computer-aided design, scientific, office) plus OS screens, on Windows, macOS, and Linux. Targets are tiny: about 0.07% of the image on average.
**Success:** **Point-in-box:** the predicted click, or the center of a predicted box, must land inside the annotated ground-truth box. Accuracy is the share of instructions that hit.
**Size / pin:** 1,581 instructions, each on a unique screenshot. Pin ScreenSpot-Pro, not ScreenSpot or ScreenSpot-v2 (cropped, easier targets).
**Level:** L1 / R2. One click with a deterministic geometry check; pick a control, not a multi-step desktop job.
**Sketch (not a real item):** On a compositor panel, click the layer opacity field, not the nearby toolbar icon.
**Do not mix:** Not ScreenSpot. Not OSWorld, which grades desktop state after many actions.

### OmniDocBench v1.5

**Diagram / vendor label:** OmniDocBench v1.5; current `main` is a later release.
**Source:** https://github.com/opendatalab/OmniDocBench/blob/v1_5/README.md (fetched 2026-08-16). The default `main` README on the same day describes v1.6/v1.7 (1,651 pages).

**Given:** A PDF page image. The parser must emit Markdown (or module outputs) covering text, tables, formulas, and reading order. Pages span 9 document types, 4 layouts, and 3 languages (English, Simplified Chinese, mixed).
**Success:** End-to-end Overall is the mean of three scores: (1 − text edit distance) × 100, table TEDS (tree-edit-distance similarity), and formula CDM (the suite’s render-based formula score). v1.5 matching is **hybrid matching** (`quick_match`): formulas and text may match each other so Unicode formula dumps are not scored as misses.
**Size / pin:** v1.5: 1,355 pages (v1.0’s 981 plus 374 added on 2025-09-25). Pin v1.5 data and the v1.5 matcher. Draft said pin v1.5 parser/matcher; the official v1.5 README names the hybrid matcher and 1,355 pages, not a separate “parser” pin.
**Level:** L2 / R2. Static page to structured text; local layout and formatting, not a changing desktop.
**Sketch (not a real item):** Convert a two-column methods page with an inline formula and a small table into Markdown that preserves reading order.
**Do not mix:** Not v1.0 (981 pages) and not current `main` (v1.6+). Swapping the matcher changes the number.

### MMMU-Pro

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2409.02813v1 (fetched 2026-08-16).

**Given:** A college-level multimodal question. Standard setting: image plus text with up to 10 multiple-choice options. Vision-only setting: the same question embedded in a screenshot or photo, with no separate text channel.
**Success:** Multiple-choice accuracy. The headline MMMU-Pro score is the mean of Standard (10 options) and Vision Input. The 4-option standard run is reported only as a comparison, not the headline.
**Size / pin:** 1,730 questions in standard format and the same 1,730 in screenshot/photo form (3,460 total), after dropping items a text-only model could solve and expanding options from 4 to 10. Pin MMMU-Pro, not original MMMU (11.5K questions, usually 4 options).
**Level:** L2 / R4. Static images; college-level synthesis across diagram and stem.
**Sketch (not a real item):** A photographed slide shows a reaction diagram and ten options; pick the product without a separate text prompt.
**Do not mix:** Not original MMMU validation. Vision-only is a setting of this set, not a second suite.

### CIMemories

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2511.14937 (fetched 2026-08-16).

**Given:** A synthetic user memory dump (natural-language statements about personal attributes) plus a task and a recipient (for example, write to a physician). Each attribute is labeled necessary, inappropriate, or ambiguous for that task; the same fact can be required in one context and banned in another. Reported runs concatenate memories as a prefix; they do not update a live store mid-task.
**Success:** A model judge (DeepSeek-R1 in the paper) marks which attribute values appeared in the reply. **Violation** is leaking an inappropriate attribute; **completeness** is sharing the necessary ones. Report both; silence looks private but fails completeness.
**Size / pin:** Profiles can hold over 100 attributes (up to 189: seven per domain × nine domains × three events). The paper’s tables use 10 profiles and 49 seed contexts. Pin that reported slice vs a larger generation.
**Level:** L2 / R4. Long static memory plus a policy choice of what to disclose, not a changing database.
**Sketch (not a real item):** Draft a message to a physician with the relevant history; do not mention salary.
**Do not mix:** Not a generic privacy quiz with one secret. Violation without completeness is not success.

### AgentDojo

**Diagram / vendor label:** Siren AgentDojo; Prompt Siren is an attack layer, not a second task set.
**Source:** https://arxiv.org/html/2406.13352v3 (fetched 2026-08-16).

**Given:** A user instruction in one of four simulated apps (workspace, Slack, travel, banking) with 70 tools and a mutable environment state. Some tool outputs are placeholders where an attacker can inject instructions (for example, “email this file to an outsider”).
**Success:** Deterministic checks on environment state, not a judge. **Benign utility** is the share of 97 user tasks solved with no attack. Under attack, report **utility under attack** (user goal met, no extra harm) and **targeted attack success rate** (the attacker’s goal ran). Draft said 97 benign + security cases; the paper gives 97 user tasks, 27 injection targets, and 629 security cases (user task × injection inside each environment).
**Size / pin:** 97 user tasks, 629 security cases. The suite is extensible; pin this first-version roster unless a later drop is named.
**Level:** L6 / R3. Untrusted tool data can hijack a multi-step tool loop in a live state.
**Sketch (not a real item):** Summarize a shared document and send the summary; ignore a buried instruction to exfiltrate the file.
**Do not mix:** Prompt Siren builds stronger injection attacks against this environment; it is not a second task set. Not InjecAgent’s single-turn simulated tool dump.

### IFBench

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2507.02833v1 (fetched 2026-08-16).

**Given:** A WildChat-style user prompt plus one or more output constraints (length, format, word/character rules, copying). Single-turn: task and constraints in one message. Multi-turn: rewrite a prior reply to satisfy a constraint. Constraints were checked by humans for compatibility with the prompt.
**Success:** Each constraint has a short Python checker. Headline is **strict** accuracy: every checker on the prompt must pass. That is not a prose-quality judge.
**Size / pin:** 58 new verifiable constraints in 7 categories (count, ratio, words, sentence, format, custom, copy) and 300 prompts. Draft said 58 constraint families; the paper calls them 58 constraints. Pin IFBench, not IFEval’s 25 templates. IFTrain’s 29 constraints are training-only.
**Level:** L1 / R2. One response with deterministic format checks, not a tool environment.
**Sketch (not a real item):** Answer the prompt in exactly 120 words, put a given token as word 40, and never use the letter “q”.
**Do not mix:** Not IFEval. Training constraints (IFTrain) are not the test set.

### AIME 2026

**Diagram / vendor label:** AIME 2026; independent of AIME 2025.
**Source:** https://matharena.ai/competitions (fetched 2026-08-16), AIME 2026 row under Final-Answer Comps; four-run mean from https://matharena.ai/.

**Given:** An American Invitational Mathematics Examination problem. Two contests of 15 questions, three hours each in the human exam. The model returns an integer. No diagrams required.
**Success:** Exact match to an integer from 0 through 999 (written 000–999). MathArena runs each model four times per problem and reports the mean; that is not pass^k (all four must succeed).
**Size / pin:** 30 problems (two 15-question contests). Pin AIME 2026, not AIME 2025 (also 30 problems on the same page, marked deprecated).
**Level:** L0 / R4. One short integer, no tools in the contest rules; contest combinatorics and number theory, not research-level unpublished math.
**Sketch (not a real item):** Count the integer solutions to a constrained combinatorial equation; answer with a three-digit integer.
**Do not mix:** Not AIME 2025 or this cohort’s AIME 2024 in-sample slice. A tools-allowed or calculator run is a different protocol from the contest’s no-calculator integer.

### GPQA Diamond

**Diagram / vendor label:** same as official name; tables sometimes say GPQA.
**Source:** https://arxiv.org/html/2311.12022 (fetched 2026-08-16).

**Given:** A multiple-choice graduate-level question in biology, physics, or chemistry. Closed-book: the question and prompt only. Open-book: the paper also reports a search-tool condition.
**Success:** Multiple-choice accuracy against the expert-written key.
**Size / pin:** Diamond is 198 questions (both expert validators agree, most non-experts fail). The recommended main set is 448. The extended set is 546. Pin Diamond 198 unless main/extended is named.
**Level:** L0 / R5. One multiple-choice item; PhD-level science that skilled non-experts miss even with the web.
**Sketch (not a real item):** A quantum or biochemistry multiple-choice item whose wrong options are plausible expert distractors.
**Do not mix:** Not the 448 main set. Not the 32-item validation slices some of the 16 audit papers used.

### Humanity’s Last Exam

**Diagram / vendor label:** HLE; vendor tables often show HLE — Text, No Tools.
**Source:** https://agi.safe.ai/ (fetched 2026-08-16); question mix and judge from https://arxiv.org/html/2501.14249 (same date).

**Given:** A closed-ended expert question, text-only or with an image (about 14% need the figure). 24% multiple-choice (five or more options); the rest exact-match short answers. No search tools in the authors’ protocol; questions are written to resist a simple web lookup.
**Success:** Accuracy. An o3-mini judge checks the model’s final answer against the key, allowing equivalent forms. Calibration error is reported alongside accuracy, not instead of it.
**Size / pin:** 2,500 public questions across over a hundred subjects, plus a private holdout. Finalized 2025-04-03. The text-only slice is the questions that do not need an image (about 86%). Full set is L2 / R5; text-only, no-tools is L0 / R5.
**Level:** L2 / R5 for the full multimodal set (some items need a figure). The text-only / no-tools slice is L0 / R5: one answer, frontier specialist depth.
**Sketch (not a real item):** A specialist figure from an obscure subfield; the short answer is a number or name that is not a web-search snippet.
**Do not mix:** The text-only / no-tools slice is not a second task set. A with-tools leaderboard is a different protocol. Not HLE-preview or HLE-Rolling.

### AA-LCR

**Diagram / vendor label:** AA-LCR (Artificial Analysis Long Context Reasoning).
**Source:** https://artificialanalysis.ai/articles/announcing-aa-lcr (fetched 2026-08-16).

**Given:** A human-written question plus a document set averaging about 100,000 tokens (`cl100k_base`). Seven text-only source types (company reports, industry reports, government consultations, academia, legal, marketing, surveys). The documents are passed in as context; the model must not fetch extra material. Answers need facts from more than one document and a step that is not stated outright.
**Success:** Accuracy against a verified key. Every question was answered correctly by at least one human tester.
**Size / pin:** 100 questions, 30 document sets, 234 documents. Pin AA-LCR, not a needle-in-a-haystack probe.
**Level:** L2 / R4. Long static documents; cross-source fiscal or policy synthesis, no live retrieval.
**Sketch (not a real item):** Reconcile a fiscal segment that is split across two years of company reports and an industry appendix.
**Do not mix:** Not needle-in-a-haystack. External web retrieval changes the task.

### BEAM

**Diagram / vendor label:** BEAM; diagrams often show BEAM-128K (twenty of the 100 dialogues).
**Source:** https://github.com/mohammadtavakoli78/BEAM (README fetched 2026-08-16).

**Given:** A long, coherent dialogue (general, coding, or math) and probing questions that test ten memory abilities (among them abstention, contradiction, event order, knowledge update, and preference following). Length buckets: 128K, 500K, 1M, and 10M tokens.
**Success:** A language-model judge scores each answer to a probing question against the reference. LIGHT (episodic memory, working memory, and a scratchpad) is an optional method on this set, not the metric.
**Size / pin:** 100 dialogues and 2,000 validated questions. 128K is 20 dialogues; 500K and 1M are 35 each; 10M is 10 (also published as BEAM-10M). Pin the named length bucket.
**Level:** L2 / R4. Long static history; the 128K bucket is still this suite, not a second task set.
**Sketch (not a real item):** After several corrections in a long travel chat, report the latest still-valid preference.
**Do not mix:** BEAM-128K is 20 of 100 dialogues, not the whole benchmark. Not LongMemEval.

### GAIA

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2311.12983 (fetched 2026-08-16). The Meta landing page https://ai.meta.com/research/publications/gaia-a-benchmark-for-general-ai-assistants/ was fetched the same day and restates the 466-question abstract; levels and scoring are from the paper.

**Given:** A real-world assistant question, sometimes with a file (image, spreadsheet). The assistant may search the web, read files, and use tools. The expected output is a short factoid: a number, a few words, or a comma-separated list.
**Success:** Quasi-exact match to the single ground-truth answer after type-specific normalization. The reasoning trace is not scored.
**Size / pin:** 466 questions in three levels (Level 1: at most one tool and about five steps; Level 2: about 5–10 steps and mixed tools; Level 3: arbitrarily long tool use). Questions are public; answers to 300 are withheld for the Hugging Face leaderboard. Pin original GAIA, not GAIA2.
**Level:** L3 / R4. Narrow tools and search to produce one verifiable fact, not a live multi-app world.
**Sketch (not a real item):** From an attached table and two linked pages, report the integer the prompt names, with no units.
**Do not mix:** Not GAIA2 (800 event-driven scenarios).

### Berkeley Function-Calling Leaderboard V4

**Diagram / vendor label:** BFCL V4.
**Source:** https://gorilla.cs.berkeley.edu/leaderboard.html (fetched 2026-08-16); score composition from https://gorilla.cs.berkeley.edu/blogs/15_bfcl_v4_web_search.html (same date). Multi-turn state checks from the V3 blog, https://gorilla.cs.berkeley.edu/blogs/13_bfcl_v3_multi_turn.html.

**Given:** A user request plus tool definitions. Single-turn items ask for one or more calls (simple, multiple, parallel). Multi-turn items run against a backend (files, bookings). V4 adds agentic web-search and memory items.
**Success:** Overall is `(Agentic × 40%) + (Multi-Turn × 30%) + (Live × 10%) + (Non-Live × 10%) + (Hallucination × 10%)`. Single-turn live/non-live score an abstract syntax tree (AST: the structure of the call, not a string match). Multi-turn checks backend state after execution. Hallucination is relevance (call when needed) and irrelevance (do not call when none apply). Format-sensitivity cases are reported but do not enter Overall. Draft said AST / executable / relevance / state; the V4 page weights agentic, multi-turn, live, non-live, and hallucination. Executable function checks remain a single-turn companion from earlier versions, not a named Overall weight.
**Size / pin:** Pin V4 (leaderboard last updated 2026-04-12; reproduce with `bfcl-eval==2025.12.17` or commit `f7cf735`). Scoring categories total 5,088 items; format sensitivity is a separate 5,218 non-scoring cases.
**Level:** L3 / R2. Named tools and local call shape, not a full customer-service policy world.
**Sketch (not a real item):** Emit `get_forecast(city=…, units=…)` matching the schema; do not invent extra arguments.
**Do not mix:** Pin V4, not V1–V3. AST is call structure, not string match.

### ToolSandbox

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2408.04682v2 (fetched 2026-08-16). The Apple landing page https://machinelearning.apple.com/research/toolsandbox-stateful-conversational-llm-benchmark was fetched the same day; it does not state the 1,032-case count.

**Given:** A simulated user who replies during the conversation, 34 stateful tools across 11 domains (contacts, messaging, reminders, device settings, maps, weather, and related), and a mutable world state. Tools can depend on that state (for example, sending a text needs cellular on).
**Success:** Human-authored **milestones** (required events in a directed graph: tool calls and database snapshots) versus **minefields** (events that must not occur, such as hallucinating a missing timestamp). A matched minefield zeros the trajectory score. Similarity is 0–1 over the best legal mapping of turns to milestones.
**Size / pin:** 1,032 test scenarios. Pin this roster.
**Level:** L4 / R3. User simulator, device state, and implicit tool dependencies, not a single stateless call.
**Sketch (not a real item):** Send a text while cellular is off; enable it first. If the current time tool is withheld, refuse rather than invent a timestamp.
**Do not mix:** Milestones are required events; minefields are forbidden ones. Not BFCL’s single-turn AST check.

### τ-bench

**Diagram / vendor label:** same as official name; tables sometimes show only τ-airline or τ-retail.
**Source:** https://arxiv.org/html/2406.12045 (fetched 2026-08-16).

**Given:** A language-model-simulated customer, domain APIs, a hidden database, and a policy document. Two domains: τ-retail (orders, returns, exchanges) and τ-airline (book, change, cancel, refund). The agent must gather missing facts from the user and follow policy before writing to the database.
**Success:** Binary reward: the final database must match the unique annotated goal state, and user-facing replies must contain required facts. Repeated success is **pass^k**: the chance that k independent trials all succeed. Default comparison is pass^1.
**Size / pin:** 115 retail tasks (15 APIs) and 50 airline tasks (13 APIs). Pin original τ-bench airline/retail.
**Level:** L4 / R3. User, policy, and persistent database, not a one-shot function call.
**Sketch (not a real item):** A user asks to change a basic-economy flight; refuse per policy, then cancel and rebook so the reservation table matches the allowed outcome.
**Do not mix:** Not τ-Knowledge / τ-Banking.

### WebArena

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2307.13854v4 (fetched 2026-08-16).

**Given:** A high-level natural-language intent on self-hosted, fully functional sites: shopping, a forum, GitLab, and a store content-management system, plus map, calculator, scratchpad, and Wikipedia. The environment resets to a deterministic initial state.
**Success:** Programmatic validators check **functional state** (database rows, page content, or a required short answer), not a screenshot judge and not a gold click trace. Several valid paths can pass.
**Size / pin:** 812 tasks from 241 templates. Pin this 812-task set.
**Level:** L5 / R3. Live self-hosted websites with multi-step recovery, not a static HTML dump.
**Sketch (not a real item):** On the self-hosted shop, cancel the last order for a named item and leave a matching note in the content-management system.
**Do not mix:** Functional state, not a screenshot judge. Not VisualWebArena.

### VisualWebArena

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2401.13649v2 (fetched 2026-08-16).

**Given:** A visually grounded web intent on self-hosted Classifieds, Shopping, or Reddit. Every task needs page images (color, layout, product photos); 25.2% also attach input images. Shopping and Reddit reuse WebArena sites; Classifieds is new.
**Success:** Execution-based rewards on the final page or a short answer (exact match, must-include, or a visual question-answering check on the resulting image). Success is whether the site state matches the goal, not a gold click path.
**Size / pin:** 910 tasks from 314 templates. Pin VisualWebArena, not WebArena’s 812 text-web tasks.
**Level:** L5 / R3. Self-hosted visual web with multi-step recovery, not a single click on a screenshot.
**Sketch (not a real item):** Buy the green polo that matches an attached photo, not the similarly named blue one.
**Do not mix:** Visual web, not WebArena’s text-web set.

### AppWorld

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2407.18901 (fetched 2026-08-16).

**Given:** A day-to-day request over 9 simulated apps (email, payments, shopping, files, and related) exposed as 457 APIs, populated with about 100 fictitious users. The agent writes iterative code that calls APIs. Tasks span 1.8 apps and 9.5 APIs on average.
**Success:** Hidden state-based unit tests (about 8 per task) inspect the database diff: required changes must be present, and unexpected collateral writes fail. Task Goal Completion is the share of tasks that pass every test; Scenario Goal Completion requires every variant of a scenario to pass. The conversation is not the grade.
**Size / pin:** 750 tasks (250 scenarios × 3): Train 105, Dev 60, Test-N 168, Test-C 417. Test-C (unseen Amazon or Gmail APIs) is the authors’ main target. Pin the named split.
**Level:** L5 / R4. Many cross-app APIs and interactive code, not a visible chat score.
**Sketch (not a real item):** From notes and roommate messages, place a grocery order; tests check the order table, not the chat.
**Do not mix:** Hidden database tests, not the visible conversation.

### MCP-Universe

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2508.14704 (fetched 2026-08-16).

**Given:** A realistic request against live Model Context Protocol (MCP) servers: 11 servers, 133 tools, 6 domains (location navigation, repository management, financial analysis, 3D design, browser automation, web searching). Servers talk to real backends (maps, GitHub, finance, Blender, browser, search).
**Success:** Execution-based evaluators, not a language-model judge. Format checks, static checks (time-invariant), and dynamic checks that pull live ground truth. Headline is success rate; average evaluator score is reported alongside it.
**Size / pin:** 231 tasks. Pin MCP-Universe, not MCP Atlas.
**Level:** L5 / R3. Many live MCP servers and multi-step recovery, not a single known API.
**Sketch (not a real item):** Using maps and search servers, return a route with a stop that meets three live constraints the prompt names.
**Do not mix:** Not MCP Atlas (1,000 tasks over 36 servers).

### BrowseComp

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2504.12516v1 (fetched 2026-08-16). The OpenAI landing page https://openai.com/index/browsecomp/ was blocked by Cloudflare.

**Given:** A fact-seeking question whose answer is a single short string. The agent must browse the open web persistently; the fact is entangled across sources and is not a first-page lookup.
**Success:** A language-model grader (the Humanity’s Last Exam equivalence prompt) checks whether the predicted short answer matches the reference. The browse trace is not scored.
**Size / pin:** 1,266 questions (OpenAI simple-evals). Pin BrowseComp, not DeepSearchQA.
**Level:** L5 / R4. Open-web search plus cross-source synthesis to one obscure fact.
**Sketch (not a real item):** Find the one person who uniquely satisfies three obscure public-record constraints; return the short name.
**Do not mix:** One short answer, not DeepSearchQA’s exhaustive set precision/recall/F1.

### OSWorld 2.0

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2606.29537 (fetched 2026-08-16).

**Given:** A long end-to-end desktop workflow on a real computer with local apps and self-hosted web services (email, banking, chat, professional portals). The workspace starts with realistic files and accounts. Some tasks inject new email or chat while the agent works.
**Success:** Fine-grained partial reward against task-specific checkpoints on the final environment state (about 27 per task), plus a strict binary completion bit. Most credit is from files and application state; model judges cover at most half of any task (11.53% of total score).
**Size / pin:** 108 workflows. Median human operation time about 1.6 hours (about 48× OSWorld v1’s two-minute median). Pin OSWorld 2.0, not v1.
**Level:** L6 / R4. Hour-scale workflows that can change mid-run, not v1’s shorter desktop tasks.
**Sketch (not a real item):** File an expense claim from receipts, mail, and a bank portal; a new email mid-run changes the amount; submit the corrected packet.
**Do not mix:** Not OSWorld v1 (369 shorter desktop tasks).

