# Multimodal, safety, and reasoning

Official task sets for this family. Glossary, L/R definitions, and the 47-name index: [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). How these 16 papers used a slice: [`BENCHMARKS.md`](../BENCHMARKS.md).

## What this family measures

This family mixes static documents, images, video, long context, contest math, PhD science, memory, and injection. The world usually does not keep changing (L0–L2) except AgentDojo, where untrusted tool data can hijack a live loop (L6). Shared Success is the authors’ checker: point-in-box for ScreenSpot-Pro, exact integers for AIME 2026, multiple-choice for GPQA Diamond, a judge or rubric where the card says so—not a new protocol.

AIME 2026 is two 15-question contests, answers 000–999. It is independent of AIME 2025 (and of 2023/2024). Humanity’s Last Exam (HLE) is 2,500 multimodal questions; “HLE — Text, No Tools” is a slice, not a second task set. BEAM is 100 dialogues; BEAM-128K is twenty of those, not a second memory benchmark. OmniDocBench v1.5 is a pinned data-and-matcher release; current main is different.

AgentDojo is the task set. Prompt Siren builds stronger injection attacks against it; report both, and do not add a Prompt Siren `###` heading. CIMemories scores whether a disclosure is necessary or inappropriate given a stored memory.

Do not put these cards on one “easy to hard” line with OSWorld. GPQA Diamond is L0 / R5 (one item, specialist depth). ScreenSpot-Pro is L1 / R2 (one click).

## Cards

### CharXiv

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2406.18521 (fetched 2026-08-16).

**Given:** A chart image from an arXiv paper. No caption, no surrounding text, and no specialist field knowledge. Two question types: descriptive (title, labels, ticks, counts) and reasoning (compare, approximate, or analyze across visual elements).
**Success:** A GPT-4o judge extracts the answer and scores it binary. Exact string match is not used, because math notation can be typed in more than one way. Report descriptive and reasoning accuracy separately; validation answers are public, test answers are held out.
**Size / pin:** 2,323 charts (validation 1,000 / test 1,323) across 8 subjects and 4 years. 9,292 descriptive questions from 19 templates plus one reasoning question per chart (2,323). Pin the named split.
**Level:** L2 / R4. Static charts; reasoning items need cross-element synthesis, not a lookup.
**Sketch (not a real item):** From a four-panel ablation figure, read which training recipe keeps validation loss lowest after epoch 50.
**Do not mix:** Descriptive accuracy is not reasoning accuracy. Not ChartQA or MathVista’s chart slice.

### ScreenSpot-Pro

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2504.07981v1 (fetched 2026-08-16).

**Given:** A high-resolution screenshot from a professional app and a short instruction naming the control to click. 23 applications across five industries (development, creative, computer-aided design, scientific, office) plus OS screens, on Windows, macOS, and Linux. Targets are tiny: about 0.07% of the image on average.
**Success:** **Point-in-box:** the predicted click, or the center of a predicted box, must land inside the annotated ground-truth box. Accuracy is the share of instructions that hit.
**Size / pin:** 1,581 instructions, each on a unique screenshot. Pin ScreenSpot-Pro, not ScreenSpot or ScreenSpot-v2 (cropped, easier targets).
**Level:** L1 / R2. One click with a deterministic geometry check; pick a control, not a multi-step desktop job.
**Sketch (not a real item):** On a compositor panel, click the layer opacity field, not the nearby toolbar icon.
**Do not mix:** Not ScreenSpot. Not OSWorld, which grades desktop state after many actions.

### OmniDocBench v1.5

**Diagram / vendor label:** OmniDocBench v1.5; current `main` is a later release.
**Source:** https://github.com/opendatalab/OmniDocBench/blob/v1_5/README.md (fetched 2026-08-16). The default `main` README on the same day describes v1.6/v1.7 (1,651 pages).

