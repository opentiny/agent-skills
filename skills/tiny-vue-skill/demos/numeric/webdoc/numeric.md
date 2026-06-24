# numeric Demos

| demoId | 名称 | 描述 | 代码文件 |
|--------|------|------|----------|
| basic-usage | 基本用法 | 可通过<code>v-model</code>属性设置绑定输入值。 | numeric/basic-usage.vue |
| max-min | 最值与数值循环 | 可通过<code>max</code>属性设置计数器允许的最大值，<code>min</code>属性设置计数器允许的最小值，<code>circulate</code>属性设置当计数器的数值为最大值，继续计数，是否从最小值开始计数。 | numeric/max-min.vue |
| about-step | 步长 | 可通过<code>step</code>属性设置计数器的加减数值及<code>mode</code>模式为<code>restore</code>、<code>strictly</code>的用法，<code>step-strictly</code>属性设置只能输入 step 的倍数 | numeric/about-step.vue |
| precision | 数值精度及格式 | 可通过<code>precision</code>属性设置计数器的精度值，<code>format</code>属性设置数字显示格式。 | numeric/precision.vue |
| dynamic-disabled | 禁用 | 可通过<code>disabled</code>属性设置是否禁用计数器。 | numeric/dynamic-disabled.vue |
| parse-input | 自定义输入值解析 | 自定义输入值解析函数，优先级较高。当输入字符以及粘贴时，会调用该函数进行解析。 | numeric/parse-input.vue |
| allow-empty | 可清空 | 可通过<code>allow-empty</code>属性设置计数器内容的可清空特性，默认为 <code>false</code>，表示不可清空。 | numeric/allow-empty.vue |
| empty-value | 设定清空输入后的绑定值 | 可通过 <code>empty-value</code> 属性设置计数器在可清空下，清空后组件的绑定值。默认为 <code>undefined</code>。示例中将清空后组件绑定值改为<code>null</code> | numeric/empty-value.vue |
| numeric-size | 尺寸 | 可通过 <code>size</code> 属性设置计数器尺寸，可选值有 <code>medium</code><code>small</code><code>mini</code>。 | numeric/numeric-size.vue |
| controls | 加减按钮 | 可通过<code>controls</code> 属性设置计数器是否显示加减按钮，<code>controls-position</code> 属性设置加减按钮显示的位置。加减按钮默认分列两侧显示，<code>show-left</code> 属性设置左对齐。 | numeric/controls.vue |
| mouse-wheel | 鼠标滚轮滚动改变值 | 可通过<code>mouse-wheel</code>属性设置控制鼠标滚动滑轮的数值。 | numeric/mouse-wheel.vue |
| unit | 单位 | 可通过<code>unit</code>属性设置计数器的单位，设置单位后，加减按钮将不可用。 | numeric/unit.vue |
| change-event | 值改变事件 | 可通过<code>@change</code>设置监听数值改变事件。当<code>change-compat</code>为 false 时，仅当加减按钮及直接输入数值时会触发<code>change</code>事件。 | numeric/change-event.vue |
| input-event | 输入事件 | <p>输入时触发<code>input</code>事件。<p> | numeric/input-event.vue |
| focus-event | 聚焦事件 | 可通过<code>@focus</code>设置监听输入框获得焦点事件。 | numeric/focus-event.vue |
| blur-event | 失焦事件 | 可通过<code>@blur</code>设置监听输入框失去焦点事件。 | numeric/blur-event.vue |
| string-mode | 高精度 | 可通过 <code>string-mode</code> 设置高精度模式，当 JS 默认的 Number 不满足数字的长度与精度需求时。 | numeric/string-mode.vue |
| filter-mode | 过滤器模式 | 通过<code> shape="filter" </code>属性设置切换过滤器模式，过滤器模式下可传入<code>title</code>显示标题，<code>tip</code>显示提示信息，<code>clearable</code>是否显示清除按钮，默认值为<code>true</code>。<code>blank</code>属性将过滤器背景设置为透明。 | numeric/filter-mode.vue |
| filter-mode-change | 过滤器模式 change 事件 | 通过<code>filter</code>属性展示筛选框，<code>filter-change</code>事件筛选框选择触发，过滤器模式下点击关闭图标，触发<code>clear</code>事件。 | numeric/filter-mode-change.vue |
