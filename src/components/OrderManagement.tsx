import { Search, ChevronRight, X, Package, Truck, CheckCircle, AlertCircle, Download, Upload, FileText, Check, Info, Image, Wrench } from "lucide-react";
import { useState } from "react";
import { workOrderStore } from '../lib/workOrderStore';

const INITIAL_ORDERS = [
  // --- 待付款 (pending_payment) ---
  {
    id: 'ORD-2024-0816-NEW', type: 'retail', date: '2024-08-16 09:30', brand: 'Chanel', productName: 'Chanel Classic Flap', spuCount: 1, itemCount: 1,
    manager: '张三 (M001)', distributor: null,
    buyerName: '周八', buyerPhone: '136****5555', buyerType: '个人买家', deliveryMethod: '跨境快递', warehouse: '香港直邮仓', shippingAddress: '上海市黄浦区...',
    totalPrice: 65000, depositPaid: null, status: 'pending_payment', statusLabel: '待付款',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-new', name: 'Chanel Classic Flap', sku: 'CH-CF-BLK', productNumber: 'CH-CF', supplier: '自营库存', count: 1, price: 65000, status: 'pending_payment', statusLabel: '待付款' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-16 09:30', description: '买家下单，等待付款', items: '全部 (1件)', amountChange: '-' }
    ]
  },

  // --- 待确认 (pending_confirmation) ---
  {
    id: 'ORD-2024-0815-A1', type: 'retail', date: '2024-08-15 10:20', brand: 'Hermès', productName: 'Hermès Birkin 25', spuCount: 1, itemCount: 1,
    manager: '张三 (M001)', distributor: null,
    buyerName: '李四', buyerPhone: '139****5678', buyerType: '个人买家', deliveryMethod: '跨境快递', warehouse: '香港直邮仓', shippingAddress: '香港特别行政区中环...',
    totalPrice: 156000, depositPaid: null, status: 'pending_confirmation', statusLabel: '待确认',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-1', name: 'Hermès Birkin 25', sku: 'H-B25-GOLD', productNumber: 'H-B25', supplier: '自营库存', count: 1, price: 156000, status: 'pending_confirmation', statusLabel: '待确认' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-15 10:25', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥156,000' },
      { id: 'p2', time: '2024-08-15 10:25', description: '下游订单生成，等待确认库存', items: '全部 (1件)', amountChange: '-' }
    ]
  },

  // --- 待发货 (pending_shipment) ---
  {
    id: 'ORD-2024-0814-B1', type: 'retail', date: '2024-08-14 14:20', brand: 'Christian Louboutin', productName: 'Oversized Sneaker', spuCount: 1, itemCount: 2,
    manager: '张三 (M001)', distributor: null,
    buyerName: '陈七', buyerPhone: '136****3456', buyerType: '个人买家', deliveryMethod: '跨境快递', warehouse: '香港直邮仓', shippingAddress: '上海市徐汇区...',
    totalPrice: 9000, depositPaid: null, status: 'pending_shipment', statusLabel: '待发货',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-4', name: 'Oversized Sneaker (35码)', sku: 'CL-OS-35', productNumber: '553680WHGP5', supplier: '自营库存', count: 1, price: 4500, status: 'pending_shipment', statusLabel: '待发货' },
      { id: 'item-5', name: 'Oversized Sneaker (36码)', sku: 'CL-OS-36', productNumber: '553680WHGP5', supplier: '自营库存', count: 1, price: 4500, status: 'pending_shipment', statusLabel: '待发货' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-14 14:25', description: '买家付款成功', items: '全部 (2件)', amountChange: '+¥9,000' }
    ]
  },

  // --- 已发货 (shipped) ---
  {
    id: 'ORD-2024-0813-C1', type: 'retail', date: '2024-08-13 09:15', brand: 'Patek Philippe', productName: 'Nautilus 5711', spuCount: 2, itemCount: 2,
    manager: null, distributor: '李四代购',
    buyerName: '吴十', buyerPhone: '133****5678', buyerType: 'VIP买家', deliveryMethod: '门店自提', warehouse: '深圳保税仓', shippingAddress: '深圳市南山区...',
    totalPrice: 950000, depositPaid: null, status: 'shipped', statusLabel: '已发货',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-7', name: 'Nautilus 5711', sku: 'PP-5711-1A', productNumber: '5711/1A-010', supplier: '自营库存', count: 1, price: 850000, status: 'shipped', statusLabel: '已发货' },
      { id: 'item-8', name: 'Aquanaut 5167', sku: 'PP-5167-1A', productNumber: '5167A-001', supplier: '自营库存', count: 1, price: 100000, status: 'shipped', statusLabel: '已发货' }
    ],
    shipments: [
      { id: 'PKG-001', company: '顺丰速运', trackingNumber: 'SF1029384756', contents: 'Nautilus 5711 (1件)' },
      { id: 'PKG-002', company: '顺丰速运', trackingNumber: 'SF1029384757', contents: 'Aquanaut 5167 (1件)' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-13 09:20', description: '买家付款成功', items: '全部 (2件)', amountChange: '+¥950,000' },
      { id: 'p2', time: '2024-08-13 14:00', description: '商品发货', items: '全部 (2件)', amountChange: '-' }
    ]
  },

  // --- 已完成 (completed) ---
  {
    id: 'ORD-2024-0810-D1', type: 'retail', date: '2024-08-10 16:45', brand: 'Bottega Veneta', productName: 'BV Jodie', spuCount: 1, itemCount: 1,
    manager: '赵六 (M003)', distributor: null,
    buyerName: '冯三', buyerPhone: '130****7890', buyerType: '个人买家', deliveryMethod: '非跨境快递', warehouse: '上海寄售仓', shippingAddress: '南京市建邺区...',
    totalPrice: 19500, depositPaid: null, status: 'completed', statusLabel: '已完成',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-10', name: 'BV Jodie', sku: 'BV-JD-MINI', productNumber: '651876VCPP5', supplier: '自营库存', count: 1, price: 19500, status: 'completed', statusLabel: '已完成' }],
    progress: [
      { id: 'p1', time: '2024-08-10 16:50', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥19,500' },
      { id: 'p2', time: '2024-08-11 09:00', description: '商品发货', items: 'BV Jodie', amountChange: '-' },
      { id: 'p3', time: '2024-08-13 10:00', description: '买家确认收货', items: '全部 (1件)', amountChange: '-' }
    ]
  },

  // --- 售后处理 (after_sales) ---
  {
    id: 'ORD-AS-1001', type: 'retail', date: '2024-08-16 10:00', brand: 'Gucci', productName: 'GG Marmont', spuCount: 1, itemCount: 1,
    manager: '张三 (M001)', distributor: null,
    buyerName: '周婷', buyerPhone: '136****5555', buyerType: '个人买家', deliveryMethod: '跨境快递', warehouse: '香港直邮仓', shippingAddress: '上海市黄浦区...',
    totalPrice: 18000, depositPaid: null, status: 'after_sales', statusLabel: '待销售审批',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-as-1', name: 'GG Marmont', sku: 'GG-MM-BLK', productNumber: 'GG-MM', supplier: '自营库存', count: 1, price: 18000, status: 'after_sales', statusLabel: '待销售审批' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-15 09:30', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥18,000' },
      { id: 'p2', time: '2024-08-15 14:00', description: '商品发货', items: '全部 (1件)', amountChange: '-' },
      { id: 'p3', time: '2024-08-16 09:30', description: '申请售后 - 退货退款', items: '全部 (1件)', amountChange: '-' },
      { id: 'p4', time: '2024-08-16 10:00', description: '进入售后流程：待销售审批', items: '-', amountChange: '-' }
    ]
  },
  {
    id: 'ORD-AS-1002', type: 'retail', date: '2024-08-15 11:00', brand: 'Dior', productName: 'Saddle Bag', spuCount: 1, itemCount: 1,
    manager: '王五 (M002)', distributor: null,
    buyerName: '林依', buyerPhone: '139****1122', buyerType: 'VIP买家', deliveryMethod: '国内快递', warehouse: '上海保税仓', shippingAddress: '北京市朝阳区...',
    totalPrice: 28000, depositPaid: null, status: 'after_sales', statusLabel: '待顾客退回',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-as-2', name: 'Saddle Bag', sku: 'DI-SAD-OBL', productNumber: 'DI-SAD', supplier: '自营库存', count: 1, price: 28000, status: 'after_sales', statusLabel: '待顾客退回' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-10 10:00', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥28,000' },
      { id: 'p2', time: '2024-08-14 09:00', description: '申请售后 - 换货', items: '全部 (1件)', amountChange: '-' },
      { id: 'p3', time: '2024-08-14 11:00', description: '销售已审批通过，等待顾客寄回', items: '-', amountChange: '-' }
    ]
  },
  {
    id: 'ORD-AS-1003', type: 'retail', date: '2024-08-14 15:30', brand: 'Prada', productName: 'Cleo Bag', spuCount: 1, itemCount: 1,
    manager: '张三 (M001)', distributor: null,
    buyerName: '韩梅', buyerPhone: '135****4433', buyerType: '个人买家', deliveryMethod: '跨境快递', warehouse: '香港直邮仓', shippingAddress: '广州市天河区...',
    totalPrice: 19500, depositPaid: null, status: 'after_sales', statusLabel: '待仓库验货',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-as-3', name: 'Cleo Bag', sku: 'PR-CLE-WHT', productNumber: 'PR-CLE', supplier: '自营库存', count: 1, price: 19500, status: 'after_sales', statusLabel: '待仓库验货' }
    ],
    afterSalesTrackingNo: 'SF1234567890',
    progress: [
      { id: 'p1', time: '2024-08-10 15:00', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥19,500' },
      { id: 'p2', time: '2024-08-13 14:00', description: '申请售后 - 退货退款', items: '全部 (1件)', amountChange: '-' },
      { id: 'p3', time: '2024-08-14 09:00', description: '顾客已寄出 (顺丰: SF1234567890)，等待仓库验货', items: '-', amountChange: '-' }
    ]
  },
  {
    id: 'ORD-AS-1004', type: 'retail', date: '2024-08-13 16:00', brand: 'Celine', productName: 'Triomphe Bag', spuCount: 1, itemCount: 1,
    manager: '赵六 (M003)', distributor: null,
    buyerName: '李雷', buyerPhone: '138****9988', buyerType: '个人买家', deliveryMethod: '门店自提', warehouse: '上海寄售仓', shippingAddress: '上海市徐汇区...',
    totalPrice: 24500, depositPaid: null, status: 'closed', statusLabel: '售后已退款',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-as-4', name: 'Triomphe Bag', sku: 'CE-TRI-BLK', productNumber: 'CE-TRI', supplier: '寄售入库', count: 1, price: 24500, status: 'refunded', statusLabel: '售后已退款' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-08 10:00', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥24,500' },
      { id: 'p2', time: '2024-08-11 12:00', description: '申请售后 - 退货退款', items: '全部 (1件)', amountChange: '-' },
      { id: 'p3', time: '2024-08-13 10:00', description: '仓库验货合格，已即刻执行退款闭环', items: '-', amountChange: '-¥24,500' }
    ]
  },

  // --- 已取消 (closed) ---
  {
    id: 'ORD-2024-0805-E1', type: 'retail', date: '2024-08-05 11:10', brand: 'Fendi', productName: 'Fendi Peekaboo', spuCount: 1, itemCount: 1,
    manager: null, distributor: '王小二名品',
    buyerName: '沈六', buyerPhone: '187****9012', buyerType: '个人买家', deliveryMethod: '跨境快递', warehouse: '香港直邮仓', shippingAddress: '苏州市工业园区...',
    totalPrice: 35000, depositPaid: null, status: 'closed', statusLabel: '已取消',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-13', name: 'Fendi Peekaboo', sku: 'F-PK-MED', productNumber: '8BN290', supplier: '自营库存', count: 1, price: 35000, status: 'closed', statusLabel: '已取消' }],
    progress: [
      { id: 'p1', time: '2024-08-05 11:40', description: '订单超时未支付自动取消', items: '-', amountChange: '-' }
    ]
  }
];

