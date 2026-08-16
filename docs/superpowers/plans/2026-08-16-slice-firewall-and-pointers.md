# Slice Firewall and Entry-Point Pointers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the two-file benchmark layout true at every entry point, group the 47 map cards, and add rubric wording so a cohort slice cannot be read as the official task set, without moving any letter.

**Architecture:** Insert `##` group headings in `UPSTREAM_BENCHMARKS.md` (cards stay `###`). Replace leftover “suites live in BENCHMARKS.md” lines with a two-file pointer. Add one rubric section immediately before the grade board. Do not re-fetch, do not add a 48th bench, do not edit the 16 paper files or the v1 trail.

**Tech Stack:** Markdown in `/Users/phi9t/rsi-harness-audit`. Closed-list check is the existing Python `^### ` assert. No new runtime.

**Spec:** `docs/superpowers/specs/2026-08-16-slice-firewall-and-pointers-design.md`

---

## File map

| File | Responsibility |
|---|---|
| Modify: `UPSTREAM_BENCHMARKS.md` | Five group `##` headings; CIMemories first-use; AST glossary first-use |
| Modify: `BENCHMARKS.md` | One Official-vs-map sentence under “How to read a row” |
| Modify: `RUBRICS.md` | Grade-board pointer; new slice section; no letter or table-number edits |
| Modify: `papers/README.md` | Two-file pointer |
| Modify: `REPORT.md` | Two-file pointer |
| Unchanged | `README.md` (already names both files), `AGENTS.md`, `papers/*.md` except `papers/README.md`, `PEDANTIC_CORRECTION_PASS.md` |

## Frozen letters

Do not change Eval / Search / Object / RSI letters, plus/minus rules, Eval level table, or calibration numbers. In `RUBRICS.md`, the only grade-board edit is the pointer sentence under `## Grade board`. Everything from `**Cite the row, not the PDF.**` through the end of `## Cohort calibration` stays byte-identical except that one pointer line (which sits *above* “Cite the row”).

## Closed-list check (run after map edits)

```bash
python3 - << 'PY'
from pathlib import Path
import re
text = Path('/Users/phi9t/rsi-harness-audit/UPSTREAM_BENCHMARKS.md').read_text()
heads = re.findall(r'^### (.+)$', text, re.M)
print('card count', len(heads))
print('\n'.join(heads))
assert len(heads) == 47, len(heads)
assert sum(1 for h in heads if 'BEAM' in h) == 1
assert not any('Siren' in h for h in heads)
assert not any('With Skills' in h for h in heads)
for name in ('General agents', 'Coding', 'Multimodal, safety, and reasoning',
             'Coverage: tools, web, and computer',
             'Coverage: coding, research, long context, and frontier'):
    assert f'## {name}' in text, name
print('closed list ok')
PY
```

Expected: `card count 47` and `closed list ok`.

---

### Task 1: Two-file pointers

**Files:**
- Modify: `RUBRICS.md` (grade-board pointer only)
- Modify: `papers/README.md`
- Modify: `REPORT.md`
- Modify: `BENCHMARKS.md` (“How to read a row” only)

- [ ] **Step 1: Confirm README needs no edit**

```bash
rg -n 'BENCHMARKS|UPSTREAM_BENCHMARKS' /Users/phi9t/rsi-harness-audit/README.md
```

Expected: both files already appear in the table. Do not edit `README.md`.

- [ ] **Step 2: Replace the grade-board pointer in `RUBRICS.md`**

Replace this exact line (under `## Grade board (code-checked 16 August 2026)`):

```markdown
Letters live here. Evidence lives in [`papers/`](papers/). Upstream suite notes live in [`BENCHMARKS.md`](BENCHMARKS.md).
```

with:

```markdown
Letters live here. Evidence lives in [`papers/`](papers/). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Official task sets, pins, and L/R live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).
```

Do not touch any other line in the grade board.

- [ ] **Step 3: Replace the pointer in `papers/README.md`**

Replace:

```markdown
One file per paper. Letters and calibration live in [`RUBRICS.md`](../RUBRICS.md). Suites and upstream SOTA live in [`BENCHMARKS.md`](../BENCHMARKS.md).
```

with:

```markdown
One file per paper. Letters and calibration live in [`RUBRICS.md`](../RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](../BENCHMARKS.md). Official task sets, pins, and L/R live in [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md).
```

- [ ] **Step 4: Replace the pointer in `REPORT.md`**

Replace:

```markdown
The paper-by-paper report now lives in [`papers/`](papers/). Letters, ceilings, and calibration live in [`RUBRICS.md`](RUBRICS.md). Upstream suites live in [`BENCHMARKS.md`](BENCHMARKS.md).
```

with:

```markdown
The paper-by-paper report now lives in [`papers/`](papers/). Letters, ceilings, and calibration live in [`RUBRICS.md`](RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Official task sets, pins, and L/R live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).
```

- [ ] **Step 5: Replace the Official bullet in `BENCHMARKS.md`**

