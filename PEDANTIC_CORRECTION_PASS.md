# Pedantic Correction Pass — Harness / RSI Audit

**Rubrics:** v1 letters in this file are historical. Scoring rules are now in [`RUBRICS.md`](RUBRICS.md) (v2: claim-level, Disc-U/Disc-H split, exposure L1–L4 + L2s, hard caps).

**Date:** 2026-08-16  
**Method:** Primary-source verification against arXiv/ACL HTML for all 16 papers in the user’s audit.  
**Verdict in one line:** The user’s core thesis holds; several protocol details need tightening; two high-stakes claims (DGM private-test leak; HGM no-op `attempt_error_resolution`) are **confirmed verbatim**; DiscoPOP Eval should drop from B+ → B; AFlow Eval from B → B−.

---

## 0) What survived scrutiny

| User claim | Primary-source status |
|---|---|
| No paper shows \(I(A_0)<I(A_1)<I(A_2)\) under controlled mutation budget | **CONFIRMED** for all 16 |
| No Eval A / Discovery A / RSI ≥ 2 | **CONFIRMED** |
| DGM o1 diagnostic sees private test patch + private-test results | **CONFIRMED** (verbatim §C.3) |
| HGM `attempt_error_resolution` logs “Would attempt…” and skips side effects | **CONFIRMED** (Appendix F) |
| ShinkaEvolve MoE is strongest scientific artifact | **AGREE**, with thin +0.006 mean and HellaSwag/PIQA regressions |
| GEPA / ACE offline / MASS / parts of Shinka are best eval discipline | **AGREE** |
| GPTSwarm MiniCrosswords/HumanEval, AgentSquare, DGM SWE, HGM 8000@500 are weakest | **AGREE** |

---

## 1) Material corrections to the user’s writeup

### 1.1 Must-fix factual / grading errors

| Location | Issue | Correction |
|---|---|---|
| **DiscoPOP Eval B+** | Overstates hygiene | **→ B.** MT-Bench is both selection metric *and* reported; LRML is **not** #1 on MT-Bench (DBAQL 7.978 > … > LRML 7.916); AlpacaEval WR: PADLL 14.07 > AQFL 13.63 > LRML 13.21; CIs overlap. “SOTA” is overclaimed by the paper’s own tables. |
| **AFlow Eval B** | Omits high-variance filter severity | **→ B−.** After 20/80 split (seed 42), blank workflow runs 5× on val and **keeps only high-variance instances** as the search set — model-dependent rewrite of the objective. |
| **Self-Developing “mean/broadcast merge”** | Slightly imprecise naming | Best GSM8K algorithm is iterative **hybrid mean + elementwise product** with `keepdim=True` broadcasting (`α=0.5`), not a named “broadcast merge.” Still unusual; still under-ablated. |
| **HGM name** | Audit says “HGM” | Full name is **Huxley–Gödel Machine** (arXiv:2510.21614), not “Hierarchical.” |
| **MASS arXiv** | Implicit | Confirmable ID: **2502.02533** (*Multi-Agent Design: Optimizing Agents with Better Prompts and Topologies*). |
| **ACE Discovery C+** | Mildly generous | Lean **C**: AppWorld playbooks contain concrete paths/APIs (`/home/[username]/bills/`, Venmo, city dirs) — closer to compiled task cheatsheets than abstract principles. |
| **DGM staging 50 vs 60** | User said 10→60→200 | Paper §4.2: “expanded set of **50** tasks” then “**60**-task subset” then “**200** tasks (140 plus the previous 60)” if **>40%** and **top two**. Appendix E.2 lists 10 + 50 = 60 (35 Django / 25 Sphinx). **User’s substantive protocol is correct; paper is internally inconsistent on 50 vs 60.** |

### 1.2 Important omissions the audit should add

