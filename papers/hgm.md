# Huxley–Gödel Machine (HGM)

**Venue:** ICLR 2026 Oral  
**arXiv:** 2510.21614  
**Preprint:** https://arxiv.org/abs/2510.21614  
**HTML:** https://arxiv.org/html/2510.21614 · https://huggingface.co/papers/2510.21614.md  
**Code:** https://github.com/metauto-ai/HGM  
**Name:** Huxley–Gödel Machine. Not “Hierarchical.” Clade here means a node plus its descendants (Huxley 1957, as used in §3.2).

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| CMP vs DGM/SICA on Verified-60 / Polyglot (~800 evals) | 2r | **C+** | B | C | 1 | Same 60-task slice as DGM (small+medium). CMP + Thompson sampling vs greedy parent pick. After-the-fact “best descendant, drop the parent” is not the online pooled pass rate. |
| 8,000 evals on all 500 SWE-bench Verified | 3 | **D** | B | C | 1 | 53.2% → 61.4% on the same 500. Authors note leaderboard scores can overfit. |
| Best Verified agent on Lite-207 (drop 93 overlap) | 1 relative | **C+** | B | C | 1 | 93 of 300 Lite overlap Verified; they report the 207. GPT-5-mini 34.8% → 40.1% vs SWE-agent 39.6. One run. |
| Same agent on Lite with GPT-5 backbone | mixed | **C** | B | C | 1 | Harness and backbone both change vs the GPT-5-mini search. |
| Showcased `attempt_error_resolution` | — | — | — | **D** | 1 | Appendix F: logs “Would attempt…”, skips install/fix, `return True`. Not in shipped `best_agent/`. |

Letters match the [`GRADE_BOARD.md`](../GRADE_BOARD.md) grade board.

## What they claim

Clade metaproductivity (CMP) — pooled success of a lineage — approximates a Gödel machine and yields human-level coding-agent design. Headlines: HGM’s best-belief agent 56.7% on SWE-Verified-60 and 30.5% on Polyglot after 800 task-evals, beating DGM/SICA at lower CPU hours; 53.2% → 61.4% on all 500 Verified after 8,000 evals; Lite-207 GPT-5-mini 40.1% vs SWE-agent 39.6%.

## Eval

### vs DGM/SICA on Verified-60 / Polyglot: C+

Paper §4: 60-task subsets “derived from the first two stages of DGM’s progressive evaluation.” Code: `config.yaml` `full_eval: false` loads `small.json + medium.json` (the same 10+50). Polyglot: DGM’s no-hidden-test solver setting. Budget ~800 task-evals. Initial ancestor 40% on Verified-60, 20.3% on Polyglot. HGM best-belief 56.7% and 30.5%. Expansion: GPT-5 on SWE, quantized Qwen3-Coder-480B on Polyglot. Evaluation: GPT-5-mini / Qwen3-Coder-30B. Default `config.yaml` sets diagnoser, improver, and downstream all to `gpt-5-mini`; the SWE bake-off in the paper uses a stronger expander than that default.

Eval C+: inherited 60-slice, not a new frozen split, but they compare search *policies* rather than claiming a new SWE SOTA here. One run. The SWE diagnoser is still DGM’s template: `get_diagnose_prompt_swe` pastes `entry["test_patch"]` and `{eval_log}` into the o1-era “Private Test Patch” block (`prompts/self_improvement_prompt.py`). Diagnoser is `gpt-5-mini`, not o1. That leak is shared with DGM on this slice; it is why this row is not a generalization claim. If you need a SWE number you can defend, use Lite-207, not 56.7% on the search 60.

### 8,000 evals on all 500 Verified: D

`full_eval: true` loads every SWE-bench Verified `instance_id`. Start raised to 53.2% (Appendix C.1: drop the file-edit tool, bash only, five-hour timeout). After 8,000 evaluations, 61.4% on the same 500. Authors: higher leaderboard scores “do not necessarily indicate superior general coding ability” because agents may overfit. Level 3. Eval D. Search method can stay B; this experiment does not measure the searcher on a leftover set.

### Lite-207: C+

300 Lite tasks, 93 overlap Verified, 207 leftover. GPT-5-mini: ancestor 34.8% → HGM 40.1% vs SWE-agent 39.6% (filtered); standard Lite 44.0% → 49.0% vs 47.6%. One run. Honest overlap cut is why this is C+ not C. The 0.5 point over SWE-agent under the same backbone is the right human-harness comparison; it is small.

### Lite with GPT-5: C

Harness and backbone both change vs the GPT-5-mini search. Paper Table 4 is that transfer. Eval C.

## Search method B

Specified loop you can reimplement: Thompson sampling on clade-pooled Bernoulli outcomes, expansion decoupled from evaluation (`hgm.py` `expand` vs `sample`). Controls are DGM and SICA on the same 60-slice / Polyglot, same initial agent, ~800 evals. That is a searcher comparison, not “vs chain-of-thought.” B, with GEPA, not B+: the correlation table’s “empirical CMP” is not what Thompson sampling saw.

