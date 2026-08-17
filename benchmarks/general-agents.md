# General agents

Official task sets for this family. Glossary, L/R definitions, and the 47-name index: [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). How these 16 papers used a slice: [`BENCHMARKS.md`](../BENCHMARKS.md).

## What this family measures

PLACEHOLDER_ESSAY

## Cards

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

## This cohort

PLACEHOLDER_TAIL
