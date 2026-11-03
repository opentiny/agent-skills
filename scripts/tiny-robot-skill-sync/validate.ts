import { access, lstat, readFile, realpath } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { TinyRobotIndex, TinyRobotIndexEntry } from './index'

export interface ValidationIssue {
  code: string
  path?: string
  message: string
}

export interface ValidateOptions {
  skillRoot: string
  marketplacePath: string
  scope?: 'snapshot' | 'full'
}

interface SnapshotManifest {
  tinyRobotVersion: string
  source: { ref: string; commit: string }
  documents: number
  demos: number
}

const VALID_STATUSES = new Set(['stable', 'advanced', 'deprecated'])
const FORMAL_DOC_PREFIX = 'references/docs/'

async function exists(target: string) {
  try {
    await access(target)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
}

function resolveInside(root: string, relativePath: string) {
  const resolvedRoot = path.resolve(root)
  const target = path.resolve(resolvedRoot, relativePath)
  const relative = path.relative(resolvedRoot, target)
  if (path.isAbsolute(relative) || relative === '..' || relative.startsWith(`..${path.sep}`)) return undefined
  return target
}

async function fileSafety(root: string, target: string): Promise<'safe' | 'missing' | 'unsafe'> {
  if (!(await exists(target))) return 'missing'
  const [rootRealPath, targetRealPath, targetInfo] = await Promise.all([realpath(root), realpath(target), lstat(target)])
  const relative = path.relative(rootRealPath, targetRealPath)
  const inside = relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`))
  return inside && !targetInfo.isSymbolicLink() ? 'safe' : 'unsafe'
}

function issue(code: string, message: string, issuePath?: string): ValidationIssue {
  return issuePath ? { code, path: issuePath, message } : { code, message }
}

function extractSkillVersion(content: string) {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)
  return frontmatter?.[1].match(/^\s{2}version:\s*['"]?([^'"\s]+)['"]?\s*$/m)?.[1]
}

function duplicateNames(entry: TinyRobotIndexEntry) {
  const seen = new Set<string>()
  return entry.names.filter((name) => {
    const normalized = name.trim().toLocaleLowerCase()
    if (seen.has(normalized)) return true
    seen.add(normalized)
    return false
  })
}

async function validateEntry(skillRoot: string, entry: TinyRobotIndexEntry) {
  const issues: ValidationIssue[] = []
  const duplicates = duplicateNames(entry)
  if (duplicates.length) {
    issues.push(issue('duplicate-alias', `Entry ${entry.id} repeats aliases: ${duplicates.join(', ')}`))
  }
  if (!VALID_STATUSES.has(entry.status)) {
    issues.push(issue('invalid-status', `Entry ${entry.id} has unsupported status: ${entry.status}`))
  }
  if (entry.status === 'deprecated' && !entry.replacedBy?.length) {
    issues.push(issue('deprecated-without-replacement', `Deprecated entry ${entry.id} must declare replacedBy`))
  }
  if (entry.proactive && !entry.doc.startsWith(FORMAL_DOC_PREFIX)) {
    issues.push(issue('proactive-undocumented', `Proactive entry ${entry.id} must point to formal documentation`, entry.doc))
  }

  const docPath = resolveInside(skillRoot, entry.doc)
  const docSafety = docPath ? await fileSafety(skillRoot, docPath) : 'unsafe'
  if (docSafety === 'missing') {
    issues.push(issue('missing-doc', `Documentation for ${entry.id} does not exist`, entry.doc))
  } else if (docSafety === 'unsafe') {
    issues.push(issue('unsafe-doc', `Documentation for ${entry.id} must be a regular file inside the skill`, entry.doc))
  }
  for (const demo of entry.demos) {
    const demoPath = resolveInside(skillRoot, demo)
    const demoSafety = demoPath ? await fileSafety(skillRoot, demoPath) : 'unsafe'
    if (demoSafety === 'missing') {
      issues.push(issue('missing-demo', `Demo for ${entry.id} does not exist`, demo))
    } else if (demoSafety === 'unsafe') {
      issues.push(issue('unsafe-demo', `Demo for ${entry.id} must be a regular file inside the skill`, demo))
    }
  }
  return issues
}

async function validateVersions(skillRoot: string, marketplacePath: string) {
  const skillVersion = extractSkillVersion(await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8'))
  const plugin = JSON.parse(await readFile(path.join(skillRoot, '.claude-plugin/plugin.json'), 'utf8')) as {
    version?: string
  }
  const marketplace = JSON.parse(await readFile(marketplacePath, 'utf8')) as {
    plugins?: Array<{ name?: string; source?: string; version?: string }>
  }
  const listing = marketplace.plugins?.find(
    (entry) => entry.name === 'tiny-robot-skill' || entry.source === './skills/tiny-robot-skill',
  )
  const versions = { skill: skillVersion, plugin: plugin.version, marketplace: listing?.version }
  const unique = new Set(Object.values(versions).filter(Boolean))
  if (unique.size === 1 && Object.values(versions).every(Boolean)) return []
  return [
    issue(
      'version-mismatch',
      `TinyRobot skill versions must match: skill=${skillVersion ?? 'missing'}, plugin=${plugin.version ?? 'missing'}, marketplace=${listing?.version ?? 'missing'}`,
    ),
  ]
}

async function validateOpenAiMetadata(skillRoot: string) {
  const metadataPath = path.join(skillRoot, 'agents/openai.yaml')
  if (!(await exists(metadataPath))) {
    return [issue('invalid-openai-metadata', 'agents/openai.yaml is missing', 'agents/openai.yaml')]
  }
  const content = await readFile(metadataPath, 'utf8')
  const displayName = content.match(/^\s{2}display_name:\s*"([^"]+)"\s*$/m)?.[1]
  const shortDescription = content.match(/^\s{2}short_description:\s*"([^"]+)"\s*$/m)?.[1]
  const defaultPrompt = content.match(/^\s{2}default_prompt:\s*"([^"]+)"\s*$/m)?.[1]
  const valid =
    displayName === 'TinyRobot Application Development' &&
    !!shortDescription &&
    shortDescription.length >= 25 &&
    shortDescription.length <= 64 &&
    !!defaultPrompt?.includes('$tiny-robot-skill') &&
    defaultPrompt.includes('TinyRobot 1.0')
  return valid
    ? []
    : [
        issue(
          'invalid-openai-metadata',
          'OpenAI metadata must name TinyRobot application development and provide a 25-64 character description plus a $tiny-robot-skill TinyRobot 1.0 prompt',
          'agents/openai.yaml',
        ),
      ]
}

async function validateSyncWorkflow(marketplacePath: string) {
  const repositoryRoot = path.dirname(path.dirname(path.resolve(marketplacePath)))
  const workflowPath = path.join(repositoryRoot, '.github/workflows/sync-tinyrobot-docs.yml')
  if (!(await exists(workflowPath))) {
    return [issue('invalid-sync-workflow', 'TinyRobot sync workflow is missing', '.github/workflows/sync-tinyrobot-docs.yml')]
  }
  const content = await readFile(workflowPath, 'utf8')
  const syncOffset = content.indexOf('tiny-robot-skill-sync')
  const validateOffset = content.indexOf('validate:tiny-robot-skill')
  const valid =
    /source_ref:[\s\S]*?default:\s*['"]?release\/v1\.0\.x['"]?/.test(content) &&
    /ref:\s*\$\{\{\s*(?:inputs|github\.event\.inputs)\.source_ref\s*\}\}/.test(content) &&
    /pnpm (?:install|i) --frozen-lockfile/.test(content) &&
    syncOffset >= 0 &&
    /--source-ref\s+["']?\$\{\{[^\n]*source_ref[^\n]*\}\}["']?/.test(content) &&
    /--source-commit\s+["']?\$\{\{[^\n]+\}\}["']?/.test(content) &&
    validateOffset > syncOffset &&
    !content.includes('rm -rf current-repo/skills/tiny-robot-skill')
  return valid
    ? []
    : [
        issue(
          'invalid-sync-workflow',
          'Sync workflow must check out source_ref, install from the lockfile, pass ref and commit to the generator, then validate without destructive folder copies',
          '.github/workflows/sync-tinyrobot-docs.yml',
        ),
      ]
}

export async function validateTinyRobotSkill(options: ValidateOptions): Promise<ValidationIssue[]> {
  const skillRoot = path.resolve(options.skillRoot)
  const index = JSON.parse(await readFile(path.join(skillRoot, 'component-index.json'), 'utf8')) as TinyRobotIndex
  const snapshot = JSON.parse(
    await readFile(path.join(skillRoot, 'references/docs/.snapshot.json'), 'utf8'),
  ) as SnapshotManifest
  const issues: ValidationIssue[] = []

  for (const entry of index.entries) issues.push(...(await validateEntry(skillRoot, entry)))

  if (snapshot.source.ref !== index.source.ref) {
    issues.push(
      issue('source-ref-mismatch', `Snapshot ref ${snapshot.source.ref} does not match index ref ${index.source.ref}`),
    )
  }
  if (snapshot.source.commit !== index.source.commit) {
    issues.push(
      issue(
        'source-commit-mismatch',
        `Snapshot commit ${snapshot.source.commit} does not match index commit ${index.source.commit}`,
      ),
    )
  }
  if (snapshot.tinyRobotVersion !== index.tinyRobotVersion) {
    issues.push(
      issue(
        'snapshot-version-mismatch',
        `Snapshot version ${snapshot.tinyRobotVersion} does not match index version ${index.tinyRobotVersion}`,
      ),
    )
  }
  if (snapshot.documents !== index.entries.length) {
    issues.push(
      issue(
        'document-count-mismatch',
        `Snapshot records ${snapshot.documents} documents but index contains ${index.entries.length}`,
      ),
    )
  }
  const indexedDemos = new Set(index.entries.flatMap((entry) => entry.demos)).size
  if (snapshot.demos !== indexedDemos) {
    issues.push(
      issue('demo-count-mismatch', `Snapshot records ${snapshot.demos} demos but index references ${indexedDemos}`),
    )
  }

  if ((options.scope ?? 'full') === 'full') {
    issues.push(...(await validateVersions(skillRoot, path.resolve(options.marketplacePath))))
    issues.push(...(await validateOpenAiMetadata(skillRoot)))
    issues.push(...(await validateSyncWorkflow(options.marketplacePath)))
  }
  return issues
}

function argument(name: string) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function runCli() {
  const skillRoot = argument('--skill-root')
  const marketplacePath = argument('--marketplace-path')
  const scope = (argument('--scope') ?? 'full') as ValidateOptions['scope']
  if (!skillRoot || !marketplacePath || (scope !== 'snapshot' && scope !== 'full')) {
    throw new Error(
      'Usage: tiny-robot-skill-validate --skill-root <path> --marketplace-path <path> [--scope snapshot|full]',
    )
  }
  const issues = await validateTinyRobotSkill({ skillRoot, marketplacePath, scope })
  if (issues.length) {
    for (const validationIssue of issues) {
      process.stderr.write(
        `${validationIssue.code}${validationIssue.path ? ` (${validationIssue.path})` : ''}: ${validationIssue.message}\n`,
      )
    }
    process.exitCode = 1
    return
  }
  process.stdout.write(`TinyRobot skill validation passed (${scope}).\n`)
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