Under `## How to read a row`, replace the existing **Official** bullet (keep **This cohort** and **Upstream SOTA** unchanged):

```markdown
- **Official** is the maintainer page or paper that defines the split. If the suite is one of the 47 in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md), that card is the definition; otherwise the Official column here is the definition.
```

- [ ] **Step 6: Confirm leftover one-file claims are gone**

```bash
rg -n 'live in.*BENCHMARKS' /Users/phi9t/rsi-harness-audit/RUBRICS.md /Users/phi9t/rsi-harness-audit/papers/README.md /Users/phi9t/rsi-harness-audit/REPORT.md
```

Expected: no remaining line that says official suites live only in `BENCHMARKS.md`.

- [ ] **Step 7: Commit**

```bash
git add RUBRICS.md papers/README.md REPORT.md BENCHMARKS.md
git commit -m "$(cat <<'EOF'
Point entry files at both the cohort slice file and the official map.

EOF
)"
```

---

### Task 2: Group the 47 cards

**Files:**
- Modify: `UPSTREAM_BENCHMARKS.md`

Insert `##` headings. Do not reshuffle cards. Do not add `###` group names (that would break the 47-count). Do not edit card bodies in this task.

- [ ] **Step 1: Insert the five group headings**

After the stub under `## Cards`:

```markdown
## Cards

Cards follow. Each was checked against the official page on the fetch date. Sketches are not real items.

### MCP Atlas
```

insert `## General agents` so it reads:

```markdown
## Cards

Cards follow. Each was checked against the official page on the fetch date. Sketches are not real items.

## General agents

### MCP Atlas
```

Immediately before `### SWE-bench Pro` insert:

```markdown
## Coding

```

Immediately before `### CharXiv` insert:

```markdown
## Multimodal, safety, and reasoning

```

Immediately before `### GAIA` (the original 466-question suite, not `### GAIA2`) insert:

```markdown
## Coverage: tools, web, and computer

```

Immediately before `### LiveCodeBench` insert:

```markdown
## Coverage: coding, research, long context, and frontier

```

Leave `## Operational ladder`, `## Capability tracks`, and `## How to keep the authors’ definition` where they are.

- [ ] **Step 2: Run the closed-list check** (the Python block in the plan header)

Expected: `card count 47` and `closed list ok`.

- [ ] **Step 3: Commit**

```bash
git add UPSTREAM_BENCHMARKS.md
git commit -m "$(cat <<'EOF'
Group the 47 upstream cards under five section headings.

EOF
)"
```

---

### Task 3: Map wording nits

**Files:**
- Modify: `UPSTREAM_BENCHMARKS.md`

Do not re-fetch. Do not change Success, Size/pin, or Level numbers.

- [ ] **Step 1: Fix the AST glossary row**

Replace:

```markdown
| AST | Call structure, not a string match. BFCL V4 scores single-turn live/non-live this way. |
```

with:

```markdown
| AST | Call structure, not a string match. The Berkeley Function-Calling Leaderboard V4 (BFCL V4) scores single-turn live/non-live this way. |
```

- [ ] **Step 2: Fix CIMemories Given first-use**

Replace the **Given:** line on the CIMemories card with:

```markdown
**Given:** A synthetic user memory dump (natural-language statements about personal attributes) plus a task and a recipient (for example, write to a physician). Each attribute is labeled necessary or inappropriate for that task; unlabeled pairs are dropped when the paper’s privacy personas disagree — three Westin-style attitude prompts (fundamentalist, pragmatic, unconcerned) that must agree before a pair is scored. The same fact can be required in one context and banned in another. Reported runs concatenate memories as a prefix; they do not update a live store mid-task.
```

Do not add a glossary row for privacy personas. Success (violation vs completeness) stays.

- [ ] **Step 3: Re-run the closed-list check** (same Python as the plan header)

Expected: still `card count 47` and `closed list ok`.

- [ ] **Step 4: Commit**

```bash
git add UPSTREAM_BENCHMARKS.md
git commit -m "$(cat <<'EOF'
Expand AST and CIMemories first-use wording on the map.

EOF
)"
```

---

### Task 4: Rubric slice section

**Files:**
- Modify: `RUBRICS.md`

- [ ] **Step 1: Insert the section immediately before the grade board**

Find:

```markdown
Until a level-2 card is filled, RSI stays 0 or 1, including papers with "Gödel" in the title.

---

## Grade board (code-checked 16 August 2026)
```

Replace that block with:

