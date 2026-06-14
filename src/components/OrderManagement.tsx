import { Search, ChevronRight, X, Package, Truck, CheckCircle, AlertCircle, Download, Upload, FileText, Check, Info, Image, Wrench } from "lucide-react";
import { useState } from "react";
import { workOrderStore } from '../lib/workOrderStore';

const INITIAL_ORDERS = [
  // --- 待付款 (pending_payment) ---
  {
    id: 'ORD-2024-0816-NEW', type: 'retail', date: '2024-08-16 09:30', brand: 'Chanel', productName: 'Chanel Classic Flap', spuCount: 1, itemCount: 1,
    manager: '张三', distributor: null,
    buyerName: '周婷', buyerPhone: '13612345555', buyerType: 'VIP客户', deliveryMethod: '跨境快递', warehouse: '香港直邮仓', shippingAddress: '上海市黄浦区南京东路123号5楼501室',
    totalPrice: 65000, depositPaid: null, status: 'pending_payment', statusLabel: '待付款',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    remark: '客户要求尽快发货，需顺丰直达',
    purchaser: {
      nickname: '小周同学',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&q=80',
      phone: '13612345555',
      realName: '周婷',
      idNumber: '31010119900101001X',
      idFront: 'https://images.unsplash.com/photo-1557128928-66e3009291b5?auto=format&fit=crop&w=150&q=80',
      idBack: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?auto=format&fit=crop&w=150&q=80'
    },
    remarksHistory: [
      { author: '系统自动', time: '2024-08-16 09:30', text: '订单创建成功' },
      { author: '王小二 (销售)', time: '2024-08-16 09:35', text: '客户要求尽快发货，需顺丰直达' }
    ],
    items: [
      { id: 'item-new', name: 'Chanel Classic Flap', sku: 'CH-CF-BLK', productNumber: 'CH-CF-001', supplier: '自营库存', count: 1, price: 65000, status: 'pending_payment', statusLabel: '待付款' }
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
    totalPrice: 18000, depositPaid: null, status: 'after_sales', statusLabel: '待审核',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-as-1', name: 'GG Marmont', sku: 'GG-MM-BLK', productNumber: 'GG-MM', supplier: '自营库存', count: 1, price: 18000, status: 'after_sales', statusLabel: '待审核' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-15 09:30', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥18,000' },
      { id: 'p2', time: '2024-08-15 14:00', description: '商品发货', items: '全部 (1件)', amountChange: '-' },
      { id: 'p3', time: '2024-08-16 09:30', description: '申请售后 - 退货退款', items: '全部 (1件)', amountChange: '-' },
      { id: 'p4', time: '2024-08-16 10:00', description: '进入售后流程：待审核', items: '-', amountChange: '-' }
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
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [shipmentMode, setShipmentMode] = useState<'auto-sf' | 'manual' | null>(null);
  
  const [searchType, setSearchType] = useState('订单号');
  const [searchValue, setSearchValue] = useState('');
  const [filterManager, setFilterManager] = useState<string | null>(null);
  const [filterDistributor, setFilterDistributor] = useState<string | null>(null);
  const [filterDelivery, setFilterDelivery] = useState<string | null>(null);
  const [filterWarehouse, setFilterWarehouse] = useState<string | null>(null);

  const [isAfterSalesModalOpen, setIsAfterSalesModalOpen] = useState(false);
  const [afterSalesDecision, setAfterSalesDecision] = useState<'refund' | 'exchange' | 'reject' | 'refund_only' | null>(null);
  const [afterSalesReason, setAfterSalesReason] = useState('');
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isTrajectoryModalOpen, setIsTrajectoryModalOpen] = useState(false);
  const [isLabelPrinting, setIsLabelPrinting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [downloads, setDownloads] = useState<{id: string, name: string, date: string, status: string}[]>([]);
  const [newProgressDesc, setNewProgressDesc] = useState('');
  const [newProgressAmount, setNewProgressAmount] = useState('');

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState('');
  const [isAddingRemark, setIsAddingRemark] = useState(false);
  const [isViewRemarkDetail, setIsViewRemarkDetail] = useState(false);
  const [remarkHistoryData, setRemarkHistoryData] = useState<any[]>([]);
  const [tempRemark, setTempRemark] = useState('');

  const handleCloseOrder = () => {
    if (!selectedOrder) return;
    if (window.confirm('确定要关闭该订单吗？此操作不可撤销。')) {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      setOrders(orders.map(order => {
        if (order.id === selectedOrder) {
          const newProgress = {
            id: `p-${Date.now()}`,
            time: now,
            description: '管理员手动关闭订单',
            items: '-',
            amountChange: '-'
          };
          return {
            ...order,
            status: 'closed',
            statusLabel: '已关闭',
            progress: [...(order.progress || []), newProgress]
          };
        }
        return order;
      }));
      setSelectedOrder(null);
    }
  };

  const handleUpdateRemark = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const newHistory = [
          ...(order.remarksHistory || []),
          { author: '中台账号', time: now, text: tempRemark }
        ];
        return {
          ...order,
          remark: tempRemark,
          remarksHistory: newHistory
        };
      }
      return order;
    }));
    setIsAddingRemark(false);
  };

  const handleInitiateAfterSales = (orderId: string, type: 'refund' | 'return') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'after_sales', 
            statusLabel: '售后处理',
            progress: [
              ...(order.progress || []),
              { id: `p-${Date.now()}`, time: new Date().toLocaleString(), description: `发起售后申请 - ${type === 'refund' ? '仅退款' : '退货退款'}`, items: '已选商品', amountChange: '-' }
            ]
          } 
        : order
    ));
    if (selectedOrder === orderId) {
       setSelectedOrder(null);
    }
    alert(`已发起${type === 'refund' ? '仅退款' : '退货退款'}售后流程，系统已通知主管审批。请在售后处理页签跟进。`);
  };

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
          description: `已发起相关部门工单: ${newProgressDesc}`,
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
    alert('已成功发起对应部门工单');
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
            return { ...item, status: 'after_sales', statusLabel: '待审核' };
          }
          return item;
        });
        
        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: '发起售后，待审核',
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
    const orderData = orders.find(o => o.id === selectedOrder);
    const isCrossBorder = orderData?.deliveryMethod === '跨境快递';

    // Auto-fill logic for SF if cross-border and auto mode selected
    let finalTrackingNo = trackingNumber;
    if (isCrossBorder && (shipmentMode === 'auto-sf' || !shipmentMode)) {
      finalTrackingNo = `SF${Math.floor(Math.random() * 1000000000000)}`;
    }
    
    setOrders(prevOrders => {
      const orderIndex = prevOrders.findIndex(o => o.id === selectedOrder);
      if (orderIndex === -1) return prevOrders;
      
      const order = prevOrders[orderIndex];
      const isPartial = selectedItems.length < order.items.length;
      
      if (isPartial) {
        const shippedItems = order.items.filter(i => selectedItems.includes(i.id)).map(i => ({ 
          ...i, 
          status: 'shipped', 
          statusLabel: '已发货',
          trackingNumber: finalTrackingNo
        }));
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
          shipments: finalTrackingNo ? [{ id: `PKG-${Date.now()}`, company: isCrossBorder ? '顺丰速运' : '快递', trackingNumber: finalTrackingNo, contents: `发货 ${shippedItems.length} 件` }] : [],
          progress: [
            { id: `p-${Date.now()}-1`, time: now, description: isCrossBorder ? `顺丰面单已自动下载并关联海关，单号: ${finalTrackingNo}` : '子订单生成并已发货', items: `共 ${shippedItems.length} 件`, amountChange: '-' }
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
          selectedItems.includes(item.id) ? { ...item, status: 'shipped', statusLabel: '已发货', trackingNumber: finalTrackingNo } : item
        );
        const newProgress = {
          id: `p-${Date.now()}`, time: now, description: isCrossBorder ? `顺丰面单已自动下载并关联海关，单号: ${finalTrackingNo}` : '商品发货', items: `已选 (${selectedItems.length}件)`, amountChange: '-'
        };
        const newOrders = [...prevOrders];
        newOrders[orderIndex] = { 
          ...order, 
          status: 'shipped',
          statusLabel: '已发货',
          items: updatedItems,
          shipments: finalTrackingNo ? [...(order.shipments || []), { id: `PKG-${Date.now()}`, company: isCrossBorder ? '顺丰速运' : '快递', trackingNumber: finalTrackingNo, contents: `发货 ${selectedItems.length} 件` }] : (order.shipments || []),
          progress: [...(order.progress || []), newProgress]
        };
        return newOrders;
      }
    });
    
    setIsShipModalOpen(false);
    setTrackingNumber('');
    setShipmentMode(null);
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
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">自营订单</h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              disabled={selectedOrderIds.length === 0}
              className={`w-full md:w-auto text-xs font-bold uppercase tracking-widest px-8 py-3 transition-colors shadow-lg shadow-black/10 ${
                selectedOrderIds.length > 0 
                  ? 'bg-black text-white hover:bg-zinc-800 cursor-pointer' 
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
              }`}
            >
              导出自营订单
            </button>
          </div>
        </div>

        <div className="sticky top-0 bg-white z-10 pt-2 -mx-4 px-4">
          <div className="flex gap-4 md:gap-8 border-b border-zinc-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1">
            <button onClick={() => setActiveTab('all')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'all' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>全部订单</button>
            <button onClick={() => setActiveTab('pending_payment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_payment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待付款</button>
            <button onClick={() => setActiveTab('pending_confirmation')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_confirmation' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待确认</button>
            <button onClick={() => setActiveTab('pending_shipment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_shipment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待发货</button>
            <button onClick={() => setActiveTab('shipped')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'shipped' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已发货</button>
            <button onClick={() => setActiveTab('after_sales')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'after_sales' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>售后处理</button>
            <button onClick={() => setActiveTab('completed')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'completed' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已完成</button>
            <button onClick={() => setActiveTab('closed')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'closed' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已关闭</button>
          </div>

          {activeTab !== 'downloads' && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px] flex items-stretch border border-zinc-200 focus-within:border-black bg-white transition-colors overflow-hidden">
                  <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="bg-zinc-50 outline-none text-xs font-bold px-3 py-2 text-zinc-600 appearance-none cursor-pointer hover:bg-zinc-100 border-r border-zinc-200 min-w-[100px] h-full"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto', paddingRight: '1.5rem' }}
                  >
                    {['订单号', '主单号', '支付单号', '商品名称', '货号', '购买人', '收件人'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input 
                      type="text" 
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={`输入${searchType}进行搜索...`} 
                      className="w-full h-full pl-10 pr-4 py-2 text-sm outline-none bg-transparent" 
                    />
                  </div>
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
        </div>

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
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest items-center">
            <div className="col-span-3">商品明细 (名称/货号)</div>
            <div className="col-span-3">收件信息</div>
            <div className="col-span-1 text-center">配送 / 物流</div>
            <div className="col-span-1 text-right">结算金额</div>
            <div className="col-span-1 text-center">状态</div>
            <div className="col-span-3 text-right">快捷操作</div>
          </div>

          {filteredOrders
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(order => (
            <div key={order.id} className={`border-b border-zinc-200 hover:border-black transition-colors bg-white mb-4 shadow-sm relative ${selectedOrderIds.includes(order.id) ? 'bg-zinc-50/50 border-l-4 border-l-black' : ''}`}>
              {/* Order Header */}
              <div className="bg-zinc-50 px-4 md:px-6 py-3 border-b border-zinc-200 flex flex-wrap items-center gap-2 md:gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <input 
                    type="checkbox" 
                    className="accent-black h-4 w-4"
                    checked={selectedOrderIds.includes(order.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedOrderIds([...selectedOrderIds, order.id]);
                      else setSelectedOrderIds(selectedOrderIds.filter(id => id !== order.id));
                    }}
                  />
                  <div className="flex items-baseline gap-2 flex-col md:flex-row">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-0.5">订单编号 / 主单ID</span>
                      <span className="font-bold text-xs font-mono tracking-tighter break-all max-w-[200px] leading-tight flex flex-wrap">
                        {order.id.split('').map((char, i) => <span key={i}>{char}</span>)}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 md:mt-0">{order.date}</span>
                  </div>
                </div>
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
              {order.remark && (
                <div 
                  onClick={() => {
                    setRemarkHistoryData(order.remarksHistory || [{ author: '管理员', time: order.date, text: order.remark }]);
                    setIsViewRemarkDetail(true);
                  }}
                  className="px-4 md:px-6 py-1.5 bg-yellow-50/50 border-b border-zinc-100 text-[10px] text-yellow-800 flex items-center gap-2 hover:bg-yellow-100 transition-colors cursor-pointer"
                >
                  <FileText size={12} className="text-yellow-600" />
                  <span className="font-medium">订单备注: {order.remark}</span>
                  <span className="text-[9px] text-zinc-400 font-bold ml-auto uppercase tracking-widest">点击查看详细</span>
                </div>
              )}
              {/* Order Body */}
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 md:items-center">
                <div className="md:col-span-3">
                  <div className="flex gap-4 items-start">
                    <img 
                      src={order.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80'} 
                      className="w-14 h-14 object-cover rounded-sm border border-zinc-100"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate mb-1 leading-tight">{order.productName}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">#{order.items?.[0]?.productNumber || '无'}</div>
                        <div className="text-[10px] text-zinc-400 font-bold tracking-tighter">x {order.itemCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:contents gap-4 border-t border-zinc-100 pt-4 md:border-none md:pt-0">
                  <div className="md:col-span-3 md:pr-4">
                    <div className="text-xs text-zinc-500 md:hidden mb-1 font-bold italic">收件信息</div>
                    <div className="text-xs font-bold mb-1">{order.buyerName} ({order.buyerPhone})</div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[10px] text-zinc-500 truncate" title={order.shippingAddress}>{order.shippingAddress}</div>
                      {order.status === 'pending_shipment' && (
                        <button onClick={(e) => { e.stopPropagation(); alert('修改地址功能开发中'); }} className="text-[9px] text-blue-600 hover:underline shrink-0">修改地址</button>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1 text-center">
                    <div className="text-xs text-zinc-500 md:hidden mb-1 font-bold italic">配送/物流</div>
                    <div 
                      className="text-[10px] font-bold mb-1 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setFilterDelivery(order.deliveryMethod)}
                    >
                      {order.deliveryMethod}
                    </div>
                    {order.shipments?.[0] && (
                      <div className="text-[9px] font-mono text-zinc-500 tracking-tighter bg-zinc-100 px-1 inline-block rounded mb-1">
                        {order.shipments[0].trackingNumber}
                      </div>
                    )}
                    <div 
                      className="text-[10px] text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setFilterWarehouse(order.warehouse)}
                    >
                      {order.warehouse}
                    </div>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <div className="text-xs text-zinc-500 md:hidden mb-1 font-bold italic">结算金额</div>
                    <div className="text-base font-black tracking-tighter">
                      <span className="text-[10px] mr-0.5 text-zinc-400 font-normal">{getCurrencySymbol(order.warehouse)}</span>
                      {order.totalPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="md:col-span-1 text-center">
                    <div className="text-xs text-zinc-500 md:hidden mb-1 font-bold italic">状态</div>
                    <div className={`text-[9px] font-bold px-2 py-1 uppercase tracking-wider inline-block ${
                      getOrderOverallStatusLabel(order, activeTab).includes('部分') ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                      order.status === 'pending_payment' ? 'bg-red-50 text-red-700 border border-red-100' :
                      order.status === 'pending_confirmation' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                      order.status === 'pending_shipment' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      order.status === 'shipped' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      order.status === 'after_sales' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                      order.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                      'bg-zinc-50 text-zinc-700 border border-zinc-200'
                    }`}>
                      {getOrderOverallStatusLabel(order, activeTab)}
                    </div>
                  </div>
                  {/* Quick Actions */}
                  <div className="md:col-span-3 flex flex-wrap gap-2 md:justify-end items-center">
                    {order.status === 'pending_payment' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); handleCloseOrder(); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">关闭</button>
                        <button onClick={(e) => { e.stopPropagation(); alert('改价功能开发中'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">改价</button>
                      </>
                    )}
                    {order.status === 'pending_confirmation' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); alert('确认功能开发中'); }} className="text-[10px] font-bold bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors shadow-sm">确认</button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); handleCloseOrder(); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">退款</button>
                      </>
                    )}
                    {order.status === 'pending_shipment' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); setIsShipModalOpen(true); }} className="text-[10px] font-bold bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors shadow-sm">发货</button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); handleCloseOrder(); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">退款</button>
                        <button onClick={(e) => { e.stopPropagation(); alert('此功能将取消订单的已确认状态并退回上一步'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white text-orange-600 hover:border-orange-600 hover:bg-orange-50 transition-colors">取消确认</button>
                        {order.shipments?.some(s => s.trackingNumber.toUpperCase().startsWith('SF')) && (
                          <button onClick={(e) => { e.stopPropagation(); setIsLabelPrinting(true); setTimeout(() => { setIsLabelPrinting(false); alert('顺丰面单已生成并发送至打印队列'); }, 1200); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors flex items-center gap-1">
                            <FileText size={10} />
                            打印面单
                          </button>
                        )}
                      </>
                    )}
                    {(order.status === 'shipped' || order.status === 'delivering' || order.status === 'ready_for_pickup') && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); alert('订单完结功能开发中'); }} className="text-[10px] font-bold bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors shadow-sm">订单完结</button>
                        <button onClick={(e) => { e.stopPropagation(); handleInitiateAfterSales(order.id, 'refund'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">仅退款</button>
                        <button onClick={(e) => { e.stopPropagation(); handleInitiateAfterSales(order.id, 'return'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">退货退款</button>
                      </>
                    )}
                    {order.status === 'after_sales' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); alert('订单完结功能开发中'); }} className="text-[10px] font-bold bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors shadow-sm">订单完结</button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); setIsAfterSalesModalOpen(true); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">售后处理</button>
                      </>
                    )}
                    {order.status === 'completed' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleInitiateAfterSales(order.id, 'return'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">退货退款</button>
                        <button onClick={(e) => { e.stopPropagation(); handleInitiateAfterSales(order.id, 'refund'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">仅退款</button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedOrder(order.id)}
                      className="hidden md:flex w-8 h-8 border border-zinc-200 items-center justify-center hover:border-black transition-colors bg-white"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
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
      {selectedOrderData ? (
        <div className="fixed inset-0 z-50 flex justify-end p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-[800px] bg-white shadow-2xl flex flex-col h-full rounded-xl overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 bg-zinc-50">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">主单 ID / 订单详情</div>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black uppercase tracking-tight font-mono">{ "15744202606120931289179439" }</h2>
                  {selectedOrderData.manager && (
                    <div className="bg-white border border-zinc-200 px-3 py-1 flex items-center gap-2 rounded-full shadow-sm">
                      <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold">主理人</span>
                      <span className="text-xs font-black">{selectedOrderData.manager}</span>
                    </div>
                  )}
                </div>
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
            {/* Order Info Bar - Neatly aligned pairs */}
            <div className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-lg overflow-hidden mb-6 shadow-sm">
              <div className="bg-white p-4 flex justify-between items-center transition-colors hover:bg-zinc-50">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">子单 ID</div>
                <div className="text-xs font-mono font-bold select-all text-blue-600">{selectedOrderData.id}</div>
              </div>
              <div className="bg-white p-4 flex justify-between items-center transition-colors hover:bg-zinc-50">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">下单时间</div>
                <div className="text-xs font-mono text-zinc-800">{selectedOrderData.date}</div>
              </div>
              <div className="bg-white p-4 flex justify-between items-center transition-colors hover:bg-zinc-50">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">支付单 ID</div>
                <div className="text-xs font-mono font-bold text-zinc-700 select-all">PAY_993847552011</div>
              </div>
              <div className="bg-white p-4 flex justify-between items-center transition-colors hover:bg-zinc-50">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">支付时间</div>
                <div className="text-xs font-mono text-zinc-800">2024-08-16 09:32</div>
              </div>
            </div>

            <div className="flex flex-col gap-6 mb-6 pb-6 border-b border-zinc-100">
              
              {/* Box 1: 购买人与收件信息 Compact Block */}
              <div className="border border-zinc-200 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Purchaser Info - Left Side */}
                <div className="bg-blue-50/20 p-4 border-b md:border-b-0 md:border-r border-zinc-200 w-full md:w-[35%] flex flex-col justify-center">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 购买账号</div>
                  <div className="flex items-center gap-3">
                    <img 
                      src={(selectedOrderData as any).purchaser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&q=80'} 
                      className="w-10 h-10 rounded-full shadow-sm border border-zinc-100"
                      alt="" 
                    />
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-black">{(selectedOrderData as any).purchaser?.nickname || '微信昵称'}</span>
                       <span className="text-[11px] font-mono text-zinc-500 font-bold">{(selectedOrderData as any).purchaser?.phone || selectedOrderData.buyerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Recipient Details & ID Auth - Right Side */}
                <div className="flex-1 p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 收件信息</div>
                    <div className="text-sm font-black text-zinc-900 mb-1">{selectedOrderData.buyerName} <span className="font-mono text-zinc-600 ml-2">{selectedOrderData.buyerPhone}</span></div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs leading-relaxed text-zinc-600 font-medium truncate max-w-sm" title={selectedOrderData.shippingAddress}>{selectedOrderData.shippingAddress}</span>
                       {selectedOrderData.status === 'pending_shipment' && (
                         <button onClick={() => { alert('修改地址功能开发中'); }} className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline shrink-0 font-bold ml-1">修改</button>
                       )}
                    </div>
                  </div>

                  {/* ID Verification for Cross-Border or High Value */}
                  {(selectedOrderData.deliveryMethod === '跨境快递' || selectedOrderData.totalPrice > 5000) && (
                    <div className="md:border-l border-zinc-200 md:pl-4 min-w-[160px]">
                       <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                         <CheckCircle size={10} /> 已实名
                       </div>
                       <div className="text-[11px] font-bold mb-0.5">{(selectedOrderData as any).purchaser?.realName || selectedOrderData.buyerName}</div>
                       <div className="text-[10px] font-mono font-bold tracking-tight text-zinc-500">{((selectedOrderData as any).purchaser?.idNumber || '310*********001X').replace(/^(\d{3}).+(\d{4}.)$/, "$1**********$2")}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Fulfillment */}
              <div className="w-full border border-zinc-200 rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row gap-6">
                
                {/* 履约与物流 */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-100 pb-2">履约与物流信息</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter mb-1">配送方式</div>
                        <div className="text-sm font-black text-blue-600 uppercase tracking-tight">
                          {selectedOrderData.deliveryMethod === '跨境快递' ? '跨境快递' : 
                           selectedOrderData.deliveryMethod === '门店自提' ? '门店自提' : '极速快递'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter mb-1">分发仓库</div>
                        <div className="text-sm font-bold text-zinc-800">{selectedOrderData.warehouse}</div>
                      </div>
                    </div>

                    {/* Dynamic Logistics/Tracking Info based on status and delivery mode */}
                    <div className="bg-zinc-50 border border-zinc-100 rounded p-3 flex flex-col gap-3 shrink-0">
                        {/* 跨境快递专属 面单下载 */}
                        {selectedOrderData.deliveryMethod === '跨境快递' && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-bold">跨境报关单/面单</span>
                            <button className="text-blue-600 hover:text-blue-800 hover:underline font-bold text-[10px] uppercase border border-blue-200 bg-white px-2 py-1 rounded-sm shadow-sm flex items-center gap-1">
                              <Download size={10} /> 下载面单
                            </button>
                          </div>
                        )}

                        {/* 已发货状态 */}
                        {(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'completed') && (
                          <div className={`space-y-2 ${selectedOrderData.deliveryMethod === '跨境快递' ? 'border-t border-zinc-200 pt-3' : ''}`}>
                            <div className="flex justify-between items-start text-xs">
                              <div>
                                <span className="text-zinc-500 font-bold block mb-0.5 text-[9px] uppercase tracking-wider">发货单号</span>
                                <span className="font-mono font-bold tracking-tight text-zinc-800 select-all">{selectedOrderData.shipments?.[0]?.trackingNumber || 'SF883901238472KL'}</span>
                              </div>
                              <button className="text-zinc-600 hover:text-black hover:underline font-bold text-[10px] border border-zinc-200 bg-white px-2 py-1 rounded-sm shadow-sm">
                                查看物流轨迹
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 退款/售后状态 */}
                        {(selectedOrderData.status === 'after_sales' || selectedOrderData.status === 'pending_refund' || selectedOrderData.status === 'refunded') && (
                           <div className={`space-y-2 ${selectedOrderData.deliveryMethod === '跨境快递' ? 'border-t border-zinc-200 pt-3' : ''}`}>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-zinc-500 font-bold flex-1 text-[9px] uppercase tracking-wider">发货单号</span>
                               <span className="font-mono tracking-tight text-zinc-800">{selectedOrderData.shipments?.[0]?.trackingNumber || 'SF883901238472KL'}</span>
                             </div>
                             <div className="flex justify-between items-center text-[10px]">
                               <span className="text-red-500 font-bold flex-1 uppercase tracking-wider">退回单号 (快递)</span>
                               <span className="font-mono tracking-tight text-red-600">RTN-99882231K</span>
                             </div>
                             <div className="flex justify-between items-center text-[10px]">
                               <span className="text-orange-500 font-bold flex-1 uppercase tracking-wider">退款流水号</span>
                               <span className="font-mono tracking-tight text-orange-600 select-all">REF-229983719</span>
                             </div>
                           </div>
                        )}
                        
                        {/* 待发货 / 其他未发货状态时 */}
                        {!(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'completed' || selectedOrderData.status === 'after_sales' || selectedOrderData.status === 'pending_refund' || selectedOrderData.status === 'refunded') && (
                           <div className="text-[10px] text-zinc-400 font-medium italic mt-1">暂无物流轨迹信息，等待发货分配。</div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="w-px bg-zinc-100 hidden md:block"></div>

                {/* 订单备注 / 跟进记录 */}
                <div className="flex-1 flex flex-col pt-4 border-t border-zinc-100 md:border-t-0 md:pt-0">
                   <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2 border-b border-zinc-100 pb-2">内部跟进记录与备注</h4>
                   <div className="space-y-3 flex-1 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
                      {(selectedOrderData.remarksHistory || []).slice().reverse().map((rem: any, idx: number) => (
                        <div key={idx} className={`p-3 rounded-sm border ${idx === 0 ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-zinc-50 border-zinc-100'}`}>
                           <div className="flex justify-between items-baseline mb-1">
                              <span className="text-[10px] font-black text-zinc-800">{rem.author}</span>
                              <span className="text-[9px] font-mono text-zinc-400 tracking-tighter">{rem.time}</span>
                           </div>
                           <div className="text-xs text-zinc-600 leading-relaxed font-medium">{rem.text}</div>
                        </div>
                      ))}
                   </div>
                   
                   <div className="mt-4 flex gap-2 pt-2">
                       <input 
                         type="text" 
                         value={tempRemark}
                         onChange={(e) => setTempRemark(e.target.value)}
                         placeholder="添加新记录..."
                         className="flex-1 text-[10px] border border-zinc-200 bg-zinc-50 px-3 py-2 outline-none focus:bg-white focus:border-black transition-colors rounded-sm shadow-inner"
                       />
                       <button 
                         onClick={handleUpdateRemark}
                         className="bg-black text-white text-[9px] font-bold px-4 py-2 uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-sm rounded-sm"
                       >
                         新增
                       </button>
                   </div>
                </div>
              </div>
            </div>

            {(() => {
              const showsAfterSalesFlow = selectedOrderData.status === 'after_sales' || selectedOrderData.items.some((i: any) => i.status === 'after_sales');
              if (!showsAfterSalesFlow) return null;

              const label = selectedOrderData.statusLabel || '';
              
              let currentStage = 1;
              if (label.includes('顾客退回') || label.includes('待寄回')) currentStage = 2;
              else if (label.includes('仓库验货') || label.includes('验货') || label.includes('待退款')) currentStage = 3;
              else if (label.includes('完成') || label.includes('已完成') || label.includes('已驳回')) currentStage = 4;

              const stages = [
                { id: 1, name: '待审核' },
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
                        <span>售后流程审核中。目前正在等待审核顾客发送的售后凭证信息。</span>
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
                        <span>审核已通过。正在等待顾客填入退货快递单号...</span>
                      </div>
                    )}
                    {currentStage === 3 && (
                      <div className="bg-white border border-orange-200 px-4 py-3 text-xs text-orange-800 shadow-sm">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 font-bold"><Package size={14} className="text-orange-500" /> 仓库验单追踪: <span className="font-mono text-black">{selectedOrderData.afterSalesTrackingNo || '无单号'}</span></div>
                           <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">待验货</span>
                         </div>
                         <div className="text-zinc-500">包裹进入仓库环节。质检部将进行二次拆包校验防伪扣与商品情况。</div>
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

            {/* Product Details & Financials */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">商品明细</h3>
                {selectedItems.length > 0 && (
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">已选 {selectedItems.length} 件商品</span>
                )}
              </div>
              
              <div className="border border-zinc-200 rounded-lg overflow-hidden mb-8">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-100 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    <tr>
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          className="accent-black" 
                          onChange={(e) => {
                            if (e.target.checked) setSelectedItems(selectedOrderData.items.map((i: any) => i.id));
                            else setSelectedItems([]);
                          }}
                          checked={selectedItems.length === selectedOrderData.items.length && selectedOrderData.items.length > 0}
                        />
                      </th>
                      <th className="p-4">商品概览 (货号/单价)</th>
                      <th className="p-4 text-right">数量</th>
                      <th className="p-4 text-right">合计</th>
                      <th className="p-4 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 bg-white">
                    {selectedOrderData.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50">
                        <td className="p-4">
                          <input 
                            type="checkbox" 
                            className="accent-black" 
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedItems([...selectedItems, item.id]);
                              else setSelectedItems(selectedItems.filter(id => id !== item.id));
                            }}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex gap-4 items-center">
                            <img src={selectedOrderData.image} className="w-12 h-12 object-cover rounded-sm border border-zinc-100" alt="" />
                            <div>
                               <div className="text-xs font-black mb-1 truncate max-w-[220px]">{item.name}</div>
                               <div className="flex items-center gap-2">
                                 <span className="text-[9px] text-zinc-400 font-mono">#{item.productNumber}</span>
                                 <span className="text-[9px] text-zinc-800 font-black">{getCurrencySymbol(selectedOrderData.warehouse)} {item.price.toLocaleString()}</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-xs">x{item.count}</td>
                        <td className="p-4 text-right font-black text-xs">{getCurrencySymbol(selectedOrderData.warehouse)} {(item.price * item.count).toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <span className={`text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter ${
                            item.status.includes('pending') ? 'bg-orange-50 text-orange-600' : 'bg-zinc-100'
                          }`}>{item.statusLabel}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Financial Breakdown Section */}
                <div className="bg-zinc-50/60 p-6 border-t border-zinc-100 flex justify-end">
                   <div className="w-full max-w-[320px] space-y-3">
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-zinc-500 font-bold uppercase tracking-tight">商品总额 (Subtotal)</span>
                         <span className="font-black">{getCurrencySymbol(selectedOrderData.warehouse)} {selectedOrderData.totalPrice.toLocaleString()}</span>
                      </div>
                      
                      {selectedOrderData.deliveryMethod === '跨境快递' && (
                        <>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-bold uppercase tracking-tight underline decoration-zinc-200 underline-offset-4">国际物流费用 (Shipping)</span>
                            <span className="font-bold text-zinc-800">+{getCurrencySymbol(selectedOrderData.warehouse)} 150</span>
                          </div>
                        </>
                      )}

                      <div className="pt-4 mt-4 border-t-2 border-zinc-200 flex justify-between items-baseline">
                         <div className="flex flex-col">
                           <span className="text-sm font-black uppercase tracking-tight">结算总额</span>
                           <span className="text-[9px] text-zinc-400 font-bold uppercase">Total Amount</span>
                         </div>
                         <div className="text-right">
                           <div className="text-2xl font-black tracking-tighter text-black leading-none">
                             <span className="text-xs font-normal mr-1">{getCurrencySymbol(selectedOrderData.warehouse)}</span>
                             {(selectedOrderData.totalPrice + (selectedOrderData.deliveryMethod === '跨境快递' ? selectedOrderData.totalPrice * 0.091 + 150 : 0)).toLocaleString()}
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
                     {/* Order Progress Details */}
            <div className="mt-8 border-t border-zinc-100 pt-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">订单进程</h3>
                <CheckCircle size={14} className="text-zinc-300" />
              </div>
              <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
                {(selectedOrderData.progress || []).slice().reverse().map((p: any, idx: number) => (
                  <div key={p.id} className="relative group">
                    <div className={`absolute -left-[30px] top-1.5 w-[22px] h-[22px] rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all group-hover:scale-110 z-10 ${
                      idx === 0 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'
                    }`}>
                       {idx === 0 ? <Check size={10} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />}
                    </div>
                    <div>
                       <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
                          <span className="text-xs font-black text-zinc-900 leading-tight">{p.description}</span>
                          <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">{p.time}</span>
                       </div>
                       {(p.items !== '-' || p.amountChange !== '-') && (
                         <div className="flex gap-4 items-center mt-2 px-3 py-1.5 bg-zinc-50/50 rounded-sm border border-zinc-100 w-fit">
                           {p.items !== '-' && <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">对象: <span className="text-zinc-600">{p.items}</span></div>}
                           {p.amountChange !== '-' && (
                             <div className={`text-[9px] font-black uppercase tracking-tight ${p.amountChange.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                               变动: {p.amountChange}
                             </div>
                           )}
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual Progress Utility */}
              <div className="mt-12 p-6 bg-zinc-50 border border-zinc-100 rounded">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Wrench size={12} /> 手动记录进程
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">进程说明 / 备注</label>
                    <input 
                      type="text" 
                      placeholder="手动记录备注..." 
                      value={newProgressDesc}
                      onChange={(e) => setNewProgressDesc(e.target.value)}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs font-bold text-black focus:border-black outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">金额变动 (可选)</label>
                    <input 
                      type="text" 
                      placeholder="+¥0.00" 
                      value={newProgressAmount}
                      onChange={(e) => setNewProgressAmount(e.target.value)}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 text-xs font-bold text-black focus:border-black outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddManualProgress}
                    disabled={!newProgressDesc}
                    className="flex-1 bg-zinc-100 text-zinc-600 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-30 rounded-sm"
                  >
                    仅添加记录
                  </button>
                  <button 
                    onClick={handleCreateWorkOrder}
                    disabled={!newProgressDesc}
                    className="flex-1 bg-orange-600 text-white py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md shadow-orange-200 disabled:opacity-30 rounded-sm"
                  >
                    记录并转相关部门工单
                  </button>
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
                
                const showShipBtn = activeTab === 'pending_shipment' || (activeTab === 'all' && selectedOrderData.items.some((i: any) => i.status === 'pending_shipment'));
                const canShip = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'pending_shipment');

                const showConfirmStockBtn = activeTab === 'pending_confirmation' || (activeTab === 'all' && selectedOrderData.items.some((i: any) => i.status === 'pending_confirmation'));
                const canConfirmStock = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'pending_confirmation');

                const showProcessRefundBtn = activeTab === 'after_sales' || (activeTab === 'all' && selectedOrderData.items.some((i: any) => i.status === 'after_sales'));
                const canProcessRefund = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'after_sales');

                const showRefundBtn = ['pending_shipment', 'shipped', 'completed'].includes(activeTab) || 
                                      (activeTab === 'all' && selectedOrderData.items.some((i: any) => ['pending_shipment', 'shipped', 'completed'].includes(i.status)));
                const canRefund = selectedItems.length > 0 && selectedItemsData.every((i: any) => ['pending_shipment', 'shipped', 'completed'].includes(i.status));
                
                const isAllPendingShipment = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'pending_shipment');
                const isAllPendingConfirmation = selectedItems.length > 0 && selectedItemsData.every((i: any) => i.status === 'pending_confirmation');

                return (
                  <>
                    <div className="flex flex-wrap gap-2 w-full justify-end items-center">
                      {selectedOrderData.status === 'pending_payment' && (
                        <>
                          <button onClick={() => { handleCloseOrder(); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">关闭</button>
                          <button onClick={() => { setTempPrice(selectedOrderData.totalPrice.toString()); setIsEditingPrice(true); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">改价</button>
                        </>
                      )}

                      {selectedOrderData.status === 'pending_confirmation' && (
                        <>
                          <button onClick={() => { alert('确认功能开发中'); }} className="text-xs font-bold bg-black text-white px-6 py-2 hover:bg-zinc-800 transition-colors shadow-sm">确认</button>
                          <button onClick={() => { handleCloseOrder(); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">退款</button>
                        </>
                      )}

                      {selectedOrderData.status === 'pending_shipment' && (
                        <>
                          <button onClick={() => { setIsShipModalOpen(true); }} className="text-xs font-bold bg-black text-white px-6 py-2 hover:bg-zinc-800 transition-colors shadow-sm">发货</button>
                          <button onClick={() => { handleCloseOrder(); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">退款</button>
                          {selectedOrderData.shipments?.some(s => s.trackingNumber.toUpperCase().startsWith('SF')) && (
                            <button onClick={(e) => { e.stopPropagation(); setIsLabelPrinting(true); setTimeout(() => { setIsLabelPrinting(false); alert('顺丰面单已生成并发送至打印队列'); }, 1200); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors flex items-center gap-1">
                              <FileText size={12} /> 打印面单
                            </button>
                          )}
                        </>
                      )}

                      {(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'delivering' || selectedOrderData.status === 'ready_for_pickup') && (
                        <>
                          <button onClick={() => { alert('订单完结功能开发中'); }} className="text-xs font-bold bg-black text-white px-6 py-2 hover:bg-zinc-800 transition-colors shadow-sm">订单完结</button>
                          <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'refund'); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">仅退款</button>
                          <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'return'); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">退货退款</button>
                        </>
                      )}

                      {selectedOrderData.status === 'completed' && (
                        <>
                          <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'refund'); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">仅退款</button>
                          <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'return'); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">退货退款</button>
                        </>
                      )}
                      {selectedOrderData.status === 'after_sales' && (
                        <>
                          {(selectedOrderData.statusLabel === '售后处理' || selectedOrderData.statusLabel === '待审核') && (
                            <button onClick={() => { setIsAfterSalesModalOpen(true); }} className="text-xs font-bold border border-zinc-200 px-6 py-2 bg-white hover:border-black transition-colors">售后审批</button>
                          )}
                          {(selectedOrderData.statusLabel === '待顾客退回' || selectedOrderData.statusLabel === '待仓库验货') && (
                            <button onClick={() => {
                              const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
                              const isExchange = selectedOrderData.progress.some((p: any) => p.description.includes('同意换货') || p.description.includes('申请售后 - 换货'));
                              setOrders(orders.map(o => o.id === selectedOrderData.id ? { 
                                ...o, 
                                statusLabel: isExchange ? '待重新发货' : '待退款',
                                progress: [{ id: `p-${Date.now()}`, time: now, description: '仓库已签收退货: 验货合格', items: '全部商品', amountChange: '-' }, ...(o.progress || [])]
                              } : o));
                            }} className="text-xs font-bold border border-zinc-200 bg-white px-6 py-2 hover:border-black transition-colors">确认入库 / 验货合格</button>
                          )}
                          {selectedOrderData.statusLabel === '待重新发货' && (
                            <button onClick={() => { setIsShipModalOpen(true); }} className="text-xs font-bold bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-colors shadow-sm">重新发货</button>
                          )}
                          {(selectedOrderData.statusLabel === '处理中' || selectedOrderData.statusLabel === '待退款') && (
                            <button onClick={() => {
                              const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
                              setOrders(orders.map(o => o.id === selectedOrderData.id ? { 
                                ...o, 
                                status: 'refunded', 
                                statusLabel: '售后已退款',
                                progress: [{ id: `p-${Date.now()}`, time: now, description: '财务退款成功: 原路退回', items: '全部商品', amountChange: '-' }, ...(o.progress || [])]
                              } : o));
                              setSelectedOrder(null);
                            }} className="text-xs font-bold bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition-colors shadow-sm">完成退款</button>
                          )}
                          <button onClick={() => { alert('订单关闭操作成功'); setSelectedOrder(null); }} className="text-xs font-bold bg-black text-white px-6 py-2 hover:bg-zinc-800 transition-colors shadow-sm">订单完结</button>
                        </>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null}
      {/* Confirm Receipt Modal */}
      {isConfirmModalOpen && selectedOrderData ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsConfirmModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white shadow-2xl flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight mb-2">确认收货</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">确认顾客已收到全部商品？此操作将使订单进入“已完成”状态。</p>
            </div>
            <div className="grid grid-cols-2 border-t border-zinc-100">
              <button onClick={() => setIsConfirmModalOpen(false)} className="py-4 text-xs font-bold text-zinc-400 hover:text-black hover:bg-zinc-50 transition-colors uppercase">取消</button>
              <button 
                onClick={() => {
                  setOrders(orders.map(o => o.id === selectedOrderData.id ? { ...o, status: 'completed', statusLabel: '已完成' } : o));
                  setIsConfirmModalOpen(false);
                  setSelectedOrder(null);
                }} 
                className="py-4 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors uppercase border-l border-zinc-100"
              >
                确认收货
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Ship Modal */}
      {isShipModalOpen && selectedOrderData ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsShipModalOpen(false)}></div>
          <div className="relative w-[400px] bg-white shadow-2xl flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-lg font-black uppercase tracking-tight">自营发货履约流程</h2>
              <button onClick={() => setIsShipModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6 bg-zinc-50 p-4 border border-zinc-200">
                <div className="text-[10px] font-bold text-zinc-400 uppercase mb-2">配送属性与履约合规</div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-black">{selectedOrderData.deliveryMethod}</span>
                  {selectedOrderData.deliveryMethod === '跨境快递' && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 font-bold uppercase">关联海关数据</span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-500">{selectedOrderData.warehouse}</div>
              </div>

              {selectedOrderData.deliveryMethod === '跨境快递' && (
                <div className="mb-6 space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-600 text-white p-1 rounded-full"><Download size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-emerald-800">一键下载顺丰电子面单</div>
                        <div className="text-[10px] text-emerald-600 mt-1 leading-relaxed">系统将自动为跨境订单对接顺丰直邮接口，并自动同步清关信息至海关系统。</div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShipmentMode('auto-sf');
                      confirmShipment();
                    }}
                    className="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                  >
                    确认发货并下载顺丰面单
                  </button>
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
                    <div className="relative flex justify-center text-[10px] font-bold uppercase"><span className="bg-white px-4 text-zinc-400">或手动填写其他单号</span></div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">手动录入物流单号</label>
                  <input 
                    type="text" 
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="请输入物流跟踪 ID (Tracking No.)" 
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none font-mono"
                  />
                </div>
                <button 
                  onClick={() => {
                    setShipmentMode('manual');
                    confirmShipment();
                  }}
                  disabled={!trackingNumber}
                  className="w-full bg-white border border-zinc-200 text-black py-4 text-sm font-black uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50"
                >
                  确认手动发货
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* After Sales Modal */}
      {isAfterSalesModalOpen && selectedOrderData ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAfterSalesModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-lg font-black uppercase tracking-tight">售后审批 (审核)</h2>
              <button onClick={() => setIsAfterSalesModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-100 p-4 mb-6">
                <div className="text-xs font-bold text-orange-800 mb-1">高奢控制环：审核与凭证留存</div>
                <div className="text-xs text-orange-700">根据高客单价属性，售后要求通过企微留存沟通。通过后，顾客需提供防伪扣完好的实名照片，避免调包。审批决定后流程流向【仓库验货】。</div>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <button 
                    onClick={() => setAfterSalesDecision('refund_only')}
                    className={`border px-2 py-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'refund_only' ? 'border-black border-2 bg-zinc-50' : 'border-zinc-200 hover:border-black'}`}
                  >
                    <span className="text-sm font-bold">同意仅退款</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">拦截发货, 直接退款</span>
                  </button>
                  <button 
                    onClick={() => setAfterSalesDecision('refund')}
                    className={`border px-2 py-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'refund' ? 'border-black border-2 bg-zinc-50' : 'border-zinc-200 hover:border-black'}`}
                  >
                    <span className="text-sm font-bold">同意退货退款</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">寄回后退款</span>
                  </button>
                  <button 
                    onClick={() => setAfterSalesDecision('exchange')}
                    className={`border px-2 py-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'exchange' ? 'border-black border-2 bg-zinc-50' : 'border-zinc-200 hover:border-black'}`}
                  >
                    <span className="text-sm font-bold">同意换新</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">寄回后换新</span>
                  </button>
                  <button 
                    onClick={() => setAfterSalesDecision('reject')}
                    className={`border px-2 py-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'reject' ? 'border-red-600 border-2 bg-red-50' : 'border-zinc-200 hover:border-red-500'}`}
                  >
                    <span className="text-sm font-bold">驳回申请</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">拒绝此请求</span>
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

              {(afterSalesDecision === 'refund_only' || afterSalesDecision === 'refund' || afterSalesDecision === 'exchange') && (
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

                      const actionText = afterSalesDecision === 'refund_only' ? '同意仅退款' : afterSalesDecision === 'refund' ? '同意退货退款' : afterSalesDecision === 'exchange' ? '同意换货' : '驳回申请';
                      const newProgress = { id: `p-${Date.now()}`, time: now, description: `审核确认完毕: ${actionText}`, items: `已选 (${selectedItems.length}件)`, amountChange: '-' };

                      const updatedItems = order.items.map(item => {
                        if (selectedItems.includes(item.id)) {
                          // In a real app we'd map to 'warehouse_inspect', 'refunded' etc based on the action,
                          // For demo, we just mark as closed indicating the flow moved forward
                          return { ...item, status: 'after_sales', statusLabel: afterSalesDecision === 'reject' ? '售后已驳回' : afterSalesDecision === 'refund_only' ? '处理中' : '待顾客退回' };
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
      ) : null}

      {/* Trajectory Modal */}
      {isTrajectoryModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsTrajectoryModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-tight">物流全程轨迹</h3>
              <button onClick={() => setIsTrajectoryModalOpen(false)} className="text-zinc-400 hover:text-black"><X size={20} /></button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-8 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-zinc-100"></div>
                {[
                  { time: '2024-08-16 14:20', text: '顺丰速运 已揽收', location: '香港九龙集散中心', active: true },
                  { time: '2024-08-16 18:45', text: '离开香港九龙集散中心，正发往深圳皇岗口岸', location: '香港' },
                  { time: '2024-08-17 09:30', text: '订单已到达海关，等待清关作业', location: '深圳皇岗口岸' },
                  { time: '2024-08-17 14:00', text: '海关查验完成，征税放行', location: '深圳皇岗口岸' },
                  { time: '2024-08-18 08:15', text: '商品已进入顺丰国内干线网点', location: '深圳集散中心' }
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 bg-white ${step.active ? 'border-black' : 'border-zinc-200'}`}>
                      {step.active && <div className="absolute inset-0.5 bg-black rounded-full"></div>}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mb-1">{step.time}</div>
                    <div className={`text-xs font-bold ${step.active ? 'text-black' : 'text-zinc-600'}`}>{step.text}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{step.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Remark Detail Modal */}
      {isViewRemarkDetail ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsViewRemarkDetail(false)}></div>
          <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-tight">订单备注历史详情</h3>
              <button onClick={() => setIsViewRemarkDetail(false)} className="text-zinc-400 hover:text-black"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {remarkHistoryData && remarkHistoryData.length > 0 ? (
                  remarkHistoryData.map((item, idx) => (
                    <div key={idx} className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 relative group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                            {item.author.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-zinc-900">{item.author}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">{item.time}</span>
                      </div>
                      <div className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap pl-8 border-l-2 border-zinc-200 ml-3 py-1">
                        {item.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <FileText size={32} className="mx-auto text-zinc-200 mb-2" />
                    <p className="text-xs text-zinc-400 font-bold">暂无详细备注记录</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100 text-right bg-zinc-50">
              <button 
                onClick={() => setIsViewRemarkDetail(false)}
                className="bg-black text-white px-6 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
