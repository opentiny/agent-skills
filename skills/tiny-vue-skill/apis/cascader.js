export default{mode:['pc','mobile-first'],apis:[{name:'cascader',type:'component',props:[{mode:[]},{name:'before-filter',type:'(value: string) => boolean | Promise',defaultValue:'',desc:{'zh-CN':'筛选之前的钩子\uFF0C参数为输入的值\uFF0C若返回 false 或者返回 Promise 且被 reject\uFF0C则停止筛选'},mode:['pc'],pcDemo:'filter-method'},{name:'blank',type:'boolean',defaultValue:'false',desc:{'zh-CN':'shape=\'filter\' 时生效\uFF0C设置过滤器模式背景为透明'},mode:['pc'],pcDemo:'filter-mode'},{name:'clearable',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否支持清空选项'},mode:['pc'],pcDemo:'clearable'},{name:'collapse-tags',type:'boolean',defaultValue:'false',desc:{'zh-CN':'多选模式下是否折叠 Tag'},mode:['pc'],pcDemo:'collapse-tags'},{name:'debounce',type:'number',defaultValue:'300',desc:{'zh-CN':'搜索关键词输入的去抖延迟\uFF0C单位毫秒'},mode:['pc'],pcDemo:'filterable'},{name:'disabled',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否禁用'},mode:['pc'],pcDemo:'disabled-items'},{name:'filter-method',typeAnchorName:'ICascaderPanelNode',type:'(node: ICascaderPanelNode, keyword: string) => boolean',defaultValue:'',desc:{'zh-CN':'自定义搜索逻辑\uFF0C第一个参数是节点 node\uFF0C第二个参数是搜索关键词 keyword\uFF0C通过返回布尔值表示是否命中'},mode:['pc'],pcDemo:'filter-method'},{name:'filterable',type:'boolean',defaultValue:'',desc:{'zh-CN':'是否可搜索选项'},mode:['pc'],pcDemo:'filterable'},{name:'label',type:'string',defaultValue:'',desc:{'zh-CN':'shape=\'filter\' 时生效\uFF0C可传入 label 显示标题'},mode:['pc'],pcDemo:'filter-mode'},{name:'level-title',type:'string[]',defaultValue:'[]',desc:{'zh-CN':'小屏时\uFF0C为组件每一级数据指定级联标题'},mode:['mobile-first']},{name:'modelValue / v-model',typeAnchorName:'ICascaderPanelNodeValue',type:'ICascaderPanelNodePropValue',defaultValue:'',desc:{'zh-CN':'选中项绑定值, 其类型由 props.multiple\u3001props.emitPath 共同决定'},mode:['pc'],pcDemo:'clearable'},{name:'options',typeAnchorName:'ICascaderPanelData',type:'ICascaderPanelData[]',defaultValue:'',desc:{'zh-CN':'可选项数据源\uFF0C键名可通过 Props 属性配置'},mode:['pc'],pcDemo:'disabled-items'},{name:'placeholder',type:'string',defaultValue:'\'请选择\'',desc:{'zh-CN':'输入框占位文本'},mode:['pc'],pcDemo:'filterable'},{name:'popper-append-to-body',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否将弹出框插入至 body 元素\u3002在弹出框的定位出现问题时\uFF0C可将该属性设置为 false (可参考 select 组件)'},mode:['pc'],pcDemo:''},{name:'popper-class',type:'string',defaultValue:'',desc:{'zh-CN':'为 popper 添加类名(可参考 popover 组件)'},mode:['pc'],pcDemo:''},{name:'props',typeAnchorName:'ICascaderPanelConfig',type:'ICascaderPanelConfig',defaultValue:'',desc:{'zh-CN':'配置选项\uFF0C具体见 ICascaderPanelConfig 表'},mode:['pc'],pcDemo:'props-children'},{name:'separator',type:'string',defaultValue:'\'/\'',desc:{'zh-CN':'选项分隔符'},mode:['pc'],pcDemo:'clearable1'},{name:'shape',type:'\'filter\'',defaultValue:'',desc:{'zh-CN':'通过 shape=\'filter\' 属性切换至过滤器模式'},mode:['pc'],pcDemo:'filter-mode'},{name:'show-all-levels',type:'boolean',defaultValue:'true',desc:{'zh-CN':'输入框中是否显示选中值的完整路径'},mode:['pc'],pcDemo:'show-all-levels'},{name:'show-header',type:'boolean',defaultValue:'true',desc:{'zh-CN':'小屏时\uFF0C是否显示标题'},mode:['mobile-first']},{name:'size',type:'\'medium\' | \'small\' | \'mini\'',defaultValue:'',desc:{'zh-CN':'尺寸'},mode:['pc'],pcDemo:'size'},{name:'tip',type:'string',defaultValue:'',desc:{'zh-CN':'shape=\'filter\' 时生效\uFF0C可传入 tip 显示提示信息'},mode:['pc'],pcDemo:'filter-mode'},{name:'title',type:'string',defaultValue:'\'\'',desc:{'zh-CN':'小屏时\uFF0C弹窗顶部的标题名字'},mode:['mobile-first']}],events:[{name:'blur',type:'(event: FocusEvent) => void',defaultValue:'',desc:{'zh-CN':'当失去焦点时触发'},mode:['pc'],pcDemo:'events'},{name:'change',typeAnchorName:'ICascaderPanelNodePropValue',type:'(value: ICascaderPanelNodePropValue) => void',defaultValue:'',desc:{'zh-CN':'当选中节点变化时触发'},mode:['pc'],pcDemo:'events'},{name:'expand-change',typeAnchorName:'ICascaderPanelNodeValue',type:'(value: ICascaderPanelNodeValue[]) => void',defaultValue:'',desc:{'zh-CN':'当展开节点发生变化时触发'},mode:['pc'],pcDemo:'events'},{name:'focus',type:'(event: FocusEvent) => void',defaultValue:'',desc:{'zh-CN':'当获得焦点时触发'},mode:['pc'],pcDemo:'events'},{name:'remove-tag',typeAnchorName:'ICascaderPanelNodeValue',type:'(removeValue: ICascaderPanelNodeValue[]) => void',defaultValue:'',desc:{'zh-CN':'在多选模式下\uFF0C移除Tag时触发'},mode:['pc'],pcDemo:'default-multiple'},{name:'visible-change',type:'(visible: boolean) => void',defaultValue:'',desc:{'zh-CN':'下拉框出现/隐藏时触发'},mode:['pc'],pcDemo:'events'}],methods:[{name:'getCheckedNodes',typeAnchorName:'ICascaderPanelNode',type:'(leafOnly: boolean = false) => ICascaderPanelNode[]',defaultValue:'',desc:{'zh-CN':'获取选中的节点'},mode:['pc'],pcDemo:'events'}],slots:[{name:'default',defaultValue:'',desc:{'zh-CN':'自定义备选项的节点内容\uFF0C参数为 { node: ICascaderPanelNode, data: ICascaderPanelData }\uFF0C分别为当前节点的 Node 对象和数据'},mode:['pc']},{name:'empty',defaultValue:'',desc:{'zh-CN':'无匹配选项时的内容'},mode:['pc'],pcDemo:'filterable'},{name:'no-data',defaultValue:'',desc:{'zh-CN':'通过 <code>no-data</code> 插槽设置没有数据时显示的内容'},mode:['pc'],pcDemo:'slot-nodata'}]},{name:'ICascaderPanelConfig ',type:'component',props:[{name:'checkStrictly',type:'boolean',defaultValue:' false',desc:{'zh-CN':'是否严格的遵守父子节点不互相关联'},mode:['pc'],pcDemo:'check-strictly'},{name:'children',type:'string',defaultValue:'\'children\'',desc:{'zh-CN':'指定选项的子选项为选项对象的某个属性值'},mode:['pc'],pcDemo:'props-children'},{name:'disabled',type:'string',defaultValue:'\'disabled\'',desc:{'zh-CN':'指定选项的禁用为选项对象的某个属性值'},mode:['pc'],pcDemo:'disabled-items'},{name:'emitPath',type:'boolean',defaultValue:' true',desc:{'zh-CN':'在选中节点改变时\uFF0C是否返回由该节点所在的各级菜单的值所组成的数组\uFF0C若设置 false\uFF0C则只返回该节点的值'},mode:['pc'],pcDemo:'events'},{name:'expandTrigger',type:'\'click\' | \'hover\'',defaultValue:'\'click\'',desc:{'zh-CN':'次级菜单的展开方式'},mode:['pc'],pcDemo:'expand-trigger'},{name:'label',type:'string',defaultValue:'\'label\'',desc:{'zh-CN':'指定选项标签为选项对象的某个属性值'},mode:['pc'],pcDemo:'props-children'},{name:'lazy',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否动态加载子节点\uFF0C需与 lazyLoad 方法结合使用'},mode:['pc'],pcDemo:'auto-load'},{name:'lazyLoad',typeAnchorName:'ICascaderPanelLazyLoad',type:'ICascaderPanelLazyLoad',defaultValue:'',desc:{'zh-CN':'加载动态数据的方法\uFF0C仅在 lazy 为 true 时有效;参数说明\uFF1A node 为当前点击的节点\uFF0Cresolve 为数据加载完成的回调(必须调用)'},mode:['pc'],pcDemo:'auto-load'},{name:'leaf',type:'string',defaultValue:'\'leaf\'',desc:{'zh-CN':'指定选项的叶子节点的标志位为选项对象的某个属性值'},mode:['pc'],pcDemo:'props-children'},{name:'multiple',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否多选'},mode:['pc'],pcDemo:'default-multiple'},{name:'value',type:'string',defaultValue:'\'value\'',desc:{'zh-CN':'指定选项的值为选项对象的某个属性值'},mode:['pc'],pcDemo:'props-children'}],events:[],methods:[],slots:[]}],types:[{name:'ICascaderPanelNodeValue',type:'type',code:`type ICascaderPanelNodeValue = string | number`},{name:'ICascaderPanelNodePropValue',type:'type',depTypes:['ICascaderPanelNodeValue'],code:`
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
}`},{name:'ICascaderPanelNode',type:'type',depTypes:['ICascaderPanelNode','ICascaderPanelData','ICascaderPanelConfig','ICascaderPanelNodeValue'],code:`
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