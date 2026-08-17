# Benchmark Category Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 47 official task-set cards out of `UPSTREAM_BENCHMARKS.md` into five `benchmarks/*.md` category articles (essay + cards + cohort tail) so a reader can learn the frontier-eval set and contrast it with what these 16 papers ran.

**Architecture:** Root `UPSTREAM_BENCHMARKS.md` keeps glossary, L/R, a five-file table, a 47-name index with heading-anchor links, the operational ladder, capability tracks, and pin rules. Card bodies live once under `benchmarks/`. `BENCHMARKS.md` still owns slice rows and SOTA. Letters do not move.

**Tech Stack:** Markdown in `/Users/phi9t/rsi-harness-audit`. Closed-list check is Python over `^### ` headings. No new runtime, no re-fetch unless a moved card is wrong.

**Spec:** `docs/superpowers/specs/2026-08-16-benchmark-category-articles-design.md`

---

## File map

| File | Responsibility |
|---|---|
| Create: `benchmarks/README.md` | Folder pointer; five-file table with counts |
| Create: `benchmarks/general-agents.md` | Essay + 8 cards + cohort tail |
| Create: `benchmarks/coding.md` | Essay + 4 cards + cohort tail |
| Create: `benchmarks/multimodal-safety-reasoning.md` | Essay + 12 cards + cohort tail |
| Create: `benchmarks/tools-web-computer.md` | Essay + 10 cards + cohort tail |
| Create: `benchmarks/coding-research-context-frontier.md` | Essay + 13 cards + cohort tail |
| Modify: `UPSTREAM_BENCHMARKS.md` | Strip `###` bodies; add where-cards-live table + 47-name index |
| Modify: `BENCHMARKS.md` | Point at index and `benchmarks/` for card bodies |
| Modify: `README.md` | Name `benchmarks/` in the table |
| Modify: `AGENTS.md` | Cards live under `benchmarks/`; root file is the index |
| Modify: `papers/README.md` | Three-place pointer |
| Modify: `REPORT.md` | Three-place pointer |
| Modify: `RUBRICS.md` | Slice-section anchors + grade-board pointer; no letters |
| Unchanged | `papers/promptbreeder.md` … `papers/hgm.md`, `PEDANTIC_CORRECTION_PASS.md` |

## Frozen letters

Do not change Eval / Search / Object / RSI letters, plus/minus rules, Eval level table, calibration numbers, or mix-up *facts* in the rubric slice table. Only retarget map links and the pointer sentences named in Task 8.

## Closed-list check (run after card moves)

```bash
python3 - << 'PY'
from pathlib import Path
import re
root = Path('/Users/phi9t/rsi-harness-audit')
up = (root / 'UPSTREAM_BENCHMARKS.md').read_text()
assert re.findall(r'^### ', up, re.M) == [], 'root still has ### cards'
files = {
    'general-agents.md': [
        'MCP Atlas', 'DeepSearchQA', 'τ-Knowledge / τ-Banking', 'WildClawBench',
        'GDPval', 'GAIA2', 'SkillsBench', 'OSWorld v1',
    ],
    'coding.md': [
        'SWE-bench Pro', 'SWE-bench Verified', 'Terminal-Bench 2.1', 'SciCode',
    ],
    'multimodal-safety-reasoning.md': [
        'CharXiv', 'ScreenSpot-Pro', 'OmniDocBench v1.5', 'MMMU-Pro', 'CIMemories',
        'AgentDojo', 'IFBench', 'AIME 2026', 'GPQA Diamond', "Humanity’s Last Exam",
        'AA-LCR', 'BEAM',
    ],
    'tools-web-computer.md': [
        'GAIA', 'Berkeley Function-Calling Leaderboard V4', 'ToolSandbox', 'τ-bench',
        'WebArena', 'VisualWebArena', 'AppWorld', 'MCP-Universe', 'BrowseComp',
        'OSWorld 2.0',
    ],
    'coding-research-context-frontier.md': [
        'LiveCodeBench', 'BigCodeBench', 'SWE-bench Multilingual', 'PaperBench',
        'ResearchClawBench', 'MathVista', 'Video-MMMU', 'LongBench v2', 'RULER',
        'LongMemEval-V2', 'AgentHarm', 'FrontierMath', 'ARC-AGI-2',
    ],
}
all_heads = []
for name, expected in files.items():
    text = (root / 'benchmarks' / name).read_text()
    heads = re.findall(r'^### (.+)$', text, re.M)
    assert heads == expected, (name, heads, expected)
    all_heads.extend(heads)
print('card count', len(all_heads))
assert len(all_heads) == 47, len(all_heads)
assert sum(1 for h in all_heads if 'BEAM' in h) == 1
assert not any('Siren' in h for h in all_heads)
assert not any('With Skills' in h for h in all_heads)
print('closed list ok')
PY
```

Expected: `card count 47` and `closed list ok`.

GitHub heading slugs (used in the 47-name index and rubric links): lowercase; strip characters that are not letters, digits, spaces, underscores, or hyphens (keep Unicode letters such as `τ`); collapse spaces and hyphens. `OSWorld 2.0` → `osworld-20`. `Humanity’s Last Exam` (curly apostrophe) → `humanitys-last-exam`.

```python
import re
def github_slug(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s, flags=re.UNICODE)
    s = re.sub(r'[-\s]+', '-', s).strip('-')
    return s
```

