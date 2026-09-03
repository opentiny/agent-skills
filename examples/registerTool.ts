import { onMounted, onUnmounted } from 'vue'

type OrderQueryInput = {
  orderId?: string
  customerName?: string
  status?: OrderItem['status']
}

const abortController = new AbortController()

onMounted(() => {
  const modelContext = (document as any).modelContext
  if (!modelContext?.registerTool) return

  modelContext.registerTool(
    {
      name: 'order_query',
      description: '查询订单列表，可按订单号、客户姓名或状态筛选；不传参数时返回全部订单。',
      inputSchema: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: '订单号，如 ORD-5X9A2B',
          },
          customerName: {
            type: 'string',
            description: '客户姓名，支持模糊匹配',
          },
          status: {
            type: 'string',
            enum: ['Pending', 'Shipped', 'Delivered', 'Refunded', 'Cancelled'],
            description: '订单状态',
          },
        },
      },
      execute: async ({ orderId, customerName, status }: OrderQueryInput) => {
        const normalizedOrderId = orderId?.trim().toLowerCase()
        const normalizedCustomerName = customerName?.trim().toLowerCase()

        const result = orderList.value.filter((order) => {
          const matchesOrderId = !normalizedOrderId || order.id.toLowerCase().includes(normalizedOrderId)
          const matchesCustomerName =
            !normalizedCustomerName || order.customerName.toLowerCase().includes(normalizedCustomerName)
          const matchesStatus = !status || order.status === status

          return matchesOrderId && matchesCustomerName && matchesStatus
        })

        filterStatus.value = status ?? ''
        searchText.value = orderId?.trim() || customerName?.trim() || ''

        const text =
          result.length === 0
            ? '未找到符合条件的订单。'
            : `找到 ${result.length} 条订单：\n${result
                .map(
                  (order) =>
                    `- ${order.id}｜${order.customerName}｜${order.productName}｜¥${order.totalAmount.toLocaleString()}｜${statusLabelMap[order.status]}`,
                )
                .join('\n')}`

        return {
          content: [{ type: 'text', text }],
        }
      },
    },
    { signal: abortController.signal },
  )

  modelContext.registerTool(
    {
      name: 'order_detail',
      description: '根据完整订单号查询订单详情，包括客户、商品、金额、支付方式、状态和时间。',
      inputSchema: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: '完整订单号，如 ORD-5X9A2B',
          },
        },
        required: ['orderId'],
      },
      execute: async ({ orderId }: { orderId: string }) => {
        const normalizedOrderId = orderId.trim().toUpperCase()
        const order = orderList.value.find((item) => item.id.toUpperCase() === normalizedOrderId)

        filterStatus.value = ''
        searchText.value = order?.id ?? orderId.trim()

        if (!order) {
          return {
            content: [{ type: 'text', text: `未找到订单号为 ${orderId} 的订单。` }],
          }
        }

        const text = `订单详情（${order.id}）：
- 客户：${order.customerName}
- 联系电话：${order.customerPhone}
- 商品：${order.productName}
- 数量：${order.quantity}
- 单价：¥${order.unitPrice.toLocaleString()}
- 总金额：¥${order.totalAmount.toLocaleString()}
- 支付方式：${order.paymentMethod}
- 状态：${statusLabelMap[order.status]}
- 下单时间：${order.createdAt}${order.shippedAt ? `\n- 发货时间：${order.shippedAt}` : ''}`

        return {
          content: [{ type: 'text', text }],
        }
      },
    },
    { signal: abortController.signal },
  )
})

onUnmounted(() => {
  abortController.abort()
})
