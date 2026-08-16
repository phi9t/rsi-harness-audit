# AFlow

**Venue:** ICLR 2025  
**arXiv:** 2410.10762  
**Preprint:** https://arxiv.org/abs/2410.10762  
**Code:** https://github.com/FoundationAgents/AFlow

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| 20/80 seed 42, then high-variance val filter | 2r | **B−** | C | C | 0 | Test is 80%. After the split, a blank run five times keeps only high-variance val items. Operators are human (generate, format, review, ensemble, test, programmer). Ablation: GSM8K still high with operators removed. |

## What they claim

MCTS over workflows, average **80.3** on six tasks with GPT-4o-mini. Beats manuals by 5.7% and automated baselines by 19.5%. MATH is the 617 level-5 four-category slice.

## Eval B−

Random 20% val / 80% test, seed 42 (`benchmarks/utils.py`: `np.random.seed(42)` then shuffle). Then a blank workflow is run five times on val and **high-variance instances are kept as the search set** (paper, Initialization). MCTS, 20 rounds (`max_rounds=20`), each candidate evaluated five times on that val (`validation_rounds=5`). Final test is the 80%, average of three *test* runs (paper). MATH uses 617 level-5 problems, four categories. Operators: generate, format, review, revise, ensemble, test, programmer.

Level 2-rewrite. Ceiling **B−** even though a test split exists. That is the point of the 2-rewrite rule: the split is not the search distribution.

**Why not B.** The high-variance filter is model-dependent and is not a frozen pre-registered val set. **Why not D.** The 80% test is documented and unused during MCTS.

## Search method C

MCTS variant over a human operator list, compared to ADAS and manuals. Soft mixed-probability parent pick (uniform + score softmax). Not compared to MCTS without an LLM, or random workflows in the same grammar, at the same 20×5 budget.

## Evolved object C

GSM8K: program execution, multiple samples, formatting. Coding: generate or run tests then select. Ablation: removing named operators leaves much of GSM8K intact (about 93.1% in the paper’s operator-off path). Gain is partly prompt/code search around a template. Library ceiling: max C.

## RSI 0

Frozen MCTS + LLM expander. Workflows change. The searcher does not.

## Control flow (from published code)

**Parent pick.** `DataUtils.select_round`: sort by mean val score, mix uniform (`λ=0.3`) with softmax over scores (`α=0.2`), sample one prior round, always eligible to include round 1 (blank template).

**Propose.** Optimizer LLM (`opt_llm_config`) fills `{modification, graph, prompt}` given operator descriptions, parent graph, and a few log samples. `ExperienceUtils.check_modification` rejects repeats.

**Score.** `Evaluator.graph_evaluate` on `{dataset}_validate.jsonl` five times; mean score is fitness. Test mode reads `{dataset}_test.jsonl`.

**Promote.** Write `workflows/round_{k}/`, append to `results.json`, backprop experience. Convergence helper watches top-k val means.

**Models.** Paper: GPT-4o-mini as executor; optimizer is an LLM (config-selected). `run.py` operator menus are per dataset, e.g. MATH `["Custom", "ScEnsemble", "Programmer"]`, code `["Custom", "CustomCodeGenerate", "ScEnsemble", "Test"]`. Classes in `scripts/operators.py`: Custom, AnswerGenerate, CustomCodeGenerate, ScEnsemble, Programmer, Test, Format, Review, Revise, MdEnsemble.

Code vs paper: the high-variance filter is in the paper’s Initialization, not auto-run in current `evaluator.py` (`va_list = None` tests all val). README still says you may set `va_list` to use a portion of val. Grade the published experiment as 2-rewrite. Seed-42 20/80 is in the code.

## Cite as / do not cite as

**Cite as.** Better split hygiene than ADAS, undone in part by the variance filter. Workflows are familiar program-aided and test-driven patterns.

**Do not cite as.** Frozen 20% val without the variance filter. Full MATH. New operators.
