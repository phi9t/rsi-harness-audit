import {
  Button,
  Callout,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
} from "cursor/canvas";

type Family = "all" | "prompt" | "workflow" | "self" | "object";

type Grade = string;

type Claim = {
  family: Exclude<Family, "all">;
  experiment: string;
  see: string;
  eval: Grade;
  search: Grade;
  object: Grade;
  rsi: string;
  why: string;
};

const CLAIMS: Claim[] = [
  {
    family: "prompt",
    experiment: "PromptBreeder GSM8K / arithmetic leftover half",
    see: "2",
    eval: "B−",
    search: "C",
    object: "C",
    rsi: "1",
    why: "Train-batch fitness then leftover test. No search repeats. Borrowed OPRO/davinci rows. SOLUTION is a short control string.",
  },
  {
    family: "prompt",
    experiment: "GEPA main, four tasks (HotpotQA / IFBench / HoVer / PUPA)",
    see: "2",
    eval: "B+",
    search: "B",
    object: "C+",
    rsi: "0",
    why: "Train/val/test exist. Val is Pareto selection. MIPROv2 budgets matched. Qwen 48.85 → 61.28. AIME rows are not in this preprint.",
  },
  {
    family: "prompt",
    experiment: "GEPA KernelBench, 35 kernels",
    see: "3",
    eval: "D",
    search: "B",
    object: "C",
    rsi: "0",
    why: "Search and report use the same 35 kernels.",
  },
  {
    family: "prompt",
    experiment: "ACE offline playbook, original test",
    see: "1",
    eval: "B+",
    search: "B",
    object: "C",
    rsi: "0",
    why: "Train then freeze. Playbooks include file paths and app APIs. The updater is the method.",
  },
  {
    family: "prompt",
    experiment: "ACE online on shuffled test",
    see: "stream",
    eval: "C",
    search: "B",
    object: "C",
    rsi: "0",
    why: "Predict, learn from that test outcome, continue. Not frozen held-out accuracy.",
  },
  {
    family: "workflow",
    experiment: "GPTSwarm MiniCrosswords",
    see: "3",
    eval: "D",
    search: "C",
    object: "C",
    rsi: "0",
    why: "Same 20 puzzles for search and score.",
  },
  {
    family: "workflow",
    experiment: "GPTSwarm HumanEval stream",
    see: "3",
    eval: "D",
    search: "C",
    object: "C",
    rsi: "0",
    why: "Prompts updated from the benchmark being reported. 0.76 → 0.88.",
  },
  {
    family: "workflow",
    experiment: "GPTSwarm MMLU collaborative",
    see: "2",
    eval: "C",
    search: "C",
    object: "C",
    rsi: "0",
    why: "Five training seeds, +2.1±1.1, overlapping val/dev. Only repeated search in this paper.",
  },
  {
    family: "workflow",
    experiment: "ADAS main tables",
    see: "2",
    eval: "B−",
    search: "C",
    object: "C",
    rsi: "0",
    why: "Val then test, one trajectory. Easy ARC grids. Many more calls than CoT. Seed already lists debate and self-consistency.",
  },
  {
    family: "workflow",
    experiment: "AFlow 20/80 then high-variance val",
    see: "2r",
    eval: "B−",
    search: "C",
    object: "C",
    rsi: "0",
    why: "Test exists. After the split, keep only high-variance val items. Human operator list.",
  },
  {
    family: "workflow",
    experiment: "AgentSquare six environments",
    see: "3?",
    eval: "D",
    search: "C",
    object: "C−",
    rsi: "0",
    why: "No frozen final split. Predictor sees past scores. Recombined named modules.",
  },
  {
    family: "workflow",
    experiment: "MaAS supernet, 1:4 split",
    see: "2",
    eval: "B−",
    search: "B−",
    object: "C",
    rsi: "0",
    why: "Train used for router and selection. MATH from 617 level-5. Router vs AFlow is a searcher comparison; paths still walk known operators.",
  },
  {
    family: "workflow",
    experiment: "MASS staged prompt + topology",
    see: "2",
    eval: "B−",
    search: "B−",
    object: "C",
    rsi: "0",
    why: "Held-out test, tiny subsets. ± is three answers, not three searches. Staging vs ADAS/AFlow is the searcher.",
  },
  {
    family: "self",
    experiment: "STOP 10-bit LPN, 5 full runs",
    see: "1",
    eval: "B",
    search: "B−",
    object: "C",
    rsi: "1",
    why: "20 train / 50 held-out. Five complete loops. Toys. Rediscovered beam search and annealing.",
  },
  {
    family: "self",
    experiment: "STOP transfer of one LPN improver to five toys",
    see: "1 relative",
    eval: "B−",
    search: "B−",
    object: "C",
    rsi: "1",
    why: "One improver after T=4, not the five-run protocol. Same textbook children.",
  },
  {
    family: "self",
    experiment: "Gödel Agent val→test, 4o writes / 3.5 runs",
    see: "2",
    eval: "C−",
    search: "C",
    object: "C−",
    rsi: "1",
    why: "GPQA val is 32. Stronger writer, weaker solver. Majority vote and roles.",
  },
  {
    family: "self",
    experiment: "DGM SWE-bench 20% → 50%",
    see: "4",
    eval: "D",
    search: "C",
    object: "C−",
    rsi: "1",
    why: "o1 diagnosis prompt gets the official private test patch and log. Start omitted ordinary coding tools.",
  },
  {
    family: "self",
    experiment: "DGM Polyglot extra eval on the full set",
    see: "2r",
    eval: "C",
    search: "C",
    object: "C",
    rsi: "1",
    why: "Solver never sees hidden tests. Search used a 10/50 slice; 14.2% → 30.7% is a later pass of the winner.",
  },
  {
    family: "self",
    experiment: "DGM SWE-grown agent on Polyglot",
    see: "holdout",
    eval: "C",
    search: "C",
    object: "C−",
    rsi: "1",
    why: "14.2% → 28.9% on a benchmark the SWE loop never scored. Does not clean the 20→50 number.",
  },
  {
    family: "self",
    experiment: "HGM vs DGM/SICA on Verified-60",
    see: "2r",
    eval: "C+",
    search: "B",
    object: "C",
    rsi: "1",
    why: "Lineage pass rate vs greedy parent pick. After-the-fact best descendant is not the online score.",
  },
  {
    family: "self",
    experiment: "HGM 8,000 evals on all 500 Verified",
    see: "3",
    eval: "D",
    search: "B",
    object: "C",
    rsi: "1",
    why: "53.2% → 61.4% on the same 500 tasks.",
  },
  {
    family: "self",
    experiment: "HGM Verified agent on Lite-207",
    see: "1*",
    eval: "C+",
    search: "B",
    object: "C",
    rsi: "1",
    why: "93 Lite tasks overlap Verified; they report the 207. 34.8% → 40.1% vs SWE-agent 39.6. One run.",
  },
  {
    family: "self",
    experiment: "HGM attempt_error_resolution",
    see: "—",
    eval: "—",
    search: "—",
    object: "D",
    rsi: "1",
    why: "Logs “would install / would fix”, skips the action, returns success.",
  },
  {
    family: "object",
    experiment: "DiscoPOP LRML vs held-out tables",
    see: "2",
    eval: "B",
    search: "C",
    object: "B−",
    rsi: "0",
    why: "Real held-out suite. Named loss is 6th on MT-Bench and not the AlpacaEval win-rate winner. Overlapping error bars.",
  },
  {
    family: "object",
    experiment: "Self-Developing merge, GSM8K/MATH remainder",
    see: "2",
    eval: "B−",
    search: "C",
    object: "C+",
    rsi: "0",
    why: "Dev then remainder. Top 15 of many merges. Always applied to the original seed model. Mean-and-product unablated.",
  },
  {
    family: "object",
    experiment: "ShinkaEvolve circle packing",
    see: "3-exact",
    eval: "B−",
    search: "C+",
    object: "C",
    rsi: "0",
    why: "Search objective is the score, but packing is checkable. Ablations live here, not three headline searches. Standard annealing + SLSQP mix.",
  },
  {
    family: "object",
    experiment: "ShinkaEvolve AIME 2024 search",
    see: "3",
    eval: "D",
    search: "C+",
    object: "C",
    rsi: "0",
    why: "All 30 AIME 2024 questions used for search.",
  },
  {
    family: "object",
    experiment: "ShinkaEvolve AIME 2023/2025 transfer",
    see: "1*",
    eval: "B",
    search: "C+",
    object: "C",
    rsi: "0",
    why: "Year held out. Scaffold is experts + critics + majority (7 calls).",
  },
  {
    family: "object",
    experiment: "ShinkaEvolve ALE-Bench LITE, 10 tasks",
    see: "2",
    eval: "B",
    search: "C+",
    object: "C",
    rsi: "0",
    why: "Public score for search, private for the report. Local cache and move tweaks on 10 contests.",
  },
  {
    family: "object",
    experiment: "ShinkaEvolve MoE load-balancing loss",
    see: "2",
    eval: "B",
    search: "C+",
    object: "B",
    rsi: "0",
    why: "Scale-up 556M → 2.7B, same 64 experts / top-8. Mean 0.362 → 0.368; HellaSwag and PIQA drop. No extra seeds.",
  },
];

