export default{mode:['pc'],apis:[{name:'tree-menu',type:'component',props:[{name:'accordion',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否设置为手风琴效果\uFF08只能展开一个同级别的节点\uFF09'},mode:['pc'],pcDemo:'accordion'},{name:'allow-drag',typeAnchorName:'ITreeNodeVm',type:'(vm:ITreeNodeVm) => boolean',defaultValue:'',desc:{'zh-CN':'拖拽开始前的回调事件\uFF0C定义节点是否允许拖拽的规则\uFF0C返回 true 则允许拖拽\uFF0C配合 draggable 属性使用'},mode:['pc'],pcDemo:'event-allow-draggable'},{name:'allow-drop',typeAnchorName:'ITreeNodeVm',type:'(draggingNode: ITreeNodeVm, targetNode: ITreeNodeVm,type: "prev"|"next"|"inner") => boolean',defaultValue:'',desc:{'zh-CN':'拖拽结束前的回调事件\uFF0C定义节点是否允许放置到模板节点的规则\uFF0C返回 true 则允许放置\uFF0C配合 draggable 属性使用'},mode:['pc'],pcDemo:'event-allow-draggable'},{name:'check-strictly',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否遵循父级和子级严格不相关联的做法\uFF0C配合 show-checkbox 属性使用'},mode:['pc'],pcDemo:'show-checkbox'},{name:'collapsible',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否允许展开后的菜单收起\uFF0C未和 show-number 配套使用时\uFF0C仍可以点击图标收起'},mode:['pc'],pcDemo:'show-number'},{name:'customIcon',type:'Component',defaultValue:'',desc:{'zh-CN':'设置带图标树形菜单'},mode:['pc'],pcDemo:'show-expand'},{name:'placeholder',type:'string',defaultValue:'',desc:{'zh-CN':'当数据为空时的占位符'},mode:['pc'],pcDemo:'basic-usage'},{name:'data',typeAnchorName:'ITreeNodeData',type:'ITreeNodeData[]',defaultValue:'[]',desc:{'zh-CN':'静态数据源'},mode:['pc'],pcDemo:'data-resource'},{name:'default-checked-keys',type:'Array<number|string>',defaultValue:'[]',desc:{'zh-CN':'默认勾选节点的 key 的数组'},mode:['pc'],pcDemo:'default-expand-all'},{name:'default-expand-all',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否默认展开所有子节点'},mode:['pc'],pcDemo:'default-expand-all'},{name:'default-expanded-keys',type:'Array<number|string>',defaultValue:'[]',desc:{'zh-CN':'默认展开节点的 key 的数组'},mode:['pc'],pcDemo:'default-expanded-keys'},{name:'default-expanded-keys-highlight',type:'number|string',defaultValue:'',desc:{'zh-CN':'设置默认展开节点中的某个节点高亮\uFF0C配合 default-expanded-keys 属性使用'},mode:['pc'],pcDemo:'default-expanded-keys-highlight'},{name:'draggable',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否可拖动菜单节点'},mode:['pc'],pcDemo:'draggable'},{name:'ellipsis',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否文字超长省略显示\u3002优先级高于 wrap'},mode:['pc'],pcDemo:'text-ellipsis'},{name:'empty-text',type:'string',defaultValue:'',desc:{'zh-CN':'内容为空时展示的文本'},mode:['pc'],pcDemo:'empty-text'},{name:'expand-on-click-node',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否能点击节点即展开/收起\u3002配置为 fasle 则只能点击下拉图标展开/收起'},mode:['pc'],pcDemo:'expand-on-click-node'},{name:'filter-node-method',typeAnchorName:'ITreeNodeVm',type:'(query:string, data:ITreeNodeData, node:ITreeNodeVm) => boolean',defaultValue:'',desc:{'zh-CN':'自定义树节点过滤的方法\uFF0C返回 true 表示这个节点可以显示\uFF0C返回 false 则表示这个节点会被隐藏'},mode:['pc'],pcDemo:'filter-node-method'},{name:'get-menu-data-sync',typeAnchorName:'ITreeNodeData',type:'() => ITreeNodeData[]',defaultValue:'',desc:{'zh-CN':'自定义获取服务端数据源的方法\uFF0C返回一个 Promise 对象'},mode:['pc'],pcDemo:'data-resource'},{name:'indent',type:'number',defaultValue:'',desc:{'zh-CN':'子级相对于父级节点的水平缩进距离\uFF0C单位 px'},mode:['pc'],pcDemo:'indent'},{name:'lazy',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否懒加载子节点\uFF0C配合 load 属性使用'},mode:['pc'],pcDemo:'lazy-load'},{name:'load',typeAnchorName:'IResolveType',type:'(node:ITreeNodeVm, resolve:IResolveType) => IResolveType',defaultValue:'',desc:{'zh-CN':'加载子树数据的方法\uFF0C仅当 lazy 属性为 true 时生效'},mode:['pc'],pcDemo:'lazy-load'},{name:'menu-collapsible',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否显示侧边折叠与展开按钮'},mode:['pc'],pcDemo:'menu-collapsible'},{name:'node-height',type:'number',defaultValue:'',desc:{'zh-CN':'节点高度'},mode:['pc'],pcDemo:'show-number'},{name:'node-key',type:'string',defaultValue:'',desc:{'zh-CN':'设置每个树节点唯一标识\uFF08key\uFF09的属性\uFF0C在整棵树中都是唯一的'},mode:['pc'],pcDemo:'default-expand-all'},{name:'only-check-children',type:'boolean',defaultValue:'false',desc:{'zh-CN':'父级是否不可选\uFF0C只能展开不能跳转'},mode:['pc'],pcDemo:'only-check-children'},{name:'props',typeAnchorName:'IProps',type:'IProps',defaultValue:'<pre>\n{\n  children: \'children\'\n  label: \'label\'\n  disabled: \'disabled\'\n  isLeaf: \'isLeaf\'\n} \n</pre>',desc:{'zh-CN':'映射字段'},mode:['pc'],pcDemo:'props'},{name:'search-icon',type:'Component',defaultValue:'',desc:{'zh-CN':'自定义搜索图标'},mode:['pc'],pcDemo:'custom-icon'},{name:'show-checkbox',type:'boolean',defaultValue:'false',desc:{'zh-CN':'节点是否可被选择'},mode:['pc'],pcDemo:'show-checkbox'},{name:'show-expand',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否启用一键展开/收起功能\u3002点击左下角图标可展开/收起菜单注意\uFF1A配合 customIcon 属性使用\uFF0C纯文本菜单不支持此功能'},mode:['pc'],pcDemo:'show-expand'},{name:'show-filter',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否显示搜索框\uFF0C可搜索过滤节点'},mode:['pc'],pcDemo:'show-filter'},{name:'show-number',type:'boolean',defaultValue:'false',desc:{'zh-CN':'右侧下拉图标区域是否显示为 number 属性定义的数字内容\uFF0C建议不超过 4 个字符'},mode:['pc'],pcDemo:'show-number'},{name:'show-title',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否显示节点的 title 提示\uFF0C鼠标悬浮节点之上触发'},mode:['pc'],pcDemo:'show-filter'},{name:'suffix-icon',type:'Component',defaultValue:'',desc:{'zh-CN':'全局设置带图标树形菜单'},mode:['pc'],pcDemo:'custom-icon'},{name:'wrap',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否换行显示'},mode:['pc'],pcDemo:'text-wrap'},{name:'clearable',type:'boolean',defaultValue:'false',desc:{'zh-CN':'搜索框是否可清空'},mode:['pc'],pcDemo:'clearable'},{name:'highlight-query',type:'boolean',defaultValue:'false',desc:{'zh-CN':'通过 <code> highlightQuery </code> 属性\uFF0C是否在匹配的节点中\uFF0C高亮搜索文字\u3002<br>'},meta:{stable:'3.19.0'},mode:['pc'],pcDemo:'show-filter'},{name:'width-adapt',type:'boolean',defaultValue:'false',desc:{'zh-CN':'通过 <code> widthAdapt </code> 属性\uFF0C是否让组件宽度自适应父容器\u3002'},meta:{stable:'3.19.0'},mode:['pc'],pcDemo:'show-filter'}],events:[{name:'check-change',typeAnchorName:'ITreeNodeVm',type:'(node:ITreeNodeVm, checked:boolean, indeterminate:boolean) => void',defaultValue:'',desc:{'zh-CN':'监听可勾选节点的勾选状态发生变化时的事件'},mode:['pc'],pcDemo:'events'},{name:'current-change',typeAnchorName:'ITreeNodeVm',type:'(nodeData:ITreeNodeData, node:ITreeNodeVm) => void',defaultValue:'',desc:{'zh-CN':'监听当前选中节点发生变化时的事件'},mode:['pc'],pcDemo:'events'},{name:'node-click',typeAnchorName:'ITreeNodeVm',type:'(nodeData:ITreeNodeData, node:ITreeNodeVm) => void',defaultValue:'',desc:{'zh-CN':'监听节点被点击时的事件'},mode:['pc'],pcDemo:'events'},{name:'node-collapse',typeAnchorName:'ITreeNodeVm',type:'(nodeData:ITreeNodeData, node:ITreeNodeVm) => void',defaultValue:'',desc:{'zh-CN':'监听节点被点击收起时的事件;'},mode:['pc'],pcDemo:'events'},{name:'node-drag-end',typeAnchorName:'IDropType',type:'(draggingNode:ITreeNodeVm, targetNode:ITreeNodeVm, dropType:IDropType, event:DragEvent) => void',defaultValue:'',desc:{'zh-CN':'监听节点拖拽结束\uFF08可能未成功\uFF09的事件'},mode:['pc'],pcDemo:'event-allow-draggable'},{name:'node-drag-start',typeAnchorName:'ITreeNodeVm',type:'(node:ITreeNodeVm, event:DragEvent) => void',defaultValue:'',desc:{'zh-CN':'监听节点开始拖拽的事件'},mode:['pc'],pcDemo:'event-allow-draggable'},{name:'node-expand',typeAnchorName:'ITreeNodeVm',type:'(nodeData:ITreeNodeData, node:ITreeNodeVm) => void',defaultValue:'',desc:{'zh-CN':'监听节点被点击展开时的事件;'},mode:['pc'],pcDemo:'events'},{name:'input-change',type:'(data:string) => void',defaultValue:'',desc:{'zh-CN':'输入框输入值时触发的事件'},mode:['pc'],pcDemo:'events',meta:{stable:'3.27.0'}}],methods:[{name:'getCurrentKey',type:'() => string | number | null',defaultValue:'',desc:{'zh-CN':'获取当前选中节点的 key \uFF0C注意\uFF1A配合 node-key 属性设置每个节点 key 值的字段,仅适用单选'},mode:['pc'],pcDemo:'current-node'},{name:'getCurrentNode',typeAnchorName:'ITreeNodeData',type:'() => ITreeNodeData|null',defaultValue:'',desc:{'zh-CN':'获得当前选中节点的数据,注意\uFF1A配合 node-key 属性设置每个节点 key 值的字段,仅适用单选'},mode:['pc'],pcDemo:'current-node'},{name:'setCurrentKey',type:'(key:string|number) => void',defaultValue:'',desc:{'zh-CN':'通过 key 设置某个节点为当前选中的节点\uFF0C注意\uFF1A配合 node-key 属性设置每个节点 key 值的字段'},mode:['pc'],pcDemo:'current-node'},{name:'setCurrentNode',typeAnchorName:'ITreeNodeData',type:'(nodeData:ITreeNodeData) => void',defaultValue:'',desc:{'zh-CN':'通过 nodeData 设置某个节点为当前选中的节点\uFF0C注意\uFF1A配合 node-key 属性设置每个节点 key 值的字段'},mode:['pc'],pcDemo:'current-node'}],slots:[{name:'default',defaultValue:'',desc:{'zh-CN':'自定义树节点的内容\uFF0C参数为 { node, data }'},mode:['pc'],pcDemo:'tree-menu-slot'}]}],types:[{name:'ITreeNodeVm',type:'interface',code:`
interface ITreeNodeVm {
  // 是否已勾选
  "checked": boolean
  // 子节点
  "childNodes": ITreeNodeVm[]
  // 节点数据
  "data":  ITreeNodeData
  // 是否展开
  "expanded": boolean
  // 唯一标识
  "id": string | number
  // 是否半选
  "indeterminate": boolean
  // 是否当前节点
  "isCurrent": boolean
  // 是否叶子节点
  "isLeaf": boolean
  // 层级
  "level": number
  // 是否已加载
  "loaded": boolean
  // 是否加载中
  "loading": boolean
  // 是否可见
  "visible": boolean
  // 是否禁用
  "disabled": boolean
  // 节点显示文本
  "label": string
}        
`},{name:'ITreeNodeData',type:'interface',code:`
interface ITreeNodeData {
  // node-key='id' 设置节点的唯一标识
  "id": number | string
  // 节点显示文本
  "label": string
  // 子节点
  "children"?: ITreeNodeData[]
  // 链接
  "url"?: string,
  // show-number 时展示的字段
  "number"?: number | string
  // 自定义每个节点的图标
  "customIcon": Component 
  // 节点是否可以点击
  "disabled"?: string
 
}        
`},{name:'IProps',type:'interface',code:`
interface IProps {
  "label": string
  "children": string
  "disabled"?: string
  "isLeaf"?: string
}        
`},{name:'IResolveType',type:'type',code:`
// Promise 的 resolve 回调函数
type IResolveType = (data:ITreeNodeData) => void
`},{name:'IDropType',type:'type',code:`
// 拖拽节点相对目标节点的位置
type IDropType = before | after | inner | none  
`}]};