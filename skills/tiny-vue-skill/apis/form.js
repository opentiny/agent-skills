export default{mode:['pc','mobile-first'],apis:[{name:'form',type:'component',props:[{name:'disabled',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否禁用该表单内的所有表单组件\uFF0C若设置为 true\uFF0C则表单内组件上的 disabled 属性不再生效'},mode:['pc','mobile-first'],pcDemo:'form-disabled',mfDemo:''},{name:'display-only',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否开启仅展示模式'},mode:['pc','mobile-first'],pcDemo:'display-only',mfDemo:'form-display-only'},{name:'form-item',type:'Object',defaultValue:'',desc:{'zh-CN':'Form 下的 FormItem 组件,请参看 FormItem 的属性配置 Aurora.Widget.Form.FormItem '},mode:['mobile-first'],mfDemo:''},{name:'hide-required-asterisk',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否隐藏必填字段的标签旁边的红色星号'},mode:['pc','mobile-first'],pcDemo:'smb-required',mfDemo:''},{name:'inline',type:'boolean',defaultValue:'false',desc:{'zh-CN':'行内布局模式'},mode:['pc','mobile-first'],pcDemo:'form-in-row',mfDemo:''},{name:'inline-message',type:'boolean',defaultValue:'',desc:{'zh-CN':'当 validate-type 设置为 text 时\uFF0C是否以行内形式展示校验信息(推荐使用 message-type 设置)'},mode:['pc'],pcDemo:''},{name:'label-align',type:'boolean',defaultValue:'false',desc:{'zh-CN':'当出现必填星号时\uFF0C标签文本是否对齐\uFF0C当 label-position 为 \'right\' 时有效'},mode:['pc'],pcDemo:'label-align'},{name:'label-position',type:'\'right\' | \'left\' | \'top\'',defaultValue:'\'right\'',desc:{'zh-CN':'表单中标签的布局位置'},mode:['pc','mobile-first'],pcDemo:'label-position',mfDemo:''},{name:'label-suffix',type:'string',defaultValue:'',desc:{'zh-CN':'表单中标签后缀'},mode:['pc','mobile-first'],pcDemo:'form-in-row',mfDemo:''},{name:'label-width',type:'string',defaultValue:'\'84px\'',desc:{'zh-CN':'表单中标签占位宽度'},mode:['pc','mobile-first'],pcDemo:'label-position',mfDemo:''},{name:'message-type',type:'\'inline\' | \'block\' | \'absolute\'',defaultValue:'\'block\'',desc:{'zh-CN':'当 validate-type 设置为 text 时\uFF0C配置文本类型错误类型\uFF0C可配置行内或者块级\uFF0C其他值都为 absolute 定位'},mode:['pc'],pcDemo:'message-type'},{name:'model',type:'{ [prop: string]: any }',defaultValue:'',desc:{'zh-CN':'表单数据对象'},mode:['pc','mobile-first'],pcDemo:'form-validation',mfDemo:''},{name:'overflow-title',type:'boolean',defaultValue:'false',meta:{stable:'3.15.0'},desc:{'zh-CN':'标签超长是否显示提示'},mode:['pc','mobile-first'],pcDemo:'overflow-title',mfDemo:''},{name:'popper-options',linkTo:'popover#IPopperOption',type:'Popover.IPopperOption',defaultValue:'',desc:{'zh-CN':'校验错误提示配置\uFF0C透传至 Popover 组件'},mode:['pc'],pcDemo:'popper-options'},{name:'rules',typeAnchorName:'IFormRules',type:'{ [prop: string]: IFormRules | IFormRules[]  }',defaultValue:'',desc:{'zh-CN':'表单验证规则'},mode:['pc','mobile-first'],pcDemo:'form-validation',mfDemo:''},{name:'show-message',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否显示校验错误信息'},mode:['pc','mobile-first'],pcDemo:'novalid-tip',mfDemo:''},{name:'size',type:'\'medium\' | \'small\' | \'mini\'',defaultValue:'',desc:{'zh-CN':'表单内组件的尺寸\uFF0C不设置则为默认尺寸'},mode:['pc'],pcDemo:'size'},{name:'validate-on-rule-change',type:'boolean | "deep"',defaultValue:'true',desc:{'zh-CN':'是否在 rules 属性改变后立即触发一次验证\uFF08"deep"选项新增于3.21.0\uFF09'},mode:['pc','mobile-first'],pcDemo:'custom-validation-rule',mfDemo:''},{name:'validate-position',typeAnchorName:'IFormPosition',type:'IFormPosition',defaultValue:'\'right\'',desc:{'zh-CN':'指定校验提示框显示的位置'},mode:['pc'],pcDemo:'validation-position'},{name:'validate-tag',type:'boolean',defaultValue:'',desc:{'zh-CN':'vue2下面原生html标签支持显示tooltip校验提示信息'},mode:['mobile-first'],mfDemo:''},{name:'validate-type',type:'\'tip\' | \'text\'',defaultValue:'\'tip\'',desc:{'zh-CN':'校验类型'},mode:['pc'],pcDemo:'validate-type'}],events:[{name:'validate',type:'(prop: string, isValid: boolean, message: string) => void',defaultValue:'',desc:{'zh-CN':'任一表单项被校验后触发'},mode:['pc','mobile-first'],pcDemo:'events',mfDemo:''}],methods:[{name:'clearValidate',type:'(prop: string | string[]) => void',defaultValue:'',desc:{'zh-CN':'移除表单项的校验结果\uFF0C可传入待移除的表单项的 prop \uFF0C或者 prop 组成的数组\uFF0C如不传则移除整个表单的校验结果'},mode:['pc','mobile-first'],pcDemo:'form-validate-field',mfDemo:''},{name:'resetFields',type:'() => void',defaultValue:'',desc:{'zh-CN':'对整个表单进行重置\uFF0C将所有字段值重置为初始值并移除校验结果'},mode:['pc','mobile-first'],pcDemo:'form-validation',mfDemo:''},{name:'validate',typeAnchorName:'IFormValidateMethod',type:'IFormValidateMethod',defaultValue:'',desc:{'zh-CN':'对整个表单进行校验的方法\uFF0C参数为一个回调函数\uFF08该回调函数会在校验结束后被调用\uFF0C并传入两个参数\uFF1A1\u3001是否校验成功 2\u3001未通过校验的字段\uFF09返回一个 promise'},mode:['pc','mobile-first'],pcDemo:'form-validation',mfDemo:''},{name:'validateField',typeAnchorName:'IFormValidateFieldMethod',type:'IFormValidateFieldMethod',defaultValue:'',desc:{'zh-CN':'对部分表单字段进行校验的方法, 第一个参数为单个 prop 或者 prop 数组\uFF0C第二个参数是回调函数\uFF0C每个表单项检验完后会依次调用该回调'},mode:['pc','mobile-first'],pcDemo:'form-validate-field',mfDemo:''}],slots:[{name:'default',type:'',defaultValue:'',desc:{'zh-CN':'默认插槽\uFF0C自定义表单内容'},mode:['pc','mobile-first'],pcDemo:'basic-usage',mfDemo:''},{name:'label',type:'',defaultValue:'',desc:{'zh-CN':'标签文本插槽'},mode:['mobile-first'],mfDemo:''}]},{name:'form-item',type:'component',props:[{name:'error',type:'string',defaultValue:'',desc:{'zh-CN':'表单项错误文本\uFF0C设置该值会使表单验证状态变为 error'},mode:['pc'],pcDemo:''},{name:'extra',type:'string',defaultValue:'',desc:{'zh-CN':'表单项额外提示'},mode:['pc'],pcDemo:'extra-tip'},{name:'inline-message',type:'boolean',defaultValue:'',desc:{'zh-CN':'是否以行内形式展示校验信息(推荐使用 message-type 设置)'},mode:['pc'],pcDemo:''},{name:'label',type:'string',defaultValue:'',desc:{'zh-CN':'标签文本'},mode:['pc'],pcDemo:'form-validation'},{name:'label-width',type:'string',defaultValue:'\'80px\'',desc:{'zh-CN':'表单域标签的的宽度'},mode:['pc'],pcDemo:'basic-usage'},{name:'message-type',type:'\'inline\' | \'block\'',defaultValue:'',desc:{'zh-CN':'配置文本类型错误类型\uFF0C可配置行内或者块级\uFF0C不配置则为 absolute 定位'},mode:['pc'],pcDemo:'message-type'},{name:'prop',type:'string',defaultValue:'',desc:{'zh-CN':'对应表单域 model 字段\uFF0C如需使用表单校验\uFF0C该属性是必填的'},mode:['pc'],pcDemo:'form-validation'},{name:'required',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否必填\uFF0C如不设置\uFF0C则会根据校验规则自动生成'},mode:['pc'],pcDemo:'form-validation'},{name:'rules',typeAnchorName:'IFormRules',type:'IFormRules',defaultValue:'',desc:{'zh-CN':'表单项验证规则'},mode:['pc'],pcDemo:'form-validation'},{name:'show-message',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否显示校验错误信息'},mode:['pc'],pcDemo:'novalid-tip'},{name:'size',type:'\'medium\' | \'small\' | \'mini\'',defaultValue:'',desc:{'zh-CN':'用于控制该表单域下组件的尺寸\uFF0C不设置则为默认尺寸'},mode:['pc'],pcDemo:'size'},{name:'validate-debounce',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否开启校验防抖\uFF0C在连续输入的情况下\uFF0C会在最后一次输入结束时才开始校验'},mode:['pc'],pcDemo:'validate-debounce'},{name:'validate-icon',type:'Component',defaultValue:'',desc:{'zh-CN':'校验提示框的图标\uFF0C类型为组件'},mode:['pc'],pcDemo:'form-validation'},{name:'validate-position',typeAnchorName:'IFormPosition',type:'IFormPosition',defaultValue:'\'top-end\'',desc:{'zh-CN':'指定校验提示框显示的位置'},mode:['pc'],pcDemo:'validation-position'},{name:'validate-type',type:'\'text\' | \'tip\'',defaultValue:'\'tip\'',desc:{'zh-CN':'校验提示显示类型'},mode:['pc'],pcDemo:'validate-type'}],events:[],methods:[{name:'clearValidate',type:'() => void',defaultValue:'',desc:{'zh-CN':'移除该表单项的校验结果'},mode:['pc'],pcDemo:'form-validation'},{name:'resetField',type:'() => void',defaultValue:'',desc:{'zh-CN':'对该表单项进行重置\uFF0C将其值重置为初始值并移除校验结果'},mode:['pc'],pcDemo:'form-validate-field'}],slots:[{name:'default',defaultValue:'',desc:{'zh-CN':'默认插槽'},mode:['pc'],pcDemo:'size'},{name:'label',defaultValue:'',desc:{'zh-CN':'标签文本的内容'},mode:['pc'],pcDemo:'slot-label'},{name:'label-line',defaultValue:2,type:'number',desc:{'zh-CN':'标签文本显示的行数'},mode:['mobile-first'],pcDemo:'slot-label'},{name:'error',defaultValue:'',desc:{'zh-CN':'错误提示内容'},mode:['pc'],pcDemo:'error-label'},{name:'prompt',defaultValue:'',desc:{'zh-CN':'强提示插槽'},mode:['mobile-first'],mfDemo:'prompt-slot'}]}],types:[{name:'IFormPosition',type:'type',code:`
type IFormPosition = 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end'`},{name:'IFormRules',type:'interface',code:`
// 表单项检验触发时机
type IFormTrigger = 'change' | 'blur'

interface IFormRules {
  required?: boolean // 是否必填
  message?: string // 校验错误的提示
  // 内置的类型校验
  type?: 'date' | 'dateTime' | 'float' | 'array' | 'string' | 'number' | 'url' | 'time' | 'email' | 'object' | 'boolean' | 'enum'
  // 校验触发时机， 默认为 ['change', 'blur'] 两种场景都触发，如果仅在主动调用校验方式时触发，可设置为空数组 []。
  trigger?: IFormTrigger | IFormTrigger[] 
  // 同步检验函数，调用回调传递错误信息。
  validator?: (
    rule: IFormInnerRule, // form内部处理后的rule
    value: any, // 表单model对应的值，根据表单项prop获取
    callback: (e: Error) => void
    data: object, // prop和value构造的对象
    options: object // 检验配置，一般不需要用到
  ) => void
  // 异步校验函数，resolve则表示校验成功，reject表示校验失败。
  asyncValidator?: (
    rule: IFormInnerRule,
    value: any,
    callback: (e: Error) => void
    data: object,
    options: object
  ) => Promise<any>
}

interface IFormInnerRule {
  field: string // 表单项prop
  fullField: string // 表单项完整prop（嵌套检验时有用）
  type: string // 内部使用
}
`},{name:'IFormError',type:'interface',code:`
// 校验错误返回对象
interface IFormError {
  [prop: string]: IFormErrorField[]
}
interface IFormErrorField {
  message: string // 校验错误提示
  field: string // 校验失败的prop
}
`},{name:'IFormValidateMethod',type:'function',depTypes:['IFormError'],code:`
function IFormValidateMethod(callback: (isValid: boolean, fields: IFormError) => void ): Promise<boolean>
`},{name:'IFormValidateFieldMethod',type:'function',depTypes:['IFormError'],code:`
function IFormValidateFieldMethod(
  prop: string | string[],
  callback: (msg: string, field: IFormError) => void
): void
`}]};