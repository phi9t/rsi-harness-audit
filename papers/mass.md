# MASS

**Venue:** ICLR 2026  
**arXiv:** 2502.02533 (confirmed: *Multi-Agent Design: Optimizing Agents with Better Prompts and Topologies*)  
**Preprint:** https://arxiv.org/abs/2502.02533  
**HTML:** https://arxiv.org/html/2502.02533  
**Google research page:** https://research.google/pubs/multi-agent-design-optimizing-agents-with-better-prompts-and-topologies/  
**Code:** none published. Confirmed: arXiv HTML has **zero** `github.com` links. Hugging Face API has no `githubRepo`. Google research page and the first author’s publication page list ICLR, not a repo.

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Staged block prompts → topology → workflow prompts, val then held-out test | 2 | **B−** | B− | C | 0 | Validation then held-out test. Subsets are small (MATH 60/100). ± is three test runs of one topology. Staging vs ADAS/AFlow/debate is a searcher comparison. Topologies are how many aggregate/debate/reflect/execute blocks. |

## What they claim

Staged block prompts, then topology, then workflow prompts. Gemini 1.5 Pro average **78.79** vs ADAS **69.72** and multi-agent debate **70.26**. Flash average 74.30.

## Eval B−

Distinct val/test subsets, randomly sampled “to save computation resources” (App. B, Table 2): MATH 60/100, DROP 60/200, HotpotQA/MuSiQue/2WikiMQA 50/100, MBPP 60/200, HumanEval 50/100, LiveCodeBench test-output-prediction 100/200. Ten topologies via rejection sampling, each scored three times on val. Final test mean±SD over **three executions of the chosen workflow**. Inference cost roughly matched across methods (Table 7). One architecture search, not rerun.

Level 2: Algorithm 1 runs all three stages on validation \(\mathcal{D}\), then reports held-out test. **Why B− not B.** Two misses: tiny subsets, and ± that is not search. The rubric’s MASS example is this row: “MASS ± is three test executions of one chosen topology.” **Why not C.** The test split is real and they say what the SD is over, which most papers do not.

AFlow* in Table 1 uses Claude 3.5 Sonnet as optimizer and Gemini 1.5 Pro as executor; the paper flags that comparison as “not completely fair.” That is a reading caveat, not a letter change.

## Search method B−

Three-stage design vs optimizing prompts or topology alone, and vs ADAS / AFlow / debate, with comparable inference cost. That is a searcher comparison. Missing: full-benchmark reruns, search seeds. B− with MaAS, above AFlow’s C, because AFlow’s control is weaker and AFlow’s val is rewritten.

Plug-in prompt optimizer is MIPRO (instructions + up to 3 bootstrapped demos, 10 instruction candidates, 10 rounds). Topology stage: influence \(I_{a_i}=\mathcal{E}(a_i^*)/\mathcal{E}(a_0^*)\), softmax with temperature 0.05, rejection sampling of 10 candidates under an agent-count budget.

## Evolved object C

MATH winner: aggregate 9, reflect 0, debate 0. Multi-hop: debate counts (HotpotQA `{0,5,0,1}` = five aggregators plus one debate round). Coding: execute + reflect (MBPP `{1,4,0,1}`). Fixed block vocabulary {Summarize, Aggregate, Reflect, Debate, Executor} and a fixed construction order `[summarize, reflect, debate, aggregate]`. “How much and where” to apply known operators. Library ceiling: max C.

## RSI 0

Frozen outer searcher (MASS + MIPRO). Prompts and topologies change. The searcher does not.

## Control flow (from published code)

No official code. Grade from the preprint only.

Paper loop (Algorithm 1): (1) MIPRO-optimize a single predictor on val, then each minimum building block conditioned on that predictor; store per-block influence. (2) Softmax those influences, rejection-sample 10 valid topologies under budget \(B\), assemble each in the fixed block order with Stage-1 prompts, score each three times on val, keep the argmax. (3) Joint MIPRO over the whole winning workflow on val. Report mean±SD of three *test* executions of that one system. Same Gemini 1.5 backbone as evaluator and optimizer in the main tables (`gemini-1.5-{pro,flash}-002`). Claude 3.5 Sonnet and Mistral Nemo are extra backbone checks, not extra searches.

## Reconstructable protocol

Three stages on validation: block prompts, then 10 rejection-sampled topologies, then joint workflow prompts. MIPRO (10 instruction candidates, 10 rounds, up to 3 demos). Report three test executions of the chosen system.

## Train/test audit

Distinct val/test subsets (MATH 60/100: one test item = 1 point). See 2. ± is answer noise, not \(\operatorname{Var}_s[Q(\operatorname{Search}(s))]\). One architecture search.

## Artifact audit

Taxonomy 2: {Summarize, Aggregate, Reflect, Debate, Executor} in a fixed construction order. MATH winner is aggregate-heavy (`{9,0,0}`-style), not a new operator.

## Precise verdict

Supported: staging helps inside a human operator list, with a real held-out test. Not established: a new agent algorithm, full MATH, or search uncertainty.

## Cite as / do not cite as

**Cite as.** Stronger engineering study than ADAS. Staging helps inside a human operator list. Held-out test exists.

**Do not cite as.** A new agent algorithm. Full MATH. Search uncertainty (the ± is answer noise). Official public code.
