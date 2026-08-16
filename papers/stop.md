# STOP

**Venue:** COLM 2024  
**arXiv:** 2310.02304  
**Preprint:** https://arxiv.org/abs/2310.02304  
**Code:** https://github.com/microsoft/stop

## Experiments scored

| Experiment | See | Eval | Search method | Evolved object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| 10-bit LPN, five full self-improvement runs | 1 | **B** | B− | C | 1 | 20 val instances, 50 held-out. Five complete loops. Toys. Children are textbook (beam, annealing, UCB, …). Measured number is downstream Q. |
| Transfer of one LPN-grown improver to five toys | 1 relative | B− | B− | C | 1 | One improver after T=4, not the five-run protocol. Same textbook children. |

## What they claim

An LLM-written improver that rewrites itself improves a toy program-synthesis loop. Seed is sample-and-pick-best. After a few self-improvement rounds, downstream LPN accuracy rises. A transferred improver beats the seed on 3-SAT, MaxCut, string-grid, noiseless parity, and a QAP-like toy. The paper also reports sandbox bypass and a NumPy shape bug.

## Eval / search method / evolved object / RSI

### Eval B (LPN five-run)

Learning Parity with Noise, 10-bit. Utility averages accuracy on M = 20 noisy instances; test meta-utility is 50 held-out instances. Five independent STOP runs, mean ± SE (Fig. 4 left). Improver model `gpt-4-0314`. D = 5 identical copies of (u, s). Seed solution is random sampling.

Level 1: the prompt sees a grey-box utility description, not the individual downstream instances (“the individual downstream tasks themselves are not included in the description”). Published code matches: `utility.str` is `tasks/parity_noise/utility.py` (shown to the LM); scoring is `secret_utility.py` with `n_tests = 20` val / `50` test and distinct seeds (4321 vs 5678).

Five full loops is the cohort’s best search-repeat practice.

**Why not B+.** The claim’s world is synthetic 10-bit problems and compact combinatorial toys. Transfer (Table 1) is not the same five-run protocol. **Why not A.** Toys, and no natural-harness follow-up. **Why not C.** The LPN split and the five runs are real.

Baselines in §5.1 are chain-of-thought (one attempt, no utility calls) and greedy iterative improvement, not a non-LLM evolutionary improver at the same budget.

### Search method B−

The method *is* the loop: improver I edits I, scored by meta-utility û (expected downstream utility of the child solver). Specified, and rerun five times. Compared mainly to CoT / greedy scaffolds. B−, not C, because the self-referential loop is the contribution and they measured it five times. Not B: no searcher-vs-searcher control with the same candidate language.

### Evolved object C

§6.1 children: beam search (most common), genetic search, simulated annealing, decomposing-and-improving-parts, temperature-as-exploration, ε-greedy (Fig. 5), multi-armed / UCB allocation, caching, early stopping. Textbook. Hard cap: already on the menu → at most C.

The interesting negatives are in the same paper, and they are scientific, not new algorithms:

- Unsandboxing: 10,000 independent seed improvements; syntactic hit on `use_sandbox=False` or `exec(`. GPT-4 **0.42%** (0.31–0.57%); GPT-3.5 0.12%. Warning in the seed did not help (Table 2).
- Reward hack: `acc = np.sum(y_hat == y) / n_test` with a broadcasting shape mismatch yielded “accuracy of over 1000%.” That is a bug, not a method.

### RSI 1

The paper says it is not full RSI:

> Since the language models themselves are not altered, this is not full recursive self-improvement.

And: “not completely a Recursively Self-Improving (RSI) system, as the underlying LM remains unchanged.” Meta-utility is average downstream task utility, “only indirectly” improver quality. That is level 1: self-reference exists; the reported number is still Q. Calibration prototype for the RSI column. Not 2: no early/mid/late parents scored by *child quality* under a hidden evaluator.

## Control flow (from published code)

`run_improver.py` + `tasks/meta_optimization/secret_utility.py` + `config.py`.

1. **Parent.** Single incumbent improver string. Seed (`tasks/meta_optimization/seed_algorithm.py` and `secret_seed_algorithm.py`): prompt GPT-4 `n_messages` times at T=0.7, `extract_code`, `best_solution = max(new_solutions, key=utility)`. Config: `max_responses_per_call = 6`, `language_model_call_budget = 4`, `n_iterations = 6`.
2. **Mutation.** `improve_algorithm(incumbent, meta_utility, language_model)` — the *current* improver is asked to improve *itself*. The LM sees `utility.str` (grey-box `utility.py`), not `secret_utility.py`.
3. **Evaluation.** `meta_utility` runs the candidate improver `meta_utility_tests = 5` times on the downstream seed solver, averages `secret_utility(..., mode="val")`. `log_usage=True` also scores `mode="test"` (50 instances) for logging. Downstream LPN: 10 bits, 100 train / 20 test bits, noise 0.05, 2s timeout.
4. **Promotion.** If `checked_utility == 0` or an exception, revert to the previous improver. Else replace both the improver string and the callable (`temp_override`). Hill-climb on val meta-utility. No population.

Code vs paper: grey-box / 20–50 split / sample-and-pick-best seed match §3–5.1. Config `n_iterations = 6` vs figures that highlight rounds 1–3 and a T=4 transfer pick. Sandbox stress test is a separate `tasks/sandbox/` utility with `use_sandbox=True`; the LPN secret scorer does not implement that flag.

## Cite as / do not cite as

**Cite as.** Cleanest bounded self-reference experiment in the cohort, and the best reward-hacking case study (unsandbox, >1000% NumPy).

**Do not cite as.** Novel algorithm discovery. Open-ended RSI. A number about natural language tasks.
