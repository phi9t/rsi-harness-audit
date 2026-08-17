# ShinkaEvolve

**Venue:** ICLR 2026  
**arXiv:** 2509.19349  
**Preprint:** https://arxiv.org/abs/2509.19349  
**Code:** https://github.com/SakanaAI/ShinkaEvolve

## Experiments scored

Four experiments. Do not give the PDF one Eval.

| Experiment | See | Eval | Search method | Evolved object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Circle packing, 26 circles | 3-exact | **B−** | C+ | C | 0 | Search objective is the reported sum of radii, but the packing is checkable. ~150 evals. Recipe is golden-angle init, SLSQP, annealing, rotations. Parent-sampling / novelty / bandit ablations live **here**, not on MoE. |
| AIME 2024 scaffold search | 3 | **D** | C+ | C | 0 | All 30 AIME 2024 questions, 75 generations, three evals each (inner repeats, not three searches). |
| That scaffold on AIME 2023 / 2025 | 1 relative | **B** | C+ | C | 0 | Year held out. Object is three experts, critics, synthesizer, majority fallback (7 calls). |
| ALE-Bench LITE, 10 tasks | 2 | **B** | C+ | C | 0 | Public score for search, private for the report. Mean ~+2.3%. Top-5 public → max private 1923.5 → 1927.0. Init-hugging. |
| MoE load-balancing loss | 2 | **B** | C+ | **B** | 0 | 556M search → 2.7B check. **N_E=64, k=8 at both scales** (Table 4). New entropy-scaled hinge on global-batch LBL. No extra pretraining seeds. No hinge/entropy ablation. Searcher ablations were on packing. |

## What they claim

Sample-efficient program evolution finds SOTA packing, AIME harnesses, ALE improvements, and a new MoE loss. Three search ideas: weighted parent sampling, embedding novelty rejection, bandit LLM ensemble.

## Eval / search method / evolved object / RSI

### Circle packing: Eval B−, search C+, object C

Place 26 circles in a unit square, maximize sum of radii, no overlap, stay inside. Search objective is the score (level 3), but anyone can re-check the packing. Exact-checkable exception: cap C unless independent check is the headline; this cohort uses **B−**. OpenEvolve verifier allows 1e−6 slack. Matching AlphaEvolve’s exact check can require shrinking each radius by 1×10−8 (2.635983099011548 → 2.6359828390115476). A rerun with AlphaEvolve’s exact code scores 2.63597770931127 and needs more samples.

Main narrative is ~150 evaluations (Fig. 5). The preprint does not report three independent *searches* of the headline method; “three independent runs” in the paper is AIME’s *inner* eval of each candidate. Packing ablations (Fig. 9) are separate strategy curves on this task.

Object C: golden-angle / geometric init, SLSQP, simulated annealing, local moves, ring rotations, reheating. Standard numerical tools composed well. Published packing example (`examples/circle_packing/evaluate.py`) sets `combined_score` to the reported sum after a geometric validator.

### AIME 2024 search: Eval D. Year transfer: Eval B, object C

Search: all 30 AIME 2024 questions, 75 generations, three evals per candidate, ≤10 LLM calls, `gpt-4.1-nano`. Level 3 → **D** for that score.

Figure 6 (middle) is the year plot, not a table. Reading the three series as Base / Majority@5 / ShinkaEvolve across 2023–2024–2025 (the only grouping consistent with “smaller 2023 gains”):

| Year | Base | Majority@5 | ShinkaEvolve |
|---|---|---|---|
| 2023 | 18.4 | 21.8 | 23.0 |
| 2024 (search) | 24.4 | 32.2 | 34.4 |
| 2025 | 11.1 | 25.6 | 20.0 |

So the in-sample 2024 number is **34.4 vs 24.4 / 32.2**, not 34.4 vs 18.4 / 24.4 (those 18.4 / 24.4 are 2023 Base and 2024 Base). Year transfer: 2023 is a small lift vs base; 2025 is a larger lift vs base (11.1 → 20.0) but **below Majority@5 (25.6)**. Paper flags weaker 2023 gains as possible memorization of old AIME.

Object C: three expert personas (T=0.7), skeptical reviewers (T=0.1), editor (T=0), majority fallback, 7 calls (`3 gen + 3 review + 1 synth`). Known ensemble. Cross-LLM bars in Fig. 6 (right) are still AIME 2024.

### ALE-Bench LITE: Eval B, object C

Ten AtCoder heuristic tasks. Fitness = public score, 50 generations, init = ALE-Agent’s best. Then private score. Mean about +2.3%. Top-5 public → max private only 1923.5 → 1927.0 (authors: “negligible”; little evidence of public-set overfitting). ahc039: kd-tree subtree caches (bounding boxes, fish counts) plus a “targeted edge move” toward misclassified fish; 5th → 2nd on a retrospective leaderboard (2880 → 3140). ahc025: caching, fallback estimators, greedy/local search instead of broad annealing. Authors: changes stay close to the init.

Eval B: public/private is the right contest protocol. Object C: local engineering on ten tasks, not a new general search algorithm. Not object B: n=10, init-hugging.

