# Application setup

## Outcome

Integrate the selected TinyRobot layer into the consumer's existing Vue application without assuming the documentation site's build setup.

## Evidence to load

1. Consumer `package.json`, lockfile, entry file, bundler config, and installed package metadata.
2. `component-index.json` entries for the selected layer.
3. `references/docs/suites/quick-start.md` for Chat, or `references/docs/guide/quick-start.md` for base components.
4. `references/docs/guide/theme-config.md` only when theme setup is requested.

## Procedure

1. Confirm Vue and Node requirements from the formal quick start.
2. Determine which packages required by the task are installed; recommend adding only the missing selected package(s).
3. For new installations, read `distTag` from `../install-config.json` and apply the channel below, unless the user requests a specific version. Preserve existing verified versions unless an upgrade is requested.
4. Import styles documented by the selected layer. A Chat setup normally needs both component and Chat styles; a component-only setup does not gain Chat exports.
5. Adapt imports to the consumer's entry and bundler. Do not copy VitePress-only syntax or aliases.
6. For complete Chat, begin with the formal `TrChat` + runtime example before adding customization.
7. Keep production API keys out of browser code; use the application's server-side proxy or credential boundary.

## Installation channel

Read [install-config.json](../install-config.json) before generating installation commands. Its `distTag` field selects the default npm dist-tag for new TinyRobot dependencies. Read it as data when constructing commands. If the file is missing or invalid, report that rather than guessing a channel.

The following are command templates. Substitute `<distTag>` with the actual configured value before presenting or executing them; the developer should receive runnable commands without placeholders. Use the consumer's package manager and add only the packages required by the selected layer:

| Selected layer | pnpm command template |
| --- | --- |
| Complete Chat | `pnpm add --save-exact @opentiny/tiny-robot-chat@<distTag> @opentiny/tiny-robot@<distTag>` |
| Component UI | `pnpm add --save-exact @opentiny/tiny-robot@<distTag>` |
| Standalone Kit | `pnpm add --save-exact @opentiny/tiny-robot-kit@<distTag>` |

If application code imports Kit or SVGs directly, declare `@opentiny/tiny-robot-kit@<distTag>` or `@opentiny/tiny-robot-svgs@<distTag>` directly using the same setting. Inspect the selected packages' published peer requirements and add missing peers, including Kit, DOMPurify, or markdown-it when required; preserve compatible existing installations. The TinyRobot channel setting does not apply to Vue or third-party peers.

The package manager resolves each tag to its current published version; `--save-exact` records that resolved version in the consumer manifest, and the lockfile records the dependency graph. Report actual resolved versions after installation. Snapshot installation examples show package selection; this configuration determines the default channel. If the resolved packages have an actual compatibility problem, follow `versioning.md` instead of adding an ad hoc override.

## Output

Provide the detected state, dependency delta, exact imports/styles, the smallest integration change, and a verification command appropriate to the consumer repository.

Stop when a required version or installed export cannot be confirmed. Report the missing evidence instead of guessing.
