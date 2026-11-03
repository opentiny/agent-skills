# Versioning and migration

## Outcome

Keep distribution version, documentation compatibility, snapshot provenance, and consumer dependencies distinct.

## Four version facts

| Fact | Source | Meaning |
| --- | --- | --- |
| Skill release | `SKILL.md`, plugin metadata, marketplace entry | Version of this packaged agent skill |
| Snapshot compatibility | `component-index.json.tinyRobotVersion` | TinyRobot release line the guidance targets (`1.0.x`) |
| Snapshot provenance | `component-index.json.source` and `references/docs/.snapshot.json` | Exact TinyRobot ref and commit used to generate bundled docs/demos |
| Consumer version | consumer manifest, lockfile, installed package metadata | API actually available to the application |

Never use the Skill release number as proof of a consumer API.

## Default installation channel

The default npm channel comes only from `distTag` in [install-config.json](../install-config.json). Read it when recommending new dependencies; apply it to every directly requested TinyRobot package unless the user explicitly selects another version. Follow [setup.md](setup.md#installation-channel) to generate concrete commands. Existing dependencies retain their verified versions unless an upgrade is requested.

The tag is a moving selector, not an API guarantee or a resolved version. Check the selected package metadata and actual lockfile/installation before generating version-sensitive code. Supported targets include stable `1.0.x` and published `1.0.0-rc.*` prereleases; do not reject RCs because a stable-only semver range check excludes them. If the configured tag resolves outside the documented target line, report the discrepancy rather than silently choosing another channel.

Changing the channel does not change the Skill release, bundled snapshot provenance, consumer lockfile, or already installed packages. Keep those facts separate. Compare published dependency/peer ranges and task-specific public declarations; a difference in RC suffix alone is not a compatibility failure.

## Compatibility procedure

1. Identify packages required by the requested feature, then read their resolved versions. Ignore a stale root manifest range when installed/lockfile evidence is available.
2. Report missing packages separately from version mismatches.
3. If required installed TinyRobot packages use different release lines, report all versions and align or verify published peer/dependency compatibility before target-version-sensitive code generation.
4. The target line includes stable `1.0.x` and published `1.0.0-rc.*` prereleases. For other consumer lines, use installed declarations and matching migration/release material; do not apply this snapshot as exact source-version API evidence.
5. For an explicit migration, analyze the old source and provide the documented 1.0 mapping. Delay only target code that depends on uninstalled or unverified target APIs.
6. If the consumer is on a newer 1.0 commit than the snapshot, use installed declarations for exact signatures and report any drift.

## 0.5 to 1.0 migration

Read the relevant files under `references/docs/migration/` before editing. For the two 1.0 deprecations:

- map Container layout mode, visibility, sidebars, and host behavior to Layout rather than renaming the tag;
- map McpServerPicker data and operations to ExtensionManager tabs/items/actions, specialized MCP UI, and application-owned host/persistence behavior.

## Stopping condition and output

Do not generate target-version-sensitive code while required target compatibility is unresolved. Return the detected matrix, snapshot provenance, missing dependencies versus mismatches, required alignment/evidence, and migration docs. Once aligned, resume with installed public declarations as final authority.