---

### Task 1: Split cards into `benchmarks/`

**Files:**
- Create: `benchmarks/README.md`
- Create: `benchmarks/general-agents.md` (cards only; essay/tail in Task 3)
- Create: `benchmarks/coding.md` (cards only; essay/tail in Task 4)
- Create: `benchmarks/multimodal-safety-reasoning.md` (cards only; essay/tail in Task 5)
- Create: `benchmarks/tools-web-computer.md` (cards only; essay/tail in Task 6)
- Create: `benchmarks/coding-research-context-frontier.md` (cards only; essay/tail in Task 7)
- Modify: `UPSTREAM_BENCHMARKS.md` (delete card bodies in Task 2; this task only copies)

- [ ] **Step 1: Run the closed-list check before the folder exists**

Run the closed-list Python from the plan header.

Expected: FAIL (`benchmarks/general-agents.md` missing, or root still has 47 `###` if you only create empty files). Do not edit `papers/*.md` except `papers/README.md` later.

- [ ] **Step 2: Split current `##` groups into five files**

Run this once. It copies card markdown; it does not rewrite cards. It does not delete the root cards yet (Task 2 does that, so a failed split can be retried from the still-intact map).

```bash
python3 - << 'PY'
from pathlib import Path
import re

root = Path('/Users/phi9t/rsi-harness-audit')
text = (root / 'UPSTREAM_BENCHMARKS.md').read_text()
out = root / 'benchmarks'
out.mkdir(exist_ok=True)

groups = [
    ('General agents', 'general-agents.md', 'General agents'),
    ('Coding', 'coding.md', 'Coding'),
    ('Multimodal, safety, and reasoning', 'multimodal-safety-reasoning.md', 'Multimodal, safety, and reasoning'),
    ('Coverage: tools, web, and computer', 'tools-web-computer.md', 'Tools, web, and computer'),
    ('Coverage: coding, research, long context, and frontier',
     'coding-research-context-frontier.md', 'Coding, research, long context, and frontier'),
]

# Slice from each ## group heading to the next ## heading
parts = re.split(r'^## ', text, flags=re.M)
by_title = {}
for part in parts[1:]:
    title, _, body = part.partition('\n')
    by_title[title.strip()] = body

header = '''# {title}

Official task sets for this family. Glossary, L/R definitions, and the 47-name index: [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). How these 16 papers used a slice: [`BENCHMARKS.md`](../BENCHMARKS.md).

## What this family measures

PLACEHOLDER_ESSAY

## Cards

'''

for src_title, filename, display_title in groups:
    body = by_title[src_title]
    # Drop a leading blank line; keep ### cards until end of this section
    cards = body.lstrip('\n')
    (out / filename).write_text(header.format(title=display_title) + cards.rstrip() + '\n\n## This cohort\n\nPLACEHOLDER_TAIL\n')
    print('wrote', filename, '### count', len(re.findall(r'^### ', cards, re.M)))
PY
```

Expected stdout:

```
wrote general-agents.md ### count 8
wrote coding.md ### count 4
wrote multimodal-safety-reasoning.md ### count 12
wrote tools-web-computer.md ### count 10
wrote coding-research-context-frontier.md ### count 13
```

- [ ] **Step 3: Write `benchmarks/README.md`**

```markdown
# Official task-set cards

Start at [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md) for the glossary, L/R ladder, and the 47-name index. Cards in this folder are the official task sets (items, environment, metric, pin). How these 16 papers used a slice, and SOTA pointers, stay in [`BENCHMARKS.md`](../BENCHMARKS.md).

Each card was checked against the official page on the fetch date. Sketches are not real items.

| File | Title | Cards |
|---|---|---|
| [general-agents.md](general-agents.md) | General agents | 8 |
| [coding.md](coding.md) | Coding | 4 |
| [multimodal-safety-reasoning.md](multimodal-safety-reasoning.md) | Multimodal, safety, and reasoning | 12 |
| [tools-web-computer.md](tools-web-computer.md) | Tools, web, and computer | 10 |
| [coding-research-context-frontier.md](coding-research-context-frontier.md) | Coding, research, long context, and frontier | 13 |
```

- [ ] **Step 4: Confirm membership (root still has cards; that is OK until Task 2)**

```bash
python3 - << 'PY'
from pathlib import Path
import re
root = Path('/Users/phi9t/rsi-harness-audit')
files = {
    'general-agents.md': 8,
    'coding.md': 4,
    'multimodal-safety-reasoning.md': 12,
    'tools-web-computer.md': 10,
    'coding-research-context-frontier.md': 13,
}
n = 0
for name, k in files.items():
    heads = re.findall(r'^### (.+)$', (root / 'benchmarks' / name).read_text(), re.M)
    assert len(heads) == k, (name, heads)
    n += k
assert n == 47
print('split ok', n)
PY
```

Expected: `split ok 47`.

- [ ] **Step 5: Commit**

```bash
git add benchmarks/README.md benchmarks/general-agents.md benchmarks/coding.md \
  benchmarks/multimodal-safety-reasoning.md benchmarks/tools-web-computer.md \
  benchmarks/coding-research-context-frontier.md
git commit -m "$(cat <<'EOF'
Copy the 47 official cards into five benchmarks/ category files.

Keep the root map intact until the index rewrite so a bad split can be retried.
EOF
)"
```

