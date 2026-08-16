# GPTSwarm

**Venue:** ICML 2024 Oral  
**arXiv:** 2402.16823  
**Preprint:** https://arxiv.org/abs/2402.16823  
**Code:** https://github.com/metauto-ai/GPTSwarm

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| MiniCrosswords, same 20 puzzles | 3 | **D** | C | C | 0 | Same 20 puzzles for search and score. Edges among ToT / Reflexion / CoT. |
| HumanEval stream | 3 | **D** | C | C | 0 | Prompts updated from the benchmark being reported. 0.76 → 0.88. |
| MMLU collaborative, five training seeds | 2 | **C** | C | C | 0 | Five training seeds, +2.1±1.1. Scores sit on overlapping val/dev slices, not a frozen leftover test. Only GPTSwarm experiment with repeated *search*. |
| GAIA | — | n/a | n/a | n/a | 0 | Hand-built swarm. Not graph search. |

## What they claim

Agents as graphs; automatic discovery of high-performance algorithms. MiniCrosswords 0.465 → 0.575; HumanEval 0.76 → 0.88; MMLU +2.1±1.1 over five seeds; GAIA Table 1 vs AutoGPT / GPT-4 with plugins.

## Eval

**MiniCrosswords D.** Paper §3.2: “A subset of 20 problems is used to optimize and evaluate our methods.” Level 3. Score 0.575±0.0275 after ten iterations, mean over three runs; density-matched random edges 0.510. Structure is not only “more edges.” The number is still in-sample on 20 items.

**HumanEval D.** Node prompts updated from positive examples in the benchmark stream; after each iteration the whole benchmark is re-scored. Online setting: continuously optimizing without restart. 0.76 → 0.88±0.007, three runs. Same population for harvest and report. Level 3.

**MMLU collaborative C.** Seven role agents. +2.1% ± 1.1% averaged over five *training* seeds. Optimization: REINFORCE, 200 iterations, four graph samples per iteration on MMLU **dev**. Reported scores: initial 10% of MMLU **val** (`limit_questions = 153` in `run_mmlu.py`). Official MMLU test is unused. Dev and val are both small non-test slices used as the story. That is why this is C, not B−, despite the five seeds. It is also why GPTSwarm’s *best* Eval is C, while the *headline* MiniCrosswords is D. Do not average them.

**GAIA: not a search grade.** Table 1 is a hand-built swarm (seven TOT agents, tools, self-consistency). `run_gaia.py` never calls the edge/node optimizer. Duration scales with agent count. Do not cite as “the graph optimizer discovered GAIA performance.”

## Search method C (paper-level)

REINFORCE on edge probabilities (`swarm.connection_dist`, Adam) is a real representation. Controls are mostly “no graph / fewer edges / single agent / random θ=0.5,” plus a DyLAN/debate appendix on the adversarial MMLU setup. Not other graph searchers on a held-out puzzle split.

## Evolved object C

MiniCrosswords: learned edges among Tree-of-Thoughts, Reflexion, and chain-of-thought (code also wires `CrosswordsBruteForceOpt`). HumanEval: ReAct-style generate-then-repair with harvested demonstrations. MMLU: role IO agents plus majority vote. Known parts, graph-tuned.

## RSI 0

Frozen outer optimizer (REINFORCE / node prompt updater). Edges and prompts change. The searcher does not.

## Control flow (from published code)

**Parent pick.** Sample a DAG from edge Bernoulli parameters `θ`, skip any edge that would cycle.

**Propose.** Edge mode: `connection_dist.realize` draws a composite graph. Node mode (`run_humaneval.py`): every four examples, `node_optimization.optimize` rewrites prompts from stored (input, output, pass/fail) pairs.

**Score.** MiniCrosswords: `CrosswordsEvaluator` on the same `mini0505_0_100_5.json` used for training (`run_crosswords.py` / `crosswords/train.py` / `crosswords/evaluate.py`). HumanEval: `PyExecutor` on the problem’s public tests, running accuracy over the stream. MMLU: train=`dev`, val=`val`, GPT-4-Turbo, majority vote.

**Promote.** Adam on `θ` with a REINFORCE loss against a moving-average baseline (`swarm/optimizer/edge_optimizer/optimization.py`). HumanEval keeps the updated node prompts in place and continues down the same list.

**Models.** MiniCrosswords search: GPT-3.5-Turbo (paper); one already-optimized distribution transferred to GPT-4-Turbo. MMLU: GPT-4-Turbo. HumanEval default in code: `gpt-4-1106-preview`. GAIA: `gpt-4-1106-preview`, no search.

Code vs paper: the crossword JSON filename suggests a larger dump; the paper’s scored protocol is the 20-puzzle subset. GAIA code path has no `optimize` call.

## Cite as / do not cite as

**Cite as.** Graph abstraction. For evidence, only the MMLU seed result is usable, and it is small.

**Do not cite as.** MiniCrosswords 0.575 or HumanEval 0.88 as held-out discovery. GAIA as a search result.
