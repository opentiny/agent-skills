export default{mode:['pc'],apis:[{name:'wizard',type:'component',props:[{name:'data',typeAnchorName:'IDataItem',type:'IDataItem[]',defaultValue:'',desc:{'zh-CN':'设置节点数据'},mode:['pc'],pcDemo:'basic-usage'},{name:'page-guide',type:'boolean',defaultValue:'false',desc:{'zh-CN':'设置页向导模式'},mode:['pc'],pcDemo:'page-guide'},{name:'time-line-flow',type:'boolean',defaultValue:'false',desc:{'zh-CN':'设置时间线'},mode:['pc'],pcDemo:'time-line-flow'},{name:'vertical',type:'boolean',defaultValue:'false',desc:{'zh-CN':'设置为垂直模式'},mode:['pc'],pcDemo:'vertical'}],events:[{name:'btn-next',typeAnchorName:'IDataItem',type:'(datas: IDataItem[]) => void',desc:{'zh-CN':'页向导模式下\uFF0C点击\u201C下一步\u201D按钮触发的回调事件'},mode:['pc'],pcDemo:'btn-events'},{name:'btn-prev',typeAnchorName:'IDataItem',type:'(datas: IDataItem[]) => void',desc:{'zh-CN':'页向导模式下\uFF0C点击\u201C上一步\u201D按钮触发的回调事件'},mode:['pc'],pcDemo:'btn-events'},{name:'btn-save',typeAnchorName:'IDataItem',type:'(datas: IDataItem[]) => void',desc:{'zh-CN':'页向导模式下\uFF0C点击\u201C保存\u201D按钮触发的回调事件'},mode:['pc'],pcDemo:'btn-events'},{name:'btn-submit',typeAnchorName:'IDataItem',type:'(datas: IDataItem[]) => void',desc:{'zh-CN':'页向导模式下\uFF0C点击\u201C下一步\u201D导致最后一个节点的状态为 "doing" 时\uFF0C点击\u201C提交\u201D按钮触发的回调事件'},mode:['pc'],pcDemo:'btn-events'},{name:'node-click',typeAnchorName:'IDataItem',type:'(node: IDataItem, index: number, event: Event) => void',desc:{'zh-CN':'节点点击事件'},mode:['pc'],pcDemo:'basic-usage'}],methods:[],slots:[{name:'base',defaultValue:'',desc:{'zh-CN':'基本插槽'},mode:['pc'],pcDemo:'slot-base'},{name:'stepbutton',defaultValue:'',desc:{'zh-CN':'页向导模式按钮插槽'},mode:['pc'],pcDemo:'slot-step-button'}]}],types:[{name:'IDataItem',type:'interface',code:`
interface IDataItem {
  name: string
  status: string
  showNode?: boolean
  content?: string
  imgUrl?: string
  users?: string
  userName?: string
  roleNumber?: string
  date?: string
  values?: IDataItemValuesItem[]
}

interface IDataItemValuesItem {
  text: string
  value: string
}`}]};