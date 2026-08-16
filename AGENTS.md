## Learned User Preferences

- Write in concise, precise plain English. Define jargon immediately with a paper fact, not another acronym.
- Improve the scoring rubrics from new findings before starting another grading round.
- Grade each paper individually and calibrate the cohort so the same letter means the same kind of miss; every letter needs evidence.
- When asked to land work, commit, push, and confirm the GitHub repo is actually public and visible—not only a local commit or a private remote.
- Keep one `RUBRICS.md` for scoring rules, ceilings, the grade board, and calibration. Put each paper in its own file under `papers/`. Keep a separate benchmarks doc for upstream suites and SOTA.
- For papers with public code, read the repo enough to describe the real control flow (search, mutation, evaluation, promotion) and how it differs from the paper. Quote snippets only when they change a grade.

## Learned Workspace Facts

- This workspace audits 16 top-conference papers on harness optimization and recursive self-improvement. Preprints are out of scope.
- The cohort is PromptBreeder, GPTSwarm, STOP, DiscoPOP, ADAS, AFlow, AgentSquare, Gödel Agent, Self-Developing, MaAS, GEPA, ACE, MASS, ShinkaEvolve, DGM, and HGM.
- Score experiments, not PDFs. Split Discovery into search method vs evolved object. Hidden tests in the proposer make Eval D. RSI requires measuring whether later systems are better at producing the next system (child quality), not only task score.
- Current entry points are `RUBRICS.md` (rules, ceilings, grade board, calibration), `papers/` (one file per paper, preprint plus official code), `BENCHMARKS.md` (upstream suites and dated SOTA), and `PEDANTIC_CORRECTION_PASS.md` (historical verification trail). `REPORT.md` and `GRADES_ROUND2.md` are stubs. Interactive boards live in the Cursor canvas folder.
- The public remote is `https://github.com/phi9t/rsi-harness-audit.git`.
