# ACE (Agentic Context Engineering)

**Venue:** ICLR 2026  
**arXiv:** 2510.04618  
**Preprint:** https://arxiv.org/abs/2510.04618  
**Code:** https://github.com/ace-agent/ace (`ace/ace.py`; AppWorld lives in the `ace-appworld` submodule, empty unless initialized)

## Experiments scored

| Experiment | See | Eval | Search method | Evolved object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Offline AppWorld / FiNER / Formula | 1 | **B−** | **B** | **C** | 0 | Playbook written on train, frozen, original test (pass@1). Appendix A.6 sweeps reflection rounds on AppWorld test-normal and length/dedup on FiNER test. No full construction repeats. Playbook bullets include AppWorld APIs. Updater is the method. |
| Online, shuffled test stream | — | **C** | **B** | **C** | 0 | Paper: predict on a test item, then update from that outcome. Code: test a window with the current playbook, then train on that same window. Real streaming protocol. Not frozen held-out accuracy. Same Table 1 “test” columns as offline. |

Letters match the [`GRADE_BOARD.md`](../GRADE_BOARD.md) grade board. Do not average online into the offline B−.

## What they claim

Abstract: evolving playbooks beat prompt optimization; +10.6% on agents and +8.6% on finance; 86.9% lower adaptation latency; AppWorld leaderboard match to IBM-CUGA (GPT-4.1) using DeepSeek-V3.1.

AppWorld Table 1, DeepSeek-V3.1, average of TGC/SGC on test-normal and test-challenge:

| Method | GT | Average |
|---|---|---|
| ReAct | — | 42.4 |
| ReAct + ICL (offline) | ✓ | 46.0 |
| ReAct + GEPA (offline) | ✓ | 46.4 |
| **ReAct + ACE (offline)** | ✓ | **59.4** |
| ReAct + ACE (offline) | ✗ | 57.2 |
| ReAct + DC (online) | ✗ | 51.9 |
| ReAct + ACE (online) | ✗ | 59.5 |

Headline 59.4 vs ICL 46.0 and GEPA 46.4. Offline ACE without gold still 57.2, using execution success/failure. Online 59.5 is a different estimand: the playbook is updated from the same shuffled test stream being scored. CUGA 60.3 is a leaderboard footnote (GPT-4.1 production agent), not a same-model rerun.

Finance Table 2, exact-match accuracy:

| | FiNER | Formula | Average |
|---|---|---|---|
| Base | 70.7 | 67.5 | 69.1 |
| Offline GEPA (GT) | 73.5 | 71.5 | 72.5 |
| **Offline ACE (GT)** | **78.3** | **85.5** | **81.9** |
| Offline ACE (no GT) | 71.1 | 83.0 | 77.1 |
| Online ACE (GT) | 76.7 | 76.5 | 76.6 |
| Online ACE (no GT) | **67.3 (−3.4)** | 78.5 | 72.9 |

Without reliable labels, FiNER online ACE **falls** below the base model. Paper is explicit that context can be polluted.

“−86.9% latency” is the mean of two numbers: AppWorld offline −82.3% vs GEPA, FiNER online −91.5% vs Dynamic Cheatsheet. “+10.6%” is vs selected baselines, not vs ReAct only (+17). Reading issues, not letter changes.

GEPA as ACE’s control: official DSPy GEPA, `auto="heavy"`. Adjacent prompt-optimizer control, not a matched-rollout rerun of GEPA’s own paper protocol.

## Eval / search method / evolved object / RSI

**Eval B− (offline).** Level 1 for the *algorithm*: “methods are optimized on the training split and evaluated on the test split with pass@1.” Appendix A.6 then reports reflection-iteration counts on AppWorld test-normal (Table 19) and length/dedup on FiNER test, and treats 3–5 rounds / 50–90% / 10K–100K as reasonable defaults. That is test monitoring. With no independent full constructions, two hygiene misses → B−. Published code still checkpoints on val (`best_playbook`), not test, for the writer loop.

**Eval C (online).** Paper §4.1: sequential on the shuffled test split; “for each sample, the model first predicts with the current context, then updates its context based on that sample.” Rubric: prequential-on-test sold in the same “test” columns as offline → C, not D (they name the protocol) and not B (not frozen held-out accuracy). Compare only to other streaming learners with the same feedback timing (DC is the fair row).

Code vs paper (does not move the C): `_online_train_and_test` splits test into windows (`online_eval_frequency`, default 15 in `eval/finance/run.py`, 100 in `ACE.run` docs). It **tests the whole window first** with the current playbook, then trains on those same items. That is batched prequential, not one-example-at-a-time. The print line is “Test samples (used for training and testing).” Still learning on the reported test.

