# Objective Rubrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split scoring rules from the 16-paper record: `RUBRICS.md` becomes an ordered letter recipe with fictitious Plover Lab examples; `GRADE_BOARD.md` keeps the current letters and calibration.

**Architecture:** Cut the board out of `RUBRICS.md` first so experiment-table letters stay byte-identical. Then replace `RUBRICS.md` with the rules body in Task 2 (do not invent a second lab or new numeric cutoffs). Then retarget pointers. No re-grade.

**Tech Stack:** Markdown in `/Users/phi9t/rsi-harness-audit`. No new runtime.

**Spec:** `docs/superpowers/specs/2026-08-16-objective-rubrics-design.md`

---

## File map

| File | Responsibility |
|---|---|
| Create: `GRADE_BOARD.md` | Scored 16-paper record, mix-up table, calibration, what-would-move-a-letter |
| Rewrite: `RUBRICS.md` | Glossary, caps, checklists, ordered recipes, cap sketches, four lab worksheets |
| Modify: `README.md`, `AGENTS.md`, `papers/README.md`, `REPORT.md`, `GRADES_ROUND2.md` | Entry-point job split |
| Modify: `papers/gepa.md`, `papers/ace.md`, `papers/dgm.md`, `papers/hgm.md` | Grade-board pointer only |
| Modify: `PEDANTIC_CORRECTION_PASS.md` | One live-path sentence |
| Unchanged | Other `papers/*.md` grade tables, historical `docs/superpowers/` specs/plans, `BENCHMARKS.md`, `UPSTREAM_BENCHMARKS.md`, `benchmarks/` |

## Frozen letters

Do not edit Eval / Search / Object / RSI letters on the board or in paper files. Plus/minus meaning unchanged. Existing bars stay: `≥5` cheap full searches, `≥3` expensive. No new ratios or overlap percents.

## Cohort-name firewall (`RUBRICS.md` only)

After Task 2, `RUBRICS.md` must not contain these as whole words: PromptBreeder, GPTSwarm, DiscoPOP, ADAS, AFlow, AgentSquare, Gödel, Self-Developing, MaAS, GEPA, ACE, MASS, ShinkaEvolve, DGM, HGM. Do not write `STOP` in all caps. Also absent: CMP, MIPROv2, LRML. Real suite names stay off the rules file (no SWE-bench, HotpotQA, AIME, MATH, AppWorld). `GRADE_BOARD.md` keeps all of those.

---

### Task 1: Cut `GRADE_BOARD.md` from current `RUBRICS.md`

**Files:**
- Create: `GRADE_BOARD.md`

- [ ] **Step 1: Build the file from the live tail of `RUBRICS.md`**

Run from the repo root. `RUBRICS.md` must still contain the board (this task is the cut, not the rewrite).

```bash
python3 << 'PY'
from pathlib import Path
src = Path("RUBRICS.md").read_text()
marker = "## Official suite versus this experiment"
start = src.index(marker)
header = (
    "# Grade board\n\n"
    "Scoring rules live in [`RUBRICS.md`](RUBRICS.md). "
    "This file is the scored record for this audit.\n\n"
)
Path("GRADE_BOARD.md").write_text(header + src[start:])
PY
```

Expected: `GRADE_BOARD.md` exists. The only new prose is the H1 plus the one pointer sentence.

- [ ] **Step 2: Confirm the body is byte-identical to the current tail**

```bash
diff -u <(python3 -c "from pathlib import Path; t=Path('RUBRICS.md').read_text(); print(t[t.index('## Official suite versus this experiment'):], end='')") <(tail -n +5 GRADE_BOARD.md)
```

Expected: no diff. If there is a diff, fix the stitch; do not rewrite binding reasons.

- [ ] **Step 3: Confirm experiment-table letters still match `RUBRICS.md`**

```bash
python3 << 'PY'
import re
from pathlib import Path

def letters(text):
    rows = []
    for line in text.splitlines():
        if not line.startswith("| "):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 6:
            continue
        if cells[0] in {"Experiment", "Change", "Paper", "Band", "Level", "Question", "If someone did this"}:
            continue
        rows.append(tuple(cells[:6]))
    return rows

old = Path("RUBRICS.md").read_text()
new = Path("GRADE_BOARD.md").read_text()
old_rows = letters(old[old.index("### Experiment grades"):])
new_rows = letters(new[new.index("### Experiment grades"):])
assert old_rows == new_rows, (len(old_rows), len(new_rows), [a for a,b in zip(old_rows,new_rows) if a!=b][:3])
print(f"ok {len(old_rows)} experiment rows")
PY
```

Expected: `ok` and a row count (currently 40-odd). Fail → do not proceed.

- [ ] **Step 4: Commit**

```bash
git add GRADE_BOARD.md
git commit -m "$(cat <<'EOF'
Split the scored 16-paper record into GRADE_BOARD.md.

Keep experiment letters identical to the current RUBRICS.md tail so the rules rewrite cannot quietly re-grade.
EOF
)"
```

---

### Task 2: Rewrite `RUBRICS.md` as rules plus Plover Lab

**Files:**
- Modify: `RUBRICS.md` (replace the whole file)

- [ ] **Step 1: Write `RUBRICS.md`**

Replace the file with exactly the body below. Keep Unicode (curly apostrophes, ≥, minus signs in B−). Do not add cohort paper names. Do not add SOTA tables.

