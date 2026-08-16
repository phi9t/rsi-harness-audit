# Gödel Agent

**Venue:** ACL 2025  
**arXiv:** 2410.04444  
**Preprint:** https://arxiv.org/abs/2410.04444  
**Code:** https://github.com/Arvid-pku/Godel_Agent

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Val then test, 4o writes / 3.5 runs | 2 | **C−** | C | C− | 1 | GPQA val is 32 items. Main table mixes a stronger writer with a weaker solver. Policies are majority vote, roles, few-shot. |
| Unrestricted “free” | — | n/a | C | — | — | Learns to call GPT-4o. Drop from same-model harness tables. |
| Game of 24 exact solver | 2 | C | C | C | 1 | Recursion over ops until `abs(nums[0]-24)<1e-6`. Modality switch to brute force, not a new algorithm. |

## What they claim

A self-referential agent that monkey-patches itself recursively self-improves. DROP, MGSM, MMLU, GPQA. Unrestricted “free” setting; Game of 24 case study.

## Eval

**Main table C−.** GPQA val 32 / test 166 (`task_gpqa.py`: `questions[:32]` vs `questions[32:]`); others val 128 / test 800 (ADAS-like; MGSM code takes `[:128]` then a random 50 for the val call, test ` [128:928]`). Up to 30 iterations on validation, six cycles. Self-mod model `gpt-4o-2024-05-13`; reported executor `gpt-3.5-turbo-0125`. Some ADAS-like baselines inherited rather than all rerun under one call budget. A 100-run MGSM analysis: temporary drops are common; 14% finish worse than they started.

Level 2 (val feedback). Model substitution in the *writer vs solver* pair is a compute/model mismatch. Tiny GPQA val. **Why not D.** Test is a different slice from val. **Why not B−.** The 4o/3.5 split and borrowed rows are not modest misses; they change what the number means. C− is the calibrated letter: C for “split exists,” minus for two serious confounds.

Code extra: when val ≥ threshold, `evaluate()` runs test *and* puts `Test Accuracy` into the string returned to `evolve`. That is a test-score peek in the proposal channel. It does not move the letter past C− (the headline split still exists; the 4o/3.5 mismatch already binds the minus).

**Unrestricted “free”: do not grade as harness improvement.** The agent “spontaneous[ly] request[s] assistance from more powerful models such as GPT-4o.” Valid under an unrestricted resource objective. Invalid as evidence that the harness got better. Exclude.

**Game of 24: Eval C** as a case study with a checkable exact objective, not as a general harness result.

## Search method C

Monkey-patch loop (`action_adjust_logic` rewrites `solver` / other functions, then `action_evaluate_on_task`). Compared in part to ADAS-like systems under mismatched models. Not a searcher-vs-searcher control with a matched writer.

## Evolved objects C−

Multiple chain-of-thought samples, verification, majority vote, role experts. Seed text already mentions debate, dynamic roles, step-back (`goal_prompt.md`: unrestricted access, multiple LLM calls in `solver`). Instantiating those hints is not discovery.

**Game of 24 object C** (not C− as a *modality switch*). Listing 6 recurses over permutations and `{+,-,*,/}` until `abs(nums[0] - 24) < 1e-6`, then 100%. Brute force. Do not score as a new algorithm. As a new algorithm it would be D; we score C as switching from neural guesses to exact search.

## RSI 1

Self-edits exist (`evolve` → tool calls → `action_adjust_logic` on `solver`). Measured DV is validation/test Q. No child-quality experiment. 100-run MGSM is evidence of *fragile* Q, which is useful and still level 1. Unrestricted GPT-4o assist is not RSI; drop from same-model tables.

## Control flow (from published code)

Grade the paper experiment from the preprint plus `results/{drop,mgsm,gpqa,mmlu}/agent_module/`, not from HEAD defaults.

**Parent pick.** There is one agent. `evolve` keeps the last ~10 optimize-history messages and calls the writer with `tool_choice="required"`.

**Propose.** Writer (`gpt-4o` in `results/*/Agent.py`) emits tool calls: `action_display_analysis`, `action_environment_aware`, `action_read_logic`, `action_adjust_logic`, `action_run_code`, `action_evaluate_on_task`. Restricted runs raise if `solver` code contains `"gpt-4o"` (`action_adjust_logic.py`: “ONLY model **gpt-3.5-turbo** can be used in solver.”).

**Score.** Task `evaluate(solver)` on a val slice. If val ≥ threshold, also `real_evaluate` on the leftover test slice and return both numbers.

**Promote.** Monkey-patch stays if `exec` succeeded. Best test acc is snapshotted under `results/`. Six cycles × ≤30 iterations.

**Models (paper / results artifacts).** Writer: `gpt-4o` / `gpt-4o-2024-05-13`. Solver: `gpt-3.5-turbo` / `gpt-3.5-turbo-0125`.

Code vs paper: current `src/agent_module.py` defaults the writer to `o3-2025-04-16` and some task files default solvers to `gpt-4.1-mini` / `gpt-4o-mini`. That is post-paper drift. Do not grade HEAD as the ACL experiment.

## Cite as / do not cite as

**Cite as.** Stronger self-reference than ADAS, weaker causal evidence. 100-run MGSM fragility.

**Do not cite as.** Recursive self-improvement (no child-quality test). Free GPT-4o score in a same-model harness table. Game of 24 as a discovered algorithm.
