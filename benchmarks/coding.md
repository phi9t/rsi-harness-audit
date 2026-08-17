# Coding

Official task sets for this family. Glossary, L/R definitions, and the 47-name index: [`UPSTREAM_BENCHMARKS.md`](../UPSTREAM_BENCHMARKS.md). How these 16 papers used a slice: [`BENCHMARKS.md`](../BENCHMARKS.md).

## What this family measures

PLACEHOLDER_ESSAY

## Cards

### SWE-bench Pro

**Diagram / vendor label:** same as official name; tables sometimes treat this as generic “SWE-bench.”
**Source:** https://labs.scale.com/leaderboard/swe_bench_pro_public (fetched 2026-08-16).

**Given:** A GitHub-style issue plus a Dockerized professional codebase (consumer apps, B2B services, developer tools). Human experts write a problem statement and a requirements brief. The agent submits a code patch.
**Success:** Resolve rate: the share of tasks marked resolved. New tests that fail on the original code (**fail-to-pass**) must pass after the patch, and existing tests that already passed must still pass (no regressions).
**Size / pin:** 1,865 tasks across 41 repositories: 731 public copyleft open-source, 276 private proprietary from startups, 858 held out. Pin the named split. Draft said 276 commercial; the official page calls that split private / proprietary.
**Level:** L5 / R4. Multi-file repair in real services (about 107 lines across four files on average), not a single-function edit.
**Sketch (not a real item):** An auth bug in a large service: tokens validate in the API module, but session revocation never reaches billing and admin.
**Do not mix:** Not SWE-bench Verified’s 500.

### SWE-bench Verified

**Diagram / vendor label:** same as official name.
**Source:** https://www.swebench.com/verified.html (fetched 2026-08-16); Lite and full sizes from https://www.swebench.com/.

**Given:** A real GitHub issue and the matching Python repository at a frozen commit. The agent writes a patch.
**Success:** % Resolved: apply the patch in Docker and run the repository’s tests. The issue is solved if the tests that encode the fix pass and previously passing tests still pass.
**Size / pin:** 500 human-filtered instances from SWE-bench (annotators checked that the description is clear, the tests are correct, and the task is solvable). The original SWE-bench test set is 2,294. SWE-bench Lite is a separate 300-instance cheaper subset.
**Level:** L5 / R3. Full repositories with multi-step recovery, not a one-file coding puzzle.
**Sketch (not a real item):** A Django object-relational mapping (ORM) query double-counts joined rows; fix the query so the project’s tests pass.
**Do not mix:** Not Lite (300). Not this cohort’s SWE 60 (the Django/Sphinx slice used by DGM).

### Terminal-Bench 2.1

**Diagram / vendor label:** same as official name.
**Source:** https://github.com/harbor-framework/terminal-bench-2-1 (fetched 2026-08-16); 89-task roster at https://hub.harborframework.com/datasets/terminal-bench/terminal-bench-2-1/latest; scoring from https://arxiv.org/html/2601.11868 (the 2.0 paper; 2.1 keeps the same count).

**Given:** A natural-language instruction inside a Docker container with a shell and files. The agent may use any commands; it is not shown the tests.
**Success:** Tests check properties of the final container state, not the command trace. A task is solved if those tests pass. The leaderboard requires five trials per task; report the mean. That is not pass^k (all five must succeed).
**Size / pin:** 89 container terminal tasks. Version 2.1 is a verified iteration of 2.0: 26 tasks were changed for bugs, timeouts, resources, or reward-hacking. Pin 2.1.
**Level:** L5 / R4. Long-horizon expert work in a live terminal, not a single script with public unit tests.
**Sketch (not a real item):** After a crash, restore a local SQLite database whose write-ahead log (WAL: extra files that hold uncommitted writes) is out of sync with the main file. The verifier checks recovered tables, not the commands used.
**Do not mix:** Pin 2.1, not 2.0.

### SciCode

**Diagram / vendor label:** same as official name.
**Source:** https://arxiv.org/html/2407.13168 (fetched 2026-08-16).

**Given:** A scientist-written research coding problem with docstring inputs and outputs. Each of 80 main problems splits into subproblems (338 total) across 16 natural-science subfields. Optional scientist-written background. The model implements Python functions and composes them.
**Success:** Automatic tests: numerical input–output checks plus domain-specific cases that reproduce a published result or an analytical solution. A main problem counts only if every subproblem and the integrated solution pass. Reported metric is pass@1 (one sample succeeds). That is not pass^k (all k runs succeed). The headline is main-problem pass@1 under the paper’s standard setup: no scientist-written background, and later subproblems see the model’s generated code, not gold. Draft said numeric tests; the paper also uses those domain-specific cases.
**Size / pin:** 80 main problems, 338 subproblems. Development 15 mains / 50 subproblems; test 65 mains / 288 subproblems.
**Level:** L1 / R5. Deterministic function tests at research-level science, not repository repair.
**Sketch (not a real item):** Implement a stable numerical solver whose hidden tests check residuals against tight tolerances the prompt does not state.
**Do not mix:** Functions and numeric/domain tests, not SWE-bench repo repair. Not with-background pass@1 and not the subproblem rate.

## This cohort

PLACEHOLDER_TAIL
