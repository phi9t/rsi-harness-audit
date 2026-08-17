# Coding, research, long context, and frontier

Official task sets for this family. Glossary, L/R definitions, and the 47-name index: [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). How these 16 papers used a slice: [`BENCHMARKS.md`](../BENCHMARKS.md).

## What this family measures

PLACEHOLDER_ESSAY

## Cards

### LiveCodeBench

**Diagram / vendor label:** same as official name.
**Source:** https://sky.cs.berkeley.edu/project/livecodebench/ (fetched 2026-08-16). Named releases from https://github.com/LiveCodeBench/LiveCodeBench (README, same date).

**Given:** A contest programming problem from LeetCode, AtCoder, or Codeforces, tagged with its contest release date. Four scenarios: write a solution, repair a failing solution, predict a program's output, or predict test outputs.
**Success:** Hidden tests. Headline code-generation metric is pass@1 (one sample succeeds). The repo also reports pass@5. That is not pass^k (all k runs succeed).
**Size / pin:** Continuously refreshed. The Berkeley page still describes about 400 problems from May 2023 to February 2024. The official repo lists `release_v1` (400 problems, May 2023 to March 2024) through `release_v6` (1,055 problems, May 2023 to April 2025). Pin a named release or a start/end date window.
**Level:** L1 / R3. Deterministic tests; contest problems need multi-step planning, not a one-line snippet.
**Sketch (not a real item):** Given n intervals, return the smallest set of points that hits every interval. Hidden tests check empty, nested, and overlapping cases the prompt does not list.
**Do not mix:** A full-corpus score is not a post-cutoff window. pass@1 is not pass^k.

### BigCodeBench

**Diagram / vendor label:** BigCodeBench-Complete and BigCodeBench-Instruct are two settings of one set, not two suites.
**Source:** https://arxiv.org/html/2406.15877v2 (fetched 2026-08-16).

**Given:** A practical Python task that needs several library calls. Complete supplies a structured docstring. Instruct rewrites the same task as a shorter natural-language request.
**Success:** `unittest` cases, at least five per task. Headline is pass@1 with greedy decoding. That is not pass^k (all k runs succeed).
**Size / pin:** 1,140 tasks covering 723 function calls from 139 libraries across 7 domains. Draft said 723 APIs; the paper says function calls. Pin Complete vs Instruct.
**Level:** L1 / R3. Hidden tests; using several libraries in the right order is multi-step, not a single-function puzzle.
**Sketch (not a real item):** Load a CSV, filter rows with one library, plot a summary with another, and write the figure to a named path.
**Do not mix:** Complete scores are not Instruct scores. Not LiveCodeBench contest problems.

### SWE-bench Multilingual

**Diagram / vendor label:** same as official name.
**Source:** https://www.swebench.com/multilingual.html (fetched 2026-08-16).

**Given:** A real GitHub issue and the repository at the pre-fix commit, in one of nine languages: C, C++, Go, Java, JavaScript, TypeScript, PHP, Ruby, or Rust. The agent submits a patch.
**Success:** Same protocol as SWE-bench. Fail-to-pass tests from the pull request must pass after the patch, and already-passing tests must still pass.
**Size / pin:** 300 tasks from 42 repositories. Pin Multilingual, not Verified.
**Level:** L5 / R3. Full repositories with multi-step recovery, now across languages, not a Python-only slice.
**Sketch (not a real item):** A Go HTTP middleware drops a header on a redirect; fix it so the project's tests pass.
**Do not mix:** Not SWE-bench Verified's 500 Python instances. Not this cohort's SWE 60 (the Django/Sphinx slice used by DGM).

### PaperBench

**Diagram / vendor label:** same as official name; PaperBench Code-Dev grades only code-development leaves and skips execution.
**Source:** https://arxiv.org/html/2504.01848 (fetched 2026-08-16). The OpenAI landing page https://openai.com/index/paperbench/ was blocked by Cloudflare.

**Given:** An ICML 2024 Spotlight or Oral paper plus a clarification addendum. The agent must write a codebase from scratch, including a `reproduce.sh` that reruns the experiments. The original paper is given, not hidden.
**Success:** Hierarchical author-approved rubrics. An LLM judge scores each leaf 0 or 1 (code development, execution, or result match). Parent scores are weighted averages; the root is the Replication Score.
**Size / pin:** 20 papers, 8,316 leaf nodes. Draft said rubric components; the paper counts leaf nodes. Two extra NeurIPS 2024 workshop papers are a development set. Pin full PaperBench vs Code-Dev.
**Level:** L7 / R5. A research replication with many valid paths, graded by a deep rubric.
**Sketch (not a real item):** From a methods paper, reimplement the training loop and match the reported ablation table within the rubric's tolerance.
**Do not mix:** The agent sees the paper. That is not ResearchClawBench's withheld-target setup.

