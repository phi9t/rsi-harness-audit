import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

type EvalGrade = "A" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "D+";
type DiscGrade = "A" | "B" | "B-" | "C+" | "C" | "C-" | "D";

type PaperRow = {
  paper: string;
  eval: EvalGrade;
  discovery: string;
  rsi: 0 | 1;
  delta: string;
  exposure: "1" | "2" | "3" | "4" | "2/3" | "mixed";
  artifact: string;
};

const PAPERS: PaperRow[] = [
  {
    paper: "PromptBreeder",
    eval: "B-",
    discovery: "C",
    rsi: 1,
    delta: "Hold; seed pressure",
    exposure: "2",
    artifact: "SOLUTION / mutation prompts",
  },
  {
    paper: "GPTSwarm",
    eval: "D",
    discovery: "C",
    rsi: 0,
    delta: "Hold",
    exposure: "3",
    artifact: "Edge probs among ToT/Reflexion",
  },
  {
    paper: "STOP",
    eval: "B",
    discovery: "C+",
    rsi: 1,
    delta: "Disc → C optional",
    exposure: "1",
    artifact: "Textbook search scaffolds",
  },
  {
    paper: "DiscoPOP",
    eval: "B",
    discovery: "B-",
    rsi: 0,
    delta: "Eval B+ → B",
    exposure: "2",
    artifact: "LRML preference loss",
  },
  {
    paper: "ADAS",
    eval: "B-",
    discovery: "C",
    rsi: 0,
    delta: "Hold",
    exposure: "2",
    artifact: "SC/critique/ensemble code",
  },
  {
    paper: "AFlow",
    eval: "B-",
    discovery: "C",
    rsi: 0,
    delta: "Eval B → B-",
    exposure: "2",
    artifact: "Operator workflows",
  },
  {
    paper: "AgentSquare",
    eval: "D",
    discovery: "C-",
    rsi: 0,
    delta: "Hold",
    exposure: "3",
    artifact: "Module recombinations",
  },
  {
    paper: "Gödel Agent",
    eval: "C-",
    discovery: "C-",
    rsi: 1,
    delta: "Hold",
    exposure: "2",
    artifact: "Game-of-24 brute force",
  },
  {
    paper: "Self-Developing",
    eval: "B-",
    discovery: "C+",
    rsi: 0,
    delta: "Hold",
    exposure: "2",
    artifact: "Hybrid mean merge",
  },
  {
    paper: "MaAS",
    eval: "B-",
    discovery: "C",
    rsi: 0,
    delta: "Hold",
    exposure: "2",
    artifact: "Query-conditioned routing",
  },
  {
    paper: "GEPA",
    eval: "B+",
    discovery: "C+",
    rsi: 0,
    delta: "Hold main",
    exposure: "2",
    artifact: "Task policies in prompts",
  },
  {
    paper: "ACE",
    eval: "B+",
    discovery: "C",
    rsi: 0,
    delta: "Disc C+ → C",
    exposure: "mixed",
    artifact: "AppWorld playbooks",
  },
  {
    paper: "MASS",
    eval: "B",
    discovery: "C",
    rsi: 0,
    delta: "Hold",
    exposure: "2",
    artifact: "Staged topologies",
  },
  {
    paper: "ShinkaEvolve",
    eval: "B+",
    discovery: "B / C",
    rsi: 0,
    delta: "Hold hetero",
    exposure: "mixed",
    artifact: "MoE LBL (+ AIME/ALE)",
  },
  {
    paper: "DGM",
    eval: "D",
    discovery: "C-",
    rsi: 1,
    delta: "Private-test CONFIRMED",
    exposure: "4",
    artifact: "Standard coding harness",
  },
  {
    paper: "HGM",
    eval: "C+",
    discovery: "B / D*",
    rsi: 1,
    delta: "No-op resolver CONFIRMED",
    exposure: "3",
    artifact: "CMP search; fake resolver",
  },
];

function evalTone(
  g: EvalGrade
): "success" | "warning" | "danger" | "info" | "neutral" {
  if (g === "A" || g === "B+") return "success";
  if (g === "B" || g === "B-") return "info";
  if (g === "C+" || g === "C") return "warning";
  return "danger";
}

function exposureTone(
  e: PaperRow["exposure"]
): "success" | "warning" | "danger" | "info" | "neutral" {
  if (e === "1") return "success";
  if (e === "2") return "info";
  if (e === "3" || e === "2/3") return "warning";
  if (e === "4") return "danger";
  return "neutral";
}

