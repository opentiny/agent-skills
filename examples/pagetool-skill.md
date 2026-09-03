## PageTool 页面目标

- `orders-page`：订单管理页面；允许动作：`query`。
- `orders-list`：订单列表；允许动作：`navigation`，仅用于滚动定位。
- `orders-navigation`：左侧“订单管理”导航；允许动作：`navigation`，仅用于进入订单页面。

## PageTool 与业务工具边界

- PageTool 只用于上述页面目标的查询、滚动和导航。
- 查询订单数据并在页面中定位订单时，使用 `order_query` 或 `order_detail`，不使用 PageTool 读取订单数据或操作搜索框。

## PageTool 禁止操作

- 不操作未在“PageTool 页面目标”中声明的元素。
- 不使用 `fill`、`select` 或 `executeJavascript`。
- 不使用 PageTool 提交、删除、发布、支付或执行其他副作用。
