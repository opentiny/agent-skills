export default{mode:['pc'],apis:[{name:'nav-menu',type:'component',props:[{name:'before-skip',typeAnchorName:'IMenuItem',type:'(item: IMenuItem) => boolean',defaultValue:'',desc:{'zh-CN':'点击菜单跳转前的钩子函数\uFF0C返回 false 将无法跳转'},mode:['pc'],pcDemo:'before-skip'},{name:'data',typeAnchorName:'IDataItem',type:'IDataItem[]',defaultValue:'',desc:{'zh-CN':'设置导航菜单的数据'},mode:['pc'],pcDemo:'basic-usage'},{name:'fetch-menu-data',typeAnchorName:'IMenuItem',type:'() => IDataItem[]',defaultValue:'',desc:{'zh-CN':'自定义菜单数据加载服务\uFF0C返回一个Promise对象'},mode:['pc'],pcDemo:'custom-service'},{name:'fields',typeAnchorName:'IFields',type:'IFields',defaultValue:'{ textField: "title", urlField: "url", key: "id" }',desc:{'zh-CN':'自定义菜单数据的映射'},mode:['pc'],pcDemo:'custom-service'},{name:'overflow',typeAnchorName:'IOverflow',type:'IOverflow',defaultValue:'auto',desc:{'zh-CN':'设置一级菜单无法在当前菜单容器里显示完全时的展示方式'},mode:['pc'],pcDemo:'overflow'},{name:'prevent',type:'boolean',defaultValue:'false',desc:{'zh-CN':'若使用组件的默认服务获取菜单数据\uFF0C并且要阻止默认的跳转行为\uFF0C需要 before-skip 和此属性一起使用'},mode:['pc'],pcDemo:'before-skip-prevent'},{name:'parent-key',type:'string',defaultValue:'undefined',desc:{'zh-CN':'设置父级菜单的标识字段'},mode:['pc'],pcDemo:'parent-key'},{name:'default-active',type:'string',defaultValue:'',desc:{'zh-CN':'自定义当前选中的菜单\uFF0Cdata数据中必须设置id'},mode:['pc'],pcDemo:'selecte',meta:{stable:'3.21.0'}}],events:[],methods:[],slots:[{name:'logo',defaultValue:'',desc:{'zh-CN':'菜单栏 Logo 插槽'},mode:['pc'],pcDemo:'slot-logo'},{name:'toolbar',defaultValue:'',desc:{'zh-CN':'自定义右上角部分 toolbar 插槽'},mode:['pc'],pcDemo:'slot-toolbar'}]}],types:[{name:'IMenuItem',type:'interface',code:`
interface IMenuItem {
  id: string
  isFullUrl: boolean
  pid: string
  route: string
  target: string
  title: string
  url: string
}`},{name:'IDataItem',type:'interface',code:`
interface IDataItem {
  title: string
  url: string
  children?: IDataItem[]
}`},{name:'IFields',type:'interface',code:`
interface IFields {
  textField: string
  urlField: string
  key?: string
}`},{name:'IOverflow',type:'type',code:`
type IOverflow = 'auto' | 'retract' | 'fixed' | 'hidden'
`}]};