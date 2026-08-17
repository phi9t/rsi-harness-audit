# Report-driven rubric upgrade and regrade — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fold `REPORT.md` into the four-axis recipe, re-run every experiment row, rewrite the 16 paper files as evidence, then merge onto one official board.

**Architecture:** Recipe first (`RUBRICS.md` only). Then score into `GRADES_ROUND2.md`. Then rewrite `papers/*.md`. Then fold letters and the change log into `GRADE_BOARD.md` and turn `GRADES_ROUND2.md` back into a pointer. `REPORT.md` body stays frozen; banner updates at merge. Do not copy §2.0 letters.

**Tech Stack:** Markdown in `/Users/phi9t/rsi-harness-audit`. No new runtime.

**Spec:** `docs/superpowers/specs/2026-08-17-report-rubric-regrade-design.md`

---

## File map

| File | Responsibility |
|---|---|
| Modify: `RUBRICS.md` | Glossary, hygiene, object taxonomy ceilings, Stencil-peek sketch, worksheet fields. Plover Lab only. |
| Rewrite: `GRADES_ROUND2.md` | Working scored record during the round; pointer again after merge |
| Modify: `GRADE_BOARD.md` | Untouched until merge; then the official scored record |
| Modify: `papers/*.md` (16 grade cards) | Protocol, train/test, artifact, verdict; tables match the board |
| Unchanged as a grade table | `papers/gepa-loop.md` |
| Modify: `papers/README.md`, `README.md`, `AGENTS.md`, `REPORT.md` banner | After merge |
| Optional one line | `PEDANTIC_CORRECTION_PASS.md` |
| Unchanged | `benchmarks/`, `BENCHMARKS.md`, `UPSTREAM_BENCHMARKS.md`, `REPORT.md` body, historical specs except this spec/plan |

## Frozen until Task 3

Do not edit Eval / Search / Object / RSI letters in `GRADE_BOARD.md` or `papers/` until the recipe commit exists.

## Cohort-name firewall (`RUBRICS.md` only)

After Task 1, `RUBRICS.md` must not contain as whole words: PromptBreeder, GPTSwarm, DiscoPOP, ADAS, AFlow, AgentSquare, Gödel, Self-Developing, MaAS, GEPA, ACE, MASS, ShinkaEvolve, DGM, HGM. Do not write `STOP` in all caps. Also absent: CMP, MIPROv2, LRML, SWE-bench, HotpotQA, AIME, MATH, AppWorld.

---

### Task 1: Upgrade `RUBRICS.md`

**Files:**
- Modify: `RUBRICS.md`

- [ ] **Step 1: Add glossary entries after the RSI glossary bullet**

Insert after the Recursive self-improvement paragraph (before the `---` that precedes `## The three grades`):

```markdown
**Researcher-level test monitoring.** The searcher is nominally driven by training or validation, but the paper plots test after every iteration, chooses defaults on test, or scores every candidate on test before freeze. Stencil-peek: parent pick uses the 20 val items; Figure 4 still plots the 40 test items each generation. That does not prove the optimizer ate test labels. It blocks Eval A and the “untouched confirmatory” reading. It is not automatic D.

**Outer-loop search variance.** The uncertainty that matters for “the method finds better agents” is \(\operatorname{Var}_s[Q(\operatorname{Search}(s))]\): rerun the *complete* search. Rookery’s ± over three executions of one chosen graph is not this quantity.

**Reported-gain split.** A headline delta is artifact + test-time compute + model substitution + selection noise + benchmark exposure + baseline mismatch. Rookery’s 10-call graph vs one-call prompting mixes artifact with extra calls. Writer-Large writing a policy for Solver-Small mixes artifact with model substitution.

**Winner’s curse.** After \(K\) adaptive queries, the selected \(\widehat q_{k^*}\) is biased high even if all candidates are equal. Plumb screens about 100 formulas on Click-Pref and reports only TwistB from one pipeline.

**Granularity.** When one task is a large fraction of the reported percentage, unpaired aggregates cannot carry a close call. Nock-100 test is 40 items, so one item is 2.5 points.
```

