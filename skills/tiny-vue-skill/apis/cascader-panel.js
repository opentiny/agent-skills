export default{mode:['pc'],apis:[{name:'cascader-panel',type:'component',props:[{name:'modelValue / v-model',typeAnchorName:'ICascaderPanelNodePropValue',type:'ICascaderPanelNodePropValue',defaultValue:'',desc:{'zh-CN':'选中项绑定值, 其类型由 props.multiple\u3001props.emitPath 共同决定'},mode:['pc'],pcDemo:'basic-usage'},{name:'options',typeAnchorName:'ICascaderPanelData',type:'ICascaderPanelData[]',defaultValue:'',desc:{'zh-CN':'可选项数据源\uFF0C键名可通过 Props 属性配置'},mode:['pc'],pcDemo:'basic-usage'},{name:'props',typeAnchorName:'ICascaderPanelConfig',type:'ICascaderPanelConfig',defaultValue:'',desc:{'zh-CN':'配置选项\uFF0C具体见 ICascaderPanelConfig 表 '},mode:['pc'],pcDemo:'cascader-panel-props'}],events:[{name:'change',typeAnchorName:'ICascaderPanelNodePropValue',type:'(value: ICascaderPanelNodePropValue) => void',defaultValue:'',desc:{'zh-CN':'当选中节点变化时触发; 回调参数为 选中节点的值'},mode:['pc'],pcDemo:'change'},{name:'expand-change',typeAnchorName:'ICascaderPanelNodeValue',type:'(value: ICascaderPanelNodeValue[]) => void',defaultValue:'',desc:{'zh-CN':'当展开节点发生变化时触发; 回调参数为 各父级选项值组成的数组 (Array 类型)'},mode:['pc'],pcDemo:'change'}],methods:[{name:'clearCheckedNodes',type:'() => void',defaultValue:'',desc:{'zh-CN':'清空选中的节点'},mode:['pc'],pcDemo:'change'},{name:'getCheckedNodes',typeAnchorName:'ICascaderPanelNode',type:'(leafOnly: boolean = false) => ICascaderPanelNode[]',defaultValue:'',desc:{'zh-CN':'获取选中的节点;参数为 (leafOnly) 是否只是获取子节点\uFF0C默认值为 false'},mode:['pc'],pcDemo:'change'}],slots:[{name:'default',defaultValue:'',desc:{'zh-CN':'自定义备选项的节点内容\uFF0C参数为 { node: ICascaderPanelNode, data: ICascaderPanelData }\uFF0C分别为当前节点的 Node 对象和数据'},mode:['pc'],pcDemo:'custom-option-content'}]},{name:'ICascaderPanelConfig ',type:'component',props:[{name:'checkStrictly',type:'boolean',defaultValue:' false',desc:{'zh-CN':'是否严格的遵守父子节点不互相关联'},mode:['pc']},{name:'children',type:'string',defaultValue:'\'children\'',desc:{'zh-CN':'指定选项的子选项为选项对象的某个属性值'},mode:['pc'],pcDemo:'cascader-panel-props'},{name:'disabled',type:'string',defaultValue:'\'disabled\'',desc:{'zh-CN':'指定选项的禁用为选项对象的某个属性值'},mode:['pc'],pcDemo:'cascader-panel-props'},{name:'emitPath',type:'boolean',defaultValue:' true',desc:{'zh-CN':'在选中节点改变时\uFF0C是否返回由该节点所在的各级菜单的值所组成的数组\uFF0C若设置 false\uFF0C则只返回该节点的值'},mode:['pc']},{name:'expandTrigger',type:'\'click\' | \'hover\'',defaultValue:'\'click\'',desc:{'zh-CN':'次级菜单的展开方式'},mode:['pc']},{name:'label',type:'string',defaultValue:'\'label\'',desc:{'zh-CN':'指定选项标签为选项对象的某个属性值'},mode:['pc'],pcDemo:'cascader-panel-props'},{name:'lazy',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否动态加载子节点\uFF0C需与 lazyLoad 方法结合使用'},mode:['pc']},{name:'lazyLoad',typeAnchorName:'ICascaderPanelLazyLoad',type:'ICascaderPanelLazyLoad',defaultValue:'',desc:{'zh-CN':'加载动态数据的方法\uFF0C仅在 lazy 为 true 时有效;参数说明\uFF1A node 为当前点击的节点\uFF0Cresolve 为数据加载完成的回调(必须调用)'},mode:['pc']},{name:'leaf',type:'string',defaultValue:'\'leaf\'',desc:{'zh-CN':'指定选项的叶子节点的标志位为选项对象的某个属性值'},mode:['pc'],pcDemo:'cascader-panel-props'},{name:'multiple',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否多选'},mode:['pc']},{name:'value',type:'string',defaultValue:'\'value\'',desc:{'zh-CN':'指定选项的值为选项对象的某个属性值'},mode:['pc'],pcDemo:'cascader-panel-props'}],events:[],methods:[],slots:[]}],types:[{name:'ICascaderPanelNodeValue',type:'type',code:`type ICascaderPanelNodeValue = string | number`},{name:'ICascaderPanelNodePropValue',type:'type',depTypes:['ICascaderPanelNodeValue'],code:`
type ICascaderPanelNodePropValue =
  | ICascaderPanelNodeValue
  | ICascaderPanelNodeValue[]
  | ICascaderPanelNodeValue[][]`},{name:'ICascaderPanelData',type:'type',depTypes:['ICascaderPanelNodeValue'],code:`
type ICascaderPanelData = {
  value?: ICascaderPanelNodeValue
  label?: string
  children?: ICascaderPanelData[]
  disabled?: boolean
  leaf?: boolean
  [key: string]: ICascaderPanelNodeValue | ICascaderPanelData[] | string | boolean | undefined
}`},{name:'ICascaderPanelConfig',type:'interface',depTypes:['ICascaderPanelNode','ICascaderPanelData'],code:`
interface ICascaderPanelConfig {
  emitPath: boolean
  expandTrigger: 'click' | 'hover'
  hoverThreshold: number
  checkStrictly?: boolean
  multiple?: boolean
  lazy: boolean
  lazyLoad: (
    node: ICascaderPanelNode,
    resolve: (dataList: ICascaderPanelData[]) => void
  ) => void
  value: string
  label: string
  children: string
  disabled: string
  leaf: string
}`},{name:'ICascaderPanelNode',type:'type',depTypes:['ICascaderPanelData','ICascaderPanelConfig','ICascaderPanelNodeValue'],code:`
type ICascaderPanelNode = {
  parent: ICascaderPanelNode | null
  level: number
  data: ICascaderPanelData
  config: ICascaderPanelConfig
  uid: number
  value: ICascaderPanelNodeValue
  label: string
  pathNodes: Node[]
  path: ICascaderPanelNodeValue[]
  pathLabels: string[]
  loaded: boolean
  loading: boolean
  hasChildren: boolean
  children: Node[]
  checked?: boolean
  indeterminate?: boolean
  root?: boolean
}`},{name:'ICascaderPanelLazyLoad',type:'type',depTypes:['ICascaderPanelNode','ICascaderPanelData'],code:`
type ICascaderPanelLazyLoad = (node: ICascaderPanelNode, resolve: (dataList: ICascaderPanelData[]) => void) => void
      `}]};