function evalTone(
  g: string
): "success" | "warning" | "danger" | "info" | "neutral" {
  if (g === "—" || g === "n/a") return "neutral";
  if (g.startsWith("D")) return "danger";
  if (g.startsWith("C")) return "warning";
  if (g.includes("B+")) return "success";
  if (g.startsWith("B")) return "info";
  return "neutral";
}

export default function GradesRound2Canvas() {
  const [family, setFamily] = useCanvasState<Family>("family", "all");
  const rows = CLAIMS.filter((c) => family === "all" || c.family === family);

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1180 }}>
      <Stack gap={8}>
        <H1>Grades, round 2</H1>
        <Text tone="secondary" size="small">
          One experiment per row. Search method and evolved object are separate
          scores. See = what the proposer was allowed to see (1 frozen test, 2
          validation reused, 2r split then rewritten, 3 same tasks, 4 hidden
          tests in the proposal prompt). Full writeup: RUBRICS.md.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={String(CLAIMS.length)} label="Experiments scored" />
        <Stat value="0" label="Eval A / object A / RSI 2" />
        <Stat value="B+" label="Best Eval: GEPA main, ACE offline" tone="success" />
        <Stat value="B" label="Best object: ShinkaEvolve MoE loss" tone="info" />
      </Grid>

      <Callout tone="warning" title="Cite the row, not the PDF">
        GEPA is B+ only for the main train/validation/test tables. KernelBench
        in the same paper is D. HGM’s lineage-picking rule is B; the 61.4% on
        all 500 Verified tasks is D; the showcased error-resolution function is
        D.
      </Callout>

      <Stack gap={8}>
        <H2>Letters that moved this round</H2>
        <Table
          headers={["Item", "From", "To", "Rule that forced it"]}
          rows={[
            [
              "MASS Eval",
              "B",
              "B−",
              "Held-out test, but tiny subsets and ± over three answers",
            ],
            [
              "MaAS / MASS search method",
              "C",
              "B−",
              "Compared to other searchers, not only to chain-of-thought",
            ],
            [
              "ACE search method",
              "mixed into C+",
              "B",
              "Playbook updater vs playbook contents",
            ],
            [
              "STOP evolved object",
              "C+",
              "C",
              "Beam search and annealing are textbook",
            ],
            [
              "GEPA KernelBench, GPTSwarm MMLU, DGM Polyglot",
              "buried in a paper letter",
              "own rows",
              "One experiment, one grade",
            ],
          ]}
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>All experiments</H2>
        <Row gap={8} wrap>
          {(
            [
              ["all", "All"],
              ["prompt", "Prompts / context"],
              ["workflow", "Workflows"],
              ["self", "Self-editing"],
              ["object", "Losses / algorithms"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              size="small"
              variant={family === id ? "primary" : "secondary"}
              onClick={() => setFamily(id)}
            >
              {label}
            </Button>
          ))}
        </Row>
        <Table
          headers={[
            "Experiment",
            "See",
            "Eval",
            "Searcher",
            "Object",
            "RSI",
            "Why",
          ]}
          rows={rows.map((c) => [
            c.experiment,
            c.see,
            <Pill key={c.experiment + "e"} tone={evalTone(c.eval)} size="small">
              {c.eval}
            </Pill>,
            c.search,
            c.object,
            c.rsi,
            c.why,
          ])}
        />
      </Stack>

      <Stack gap={8}>
        <H2>If you need one citation</H2>
        <Table
          headers={["Question", "Use", "Skip"]}
          rows={[
            [
              "Prompt evolution with a real test split",
              "GEPA main (Eval B+)",
              "KernelBench; the 35× rollout line",
            ],
            [
              "Frozen playbook",
              "ACE offline (Eval B+)",
              "ACE online as the same kind of number",
            ],
            [
              "Workflow shape inside a human operator list",
              "MASS or MaAS (Eval B−, object C)",
              "“Agents invented new architectures”",
            ],
            [
              "An improver that rewrites itself",
              "STOP (Eval B, object C)",
              "Open-ended RSI",
            ],
            [
              "Lineage-aware parent pick",
              "HGM vs DGM on the 60-slice (searcher B)",
              "61.4% on 500 Verified; error-resolution snippet",
            ],
            [
              "A technical object worth reproducing",
              "ShinkaEvolve MoE loss (object B)",
              "AIME scaffold; DGM tools",
            ],
            [
              "Better improvers, not just better task scores",
              "Nobody",
              "DGM / HGM / Gödel titles",
            ],
          ]}
        />
      </Stack>
    </Stack>
  );
}