export default function RSIHarnessAuditCanvas() {
  const confirmations = [
    {
      title: "DGM private-test leak",
      body: "o1 diagnosis prompt includes official private test patch + private-test results. Authors deny hardcoding; exposure remains level-4 contamination.",
    },
    {
      title: "HGM no-op resolver",
      body: "attempt_error_resolution appends “Would attempt…” strings, skips pip install / apply_fix, returns True. Not evidence of multi-step self-repair.",
    },
    {
      title: "No I(A) experiment",
      body: "Zero papers measure E[Q(child)−Q(parent)] under matched mutation budget across generations. CMP aggregates task Q, not improver skill.",
    },
    {
      title: "MoE loss is real but thin",
      body: "Entropy-scaled hinge under τ=0.064/N_E. Mean 0.362→0.368 @ λ=0.01; HellaSwag/PIQA regress; N_E=64 K=8 fixed; no multi-seed.",
    },
  ];

  const gradeDeltas = [
    ["DiscoPOP Eval", "B+ → B", "MT-Bench selection+report; LRML not #1 held-out"],
    ["AFlow Eval", "B → B−", "High-variance val filter rewrites search objective"],
    ["ACE Discovery", "C+ → C", "Playbooks look like task cheatsheets"],
    ["HGM artifact*", "C− → D", "Showcased error-resolution is nonfunctional"],
  ] as const;

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1100 }}>
      <Stack gap={8}>
        <H1>RSI / Harness Audit — Pedantic Pass</H1>
        <Text tone="secondary" size="small">
          Primary-source verification of 16 top-conference papers. Core thesis
          holds. Four grade deltas; two high-stakes claims confirmed verbatim.
        </Text>
        <Callout tone="warning" title="Superseded as the grade board">
          This canvas is the v1 one-letter-per-PDF pass. Current experiment
          grades are in rsi-harness-grades-round2 and RUBRICS.md.
        </Callout>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="0" label="Eval / Disc grade A" />
        <Stat value="0" label="RSI level ≥ 2" tone="success" />
        <Stat value="2" label="Grade downgrades" tone="warning" />
        <Stat value="2" label="Claims confirmed" tone="danger" />
      </Grid>

      <Callout tone="warning" title="Revised boxed verdict (unchanged)">
        Automated search can improve prompts, workflows, and code. It can
        sometimes produce an interesting technical artifact (Shinka MoE;
        weaker DiscoPOP / Self-Developing). It has not been shown to recursively
        become better at improving itself.
      </Callout>

      <Stack gap={8}>
        <H2>Confirmed high-stakes findings</H2>
        <Grid columns={2} gap={12}>
          {confirmations.map((c) => (
            <Card key={c.title}>
              <CardHeader trailing={<Pill tone="danger" size="small">CONFIRMED</Pill>}>
                {c.title}
              </CardHeader>
              <CardBody>
                <Text size="small">{c.body}</Text>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Stack>

      <Stack gap={8}>
        <H2>Grade board (post-correction)</H2>
        <Text tone="secondary" size="small">
          HGM Discovery “B / D*” = B for CMP search policy; D for showcased
          attempt_error_resolution. ACE Eval shown as offline B+ (online is C).
          Shinka Discovery = B MoE / C harness.
        </Text>
        <Table
          headers={[
            "Paper",
            "Eval",
            "Discovery",
            "RSI",
            "Exposure",
            "Delta vs prior audit",
            "Headline artifact",
          ]}
          rows={PAPERS.map((p) => [
            p.paper,
            <Pill key="e" tone={evalTone(p.eval)} size="small">
              {p.eval}
            </Pill>,
            p.discovery,
            String(p.rsi),
            <Pill key="x" tone={exposureTone(p.exposure)} size="small">
              L{p.exposure}
            </Pill>,
            p.delta,
            p.artifact,
          ])}
          rowTone={PAPERS.map((p) =>
            p.exposure === "4"
              ? "danger"
              : p.delta.includes("→")
                ? "warning"
                : undefined
          )}
        />
        <Text tone="secondary" size="small">
          Exposure: L1 clean final · L2 adaptive val · L3 same population · L4
          private evaluator internals · mixed = protocol differs by experiment
        </Text>
      </Stack>

      <Stack gap={8}>
        <H2>Material grade deltas</H2>
        <Table
          headers={["Item", "Change", "Why"]}
          rows={gradeDeltas.map(([a, b, c]) => [a, b, c])}
        />
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H2>Strongest evidence by question</H2>
        <Grid columns={2} gap={12}>
          <Card>
            <CardHeader>Practical harness optimization</CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Row gap={8}>
                  <Pill tone="success" size="small">GEPA</Pill>
                  <Text size="small">Best prompt protocol (train/val/test)</Text>
                </Row>
                <Row gap={8}>
                  <Pill tone="info" size="small">MASS</Pill>
                  <Text size="small">Staged prompt + topology</Text>
                </Row>
                <Row gap={8}>
                  <Pill tone="info" size="small">ACE off</Pill>
                  <Text size="small">Structured context / playbook</Text>
                </Row>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Self-reference / metaproductivity</CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Row gap={8}>
                  <Pill tone="warning" size="small">STOP</Pill>
                  <Text size="small">Cleanest toy self-reference + hacking</Text>
                </Row>
                <Row gap={8}>
                  <Pill tone="warning" size="small">HGM</Pill>
                  <Text size="small">CMP idea; still RSI level 1</Text>
                </Row>
                <Row gap={8}>
                  <Pill tone="danger" size="small">DGM</Pill>
                  <Text size="small">Negative-control eval case study</Text>
                </Row>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Scientific artifact discovery</CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Row gap={8}>
                  <Pill tone="success" size="small">Shinka MoE</Pill>
                  <Text size="small">Entropy-scaled hinge LBL</Text>
                </Row>
                <Row gap={8}>
                  <Pill tone="info" size="small">DiscoPOP</Pill>
                  <Text size="small">Plausible loss; not clearly best</Text>
                </Row>
                <Row gap={8}>
                  <Pill tone="neutral" size="small">Self-Dev</Pill>
                  <Text size="small">Hybrid mean merge; under-ablated</Text>
                </Row>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Empty empirical slot</CardHeader>
            <CardBody>
              <Stack gap={6}>
                <H3>Measure I(A), not only Q(A)</H3>
                <Text size="small">
                  Snapshot early / mid / late agents. Same hidden failures, same
                  mutation budget, same models. Compare child-quality
                  distributions. Require median over outer seeds, frozen final
                  evaluator, compute-matched baselines.
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Callout tone="info" title="Full writeup">
        See PEDANTIC_CORRECTION_PASS.md in ~/rsi-harness-audit for reproducible
        protocols, exact formulas, contamination checklists, and source IDs.
      </Callout>
    </Stack>
  );
}
