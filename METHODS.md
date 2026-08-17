# Engineering ranking (captured 17 August 2026)

This file is a captured engineering ranking / build recommendation for the 16-paper cohort. It is **not** a re-grade. Official letters live in [`GRADE_BOARD.md`](GRADE_BOARD.md). Evidence audit lives in [`REPORT.md`](REPORT.md). Where a ranking here disagrees with a board letter, the board still wins on Eval/Search/Object/RSI; this file ranks primitives for a cost-aware harness flywheel.

| Live object | File |
|---|---|
| Scoring rules | [`RUBRICS.md`](RUBRICS.md) |
| Official letters | [`GRADE_BOARD.md`](GRADE_BOARD.md) |
| Per-paper evidence | [`papers/`](papers/) |
| Evidence audit | [`REPORT.md`](REPORT.md) |

---

# 0) Core thesis (5–8 bullets)
* **The weak evaluation evidence does not imply that the methods are worthless.** It means we should discount the reported capability gains while separately asking whether each paper contributes a useful search primitive, state representation, budget-allocation policy, or mutation operator. The prior audit’s evidence grades still stand; this answer ranks the underlying engineering ideas instead. 
* For a frontier-model harness, the most valuable methods are not the most “recursive-looking.” The highest immediate-value primitives are:
  1. **GEPA:** trace-conditioned local optimization;
  2. **ACE:** structured cumulative experience;
  3. **MaAS:** query-conditioned compute routing and early exit.
* For longer-horizon automated R&D, the most valuable methods are:
  1. **ShinkaEvolve:** open-ended executable artifact search;
  2. **HGM:** allocation of evaluation budget across candidate lineages;
  3. **STOP:** improvement of the mutation/search operator itself;
  4. **DiscoPOP:** empirical search over training objectives.
* Stronger foundation models alter the economics. They make code mutation, reflection, and failure diagnosis more reliable, but they also reduce the headroom available from rediscovering basic agent patterns such as retries, majority vote, debate, and partial file viewing. Therefore, **free-form proposal quality improves while unconditional multi-agent orchestration becomes less compelling**.
* Token cost should be divided into:
  [
  \text{offline search cost}
  \quad+\quad
  \text{per-request deployed cost}.
  ]
  Offline methods such as GEPA or ShinkaEvolve can be expensive once and then deploy a cheap prompt or deterministic artifact. Methods that permanently add five to twenty model calls per request—many ADAS, GPTSwarm, MASS, and DGM descendants—must clear a much higher quality bar.
* The papers should not be implemented as competing monolithic systems. Their strongest components compose naturally:
  [
  \boxed{
  \text{ACE memory}
  +
  \text{GEPA local optimization}
  +
  \text{MaAS routing}
  +
  \text{MASS/AFlow topology search}
  +
  \text{ShinkaEvolve archive}
  +
  \text{HGM evaluation scheduling}
  }
  ]
  with STOP/DGM-style self-modification restricted to a bounded, sandboxed mutation layer.
