# AgentSquare

**Venue:** ICLR 2025  
**arXiv:** 2410.06153  
**Preprint:** https://arxiv.org/abs/2410.06153  
**Code:** https://github.com/tsinghua-fib-lab/AgentSquare

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Six environments, modular search | 3? | **D** | C | C− | 0 | No documented frozen final split. Predictor is fed past scores. Final agents recombine named modules (ToT, CoT-SC, DEPS, Voyager). Some prompts keep other environments’ names. |

## What they claim

Modular search over 1,050 combinations, **17.2%** average gain vs best human agents. Environments: WebShop, ALFWorld, ScienceWorld, M3Tool, TravelPlanner, PDDL.

## Eval D

Sixteen seed agents, four module types (planning, reasoning, tool, memory). Evolution plus recombination. An LLM predictor, conditioned on an experience pool of real scores, skips recombination children. Search uses the same env metric that appears in Table 1. `search/agent_search.py` tests on `run_alfworld(..., n=50)` with no leftover split argument. No documented three-way search / selection / frozen-final split. No uncertainty over architecture search.

This is either level 3 or “no documented firewall,” plus a score-fed predictor (2-rewrite). The rubric’s “no documented split → D” binds. A 2-rewrite cap requires that a test split exist; it is not shown. **Why not C.** C needs some transfer or split. Absolute gains vs best human are sometimes about one point.

## Search method C

Predictor-guided modular search is a real idea. It is not compared to exhaustive recombination under the same budget with a frozen test. Controls in the paper are OPRO-style prompt search and hand-crafted agents, not a searcher with a leftover env split.

## Evolved object C−

Final systems pick Tree-of-Thought / self-refine, CoT with self-consistency, tool voting, hierarchical memory, DEPS, Voyager. Recombination table, not a new module. Template leakage: ScienceWorld evolution prompts live in files named `alfworld_prompt_*.py` and still talk about “finding hidden objects, moving objects…” while the body is ScienceWorld (`tasks/sciworld/program_search/alfworld_prompt_reasoning.py`). That is C−, not C.

## RSI 0

Frozen outer searcher. Modules change. The searcher does not.

## Control flow (from published code)

**Parent pick.** Hill-climb: `current_agent` is whoever has the best measured score so far. Start: `{planning: None, reasoning: IO, tooluse: None, memory: None}`.

**Propose.** (1) `evolution()` emits new module code per type, conditioned on archives and the current agent. New modules are real-tested (`test_new_modules`, n=50). (2) `recombination()` proposes new 4-tuples from the candidate pools and `tested_cases`.

**Score.** Evolution children: real env. Recombination children: `predict_performance` first. The predictor prompt includes “The performance of some existing module combinations: {train_data}” where `train_data` is past `(config, performance)` from `alfworld_results.json` / the experience pool (`search/module_predictor.py`). Only the argmax predicted child is real-tested.

**Promote.** If measured score > `current_performance`, replace the incumbent. Repeat 10 iterations. Best-so-far is the headline agent.

**Models.** Predictor: `gpt-4o`. ALFWorld runner default in this search script: `gpt-4o-mini`. Paper tables mix GPT-4-class backbones per env.

Code vs paper: TravelPlanner scripts expose Hugging Face `train`/`validation`/`test` loaders, but the architecture search loop does not freeze a leftover split for module selection. Grade D from the missing firewall, not from those loaders.

## Reconstructable protocol

Four module types (planning, reasoning, tool, memory) from ~16 systems, ~1,050 combinations. Evolution, LLM variants, score-fed predictor. Stop after several non-improving iterations (~8–18).

## Train/test audit

No documented search / selection / frozen-final split. Predictor trains on past scores. Same env metric as Table 1. Eval D.

## Artifact audit

Taxonomy 2 with template leakage: SF-ToT is self-consistency plus refine; ScienceWorld prompts live in `alfworld_prompt_*.py`. Object C−.

## Precise verdict

Supported: a modular search space. Not established: a documented firewall or a causally isolated new module. RSI 0.

## Cite as / do not cite as

**Cite as.** The predictor is the contribution.

**Do not cite as.** 17.2% as a held-out architecture result. New modules.