- [ ] **Step 2: Tighten the ± hygiene row and add three hygiene rows**

In `### 5. Remaining hygiene (binary)`, replace the **The ± is about search** row with:

```markdown
| **The ± is about search** | Error bars over independent complete searches, i.e. an estimate of \(\operatorname{Var}_s[Q(\operatorname{Search}(s))]\). | Rookery ± is three test executions of one chosen graph. That answers “would this harness get a different score if we resampled answers?”, not “would another search find an equally good harness?” |
```

Add after **Name the protocol**:

```markdown
| **Test monitoring** | Test identities, labels, traces, and aggregate scores stay unused until the search is frozen. No test curves during search, no defaults chosen on test, no “every candidate on test” plot used as a result. | Stencil-peek: val selects the winner; the paper still plots the 40 test items after every generation. Blocks A. Not D if selection was val-only. A test-oracle envelope is not an A-axis item for B+. |
| **Reported gain is the artifact** | The comparison isolates the named object from extra calls, a stronger model, and extra exposure. | Rookery 10-call graph vs one-call prompting; Writer-Large / Solver-Small sold as one harness. Fail compute-match as well. |
| **Granularity** | If one task is ≥1 percentage point of the reported score, the binding reason states the task count (Nock-100 test: 40 items, one item = 2.5 points). | A 2-point gap on 40 items is one task. Unpaired percentages cannot carry that close call. |
```

Honest-selection already covers branded-favorite. Extend its fail cell with: “Plumb also reports only the best lineage from one 100-candidate search (winner’s curse).”

- [ ] **Step 3: Add object taxonomy ceilings**

In **Hard caps on the evolved object**, after the existing bullets, add:

```markdown
Object taxonomy (ceiling, not a separate grade). Parameter tuning, known-component composition, or textbook rediscovery → at most **C**. Task-specific engineering without add/remove isolation → at most **C+**. A mechanistically new artifact (new formula or primitive not reducible to the supplied menu) may enter the B band. Recursive research improvement is an RSI question, not an object letter.
```

- [ ] **Step 4: Add the Stencil-peek cap sketch**

After **See 2 vs A.** in Hard-cap sketches, insert:

```markdown
**Test monitoring (Stencil-peek).** Stencil still selects on the 20 val items, but the paper plots the 40 test items after every generation and highlights the best test point. Eval cannot be A. Plus cannot be claimed from that envelope. Not D: the optimizer did not receive test labels.
```

- [ ] **Step 5: Extend the worksheet**

Add these lines before `Hard caps:`:

```text
Test monitoring (test plotted / defaults on test / every candidate on test)?:
Gain split (artifact / extra calls / stronger model / exposure / mixed)?:
One task equals how many points on the reported set?:
Object taxonomy (1 tuning … 6 RSI, not object)?:
```

- [ ] **Step 6: Firewall grep**

```bash
rg -n 'PromptBreeder|GPTSwarm|DiscoPOP|ADAS|AFlow|AgentSquare|Gödel|Self-Developing|MaAS|GEPA|ACE|MASS|ShinkaEvolve|\bDGM\b|\bHGM\b|\bSTOP\b|CMP|MIPROv2|LRML|SWE-bench|HotpotQA|AIME|\bMATH\b|AppWorld' RUBRICS.md
```

Expected: no matches. If `STOP` matches as the English verb in lowercase, that is allowed; all-caps `STOP` is not.

- [ ] **Step 7: Commit**

```bash
git add RUBRICS.md
git commit -m "$(cat <<'EOF'
Add report-derived hygiene to the scoring recipe.

Map researcher test monitoring, search variance, gain split, and object taxonomy onto Plover Lab without naming the cohort.
EOF
)"
```

---

### Task 2: Open the working board

**Files:**
- Modify: `GRADES_ROUND2.md`

- [ ] **Step 1: Replace the stub with a working-board skeleton**

Keep the pointer sentence at the top that rules live in `RUBRICS.md`. Then add:

