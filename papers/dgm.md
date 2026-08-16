# Darwin Gödel Machine (DGM)

**Venue:** ICLR 2026  
**arXiv:** 2505.22954  
**Preprint:** https://arxiv.org/abs/2505.22954  
**HTML:** https://arxiv.org/html/2505.22954 · https://huggingface.co/papers/2505.22954.md  
**Code:** https://github.com/jennyzzt/dgm

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| SWE-bench Verified staged 20% → 50% | 4 | **D** | C | C− | 1 | o1 diagnosis prompt includes official private test patch and private-test log (§C.3; `prompts/self_improvement_prompt.py`). Staging 10 → 50 extra → 60 unique → 200 if >40% and top two. Start is bash + whole-file edit. Descendants add range view, string replace, retries, a ranker. |
| Polyglot extra eval on the full set, 14.2% → 30.7% | 2r | **C** | C | C | 1 | Solver never sees hidden tests (pass@1). Search used a 10 then 50 slice; 14.2% → 30.7% is a later pass of the winner. One archive run. Do not treat this as a clean SWE number. |
| SWE-evolved agent on Polyglot, 14.2% → 28.9% | 4→holdout | **C** | C | C− | 1 | Never scored on Polyglot during search. Real transfer of an object grown with SWE private tests in o1. Does not clean the 20→50 claim. |

Letters match the [`RUBRICS.md`](../RUBRICS.md) grade board.

## What they claim

Open-ended self-improving coding agents. Headline: 20.0% → 50.0% on SWE-bench (Verified, staged subsets) and 14.2% → 30.7% on full Polyglot after 80 iterations. The abstract wants this read as agents that “iteratively modify their own code” and get better at coding.

## Eval

### SWE 20% → 50%: D (level 4)

Implementer: Claude 3.5 Sonnet (New) (`claude-3-5-sonnet-20241022`). Diagnoser: o1 (`diagnose_model = 'o1-2024-12-17'` in `self_improve_step.py`). Eighty iterations, two parents in parallel on SWE (`--max_generation 80`, `--selfimprove_size 2`).

Staging, paper §4.2 and Appendix E.2, matches the shipped JSON:

- `swe_bench/subsets/small.json`: **10** tasks, all Django.
- `swe_bench/subsets/medium.json`: **50** more (25 Django, 25 Sphinx). Unique small+medium = **60** (35 Django, 25 Sphinx). That is the “50 vs 60” wording in the paper: first expand by 50, then talk about the 60-task subset.
- `swe_bench/subsets/big.json`: **140**. Paper: if >40% on the 60 and top two in the archive, evaluate on **200** (140 plus the previous 60).

`run_harness_swe` does 10, then if resolved ≥ 40% of that 10, runs the 50. `DGM_outer.py` computes `full_eval_threshold` (second-highest archive score, floored at 0.4) and passes it in. **Paper vs code:** `self_improve()` loads `big.json` into `test_task_list_big` and accepts `full_eval_threshold`, then never uses either. The 200-task pass is described in the paper and is available via `test_swebench.py --test_big`; it is not wired into the published outer-loop function. Headline 20.0% → 50.0% is still on those staged subsets, not a frozen leftover of Verified.

Level 4 is the SWE diagnosis prompt, not the solver. The coding agent is told private tests are unavailable at evaluation time. The separate o1 prompt that writes the next edit is given both the official patch and the private-test log:

```text
# jennyzzt/dgm/prompts/self_improvement_prompt.py (get_diagnose_prompt_swe)
# Private Test Patch
SWE-bench's official private tests to detect whether the issue is solved. This is not available to the agent during evaluation. The agent should try to implement its own tests.
----- Private Test Patch Start -----
{test_patch}
----- Private Test Patch End -----

# Issue Test Results
The test results from SWE-bench using the above official private tests.
----- Issue Test Results Start -----
{eval_log}
```

`get_diagnose_prompt_swe` fills `{test_patch}` from `entry['test_patch']` and `{eval_log}` from the SWE-bench eval dump. Empty-patch / stochasticity / context-length branches omit that dump; the unresolved-issue path, which is the main mutation channel, includes it. §C.3: “While the private test patch is included in the diagnosis prompt… we have not observed… hardcoding.” Manual inspection does not remove the leak. Transfer cannot raise *this* number.

Gold `patch` is passed into `.format(...)` but the template has no `{answer_patch}` slot, so the official fix is not in the prompt. The leak is the hidden tests and their results.

**Why not C.** Level 4 is a hard cap at D. **Why not a plus.** One search; ± is not over searches.

### Polyglot extra eval 14.2% → 30.7%: C

