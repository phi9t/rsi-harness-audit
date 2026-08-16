# DiscoPOP

**Venue:** NeurIPS 2024  
**arXiv:** 2406.08414  
**Preprint:** https://arxiv.org/abs/2406.08414  
**Code:** https://github.com/luchris429/DiscoPOP

## Experiments scored

| Experiment | See | Eval | Search method | Evolved object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| MT-Bench select, AlpacaEval / TL;DR / IMDb report | 2 | **B** | C | B− | 0 | Held-out family exists. MT-Bench is fitness and still in the story. Named LRML is not the MT-Bench winner and not the AlpacaEval WR winner. GPT-4 proposes ~100 losses, one pipeline. Frozen proposer. |

## What they claim

GPT-4 discovers a “state-of-the-art” preference loss. The branded object is Log Ratio Modulated Loss (LRML), also called DiscoPOP. Abstract and §6 treat LRML as the discovery. Held-out tasks: AlpacaEval 2.0, TL;DR (694 posts), IMDb sentiment.

## Eval / search method / evolved object / RSI

### Eval B

About 100 valid objectives. Fitness is MT-Bench (80 questions, GPT-4 judge). Training recipe is fixed: `zephyr-7b-gemma-sft`, Argilla DPO Mix 7K, β=0.05, two epochs (`recipes/zephyr-7b-gemma/gpo/config_full.yaml`). Held-out suite is a different benchmark family, so this is level 2, not level 3.

Full discovery pipeline is not repeated. CIFAR-10 toy discovery averages three runs (App. Fig. 12). IMDb curves average 10 generation seeds, not 10 searches.

**Why not B+.** MT-Bench is both the selection metric and a reported table. No full-pipeline repeats. **Why not B−.** AlpacaEval / TL;DR / IMDb are not the MT-Bench items; that family split is stronger than MASS’s tiny same-family slices. **Why not C.** The leftover suite is real.

Honest-selection miss: the named artifact is not the fitness winner (object grade, below). That does not pull Eval to B−; the held-out family still exists.

### Search method C

Published loop (`scripts/launch_evo.py`): GPT-4 (`gpt-4`) emits JSON `{thought, name, code}` for a PyTorch `f` over chosen/rejected log-probs. Seed archive is DPO, hinge, IPO, KTO with their MT-Bench scores. Validate shape / NaN / grads → train GPO replacing DPO → FastChat MT-Bench → append `Fitness: {val}` and ask for the next one. Default CLI `--num-generations` is 5; the paper’s experiment is ~100 valid functions. No random or grammar search at the same training budget. C, not B−.

### Evolved object B−

Use Table 1 / Eq. 5 / Appendix E.6 / the published trainer, **not Eq. 4**. Eq. 4 writes `(σ(βρ/τ) − 1) · f_dpo`, which negates the logistic term. Eq. 5 and Table 1 are `(1 − σ(βρ/τ)) · f_dpo + σ(βρ/τ) · f_exp`. Official `src/alignment/gpo.py` uses `tau = 0.05` and `(1 − σ) * logistic + σ * exp`. That matches Table 1 / Eq. 5 and runs.

MT-Bench among discovered losses (Table 1 / App. E): DBAQL 7.978 > AQL 7.953 > PADLL 7.941 > AQFL 7.931 > CELL 7.925 > **LRML 7.916**. LRML is sixth. AlpacaEval WR vs GPT-4 (Table 2): PADLL 14.07, AQFL 13.63, LRML 13.21, DPO 11.23. Error bars among the top three overlap. Length-controlled vs SFT is the one column where LRML leads (65.18 vs AQFL 64.41 / PADLL 64.14); the paper says top losses are mostly not significantly different except that LC-vs-SFT cell. TL;DR: PADLL and DPO lead; LRML is close, not first.

They still brand LRML because of a nonconvex region and a negative gradient at margin 0, not because it won:

> Because of its unconventional properties and performance, we refer to LRML as our discovered preference optimization, or DiscoPOP, algorithm. (§5)

Named object that is not the fitness winner cannot be object B. “State of the art” is stronger than their own ranking. **Why not C.** It is still a working formula with some transfer, unlike another debate graph.

### RSI 0

Frozen GPT-4 proposer. The discoverer’s weights are not the thing being aligned. Future-work sentence about using the produced models to generate code is not an experiment.

## Control flow (from published code)

1. **Parent.** There is no parent sample. The first user message dumps the four seed losses and scores. Later turns are the full chat, including invalid code (`fitness = -1`).
2. **Mutation.** One GPT-4 JSON proposal per generation. Interface is four log-prob tensors in, per-example loss out. `self.beta = 0.05` is fixed in the prompt.
3. **Evaluation.** `train_gpo` writes the snippet into `tests.json` and launches `scripts/run_gpo.py`. `evaluate_gpo` runs FastChat `gen_model_answer.py` / `gen_judgment.py` and takes the mean MT-Bench score.
4. **Promotion.** Every valid trained loss is fed back. Disk hygiene only: score ≥ 7.9 uploads weights; score ≤ 7.75 deletes the checkpoint. The conversation is the archive. No island, no elite cap, no comparison searcher.

Code vs paper: trainer’s current LRML matches Table 1 / Eq. 5 (with `tau = 0.05`). An `_old` method used `sigmoid(logits)` without τ. Grade the current function.

## Cite as / do not cite as

**Cite as.** Machine-written preference objective with a real held-out family. If you reproduce LRML, run PADLL and AQFL in the same grid.

**Do not cite as.** State of the art. MT-Bench winner. AlpacaEval win-rate winner. RSI.
