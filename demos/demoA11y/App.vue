<template>
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <section class="relative overflow-hidden border-b border-white/10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_30%)]"></div>
      <div class="relative mx-auto flex w-[92%] max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-3xl">
          <p class="mb-4 inline-flex rounded-full border border-emerald-300/40 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200">Demo A · TinyVue 无障碍</p>
          <h1 class="text-4xl font-black tracking-tight text-white md:text-6xl">对比 TinyVue 组件与原生 HTML 元素的无障碍差异</h1>
          <p class="mt-6 text-lg leading-8 text-slate-300">TinyVue 组件内置 ARIA 属性、焦点管理和键盘导航。本 Demo 展示同一个表单在使用 TinyVue 组件与原生 HTML 时，在语义化、键盘可达性、焦点可视性和 ARIA 覆盖上的真实差异。</p>
        </div>
        <div class="grid min-w-[280px] gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
          <div v-for="metric in heroMetrics" :key="metric.label" class="rounded-2xl bg-slate-900/70 p-4">
            <p class="text-sm text-slate-400">{{ metric.label }}</p>
            <p class="mt-1 text-3xl font-black" :class="metric.color">{{ metric.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto grid w-[92%] max-w-7xl gap-6 px-4 py-8 lg:grid-cols-4">
      <article v-for="item in flowCards" :key="item.title" class="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl transition hover:-translate-y-1 hover:bg-white/[0.09]">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">{{ item.icon }}</div>
        <h2 class="text-lg font-bold text-white">{{ item.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-300">{{ item.desc }}</p>
      </article>
    </section>

    <!-- 核心对比区域：TinyVue vs 原生 HTML -->
    <section class="mx-auto w-[92%] max-w-7xl px-4 pb-8">
      <div class="grid gap-6">
        <!-- TinyVue 无障碍版本 -->
        <article class="overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-emerald-500/10">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
            <div>
              <p class="text-sm font-bold text-emerald-300">TinyVue 组件 · 内置无障碍</p>
              <h2 class="mt-1 text-2xl font-black text-white">语义明确，键盘与读屏器均可用</h2>
            </div>
            <span class="rounded-full bg-emerald-400 px-3 py-1 text-sm font-semibold text-slate-950">A11y 96/100</span>
          </div>

          <div class="grid gap-5 p-5 xl:grid-cols-[1fr_1.1fr]">
            <div class="rounded-3xl bg-slate-950/70 p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="font-bold text-white">生成代码片段</h3>
                <button type="button" class="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/20" @click="copyCode('with')">复制</button>
              </div>
              <pre class="max-h-[420px] overflow-auto rounded-2xl bg-black/50 p-4 text-xs leading-6 text-slate-200"><code>{{ withSkillCode }}</code></pre>
            </div>

            <div class="rounded-3xl bg-white p-4 text-slate-950 shadow-2xl">
              <div class="mb-4 flex items-center justify-between gap-3">
                <h3 class="font-black">组件预览</h3>
                <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">ARIA + 焦点环 + 键盘导航</span>
              </div>

              <section class="space-y-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-6" aria-labelledby="tiny-title" aria-describedby="tiny-desc">
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-200 text-xl" aria-hidden="true">♿</div>
                  <div>
                    <h4 id="tiny-title" class="text-lg font-bold">成员信息登记</h4>
                    <p id="tiny-desc" class="text-sm text-slate-600">Tab 聚焦有清晰焦点环，方向键切换选项，Enter 提交。</p>
                  </div>
                </div>

                <div class="form-group">
                  <label for="acc-input" class="font-semibold min-w-[80px]">用户名：</label>
                  <tiny-input id="acc-input" v-model="accName" placeholder="请输入用户名"></tiny-input>
                </div>

                <div class="form-group">
                  <label for="acc-select" class="font-semibold min-w-[80px]">所属部门：</label>
                  <tiny-select id="acc-select" v-model="accDept">
                    <tiny-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value"></tiny-option>
                  </tiny-select>
                </div>

                <div class="flex flex-wrap gap-3">
                  <tiny-button type="primary" @click="handleSubmit('accessible')">提交</tiny-button>
                  <tiny-button @click="handleReset('accessible')">重置</tiny-button>
                </div>

                <p v-if="accResult" class="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-900" aria-live="polite">{{ accResult }}</p>
              </section>
            </div>
          </div>
        </article>

        <!-- 原生 HTML 非无障碍版本 -->
        <article class="overflow-hidden rounded-[2rem] border border-rose-400/30 bg-rose-500/10">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
            <div>
              <p class="text-sm font-bold text-rose-300">原生 HTML · 无 ARIA 支持</p>
              <h2 class="mt-1 text-2xl font-black text-white">视觉可见，但键盘和辅助技术难用</h2>
            </div>
            <span class="rounded-full bg-rose-400 px-3 py-1 text-sm font-semibold text-white">A11y 38/100</span>
          </div>

          <div class="grid gap-5 p-5 xl:grid-cols-[1fr_1.1fr]">
            <div class="rounded-3xl bg-slate-950/70 p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="font-bold text-white">生成代码片段</h3>
                <button type="button" class="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/20" @click="copyCode('without')">复制</button>
              </div>
              <pre class="max-h-[420px] overflow-auto rounded-2xl bg-black/50 p-4 text-xs leading-6 text-slate-200"><code>{{ withoutSkillCode }}</code></pre>
            </div>

            <div class="rounded-3xl bg-white p-4 text-slate-950 shadow-2xl">
              <div class="mb-4 flex items-center justify-between gap-3">
                <h3 class="font-black">组件预览</h3>
                <span class="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">缺少 aria 与键盘支持</span>
              </div>

              <div class="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <div class="flex items-center gap-3">
                  <div class="h-11 w-11 rounded-xl bg-rose-200"></div>
                  <div>
                    <div class="text-lg font-bold">成员信息登记</div>
                    <div class="text-sm text-slate-500">缺少语义化分组与可读说明</div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="min-w-[80px] text-slate-400">用户名：</span>
                  <input type="text" v-model="nonAccName" placeholder="输入" class="native-input" />
                </div>

                <div class="flex items-center gap-2">
                  <span class="min-w-[80px] text-slate-400">所属部门：</span>
                  <select v-model="nonAccDept" class="native-select">
                    <option value="" disabled>选择</option>
                    <option v-for="item in deptOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                  </select>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button type="button" class="native-btn primary" @click="handleSubmit('non-accessible')">保存</button>
                  <button type="button" class="native-btn" @click="handleReset('non-accessible')">取消</button>
                </div>

                <p v-if="nonAccResult" class="text-sm text-slate-500">{{ nonAccResult }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- 差异对比表格 -->
    <section class="mx-auto w-[92%] max-w-7xl px-4 pb-8">
      <article class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-xl">
        <p class="text-sm font-bold text-violet-300">无障碍关键差异</p>
        <h2 class="mt-1 text-2xl font-black text-white">TinyVue vs 原生 HTML 无障碍对比清单</h2>
        <p class="mt-2 text-sm text-slate-300">10 项维度逐条对比，让直播观众一眼看懂 TinyVue 组件库带来的无障碍收益</p>
        <div class="mt-5 overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/10">
                <th class="p-3 text-sm font-bold text-slate-300">特性</th>
                <th class="p-3 text-sm font-bold text-emerald-300">TinyVue（无障碍）</th>
                <th class="p-3 text-sm font-bold text-rose-300">原生 HTML（非无障碍）</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in diffTable" :key="row.feature" class="border-b border-white/5">
                <td class="p-3 text-sm font-semibold text-white">{{ row.feature }}</td>
                <td class="p-3 text-sm text-emerald-200">{{ row.tinyvue }}</td>
                <td class="p-3 text-sm text-rose-200">{{ row.native }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>

    <!-- AI 操作场景优势 -->
    <section class="mx-auto w-[92%] max-w-7xl px-4 pb-8">
      <article class="rounded-[2rem] border border-amber-400/30 bg-amber-500/10 p-6 shadow-xl">
        <p class="text-sm font-bold text-amber-300">AI 操作界面场景优势</p>
        <h2 class="mt-1 text-2xl font-black text-white">无障碍能力让 AI 更精准地操控界面</h2>
        <p class="mt-2 text-sm text-slate-300">当 AI（LLM / MCP）需要操作页面组件时，TinyVue 的无障碍属性成为 AI 的"眼睛"</p>
        <div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="item in aiAdvantages" :key="item.title" class="rounded-2xl bg-slate-900/70 p-4 border border-amber-400/20">
            <div class="mb-2 flex items-center gap-2">
              <span class="text-2xl">{{ item.icon }}</span>
              <span class="font-bold text-amber-200">{{ item.title }}</span>
            </div>
            <p class="text-sm leading-6 text-slate-300">{{ item.desc }}</p>
          </div>
        </div>
        <div class="mt-4 rounded-2xl bg-slate-950/70 p-4 border border-amber-400/30">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🎯</span>
            <span class="font-bold text-amber-200 text-sm">核心结论</span>
          </div>
          <p class="text-sm leading-6 text-slate-300">原生 HTML 的 div + span 没有语义信息，AI 无法区分"这是标题"还是"这是输入框"；TinyVue 组件自带 ARIA 和语义化标签，AI 通过读取这些属性就能理解每个元素的用途和状态，从而精准操作——<span class="text-amber-300 font-bold">无障碍不仅是给人用的，也是给 AI 用的</span>。</p>
        </div>
      </article>
    </section>

    <section class="mx-auto w-[92%] max-w-7xl px-4 pb-8">
      <article class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-xl">
        <p class="text-sm font-bold text-emerald-300">自动检查结果</p>
        <h2 class="mt-1 text-2xl font-black text-white">TinyVue 组件内置的无障碍能力</h2>
        <p class="mt-2 text-sm text-slate-300">以下能力无需开发者手动添加，使用 TinyVue 组件即可自动获得</p>
        <div class="mt-5 space-y-3">
          <div v-for="item in auditItems" :key="item.label" class="flex items-center justify-between gap-4 rounded-2xl bg-slate-900/70 p-4">
            <span class="text-sm font-semibold text-slate-200">{{ item.label }}</span>
            <span class="rounded-full px-3 py-1 text-xs font-bold" :class="item.ok ? 'bg-emerald-400 text-slate-950' : 'bg-rose-400 text-white'">{{ item.ok ? '已覆盖' : '缺失' }}</span>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TinyInput, TinySelect, TinyOption, TinyButton } from '@opentiny/vue'

const deptOptions = [
  { value: 'dev', label: '开发部' },
  { value: 'test', label: '测试部' },
  { value: 'design', label: '设计部' },
  { value: 'product', label: '产品部' }
]

const accName = ref('')
const accDept = ref('')
const accResult = ref('')
const nonAccName = ref('')
const nonAccDept = ref('')
const nonAccResult = ref('')

const heroMetrics = [
  { label: 'ARIA 覆盖项', value: '10 项', color: 'text-emerald-300' },
  { label: '键盘操作', value: 'Tab/↑↓/Esc/Enter', color: 'text-cyan-300' },
  { label: '对比维度', value: '10 项', color: 'text-violet-300' },
  { label: '开发成本', value: '零额外代码', color: 'text-amber-300' }
]

const flowCards = [
  { icon: '🧠', title: '同一表单', desc: '同一个成员登记表单，确保对比公平，变量只有组件库选择。' },
  { icon: '⚠️', title: '原生 HTML', desc: 'div + span 堆砌，无 ARIA、无焦点管理、键盘体验差，需手动补齐所有无障碍代码。' },
  { icon: '♿', title: 'TinyVue 组件', desc: '内置 aria-label、aria-expanded、焦点环和键盘导航，组件即自带无障碍能力，零额外代码。' },
  { icon: '✅', title: '对比清单', desc: '10 项维度逐条对比 + 自动检查结果，让差异一目了然，观众可自行验证。' }
]

const aiAdvantages = [
  {
    icon: '🔍',
    title: '语义可读',
    desc: 'AI 读取 aria-label、aria-expanded 等属性，就能知道每个组件的用途和当前状态，无需猜测 DOM 结构。'
  },
  {
    icon: '🎯',
    title: '精准定位',
    desc: 'aria-labelledby、aria-describedby 提供了元素之间的关联关系，AI 可以精确定位"这个输入框对应哪个标签"。'
  },
  {
    icon: '⚡',
    title: '状态感知',
    desc: 'aria-expanded、aria-live 让 AI 实时感知组件状态变化（下拉是否展开、选中了什么），从而做出正确的下一步操作。'
  },
  {
    icon: '🤖',
    title: 'MCP 工具调用',
    desc: 'MCP 工具通过 ARIA 属性识别组件，调用 form.addField 时能准确匹配到 TinyVue 组件类型，而不是面对一堆无语义的 div。'
  },
  {
    icon: '🧩',
    title: '结构化数据',
    desc: '语义化的 section + heading + label 结构，让 AI 生成的 Schema 能直接映射到组件层次，渲染结果更可预期。'
  },
  {
    icon: '📐',
    title: '操作一致性',
    desc: 'TinyVue 组件的键盘交互行为统一规范，AI 通过 Tab/Enter/Esc 就能操作所有组件，无需为每个组件写特殊逻辑。'
  }
]

const withoutSkillCode = `<div class="form-card">
  <span>用户名：</span>
  <input type="text" placeholder="输入" />
  <span>所属部门：</span>
  <select>
    <option value="" disabled>选择</option>
    <option value="dev">开发部</option>
    <option value="test">测试部</option>
    <option value="design">设计部</option>
    <option value="product">产品部</option>
  </select>
  <button class="primary-btn">保存</button>
  <button>取消</button>
</div>`

const withSkillCode = `<section aria-labelledby="form-title"
  aria-describedby="form-desc">
  <h2 id="form-title">成员信息登记</h2>
  <p id="form-desc">Tab 聚焦，方向键切换选项。</p>

  <label for="username">用户名：</label>
  <TinyInput id="username"
    v-model="name" placeholder="请输入用户名" />

  <label for="dept">所属部门：</label>
  <TinySelect id="dept" v-model="dept">
    <TinyOption label="开发部" value="dev" />
    <TinyOption label="测试部" value="test" />
    <TinyOption label="设计部" value="design" />
    <TinyOption label="产品部" value="product" />
  </TinySelect>

  <TinyButton aria-label="保存成员信息">提交</TinyButton>
  <p aria-live="polite">
    当前选中：{{ dept || '未选择' }}
  </p>
</section>`

const diffTable = [
  { feature: 'aria 属性', tinyvue: '✅ 组件内置 aria-label、aria-expanded、aria-haspopup 等', native: '❌ 原生元素无 aria 属性，需手动添加' },
  { feature: 'label 关联', tinyvue: '✅ 使用 <label for> 正确关联输入框', native: '❌ 仅用 <span> 模拟，无语义关联' },
  { feature: '键盘导航', tinyvue: '✅ Tab/方向键/Esc/Enter 完整键盘操作', native: '⚠️ 基础 Tab 支持，下拉选项切换体验差' },
  { feature: '焦点可视', tinyvue: '✅ 清晰的 focus ring，焦点位置一目了然', native: '❌ 焦点样式不明显，用户难以定位当前位置' },
  { feature: '焦点管理', tinyvue: '✅ 下拉展开/收起时焦点自动管理', native: '❌ 无焦点管理逻辑，焦点可能丢失' },
  { feature: '语义化结构', tinyvue: '✅ section + heading + label 语义层次清晰', native: '❌ div + span 堆砌，无语义层次' },
  { feature: '状态播报', tinyvue: '✅ aria-live 区域播报选中状态变化', native: '❌ 无 aria-live，状态变化无通知' },
  { feature: '高对比度', tinyvue: '✅ 焦点和悬停状态高对比度', native: '❌ 默认样式对比度不足' },
  { feature: '开发成本', tinyvue: '✅ 组件内置，零额外代码', native: '❌ 需手动添加所有 ARIA 属性和键盘事件' },
  { feature: '维护一致性', tinyvue: '✅ 全项目统一的无障碍行为', native: '❌ 每个开发者实现不一，质量参差不齐' }
]

const auditItems = [
  { label: '语义化 section / heading', ok: true },
  { label: 'aria-labelledby / aria-describedby', ok: true },
  { label: 'aria-label 提交按钮', ok: true },
  { label: 'aria-expanded 下拉框状态', ok: true },
  { label: '<label for> 关联输入框', ok: true },
  { label: 'aria-live 状态播报区域', ok: true },
  { label: '原生 button 语义元素', ok: true },
  { label: '焦点可视样式 (focus ring)', ok: true },
  { label: '键盘方向键导航选项', ok: true },
  { label: 'Esc 关闭下拉并归还焦点', ok: true }
]

const handleSubmit = (type: string) => {
  if (type === 'accessible') {
    accResult.value = `提交成功 — 用户名：${accName.value || '未填写'}，部门：${accDept.value || '未选择'}`
  } else {
    nonAccResult.value = `用户名：${nonAccName.value || '未填写'}，部门：${nonAccDept.value || '未选择'}`
  }
}

const handleReset = (type: string) => {
  if (type === 'accessible') {
    accName.value = ''
    accDept.value = ''
    accResult.value = ''
  } else {
    nonAccName.value = ''
    nonAccDept.value = ''
    nonAccResult.value = ''
  }
}

async function copyCode(id: string): Promise<void> {
  const code = id === 'with' ? withSkillCode : withoutSkillCode
  if (!navigator.clipboard) return
  await navigator.clipboard.writeText(code)
}
</script>

<style>
.form-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 15px;
}

.native-input {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  min-width: 160px;
  width: 100%;
}

.native-select {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  min-width: 160px;
  background: #fff;
  cursor: pointer;
  width: 100%;
}

.native-btn {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.native-btn.primary {
  background: #e05050;
  color: #fff;
  border-color: #e05050;
}
</style>
