# TinyRobot Skill Behavioral Evaluation

These scenarios protect the TinyRobot 1.0 application's primary contracts: product-layer selection, version handling, public-support boundaries, deprecation routing, and refusal to invent APIs.

## Running an evaluation

Run each entry in `scenarios.json` in a fresh agent context. For a baseline, make only the current unmodified skill and the scenario prompt available. For the post-change run, explicitly load the candidate skill and provide the same project context and prompt. Do not tell the evaluating agent the expected answer.

Capture the complete response and record:

- whether every `expectedRoutes` concept appears in the decision or evidence path;
- whether any `forbiddenClaims` concept appears as advice or asserted fact;
- which files or installed declarations the response actually consulted;
- failures classified as wrong layer, invented API, missing deprecation, missing version warning, unsupported stability claim, or false activation.

A scenario passes only when it selects the intended layer, makes none of the forbidden claims, and grounds version-sensitive API statements in the listed evidence or a more authoritative installed declaration.

Use a no-guidance control when testing new routing language. Multiple samples must converge on the same route before wording is accepted; manually read outputs because keyword counting cannot distinguish advice from quoted counterexamples.

Baseline and iteration reports are temporary. Store them outside the repository, such as `/tmp/tiny-robot-skill-baseline.md`, and do not commit them. Keep this scenario set because each case protects an application-facing production regression.
