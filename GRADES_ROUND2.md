# Grade board (working, round of 17 August 2026)

Scoring rules live in [`RUBRICS.md`](RUBRICS.md). Official letters still live in [`GRADE_BOARD.md`](GRADE_BOARD.md) until this file is merged. Paper evidence lives in [`papers/`](papers/).

This is the working scored record for the report-driven regrade. Do not cite these rows as official until merge.

## Paper at a glance

Letters below are **pending** until each family is re-run. Names match the pre-round board.

| Paper | Best Eval | Headline Eval | Search method | Typical object | RSI |
|---|---|---|---|---|---|
| [PromptBreeder](papers/promptbreeder.md) | pending | pending | pending | pending | pending |
| [GPTSwarm](papers/gptswarm.md) | pending | pending | pending | pending | pending |
| [STOP](papers/stop.md) | pending | pending | pending | pending | pending |
| [DiscoPOP](papers/discopop.md) | pending | pending | pending | pending | pending |
| [ADAS](papers/adas.md) | pending | pending | pending | pending | pending |
| [AFlow](papers/aflow.md) | pending | pending | pending | pending | pending |
| [AgentSquare](papers/agentsquare.md) | pending | pending | pending | pending | pending |
| [Gödel Agent](papers/godel-agent.md) | pending | pending | pending | pending | pending |
| [Self-Developing](papers/self-developing.md) | pending | pending | pending | pending | pending |
| [MaAS](papers/maas.md) | pending | pending | pending | pending | pending |
| [GEPA](papers/gepa.md) | pending | pending | pending | pending | pending |
| [ACE](papers/ace.md) | pending | pending | pending | pending | pending |
| [MASS](papers/mass.md) | pending | pending | pending | pending | pending |
| [ShinkaEvolve](papers/shinkaevolve.md) | pending | pending | pending | pending | pending |
| [DGM](papers/dgm.md) | pending | pending | pending | pending | pending |
| [HGM](papers/hgm.md) | pending | pending | pending | pending | pending |

## Change log

| Experiment | Axis | Old | New | Recipe step |
|---|---|---|---|---|
| *(none yet)* | | | | |

## Held

| Experiment | Axis | Letter | Recipe step that kept it |
|---|---|---|---|
| *(none yet)* | | | |

## Experiment grades (pre-round copy)

Columns match [`GRADE_BOARD.md`](GRADE_BOARD.md). Letters in this section are the **old** values, to be replaced per paper. See = what the proposer was allowed to see.

#### Prompt and context

| Experiment | See | Eval | Search | Object | RSI | Binding reason (old) |
|---|---|---|---|---|---|---|
| PromptBreeder, arithmetic/GSM8K held-out half | 2 | **B−** | C | C | 1 | old, pending regrade |
| GEPA main, four tasks, Qwen / GPT-4.1 Mini | 2 | **B+** | B | C+ | 0 | old, pending regrade |
| GEPA KernelBench, 35 kernels | 3 | **D** | B | C | 0 | old, pending regrade |
| ACE offline AppWorld / finance | 1 | **B+** | B | C | 0 | old, pending regrade |
| ACE online, shuffled test stream | — | **C** | B | C | 0 | old, pending regrade |

#### Workflows

| Experiment | See | Eval | Search | Object | RSI | Binding reason (old) |
|---|---|---|---|---|---|---|
| GPTSwarm MiniCrosswords | 3 | **D** | C | C | 0 | old, pending regrade |
| GPTSwarm HumanEval stream | 3 | **D** | C | C | 0 | old, pending regrade |
| GPTSwarm MMLU collaborative | 2 | **C** | C | C | 0 | old, pending regrade |
| GPTSwarm GAIA | — | n/a | n/a | n/a | 0 | old, pending regrade |
| ADAS Meta Agent Search, main tables | 2 | **B−** | C | C | 0 | old, pending regrade |
| AFlow, 20/80 seed 42 | 2r | **B−** | C | C | 0 | old, pending regrade |
| AgentSquare, six environments | 3? | **D** | C | C− | 0 | old, pending regrade |
| MaAS supernet, 1:4 split | 2 | **B−** | B− | C | 0 | old, pending regrade |
| MASS staged prompt + topology | 2 | **B−** | B− | C | 0 | old, pending regrade |

#### Self-editing agents

| Experiment | See | Eval | Search | Object | RSI | Binding reason (old) |
|---|---|---|---|---|---|---|
| STOP, 10-bit LPN, 5 full runs | 1 | **B** | B− | C | 1 | old, pending regrade |
| STOP, transfer of one LPN-grown improver to five toys | 1 relative | **B−** | B− | C | 1 | old, pending regrade |
| Gödel Agent, val then test, 4o writes / 3.5 runs | 2 | **C−** | C | C− | 1 | old, pending regrade |
| Gödel Agent unrestricted "free" | — | n/a | C | — | — | old, pending regrade |
| Gödel Game of 24 exact solver | 2 | C | C | C | 1 | old, pending regrade |
| DGM SWE-bench, 20% → 50% on staged subsets | 4 | **D** | C | C− | 1 | old, pending regrade |
| DGM Polyglot, extra eval on the full set | 2r | **C** | C | C | 1 | old, pending regrade |
| DGM SWE-evolved agent on Polyglot | 4→holdout | **C** | C | C− | 1 | old, pending regrade |
| HGM vs DGM/SICA on Verified-60 / Polyglot | 2r | **C+** | B | C | 1 | old, pending regrade |
| HGM 8,000 evals on all 500 Verified | 3 | **D** | B | C | 1 | old, pending regrade |
| HGM best Verified agent on Lite-207 | 1 relative | **C+** | B | C | 1 | old, pending regrade |
| HGM same agent, Lite with GPT-5 | mixed | **C** | B | C | 1 | old, pending regrade |
| HGM `attempt_error_resolution` | — | — | — | **D** | 1 | old, pending regrade |

#### Objectives and algorithms

| Experiment | See | Eval | Search | Object | RSI | Binding reason (old) |
|---|---|---|---|---|---|---|
| DiscoPOP, MT-Bench select, AlpacaEval/TL;DR/IMDb report | 2 | **B** | C | B− | 0 | old, pending regrade |
| Self-Developing, GSM8K 100/1220, MATH 600/4400 | 2 | **B−** | C | C+ | 0 | old, pending regrade |
| ShinkaEvolve circle packing, 26 circles | 3-exact | **B−** | C+ | C | 0 | old, pending regrade |
| ShinkaEvolve AIME 2024 scaffold search | 3 | **D** | C+ | C | 0 | old, pending regrade |
| ShinkaEvolve that scaffold on AIME 2023/2025 | 1 relative | **B** | C+ | C | 0 | old, pending regrade |
| ShinkaEvolve ALE-Bench LITE, 10 tasks | 2 | **B** | C+ | C | 0 | old, pending regrade |
| ShinkaEvolve MoE load-balancing loss | 2 | **B** | C+ | **B** | 0 | old, pending regrade |