```markdown
# How we score these papers

Score **one experiment at a time**. Letters come from a checklist and from **hard caps** (automatic ceilings). Do not average a clean experiment with a dirty one.

Scored rows for this audit live in [`GRADE_BOARD.md`](GRADE_BOARD.md). This file is the recipe. A paper that is not in that board can still be run through it.

If you only remember four rules:

1. Grade the experiment, not the PDF.
2. Give the search method and the evolved object separate Discovery scores.
3. A hard cap beats a good story. Hidden tests in the proposal prompt make Eval D, even if the authors inspected logs and saw no hardcoding.
4. Getting better at the benchmark used for search is not recursive self-improvement. RSI requires measuring whether later systems are better at producing the *next* system.

---

## Words we use

Every example here is **fictitious. Not a cohort paper.** They belong to **Plover Lab** and a 100-item latch-diagram suite, **Nock-100** (official split published before any method ran: 40 train / 20 validation / 40 test; metric: exact match on a short repair string). Hidden oracles exist for the test split and must not enter proposal prompts.

**Experiment / claim.** One method, one thing being changed, one protocol, one reported number, and the interpretation the authors want. Stencil’s held-out Nock-100 run is a different experiment from Stencil-online, which updates after each test item.

**Harness.** The wrapper around a frozen model: prompts, tools, retries, routing, extra models. Latchkey’s starting harness is a shell plus whole-file write. That is a harness, not a new model.

**Search (the outer loop).** The full process that proposes candidates, scores them, and picks a winner. Rerunning “the agent three times on the test set” is not rerunning search. Rookery’s ± over three executions of one chosen graph is noise in answering questions, not noise in finding the graph.

**Held-out test.** Examples the search process is not allowed to query. Stencil never scores the 40 Nock-100 test items during search. The 20 validation items are not held out: Stencil keeps scoring them to pick the next instruction.

**Validation set, used adaptively.** A split that is not the final test, but is queried many times during search. Each extra look makes it easier to overfit that split. Stencil spends most of its rollout budget on validation solely for candidate selection. That is why Eval A is off the table even when test is clean.

**Rollout.** One full run of the system on one example (model calls, tools, score). Stencil’s budget comparison is 800 rollouts vs Gummed’s 820 on the same instruction dictionary, not a typical-ratio slogan.

**Firewall.** A rule about what the search process is allowed to see. “Train/test split” is not enough. Latchkey’s *solver* does not see hidden Nock-100 oracles at evaluation time. The separate diagnoser prompt does: it is given the oracle patch and the hidden-eval log, then asked what to change next. The leak is in the proposal channel.

**Same-set search.** The tasks used to search are the tasks used to report the headline. Latchkey-same-set: 800 evaluations on all 100 Nock-100 items, then 41% on that same set.

**Prequential / online-on-test.** Predict on a test example, then update from that example’s outcome, then move to the next. Stencil-online does this on the shuffled 40 test items. That is a real learning protocol. It is not the accuracy of one frozen system on untouched test items. Stencil’s main run (search on train/val, freeze, test) is.

**Compute match.** The evolved system and the baseline use the same model, the same number of calls, similar tokens, the same tools. Rookery graphs often make tens of model calls per item while basic prompting makes one or a few. A higher score can just be more test-time compute.

**Search-space match.** Automated search and the human/random baseline are allowed the same kind of candidate and the same evaluation budget. Plumb can emit about 100 closed-form objectives. A coefficient-grid baseline that tries eight mixes is not the same space.

**Selection winner vs branded favorite.** The candidate the fitness rule actually picked, versus the one the abstract names. Plumb selects formulas on Click-Pref. MixA is best there (0.62). TwistB is fourth (0.58). On held-out Note-Sum, MixA is 0.41 and TwistB is 0.39. The paper still leads with TwistB because of its “unconventional” shape. Grade that as a branding choice, not as table-winning discovery.

**Operator library.** The human-written menu the searcher is allowed to wire up (chain-of-thought, debate, vote, retry, and so on). Rookery lists those families. Connecting them is useful engineering. It is not a new operator.

**Weak start / weak root.** A starting harness that omits tools every serious editor already has. Latchkey says the base agent is “intentionally lightweight.” Later descendants add range view, string replace, retries, and a second model to rank patches. Those are standard parts. Doubling the score mostly shows the start was crippled.

**Ablation.** Change one piece, keep the rest, see whether the gain moves. Forward: add the piece to the parent. Reverse: remove it from the child. Without that, a “discovered” file can be along for the ride. Latchkey’s showcased `maybe_install` logs that it “would” install a module, skips the action, and still returns success. An ablation, or a unit test, would have caught that it does not install anything.

**Transfer.** The artifact is tested on a set that was not used to choose it, and not picked by looking at the target scores. Plumb searches on Click-Pref, then reports Note-Sum. That is family transfer. Ranking “top 3 graphs” on Note-Sum and then calling that transfer is not.

**Recursive self-improvement (RSI).** Later systems are better at carrying out the *next* improvement cycle, not merely better at the benchmark used to select them. Task score of a system A is Q(A): average success on tasks. Improvement ability I(A) is how good the children of A are, under a fixed model, tool set, mutation budget, and hidden evaluator. A lineage heuristic that pools descendant *task* success and uses it to pick whom to expand is still a search rule over Q. It is not an I(A) experiment.

---

## The three grades

| Grade | Question |
|---|---|
| **Eval** | Can we trust the number? |
| **Discovery (search method)** | Did the authors design a better way to search? |
| **Discovery (evolved object)** | Did search produce a new, working artifact? |
| **RSI** | Did they measure improvement of improvement? |

Empty bands are allowed. Eval A, Discovery A, and RSI 2–3 are defined here even if a given board has none.

Plus and minus are defined, not decorative:

- **Plus:** meets the letter, and also hits one requirement of the letter above (example: B with matched searcher budgets, or a true train-then-freeze split → B+).
- **Minus:** meets the letter’s main firewall, but fails two other checklist items (no search repeats *and* a tiny subset is already two).
- If two experiments disagree, they get two rows. Do not average them into B±.

---

## Eval: can we trust the number?

Run the recipe in order. Do not skip to a board of named papers.

### 1. Name the experiment

One method, one changed object, one protocol, one headline number, one claimed meaning. Two protocols → two rows.

### 2. Fill the worksheet

Use the form at the end of this file. If “does it actually run?” or “what did the proposer see?” is unknown, Eval cannot be A and the evolved-object score cannot be B.

### 3. See-level (what the proposer was allowed to see)

Score the prompt that chose the edit, not only the agent that solves tasks. Latchkey’s solver can be told not to see hidden oracles. That does not clean a diagnoser prompt that received them.

| Level | Meaning in plain words | Fictitious evidence | Max Eval |
|---|---|---|---|
| **1** | Search uses a train (or public) split. The reported test is never queried. Hidden tests and gold patches are not in any prompt that proposes the next change. | Stencil-freeze: instructions from the 40 train items only, then frozen on the 40 test items. | No cap from this row |
| **2** | A validation split is scored again and again to accept or reject candidates. Final test stays hidden. | Stencil main: the 20 val items are the selection set, scored every round. | Cannot be A. B or B+ is possible. |
| **2-rewrite** | There is a split, then the search *distribution* is changed using evaluation signal: keep only high-variance items, train a predictor on scores, or promote only top-k on the same pool. | Rookery: 20% val / 80% test, then a blank graph five times, keep high-variance val items as the actual search set. | B− even if a test split exists |
| **3** | Search and the headline share the same tasks. | Latchkey-same-set: 800 evals on all 100 Nock-100 items, 41% on that same 100. | D, with one exception below |
| **4** | Hidden tests, official patches, or judge internals are pasted into the prompt that decides the next edit. | Latchkey headline: diagnoser sees `{oracle_patch}` and `{eval_log}`. Authors report no hardcoding on inspection. Exposure still happened. | D. A clean transfer experiment does not raise *this* number. |

**Exact, checkable math is a limited exception to level 3.** Twelve magnets on a ring, energy = sum of pairwise \(1/r\), no overlap of cores: the same objective for search and for the reported score, but anyone can re-check the arrangement. That is not like reusing Nock-100 questions. Cap is **C** unless an independent check with tighter constraints is the headline.

### 4. Other automatic caps

- Prequential-on-test sold as frozen held-out accuracy → **C**
- No documented split → **D**
- Hand-built demo labeled as search → do not give an Eval-as-discovery letter

### 5. Remaining hygiene (binary)

| Check | Pass | Fail, with fictitious evidence |
|---|---|---|
| **Search was repeated** | The whole search is rerun (`≥5` cheap methods, `≥3` expensive). Report median and spread of those runs. | Stencil main is one search. A five-run toy loop would pass this row and still need the rest. |
| **The ± is about search** | Error bars over independent searches. | Rookery ± is three test executions of one chosen graph. That answers “would this harness get a different score if we resampled answers?”, not “would another search find an equally good harness?” |
| **Compute match** | Same model, calls, tokens, tools. | Writer-Large writes the policy; Solver-Small runs it; the table is sold as one harness. Exclude that row from same-model harness comparisons. |
| **Fair search space** | Random search, evolution without an LM, and humans get the same candidate language and budget. | Plumb: ~100 proposed formulas vs an eight-point mix grid. |
| **Honest population** | Full official split, or a split frozen before seeing results. | Rookery reports 31/80 on its 80% test. That is not all of Nock-100. A filter that keeps only “easy” diagrams is the same miss. |
| **Honest selection** | Report the fitness winner on held-out data, or say in advance you will highlight a different object and why. | Plumb: TwistB is not the Click-Pref winner and not the Note-Sum winner. Error bars among MixA / MixC / TwistB overlap. |
| **Name the protocol** | Caption matches what was done. | Stencil-online sits in the same “test” columns as Stencil-freeze. A hand-built graph labeled as search is not a search result. |

### 6. Letter from what remains

Apply the **lowest** hard cap that triggered. Then:

- **A** — See 1, no other cap, every hygiene item passes (including repeated search and search-±).
- **B** — See 1 or 2, a held-out evaluation exists, not C/D-capped. Usual miss: search run once and/or ± is not over search.
- **B+** — meets B, and also one A-axis item (matched searcher budgets, or true train-then-freeze with test never queried). Still missing full A (almost always repeats).
- **B−** — held-out test exists, and either two hygiene misses or See 2-rewrite.
- **C / C+ / C−** — a transfer or a split exists, but the protocol is streaming-on-test, overlapping val/dev as the only “held-out,” mixed models in the headline comparison, or an object grown under See 4 and then scored elsewhere. **C+** if they publish the honest extra cut (drop overlapping items). **C−** if the main table is confounded (writer and solver are different models sold as one harness).
- **D** — See 3 (except checkable-math C) or See 4 or no documented final split.

Then apply plus or minus.

---

## Discovery: what was found?

Issue **two** scores. Mixing them was the original rubric’s worst habit.

**Search method (authors’ algorithm).** How parents are chosen, how candidates are proposed, how validation is used. Stencil’s contribution is trace notes plus a parent-pick rule, written by the authors.

**Evolved object (what search spat out).** A prompt, a workflow graph, a loss, a merge rule, a tool. Plumb’s TwistB formula is an evolved object. Latchkey’s `maybe_install` is an evolved object. They must not share a letter with the search method.

A paper can be B for the search method and D for the object. That is a valid outcome, not a contradiction.

### Evolved object checklist

| Check | Pass | Fail, with fictitious evidence |
|---|---|---|
| **It does what they said** | Code or math runs. A test can catch a no-op. | Latchkey appendix: `Would attempt to install module`, `# skip actual installation`, then `return True`. Grade D for that object. A broadcasting bug that prints “accuracy of over 1000%” is a bug, not a method. |
| **Not already on the menu** | New executable idea, or a new formula. | Rookery “structured critique and vote” is generate, critique, revise, vote. Latchkey children rediscover range-read, retries, and a ranker. |
| **Isolated** | Add only that piece to the parent; also remove it from the child. | Plumb’s best mix blends two terms with a floor. No ablation of floor vs no floor, or a simple average baseline. |
| **Transfer that was not cherry-picked** | Held-out year, repo family, model, or scale, chosen in advance. | Plumb: Click-Pref → Note-Sum. Ranking the “top 3” already scored on Note-Sum is not. |
| **Honest ranking** | Headline object is the fitness winner, or the paper says it is a scientific pick and shows the winner too. | Plumb “state of the art” is stronger than its own held-out ranking. |
| **The gain is the object, not extra calls or a bigger model** | Matched compute; same model registry. | Exhaustive enumeration until `abs(energy)<1e-6` is a modality switch to brute force, not a new algorithm. Writer-Large assisting Solver-Small is extra resources. |

