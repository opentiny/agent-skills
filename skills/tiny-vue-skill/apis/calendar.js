export default{mode:['pc'],apis:[{name:'calendar',type:'component',props:[{name:'events',typeAnchorName:'ICalendarEvent',type:'ICalendarEvent[]',defaultValue:'',desc:{'zh-CN':'事件列表'},mode:['pc'],pcDemo:'dynamic-add-schedule'},{name:'mode',type:'\'month\' | \'year\'',defaultValue:'\'month\'',desc:{'zh-CN':'日历显示模式'},mode:['pc'],pcDemo:'calendar-mode'},{name:'month',type:'number',defaultValue:'',desc:{'zh-CN':'指定月份\uFF0C默认当前月份'},mode:['pc'],pcDemo:'custom-day-cell'},{name:'show-selected',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否显示选中的日期'},mode:['pc'],pcDemo:'show-selected-date'},{name:'year',type:'number',defaultValue:'',desc:{'zh-CN':'指定年份\uFF0C默认当前年份'},mode:['pc'],pcDemo:'custom-day-cell'}],events:[],methods:[],slots:[{name:'day',defaultValue:'',desc:{'zh-CN':'日期单元格插槽'},mode:['pc'],pcDemo:'custom-day-cell'},{name:'tool',defaultValue:'',desc:{'zh-CN':'日历工具栏插槽'},mode:['pc'],pcDemo:'custom-calendar-toolbar'}]}],types:[{name:'ICalendarEvent',type:'interface',code:`
type ICalendarEventType = 'info' | 'warning' | 'error' | 'info' | 'success'

interface ICalendarEvent {
    time: number, // 指定需要展示事件的日期的时间戳
    title: string, // 指定事件标题
    content: string, // 指定事件的具体内容
    type: ICalendarEventType // 事件主题类型
}`}]};