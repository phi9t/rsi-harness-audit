## Learned User Preferences

- Write in concise, precise plain English. Define jargon immediately with a paper fact, not another acronym.
- Improve the scoring rubrics from new findings before starting another grading round.
- Grade each paper individually and calibrate the cohort so the same letter means the same kind of miss; every letter needs evidence.
- Keep Eval, Search, Object, and RSI letters frozen unless a later grading round is requested; rubric wording and pointer fixes do not reopen grades.
- When asked to land work, fast-forward onto mainline so history stays linear (no merge commit), push, and confirm the GitHub repo is actually public and visible—not only a local commit or a private remote.
- Sequence doc-quality work as pointers, map, and rubric wording first, then paper-file prose rewrite, then `PEDANTIC_CORRECTION_PASS.md`; keep that file as the v1 verification trail unless it is explicitly restated.
- Keep one `RUBRICS.md` for scoring rules, ceilings, the grade board, and calibration. Put each paper in its own file under `papers/`. Keep `BENCHMARKS.md` for cohort slices and `UPSTREAM_BENCHMARKS.md` for official task-set definitions. Jargon in the map only if a card needs it; define it with a suite fact and list it in that file’s glossary.
- For papers with public code, read the repo enough to describe the real control flow (search, mutation, evaluation, promotion) and how it differs from the paper. Quote snippets only when they change a grade.
- For upstream benchmark cards, fetch the official page or paper and let that source win. Keep the official task set, the agent harness, and the scoring protocol as three objects; do not treat Prompt Siren, “With Skills,” or “AA” as their own task sets. Use labeled synthetic sketches, never copied benchmark instances.

## Learned Workspace Facts

- This workspace audits 16 top-conference papers on harness optimization and recursive self-improvement. Preprints are out of scope.
- The cohort is PromptBreeder, GPTSwarm, STOP, DiscoPOP, ADAS, AFlow, AgentSquare, Gödel Agent, Self-Developing, MaAS, GEPA, ACE, MASS, ShinkaEvolve, DGM, and HGM.
- Score experiments, not PDFs. Split Discovery into search method vs evolved object. Hidden tests in the proposer make Eval D. RSI requires measuring whether later systems are better at producing the next system (child quality), not only task score.
- Current entry points are `RUBRICS.md` (rules, ceilings, grade board, calibration), `papers/` (one file per paper, preprint plus official code), `BENCHMARKS.md` (how this cohort used a slice), `UPSTREAM_BENCHMARKS.md` (47 official task sets, scoring rules, L/R, pins), and `PEDANTIC_CORRECTION_PASS.md` (historical verification trail). `REPORT.md` and `GRADES_ROUND2.md` are stubs. Interactive boards live in the Cursor canvas folder.
- PromptBreeder, Self-Developing, and MASS have no official code; third-party reimplementations are not the published harness.
- The public remote is `https://github.com/phi9t/rsi-harness-audit.git`.
