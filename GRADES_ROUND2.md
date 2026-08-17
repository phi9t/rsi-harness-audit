# Grade board (working, round of 17 August 2026)

Scoring rules live in [`RUBRICS.md`](RUBRICS.md). Official letters still live in [`GRADE_BOARD.md`](GRADE_BOARD.md) until this file is merged. Paper evidence lives in [`papers/`](papers/).

This is the working scored record for the report-driven regrade. Do not cite these rows as official until merge.

## Paper at a glance

Letters below are **pending** until each family is re-run. Names match the pre-round board.

| Paper | Best Eval | Headline Eval | Search method | Typical object | RSI |
|---|---|---|---|---|---|
| [PromptBreeder](papers/promptbreeder.md) | B− | B− | C | C | 1 |
| [GPTSwarm](papers/gptswarm.md) | pending | pending | pending | pending | pending |
| [STOP](papers/stop.md) | pending | pending | pending | pending | pending |
| [DiscoPOP](papers/discopop.md) | pending | pending | pending | pending | pending |
| [ADAS](papers/adas.md) | pending | pending | pending | pending | pending |
| [AFlow](papers/aflow.md) | pending | pending | pending | pending | pending |
| [AgentSquare](papers/agentsquare.md) | pending | pending | pending | pending | pending |
| [Gödel Agent](papers/godel-agent.md) | pending | pending | pending | pending | pending |
| [Self-Developing](papers/self-developing.md) | pending | pending | pending | pending | pending |
| [MaAS](papers/maas.md) | pending | pending | pending | pending | pending |
| [GEPA](papers/gepa.md) | B− | B− | B | C+ | 0 |
| [ACE](papers/ace.md) | B− offline | mixed | B | C | 0 |
| [MASS](papers/mass.md) | pending | pending | pending | pending | pending |
| [ShinkaEvolve](papers/shinkaevolve.md) | pending | pending | pending | pending | pending |
| [DGM](papers/dgm.md) | pending | pending | pending | pending | pending |
| [HGM](papers/hgm.md) | pending | pending | pending | pending | pending |

## Change log

| Experiment | Axis | Old | New | Recipe step |
|---|---|---|---|---|
| GEPA main, four tasks | Eval | B+ | B− | Test monitoring: “optimal test” envelopes and test-vs-budget figures. Two hygiene misses (no search repeats + test monitoring). Matched MIPROv2 rollouts cannot supply plus once minus is required. |
| ACE offline AppWorld / finance | Eval | B+ | B− | Test monitoring: Appendix A.6 reports reflection-iteration, dedup, and length sweeps on AppWorld test-normal and FiNER test, then treats 3–5 rounds / 50–90% / 10K–100K as reasonable defaults. Two hygiene misses (no construction repeats + test monitoring). Train-then-freeze is not an A-axis item once defaults were read off test. |

## Held

| Experiment | Axis | Letter | Recipe step that kept it |
|---|---|---|---|
| PromptBreeder, arithmetic/GSM8K held-out half | Eval / Search / Object / RSI | B− / C / C / 1 | See 2, leftover test. Two misses already (no search repeats; borrowed OPRO/davinci rows). No new test-monitoring evidence in the preprint. Taxonomy 1/model-specific strings stay object C. |
| GEPA KernelBench, 35 kernels | Eval / Search / Object / RSI | D / B / C / 0 | See 3 unchanged. Same 35 kernels in \(D_{train}\) and \(D_{pareto}\). |
| GEPA main | Search / Object / RSI | B / C+ / 0 | Searcher vs MIPROv2/GRPO under a shared rollout cap still holds. Prompts are portable task recipes (taxonomy 4, not isolated) → C+. Outer loop frozen → 0. |
| ACE offline | Search / Object / RSI | B / C / 0 | Updater vs GEPA/ReAct still a searcher comparison. Playbook stores app APIs (instance facts) → C. |
| ACE online, shuffled test stream | Eval / Search / Object / RSI | C / B / C / 0 | Prequential-on-test cap unchanged. |

## Experiment grades (pre-round copy)

Columns match [`GRADE_BOARD.md`](GRADE_BOARD.md). Letters in this section are the **old** values, to be replaced per paper. See = what the proposer was allowed to see.

#### Prompt and context

| Experiment | See | Eval | Search | Object | RSI | Binding reason (old) |
|---|---|---|---|---|---|---|
| PromptBreeder, arithmetic/GSM8K held-out half | 2 | **B−** | C | C | 1 | Held. See 2, leftover test. No search repeats; borrowed OPRO/davinci rows. No test-monitoring evidence. `SOLUTION` is a control string (taxonomy 1). RSI 1: mutation prompts coevolve. No official code. |
| GEPA main, four tasks, Qwen / GPT-4.1 Mini | 2 | **B−** | B | C+ | 0 | See 2: val is \(D_{pareto}\) every round; Table 1 winner is val. Test-vs-budget / “optimal test” envelopes fail test monitoring, so plus from matched MIPROv2 rollouts does not apply. Two misses → B−. Search B and object C+ held. Table 1: Qwen 48.85 → 61.28; GPT-4.1 Mini GEPA 66.97. |
| GEPA KernelBench, 35 kernels | 3 | **D** | B | C | 0 | Held. Search and report use the same 35 kernels (`D_train` = `D_pareto`). |
| ACE offline AppWorld / finance | 1 | **B−** | B | C | 0 | Algorithm: playbook from train, freeze, original test (See 1). Paper A.6 sweeps reflection rounds on AppWorld test-normal and length/dedup on FiNER test, then names those ranges as defaults. Test monitoring + no construction repeats → B−. Object C: Figure 3 app APIs. Search B held. |
| ACE online, shuffled test stream | — | **C** | B | C | 0 | Held. Predict, then learn from that test outcome. Real streaming protocol. Not frozen held-out accuracy. |

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