Hard caps on the evolved object:

- Does not actually run → **D**
- Hand-written, not searched → do not score as evolved
- Already in the operator list, seed prompt, or a textbook → at most **C**
- Rebuilt standard tools from a weak start → at most **C**
- Extra calls or a stronger model could explain the gain → at most **C**
- Stores instance facts (file paths, city names, app APIs) rather than a portable rule → **C** or **D**

Then: **A** new, working, isolated, repeated, transferred across families. **B** a real new formula or mechanism with some transfer and missing repeats or ablations. **B−** real object whose own tables do not establish superiority. **C+** unusual remix, under-ablated, or a prompt that is a concrete portable procedure. **C** known parts. **C−** recombination table, template leakage, or brute force sold as a new algorithm. **D** cosmetic, unsupported, or nonfunctional.

### Search method checklist

| Check | Pass | Fail |
|---|---|---|
| **Stated as a method** | An estimator, a selection rule, a loop you could reimplement without one lucky child. | “We evolved a good agent.” |
| **Beats other searchers, not just “no search”** | Same candidate language and budget. Stencil vs Gummed on the same instruction dictionary. | Only vs chain-of-thought. |
| **The number used in the loop is the number in the analysis** | If parent pick uses pooled descendant task success, the plot uses that. | A correlation plot uses “best descendant score, drop the parent,” computed after the tree exists. That after-the-fact number is not what the sampler saw. |
| **Repeated** | Several full trees. | One tree. |

