import {
  Callout,
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

export default function CohortCalibrationCanvas() {
  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1180 }}>
      <Stack gap={8}>
        <H1>Cohort calibration</H1>
        <Text tone="secondary" size="small">
          Same letter means the same ceiling and the same kind of miss, not the
          same sin. Paper-by-paper evidence is in papers/.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="B+" label="Best Eval: GEPA main, ACE offline" tone="success" />
        <Stat value="B" label="Best object: ShinkaEvolve MoE" tone="info" />
        <Stat value="B" label="Best searcher: GEPA, ACE, HGM CMP" tone="info" />
        <Stat value="0–1" label="RSI. Empty at 2" tone="warning" />
      </Grid>

      <Callout tone="warning" title="D is not one thing">
        DGM SWE 20% → 50% is hidden tests in the next-edit prompt. HGM 61.4% is
        the same 500 tasks for search and report. AgentSquare is no documented
        frozen split. GPTSwarm MiniCrosswords is 20 puzzles both ways. Same
        letter, different leak.
      </Callout>

      <Stack gap={8}>
        <H2>Eval ladder</H2>
        <Table
          headers={["Band", "Who", "Why they sit together"]}
          rows={[
            [
              "A",
              "Empty",
              "Nobody reran search, kept a clean test, and matched compute.",
            ],
            [
              "B+",
              "GEPA main; ACE offline",
              "GEPA: documented splits, matched prompt-optimizer budgets, validation reused. ACE: train then freeze, original test. Both: one search.",
            ],
            [
              "B",
              "STOP LPN; DiscoPOP held-out; Shinka MoE / ALE / AIME years",
              "STOP: five full loops, toy tasks. DiscoPOP: real held-out family, branding miss. Shinka: public/private or year split, no extra seeds.",
            ],
            [
              "B−",
              "PromptBreeder, ADAS, AFlow, MaAS, MASS, Self-Developing, packing",
              "AFlow rewrites val after the split. MASS ± is three answers. PromptBreeder borrows OPRO rows. Same letter, different misses.",
            ],
            [
              "C / C+",
              "ACE online; GPTSwarm MMLU; HGM Lite-207; DGM Polyglot",
              "C+ means they cut overlap (HGM 207). Streaming-on-test is C, not frozen accuracy.",
            ],
            [
              "C−",
              "Gödel main table",
              "Val split exists. Writer is GPT-4o, solver is GPT-3.5.",
            ],
            [
              "D",
              "MiniCrosswords, HumanEval, AgentSquare, DGM SWE, HGM 500, KernelBench, AIME 2024 search",
              "Same tasks, or hidden tests in the proposer, or no split.",
            ],
          ]}
        />
      </Stack>

      <Divider />

      <Grid columns={2} gap={16}>
        <Stack gap={8}>
          <H2>Close Eval calls</H2>
          <Table
            headers={["Pair", "Verdict"]}
            rows={[
              [
                "ACE offline vs GEPA main",
                "Tie at B+. ACE has the cleaner test isolation. GEPA has the cleaner optimizer comparison.",
              ],
              [
                "STOP B vs GEPA B+",
                "STOP is the stronger protocol for toys (five loops). GEPA is the stronger number for natural tasks.",
              ],
              [
                "DiscoPOP B vs MASS B−",
                "DiscoPOP held-out is another benchmark family. MASS test is a small slice of the same family.",
              ],
              [
                "AFlow vs ADAS, both B−",
                "AFlow: better split, worse val rewrite. ADAS: held-out test, easy ARC and extra calls.",
              ],
            ]}
          />
        </Stack>
        <Stack gap={8}>
          <H2>Object ladder</H2>
          <Table
            headers={["Band", "Who"]}
            rows={[
              ["A", "Empty. MoE needs seeds, term ablations, different expert count."],
              ["B", "ShinkaEvolve MoE hinge. Mean +0.006, mixed tasks, 64/8 frozen."],
              ["B−", "DiscoPOP LRML. Real formula, not the table winner."],
              ["C+", "Self-Developing merge; GEPA prompts."],
              ["C", "Debate / retries / tests / beam search / range-read."],
              ["C−", "AgentSquare modules; DGM tools from a stripped start."],
              ["D", "HGM attempt_error_resolution (logs “would”, returns True)."],
            ]}
          />
        </Stack>
      </Grid>

      <Stack gap={8}>
        <H2>If you need one citation</H2>
        <Table
          headers={["Question", "Cite", "Skip"]}
          rows={[
            [
              "Prompt evolution you can defend",
              "GEPA main (Eval B+)",
              "KernelBench; 35× as typical",
            ],
            [
              "Frozen playbook",
              "ACE offline (Eval B+)",
              "ACE online as the same estimand",
            ],
            [
              "Searcher aimed at RSI",
              "HGM CMP vs DGM (searcher B); STOP loop (B−)",
              "DGM 20→50; HGM 61.4%",
            ],
            [
              "Machine-written technical object",
              "ShinkaEvolve MoE (object B)",
              "AIME scaffold; DGM tools; HGM resolver",
            ],
            [
              "Did improvers get better at improving?",
              "Nobody (RSI 2 empty)",
              "Gödel / DGM / HGM titles",
            ],
          ]}
        />
      </Stack>

      <Text tone="secondary" size="small">
        Full paper-by-paper evidence, quotes, and “why not higher / why not
        lower” is in papers/.
      </Text>
    </Stack>
  );
}
