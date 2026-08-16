import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

function capTone(
  cap: string
): "success" | "warning" | "danger" | "info" | "neutral" {
  if (cap.startsWith("D") || cap.includes("n/a")) return "danger";
  if (cap.startsWith("C") || cap.includes("B−")) return "warning";
  if (cap.includes("B+")) return "info";
  return "neutral";
}

export default function RubricsV2Canvas() {
  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1120 }}>
      <Stack gap={8}>
        <H1>How we score these papers</H1>
        <Text tone="secondary" size="small">
          One experiment, one grade. Letters come from a checklist and from
          automatic ceilings, not from an overall vibe. Full text with
          definitions and paper evidence is in RUBRICS.md.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="1" label="Experiment, not the whole PDF" />
        <Stat value="2" label="Discovery scores: searcher vs object" tone="info" />
        <Stat value="D" label="If hidden tests reach the proposer" tone="danger" />
        <Stat value="0–1" label="RSI until child quality is measured" tone="warning" />
      </Grid>

      <Callout tone="warning" title="Four rules">
        Grade the experiment, not the PDF. Score the authors' search method and
        the evolved object separately. A ceiling beats a good story. A higher
        score on the tasks used for search is not recursive self-improvement.
      </Callout>

      <Stack gap={8}>
        <H2>Why the first rubric failed</H2>
        <Table
          headers={["What it did", "What that hid", "Fix"]}
          rows={[
            [
              "One letter per PDF",
              "GEPA's held-out main tables shared a grade with in-sample KernelBench. HGM's Lite transfer shared a grade with 8,000 evals on all 500 Verified tasks.",
              "One row per experiment",
            ],
            [
              "One Discovery letter",
              "HGM's lineage-picking rule (a real search idea) shared a grade with a function that logs “would fix” and then skips the fix.",
              "Searcher vs evolved object",
            ],
            [
              "Train/test as the only leak check",
              "DGM's solver does not see private tests. The o1 diagnosis prompt does: official patch plus private-test log (§C.3).",
              "Score the prompt that chose the edit",
            ],
            [
              "Task score as self-improvement",
              "CMP, archive size, and “recursive rounds” are still scores on coding/math tasks.",
              "Measure whether later parents make better children",
            ],
          ]}
        />
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H2>Eval ceilings: what the searcher was allowed to see</H2>
        <Text tone="secondary" size="small">
          Held-out test means examples the search process never queries. That
          is necessary and not sufficient. If a validation split is scored on
          every round, the final test can still be clean while the chosen
          system is an overfit to validation. GEPA spends most rollouts that
          way on purpose.
        </Text>
        <Table
          headers={["If this happened", "Max Eval", "Evidence"]}
          rows={[
            [
              "Hidden tests, official patches, or judge text are pasted into the prompt that proposes the next change",
              <Pill key="d4" tone="danger" size="small">D</Pill>,
              "DGM o1 diagnosis: private test patch + private-test results",
            ],
            [
              "The headline tasks are the same tasks used to search (ordinary benchmarks)",
              <Pill key="d3" tone="danger" size="small">D</Pill>,
              "GPTSwarm: 20 MiniCrosswords both ways. HGM: 8,000 evals on all 500 Verified, then 61.4% on Verified",
            ],
            [
              "Same objective for search and score, but anyone can re-check it exactly (packing, etc.)",
              <Pill key="c3" tone="warning" size="small">C</Pill>,
              "ShinkaEvolve circle packing, unless a tighter independent check is the headline",
            ],
            [
              "Predict on a test item, learn from the outcome, then continue (streaming / prequential)",
              <Pill key="c8" tone="warning" size="small">C</Pill>,
              "ACE online on the shuffled test split, sitting next to offline “test” columns",
            ],
            [
              "A split exists, then the search set is rewritten from scores (high-variance filter, score predictor, promote top-k on the same pool)",
              <Pill key="bm" tone="warning" size="small">B−</Pill>,
              "AFlow keeps high-variance val items. DGM 10 → ~60 → 200 if >40% and top two",
            ],
            [
              "Validation is queried many times; test is hidden; search is not repeated",
              <Pill key="bp" tone="info" size="small">B+</Pill>,
              "GEPA main; ACE offline. DiscoPOP then drops to B because the named loss is not the table winner",
            ],
            [
              "Hand-built system reported as if search found it",
              <Pill key="na" tone="danger" size="small">n/a</Pill>,
              "GPTSwarm GAIA swarm is assembled, not graph-optimized",
            ],
          ]}
        />
      </Stack>

      <Grid columns={2} gap={16}>
        <Stack gap={8}>
          <H2>Other Eval checks</H2>
          <Table
            headers={["Check", "Common failure"]}
            rows={[
              [
                "Was the whole search rerun?",
                "± is three answers from one final harness (MASS), not three searches",
              ],
              [
                "Same model and call budget?",
                "ADAS ensembles vs one-shot prompting; Gödel “free” calls GPT-4o",
              ],
              [
                "Same candidate space and budget?",
                "Self-Developing: thousands of merge programs vs a small coefficient grid",
              ],
              [
                "Full official set, declared in advance?",
                "ADAS ARC Easy, grids ≤5×5; shared 617 MATH level-5 slice",
              ],
              [
                "Named object = fitness winner?",
                "DiscoPOP LRML is 6th on MT-Bench; PADLL wins AlpacaEval WR 14.07 vs 13.21",
              ],
            ]}
          />
        </Stack>
        <Stack gap={8}>
          <H2>Two Discovery scores</H2>
          <Card>
            <CardHeader trailing={<Pill tone="info" size="small">Searcher</Pill>}>
              Authors' algorithm
            </CardHeader>
            <CardBody>
              <Text size="small">
                How to pick parents and accept children. GEPA: reflect on traces
                and keep a Pareto set. HGM: pooled descendant pass rate plus
                Thompson sampling. Grade this against other searchers with the
                same candidate language, not against chain-of-thought.
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="small">Object</Pill>}>
              What search emitted
            </CardHeader>
            <CardBody>
              <Text size="small">
                Prompt, workflow, loss, merge, tool. If the named code does not
                do the named job, this score is D. Remixing debate, retries, and
                majority vote from a human operator list caps at C. Rebuilding
                normal coding tools from a stripped starter (DGM) also caps at C.
              </Text>
            </CardBody>
          </Card>
        </Stack>
      </Grid>

      <Stack gap={8}>
        <H2>Evolved-object ceilings</H2>
        <Table
          headers={["If this happened", "Max", "Evidence"]}
          rows={[
            [
              "Named mechanism does not run",
              <Pill tone="danger" size="small">D</Pill>,
              "HGM: skip pip install / skip the syntax fix, still return True",
            ],
            [
              "Already in the seed prompt, operator list, or a textbook",
              <Pill tone="warning" size="small">C</Pill>,
              "STOP: beam search, annealing, UCB. MASS/AFlow: debate, aggregate, tests",
            ],
            [
              "Start was missing ordinary tools, then search put them back",
              <Pill tone="warning" size="small">C</Pill>,
              "DGM: line-range view, string replace, retries, extra ranker",
            ],
            [
              "Abstract names a candidate that the tables do not pick",
              <Text size="small">drop a letter; not A or B</Text>,
              "DiscoPOP brands LRML; DBAQL/PADLL/AQFL match or beat it",
            ],
            [
              "Extra calls or a stronger model can explain the gain",
              <Pill tone="warning" size="small">C</Pill>,
              "Gödel unrestricted GPT-4o assist; ADAS multi-critic loops",
            ],
          ]}
        />
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H2>RSI: later systems better at making the next system?</H2>
        <Table
          headers={["Level", "Required", "Not enough"]}
          rows={[
            [
              "0",
              "A fixed outer searcher. Prompts or workflows may still change.",
              "Calling the loop self-improving (GEPA, ADAS, ShinkaEvolve, DiscoPOP)",
            ],
            [
              "1",
              "The agent edits itself, or mutation prompts coevolve. The reported number is still task success.",
              "A bigger archive; CMP on coding scores; Self-Developing always merging onto the original seed model",
            ],
            [
              "2",
              "Early / mid / late parents, same hidden failures, same mutation budget and models. Child-score distributions move up. Repeat the whole search.",
              "Best agent's task score went up. Best descendant on the finished tree scored higher.",
            ],
            [
              "3",
              "Level 2 on two held-out task families, and later generations use their own searcher.",
              "A long tree still planned by the same frozen diagnostic model",
            ],
          ]}
        />
        <Callout tone="info" title="Level 2 is empty in this set">
          HGM's clade score (pooled descendant pass rate) is a reasonable way
          to pick whom to expand. It still grades descendants on SWE/Polyglot
          tasks, not on how good those descendants are as improvers. No paper
          runs the child-quality experiment.
        </Callout>
      </Stack>

      <Stack gap={8}>
        <H2>Worked experiments (not papers)</H2>
        <Text tone="secondary" size="small">
          Plus means the letter plus one extra hygiene item. Minus means two
          secondary misses. A PDF can own several of these rows.
        </Text>
        <Table
          headers={[
            "Experiment",
            "Eval",
            "Searcher",
            "Object",
            "RSI",
            "Ceiling that binds",
          ]}
          rows={[
            [
              "GEPA main (train/val/test)",
              "B+",
              "B",
              "C+",
              "0",
              "Validation queried every round; test held out",
            ],
            [
              "GEPA KernelBench, same 35 kernels",
              "D",
              "B",
              "C",
              "0",
              "Search and report share the kernels",
            ],
            [
              "ACE offline playbook",
              "B+",
              "B",
              "C",
              "0",
              "Train then freeze. Playbooks include instance paths",
            ],
            [
              "ACE online on test stream",
              "C",
              "B",
              "C",
              "0",
              "Learns from earlier test outcomes",
            ],
            [
              "AFlow 20/80 then high-variance val",
              "B−",
              "C",
              "C",
              "0",
              "Search set rewritten after the split",
            ],
            [
              "DiscoPOP LRML",
              "B",
              "C",
              "B−",
              "0",
              "Named loss is not the held-out winner",
            ],
            [
              "DGM SWE 20% → 50%",
              "D",
              "C",
              "C−",
              "1",
              "o1 sees private tests; start omitted standard tools",
            ],
            [
              "HGM CMP vs DGM/SICA",
              "C+",
              "B",
              "—",
              "1",
              "Search-method claim; still task scores",
            ],
            [
              "HGM 8,000 evals on 500 Verified",
              "D",
              "B",
              "C",
              "1",
              "Same 500 tasks for search and headline",
            ],
            [
              "HGM attempt_error_resolution",
              "—",
              "—",
              "D",
              "1",
              "Logs “would”, skips the fix, returns success",
            ],
            [
              "ShinkaEvolve MoE loss",
              "B",
              "C+",
              "B",
              "0",
              "Mean +0.006; HellaSwag/PIQA down; expert count unchanged",
            ],
            [
              "GPTSwarm MiniCrosswords",
              "D",
              "C",
              "C",
              "0",
              "20 puzzles for search and score",
            ],
          ].map((r) => [
            r[0],
            <Pill key={r[0] + "e"} tone={capTone(r[1])} size="small">
              {r[1]}
            </Pill>,
            r[2],
            r[3],
            r[4],
            r[5],
          ])}
        />
      </Stack>

      <Text tone="secondary" size="small">
        Next step is to put every headline on this card. Until someone measures
        child quality under a hidden evaluator, RSI stays 0 or 1.
      </Text>
    </Stack>
  );
}
