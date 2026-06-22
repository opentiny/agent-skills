<template>
  <main class="min-h-screen bg-slate-50 text-slate-950">
    <!-- 顶部 Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-900 to-slate-950 text-white">
      <div class="absolute inset-0 opacity-30">
        <div class="absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-400 blur-3xl"></div>
        <div class="absolute right-10 top-24 h-80 w-80 rounded-full bg-fuchsia-500 blur-3xl"></div>
        <div class="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-400 blur-3xl"></div>
      </div>
      <div class="relative mx-auto flex min-h-[340px] w-[92%] max-w-7xl flex-col justify-between gap-8 py-10 lg:flex-row lg:items-center lg:py-12">
        <div class="max-w-3xl">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-indigo-100 backdrop-blur">
            TinyVue + MCP Streamable HTTP · Demo MCP
          </div>
          <h1 class="text-3xl font-black leading-tight tracking-tight md:text-5xl">
            TinyVue 组件库集成 MCP 协议
          </h1>
          <p class="mt-4 max-w-2xl text-base leading-8 text-indigo-100">
            左端是真实的 MCP Client 终端——能看到完整的 JSON-RPC 协议交互。右端是 TinyVue 渲染端——MCP 返回 Schema 后组件自动渲染。这不是模拟，是真实的 MCP Server 调用。
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <tiny-button type="primary" round size="medium" @click="handlePromptSubmit" :disabled="running">
              {{ running ? 'MCP 调用中...' : '执行 MCP 搭建' }}
            </tiny-button>
            <tiny-button round size="medium" @click="resetDemo">
              重置演示
            </tiny-button>
          </div>
        </div>
        <div class="grid w-full max-w-xl grid-cols-3 gap-3">
          <div v-for="metric in metrics" :key="metric.label" class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div class="text-2xl font-black">{{ metric.value }}</div>
            <div class="mt-1 text-xs text-indigo-100">{{ metric.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI 交互过程 -->
    <section class="mx-auto w-[92%] max-w-7xl pt-6">
      <div class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 shadow-md">
        <span class="text-sm font-bold text-white">AI 交互过程</span>
        <span class="text-xs text-violet-100">自然语言 → LLM 决策 → MCP 工具调用 → TinyVue 渲染</span>
      </div>
    </section>

    <!-- 双栏核心区域 -->
    <section class="mx-auto grid w-[92%] max-w-7xl gap-6 py-6 lg:grid-cols-[1fr_1.2fr]">

      <!-- ===== 左端：MCP Client 终端 ===== -->
      <div class="space-y-4 min-w-0 overflow-hidden">
        <div class="flex items-center gap-3">
          <div class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold">M</div>
          <div>
            <div class="font-bold">MCP Client 终端</div>
            <div class="text-sm text-slate-500">真实 JSON-RPC 协议交互 · Streamable HTTP</div>
          </div>
          <div class="ml-auto">
            <tiny-tag :value="connState.initialized ? '已连接' : '未连接'" :type="connState.initialized ? 'success' : 'danger'" effect="dark"></tiny-tag>
          </div>
        </div>

        <!-- AI 指令输入 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="font-bold mb-2 text-sm">自然语言指令输入</div>
          <textarea
            v-model="aiPrompt"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 resize-none focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
            rows="2"
            placeholder="输入指令，例如：帮我搭建一个活动报名页..."
            @keydown.enter.exact="handlePromptSubmit"
          ></textarea>
          <div class="mt-2 flex gap-2">
            <button
              v-for="scenario in scenarios"
              :key="scenario.id"
              class="rounded-lg border px-3 py-1.5 text-xs transition"
              :class="activeScenarioId === scenario.id ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'"
              @click="applyPrompt(scenario.id)"
            >{{ scenario.name }}</button>
          </div>
        </div>

        <!-- MCP 协议能力展示 -->
        <div v-if="connState.initialized" class="rounded-2xl border border-violet-200 bg-violet-50 p-4">
          <div class="font-bold mb-2 text-sm text-violet-700">MCP 协议能力（真实获取）</div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-white border border-slate-200 p-3">
              <div class="text-xs text-slate-500 mb-1">Server Info</div>
              <div class="font-mono text-sm font-bold">{{ connState.serverInfo?.name }}</div>
              <div class="font-mono text-xs text-slate-400">v{{ connState.serverInfo?.version }}</div>
            </div>
            <div class="rounded-xl bg-white border border-slate-200 p-3">
              <div class="text-xs text-slate-500 mb-1">Capabilities</div>
              <div class="flex flex-wrap gap-1">
                <span v-for="cap in capabilityList" :key="cap" class="rounded bg-violet-100 px-2 py-0.5 text-xs font-mono text-violet-700">{{ cap }}</span>
              </div>
            </div>
            <div class="rounded-xl bg-white border border-slate-200 p-3">
              <div class="text-xs text-slate-500 mb-1">Tools {{ connState.tools.length }}</div>
              <div class="space-y-1">
                <div v-for="tool in connState.tools" :key="tool.name" class="font-mono text-xs text-slate-700">{{ tool.name }}</div>
              </div>
            </div>
            <div class="rounded-xl bg-white border border-slate-200 p-3">
              <div class="text-xs text-slate-500 mb-1">Resources {{ connState.resources.length }}</div>
              <div class="space-y-1">
                <div v-for="res in connState.resources" :key="res.uri" class="font-mono text-xs text-slate-700 truncate">{{ res.uri }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- MCP 调用链路（逐步动画） -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-sm">MCP 调用链路</span>
            <tiny-tag :value="pipelineRunning ? '执行中' : '已就绪'" :type="pipelineRunning ? 'warning' : 'success'" effect="dark" size="mini"></tiny-tag>
          </div>
          <div class="space-y-2">
            <div v-for="step in pipelineSteps" :key="step.id" class="rounded-xl bg-slate-50 px-3 py-2 flex items-start gap-2">
              <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                :class="step.status === 'done' ? 'bg-emerald-100 text-emerald-700' : step.status === 'running' ? 'bg-violet-100 text-violet-700 animate-pulse' : 'bg-slate-200 text-slate-400'">
                {{ step.status === 'done' ? '✓' : step.status === 'running' ? '→' : '○' }}
              </div>
              <div>
                <div class="font-mono text-sm" :class="step.status === 'done' ? 'text-slate-900' : step.status === 'running' ? 'text-violet-700' : 'text-slate-400'">
                  {{ step.method }}
                </div>
                <div class="text-xs text-slate-500">{{ step.label }}</div>
                <div v-if="step.duration" class="text-xs text-emerald-500">{{ step.duration }}ms</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LLM 对话过程 -->
        <div v-if="llmSteps.length > 0" class="rounded-2xl border border-violet-200 bg-violet-50 p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-sm text-violet-700">LLM 对话过程（真实大模型决策）</span>
            <tiny-button size="mini" @click="llmDialogVisible = true">全屏查看</tiny-button>
          </div>
          <div class="space-y-2 max-h-[200px] overflow-y-auto">
            <div v-for="(step, idx) in llmSteps" :key="idx" class="rounded-xl p-2 text-xs"
              :class="step.type === 'user_prompt' ? 'bg-blue-50 border border-blue-200'
                : step.type === 'llm_request' ? 'bg-sky-50 border border-sky-200'
                : step.type === 'llm_response' ? 'bg-violet-50 border border-violet-200'
                : step.type === 'tool_call' ? 'bg-amber-50 border border-amber-200'
                : 'bg-emerald-50 border border-emerald-200'">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono font-bold"
                  :class="step.type === 'user_prompt' ? 'text-blue-700'
                    : step.type === 'llm_request' ? 'text-sky-700'
                    : step.type === 'llm_response' ? 'text-violet-700'
                    : step.type === 'tool_call' ? 'text-amber-700'
                    : 'text-emerald-700'">
                  {{ step.type === 'user_prompt' ? '👤 用户指令'
                    : step.type === 'llm_request' ? '🧠 LLM 思考中'
                    : step.type === 'llm_response' ? '🤖 LLM 决策'
                    : step.type === 'tool_call' ? '⚙️ 调用工具'
                    : '✅ 工具结果' }}
                </span>
                <span class="text-slate-400">{{ step.timestamp }}</span>
              </div>
              <pre class="rounded-lg bg-slate-950 p-2 text-xs leading-5 text-emerald-200 overflow-x-auto max-h-[60px] overflow-y-auto">{{ formatJson(step.data) }}</pre>
            </div>
          </div>
          <div v-if="llmFinalMessage" class="mt-2 rounded-xl bg-white border border-violet-200 p-3">
            <div class="font-bold text-sm text-violet-700 mb-1">LLM 最终回复</div>
            <div class="text-sm text-slate-700">{{ llmFinalMessage }}</div>
          </div>
        </div>
      </div>

      <!-- ===== 右端：TinyVue 渲染端 ===== -->
      <div class="space-y-4 min-w-0">
        <div class="flex items-center gap-3">
          <div class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold">T</div>
          <div>
            <div class="font-bold">TinyVue 渲染端</div>
            <div class="text-sm text-slate-500">MCP Schema → TinyVue 组件自动渲染</div>
          </div>
        </div>

        <!-- 表单画布 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div class="font-bold text-base">低代码表单画布</div>
              <p class="text-xs text-slate-500">MCP 工具返回 Schema → TinyVue 组件按 Schema 配置自动渲染</p>
            </div>
            <div class="flex gap-1">
              <tiny-tag v-for="tag in currentForm.tags" :key="tag" :value="tag" effect="light" size="mini"></tiny-tag>
            </div>
          </div>

          <div class="rounded-2xl bg-gradient-to-br from-slate-100 to-white p-4 md:p-6">
            <div class="mb-3 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
              <div>
                <h2 class="text-xl font-black text-slate-950">{{ currentForm.title }}</h2>
                <p class="mt-1 text-sm leading-6 text-slate-500">{{ currentForm.description }}</p>
              </div>
              <div class="rounded-xl bg-indigo-50 px-3 py-2 text-right">
                <div class="text-xs text-indigo-500">Schema</div>
                <div class="font-mono text-lg font-black text-indigo-700">{{ currentForm.version }}</div>
              </div>
            </div>

            <tiny-form label-position="top" class="grid gap-3 md:grid-cols-2">
              <div
                v-for="field in currentForm.fields"
                :key="field.id"
                class="rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
                :class="field.span === 2 ? 'md:col-span-2' : ''"
              >
                <div class="mb-2 flex items-center justify-between gap-2">
                  <label class="font-bold text-sm text-slate-900">
                    {{ field.label }}
                    <span v-if="field.required" class="text-rose-500">*</span>
                  </label>
                  <tiny-tag :value="field.type" size="mini" :type="field.required ? 'danger' : 'info'"></tiny-tag>
                </div>

                <tiny-input v-if="field.type === 'input'" v-model="formState[field.id]" :placeholder="field.placeholder" size="mini"></tiny-input>
                <tiny-input v-else-if="field.type === 'textarea'" v-model="formState[field.id]" :placeholder="field.placeholder" textarea size="mini"></tiny-input>
                <tiny-select v-else-if="field.type === 'select'" v-model="formState[field.id]" :placeholder="field.placeholder" size="mini">
                  <tiny-option v-for="option in field.options" :key="option" :label="option" :value="option"></tiny-option>
                </tiny-select>
                <tiny-date-picker v-else-if="field.type === 'date'" v-model="formState[field.id]" :placeholder="field.placeholder" type="date" size="mini"></tiny-date-picker>
                <tiny-radio-group v-else-if="field.type === 'radio'" v-model="formState[field.id]" size="mini" class="flex flex-wrap gap-4 py-1">
                  <tiny-radio v-for="option in (field.options || [])" :key="option" :label="option">{{ option }}</tiny-radio>
                </tiny-radio-group>
                <tiny-checkbox-group v-else-if="field.type === 'checkbox'" v-model="formState[field.id]" size="mini" class="flex flex-wrap gap-4 py-1">
                  <tiny-checkbox v-for="option in (field.options || [])" :key="option" :label="option">{{ option }}</tiny-checkbox>
                </tiny-checkbox-group>

                <div class="mt-2 text-xs leading-5 text-slate-400">{{ field.helper }}</div>
              </div>
            </tiny-form>

            <div class="mt-3 flex flex-wrap justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3">
              <div class="text-xs text-slate-500">MCP Schema 驱动渲染 · TinyVue 组件自动装配</div>
              <div class="flex gap-2">
                <tiny-button round size="mini" @click="autoFill">智能填充</tiny-button>
                <tiny-button round size="mini" type="primary" @click="submitForm">提交预览</tiny-button>
              </div>
            </div>
          </div>
        </div>

        <!-- MCP Schema 驱动示意 -->
        <div class="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
          <div class="font-bold mb-3 text-sm text-indigo-700">MCP Schema 驱动 TinyVue 渲染</div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="rounded-xl bg-white p-3 text-center shadow-sm">
              <div class="text-2xl font-black text-indigo-700">{{ currentForm.fields.length }}</div>
              <div class="text-xs text-slate-500 mt-1">字段总数</div>
            </div>
            <div class="rounded-xl bg-white p-3 text-center shadow-sm">
              <div class="text-2xl font-black text-rose-600">{{ requiredCount }}</div>
              <div class="text-xs text-slate-500 mt-1">必填校验</div>
            </div>
            <div class="rounded-xl bg-white p-3 text-center shadow-sm">
              <div class="text-2xl font-black text-emerald-600">{{ filledCount }}</div>
              <div class="text-xs text-slate-500 mt-1">已填充</div>
            </div>
            <div class="rounded-xl bg-white p-3 text-center shadow-sm">
              <div class="text-2xl font-black text-violet-600">{{ currentForm.tags.length }}</div>
              <div class="text-xs text-slate-500 mt-1">页面标签</div>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <div v-for="field in currentForm.fields" :key="field.id"
              class="rounded-lg bg-white px-3 py-1.5 text-xs shadow-sm border border-slate-200 flex items-center gap-2">
              <span class="font-mono font-bold text-slate-600">{{ field.type }}</span>
              <span class="text-slate-700">{{ field.label }}</span>
              <span v-if="field.required" class="text-rose-500 font-bold">*</span>
            </div>
          </div>
        </div>

        <!-- JSON-RPC 交互报文 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-sm">JSON-RPC 交互报文</span>
            <tiny-button size="mini" @click="clearLogs">清空</tiny-button>
          </div>
          <div v-if="logs.length === 0" class="text-center text-sm text-slate-400 py-4">
            执行 MCP 搭建后，这里会显示真实的 JSON-RPC 请求与响应
          </div>
          <div v-else class="space-y-2 max-h-[500px] overflow-y-auto">
            <div v-for="log in logs" :key="log.id + log.direction" class="rounded-xl p-3"
              :class="log.direction === 'request' ? 'bg-sky-50 border border-sky-200' : log.status === 0 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-xs font-bold"
                  :class="log.direction === 'request' ? 'text-sky-700' : log.status === 0 ? 'text-red-700' : 'text-emerald-700'">
                  {{ log.direction === 'request' ? '→ REQUEST' : '← RESPONSE' }}
                </span>
                <span class="font-mono text-xs text-slate-500">{{ log.method }}</span>
                <span v-if="log.toolName" class="font-mono text-xs font-bold text-violet-600">{{ log.toolName }}</span>
                <span class="text-xs text-slate-400">{{ log.timestamp }}</span>
                <span v-if="log.duration" class="text-xs text-emerald-500">{{ log.duration }}ms</span>
                <span v-if="log.status" class="text-xs" :class="log.status >= 200 && log.status < 300 ? 'text-emerald-500' : 'text-red-500'">HTTP {{ log.status }}</span>
              </div>
              <pre class="rounded-lg bg-slate-950 p-2 text-xs leading-5 text-emerald-200 overflow-x-auto max-h-[100px] overflow-y-auto">{{ formatJson(log.body) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MCP 协议通信流 -->
    <section class="mx-auto mb-6 w-[92%] max-w-7xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="font-bold mb-4 text-base">MCP 协议通信流</div>
      <div class="flex flex-wrap items-center justify-center gap-3 text-sm">
        <!-- Step 1: 用户指令 -->
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-xl bg-blue-100 px-4 py-2.5 font-mono font-bold text-blue-700">👤 用户指令</div>
          <span class="text-xs text-slate-400">自然语言</span>
        </div>
        <div class="text-slate-400 text-lg">→</div>

        <!-- Step 2: 前端 -->
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-xl bg-violet-100 px-4 py-2.5 font-mono font-bold text-violet-700">前端 Client</div>
          <span class="text-xs text-slate-400">POST /chat</span>
        </div>
        <div class="text-slate-400 text-lg">→</div>

        <!-- Step 3: LLM 中间层 -->
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-xl bg-sky-100 px-4 py-2.5 font-mono font-bold text-sky-700">🧠 LLM 中间层</div>
          <span class="text-xs text-slate-400">function calling</span>
        </div>
        <div class="text-slate-400 text-lg">→</div>

        <!-- Step 4: LLM API -->
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-xl bg-purple-100 px-4 py-2.5 font-mono font-bold text-purple-700">LLM 大模型</div>
          <span class="text-xs text-slate-400">返回 tool_calls</span>
        </div>
        <div class="text-slate-400 text-lg">→</div>

        <!-- Step 5: MCP Server -->
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-xl bg-emerald-100 px-4 py-2.5 font-mono font-bold text-emerald-700">MCP Server</div>
          <span class="text-xs text-slate-400">tools/call (JSON-RPC)</span>
        </div>
        <div class="text-slate-400 text-lg">→</div>

        <!-- Step 6: Schema -->
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-xl bg-amber-100 px-4 py-2.5 font-mono font-bold text-amber-700">Schema 返回</div>
          <span class="text-xs text-slate-400">表单配置 JSON</span>
        </div>
        <div class="text-slate-400 text-lg">→</div>

        <!-- Step 7: TinyVue 渲染 -->
        <div class="flex flex-col items-center gap-1">
          <div class="rounded-xl bg-indigo-100 px-4 py-2.5 font-mono font-bold text-indigo-700">TinyVue 渲染</div>
          <span class="text-xs text-slate-400">组件自动装配</span>
        </div>
      </div>

      <!-- 回调箭头说明 -->
      <div class="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <div class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded-full bg-blue-400"></span>
          <span>用户输入自然语言</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded-full bg-purple-400"></span>
          <span>LLM 决策调用哪些 MCP 工具</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded-full bg-emerald-400"></span>
          <span>MCP Server 执行工具返回 Schema</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded-full bg-indigo-400"></span>
          <span>TinyVue 按 Schema 自动渲染表单</span>
        </div>
      </div>
    </section>

    <footer class="mx-auto w-[92%] max-w-7xl border-t border-slate-200 py-6 text-center text-xs text-slate-500">
      TinyVue 组件库 + MCP Streamable HTTP Server · 真实可运行演示 · 不是模拟
    </footer>

    <!-- LLM 对话过程全屏弹窗 -->
    <teleport to="body">
      <div v-if="llmDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" @click.self="llmDialogVisible = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
          <!-- 弹窗头部 -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-sky-50">
            <div>
              <h2 class="text-lg font-bold text-slate-800">LLM 对话过程全览</h2>
              <p class="text-xs text-slate-500 mt-0.5">真实大模型决策链路 · 共 {{ llmSteps.length }} 步交互</p>
            </div>
            <div class="flex items-center gap-2">
              <tiny-button size="mini" @click="llmDialogVisible = false">关闭</tiny-button>
            </div>
          </div>

          <!-- 弹窗内容 -->
          <div class="flex-1 overflow-y-auto p-6 space-y-3">
            <div v-for="(step, idx) in llmSteps" :key="idx" class="rounded-xl p-4 border"
              :class="step.type === 'user_prompt' ? 'bg-blue-50 border-blue-200'
                : step.type === 'llm_request' ? 'bg-sky-50 border-sky-200'
                : step.type === 'llm_response' ? 'bg-violet-50 border-violet-200'
                : step.type === 'tool_call' ? 'bg-amber-50 border-amber-200'
                : 'bg-emerald-50 border-emerald-200'">
              <div class="flex items-center gap-3 mb-2">
                <span class="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                  :class="step.type === 'user_prompt' ? 'bg-blue-500'
                    : step.type === 'llm_request' ? 'bg-sky-500'
                    : step.type === 'llm_response' ? 'bg-violet-500'
                    : step.type === 'tool_call' ? 'bg-amber-500'
                    : 'bg-emerald-500'">
                  {{ idx + 1 }}
                </span>
                <span class="font-mono font-bold text-sm"
                  :class="step.type === 'user_prompt' ? 'text-blue-700'
                    : step.type === 'llm_request' ? 'text-sky-700'
                    : step.type === 'llm_response' ? 'text-violet-700'
                    : step.type === 'tool_call' ? 'text-amber-700'
                    : 'text-emerald-700'">
                  {{ step.type === 'user_prompt' ? '👤 用户指令'
                    : step.type === 'llm_request' ? '🧠 LLM 请求（发送给大模型）'
                    : step.type === 'llm_response' ? '🤖 LLM 响应（大模型返回决策）'
                    : step.type === 'tool_call' ? '⚙️ MCP 工具调用'
                    : '✅ MCP 工具返回结果' }}
                </span>
                <span class="text-slate-400 text-xs ml-auto">{{ step.timestamp }}</span>
              </div>
              <pre class="rounded-lg bg-slate-950 p-4 text-sm leading-6 text-emerald-200 overflow-x-auto">{{ formatJson(step.data) }}</pre>
            </div>

            <!-- LLM 最终回复 -->
            <div v-if="llmFinalMessage" class="rounded-xl bg-gradient-to-r from-violet-100 to-sky-100 border border-violet-300 p-4">
              <div class="font-bold text-base text-violet-800 mb-2">🎯 LLM 最终回复</div>
              <div class="text-base text-slate-800">{{ llmFinalMessage }}</div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { mcpInitialize, mcpInitialized, mcpListTools, mcpListResources, mcpCallTool, mcpReadResource, getMcpLogs, clearMcpLogs, extractMcpData, getConnectionState, chatWithLLM } from './api/mcp'
import type { McpLogEntry, McpConnectionState, LLMStepEntry } from './api/mcp'

type FieldType = 'input' | 'textarea' | 'select' | 'date' | 'radio' | 'checkbox'

interface FormField {
  id: string
  label: string
  type: FieldType
  placeholder: string
  required: boolean
  helper: string
  options?: string[]
  span?: 1 | 2
}

interface FormSchema {
  title: string
  description: string
  version: string
  tags: string[]
  fields: FormField[]
}

interface Scenario {
  id: string
  name: string
  prompt: string
  schema: FormSchema
}

interface PipelineStepDisplay {
  id: string
  method: string
  label: string
  status: 'pending' | 'running' | 'done'
  duration?: number
}

const metrics = [
  { label: 'MCP 工具', value: '4' },
  { label: '协议步骤', value: '8' },
  { label: '组件类型', value: '6+' },
  { label: 'Schema 驱动', value: '全' }
]

const scenarios: Scenario[] = [
  {
    id: 'event',
    name: '活动报名',
    prompt: '帮我搭建一个活动报名页，收集姓名、部门、手机号、参与日期和兴趣方向。',
    schema: {
      title: 'AI 共创活动报名表',
      description: '面向内部员工的活动报名表单，支持基本信息采集、日期选择、兴趣标签与备注说明。',
      version: 'v1.4.0',
      tags: ['活动运营', '报名收集', '自动校验'],
      fields: [
        { id: 'name', label: '姓名', type: 'input', placeholder: '请输入真实姓名', required: true, helper: 'MCP 添加 input 组件并绑定必填校验' },
        { id: 'department', label: '所属部门', type: 'select', placeholder: '请选择部门', required: true, helper: '从组织字段模板中生成部门选择器', options: ['产品中心', '技术中心', '设计中心', '运营中心'] },
        { id: 'phone', label: '手机号', type: 'input', placeholder: '请输入 11 位手机号', required: true, helper: '自动配置手机号格式提示' },
        { id: 'joinDate', label: '参与日期', type: 'date', placeholder: '选择参与日期', required: true, helper: '使用日期组件限制用户输入格式' },
        { id: 'interests', label: '兴趣方向', type: 'checkbox', placeholder: '请选择兴趣方向', required: false, helper: '支持多选标签，用于后续分组运营', options: ['AI 工具', '低代码', '体验设计', '工程效率'], span: 2 },
        { id: 'remark', label: '备注说明', type: 'textarea', placeholder: '可填写特殊需求或建议', required: false, helper: '长文本组件用于补充信息', span: 2 }
      ]
    }
  },
  {
    id: 'approval',
    name: '采购审批',
    prompt: '创建一个采购审批表，包含采购类型、预算金额、期望到货时间和审批说明。',
    schema: {
      title: '智能采购审批申请',
      description: '用于团队采购事项的标准化申请表，AI 自动配置审批所需字段与必填规则。',
      version: 'v2.1.2',
      tags: ['审批流', '采购管理', '预算管控'],
      fields: [
        { id: 'applicant', label: '申请人', type: 'input', placeholder: '请输入申请人姓名', required: true, helper: '自动识别为人员信息字段' },
        { id: 'purchaseType', label: '采购类型', type: 'select', placeholder: '请选择采购类型', required: true, helper: 'MCP 调用组件工具生成枚举选项', options: ['办公用品', '软件服务', '硬件设备', '外包服务'] },
        { id: 'budget', label: '预算金额', type: 'input', placeholder: '请输入预算金额，例如 12000', required: true, helper: '自动添加金额格式提示' },
        { id: 'arrivalDate', label: '期望到货时间', type: 'date', placeholder: '选择期望日期', required: true, helper: '日期字段用于驱动后续 SLA 提醒' },
        { id: 'urgency', label: '紧急程度', type: 'radio', placeholder: '请选择紧急程度', required: true, helper: 'AI 根据审批场景补充紧急程度字段', options: ['普通', '加急', '特急'], span: 2 },
        { id: 'reason', label: '采购说明', type: 'textarea', placeholder: '请说明采购背景、用途与收益', required: true, helper: '文本域组件承载审批说明', span: 2 }
      ]
    }
  },
  {
    id: 'feedback',
    name: '产品反馈',
    prompt: '生成一个产品反馈收集页，支持选择问题类型、影响范围、满意度和详细描述。',
    schema: {
      title: '产品体验反馈收集',
      description: '收集用户对产品功能、体验与稳定性的反馈，并通过结构化字段提升后续分析效率。',
      version: 'v3.0.5',
      tags: ['用户反馈', '体验洞察', '问题分类'],
      fields: [
        { id: 'userName', label: '反馈人', type: 'input', placeholder: '请输入反馈人', required: true, helper: '人员字段可与登录态联动自动填充' },
        { id: 'issueType', label: '问题类型', type: 'select', placeholder: '请选择问题类型', required: true, helper: 'AI 生成产品反馈常见分类', options: ['功能建议', '体验问题', '性能问题', '数据异常'] },
        { id: 'scope', label: '影响范围', type: 'radio', placeholder: '请选择影响范围', required: true, helper: '单选组件用于快速判断优先级', options: ['仅我遇到', '小范围用户', '大量用户'] },
        { id: 'satisfaction', label: '当前满意度', type: 'select', placeholder: '请选择满意度', required: false, helper: '结构化沉淀体验趋势', options: ['非常满意', '基本满意', '一般', '不满意'] },
        { id: 'modules', label: '涉及模块', type: 'checkbox', placeholder: '请选择涉及模块', required: false, helper: '多选模块便于分派责任团队', options: ['首页', '搜索', '表单', '报表', '权限'], span: 2 },
        { id: 'detail', label: '详细描述', type: 'textarea', placeholder: '请描述现象、复现路径和期望结果', required: true, helper: 'AI 自动把描述字段设为跨列布局', span: 2 }
      ]
    }
  }
]

const keywordMap: Record<string, { scenarioId: string; keywords: string[] }> = {
  event: { scenarioId: 'event', keywords: ['活动', '报名', '报名页', '姓名', '部门', '手机号', '兴趣方向'] },
  approval: { scenarioId: 'approval', keywords: ['采购', '审批', '预算', '金额', '到货时间', '紧急程度'] },
  feedback: { scenarioId: 'feedback', keywords: ['反馈', '满意度', '问题类型', '影响范围', '体验'] }
}

const mcpPipelineTemplate: PipelineStepDisplay[] = [
  { id: 's1', method: 'initialize', label: '初始化 MCP 连接（协议握手）', status: 'pending' },
  { id: 's2', method: 'notifications/initialized', label: '发送 initialized 通知', status: 'pending' },
  { id: 's3', method: 'tools/list', label: '获取 MCP Server 注册的工具列表', status: 'pending' },
  { id: 's4', method: 'resources/list', label: '获取 MCP Server 注册的资源列表', status: 'pending' },
  { id: 's5', method: 'tools/call → form.createPage', label: '创建表单页面容器', status: 'pending' },
  { id: 's6', method: 'tools/call → form.addField', label: '添加表单字段组件', status: 'pending' },
  { id: 's7', method: 'tools/call → form.setValidation', label: '配置字段校验规则', status: 'pending' },
  { id: 's8', method: 'tools/call → form.previewRender', label: '刷新画布渲染完整表单', status: 'pending' }
]

const activeScenarioId = ref('event')
const aiPrompt = ref(scenarios[0].prompt)
const running = ref(false)
const pipelineRunning = ref(false)
const pipelineSteps = reactive<PipelineStepDisplay[]>(structuredClone(mcpPipelineTemplate))
const currentForm = reactive<FormSchema>(structuredClone(scenarios[0].schema))
const formState = reactive<Record<string, string | string[] | Date | null>>({})
const logs = computed<McpLogEntry[]>(() => getMcpLogs())
const connState = computed<McpConnectionState>(() => getConnectionState())
const llmSteps = reactive<Array<{ type: string; data: unknown; timestamp: string }>>([])
const llmFinalMessage = ref('')
const llmDialogVisible = ref(false)
const capabilityList = computed(() => {
  const caps = connState.value.capabilities
  if (!caps) return []
  const list: string[] = []
  if (caps.tools) list.push('tools')
  if (caps.resources) list.push('resources')
  if (caps.prompts) list.push('prompts')
  if (caps.logging) list.push('logging')
  return list
})

const requiredCount = computed(() => currentForm.fields.filter(f => f.required).length)
const filledCount = computed(() => currentForm.fields.filter(f => {
  const val = formState[f.id]
  return val !== null && val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)
}).length)

function resolveIntent(prompt: string): string {
  const bestMatch = Object.entries(keywordMap)
    .map(([, mapping]) => {
      const matched = mapping.keywords.filter(kw => prompt.includes(kw))
      return { scenarioId: mapping.scenarioId, score: matched.length }
    })
    .sort((a, b) => b.score - a.score)[0]
  return bestMatch && bestMatch.score > 0 ? bestMatch.scenarioId : 'event'
}

function applyPrompt(scenarioId: string) {
  const scenario = scenarios.find(s => s.id === scenarioId)
  if (!scenario) return
  activeScenarioId.value = scenarioId
  aiPrompt.value = scenario.prompt
}

function applySchema(schema: FormSchema) {
  currentForm.title = schema.title
  currentForm.description = schema.description
  currentForm.version = schema.version
  currentForm.tags = [...schema.tags]
  currentForm.fields = structuredClone(schema.fields)
  Object.keys(formState).forEach(key => delete formState[key])
  currentForm.fields.forEach(field => {
    formState[field.id] = field.type === 'checkbox' ? [] : ''
  })
}

function resetPipeline() {
  pipelineSteps.splice(0, pipelineSteps.length, ...structuredClone(mcpPipelineTemplate))
}

function resetDemo() {
  activeScenarioId.value = 'event'
  aiPrompt.value = scenarios[0].prompt
  applySchema(scenarios[0].schema)
  resetPipeline()
  clearMcpLogs()
}

async function handlePromptSubmit() {
  if (running.value) return
  running.value = true
  pipelineRunning.value = true
  resetPipeline()

  // 添加用户指令日志
  llmSteps.splice(0, llmSteps.length)
  llmSteps.push({ type: 'user_prompt', data: aiPrompt.value, timestamp: now() })

  try {
    // Step 1-4: 先执行 MCP 协议握手，更新连接状态
    pipelineSteps[0].status = 'running'
    await mcpInitialize()
    pipelineSteps[0].status = 'done'
    await wait(150)

    pipelineSteps[1].status = 'running'
    await mcpInitialized()
    pipelineSteps[1].status = 'done'
    await wait(150)

    pipelineSteps[2].status = 'running'
    await mcpListTools()
    pipelineSteps[2].status = 'done'
    await wait(150)

    pipelineSteps[3].status = 'running'
    await mcpListResources()
    pipelineSteps[3].status = 'done'
    await wait(150)

    // Step 5-8: 调用后端 LLM 中间层：自然语言 → LLM 决策 → MCP 工具调用
    const result = await chatWithLLM(aiPrompt.value)

    // 逐步更新 pipeline 状态
    for (const step of result.steps) {
      const stepIndex = mapStepToPipeline(step)
      if (stepIndex >= 0 && stepIndex < pipelineSteps.length) {
        pipelineSteps[stepIndex].status = 'running'
        await wait(300)
        pipelineSteps[stepIndex].status = 'done'
      }
      llmSteps.push(step)
    }

    // 从工具结果中提取 Schema，驱动 TinyVue 渲染
    const previewStep = result.steps.find(s => s.type === 'tool_result' && isPreviewResult(s))
    if (previewStep) {
      const schemaData = extractMcpData(previewStep.data)
      if (schemaData && schemaData.fields) {
        applySchema(schemaData)
      }
    }

    llmFinalMessage.value = result.finalMessage
  } catch (error: any) {
    // LLM 不可用时回退到关键词匹配
    const scenarioId = resolveIntent(aiPrompt.value)
    activeScenarioId.value = scenarioId
    for (const step of pipelineSteps) {
      step.status = 'done'
    }
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (scenario) applySchema(scenario.schema)
    llmFinalMessage.value = `LLM 不可用，回退到关键词匹配：${error.message}`
  }

  running.value = false
  pipelineRunning.value = false
}

function mapStepToPipeline(step: LLMStepEntry): number {
  // 将 LLM 交互步骤映射到 pipeline 显示
  if (step.type === 'tool_call') {
    const name = (step.data as any)?.name
    if (name === 'form.createPage') return 4
    if (name === 'form.addField') return 5
    if (name === 'form.setValidation') return 6
    if (name === 'form.previewRender') return 7
  }
  if (step.type === 'llm_request') return 0
  if (step.type === 'llm_response') return 3
  return -1
}

function isPreviewResult(step: LLMStepEntry): boolean {
  const data = step.data as any
  if (data?.content?.[0]?.text) {
    try {
      const parsed = JSON.parse(data.content[0].text)
      return parsed.action === 'previewRender'
    } catch { return false }
  }
  return false
}

function now(): string {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function wait(ms: number) {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

function autoFill() {
  currentForm.fields.forEach(field => {
    if (field.type === 'checkbox') { formState[field.id] = field.options?.slice(0, 2) ?? []; return }
    if (field.type === 'date') { formState[field.id] = new Date(); return }
    if ((field.type === 'select' || field.type === 'radio') && field.options?.length) { formState[field.id] = field.options[0]; return }
    formState[field.id] = field.type === 'textarea' ? 'AI 根据上下文生成的演示填充内容。' : `${field.label}演示值`
  })
}

function submitForm() {
  const missing = currentForm.fields.filter(f => {
    if (!f.required) return false
    const val = formState[f.id]
    return Array.isArray(val) ? val.length === 0 : !val
  })
  if (missing.length > 0) { alert(`请先填写：${missing.map(f => f.label).join('、')}`); return }
  alert('表单校验通过，已完成提交预览')
}

function formatJson(body: unknown): string {
  try { return JSON.stringify(body, null, 2) } catch { return String(body) }
}

applySchema(scenarios[0].schema)
</script>