### MoE load-balancing loss: Eval B, object B, search C+

Small: 556M total, 82M active, **64 experts, top-8**, 2.10B FineWeb tokens, λ=0.01, 30 iterations in the main text (Table 5 lists generations 20 — use the body). Fitness: `r = −(CE on last 10M tokens + L1 load imbalance)` (Eq. 5 in App. B.4). Large: 2.7B, 404M active, 29.36B tokens, λ ∈ {0.001, 0.01, 0.1}, **still 64/8** (Table 4). Scale changed; routing shape did not.

Discovered term (Eq. 1 / App. Eq. 6): global-batch LBL plus an entropy-scaled hinge

`s(P_ℓ) = 0.5 + (1 − H(P_ℓ) / log N_E)`, `τ = 0.064 / N_E`, extra `0.1/L ∑ s(P_ℓ) ∑ max(0, τ − f_{ℓ,i})`.

Figure 8 mean downstream sits in the 0.356–0.370 band; Shinka is above global-batch LBL, gap growing with λ (the ~0.362 → ~0.368 reading at λ=0.01 is from that figure, not a table). No extra pretraining seeds. No ablation that removes hinge vs entropy scale vs τ. Appendix notes the transfer architecture is “quite similar” and the budget limited.

**Why object B not A.** Missing seeds, mixed/small mean lift, frozen N_E and k, no term ablation. **Why B not B−.** It is a new closed form with a scale-up, not a branded second-place sibling. **Why Eval B not B+.** One transfer run, architecture family unchanged. **Why search C+ not B.** Method ablations (weighted vs hill-climbing / Best-of-N; bandit vs uniform ensemble; novelty rejection) are Fig. 9 on **circle packing**, not MoE.

### Search method C+ (paper-level)

Specified: islands, weighted parent sample `w_i ∝ σ(λ (F_i − median)) / (1 + n_children)` (code also MAD-scales the difference), embedding similarity 0.95 plus optional LLM novelty judge, UCB1 over mutation models with improvement-vs-parent reward. Compared to other *searchers* on packing only. C+ not B.

### RSI 0

Evolution engine, evaluators, proposer models, and research agenda are fixed.

## Control flow (from published code)

Official repo is the general engine plus a circle-packing example. AIME / ALE / MoE task harnesses are not in `examples/`. Grade those from the preprint; use code for “does the loop actually run?”

1. **Parent.** `ProgramDatabase.sample_parent`: island first, then `weighted` / `power_law` / `beam_search` / `best_of_n` / `sequential`. Packing and AIME tables use `weighted`, λ=10. Inspirations: random archive + top-k. Island best does not migrate.
2. **Mutation.** LLM ensemble (optional `AsymmetricUCB`) emits diff, full rewrite, or crossover inside `EVOLVE-BLOCK-*` markers. Temperatures {0.0, 0.5, 1.0}. Meta-scratchpad every T generations.
3. **Evaluation.** Job runs `evaluate.py`. Packing: geometric validator, `combined_score = sum(radii)`. Novelty judge can reject near-duplicates before eval.
4. **Promotion.** Correct programs enter the archive under an elite-size cap. `combined_score` is what weighted sampling sees.

Code vs paper: packing example’s system prompt already names SLSQP and a 2.635 target — the searcher is not starting from a blank numerical-methods menu. Framework README post-dates the preprint (PyPI runner, skills); that does not change the four paper experiments.

## Reconstructable protocol

Island archive; weighted parent sample; LLM ensemble emits a diff or rewrite inside `EVOLVE-BLOCK-*`. Packing ~150 evals. AIME 2024: all 30 questions, 75 generations, three inner evals. ALE: public score 50 generations, then private. MoE: 30 iterations at 556M, then a 2.7B check with frozen 64 experts / top-8.

## Train/test audit

Packing is See 3-exact (checkable; slack ~1e−8). AIME 2024 is See 3 (D); 2023/2025 year holdout is B. ALE public/private is B. MoE fitness is last-10M CE plus load imbalance; downstream is a later check, one transfer run.

## Artifact audit

Packing / AIME / ALE: taxonomy 3 or 2 (SLSQP+annealing; 7-call ensemble; init-hugging AtCoder edits). MoE: taxonomy 5, object B. Paper \(\tau=0.064/N_E\) vs published code \(0.64/N_E\) (tenfold). Mean 0.362 → 0.368 at λ=0.01; HellaSwag and PIQA drop. No hinge/entropy ablation.

## Precise verdict

Supported: a new load-balancing term with a scale-up; public/private ALE; year-held-out AIME as a transfer check. Not established: AIME-2024 in-sample as generalization, parent-sampling proven on MoE, or extra pretraining seeds.

## Cite as / do not cite as

**Cite as.** Strongest evolved *object* in the cohort (MoE), with the 64/8 freeze and missing seeds named. Strongest *search-method ablations* in the cohort (packing only).

**Do not cite as.** One PDF-wide SOTA. AIME-2024 in-sample accuracy as a generalization number. Parent-sampling proven on MoE.
