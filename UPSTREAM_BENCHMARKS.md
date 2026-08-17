# Upstream benchmarks

This file is the **task set** map: glossary, L/R, and an index of 47 official suites. It is not a leaderboard and not a grade of the 16 papers.

Card bodies live under [`benchmarks/`](benchmarks/). How those papers used a slice (SWE 60, MATH 617, AIME 2024 in-sample) lives in [`BENCHMARKS.md`](BENCHMARKS.md).

A vendor table often mixes three objects. The **task set** is the items, environment, and official metric. SWE-bench Verified is 500 human-checked issues scored by repository tests. The **harness** is the wrapper around a frozen model: tools, retries, context policy, time budget. A Codex or OpenHands score on SWE-bench is model plus harness, not a model-only number. The **scoring protocol** is how answers are checked. Replacing OSWorld’s filesystem grader with a judge that reads the model’s write-up changes the benchmark.

## Glossary

| Term | Meaning |
|---|---|
| Task set | Items, environment, and official metric the authors released. SWE-bench Verified: 500 issues, repository tests. |
| Harness | Tools, retries, context policy, time budget around a frozen model. |
| Scoring protocol | Hidden tests, final database state, point-in-box, rubric, or a model judge. |
| Public split | The subset released for inspection. MCP Atlas: 1,000 tasks, 500 public. |
| pass^k | Chance that k independent runs all succeed. τ-bench uses this instead of one lucky chat. |
| pass@1 | One sample succeeds. SciCode, LiveCodeBench, and BigCodeBench report this. Not pass^k. |
| Claim coverage | MCP Atlas credit on required atomic claims; pass if coverage is at least 0.75. |
| Skill lift | SkillsBench: same task with vs without a curated skill bundle. |
| fail-to-pass | New tests that fail on the original code and must pass after the patch. SWE-bench Pro resolve rate requires this plus no regressions. |
| AST | Call structure, not a string match. The Berkeley Function-Calling Leaderboard V4 (BFCL V4) scores single-turn live/non-live this way. |
| Milestones | Required events in a directed acyclic graph (tool calls and database snapshots). ToolSandbox maps turns onto these. |
| Minefields | Events that must not occur. ToolSandbox zeros the trajectory if one matches. |
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

## Where the cards live

Official cards (Given, Success, pin, sketch) are in these files. This page keeps names and L/R only.

| File | Title | Cards |
|---|---|---|
| [`benchmarks/general-agents.md`](benchmarks/general-agents.md) | General agents | 8 |
| [`benchmarks/coding.md`](benchmarks/coding.md) | Coding | 4 |
| [`benchmarks/multimodal-safety-reasoning.md`](benchmarks/multimodal-safety-reasoning.md) | Multimodal, safety, and reasoning | 12 |
| [`benchmarks/tools-web-computer.md`](benchmarks/tools-web-computer.md) | Tools, web, and computer | 10 |
| [`benchmarks/coding-research-context-frontier.md`](benchmarks/coding-research-context-frontier.md) | Coding, research, long context, and frontier | 13 |

## The 47 names

#### General agents