**Search method B.** Authors’ invention is the playbook representation plus the three-role updater: Generator produces a trajectory, Reflector writes lessons and tags bullets helpful/harmful/neutral, Curator emits delta operations that non-LLM code applies. Ablations (Table 3): dropping Reflector and multi-epoch drops AppWorld average 59.4 → 55.1. Compared to GEPA and ReAct as adapters, and to Dynamic Cheatsheet online. Fair adjacent searcher control. Not B+: one construction; GEPA `auto="heavy"` is not budget-matched the way GEPA’s own MIPROv2 cap is.

**Evolved object C.** Figure 3 (partial AppWorld playbook) is a compiled cheatsheet: identity from the phone-contacts app; datetime range comparisons not string matching; `defaultdict` over song title → artist names; if auth fails, try “phone number instead of email as username,” clean “credentials from supervisor,” check API docs. Rubric cap: instance facts / app APIs rather than a portable rule → C, not C+. Finance playbooks similarly store XBRL tactics. Do not mix this letter with the updater’s B.

**RSI 0.** Outer ACE loop is fixed. Accumulating context is not improving the improvement rule. No child-quality experiment. “Self-improving” in the title is Q on the benchmark, not I(A).

## Control flow (from published code)

`ace/ace.py`, `_train_single_sample` then `_offline_train` / `_online_train_and_test`.

**Models.** Paper: same LLM for Generator, Reflector, and Curator — DeepSeek-V3.1 non-thinking — so a stronger Reflector cannot leak into a weaker solver. Code takes three model name strings; the paper run sets all three equal.

**Parent / state.** There is no population. The current playbook string is the only parent. Offline: iterate train samples for `num_epochs` (paper ≤5; README default 1). Online: windows over shuffled test, one epoch required.

**Propose (mutation).**
1. Generator (`GENERATOR_PROMPT`) answers with the playbook in context and returns `bullet_ids` used.
2. If wrong: Reflector (`REFLECTOR_PROMPT`) up to `max_num_rounds` (paper ≤5; code default 3) sees the trace, predicted answer, optional gold, environment feedback, and used bullets; emits a lesson plus tags. If already correct, Reflector still tags bullets.
3. Non-LLM `update_bullet_counts` increments helpful/harmful.
4. Every `curator_frequency` steps (default 1), Curator LLM emits JSON `operations`. `apply_curator_operations` is deterministic ADD-only. UPDATE / MERGE / DELETE are commented `TODO: Future Operations (not implemented yet)`. Optional `BulletpointAnalyzer` (default off) can merge similar bullets.

**Score / promote.** Offline: val accuracy picks `best_playbook`; final `_run_test` uses that frozen snapshot on original test. Online: window test accuracy is accumulated *before* that window is used to update; reported accuracy is the cumulative pre-update window scores. No Pareto set. No leftover hidden test in the online row.

Code vs paper (does not move letters): curator in this repo is ADD-only, not the full grow-and-refine operator set; online is windowed; val checkpointing exists in offline; `ace-appworld` submodule is not populated in a shallow clone without `--recurse-submodules`.

Quote that locks object C (Figure 3, troubleshooting bullet):

> try a “phone number instead of email as username,” clean “credentials from supervisor,” and check “API documentation for correct parameters.”

Quote that locks online Eval C (paper §4.1):

> “For online context adaptation, methods are evaluated sequentially on the test split: for each sample, the model first predicts with the current context, then updates its context based on that sample.”

## Reconstructable protocol

Offline: iterate train; Generator answers with the playbook; Reflector tags bullets and writes lessons (≤5 rounds in the paper); Curator emits ADD operations; non-LLM merge; val may pick `best_playbook`; freeze; pass@1 on original test. Online: shuffled test windows; predict, then update from those items.

## Train/test audit

Offline algorithm does not write bullets from test. Appendix A.6 uses test-normal / FiNER test for hyperparameter stories. Online is prequential on the reported test (Eval C). Cost table uses a lighter ACE (1 epoch, 1 reflection) than the accuracy headline.

## Artifact audit

Taxonomy 4 contents with instance facts: phone-contacts identity, Venmo/auth fallbacks, city paths. Object C, not C+. The updater (three roles + ADD merge) is Search B.

## Precise verdict

Supported: structured playbooks help on AppWorld/finance when built from train. Not established: untouched confirmatory defaults, matched cost for the highest-accuracy config, a new agent algorithm, RSI.

## Cite as / do not cite as

**Cite as.** Strongest evidence in the cohort that structured, incrementally edited context is a useful engineered artifact. Offline AppWorld 59.4 (and finance with gold) is the number that can sit next to GEPA main. The updater is the discovery, not the bullets.

**Do not cite as.** Online 59.5 as the same kind of number as offline 59.4. CUGA as a fair peer. −86.9% as suite-wide. ACE as RSI. Playbook sentences as a new reasoning primitive.