Do not score a hand-built demo as a search method.

**Search-method letters:**

- **A** — beats other searchers on held-out families, with repeated full trees.
- **B** — specified loop, compared to other searchers under a similar budget; repeats may be missing.
- **B− / C+** — specified loop, some searcher control, missing repeats or ablations only on a toy.
- **C** — standard evolution / sample-from-an-LM, mainly vs prompting, or the mutation *plan* is written by a frozen external model that saw hidden tests.

---

## RSI: did improvement ability improve?

| Level | Required | Not enough |
|---|---|---|
| **0** | The searcher is a fixed external algorithm. Prompts or workflows may still change. | Naming the loop “self-improving.” |
| **1** | The system edits its own code or coevolves the prompts that mutate it. The measured number is still task score Q. | A large archive; “recursive rounds”; pooled descendant task success used only to pick whom to expand. |
| **2** | Later snapshots produce better *children* under the same model, tools, mutation budget, and hidden tasks. Repeat the whole thing. | Best agent’s task score went up. The best descendant on the finished tree scored higher. |
| **3** | Level 2 on at least two held-out task families, and later generations use their own searcher, not the authors’ original outer loop. | A long self-edit tree still diagnosed by the same frozen external model. |

**The level-2 experiment, in steps.** Take an early, middle, and late agent. Give each the same hidden failure traces, the same mutation budget, the same models and tools. Sample children. Score those children once on a hidden set, with no debug dump back to the proposer. The distribution of child scores should move up for later parents. We want the lower 95% bound on (late improvement minus early improvement) above zero, on at least two independent runs.

A lineage heuristic over descendant *task* success is the right *idea* for level 2. It is not the experiment.

Disqualifiers:

- Child calls a stronger model → not RSI; drop from same-model tables.
- A frozen stronger model writes the improvement plan → still level 1, and the search-method grade must name that external diagnoser.

Until a level-2 card is filled, RSI stays 0 or 1, including papers with ambitious titles.

---

## Official set versus this experiment’s slice

The official task set (items, metric, version pin) lives under [`benchmarks/`](benchmarks/), indexed from [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). What a paper actually ran lives in [`BENCHMARKS.md`](BENCHMARKS.md) and the paper file. A headline on a slice is not a score on the official set.

This is wording, not a new Eval ceiling. Named mix-ups for this audit live in [`GRADE_BOARD.md`](GRADE_BOARD.md).

---

## Fill this before assigning letters

```text
Experiment:
Paper:
What was allowed to change:
Headline number (table):
What the authors say that number means:

What the proposer saw (level 1–4, and which prompt: solver / diagnoser / predictor):
How many full searches:
What the ± is over:
Same model and call budget as the baseline?:
Same candidate language and budget as human/random?:
Which tasks (full set, subset, difficulty filter)?:
Fitness winner vs name in the abstract:
Protocol name (frozen test / streaming / same-set / hand-built):

Does the named object run? Quote or test:
Already in the seed prompt or operator list?:
Single-piece add/remove?:
Transfer set, chosen before seeing target scores?:
Leftover gain from extra calls or a bigger model?:

Is the authors' search method specified? Compared to another searcher?

Is the searcher frozen? Is the reported number task score or child quality?
Level-2 experiment present?:

Hard caps:
Eval / search-method Discovery / evolved-object Discovery / RSI:
```