| Official name | L/R |
|---|---|
| [MCP Atlas](benchmarks/general-agents.md#mcp-atlas) | L5 / R3 |
| [DeepSearchQA](benchmarks/general-agents.md#deepsearchqa) | L5 / R4 |
| [τ-Knowledge / τ-Banking](benchmarks/general-agents.md#τ-knowledge--τ-banking) | L5 / R4 |
| [WildClawBench](benchmarks/general-agents.md#wildclawbench) | L6 / R4 |
| [GDPval](benchmarks/general-agents.md#gdpval) | L7 / R4 |
| [GAIA2](benchmarks/general-agents.md#gaia2) | L6 / R4 |
| [SkillsBench](benchmarks/general-agents.md#skillsbench) | L5 / R3 |
| [OSWorld v1](benchmarks/general-agents.md#osworld-v1) | L5 / R3 |

#### Coding

| Official name | L/R |
|---|---|
| [SWE-bench Pro](benchmarks/coding.md#swe-bench-pro) | L5 / R4 |
| [SWE-bench Verified](benchmarks/coding.md#swe-bench-verified) | L5 / R3 |
| [Terminal-Bench 2.1](benchmarks/coding.md#terminal-bench-21) | L5 / R4 |
| [SciCode](benchmarks/coding.md#scicode) | L1 / R5 |

#### Multimodal, safety, and reasoning

| Official name | L/R |
|---|---|
| [CharXiv](benchmarks/multimodal-safety-reasoning.md#charxiv) | L2 / R4 |
| [ScreenSpot-Pro](benchmarks/multimodal-safety-reasoning.md#screenspot-pro) | L1 / R2 |
| [OmniDocBench v1.5](benchmarks/multimodal-safety-reasoning.md#omnidocbench-v15) | L2 / R2 |
| [MMMU-Pro](benchmarks/multimodal-safety-reasoning.md#mmmu-pro) | L2 / R4 |
| [CIMemories](benchmarks/multimodal-safety-reasoning.md#cimemories) | L2 / R4 |
| [AgentDojo](benchmarks/multimodal-safety-reasoning.md#agentdojo) | L6 / R3 |
| [IFBench](benchmarks/multimodal-safety-reasoning.md#ifbench) | L1 / R2 |
| [AIME 2026](benchmarks/multimodal-safety-reasoning.md#aime-2026) | L0 / R4 |
| [GPQA Diamond](benchmarks/multimodal-safety-reasoning.md#gpqa-diamond) | L0 / R5 |
| [Humanity’s Last Exam](benchmarks/multimodal-safety-reasoning.md#humanitys-last-exam) | L2 / R5 |
| [AA-LCR](benchmarks/multimodal-safety-reasoning.md#aa-lcr) | L2 / R4 |
| [BEAM](benchmarks/multimodal-safety-reasoning.md#beam) | L2 / R4 |

#### Tools, web, and computer

| Official name | L/R |
|---|---|
| [GAIA](benchmarks/tools-web-computer.md#gaia) | L3 / R4 |
| [Berkeley Function-Calling Leaderboard V4](benchmarks/tools-web-computer.md#berkeley-function-calling-leaderboard-v4) | L3 / R2 |
| [ToolSandbox](benchmarks/tools-web-computer.md#toolsandbox) | L4 / R3 |
| [τ-bench](benchmarks/tools-web-computer.md#τ-bench) | L4 / R3 |
| [WebArena](benchmarks/tools-web-computer.md#webarena) | L5 / R3 |
| [VisualWebArena](benchmarks/tools-web-computer.md#visualwebarena) | L5 / R3 |
| [AppWorld](benchmarks/tools-web-computer.md#appworld) | L5 / R4 |
| [MCP-Universe](benchmarks/tools-web-computer.md#mcp-universe) | L5 / R3 |
| [BrowseComp](benchmarks/tools-web-computer.md#browsecomp) | L5 / R4 |
| [OSWorld 2.0](benchmarks/tools-web-computer.md#osworld-20) | L6 / R4 |

#### Coding, research, long context, and frontier

| Official name | L/R |
|---|---|
| [LiveCodeBench](benchmarks/coding-research-context-frontier.md#livecodebench) | L1 / R3 |
| [BigCodeBench](benchmarks/coding-research-context-frontier.md#bigcodebench) | L1 / R3 |
| [SWE-bench Multilingual](benchmarks/coding-research-context-frontier.md#swe-bench-multilingual) | L5 / R3 |
| [PaperBench](benchmarks/coding-research-context-frontier.md#paperbench) | L7 / R5 |
| [ResearchClawBench](benchmarks/coding-research-context-frontier.md#researchclawbench) | L7 / R5 |
| [MathVista](benchmarks/coding-research-context-frontier.md#mathvista) | L2 / R3 |
| [Video-MMMU](benchmarks/coding-research-context-frontier.md#video-mmmu) | L2 / R4 |
| [LongBench v2](benchmarks/coding-research-context-frontier.md#longbench-v2) | L2 / R4 |
| [RULER](benchmarks/coding-research-context-frontier.md#ruler) | L2 / R2 |
| [LongMemEval-V2](benchmarks/coding-research-context-frontier.md#longmemeval-v2) | L3 / R4 |
| [AgentHarm](benchmarks/coding-research-context-frontier.md#agentharm) | L6 / R3 |
| [FrontierMath](benchmarks/coding-research-context-frontier.md#frontiermath) | L0 / R5 |
| [ARC-AGI-2](benchmarks/coding-research-context-frontier.md#arc-agi-2) | L1 / R5 |

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

## Capability tracks

Compare along a track, not as one leaderboard.

**Tools and state.** BFCL V4 (call shape) → ToolSandbox (dependencies, clarification, device state) → τ-bench (users, policy, pass^k) → MCP Atlas / AppWorld (many tools, cross-app) → GAIA2 (events and time).

**GUI and computer use.** ScreenSpot-Pro (where to click) → VisualWebArena (browser sequence) → OSWorld v1 (desktop completion) → OSWorld 2.0 / WildClawBench (long, changing workflows).

**Coding and research.** LiveCodeBench / BigCodeBench → SciCode → SWE-bench Verified → Terminal-Bench 2.1 → PaperBench → ResearchClawBench.

**Long context and memory.** RULER (controlled needles) → LongBench v2 / AA-LCR (realistic long input) → BEAM (conversation state) → LongMemEval-V2 (memory over accumulated agent history).

**Web research.** GAIA (short verifiable answer) → BrowseComp (one obscure fact) → DeepSearchQA (exhaustive set) → GDPval / ResearchClawBench (professional or scientific artifact).

**Safety.** CIMemories (wrong disclosure from trusted memory) → AgentDojo (injections in untrusted tool data) → Prompt Siren on AgentDojo (stronger attacks; not a separate task set) → AgentHarm (harmful user goals and whether the agent can carry them out).

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

