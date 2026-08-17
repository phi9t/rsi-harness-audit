# MaAS

**Venue:** ICML 2025 Oral  
**arXiv:** 2502.04180  
**Preprint:** https://arxiv.org/abs/2502.04180  
**Code:** https://github.com/bingreeky/MaAS

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Supernet router, 1:4 split | 2 | **B−** | B− | C | 0 | Train used for both learning the router and picking a path. MATH is 119/486 from 617 level-5. Router vs AFlow is a search-method comparison. Paths still walk CoT, debate, self-consistency, test, ReAct, early exit. |

## What they claim

A query-conditioned supernet beats AFlow at lower cost. Average **83.59** vs AFlow **82.25** on their slice, gpt-4o-mini. MATH train **$3.38** vs AFlow **$22.50**.

## Eval B−

Train:test 1:4 (App. C.1). No separate selection-validation set. MATH 119/486 from 617 level-5 in four categories (Combinatorics & Probability, Number Theory, Pre-algebra, Pre-calculus). GSM8K 264/1055, etc. Controller samples a path through CoT, debate, self-consistency, self-refine, ensemble, testing, ReAct, early exit. Table 1 point estimates, no search-seed bars.

Level 2 (train used for learning and picking). **Why not B.** No val split, no search repeats, MATH subset: minus. **Why not D.** Test is 4/5 of the (already sliced) data.

## Search method B−

This is the letter that moved. The object of design is a *router*, compared to AFlow (another workflow searcher), with cost numbers. That is a searcher-vs-searcher control, unlike ADAS vs chain-of-thought. Missing: repeated controller training, a frozen third split. B−, not B.

## Evolved object C

Easy queries early-exit; hard queries get more branches. That is conditional compute over a human operator list (`Generate`, `GenerateCoT`, `MultiGenerateCoT`, `ScEnsemble`, `Programmer`, `SelfRefine`, `EarlyStop` in `maas/ext/maas/scripts/optimized/MATH/train/template/operator.py`). Library ceiling: max C.

## RSI 0

Frozen controller architecture and operator set. Paths are sampled, not a new searcher.

## Control flow (from published code)

**Parent pick.** Not a population. A `MultiLayerController` (four `OperatorSelector` layers) maps query embedding × operator embeddings to per-layer Bernoulli-like samples (`sample_operators`, threshold 0.3). Layer 0 refuses `EarlyStop` and forces a Generate-family op first.

**Propose.** Sample a subnetwork (operator names per layer) for this query. Optional TextGrad pass on operator prompts (`is_textgrad`).

**Score.** Execute the sampled graph on a train batch; environment 0/1 plus cost. Adam on controller parameters (`lr=0.01`).

**Promote.** Save `{dataset}_controller_sample{k}.pth` from train. `Optimizer.test()` loads that checkpoint, `controller.eval()`, runs `{root}/test`.

**Models.** Main tables: `gpt-4o-mini` for all baselines and MaAS. Extra: Qwen-2.5-72B-Instruct, Llama-3.1-70B. Optimizer vs executor are config-split (`opt_llm_config` / `exec_llm_config`).

Code vs paper: the repo is a MetaGPT fork; the supernet loop lives under `maas/ext/maas/`. Train/test directories are separate. MATH 617 slice is in the paper, not re-derived in the controller.

## Reconstructable protocol

`MultiLayerController` maps query embedding × operator embeddings to per-layer samples. Execute the sampled path on a train batch; Adam on controller parameters. Save `{dataset}_controller_sample{k}.pth` from train; `Optimizer.test()` loads that checkpoint on `{root}/test`.

## Train/test audit

Train:test 1:4. No separate val. MATH 119/486 from the 617 level-5 four-category slice. HumanEval 131 test items (one problem ≈ 0.76 points). Ablations appear on the reported test (monitoring). Still B−, not C−: a 4/5 test split is real.

## Artifact audit

Taxonomy 2: CoT, debate, self-consistency, self-refine, ensemble, testing, ReAct, early exit (`Generate`, `GenerateCoT`, `ScEnsemble`, `Programmer`, `SelfRefine`, `EarlyStop`). Router vs AFlow is Search B−.

## Precise verdict

Supported: query-conditioned routing can match AFlow at lower reported cost on this slice. Not established: new agent primitives, full MATH, or search-level confidence intervals.

## Cite as / do not cite as

**Cite as.** Routing and cost paper. Search-method comparison vs AFlow.

**Do not cite as.** Discovery of new agent primitives. Full MATH.
