# PromptBreeder

**Venue:** ICML 2024  
**arXiv:** 2309.16797  
**Preprint:** https://arxiv.org/abs/2309.16797  
**HTML:** https://arxiv.org/html/2309.16797 · https://huggingface.co/papers/2309.16797.md  
**Code:** none published. Hugging Face auto-links https://github.com/Avalee21/promptbreeder (`githubRepoAddedBy: "auto"`). That is a third-party reimplementation. Do not grade from it.

## Experiments scored

| Experiment | See | Eval | Search | Object | RSI | Binding reason |
|---|---|---|---|---|---|---|
| Arithmetic / GSM8K / commonsense, leftover or official test | 2 | **B−** | C | C | 1 | Train-batch fitness, then leftover test. No search repeats. OPRO 80.2 and some davinci rows are borrowed. `SOLUTION` is a short control string, not a reasoning method. Mutation prompts coevolve, so RSI is 1. |

One main protocol. Same letter across GSM8K and the asterisked arithmetic sets.

## What they claim

Population search over task prompts and mutation prompts beats other prompt optimizers. Headline: GSM8K zero-shot **83.9** vs OPRO **80.2** on PaLM 2-L, with the evolved prompt `"SOLUTION"`.

## Eval B−

Fitness is accuracy on “a randomly select batch of 100 examples from the training set” (App. J.2). Population 50, typically 20–40 generations, about 1–2k fitness evaluations. Asterisked sets (MultiArith, SingleEq, AddSub, SVAMP) are randomly halved; GSM8K uses the provided split. The fittest individual over the whole run is then scored on test.

That is a real held-out test, so Eval is not D. There is no separate validation set: train fitness is queried every generation, so this is level 2 (adaptive selection on the search split). The full search is not repeated. Table 1 point estimates have no error bars. Bracketed Plan-and-Solve numbers “are directly taken from the Plan-and-Solve paper which uses text-davinci-003.” OPRO 80.2 is presented beside PaLM 2-L rows without a clear same-model rerun in this PDF.

**Why not B or B+.** Two misses: no search repeats, and mixed-model borrowed rows. Minus is required. **Why not C.** The leftover/official test is documented. **Why not A.** Level 2 plus missing repeats.

## Search method C

Binary tournament, nine mutation operators in five classes, coevolution of mutation prompts. That is a specified loop. The main controls are other prompt methods, several not rerun on PaLM 2-L. Not a comparison of searchers on the same candidate grammar (no random-prompt search with the same 1–2k budget). C, not B−.

## Evolved object C

Table 6’s GSM8K zero-shot winner is `"SOLUTION"`. Few-shot GSM8K is 83.5, *below* zero-shot 83.9. App. J.5: “in the few-shot evolution case, the contexts dominate, and often the task-prompts drift into nonsense.” Mutation prompts are paraphrases (“Please summarize and improve the following instruction”). Operator-class ablations exist (App. L); the weird strings are not isolated as “control tokens vs semantics.”

This is evidence that PaLM 2-L is prompt-sensitive, not evidence of a transferable reasoning discovery.

## RSI 1

Mutation prompts and task prompts coevolve. Fitness is still task accuracy. App. F locks the ceiling:

> Promptbreeder invents new ways of generating mutants, but it does not invent new (auxiliary) ways of evaluating them … only the externally specified fitness function is used throughout.

Level 1, not 2.

## Control flow (from published code)

No official code. Grade from the preprint only. Hugging Face’s GitHub link is unofficial; ignore its control flow.

Paper loop: initialize a population of units (typically two task-prompts plus a mutation-prompt, from thinking-styles × mutation-prompts × problem description). Binary tournament: sample two units, mutate the winner, overwrite the loser. Fitness = accuracy on a random train batch of 100. One of nine operators is applied per replication (direct mutation, EDA over the population, hyper-mutation of mutation-prompts, Lamarckian reverse-engineering from a correct working-out, crossover / context shuffle). After fitness plateaus, score the run-best individual once on test. Model: PaLM 2-L. Inducer/evaluator temperature 0.0; redescriber temperature starts in 1.0–2.0 and can evolve.

## Cite as / do not cite as

**Cite as.** Early prompt evolution with a leftover test. Mutation-prompt coevolution is why RSI is 1 rather than 0.

**Do not cite as.** Recursive self-improvement. Same-model, repeated-search 83.9 vs OPRO 80.2. `"SOLUTION"` as a reasoning discovery. Any result from `Avalee21/promptbreeder`.