- Status: working record for the 17 August 2026 round; not official until merge
- Empty glance table with the 16 papers (copy names/links from `GRADE_BOARD.md`; leave letters as `pending`)
- Section `## Change log` (old → new → recipe step)
- Section `## Held` (row kept, recipe step)
- Section `## Experiment grades` with the same four family headings as `GRADE_BOARD.md`, rows copied with letters still the pre-round values marked `old`, to be replaced per paper

Copy experiment row *names* and See values from `GRADE_BOARD.md`. Do not present those old letters as the new official board.

- [ ] **Step 2: Commit**

```bash
git add GRADES_ROUND2.md
git commit -m "$(cat <<'EOF'
Open GRADES_ROUND2.md as the working scored record.

Official letters stay on GRADE_BOARD.md until this round merges.
EOF
)"
```

---

### Task 3: Regrade prompt and context rows

**Files:**
- Modify: `GRADES_ROUND2.md`
- Read: `RUBRICS.md`, `papers/promptbreeder.md`, `papers/gepa.md`, `papers/gepa-loop.md`, `papers/ace.md`, `REPORT.md` §2.1 / §2.11 / §2.12, `PEDANTIC_CORRECTION_PASS.md` as v1 evidence

Rows: PromptBreeder arithmetic/GSM8K; GEPA main; GEPA KernelBench; ACE offline; ACE online.

- [ ] **Step 1: Fill a worksheet mentally for each row; write the new letters and binding reason**

Apply see-level, then caps, then new hygiene (test monitoring, gain split, granularity, winner’s curse). Official preprint/code beats `REPORT.md`. §2.0 is not a target.

Likely recipe pressure (not pre-assigned letters): ACE offline test-based sensitivity may fail test-monitoring; GEPA test-oracle envelopes cannot support B+ plus; GEPA KernelBench stays See 3.

- [ ] **Step 2: Update glance Best/Headline for those three papers**

- [ ] **Step 3: Append change-log or held lines**

- [ ] **Step 4: Commit**

```bash
git add GRADES_ROUND2.md
git commit -m "$(cat <<'EOF'
Regrade PromptBreeder, GEPA, and ACE under the upgraded recipe.

EOF
)"
```

---

### Task 4: Regrade workflow rows

**Files:**
- Modify: `GRADES_ROUND2.md`
- Read: `papers/gptswarm.md`, `papers/adas.md`, `papers/aflow.md`, `papers/agentsquare.md`, `papers/maas.md`, `papers/mass.md`, `REPORT.md` §2.2 / §2.5–2.7 / §2.10 / §2.13

Rows: GPTSwarm MiniCrosswords, HumanEval, MMLU, GAIA n/a; ADAS; AFlow; AgentSquare; MaAS; MASS.

- [ ] **Step 1: Re-run each row**

Pressure: ADAS every-candidate-on-test is test monitoring (not automatic D); AFlow See 2-rewrite stays B− unless two other misses change; MaAS no distinct val may fail protocol-name / honest-population; MASS granularity on 100-example tests.

- [ ] **Step 2: Change log or held; update glance**

- [ ] **Step 3: Commit**

```bash
git add GRADES_ROUND2.md
git commit -m "$(cat <<'EOF'
Regrade workflow-search papers under the upgraded recipe.

EOF
)"
```

---

### Task 5: Regrade self-editing rows

**Files:**
- Modify: `GRADES_ROUND2.md`
- Read: `papers/stop.md`, `papers/godel-agent.md`, `papers/dgm.md`, `papers/hgm.md`, `REPORT.md` §2.3 / §2.8 / §2.15 / §2.16

- [ ] **Step 1: Re-run STOP (main + transfer), Gödel (main, free n/a, Game of 24), DGM (SWE, Polyglot extra, SWE→Polyglot), HGM (60-slice, 500, Lite-207, GPT-5 mixed, error-resolution object)**

Pressure: Gödel free stays dropped from same-model tables; DGM See 4 stays D for SWE; HGM CMP stays Search not RSI 2; error-resolution stays object D if the skip-return is confirmed.

- [ ] **Step 2: Change log or held; update glance**