export function OrderManagement() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const [filterManager, setFilterManager] = useState<string | null>(null);
  const [filterDistributor, setFilterDistributor] = useState<string | null>(null);
  const [filterDelivery, setFilterDelivery] = useState<string | null>(null);
  const [filterWarehouse, setFilterWarehouse] = useState<string | null>(null);

  const [isAfterSalesModalOpen, setIsAfterSalesModalOpen] = useState(false);
  const [afterSalesDecision, setAfterSalesDecision] = useState<'refund' | 'exchange' | 'reject' | null>(null);
  const [afterSalesReason, setAfterSalesReason] = useState('');
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [downloads, setDownloads] = useState<{id: string, name: string, date: string, status: string}[]>([]);
  const [newProgressDesc, setNewProgressDesc] = useState('');
  const [newProgressAmount, setNewProgressAmount] = useState('');

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState('');

  const getCurrencySymbol = (warehouseName?: string) => {
    if (warehouseName?.includes('香港')) return 'HK$';
    if (warehouseName?.includes('欧洲') || warehouseName?.includes('Europe')) return '€';
    return '¥';
  };

  const handleUpdatePrice = () => {
    if (!selectedOrder) return;
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice < 0) return;

    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        return {
          ...order,
          totalPrice: newPrice
        };
      }
      return order;
    }));
    setIsEditingPrice(false);
  };

  const handleAddManualProgress = () => {
    if (!selectedOrder || !newProgressDesc) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: newProgressDesc,
          items: '-',
          amountChange: newProgressAmount || '-'
        };
        return {
          ...order,
          progress: [...(order.progress || []), newProgress]
        };
      }
      return order;
    }));
    setNewProgressDesc('');
    setNewProgressAmount('');
  };

  const handleCreateWorkOrder = () => {
    if (!selectedOrder || !newProgressDesc) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const amtStr = newProgressAmount.replace(/[^\d.-]/g, '');
    const amount = parseFloat(amtStr) || 0;

    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: `已发起财务工单: ${newProgressDesc}`,
          items: '-',
          amountChange: newProgressAmount || '-'
        };
        return {
          ...order,
          progress: [...(order.progress || []), newProgress]
        };
      }
      return order;
    }));
    
    workOrderStore.add({
      orderId: selectedOrder,
      type: amount < 0 ? '退款/赔付' : '收款/补差',
      amount: Math.abs(amount) || 0,
      reason: newProgressDesc
    });

    setNewProgressDesc('');
    setNewProgressAmount('');
    alert('已成功发起财务工单');
  };

  const getOrderOverallStatusLabel = (order: any, currentTab: string) => {
    if (currentTab === 'all') {
      const statuses = new Set(order.items.map((i: any) => i.status));
      if (statuses.size === 1) {
        return order.items[0].statusLabel;
      }
      
      const parts = [];
      if (order.items.some((i: any) => i.status === 'pending_shipment')) parts.push('部分待发货');
      if (order.items.some((i: any) => i.status === 'shipped')) parts.push('部分已发货');
      if (order.items.some((i: any) => i.status === 'after_sales')) {
        const afterSalesItem = order.items.find((i: any) => i.status === 'after_sales');
        parts.push(`部分${afterSalesItem.statusLabel}`);
      }
      
      return parts.join(' / ') || order.statusLabel;
    }

    const hasCurrentStatus = order.items.some((i: any) => i.status === currentTab);
    const hasOtherStatus = order.items.some((i: any) => i.status !== currentTab);

    if (hasCurrentStatus) {
      if (hasOtherStatus) {
        if (currentTab === 'pending_confirmation') return '部分待确认';
        if (currentTab === 'pending_shipment') return '部分待发货';
        if (currentTab === 'shipped') return '部分已发货';
        if (currentTab === 'after_sales') {
          const afterSalesItem = order.items.find((i: any) => i.status === 'after_sales');
          return `部分${afterSalesItem.statusLabel}`;
        }
      } else {
        if (currentTab === 'pending_confirmation') return '待确认';
        if (currentTab === 'pending_shipment') return '待发货';
        if (currentTab === 'shipped') return '已发货';
        if (currentTab === 'after_sales') return order.statusLabel;
      }
    }
    
    return order.statusLabel;
  };

  const handleRefundItems = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const updatedItems = order.items.map(item => {
          if (selectedItems.includes(item.id) && item.status !== 'after_sales' && item.status !== 'refunded') {
            return { ...item, status: 'after_sales', statusLabel: '待销售预审' };
          }
          return item;
        });
        
        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: '发起售后，待销售预审',
          items: `已选 (${selectedItems.length}件)`,
          amountChange: '-'
        };

        return {
          ...order,
          items: updatedItems,
          progress: [...(order.progress || []), newProgress]
        };
      }
      return order;
    }));
    setSelectedItems([]);
  };

  const confirmStock = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    setOrders(prevOrders => {
      const orderIndex = prevOrders.findIndex(o => o.id === selectedOrder);
      if (orderIndex === -1) return prevOrders;
      
      const order = prevOrders[orderIndex];
      const updatedItems = order.items.map(item => 
        selectedItems.includes(item.id) ? { ...item, status: 'pending_shipment', statusLabel: '待发货' } : item
      );
      
      const allConfirmed = updatedItems.every(i => i.status !== 'pending_confirmation');
      
      const newProgress = {
        id: `p-${Date.now()}`, time: now, description: '确认有货', items: `已选 (${selectedItems.length}件)`, amountChange: '-'
      };
      
      const newOrders = [...prevOrders];
      newOrders[orderIndex] = { 
        ...order, 
        status: allConfirmed ? 'pending_shipment' : 'pending_confirmation',
        statusLabel: allConfirmed ? '待发货' : '部分待确认',
        items: updatedItems,
        progress: [...(order.progress || []), newProgress]
      };
      return newOrders;
    });
    
    setSelectedItems([]);
  };

  const confirmShipment = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    setOrders(prevOrders => {
      const orderIndex = prevOrders.findIndex(o => o.id === selectedOrder);
      if (orderIndex === -1) return prevOrders;
      
      const order = prevOrders[orderIndex];
      const isPartial = selectedItems.length < order.items.length;
      
      if (isPartial) {
        const shippedItems = order.items.filter(i => selectedItems.includes(i.id)).map(i => ({ ...i, status: 'shipped', statusLabel: '已发货' }));
        const remainingItems = order.items.filter(i => !selectedItems.includes(i.id));
        
        const shippedTotal = shippedItems.reduce((sum, i) => sum + i.price * i.count, 0);
        const remainingTotal = remainingItems.reduce((sum, i) => sum + i.price * i.count, 0);
        
        const subOrderId = `${order.id}-S${Math.floor(Math.random() * 1000)}`;
        
        const newSubOrder = {
          ...order,
          id: subOrderId,
          items: shippedItems,
          totalPrice: shippedTotal,
          status: 'shipped',
          statusLabel: '已发货',
          shipments: trackingNumber ? [{ id: `PKG-${Date.now()}`, company: '快递', trackingNumber, contents: `发货 ${shippedItems.length} 件` }] : [],
          progress: [
            { id: `p-${Date.now()}-1`, time: now, description: '子订单生成并已发货', items: `共 ${shippedItems.length} 件`, amountChange: '-' }
          ]
        };
        
        const updatedOriginalOrder = {
          ...order,
          items: remainingItems,
          totalPrice: remainingTotal,
          progress: [
            ...(order.progress || []),
            { id: `p-${Date.now()}-2`, time: now, description: `部分发货，生成子订单 ${subOrderId}`, items: `发货 ${shippedItems.length} 件`, amountChange: '-' }
          ]
        };
        
        const newOrders = [...prevOrders];
        newOrders[orderIndex] = updatedOriginalOrder;
        newOrders.splice(orderIndex + 1, 0, newSubOrder);
        return newOrders;
      } else {
        const updatedItems = order.items.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'shipped', statusLabel: '已发货' } : item
        );
        const newProgress = {
          id: `p-${Date.now()}`, time: now, description: '商品发货', items: `已选 (${selectedItems.length}件)`, amountChange: '-'
        };
        const newOrders = [...prevOrders];
        newOrders[orderIndex] = { 
          ...order, 
          status: 'shipped',
          statusLabel: '已发货',
          items: updatedItems,
          shipments: trackingNumber ? [...(order.shipments || []), { id: `PKG-${Date.now()}`, company: '快递', trackingNumber, contents: `发货 ${selectedItems.length} 件` }] : (order.shipments || []),
          progress: [...(order.progress || []), newProgress]
        };
        return newOrders;
      }
    });
    
    setIsShipModalOpen(false);
    setTrackingNumber('');
    setSelectedItems([]);
    setSelectedOrder(null);
  };

  const handleProcessRefund = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    setOrders(prevOrders => {
      const orderIndex = prevOrders.findIndex(o => o.id === selectedOrder);
      if (orderIndex === -1) return prevOrders;
      
      const order = prevOrders[orderIndex];
      const isPartial = selectedItems.length < order.items.length;
      
      if (isPartial) {
        const refundedItems = order.items.filter(i => selectedItems.includes(i.id)).map(i => ({ ...i, status: 'refunded', statusLabel: '售后已完成' }));
        const remainingItems = order.items.filter(i => !selectedItems.includes(i.id));
        
        const refundedTotal = refundedItems.reduce((sum, i) => sum + i.price * i.count, 0);
        const remainingTotal = remainingItems.reduce((sum, i) => sum + i.price * i.count, 0);
        
        const subOrderId = `${order.id}-R${Math.floor(Math.random() * 1000)}`;
        
        const newSubOrder = {
          ...order,
          id: subOrderId,
          items: refundedItems,
          totalPrice: refundedTotal,
          status: 'closed',
          statusLabel: '售后已完成',
          progress: [
            { id: `p-${Date.now()}-1`, time: now, description: '子订单生成并售后已完成', items: `共 ${refundedItems.length} 件`, amountChange: `-¥${refundedTotal.toLocaleString()}` }
          ]
        };
        
        const updatedOriginalOrder = {
          ...order,
          items: remainingItems,
          totalPrice: remainingTotal,
          progress: [
            ...(order.progress || []),
            { id: `p-${Date.now()}-2`, time: now, description: `部分退款，生成子订单 ${subOrderId}`, items: `退款 ${refundedItems.length} 件`, amountChange: '-' }
          ]
        };
        
        const newOrders = [...prevOrders];
        newOrders[orderIndex] = updatedOriginalOrder;
        newOrders.splice(orderIndex + 1, 0, newSubOrder);
        return newOrders;
      } else {
        let refundAmount = 0;
        const updatedItems = order.items.map(item => {
          if (selectedItems.includes(item.id)) {
            refundAmount += item.price * item.count;
            return { ...item, status: 'refunded', statusLabel: '售后已完成' };
          }
          return item;
        });
        const newTotalPrice = order.totalPrice - refundAmount;
        
        const newProgress = {
          id: `p-${Date.now()}`, time: now, description: '确认退款', items: `已选 (${selectedItems.length}件)`, amountChange: `-¥${refundAmount.toLocaleString()}`
        };
        
        const newOrders = [...prevOrders];
        newOrders[orderIndex] = { 
          ...order, 
          items: updatedItems, 
          totalPrice: newTotalPrice,
          status: 'closed',
          statusLabel: '售后已完成',
          progress: [...(order.progress || []), newProgress]
        };
        return newOrders;
      }
    });
    
    setSelectedItems([]);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'downloads') return false;
    
    let matchesTab = false;
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (['pending_confirmation', 'pending_shipment', 'shipped', 'after_sales'].includes(activeTab)) {
      matchesTab = order.items.some((item: any) => item.status === activeTab);
    } else {
      matchesTab = order.status === activeTab;
    }

    if (!matchesTab) return false;
    
    if (filterManager && order.manager !== filterManager) return false;
    if (filterDistributor && order.distributor !== filterDistributor) return false;
    if (filterDelivery && order.deliveryMethod !== filterDelivery) return false;
    if (filterWarehouse && order.warehouse !== filterWarehouse) return false;
    
    return true;
  });

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  return (
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-80px)]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 md:mb-8 gap-4">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Operational Dashboard</div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">订单管理</h1>
            <p className="text-xs md:text-sm text-zinc-500">统一管理零售订单与批发订单，处理库存确认与发货</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="w-full md:w-auto bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-zinc-300 transition-colors">
              导出数据
            </button>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 border-b border-zinc-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1">
          <button onClick={() => setActiveTab('all')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'all' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>全部订单</button>
          <button onClick={() => setActiveTab('pending_payment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_payment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待付款</button>
          <button onClick={() => setActiveTab('pending_confirmation')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_confirmation' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待确认</button>
          <button onClick={() => setActiveTab('pending_shipment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_shipment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待发货</button>
          <button onClick={() => setActiveTab('shipped')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'shipped' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已发货</button>
          <button onClick={() => setActiveTab('after_sales')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'after_sales' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>售后处理</button>
          <button onClick={() => setActiveTab('completed')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'completed' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已完成</button>
          <button onClick={() => setActiveTab('closed')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'closed' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已关闭</button>
          <button onClick={() => setActiveTab('downloads')} className={`pb-3 text-xs font-bold transition-colors ml-auto ${activeTab === 'downloads' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>下载列表</button>
        </div>

        {activeTab !== 'downloads' && (
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索订单号、买家、商品名称..." 
                  className="w-full border border-zinc-200 pl-10 pr-4 py-2 text-sm focus:border-black focus:ring-0 outline-none" 
                />
              </div>
            </div>
            {(filterManager || filterDistributor || filterDelivery || filterWarehouse) && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 font-bold">当前筛选:</span>
                {filterManager && (
                  <span className="bg-zinc-200 text-zinc-800 px-2 py-1 flex items-center gap-1">
                    主理人: {filterManager} <X size={12} className="cursor-pointer hover:text-black" onClick={() => setFilterManager(null)} />
                  </span>
                )}
                {filterDistributor && (
                  <span className="bg-zinc-200 text-zinc-800 px-2 py-1 flex items-center gap-1">
                    分销商: {filterDistributor} <X size={12} className="cursor-pointer hover:text-black" onClick={() => setFilterDistributor(null)} />
                  </span>
                )}
                {filterDelivery && (
                  <span className="bg-zinc-200 text-zinc-800 px-2 py-1 flex items-center gap-1">
                    配送: {filterDelivery} <X size={12} className="cursor-pointer hover:text-black" onClick={() => setFilterDelivery(null)} />
                  </span>
                )}
                {filterWarehouse && (
                  <span className="bg-zinc-200 text-zinc-800 px-2 py-1 flex items-center gap-1">
                    仓库: {filterWarehouse} <X size={12} className="cursor-pointer hover:text-black" onClick={() => setFilterWarehouse(null)} />
                  </span>
                )}
                <button onClick={() => { setFilterManager(null); setFilterDistributor(null); setFilterDelivery(null); setFilterWarehouse(null); }} className="text-zinc-500 hover:text-black hover:underline ml-2">清除全部</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'after_sales' && (
          <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200 p-4 mb-6">
            <div className="text-sm font-bold">批量处理</div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  alert('已批量提交退款');
                }}
                className="bg-black text-white px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                批量退款
              </button>
            </div>
          </div>
        )}

        {activeTab === 'downloads' ? (
          <div className="bg-white border border-zinc-200 shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <div className="col-span-4">文件名称</div>
              <div className="col-span-3">生成时间</div>
              <div className="col-span-3">状态</div>
              <div className="col-span-2 text-right">操作</div>
            </div>
            {downloads.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">暂无下载文件</div>
            ) : (
              downloads.map(file => (
                <div key={file.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 border-b border-zinc-200 md:items-center hover:bg-zinc-50 transition-colors">
                  <div className="md:col-span-4 text-sm font-bold flex items-center gap-2">
                    <FileText size={16} className="text-zinc-400" />
                    {file.name}
                  </div>
                  <div className="flex justify-between items-center md:contents">
                    <div className="text-xs text-zinc-500 md:hidden">生成时间</div>
                    <div className="md:col-span-3 text-xs text-zinc-500">{file.date}</div>
                  </div>
                  <div className="flex justify-between items-center md:contents">
                    <div className="text-xs text-zinc-500 md:hidden">状态</div>
                    <div className="md:col-span-3 text-xs text-green-600 font-bold">{file.status}</div>
                  </div>
                  <div className="md:col-span-2 md:text-right mt-2 md:mt-0">
                    <button className="w-full md:w-auto text-xs font-bold border border-zinc-200 px-4 py-2 hover:border-black transition-colors flex items-center justify-center gap-2 md:ml-auto">
                      <Download size={14} />
                      下载 Excel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <div className="col-span-3">商品 SPU 详情</div>
            <div className="col-span-2">买家</div>
            <div className="col-span-2">配送方式 / 仓库</div>
            <div className="col-span-2 text-right">总价</div>
            <div className="col-span-2 pl-4">状态</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filteredOrders.map(order => (
            <div key={order.id} className="border-b border-zinc-200 hover:border-black transition-colors bg-white mb-4 shadow-sm">
              {/* Order Header */}
              <div className="bg-zinc-50 px-4 md:px-6 py-3 border-b border-zinc-200 flex flex-wrap items-center gap-2 md:gap-4">
                <span className="font-bold text-xs">{order.id}</span>
                <span className="text-[10px] text-zinc-500">{order.date}</span>
                {order.manager ? (
                  <span 
                    className="text-[10px] text-blue-600 md:ml-4 cursor-pointer hover:underline"
                    onClick={() => setFilterManager(order.manager)}
                  >
                    主理人: {order.manager}
                  </span>
                ) : order.distributor ? (
                  <span 
                    className="text-[10px] text-blue-600 md:ml-4 cursor-pointer hover:underline"
                    onClick={() => setFilterDistributor(order.distributor)}
                  >
                    分销商: {order.distributor}
                  </span>
                ) : null}
              </div>
              {/* Order Body */}
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 md:items-center">
                <div className="md:col-span-3 md:pr-4">
                  <div className="flex gap-3 mb-2">
                    <div className="w-10 h-10 bg-zinc-100 p-1 flex-shrink-0">
                      <img src={order.image} alt={order.brand} className="w-full h-full object-contain mix-blend-multiply grayscale" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-tight truncate w-32">{order.productName}</div>
                      <div className="text-[10px] text-zinc-500">x {order.itemCount}</div>
                    </div>
                  </div>
                  {order.spuCount > 1 && (
                    <div className="text-[9px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 inline-block">共 {order.spuCount} 款 SPU, {order.itemCount} 件</div>
                  )}
                </div>
                <div className="flex flex-col md:contents gap-4 border-t border-zinc-100 pt-4 md:border-none md:pt-0">
                  <div className="md:col-span-2 md:pr-4">
                    <div className="text-xs text-zinc-500 md:hidden mb-1">买家</div>
                    <div className="text-xs font-bold mb-1">{order.buyerName} ({order.buyerPhone})</div>
                    <div className="text-[10px] text-zinc-500 truncate" title={order.shippingAddress}>{order.shippingAddress}</div>
                  </div>
                  <div className="md:col-span-2 md:pr-4 flex md:block gap-4">
                    <div className="text-xs text-zinc-500 md:hidden mb-1 flex-shrink-0">配送方式 / 仓库</div>
                    <div>
                      <div 
                        className="text-xs font-bold md:mb-1 text-blue-600 cursor-pointer hover:underline"
                        onClick={() => setFilterDelivery(order.deliveryMethod)}
                      >
                        {order.deliveryMethod}
                      </div>
                      <div 
                        className="text-[10px] text-blue-600 cursor-pointer hover:underline"
                        onClick={() => setFilterWarehouse(order.warehouse)}
                      >
                        {order.warehouse}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center md:contents border-t border-zinc-100 pt-3 md:border-none md:pt-0">
                  <div className="md:col-span-2 md:text-right">
                    <div className="text-xs text-zinc-500 md:hidden mb-1">价格详情</div>
                    <div className="flex flex-col md:items-end">
                      <div className="text-sm font-bold">{getCurrencySymbol(order.warehouse)} {order.totalPrice.toLocaleString()}</div>
                      <div className="text-[9px] text-zinc-400 mb-1">订单总价</div>
                      
                      {order.depositPaid ? (
                        <div className="flex flex-col md:items-end">
                          <div className="text-[9px] text-orange-600 font-bold leading-none">已付定金: {getCurrencySymbol(order.warehouse)}{order.depositPaid.toLocaleString()}</div>
                          <div className="text-[9px] text-green-600 font-bold mt-1 leading-none">
                            已确认品额: {getCurrencySymbol(order.warehouse)}{(order.items as any[]).filter(i => i.status !== 'pending_confirmation' && i.status !== 'pending_payment').reduce((s, i) => s + i.price * i.count, 0).toLocaleString()}
                          </div>
                          <div className="text-[9px] text-red-600 font-bold mt-1 leading-none">
                            待收尾款: {getCurrencySymbol(order.warehouse)}{(order.totalPrice - (order.depositPaid || 0)).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[9px] text-zinc-400">{order.status === 'pending_payment' ? '未付款' : ''}</div>
                      )}
                      
                      <div className="text-[9px] text-zinc-400 mt-1">运费: {getCurrencySymbol(order.warehouse)}0</div>
                    </div>
                  </div>
                  <div className="md:col-span-2 md:pl-4 text-right md:text-left">
                    <div className={`text-[9px] font-bold px-2 py-1 uppercase tracking-wider inline-block md:mb-1 ${
                      getOrderOverallStatusLabel(order, activeTab).includes('部分') ? 'bg-yellow-100 text-yellow-800' :
                      order.items.every((i: any) => i.status === 'pending_confirmation') ? 'bg-orange-100 text-orange-800' :
                      order.items.every((i: any) => i.status === 'pending_shipment') ? 'bg-black text-white' :
                      order.items.every((i: any) => i.status === 'after_sales') ? 'bg-red-100 text-red-800' :
                      order.status === 'pending_payment' ? 'bg-red-100 text-red-800' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {getOrderOverallStatusLabel(order, activeTab)}
                    </div>
                    {(order as any).shipments && (order as any).shipments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {(order as any).shipments.map((shipment: any) => (
                          <div key={shipment.id} className="text-[10px] text-zinc-500">
                            <span className="text-zinc-800">{shipment.company}</span>
                            <br/>
                            <a href="#" onClick={(e) => { e.preventDefault(); alert(`查看物流轨迹\r\n\r\n单号: ${shipment.trackingNumber}\r\n状态: 运输中...\r\n包裹内容: ${shipment.contents}`); }} className="text-blue-600 hover:underline">
                              {shipment.trackingNumber}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-1 md:text-right mt-3 md:mt-0 flex justify-end w-full md:w-auto">
                  <button 
                    onClick={() => setSelectedOrder(order.id)}
                    className="w-full md:w-8 md:h-8 flex items-center justify-center border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-black transition-colors md:ml-auto gap-2 md:gap-0 py-2 md:py-0 text-xs md:text-base font-bold text-black"
                  >
                    <span className="md:hidden">查看详情</span>
                    <ChevronRight size={16} className="text-zinc-400 md:text-black" />
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="relative w-[500px] bg-white shadow-2xl flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-lg font-black uppercase tracking-tight">上传确认单</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-xs font-bold text-zinc-500 mb-2">选择仓库</label>
                <select className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white">
                  <option value="">请选择仓库</option>
                  <option value="香港直邮仓">香港直邮仓</option>
                  <option value="深圳保税仓">深圳保税仓</option>
                  <option value="北京寄售仓">北京寄售仓</option>
                  <option value="上海寄售仓">上海寄售仓</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-zinc-500 mb-2">上传 Excel 文件</label>
                <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center hover:border-black transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto text-zinc-400 mb-2" />
                  <div className="text-sm font-bold mb-1">点击或拖拽文件到此处</div>
                  <div className="text-xs text-zinc-400">支持 .xlsx, .xls 格式</div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-black transition-colors">取消</button>
                <button 
                  onClick={() => {
                    alert('上传成功，已批量确认对应供应商的商品。');
                    setIsUploadModalOpen(false);
                  }} 
                  className="bg-black text-white px-6 py-2 text-sm font-bold hover:bg-zinc-800 transition-colors"
                >
                  确认上传
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedOrderData && (
        <div className="fixed inset-0 z-50 flex justify-end p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-[800px] bg-white shadow-2xl flex flex-col h-full rounded-xl overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 bg-zinc-50">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">订单详情</div>
                <h2 className="text-xl font-black uppercase tracking-tight">{selectedOrderData.id}</h2>
              </div>
              <button 
                onClick={() => {
                  setSelectedOrder(null);
                  setIsEditingPrice(false);
                }} 
                className="text-zinc-400 hover:text-black transition-colors"><X size={24} />
              </button>
            </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">买家/收件信息</h3>
                <div className="text-sm font-bold mb-1">{selectedOrderData.buyerName} ({selectedOrderData.buyerPhone})</div>
                <div className="text-xs text-zinc-500">收货地址: {selectedOrderData.shippingAddress}</div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">订单状态</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${
                    getOrderOverallStatusLabel(selectedOrderData, activeTab).includes('部分') ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrderData.items.every((i: any) => i.status === 'pending_confirmation') ? 'bg-orange-100 text-orange-800' :
                    selectedOrderData.items.every((i: any) => i.status === 'pending_shipment') ? 'bg-black text-white' :
                    selectedOrderData.items.every((i: any) => i.status === 'after_sales') ? 'bg-red-100 text-red-800' :
                    selectedOrderData.status === 'pending_payment' ? 'bg-red-100 text-red-800' :
                    'bg-zinc-100 text-zinc-800'
                  }`}>{getOrderOverallStatusLabel(selectedOrderData, activeTab)}</span>
                </div>
                <div className="text-xs text-zinc-500">下单时间: {selectedOrderData.date}:00</div>
              </div>
            </div>

            {(() => {
              const showsAfterSalesFlow = selectedOrderData.status === 'after_sales' || selectedOrderData.items.some((i: any) => i.status === 'after_sales');
              if (!showsAfterSalesFlow) return null;

              const label = selectedOrderData.statusLabel || '';
              
              let currentStage = 1;
              if (label.includes('顾客退回') || label.includes('待寄回') || label.includes('Customer Return')) currentStage = 2;
              else if (label.includes('仓库验货') || label.includes('验货') || label.includes('待退款')) currentStage = 3;
              else if (label.includes('完成') || label.includes('已完成') || label.includes('已驳回')) currentStage = 4;

              const stages = [
                { id: 1, name: '销售预审' },
                { id: 2, name: '顾客退回' },
                { id: 3, name: '仓库验单与退款' },
                { id: 4, name: '售后完结' }
              ];

              return (
                <div className="bg-orange-50 border border-orange-200 p-6 mb-8 flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-top-4">
                  <h3 className="text-[10px] font-bold text-orange-800 uppercase tracking-widest mb-6">售后流程状态监控</h3>
                  <div className="flex items-center justify-between relative px-2">
                    <div className="absolute top-3 left-4 right-4 h-[2px] bg-orange-200 z-0 rounded-full"></div>
                    <div className="absolute top-3 left-4 h-[2px] bg-orange-500 z-0 transition-all duration-700 ease-out rounded-full" style={{ width: `calc(${(currentStage - 1) * 33.33}% - 0.5rem)` }}></div>
                    {stages.map(step => {
                      const isActive = currentStage === step.id;
                      const isPast = currentStage > step.id;
                      return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isPast ? 'bg-orange-500 text-white shadow-sm' : 
                            isActive ? 'bg-white border-4 border-orange-500 text-orange-600 shadow-md transform scale-110' : 
                            'bg-orange-100/50 border-2 border-orange-200 text-orange-300'
                          }`}>
                            {isPast ? <Check size={14} strokeWidth={3} className="animate-in zoom-in" /> : step.id}
                          </div>
                          <span className={`text-[10px] font-bold transition-colors ${
                            isActive ? 'text-orange-900 bg-orange-200/50 px-2 py-0.5 rounded-full' : 
                            isPast ? 'text-orange-800' : 'text-orange-400/60'
                          }`}>
                            {step.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Logistics or Sub-status details based on current stage */}
                  <div className="mt-6">
                    {currentStage === 1 && (
                      <div className="text-xs text-orange-700 bg-orange-100/30 p-3 rounded flex items-start gap-2">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                        <span>销售预审流程中。目前正在等待您或其他主理人审核顾客发送的售后凭证信息。</span>
                      </div>
                    )}
                    {currentStage === 2 && selectedOrderData.afterSalesTrackingNo && (
                      <div className="bg-white border border-orange-200 px-4 py-3 text-xs text-orange-800 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2 font-bold"><Truck size={14} className="text-orange-500" /> 退回快递单号: <span className="font-mono text-black">{selectedOrderData.afterSalesTrackingNo}</span></div>
                        <button className="text-orange-600 hover:underline px-2 py-1 hover:bg-orange-50 rounded transition-colors">追踪轨迹</button>
                      </div>
                    )}
                    {currentStage === 2 && !selectedOrderData.afterSalesTrackingNo && (
                      <div className="text-xs text-orange-700 bg-orange-100/30 p-3 flex items-start gap-2">
                        <Info size={14} className="mt-0.5 flex-shrink-0" />
                        <span>销售已审核通过。正在等待顾客填入退货快递单号...</span>
                      </div>
                    )}
                    {currentStage === 3 && (
                      <div className="bg-white border border-orange-200 px-4 py-3 text-xs text-orange-800 shadow-sm">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 font-bold"><Package size={14} className="text-orange-500" /> 仓库验单追踪: <span className="font-mono text-black">{selectedOrderData.afterSalesTrackingNo || '无单号'}</span></div>
                           <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">待验货</span>
                         </div>
                         <div className="text-zinc-500 mb-3">包裹进入仓库环节。质检部将进行二次拆包校验防伪扣与商品情况。</div>
                         <div className="flex justify-end border-t border-orange-100 pt-3">
                           <button className="bg-black text-white text-xs px-4 py-2 hover:bg-zinc-800 transition-colors">验货通过并立即退款</button>
                         </div>
                      </div>
                    )}
                    {currentStage === 4 && (
                      <div className="text-xs text-orange-700 bg-orange-100/30 p-3 flex items-start gap-2">
                        <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-orange-600" />
                        <span>流转完毕。此售后流程已彻底闭环。</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Payment Info */}
            <div className="bg-zinc-50 p-6 border border-zinc-200 mb-8">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">支付与结算</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-500">订单总额</span>
                <span className="text-sm font-black">{getCurrencySymbol(selectedOrderData.warehouse)} {selectedOrderData.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-500">已确认商品金额</span>
                <span className="text-sm font-bold text-green-600">
                  {getCurrencySymbol(selectedOrderData.warehouse)} {(selectedOrderData.items as any[]).filter(i => i.status !== 'pending_confirmation' && i.status !== 'pending_payment').reduce((s, i) => s + i.price * i.count, 0).toLocaleString()}
                </span>
              </div>
              {selectedOrderData.depositPaid ? (
                <>
                  <div className="flex justify-between items-center mb-2 text-orange-600">
                    <span className="text-sm">已付定金</span>
                    <span className="text-sm font-bold">{getCurrencySymbol(selectedOrderData.warehouse)} {selectedOrderData.depositPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-200 mt-2">
                    <span className="text-sm text-zinc-500">已确认总额</span>
                    <span className="text-sm font-black">{getCurrencySymbol(selectedOrderData.warehouse)} {((selectedOrderData.items as any[]).filter(i => i.status !== 'pending_confirmation' && i.status !== 'pending_payment').reduce((s, i) => s + i.price * i.count, 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-bold text-zinc-800">待付尾款金额</span>
                    <span className="text-lg font-black text-red-600">{getCurrencySymbol(selectedOrderData.warehouse)} {(selectedOrderData.totalPrice - selectedOrderData.depositPaid).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center pt-2 border-t border-zinc-200 mt-2">
                  <span className="text-sm font-bold">已付金额</span>
                  <span className="text-lg font-black">{getCurrencySymbol(selectedOrderData.warehouse)} {selectedOrderData.status === 'pending_payment' ? '0.00' : `${selectedOrderData.totalPrice.toLocaleString()}`}</span>
                </div>
              )}

              {selectedOrderData.status === 'pending_payment' && (
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">修改订单总额</span>
                    {isEditingPrice ? (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="border border-zinc-300 px-2 py-1 text-sm w-24"
                            placeholder="新价格"
                          />
                          <button
                            onClick={handleUpdatePrice}
                            className="bg-black text-white px-3 py-1 text-xs font-bold"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setIsEditingPrice(false)}
                            className="text-zinc-500 hover:text-black text-xs font-bold"
                          >
                            取消
                          </button>
                        </div>
                        {selectedOrderData.deliveryMethod === '跨境快递' && parseFloat(tempPrice) > 0 && (
                          <div className="text-[10px] text-zinc-500 text-right mt-1">
                            商品实付款: ¥{(parseFloat(tempPrice) / 1.091).toFixed(2)}，关税 (9.1%): ¥{(parseFloat(tempPrice) - parseFloat(tempPrice) / 1.091).toFixed(2)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setTempPrice(selectedOrderData.totalPrice.toString());
                          setIsEditingPrice(true);
                        }}
                        className="text-blue-600 text-xs font-bold hover:underline"
                      >
                        改价
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Info (Conditional) */}
            {(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'completed') && (
              <div className="bg-zinc-50 p-6 border border-zinc-200 mb-8">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">物流信息</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-zinc-500">承运商</span>
                  <span className="text-sm font-bold">顺丰速运</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-zinc-500">物流单号</span>
                  <span className="text-sm font-bold font-mono">SF1234567890123</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">发货时间</span>
                  <span className="text-sm">2024-08-06 10:00:00</span>
                </div>
              </div>
            )}

            {/* Product List */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">商品明细与操作</h3>
              </div>
              
              <div className="border border-zinc-200">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <tr>
                        <th className="p-4 w-10">
                          <input 
                            type="checkbox" 
                            className="accent-black" 
                            onChange={(e) => {
                              if (e.target.checked) {
                                const selectableItems = selectedOrderData.items.filter((i: any) => activeTab === 'all' || i.status === activeTab).map((i: any) => i.id);
                                setSelectedItems(selectableItems);
                              } else {
                                setSelectedItems([]);
                              }
                            }}
                            checked={selectedOrderData.items.filter((i: any) => activeTab === 'all' || i.status === activeTab).length > 0 && selectedItems.length === selectedOrderData.items.filter((i: any) => activeTab === 'all' || i.status === activeTab).length}
                          />
                        </th>
                        <th className="p-4">商品</th>
                        <th className="p-4 text-right">数量</th>
                        <th className="p-4 text-right">单价</th>
                        <th className="p-4 text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {selectedOrderData.items.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="p-4">
                            <input 
                              type="checkbox" 
                              className="accent-black" 
                              checked={selectedItems.includes(item.id)} 
                              disabled={activeTab !== 'all' && item.status !== activeTab}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, item.id]);
                                } else {
                                  setSelectedItems(selectedItems.filter(id => id !== item.id));
                                }
                              }} 
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-xs">{item.name}</div>
                            <div className="text-[10px] text-zinc-400">货号: {item.productNumber}</div>
                            <div className="text-[10px] text-zinc-400">SKU条码: {item.sku}</div>
                          </td>
                          <td className="p-4 text-right font-mono">{item.count}</td>
                          <td className="p-4 text-right font-mono">{getCurrencySymbol(selectedOrderData.warehouse)} {item.price.toLocaleString()}</td>
                          <td className="p-4 text-center"><span className={`${item.status === 'refunded' ? 'text-red-600' : 'text-orange-600'} text-xs font-bold`}>{item.statusLabel}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked List */}
                <div className="md:hidden flex flex-col divide-y divide-zinc-100 bg-white">
                  {/* Select All Bar */}
                  <div className="p-4 flex items-center justify-between bg-zinc-50 border-b border-zinc-200">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                      <input 
                        type="checkbox" 
                        className="accent-black" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            const selectableItems = selectedOrderData.items.filter((i: any) => activeTab === 'all' || i.status === activeTab).map((i: any) => i.id);
                            setSelectedItems(selectableItems);
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        checked={selectedOrderData.items.filter((i: any) => activeTab === 'all' || i.status === activeTab).length > 0 && selectedItems.length === selectedOrderData.items.filter((i: any) => activeTab === 'all' || i.status === activeTab).length}
                      />
                      全选可选商品
                    </label>
                  </div>
                  
                  {selectedOrderData.items.map((item: any) => (
                    <div key={item.id} className="p-4 flex gap-3">
                      <input 
                        type="checkbox" 
                        className="accent-black mt-1" 
                        checked={selectedItems.includes(item.id)} 
                        disabled={activeTab !== 'all' && item.status !== activeTab}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }} 
                      />
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="font-bold text-xs">{item.name}</div>
                          <span className={`${item.status === 'refunded' ? 'text-red-600' : 'text-orange-600'} text-xs font-bold shrink-0`}>{item.statusLabel}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mb-0.5">货号: {item.productNumber}</div>
                        <div className="text-[10px] text-zinc-400 mb-2">SKU条码: {item.sku}</div>
                        <div className="flex justify-between items-end mt-auto pt-2 border-t border-zinc-100">
                          <div className="text-[10px] text-zinc-500">数量: <span className="font-mono text-black font-bold">{item.count}</span></div>
                          <div className="font-mono font-bold text-sm">{getCurrencySymbol(selectedOrderData.warehouse)} {item.price.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Progress Details */}
            <div className="mt-8">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">订单进程明细</h3>
              <div className="border border-zinc-200">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <tr>
                        <th className="p-4">操作时间</th>
                        <th className="p-4">进程说明</th>
                        <th className="p-4">涉及商品</th>
                        <th className="p-4">金额变动</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-100 text-zinc-800">
                      {selectedOrderData.progress?.map((p: any) => (
                        <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="p-4 font-mono text-xs">{p.time}</td>
                          <td className="p-4 font-bold text-black">{p.description}</td>
                          <td className="p-4">{p.items}</td>
                          <td className="p-4 font-mono">{p.amountChange}</td>
                        </tr>
                      ))}
                      {(!selectedOrderData.progress || selectedOrderData.progress.length === 0) && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-zinc-500 text-xs">暂无进程记录</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked List */}
                <div className="md:hidden flex flex-col divide-y divide-zinc-100 bg-white">
                  {selectedOrderData.progress?.map((p: any) => (
                    <div key={p.id} className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-sm text-black">{p.description}</div>
                        <div className="font-mono text-[10px] text-zinc-400">{p.time}</div>
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <div className="text-xs text-zinc-500">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">涉及商品</span>
                          {p.items}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">金额变动</span>
                          <span className="font-mono text-xs font-bold">{p.amountChange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!selectedOrderData.progress || selectedOrderData.progress.length === 0) && (
                    <div className="p-8 text-center text-zinc-500 text-xs">暂无进程记录</div>
                  )}
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col md:flex-row gap-4 md:items-center">
                  <input 
                    type="text" 
                    placeholder="手动添加进程说明 (如: 线下退款)" 
                    value={newProgressDesc}
                    onChange={(e) => setNewProgressDesc(e.target.value)}
                    className="flex-1 w-full bg-white border border-zinc-200 px-3 py-2 text-xs text-black focus:border-black outline-none"
                  />
                  <div className="flex gap-4 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="金额变动 (如: -¥1,000)" 
                      value={newProgressAmount}
                      onChange={(e) => setNewProgressAmount(e.target.value)}
                      className="w-full md:w-36 bg-white border border-zinc-200 px-3 py-2 text-xs text-black focus:border-black outline-none"
                    />
                    <div className="flex shadow-sm">
                      <button 
                        onClick={handleAddManualProgress}
                        disabled={!newProgressDesc}
                        className="bg-black text-white px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
                      >
                        记录
                      </button>
                      <button 
                        onClick={handleCreateWorkOrder}
                        disabled={!newProgressDesc}
                        className="bg-orange-600 text-white px-4 py-2 text-xs font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap border-l border-white/20 flex items-center gap-1"
                        title="发起财务工单"
                      >
                        <Wrench size={14} />
                        转工单
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-zinc-200 bg-zinc-50 flex justify-between items-center">
            <div className="text-xs text-zinc-500">已选 {selectedItems.length} 件商品</div>
            <div className="flex gap-3">
              {(() => {
                const selectedItemsData = selectedOrderData.items.filter((i: any) => selectedItems.includes(i.id));
                
                const showPaymentReminder = selectedOrderData.status === 'pending_payment';
                
                const showShipBtn = activeTab === 'pending_shipment' || (activeTab === 'all' && selectedOrderData.items.some((i: any) => i.status === 'pending_shipment'));
                const canShip = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'pending_shipment');

                const showConfirmStockBtn = activeTab === 'pending_confirmation' || (activeTab === 'all' && selectedOrderData.items.some((i: any) => i.status === 'pending_confirmation'));
                const canConfirmStock = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'pending_confirmation');

                const showProcessRefundBtn = activeTab === 'after_sales' || (activeTab === 'all' && selectedOrderData.items.some((i: any) => i.status === 'after_sales'));
                const canProcessRefund = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'after_sales');

                const showRefundBtn = ['pending_shipment', 'shipped', 'completed'].includes(activeTab) || 
                                      (activeTab === 'all' && selectedOrderData.items.some((i: any) => ['pending_shipment', 'shipped', 'completed'].includes(i.status)));
                const canRefund = selectedItems.length > 0 && selectedItemsData.every((i: any) => ['pending_shipment', 'shipped', 'completed'].includes(i.status));
                
                let refundLabel = '申请售后';

                const showLogisticsBtn = activeTab === 'shipped' || (activeTab === 'all' && selectedOrderData.items.some((i: any) => i.status === 'shipped'));

                return (
                  <>
                    {showPaymentReminder && (
                      <>
                        <button 
                          onClick={() => {
                            // scroll up to top logic is not needed, user can see it if it's there, 
                            // but better yet, let's just trigger edit mode
                            setTempPrice(selectedOrderData.totalPrice.toString());
                            setIsEditingPrice(true);
                          }}
                          className="bg-white border border-zinc-200 text-black px-6 py-3 text-xs font-bold hover:border-black transition-colors"
                        >
                          修改订单金额
                        </button>
                        <button className="bg-black text-white px-6 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors">提醒付款</button>
                      </>
                    )}
                    
                    {showConfirmStockBtn && (
                      <button 
                        onClick={confirmStock} 
                        disabled={!canConfirmStock} 
                        className="bg-black text-white px-6 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <CheckCircle size={14} />
                        确认有货
                      </button>
                    )}

                    {showRefundBtn && (
                      <button 
                        onClick={handleRefundItems} 
                        disabled={!canRefund} 
                        className="bg-white border border-zinc-200 text-black px-6 py-3 text-xs font-bold hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {refundLabel}
                      </button>
                    )}

                    {showProcessRefundBtn && (
                      <button 
                        onClick={() => setIsAfterSalesModalOpen(true)} 
                        disabled={!canProcessRefund} 
                        className="bg-black text-white px-6 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        售后审批
                      </button>
                    )}

                    {showShipBtn && (
                      <button 
                        onClick={() => setIsShipModalOpen(true)} 
                        disabled={!canShip} 
                        className="bg-black text-white px-6 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Package size={14} />
                        发货
                      </button>
                    )}

                    {showLogisticsBtn && (
                      <button 
                        disabled={selectedItems.length === 0} 
                        className="bg-white border border-zinc-200 text-black px-6 py-3 text-xs font-bold hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Truck size={14} />
                        查看物流
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
        </div>
      )}
      {/* Ship Modal */}
      {isShipModalOpen && selectedOrderData && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsShipModalOpen(false)}></div>
          <div className="relative w-[400px] bg-white shadow-2xl flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-lg font-black uppercase tracking-tight">发货确认</h2>
              <button onClick={() => setIsShipModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                {selectedOrderData.deliveryMethod === '跨境快递' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-2">物流单号 (系统自动回传)</label>
                    <div className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm font-mono font-bold text-zinc-800">
                      顺丰速运: SF8848123456789
                    </div>
                  </div>
                )}
                {selectedOrderData.deliveryMethod === '非跨境快递' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-2">请输入物流单号</label>
                    <input 
                      type="text" 
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="请输入快递单号..."
                      className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white"
                    />
                  </div>
                )}
                {selectedOrderData.deliveryMethod === '门店自提' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-2">提货码 (系统自动生成)</label>
                    <div className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-lg font-mono font-black text-center tracking-[0.2em] text-zinc-800">
                      PICKUP-{Math.floor(1000 + Math.random() * 9000)}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsShipModalOpen(false)} className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-black transition-colors">取消</button>
                <button 
                  onClick={confirmShipment} 
                  disabled={selectedOrderData.deliveryMethod === '非跨境快递' && !trackingNumber}
                  className="bg-black text-white px-6 py-2 text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  确认发货
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* After Sales Modal */}
      {isAfterSalesModalOpen && selectedOrderData && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAfterSalesModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-lg font-black uppercase tracking-tight">售后审批 (销售审核)</h2>
              <button onClick={() => setIsAfterSalesModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-100 p-4 mb-6">
                <div className="text-xs font-bold text-orange-800 mb-1">高奢控制环：销售预审与凭证留存</div>
                <div className="text-xs text-orange-700">根据高客单价属性，售后要求销售通过企微留存沟通。通过后，顾客需提供防伪扣完好的实名照片，避免调包。审批决定后流程流向【仓库验货】。</div>
              </div>

              <div className="mb-6 bg-zinc-50 border border-zinc-200 p-4 border-dashed relative group overflow-hidden hover:border-black transition-colors">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-10 h-10 bg-white shadow-sm border border-zinc-200 rounded-full flex gap-1 items-center justify-center mb-3">
                    <Image size={16} className="text-zinc-500" />
                  </div>
                  <div className="text-xs font-bold mb-1">上传与客沟通截图 / 商品防伪扣实拍</div>
                  <div className="text-[10px] text-zinc-500 mb-4 text-center max-w-[260px]">该凭证将作为判定恶意退单调包的核心证据，不可缺失（此部分可做必填拦截校验）。</div>
                  <button className="bg-white border border-zinc-200 text-xs font-bold px-4 py-2 hover:border-black transition-colors"onClick={() => setIsUploadModalOpen(true)}>选择文件上传</button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-zinc-500 mb-3">审核处理</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => setAfterSalesDecision('refund')}
                    className={`border p-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'refund' ? 'border-black border-2 bg-zinc-50' : 'border-zinc-200 hover:border-black'}`}
                  >
                    <span className="text-sm font-bold">同意售后退回</span>
                    <span className="text-[10px] text-zinc-500">顾客寄回, 仓库验单后原路退款或换新</span>
                  </button>
                  <button 
                    onClick={() => setAfterSalesDecision('reject')}
                    className={`border p-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'reject' ? 'border-red-600 border-2 bg-red-50' : 'border-zinc-200 hover:border-red-500'}`}
                  >
                    <span className="text-sm font-bold">直接驳回申请</span>
                    <span className="text-[10px] text-zinc-500">终止流程，拒绝客户该次售后请求</span>
                  </button>
                </div>
              </div>

              {afterSalesDecision === 'reject' && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-red-600 mb-2">驳回原因 (必填)</label>
                  <textarea 
                    value={afterSalesReason}
                    onChange={(e) => setAfterSalesReason(e.target.value)}
                    placeholder="请输入驳回售后申请的具体原因，将展示给终端顾客..."
                    className="w-full bg-white border border-red-200 px-4 py-3 text-sm text-black focus:border-red-500 outline-none h-24 resize-none"
                  ></textarea>
                </div>
              )}

              {(afterSalesDecision === 'refund') && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-zinc-500 mb-2">审批备注 (选填，仅内网可见)</label>
                  <textarea 
                    value={afterSalesReason}
                    onChange={(e) => setAfterSalesReason(e.target.value)}
                    placeholder="录入审批意见..."
                    className="w-full bg-white border border-zinc-200 px-4 py-3 text-sm text-black focus:border-black outline-none h-24 resize-none"
                  ></textarea>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button 
                  onClick={() => setIsAfterSalesModalOpen(false)}
                  className="px-6 py-3 text-xs font-bold text-zinc-500 hover:text-black transition-colors"
                >
                  取消
                </button>
                <button 
                  disabled={!afterSalesDecision || (afterSalesDecision === 'reject' && !afterSalesReason)}
                  onClick={() => {
                    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
                    setOrders(prevOrders => {
                      const orderIndex = prevOrders.findIndex(o => o.id === selectedOrderData.id);
                      if (orderIndex === -1) return prevOrders;
                      const order = prevOrders[orderIndex];

                      const actionText = afterSalesDecision === 'refund' ? '同意售后退回并等待寄回' : '驳回申请';
                      const newProgress = { id: `p-${Date.now()}`, time: now, description: `销售确认完毕: ${actionText}`, items: `已选 (${selectedItems.length}件)`, amountChange: '-' };

                      const updatedItems = order.items.map(item => {
                        if (selectedItems.includes(item.id)) {
                          // In a real app we'd map to 'warehouse_inspect', 'refunded' etc based on the action,
                          // For demo, we just mark as closed indicating the flow moved forward
                          return { ...item, status: 'after_sales', statusLabel: afterSalesDecision === 'reject' ? '售后已驳回' : '待顾客退回' };
                        }
                        return item;
                      });

                      const newOrders = [...prevOrders];
                      newOrders[orderIndex] = {
                        ...order,
                        items: updatedItems,
                        status: updatedItems.every(i => i.status === 'after_sales') ? 'after_sales' : order.status,
                        statusLabel: afterSalesDecision === 'reject' ? '已驳回' : '待顾客退回',
                        progress: [...(order.progress || []), newProgress]
                      };
                      return newOrders;
                    });
                    setIsAfterSalesModalOpen(false);
                    setAfterSalesDecision(null);
                    setAfterSalesReason('');
                    setSelectedItems([]);
                    setSelectedOrder(null);
                  }}
                  className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认审批执行
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