---

## Hard-cap sketches

Each pair is **fictitious. Not a cohort paper.** Two sentences: pass, then fail.

**See 2 vs A.** Stencil main reuses the 20 val items every round and never touches the 40 test items. Held-out test is real; Eval cannot be A.

**See 2-rewrite.** Rookery splits 20/80, then keeps only high-variance val items after five blank runs. The 80% test exists; max Eval is B−.

**See 3.** Latchkey-same-set searches and reports on all 100 Nock-100 items. Eval D.

**See 3, checkable math.** Twelve magnets on a ring; energy is sum of \(1/r\); a published verifier re-checks the placement. Search objective equals the reported score, but the artifact is checkable. Cap C, not D.

**See 4.** Latchkey’s diagnoser prompt includes `{oracle_patch}` and `{eval_log}`. Inspection found no hardcoded answers. Eval D. A later score on a different suite does not raise this row.

**Prequential sold as frozen test.** Stencil-online updates after each of the 40 test items and prints 33/40 under a “test” column next to Stencil-freeze. Eval C for that row.

**Compute mismatch.** Writer-Large writes; Solver-Small runs; one table. C− on Eval for that comparison; drop from same-model harness tables.

**Operator library.** Rookery’s seed already lists debate, vote, and retry. Wiring them is object C.

**No-op object.** `maybe_install` logs “would install,” skips, `return True`. Object D.

**Weak start.** Latchkey omits range-edit; descendants add it and the score doubles. Object at most C for those tools.

---

## Worked examples (Plover Lab)

Four fake papers. **Fictitious. Not a cohort paper.** These show the four grades working together. Eval A and RSI 2 are defined in the recipe above; do not treat the absence of a fake paper that earned them as a missing band.

### Stencil — instruction-string search

```text
Experiment: Stencil on Nock-100, freeze then test
Paper: Stencil (Plover Lab)
What was allowed to change: named instruction strings
Headline number (table): 22/40 → 29/40 on the 40 test items
What the authors say that number means: better latch repairs from searched instructions

What the proposer saw: level 2 (20 val items scored every round; 40 test never queried)
How many full searches: 1
What the ± is over: none
Same model and call budget as the baseline?: yes vs Gummed (800 vs 820 rollouts)
Same candidate language and budget as human/random?: yes vs Gummed (same instruction dictionary)
Which tasks: full official Nock-100 split, frozen before search
Fitness winner vs name in the abstract: same
Protocol name: frozen test (val reused for selection)

Does the named object run? yes — instruction dictionary
Already in the seed prompt or operator list?: task recipes, not a new operator
Single-piece add/remove?: not done
Transfer set: none in this row
Leftover gain from extra calls or a bigger model?: no

Is the authors' search method specified? yes. Compared to Gummed (another instruction searcher).
Is the searcher frozen? yes. Reported number is task score.
Level-2 experiment present?: no

Hard caps: See 2 blocks A
Eval B+ / search-method B / evolved-object C+ / RSI 0
```

Why those letters: held-out test plus matched searcher budgets (one A-axis item) and missing repeats → Eval **B+**. Specified loop vs another searcher, one tree → Search **B**. Portable latch recipes, not a new primitive → Object **C+**. Outer loop frozen → RSI **0**.

### Rookery — operator-graph search

```text
Experiment: Rookery on Nock-100, 20/80 then high-variance val filter
Paper: Rookery (Plover Lab)
What was allowed to change: edges among debate, vote, retry
Headline number (table): 31/80 on the 80% test
What the authors say that number means: searched graphs beat chain-of-thought

What the proposer saw: level 2-rewrite (split, then keep high-variance val)
How many full searches: 1
What the ± is over: three test executions of one graph
Same model and call budget as the baseline?: no (many more calls than CoT)
Same candidate language and budget as human/random?: operators are the human menu
Which tasks: 80% of Nock-100 after seed-7 split, then val rewritten
Fitness winner vs name in the abstract: same
Protocol name: held-out test after search-set rewrite

Does the named object run? yes — graph of known operators
Already in the seed prompt or operator list?: yes
Single-piece add/remove?: GSM-style ablation still high with operators removed (not isolated)
Transfer set: none
Leftover gain from extra calls or a bigger model?: plausible

Is the authors' search method specified? a loop exists. Compared only to chain-of-thought.
Is the searcher frozen? yes. Reported number is task score.
Level-2 experiment present?: no

Hard caps: See 2-rewrite → max B−
Eval B− / search-method C / evolved-object C / RSI 0
```

Why those letters: test split exists but the search distribution was rewritten → Eval **B−**. Vs prompting, not vs another graph searcher → Search **C**. Known operators → Object **C**. Frozen outer loop → RSI **0**.

### Latchkey — self-editing agent (headline)