- [ ] **Step 3: Commit**

```bash
git add GRADES_ROUND2.md
git commit -m "$(cat <<'EOF'
Regrade STOP, Gödel Agent, DGM, and HGM under the upgraded recipe.

EOF
)"
```

---

### Task 6: Regrade objective and algorithm rows

**Files:**
- Modify: `GRADES_ROUND2.md`
- Read: `papers/discopop.md`, `papers/self-developing.md`, `papers/shinkaevolve.md`, `REPORT.md` §2.4 / §2.9 / §2.14

- [ ] **Step 1: Re-run DiscoPOP, Self-Developing, ShinkaEvolve (packing, AIME-2024, year transfer, ALE, MoE)**

Pressure: DiscoPOP branded favorite vs fitness winner (object B− unless tables change the story); Shinka MoE paper/code τ mismatch is a reproducibility fact in the binding reason, not a silent object A; packing stays checkable-math exception.

- [ ] **Step 2: Change log or held; update glance**

- [ ] **Step 3: Commit**

```bash
git add GRADES_ROUND2.md
git commit -m "$(cat <<'EOF'
Regrade DiscoPOP, Self-Developing, and ShinkaEvolve under the upgraded recipe.

EOF
)"
```

---

### Task 7: Calibrate the working board

**Files:**
- Modify: `GRADES_ROUND2.md`

- [ ] **Step 1: Rewrite Eval / Search / Object / RSI ladders and close calls so the same letter is the same kind of miss**

Every letter that appears needs at least one binding example. Empty A / RSI 2–3 remain allowed.

- [ ] **Step 2: Refresh how-to-cite and what-would-move-a-letter from the new letters**

- [ ] **Step 3: Commit**

```bash
git add GRADES_ROUND2.md
git commit -m "$(cat <<'EOF'
Calibrate round-2 letters so the same miss is the same letter.

EOF
)"
```

---

### Task 8: Rewrite paper files (prompt/context)

**Files:**
- Modify: `papers/promptbreeder.md`, `papers/gepa.md`, `papers/ace.md`
- Unchanged as a grade table: `papers/gepa-loop.md`

Each file must contain: experiments table matching `GRADES_ROUND2.md`; reconstructable protocol; train/test audit; artifact audit (taxonomy 1–6); precise verdict; control flow if official code; cite as / do not cite as. Paper facts. No pasted `REPORT.md`.

- [ ] **Step 1: Rewrite PromptBreeder (preprint only)**
- [ ] **Step 2: Rewrite GEPA (keep loop article pointer; letters from working board)**
- [ ] **Step 3: Rewrite ACE**
- [ ] **Step 4: Commit**

```bash
git add papers/promptbreeder.md papers/gepa.md papers/ace.md
git commit -m "$(cat <<'EOF'
Rewrite PromptBreeder, GEPA, and ACE evidence to the round-2 letters.

EOF
)"
```

---

### Task 9: Rewrite paper files (workflows)

**Files:**
- Modify: `papers/gptswarm.md`, `papers/adas.md`, `papers/aflow.md`, `papers/agentsquare.md`, `papers/maas.md`, `papers/mass.md`

Re-read official repos only if a letter or a report claim depends on search/mutation/eval/promotion. MASS: preprint only.

- [ ] **Step 1–6: One file each, same section list as Task 8**
- [ ] **Step 7: Commit**

```bash
git add papers/gptswarm.md papers/adas.md papers/aflow.md papers/agentsquare.md papers/maas.md papers/mass.md
git commit -m "$(cat <<'EOF'
Rewrite workflow-search paper files to the round-2 letters.

EOF
)"
```

---

### Task 10: Rewrite paper files (self-editing)

**Files:**
- Modify: `papers/stop.md`, `papers/godel-agent.md`, `papers/dgm.md`, `papers/hgm.md`

- [ ] **Step 1–4: One file each**
- [ ] **Step 5: Commit**

```bash
git add papers/stop.md papers/godel-agent.md papers/dgm.md papers/hgm.md
git commit -m "$(cat <<'EOF'
Rewrite STOP, Gödel Agent, DGM, and HGM evidence to the round-2 letters.

EOF
)"
```

