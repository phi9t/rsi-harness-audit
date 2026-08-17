# Tools, web, and computer

Official task sets for this family. Glossary, L/R definitions, and the 47-name index: [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). How these 16 papers used a slice: [`BENCHMARKS.md`](../BENCHMARKS.md).

## What this family measures

This family is tools, websites, and a computer: function calling, a user simulator, self-hosted web, many apps, live MCP servers, open-web browsing, and long desktop workflows. The shared Given is an environment that keeps state. The shared Success is usually that state (final database, site, files), not a chat score.

The Berkeley Function-Calling Leaderboard V4 (BFCL V4) scores single-turn live/non-live by **AST**: call structure, not a string match. ToolSandbox maps turns onto required **milestones** and zeros a trajectory on a **minefield**. τ-bench is the original airline/retail pair with pass^k; it is not τ-Knowledge / τ-Banking in [`general-agents.md`](general-agents.md).

GAIA is 466 short verifiable answers (L3). GAIA2 is 800 event-driven scenarios in the general-agents file (L6). A vendor cell labeled GAIA is not GAIA2. OSWorld 2.0 is 108 hour-scale workflows that can change mid-run; OSWorld v1 (369 Ubuntu tasks) is in [`general-agents.md`](general-agents.md). MCP-Universe is not MCP Atlas (also general-agents): different servers, different metric.

AppWorld checks backend database state after API calls. BrowseComp asks for one obscure fact from the open web; DeepSearchQA (general-agents) asks for an exhaustive set scored by F1.

## Cards

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
**Success:** Overall is `(Agentic × 40%) + (Multi-Turn × 30%) + (Live × 10%) + (Non-Live × 10%) + (Hallucination × 10%)`. Single-turn live/non-live score an abstract syntax tree (AST: the structure of the call, not a string match). Multi-turn checks backend state after execution. The hallucination band is irrelevance only (1,122 cases: do not call when none apply). Live relevance (18: call when needed) is reported but non-scoring. Format-sensitivity cases are also reported but do not enter Overall. Draft said AST / executable / relevance / state; the V4 page weights agentic, multi-turn, live, non-live, and hallucination. Executable function checks remain a single-turn companion from earlier versions, not a named Overall weight.
**Size / pin:** Pin V4 (leaderboard last updated 2026-04-12; reproduce with `bfcl-eval==2025.12.17` or commit `f7cf735`). Scoring categories total 5,088 items. Non-scoring is 5,218: 5,200 format-sensitivity cases plus 18 live-relevance items.
**Level:** L3 / R2. Named tools and local call shape, not a full customer-service policy world.
**Sketch (not a real item):** Emit `get_forecast(city=…, units=…)` matching the schema; do not invent extra arguments.
**Do not mix:** Pin V4, not V1–V3. AST is call structure, not string match.

### ToolSandbox

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2408.04682v2 (fetched 2026-08-16). The Apple landing page https://machinelearning.apple.com/research/toolsandbox-stateful-conversational-llm-benchmark was fetched the same day; it does not state the 1,032-case count.

**Given:** A simulated user who replies during the conversation, 34 stateful tools across 11 domains (contacts, messaging, reminders, device settings, maps, weather, and related), and a mutable world state. Tools can depend on that state (for example, sending a text needs cellular on).
**Success:** Human-authored **milestones** (required events in a directed acyclic graph: tool calls and database snapshots that may be reordered only when the graph allows it) versus **minefields** (events that must not occur, such as hallucinating a missing timestamp). A matched minefield zeros the trajectory score. Similarity is 0–1 over the best legal mapping of turns to milestones.
**Size / pin:** 1,032 test scenarios. Pin this roster.
**Level:** L4 / R3. User simulator, device state, and implicit tool dependencies, not a single stateless call.
**Sketch (not a real item):** Set a reminder at a named park while location services are off; enable them, then geocode. If the geocoding tool is withheld, refuse rather than invent coordinates.
**Do not mix:** Milestones are required events; minefields are forbidden ones. Not BFCL’s single-turn AST check.

### τ-bench

**Diagram / vendor label:** same as official name; tables sometimes show only τ-airline or τ-retail.
**Source:** https://arxiv.org/html/2406.12045 (fetched 2026-08-16).

**Given:** A language-model-simulated customer, domain APIs, a hidden database, and a policy document. Two domains: τ-retail (orders, returns, exchanges) and τ-airline (book, change, cancel, refund). The agent must gather missing facts from the user and follow policy before writing to the database.
**Success:** Binary reward: the final database must match the unique annotated goal state, and user-facing replies must contain required facts. Repeated success is **pass^k**: the chance that k independent trials all succeed. Default comparison is pass^1.
**Size / pin:** 115 retail tasks (15 APIs) and 50 airline tasks (13 APIs). Pin original τ-bench airline/retail.
**Level:** L4 / R3. User, policy, and persistent database, not a one-shot function call.
**Sketch (not a real item):** A user wants two extra checked bags on an existing reservation; charge only the extras allowed by membership and cabin class.
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
**Sketch (not a real item):** On classifieds, comment on the listing whose photo shows a red bicycle, not the nearby text-only ad with the same title.
**Do not mix:** Visual web, not WebArena’s text-web set.

### AppWorld

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2407.18901 (fetched 2026-08-16).

**Given:** A day-to-day request over 9 simulated apps (email, payments, shopping, files, and related) exposed as 457 APIs, populated with about 100 fictitious users. The agent writes iterative code that calls APIs. Tasks span 1.8 apps and 9.5 APIs on average.
**Success:** Hidden state-based unit tests (about 6 on Test-N, 8 on Test-C) inspect the database diff: required changes must be present, and unexpected collateral writes fail. Task Goal Completion is the share of tasks that pass every test; Scenario Goal Completion requires every variant of a scenario to pass. The conversation is not the grade.
**Size / pin:** 750 tasks (250 scenarios × 3): Train 105, Dev 60, Test-N 168, Test-C 417. Test-C (unseen Amazon or Gmail APIs) is the authors’ main target. Pin the named split.
**Level:** L5 / R4. Many cross-app APIs and interactive code, not a visible chat score.
**Sketch (not a real item):** Pay a roommate Venmo request after confirming the amount in email; tests check the ledger, not the chat.
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
**Sketch (not a real item):** Register for a conference from a PDF call, an email thread, and a self-hosted portal; a new message mid-run changes the paper title; submit the corrected packet.
**Do not mix:** Not OSWorld v1 (369 shorter desktop tasks).

## This cohort

**Ran.** AppWorld: ACE, offline (train, freeze, original test) and online (prequential on shuffled test). GAIA: GPTSwarm Table 1 is a hand-built swarm; that run is not graph search.

**Skipped in this file.** Berkeley Function-Calling Leaderboard V4, ToolSandbox, τ-bench, WebArena, VisualWebArena, MCP-Universe, BrowseComp, OSWorld 2.0.

Slice rows and SOTA pointers: [`BENCHMARKS.md`](../BENCHMARKS.md).
