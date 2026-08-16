# ADAS

**Venue:** ICLR 2025  
**arXiv:** 2408.08435  
**Preprint:** https://arxiv.org/abs/2408.08435  
**Code:** https://github.com/ShengranHu/ADAS

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Meta Agent Search, main tables (ARC + DROP/MGSM/MMLU/GPQA) | 2 | **B−** | C | C | 0 | Search on validation, report test. One trajectory per domain. ARC is Easy ≤5×5. Generated agents use many more calls than CoT. Transfer of “top 3” uses already seen scores. Seed archive already lists CoT-SC, debate, self-refine. |

## What they claim

A meta-agent that writes agent code outperforms hand-designed agents. Named children: Structured Feedback and Ensemble; Multi-Step Peer Review; Divide and Conquer. Transfer of MGSM agents to GSM8K / GSM-Hard / MMLU / DROP, and ARC agents across models.

## Eval B−

Search on validation, report test. ARC: public training tasks, grids ≤5×5 (`_arc/data_select.py`: keep if input and output length ≤5, then 20 val / remainder test; report protocol is 20/60). GPQA Diamond 32/166; other domains 128/800 (App. E). One search trajectory per domain (`n_generation` default 25 on ARC, 30 on the four-domain suite). Accuracy CIs are 95% bootstrap over examples, or five output samples on ARC/GPQA (`n_repreat=5`), not search seeds. Transfer picks “top 3 agents” using already observed scores (MGSM transfer; ARC “best test accuracy” then other FMs). Generated workflows often use tens of model calls vs one or few for prompting. Meta model `gpt-4o-2024-05-13`; agents `gpt-3.5-turbo-0125`.

Level 2, not 3, for the main tables. **Why not B.** Easy ARC, one trajectory, extra calls, transfer-by-observed-score: more than two misses. Binding miss is the combination of subset + compute. **Why not D.** Test items are not the val items (`SEARCHING_MODE` toggles `val_data_path` vs `test_data_path`).

## Search method C

Meta Agent Search writes Python `forward` against a small framework. Seed archive already contains chain-of-thought, self-consistency, self-refine, debate (`get_init_archive()` returns `[COT_code, Reflexion, LLM_debate, COT_SC, QD]`). Controls are those manuals and simple prompting, not another code-search algorithm with the same budget (no random program search). Foundational as a *formulation*. C as a demonstrated searcher.

## Evolved object C

Named children are generate, critique, revise, vote, decompose. The seed and meta-prompts already make those available. Ceiling: operator/seed remix, max C.

## RSI 0

Fixed meta-agent. Archive grows; the writer does not.

## Control flow (from published code)

**Parent pick.** The whole archive is concatenated into the meta prompt. No parent sampling; the meta-agent is told to invent something “interesting” relative to what is already there.

**Propose.** `gpt-4o-2024-05-13` emits JSON `{thought, name, code}`. Two self-reflection passes for novelty. Up to five debug reflections if evaluation throws.

**Score.** `evaluate_forward_fn` `exec`s the `forward` string onto `AgentSystem`, runs the val pickle (search) or test pickle (eval), bootstrap CI over example-level 0/1. ARC agents write a `transform(grid)` and are checked by exact match.

**Promote.** Every candidate is appended to the archive with its val fitness, including failures with near-zero score. After search, `evaluate()` walks the archive on test.

**Models.** Writer: `gpt-4o-2024-05-13`. Solver/baselines: `gpt-3.5-turbo-0125`. Transfer tables change the solver FM, not the searcher.

Code vs paper: `data_select.py` samples up to 100 ≤5×5 tasks then cuts 20 val / rest test; the paper’s scored ARC slice is the Easy ≤5×5 20/60 protocol. Do not cite ARC numbers without that filter.

## Cite as / do not cite as

**Cite as.** The right conceptual starting paper for “agent programs are the search object.”

**Do not cite as.** ARC SOTA without “Easy, ≤5×5, 20/60.” New architecture principles. Search-seed error bars.
