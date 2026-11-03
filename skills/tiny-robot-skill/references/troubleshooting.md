# Troubleshooting

## Outcome

Explain the observed TinyRobot failure from consumer and public-contract evidence before changing code.

## Evidence to collect

- exact error, reproduction, and expected behavior;
- consumer versions and resolved TinyRobot package versions;
- imports and the smallest relevant component/runtime setup;
- matching index entry, formal doc, demo, and installed declaration;
- browser/network evidence for model requests when relevant.

## Diagnostic order

1. **Resolution:** Is the symbol exported by the installed package and imported from the owning package?
2. **Version alignment:** Are task-required Chat, components, and Kit packages compatible and on the intended line?
3. **Required assets:** Are documented styles loaded, and does an embedded Layout/Chat have an explicit usable height?
4. **Contract:** Do props, events, slots, runtime options, and return values match installed declarations?
5. **Ownership:** Is the application handling emitted state changes, extension actions, persistence, credentials, and errors that TinyRobot does not own?
6. **Request path:** For model failures, inspect URL, headers, server proxy, response shape, streaming format, cancellation, and surfaced error state.

Use the troubleshooting or FAQ section of the exact formal doc when it exists. Do not generalize a fix from a different component.

## Output and stopping condition

Report reproduction evidence, root cause, affected contract, and the narrowest fix with focused verification. If the installed declaration and 1.0 snapshot disagree, stop and report both versions/definitions; do not conceal the mismatch with a cast or guessed prop.