```markdown
Until a level-2 card is filled, RSI stays 0 or 1, including papers with "Gödel" in the title.

---

## Official suite versus this experiment’s slice

The official task set (items, metric, version pin) for each of the 47 mapped suites is in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). What these 16 papers actually ran is in [`BENCHMARKS.md`](BENCHMARKS.md) and the paper file. A headline on a slice is not a score on the official set.

This is wording, not a new Eval ceiling. Letters on the grade board below do not move in this pass.

| Mix-up | Official fact | This cohort |
|---|---|---|
| SWE-bench Verified | 500 human-checked issues ([map](UPSTREAM_BENCHMARKS.md#swe-bench-verified)) | DGM/HGM bake-off is 60 (35 Django / 25 Sphinx). HGM’s 8,000-eval run is all 500, same-set, already Eval D |
| MATH | Not one of the 47; definition stays in [`BENCHMARKS.md`](BENCHMARKS.md) | AFlow / MaAS / MASS reuse a 617 level-5, four-category slice. MASS 60 val / 100 test. Not full MATH |
| GPQA Diamond | 198 Diamond / 448 main ([map](UPSTREAM_BENCHMARKS.md#gpqa-diamond)) | ADAS / Gödel val is 32 items |
| AIME | Map card is **AIME 2026** ([map](UPSTREAM_BENCHMARKS.md#aime-2026)). 2023/2024/2025 are different contests | ShinkaEvolve searches AIME 2024, then reports 2023/2025 |
| OSWorld | v1 is 369 Ubuntu tasks ([map](UPSTREAM_BENCHMARKS.md#osworld-v1)); 2.0 is 108 long workflows ([map](UPSTREAM_BENCHMARKS.md#osworld-20)) | These 16 papers did not run OSWorld. The two names are not one suite |
| GAIA vs GAIA2 | 466 short answers ([map](UPSTREAM_BENCHMARKS.md#gaia)) vs 800 event-driven scenarios ([map](UPSTREAM_BENCHMARKS.md#gaia2)) | Pin the name. Do not treat a vendor “GAIA” cell as GAIA2 |

Do not read the last two rows as cohort results. They exist so a pasted vendor table cannot merge the names.

---

## Grade board (code-checked 16 August 2026)
```

Do not edit the Eval level table, Discovery tables, RSI tables, plus/minus rules, or any grade-board row after the pointer sentence.

- [ ] **Step 2: Confirm letters did not move**

```bash
git diff HEAD -- RUBRICS.md
```

Expected: only (a) the Task 1 pointer line if this is a combined diff, and (b) the new section plus the `---` around it. No change to `| PromptBreeder` / `| DGM` / `| HGM` rows or to `## Cohort calibration`.

- [ ] **Step 3: Commit**

```bash
git add RUBRICS.md
git commit -m "$(cat <<'EOF'
State in the rubric that a cohort slice is not the official task set.

EOF
)"
```

---

### Task 5: Done-when checks

**Files:** none new; verify only. If a check fails, fix in the file that caused it, then re-commit that file. Do not “fix” by editing `papers/dgm.md` or `PEDANTIC_CORRECTION_PASS.md`.

- [ ] **Step 1: Pointer grep**

```bash
rg -n 'live in.*BENCHMARKS' /Users/phi9t/rsi-harness-audit/RUBRICS.md /Users/phi9t/rsi-harness-audit/papers/README.md /Users/phi9t/rsi-harness-audit/REPORT.md
```

Expected: no claim that official suites live only in `BENCHMARKS.md`.

- [ ] **Step 2: Closed-list Python** (plan header script)

Expected: `card count 47` and `closed list ok`.

- [ ] **Step 3: Forbidden-file diff vs the commit before Task 1**

```bash
git diff --stat origin/main -- papers/ PEDANTIC_CORRECTION_PASS.md
```

If `origin/main` does not include the spec-only commit, use `git merge-base HEAD origin/main` as the left side, or diff against the Task 1 parent. Expected: `papers/README.md` may appear; no other `papers/*.md`; `PEDANTIC_CORRECTION_PASS.md` absent.

If this pass’s commits sit on local `main` ahead of origin, also run:

```bash
git log --oneline origin/main..HEAD
git diff --stat origin/main -- papers/*.md PEDANTIC_CORRECTION_PASS.md README.md AGENTS.md
```

Expected: `README.md` and `AGENTS.md` unchanged by this pass; `papers/README.md` only among paper files.

- [ ] **Step 4: Commit only if a check forced a fix.** If all checks passed with a clean tree, do not make an empty commit.

---

## Spec coverage

| Spec section | Task |
|---|---|
| Pointers (§4) | 1 |
| BENCHMARKS Official-vs-map sentence (§3) | 1 |
| README only-if (§3) | 1 Step 1 (no edit) |
| AGENTS.md no change (§3) | 5 |
| Map grouping (§5) | 2 |
| CIMemories + AST nits (§6) | 3 |
| Rubric wording section (§7) | 4 |
| Letters frozen (§2, §7) | 4 Step 2, 5 |
| Closed list 47 (§5, §10) | 2, 3, 5 |
| Paper files and PEDANTIC untouched (§9, §10) | 5 |
| No re-fetch, no 48th, no canvases, no piece 2/3 (§9) | all tasks: do not do those |

## Placeholder scan

No TBD/TODO. Every replacement is the exact markdown to paste.
