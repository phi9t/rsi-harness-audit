# Self-Developing

**Venue:** NAACL 2025 (ACL Anthology 2025.naacl-long.519)  
**arXiv:** 2410.15639  
**Preprint:** https://arxiv.org/abs/2410.15639  
**HTML:** https://arxiv.org/html/2410.15639  
**Full title:** Can Large Language Models Invent Algorithms to Improve Themselves?: Algorithm Discovery for Recursive Self-Improvement through Reinforcement Learning  
**Code:** none published. Confirmed: arXiv HTML has no author GitHub (only EleutherAI/lm-evaluation-harness, arcee-ai/mergekit, and Hugging Face model cards). Hugging Face has no paper page / no `githubRepo`. ACL Anthology page has no code link. Author GitHub (`yoichi1484`) does not host this experiment.

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| GSM8K 100/1220, MATH 600/4400, top-15 by dev then one test pass | 2 | **B−** | C | C+ | 0 | Dev then remainder test. Top 15 of hundreds of executable merges then one test pass. Thousands of LLM programs vs a small Task Arithmetic / TIES grid. Merge always applied to the original seed model; only the factory is updated (RSI 0). Best GSM8K rule is iterative mean-and-broadcast with `keepdim=True`; no isolation of the mean. |

## What they claim

An algorithm factory that writes model-merging code, iteratively, improves GSM8K and MATH. Headline: seed openchat-3.5-1210 GSM8K **70.1 → 76.1** (+6 points), beating Task Arithmetic **71.9** by 4.3 points. MATH **0.5 → 8.5**, tying the strongest hand merge. Transfer to new merge candidates without re-optimization: GSM8K **78.8** vs Task Arithmetic retuned on those candidates **71.4** (the abstract’s 7.4 points).

## Eval B−

Dev: 100 GSM8K and 600 MATH (100 from each of six MATH subsets). Test: remaining 1,220 and 4,400. Up to 3 × 3,000 proposals; after filtering, typically 100–300 executable Python functions per iteration. Top 15 by *dev* across iterations get one test eval. Seed model openchat-3.5-1210; merges of Abel-7B-002, OpenHermes-2.5-Mistral-7B, and SciPhi-Mistral-7B-32k task vectors into MLP layers via mergekit. Task Arithmetic / TIES tuned on a small coefficient grid (20/40/60% combinations). No full-search repeats, no test CIs.

Level 2 (dev selection). Held-out remainder is real, so not D. **Why not B.** Top-15 multiple comparison plus search-space mismatch is two misses. **Why not C.** The 100/1220 and 600/4400 cut is documented.

## Search method C

DPO on code preferences (top 3% vs bottom 10%) updates the factory. Prompt `x` is fixed across iterations, with a one-shot Python example. Not compared to random merge programs in the same `merge_models` grammar at ~9,000 tries. C, not B−.

## Evolved object C+

Best GSM8K algorithm is **Figure 11, Algorithm A** (Table 1 points here, not Figure 10). The executable body is an iterative hybrid of identity and a reduced mean with `keepdim=True` broadcasting, α=0.5:

```python
def hybrid_merge_strategy(x, y, alpha=0.5):
    return (1 - alpha) * x + alpha * torch.mean(
        y, dim=(0 if x.dim() == 1 else 1), keepdim=True
    )
```

The comment says “element-wise multiplication and average”; the math (Eq. 6) is \(\frac12(\tau^{\text{merged}}_{i-1} + \mu_i\mathbf{1})\). Grade the body. Unusual relative to vanilla task arithmetic. Missing ablations: mean vs no mean, order, broadcast vs matched-rank projection, bias-vector baseline, per-source contribution. MATH 8.5 ties Task Arithmetic.

**Why not B−.** No isolation, so it cannot be a “new mechanism” B. **Why not C.** It is not just another debate graph; the algebra is odd enough to reproduce with ablations. Transfer to WizardMath / Starling / BioMistral candidates is real but still unablated.

## RSI 0

Every merge is applied to fixed \(M_0\). The improved model is never the next factory. The paper says so:

> Note that the generated algorithms are always applied to the seed model \(M_0\), as the algorithm factory is trained specifically to improve \(M_0\).

The factory is LoRA-DPO-updated; that is a better code proposer, not the merged weights improving themselves. The paper’s “self-developing” / “recursive self-improvement” language is the factory loop. Rubric: RSI 0.

## Control flow (from published code)

No official code. Grade from the preprint only.

Paper loop: clone factory \(\pi_1^g \leftarrow M_0\). For each of three iterations: sample \(N=3000\) Python `merge_models` functions from the factory (temperature 1.2 → 0.85); drop non-executable / timeout; apply survivors to task vectors \(\tau_{C_j}=C_j-M_0\) and add the result to **original** \(M_0\); score on dev; DPO the factory on top-3% vs bottom-10% pairs (later iterations also keep the previous top-3 programs). After all iterations, take the 15 best-by-dev merges and score them once on leftover test. No GPT-4 in the proposer.

## Cite as / do not cite as

**Cite as.** Proper final split, unfair baseline budget, interesting unablated merge.

**Do not cite as.** Recursive model improvement. RSI. A new isolated merge mechanism. Fair search-space comparison to Task Arithmetic / TIES.
