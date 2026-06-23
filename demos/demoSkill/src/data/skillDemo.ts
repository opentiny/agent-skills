export interface SkillFeature {
  title: string
  desc: string
  icon: string
  tone: string
}

export interface WorkflowStep {
  title: string
  desc: string
  badge: string
}

export interface ApiLink {
  name: string
  type: string
  value: string
  reason: string
}

export interface TableRow {
  id: number
  requirement: string
  component: string
  generated: string
  confidence: string
  status: string
}

export const skillFeatures: SkillFeature[] = [
  {
    title: '组件 API 语义索引',
    desc: '把 props、events、slots、方法与真实用法沉淀为 AI 可检索的结构化上下文。',
    icon: '🧭',
    tone: 'from-violet-500 to-fuchsia-500'
  },
  {
    title: 'TinyVue 用法深度链接',
    desc: '需求、组件、示例代码和约束规则直接关联，避免 AI 只凭通用知识生成代码。',
    icon: '🔗',
    tone: 'from-sky-500 to-cyan-500'
  },
  {
    title: '跨 IDE Skill 分发',
    desc: '同一份 Skill 能服务 Trae、Cursor、Copilot 等编程助手，保持团队代码风格一致。',
    icon: '🚀',
    tone: 'from-emerald-500 to-teal-500'
  },
  {
    title: '说出需求即出代码',
    desc: '自然语言描述页面目标，AI 自动选择 TinyVue 组件并补全可运行业务代码。',
    icon: '✨',
    tone: 'from-amber-500 to-orange-500'
  }
]

export const workflowSteps: WorkflowStep[] = [
  {
    title: '1. 在 Trae 输入需求',
    desc: '例如：“帮我生成一个 TinyVue Grid，支持状态标签、排序搜索、操作按钮。”。',
    badge: 'Prompt'
  },
  {
    title: '2. Skill 匹配组件知识',
    desc: 'tiny-vue-skill 读取 Grid 的 API、事件、插槽示例和常见业务模式。',
    badge: 'Skill'
  },
  {
    title: '3. AI 生成可运行代码',
    desc: '输出符合 TinyVue 组件规范、团队约束和当前项目结构的 Vue 代码。',
    badge: 'Code'
  },
  {
    title: '4. 开发者即时微调',
    desc: '继续追问“增加批量删除”或“改成树形表格”，AI 基于上下文增量修改。',
    badge: 'Iterate'
  }
]

export const apiLinks: ApiLink[] = [
  {
    name: 'Grid props',
    type: 'API',
    value: 'data、columns、loading、pagination',
    reason: '决定表格基础结构、加载状态和分页能力。'
  },
  {
    name: 'Grid events',
    type: 'Event',
    value: 'sort-change、selection-change、page-change',
    reason: '让 AI 自动补齐交互回调和状态更新逻辑。'
  },
  {
    name: 'Scoped slots',
    type: 'Slot',
    value: 'status、actions、empty',
    reason: '把状态标签、操作按钮、空态渲染成更贴近业务的界面。'
  },
  {
    name: 'Usage examples',
    type: 'Example',
    value: '搜索表格、审批列表、数据看板',
    reason: '让生成代码更像真实业务，而不是孤立组件片段。'
  }
]

export const tableRows: TableRow[] = [
  {
    id: 1,
    requirement: '生成用户列表表格',
    component: 'TinyVue Grid',
    generated: '列配置、分页、搜索栏',
    confidence: '98%',
    status: '已生成'
  },
  {
    id: 2,
    requirement: '为状态列增加标签',
    component: 'TinyVue Tag',
    generated: '成功、处理中、失败三态',
    confidence: '96%',
    status: '已生成'
  },
  {
    id: 3,
    requirement: '添加行内操作按钮',
    component: 'TinyVue Button',
    generated: '查看、编辑、删除',
    confidence: '94%',
    status: '待确认'
  },
  {
    id: 4,
    requirement: '支持分页和排序',
    component: 'TinyVue Pager',
    generated: 'pageChange、sortChange',
    confidence: '93%',
    status: '已生成'
  },
  {
    id: 5,
    requirement: '输出完整 SFC 代码',
    component: 'Vue SFC',
    generated: 'template、script setup、style',
    confidence: '97%',
    status: '已生成'
  }
]

