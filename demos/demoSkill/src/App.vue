<template>
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.38),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.28),transparent_28%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]"></div>
      <div class="relative mx-auto flex min-h-screen w-11/12 flex-col justify-between py-8 lg:w-10/12">
        <nav class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-2xl shadow-violet-950/30 backdrop-blur">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 text-xl shadow-lg shadow-violet-500/30">S</div>
            <div>
              <p class="text-sm text-slate-400">AI Native Component Skill</p>
              <h1 class="text-lg font-semibold tracking-wide">tiny-vue-skill 演示中心</h1>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 text-sm text-slate-300">
            <span v-for="tool in tools" :key="tool" class="rounded-full border border-white/10 bg-white/10 px-3 py-1">{{ tool }}</span>
          </div>
        </nav>

        <div class="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-100">
              <span class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]"></span>
              Skill 核心：让 AI 深度理解组件 API 与真实用法
            </div>
            <h2 class="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              说出需求，AI 即生成
              <span class="bg-gradient-to-r from-violet-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">TinyVue 业务代码</span>
            </h2>
            <p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              tiny-vue-skill 将 TinyVue 的组件 API、典型用法、代码约束和业务场景转化为 AI 可调用的 Skill，上接 Trae、Cursor、Copilot 等编码助手，下接真实 Vue + Vite 项目，实现从自然语言到可运行代码的闭环。
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <button class="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/15" @click="copyPrompt">
                复制演示需求
              </button>
            </div>
            <div class="mt-8 grid gap-4 sm:grid-cols-3">
              <div v-for="metric in metrics" :key="metric.label" class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p class="text-3xl font-black text-white">{{ metric.value }}</p>
                <p class="mt-1 text-sm text-slate-400">{{ metric.label }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-sky-950/40 backdrop-blur">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Trae Prompt</p>
                <h3 class="text-xl font-bold">需求输入 → Skill 检索 → 代码生成</h3>
              </div>
              <span class="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Live Demo</span>
            </div>
            <div class="rounded-3xl bg-slate-950 p-4">
              <div class="mb-3 flex gap-2">
                <span class="h-3 w-3 rounded-full bg-rose-400"></span>
                <span class="h-3 w-3 rounded-full bg-amber-400"></span>
                <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
              </div>
              <div class="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm leading-7 text-slate-200">
                <p class="text-slate-500">开发者在 Trae 中输入：</p>
                <p class="mt-2 text-sky-200">{{ activePrompt }}</p>
              </div>
              <div class="mt-4 grid gap-3">
                <div v-for="(step, index) in workflowSteps" :key="step.title" class="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition" :class="index <= activeStep ? 'border-violet-400/50 shadow-lg shadow-violet-950/30' : ''">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold" :class="index <= activeStep ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-500'">{{ index + 1 }}</div>
                  <div>
                    <div class="flex flex-wrap items-center gap-2">
                      <h4 class="font-semibold">{{ step.title }}</h4>
                      <span class="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{{ step.badge }}</span>
                    </div>
                    <p class="mt-1 text-sm text-slate-400">{{ step.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-slate-50 py-16 text-slate-950">
      <div class="mx-auto w-11/12 lg:w-10/12">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="font-semibold text-violet-600">What is Skill</p>
            <h2 class="mt-2 text-3xl font-black md:text-4xl">Skill 是 AI 与组件体系之间的语义连接层</h2>
          </div>
          <p class="max-w-2xl text-slate-600">它不是一份静态文档，而是把 API、示例、约束、最佳实践和业务上下文组合成可被 AI 精准调用的能力包。</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <article v-for="feature in skillFeatures" :key="feature.title" class="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
            <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-lg" :class="feature.tone">{{ feature.icon }}</div>
            <h3 class="text-xl font-bold">{{ feature.title }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ feature.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 text-slate-950">
      <div class="mx-auto grid w-11/12 gap-8 lg:w-10/12 lg:grid-cols-[0.86fr_1.14fr]">
        <div class="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
          <div class="mb-5">
            <p class="text-sm text-slate-400">TinyVue Skill Demo</p>
            <h2 class="text-2xl font-black">示例需求</h2>
          </div>
          <div class="space-y-4">
            <button v-for="(sample, index) in promptSamples" :key="index" class="group w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-sm leading-6 transition hover:border-violet-300/50 hover:bg-violet-400/10 hover:shadow-lg" @click="activePrompt = sample; copySamplePrompt()">
              <span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500 text-xs font-bold">{{ index + 1 }}</span>
              <span class="text-slate-200">{{ sample }}</span>
            </button>
          </div>
          <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs text-slate-500">当前选中需求：</p>
            <p class="mt-2 text-sm text-sky-200">{{ activePrompt }}</p>
          </div>
        </div>

        <SkillGridDemo />
      </div>
    </section>

    <section class="bg-slate-950 py-16 text-slate-100">
      <div class="mx-auto grid w-11/12 gap-8 lg:w-10/12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="font-semibold text-sky-300">Generated Code</p>
          <h2 class="mt-2 text-3xl font-black md:text-4xl">Skill 输出的不只是片段，而是可继续迭代的代码起点</h2>
          <p class="mt-4 leading-8 text-slate-400">当 AI 获取到 TinyVue Grid 的列定义、插槽、事件和常见业务范式后，生成结果会更稳定、更贴近团队工程规范。</p>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div v-for="benefit in benefits" :key="benefit" class="rounded-3xl border border-white/10 bg-white/5 p-5">{{ benefit }}</div>
          </div>
        </div>
        <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
          <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span class="text-sm text-slate-400">SkillGridDemo.vue</span>
            <button class="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400" @click="copyCode">复制代码</button>
          </div>
          <pre class="max-h-[520px] overflow-auto p-5 text-sm leading-6 text-slate-200"><code>{{ skillGridCode }}</code></pre>
          <p v-if="copied" class="border-t border-white/10 px-5 py-3 text-sm text-emerald-300">已复制：可在 Trae 中继续要求增加批量操作、服务端分页或列拖拽。</p>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Modal } from '@opentiny/vue'
import { promptSamples, skillFeatures, workflowSteps } from './data/skillDemo'
import SkillGridDemo from './components/SkillGridDemo.vue'
import rawCode from './components/SkillGridDemo.vue?raw'

const skillGridCode = ref(rawCode)

// 监听 SkillGridDemo 模块更新，HMR 时重新读取源码
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    // 模块更新后重新 import ?raw 获取最新源码
    import('./components/SkillGridDemo.vue?raw').then((mod) => {
      skillGridCode.value = mod.default
    })
  })
}