---

### Task 2: Turn `UPSTREAM_BENCHMARKS.md` into the index

**Files:**
- Modify: `UPSTREAM_BENCHMARKS.md`

- [ ] **Step 1: Point the opening at `benchmarks/`**

In the first paragraph block of `/Users/phi9t/rsi-harness-audit/UPSTREAM_BENCHMARKS.md`, replace:

```markdown
This file is the **task set** map: what the benchmark authors released, how they score it, and which version to pin. It is not a leaderboard and not a grade of the 16 papers.

How those papers used a slice (SWE 60, MATH 617, AIME 2024 in-sample) lives in [`BENCHMARKS.md`](BENCHMARKS.md).
```

with:

```markdown
This file is the **task set** map: glossary, L/R, and an index of 47 official suites. It is not a leaderboard and not a grade of the 16 papers.

Card bodies live under [`benchmarks/`](benchmarks/). How those papers used a slice (SWE 60, MATH 617, AIME 2024 in-sample) lives in [`BENCHMARKS.md`](BENCHMARKS.md).
```

- [ ] **Step 2: Replace `## Cards` through the line before `## Operational ladder (all 47)`**

Delete from `## Cards` through the last card (`ARC-AGI-2` body), keeping `## Operational ladder (all 47)` onward unchanged. Insert the generated index. Run:

```bash
python3 - << 'PY'
from pathlib import Path
import re

root = Path('/Users/phi9t/rsi-harness-audit')

def github_slug(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s, flags=re.UNICODE)
    s = re.sub(r'[-\s]+', '-', s).strip('-')
    return s

files = [
    ('benchmarks/general-agents.md', 'General agents'),
    ('benchmarks/coding.md', 'Coding'),
    ('benchmarks/multimodal-safety-reasoning.md', 'Multimodal, safety, and reasoning'),
    ('benchmarks/tools-web-computer.md', 'Tools, web, and computer'),
    ('benchmarks/coding-research-context-frontier.md', 'Coding, research, long context, and frontier'),
]

chunks = []
chunks.append('## Where the cards live\n')
chunks.append('Official cards (Given, Success, pin, sketch) are in these files. This page keeps names and L/R only.\n')
chunks.append('| File | Title | Cards |')
chunks.append('|---|---|---|')
chunks.append('| [`benchmarks/general-agents.md`](benchmarks/general-agents.md) | General agents | 8 |')
chunks.append('| [`benchmarks/coding.md`](benchmarks/coding.md) | Coding | 4 |')
chunks.append('| [`benchmarks/multimodal-safety-reasoning.md`](benchmarks/multimodal-safety-reasoning.md) | Multimodal, safety, and reasoning | 12 |')
chunks.append('| [`benchmarks/tools-web-computer.md`](benchmarks/tools-web-computer.md) | Tools, web, and computer | 10 |')
chunks.append('| [`benchmarks/coding-research-context-frontier.md`](benchmarks/coding-research-context-frontier.md) | Coding, research, long context, and frontier | 13 |')
chunks.append('')
chunks.append('## The 47 names\n')

for rel, title in files:
    text = (root / rel).read_text()
    chunks.append(f'#### {title}\n')
    chunks.append('| Official name | L/R |')
    chunks.append('|---|---|')
    heads = re.findall(r'^### (.+)$', text, re.M)
    for h in heads:
        # skip the category ### if any; category files use # title and ## Cards
        m = re.search(
            rf'^### {re.escape(h)}\n.*?^\*\*Level:\*\* (L\d\s*/\s*R\d)',
            text, re.M | re.S)
        assert m, h
        lr = re.sub(r'\s+', ' ', m.group(1))
        slug = github_slug(h)
        chunks.append(f'| [{h}]({rel}#{slug}) | {lr} |')
    chunks.append('')

new_mid = '\n'.join(chunks).rstrip() + '\n\n'

up_path = root / 'UPSTREAM_BENCHMARKS.md'
up = up_path.read_text()
start = up.index('## Cards\n')
end = up.index('## Operational ladder (all 47)\n')
up_path.write_text(up[:start] + new_mid + up[end:])
assert re.findall(r'^### ', up_path.read_text(), re.M) == []
print('index written; no ### on root')
PY
```

Expected: `index written; no ### on root`. Category names in the index are `####`, not task-set cards.

- [ ] **Step 3: Run the full closed-list check from the plan header**

Expected: `card count 47` and `closed list ok`.

- [ ] **Step 4: Spot-check rubric slugs**

```bash
python3 - << 'PY'
import re
def github_slug(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s, flags=re.UNICODE)
    s = re.sub(r'[-\s]+', '-', s).strip('-')
    return s
assert github_slug('SWE-bench Verified') == 'swe-bench-verified'
assert github_slug('OSWorld v1') == 'osworld-v1'
assert github_slug('OSWorld 2.0') == 'osworld-20'
assert github_slug('GAIA2') == 'gaia2'
assert github_slug('GAIA') == 'gaia'
assert github_slug('GPQA Diamond') == 'gpqa-diamond'
assert github_slug('AIME 2026') == 'aime-2026'
print('slugs ok')
PY
```

Expected: `slugs ok`. Confirm the 47-name table contains `benchmarks/coding.md#swe-bench-verified`.