```text
Experiment: Latchkey on Nock-100, diagnoser sees hidden oracles
Paper: Latchkey (Plover Lab)
What was allowed to change: the agent’s own tools
Headline number (table): 18% → 41% on Nock-100 test
What the authors say that number means: self-edits produced a better coding agent

What the proposer saw: level 4 (diagnoser prompt includes {oracle_patch} and {eval_log})
How many full searches: 1
What the ± is over: none
Same model and call budget as the baseline?: start omitted range-edit; descendants add tools and a ranker
Same candidate language and budget as human/random?: not compared that way
Which tasks: Nock-100 test, but oracles entered the proposal prompt
Fitness winner vs name in the abstract: showcased child is maybe_install
Protocol name: self-edit, sold as held-out test

Does the named object run? no — maybe_install logs “would install”, skips, return True
Already in the seed prompt or operator list?: descendants rebuild standard editor tools
Single-piece add/remove?: no
Transfer set: none in this row
Leftover gain from extra calls or a bigger model?: weak start

Is the authors' search method specified? archive and parent pick. Mutation plan written by frozen Diagnoser-X with oracles in context.
Is the searcher frozen? Diagnoser-X is frozen. Reported number is task score Q.
Level-2 experiment present?: no

Hard caps: See 4 → Eval D; no-op object → Object D
Eval D / search-method C / evolved-object D / RSI 1
```

Why those letters: hidden oracles in the *next-edit* prompt → Eval **D**. Frozen external diagnoser that saw those oracles → Search **C**. `maybe_install` does not run → Object **D**. The agent edits its own code; measured number is still Q → RSI **1**.

Same-set without a leak is a different row (See 3 → Eval D) and is not this worksheet.

### Plumb — objective discovery

```text
Experiment: Plumb, select on Click-Pref, report on Note-Sum
Paper: Plumb (Plover Lab)
What was allowed to change: closed-form objective formulas
Headline number (table): TwistB Note-Sum 0.39 (abstract “state of the art”)
What the authors say that number means: a discovered objective that generalizes

What the proposer saw: level 2 (Click-Pref val for selection; Note-Sum held out)
How many full searches: 1 pipeline, ~100 proposals
What the ± is over: none over search; overlapping bars among MixA / MixC / TwistB on Note-Sum
Same model and call budget as the baseline?: yes for the loss bake-off
Same candidate language and budget as human/random?: ~100 LM proposals vs an eight-point mix grid
Which tasks: Click-Pref to choose; Note-Sum to report (different family)
Fitness winner vs name in the abstract: MixA wins Click-Pref 0.62 and Note-Sum 0.41; TwistB is fourth / 0.39
Protocol name: held-out family

Does the named object run? yes — closed-form mix
Already in the seed prompt or operator list?: new formula, not an operator graph
Single-piece add/remove?: no floor-vs-no-floor ablation
Transfer set: Note-Sum, chosen in advance
Leftover gain from extra calls or a bigger model?: no

Is the authors' search method specified? “ask the LM for ~100 formulas,” one pipeline. Not vs another discovery searcher.
Is the searcher frozen? yes. Reported number is task score.
Level-2 experiment present?: no

Hard caps: none on Eval below B; branding hits the object
Eval B / search-method C / evolved-object B− / RSI 0
```

Why those letters: held-out family exists; one pipeline and a branding miss that is not two Eval hygiene fails → Eval **B**. Sample-from-an-LM vs prompting, not vs another searcher → Search **C**. Real formula whose own tables do not establish superiority → Object **B−**. Frozen outer loop → RSI **0**.

---

## Where the scored rows live

Apply this file, then compare with [`GRADE_BOARD.md`](GRADE_BOARD.md) if the experiment is one of the rows already scored for this audit. Do not use that board to define a letter for a new experiment.
```

- [ ] **Step 2: Confirm required headings, lab names, and the name firewall**

```bash
rg -n '^# How we score|^## Words we use|^## The three grades|^## Eval:|^## Discovery:|^## RSI:|^## Official set versus|^## Fill this before|^## Hard-cap sketches|^## Worked examples|^### Stencil|^### Rookery|^### Latchkey|^### Plumb' RUBRICS.md
rg -n 'Nock-100|Plover Lab|Stencil|Rookery|Latchkey|Plumb|GRADE_BOARD.md' RUBRICS.md | head
rg -nw 'PromptBreeder|GPTSwarm|DiscoPOP|ADAS|AFlow|AgentSquare|Gödel|Self-Developing|MaAS|GEPA|ACE|MASS|ShinkaEvolve|DGM|HGM|MIPROv2|LRML' RUBRICS.md || true
rg -n '\bSTOP\b|\bCMP\b' RUBRICS.md || true
rg -n 'SWE-bench|HotpotQA|IFBench|HoVer|PUPA|AppWorld|AIME|MATH' RUBRICS.md || true
```

Expected: all listed headings present. Lab names and `GRADE_BOARD.md` present. The paper-name `rg -nw` prints nothing. No all-caps `STOP`, no `CMP`. No real suite names from that last list.

- [ ] **Step 3: Confirm letters were not copied onto the rules file as a second board**

```bash
rg -n 'GEPA main|KernelBench now its own|PromptBreeder, arithmetic' RUBRICS.md || true
```

Expected: no matches (those strings belong only on `GRADE_BOARD.md`).

- [ ] **Step 4: Commit**

```bash
git add RUBRICS.md
git commit -m "$(cat <<'EOF'
Rewrite RUBRICS.md as an ordered recipe with fictitious lab examples.

