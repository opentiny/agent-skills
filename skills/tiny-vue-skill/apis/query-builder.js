export default{mode:['pc'],apis:[{name:'query-builder',type:'component',props:[{name:'showNewRule',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否显示新增条件'},mode:['pc'],pcDemo:'handle',mfDemo:''},{name:'showNewGroup',type:'boolean',defaultValue:'true',desc:{'zh-CN':'是否显示新增子条件组'},mode:['pc'],pcDemo:'handle',mfDemo:''},{name:'isRuleDisable',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否禁用新增条件'},mode:['pc'],pcDemo:'handle',mfDemo:''},{name:'isGroupDisable',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否禁用新增子条件组'},mode:['pc'],pcDemo:'handle',mfDemo:''},{name:'disabled',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否全部禁用'},mode:['pc'],pcDemo:'handle',mfDemo:''},{name:'ruleLimit',type:'number',defaultValue:'infinity',desc:{'zh-CN':'设置新增条件的最大数量'},mode:['pc'],pcDemo:'limit',mfDemo:''},{name:'groupLimit',type:'number',defaultValue:'infinity',desc:{'zh-CN':'设置新增子条件组的最大数量'},mode:['pc'],pcDemo:'limit',mfDemo:''},{name:'config',typeAnchorName:'IQueryBuilderConfig',type:'IQueryBuilderConfig',desc:{'zh-CN':'设置查询构建器的配置'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'autoSelectField',type:'boolean',defaultValue:'true',desc:{'zh-CN':'范围域是否会默认选择'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'autoSelectOperator',type:'boolean',defaultValue:'true',desc:{'zh-CN':'运算符是否会默认选择'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'parseNumbers',type:'boolean',defaultValue:'false',desc:{'zh-CN':'数字会被转化为 Number 类型'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'showCloneButtons',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否展示复制按钮\uFF0C即整条规则可以被复制'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'showCombinatorsBetweenRules',type:'boolean',defaultValue:'false',desc:{'zh-CN':'组合子数组统一修改\uFF0C且不再展示在连线上\uFF0C以下拉选择形式出现'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'showLockButtons',type:'boolean',defaultValue:'false',desc:{'zh-CN':'展示锁定按钮\uFF0C即整条规则可以被锁定'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'showNotToggle',type:'boolean',defaultValue:'false',desc:{'zh-CN':'展示 not 条件切换框'},mode:['pc'],pcDemo:'basic-usage',mfDemo:''},{name:'displayOnlyField',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否仅展示字段选择器功能'},mode:['pc'],pcDemo:'display-only-field',mfDemo:''},{name:'max-height',type:'number',desc:{'zh-CN':'设置组件最大高度'},mode:['pc'],pcDemo:'max-height',mfDemo:''},{name:'bindProps',type:'object',desc:{'zh-CN':'控制某一类组件的参数'},mode:['pc'],pcDemo:'sub-component-param',mfDemo:''},{name:'allowDelAll',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否允许删除所有规则'},mode:['pc'],pcDemo:'',mfDemo:''},{name:'fields',type:'Array',defaultValue:'[]',desc:{'zh-CN':'字段列表'},mode:['pc'],pcDemo:'tree-field',mfDemo:''},{name:'validateQuery',type:'boolean',defaultValue:'false',desc:{'zh-CN':'是否启用查询校验'},mode:['pc'],pcDemo:'advanced-mode',mfDemo:''},{name:'query',type:'IQueryBuilderQuery',typeAnchorName:'IQueryBuilderQuery',desc:{'zh-CN':'查询数据'},mode:['pc'],pcDemo:'display-only-field',mfDemo:''},{name:'on-query-change',type:'function',desc:{'zh-CN':'查询数据改变时触发方法'},mode:['pc'],pcDemo:'display-only-field',mfDemo:''}]}],types:[{name:'IQueryBuilderConfig',type:'type',code:`type IQueryBuilderConfig = {
  ruleLimit?: number;  // 设置新增条件的最大数量
  groupLimit?: number;  // 设置新增子条件组的最大数量
  showNewRule?: boolean;  // 是否显示新增条件
  showNewGroup?: boolean;  // 是否显示新增子条件组
  isRuleDisable?: boolean;  // 是否禁用新增条件
  isGroupDisable?: boolean;  // 是否禁用新增子条件组
  disabled?: boolean;  // 是否全部禁用
  autoSelectField?: boolean;  // 范围域是否会默认选择
  autoSelectOperator?: boolean;  // 运算符是否会默认选择
  parseNumbers?: boolean;  // 数字会被转化为 Number 类型
  showCloneButtons?: boolean;  // 是否展示复制按钮，即整条规则可以被复制
  showCombinatorsBetweenRules?: boolean;  // 组合子数组统一修改，且不再展示在连线上，以下拉选择形式出现
  showLockButtons?: boolean;  // 展示锁定按钮，即整条规则可以被锁定
  showNotToggle?: boolean;  // 展示 not 条件切换框
  displayOnlyField?: boolean;  // 是否仅展示字段选择器功能
  bindProps?: { // 控制某一类组件的参数
    [key: string]: any;
  };
  allowDelAll?: boolean;  // 是否允许删除所有规则
  fields?: Array<{
    name: string; // 格式化数据中的值（形参）
    label: string; // 范围域在规则生成器中对外展示名称
    operators: Record<string, any>[]; // 运算符自定义
    defaultValue?: boolean; // 值域的默认值
    validator?: (r: Record<string, any>) => boolean; // 校验规则
    inputType?: string; // 值域的数值类型
    valueEditorType?: string; // 值域编辑器的类型
    values?: Array<Record<string, any>>;
    valueSources?: string[];  // 值域类型可选择
    comparator?: string; //分组时的比较器
    groupNumber?: string; //分组的组别
  }>;  // 字段列表
  combinators?: Array<{
    name: string;
    label: string;
  }>;  // 组合子数组配置
  validateQuery?: boolean;  // 是否启用查询校验
}`},{name:'IQueryBuilderQuery',type:'type',code:`type IQueryBuilderQuery = {
      id?: string;
      combinator: string;
      not?: boolean;
      rules: Array<IQueryBuilderQuery | IQueryBuilderRule>;
    }
    
    type IQueryBuilderRule = {
      id?: string; // 规则 id
      field: string;  // 字段
      operator: string; // 运算符
      value: any;   // 值域
      valueSource?: string; // 值域类型
}
      `}]};