1. **GEPA “35× fewer rollouts”** is IFBench-specific: optimal prompt found at **678** rollouts vs GRPO **24 000** (≈35.4×). Aggregate GEPA budget ≈ **3936** → ≈6×, not 35×. Abstract “up to 20%” vs body “up to 19%” (HotpotQA 62.33−43.33).
2. **GEPA+Merge IFBench regression:** Merge can **hurt** (IFBench 28.23 vs baseline 36.90 on Qwen table) — undercuts “merge always helps.”
3. **PromptBreeder few-shot GSM8K (83.5) < zero-shot (83.9)** — contexts can dominate; “SOLUTION” is better read as a **control token** than a reasoning discovery.
4. **GPTSwarm GAIA** is a **manual** swarm demonstration, not graph-optimized discovery — do not cite as automated algorithm discovery.
5. **ADAS ARC** is Public Training Easy, grids **≤5×5**, val 20 / test 60 — any “ARC SOTA” claim without this caveat is false.
6. **MaAS / AFlow / MASS MATH** share or echo the **617 level-5** subset protocol — cross-paper MATH comparisons are not full-MATH.
7. **DGM Polyglot executor** never sees private tests; the leak is the **o1 diagnostic channel on SWE**, not the Polyglot executor. Conflating them is a common error.
8. **HGM CMP estimator used online** is clade-pooled pass rate \(\widehat{\mathrm{CMP}}=n^C_s/(n^C_s+n^C_f)\); post-hoc “empirical CMP” for correlation analysis is **max descendant score excluding root** — these are different objects. Neither equals \(I(A)=\mathbb{E}[Q(\mathrm{child})-Q(\mathrm{parent})]\) under matched mutation budget.
9. **ShinkaEvolve MoE transfer keeps \(N_E=64\), \(K=8\)** — architectural transfer is **not** tested.
10. **DiscoPOP Eq. (4) sign typo** vs Eq. (5)/Table 1 — use the \(\,(1-\sigma)\,f_{\mathrm{dpo}}+\sigma\,f_{\mathrm{exp}}\) form.

### 1.3 Grades that stay (after pedantic review)

| Paper | Eval | Discovery | RSI | Notes |
|---|---|---|---|---|
| PromptBreeder | B− | C | 1 | Pressure toward C+ Eval if weighting missing seeds + borrowed OPRO |
| GPTSwarm | D | C | 0 | |
| STOP | B (toys) | C+ | 1 | Pedantic Discovery → C for textbook rediscovery |
| DiscoPOP | **B** | B− | 0 | **downgraded Eval** |
| ADAS | B− | C | 0 | |
| AFlow | **B−** | C | 0 | **downgraded Eval** |
| AgentSquare | D | C− | 0 | |
| Gödel Agent | C− | C− | 1 | Main: 4o improver / 3.5 executor asymmetry |
| Self-Developing | B− | C+ | 0 | |
| MaAS | B− | C | 0 | |
| GEPA | B+ main | C+ | 0 | Peripheral KernelBench/adversarial weaker |
| ACE | B+ offline / C online | C | 0 | Discovery lean C |
| MASS | B | C | 0 | ± = 3 inference runs, not search |
| ShinkaEvolve | B+ hetero | B MoE / C harness | 0 | |
| DGM | D | C / C− | 1 | |
| HGM | C+ | B search / C−→D artifact | 1 | No-op resolver is Discovery D for that artifact |

---

## 2) Reproducible protocols (run-level detail)

Below: enough to reconstruct the *experimental design*, not every hyperparameter file. Citations are arXiv IDs.

### 2.1 PromptBreeder (2309.16797)
- **Pop:** 50; **gens:** ~20–40 (1–2k fitness evals); fitness = accuracy on **random batch of 100 train** examples.
- **Mutations:** 9 operators / 5 classes; crossover 10%; context shuffle 10%.
- **Model:** PaLM 2-L; inducer/eval T=0.0; redescriber T≈1–2.
- **Split:** Asterisked arithmetic sets randomly halved (seed **not** stated); GSM8K etc. use provided splits.
- **Final:** Fittest over whole run → once on test. **Outer seeds: missing.**

### 2.2 GEPA (2507.19457)
- **Splits (App. E.1):** Hotpot/HoVer 150/300/300; IFBench 150/300/294; AIME train/val from 2022–24 (90) equal split, test AIME-2025 ×5; LiveBench-Math n=368 seed 0 thirds.
- **Alg:** minibatch b=3; \(D_{pareto}\) = validation; accept on minibatch then score on full val; final = best avg on \(D_{pareto}\).
- **Budget:** ≈ MIPROv2 ±10%; IFBench can stop early at 678.
- **Models:** Qwen3-8B or GPT-4.1 Mini; reflection LM separately.
- **Outer seeds: missing.**

### 2.3 ACE (2510.04618)
- **Offline:** train → frozen playbook → original test.
- **Online:** sequential on **shuffled test**: predict, then update from outcome (prequential).
- **Roles:** Generator / Reflector / Curator; Reflector ≤5 rounds; offline ≤5 epochs; batch 1.
- **Model:** DeepSeek-V3.1 (non-thinking) all roles.

### 2.4 GPTSwarm (2402.16823v3)
- **MiniCrosswords:** same **20** puzzles optimize+eval; 10 iters × 20 graphs; 3 runs.
- **HumanEval:** node prompts updated from stream; evaluate **entire** benchmark each iter; 3 runs.
- **MMLU collab:** 5 training seeds; +2.1±1.1 — **only clean outer-loop signal.**

### 2.5 ADAS (2408.08435)
- ARC Easy ≤5×5: val 20 / test 60; GPQA 32/166; others 128/800.
- Meta gpt-4o; agents gpt-3.5-turbo; 25–30 iters; **1 search trajectory / domain.**

