export default{column:'2',owner:'',demos:[{'demoId':'amap-base','name':{'zh-CN':'基本用法','en-US':'Basic Usage'},'desc':{'zh-CN':'<p>可以流畅的运行在 PC 和移动设备上\uFF0C兼容当前绝大部分浏览器\uFF08IE 9/10/11\uFF0CChrome\uFF0CFirefox\uFF0CSafari 等\uFF09底层依赖轻量级的 Canvas 类库 ZRender\uFF0C提供直观\uFF0C生动\uFF0C可交互\uFF0C可高度个性化定制的数据可视化图表\u3002 \n</p>\n','en-US':'<p> can run smoothly on PCs and mobile devices and is compatible with most browsers. (Internet Explorer 9/10/11, Chrome, Firefox, Safari, etc.) The bottom layer relies on the lightweight Canvas class library ZRender to provide intuitive, vivid, interactive, and highly personalized data visualization charts. AutoNavi Map requires the access permission from the external network. \n</p>\n'},'codeFiles':['amap/base.vue']}],apis:[{'name':'chart-autonavi-map','type':'component','props':[],'events':[],'slots':[]}],types:[{name:'IChartSettings',type:'interface',code:`
interface IChartSettings {
  amap: object // 高德地图配置项，参考高德地图文档配置
  key: string // 高德地图 access_key 
  useOuterMap: boolean // 使用全局的地图依赖
  v: string // 高德地图版本，默认 1.4.3
}
`}]};