import { Search, ChevronRight, X, FileText, CheckCircle, Plus, Printer, HelpCircle, Upload, FileDown } from "lucide-react";
import { useState } from "react";
import { CreateOrderModal } from "./CreateOrderModal";

const INITIAL_ORDERS = [
  {
    id: 'MAN-2024-0815-A1', type: 'manifest', date: '2024-08-15 10:20', brand: 'Hermès', productName: 'Hermès Birkin 25 等多件', spuCount: 2, itemCount: 3,
    buyerName: '李四', buyerPhone: '139****5678', buyerType: '个人买家', deliveryMethod: '门店自提', warehouse: '香港直邮仓', shippingAddress: '香港特别行政区中环...',
    totalPrice: 206000, depositAmount: 61800, finalAmount: 144200, status: 'pending_deposit', statusLabel: '待付定金',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-1', name: 'Hermès Birkin 25', sku: 'H-B25-GOLD', count: 1, price: 156000, status: 'pending_deposit', statusLabel: '待付定金' },
      { id: 'item-2', name: 'Hermès Twilly', sku: 'H-TW-SILK', count: 2, price: 25000, status: 'pending_deposit', statusLabel: '待付定金' }
    ],
    progress: [],
    shippingFee: 150
  },
  {
    id: 'MAN-2024-0814-B1', type: 'manifest', date: '2024-08-14 14:20', brand: 'Louis Vuitton', productName: 'LV Neverfull 等多件', spuCount: 2, itemCount: 2,
    buyerName: '陈七', buyerPhone: '136****3456', buyerType: '个人买家', deliveryMethod: '快递发货', warehouse: '深圳保税仓', shippingAddress: '上海市徐汇区...',
    totalPrice: 26500, depositAmount: 7950, finalAmount: 18550, status: 'pending_confirmation', statusLabel: '待确认',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-3', name: 'LV Neverfull', sku: 'LV-NF-MM', itemNo: 'LV00291', count: 1, price: 14500, status: 'pending_confirmation', statusLabel: '待确认' },
      { id: 'item-4', name: 'LV Speedy 20', sku: 'LV-SP20-BR', itemNo: 'LV00882', count: 1, price: 12000, status: 'pending_confirmation', statusLabel: '待确认' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-14 15:00', description: '定金确认', items: '全部 (2件)', amountChange: '+¥7,950' }
    ],
    shippingFee: 80
  },
  {
    id: 'MAN-2024-0813-C1', type: 'manifest', date: '2024-08-13 09:15', brand: 'Chanel', productName: 'Chanel CF', spuCount: 1, itemCount: 1,
    buyerName: '王五', buyerPhone: '138****1234', buyerType: '个人买家', deliveryMethod: '快递发货', warehouse: '伦敦海外仓', shippingAddress: '北京市朝阳区...',
    totalPrice: 68000, depositAmount: 20400, finalAmount: 47600, status: 'pending_final_payment', statusLabel: '尾款待付',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-5', name: 'Chanel CF Medium', sku: 'CH-CF-BLK', count: 1, price: 68000, status: 'confirmed', statusLabel: '已确认' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-13 10:00', description: '定金确认', items: '全部 (1件)', amountChange: '+¥20,400' },
      { id: 'p2', time: '2024-08-13 14:00', description: '商品确认 (有货)', items: 'Chanel CF Medium', amountChange: '产生尾款 ¥47,600' }
    ]
  },
  {
    id: 'MAN-2024-0812-D1', type: 'manifest', date: '2024-08-12 16:30', brand: 'Gucci', productName: 'Gucci Marmont', spuCount: 1, itemCount: 2,
    buyerName: '赵六', buyerPhone: '135****9876', buyerType: '个人买家', deliveryMethod: '快递发货', warehouse: '香港直邮仓', shippingAddress: '广州市天河区...',
    totalPrice: 37000, depositAmount: 11100, finalAmount: 25900, status: 'pending_shipment', statusLabel: '待发货',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-6', name: 'Gucci Marmont Small', sku: 'GC-MM-BLK', count: 2, price: 18500, status: 'pending_shipment', statusLabel: '待发货' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-12 17:00', description: '定金确认', items: '全部 (2件)', amountChange: '+¥11,100' },
      { id: 'p2', time: '2024-08-13 09:00', description: '商品确认 (有货)', items: 'Gucci Marmont Small', amountChange: '产生尾款 ¥25,900' },
      { id: 'p3', time: '2024-08-13 11:00', description: '尾款支付确认', items: '全部 (2件)', amountChange: '+¥25,900' }
    ]
  },
  {
    id: 'MAN-2024-0811-E1', type: 'manifest', date: '2024-08-11 11:00', brand: 'Dior', productName: 'Lady Dior', spuCount: 1, itemCount: 1,
    buyerName: '孙八', buyerPhone: '137****2468', buyerType: '个人买家', deliveryMethod: '快递发货', warehouse: '深圳保税仓', shippingAddress: '杭州市西湖区...',
    totalPrice: 45000, depositAmount: 13500, finalAmount: 31500, status: 'shipped', statusLabel: '已发货',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-7', name: 'Lady Dior Medium', sku: 'DR-LD-PNK', count: 1, price: 45000, status: 'shipped', statusLabel: '已发货' }
    ],
    shippingInfo: {
      method: 'express',
      company: '顺丰速运',
      trackingNumber: 'SF1029384756',
      photos: []
    },
    progress: [
      { id: 'p1', time: '2024-08-11 11:30', description: '定金确认', items: '全部 (1件)', amountChange: '+¥13,500' },
      { id: 'p2', time: '2024-08-11 15:00', description: '商品确认 (有货)', items: 'Lady Dior Medium', amountChange: '产生尾款 ¥31,500' },
      { id: 'p3', time: '2024-08-12 10:00', description: '尾款支付确认', items: '全部 (1件)', amountChange: '+¥31,500' }
    ]
  },
  {
    id: 'MAN-2024-0810-F1', type: 'manifest', date: '2024-08-10 14:45', brand: 'Prada', productName: 'Prada Cleo', spuCount: 1, itemCount: 1,
    buyerName: '周九', buyerPhone: '133****1357', buyerType: '个人买家', deliveryMethod: '快递发货', warehouse: '伦敦海外仓', shippingAddress: '成都市武侯区...',
    totalPrice: 18000, depositAmount: 5400, finalAmount: 0, status: 'pending_refund', statusLabel: '待退款',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-8', name: 'Prada Cleo', sku: 'PR-CL-WHT', count: 1, price: 18000, status: 'pending_refund', statusLabel: '待退款(缺货)' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-10 15:00', description: '定金确认', items: '全部 (1件)', amountChange: '+¥5,400' },
      { id: 'p2', time: '2024-08-11 09:00', description: '商品确认 (缺货)', items: 'Prada Cleo', amountChange: '产生退款 ¥5,400' }
    ]
  },
  {
    id: 'MAN-2024-0809-G1', type: 'manifest', date: '2024-08-09 09:30', brand: 'Celine', productName: 'Celine Triomphe', spuCount: 1, itemCount: 1,
    buyerName: '吴十', buyerPhone: '132****8642', buyerType: '个人买家', deliveryMethod: '快递发货', warehouse: '香港直邮仓', shippingAddress: '南京市玄武区...',
    totalPrice: 26000, depositAmount: 7800, finalAmount: 18200, status: 'closed', statusLabel: '已关闭',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80',
    items: [
      { id: 'item-9', name: 'Celine Triomphe', sku: 'CL-TR-BLK', count: 1, price: 26000, status: 'closed', statusLabel: '已关闭' }
    ],
    progress: [
      { id: 'p1', time: '2024-08-09 10:00', description: '定金确认', items: '全部 (1件)', amountChange: '+¥7,800' },
      { id: 'p2', time: '2024-08-09 14:00', description: '商品确认 (缺货)', items: 'Celine Triomphe', amountChange: '产生退款 ¥7,800' },
      { id: 'p3', time: '2024-08-10 10:00', description: '退款完成', items: '全部 (1件)', amountChange: '-¥7,800' }
    ]
  }
];