export const promptSamples = [
  '帮我生成一个 TinyVue Grid，支持状态标签、排序、搜索、支持删除，数据随机。',
  '把表格改成支持多选，并增加 批量同步 的按钮。',
  '为 TinyVue Grid 增加空态、加载态和错误提示，代码要符合 Vue3 script setup。'
]

export const sampleCodeMap: Record<string, string> = {
  '帮我生成一个 TinyVue Grid，支持状态标签、搜索、分页和操作按钮，默认10条数据/页，并插入20条数据。': `<template>
  <div>
    <tiny-input v-model="keyword" placeholder="搜索员工" clearable />
    <tiny-grid :data="filteredRows" border stripe :pager="pagerConfig">
      <tiny-grid-column type="index" title="序号" width="60" />
      <tiny-grid-column field="name" title="员工姓名" />
      <tiny-grid-column field="skill" title="接入 Skill" />
      <tiny-grid-column field="progress" title="进度">
        <template #default="{ row }">
          <tiny-tag :type="row.progress === '已完成' ? 'success' : 'warning'">
            {{ row.progress }}
          </tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="status" title="状态">
        <template #default="{ row }">
          <tiny-tag :type="row.status === '已接入' ? 'success' : 'danger'">
            {{ row.status }}
          </tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="操作">
        <template #default="{ row }">
          <tiny-button type="primary" size="small">查看</tiny-button>
          <tiny-button type="danger" size="small">移除</tiny-button>
        </template>
      </tiny-grid-column>
    </tiny-grid>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const employeeData = ref([
  // 20条员工 Skill 接入数据...
])

const filteredRows = computed(() => {
  const v = keyword.value.trim().toLowerCase()
  if (!v) return employeeData.value
  return employeeData.value.filter(r =>
    r.name.includes(v) || r.skill.includes(v)
  )
})

const pagerConfig = computed(() => ({
  currentPage: currentPage.value,
  pageSize: pageSize.value,
  total: filteredRows.value.length,
  pageSizes: [10, 20, 50]
}))
</script>`,
  '把表格改成支持多选，并增加批量同步 Skill 的按钮。': `<template>
  <div>
    <tiny-grid :data="tableData" border stripe :select-config="{ trigger: 'row' }">
      <tiny-grid-column type="selection" width="60" />
      <tiny-grid-column field="name" title="员工姓名" />
      <tiny-grid-column field="skill" title="接入 Skill" />
      <tiny-grid-column field="status" title="状态">
        <template #default="{ row }">
          <tiny-tag :type="row.status === '已接入' ? 'success' : 'warning'">
            {{ row.status }}
          </tiny-tag>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <div class="mt-4 flex gap-3">
      <tiny-button type="primary" @click="batchSync">
        批量同步 Skill
      </tiny-button>
      <tiny-button type="danger" @click="batchRemove">
        批量移除
      </tiny-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from '@opentiny/vue'

const tableData = ref([
  // 员工数据...
])

function batchSync() {
  Modal.message({ message: '批量同步已选中 Skill', status: 'success' })
}

function batchRemove() {
  Modal.message({ message: '批量移除已选中 Skill', status: 'warning' })
}
</script>`,
  '为 TinyVue Grid 增加空态、加载态和错误提示，代码要符合 Vue3 script setup。': `<template>
  <div>
    <tiny-grid
      :data="tableData"
      :loading="loading"
      border
      stripe
      :render-empty="renderEmpty"
    >
      <tiny-grid-column field="name" title="员工姓名" />
      <tiny-grid-column field="skill" title="接入 Skill" />
      <tiny-grid-column field="status" title="状态">
        <template #default="{ row }">
          <tiny-tag :type="row.status === '已接入' ? 'success' : 'danger'">
            {{ row.status }}
          </tiny-tag>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-button v-if="hasError" type="danger" @click="retry">
      数据加载失败，点击重试
    </tiny-button>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'

const tableData = ref([])
const loading = ref(true)
const hasError = ref(false)

function renderEmpty() {
  return h('div', { style: 'padding: 40px; text-align: center; color: #999' }, '暂无 Skill 接入数据')
}

async function fetchData() {
  loading.value = true
  hasError.value = false
  try {
    // 模拟异步请求
    await new Promise(r => setTimeout(r, 1000))
    tableData.value = [
      { name: '张明', skill: 'tiny-vue-skill', status: '已接入' }
    ]
  } catch {
    hasError.value = true
  } finally {
    loading.value = false
  }
}

function retry() { fetchData() }

fetchData()
</script>`
}