Paper §4.2: leaderboard is pass@2 (one look at ground-truth tests); DGM reports pass@1, “where the agent never sees ground-truth test results.” Search: 10 then 50 tasks; 14.0% → 38.0% on that 50; then a later pass of the winner on the full set, 14.2% → 30.7%. One archive run. That is 2-rewrite (staged subset, then a bigger set that includes it), not a frozen three-way split.

Do not clean this row with the SWE o1 leak, and do not clean SWE with this solver. Polyglot `get_diagnose_prompt_polyglot` reuses the same “Private Test Patch” template and fills it with `entry['reference_tests']` on the default path (about 75% of diagnoses; empty-patch and stochasticity branches do not). That is a proposer look at hidden tests on the 10/50 slice. It is not the SWE official `test_patch`, and it is not enough to move this letter off the calibrated C for “full-set extra pass after a 10/50 search.” If someone scored only the 50-task search headline (14% → 38%), that same-set number would be D.

### SWE-grown agent on Polyglot 14.2% → 28.9%: C

Never trained on Polyglot. Real transfer. Object still grown with SWE private tests in o1. Does not wash 20→50. Model transfer on 200 SWE tasks (o3-mini 23% → 33%, Claude 3.7 19% → 59.5%) mixes a 200-slice that includes the search 60; treat as C. The Claude 3.7 jump is consistent with filling scaffold holes a strong model can use.

## Search method C

Archive of compiled children (`update_archive`, default `keep_all`). Parent pick is `score_child_prop`: sigmoid of accuracy (`λ=10`, midpoint 0.5) times `1/(1+children_count)` (§C.2; `choose_selfimproves` in `DGM_outer.py`). Baselines: freeze the meta-agent as the initial agent (`no_selfimprove`), or always take the latest functioning agent (`no_darwin`). That is a real loop. It stays C because the *plan* for each edit is frozen o1 with private tests in context. Credit that external diagnoser. Not a comparison of searchers under a matched mutation grammar (HGM later is). Not B.

## Evolved object C−

Base tools, `tools/edit.py`: view/create/overwrite whole files. “No partial/line-range edits or partial viewing are supported.” Bash is the other tool. Paper §4.4: descendants add line-range view, string replacement, multiple attempts, a second FM to rank patches, previous-attempt context. Those are standard coding-agent parts. Weak-start / weak-root cap: max C. C− because the start omitted those parts on purpose and the 2.5× Q jump mostly restores them. Not D: the tools run.

## RSI 1

The child agent’s code is what later parents edit (`coding_agent.py` + `tools/` + `utils/`, with evolution helpers excluded from the diagnosis dump). Measured number is still task success Q on SWE/Polyglot subsets. Frozen o1 still plans. No early/mid/late parents under matched mutation budget and hidden failures. Not 2.

## Control flow (from published code)

1. **Parent.** Sample from the archive with `score_child_prop` (or `no_darwin`: last commit only). Then pick a failure to diagnose: 25% empty patches if ≥10% empty, 25% stochasticity, 25% context-length if logs show the repeated 400 error, else a random unresolved SWE id (`choose_selfimproves`).
2. **Propose.** `diagnose_problem` calls o1 with `get_diagnose_prompt_swe` or `_polyglot`. Output JSON → `problem_description` is the GitHub-issue-shaped spec for the next edit.
3. **Mutate.** Docker copy of the parent (patch stack applied). `coding_agent.py --self_improve` with Claude 3.5 Sonnet implements that spec against the agent’s own repo. Writes `model_patch.diff`.
4. **Evaluate.** SWE: 10 Django, maybe +50 Django/Sphinx, report via official SWE-bench tests. Polyglot: 10 then maybe +50, pass@1, solver does not see hidden tests.
5. **Promote.** Keep if `is_compiled_self_improve` (code compiles, not all empty patches). Default archive keeps all compiled children. Optional post-hoc `diagnose_improvement` also uses o1 and private-test logs; that is logging, not the next parent pick.

Polyglot implementer in `coding_agent_polyglot.py` can switch to `OPENAI_MODEL` when `--self_improve`; SWE `coding_agent.py` stays on `CLAUDE_MODEL` for both self-modify and eval. Paper Table 3: self-modification Claude 3.5 Sonnet (New) on both benches; evaluation Claude 3.5 on SWE, o3-mini on Polyglot.

## Cite as / do not cite as

**Cite as.** Negative-control Eval case: how not to validate RSI. Useful as “automated search can rebuild a normal coding harness from a stripped shell.” Open-ended archive vs last-only is a real ablation of parent pick, not of hidden tests.

**Do not cite as.** Held-out SWE 20→50. Novel tools. Measured improvement-of-improvement. A Polyglot solver that never sees tests as proof that the SWE diagnoser is clean.