Define letters with Nock-100 and Plover Lab so the rules no longer cite the papers they grade.
EOF
)"
```

---

### Task 3: Retarget pointers

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `papers/README.md`
- Modify: `REPORT.md`
- Modify: `GRADES_ROUND2.md`
- Modify: `PEDANTIC_CORRECTION_PASS.md`
- Modify: `papers/gepa.md`
- Modify: `papers/ace.md`
- Modify: `papers/dgm.md`
- Modify: `papers/hgm.md`

Do not change paper grade tables. If `rg -n 'grade board' papers/*.md` finds another file with the same pointer sentence, retarget that sentence only.

- [ ] **Step 1: `README.md`**

Replace:

```markdown
**Start here:** [RUBRICS.md](RUBRICS.md) (rules, ceilings, grade board, calibration). Then open a file under [papers/](papers/).
```

with:

```markdown
**Start here:** [RUBRICS.md](RUBRICS.md) (how letters are built). Then [GRADE_BOARD.md](GRADE_BOARD.md) (scored rows). Then open a file under [papers/](papers/).
```

Replace the table row:

```markdown
| [RUBRICS.md](RUBRICS.md) | How letters are built, the grade board, and cohort calibration |
```

with two rows:

```markdown
| [RUBRICS.md](RUBRICS.md) | How letters are built (recipe, fictitious examples) |
| [GRADE_BOARD.md](GRADE_BOARD.md) | Scored rows, how to cite, cohort calibration |
```

Replace:

```markdown
Letters did not move after the 16 August 2026 preprint+code pass. Facts that did (GEPA task count and Table 1, Shinka AIME grouping, Self-Developing Figure 11, DGM `big.json` not in the outer loop) are in the grade board at the top of `RUBRICS.md`.
```

with:

```markdown
Letters did not move after the 16 August 2026 preprint+code pass. Facts that did (GEPA task count and Table 1, Shinka AIME grouping, Self-Developing Figure 11, DGM `big.json` not in the outer loop) are in [`GRADE_BOARD.md`](GRADE_BOARD.md).
```

- [ ] **Step 2: `AGENTS.md`**

Replace:

```markdown
- Keep one `RUBRICS.md` for scoring rules, ceilings, the grade board, and calibration. Put each paper in its own file under `papers/`. Keep `BENCHMARKS.md` for cohort slices and SOTA pointers. Keep `UPSTREAM_BENCHMARKS.md` for the glossary, L/R, and the 47-name index. Official cards live under `benchmarks/`. Jargon in the map only if a card needs it; define it with a suite fact and list it in the index glossary.
```

with:

```markdown
- Keep one `RUBRICS.md` for scoring rules. Keep one `GRADE_BOARD.md` for the scored rows and paper-citing calibration. Put each paper in its own file under `papers/`. Keep `BENCHMARKS.md` for cohort slices and SOTA pointers. Keep `UPSTREAM_BENCHMARKS.md` for the glossary, L/R, and the 47-name index. Official cards live under `benchmarks/`. Jargon in the map only if a card needs it; define it with a suite fact and list it in the index glossary. In `RUBRICS.md`, define jargon with a lab fact; in paper files and `GRADE_BOARD.md`, with a paper fact.
```

Replace:

```markdown
- Current entry points are `RUBRICS.md` (rules, ceilings, grade board, calibration), `papers/` (one file per paper, preprint plus official code), `BENCHMARKS.md` (how this cohort used a slice), `UPSTREAM_BENCHMARKS.md` (glossary, L/R, 47-name index), `benchmarks/` (official cards), and `PEDANTIC_CORRECTION_PASS.md` (historical verification trail). `REPORT.md` and `GRADES_ROUND2.md` are stubs. Interactive boards live in the Cursor canvas folder.
```

with:

```markdown
- Current entry points are `RUBRICS.md` (scoring rules), `GRADE_BOARD.md` (scored rows and calibration), `papers/` (one file per paper, preprint plus official code), `BENCHMARKS.md` (how this cohort used a slice), `UPSTREAM_BENCHMARKS.md` (glossary, L/R, 47-name index), `benchmarks/` (official cards), and `PEDANTIC_CORRECTION_PASS.md` (historical verification trail). `REPORT.md` and `GRADES_ROUND2.md` are stubs. Interactive boards live in the Cursor canvas folder.
```

- [ ] **Step 3: `papers/README.md`**

Replace:

```markdown
One file per paper. Letters and calibration live in [`RUBRICS.md`](../RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](../BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](../benchmarks/).
```

with:

```markdown
One file per paper. Scoring rules live in [`RUBRICS.md`](../RUBRICS.md). Letters and calibration live in [`GRADE_BOARD.md`](../GRADE_BOARD.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](../BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](../benchmarks/).
```

- [ ] **Step 4: `REPORT.md`**

Replace:

```markdown
The paper-by-paper report now lives in [`papers/`](papers/). Letters, ceilings, and calibration live in [`RUBRICS.md`](RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](benchmarks/).
```

with:

```markdown
The paper-by-paper report now lives in [`papers/`](papers/). Scoring rules live in [`RUBRICS.md`](RUBRICS.md). Letters and calibration live in [`GRADE_BOARD.md`](GRADE_BOARD.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](benchmarks/).
```

- [ ] **Step 5: `GRADES_ROUND2.md`**

Replace:

```markdown
The grade board now lives in [`RUBRICS.md`](RUBRICS.md) (section “Grade board”). Paper evidence lives in [`papers/`](papers/).
```

with:

```markdown
The grade board now lives in [`GRADE_BOARD.md`](GRADE_BOARD.md). Scoring rules live in [`RUBRICS.md`](RUBRICS.md). Paper evidence lives in [`papers/`](papers/).
```

- [ ] **Step 6: `PEDANTIC_CORRECTION_PASS.md`**

Replace only this sentence (leave the rest of the file, including v1 letters, untouched):

```markdown
**Rubrics:** v1 letters in this file are historical. Scoring rules, the grade board, and calibration are in [`RUBRICS.md`](RUBRICS.md). Paper evidence (preprint + official code) is in [`papers/`](papers/).
```

with:

```markdown
**Rubrics:** v1 letters in this file are historical. Scoring rules are in [`RUBRICS.md`](RUBRICS.md). Scored rows and calibration are in [`GRADE_BOARD.md`](GRADE_BOARD.md). Paper evidence (preprint + official code) is in [`papers/`](papers/).
```

- [ ] **Step 7: Paper-file grade-board pointers**

In `papers/gepa.md`, `papers/ace.md`, `papers/dgm.md`, and `papers/hgm.md`, change the grade-board link target from `RUBRICS.md` to `GRADE_BOARD.md`. Keep the words “grade board.”

Exact lines after the edit:

`papers/gepa.md`:

```markdown
Letters match the [`GRADE_BOARD.md`](../GRADE_BOARD.md) grade board. The preprint does **not** contain AIME / LiveBench-Math splits or an adversarial AIME prepend; those rows are not graded.
```

`papers/ace.md`:

```markdown
Letters match the [`GRADE_BOARD.md`](../GRADE_BOARD.md) grade board. Do not average online into the B+.
```

`papers/dgm.md`:

```markdown
Letters match the [`GRADE_BOARD.md`](../GRADE_BOARD.md) grade board.
```

`papers/hgm.md`:

```markdown
Letters match the [`GRADE_BOARD.md`](../GRADE_BOARD.md) grade board.
```

Then:

```bash
rg -n 'grade board' papers/*.md
git diff -- papers/gepa.md papers/ace.md papers/dgm.md papers/hgm.md
```

Expected: no remaining `RUBRICS.md` grade-board pointer. Diff is the pointer sentence only; experiment tables unchanged. If another `papers/*.md` still says “grade board” with `RUBRICS.md`, retarget that sentence the same way.

- [ ] **Step 8: Commit**

```bash
git add README.md AGENTS.md papers/README.md REPORT.md GRADES_ROUND2.md PEDANTIC_CORRECTION_PASS.md papers/gepa.md papers/ace.md papers/dgm.md papers/hgm.md
git commit -m "$(cat <<'EOF'
Point entry files at RUBRICS.md for rules and GRADE_BOARD.md for letters.

Keep paper grade tables unchanged; only the live-path sentences move.
EOF
)"
```

If `git add` reports an extra paper file because Step 7 found another pointer, include it in this commit and mention it in the body.

---

### Task 4: Done-when checks

**Files:** none unless a check fails — then fix only the named file.

- [ ] **Step 1: Board letters vs `main`**

```bash
python3 << 'PY'
import re
from pathlib import Path
import subprocess

def experiment_letter_rows(text):
    text = text[text.index("### Experiment grades"):]
    rows = []
    for line in text.splitlines():
        if not line.startswith("| "):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 6 or cells[0] == "Experiment":
            continue
        rows.append((cells[0], cells[2], cells[3], cells[4], cells[5]))
    return rows

old = subprocess.check_output(["git", "show", "main:RUBRICS.md"], text=True)
new = Path("GRADE_BOARD.md").read_text()
a, b = experiment_letter_rows(old), experiment_letter_rows(new)
assert a == b, [(x,y) for x,y in zip(a,b) if x!=y][:5]
print(f"ok {len(a)} rows match main")
PY
```

Expected: `ok N rows match main`.

- [ ] **Step 2: Rules coverage and firewall**

```bash
test -f GRADE_BOARD.md && test -f RUBRICS.md
rg -n 'Nock-100|Plover Lab|Stencil|Rookery|Latchkey|Plumb' RUBRICS.md
rg -n 'What the proposer saw|Letter from what remains|The level-2 experiment' RUBRICS.md
rg -nw 'PromptBreeder|GPTSwarm|DiscoPOP|ADAS|AFlow|AgentSquare|Gödel|Self-Developing|MaAS|GEPA|ACE|MASS|ShinkaEvolve|DGM|HGM' RUBRICS.md || true
rg -n '\bSTOP\b|\bCMP\b|MIPROv2|LRML' RUBRICS.md || true
```

Expected: files exist; lab names present; recipe phrases present; paper-name grep empty.

- [ ] **Step 3: Pointers**

```bash
rg -n 'GRADE_BOARD.md' README.md AGENTS.md papers/README.md REPORT.md GRADES_ROUND2.md PEDANTIC_CORRECTION_PASS.md papers/gepa.md papers/ace.md papers/dgm.md papers/hgm.md
rg -n 'grade board' papers/*.md
```

Expected: every listed file mentions `GRADE_BOARD.md`. No paper file still points at `RUBRICS.md` for the grade board.

- [ ] **Step 4: Paper tables and out-of-scope files**

```bash
git diff main -- papers/gepa.md papers/ace.md papers/dgm.md papers/hgm.md
git diff main -- BENCHMARKS.md UPSTREAM_BENCHMARKS.md papers/stop.md papers/adas.md
```

Expected: the four paper diffs are pointer sentences only (no table letter changes). `BENCHMARKS.md`, `UPSTREAM_BENCHMARKS.md`, and other paper files show no diff.

- [ ] **Step 5: Commit only if a check forced a fix**

If all checks passed, do not make an empty commit.

---

## Self-review (spec coverage)

| Spec section | Task |
|---|---|
| Split; letters frozen | 1, 4 |
| `GRADE_BOARD.md` move, byte-identical tables | 1 |
| `RUBRICS.md` recipe, lab, worksheets, cap sketches | 2 |
| Official-set rule without mix-up table | 2 |
| Cohort-name firewall | 2, 4 |
| Pointers; AGENTS layout bullet | 3 |
| PEDANTIC one live-path sentence | 3 |
| Paper tables unchanged | 3, 4 |
| No new cutoffs; no re-grade; no extra fake papers | 2 (body) |
| Historical `docs/superpowers/` specs/plans | not edited |
