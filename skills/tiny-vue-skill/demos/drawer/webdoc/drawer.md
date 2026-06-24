# drawer Demos

| demoId | 名称 | 描述 | 代码文件 |
|--------|------|------|----------|
| basic-usage | 基本用法 | <p>详细用法参考如下示例。</p> | drawer/basic-usage.vue |
| drawer-to-body | 挂载节点 | <code>append-to-body</code> 属性可以将抽屉挂载到 body 元素上。默认值为 <code>false</code>，即挂载在当前组件内。 | drawer/drawer-to-body.vue |
| close-on-press-escape | 按下 ESC 关闭抽屉 | <p>添加 <code>close-on-press-escape</code> 属性可以控制是否可以通过 ESC 关闭抽屉。</p> | drawer/close-on-press-escape.vue |
| use-through-method | 通过方法调用 | <p>通过 <code>Drawer.service</code> 方法可配置并打开抽屉，方法返回组件实例，可调用其 <code>close</code> 方法关闭组件。</p> | drawer/use-through-method.vue |
| placement | 抽屉方向 | <p>添加 <code>placement</code> 属性设置抽屉的方向，可选值有 <code>'left' \| 'right' \| 'top' \| 'bottom'</code>，默认值为 <code>'right'</code>。</p> | drawer/placement.vue |
| tips-props | 帮助提示 | <p>通过 <code>tips-props</code> 属性可自定义标题帮助提示信息，具体属性配置参考 <a href="tooltip#tooltip">ToolTip 组件</a> 的 props 说明。</p> | drawer/tips-props.vue |
| width | 抽屉宽度 | <p>添加 <code>width</code> 属性设置抽屉的宽度，默认值为 <code>500px</code>。</p> | drawer/width.vue |
| dragable | 宽高可拖拽 | <p>添加 <code>dragable</code> 属性开启抽屉宽度/高度拖拽功能。当抽屉位于左右两侧时可拖拽宽度，上下两侧可拖拽高度。默认值为 <code>false</code>。</p> | drawer/dragable.vue |
| mask | 遮罩层显示隐藏 | <p>添加 <code>mask</code> 属性可以控制遮罩层显示隐藏，默认值为 <code>true</code> 。</p> | drawer/mask.vue |
| before-close | 拦截抽屉关闭 | <p>通过 <code>before-close</code> 属性可以配置一个拦截弹窗关闭的方法。如果方法返回 <code>false</code> 值，则拦截弹窗关闭；否则不拦截。</p><br>          <p>可以通过该拦截方法传入的参数获取关闭的操作类型 <code>type</code> 弹窗有以下关闭类型：</p><br>          <ul><br>            <li>confirm：点击确定按钮时关闭</li><br>            <li>cancel：点击取消时关闭</li><br>            <li>close：点击关闭按钮时关闭</li><br>            <li>mask：点击遮罩层时关闭</li><br>          </ul> | drawer/before-close.vue |
| mask-closable | 点击遮罩层关闭抽屉 | <p>默认弹窗打开后，可以单击遮罩层关闭弹窗，设置 <code>mask-closable</code> 为 <code>false</code> 后将禁用该功能，默认值为 <code>true</code> 。</p> | drawer/mask-closable.vue |
| destroy-on-close | 关闭时销毁主体元素 | <p>可通过<code>destroy-on-close</code>属性设置<code>true</code>在关闭抽屉时销毁<code>drawer</code>抽屉内的所有元素，默认值为<code>false</code>。</p> | drawer/destroy-on-close.vue |
| show-close | 关闭图标显示 | <p><code>show-close</code> 控制显示关闭图标，默认值为 <code>true</code>。</p> | drawer/show-close.vue |
| show-header | 头部显示 | <p><code>show-header</code> 控制显示头部，默认值为 <code>true</code>。</p> | drawer/show-header.vue |
| show-footer | 底部显示 | <p><code>show-footer</code> 控制显示底部，默认值为 <code>false</code>。</p> | drawer/show-footer.vue |
| z-index | 自定义堆叠顺序 | <p>可通过 <code>z-index</code> 属性设置自定义堆叠顺序（对于某些特殊场景，比如被遮挡时可能会用到）。</p><br> | drawer/z-index.vue |
| header-slot | 头部插槽 | <p>自定义头部内容，当 <code>show-header</code> 取值为 <code>true</code> 时有效。</p> | drawer/header-slot.vue |
| header-right-slot | 头部右侧插槽 | <p>自定义头部右侧内容，当 <code>show-header</code> 取值为 <code>true</code> 时有效。</p> | drawer/header-right-slot.vue |
| footer-slot | 底部插槽 | <p>底部插槽，默认隐藏底部，设置 <code>:show-footer="true"</code> 时有效。<p> | drawer/footer-slot.vue |
| events | 事件 | <br>          <p><code>open</code>：当抽屉打开时触发；</p><br>          <p><code>confirm</code>：当抽屉底部确定按钮点击时触发，该按钮仅当设置 <code>show-footer</code> 属性为 true 时可见；</p><br>          <p><code>closed</code>：当抽屉关闭动画结束时触发；</p><br>          <p><code>close</code>：当抽屉关闭时触发。关闭抽屉的途径有：</p><br>            <ul><br>              <li>点击右上角关闭按钮；</li><br>              <li>点击遮罩层，仅当 <code>mask-closable</code> 属性为 true 时有效；</li><br>              <li>点击底部取消按钮，该按钮仅当设置 <code>show-footer</code> 属性为 true 时可见；</li><br>              <li>通过组件实例的 <code>close</code> 方法触发。</li><br>            </ul> | drawer/events.vue |