- [ ] **Step 5: Commit**

```bash
git add UPSTREAM_BENCHMARKS.md
git commit -m "$(cat <<'EOF'
Make UPSTREAM_BENCHMARKS.md the glossary, L/R, and 47-name index.

Card bodies now live only under benchmarks/, so the root file can stay a map.
EOF
)"
```

---

### Task 3: General-agents essay and cohort tail

**Files:**
- Modify: `benchmarks/general-agents.md`

- [ ] **Step 1: Replace `PLACEHOLDER_ESSAY` with this exact essay**

```markdown
This family is long-horizon work in a large world: live MCP servers, open-web search, a simulated bank with a knowledge base, a real Ubuntu desktop, a containerized CLI, a professional deliverable, or an event-driven office. The shared Given is a natural-language job plus tools and state. The shared Success is not whether the write-up sounded right. MCP Atlas scores **claim coverage** (atomic claims grounded in tool outputs; a task passes if coverage is at least 0.75). τ-Knowledge checks the final database and reports **pass^k** (the chance that k independent trials all succeed). OSWorld v1 checks desktop files and UI. GDPval uses expert pairwise ranking of a work product. SkillsBench measures **skill lift**: the same task with versus without a curated skill bundle.

Do not mix the task set with the harness. A Codex or OpenHands number on OSWorld is model plus harness, not a model-only score. **GDPval-AA** is GDPval tasks plus an Artificial Analysis (AA) harness and pairwise ranking, not a second task set. SkillsBench “With Skills” is one condition of SkillsBench, not a second suite.

OSWorld v1 is 369 Ubuntu tasks. A vendor cell labeled OSWorld is not automatically v1, and it is not OSWorld 2.0 (hour-scale workflows in [`tools-web-computer.md`](tools-web-computer.md)). OSWorld-Verified is a snapshot of v1 tasks and graders, not a different family. MCP Atlas here is 1,000 tasks over 36 servers; MCP-Universe is a different suite in the tools/web file. τ-Knowledge / τ-Banking is not the original τ-bench airline/retail pair.
```

- [ ] **Step 2: Replace `PLACEHOLDER_TAIL` with this exact tail**

```markdown
These 16 papers did not run any of the eight suites in this file, including OSWorld v1.

GPTSwarm’s GAIA row is the older GAIA set in [`tools-web-computer.md`](tools-web-computer.md): a hand-built swarm, not search, and not GAIA2.

Slice rows and SOTA pointers: [`BENCHMARKS.md`](../BENCHMARKS.md).
```

- [ ] **Step 3: Confirm placeholders are gone and the tail has no SOTA or letters**

```bash
rg -n 'PLACEHOLDER|SOTA|Eval [A-D]|B\+|61\.4' /Users/phi9t/rsi-harness-audit/benchmarks/general-agents.md
rg -n '^## What this family measures|^## This cohort|^### MCP Atlas|^### GAIA2|^### OSWorld v1' /Users/phi9t/rsi-harness-audit/benchmarks/general-agents.md
```

Expected: first command matches nothing (or only the word “pair” etc.—it must not match PLACEHOLDER). Second command shows the essay heading, eight cards still present, and `## This cohort`.

- [ ] **Step 4: Commit**

```bash
git add benchmarks/general-agents.md
git commit -m "$(cat <<'EOF'
Write the general-agents essay and the empty-cohort tail.

Name OSWorld v1 vs 2.0, SkillsBench conditions, and GDPval-AA so vendor labels cannot mint extra task sets.
EOF
)"
```

---

### Task 4: Coding essay and cohort tail

**Files:**
- Modify: `benchmarks/coding.md`

- [ ] **Step 1: Replace `PLACEHOLDER_ESSAY` with this exact essay**

```markdown
This family is software work with a deterministic check: repository repair, long-horizon terminal tasks, or research functions with unit tests. The shared Given is code, tests, and (for SWE-bench) a real repo. The shared Success is tests, not a judge of the patch write-up.

**fail-to-pass** tests fail on the original code and must pass after the patch. SWE-bench Pro’s resolve rate requires that plus no regressions. That is not the same as “the tests passed” on a lucky subset. SWE-bench Verified is 500 human-checked issues scored by repository tests. SWE-bench Pro is a harder held-out set. SWE-bench Multilingual is a different task set in [`coding-research-context-frontier.md`](coding-research-context-frontier.md); do not quote a Verified number as Multilingual.

SciCode is L1 / R5: function tests at research-level science, not repository repair. Terminal-Bench 2.1 is a live terminal with expert tasks, not a single script with public unit tests.

A Codex or OpenHands score on SWE-bench is model plus harness. Do not treat SWE-bench Lite (this cohort only; not in the 47) as Verified.
```

- [ ] **Step 2: Replace `PLACEHOLDER_TAIL` with this exact tail**

```markdown
**Ran.** SWE-bench Verified: DGM and HGM bake off on 60 issues (35 Django / 25 Sphinx), not the 500. HGM’s 8,000-eval run is all 500 on the same set used in search.

**Skipped in this file.** SWE-bench Pro, Terminal-Bench 2.1, SciCode.

**Not in the 47.** SWE-bench Lite, HumanEval, KernelBench, Polyglot, and ALE-Bench LITE appear in this cohort’s coding table. They are not cards here.

Slice rows and SOTA pointers: [`BENCHMARKS.md`](../BENCHMARKS.md).
```

