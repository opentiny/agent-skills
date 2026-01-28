export default{mode:['pc','mobile-first'],apis:[{name:'button-group',type:'component',props:[{name:'data',typeAnchorName:'IButtonGroupData',type:'IButtonGroupData[]',defaultValue:'',desc:{'zh-CN':'按钮组数据'},mode:['pc','mobile-first'],pcDemo:'basic-usage',mfDemo:''},{name:'disabled',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否被禁用按钮组'},mode:['pc','mobile-first'],pcDemo:'disabled',mfDemo:''},{name:'modelValue / v-model',type:'number | string',defaultValue:'',desc:{'zh-CN':'默认选中按钮的值'},mode:['pc'],pcDemo:'basic-usage'},{name:'plain',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否朴素按钮'},mode:['pc','mobile-first'],pcDemo:'plain',mfDemo:''},{name:'show-more',type:'number',defaultValue:'',desc:{'zh-CN':'当超过给定的按钮数量时显示更多按钮'},mode:['pc'],pcDemo:'show-more'},{name:'size',type:'\'medium\' | \'small\' | \'mini\'',defaultValue:'',desc:{'zh-CN':'按钮组尺寸大小'},mode:['pc','mobile-first'],pcDemo:'size',mfDemo:''},{name:'text-field',type:'string',defaultValue:'\'text\'',desc:{'zh-CN':'按钮显示文字的字段值'},mode:['pc','mobile-first'],pcDemo:'text-value-field',mfDemo:''},{name:'v-model',type:'Number / String',defaultValue:'',desc:{'zh-CN':'默认选中按钮的值'},mode:['mobile-first'],mfDemo:''},{name:'value-field',type:'string',defaultValue:'\'value\'',desc:{'zh-CN':'按钮选中值的字段值'},mode:['pc','mobile-first'],pcDemo:'text-value-field',mfDemo:''}],events:[{name:'change',type:'(value: string | number) => void',defaultValue:'',desc:{'zh-CN':'当选中按钮发生改变时触发'},mode:['pc'],pcDemo:'change-event'}],methods:[],slots:[{name:'default',type:'',defaultValue:'',desc:{'zh-CN':'默认插槽\uFF0C自定义按钮组内容'},mode:['pc','mobile-first'],pcDemo:'slot-default',mfDemo:''},{name:'empty',type:'',defaultValue:'',desc:{'zh-CN':'自定义数据为空时展示内容'},meta:{stable:'3.17.0'},mode:['pc'],pcDemo:'slot-empty'}]}],types:[{name:'IButtonGroupData',type:'interface',code:`
interface IButtonGroupData {
  text: string // 显示文本
  value: number | string // 选中的值
  disabled?: boolean // 是否禁用
  tip?: string // 按钮悬浮提示 v3.17.0版本增加此功能
  // 配置选块角标
  sup?: {
    text: string // 角标文本
    class?: string // 角标的自定义class
    slot?: string // 自定义插槽名称，提供后可在button-group内使用对应的插槽自定义角标内容
    icon?: Component // 传入图标组件
  }
}
`}]};