**Given:** A PDF page image. The parser must emit Markdown (or module outputs) covering text, tables, formulas, and reading order. Pages span 9 document types, 4 layouts, and 3 languages (English, Simplified Chinese, mixed).
**Success:** End-to-end Overall is the mean of three scores: (1 − text edit distance) × 100, table TEDS (tree-edit-distance similarity), and formula CDM (the suite’s render-based formula score). v1.5 matching is **hybrid matching** (`quick_match`): formulas and text may match each other so Unicode formula dumps are not scored as misses.
**Size / pin:** v1.5: 1,355 pages (v1.0’s 981 plus 374 added on 2025-09-25). Pin v1.5 data and the v1.5 matcher. Draft said pin v1.5 parser/matcher; the official v1.5 README names the hybrid matcher and 1,355 pages, not a separate “parser” pin.
**Level:** L2 / R2. Static page to structured text; local layout and formatting, not a changing desktop.
**Sketch (not a real item):** Convert a two-column methods page with an inline formula and a small table into Markdown that preserves reading order.
**Do not mix:** Not v1.0 (981 pages) and not current `main` (v1.6+). Swapping the matcher changes the number.

### MMMU-Pro

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2409.02813v1 (fetched 2026-08-16).

**Given:** A college-level multimodal question. Standard setting: image plus text with up to 10 multiple-choice options. Vision-only setting: the same question embedded in a screenshot or photo, with no separate text channel.
**Success:** Multiple-choice accuracy. The headline MMMU-Pro score is the mean of Standard (10 options) and Vision Input. The 4-option standard run is reported only as a comparison, not the headline.
**Size / pin:** 1,730 questions in standard format and the same 1,730 in screenshot/photo form (3,460 total), after dropping items a text-only model could solve and expanding options from 4 to 10. Pin MMMU-Pro, not original MMMU (11.5K questions, usually 4 options).
**Level:** L2 / R4. Static images; college-level synthesis across diagram and stem.
**Sketch (not a real item):** A photographed slide shows a reaction diagram and ten options; pick the product without a separate text prompt.
**Do not mix:** Not original MMMU validation. Vision-only is a setting of this set, not a second suite.

### CIMemories

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2511.14937 (fetched 2026-08-16).

**Given:** A synthetic user memory dump (natural-language statements about personal attributes) plus a task and a recipient (for example, write to a physician). Each attribute is labeled necessary or inappropriate for that task; unlabeled pairs are dropped when the paper’s privacy personas disagree — three Westin-style attitude prompts (fundamentalist, pragmatic, unconcerned) that must agree before a pair is scored. The same fact can be required in one context and banned in another. Reported runs concatenate memories as a prefix; they do not update a live store mid-task.
**Success:** A model judge (DeepSeek-R1 in the paper) marks which attribute values appeared in the reply. **Violation** is leaking an inappropriate attribute; **completeness** is sharing the necessary ones. Report both; silence looks private but fails completeness.
**Size / pin:** Profiles can hold over 100 attributes (up to 189: seven per domain × nine domains × three events). The paper’s tables use 10 profiles and 49 seed contexts. Pin that reported slice vs a larger generation.
**Level:** L2 / R4. Long static memory plus a policy choice of what to disclose, not a changing database.
**Sketch (not a real item):** Draft a message to a physician with the relevant history; do not mention salary.
**Do not mix:** Not a generic privacy quiz with one secret. Violation without completeness is not success.

### AgentDojo

**Diagram / vendor label:** Siren AgentDojo; Prompt Siren is an attack layer, not a second task set.
**Source:** https://arxiv.org/html/2406.13352v3 (fetched 2026-08-16).

