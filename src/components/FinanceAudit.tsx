import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Info, Calendar as CalendarIcon, User, Phone, Building2, CheckCircle2, ChevronRight, FileText, ChevronDown, ChevronUp, Image as ImageIcon, Check, Clock, X, MessageSquare, Filter, ChevronLeft, Package, Settings, CreditCard, Banknote, Search, Wrench, Upload, Paperclip
} from 'lucide-react';
import { WorkOrderManagement } from './WorkOrderManagement';
import { useWorkOrders } from '../lib/workOrderStore';

import { FinanceProfitLedger } from './FinanceProfitLedger';

const MOCK_ORDERS = [
  {
    orderId: "O-DEP-88901",
    date: "2024-05-02",
    customerName: "ACME Corp (张三)",
    phone: "138-0013-8000",
    manifestName: "2024夏季新品首单采购",
    depositDue: 4500,
    balanceDue: 10500,
    notes: "销售代下单。客户：张三，电话：138-0013-8000。客户要求尽量发顺丰，包装需加固。",
    products: [
      { name: "MARGIELA GLAM SLAM MINI", sku: "T8013-BLK-MN", qty: 2, price: 9450, confirmed: true },
      { name: "AESTHETIQUE CHRONO NOIR", sku: "AC-202-B", qty: 1, price: 34200, confirmed: false }
    ],
    confirmedPaid: 0,
    reconciliationRecords: [],
    uploadedSlips: [
      { id: "slip-1", uploadTime: "2024-05-02 14:30", imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80", status: "pending" }
    ],
    progress: [
      { id: '1', time: '2024-05-02 10:00', description: '销售帮客户下单 (定金模式)', amountChange: '-' },
    ]
  },
  {
    orderId: "O-DEP-88902",
    date: "2024-05-02",
    customerName: "ACME Corp (张三)",
    phone: "138-0013-8000",
    manifestName: "潮流配饰批量补货",
    depositDue: 2000,
    balanceDue: 8000,
    notes: "客户自主下单。昵称：ACME_采购部。请随货附带发票。",
    products: [
      { name: "VANGUARD SILHOUETTE", sku: "VG-SL-01", qty: 5, price: 2180, confirmed: true }
    ],
    confirmedPaid: 2000,
    reconciliationRecords: [
      { id: "rec-1", time: "2024-05-02 10:15", amount: 2000, slipId: "slip-2" }
    ],
    uploadedSlips: [
      { id: "slip-2", uploadTime: "2024-05-02 09:00", imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80", status: "confirmed" }
    ],
    progress: [
      { id: '1', time: '2024-05-02 09:00', description: '买家上传定金水单', amountChange: '-' },
      { id: '2', time: '2024-05-02 10:15', description: '财务核销定金', amountChange: '+¥2,000' }
    ]
  },
  {
    orderId: "O-FUL-77234",
    date: "2024-05-02",
    customerName: "TechNova (李经理)",
    phone: "139-2222-3333",
    manifestName: "潮流配饰批量补货",
    depositDue: 28900,
    balanceDue: 0,
    notes: "销售代下单。客户：李经理。全款支付，优先发货。",
    products: [
      { name: "VANGUARD SILHOUETTE", sku: "VG-SL-02", qty: 10, price: 2180, confirmed: true },
      { name: "AESTHETIQUE CHRONO NOIR", sku: "AC-202-W", qty: 2, price: 34200, confirmed: true }
    ],
    confirmedPaid: 28900,
    reconciliationRecords: [
      { id: "rec-2", time: "2024-05-02 10:15", amount: 28900, slipId: "slip-3" }
    ],
    uploadedSlips: [
      { id: "slip-3", uploadTime: "2024-05-02 09:00", imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80", status: "confirmed" }
    ]
  },
  {
    orderId: "O-DEP-99001",
    date: "2024-05-02",
    customerName: "Apex Retail (赵总)",
    phone: "137-8888-9999",
    manifestName: "2024秋季高奢皮具专场",
    depositDue: 50000,
    balanceDue: 150000,
    notes: "客户自主下单。昵称：Apex_赵。已付部分定金，剩余定金明天补齐。",
    products: [
      { name: "LVMH 联名款手袋", sku: "LV-001", qty: 10, price: 20000, confirmed: false }
    ],
    confirmedPaid: 20000,
    reconciliationRecords: [
      { id: "rec-3", time: "2024-05-02 11:00", amount: 20000, slipId: "slip-4" }
    ],
    uploadedSlips: [
      { id: "slip-4", uploadTime: "2024-05-02 10:30", imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80", status: "confirmed" },
      { id: "slip-5", uploadTime: "2024-05-02 15:45", imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80", status: "pending" }
    ]
  },
  {
    orderId: "O-FUL-88902",
    date: "2024-05-01",
    customerName: "GlobalTrade (王总)",
    phone: "135-4444-5555",
    manifestName: "2024夏季新品首单采购",
    depositDue: 26600,
    balanceDue: 0,
    notes: "销售代下单。客户：王总。走对公账户打款。",
    products: [
      { name: "MARGIELA GLAM SLAM MINI", sku: "T8013-BLK-MN", qty: 5, price: 9450, confirmed: true }
    ],
    confirmedPaid: 10000,
    reconciliationRecords: [
      { id: "rec-4", time: "2024-05-01 16:00", amount: 10000, slipId: "slip-6" }
    ],
    uploadedSlips: [
      { id: "slip-6", uploadTime: "2024-05-01 15:30", imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80", status: "confirmed" }
    ]
  },
  {
    orderId: "O-DEP-99005",
    date: "2024-05-05",
    customerName: "Boutique 1990 (陈店长)",
    phone: "130-1111-2222",
    manifestName: "潮流配饰批量补货",
    depositDue: 3000,
    balanceDue: 7000,
    notes: "客户自主下单。昵称：陈店长。需要分批发货。",
    products: [
      { name: "VANGUARD SILHOUETTE", sku: "VG-SL-03", qty: 5, price: 2000, confirmed: false }
    ],
    confirmedPaid: 0,
    reconciliationRecords: [],
    uploadedSlips: []
  }
];

export function FinanceAudit() {
  const [activeMainTab, setActiveMainTab] = useState<'reconciliation' | 'withdrawal' | 'work_order' | 'profit_ledger'>('reconciliation');
  const workOrders = useWorkOrders();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [ordersData, setOrdersData] = useState(MOCK_ORDERS);
  const [inputAmounts, setInputAmounts] = useState<Record<string, string>>({});
  const [viewingSlip, setViewingSlip] = useState<{url?: string, slipId: string, orderId: string, isManual?: boolean} | null>(null);
  const [isManualUploadModalOpen, setIsManualUploadModalOpen] = useState(false);
  const [manualSlipOrder, setManualSlipOrder] = useState<string | null>(null);

  const getCurrencySymbol = (orderId: string) => {
    // In a real app we'd check order.warehouse. For now, we simulate based on ID or defaults
    if (orderId.includes('DEP')) return 'HK$';
    if (orderId.includes('FUL')) return '€';
    return '¥';
  };
  
  // Date Range State
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({ start: "2024-05-01", end: "2024-05-05" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2024, 4)); // May 2024
  const calendarRef = useRef<HTMLDivElement>(null);

  // Search Field State
  const [searchQuery, setSearchQuery] = useState('');
  const [buyerQuery, setBuyerQuery] = useState('');

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'partial' | 'completed'>('all');

  // Withdrawal Settings State
  const [activeAccountTab, setActiveAccountTab] = useState<'domestic' | 'international'>('domestic');
  const [domesticSettlementMode, setDomesticSettlementMode] = useState<'t7' | 't1'>('t7');
  const [lastModeChangeDate, setLastModeChangeDate] = useState<string | null>(null);
  const [activeDetailModal, setActiveDetailModal] = useState<'margin' | 'frozen' | 'settled' | null>(null);
  
  const [settlementSearch, setSettlementSearch] = useState('');
  const [settlementStatus, setSettlementStatus] = useState('all');
  const [selectedSettlementOrderId, setSelectedSettlementOrderId] = useState<string | null>(null);
  const [viewingWorkOrderAssociated, setViewingWorkOrderAssociated] = useState<string | null>(null);

  const [activeFlowTab, setActiveFlowTab] = useState<'order' | 'margin'>('order');
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (slipId: string, value: string) => {
    setInputAmounts(prev => ({ ...prev, [slipId]: value }));
  };

  const handleConfirmPayment = (orderId: string, slipId: string) => {
    const amount = parseFloat(inputAmounts[slipId] || "0");
    if (isNaN(amount) || amount <= 0) return;

    setOrdersData(prev => prev.map(order => {
      if (order.orderId === orderId) {
        const updatedOrder = { ...order };
        
        // Update slip status
        updatedOrder.uploadedSlips = updatedOrder.uploadedSlips.map((slip: any) => 
          slip.id === slipId ? { ...slip, status: "confirmed" } : slip
        );

        // Add reconciliation record
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        updatedOrder.reconciliationRecords = [
          ...updatedOrder.reconciliationRecords,
          { id: `rec-${Date.now()}`, time: timeStr, amount, slipId }
        ];

        // Update total paid
        updatedOrder.confirmedPaid += amount;

        // Add to progress
        updatedOrder.progress = [
          ...(updatedOrder.progress || []),
          { id: `p-${Date.now()}`, time: timeStr, description: slipId.startsWith('manual') ? '财务手动录入收款' : '财务核销水单', amountChange: `+${getCurrencySymbol(orderId)}${amount.toLocaleString()}` }
        ];
        return updatedOrder;
      }
      return order;
    }));

    setInputAmounts(prev => ({ ...prev, [slipId]: "" }));
    setViewingSlip(null);
  };

  const handleManualSlipUpload = (orderId: string) => {
    const slipId = `manual-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setOrdersData(prev => prev.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          uploadedSlips: [
            ...order.uploadedSlips,
            { id: slipId, uploadTime: timeStr, imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80", status: "pending", isManual: true }
          ],
          progress: [
            ...(order.progress || []),
            { id: `p-${Date.now()}`, time: timeStr, description: '财务代传水单凭证', amountChange: '-' }
          ]
        };
      }
      return order;
    }));
    setIsManualUploadModalOpen(false);
  };

  // Calendar Logic
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleDateClick = (day: number) => {
    const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: dateStr, end: null });
    } else {
      if (dateStr < dateRange.start) {
        setDateRange({ start: dateStr, end: dateRange.start });
      } else {
        setDateRange({ ...dateRange, end: dateStr });
      }
      setShowCalendar(false);
    }
  };

  const isDateInRange = (dateStr: string) => {
    if (!dateRange.start) return false;
    if (!dateRange.end) return dateStr === dateRange.start;
    return dateStr >= dateRange.start && dateStr <= dateRange.end;
  };

  const isDateSelected = (dateStr: string) => {
    return dateStr === dateRange.start || dateStr === dateRange.end;
  };

  // Filter Orders
  const filteredOrders = ordersData.filter(order => {
    // 1. Date Filter
    if (dateRange.start && order.date < dateRange.start) return false;
    if (dateRange.end && order.date > dateRange.end) return false;

    // 2. Status Filter
    const totalDue = order.depositDue + order.balanceDue;
    
    let status = 'pending';
    if (order.confirmedPaid >= totalDue) status = 'completed';
    else if (order.confirmedPaid > 0) status = 'partial';

    if (statusFilter !== 'all' && status !== statusFilter) return false;

    // 3. Search Query Filter (Order ID, Manifest Name)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!order.orderId.toLowerCase().includes(q) && !order.manifestName.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 4. Buyer Filter
    if (buyerQuery) {
      const bq = buyerQuery.toLowerCase();
      if (!order.customerName.toLowerCase().includes(bq) && !(order.distributor && order.distributor.toLowerCase().includes(bq))) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 rounded-full transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-1">财务管理</h1>
            <p className="text-xs md:text-sm text-zinc-500">按订单维度核对银行转账汇款及提现管理</p>
          </div>
        </div>
        <div className="bg-zinc-100 text-zinc-600 px-4 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm">
          <Info size={16} className="text-zinc-400 shrink-0" />
          当前版本仅支持银行转账核销
        </div>
      </div>

      <div className="flex gap-8 border-b border-zinc-200 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button onClick={() => setActiveMainTab('reconciliation')} className={`pb-3 text-sm font-bold transition-colors ${activeMainTab === 'reconciliation' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>收款核销</button>
        <button onClick={() => setActiveMainTab('withdrawal')} className={`pb-3 text-sm font-bold transition-colors ${activeMainTab === 'withdrawal' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>对账</button>
        <button onClick={() => setActiveMainTab('work_order')} className={`pb-3 text-sm font-bold transition-colors flex items-center gap-1 ${activeMainTab === 'work_order' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>
          工单处理
          {workOrders.filter(o => o.status === 'pending').length > 0 && (
            <span className="bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">{workOrders.filter(o => o.status === 'pending').length}</span>
          )}
        </button>
        <button onClick={() => setActiveMainTab('profit_ledger')} className={`pb-3 text-sm font-bold transition-colors ${activeMainTab === 'profit_ledger' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>利润核算与对账</button>
      </div>

      {activeMainTab === 'reconciliation' ? (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8 flex-wrap">
        {/* Date Range Picker */}
        <div className="relative w-full md:w-auto" ref={calendarRef}>
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 shadow-sm hover:border-black transition-colors min-w-[260px] w-full md:w-auto overflow-hidden text-ellipsis whitespace-nowrap text-left"
          >
            <CalendarIcon size={18} className="text-zinc-400 shrink-0" />
            <span className="text-sm font-bold">
              {dateRange.start ? dateRange.start : '选择开始日期'} 
              {' 至 '} 
              {dateRange.end ? dateRange.end : (dateRange.start ? '选择结束日期' : '选择结束日期')}
            </span>
          </button>

          {showCalendar && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-zinc-200 shadow-xl p-4 z-20 w-72">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                  className="p-1 hover:bg-zinc-100 rounded"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="font-bold text-sm">
                  {calendarMonth.getFullYear()}年 {calendarMonth.getMonth() + 1}月
                </div>
                <button 
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                  className="p-1 hover:bg-zinc-100 rounded"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d} className="text-[10px] font-bold text-zinc-400">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {paddingDays.map(i => <div key={`pad-${i}`} />)}
                {days.map(day => {
                  const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = isDateSelected(dateStr);
                  const inRange = isDateInRange(dateStr);
                  
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        w-8 h-8 text-xs flex items-center justify-center rounded-full transition-colors
                        ${isSelected ? 'bg-black text-white font-bold' : ''}
                        ${!isSelected && inRange ? 'bg-zinc-100 font-bold' : ''}
                        ${!isSelected && !inRange ? 'hover:bg-zinc-100' : ''}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                <button 
                  onClick={() => { setDateRange({start: null, end: null}); setShowCalendar(false); }}
                  className="text-xs text-zinc-500 hover:text-black"
                >
                  清除选择
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 shadow-sm w-full md:w-auto flex-1 max-w-[200px]">
          <Filter size={18} className="text-zinc-400 shrink-0" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer w-full text-ellipsis"
          >
            <option value="all">全部对账状态</option>
            <option value="pending">待核销 (未付款)</option>
            <option value="partial">部分核销 (部分付)</option>
            <option value="completed">已结清 (全额)</option>
          </select>
        </div>

        {/* Search Query Filter */}
        <div className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 shadow-sm w-full md:w-auto flex-1">
          <Search size={18} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="搜索订单号或包含货单..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm font-bold focus:outline-none w-full"
          />
        </div>

        {/* Buyer Filter */}
        <div className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 shadow-sm w-full md:w-auto flex-1">
          <Search size={18} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="搜索买家..."
            value={buyerQuery}
            onChange={(e) => setBuyerQuery(e.target.value)}
            className="bg-transparent text-sm font-bold focus:outline-none w-full"
          />
        </div>

        <div className="text-xs md:text-sm text-zinc-500 w-full md:w-auto text-left md:text-right mt-2 md:mt-0">
          共 {filteredOrders.length} 个订单
        </div>
      </div>

      {/* Orders List / Horizontal Layout */}
      <div className="mb-4 flex justify-between items-center bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">财务快捷操作:</span>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 text-[10px] font-bold hover:border-black transition-colors">
            <Upload size={14} />
            上传线下付款水单记录
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 text-[10px] font-bold hover:border-black transition-colors">
            <Paperclip size={14} />
            批量关联截图凭证 (微信/WhatsApp)
          </button>
        </div>
        <div className="text-[10px] text-zinc-400 italic">结算说明: App订单固定RMB显示，EUR结算。PC后台支持多币种手动确认。</div>
      </div>

      <div className="mb-8">
        <div className="bg-white border border-zinc-200 shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest items-center">
            <div className="col-span-3">出货单 / 来源</div>
            <div className="col-span-2">买家</div>
            <div className="col-span-2 text-right">应收金额</div>
            <div className="col-span-2 text-right">待核销金额</div>
            <div className="col-span-2 pl-4">核销状态</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filteredOrders.map(order => {
            const totalDue = order.depositDue + order.balanceDue;
            const pendingAmount = Math.max(0, totalDue - order.confirmedPaid);
            const isFullyPaid = pendingAmount === 0;

            let statusLabel = '待核销';
            let statusClass = 'bg-red-50 text-red-700 border-red-200';
            if (isFullyPaid) {
              statusLabel = '已结清';
              statusClass = 'bg-green-50 text-green-700 border-green-200';
            } else if (order.confirmedPaid > 0) {
              statusLabel = '部分核销';
              statusClass = 'bg-blue-50 text-blue-700 border-blue-200';
            }

            return (
              <div key={order.orderId} className="border-b border-zinc-200 hover:border-black transition-colors bg-white group" onClick={() => setSelectedOrderId(order.orderId)}>
                <div className="bg-zinc-50 px-4 md:px-6 py-3 border-b border-zinc-200 flex flex-wrap items-center gap-2 md:gap-4 cursor-pointer">
                  <span className="font-bold text-xs">{order.orderId}</span>
                  <span className="text-[10px] text-zinc-500">{order.date}</span>
                </div>
                
                <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 md:items-center cursor-pointer">
                  <div className="md:col-span-3 md:pr-4">
                    <div className="text-xs font-bold flex items-center gap-1"><FileText size={14} className="text-zinc-400" /> {order.manifestName}</div>
                  </div>
                  
                  <div className="md:col-span-2 md:pr-4">
                    <div className="text-xs text-zinc-500 md:hidden mb-1">买家</div>
                    <div className="text-xs font-bold truncate">{order.customerName}</div>
                  </div>
                  
                  <div className="md:col-span-2 md:pr-4 md:text-right">
                    <div className="text-xs text-zinc-500 md:hidden mb-1">应收金额</div>
                    <div className="text-sm font-bold">{getCurrencySymbol(order.orderId)} {totalDue.toLocaleString()}</div>
                  </div>
                  
                  <div className="md:col-span-2 md:pr-4 md:text-right">
                    <div className="text-xs text-zinc-500 md:hidden mb-1">待核销金额</div>
                    <div className={`text-sm font-bold ${pendingAmount > 0 ? 'text-red-500' : 'text-zinc-600'}`}>
                      {getCurrencySymbol(order.orderId)} {pendingAmount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 md:pl-4">
                    <div className="text-xs text-zinc-500 md:hidden mb-1">核销状态</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  
                  <div className="md:col-span-1 md:text-right pt-4 border-t border-zinc-100 md:border-none md:pt-0">
                    <button className="text-xs font-bold text-zinc-600 hover:text-black">查看详情</button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-20 text-zinc-500 border-t border-zinc-200">
              所选区间内没有符合条件的订单记录
            </div>
          )}
        </div>
      </div>
      </>
      ) : activeMainTab === 'work_order' ? (
        <WorkOrderManagement />
      ) : activeMainTab === 'profit_ledger' ? (
        <FinanceProfitLedger />
      ) : activeMainTab === 'withdrawal' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Account Sub-Tabs */}
          <div className="flex gap-6 border-b border-zinc-200">
            <button 
              onClick={() => {
                setActiveAccountTab('domestic');
                if (activeFlowTab === 'margin') setActiveFlowTab('order');
              }}
              className={`pb-3 text-sm font-bold transition-colors ${activeAccountTab === 'domestic' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
            >
              国内账户
            </button>
            <button 
              onClick={() => setActiveAccountTab('international')}
              className={`pb-3 text-sm font-bold transition-colors ${activeAccountTab === 'international' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
            >
              国际账户
            </button>
          </div>

          {activeAccountTab === 'international' ? (
            <div className="bg-white border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest">国际账户结算规则</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex-1">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">当前结算周期</div>
                  <div className="text-lg font-bold">自动结算</div>
                  <div className="text-xs text-zinc-500 mt-1">按周期自动计算可提现金额并结算</div>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex-1">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">交易手续费</div>
                  <div className="text-lg font-bold text-orange-600">1.5%</div>
                  <div className="text-xs text-zinc-500 mt-1">国际账户固定费率</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 p-6 shadow-sm">
              <div className="flex flex-col mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest mb-2">国内账户结算规则</h2>
                <div className="text-xs text-zinc-500">
                  开启或关闭极速结算，修改每月限 1 次。设置的规则将于<span className="font-bold text-black border-b border-black md:mx-1">次日</span>针对新产生的订单生效。
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-zinc-50 p-4 border border-zinc-200 mb-4">
                <div>
                  <div className="font-bold mb-1 flex items-center gap-2">
                    开启极速结算 (T+1)
                    {domesticSettlementMode === 't1' && <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-sm">开启中</span>}
                  </div>
                  <div className="text-xs text-zinc-500">
                    默认 T+7 结算 (收货后+7天, 费率0.6%)。开启极速结算后，订单<span className="font-bold">揽收后+1天</span>即可结算，费率为 1.0%。
                  </div>
                </div>
                <div className="shrink-0">
                  <label className="relative flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={domesticSettlementMode === 't1'}
                      onChange={(e) => {
                        const newMode = e.target.checked ? 't1' : 't7';
                        setDomesticSettlementMode(newMode);
                        const today = new Date();
                        setLastModeChangeDate(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
                      }}
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>

              {lastModeChangeDate && (
                <div className="text-[10px] text-zinc-400 mb-4 flex items-center gap-1">
                  上次修改日期: {lastModeChangeDate}。本自然月内不可再次修改。
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex-1 transition-all">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">当前结算周期</div>
                  <div className="text-lg font-bold">{domesticSettlementMode === 't1' ? 'T+1' : 'T+7'}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {domesticSettlementMode === 't1' ? '揽收后 +1 天自动结算' : '收货后 +7 天自动结算'}
                  </div>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex-1 transition-all">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">当前交易手续费</div>
                  <div className="text-lg font-bold text-orange-600">{domesticSettlementMode === 't1' ? '1.0%' : '0.6%'}</div>
                  <div className="text-xs text-zinc-500 mt-1">从结算款中扣除</div>
                </div>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 ${activeAccountTab === 'international' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
            {activeAccountTab === 'international' && (
              <div className="bg-white border border-zinc-200 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-bold text-zinc-500">保证金账户</div>
                  <button 
                    onClick={() => setActiveDetailModal('margin')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    查看明细
                  </button>
                </div>
                <div className="text-2xl md:text-3xl font-black mb-2">¥ 25,000.00</div>
                <div className="text-xs text-zinc-400 mt-auto">用于支付B2B结算，运费和税费结算</div>
              </div>
            )}
            <div className="bg-white border border-zinc-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-bold text-zinc-500">冻结中资金</div>
                <button 
                  onClick={() => setActiveDetailModal('frozen')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  查看明细
                </button>
              </div>
              <div className="text-2xl md:text-3xl font-black text-orange-600 mb-4">¥ {activeAccountTab === 'domestic' ? '12,500.00' : '85,000.00'}</div>
              <div className="grid grid-cols-2 gap-4 mt-auto p-3 bg-zinc-50 border border-zinc-100">
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">冻结货款</div>
                  <div className="font-bold">¥ {activeAccountTab === 'domestic' ? '10,000.00' : '70,000.00'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">冻结佣金</div>
                  <div className="font-bold">¥ {activeAccountTab === 'domestic' ? '2,500.00' : '15,000.00'}</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-bold text-zinc-500">已结算资金 (本月)</div>
                <button 
                  onClick={() => setActiveDetailModal('settled')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  查看明细
                </button>
              </div>
              <div className="text-2xl md:text-3xl font-black text-green-600 mb-4">¥ {activeAccountTab === 'domestic' ? '43,200.00' : '285,000.00'}</div>
              <div className="grid grid-cols-2 gap-4 mt-auto p-3 bg-zinc-50 border border-zinc-100">
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">结算货款</div>
                  <div className="font-bold">¥ {activeAccountTab === 'domestic' ? '35,000.00' : '240,000.00'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">结算佣金</div>
                  <div className="font-bold">¥ {activeAccountTab === 'domestic' ? '8,200.00' : '45,000.00'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 流水明细块 */}
          <div className="space-y-6">
            
            {/* 流水 Tab 切换 */}
            <div className="flex gap-6 border-b border-zinc-200">
              <button 
                onClick={() => setActiveFlowTab('order')} 
                className={`pb-3 text-sm font-bold transition-colors ${activeFlowTab === 'order' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
              >
                订单结算流水
              </button>
              {activeAccountTab === 'international' && (
                <button 
                  onClick={() => setActiveFlowTab('margin')} 
                  className={`pb-3 text-sm font-bold transition-colors ${activeFlowTab === 'margin' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
                >
                  保证金流水
                </button>
              )}
            </div>

            {activeFlowTab === 'order' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* 结算流水筛选 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      placeholder="搜索订单号..." 
                      value={settlementSearch}
                      onChange={e => setSettlementSearch(e.target.value)}
                      className="border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none w-full md:w-64"
                    />
                    <select 
                      value={settlementStatus}
                      onChange={e => setSettlementStatus(e.target.value)}
                      className="border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white w-full md:w-auto"
                    >
                      <option value="all">全部结算状态</option>
                      <option value="frozen">冻结中</option>
                      <option value="settled">已结算</option>
                      <option value="refunding">退款中</option>
                      <option value="refunded">已退款</option>
                    </select>
                  </div>
                  <div className="relative w-full md:w-auto" ref={calendarRef}>
                    <button 
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 hover:border-black transition-colors min-w-[260px] w-full md:w-auto overflow-hidden text-ellipsis whitespace-nowrap text-left"
                    >
                      <CalendarIcon size={18} className="text-zinc-400 shrink-0" />
                      <span className="text-sm font-bold">
                        {dateRange.start ? dateRange.start : '选择开始日期'} 
                        {' 至 '} 
                        {dateRange.end ? dateRange.end : (dateRange.start ? '选择结束日期' : '选择结束日期')}
                      </span>
                    </button>
                    {/* Reusing showCalendar dropdown */}
                    {showCalendar && (
                      <div className="absolute top-full right-0 mt-2 bg-white border border-zinc-200 shadow-xl p-4 z-20 w-72">
                        <div className="flex items-center justify-between mb-4">
                          <button 
                            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                            className="p-1 hover:bg-zinc-100 rounded"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <div className="font-bold text-sm">
                            {calendarMonth.getFullYear()}年 {calendarMonth.getMonth() + 1}月
                          </div>
                          <button 
                            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                            className="p-1 hover:bg-zinc-100 rounded"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                            <div key={d} className="text-[10px] font-bold text-zinc-400">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()}).map((_, i) => {
                            const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                            const isSelected = dateRange.start === dateStr || dateRange.end === dateStr;
                            const isBetween = dateRange.start && dateRange.end && dateStr > dateRange.start && dateStr < dateRange.end;
                            return (
                              <button 
                                key={i} 
                                onClick={() => {
                                  if (!dateRange.start || (dateRange.start && dateRange.end)) {
                                    setDateRange({start: dateStr, end: null});
                                  } else if (dateStr >= dateRange.start) {
                                    setDateRange({start: dateRange.start, end: dateStr});
                                    setShowCalendar(false);
                                  } else {
                                    setDateRange({start: dateStr, end: dateRange.start});
                                    setShowCalendar(false);
                                  }
                                }}
                                className={`p-2 text-xs text-center hover:bg-zinc-100 rounded ${isSelected ? 'bg-black text-white hover:bg-zinc-800' : ''} ${isBetween ? 'bg-zinc-100' : ''}`}
                              >
                                {i + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 订单流水 */}
                <div className="bg-white border border-zinc-200 shadow-sm">
                  <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                      <Banknote size={18} />
                      订单结算流水
                    </h2>
                    <div className="text-xs text-zinc-500">展示最近结算及手续费扣除记录</div>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[700px]">
                      <thead className="bg-zinc-50/50 text-xs text-zinc-500 uppercase">
                        <tr>
                          <th className="px-6 py-3 font-bold border-b border-zinc-200">订单号/时间</th>
                          <th className="px-6 py-3 font-bold border-b border-zinc-200">结算状态</th>
                          <th className="px-6 py-3 font-bold border-b border-zinc-200 text-right">结算货款</th>
                          <th className="px-6 py-3 font-bold border-b border-zinc-200 text-right">结算佣金</th>
                          <th className="px-6 py-3 font-bold border-b border-zinc-200 text-right text-orange-600">手续费</th>
                          <th className="px-6 py-3 font-bold border-b border-zinc-200 text-right text-green-600">实际入账</th>
                          <th className="px-6 py-3 font-bold border-b border-zinc-200 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeAccountTab === 'international' ? (
                          <>
                            <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                              <td className="px-6 py-4">
                                <div className="font-mono text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedSettlementOrderId('O-DEP-88902')}>O-DEP-88902</div>
                                <div className="text-xs text-zinc-400">2024-05-02 10:15</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 text-[10px] font-bold">已结算</span>
                              </td>
                              <td className="px-6 py-4 text-right">¥ 8,000.00</td>
                              <td className="px-6 py-4 text-right">¥ 2,000.00</td>
                              <td className="px-6 py-4 text-right text-orange-600">- ¥ 150.00</td>
                              <td className="px-6 py-4 text-right text-green-600 font-bold">+ ¥ 9,850.00</td>
                              <td className="px-6 py-4 text-center">
                                <button onClick={() => setSelectedSettlementOrderId('O-DEP-88902')} className="text-blue-600 hover:underline text-xs">查看详情</button>
                              </td>
                            </tr>
                            <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                              <td className="px-6 py-4">
                                <div className="font-mono text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedSettlementOrderId('O-FUL-77234')}>O-FUL-77234</div>
                                <div className="text-xs text-zinc-400">2024-05-02 11:30</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 text-[10px] font-bold">冻结中</span>
                              </td>
                              <td className="px-6 py-4 text-right">¥ 40,000.00</td>
                              <td className="px-6 py-4 text-right">¥ 10,000.00</td>
                              <td className="px-6 py-4 text-right text-orange-600">- ¥ 750.00</td>
                              <td className="px-6 py-4 text-right text-green-600 font-bold">+ ¥ 49,250.00</td>
                              <td className="px-6 py-4 text-center">
                                <button onClick={() => setSelectedSettlementOrderId('O-FUL-77234')} className="text-blue-600 hover:underline text-xs">查看详情</button>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                              <td className="px-6 py-4">
                                <div className="font-mono text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedSettlementOrderId('O-DEP-88902')}>O-DEP-88902</div>
                                <div className="text-xs text-zinc-400">2024-05-02 10:15</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 text-[10px] font-bold">已结算</span>
                              </td>
                              <td className="px-6 py-4 text-right">¥ 1,500.00</td>
                              <td className="px-6 py-4 text-right">¥ 500.00</td>
                              <td className="px-6 py-4 text-right text-orange-600">- ¥ {domesticSettlementMode === 't1' ? '20.00' : '12.00'}</td>
                              <td className="px-6 py-4 text-right text-green-600 font-bold">+ ¥ {domesticSettlementMode === 't1' ? '1,980.00' : '1,988.00'}</td>
                              <td className="px-6 py-4 text-center">
                                <button onClick={() => setSelectedSettlementOrderId('O-DEP-88902')} className="text-blue-600 hover:underline text-xs">查看详情</button>
                              </td>
                            </tr>
                            <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                              <td className="px-6 py-4">
                                <div className="font-mono text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedSettlementOrderId('O-FUL-77234')}>O-FUL-77234</div>
                                <div className="text-xs text-zinc-400">2024-05-02 11:30</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 text-[10px] font-bold">冻结中</span>
                              </td>
                              <td className="px-6 py-4 text-right">¥ 20,000.00</td>
                              <td className="px-6 py-4 text-right">¥ 8,900.00</td>
                              <td className="px-6 py-4 text-right text-orange-600">- ¥ {domesticSettlementMode === 't1' ? '289.00' : '173.40'}</td>
                              <td className="px-6 py-4 text-right text-green-600 font-bold">+ ¥ {domesticSettlementMode === 't1' ? '28,611.00' : '28,726.60'}</td>
                              <td className="px-6 py-4 text-center">
                                <button onClick={() => setSelectedSettlementOrderId('O-FUL-77234')} className="text-blue-600 hover:underline text-xs">查看详情</button>
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeFlowTab === 'margin' && activeAccountTab === 'international' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div className="flex justify-between items-center bg-white border border-zinc-200 shadow-sm p-4">
                   <div>
                     <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                       <CreditCard size={18} />
                       保证金账户流水
                     </h2>
                     <div className="text-xs text-zinc-500 mt-1">展示向供应商支付货款，平台税费/运费支付，及资金充值明细</div>
                   </div>
                   <button 
                     onClick={() => setShowRechargeModal(true)}
                     className="bg-black text-white px-6 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors uppercase tracking-widest"
                   >
                     充值
                   </button>
                 </div>
                 <div className="bg-white border border-zinc-200 shadow-sm">
                   <div className="p-0 overflow-x-auto">
                     <table className="w-full text-left text-sm min-w-[700px]">
                       <thead className="bg-zinc-50/50 text-xs text-zinc-500 uppercase">
                         <tr>
                            <th className="px-6 py-3 font-bold border-b border-zinc-200">流水号/时间</th>
                            <th className="px-6 py-3 font-bold border-b border-zinc-200">交易类型</th>
                            <th className="px-6 py-3 font-bold border-b border-zinc-200">关联信息</th>
                            <th className="px-6 py-3 font-bold border-b border-zinc-200 text-right">金额</th>
                            <th className="px-6 py-3 font-bold border-b border-zinc-200">状态</th>
                         </tr>
                       </thead>
                       <tbody>
                          <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                             <td className="px-6 py-4">
                                <div className="font-mono text-xs">DEP-20240503-01</div>
                                <div className="text-xs text-zinc-400">2024-05-03 14:00</div>
                             </td>
                             <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 text-[10px] font-bold">充值资金</span></td>
                             <td className="px-6 py-4 text-xs text-zinc-500">公对公转入</td>
                             <td className="px-6 py-4 text-right font-bold text-green-600">+ ¥ 50,000.00</td>
                             <td className="px-6 py-4"><span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 font-bold">已充值</span></td>
                          </tr>
                          <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                             <td className="px-6 py-4">
                                <div className="font-mono text-xs">TAX-20240502-05</div>
                                <div className="text-xs text-zinc-400">2024-05-02 16:30</div>
                             </td>
                             <td className="px-6 py-4"><span className="bg-orange-50 text-orange-600 px-2 py-1 text-[10px] font-bold">税和运费结算</span></td>
                             <td className="px-6 py-4 text-xs font-mono text-blue-600 hover:underline cursor-pointer">O-DEP-88902</td>
                             <td className="px-6 py-4 text-right font-bold text-orange-600">- ¥ 1,200.00</td>
                             <td className="px-6 py-4"><span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 font-bold">已扣款</span></td>
                          </tr>
                          <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                             <td className="px-6 py-4">
                                <div className="font-mono text-xs">B2B-20240502-11</div>
                                <div className="text-xs text-zinc-400">2024-05-02 11:20</div>
                             </td>
                             <td className="px-6 py-4"><span className="bg-purple-50 text-purple-600 px-2 py-1 text-[10px] font-bold">供应商货款支付</span></td>
                             <td className="px-6 py-4 text-xs font-mono text-blue-600 hover:underline cursor-pointer">O-FUL-77234</td>
                             <td className="px-6 py-4 text-right font-bold text-orange-600">- ¥ 30,000.00</td>
                             <td className="px-6 py-4"><span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 font-bold">已支付</span></td>
                          </tr>
                          <tr className="hover:bg-zinc-50 border-b border-zinc-100">
                             <td className="px-6 py-4">
                                <div className="font-mono text-xs">DEP-20240501-02</div>
                                <div className="text-xs text-zinc-400">2024-05-01 09:15</div>
                             </td>
                             <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 text-[10px] font-bold">充值资金</span></td>
                             <td className="px-6 py-4 text-xs text-zinc-500">水单已上传</td>
                             <td className="px-6 py-4 text-right font-bold text-green-600">+ ¥ 20,000.00</td>
                             <td className="px-6 py-4"><span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 font-bold">审核中</span></td>
                          </tr>
                       </tbody>
                     </table>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Settlement Details Drawer */}
      {selectedSettlementOrderId && (() => {
        const order = ordersData.find(o => o.orderId === selectedSettlementOrderId);
        if (!order) return null;

        // Mock statuses
        const settlementStatus = order.orderId === 'O-DEP-88902' ? '已结算' : '冻结中';
        const isSettled = settlementStatus === '已结算';
        
        return (
          <div className="fixed inset-0 z-40 flex justify-end md:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSettlementOrderId(null)}></div>
            <div className="relative w-full md:w-[600px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-zinc-100">
                <div>
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1">订单结算详情</h2>
                  <div className="text-xs text-zinc-500 font-mono">订单编号: {order.orderId}</div>
                </div>
                <button onClick={() => setSelectedSettlementOrderId(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-50 p-4 border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">支付单号</div>
                    <div className="font-mono text-sm">PAY-{order.orderId.substring(6)}-2024</div>
                  </div>
                  <div className="bg-zinc-50 p-4 border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">结算时间</div>
                    <div className="font-mono text-sm">{isSettled ? '2024-05-02 10:15' : '--'}</div>
                  </div>
                  <div className="bg-zinc-50 p-4 border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">订单状态</div>
                    <div className="font-bold text-sm text-zinc-800">已发货 / 已签收</div>
                  </div>
                  <div className={`p-4 border ${isSettled ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isSettled ? 'text-emerald-600' : 'text-orange-600'}`}>结算状态</div>
                    <div className={`font-bold text-sm ${isSettled ? 'text-emerald-700' : 'text-orange-700'}`}>{settlementStatus}</div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">包含商品</div>
                <div className="space-y-2">
                  {order.products.map((product: any, pIdx: number) => (
                    <div key={pIdx} className="flex items-center justify-between text-xs bg-zinc-50 p-3 border border-zinc-100">
                      <div>
                        <div className="font-bold mb-0.5">{product.name}</div>
                        <div className="text-zinc-500 font-mono text-[10px]">SKU: {product.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">¥ {product.price.toLocaleString()}</div>
                        <div className="text-zinc-500">x {product.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Order Details Drawer */}
      {selectedOrderId && (() => {
        const order = ordersData.find(o => o.orderId === selectedOrderId);
        if (!order) return null;
        
        const totalDue = order.depositDue + order.balanceDue;
        const pendingAmount = Math.max(0, totalDue - order.confirmedPaid);
        const isFullyPaid = pendingAmount === 0;

        return (
          <div className="fixed inset-0 z-40 flex justify-end md:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrderId(null)}></div>
            <div className="relative w-full md:w-[1000px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-zinc-100">
                <div>
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1">订单收银核销详情</h2>
                  <div className="text-xs text-zinc-500 font-mono">订单编号: {order.orderId}</div>
                </div>
                <button onClick={() => setSelectedOrderId(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col md:grid md:grid-cols-12 md:divide-x divide-zinc-200 min-h-full">
                  {/* Order Details */}
                  <div className="md:col-span-7 p-4 md:p-8">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">货单归属</div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-bold mb-1 flex items-center gap-2">
                        <FileText size={16} className="text-zinc-400" />
                        {order.manifestName}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-orange-50/50 border border-orange-100 p-3 mb-6 text-xs text-orange-900 flex gap-2 rounded-sm">
                        <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-orange-500" />
                        <div>
                          <span className="font-bold mr-1">订单备注:</span>
                          {order.notes}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">包含商品</div>
                    <div className="space-y-2">
                      {order.products.map((product: any, pIdx: number) => (
                        <div key={pIdx} className="flex items-center justify-between text-xs bg-zinc-50 p-3 border border-zinc-100">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold">{product.name}</span>
                              {product.confirmed ? (
                                <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm border border-green-200">已确认</span>
                              ) : (
                                <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-sm border border-orange-200">待确认</span>
                              )}
                            </div>
                            <div className="text-zinc-500 font-mono text-[10px]">SKU: {product.sku}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">¥ {product.price.toLocaleString()}</div>
                            <div className="text-zinc-500">x {product.qty}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reconciliation Panel */}
                  <div className="md:col-span-5 p-4 md:p-8 bg-zinc-50/30 flex flex-col border-t md:border-t-0 border-zinc-200">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">财务核销汇总</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white border border-zinc-200 p-4">
                          <div className="text-xs text-zinc-500 mb-1">订单总应付</div>
                          <div className="text-xl font-black">¥ {totalDue.toLocaleString()}</div>
                          <div className="text-[10px] text-zinc-400 mt-2">
                            定金: ¥{order.depositDue.toLocaleString()} | 尾款: ¥{order.balanceDue.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white border border-zinc-200 p-4">
                          <div className="text-xs text-zinc-500 mb-1">当前待付金额</div>
                          <div className={`text-xl font-black ${pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {getCurrencySymbol(order.orderId)} {pendingAmount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-2">
                            已确认收款: {getCurrencySymbol(order.orderId)}{order.confirmedPaid.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Reconciliation Records */}
                      {order.reconciliationRecords.length > 0 && (
                        <div className="mb-6">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">已核销记录</div>
                          <div className="space-y-2">
                            {order.reconciliationRecords.map((rec: any) => (
                              <div key={rec.id} className="flex items-center justify-between text-xs bg-white border border-zinc-200 p-3">
                                <div className="flex items-center gap-2 text-zinc-600">
                                  <CheckCircle2 size={14} className="text-green-600" />
                                  {rec.time}
                                </div>
                                <div className="font-bold text-black">{getCurrencySymbol(order.orderId)} {rec.amount.toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-zinc-200 pt-6 mt-auto">
                      {isFullyPaid ? (
                        <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 border border-green-200 font-bold text-sm">
                          <CheckCircle2 size={18} />
                          该订单已全部结清
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-bold mb-3 flex items-center justify-between">
                            <span>前端上传的水单记录</span>
                            <span className="text-zinc-400 font-normal">点击查看并核销</span>
                          </div>
                          
                          {order.uploadedSlips.length > 0 ? (
                            <div className="space-y-3">
                              {order.uploadedSlips.map((slip: any) => (
                                <div key={slip.id} className="flex items-center justify-between bg-white border border-zinc-200 p-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center text-zinc-400">
                                      {slip.imageUrl ? <img src={slip.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={18} />}
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold mb-0.5">{slip.isManual ? '客服/财务代传凭证' : '银行汇款凭证'}</div>
                                      <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                                        <Clock size={10} />
                                        {slip.isManual ? '上传于' : '上传于'} {slip.uploadTime}
                                      </div>
                                    </div>
                                  </div>
                                  {slip.status === 'confirmed' ? (
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-sm flex items-center gap-1">
                                      <Check size={12} /> 已核销
                                    </span>
                                  ) : (
                                    <button 
                                      onClick={() => setViewingSlip({ url: slip.imageUrl, slipId: slip.id, orderId: order.orderId, isManual: slip.isManual })}
                                      className="text-xs font-bold bg-black text-white px-4 py-2 hover:bg-zinc-800 transition-colors"
                                    >
                                      查看并核销
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-xs text-zinc-500 bg-white border border-dashed border-zinc-300 gap-3">
                              <ImageIcon size={24} className="opacity-20" />
                              <span>买家暂未上传水单记录</span>
                              <button 
                                onClick={() => handleManualSlipUpload(order.orderId)}
                                className="text-[10px] font-bold border border-zinc-200 px-3 py-1.5 hover:border-black transition-colors"
                              >
                                财务代传水单 (手动核销)
                              </button>
                            </div>
                          )}

                          <div className="mt-4 flex flex-col items-center justify-center py-4 bg-zinc-50 border border-zinc-200 border-dashed">
                            <span className="text-xs text-zinc-500 mb-2">或进行差额补缴/线下收款</span>
                            <button 
                              onClick={() => setViewingSlip({ slipId: `manual-${Date.now()}`, orderId: order.orderId, isManual: true })}
                              className="text-xs font-bold bg-black text-white px-6 py-2 hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                              直接录入收款金额 (无凭证)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Slip Viewer Modal */}
      {viewingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingSlip(null)}></div>
          <div className="relative bg-white w-full max-w-3xl flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ImageIcon size={20} />
                水单核销
              </h2>
              <button onClick={() => setViewingSlip(null)} className="text-zinc-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row h-[600px]">
              {/* Image Preview */}
              <div className="flex-1 bg-zinc-100 p-6 flex flex-col items-center justify-center overflow-hidden">
                {viewingSlip.isManual ? (
                  <div className="flex flex-col items-center justify-center gap-3 opacity-60 text-zinc-400">
                    <ImageIcon size={48} className="opacity-20" />
                    <div className="text-xs font-black uppercase tracking-widest">财务手动核销模式</div>
                    <div className="text-[10px] text-center max-w-[200px]">已由财务/客服核实线下到账，<br />请录入实际收到的结算币种金额</div>
                  </div>
                ) : viewingSlip.url ? (
                  <img src={viewingSlip.url} alt="Bank Slip" className="max-w-full max-h-full object-contain shadow-md" />
                ) : (
                  <div className="text-zinc-400 flex flex-col items-center justify-center gap-4">
                    <ImageIcon size={48} className="opacity-20" />
                    <span className="text-sm font-bold">顾客暂未上传水单图片截图</span>
                  </div>
                )}
              </div>
              
              {/* Action Panel */}
              <div className="w-80 border-l border-zinc-200 p-6 flex flex-col bg-zinc-50">
                <div className="mb-6">
                  <div className="text-xs font-bold text-zinc-500 mb-2">核对说明</div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    请仔细核对左侧水单中的汇款金额。确认无误后，在下方录入实际收到的金额，系统将自动更新该订单的已付总额。
                  </p>
                </div>

                <div className="mt-auto">
                  <label className="block text-xs font-bold mb-2">录入实际收到金额</label>
                  <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{getCurrencySymbol(viewingSlip.orderId)}</span>
                    <input 
                      type="number" 
                      placeholder="输入金额..."
                      value={inputAmounts[viewingSlip.slipId] || ''}
                      onChange={(e) => handleAmountChange(viewingSlip.slipId, e.target.value)}
                      className="w-full border border-zinc-300 pl-8 pr-4 py-3 text-lg font-bold focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                    />
                  </div>
                  <button 
                    onClick={() => handleConfirmPayment(viewingSlip.orderId, viewingSlip.slipId)}
                    disabled={!inputAmounts[viewingSlip.slipId]}
                    className="w-full bg-black text-white px-6 py-3 text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    确认收款并核销
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Associated Order Detail Drawer */}
      {viewingWorkOrderAssociated && (() => {
        const orderInfo = ordersData.find(o => o.orderId === viewingWorkOrderAssociated);
        const progressList = orderInfo?.progress || [
          { id: '1', time: '2024-05-10 10:00', description: '买家付款', amountChange: '+¥28,000' },
          { id: '2', time: '2024-05-11 11:30', description: '供货商确认部分商品', amountChange: '-' }
        ];
        return (
          <div className="fixed inset-0 z-40 flex justify-end md:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewingWorkOrderAssociated(null)}></div>
            <div className="relative w-full md:w-[600px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-zinc-100">
                <div>
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1">关联货单/订单详情</h2>
                  <div className="text-xs text-zinc-500 font-mono">订单编号: {viewingWorkOrderAssociated}</div>
                </div>
                <button onClick={() => setViewingWorkOrderAssociated(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-50 p-4 border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">已收款金额</div>
                    <div className="font-mono text-sm font-black text-green-600">{getCurrencySymbol(viewingWorkOrderAssociated)} {orderInfo?.confirmedPaid?.toLocaleString() || '0'}</div>
                  </div>
                  <div className="bg-zinc-50 p-4 border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">已确认商品金额</div>
                    <div className="font-mono text-sm font-black text-blue-600">
                      {getCurrencySymbol(viewingWorkOrderAssociated)} {orderInfo?.items?.filter((i: any) => i.status !== 'pending_confirmation' && i.status !== 'pending_payment').reduce((s: number, i: any) => s + i.price * i.count, 0).toLocaleString() || '0'}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">订单进程</div>
                <div className="space-y-3">
                  {progressList.map(p => (
                    <div key={p.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-black mt-1.5"></div>
                        <div className="w-px h-full bg-zinc-200 mt-1"></div>
                      </div>
                      <div className="pb-3 border-b border-zinc-100 flex-1">
                        <div className="font-bold text-sm text-zinc-800 mb-1">{p.description}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 font-mono">{p.time}</span>
                          <span className="text-[10px] font-bold text-zinc-600">{p.amountChange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* Detail Modals Drawer */}
      {activeDetailModal && (
        <div className="fixed inset-0 z-40 flex justify-end md:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveDetailModal(null)}></div>
          <div className="relative w-full md:w-[800px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-zinc-100">
              <div>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1">
                  {activeDetailModal === 'margin' ? '保证金账户明细' : 
                   activeDetailModal === 'frozen' ? '冻结中资金明细' : '已结算订单明细'}
                </h2>
              </div>
              <button onClick={() => setActiveDetailModal(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {activeDetailModal === 'margin' && (
                <div className="text-center py-20 text-zinc-500">
                  <Package size={32} className="mx-auto mb-4 opacity-50" />
                  展示支付B2B结算、运费和税费结算记录。
                </div>
              )}
              {activeDetailModal === 'frozen' && (
                <div className="text-center py-20 text-zinc-500">
                  <Clock size={32} className="mx-auto mb-4 opacity-50" />
                  展示即将到账并且尚未完成结算周期的订单资金明细，包括冻结中的货款和佣金记录。
                </div>
              )}
              {activeDetailModal === 'settled' && (
                <div className="text-center py-20 text-zinc-500">
                  <CheckCircle2 size={32} className="mx-auto mb-4 opacity-50" />
                  展示已经完成货款和佣金结算的订单明细记录。
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRechargeModal(false)}></div>
          <div className="relative bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <h3 className="font-bold text-lg">保证金充值</h3>
              <button onClick={() => setShowRechargeModal(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="text-xs text-zinc-500 mb-4">
                向下方平台对公账户打款后，请上传转账水单。财务人员审核通过后，资金将转入您的保证金账户。
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-4 mb-6 space-y-3">
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">收款账户名称 (Account Name)</div>
                  <div className="text-sm font-bold">LUXEPORTER GROUP LIMITED</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">收款账号 (Account)</div>
                  <div className="text-sm font-bold tracking-widest font-mono">47413376548</div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Bank Code</div>
                    <div className="text-sm font-bold tracking-widest font-mono">003</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">SWIFT</div>
                    <div className="text-sm font-bold tracking-widest font-mono">SCBLHKHH</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">收款银行 (Bank Name)</div>
                  <div className="text-sm font-bold">Standard Chartered Bank (Hong Kong) Ltd</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">银行地址 (Bank Address)</div>
                  <div className="text-xs font-bold text-zinc-600">32nd Floor, 4-4A Des Voeux Road Central, Hong Kong SAR</div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-xs font-bold mb-2">充值金额 (¥)</label>
                <input type="number" placeholder="请输入打款金额" className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">上传转账水单</label>
                <div className="border-2 border-dashed border-zinc-200 bg-zinc-50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
                  <ImageIcon size={24} className="text-zinc-300 mb-2" />
                  <div className="text-sm font-bold text-zinc-600 text-center">点击或拖拽上传水单图片</div>
                  <div className="text-[10px] text-zinc-400 mt-1">支持 JPG, PNG, PDF，最大 5MB</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50">
              <button onClick={() => setShowRechargeModal(false)} className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black">取消</button>
              <button onClick={() => setShowRechargeModal(false)} className="px-4 py-2 text-xs font-bold bg-black text-white hover:bg-zinc-800">提交充值申请</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