### ResearchClawBench

**Diagram / vendor label:** RCBench.
**Source:** https://arxiv.org/abs/2606.07591 (fetched 2026-08-16).

**Given:** A task description, related literature, and raw data in an executable environment. The target paper is withheld. The system must run analyses and write a research report.
**Success:** Expert rubrics over scientific artifacts. Full score is 100; 50 means the output matches the hidden target paper, and above 50 is treated as possible new discovery. A model judge scores the report against those rubrics.
**Size / pin:** 40 tasks across 10 domains (Astronomy through Physics). Pin ResearchClawBench, not PaperBench.
**Level:** L7 / R5. Open-ended scientific deliverable with a research-level rubric.
**Sketch (not a real item):** Given unlabeled sensor traces and background papers, recover the paper's key scaling plot and error model without seeing the target PDF.
**Do not mix:** The target paper is hidden. PaperBench hands the agent 20 ICML papers to replicate.

### MathVista

**Diagram / vendor label:** same as official name.
**Source:** https://mathvista.github.io/ (fetched 2026-08-16).

**Given:** A math question with a visual: chart, diagram, table, puzzle figure, or similar.
**Success:** Accuracy against the gold answer. Leaderboards split testmini (public answers) from test (private answers).
**Size / pin:** 6,141 examples from 28 existing datasets plus 3 new ones (IQTest, FunctionQA, PaperQA), 31 sources in total. testmini is 1,000; test is 5,141. Pin the named split.
**Level:** L2 / R3. Static figures; items need multi-step visual math, not a lookup.
**Sketch (not a real item):** From a bar chart of three series, compute which category has the largest year-over-year drop.
**Do not mix:** testmini is not the full 6,141. Not CharXiv's chart-only set.

### Video-MMMU

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2501.13826v1 (fetched 2026-08-16).

**Given:** A college-level educational video (mean about 506 seconds) plus one question from each of three stages: Perception, Comprehension, and Adaptation. Six disciplines.
**Success:** Micro-averaged accuracy. A knowledge-gain score, Δ_knowledge, is the lift on Adaptation questions after watching the video versus before.
**Size / pin:** 300 videos, 900 questions (three per video). Pin Video-MMMU, not MMMU-Pro.
**Level:** L2 / R4. Static video; Adaptation needs applying the lecture to a new problem, not a frame lookup.
**Sketch (not a real item):** Watch a lecture that derives a formula, then solve a new numeric instance that uses the same method with different inputs.
**Do not mix:** Video, not MMMU-Pro's static images.

### LongBench v2

**Diagram / vendor label:** same as official name.
**Source:** https://longbench2.github.io/ (fetched 2026-08-16).

**Given:** A long document or document set (8K to 2M words, most under 128k) and a four-option multiple-choice question. Six categories: single-document QA, multi-document QA, long in-context learning, long-dialogue history, code-repo understanding, and long structured data.
**Success:** Multiple-choice accuracy, reported with and without chain-of-thought.
**Size / pin:** 503 questions. Pin LongBench v2, not original LongBench.
**Level:** L2 / R4. Long static context; items need deep reading, not a needle-in-a-haystack probe.
**Sketch (not a real item):** After a 40k-word policy appendix, pick which of four clauses actually caps the fee the question asks about.
**Do not mix:** Multiple-choice on realistic long documents, not original LongBench's mixed generation tasks.

### RULER

**Diagram / vendor label:** same as official name.
**Source:** https://github.com/NVIDIA/RULER (fetched 2026-08-16).

**Given:** A synthetically generated long string at a chosen length (4K through 128K tokens in the README table). Thirteen task configs in four categories: retrieval (needle-in-a-haystack variants), multi-hop tracing (variable-name chains), aggregation (common or frequent words), and question answering (SQuAD or HotpotQA passages padded to length).
**Success:** Automatic metrics per task, then an average across the 13 configs at each length. Effective length is the longest length that stays above a Llama-2-7B-at-4K threshold (85.6%).
**Size / pin:** 13 synthetic tasks, 4 categories, at lengths in the README’s 4K through 128K table. Pin that paper RULERv1 (`rulerv1-ns` pipeline) unless RULERv2 is named.
**Level:** L2 / R2. Synthetic length tests; local recall and aggregation, not expert synthesis.
**Sketch (not a real item):** Buried in 32k tokens of filler, two keys each map to several values; return every value for the queried keys.
**Do not mix:** Configurable synthetic probes, not LongBench v2's realistic documents. Not RULERv2 (`rulerv2-ns`).