**Given:** A user instruction in one of four simulated apps (workspace, Slack, travel, banking) with 70 tools and a mutable environment state. Some tool outputs are placeholders where an attacker can inject instructions (for example, “email this file to an outsider”).
**Success:** Deterministic checks on environment state, not a judge. **Benign utility** is the share of 97 user tasks solved with no attack. Under attack, report **utility under attack** (user goal met, no extra harm) and **targeted attack success rate** (the attacker’s goal ran). Draft said 97 benign + security cases; the paper gives 97 user tasks, 27 injection targets, and 629 security cases (user task × injection inside each environment).
**Size / pin:** 97 user tasks, 629 security cases. The suite is extensible; pin this first-version roster unless a later drop is named.
**Level:** L6 / R3. Untrusted tool data can hijack a multi-step tool loop in a live state.
**Sketch (not a real item):** Summarize a shared document and send the summary; ignore a buried instruction to exfiltrate the file.
**Do not mix:** Prompt Siren builds stronger injection attacks against this environment; it is not a second task set. Not InjecAgent’s single-turn simulated tool dump.

### IFBench

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2507.02833v1 (fetched 2026-08-16).

**Given:** A WildChat-style user prompt plus one or more output constraints (length, format, word/character rules, copying). Single-turn: task and constraints in one message. Multi-turn: rewrite a prior reply to satisfy a constraint. Constraints were checked by humans for compatibility with the prompt.
**Success:** Each constraint has a short Python checker. Headline is **strict** accuracy: every checker on the prompt must pass. That is not a prose-quality judge.
**Size / pin:** 58 new verifiable constraints in 7 categories (count, ratio, words, sentence, format, custom, copy) and 300 prompts. Draft said 58 constraint families; the paper calls them 58 constraints. Pin IFBench, not IFEval’s 25 templates. IFTrain’s 29 constraints are training-only.
**Level:** L1 / R2. One response with deterministic format checks, not a tool environment.
**Sketch (not a real item):** Answer the prompt in exactly 120 words, put a given token as word 40, and never use the letter “q”.
**Do not mix:** Not IFEval. Training constraints (IFTrain) are not the test set.

### AIME 2026

**Diagram / vendor label:** AIME 2026; independent of AIME 2025.
**Source:** https://matharena.ai/competitions (fetched 2026-08-16), AIME 2026 row under Final-Answer Comps; four-run mean from https://matharena.ai/.

**Given:** An American Invitational Mathematics Examination problem. Two contests of 15 questions, three hours each in the human exam. The model returns an integer. No diagrams required.
**Success:** Exact match to an integer from 0 through 999 (written 000–999). MathArena runs each model four times per problem and reports the mean; that is not pass^k (all four must succeed).
**Size / pin:** 30 problems (two 15-question contests). Pin AIME 2026, not AIME 2025 (also 30 problems on the same page, marked deprecated).
**Level:** L0 / R4. One short integer, no tools in the contest rules; contest combinatorics and number theory, not research-level unpublished math.
**Sketch (not a real item):** Count the integer solutions to a constrained combinatorial equation; answer with a three-digit integer.
**Do not mix:** Not AIME 2025 or this cohort’s AIME 2024 in-sample slice. A tools-allowed or calculator run is a different protocol from the contest’s no-calculator integer.

### GPQA Diamond

**Diagram / vendor label:** same as official name; tables sometimes say GPQA.
**Source:** https://arxiv.org/html/2311.12022 (fetched 2026-08-16).

**Given:** A multiple-choice graduate-level question in biology, physics, or chemistry. Closed-book: the question and prompt only. Open-book: the paper also reports a search-tool condition.
**Success:** Multiple-choice accuracy against the expert-written key.
**Size / pin:** Diamond is 198 questions (both expert validators agree, most non-experts fail). The recommended main set is 448. The extended set is 546. Pin Diamond 198 unless main/extended is named.
**Level:** L0 / R5. One multiple-choice item; PhD-level science that skilled non-experts miss even with the web.
**Sketch (not a real item):** A quantum or biochemistry multiple-choice item whose wrong options are plausible expert distractors.
**Do not mix:** Not the 448 main set. Not the 32-item validation slices some of the 16 audit papers used.

### Humanity’s Last Exam

**Diagram / vendor label:** HLE; vendor tables often show HLE — Text, No Tools.
**Source:** https://agi.safe.ai/ (fetched 2026-08-16); question mix and judge from https://arxiv.org/html/2501.14249 (same date).

