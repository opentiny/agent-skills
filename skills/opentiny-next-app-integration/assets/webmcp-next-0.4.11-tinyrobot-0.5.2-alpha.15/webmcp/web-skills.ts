import { getMainSkillPaths, getSkillMdContent, getSkillOverviews } from '@opentiny/next-sdk'
import { ref } from 'vue'

const skillModules = import.meta.glob('../../skills/**/SKILL.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export const webSkillInstructions = ref('')

void (async () => {
  const paths = await getMainSkillPaths(skillModules)
  const overviews = await getSkillOverviews(skillModules)
  const contents = await Promise.all(paths.map(async (path) => getSkillMdContent(skillModules, path)))
  const loadedSkills = contents.filter((content): content is string => Boolean(content)).join('\n\n')

  webSkillInstructions.value = loadedSkills
    ? `## Loaded business skills\n\n${overviews.map((skill) => `- ${skill.name}: ${skill.description}`).join('\n')}\n\n${loadedSkills}`
    : ''
})()