### LongMemEval-V2

**Diagram / vendor label:** LME-V2; Small (100 shared trajectories) vs Medium (about 500 per question).
**Source:** https://arxiv.org/html/2605.12493v1 (fetched 2026-08-16).

**Given:** A stream of past web-agent trajectories on customized Magento, admin, forum, or ServiceNow sites, then a later question about that environment. The memory system ingests history via Insert and returns compact evidence via Query; a fixed reader answers from that evidence. This is memory over history, not stuffing the whole log into one prompt.
**Success:** Answer accuracy after truncating the returned evidence to a token budget, plus query latency.
**Size / pin:** 451 questions. Small haystacks are about 25M tokens; Medium about 115M. Pin V2, not LongMemEval-V1's 500 chat questions.
**Level:** L3 / R4. Memory tools over a long history; questions need environment-specific synthesis, not a single long prompt.
**Sketch (not a real item):** After hundreds of prior admin sessions, say whether a listed filter still exists on the current catalog page, using only stored traces.
**Do not mix:** History memory, not LongBench v2's one-shot long document.

### AgentHarm

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/abs/2410.09024 (fetched 2026-08-16).

**Given:** An explicitly malicious user request to a tool-using agent (synthetic tools, 2 to 8 per behavior). Eleven harm categories. Each harmful behavior has a benign rewrite used as a capability baseline.
**Success:** Harm score from a human-written rubric of tool-call checks, with a judge only for narrow semantic subchecks. Refusal rate is reported separately. Scoring well means the jailbroken agent still completes the multi-step task, not merely that it talks.
**Size / pin:** 110 base behaviors become 440 with augmentations (detailed vs open-ended, each with or without a first-tool hint). Splits: 44 validation, 264 public test, 132 private (30% withheld). Pin AgentHarm, not AgentDojo.
**Level:** L6 / R3. Multi-step tool use under a direct misuse request, not a static chat refusal quiz.
**Sketch (not a real item):** A user asks the agent to chain several tools toward a clearly prohibited digital outcome. A safe agent refuses; the rubric would otherwise check that the tool sequence ran.
**Do not mix:** Direct user harm requests. AgentDojo scores injection into otherwise benign tasks.

### FrontierMath

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/abs/2411.04872 (fetched 2026-08-16).

**Given:** An unpublished research-level math problem with a unique, automatically checkable answer, usually a large integer or a SymPy object. The model submits code that writes the answer.
**Success:** A verification script checks the saved object: exact integer, symbolic identity, or a custom checker. Typical expert time is hours; the hardest items take days.
**Size / pin:** Hundreds of original problems. The paper does not publish a single public count of the full set. A few representative samples are released; the rest stay unpublished. Pin FrontierMath, not MATH or AIME.
**Level:** L0 / R5. One closed problem, research-level depth, a small world.
**Sketch (not a real item):** State a new counting problem in an algebraic setting whose answer is a large integer; the checker compares that integer, not the proof.
**Do not mix:** Unpublished research items, not contest AIME or MATH. L0 / R5 is deep reasoning in a small world, not a large-environment agent task.

### ARC-AGI-2

**Diagram / vendor label:** same as official name.
**Source:** https://github.com/arcprize/ARC-AGI-2 (fetched 2026-08-16; landing page only, no README on `main`). Split sizes from https://arcprize.org/arc-agi/2 (same date).

**Given:** A few colored-grid demonstrations of an unstated rule, then a new input grid. The solver must emit the output grid.
**Success:** Exact grid match on every cell; no partial credit. pass@2: a task counts if either of two attempts is perfect. That is not pass^k (both attempts must succeed).
**Size / pin:** 1,000 public train (uncalibrated). Three calibrated eval sets of 120 each: public, semi-private, and private. Pin ARC-AGI-2 public eval unless a hidden set is named.
**Level:** L1 / R5. Deterministic grid check at frontier abstraction difficulty.
**Sketch (not a real item):** Two example pairs recolor a shape only when it touches a marker; apply that rule to a new grid.
**Do not mix:** Not ARC-AGI-1. Not this cohort's ARC Easy ≤5×5 slice (ADAS: 20 val / 60 test).

## This cohort

PLACEHOLDER_TAIL