---

### Task 11: Rewrite paper files (objectives)

**Files:**
- Modify: `papers/discopop.md`, `papers/self-developing.md`, `papers/shinkaevolve.md`

Self-Developing: preprint only. ShinkaEvolve MoE: record paper vs code threshold in the artifact audit if it still matters.

- [ ] **Step 1–3: One file each**
- [ ] **Step 4: Commit**

```bash
git add papers/discopop.md papers/self-developing.md papers/shinkaevolve.md
git commit -m "$(cat <<'EOF'
Rewrite DiscoPOP, Self-Developing, and ShinkaEvolve evidence to the round-2 letters.

EOF
)"
```

---

### Task 12: Merge onto `GRADE_BOARD.md` and freeze

**Files:**
- Modify: `GRADE_BOARD.md`, `GRADES_ROUND2.md`, `papers/README.md`, `README.md`, `AGENTS.md`, `REPORT.md` (banner only)
- Optional: `PEDANTIC_CORRECTION_PASS.md` one live-path sentence

- [ ] **Step 1: Confirm paper glance letters match `GRADES_ROUND2.md`**

```bash
python3 << 'PY'
from pathlib import Path
import re

def glance_from_board(path, header_prefix="| Paper"):
    text = Path(path).read_text()
    rows = {}
    in_table = False
    for line in text.splitlines():
        if line.startswith(header_prefix) or line.startswith("| Paper | Best Eval"):
            in_table = True
            continue
        if in_table:
            if not line.startswith("|"):
                break
            if re.match(r"\|[-: ]+\|", line):
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) >= 5:
                name = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cells[0]).strip()
                rows[name] = tuple(cells[1:5])
    return rows

board = glance_from_board("GRADES_ROUND2.md")
papers = glance_from_board("papers/README.md")
# papers/README has Best Eval, Search, Object, RSI (no Headline)
mismatch = []
for name, prow in papers.items():
    brow = board.get(name)
    if not brow:
        mismatch.append(f"missing on working board: {name}")
        continue
    # board: Best Eval, Headline Eval, Search, Object, RSI — compare Best, Search, Object, RSI
    if (prow[0], prow[1], prow[2], prow[3]) != (brow[0], brow[2], brow[3], brow[4] if len(brow) > 4 else ""):
        mismatch.append(f"{name}: papers={prow} board_best/search/object/rsi={(brow[0], brow[2], brow[3], brow[4] if len(brow)>4 else None)}")
if mismatch:
    print("\n".join(mismatch))
    raise SystemExit(1)
print(f"ok {len(papers)} papers")
PY
```

Expected: `ok 16 papers`. Fix tables until it passes.

- [ ] **Step 2: Copy working glance, experiment rows, how-to-cite, calibration, change log, what-would-move into `GRADE_BOARD.md`**

Keep the mix-up table (official suite vs slice). Replace “No letter moved” with this round’s change log.

- [ ] **Step 3: Restore `GRADES_ROUND2.md` as a pointer** (same shape as today’s stub, naming `GRADE_BOARD.md`)

- [ ] **Step 4: Update `papers/README.md` glance letters; `REPORT.md` banner (board wins; capture was evidence for this round); `AGENTS.md` freeze until the next requested round**

- [ ] **Step 5: Confirm `benchmarks/` is untouched**

```bash
git diff --stat -- benchmarks/
```

Expected: empty.

- [ ] **Step 6: Commit**

```bash
git add GRADE_BOARD.md GRADES_ROUND2.md papers/README.md README.md AGENTS.md REPORT.md PEDANTIC_CORRECTION_PASS.md
git commit -m "$(cat <<'EOF'
Merge round-2 letters onto GRADE_BOARD.md and freeze them.

EOF
)"
```

---

## Done when

Matches spec §11: recipe firewall holds; every pre-round row has a working counterpart then a merged counterpart; one official board; 16 grade cards have the four evidence sections; `REPORT.md` body unchanged except banner; `benchmarks/` clean.
