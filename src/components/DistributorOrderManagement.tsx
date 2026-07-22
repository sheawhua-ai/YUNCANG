import { Search, ChevronRight, X, FileText, Truck, Wrench, CheckCircle, Check } from "lucide-react";
import { useState } from "react";
import { SearchableCombobox } from "./SearchableCombobox";
import { workOrderStore } from '../lib/workOrderStore';

const INITIAL_ORDERS = [
  // --- 待付款 (pending_payment) ---
  {
    id: 'DIST-2024-0816-NEW', type: 'distribution', date: '2024-08-16 09:30', brand: 'Chanel', productName: 'Chanel Classic Flap', spuCount: 1, itemCount: 1,
    buyerName: '周八', buyerPhone: '136****5555', buyerType: 'C端买家', deliveryMethod: '快递发货', warehouse: '香港直邮仓', 
    shippingMode: 'transit', supplierName: '欧洲表行', distributorName: '潮流买手A', shippingAddress: '上海市黄浦区...',
    totalPrice: 65000, totalCostPrice: 60000, status: 'pending_payment', statusLabel: '待付款',
    paymentType: 'full', paidAmount: 0,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-new', name: 'Chanel Classic Flap', sku: 'CH-CF-BLK', supplier: '欧洲表行', count: 1, price: 65000, status: 'pending_payment', statusLabel: '待付款' }],
    progress: [
      { id: 'p1', time: '2024-08-16 09:30', description: '买家下单，等待付款', items: '全部 (1件)', amountChange: '-' }
    ]
  },
  {
    id: 'DIST-2024-0815-A2', type: 'distribution', date: '2024-08-15 10:25', brand: 'Rolex', productName: 'Rolex Daytona', spuCount: 1, itemCount: 1,
    buyerName: '王五', buyerPhone: '138****1234', buyerType: 'C端买家', deliveryMethod: '快递发货', warehouse: '深圳保税仓', 
    shippingMode: 'transit', supplierName: '欧洲表行', distributorName: '轻奢尚品B', shippingAddress: '北京市朝阳区建国路...',
    totalPrice: 285000, totalCostPrice: 260000, status: 'pending_confirmation', statusLabel: '待供货商确认',
    paymentType: 'full', paidAmount: 285000,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-2', name: 'Rolex Daytona', sku: '116500LN', supplier: '欧洲表行', count: 1, price: 285000, status: 'pending_confirmation', statusLabel: '待供货商确认' }],
    progress: [
      { id: 'p1', time: '2024-08-15 10:30', description: '买家全款付款成功', items: '全部 (1件)', amountChange: '+¥285,000' }
    ]
  },
  {
    id: 'DIST-2024-0815-A3', type: 'distribution', date: '2024-08-15 11:20', brand: 'Patek Philippe', productName: 'Nautilus 5711', spuCount: 1, itemCount: 1,
    buyerName: '李总', buyerPhone: '139****9999', buyerType: 'C端买家', deliveryMethod: '快递发货', warehouse: '香港直邮仓', 
    shippingMode: 'transit', supplierName: '瑞士名表', distributorName: '高端定制D', shippingAddress: '上海市静安区...',
    totalPrice: 950000, totalCostPrice: 880000, status: 'pending_confirmation', statusLabel: '待供货商确认',
    paymentType: 'deposit', paidAmount: 150000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-3', name: 'Nautilus 5711', sku: 'PP-5711', supplier: '瑞士名表', count: 1, price: 950000, status: 'pending_confirmation', statusLabel: '待供货商确认' }],
    progress: [
      { id: 'p1', time: '2024-08-15 11:30', description: '买家支付定金成功', items: '全部 (1件)', amountChange: '+¥150,000' }
    ]
  },
  {
    id: 'DIST-2024-0814-B2', type: 'distribution', date: '2024-08-14 14:25', brand: 'Gucci', productName: 'Gucci Marmont', spuCount: 1, itemCount: 1,
    buyerName: '林八', buyerPhone: '135****7890', buyerType: 'C端买家', deliveryMethod: '快递发货', warehouse: '深圳保税仓', 
    shippingMode: 'dropship', supplierName: '米兰精品', distributorName: '潮流买手A', shippingAddress: '广州市天河区...',
    totalPrice: 18500, totalCostPrice: 16000, status: 'pending_shipment', statusLabel: '待发货',
    paymentType: 'full', paidAmount: 18500,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-5', name: 'Gucci Marmont', sku: 'G-MM-BLK', supplier: '米兰精品', count: 1, price: 18500, status: 'pending_shipment', statusLabel: '待发货' }],
    progress: [
      { id: 'p1', time: '2024-08-14 14:30', description: '买家全款付款成功', items: '全部 (1件)', amountChange: '+¥18,500' },
      { id: 'p2', time: '2024-08-14 16:00', description: '供货商确认有货', items: 'Gucci Marmont', amountChange: '-' }
    ]
  },
  {
    id: 'DIST-2024-0814-B3', type: 'distribution', date: '2024-08-14 16:20', brand: 'Dior', productName: 'Dior Saddle', spuCount: 1, itemCount: 1,
    buyerName: '吴九', buyerPhone: '139****1234', buyerType: 'C端买家', deliveryMethod: '快递发货', warehouse: '香港直邮仓', 
    shippingMode: 'transit', supplierName: '欧洲表行', distributorName: '潮流买手A', shippingAddress: '北京市海淀区...',
    totalPrice: 24500, totalCostPrice: 22000, status: 'supplier_shipped', statusLabel: '上游已发货 (待入库)',
    paymentType: 'full', paidAmount: 24500,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-dior', name: 'Dior Saddle', sku: 'D-SDL-BLK', supplier: '欧洲表行', count: 1, price: 24500, status: 'supplier_shipped', statusLabel: '上游已发货 (待入库)' }],
    shipments: [
      { id: 'PKG-UP-001', type: 'upstream', company: 'FedEx国际', trackingNumber: 'FX9988776655', contents: 'Dior Saddle (1件)' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-14 16:25', description: '买家全款付款成功', items: '全部 (1件)', amountChange: '+¥24,500' },
      { id: 'p2', time: '2024-08-15 09:00', description: '供货商已发货(段一)', items: '全部 (1件)', amountChange: '-' }
    ]
  },
  {
    id: 'DIST-2024-0813-C3', type: 'distribution', date: '2024-08-13 09:10', brand: 'Prada', productName: 'Prada Cleo', spuCount: 1, itemCount: 1,
    buyerName: '赵六', buyerPhone: '139****5678', buyerType: 'C端买家', deliveryMethod: '快递发货', warehouse: '香港直邮仓', 
    shippingMode: 'transit', supplierName: '欧洲表行', distributorName: '时尚优选C', shippingAddress: '上海市浦东新区...',
    totalPrice: 15200, totalCostPrice: 14000, status: 'after_sales', statusLabel: '售后处理',
    paymentType: 'full', paidAmount: 15200,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [{ id: 'item-6', name: 'Prada Cleo', sku: 'P-CLEO-WHT', supplier: '欧洲表行', count: 1, price: 15200, status: 'after_sales', statusLabel: '售后处理' }],
    progress: [
      { id: 'p1', time: '2024-08-13 09:15', description: '买家付款成功', items: '全部 (1件)', amountChange: '+¥15,200' },
      { id: 'p2', time: '2024-08-13 11:00', description: '供货商确认缺货', items: 'Prada Cleo', amountChange: '产生退款 ¥15,200' }
    ]
  },
  {
    id: 'DIST-2024-0812-D4', type: 'distribution', date: '2024-08-12 11:45', brand: 'Hermes', productName: 'Hermes Birkin 30', spuCount: 2, itemCount: 2,
    buyerName: '李七', buyerPhone: '137****1111', buyerType: 'C端买家', deliveryMethod: '快递发货', warehouse: '上海中转仓', 
    shippingMode: 'transit', supplierName: '巴黎代购A', distributorName: '轻奢尚品B', shippingAddress: '浙江省杭州市西湖区...',
    totalPrice: 155000, totalCostPrice: 140000, status: 'shipped', statusLabel: '已发货',
    paymentType: 'full', paidAmount: 155000,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-7', name: 'Hermes Birkin 30', sku: 'H-BK30-BLK', supplier: '巴黎代购A', count: 1, price: 120000, status: 'shipped', statusLabel: '已发货' },
      { id: 'item-8', name: 'Hermes Twilly', sku: 'H-TW-01', supplier: '巴黎代购A', count: 1, price: 35000, status: 'shipped', statusLabel: '已发货' }
    ],
    shipments: [
      { id: 'PKG-001', type: 'upstream', company: 'DHL国际', trackingNumber: 'DHL1029384756', contents: '全部商品由供货商发出' },
      { id: 'PKG-002', type: 'downstream', company: '顺丰速运', trackingNumber: 'SF1029384757', contents: 'Hermes Birkin 30 (1件)' },
      { id: 'PKG-003', type: 'downstream', company: '顺丰速运', trackingNumber: 'SF1029384758', contents: 'Hermes Twilly (1件)' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-12 11:50', description: '买家付款成功', items: '全部 (2件)', amountChange: '+¥155,000' },
      { id: 'p2', time: '2024-08-12 15:00', description: '供货商已发货', items: '全部 (2件)', amountChange: '-' },
      { id: 'p3', time: '2024-08-13 10:00', description: '中转仓签收并发出', items: '全部 (2件)', amountChange: '-' }
    ]
  }
];

export function DistributorOrderManagement() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchType, setSearchType] = useState('订单号');
  const [searchValue, setSearchValue] = useState('');
  const [filterSupplier, setFilterSupplier] = useState<string | null>(null);
  const [filterBuyer, setFilterBuyer] = useState<string | null>(null);
  const [filterDistributor, setFilterDistributor] = useState<string | null>(null);
  const [newProgressDesc, setNewProgressDesc] = useState('');
  const [newProgressAmount, setNewProgressAmount] = useState('');

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState('');

  // After-sales state
  const [isAfterSalesModalOpen, setIsAfterSalesModalOpen] = useState(false);
  const [afterSalesDecision, setAfterSalesDecision] = useState<'agree' | 'reject' | null>(null);
  const [afterSalesReason, setAfterSalesReason] = useState('');

  const handleUpdatePrice = () => {
    if (!selectedOrder) return;
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice < 0) return;
    
    const orderData = orders.find(o => o.id === selectedOrder);
    if (!orderData) return;
    
    if (orderData.totalCostPrice && newPrice < orderData.totalCostPrice) {
      alert(`修改后的订单总金额不能低于上游成本价 (¥${orderData.totalCostPrice.toLocaleString()})`);
      return;
    }

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

  const handleInitiateAfterSales = (orderId: string, type: 'refund' | 'return') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'after_sales', 
            statusLabel: '售后处理',
            progress: [
              ...(order.progress || []),
              { id: `p-${Date.now()}`, time: new Date().toLocaleString(), description: `发起售后申请 - ${type === 'refund' ? '仅退款' : '退货退款'}`, items: '全部', amountChange: '-' }
            ]
          } 
        : order
    ));
    if (selectedOrder === orderId) {
       setSelectedOrder(null);
    }
    alert(`已发起${type === 'refund' ? '仅退款' : '退货退款'}售后流程，请在售后处理页签跟进。`);
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

  const getCurrencySymbol = (warehouseName?: string) => {
    if (warehouseName?.includes('香港')) return 'HK$';
    if (warehouseName?.includes('欧洲') || warehouseName?.includes('Europe')) return '€';
    return '¥';
  };

  const filteredOrders = orders.filter(order => {
    let matchesTab = false;
    if (activeTab === 'all') {
      matchesTab = true;
    } else {
      matchesTab = order.status === activeTab;
    }

    if (!matchesTab) return false;

    if (filterSupplier && order.supplierName !== filterSupplier) return false;
    if (filterBuyer && order.buyerName !== filterBuyer) return false;
    if (filterDistributor && order.distributorName !== filterDistributor) return false;

    if (searchValue) {
      const query = searchValue.toLowerCase();
      if (searchType === '订单号') {
        if (!order.id.toLowerCase().includes(query)) return false;
      } else if (searchType === '支付单号') {
        // Mock checking payment ID, order.id is used as a proxy
        if (!order.id.toLowerCase().includes(query)) return false;
      } else if (searchType === '商品名称') {
        const hasItem = order.items.some(item => item.name.toLowerCase().includes(query));
        if (!hasItem) return false;
      } else if (searchType === '货号') {
        const hasItemInfo = order.items.some(item => item.sku.toLowerCase().includes(query));
        if (!hasItemInfo) return false;
      } else if (searchType === '购买人') {
        if (!order.buyerName?.toLowerCase().includes(query)) return false;
      } else if (searchType === '收件人') {
        if (!order.shippingInfo.recipient.toLowerCase().includes(query)) return false;
      }
    }

    return true;
  });

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  return (
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-80px)]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">分销订单管理</h1>
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
              导出选中分销订单
            </button>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 border-b border-zinc-200 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button onClick={() => setActiveTab('all')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'all' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>全部订单</button>
          <button onClick={() => setActiveTab('pending_payment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_payment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待付款</button>
          <button onClick={() => setActiveTab('pending_confirmation')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_confirmation' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待供货商确认</button>
          <button onClick={() => setActiveTab('supplier_shipped')} className={`pb-3 text-xs font-bold transition-colors flex items-center gap-1 ${activeTab === 'supplier_shipped' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-zinc-500 hover:text-black'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            供应商已发货
          </button>
          <button onClick={() => setActiveTab('pending_shipment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_shipment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待发货</button>
          <button onClick={() => setActiveTab('shipped')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'shipped' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已发货</button>
          <button onClick={() => setActiveTab('after_sales')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'after_sales' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>售后处理</button>
          <button onClick={() => setActiveTab('completed')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'completed' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已完成</button>
          <button onClick={() => setActiveTab('closed')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'closed' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已关闭</button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="w-full md:w-96">
              <div className="flex border border-zinc-200 bg-white h-10 w-full focus-within:border-black transition-colors shadow-sm">
                <select 
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="bg-zinc-50 outline-none text-xs font-bold px-3 py-2 text-zinc-600 appearance-none cursor-pointer hover:bg-zinc-100 border-r border-zinc-200 min-w-[100px] h-full"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto', paddingRight: '1.5rem' }}
                >
                  {['订单号', '支付单号', '商品名称', '货号', '购买人', '收件人'].map(opt => (
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
            <div className="flex gap-4 flex-wrap">
              <SearchableCombobox 
                options={Array.from(new Set(INITIAL_ORDERS.map(o => o.supplierName).filter(Boolean))).map(m => ({ value: m as string, label: m as string }))}
                value={filterSupplier || ''}
                onChange={(val) => setFilterSupplier(val || null)}
                placeholder="所有供货商"
                className="w-40"
              />
              <SearchableCombobox 
                options={Array.from(new Set(INITIAL_ORDERS.map(o => o.distributorName).filter(Boolean))).map(m => ({ value: m as string, label: m as string }))}
                value={filterDistributor || ''}
                onChange={(val) => setFilterDistributor(val || null)}
                placeholder="所有主理人"
                className="w-40"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest items-center">
            <div className="col-span-3">商品明细 (名称/货号)</div>
            <div className="col-span-3">收件信息</div>
            <div className="col-span-1 text-center">供货商 / 履约方式</div>
            <div className="col-span-1 text-right">结算金额</div>
            <div className="col-span-1 text-center">状态</div>
            <div className="col-span-3 text-right">快捷操作</div>
          </div>

          {filteredOrders.map(order => (
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
                {order.distributorName && (
                  <span className="text-[10px] text-blue-600 md:ml-4">
                    主理人: {order.distributorName} (ID: {order.id.slice(-4)})
                  </span>
                )}
              </div>
              {/* Order Body */}
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 md:items-center">
                <div className="md:col-span-3">
                  <div className="flex gap-4 items-start">
                    <img 
                      src={order.image} 
                      className="w-14 h-14 object-cover rounded-sm border border-zinc-100"
                      alt={order.brand}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate mb-1 leading-tight">{order.productName}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">#{order.items?.[0]?.sku || '无'}</div>
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
                    <div className="text-xs text-zinc-500 md:hidden mb-1 font-bold italic">供货商/履约方式</div>
                    <div className="text-[10px] font-bold mb-1 text-blue-600">
                      {order.supplierName}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {order.shippingMode === 'dropship' ? '代发' : '发往中转仓'}
                    </div>
                    {order.shipments?.[0] && (
                      <div className="text-[9px] font-mono text-zinc-500 tracking-tighter bg-zinc-100 px-1 inline-block rounded mb-1 mt-1 transition-all">
                        {order.shipments[0].trackingNumber}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-1 text-right">
                    <div className="text-xs text-zinc-500 md:hidden mb-1 font-bold italic">结算金额</div>
                    <div className="text-base font-black tracking-tighter">
                      <span className="text-[10px] mr-1 text-zinc-400 font-normal">{getCurrencySymbol(order.warehouse)}</span>
                      {order.totalPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="md:col-span-1 text-center">
                    <div className="text-xs text-zinc-500 md:hidden mb-1 font-bold italic">状态</div>
                    <div className={`text-[9px] font-bold px-2 py-1 uppercase tracking-wider inline-block mb-1 ${
                      order.status === 'pending_payment' ? 'bg-red-50 text-red-700 border border-red-100' :
                      order.status === 'pending_confirmation' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                      order.status === 'pending_shipment' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      order.status === 'supplier_shipped' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                      order.status === 'after_sales' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                      order.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                      'bg-zinc-50 text-zinc-700 border border-zinc-200'
                    }`}>
                      {order.statusLabel}
                    </div>
                  </div>
                  <div className="md:col-span-3 flex flex-wrap gap-2 md:justify-end items-center mt-4 md:mt-0">
                    {order.status === 'pending_payment' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); alert('关闭订单功能开发中'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">关闭</button>
                        <button onClick={(e) => { e.stopPropagation(); alert('改价功能开发中'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">改价</button>
                      </>
                    )}
                    {order.status === 'pending_confirmation' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); alert('确认功能开发中'); }} className="text-[10px] font-bold bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors shadow-sm">确认</button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); alert('退款功能开发中'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">退款</button>
                      </>
                    )}
                    {order.status === 'pending_shipment' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); alert('发货管理功能开发中'); }} className="text-[10px] font-bold bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors shadow-sm">发货</button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); alert('退款功能开发中'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white hover:border-black transition-colors">退款</button>
                        <button onClick={(e) => { e.stopPropagation(); alert('此功能将取消订单的已确认状态并退回上一步'); }} className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 bg-white text-orange-600 hover:border-orange-600 hover:bg-orange-50 transition-colors">取消确认</button>
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
                    <button 
                      onClick={() => setSelectedOrder(order.id)}
                      className="md:hidden w-full h-8 border border-zinc-200 flex items-center justify-center hover:border-black transition-colors bg-white text-xs font-bold"
                    >
                      查看详情 <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrderData && (
        <div className="fixed inset-0 z-50 flex justify-end md:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-full md:w-[800px] bg-white shadow-2xl flex flex-col h-full md:rounded-xl overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="flex-start justify-between px-8 py-6 border-b border-zinc-100 bg-zinc-50 flex items-center">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">主单 ID / 订单详情</div>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black uppercase tracking-tight font-mono">{selectedOrderData.id}</h2>
                  {selectedOrderData.distributorName && (
                    <div className="bg-white border border-zinc-200 px-3 py-1 flex items-center gap-2 rounded-full shadow-sm">
                      <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold">对应主理人</span>
                      <span className="text-xs font-black">{selectedOrderData.distributorName}</span>
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
          
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">主单 ID</div>
                  <div className="text-xs font-mono font-bold text-zinc-700 select-all">{ "15744202606120931289179439" }</div>
                </div>
                <div className="bg-white p-4 flex justify-between items-center transition-colors hover:bg-zinc-50">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">支付时间</div>
                  <div className="text-xs font-mono text-zinc-800">2024-08-16 09:32</div>
                </div>
              </div>

              <div className="flex flex-col gap-6 mb-8 pb-8 border-b border-zinc-100">
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
                    {(selectedOrderData.shippingMode === 'transit' || selectedOrderData.totalPrice > 5000) && (
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

                {/* Box 2: Fulfillment & Payment */}
                <div className="w-full flex flex-col md:flex-row gap-6">
                  {/* 履约与供货 */}
                  <div className="flex-1 border border-zinc-200 rounded-lg p-5 bg-white shadow-sm flex flex-col">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-100 pb-2">履约与供货信息</h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter mb-1">发货模式</div>
                          <div className="text-sm font-black text-blue-600 uppercase tracking-tight">
                            {selectedOrderData.shippingMode === 'transit' ? '发往中转仓' : '由上游直接代发'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter mb-1">对应供货商</div>
                          <div className="text-sm font-bold text-orange-600">{selectedOrderData.supplierName}</div>
                        </div>
                      </div>

                      {/* Dynamic Logistics/Tracking Info based on status and mode */}
                      <div className="bg-zinc-50 border border-zinc-100 rounded p-3 flex flex-col gap-3 shrink-0 mt-auto">
                          {/* 已发货状态 */}
                          {(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'completed' || selectedOrderData.status === 'supplier_shipped') && (
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-red-500 font-bold flex-1 uppercase tracking-wider">退回单号 (快递)</span>
                                <span className="font-mono tracking-tight text-red-600">RTN-99882231K</span>
                              </div>
                            </div>
                          )}
                          
                          {/* 待发货 / 其他未发货状态时 */}
                          {!(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'completed' || selectedOrderData.status === 'supplier_shipped' || selectedOrderData.status === 'pending_refund' || selectedOrderData.status === 'refunded') && (
                            <div className="text-[10px] text-zinc-400 font-medium italic mt-1">暂无物流轨迹信息，等待发货分配。</div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details & Financials */}
              <div className="mt-8">
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
                        <th className="p-4">商品概览 (SKU/单价)</th>
                        <th className="p-4">上游供应商</th>
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
                                   <span className="text-[9px] text-zinc-400 font-mono">#{item.sku}</span>
                                   <span className="text-[9px] text-zinc-800 font-black">{getCurrencySymbol(selectedOrderData.warehouse)} {item.price.toLocaleString()}</span>
                                 </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-zinc-500 font-bold">{item.supplier}</td>
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
                        
                        <div className="pt-4 mt-4 border-t-2 border-zinc-200 flex justify-between items-baseline">
                           <div className="flex flex-col">
                             <span className="text-sm font-black uppercase tracking-tight">结算总额</span>
                             <span className="text-[9px] text-zinc-400 font-bold uppercase">Total Amount</span>
                           </div>
                           <div className="text-right flex flex-col items-end">
                             <div className="text-2xl font-black tracking-tighter text-black leading-none">
                               <span className="text-xs font-normal mr-1">{getCurrencySymbol(selectedOrderData.warehouse)}</span>
                               {selectedOrderData.totalPrice.toLocaleString()}
                             </div>
                             {isEditingPrice ? (
                                <div className="mt-3 flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    className="border border-zinc-300 px-2 py-1 text-xs w-24 outline-none focus:border-black rounded-sm"
                                  />
                                  <button onClick={handleUpdatePrice} className="text-[9px] bg-black text-white px-2 py-1 rounded">保存修改</button>
                                </div>
                             ) : (
                                <button onClick={() => { setTempPrice(selectedOrderData.totalPrice.toString()); setIsEditingPrice(true); }} className="text-[9px] text-blue-600 hover:underline mt-1 font-bold">修改订单金额</button>
                             )}
                           </div>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Logistics Trackings */}
                {selectedOrderData.shipments && selectedOrderData.shipments.length > 0 && (
                  <div className="mt-8 mb-8">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1"><Truck size={14} /> 物流跟踪 (分段发货)</h3>
                    <div className="border border-zinc-200 bg-white">
                      {(() => {
                        const upstream = selectedOrderData.shipments.filter((s: any) => s.type === 'upstream');
                        const downstream = selectedOrderData.shipments.filter((s: any) => s.type === 'downstream');
                        return (
                          <div className="divide-y divide-zinc-200">
                             {upstream.length > 0 && (
                               <div className="p-6">
                                 <div className="text-xs font-bold mb-4 flex items-center gap-2">
                                   <span className="w-2 h-2 rounded-full bg-blue-500"></span> 段一：上游发货 
                                   <span className="text-[10px] text-zinc-500 font-normal">({selectedOrderData.supplierName} ➔ {selectedOrderData.warehouse || '中转仓/代发'})</span>
                                 </div>
                                 <div className="space-y-4 pl-4 border-l-2 border-zinc-100 ml-1">
                                   {upstream.map((s: any) => (
                                     <div key={s.id} className="text-xs">
                                       <div className="font-bold text-zinc-800 flex items-center gap-2">
                                         {s.company} 
                                         <span className="text-blue-600 cursor-pointer hover:underline" onClick={(e) => { e.preventDefault(); alert(`查看物流轨迹\n单号: ${s.trackingNumber}`); }}>{s.trackingNumber}</span>
                                       </div>
                                       <div className="text-zinc-500 mt-1">包裹内容: {s.contents}</div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             {downstream.length > 0 && (
                               <div className="p-6 bg-zinc-50/50">
                                 <div className="text-xs font-bold mb-4 flex items-center gap-2">
                                   <span className="w-2 h-2 rounded-full bg-green-500"></span> 段二：发往买家 
                                 </div>
                                 <div className="space-y-4 pl-4 border-l-2 border-zinc-100 ml-1">
                                   {downstream.map((s: any) => (
                                     <div key={s.id} className="text-xs">
                                       <div className="font-bold text-zinc-800 flex items-center gap-2">{s.company} {s.trackingNumber}</div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

              {/* Order Progress Details */}
              <div className="mt-8 border-t border-zinc-100 pt-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">订单进程</h3>
                  <CheckCircle size={14} className="text-zinc-300" />
                </div>
                <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100 mb-8">
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
                  {(!selectedOrderData.progress || selectedOrderData.progress.length === 0) && (
                    <div className="text-center text-zinc-500 text-xs py-8 leading-none">暂无进程记录</div>
                  )}
                </div>
                
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col md:flex-row gap-4 items-center">
                  <input 
                    type="text" 
                    placeholder="手动添加进程说明 (如: 供货商部分退款)" 
                    value={newProgressDesc}
                    onChange={(e) => setNewProgressDesc(e.target.value)}
                    className="w-full md:flex-1 bg-white border border-zinc-200 px-3 py-2 text-xs text-black focus:border-black outline-none rounded-sm"
                  />
                  <div className="flex gap-2 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="金额变动 (-¥5,000)" 
                      value={newProgressAmount}
                      onChange={(e) => setNewProgressAmount(e.target.value)}
                      className="w-full md:w-32 bg-white border border-zinc-200 px-3 py-2 text-xs text-black focus:border-black outline-none rounded-sm"
                    />
                    <div className="flex shadow-sm rounded-sm overflow-hidden border border-black">
                      <button 
                        onClick={handleAddManualProgress}
                        disabled={!newProgressDesc}
                        className="bg-black text-white px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
                      >记录</button>
                      <button 
                        onClick={() => alert("转工单")}
                        disabled={!newProgressDesc}
                        className="bg-orange-600 text-white px-3 py-2 text-xs font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 border-l border-white/20 flex items-center"
                        title="发起财务工单"
                      ><Wrench size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 md:p-6 border-t border-zinc-200 bg-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
              <div className="text-xs text-zinc-500 w-full md:w-auto">已选 0 件商品</div>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                {selectedOrderData.status === 'pending_payment' && (
                  <button 
                    onClick={() => {
                      setTempPrice(selectedOrderData.totalPrice.toString());
                      setIsEditingPrice(true);
                    }}
                    className="w-full md:w-auto bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                  >
                    修改订单金额
                  </button>
                )}
                {(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'delivering' || selectedOrderData.status === 'ready_for_pickup') && (
                  <>
                    <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'refund'); }} className="w-full md:w-auto bg-white border border-zinc-200 text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">仅退款</button>
                    <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'return'); }} className="w-full md:w-auto bg-white border border-zinc-200 text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">退货退款</button>
                  </>
                )}
                {selectedOrderData.status === 'completed' && (
                  <>
                    <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'refund'); }} className="w-full md:w-auto bg-white border border-zinc-200 text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">仅退款</button>
                    <button onClick={() => { handleInitiateAfterSales(selectedOrderData.id, 'return'); }} className="w-full md:w-auto bg-white border border-zinc-200 text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">退货退款</button>
                  </>
                )}
                {selectedOrderData.status === 'after_sales' && (
                  <>
                    {(selectedOrderData.statusLabel === '售后处理' || selectedOrderData.statusLabel === '待审核') && (
                      <button 
                        onClick={() => setIsAfterSalesModalOpen(true)}
                        className="w-full md:w-auto bg-white border border-zinc-200 text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
                      >
                        售后审批
                      </button>
                    )}
                    {(selectedOrderData.statusLabel === '待顾客退回' || selectedOrderData.statusLabel === '待仓库验货') && (
                      <button onClick={() => {
                        const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
                        const isExchange = selectedOrderData.progress.some((p: any) => p.description.includes('同意换货'));
                        setOrders(orders.map(o => o.id === selectedOrderData.id ? { 
                          ...o, 
                          statusLabel: isExchange ? '待重新发货' : '待退款',
                          progress: [{ id: `p-${Date.now()}`, time: now, description: '供应商收到退货并同意操作', items: '相关商品', amountChange: '-' }, ...(o.progress || [])]
                        } : o));
                      }} className="w-full md:w-auto bg-blue-600 border border-blue-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors">
                        供应商已收退货
                      </button>
                    )}
                    {selectedOrderData.statusLabel === '待重新发货' && (
                      <button onClick={() => {
                        const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
                        setOrders(orders.map(o => o.id === selectedOrderData.id ? { 
                          ...o, 
                          status: 'pending_shipment', 
                          statusLabel: '待发货',
                          progress: [{ id: `p-${Date.now()}`, time: now, description: '换货完毕，重新生成发货单', items: '换货商品', amountChange: '-' }, ...(o.progress || [])]
                        } : o));
                        setSelectedOrder(null);
                      }} className="w-full md:w-auto bg-purple-600 border border-purple-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-purple-700 transition-colors">
                        换新并重入库发货
                      </button>
                    )}
                    {(selectedOrderData.statusLabel === '退款中' || selectedOrderData.statusLabel === '待退款') && (
                      <button onClick={() => {
                        const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
                        setOrders(orders.map(o => o.id === selectedOrderData.id ? { 
                          ...o, 
                          status: 'refunded', 
                          statusLabel: '已退款',
                          progress: [{ id: `p-${Date.now()}`, time: now, description: '财务退款成功: 原路退回给顾客', items: '相关商品', amountChange: '-' }, ...(o.progress || [])]
                        } : o));
                        setSelectedOrder(null);
                      }} className="w-full md:w-auto bg-green-600 border border-green-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors">
                        完成退款
                      </button>
                    )}
                  </>
                )}
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
              <h2 className="text-lg font-black uppercase tracking-tight">售后处理 (销售端)</h2>
              <button onClick={() => setIsAfterSalesModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-100 p-4 mb-6">
                <div className="text-xs font-bold text-orange-800 mb-1">顾客申请售后</div>
                <div className="text-xs text-orange-700">顾客发起售后申请。系统判定可进行退换货操作。请审核并决定售后类型。</div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-zinc-500 mb-3">处理决定</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => setAfterSalesDecision('agree')}
                    className={`border px-2 py-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'agree' ? 'border-black border-2 bg-zinc-50' : 'border-zinc-200 hover:border-black'}`}
                  >
                    <span className="text-sm font-bold">同意申请</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">同意顾客的售后诉求</span>
                  </button>
                  <button 
                    onClick={() => setAfterSalesDecision('reject')}
                    className={`border px-2 py-3 text-center flex flex-col items-center justify-center gap-2 transition-colors ${afterSalesDecision === 'reject' ? 'border-red-600 border-2 bg-red-50' : 'border-zinc-200 hover:border-red-500'}`}
                  >
                    <span className="text-sm font-bold">驳回申请</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">拒绝此次请求</span>
                  </button>
                </div>
              </div>

              {afterSalesDecision === 'reject' && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-red-600 mb-2">驳回原因 (必填)</label>
                  <textarea 
                    value={afterSalesReason}
                    onChange={(e) => setAfterSalesReason(e.target.value)}
                    placeholder="请输入驳回顾客售后申请的详细原因..."
                    className="w-full bg-white border border-red-200 px-4 py-3 text-sm text-black focus:border-red-500 outline-none h-24 resize-none"
                  ></textarea>
                </div>
              )}

              {afterSalesDecision === 'agree' && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-zinc-500 mb-2">处理备注 (内部可见)</label>
                  <textarea 
                    value={afterSalesReason}
                    onChange={(e) => setAfterSalesReason(e.target.value)}
                    placeholder="选填备注..."
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
                    if (!selectedOrderData || !afterSalesDecision) return;
                    
                    const actionText = afterSalesDecision === 'agree' ? '同意售后申请' : '驳回售后申请';
                    const newProgress = {
                      id: `p${Date.now()}`,
                      time: new Date().toLocaleString('zh-CN', { hour12: false }),
                      description: `销售端处理售后: ${actionText}`,
                      items: '相关商品',
                      amountChange: '-'
                    };

                    const updatedOrders = orders.map(o => {
                      if (o.id === selectedOrderData.id) {
                        return {
                          ...o,
                          status: afterSalesDecision === 'reject' ? o.status : 'after_sales',
                          statusLabel: afterSalesDecision === 'reject' ? o.statusLabel : '待处理',
                          progress: [newProgress, ...(o.progress || [])]
                        };
                      }
                      return o;
                    });

                    setOrders(updatedOrders);
                    setIsAfterSalesModalOpen(false);
                    setAfterSalesDecision(null);
                    setAfterSalesReason('');
                  }}
                  className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认处理
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
