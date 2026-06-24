# collapse Demos

| demoId | 名称 | 描述 | 代码文件 |
|--------|------|------|----------|
| basic-usage | 基本用法 | <p>配置 <code>name</code> 属性作为每个 <code>collapse-item</code> 的唯一标志符，配置 <code>v-model</code> 设置当前激活的面板。默认情况下可以同时展开多个面板，这个例子默认展开了第一和第三个面板。</p> | collapse/basic-usage.vue |
| accordion | 手风琴效果 | <p>配置 <code>accordion</code> 属性为 <code>true</code>  后，折叠面板将展示手风琴效果，一次只允许展开一个面板。</p> | collapse/accordion.vue |
| disable | 禁用状态 | <p>在 <code>collapse-item</code> 元素上配置 <code>disabled</code> 属性为 true 后，将禁用指定的折叠面板项。</p> | collapse/disable.vue |
| size | 面板大小 | 通过 <code>size</code> 属性可以指定折叠面板的尺寸，可选值为 "" \| "medium"。 | collapse/size.vue |
| title | 面板标题 | <p>在 <code>collapse-item</code> 元素上配置 <code>title</code> 属性可以指定每个折叠面板项的标题。也可以通过 <code>title</code> 插槽的方式自定义面板标题，比如在标题后增加图标。<br/>在 <code>collapse-item</code> 元素上配置 <code>title-right</code> 属性可以指定每个折叠面板项标题的右侧内容。也可以通过 <code>title-right</code> 插槽的方式自定义面板标题右侧内容，比如在标题右侧增加图标。</p> | collapse/title.vue |
| icon | 展开/折叠图标 | <p>在 <code>collapse-item</code> 元素上可以通过 <code>icon</code> 插槽的方式自定义展开折叠 icon 图标。也可以通过 <code>expand-icon</code> 参数传入一个框架自带的 <code>icon</code> 图标，此种方式不需要自己写样式</p> | collapse/icon.vue |
| before-close | 阻止切换 | <p>设置 before-close 属性，如果返回 false，将阻止面板的切换。</p> | collapse/before-close.vue |
| nested-content | 嵌套内容 | <p>通过 <code>collapse-item</code> 元素的默认插槽嵌入表单、表格等内容。</p> | collapse/nested-content.vue |
| events | 事件 | <p>激活面板的值改变时将触发 <code>change</code> 事件。</p> | collapse/events.vue |