- [ ] **Step 3: Confirm placeholders are gone**

```bash
rg -n 'PLACEHOLDER' /Users/phi9t/rsi-harness-audit/benchmarks/coding.md
rg -n '^### SWE-bench Verified|^## This cohort' /Users/phi9t/rsi-harness-audit/benchmarks/coding.md
```

Expected: no PLACEHOLDER; both headings present. Tail must not include 50%, 61.4%, or a letter grade.

- [ ] **Step 4: Commit**

```bash
git add benchmarks/coding.md
git commit -m "$(cat <<'EOF'
Write the coding-family essay and the SWE-60 cohort tail.

Keep Verified, Pro, and Multilingual as separate task sets, and leave Lite/HumanEval in BENCHMARKS.md.
EOF
)"
```

---

### Task 5: Multimodal, safety, and reasoning essay and cohort tail

**Files:**
- Modify: `benchmarks/multimodal-safety-reasoning.md`

- [ ] **Step 1: Replace `PLACEHOLDER_ESSAY` with this exact essay**

```markdown
This family mixes static documents, images, video, long context, contest math, PhD science, memory, and injection. The world usually does not keep changing (L0–L2) except AgentDojo, where untrusted tool data can hijack a live loop (L6). Shared Success is the authors’ checker: point-in-box for ScreenSpot-Pro, exact integers for AIME 2026, multiple-choice for GPQA Diamond, a judge or rubric where the card says so—not a new protocol.

AIME 2026 is two 15-question contests, answers 000–999. It is independent of AIME 2025 (and of 2023/2024). Humanity’s Last Exam (HLE) is 2,500 multimodal questions; “HLE — Text, No Tools” is a slice, not a second task set. BEAM is 100 dialogues; BEAM-128K is twenty of those, not a second memory benchmark. OmniDocBench v1.5 is a pinned data-and-matcher release; current main is different.

AgentDojo is the task set. Prompt Siren builds stronger injection attacks against it; report both, and do not add a Prompt Siren `###` heading. CIMemories scores whether a disclosure is necessary or inappropriate given a stored memory.

Do not put these cards on one “easy to hard” line with OSWorld. GPQA Diamond is L0 / R5 (one item, specialist depth). ScreenSpot-Pro is L1 / R2 (one click).
```

- [ ] **Step 2: Replace `PLACEHOLDER_TAIL` with this exact tail**

```markdown
**Ran.** IFBench: GEPA (held-out constraint types). GPQA Diamond: ADAS and Gödel Agent, 32 validation / 166 test items (full Diamond is 198). AIME: the card in this file is **AIME 2026**; ShinkaEvolve searched AIME 2024 and then reported 2023/2025.

**Skipped in this file.** CharXiv, ScreenSpot-Pro, OmniDocBench v1.5, MMMU-Pro, CIMemories, AgentDojo, Humanity’s Last Exam, AA-LCR, BEAM.

**Not in the 47.** MATH, GSM8K, MMLU, HotpotQA/HoVer, and MiniCrosswords are this cohort’s math/QA table, not cards here.

Slice rows and SOTA pointers: [`BENCHMARKS.md`](../BENCHMARKS.md).
```

- [ ] **Step 3: Confirm one BEAM heading and no Siren heading**

```bash
rg -n '^### ' /Users/phi9t/rsi-harness-audit/benchmarks/multimodal-safety-reasoning.md
rg -n 'PLACEHOLDER|^### .*Siren|^### .*With Skills' /Users/phi9t/rsi-harness-audit/benchmarks/multimodal-safety-reasoning.md
```

Expected: twelve `###` lines including exactly one BEAM; second command matches nothing.

- [ ] **Step 4: Commit**

```bash
git add benchmarks/multimodal-safety-reasoning.md
git commit -m "$(cat <<'EOF'
Write the multimodal/safety/reasoning essay and cohort tail.

Keep AIME 2026, HLE slices, BEAM-128K, and Prompt Siren from becoming extra task sets.
EOF
)"
```

---

### Task 6: Tools, web, and computer essay and cohort tail

**Files:**
- Modify: `benchmarks/tools-web-computer.md`

- [ ] **Step 1: Replace `PLACEHOLDER_ESSAY` with this exact essay**

```markdown
This family is tools, websites, and a computer: function calling, a user simulator, self-hosted web, many apps, live MCP servers, open-web browsing, and long desktop workflows. The shared Given is an environment that keeps state. The shared Success is usually that state (final database, site, files), not a chat score.

The Berkeley Function-Calling Leaderboard V4 (BFCL V4) scores single-turn live/non-live by **AST**: call structure, not a string match. ToolSandbox maps turns onto required **milestones** and zeros a trajectory on a **minefield**. τ-bench is the original airline/retail pair with pass^k; it is not τ-Knowledge / τ-Banking in [`general-agents.md`](general-agents.md).

GAIA is 466 short verifiable answers (L3). GAIA2 is 800 event-driven scenarios in the general-agents file (L6). A vendor cell labeled GAIA is not GAIA2. OSWorld 2.0 is 108 hour-scale workflows that can change mid-run; OSWorld v1 (369 Ubuntu tasks) is in [`general-agents.md`](general-agents.md). MCP-Universe is not MCP Atlas (also general-agents): different servers, different metric.

AppWorld checks backend database state after API calls. BrowseComp asks for one obscure fact from the open web; DeepSearchQA (general-agents) asks for an exhaustive set scored by F1.
```