export function ManifestOrderManagement() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  
  const [newProgressDesc, setNewProgressDesc] = useState('');
  const [newProgressAmount, setNewProgressAmount] = useState('');

  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'express' | 'pickup'>('express');
  const [shippingCompany, setShippingCompany] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [pickupPerson, setPickupPerson] = useState('');
  const [pickupContact, setPickupContact] = useState('');
  
  const handleConfirmStock = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const updatedItems = order.items.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'confirmed', statusLabel: '已确认' } : item
        );
        
        const allResolved = updatedItems.every(i => i.status === 'confirmed' || i.status === 'pending_refund');
        
        let newFinalAmount = order.finalAmount;
        if (allResolved) {
          const confirmedTotal = updatedItems.filter(i => i.status === 'confirmed').reduce((sum, i) => sum + (i.price * i.count), 0);
          newFinalAmount = Math.max(0, confirmedTotal - order.depositAmount);
        }

        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: '商品确认 (有货)',
          items: `已选 (${selectedItems.length}件)`,
          amountChange: allResolved ? `产生尾款 ¥${newFinalAmount.toLocaleString()}` : '-'
        };

        return { 
          ...order, 
          status: allResolved ? 'pending_final_payment' : 'pending_confirmation', 
          statusLabel: allResolved ? '尾款待付' : '部分待确认', 
          finalAmount: newFinalAmount,
          items: updatedItems,
          progress: [...(order.progress || []), newProgress]
        };
      }
      return order;
    }));
    setSelectedItems([]);
  };

  const handleRefundStockout = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const updatedItems = order.items.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'pending_refund', statusLabel: '待退款(缺货)' } : item
        );
        
        const allResolved = updatedItems.every(i => i.status === 'confirmed' || i.status === 'pending_refund');
        const allRefund = updatedItems.every(i => i.status === 'pending_refund');

        let newFinalAmount = order.finalAmount;
        if (allResolved && !allRefund) {
          const confirmedTotal = updatedItems.filter(i => i.status === 'confirmed').reduce((sum, i) => sum + (i.price * i.count), 0);
          newFinalAmount = Math.max(0, confirmedTotal - order.depositAmount);
        }

        const refundAmount = updatedItems.filter(i => selectedItems.includes(i.id)).reduce((sum, i) => sum + (i.price * i.count), 0);
        
        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: '商品确认 (缺货)',
          items: `已选 (${selectedItems.length}件)`,
          amountChange: `产生退款 ¥${refundAmount.toLocaleString()}`
        };

        return { 
          ...order, 
          status: allRefund ? 'pending_refund' : (allResolved ? 'pending_final_payment' : 'pending_confirmation'), 
          statusLabel: allRefund ? '待退款' : (allResolved ? '尾款待付' : '部分待确认'), 
          finalAmount: newFinalAmount,
          items: updatedItems,
          progress: [...(order.progress || []), newProgress]
        };
      }
      return order;
    }));
    setSelectedItems([]);
  };

  const handleConfirmShipment = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const updatedItems = order.items.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'shipped', statusLabel: '已发货' } : item
        );
        const allShipped = updatedItems.every(i => i.status === 'shipped' || i.status === 'pending_refund');
        
        let desc = '商品发货';
        if (shippingMethod === 'express') {
          desc = `商品发货 (快递: ${shippingCompany} - ${trackingNumber})`;
        } else {
          desc = `商品发货 (自提/送货: ${pickupPerson} - ${pickupContact})`;
        }

        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: desc,
          items: `已选 (${selectedItems.length}件)`,
          amountChange: '-'
        };

        const newShippingInfo = shippingMethod === 'express' 
          ? { method: 'express', company: shippingCompany, trackingNumber: trackingNumber, photos: [] }
          : { method: 'pickup', person: pickupPerson, contact: pickupContact, photos: [] };

        return { 
          ...order, 
          status: allShipped ? 'shipped' : 'pending_shipment', 
          statusLabel: allShipped ? '已发货' : '部分发货', 
          items: updatedItems,
          shippingInfo: newShippingInfo,
          progress: [...(order.progress || []), newProgress]
        };
      }
      return order;
    }));
    setSelectedItems([]);
    setIsShippingModalOpen(false);
    setShippingCompany('');
    setTrackingNumber('');
    setPickupPerson('');
    setPickupContact('');
  };

  const handleConfirmRefund = () => {
    if (!selectedOrder) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders(orders.map(order => {
      if (order.id === selectedOrder) {
        const updatedItems = order.items.map(item => 
          item.status === 'pending_refund' ? { ...item, status: 'closed', statusLabel: '已退款' } : item
        );
        
        const allClosed = updatedItems.every(i => i.status === 'closed' || i.status === 'shipped');
        
        const newProgress = {
          id: `p-${Date.now()}`,
          time: now,
          description: '退款完成',
          items: '全部待退款商品',
          amountChange: '-'
        };

        return { 
          ...order, 
          status: allClosed ? 'closed' : 'pending_refund', 
          statusLabel: allClosed ? '已关闭' : '部分退款', 
          items: updatedItems,
          progress: [...(order.progress || []), newProgress]
        };
      }
      return order;
    }));
    setSelectedItems([]);
  };

  const handleUploadShippingPhoto = (orderId: string) => {
    // Mock photo upload
    setOrders(orders.map(order => {
      if (order.id === orderId && order.shippingInfo) {
        return {
          ...order,
          shippingInfo: {
            ...order.shippingInfo,
            photos: [...(order.shippingInfo.photos || []), 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=100&q=80']
          }
        };
      }
      return order;
    }));
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

  const handleDownloadConfirmation = () => {
    if (selectedOrders.length === 0) return;
    // Simulate downloading an excel file
    alert(`已成功导出 ${selectedOrders.length} 个订单的客户确认单 (Excel)`);
    setSelectedOrders([]);
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = selectedWarehouse === '' || order.warehouse === selectedWarehouse;
    return matchesTab && matchesSearch && matchesWarehouse;
  });

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  return (
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-80px)]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-8 gap-4">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Manifest Orders</div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">PC 货单订单管理</h1>
            <p className="text-xs md:text-sm text-zinc-500">支持 PC 后端代下单（定金付款）、Excel 批量回传确认订单</p>
          </div>
          <button 
            onClick={() => setIsNewOrderOpen(true)}
            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            后台帮客户下单
          </button>
        </div>

        <div className="flex gap-4 md:gap-8 border-b border-zinc-200 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button onClick={() => setActiveTab('all')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'all' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>全部订单</button>
          <button onClick={() => setActiveTab('pending_deposit')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_deposit' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待付定金</button>
          <button onClick={() => setActiveTab('pending_confirmation')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_confirmation' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待确认</button>
          <button onClick={() => setActiveTab('pending_final_payment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_final_payment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>尾款待付</button>
          <button onClick={() => setActiveTab('pending_shipment')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_shipment' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待发货</button>
          <button onClick={() => setActiveTab('shipped')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'shipped' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已发货</button>
          <button onClick={() => setActiveTab('pending_refund')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'pending_refund' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>待退款</button>
          <button onClick={() => setActiveTab('closed')} className={`pb-3 text-xs font-bold transition-colors ${activeTab === 'closed' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>已关闭</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索订单号、买家、商品名称..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-zinc-200 pl-10 pr-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white" 
            />
          </div>
          <select 
            className="border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white w-full md:w-48"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">所有仓库</option>
            <option value="香港直邮仓">香港直邮仓</option>
            <option value="深圳保税仓">深圳保税仓</option>
            <option value="伦敦海外仓">伦敦海外仓</option>
          </select>
        </div>

        {activeTab === 'pending_confirmation' && (
          <div className="bg-white border border-zinc-200 p-4 mb-6 flex justify-between items-center shadow-sm">
            <div className="text-sm font-bold">批量处理</div>
            <div className="flex gap-3">
              <button className="bg-white border border-zinc-200 text-black px-6 py-2 text-xs font-bold hover:border-black transition-colors flex items-center gap-2">
                上传确认单
              </button>
              <button className="bg-black text-white px-6 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2">
                <FileText size={14} />
                生成采购单
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-zinc-200 shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest items-center">
            <div className="col-span-3 flex items-center gap-3">
              商品详情
            </div>
            <div className="col-span-2">买家</div>
            <div className="col-span-2">配送方式 / 仓库</div>
            <div className="col-span-2 text-right">运费 / 总价</div>
            <div className="col-span-2 pl-4">状态</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filteredOrders.map(order => (
            <div key={order.id} className="border-b border-zinc-200 hover:border-black transition-colors bg-white mb-4 shadow-sm">
              <div className="bg-zinc-50 px-4 md:px-6 py-3 border-b border-zinc-200 flex items-center gap-4">
                <span className="font-bold text-xs">{order.id}</span>
                <span className="text-[10px] text-zinc-500">{order.date}</span>
              </div>
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 md:items-center">
                <div className="md:col-span-3 md:pr-4">
                  <div className="flex gap-3 mb-2 md:mb-0">
                    <div className="w-16 h-16 md:w-10 md:h-10 bg-zinc-100 p-1 flex-shrink-0">
                      <img src={order.image} alt={order.brand} className="w-full h-full object-contain mix-blend-multiply grayscale" />
                    </div>
                    <div>
                      <div className="text-sm md:text-xs font-bold uppercase tracking-tight md:truncate md:w-32">{order.productName}</div>
                      <div className="text-[10px] text-zinc-500">共 {order.spuCount} 款, {order.itemCount} 件</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between md:contents">
                  <div className="text-xs text-zinc-500 md:hidden ml-16 md:ml-0 md:pl-0">买家</div>
                  <div className="md:col-span-2 md:pr-4 text-right md:text-left">
                    <div className="text-xs font-bold mb-1">{order.buyerName} ({order.buyerPhone})</div>
                    <div className="text-[10px] text-zinc-500 text-right md:text-left">{order.buyerType}</div>
                  </div>
                </div>
                <div className="flex justify-between md:contents">
                  <div className="text-xs text-zinc-500 md:hidden ml-16 md:ml-0 md:pl-0">配送/仓库</div>
                  <div className="md:col-span-2 md:pr-4 text-right md:text-left">
                    <div className="text-xs font-bold mb-1">{order.deliveryMethod}</div>
                    <div className="text-[10px] text-zinc-500 text-right md:text-left">{order.warehouse}</div>
                  </div>
                </div>
                <div className="flex justify-between md:contents">
                  <div className="text-xs text-zinc-500 md:hidden ml-16 md:ml-0 md:pl-0">总价</div>
                  <div className="md:col-span-2 text-right">
                    <div className="text-[10px] text-zinc-400">运费: ¥{(order as any).shippingFee || 0}</div>
                    <div className="text-sm font-bold mb-1">¥ {order.totalPrice.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex justify-between md:contents">
                  <div className="text-xs text-zinc-500 md:hidden ml-16 md:ml-0 md:pl-0">状态</div>
                  <div className="md:col-span-2 md:pl-4 text-right md:text-left">
                    <div className={`text-[9px] font-bold px-2 py-1 uppercase tracking-wider inline-block mb-1 ${
                      order.status === 'pending_deposit' ? 'bg-red-100 text-red-800' :
                      order.status === 'pending_confirmation' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'pending_final_payment' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'pending_shipment' ? 'bg-black text-white' :
                      order.status === 'pending_refund' ? 'bg-red-100 text-red-800' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {order.statusLabel}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 text-right flex items-center justify-end gap-2 mt-4 md:mt-0 ml-16 md:ml-0 md:pl-0">
                  {order.status === 'pending_refund' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); }}
                      className="flex-1 md:flex-none text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 px-2 py-1 bg-red-50 text-center h-8"
                    >
                      退款
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedOrder(order.id)}
                    className="w-full md:w-8 h-8 border border-zinc-200 inline-flex items-center justify-center hover:border-black transition-colors"
                  >
                    <span className="md:hidden text-xs font-bold mr-2">查看详情</span>
                    <ChevronRight size={16} />
                  </button>
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
            <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-zinc-100 bg-zinc-50">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">订单详情</div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">{selectedOrderData.id}</h2>
                  <button 
                    onClick={() => alert('正在生成 PDF 发票并预览...')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200 text-black rounded-sm hover:border-black transition-colors"
                  >
                    <Printer size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">发票模版 (PDF)</span>
                  </button>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="bg-zinc-50 p-4 md:p-6 border border-zinc-200 mb-6 md:mb-8">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">支付与结算 (银行转账)</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">订单总额</span>
                <span className="text-sm font-bold">¥ {selectedOrderData.totalPrice.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-500">需付定金 (30%)</span>
                <span className="text-sm font-bold text-zinc-500">¥ {selectedOrderData.depositAmount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-zinc-500">需付尾款 (根据确认情况计算)</span>
                <span className="text-sm font-bold text-zinc-500">¥ {selectedOrderData.finalAmount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                <span className="text-sm font-bold">当前支付状态</span>
                <span className="text-lg font-black">
                  {selectedOrderData.status === 'pending_deposit' ? '待付定金' : 
                   selectedOrderData.status === 'pending_final_payment' ? '待付尾款' : 
                   selectedOrderData.status === 'pending_refund' ? '待退款' : '已支付'}
                </span>
              </div>
            </div>

            {selectedOrderData.status === 'shipped' && selectedOrderData.shippingInfo && (
              <div className="bg-zinc-50 p-4 md:p-6 border border-zinc-200 mb-6 md:mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">物流 / 提货信息</h3>
                  <button 
                    onClick={() => handleUploadShippingPhoto(selectedOrderData.id)}
                    className="text-xs font-bold text-black border border-zinc-200 bg-white px-3 py-1 hover:border-black transition-colors"
                  >
                    上传照片凭证
                  </button>
                </div>
                
                {selectedOrderData.shippingInfo.method === 'express' ? (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-[10px] text-zinc-500 mb-1">发货方式</div>
                      <div className="text-sm font-bold">快递发货</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 mb-1">快递公司</div>
                      <div className="text-sm font-bold">{selectedOrderData.shippingInfo.company}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] text-zinc-500 mb-1">快递单号</div>
                      <div className="text-sm font-mono font-bold">{selectedOrderData.shippingInfo.trackingNumber}</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-[10px] text-zinc-500 mb-1">发货方式</div>
                      <div className="text-sm font-bold">自提 / 送货</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 mb-1">提货人</div>
                      <div className="text-sm font-bold">{selectedOrderData.shippingInfo.person}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] text-zinc-500 mb-1">联系方式</div>
                      <div className="text-sm font-mono font-bold">{selectedOrderData.shippingInfo.contact}</div>
                    </div>
                  </div>
                )}

                {selectedOrderData.shippingInfo.photos && selectedOrderData.shippingInfo.photos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <div className="text-[10px] text-zinc-500 mb-2">凭证照片</div>
                    <div className="flex gap-2 flex-wrap">
                      {selectedOrderData.shippingInfo.photos.map((photo: string, idx: number) => (
                        <div key={idx} className="w-16 h-16 border border-zinc-200 bg-white p-1">
                          <img src={photo} alt="凭证" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">商品明细与操作</h3>
                {selectedOrderData.status === 'pending_confirmation' && (
                  <button className="bg-white border border-zinc-200 text-black px-4 py-1.5 text-xs font-bold hover:border-black transition-colors">
                    生成采购单
                  </button>
                )}
              </div>
              
              <div className="border border-zinc-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <tr>
                        {selectedOrderData.status !== 'pending_deposit' && selectedOrderData.status !== 'pending_final_payment' && (
                          <th className="p-4 w-10">
                            <input 
                              type="checkbox" 
                              className="accent-black" 
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(selectedOrderData.items.map((i: any) => i.id));
                                } else {
                                  setSelectedItems([]);
                                }
                              }}
                              checked={selectedItems.length === selectedOrderData.items.length && selectedOrderData.items.length > 0}
                            />
                          </th>
                        )}
                        <th className="p-4">商品</th>
                        <th className="p-4 text-right">数量</th>
                        <th className="p-4 text-right">单价</th>
                        <th className="p-4 text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {selectedOrderData.items.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          {selectedOrderData.status !== 'pending_deposit' && selectedOrderData.status !== 'pending_final_payment' && (
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                className="accent-black" 
                                checked={selectedItems.includes(item.id)} 
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedItems([...selectedItems, item.id]);
                                  } else {
                                    setSelectedItems(selectedItems.filter(id => id !== item.id));
                                  }
                                }} 
                              />
                            </td>
                          )}
                          <td className="p-4">
                            <div className="font-bold text-xs">{item.name}</div>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[9px] bg-zinc-100 px-1 font-bold text-zinc-400 italic">No: {item.itemNo || 'N/A'}</span>
                              <span className="text-[9px] text-zinc-400">SKU: {item.sku}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono">{item.count}</td>
                          <td className="p-4 text-right font-mono">¥ {item.price.toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <span className={`text-xs font-bold ${
                              item.status === 'pending_refund' ? 'text-red-600' :
                              item.status === 'confirmed' ? 'text-blue-600' :
                              'text-orange-600'
                            }`}>{item.statusLabel}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Progress Details */}
            <div className="mt-8">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">订单进程明细</h3>
              <div className="border border-zinc-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <tr>
                        <th className="p-4">操作时间</th>
                        <th className="p-4">进程说明</th>
                        <th className="p-4">涉及商品</th>
                        <th className="p-4">金额变动</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800">
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
                <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col md:flex-row gap-4 items-center">
                  <input 
                    type="text" 
                    placeholder="手动添加进程说明 (如: 支付部分尾款)" 
                    value={newProgressDesc}
                    onChange={(e) => setNewProgressDesc(e.target.value)}
                    className="w-full md:flex-1 bg-white border border-zinc-200 px-3 py-2 text-xs text-black focus:border-black outline-none"
                  />
                  <div className="flex gap-4 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="金额变动 (如: +¥10,000)" 
                      value={newProgressAmount}
                      onChange={(e) => setNewProgressAmount(e.target.value)}
                      className="w-full md:w-48 bg-white border border-zinc-200 px-3 py-2 text-xs text-black focus:border-black outline-none"
                    />
                    <button 
                      onClick={handleAddManualProgress}
                      disabled={!newProgressDesc}
                      className="bg-black text-white px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      添加记录
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 border-t border-zinc-200 bg-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
            {selectedOrderData.status !== 'pending_deposit' && selectedOrderData.status !== 'pending_final_payment' ? (
              <div className="text-xs text-zinc-500 w-full md:w-auto">已选 {selectedItems.length} 件商品</div>
            ) : (
              <div></div>
            )}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {selectedOrderData.status === 'pending_deposit' && (
                <div className="w-full md:w-auto px-6 py-2 text-xs font-bold text-zinc-500 bg-zinc-200 cursor-not-allowed flex items-center justify-center gap-2">
                  <span className="animate-pulse w-2 h-2 rounded-full bg-zinc-400"></span>
                  等待财务核销流水定金
                </div>
              )}
              {selectedOrderData.status === 'pending_confirmation' && (
                <>
                  <button 
                    disabled={selectedItems.length === 0}
                    onClick={handleRefundStockout}
                    className="w-full md:w-auto bg-white border border-zinc-200 text-red-600 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:border-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交退款 (缺货)
                  </button>
                  <button 
                    disabled={selectedItems.length === 0}
                    onClick={handleConfirmStock}
                    className="w-full md:w-auto bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    确认有货
                  </button>
                </>
              )}
              {selectedOrderData.status === 'pending_final_payment' && (
                <div className="w-full md:w-auto px-6 py-2 text-xs font-bold text-zinc-500 bg-zinc-200 cursor-not-allowed flex items-center justify-center gap-2">
                   <span className="animate-pulse w-2 h-2 rounded-full bg-zinc-400"></span>
                   等待财务核销流水尾款
                </div>
              )}
              {selectedOrderData.status === 'pending_shipment' && (
                <button 
                  disabled={selectedItems.length === 0}
                  onClick={() => setIsShippingModalOpen(true)}
                  className="w-full md:w-auto bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  确认发货
                </button>
              )}
              {selectedOrderData.status === 'pending_refund' && (
                <button 
                  onClick={handleConfirmRefund}
                  className="w-full md:w-auto bg-red-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  确认退款完成
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      )}

      {isShippingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsShippingModalOpen(false)}></div>
          <div className="relative bg-white w-full md:w-[500px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="text-lg font-black uppercase tracking-tight">确认发货信息</h2>
              <button onClick={() => setIsShippingModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setShippingMethod('express')}
                  className={`flex-1 py-3 text-sm font-bold border transition-colors ${shippingMethod === 'express' ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-600 hover:border-black'}`}
                >
                  快递发货
                </button>
                <button 
                  onClick={() => setShippingMethod('pickup')}
                  className={`flex-1 py-3 text-sm font-bold border transition-colors ${shippingMethod === 'pickup' ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-600 hover:border-black'}`}
                >
                  自提 / 送货
                </button>
              </div>

              {shippingMethod === 'express' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">快递公司</label>
                    <input 
                      type="text" 
                      value={shippingCompany}
                      onChange={(e) => setShippingCompany(e.target.value)}
                      placeholder="如: 顺丰速运"
                      className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">快递单号</label>
                    <input 
                      type="text" 
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="输入快递单号"
                      className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">提货人 / 送货人</label>
                    <input 
                      type="text" 
                      value={pickupPerson}
                      onChange={(e) => setPickupPerson(e.target.value)}
                      placeholder="输入姓名"
                      className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">联系方式</label>
                    <input 
                      type="text" 
                      value={pickupContact}
                      onChange={(e) => setPickupContact(e.target.value)}
                      placeholder="输入手机号"
                      className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsShippingModalOpen(false)} 
                className="bg-white border border-zinc-200 text-black px-6 py-2 text-xs font-bold hover:border-black transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmShipment}
                disabled={shippingMethod === 'express' ? (!shippingCompany || !trackingNumber) : (!pickupPerson || !pickupContact)}
                className="bg-black text-white px-6 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认发货
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateOrderModal 
        isOpen={isNewOrderOpen} 
        onClose={() => setIsNewOrderOpen(false)} 
        onFinish={(newOrder) => {
          setOrders([newOrder, ...orders]);
          alert('后台订单已成功生成，通知财务查账并进行待付定金确认。');
        }}
      />
    </div>
  );
}