### 2.6 AFlow (2410.10762)
- 20% val / 80% test seed **42** → high-variance filter on val → MCTS N=20, k=3, 5 evals/candidate.
- Operators: Generate, Format, Review, Revise, Ensemble, Test, Programmer, Custom.
- Optimizer Claude-3.5-Sonnet; main exec GPT-4o-mini.

### 2.7 AgentSquare (2410.06153)
- 16 seeds → 1050 combos; evolution + recombination; LLM predictor skips candidates using experience pool.
- **No documented frozen final-test partition.**

### 2.8 MaAS (2502.04180)
- Train:test **1:4**; MATH 119/486 from 617 lvl-5; controller samples query-dependent path through fixed operators (CoT, Debate, SC, Refine, Ensemble, Test, ReAct, Early-exit).

### 2.9 MASS (2502.02533)
- Small subsets (e.g. MATH 60/100); Stage1 block APO → Stage2 topology (10 candidates × 3 val) → Stage3 workflow APO → test mean±SD over **3 inference runs**.

### 2.10 STOP (2310.02304)
- LPN 10-bit; meta-utility on M=20 train copies; test M=50; **5** full STOP runs; gpt-4-0314 improver.

### 2.11 Gödel Agent (2410.04444 / ACL 2025)
- Val optimize ≤30 iters × 6 cycles; GPQA 32/166; others 128/800; **gpt-4o** self-mod, **gpt-3.5** report executor.

### 2.12 DGM (2505.22954v3)
- 80 iters; k=2 parallel SWE; Claude 3.5 Sonnet (New) implement; **o1 diagnose**.
- Staging SWE: 10 → ~60 → if >40% & top-2 → 200. Tasks: **35 Django + 25 Sphinx** on 60-set.
- **Diagnostic prompt includes private test patch + official private-test results.**

### 2.13 HGM (2510.21614)
- Compare: SWE-Verified-60, 800 evals; scale: **8000 evals on all 500 Verified** (53.2%→61.4%).
- Lite: 300 tasks, **93** overlap → **207** filtered; GPT-5-mini: 34.8→40.1 vs SWE-agent 39.6.
- CMP online = clade pooled accuracy; Thompson sampling for expand/eval.

### 2.14 DiscoPOP (2406.08414)
- ~100 GPT-4-proposed losses; select on MT-Bench; hold out AlpacaEval / TL;DR / IMDb.
- Train: zephyr-7b-gemma-sft + Argilla DPO Mix 7K; β=0.05; 2 epochs.

### 2.15 Self-Developing (2410.15639)
- 3×3000 proposals; ~100–300 executable/iter; dev GSM8K 100 / MATH 600; test 1220 / 4400; top-15 by dev → test.
- Always merge onto fixed M₀; factory DPO-updated (not recursive model RSI).

### 2.16 ShinkaEvolve (2509.19349)
- Circle: 150 gens, 3 runs in appendix; AIME: all 30 AIME-2024 × 75 gens × 3 evals → transfer 2023/2025.
- ALE: 10 tasks, public fitness 50 gens → private report.
- MoE: 556M/82M active, 64 experts K=8, ~2B tokens, 30 iters → transfer 2.7B/404M, ~30B tokens, same 64/8.

---

## 3) Artifact deep dives (exact objects)

### 3.1 DGM private-test exposure (decisive Eval D)

From §C.3 diagnosis prompt (verbatim structure):

```text
# Private Test Patch
SWE-bench’s official private tests to detect whether the issue is solved.
This is not available to the agent during evaluation.
----- Private Test Patch Start -----
{test_patch}
----- Private Test Patch End -----

# Issue Test Results
The test results from SWE-bench using the above official private tests.
----- Issue Test Results Start -----
{eval_log}
----- Issue Test Results End -----
```

Authors: “While the private test patch is included in the diagnosis prompt… manual inspection… no… hardcoding.”  
**Pedantic ruling:** Exposure of private evaluator internals to the outer-loop proposer is **level-4 contamination** regardless of hardcoding absence. Transfer to Polyglot / other models softens but does not erase the SWE loop contamination.

### 3.2 HGM `attempt_error_resolution` (decisive artifact D)

Appendix F (exact behavior):

```text
resolution_messages.append(f"Would attempt to install Python module: {module}")
# In practice, we would run: pip install {module}
# But we'll skip actual installation to avoid side effects

resolution_messages.append(f"Would attempt to fix syntax error in {file_path}...")
# This is just a demonstration of what could be done

return True, "Automated resolution attempted:\n" + ...
```

**Ruling:** Returns success while performing **no repair**. Citing this as multi-step self-improvement evidence is a **category error**.

