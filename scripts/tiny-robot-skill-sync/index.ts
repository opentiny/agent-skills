import { cp, lstat, mkdir, readFile, readdir, realpath, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type TinyRobotSupportStatus = 'stable' | 'advanced' | 'deprecated'

export interface TinyRobotIndexEntry {
  id: string
  names: string[]
  package: string
  kind: 'guide' | 'suite' | 'component' | 'tool' | 'best-practice' | 'migration' | 'example'
  status: TinyRobotSupportStatus
  proactive: boolean
  scenes: string[]
  doc: string
  demos: string[]
  exports?: string[]
  replacedBy?: string[]
}

export interface TinyRobotIndex {
  schemaVersion: 1
  tinyRobotVersion: '1.0.x'
  source: {
    ref: string
    commit: string
  }
  entries: TinyRobotIndexEntry[]
}

export interface BuildIndexOptions {
  sourceRef: string
  sourceCommit: string
  documents: DocumentRecord[]
  overrides?: CatalogOverrides
  publicExports?: Set<string>
}

export interface SyncOptions {
  sourceRoot: string
  skillRoot: string
  sourceRef: string
  sourceCommit: string
}

export interface SyncReport {
  documentsCopied: number
  demosCopied: number
  entriesGenerated: number
}

interface DocumentRecord {
  group: DocGroup
  relativePath: string
  sourcePath: string
  outputPath: string
  content: string
  demoSourcePaths: string[]
  demoOutputPaths: string[]
}

interface EntryOverride {
  aliases?: string[]
  scenes?: string[]
  status?: TinyRobotSupportStatus
  replacedBy?: string[]
  exports?: string[]
  package?: string
}

interface CatalogOverrides {
  excludedDocs?: string[]
  navigation?: string[]
  entries?: Record<string, EntryOverride>
}

const DOC_GROUPS = ['guide', 'suites', 'components', 'tools', 'best-practices', 'migration', 'examples'] as const
type DocGroup = (typeof DOC_GROUPS)[number]

const LEGACY_GENERATED_PATHS = [
  'components',
  'demos',
  'guide',
  'migration',
  'tools',
  'examples/assistant.md',
  'references/docs',
  'examples/demos',
  'component-index.json',
]

const GROUP_KIND: Record<DocGroup, TinyRobotIndexEntry['kind']> = {
  guide: 'guide',
  suites: 'suite',
  components: 'component',
  tools: 'tool',
  'best-practices': 'best-practice',
  migration: 'migration',
  examples: 'example',
}

const GROUP_PACKAGE: Record<DocGroup, string> = {
  guide: 'TinyRobot ecosystem',
  suites: '@opentiny/tiny-robot-chat',
  components: '@opentiny/tiny-robot',
  tools: '@opentiny/tiny-robot-kit',
  'best-practices': 'TinyRobot ecosystem',
  migration: 'TinyRobot ecosystem',
  examples: 'TinyRobot ecosystem',
}

const GROUP_PREFIX: Partial<Record<DocGroup, string>> = {
  suites: 'chat',
  tools: 'kit',
  guide: 'guide',
  'best-practices': 'best-practice',
  migration: 'migration',
  examples: 'example',
}

function isPathInside(root: string, target: string) {
  const relative = path.relative(root, target)
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`))
}

function safeResolve(root: string, relativePath: string, label: string) {
  if (path.isAbsolute(relativePath)) throw new Error(`${label} must be relative: ${relativePath}`)
  const target = path.resolve(root, relativePath)
  if (!isPathInside(path.resolve(root), target)) throw new Error(`${label} escapes root: ${relativePath}`)
  return target
}

async function exists(target: string) {
  try {
    await stat(target)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
}

async function listMarkdownFiles(root: string): Promise<string[]> {
  if (!(await exists(root))) return []
  const result: string[] = []
  const entries = await readdir(root, { withFileTypes: true })
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const target = path.join(root, entry.name)
    if (entry.isDirectory()) result.push(...(await listMarkdownFiles(target)))
    else if (entry.isFile() && entry.name.endsWith('.md')) result.push(target)
  }
  return result
}

function extractDemoReferences(content: string) {
  const references: string[] = []
  for (const tagMatch of content.matchAll(/<demo\b[\s\S]*?\/?\s*>/g)) {
    const tag = tagMatch[0]
    const primary = tag.match(/(?:^|\s)vue\s*=\s*(['"])(.*?)\1/)
    if (primary) references.push(primary[2])
    const files = tag.match(/(?:^|\s):vueFiles\s*=\s*(['"])([\s\S]*?)\1/)
    if (files) {
      for (const fileMatch of files[2].matchAll(/(['"])(.*?)\1/g)) references.push(fileMatch[2])
    }
  }
  return [...new Set(references)].sort()
}

function extractLocalDependencies(content: string) {
  const dependencies: string[] = []
  const patterns = [
    /(?:^|\n)\s*import\s*(['"])([^'"]+)\1/g,
    /(?:^|\n)\s*import(?:(?!\n\s*import\b)[\s\S])*?\sfrom\s*(['"])([^'"]+)\1/g,
    /(?:^|\n)\s*export(?:(?!\n\s*(?:import|export)\b)[\s\S])*?\sfrom\s*(['"])([^'"]+)\1/g,
    /\bimport\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
    /\bnew\s+URL\s*\(\s*(['"])([^'"]+)\1\s*,\s*import\.meta\.url\s*\)/g,
    /@import\s+(?:url\(\s*)?(['"])([^'"]+)\1\s*\)?/g,
    /\burl\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,
    /\b(?:src|href)\s*=\s*(['"])([^'"]+)\1/g,
  ]
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const specifier = match[2]
      if (specifier?.startsWith('.')) dependencies.push(specifier)
    }
  }
  return [...new Set(dependencies)].sort()
}

const DEPENDENCY_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.css', '.scss', '.json', '.svg']

async function resolveLocalDependency(sourcePath: string, specifier: string) {
  const cleanSpecifier = specifier.replace(/[?#].*$/, '')
  const base = path.resolve(path.dirname(sourcePath), cleanSpecifier)
  const candidates = DEPENDENCY_EXTENSIONS.includes(path.extname(base))
    ? [base]
    : [base, ...DEPENDENCY_EXTENSIONS.map((extension) => `${base}${extension}`), ...DEPENDENCY_EXTENSIONS.map((extension) => path.join(base, `index${extension}`))]
  for (const candidate of candidates) {
    if ((await exists(candidate)) && (await stat(candidate)).isFile()) return candidate
  }
  throw new Error(`local demo dependency does not exist: ${specifier} (from ${sourcePath})`)
}

async function assertSafeDemoFile(demosRootRealPath: string, sourcePath: string, label: string) {
  if (!(await exists(sourcePath))) throw new Error(`${label} does not exist: ${sourcePath}`)
  if ((await lstat(sourcePath)).isSymbolicLink()) throw new Error(`${label} must not be a symlink: ${sourcePath}`)
  const sourceRealPath = await realpath(sourcePath)
  if (!isPathInside(demosRootRealPath, sourceRealPath)) {
    throw new Error(`${label} real target escapes demos root: ${sourcePath}`)
  }
}

async function collectDemoDependencyClosure(entryPath: string, demosRootRealPath: string) {
  const collected = new Set<string>()
  const queue = [entryPath]
  while (queue.length) {
    const sourcePath = queue.shift()!
    if (collected.has(sourcePath)) continue
    await assertSafeDemoFile(demosRootRealPath, sourcePath, 'demo file')
    collected.add(sourcePath)
    const content = await readFile(sourcePath, 'utf8')
    for (const specifier of extractLocalDependencies(content)) {
      const dependencyPath = await resolveLocalDependency(sourcePath, specifier)
      if (!collected.has(dependencyPath)) queue.push(dependencyPath)
    }
  }
  return [...collected].sort()
}

function extractTitle(content: string, fallback: string) {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1].trim() || fallback
}

function extractScenes(content: string, title: string) {
  const headings = [...content.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => match[1].replace(/\s+\{#.*$/, '').trim())
  return [...new Set([title, ...headings])].slice(0, 24)
}

function hasDeprecatedBadge(content: string) {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)
  return frontmatter ? /^badge:\s*deprecated\s*$/m.test(frontmatter[1]) : false
}

function toPascalCase(id: string) {
  return id
    .split(/[-/]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function documentId(group: DocGroup, relativePath: string) {
  const withoutExtension = relativePath.replace(/\.md$/, '').split(path.sep).join('-')
  if (group === 'components') return withoutExtension
  return `${GROUP_PREFIX[group]}-${withoutExtension}`
}

function defaultNames(group: DocGroup, id: string, title: string) {
  const names = [title, id]
  if (group === 'components') names.push(toPascalCase(id), `Tr${toPascalCase(id)}`)
  return [...new Set(names)]
}

function uniqueNames(names: string[]) {
  const seen = new Set<string>()
  return names.filter((name) => {
    const normalized = name.trim().toLocaleLowerCase()
    if (!normalized || seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

async function loadOverrides(): Promise<CatalogOverrides> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  return JSON.parse(await readFile(path.join(currentDir, 'catalog-overrides.json'), 'utf8')) as CatalogOverrides
}

function collectNamedExports(content: string) {
  const names = new Set<string>()
  const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  for (const match of withoutComments.matchAll(/export\s+(?:type\s+)?\{([\s\S]*?)\}(?:\s+from\s+['"][^'"]+['"])?/g)) {
    for (const rawPart of match[1].split(',')) {
      const part = rawPart.trim()
      if (!part) continue
      const alias = part.match(/^(?:default|[A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/)
      if (alias) names.add(alias[1])
      else if (/^[A-Za-z_$][\w$]*$/.test(part)) names.add(part)
    }
  }
  for (const match of withoutComments.matchAll(/export\s+(?:declare\s+)?(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g)) {
    names.add(match[1])
  }
  return names
}

async function loadPackageRootExports(sourceRoot: string) {
  const exports = new Set<string>()
  for (const relativePath of [
    'packages/components/src/index.ts',
    'packages/chat/src/index.ts',
    'packages/kit/src/index.ts',
  ]) {
    const target = path.join(sourceRoot, relativePath)
    if (!(await exists(target))) continue
    for (const name of collectNamedExports(await readFile(target, 'utf8'))) exports.add(name)
  }
  return exports
}

export async function buildTinyRobotIndex(options: BuildIndexOptions): Promise<TinyRobotIndex> {
  const overrides = options.overrides ?? (await loadOverrides())
  const navigation = new Set(overrides.navigation ?? [])
  const entries = options.documents.map((document) => {
    const id = documentId(document.group, document.relativePath)
    const override = overrides.entries?.[id] ?? {}
    const title = extractTitle(document.content, id)
    const status = override.status ?? (hasDeprecatedBadge(document.content) ? 'deprecated' : 'stable')
    const inferredExports = document.group === 'components' ? [`Tr${toPascalCase(id)}`] : undefined

    const entry: TinyRobotIndexEntry = {
      id,
      names: uniqueNames([...defaultNames(document.group, id, title), ...(override.aliases ?? [])]),
      package: override.package ?? GROUP_PACKAGE[document.group],
      kind: GROUP_KIND[document.group],
      status,
      proactive: navigation.size === 0 || navigation.has(`${document.group}/${document.relativePath.split(path.sep).join('/')}`),
      scenes: override.scenes ?? extractScenes(document.content, title),
      doc: path.posix.join('references/docs', document.group, document.relativePath.split(path.sep).join('/')),
      demos: document.demoOutputPaths.map((demoPath) => demoPath.split(path.sep).join('/')),
    }
    const exports = override.exports ?? inferredExports
    if (exports?.length) entry.exports = exports
    if (override.replacedBy?.length) entry.replacedBy = override.replacedBy
    return entry
  })

  entries.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id))
  if (options.publicExports) {
    for (const entry of entries) {
      for (const exportName of entry.exports ?? []) {
        if (!options.publicExports.has(exportName)) {
          throw new Error(`documented export not found in package roots: ${exportName} (${entry.id})`)
        }
      }
    }
  }
  return {
    schemaVersion: 1,
    tinyRobotVersion: '1.0.x',
    source: { ref: options.sourceRef, commit: options.sourceCommit },
    entries,
  }
}

export async function syncTinyRobotSkill(options: SyncOptions): Promise<SyncReport> {
  const sourceRoot = path.resolve(options.sourceRoot)
  const skillRoot = path.resolve(options.skillRoot)
  const docsRoot = path.join(sourceRoot, 'docs')
  const docsSourceRoot = path.join(docsRoot, 'src')
  const demosRoot = path.join(docsRoot, 'demos')
  if (!(await exists(docsSourceRoot))) throw new Error(`TinyRobot docs source not found: ${docsSourceRoot}`)
  const docsRootRealPath = await realpath(docsRoot)
  if ((await lstat(demosRoot)).isSymbolicLink()) throw new Error(`demos root must not be a symlink: ${demosRoot}`)
  const demosRootRealPath = await realpath(demosRoot)
  if (!isPathInside(docsRootRealPath, demosRootRealPath)) throw new Error(`demos root escapes docs root: ${demosRoot}`)
  const overrides = await loadOverrides()
  const excludedDocs = new Set(overrides.excludedDocs ?? [])
  const publicExports = await loadPackageRootExports(sourceRoot)

  for (const relativePath of LEGACY_GENERATED_PATHS) {
    await rm(safeResolve(skillRoot, relativePath, 'generated path'), { recursive: true, force: true })
  }

  const documents: DocumentRecord[] = []
  const demoCopies = new Map<string, string>()
  for (const group of DOC_GROUPS) {
    const groupRoot = path.join(docsSourceRoot, group)
    for (const sourcePath of await listMarkdownFiles(groupRoot)) {
      const relativePath = path.relative(groupRoot, sourcePath)
      const documentKey = `${group}/${relativePath.split(path.sep).join('/')}`
      if (excludedDocs.has(documentKey)) continue
      const content = await readFile(sourcePath, 'utf8')
      const outputPath = safeResolve(path.join(skillRoot, 'references/docs', group), relativePath, 'document output')
      const demoSourcePaths: string[] = []
      const demoOutputPaths: string[] = []

      for (const reference of extractDemoReferences(content)) {
        if (path.isAbsolute(reference)) throw new Error(`demo reference escapes docs root: ${reference}`)
        const demoSourcePath = path.resolve(path.dirname(sourcePath), reference)
        if (!isPathInside(docsRoot, demoSourcePath)) throw new Error(`demo reference escapes docs root: ${reference}`)
        const docsRelative = path.relative(docsRoot, demoSourcePath)
        if (!docsRelative.startsWith(`demos${path.sep}`)) {
          throw new Error(`demo reference must target docs/demos: ${reference}`)
        }
        for (const dependencyPath of await collectDemoDependencyClosure(demoSourcePath, demosRootRealPath)) {
          const demoRelative = path.relative(demosRoot, dependencyPath)
          const demoOutputPath = safeResolve(path.join(skillRoot, 'examples/demos'), demoRelative, 'demo output')
          if (!demoSourcePaths.includes(dependencyPath)) demoSourcePaths.push(dependencyPath)
          const relativeOutputPath = path.relative(skillRoot, demoOutputPath)
          if (!demoOutputPaths.includes(relativeOutputPath)) demoOutputPaths.push(relativeOutputPath)
          demoCopies.set(dependencyPath, demoOutputPath)
        }
      }

      documents.push({ group, relativePath, sourcePath, outputPath, content, demoSourcePaths, demoOutputPaths })
    }
  }

  for (const document of documents) {
    await mkdir(path.dirname(document.outputPath), { recursive: true })
    await writeFile(document.outputPath, document.content)
  }
  for (const [sourcePath, outputPath] of demoCopies) {
    await mkdir(path.dirname(outputPath), { recursive: true })
    await cp(sourcePath, outputPath)
  }

  const index = await buildTinyRobotIndex({
    sourceRef: options.sourceRef,
    sourceCommit: options.sourceCommit,
    documents,
    overrides,
    publicExports,
  })
  await writeFile(path.join(skillRoot, 'component-index.json'), `${JSON.stringify(index, null, 2)}\n`)
  await writeFile(
    path.join(skillRoot, 'references/docs/.snapshot.json'),
    `${JSON.stringify(
      {
        tinyRobotVersion: index.tinyRobotVersion,
        source: index.source,
        documents: documents.length,
        demos: demoCopies.size,
      },
      null,
      2,
    )}\n`,
  )

  return {
    documentsCopied: documents.length,
    demosCopied: demoCopies.size,
    entriesGenerated: index.entries.length,
  }
}

function readArgument(name: string) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function runCli() {
  const sourceRoot = readArgument('--source-root')
  const skillRoot = readArgument('--skill-root')
  const sourceRef = readArgument('--source-ref')
  const sourceCommit = readArgument('--source-commit')
  if (!sourceRoot || !skillRoot || !sourceRef || !sourceCommit) {
    throw new Error(
      'Usage: tiny-robot-skill-sync --source-root <path> --skill-root <path> --source-ref <ref> --source-commit <sha>',
    )
  }
  const report = await syncTinyRobotSkill({ sourceRoot, skillRoot, sourceRef, sourceCommit })
  process.stdout.write(`${JSON.stringify(report)}\n`)
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
