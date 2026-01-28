export default{mode:['pc','mobile-first'],apis:[{name:'virtual-tree',type:'component',props:[{name:'width',type:'string | number',defaultValue:'',desc:{'zh-CN':'虚拟滚动区域的宽度'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'height',type:'string | number',defaultValue:'',desc:{'zh-CN':'虚拟滚动区域的高度'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'row-buffer',type:'string | number',defaultValue:'200',desc:{'zh-CN':'虚拟滚动行缓冲区高度'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'column-buffer',type:'string | number',defaultValue:'200',desc:{'zh-CN':'虚拟滚动列缓冲区宽度'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'scrollbar-size',type:'string | number',defaultValue:'6',desc:{'zh-CN':'滚动条尺寸'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'columns',type:'Array<{string: any}>',defaultValue:'',desc:{'zh-CN':'所有的列'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'column-sizes',type:'Array<number | string>',defaultValue:'',desc:{'zh-CN':'每个列对应的宽度'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'rows',type:'Array<{string: any}>',defaultValue:'',desc:{'zh-CN':'所有的行'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'row-sizes',type:'Array<number | string>',defaultValue:'',desc:{'zh-CN':'每个行对应的高度'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'fixed-rows',type:'Array<{string: any}>',defaultValue:'',desc:{'zh-CN':'行固定配置'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'fixed-columns',type:'Array<{string: any}>',defaultValue:'',desc:{'zh-CN':'列固定配置'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'},{name:'span-config',type:'Array<{string: any}>',defaultValue:'',desc:{'zh-CN':'单元格合并配置'},mode:['pc','mobile-first'],pcDemo:'table',mfDemo:'table'}],methods:[{name:'refresh',type:'(arg: IRefreshArgs) => void',typeAnchorName:'IRefreshArgs',desc:{'zh-CN':'刷新虚拟滚动状态\u3002默认不保持之前的滚动位置\uFF0C可以通过参数控制'},mode:['pc'],pcDemo:'btn-events'}],events:[{name:'change',type:'(arg: IChangeArgs) => void',typeAnchorName:'IChangeArgs',desc:{'zh-CN':'在虚滚状态改变时抛出'},mode:['pc'],pcDemo:'btn-events'}],slots:[{name:'default',defaultValue:'',desc:{'zh-CN':'默认插槽'},mode:['pc'],pcDemo:'table'}]}],types:[{name:'IChangeArgs',type:'interface',code:`
interface IChangeArgs { 
viewRows: Array<{string:any}>
viewCols: Array<{string:any}>
isScrollX: boolean
isScrollY: boolean
isTop: boolean
isBottom: boolean
isLeft: boolean
isRight: boolean 
}`},{name:'IRefreshArgs',type:'interface',code:`
interface IRefreshArgs { 
isKeepScrollTop: boolean
isKeepScrollLeft: boolean 
}`}]};