export default{mode:['pc'],apis:[{name:'breadcrumb',type:'component',props:[{name:'options',typeAnchorName:'IOptionsItem',type:'IOptionsItem[]',defaultValue:'',desc:{'zh-CN':'单独使用 Breadcrumb\uFF0C通过 option 配置生成面包屑'},mode:['pc'],pcDemo:'options'},{name:'separator',type:'string',defaultValue:'>',desc:{'zh-CN':'分隔符'},mode:['pc'],pcDemo:'separator'},{name:'separator-icon',type:'vueComponent',defaultValue:'',desc:{'zh-CN':'图标分隔符'},mode:['pc'],pcDemo:'separator'},{name:'size',type:'\'medium\'',defaultValue:'\'medium\'',desc:{'zh-CN':'设置面包屑尺寸大小'},mode:['pc'],pcDemo:'size'},{name:'text-field',type:'string',defaultValue:'label',desc:{'zh-CN':'指定面包屑的显示键值\uFF0C结合 options 使用'},mode:['pc'],pcDemo:'options'}],events:[{name:'select',typeAnchorName:'ISelectValue',type:'(value: ISelectValue) => void',defaultValue:'',desc:{'zh-CN':'点击 BreadcrumbItem 时触发'},mode:['pc'],pcDemo:'options'}],methods:[],slots:[]},{name:'breadcrumb-item',type:'component',props:[{name:'label',type:'string',defaultValue:'',desc:{'zh-CN':'定义面包屑的显示文本'},mode:['pc'],pcDemo:'base'},{name:'replace',type:'boolean',defaultValue:'false',desc:{'zh-CN':'在使用 to 进行路由跳转时\uFF0C启用 replace 将不会向 浏览器历史记录 history 里添加新记录'},mode:['pc'],pcDemo:'slot-default'},{name:'size',type:'\'medium\'',defaultValue:'\'medium\'',desc:{'zh-CN':'设置面包屑尺寸大小'},mode:['pc'],pcDemo:'size'},{name:'to',typeAnchorName:'IOptionsItemTo',type:'string | IOptionsItemTo',defaultValue:'',desc:{'zh-CN':'路由跳转对象\uFF0C同 vue-router 的 to'},mode:['pc'],pcDemo:'slot-default'}],events:[{name:'select',typeAnchorName:'ISelectValue',type:'(value: ISelectValue) => void',defaultValue:'',desc:{'zh-CN':'点击 BreadcrumbItem 时触发'},mode:['pc'],pcDemo:'base'}],methods:[],slots:[{name:'default',defaultValue:'',desc:{'zh-CN':'默认插槽'},mode:['pc'],pcDemo:'slot-default'}]}],types:[{name:'IOptionsItemTo',type:'interface',code:`
interface IOptionsItemTo {
  path: string
}`},{name:'IOptionsItem',type:'interface',depTypes:['IOptionsItemTo'],code:`
interface IOptionsItem {
  label?: string
  to?: IOptionsItemTo
  replace?: boolean
  [customProp: string]: string
}`},{name:'ISelectValue',type:'interface',depTypes:['IOptionsItem','IOptionsItemTo'],code:`
interface ISelectValue {
  event: Event
  link: HTMLElement
  option: IOptionsItem
  replace: boolean
  to?: IOptionsItemTo
}`}]};