- [ ] **Step 2: Replace `PLACEHOLDER_TAIL` with this exact tail**

```markdown
**Ran.** AppWorld: ACE, offline (train, freeze, original test) and online (prequential on shuffled test). GAIA: GPTSwarm Table 1 is a hand-built swarm; that run is not graph search.

**Skipped in this file.** Berkeley Function-Calling Leaderboard V4, ToolSandbox, τ-bench, WebArena, VisualWebArena, MCP-Universe, BrowseComp, OSWorld 2.0.

Slice rows and SOTA pointers: [`BENCHMARKS.md`](../BENCHMARKS.md).
```

- [ ] **Step 3: Confirm placeholders are gone and GAIA vs GAIA2 stay in different files**

```bash
rg -n 'PLACEHOLDER|^### GAIA$' /Users/phi9t/rsi-harness-audit/benchmarks/tools-web-computer.md
rg -n '^### GAIA2$' /Users/phi9t/rsi-harness-audit/benchmarks/general-agents.md
```

Expected: no PLACEHOLDER; `### GAIA` in tools-web; `### GAIA2` only in general-agents.

- [ ] **Step 4: Commit**

```bash
git add benchmarks/tools-web-computer.md
git commit -m "$(cat <<'EOF'
Write the tools/web/computer essay and the AppWorld/GAIA cohort tail.

Keep τ-bench vs τ-Knowledge, GAIA vs GAIA2, and OSWorld v1 vs 2.0 in the essay.
EOF
)"
```

---

### Task 7: Coding, research, long context, and frontier essay and cohort tail

**Files:**
- Modify: `benchmarks/coding-research-context-frontier.md`

- [ ] **Step 1: Replace `PLACEHOLDER_ESSAY` with this exact essay**

```markdown
This file is the rest of the 47: extra coding suites, research replications, vision-math, long context, memory, harm, and closed research problems. It is not one capability. Compare along a track (coding, research, long context), not as one leaderboard.

LiveCodeBench and BigCodeBench report **pass@1** (one sample succeeds), not pass^k. They are contest-style code with hidden or fresh tests, not HumanEval (HumanEval is not in the 47). SWE-bench Multilingual is repository repair across languages; it is not SWE-bench Verified in [`coding.md`](coding.md).

PaperBench and ResearchClawBench are L7 / R5: a research deliverable with a rubric and many valid paths. FrontierMath is L0 / R5: one closed problem, no tools. ARC-AGI-2 is exact grid match on ARC-AGI-2 public eval unless a hidden set is named. It is not ARC-AGI-1 and not this cohort’s ARC Easy ≤5×5 slice.

RULER is a controlled needle/aggregation probe. LongBench v2 and AA-LCR are realistic long documents. BEAM (memory dialogues) lives in the multimodal file; LongMemEval-V2 here is memory over accumulated agent history. AgentHarm is harmful user goals plus whether the agent can carry them out; it is not AgentDojo (injections in untrusted tool data).
```

- [ ] **Step 2: Replace `PLACEHOLDER_TAIL` with this exact tail**

```markdown
**Ran.** LiveCodeBench: MASS used a small subset and three test executions of one topology; that ± is not search.

**Skipped in this file.** BigCodeBench, SWE-bench Multilingual, PaperBench, ResearchClawBench, MathVista, Video-MMMU, LongBench v2, RULER, LongMemEval-V2, AgentHarm, FrontierMath, ARC-AGI-2.

**Not in the 47.** ADAS “ARC” is Easy, grids ≤5×5, 20 val / 60 test—not ARC-AGI-2. MATH (617 level-5 slice) is not FrontierMath.

Slice rows and SOTA pointers: [`BENCHMARKS.md`](../BENCHMARKS.md).
```

- [ ] **Step 3: Confirm thirteen cards and no PLACEHOLDER**

```bash
python3 - << 'PY'
from pathlib import Path
import re
p = Path('/Users/phi9t/rsi-harness-audit/benchmarks/coding-research-context-frontier.md')
t = p.read_text()
assert 'PLACEHOLDER' not in t
heads = re.findall(r'^### (.+)$', t, re.M)
assert len(heads) == 13, heads
assert heads[-1] == 'ARC-AGI-2'
print('frontier file ok')
PY
```

Expected: `frontier file ok`.

- [ ] **Step 4: Commit**

```bash
git add benchmarks/coding-research-context-frontier.md
git commit -m "$(cat <<'EOF'
Write the research/context/frontier essay and the LiveCodeBench cohort tail.

Separate HumanEval, ARC Easy, and MATH from LiveCodeBench, ARC-AGI-2, and FrontierMath.
EOF
)"
```

---

### Task 8: Entry-point pointers and rubric anchors

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `BENCHMARKS.md`
- Modify: `papers/README.md`
- Modify: `REPORT.md`
- Modify: `RUBRICS.md` (pointer sentences and map hrefs only)

- [ ] **Step 1: Replace the README table rows for the map**

In `/Users/phi9t/rsi-harness-audit/README.md`, replace:

```markdown
| [UPSTREAM_BENCHMARKS.md](UPSTREAM_BENCHMARKS.md) | 47 official task sets, how they are scored, L/R, version pins |
```

with:

```markdown
| [UPSTREAM_BENCHMARKS.md](UPSTREAM_BENCHMARKS.md) | Glossary, L/R, and the 47-name index |
| [benchmarks/](benchmarks/) | Official cards, one file per category |
```

- [ ] **Step 2: Replace the two `AGENTS.md` sentences that still say the root file holds the cards**

Replace this exact bullet sentence:

```markdown
Keep `BENCHMARKS.md` for cohort slices and `UPSTREAM_BENCHMARKS.md` for official task-set definitions. Jargon in the map only if a card needs it; define it with a suite fact and list it in that file’s glossary.
```

with:

```markdown
Keep `BENCHMARKS.md` for cohort slices and SOTA pointers. Keep `UPSTREAM_BENCHMARKS.md` for the glossary, L/R, and the 47-name index. Official cards live under `benchmarks/`. Jargon in the map only if a card needs it; define it with a suite fact and list it in the index glossary.
```

Replace this exact facts sentence:

```markdown
Current entry points are `RUBRICS.md` (rules, ceilings, grade board, calibration), `papers/` (one file per paper, preprint plus official code), `BENCHMARKS.md` (how this cohort used a slice), `UPSTREAM_BENCHMARKS.md` (47 official task sets, scoring rules, L/R, pins), and `PEDANTIC_CORRECTION_PASS.md` (historical verification trail). `REPORT.md` and `GRADES_ROUND2.md` are stubs. Interactive boards live in the Cursor canvas folder.
```

with:

```markdown
Current entry points are `RUBRICS.md` (rules, ceilings, grade board, calibration), `papers/` (one file per paper, preprint plus official code), `BENCHMARKS.md` (how this cohort used a slice), `UPSTREAM_BENCHMARKS.md` (glossary, L/R, 47-name index), `benchmarks/` (official cards), and `PEDANTIC_CORRECTION_PASS.md` (historical verification trail). `REPORT.md` and `GRADES_ROUND2.md` are stubs. Interactive boards live in the Cursor canvas folder.
```

- [ ] **Step 3: Point `BENCHMARKS.md` at cards in `benchmarks/`**

Replace the first paragraph:

```markdown
Definitions, version pins, and the L/R ladder for 47 upstream suites are in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).
```

with:

```markdown
Definitions, version pins, and the L/R ladder for 47 upstream suites are in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). Official card bodies live under [`benchmarks/`](benchmarks/).
```

Replace the Official-column bullet:

```markdown
- **Official** is the maintainer page or paper that defines the split. If the suite is one of the 47 in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md), that card is the definition; otherwise the Official column here is the definition.
```

with:

```markdown
- **Official** is the maintainer page or paper that defines the split. If the suite is one of the 47, the card under [`benchmarks/`](benchmarks/) is the definition (index: [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md)); otherwise the Official column here is the definition.
```

Do not add SOTA rows. Do not copy cards.

- [ ] **Step 4: Three-place pointer in `papers/README.md` and `REPORT.md`**

`papers/README.md` — replace:

```markdown
One file per paper. Letters and calibration live in [`RUBRICS.md`](../RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](../BENCHMARKS.md). Official task sets, pins, and L/R live in [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md).
```

with:

```markdown
One file per paper. Letters and calibration live in [`RUBRICS.md`](../RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](../BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](../benchmarks/).
```

`REPORT.md` — replace:

```markdown
The paper-by-paper report now lives in [`papers/`](papers/). Letters, ceilings, and calibration live in [`RUBRICS.md`](RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Official task sets, pins, and L/R live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).
```

with:

```markdown
The paper-by-paper report now lives in [`papers/`](papers/). Letters, ceilings, and calibration live in [`RUBRICS.md`](RUBRICS.md). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](benchmarks/).
```

- [ ] **Step 5: Retarget `RUBRICS.md` without moving letters**

Replace the slice-section opening sentence:

```markdown
The official task set (items, metric, version pin) for each of the 47 mapped suites is in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). What these 16 papers actually ran is in [`BENCHMARKS.md`](BENCHMARKS.md) and the paper file. A headline on a slice is not a score on the official set.
```

with:

```markdown
The official task set (items, metric, version pin) for each of the 47 mapped suites is the card under [`benchmarks/`](benchmarks/), indexed from [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). What these 16 papers actually ran is in [`BENCHMARKS.md`](BENCHMARKS.md) and the paper file. A headline on a slice is not a score on the official set.
```

Replace only the map hrefs (keep the surrounding fact text):

| Old href | New href |
|---|---|
| `UPSTREAM_BENCHMARKS.md#swe-bench-verified` | `benchmarks/coding.md#swe-bench-verified` |
| `UPSTREAM_BENCHMARKS.md#gpqa-diamond` | `benchmarks/multimodal-safety-reasoning.md#gpqa-diamond` |
| `UPSTREAM_BENCHMARKS.md#aime-2026` | `benchmarks/multimodal-safety-reasoning.md#aime-2026` |
| `UPSTREAM_BENCHMARKS.md#osworld-v1` | `benchmarks/general-agents.md#osworld-v1` |
| `UPSTREAM_BENCHMARKS.md#osworld-20` | `benchmarks/tools-web-computer.md#osworld-20` |
| `UPSTREAM_BENCHMARKS.md#gaia` | `benchmarks/tools-web-computer.md#gaia` |
| `UPSTREAM_BENCHMARKS.md#gaia2` | `benchmarks/general-agents.md#gaia2` |