### 3.3 ShinkaEvolve MoE LBL (strongest discovery)

\[
s(P_\ell)=0.5+\Bigl(1-\frac{H(P_\ell)}{\log N_E}\Bigr),\quad
\tau=\frac{0.064}{N_E}
\]

\[
L_{\mathrm{LBL}}=
\underbrace{N_E\cdot\frac{1}{L}\sum_{\ell}\sum_i f_{\ell,i}P_{\ell,i}}_{\text{global-batch}}
+
\underbrace{\frac{0.1}{L}\sum_{\ell}s(P_\ell)\sum_i\max(0,\tau-f_{\ell,i})}_{\text{entropy-scaled hinge}}
\]

Mean downstream @ λ=0.01: **0.362 → 0.368**. HellaSwag −0.012, PIQA −0.004; Winogrande +0.025, OpenBookQA +0.022. **No multi-seed pretrain; no hinge/entropy ablations; N_E/K fixed at transfer.**

### 3.4 DiscoPOP LRML

\[
f_{\mathrm{lrml}}(\beta\rho)=(1-\sigma(\beta\rho/\tau))\,f_{\mathrm{dpo}}(\beta\rho)+\sigma(\beta\rho/\tau)\,f_{\mathrm{exp}}(\beta\rho)
\]

Branded for nonconvex transition / gradient at ρ=0, **not** for dominating held-out tables.

### 3.5 STOP rediscoveries
Beam search, genetic search, SA, top-k, ε-greedy, adaptive temperature, early stop, caching, UCB — textbook. Safety negatives (unsandbox, utility bugs → >1000% accuracy) are scientifically first-class.

### 3.6 Workflow “discoveries” (ADAS/AFlow/MaAS/MASS/Shinka AIME)
Almost entirely: SC / debate / critique / ensemble / test-gen / early-exit / role specialization. Operator libraries and seed prompts already encode these. Grade C is correct; do not upgrade without causal single-component ablations + compute-matched fixed harnesses.

---

## 4) Contamination spectrum (refined)

| Level | Meaning | Examples |
|---|---|---|
| 1 Clean final | Final never queried | GEPA main test; ACE offline; AFlow test split; MASS test |
| 2 Adaptive val | Val scores drive search; final hidden | GEPA \(D_{pareto}\); ADAS val archive; MASS all stages |
| 3 Same population | Opt and report share tasks | GPTSwarm MiniCrosswords/HumanEval; HGM 8000@500 Verified; Shinka AIME-2024 search |
| 4 Evaluator internals | Private tests/patches/results enter optimizer | **DGM o1 diagnosis** |

---

## 5) What would change the user’s revised verdict

The user’s closing boxed claims remain correct:

1. Automated search can improve prompts/workflows/code — **supported**.
2. Automated search can sometimes produce interesting technical artifacts — **supported** (Shinka MoE; weaker DiscoPOP/Self-Developing).
3. Recursive improvement of improvement ability — **unsupported**.

**Only grade board deltas required:** DiscoPOP Eval B+→**B**; AFlow Eval B→**B−**; ACE Discovery C+→**C**; HGM showcased error-resolution artifact → **D**; optionally STOP Discovery C+→**C**.

**Fastest experiments still missing (unchanged priorities):**
1. Controlled early/mid/late descendant-quality \(I(A)\) test.
2. ≥5–10 independent outer-loop seeds with median/IQR.
3. DGM/HGM with **no** private-test return path.
4. Compute-matched fixed harness Pareto (calls/tokens/$).
5. Strong-root initialization (modern coding agent, not crippled shell).
6. MoE multi-seed + hinge/entropy ablations + varied \(N_E,K\).

---

## 6) Source index

| Paper | Venue | ID |
|---|---|---|
| PromptBreeder | ICML 2024 | 2309.16797 |
| GPTSwarm | ICML 2024 | 2402.16823 |
| STOP | COLM 2024 | 2310.02304 |
| DiscoPOP | NeurIPS 2024 | 2406.08414 |
| ADAS | ICLR 2025 | 2408.08435 |
| AFlow | ICLR 2025 | 2410.10762 |
| AgentSquare | ICLR 2025 | 2410.06153 |
| Gödel Agent | ACL 2025 | 2410.04444 |
| Self-Developing | NAACL 2025 | 2410.15639 |
| MaAS | ICML 2025 | 2502.04180 |
| MASS | ICLR 2026 | 2502.02533 |
| GEPA | ICLR 2026 | 2507.19457 |
| ACE | ICLR 2026 | 2510.04618 |
| ShinkaEvolve | ICLR 2026 | 2509.19349 |
| DGM | ICLR 2026 | 2505.22954 |
| HGM | ICLR 2026 Oral | 2510.21614 |