**Given:** A closed-ended expert question, text-only or with an image (about 14% need the figure). 24% multiple-choice (five or more options); the rest exact-match short answers. No search tools in the authors’ protocol; questions are written to resist a simple web lookup.
**Success:** Accuracy. An o3-mini judge checks the model’s final answer against the key, allowing equivalent forms. Calibration error is reported alongside accuracy, not instead of it.
**Size / pin:** 2,500 public questions across over a hundred subjects, plus a private holdout. Finalized 2025-04-03. The text-only slice is the questions that do not need an image (about 86%). Full set is L2 / R5; text-only, no-tools is L0 / R5.
**Level:** L2 / R5 for the full multimodal set (some items need a figure). The text-only / no-tools slice is L0 / R5: one answer, frontier specialist depth.
**Sketch (not a real item):** A specialist figure from an obscure subfield; the short answer is a number or name that is not a web-search snippet.
**Do not mix:** The text-only / no-tools slice is not a second task set. A with-tools leaderboard is a different protocol. Not HLE-preview or HLE-Rolling.

### AA-LCR

**Diagram / vendor label:** AA-LCR (Artificial Analysis Long Context Reasoning).
**Source:** https://artificialanalysis.ai/articles/announcing-aa-lcr (fetched 2026-08-16).

**Given:** A human-written question plus a document set averaging about 100,000 tokens (`cl100k_base`). Seven text-only source types (company reports, industry reports, government consultations, academia, legal, marketing, surveys). The documents are passed in as context; the model must not fetch extra material. Answers need facts from more than one document and a step that is not stated outright.
**Success:** Accuracy against a verified key. Every question was answered correctly by at least one human tester.
**Size / pin:** 100 questions, 30 document sets, 234 documents. Pin AA-LCR, not a needle-in-a-haystack probe.
**Level:** L2 / R4. Long static documents; cross-source fiscal or policy synthesis, no live retrieval.
**Sketch (not a real item):** Reconcile a fiscal segment that is split across two years of company reports and an industry appendix.
**Do not mix:** Not needle-in-a-haystack. External web retrieval changes the task.

### BEAM

**Diagram / vendor label:** BEAM; diagrams often show BEAM-128K (twenty of the 100 dialogues).
**Source:** https://github.com/mohammadtavakoli78/BEAM (README fetched 2026-08-16).

**Given:** A long, coherent dialogue (general, coding, or math) and probing questions that test ten memory abilities (among them abstention, contradiction, event order, knowledge update, and preference following). Length buckets: 128K, 500K, 1M, and 10M tokens.
**Success:** A language-model judge scores each answer to a probing question against the reference. LIGHT (episodic memory, working memory, and a scratchpad) is an optional method on this set, not the metric.
**Size / pin:** 100 dialogues and 2,000 validated questions. 128K is 20 dialogues; 500K and 1M are 35 each; 10M is 10 (also published as BEAM-10M). Pin the named length bucket.
**Level:** L2 / R4. Long static history; the 128K bucket is still this suite, not a second task set.
**Sketch (not a real item):** After several corrections in a long travel chat, report the latest still-valid preference.
**Do not mix:** BEAM-128K is 20 of 100 dialogues, not the whole benchmark. Not LongMemEval.

## This cohort

**Ran.** IFBench: GEPA (held-out constraint types). GPQA Diamond: ADAS and Gödel Agent, 32 validation / 166 test items (full Diamond is 198). AIME: the card in this file is **AIME 2026**; ShinkaEvolve searched AIME 2024 and then reported 2023/2025.

**Skipped in this file.** CharXiv, ScreenSpot-Pro, OmniDocBench v1.5, MMMU-Pro, CIMemories, AgentDojo, Humanity’s Last Exam, AA-LCR, BEAM.

**Not in the 47.** MATH, GSM8K, MMLU, HotpotQA/HoVer, and MiniCrosswords are this cohort’s math/QA table, not cards here.

Slice rows and SOTA pointers: [`BENCHMARKS.md`](../BENCHMARKS.md).