const tools = ['Trae', 'Cursor', 'Copilot', 'TinyVue', 'Vue + Vite']
const metrics = [
  { value: '4x', label: '需求到代码链路提速' },
  { value: '12+', label: '组件 API 语义节点' },
  { value: '3 IDE', label: '跨助手统一分发' }
]
const benefits = ['降低组件 API 幻觉，提升生成代码准确率', '把团队最佳实践封装为可复用 Skill', '支持自然语言连续追问和增量修改', '让 TinyVue 组件库成为 AI 可理解的工程资产']

const activeStep = ref(4)
const copied = ref(false)
const activePrompt = ref(promptSamples[0])

async function copyCode() {
  await navigator.clipboard.writeText(skillGridCode)
  copied.value = true
  Modal.message({ message: '组件源码已复制', status: 'success' })
}

function playDemo() {
  activeStep.value = 0
  const timer = window.setInterval(() => {
    if (activeStep.value >= workflowSteps.length - 1) {
      window.clearInterval(timer)
      Modal.message({ message: 'Trae 已基于 tiny-vue-skill 生成 TinyVue Grid 代码', status: 'success' })
      return
    }
    activeStep.value += 1
  }, 650)
}

async function copyPrompt() {
  await navigator.clipboard.writeText(activePrompt.value)
  Modal.message({ message: '演示需求已复制，可粘贴到 Trae / Cursor / Copilot', status: 'success' })
}

async function copySamplePrompt() {
  await navigator.clipboard.writeText(activePrompt.value)
  Modal.message({ message: '已复制', status: 'success' })
}


</script>