MATH stays linked only to `BENCHMARKS.md`. Do not change “This is wording, not a new Eval ceiling.”

Replace the grade-board pointer:

```markdown
Letters live here. Evidence lives in [`papers/`](papers/). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Official task sets, pins, and L/R live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md).
```

with:

```markdown
Letters live here. Evidence lives in [`papers/`](papers/). Cohort slices and SOTA pointers live in [`BENCHMARKS.md`](BENCHMARKS.md). Glossary, L/R, and the 47-name index live in [`UPSTREAM_BENCHMARKS.md`](UPSTREAM_BENCHMARKS.md). Official cards live under [`benchmarks/`](benchmarks/).
```

Everything from `**Cite the row, not the PDF.**` through the end of `## Cohort calibration` must stay byte-identical.

- [ ] **Step 6: Commit**

```bash
git add README.md AGENTS.md BENCHMARKS.md papers/README.md REPORT.md RUBRICS.md
git commit -m "$(cat <<'EOF'
Point entry files at the root index and the benchmarks/ card folder.

Retarget rubric slice anchors so a mix-up still opens the official card, not a missing heading.
EOF
)"
```

---

### Task 9: Done-when checks

**Files:** none (read-only), unless a check fails — then fix in the file the check names, do not “clean up” unrelated prose.

- [ ] **Step 1: Closed list**

Run the closed-list Python from the plan header.

Expected: `card count 47` and `closed list ok`.

- [ ] **Step 2: Root has no card bodies; each category file has essay + tail**

```bash
rg '^### ' /Users/phi9t/rsi-harness-audit/UPSTREAM_BENCHMARKS.md
rg -n 'PLACEHOLDER' /Users/phi9t/rsi-harness-audit/benchmarks
rg -l '^## This cohort$' /Users/phi9t/rsi-harness-audit/benchmarks/*.md
rg -l '^## What this family measures$' /Users/phi9t/rsi-harness-audit/benchmarks/*.md
```

Expected: first command prints nothing; second prints nothing; third and fourth list the five category files (not `README.md`).

- [ ] **Step 3: Tails have no SOTA numbers or grade letters**

```bash
rg -n '90%|61\.4|50%|B\+|Eval [A-D]|SOTA' /Users/phi9t/rsi-harness-audit/benchmarks/*.md
```

Expected: no matches in cohort tails. (If “pass@1” matches, that is in an essay; allowed. The pattern above should not hit pass@1.)

- [ ] **Step 4: Rubric letters unchanged; anchors retargeted**

```bash
rg -n 'benchmarks/coding.md#swe-bench-verified|benchmarks/general-agents.md#gaia2|benchmarks/tools-web-computer.md#gaia' /Users/phi9t/rsi-harness-audit/RUBRICS.md
rg -n 'UPSTREAM_BENCHMARKS.md#' /Users/phi9t/rsi-harness-audit/RUBRICS.md
git diff main -- RUBRICS.md | rg '^\+.*\b[ABCD][+\-]?$|PromptBreeder|GEPA is B' || true
```

Expected: new anchors present; no `UPSTREAM_BENCHMARKS.md#` left in `RUBRICS.md`. Diff does not change grade-board letters.

- [ ] **Step 5: Paper files and v1 trail untouched**

```bash
git diff main --name-only | rg '^papers/.+\.md$|^PEDANTIC'
```

Expected: only `papers/README.md` (and not `PEDANTIC_CORRECTION_PASS.md`).

- [ ] **Step 6: Index links resolve to headings**

```bash
python3 - << 'PY'
from pathlib import Path
import re
root = Path('/Users/phi9t/rsi-harness-audit')
up = (root / 'UPSTREAM_BENCHMARKS.md').read_text()
links = re.findall(r'\[([^\]]+)\]\((benchmarks/[^)#]+)#([^)]+)\)', up)
assert len(links) == 47, len(links)

def github_slug(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s, flags=re.UNICODE)
    s = re.sub(r'[-\s]+', '-', s).strip('-')
    return s

for name, rel, slug in links:
    text = (root / rel).read_text()
    heads = re.findall(r'^### (.+)$', text, re.M)
    slugs = {github_slug(h) for h in heads}
    assert slug in slugs, (name, rel, slug, slugs)
print('47 index links resolve')
PY
```

Expected: `47 index links resolve`.

- [ ] **Step 7: Commit only if Step 1–6 forced a fix; otherwise stop**

If a check failed and you edited files, commit that fix with a message that names the check. If all checks passed, do not make an empty commit.

---

## Self-review (spec coverage)

| Spec section | Task |
|---|---|
| Root index + five files + folder README | 1–2 |
| Essays with required mix-ups | 3–7 |
| Card move, no 48th, no re-fetch | 1 |
| Cohort tails from BENCHMARKS.md seed | 3–7 |
| Pointers and rubric anchors | 8 |
| Letters frozen; papers/* and PEDANTIC untouched | 8–9 |
| Done-when closed list and link check | 9 |
| Out of scope (canvases, recut, piece 2/3) | no task |