* My recommended first build is therefore **not an RSI system**. It is a cost-aware harness improvement flywheel that collects traces, maintains structured experience, locally optimizes components, routes difficult queries to more compute, periodically searches architecture/code variants, and distills expensive discoveries back into a cheap serving policy.
---
# 1) Mental model & prerequisites (minimal)
## 1.1 Separate the artifact from the search method
Let a harness be:
[
H =
\left(
P,,
C,,
R,,
T,,
M,,
V
\right),
]
where:
* (P): prompts and instructions;
* (C): control flow and decomposition;
* (R): routing and resource allocation;
* (T): tools and tool-use policy;
* (M): memory and persistent experience;
* (V): verification and acceptance policy.
Most papers implement some form of:
[
h_{t+1}
\sim
G(h_t,\mathcal A_t,\tau_t,f_t),
]
where:
* (G): proposer or mutation operator;
* (\mathcal A_t): candidate archive;
* (\tau_t): execution traces;
* (f_t): evaluator feedback.
The candidate is evaluated:
[
y_{t+1}
=======
E(h_{t+1};D),
]
and an archive or incumbent-selection rule updates the search state:
[
\mathcal A_{t+1}
================
S(\mathcal A_t,h_{t+1},y_{t+1}).
]
The papers differ mostly in:
1. what (h) can contain;
2. how (G) proposes mutations;
3. how much of (\tau) is visible;
4. how (S) allocates future evaluations;
5. whether the resulting artifact remains expensive at deployment.
## 1.2 Practical cost model
For an optimizer evaluating (N) candidates:
[
C_{\text{search}}
=================
\sum_{i=1}^{N}
\left[
C_{\text{propose},i}
+
C_{\text{evaluate},i}
+
C_{\text{reflect},i}
\right].
]
For a candidate evaluated on (m_i) tasks:
[
C_{\text{evaluate},i}
=====================
\sum_{j=1}^{m_i}
\left(
C_{\text{model},ij}
+
C_{\text{tool},ij}
+
C_{\text{judge},ij}
\right).
]
Deployed cost is different:
[
C_{\text{serve}}(h)
===================
\mathbb E_x
\left[
\sum_{k=1}^{N_{\text{calls}}(x,h)}
C_{\text{call},k}
\right].
]
Amortized over (V) future tasks:
[
C_{\text{amortized}}(h)
=======================
\frac{C_{\text{search}}(h)}{V}
+
C_{\text{serve}}(h).
]
This makes a costly offline search attractive when:
* the resulting artifact is reused many times;
* it adds little deployment cost;
* the optimized behavior transfers beyond the search distribution.
It makes an expensive ensemble unattractive when every future request pays the full cost again.
## 1.3 Ranking criteria
The rankings below are engineering judgments, not measurements reported by the papers.
### Immediate frontier-harness ranking
I weight:
* 30% expected quality leverage on a strong model;
* 25% deployed token and latency efficiency;
* 20% offline search sample efficiency;
* 15% implementation burden;
* 10% evaluator robustness.
### Longer-horizon R&D ranking
I weight:
* 30% search-space expressivity;
* 25% probability of producing an amortizable artifact;
* 20% sample efficiency;
* 15% benefit from stronger proposer models;
* 10% controllability and evaluator integrity.
## 1.4 Relative budget classes
These are order-of-magnitude categories, not exact paper totals:
| Class  | Typical regime                                                              |
| ------ | --------------------------------------------------------------------------- |
| **L**  | Tens to a few hundred metric calls; no model training                       |
| **M**  | Hundreds to a few thousand complete task rollouts                           |
| **H**  | Thousands of long agent rollouts or multi-agent executions                  |
| **VH** | Repeated model training, large coding benchmarks, or very long trajectories |
A method can have **VH offline cost and near-zero deployed overhead**—for example, discovering a loss function—or moderate offline cost and permanently high serving cost—such as a seven-agent debate workflow.
---
# 1.5) RSI method (what to measure, what to build, what to refuse)
This section is a build method, not a re-grade. The letters in GRADE_BOARD.md stay put. I am ranking what to measure, what to put in the mutation sandbox, and what to refuse when someone asks whether a flywheel is doing recursive self-improvement.
## Definition
Hold out a hidden task distribution. Ordinary capability is held-out task success:
[
Q(H)
====
\mathbb E_{x\sim\mathcal D_{\text{hidden}}}
\left[r(H,x)\right].
]
Child quality, under a frozen proposer budget (B), frozen tools, and a hidden evaluator that does not dump debug traces back to the proposer, is:
[
I(H)
====
\mathbb E_{H'\sim G(H;B)}
\left[
Q(H')-Q(H)
\right].
]
Iterative optimization is (Q) rising: a better incumbent on the task. RSI is (I) rising: later systems are better at producing the *next* system. After that there is a handoff in which (H_{\text{late}}), not a fixed external optimizer, runs the next cycle.
If (Q) moves and (I) does not, the search found a better artifact. It did not become a better searcher.
## What the literature actually supplies
Four papers look self-referential. None of them, as published, measures (I(H)):
* **PromptBreeder** mutates mutation prompts ((M')). That is a second prompt in the same genetic loop. Fitness remains training-batch task score.
* **STOP** treats the improver as a candidate, (I(I)). Generated improvers reconstruct known search patterns. The reported object is still a better program under (Q).
* **DGM** lets the parent act as mutator and keeps a branching archive. Promotion is descendant *task* success on the coding benchmark.
* **HGM** schedules expansion versus evaluation using clade metaproductivity (CMP) estimated from descendant *task* success.
These are search heuristics over (Q). They become RSI evidence only if the early / mid / late child-distribution experiment is actually run.
## The method to implement (minimum)
Snapshot three incumbents from the same flywheel:
[
H_0,\quad H_{\text{mid}},\quad H_{\text{late}}.
]
Give each the same protocol:
* the same 100 hidden failure traces;
* the same (K) children;
* the same models, tools, and token envelope;
* a hidden evaluator with no debug dump to the proposer.
Report:
[
\mathbb E[\Delta Q],
\quad
P(\Delta Q>0),
\quad
\max_{j\le K}\Delta Q_j,
]
plus child validity and cost per positive child.
A positive RSI result requires the **whole child-quality distribution** to shift, not only the best child. A higher best-of-(K) with an unchanged mean is still ordinary search luck.
## Bounded mutation layer
When we do allow self-edit, it is STOP / DGM / Gödel-style patching of a **typed search-controller / policy IR** only. Immutable:
* hidden tests;
* model registry;
* budgets;
* sandbox;
* accounting;
* acceptance;
* audit.
No silent stronger-model substitution. Use the Gödel retain notes: propose a minimal patch, unit-test, shadow, canary, retain or roll back.
## Where it sits in the flywheel
Last. The stack is:
[
\boxed{
\text{GEPA}
\rightarrow
\text{ACE}
\rightarrow
\text{MaAS}
\rightarrow
\text{MASS/AFlow}
\rightarrow
\text{ShinkaEvolve + HGM}
\rightarrow
\text{bounded STOP/DGM}
\rightarrow
I(H)\ \text{experiment}
}
]
Do not ship an “RSI system” first. Local trace-conditioned optimization, structured memory, routing, topology search, and open-ended artifact search have to be working before self-edit is interesting, and the (I(H)) experiment has to be working before anyone is allowed to claim RSI.
## Refusal
I will not treat any of the following as RSI:
* a higher SWE-bench score;
* a deeper lineage tree;
* self-editing source;
* retrospective CMP correlation with later task success.
Those can all happen while (I) is flat. Task score is not ability to improve.
---
# 2) Mechanism (the heart of it)
## 2.1 Rankings
### Ranking A: immediate frontier-harness value
|   Rank | Method              | Primitive worth retaining                            | Search cost                 | Deployed cost               | Evidence confidence                  |
| -----: | ------------------- | ---------------------------------------------------- | --------------------------- | --------------------------- | ------------------------------------ |
|  **1** | **GEPA**            | Trace-conditioned local optimizer                    | M                           | Minimal                     | Medium-high                          |
|  **2** | **ACE**             | Structured cumulative playbook                       | M, continuous               | Low–medium context overhead | Medium                               |
|  **3** | **MaAS**            | Query-conditioned routing and early exit             | H initially                 | Low–variable                | Medium-low                           |
|  **4** | **ShinkaEvolve**    | Open-ended executable program evolution              | H–VH                        | Often minimal               | Medium                               |
|  **5** | **HGM**             | Evaluation-budget allocation over lineages           | Meta-layer over H/VH search | None                        | Medium-low                           |
|  **6** | **MASS**            | Local-to-global prompt/topology optimization         | H                           | Medium–high                 | Medium                               |
|  **7** | **AFlow**           | MCTS-guided workflow refinement                      | H                           | Medium–high                 | Medium                               |
|  **8** | **ADAS**            | Arbitrary agent-program proposal and archive         | M–H                         | Often high                  | Medium-low                           |
|  **9** | **AgentSquare**     | Typed modular IR plus surrogate predictor            | H                           | Variable                    | Low                                  |
| **10** | **PromptBreeder**   | Population diversity and mutable mutation prompts    | H metric evaluations        | Minimal                     | Medium                               |
| **11** | **STOP**            | Improvement of the improver/search policy            | Highly task-dependent       | Indirect                    | Medium on toy tasks                  |
| **12** | **DGM**             | Parent-as-mutator and branching lineage              | VH                          | Medium–high                 | Low                                  |
| **13** | **GPTSwarm**        | Graph sparsification and communication-edge learning | H–VH                        | High                        | Low                                  |
| **14** | **Gödel Agent**     | Bounded self-patching                                | H                           | Variable/unbounded          | Low                                  |
| **15** | **DiscoPOP**        | Executable objective discovery                       | VH training                 | None after training         | Medium, but not a harness method     |
| **16** | **Self-Developing** | Learned proposal model over evaluated mutations      | VH                          | Low after merge             | Medium-low, but not a harness method |
### Ranking B: longer-horizon automated R&D value
|   Rank | Method              | Why it moves up or down                                                                           |
| -----: | ------------------- | ------------------------------------------------------------------------------------------------- |
|  **1** | **ShinkaEvolve**    | Broad executable artifact search; expensive search can yield a zero-overhead program or algorithm |
|  **2** | **HGM**             | Directly addresses scarce evaluation allocation, the dominant cost of serious artifact search     |
|  **3** | **STOP**            | Makes the mutation/search procedure itself mutable                                                |
|  **4** | **DiscoPOP**        | Clean pattern for proposing, executing, training, and interpreting new objectives                 |
|  **5** | **GEPA**            | High-information trace-based mutation with relatively few evaluations                             |
|  **6** | **ADAS**            | Turing-complete agent-program search, useful as a broad proposal generator                        |
|  **7** | **DGM**             | Self-referential lineage mechanism, despite weak published validation                             |
|  **8** | **Self-Developing** | Learns a better proposal distribution from accepted/rejected executable artifacts                 |
|  **9** | **Gödel Agent**     | Dynamic self-patching is powerful if constrained and externally validated                         |
| **10** | **MASS**            | Useful structured architecture search, but bounded by supplied blocks                             |
| **11** | **AFlow**           | Good local workflow search; less open-ended than program evolution                                |
| **12** | **ACE**             | Excellent experience substrate, but not itself a scientific-discovery optimizer                   |
| **13** | **MaAS**            | Valuable resource policy rather than a discovery engine                                           |
| **14** | **PromptBreeder**   | Useful mutation diversity, but mainly operates over prompt-local behavior                         |
| **15** | **AgentSquare**     | Useful representation; low current novelty ceiling                                                |
| **16** | **GPTSwarm**        | High-variance graph optimization with costly deployed multi-agent structures                      |
---
## 2.2 GEPA — retain the trace-conditioned local optimizer
### Mechanism
GEPA treats prompts, code, configurations, or other textual artifacts as candidates. One iteration approximately does:
1. select a candidate from a Pareto frontier;
2. execute it on a minibatch;
3. retain full traces, errors, profiler output, and other actionable feedback;
4. ask a reflection model to explain why the candidate failed;
5. propose a targeted mutation;
6. retain the candidate if it improves aggregate or per-example performance;
7. optionally merge candidates that are strong on complementary subsets.
Its critical insight is that an evaluator should return **Actionable Side Information**, not merely a scalar score:
[
E(h,x)
\rightarrow
\left(
r,,
\tau,,
\text{errors},,
\text{failure class}
\right).
]
The current implementation exposes budgets such as 100–500 metric calls, with common examples using approximately 100–150. ([GitHub][1])
### What to retain
Keep nearly the entire local-optimization loop:
* full-trace reflection;
* targeted rather than blind mutation;
* per-example Pareto selection;
* merging complementary candidates;
* explicit metric-call budgets.
This is more useful than pure prompt evolution whenever we have rich execution traces.
### Frontier-model translation
Use the frontier model selectively as the **reflection/mutation model**, not necessarily as every candidate executor. A strong model reads a small number of difficult traces and proposes one high-information edit. The target harness remains fixed during each comparison.
Optimize components independently at first:
* tool descriptions;
* planner instructions;
* retry policy;
* verifier instructions;
* context-compaction prompt;
* handoff summaries;
* memory-retrieval policy.
Do not allow one GEPA candidate to simultaneously rewrite the entire harness until component-level gains are understood.
### Budget verdict
GEPA is the best first method because:
* offline budget is bounded;
* it needs hundreds rather than thousands of evaluations in its intended regime;
* deployment usually adds only a longer prompt or small configuration change;
* candidate changes remain inspectable.
The primary risks are adaptive validation overfit and prompt bloat.
---
## 2.3 ACE — retain structured cumulative experience, not an ever-growing prompt
### Mechanism
ACE represents experience as a playbook that is incrementally updated by three roles:
1. **Generator:** solves tasks using the current playbook.
2. **Reflector:** identifies reusable lessons from successes and failures.
3. **Curator:** merges, deduplicates, reorganizes, and preserves useful entries.
The design specifically avoids repeatedly rewriting the complete context, which can erase details. Instead, it applies incremental updates to a structured memory. ACE supports both offline adaptation and online/prequential updating. ([arXiv][2])
### What to retain
The valuable primitive is:
[
(\text{state},\text{intervention},\text{outcome})
\rightarrow
\text{typed reusable lesson}.
]
A production playbook should store more than prose:
```text
lesson_id
scope
trigger
recommended_action
counterexample
source_trajectory_ids
helpful_count
harmful_count
confidence
model_version
created_at
expires_at
```
This converts ACE from “large system prompt accumulation” into an auditable memory system.
### Frontier-model translation
A frontier model can extract higher-quality lessons, but we should not prepend the entire playbook to every request. Use:
* task-family scoping;
* semantic and symbolic retrieval;
* maximum retrieved-token budget;
* confidence thresholds;
* expiry and revalidation;
* contradictory-lesson detection;
* model-version conditioning.
A lesson learned by one model/harness version may become unnecessary or harmful after a model upgrade.
### Budget verdict
Adaptation cost is roughly proportional to the number of episodes reflected upon:
[
C_{\text{ACE update}}
\approx
N_{\text{episodes}}
\left(
C_{\text{reflect}}
+
C_{\text{curate}}
\right).
]
Batch reflection over clusters of similar failures is preferable to reflecting on every episode. Deployed cost is governed by retrieved memory size, not total memory size.
ACE ranks second because it can continuously capture organizational learning, but without retrieval and lifecycle controls it becomes a context-token tax.
---
## 2.4 MaAS — retain conditional compute and early exit
### Mechanism
MaAS defines an agentic supernet containing operators such as:
* direct generation;
* Chain-of-Thought;
* debate;
* self-consistency;
* self-refinement;
* execution/testing;
* ReAct/tool use;
* aggregation;
* early exit.
A controller conditioned on the current query samples a path through this supernet. The controller is optimized using sampled architectures, reward/cost feedback, and textual gradients over operator prompts. The paper explicitly includes an early-exit mechanism and a cost constraint. ([arXiv][3])
### What to retain
The core principle is:
[
\text{test-time compute}
========================
f(\text{query difficulty},\text{risk},\text{uncertainty}),
]
not a constant workflow.
A strong harness should have at least three routes:
```text
Route 0: direct response / simple tool call
Route 1: normal planning + execution
Route 2: verifier, additional search, or multi-agent escalation
```
The static seven-agent workflow should be an exceptional route, not the default.
### Frontier-model translation
Use the least expensive reliable router available:
1. deterministic task features;
2. initial-model confidence or entropy;
3. first-step plan classification;
4. small routing model;
5. separate frontier-model routing call only as a last resort.
A standalone routing call can consume much of the savings. Ideally, the first executor call emits both:
* an initial response or plan;
* a route/escalation decision.
### Budget verdict
If route probabilities are (p_k) and route costs are (C_k):
[
C_{\text{average}}
==================
C_{\text{route}}
+
\sum_k p_k C_k.
]
A practical target might be:
* 80% direct/normal path at one call-equivalent;
* 18% tool/verifier path at approximately three;
* 2% expensive path at approximately eight.
Ignoring a separate router call, this gives:
[
0.80(1)+0.18(3)+0.02(8)=1.50
]
call-equivalents per request, rather than running the expensive path universally.
MaAS is third because **controlling average deployed compute** is more important at frontier scale than squeezing another point from an unconditional ensemble.
---
## 2.5 ShinkaEvolve — retain open-ended executable artifact search
### Mechanism
ShinkaEvolve maintains an archive of executable programs and introduces several search controls:
* elite preservation;
* island subpopulations;
* primary parent plus high-performing and random inspirations;
* rank- or novelty-weighted parent sampling;
* several proposal models, temperatures, and reasoning budgets;
* novelty rejection using code embeddings and optional model judgment;
* evaluator feedback attached to candidates;
* bandit-style adaptation of model-selection policies;
* accumulated meta-level scratchpad or search knowledge.
Candidate programs are executed and evaluated; successful and diverse artifacts remain available as stepping stones. The released implementation supports asynchronous local or cluster execution. ([arXiv][4])
### What to retain
This is the best general substrate for:
* context-compaction algorithms;
* scheduling policies;
* verifier code;
* tool-selection policies;
* kernel code;
* data filters;
* training losses;
* memory eviction;
* model-routing logic.
Its key strength is that the output can be a deterministic artifact:
[
\text{expensive search}
\rightarrow
\text{cheap program deployed repeatedly}.
]
### Frontier-model translation
Use the frontier model for proposal generation only after deterministic gates:
```text
parse/lint
→ unit tests
→ static safety checks
→ tiny benchmark
→ search validation
→ hidden validation
→ transfer evaluation
```
Do not spend a frontier-model evaluation budget on code that fails syntax, type, or unit checks.
Use several proposer configurations:
* one high-capability model for architectural mutations;
* cheaper models for local patches;
* high-temperature exploration;
* low-temperature repair;
* model diversity for search diversity.
### Budget verdict
ShinkaEvolve can consume hundreds or thousands of candidates. It becomes economical only with multi-fidelity promotion.
For example:
```text
500 proposed programs
  350 pass syntax/static checks
  150 pass unit tests
   40 pass cheap benchmark
   10 reach hidden validation
    2 reach full expensive evaluation
```
It ranks fourth for immediate harness work because the search infrastructure is heavier than GEPA/ACE/MaAS, but it is first for automated R&D because its output can be an amortizable technical artifact.
---
## 2.6 HGM — retain evaluation scheduling and metaproductivity
### Mechanism
HGM treats self-improvement as a tree search in which the controller chooses between:
* **expanding** a candidate into descendants;
* **evaluating** an existing node on additional tasks.
It estimates clade metaproductivity from descendant outcomes and uses Thompson-sampling-like policies to allocate expansion and evaluation effort. A UCB-style rule controls growth of the number of active lineages, and evaluation can be asynchronous. ([arXiv][5])
A simplified empirical estimator is:
[
\widehat{\operatorname{CMP}}(a)
===============================
\frac{
n_{\text{successful descendants}}(a)
}{
n_{\text{successful descendants}}(a)
+
n_{\text{failed descendants}}(a)
}.
]
### What to retain
The central insight is correct:
> A candidate that is not currently best may be the most productive ancestor.
For expensive search, we need to distinguish:
* current score;
* uncertainty in current score;
* probability of yielding a useful child;
* novelty of its lineage;
* cost of another evaluation;
* cost of another mutation.
This is more valuable than always mutating the current leaderboard champion.
### Frontier-model translation
Use HGM as a scheduler around ShinkaEvolve, ADAS, or a bounded DGM:
```text
candidate tree
   ├── cheap evaluations
   ├── mutation requests
   ├── promoted evaluations
   └── hidden transfer tests
```
The metaproductivity estimator should be upgraded. Raw descendant success is confounded by how much budget the scheduler already gave the clade. Prefer a hierarchical Bayesian model conditioned on:
* task family;
* proposer model;
* mutation type;
* parent quality;
* evaluation budget;
* lineage depth.
### Budget verdict
HGM is not a standalone optimizer. Its value is reducing wasted evaluator calls in another expensive search. It has effectively no deployed token cost.
It ranks fifth immediately because one must first have a candidate-search system worth scheduling, but it ranks second for R&D because **evaluation—not proposal generation—usually becomes the limiting resource**.
---
## 2.7 MASS — retain staged local-to-global optimization
### Mechanism
MASS decomposes multi-agent design into:
1. local/block prompt optimization;
2. workflow-topology optimization;
3. global/workflow prompt optimization.
Each stage is conditioned on the artifact produced by the previous stage. This is a form of hierarchical coordinate descent over prompts and structure rather than simultaneous free-form search. ([arXiv][6])
### What to retain
The staging is valuable:
[
\text{component behavior}
\rightarrow
\text{topology}
\rightarrow
\text{joint refinement}.
]
Optimizing topology before individual components are competent produces misleading structural conclusions. Optimizing every prompt jointly from the beginning creates an enormous combinatorial space.
### Frontier-model translation
Use MASS on a typed set of production-relevant blocks:
* plan;
* retrieve;
* execute;
* inspect;
* verify;
* recover;
* summarize;
* escalate;
* terminate.
Do not start with abstract roles such as “debater 1” and “debater 2.” Define blocks by concrete state transformations and tool permissions.
After offline topology search, replace the static topology with a MaAS-style conditional router. The result should be:
[
\text{searched topology library}
+
\text{query-conditioned route selection},
]
not one high-cost topology applied universally.
### Budget verdict
MASS reduces search complexity relative to fully joint search, but selected workflows can remain expensive at deployment. It is best for periodic offline architecture experiments, not continuous per-episode adaptation.
---
## 2.8 AFlow — retain MCTS-guided local workflow refinement
### Mechanism
AFlow represents a workflow as executable code connecting LLM operators. It uses Monte Carlo Tree Search to:
* select a current workflow;
* propose a code modification;
* execute the modified workflow;
* receive benchmark feedback;
* record tree-structured experience;
* continue exploring or exploiting descendants.
The paper’s search vocabulary includes generation, formatting, review/revision, ensembling, testing, and programming operators. ([arXiv][7])
### What to retain
AFlow is attractive when we already have a reasonable root workflow and want **progressive local improvement**.
MCTS gives a useful balance between:
* deepening a promising workflow lineage;
* returning to alternative branches;
* using prior candidate outcomes to guide future mutations.
It is more controlled than asking a meta-agent to generate an unrelated complete system every iteration.
### Frontier-model translation
Use progressive widening:
1. begin with changes to one component;
2. add structural mutations only after local possibilities saturate;
3. bound maximum calls, context, and tools in the workflow IR;
4. select candidates on a quality–cost Pareto frontier.
Use difficult or high-information search examples, but retain an untouched, task-family-held-out final set.
### Budget verdict
MCTS still requires complete workflow rollouts. It is suitable for tens to low hundreds of candidates, not unconstrained thousands of frontier-model agent episodes.
AFlow ranks below MASS because MASS’s staged decomposition is easier to budget and reason about, but AFlow is preferable when the search problem is highly sequential and local mutations have meaningful ancestry.
---
## 2.9 ADAS — retain arbitrary program proposals and stepping-stone archives
### Mechanism
ADAS’s Meta Agent Search gives a meta-agent:
* a benchmark/task description;
* an archive of previous agent programs and scores;
* instructions to propose a new agent idea;
* the ability to write a new `forward` implementation;
* reflection and runtime-error repair opportunities.
Valid candidates are evaluated and appended to the archive. The search space is effectively arbitrary agent code, rather than a fixed workflow graph. ([arXiv][8])
### What to retain
Two ideas are valuable:
1. **Agent code as the search object.**
2. **An archive of prior programs as search context.**
A frontier model should be better than the paper’s models at reading previous implementations, diagnosing weaknesses, and writing valid candidate code.
### Frontier-model translation
Do not expose an unrestricted Python program immediately. Use a typed harness IR with an escape hatch:
```text
PromptPolicy
ContextPolicy
ToolPolicy
RetryPolicy
VerificationPolicy
MemoryPolicy
RoutingPolicy
CustomCodeExtension
```
The meta-agent can first edit structured components. `CustomCodeExtension` is promoted only after passing stronger security and correctness gates.
Require every mutation to state:
* observed failure;
* hypothesized mechanism;
* predicted task flips;
* expected cost impact;
* regression risks.
### Budget verdict
ADAS candidate generation is not necessarily the expensive part. The generated agents often make many model calls at evaluation and deployment.
Use ADAS as a **broad proposal generator**, then evaluate and compress candidates through the rest of the stack. Do not deploy the first high-scoring 20-call ensemble unchanged.
---
## 2.10 AgentSquare — retain the modular IR and surrogate predictor
### Mechanism
AgentSquare decomposes agents into modules associated with:
* planning;
* reasoning;
* tool use;
* memory.
It recombines modules evolutionarily, allows models to generate module variants, and uses a performance predictor to avoid executing every proposed combination. ([arXiv][9])
### What to retain
The useful contributions are not the specific discovered modules. They are:
1. a typed modular design space;
2. recombination at module boundaries;
3. a surrogate model that predicts candidate quality before expensive execution.
A surrogate is increasingly important once a complete coding-agent evaluation can consume minutes and tens of thousands of tokens.
### Frontier-model translation
Replace the coarse paper taxonomy with execution-level interfaces:
```text
TaskAnalyzer
StateRetriever
Planner
ActionSelector
ToolExecutor
ObservationCompressor
FailureDiagnoser
Verifier
RecoveryPolicy
TerminationPolicy
```
The predictor should estimate a vector:
[
\hat y(h,x)
===========
\left(
\hat q,,
\hat c,,
\hat l,,
\hat p_{\text{failure}},,
\hat p_{\text{safety violation}}
\right),
]
not only task score.
Train it from actual candidate traces and periodically recalibrate on promoted candidates.
### Budget verdict
A good surrogate can eliminate much wasted search, but a poor predictor can prematurely suppress novel candidates. Preserve an exploration quota for candidates with high uncertainty or novelty.
AgentSquare ranks ninth because the representation and predictor are useful, while its published module discoveries are comparatively weak.
---
## 2.11 PromptBreeder — retain mutable mutation operators and diversity
### Mechanism
PromptBreeder evolves units containing task prompts and corresponding mutation prompts. A binary tournament genetic algorithm selects winners, while nine mutation operators across several classes modify either:
* the task prompt;
* the mutation prompt;
* both through crossover, distributional mutation, or hypermutation.
Fitness is measured on random batches of training examples. Formally:
[
P'
==
\operatorname{LLM}(M+P),
]
and mutation prompts can themselves be changed:
[
M'
==
\operatorname{LLM}(H+M).
]
This makes the mechanism weakly self-referential at the prompt-mutation level. ([arXiv][10])
### What to retain
The most useful ideas are:
* maintain a portfolio of mutation strategies;
* mutate the mutator, not only the candidate;
* preserve population diversity;
* occasionally make zero-order or large mutations to escape local optima.
### Frontier-model translation
PromptBreeder is preferable to GEPA when:
* the evaluator is opaque;
* traces are unavailable;
* only a scalar metric can be returned;
* prompts are short and cheap to evaluate.
When rich traces exist, GEPA should usually dominate because it makes causal, failure-specific edits rather than blind population mutations.
A hybrid is attractive:
* GEPA supplies targeted mutations;
* PromptBreeder supplies mutation diversity and occasional resets;
* HGM or Pareto selection allocates evaluations.
### Budget verdict
Serving overhead is effectively zero once a prompt is selected. Search can be expensive because fitness evaluation multiplies:
[
\text{population}
\times
\text{generations}
\times
\text{examples per fitness estimate}.
]
It ranks tenth because its strongest primitives are better absorbed into a trace-aware optimizer than deployed as an independent system.
---
## 2.12 STOP — retain recursive optimization of the search operator
### Mechanism
STOP represents an improver as code. The improver accepts:
* a candidate program;
* a utility function;
* access to an LLM;
* an evaluation budget.
It generates and evaluates candidate improvements. The central self-reference is:
[
I_{t+1}
=======
I_t(I_t),
]
where the improver receives its own source as the candidate to improve.
Generated improvers reconstruct search patterns such as beam search, genetic search, simulated annealing, caching, adaptive temperature, and bandit-like allocation. ([arXiv][11])
### What to retain
STOP points at the correct next object to optimize:
> not merely the harness candidate, but the procedure that proposes and evaluates candidates.
Applied to our stack, STOP should optimize:
* number of candidates;
* mutation-temperature schedule;
* parent-selection policy;
* caching;
* stopping conditions;
* failure-cluster sampling;
* promotion thresholds;
* allocation among proposer models.
### Frontier-model translation
Do not recursively expose the complete production harness. Give the improver a bounded search-controller module with:
* immutable evaluator;
* immutable resource ceilings;
* typed configuration;
* deterministic unit tests;
* no ability to change model identity or permissions.
### Budget verdict
STOP’s cost can grow multiplicatively:
[
C
\approx
N_{\text{recursive rounds}}
\times
N_{\text{candidate improvers}}
\times
N_{\text{utility evaluations}}.
]
It is therefore useful only when utility evaluations are cheap, cached, or highly parallel.
It ranks eleventh for immediate harness work because its value is second-order, but third for R&D because improving the search operator is a genuine path toward compounding research productivity.
---
## 2.13 DGM — retain branching lineages and parent-as-mutator
### Mechanism
DGM maintains an archive of coding agents. A selected parent participates in modifying its own implementation, producing a descendant that is empirically evaluated and retained as another node in the archive. Branching allows apparently weaker candidates to remain as future stepping stones. ([arXiv][12])
### What to retain
Despite the weak published evaluation, three structural ideas are worth retaining:
1. **The candidate can act as its own mutation executor.**
2. **Improvement should form a branching lineage, not a single greedy chain.**
3. **Previously rejected or weaker branches may contain reusable components.**
### Frontier-model translation
Start from a strong incumbent harness. Do not reproduce the paper’s deliberately minimal root.
Mutable components should initially be limited to:
* context policy;
* tool wrappers;
* retry and recovery policy;
* verifier;
* summarization;
* router;
* search-controller configuration.
Keep immutable:
* evaluator;
* hidden tests;
* model registry;
* budgets;
* sandbox;
* audit logger;
* acceptance policy.
Use GEPA-style actionable traces for mutation evidence, ShinkaEvolve-style novelty controls, and HGM-style evaluation scheduling.
### Budget verdict
A full coding-agent benchmark is an extremely expensive inner-loop evaluator. Candidate cost includes:
* long model trajectories;
* repository setup;
* test execution;
* possible retries;
* reviewer calls;
* repeated evaluation for noise reduction.
DGM ranks low immediately because stronger frontier coding models already possess many of the basic behaviors its descendants rediscovered, reducing expected headroom while preserving the high search cost.
---
## 2.14 GPTSwarm — retain graph pruning, not an always-on swarm
### Mechanism
GPTSwarm represents an agent system as a directed graph of model/tool nodes. Edges are parameterized and sampled, and REINFORCE-like updates optimize edge probabilities using downstream reward. It also includes node-level prompt or demonstration optimization. ([arXiv][13])
### What to retain
The useful primitive is **communication-edge optimization**:
* which nodes need to communicate;
* which critic should see which candidate;
* which branches are redundant;
* whether an edge can be removed without hurting performance.
This is more compelling as graph sparsification than as unrestricted multi-agent architecture search.
### Frontier-model translation
Begin with a small known graph—perhaps:
```text
solver
  ├── tool executor
  └── verifier
```
Then optimize:
* whether verification is invoked;
* which observations reach the verifier;
* whether a second solver is justified;
* where feedback is returned.
Use logged contextual-bandit or off-policy methods where possible. High-variance REINFORCE over a large graph wastes frontier-model rollouts.
### Budget verdict
Search requires many sampled graph executions. Deployed cost remains proportional to the number of active nodes. Unless graph optimization aggressively prunes the system, it creates permanent token and latency overhead.
This is why GPTSwarm ranks below MaAS: MaAS asks **which path this query needs**, while GPTSwarm’s basic formulation tends toward optimizing a generally active communication graph.
---
## 2.15 Gödel Agent — retain bounded patching and rollback
### Mechanism
Gödel Agent allows an agent to modify or monkey-patch its own logic during iterative improvement. The self-modification target is more flexible than a fixed workflow graph. ([ACL Anthology][14])
### What to retain
The useful idea is not unrestricted live self-modification. It is a controlled patch lifecycle:
```text
observe failure
→ propose minimal patch
→ run unit tests
→ shadow evaluation
→ canary
→ retain or roll back
```
A dynamic patch can repair a narrow harness defect much faster than a full architecture-search cycle.
### Frontier-model translation
Use:
* designated patch points;
* feature flags;
* immutable signatures;
* versioned state migrations;
* restricted dependencies;
* automatic rollback;
* model/resource registry frozen outside the candidate.
Never permit “improvement” by silently switching to a stronger model or increasing budget.
### Budget verdict
Unrestricted self-patching makes search and serving cost unpredictable. A patch may introduce more model calls, new tools, or persistent state. It ranks low because the same local improvement can usually be obtained more safely through GEPA or typed code evolution.
---
## 2.16 DiscoPOP — retain empirical executable objective search
### Mechanism
DiscoPOP asks a model to generate executable training-loss code. Candidates are:
1. parsed and tested;
2. used to train models;
3. scored on a development evaluator;
4. returned as candidate-plus-result context;
5. refined over subsequent rounds.
The selected preference loss blends logistic/DPO-like and exponential-style behavior. It transferred across some evaluation settings, although it was not the best entry in every held-out table. ([arXiv][15])
### What to retain
The key pattern is:
[
\text{hypothesis}
\rightarrow
\text{executable artifact}
\rightarrow
\text{empirical training}
\rightarrow
\text{mechanistic interpretation}.
]
This is far more valuable for foundation-model R&D than another prompt-only workflow search.
### Frontier-model translation
Use a multi-fidelity ladder:
```text
100–300 generated loss programs
→ unit/gradient tests
→ 20–40 tiny-model runs
→ 5–10 medium runs
→ 2–3 large-scale candidates
→ multi-seed frontier validation
```
The proposer should receive more than final accuracy:
* gradient norms;
* Hessian or curvature summaries;
* reward margins;
* KL behavior;
* mode collapse indicators;
* training-instability events;
* per-domain evaluation changes.
### Budget verdict
LLM token cost is negligible compared with training candidate models. DiscoPOP ranks low for immediate harness work only because it is a model-training method. It ranks fourth for R&D because a successful loss has no inference-time overhead and can affect every future model execution.
---
## 2.17 Self-Developing — retain learning a better proposal distribution
### Mechanism
Self-Developing generates executable model-merging algorithms, evaluates the merged models, labels high-scoring algorithms as preferred and low-scoring algorithms as rejected, and trains the algorithm-generating model from those preferences. The next round therefore samples from a proposal model shaped by empirical artifact outcomes. ([ACL Anthology][16])
### What to retain
The valuable idea is:
[
\text{search history}
\rightarrow
\text{training data for the mutator}.
]
Most search systems repeatedly call a generic model with larger prompts. Self-Developing instead amortizes search experience into a specialized proposal model.
This can be transferred directly to harness evolution:
* accepted versus rejected prompt patches;
* useful versus invalid tool-policy changes;
* code mutations that passed versus failed hidden validation;
* accurate versus inaccurate failure diagnoses.
### Frontier-model translation
Maintain a mutation dataset:
```text
parent artifact
failure evidence
proposed patch
validation result
cost delta
regression classes
human/automated review
```
Train a smaller mutator or adapter to propose high-validity patches. Keep a frontier model for unusual or high-level architectural mutations.
### Budget verdict
For full model merging, candidate evaluation entails enormous weight I/O, model loading, and benchmark execution. As a proposal-learning method for small harness patches, however, it becomes much cheaper.
It ranks eighth for R&D because proposal-model amortization is strategically useful, even though the paper’s merging artifacts are not yet compelling enough to copy directly.
---
# 3) Performance model (roofline-ish, but practical)
## 3.1 Two-dimensional optimization: search cost and deployed cost
A candidate should be scored on:
[
U(h)
====
## Q_{\text{heldout}}(h)
## \lambda_s C_{\text{search}}(h)
## \lambda_i C_{\text{serve}}(h)
## \lambda_l L(h)
\lambda_r R(h),
]
where:
* (Q_{\text{heldout}}): hidden quality;
* (C_{\text{search}}): one-time optimization cost;
* (C_{\text{serve}}): recurring token/tool cost;
* (L): latency;
* (R): regression/safety risk.
The optimizer should preserve a Pareto frontier rather than collapsing these immediately into one scalar:
[
\mathcal P
==========
\operatorname{ParetoFront}
\left(
Q,,
-C_{\text{search}},,
-C_{\text{serve}},,
-L,,
-R
\right).
]
## 3.2 Illustrative token arithmetic
Assume an agent evaluation episode averages:
* 30,000 input tokens;
* 3,000 output tokens;
* 90 seconds wall time.
These are illustrative assumptions, not universal paper measurements.
### GEPA-scale local optimization
For 150 metric calls:
[
150\times33{,}000
=================
4.95\text{ million task tokens},
]
plus reflection tokens.
Wall time:
[
150\times90\text{ s}
====================
3.75\text{ h serial}.
]
With 20-way parallelism, the idealized lower bound is around 11 minutes, although repository tools and rate limits will increase it.
### Workflow architecture search
For:
* 100 workflow candidates;
* 25 search tasks;
* two repeats;
we get:
[
100\times25\times2
==================
5{,}000\text{ episodes}.
]
At 33K tokens per episode:
[
165\text{ million tokens}.
]
At 90 seconds each:
[
125\text{ serial hours}.
]
This is why ADAS/AFlow/MASS-style searches should not directly use the most expensive frontier model for every candidate and task.
### Coding-agent evolution
Coding episodes may be much longer than the 33K-token illustration. A few thousand full repository episodes can quickly reach hundreds of millions of tokens plus container and test costs.
The dominant optimization should therefore be:
[
\text{reduce evaluator calls},
]
not merely reduce proposal tokens.
## 3.3 Serving overhead
### Static ensemble
A seven-call solver–critic–synthesizer workflow can multiply:
* output-token generation;
* latency stages;
* context copied into critic calls;
* failure surface.
Prefix caching may lower billed input cost, but it does not eliminate output generation or sequential latency.
### ACE memory
If the playbook contributes (B) tokens per request over (V) requests:
[
T_{\text{memory}}
=================
VB.
]
For (B=6{,}000) and (V=100{,}000):
[
600\text{ million additional input tokens}.
]
This makes retrieval and prompt caching central to ACE economics.
### MaAS routing
Expected serving cost is:
[
C_{\text{expected}}
===================
C_{\text{router}}
+
p_0C_{\text{direct}}
+
p_1C_{\text{agent}}
+
p_2C_{\text{expensive}}.
]
The route policy should be optimized against an explicit quality–cost curve, not accuracy alone.
## 3.4 Multi-fidelity promotion
For every expensive search family, use:
[
\text{static checks}
\rightarrow
\text{tiny evaluator}
\rightarrow
\text{search set}
\rightarrow
\text{selection set}
\rightarrow
\text{hidden final}
\rightarrow
\text{transfer}.
]
An example promotion schedule:
| Stage               | Candidate fraction | Feedback returned                      |
| ------------------- | -----------------: | -------------------------------------- |
| Parse/type/safety   |               100% | Exact errors                           |
| Unit tests          |             60–80% | Full traces                            |
| Small search subset |             20–40% | Per-task outcomes                      |
| Selection set       |              5–10% | Aggregate score only                   |
| Hidden final        |     1–2 candidates | Final result                           |
| Transfer            |     Finalists only | Repository/model/domain generalization |
This is where HGM’s scheduling and AgentSquare’s surrogate predictor become useful.
## 3.5 What frontier models change
### Proposal validity improves
A stronger proposer should produce:
* fewer syntax errors;
* better failure diagnosis;
* more coherent cross-file changes;
* more plausible causal hypotheses.
This favors ShinkaEvolve, GEPA, STOP, and bounded DGM.
### Basic harness headroom shrinks
A stronger executor may already compensate for:
* weak prompts;
* missing retry instructions;
* poor decomposition;
* small tool-description defects.
This reduces expected marginal gains from PromptBreeder, DGM’s basic tool rediscoveries, and generic debate structures.
### Unconditional call multiplication becomes more costly
The more capable the model, the less attractive it is to call it seven times on every easy request. This favors MaAS-style routing over static MASS/ADAS/GPTSwarm workflows.
### Evaluator gaming becomes easier
A stronger model is more capable of finding:
* test leakage;
* benchmark loopholes;
* timing artifacts;
* weak judge policies;
* cost-accounting gaps.
Evaluator isolation must therefore strengthen with model capability.
## 3.6 Required instrumentation
At search time:
* candidates proposed;
* executable-candidate rate;
* metric calls;
* input/output tokens;
* tool and test wall time;
* promotion rate at each stage;
* lineage depth and branching factor;
* hidden-set queries;
* validation overfit gap;
* novelty/redundancy;
* cost per accepted improvement.
At deployment:
* calls per request;
* input/output tokens;
* cache hit rate;
* memory tokens retrieved;
* route distribution;
* verifier escalation rate;
* latency percentiles;
* tool failures;
* quality by route;
* cost per successful task.
For RSI-relevant claims:
* child validity rate by parent generation;
* mean child improvement;
* best-of-(K) child improvement;
* probability of generating a positive child;
* cost per positive child;
* transfer of mutation ability to unseen failure classes.
---
# 4) Comparison lens (not a literature survey)
## GEPA versus PromptBreeder
| Axis         | GEPA                                | PromptBreeder                             |
| ------------ | ----------------------------------- | ----------------------------------------- |
| Feedback     | Full traces and failure diagnostics | Primarily scalar fitness                  |
| Mutation     | Targeted reflection                 | Population mutation                       |
| Evaluations  | Usually fewer, higher-information   | Usually more, lower-information           |
| Best regime  | Observable agent pipeline           | Opaque black-box prompt metric            |
| What to keep | Default local optimizer             | Diversity, mutator evolution, large jumps |
**Decision:** use GEPA by default; borrow PromptBreeder’s mutation portfolio when GEPA converges prematurely.
## ACE versus GEPA
| Axis          | ACE                          | GEPA                                |
| ------------- | ---------------------------- | ----------------------------------- |
| Object        | Accumulated playbook/memory  | One or more textual/code parameters |
| Time scale    | Continuous across episodes   | Periodic optimization campaign      |
| Primary value | Preserve experience          | Improve a component                 |
| Main risk     | Context growth/stale lessons | Validation overfit/prompt bloat     |
**Decision:** ACE stores what the system has learned; GEPA periodically converts that evidence into better prompts and policies.
## MaAS versus MASS/AFlow
| Axis         | MaAS                       | MASS/AFlow                     |
| ------------ | -------------------------- | ------------------------------ |
| Decision     | Which path for this query? | What workflow should exist?    |
| Runtime      | Conditional                | Commonly static                |
| Main benefit | Average cost control       | Discover better topology       |
| Main risk    | Router errors              | Permanent multi-agent overhead |
**Decision:** use MASS/AFlow offline to discover a small library of useful workflows; use MaAS online to choose among them.
## ShinkaEvolve versus ADAS
| Axis            | ShinkaEvolve                            | ADAS                                 |
| --------------- | --------------------------------------- | ------------------------------------ |
| Search          | Archive/islands/novelty/model portfolio | Meta-agent writes new agent programs |
| Artifact target | General executable programs             | Agent programs                       |
| Search control  | More explicit diversity and scheduling  | Simpler archive iteration            |
| Best role       | Global technical artifact search        | Broad agent-design proposals         |
**Decision:** ShinkaEvolve is the stronger general substrate. ADAS-style meta-prompts can serve as one mutation generator inside it.
## HGM versus DGM
| Axis              | HGM                              | DGM                                     |
| ----------------- | -------------------------------- | --------------------------------------- |
| Main contribution | Which lineage to expand/evaluate | Let candidate agents modify descendants |
| Cost focus        | Evaluation allocation            | Open-ended candidate generation         |
| Deployment cost   | None                             | Depends on evolved agent                |
| Best role         | Scheduler                        | Mutation mechanism                      |
**Decision:** use DGM-like parent-as-mutator semantics under an HGM-like budget allocator, not DGM’s original evaluation protocol.
## STOP versus Gödel Agent
| Axis             | STOP                                  | Gödel Agent                          |
| ---------------- | ------------------------------------- | ------------------------------------ |
| Mutation target  | Improvement/search procedure          | Running agent logic                  |
| Evaluator regime | Best with cheap deterministic utility | Often complex task benchmark         |
| Control          | Source-level but bounded experiment   | Potentially open-ended live patching |
| Best role        | Improve search policy                 | Narrow emergency/local patches       |
**Decision:** STOP is the stronger research primitive. Gödel-style patching should be limited to typed patch points with rollback.
## DiscoPOP versus Self-Developing
| Axis           | DiscoPOP                | Self-Developing                        |
| -------------- | ----------------------- | -------------------------------------- |
| Artifact       | Training objective      | Model-merging program                  |
| Feedback loop  | Generate–train–evaluate | Generate–merge–evaluate–train proposer |
| Strongest idea | Scientific code search  | Amortize search into a proposal model  |
| Dominant cost  | Candidate training      | Weight I/O and model evaluation        |
**Decision:** use DiscoPOP’s multi-fidelity artifact-validation pipeline and Self-Developing’s proposal-model training together.
---
# 5) Implementation translation (how we’d build it)
## 5.1 Target architecture
```text
                         ┌──────────────────────────┐
Task / episode ─────────▶│  MaAS-style cost router │
                         └─────────────┬────────────┘
                                       │
                ┌──────────────────────┼─────────────────────┐
                ▼                      ▼                     ▼
          Direct / cheap        Normal tool agent      Verify / ensemble
                │                      │                     │
                └──────────────────────┴─────────────────────┘
                                       │
                                       ▼
                              Immutable trace store
                                       │
                    ┌──────────────────┼─────────────────┐
                    ▼                  ▼                 ▼
              ACE playbook      Failure clustering   Cost/quality data
                    │                  │                 │
                    └──────────────┬───┴─────────────────┘
                                   ▼
                      GEPA local component optimizer
                                   │
                     candidate prompts/policies/tools
                                   │
                                   ▼
                    MASS/AFlow topology experiments
                                   │
                                   ▼
              ShinkaEvolve program/archive search
                         ▲                   │
                         │                   ▼
                  HGM scheduler       hidden evaluation
                         │
                         ▼
            bounded STOP/DGM mutation-operator search
```
## 5.2 Immutable control plane
Keep these outside the mutable harness:
```text
hidden test registry
task-family partitions
model and tool registry
permission system
sandbox
resource accounting
candidate lineage log
acceptance policy
final evaluation service
audit trail
```
The optimizer may read public traces. It may not modify or inspect the hidden evaluator.
## 5.3 Typed harness IR
Start with:
```python
@dataclass(frozen=True)
class HarnessCandidate:
    context_policy: ContextPolicy
    memory_policy: MemoryPolicy
    planner_policy: PlannerPolicy
    tool_policy: ToolPolicy
    retry_policy: RetryPolicy
    verifier_policy: VerifierPolicy
    routing_policy: RoutingPolicy
    termination_policy: TerminationPolicy
    parent_ids: tuple[str, ...]
    budget: BudgetEnvelope
    mutation_manifest: MutationManifest
```
A mutation manifest should contain:
```yaml
evidence:
  - "9/20 failures edit before locating all call sites"
hypothesis:
  - "insufficient dependency inspection causes incomplete patches"
change:
  - "require call-site search before first write"
predicted_task_flips:
  - task_007
  - task_014
expected_cost_delta:
  model_calls: 0
  tool_calls: +2
  input_tokens: +1200
regression_risks:
  - "slower on trivial one-file tasks"
falsification:
  - "reject if dependency failures decline by less than 25%"
```
## 5.4 Proposed budget schedule
These are proposed starting budgets, not values claimed by the papers.
### Online serving
* Avoid a separate routing model call where possible.
* Target average compute:
  [
  \le 1.5\times
  ]
  the normal single-path agent.
* Retrieve no more than approximately 2–4K playbook tokens initially.
* Escalate fewer than 5% of requests to expensive multi-agent workflows.
* Record route-specific success and cost.
### Nightly local optimization
Per component:
* 100–300 GEPA metric calls;
* 20–50 representative search tasks;
* 20% held-out selection tasks;
* no final-test access;
* cluster ACE reflections in batches of 50–200 episodes.
### Weekly topology search
* 50–150 MASS/AFlow candidate workflows;
* evaluate all candidates on a small search subset;
* promote approximately 10–20% to selection;
* keep a quality–cost Pareto frontier;
* distill or prune workflows before deployment.
### Monthly/open-ended search
* 100–500 ShinkaEvolve candidates per well-defined problem;
* HGM allocates extra evaluations and expansions;
* fewer than ten candidates reach the full hidden evaluator;
* one or two reach transfer evaluation.
### Model-level artifacts
For a DiscoPOP-style loss or Self-Developing-style merge:
```text
100–300 generated artifacts
→ unit/gradient/static tests
→ 20–40 tiny-model experiments
→ 5–10 medium experiments
→ 2–3 large candidates
→ at least three independent seeds for finalists
```
## 5.5 Distill expensive discoveries
A discovered 10-call workflow should be treated as a teacher, not necessarily the final product.
Collect:
* teacher trajectories;
* routing choices;
* intermediate verifications;
* corrected failures;
* successful tool sequences.
Then compress into:
* a better system prompt;
* ACE playbook entries;
* a small routing model;
* generated skills/tools;
* SFT or preference data;
* a single-model verifier policy.
The operational objective is:
[
\text{search with abundant compute}
\rightarrow
\text{serve with sparse compute}.
]
## 5.6 Runtime substrate
A minimal serial function-calling loop with trajectory persistence and summary-based continuation—such as the attached KISS AI design—would be sufficient for an initial candidate executor. It is not sufficient as the immutable evaluation or security plane: self-modifying candidates need container isolation, path restrictions, frozen evaluators, resource enforcement, and durable lineage records. 
Framework analogies:
* **vLLM/sglang:** batch candidate executions, prefix caching, structured outputs;
* **Ray:** fan out independent candidate/task evaluations;
* **containers or microVMs:** isolate generated code;
* **Git worktrees/content-addressed trees:** store candidate lineage;
* **columnar trace store:** analyze task-level failures and costs.
The search logic itself should remain framework-agnostic.
---
# 6) Experimental validation plan (technology validation, not production)
## 1. GEPA × ACE factorial
**Hypothesis:** ACE supplies accumulated lessons while GEPA converts recurrent failures into better static policies; together they outperform either alone without unbounded context growth.
**Setup**
Four conditions on a strong coding/research harness:
1. fixed baseline;
2. GEPA only;
3. ACE only;
4. ACE + periodic GEPA.
Use repository-family-held-out final tasks. Match deployed call budgets.
**Metrics**
* hidden task success;
* tokens per successful task;
* retrieved memory tokens;
* playbook growth;
* recurring failure rate;
* GEPA metric calls;
* transfer to a newer model version.
**Expected signature**
* ACE reduces repeated failure classes.
* GEPA reduces prompt/policy defects.
* The combination has higher quality than either alone.
* Retrieved context remains bounded rather than growing linearly.
---
## 2. MaAS-style routing frontier
**Hypothesis:** query-conditioned escalation preserves most of the quality of an expensive workflow at a fraction of average token cost.
**Setup**
Define three routes:
* one-pass/direct;
* normal tool agent;
* solver–verifier or multi-agent path.
Train a router on task features, first-step uncertainty, and prior outcomes. Compare against:
* always-cheap;
* always-normal;
* always-expensive.
**Metrics**
* quality versus calls;
* quality versus tokens;
* P50/P95 latency;
* false-negative escalation rate;
* route calibration;
* quality by difficulty decile.
**Expected signature**
The router approaches always-expensive quality while using substantially less average compute. Easy tasks should rarely escalate.
---
## 3. Matched-budget MASS versus AFlow versus ADAS
**Hypothesis:** hierarchical/local search is more sample-efficient than free-form complete-program generation under a fixed evaluator budget.
**Setup**
Give all methods:
* the same typed harness IR;
* the same root harness;
* the same proposer model;
* the same 2,000 metric-call budget;
* the same search/selection split;
* the same call limits per candidate.
**Metrics**
* best hidden score versus metric calls;
* area under the search curve;
* executable-candidate rate;
* novelty;
* deployed call count;
* search-seed variance.
**Expected signature**
* MASS should improve quickly through local-to-global optimization.
* AFlow may dominate later through branch refinement.
* ADAS may generate more diverse but less consistently valid candidates.
---
## 4. ShinkaEvolve with and without HGM scheduling
**Hypothesis:** clade-aware evaluation allocation improves artifact quality per evaluator call.
**Setup**
Choose a deterministic but nontrivial harness component:
* context compactor;
* cache-eviction policy;
* task scheduler;
* verifier-selection policy.
Compare:
* uniform candidate evaluation;
* greedy incumbent search;
* standard evolutionary scheduling;
* HGM-style expand/evaluate scheduling.
Run at least five independent complete searches.
**Metrics**
* final hidden utility;
* evaluator calls to threshold;
* lineage diversity;
* useful-child probability;
* search wall time;
* overpromotion of noisy candidates.
**Expected signature**
HGM reaches a given hidden score using fewer full evaluations and preserves productive non-champion lineages.
---
## 5. Strong-root bounded DGM/STOP experiment
**Hypothesis:** self-modification can find non-obvious improvements after ordinary harness features are already present.
**Setup**
Start from a strong coding harness containing:
* repository search;
* structured patches;
* retries;
* test feedback;
* context compaction;
* candidate verification;
* persistent memory.
Allow mutation only in:
* search-controller configuration;
* context policy;
* retry policy;
* verifier;
* routing.
Compare:
* fixed external mutator;
* parent-as-mutator;
* STOP-improved mutation operator.
**Metrics**
* hidden repository transfer;
* mean child gain;
* best-of-(K) child gain;
* mutation validity;
* cost per accepted child;
* novelty relative to existing harnesses.
**Expected signature**
A positive result requires improvements beyond rediscovering basic tools. If all methods stagnate, the earlier DGM gains were primarily weak-root recovery.
---
## 6. Direct metaproductivity experiment
**Hypothesis:** later generations are genuinely better at producing improved descendants.
**Setup**
Snapshot:
[
H_0,\quad H_{\text{mid}},\quad H_{\text{late}}.
]
Give each:
* the same 100 unseen failure traces;
* the same proposer model and temperature;
* the same (K)-child budget;
* the same hidden evaluator.
Repeat over several independent meta-task sets.
**Metrics**
[
\mathbb E[\Delta Q],
\quad
P(\Delta Q>0),
\quad
\max_{j\le K}\Delta Q_j,
]
plus child validity and cost.
**Expected signature**
The entire child-quality distribution shifts upward with generation. A higher task-solving score without a better child distribution does not support recursive improvement.
---
## 7. Expensive-workflow distillation
**Hypothesis:** most of the gain from a searched multi-agent workflow can be compressed into a cheaper prompt, skill, router, or fine-tuned policy.
**Setup**
Use the best MASS/AFlow/ADAS workflow as a teacher. Generate trajectories on training tasks. Distill into:
1. a GEPA-optimized single-agent prompt;
2. ACE playbook entries;
3. a small router;
4. optional SFT policy.
**Metrics**
* percentage of teacher gain retained;
* serving tokens;
* latency;
* transfer;
* dependence on task family.
**Expected signature**
Retaining 70–90% of the teacher’s gain at a small fraction of its recurring model calls would make architecture search economically worthwhile.
---
## 8. Frontier-model scaling sweep
**Hypothesis:** some harness methods lose marginal value as the base model becomes stronger, while trace-based mutation and artifact search improve.
**Setup**
Run the same roots and budgets with:
* a mid-tier open model;
* a strong open model;
* a frontier model.
Evaluate:
* direct prompting;
* GEPA;
* ACE;
* MaAS;
* static multi-agent workflow;
* bounded code evolution.
**Metrics**
* absolute gain;
* relative error reduction;
* search cost;
* deployed cost;
* accepted mutation type;
* route distribution.
**Expected signature**
* generic debate/retry gains decline with stronger models;
* routing still saves compute;
* trace-conditioned local optimization remains useful;
* code/artifact proposal validity improves.
---
## 9. Evaluator-firewall stress test
**Hypothesis:** meaningful gains survive when the optimizer cannot access private tests or final-task traces.
**Setup**
Compare feedback levels:
1. public trace only;
2. public trace plus failure category;
3. aggregate hidden score;
4. private-test/reference feedback.
Evaluate all selected candidates on a completely separate repository family.
**Metrics**
* held-out gain;
* search efficiency;
* benchmark-specific mutation rate;
* hardcoding;
* transfer;
* reward-hacking incidents.
**Expected signature**
A robust method retains substantial gains under levels 1–2. Gains that exist only under private-test feedback are evaluator adaptation, not general harness improvement.
---
## 10. Multi-fidelity objective discovery
**Hypothesis:** a DiscoPOP/Shinka-style search can discover training objectives whose ordering is preserved from small to larger models.
**Setup**
Generate candidate losses using a frontier proposer. Apply:
* symbolic checks;
* gradient unit tests;
* tiny-model training;
* medium-model validation;
* large-model multi-seed evaluation.
Use HGM/successive-halving allocation.
**Metrics**
* rank correlation across scales;
* training stability;
* downstream macro-average;
* per-domain regressions;
* gradient diagnostics;
* candidate cost;
* independent reproduction.
**Expected signature**
The best small-scale candidates remain enriched among large-scale finalists. If scale rank correlation is near zero, the proxy evaluator is unsuitable.
---
# 7) “What’s missing” checklist
| MISSING item                                            | Why it matters                                                                           | Fastest resolution                                                                                                 |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Current frontier-model cost curves for every method** | Paper-era model and provider costs do not predict present economics                      | Reimplement all candidates behind one accounting wrapper and report tokens, calls, latency, tool time, and dollars |
| **Outer-loop variance**                                 | One successful search says little about method reliability                               | Five complete searches for expensive methods; ten for cheaper methods                                              |
| **Strong-root headroom**                                | Weak roots exaggerate harness-search gains                                               | Initialize from a competent current coding/research harness                                                        |
| **Unified harness IR**                                  | Different methods otherwise search incomparable spaces                                   | Implement typed components and expose the same mutation grammar to GEPA, AFlow, MASS, ADAS, and Shinka             |
| **Strict final-evaluator isolation**                    | Strong models increasingly exploit evaluator defects                                     | Separate hidden evaluator service with one-way aggregate results and immutable task partitions                     |
| **ACE memory-scaling law**                              | Playbook growth can erase quality and cost gains                                         | Sweep memory size, retrieved-token budget, expiry, task scoping, and model upgrades                                |
| **MaAS router calibration**                             | Under-escalation loses quality; over-escalation loses savings                            | Reliability diagrams and quality–cost curves by difficulty decile                                                  |
| **HGM estimator bias correction**                       | Productive clades may merely be over-evaluated clades                                    | Hierarchical Bayesian model controlling for budget, mutation type, and task family                                 |
| **ShinkaEvolve proposer-model ablation**                | Need to know whether frontier proposers improve search efficiency enough to justify cost | Hold evaluator fixed; sweep proposer capability, temperature, and model diversity                                  |
| **Search-space-matched baselines**                      | LLM search is often compared with much smaller human grids                               | Give random, evolutionary, Bayesian, and human-guided methods the same candidate grammar and budget                |
| **Causal artifact replay**                              | High-scoring descendants change many things simultaneously                               | Apply each mutation alone to the parent and remove it alone from the child                                         |
| **Distillation efficiency**                             | High-cost workflows may be useful only as teachers                                       | Measure retained gain versus token reduction after prompt/skill/policy distillation                                |
| **Model-upgrade transfer**                              | Harness lessons may be obsolete for a new model                                          | Evaluate every accepted artifact across at least two model generations                                             |
| **Improvement-productivity metric**                     | Task score is not ability to improve                                                     | Run the controlled early/middle/late child-distribution experiment                                                 |
| **Security boundary for self-editing**                  | Strong candidates will search permissions and evaluator paths                            | Sandbox generated code, freeze registries/budgets, and log every attempted boundary crossing                       |
## Final recommendation
Build the stack in this order:
[
\boxed{
\text{GEPA}
\rightarrow
\text{ACE}
\rightarrow
\text{MaAS}
\rightarrow
\text{MASS/AFlow}
\rightarrow
\text{ShinkaEvolve + HGM}
\rightarrow
\text{bounded STOP/DGM}
}
]
Concretely:
1. **GEPA** gives the fastest local harness improvements with little deployed overhead.
2. **ACE** turns accumulated trajectories into durable organizational knowledge.
3. **MaAS** prevents expensive reasoning paths from becoming the default.
4. **MASS/AFlow** periodically search better workflow structures.
5. **ShinkaEvolve + HGM** support serious open-ended artifact discovery under a constrained evaluation budget.
6. **STOP/DGM-style recursion** should be introduced only after the evaluator, sandbox, lineage store, and direct metaproductivity test are working.
That retains nearly all of the defensible technical value in the literature while discarding the unsupported leap from “automated harness optimization” to “demonstrated recursive self-improvement.”
[1]: https://github.com/gepa-ai/gepa "https://github.com/gepa-ai/gepa"
[2]: https://arxiv.org/abs/2510.04618 "https://arxiv.org/abs/2510.04618"
[3]: https://arxiv.org/html/2502.04180 "https://arxiv.org/html/2502.04180"
[4]: https://arxiv.org/html/2509.19349 "https://arxiv.org/html/2509.19349"
[5]: https://arxiv.org/html/2510.21614 "https://arxiv.org/html/2510.21614"
[6]: https://arxiv.org/abs/2502.02533 "https://arxiv.org/abs/2502.02533"
[7]: https://arxiv.org/abs/2410.10762 "https://arxiv.org/abs/2410.10762"
[8]: https://arxiv.org/html/2408.08435 "https://arxiv.org/html/2408.08435"
[9]: https://arxiv.org/abs/2410.06153 "https://arxiv.org/abs/2410.06153"
[10]: https://arxiv.org/html/2309.16797 "https://arxiv.org/html/2309.16797"
[11]: https://arxiv.org/abs/2310.02304 "https://arxiv.org/abs/2310.02304"
[12]: https://arxiv.org/abs/2505.22954 "https://arxiv.org/abs/2505.22954"
[13]: https://arxiv.org/html/2402.16823 "https://arxiv.org/html/2402.16823"
[14]: https://aclanthology.org/2025.acl-long.1354/ "https://aclanthology.org/2025.acl-long.1354/"
[15]: https://arxiv.org/html/2406.08414 "https://arxiv.org/html/2406.08414"
[16]: https://aclanthology.org/2025.naacl-long.519/ "https://aclanthology.org/2025.naacl-long.519/"