**Online CMP (what the loop uses).** `Node.get_decendant_evals` concatenates the node’s own 0/1 `utility_measures` with every descendant’s. `TS_sample` sets α = 1 + sum, β = 1 + n − sum, draws Beta, takes argmax. Expansion samples on those clade lists. Evaluation allocation samples on the node’s *own* `utility_measures` only. Config `n_pseudo_descendant_evals: 10000` only kicks in if a node already has that many evals; at 800 or 8,000 budget it does not.

**After-the-fact “empirical CMP” (Appendix D, Table 1).** Max empirical mean of task performance in the clade, **excluding the node itself**:

> max_{a′ ∈ C(a) \ {a}} n_success(a′) / (n_success(a′) + n_failure(a′))

The HGM estimator they correlate against also drops the node and the child subtree that contains the empirical max. Those quantities are computed on the finished tree. They are not the online pooled pass rate. Rubric: the number used in the loop must be the number in the analysis. This mismatch blocks B+. It does not pull the searcher to C: the loop is still specified and compared to other tree searchers.

CMP is not RSI 2. Assumption 1 defines utility as the final agent’s evaluation score on repeatable tasks. That is Q, by construction.

## Evolved object

Typical harness: C. Coding-agent parts (bash, edits, retries). Appendix C.1: the 4.2 initial agent is DGM’s loop plus API/timeout tweaks; the 4.3 start removes the file-edit tool.

Showcased `attempt_error_resolution`: **D**. Appendix F listing, not present under `best_agent/` in the official repo. Confirmed behavior:

- append `Would attempt to install Python module: {module}`
- comment: “But we’ll skip actual installation to avoid side effects”
- append `Would attempt to fix syntax error in {file_path}...`
- “This is just a demonstration of what could be done”
- `return True, "Automated resolution attempted:" + ...`

Named mechanism does not run. Object D for that artifact. Do not use it as evidence of long-horizon self-modification. This does not pull the CMP searcher down from B.

## RSI 1

Agents edit their own repos (`sample_child` → `diagnose_problem` → `coding_agent.py --self_improve`). Reported numbers are descendant *task* success on SWE/Polyglot. CMP is the right *idea* for level 2 (value of a node as a parent). It is not the experiment: no early/mid/late parents, no matched mutation budget, no hidden failure traces, no child-quality distribution. Frozen diagnoser (`diagnose_llm`) still writes the plan. Not 2. CMP ≠ RSI 2.

## Control flow (from published code)

Adapted from DGM. Differences that matter:

1. **Archive is a tree of `Node`s**, not a flat list with score×novelty sampling.
2. **Decoupled actions.** If `n_task_evals ** alpha >= (n_nodes - 1 + pending expands)`, expand; else evaluate one agent–task pair (`alpha` default 0.6). Evaluations are single tasks, not a full 10/50/200 stage.
3. **Expand.** Thompson-sample a parent from clade evals → `choose_entry` (same empty/stochastic/context/unresolved lottery as DGM) → `diagnose_problem` with `diagnose_llm` → child implements with `self_improve_llm`.
4. **Evaluate.** Thompson-sample a node from its own evals, pick an unseen task (random if `eval_random_level`, else first remaining), run SWE or Polyglot harness with `downstream_llm`, append 0/1 to `utility_measures`.
5. **Final pick.** Paper: `arg max Score_π(a)` on the finished tree (best-belief / empirical mean for DGM and SICA; HGM uses the CMP-guided tree). One tree per setting in the tables.

Shipped `best_agent/` is a GPT-5 self-modify trace (`self_evo.md`) with bash, file editor, ast editor, python executor. It is not the Appendix F no-op resolver.

## Reconstructable protocol

Tree of `Node`s. Decoupled expand vs evaluate (`alpha` default 0.6). Expand: Thompson-sample a parent from clade evals, diagnose, child implements. Evaluate: Thompson-sample a node from its own evals, run one unseen task, append 0/1. Final pick is best-belief on the finished tree.

## Train/test audit

Verified-60 is DGM’s small+medium slice (See 2-rewrite). 8,000-on-500 is See 3 (D). Lite-207 drops 93 overlapping Lite tasks (C+). Diagnoser still gets DGM’s private-test template. Granularity: 56.7 vs 53.3 is two of 60 tasks; Lite 40.1 vs 39.6 is about one of 207.

## Artifact audit

Typical harness C (bash, edits, retries). Showcased `attempt_error_resolution` logs “Would attempt to install…”, skips, `return True` (taxonomy fail → object D). Not in shipped `best_agent/`. CMP is a search heuristic over Q, not RSI 2.

## Precise verdict

Supported: lineage-aware parent pick vs greedy score on the same 60-slice; honest Lite overlap cut. Not established: 61.4% on 500 as held-out ability, a working error-resolution tool, or child-quality RSI.

## Cite as / do not cite as

**Cite as.** Best search-method paper in this cohort for “do not pick parents by current score alone.” Lite-207 is the honest leftover cut.

**Do not cite as.** 61.4% on 500 as held-out ability. `attempt_error_resolution` as a working self-repair. Table 1’s “empirical CMP” as what Thompson sampling optimized. Recursive self-improvement (level 2). Hierarchical anything.
