export default{mode:['pc'],apis:[{name:'dialog-select',type:'component',props:[{mode:[]},{name:'before-close',type:'() => boolean',defaultValue:'',desc:{'zh-CN':'弹窗关闭前的回调\uFF0C返回 false 会阻止弹窗关闭'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'dialog-op',typeAnchorName:'IDialogOption',type:'IDialogOption',defaultValue:'{}',desc:{'zh-CN':'用于配置 DialogBox 对话框组件的属性\uFF0C对话框事件和插槽已透传'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'lock-scroll',type:'boolean',defaultValue:'true',desc:{'zh-CN':'设置弹出面板的锁定滚动'},meta:{stable:'3.24.0'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'grid-op',typeAnchorName:'IGridOption',type:'IGridOption',defaultValue:'{}',desc:{'zh-CN':'表格场景时\uFF0C配置 Grid 组件的属性'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'lookup-method',type:'() => Promise',defaultValue:'',desc:{'zh-CN':'初始化选中数据的加载方法'},mode:['pc'],pcDemo:'nest-grid-mult'},{name:'main-height',type:'number',defaultValue:'290',desc:{'zh-CN':'配置表格或树区域的高度'},mode:['pc'],pcDemo:'nest-grid-mult'},{name:'multi',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否多选'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'pager-op',typeAnchorName:'IPagerOption',type:'IPagerOption',defaultValue:'<pre>{\n  currentPage: 1,\n  pageSize: 10,\n  pageSizes: [10, 20, 30, 40, 50, 100],\n  total: 0,\n  layout: \'total, prev, pager, next, jumper\'\n}</pre>',desc:{'zh-CN':'使用表格展示数据时\uFF0C属性 pagerOp 用于配置 Pager 分页组件的属性\uFF0C分页事件已透传'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'popseletor',type:'string',defaultValue:'\'grid\'',desc:{'zh-CN':'弹窗内展示数据的组件类型\uFF0C目前支持\uFF1A\'grid\' / \'tree\''},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'remote-search',type:'() => Promise',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C配置表格分页查询操作函数\uFF1B使用树展示数据时\uFF0C配置通过pid查询所有子数据的方法'},mode:['pc'],pcDemo:'nest-grid-mult'},{name:'selected-box-op',typeAnchorName:'ISelectedBoxOption',type:'ISelectedBoxOption',defaultValue:'{}',desc:{'zh-CN':'使用表格展示数据时\uFF0C属性 selectedBoxOp 用于配置 SelectedBox 已选栏组件的属性\uFF0C已选栏插槽已透传'},mode:['pc'],pcDemo:'nest-grid-mult'},{name:'show-pager',type:'boolean',defaultValue:'true',desc:{'zh-CN':'使用表格展示数据时\uFF0C是否显示分页组件'},mode:['pc'],pcDemo:''},{name:'show-selected-box',type:'boolean',defaultValue:'true',desc:{'zh-CN':'使用表格展示数据时\uFF0C是否显示已选栏组件'},mode:['pc'],pcDemo:''},{name:'text-field',type:'string',defaultValue:'\'label\'',desc:{'zh-CN':'数据项的显示值字段'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'text-split',type:'string',defaultValue:'\'/\'',desc:{'zh-CN':'多选时用于拼接数据项的 label 字段 '},mode:['pc'],pcDemo:''},{name:'tree-op',typeAnchorName:'ITreeOption',type:'ITreeOption',defaultValue:'{}',desc:{'zh-CN':'使用树展示数据时\uFF0C树组件的配置对象'},mode:['pc'],pcDemo:'nest-tree-multi'},{name:'value-field',type:'string',defaultValue:'\'id\'',desc:{'zh-CN':'数据项的选中值字段'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'value-split',type:'string',defaultValue:'\';\'',desc:{'zh-CN':'多选时用于拼接数据项的选中值'},mode:['pc'],pcDemo:''},{name:'visible',type:'boolean',defaultValue:'false',desc:{'zh-CN':'控制弹出框显示与关闭'},mode:['pc'],pcDemo:'nest-grid-multi'}],events:[{name:'before-page-change',typeAnchorName:'IBeforeChangeParam',type:'(beforeChangeParam:IBeforeChangeParam) => void',defaultValue:'',desc:{'zh-CN':'透传子组件 Pager 的 before-page-change 事件'},mode:['pc'],pcDemo:''},{name:'change',typeAnchorName:'IChangeParam',type:'(changeParam:IChangeParam) => void',defaultValue:'',desc:{'zh-CN':'监听弹窗选择的值发生变化的事件'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'close',type:'() => void',defaultValue:'',desc:{'zh-CN':'透传子组件 DialogBox 的 close 事件'},mode:['pc'],pcDemo:''},{name:'closed',type:'() => void',defaultValue:'',desc:{'zh-CN':'透传子组件 DialogBox 的 closed 事件'},mode:['pc'],pcDemo:''},{name:'current-change',type:'(currentPage: number) => void',defaultValue:'',desc:{'zh-CN':'透传子组件 Pager 的 current-change 事件'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'drag-end',type:'() => void',defaultValue:'',desc:{'zh-CN':'透传子组件 DialogBox 的 drag-end 事件'},mode:['pc'],pcDemo:''},{name:'drag-move',type:'() => void',defaultValue:'',desc:{'zh-CN':'透传子组件 DialogBox 的 drag-move 事件'},mode:['pc'],pcDemo:''},{name:'drag-start',type:'() => void',defaultValue:'',desc:{'zh-CN':'透传子组件 DialogBox 的 drag-start 事件'},mode:['pc'],pcDemo:''},{name:'next-click',type:'(currentPage: number) => void',defaultValue:'',desc:{'zh-CN':'透传子组件 Pager 的 next-click 事件'},mode:['pc'],pcDemo:''},{name:'open',type:'() => void',defaultValue:'',desc:{'zh-CN':'透传子组件 DialogBox 的 open 事件'},mode:['pc'],pcDemo:''},{name:'opened',type:'() => void',defaultValue:'',desc:{'zh-CN':'透传子组件 DialogBox 的 opened 事件'},mode:['pc'],pcDemo:''},{name:'prev-click',type:'(currentPage: number) => void',defaultValue:'',desc:{'zh-CN':'透传子组件 Pager 的 prev-click 事件'},mode:['pc'],pcDemo:'The pre click event of the transparent sub component Pager'},{name:'size-change',type:'(pageSize: number) => void',defaultValue:'',desc:{'zh-CN':'透传子组件 Pager 的 size-change 事件'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'resize',typeAnchorName:'IResizeEvent',type:'(ev: IResizeEvent) => void',defaultValue:'',desc:{'zh-CN':'弹窗大小变化时的事件\uFF0C比如切换全屏状态时'},mode:['pc'],pcDemo:''},{name:'delete',type:'(row: IData) => void',meta:{stable:'3.24.0'},defaultValue:'',desc:{'zh-CN':'已选栏的选项的删除事件'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'clear',type:'() => void',meta:{stable:'3.24.0'},defaultValue:'',desc:{'zh-CN':'已选栏的清空事件'},mode:['pc'],pcDemo:'nest-grid-multi'}],methods:[{name:'getSelection',type:'() => IData[]',typeAnchorName:'IData',meta:{stable:'3.19.0'},defaultValue:'',desc:{'zh-CN':'获取多选选中数据'},mode:['pc'],pcDemo:'set-selection'},{name:'queryGridData',type:'() => void',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C加载表格数据的方法'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'setSelection',type:'(data: IData | IData[], checked: boolean) => void',typeAnchorName:'IData',meta:{stable:'3.19.0'},defaultValue:'',desc:{'zh-CN':'设置数据的多选选中状态\uFF0C需要在弹窗初始化后调用\uFF0C否则调用无效'},mode:['pc'],pcDemo:'set-selection'}],slots:[{name:'button',type:'Slot',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C自定义已选栏的自定义按钮区域'},mode:['pc'],pcDemo:''},{name:'clear',type:'Slot',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C自定义已选栏的清空按钮区域'},mode:['pc'],pcDemo:''},{name:'close',type:'Slot',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C自定义已选栏的选项的删除按钮'},mode:['pc'],pcDemo:'nest-tree-multi'},{name:'footer',type:'Slot',defaultValue:'',desc:{'zh-CN':'自定义弹窗底部'},mode:['pc'],pcDemo:''},{name:'footer-buttons',type:'Slot',defaultValue:'',desc:{'zh-CN':'自定义弹窗底部按钮'},meta:{stable:'3.18.0'},mode:['pc'],pcDemo:''},{name:'option',type:'Slot',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C自定义已选栏的选项'},mode:['pc'],pcDemo:'nest-tree-multi'},{name:'search',type:'Slot',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C自定义搜索区域'},mode:['pc'],pcDemo:'nest-grid-multi'},{name:'select',type:'Slot',defaultValue:'',desc:{'zh-CN':'使用表格展示数据时\uFF0C自定义已选栏的已选提示区域'},mode:['pc'],pcDemo:''},{name:'title',type:'Slot',defaultValue:'',desc:{'zh-CN':'自定义弹窗标题'},mode:['pc'],pcDemo:''}]}],types:[{name:'IDialogOption',type:'interface',code:`
interface IDialogOption {
  // 设置弹出框距离窗口顶部的高度，默认为 15vh
  top: string,
  // 弹出框的宽度,默认 500px
  width: string
  // 弹出框标题
  title: string
  beforeClose: () => boolean
  // 自定义配置弹窗类名
  dialogClass: string
}
`},{name:'IGridOption',type:'interface',depTypes:['IColumnConfig'],code:`
interface IGridOption {
  // 表格列配置
  columns: IColumnConfig[]  
  // 表格列数据
  data: [] 
  // 表格多选配置
  selectConfig: { 
    // 翻页操作是否保留历史选择数据
    reserve: boolean  
    // 嵌套表格多选时，设置默认表格选中的数据
    checkRowKeys: Array<string|number> 
  }
  // 表格单选配置
  radioConfig: { 
    //嵌套表格单选时，设置默认表格选中的数据 
    checkRowKey: string|number  
  }
}
`},{name:'IColumnConfig ',type:'interface',code:`
interface IColumnConfig  {
  type: 'index' | 'radio' | 'checkbox'
  id: string
  title: string
  label: string
  width: string | number
}
`},{name:'IPagerOption',type:'interface',code:`
interface IPagerOption {
  // 当前页，默认 1
  currentPage: number 
  // 每页显示条目个数，默认 10
  pageSize: number   
  // 每页显示个数选择器的选项设置，默认 [10, 20, 30, 40, 50, 100]
  pageSizes: Array<number> 
  // 总条目数
  total:number
  // 分页布局，默认 'total, prev, pager, next, jumper'
  layout: string 
}
`},{name:'ISelectedBoxOption',type:'interface',code:`
interface ISelectedBoxOption {
  config: {
    pkField: string
    pkFieldType: string,
    showField: Array<string>,
    // 传 sortablejs 插件
    plugin: () => void   
  }
}
`},{name:'ITreeOption',type:'interface',code:`
interface ITreeOption {
  // 树节点的唯一标识
  nodeKey: string 
  pathSplit: string
  props: { 
    // 默认为 children
    children:string  
    // 默认为 label
    label: string   
    // 默认为 isLeaf'
    isLeaf: string 
  },
  // 是否为父子严格模式
  checkStrictly: boolean 
  // 相邻级节点间的水平缩进，单位为像素
  baseIndent: number 
  // 加载子树数据的方法
  load: (node, resolve)=> void 
  // 使用树展示数据时，用于配置搜索过滤接口
  queryPidsBySearch: () => ITreeNodeData 
  // 使用树展示数据时，用于配置初始化过滤接口 
  queryPidsByIds: () => ITreeNodeData 
  // 默认勾选的节点的keys
  defaultCheckedKeys: Array<string|number> 
}
`},{name:'ITreeNodeData',type:'interface',code:`
interface ITreeNodeData {
  // node-key='id' 设置节点的唯一标识
  "id": number|string 
  // 节点显示文本  
  "label": string 
  // 子节点
  "children"?: ITreeNodeData[]  
}        
`},{name:'IChangeParam',type:'interface',code:`
// 树组件的节点数据信息
interface ItreeData = {
  id: number|string
  label: string
  pid: number|string
}

// 用户自定义的表格行数据
interface IGridData = {
  id: number|string
 [otherKeys] :any
}

interface IChangeParam = {
 values: Array<number|string>|number|string
 texts: string|Array<string>
 selectedDatas: ItreeData[]|IGridData[]
}
`},{name:'IBeforeChangeParam',type:'interface',code:`interface IBeforeChangeParam {
callback: () => void   // 回调函数，调用则继续本次变更
rollback: () => void   // 回滚函数，调用则阻止本次变更
newPage: number // 变更后所在页
newPageSize: number // 变更后分页大小
currentPage: number // 当前所在页
currentPageSize: number // 当前分页大小
}`},{name:'IResizeEvent',type:'interface',code:`
interface IResizeEvent {
  // 当前的全屏状态
  fullscreen: boolean
  // 弹窗的元素
  dialog: HTMLElement
}
      `},{name:'IData',type:'interface',code:`
interface IData {
  // 表格或者tree行数据
  [prop: string]: any
}
      `}]};