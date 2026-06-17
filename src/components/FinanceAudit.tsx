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
      { id: '2', time: '2024-05-02 10:15', description: '财务核销定金', amountChange: '+HK$2,000' }
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

const MOCK_FROZEN_RECORDS = [
  { id: 'O-20240615-01', orderId: 'O-DOM-042', paid: 15200, share: 15000, fee: 152, actualRecorded: 14848, status: '冻结中 (待发货)' },
  { id: 'O-20240615-02', orderId: 'O-DOM-045', paid: 28500, share: 28000, fee: 285, actualRecorded: 27715, status: '冻结中 (已发货)' },
  { id: 'O-20240615-03', orderId: 'O-INT-099', paid: 12500, share: 12000, fee: 187.5, actualRecorded: 11812.5, status: '冻结中 (待结算)' },
];

const MOCK_SETTLED_RECORDS = [
  {
    date: '2024-06-14',
    totalSettled: 42500,
    orders: [
      { id: 'O-20240614-01', orderId: 'O-DOM-039', paid: 12000, share: 11500, fee: 120, actualRecorded: 11380, status: '已结算' },
      { id: 'O-20240614-02', orderId: 'O-DOM-040', paid: 30500, share: 30000, fee: 305, actualRecorded: 29695, status: '已结算' },
    ]
  },
  {
    date: '2024-06-13',
    totalSettled: 18450,
    orders: [
      { id: 'O-20240613-01', orderId: 'O-DOM-031', paid: 18450, share: 18000, fee: 184.5, actualRecorded: 17815.5, status: '已结算' },
    ]
  }
];

const MOCK_MARGIN_RECORDS = [
  { id: 'M-1', date: '2024-06-15 14:30', type: '扣款', description: 'O-DOM-042 B2B采购款', amount: -12000, balance: 25000 },
  { id: 'M-2', date: '2024-06-14 09:15', type: '扣款', description: '中转仓运费结算', amount: -350, balance: 37000 },
  { id: 'M-3', date: '2024-06-10 11:00', type: '充值', description: '对公转账充值', amount: 50000, balance: 37350 },
];

export function FinanceAudit() {
  const [activeMainTab, setActiveMainTab] = useState<'reconciliation' | 'withdrawal' | 'work_order' | 'profit_ledger' | 'funds_account'>('reconciliation');
  const workOrders = useWorkOrders();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [ordersData, setOrdersData] = useState(MOCK_ORDERS);
  const [inputAmounts, setInputAmounts] = useState<Record<string, string>>({});
  const [viewingSlip, setViewingSlip] = useState<{url?: string, slipId: string, orderId: string, isManual?: boolean} | null>(null);
  const [isManualUploadModalOpen, setIsManualUploadModalOpen] = useState(false);
  const [manualSlipOrder, setManualSlipOrder] = useState<string | null>(null);

  const getCurrencySymbol = (orderId: string) => {
    // International orders use HK$, domestic use ¥
    if (orderId.includes('-OS-') || orderId.includes('-INT-') || orderId.includes('DEP')) return 'HK$';
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
      </div>

      <div className="flex gap-8 border-b border-zinc-200 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button onClick={() => setActiveMainTab('reconciliation')} className={`pb-3 text-sm font-bold transition-colors ${activeMainTab === 'reconciliation' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>收款核销</button>
        <button onClick={() => setActiveMainTab('profit_ledger')} className={`pb-3 text-sm font-bold transition-colors ${activeMainTab === 'profit_ledger' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>对账与利润核算</button>
        <button onClick={() => setActiveMainTab('funds_account')} className={`pb-3 text-sm font-bold transition-colors ${activeMainTab === 'funds_account' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>资金账户明细</button>
        <button onClick={() => setActiveMainTab('work_order')} className={`pb-3 text-sm font-bold transition-colors flex items-center gap-1 ${activeMainTab === 'work_order' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}>
          工单处理
          {workOrders.filter(o => o.status === 'pending').length > 0 && (
            <span className="bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">{workOrders.filter(o => o.status === 'pending').length}</span>
          )}
        </button>
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
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <FinanceProfitLedger />
        </div>
      ) : activeMainTab === 'funds_account' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Account Sub-Tabs */}
          <div className="flex gap-6 border-b border-zinc-200">
            <button 
              onClick={() => {
                setActiveAccountTab('domestic');
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
            <div className="bg-blue-50/50 border border-blue-100 p-4 text-xs flex items-start gap-2">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-800">国际账户结算提示：</span> 按周期自动结算，每笔交易扣除 1.5% 固定手续费。
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/50 border border-blue-100 p-4 text-xs flex items-center justify-between gap-4">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-800">国内账户极速结算模式：</span> 当前处于 T+{domesticSettlementMode === 't1' ? '1' : '7'} 结算周期，手续费率 {domesticSettlementMode === 't1' ? '1.0%' : '0.6%'}。每月限改一次。
                  {lastModeChangeDate && <span className="text-zinc-500 ml-2">上次修改: {lastModeChangeDate}</span>}
                </div>
              </div>
              
              <div className="shrink-0 flex items-center gap-2">
                <span className="font-bold text-[10px] uppercase text-blue-800">开启极速结算 (T+1)</span>
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
                  <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 gap-4 md:gap-6 ${activeAccountTab === 'international' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
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
                <div className="text-2xl md:text-3xl font-black mb-2">HK$ 25,000.00</div>
                <div className="text-xs text-zinc-400 mt-auto">用于抵扣供货商货款，跨境运费和关税结算</div>
              </div>
            )}
            <div className="bg-white border border-zinc-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-bold text-zinc-500">待结算资金</div>
                <button 
                  onClick={() => setActiveDetailModal('frozen')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  查看明细
                </button>
              </div>
              <div className="text-2xl md:text-3xl font-black text-orange-600 mb-4">{activeAccountTab === 'international' ? 'HK$' : '¥'} {activeAccountTab === 'domestic' ? '12,500.00' : '85,000.00'}</div>
              <div className="grid grid-cols-2 gap-4 mt-auto p-3 bg-zinc-50 border border-zinc-100">
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">待结算货款</div>
                  <div className="font-bold">{activeAccountTab === 'international' ? 'HK$' : '¥'} {activeAccountTab === 'domestic' ? '10,000.00' : '70,000.00'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">待结算佣金</div>
                  <div className="font-bold">{activeAccountTab === 'international' ? 'HK$' : '¥'} {activeAccountTab === 'domestic' ? '2,500.00' : '15,000.00'}</div>
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
              <div className="text-2xl md:text-3xl font-black text-green-600 mb-4">{activeAccountTab === 'international' ? 'HK$' : '¥'} {activeAccountTab === 'domestic' ? '43,200.00' : '285,000.00'}</div>
              <div className="grid grid-cols-2 gap-4 mt-auto p-3 bg-zinc-50 border border-zinc-100">
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">结算货款</div>
                  <div className="font-bold">{activeAccountTab === 'international' ? 'HK$' : '¥'} {activeAccountTab === 'domestic' ? '35,000.00' : '240,000.00'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 mb-1">结算佣金</div>
                  <div className="font-bold">{activeAccountTab === 'international' ? 'HK$' : '¥'} {activeAccountTab === 'domestic' ? '8,200.00' : '45,000.00'}</div>
                </div>
              </div>
            </div>
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
                        <div className="font-bold">{getCurrencySymbol(order.orderId)} {product.price.toLocaleString()}</div>
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
                            <div className="font-bold">{getCurrencySymbol(order.orderId)} {product.price.toLocaleString()}</div>
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
                          <div className="text-xl font-black">{getCurrencySymbol(order.orderId)} {totalDue.toLocaleString()}</div>
                          <div className="text-[10px] text-zinc-400 mt-2">
                            定金: {getCurrencySymbol(order.orderId)}{order.depositDue.toLocaleString()} | 尾款: {getCurrencySymbol(order.orderId)}{order.balanceDue.toLocaleString()}
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
          { id: '1', time: '2024-05-10 10:00', description: '买家付款', amountChange: `+${getCurrencySymbol(viewingWorkOrderAssociated)}28,000` },
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
                   activeDetailModal === 'frozen' ? '待结算资金明细' : '已结算订单明细'}
                </h2>
              </div>
              <button onClick={() => setActiveDetailModal(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {activeDetailModal === 'margin' && (
                <div className="bg-white border border-zinc-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] text-zinc-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 font-bold">时间</th>
                        <th className="px-4 py-3 font-bold">类型</th>
                        <th className="px-4 py-3 font-bold">事由</th>
                        <th className="px-4 py-3 font-bold text-right">金额 ({activeAccountTab === 'international' ? 'HK$' : '¥'})</th>
                        <th className="px-4 py-3 font-bold text-right">余额 ({activeAccountTab === 'international' ? 'HK$' : '¥'})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {MOCK_MARGIN_RECORDS.map(record => (
                        <tr key={record.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 text-zinc-500 text-xs">{record.date}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] px-1.5 py-0.5 font-bold ${record.type === '充值' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {record.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold">{record.description}</td>
                          <td className={`px-4 py-3 text-right font-bold ${record.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {record.amount > 0 ? '+' : ''}{record.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-500">{record.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeDetailModal === 'frozen' && (
                <div className="bg-white border border-zinc-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] text-zinc-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 font-bold">订单编号</th>
                        <th className="px-4 py-3 font-bold text-right">支付金额</th>
                        <th className="px-4 py-3 font-bold text-right text-purple-600">分账金额</th>
                        <th className="px-4 py-3 font-bold text-right text-orange-600">手续费</th>
                        <th className="px-4 py-3 font-bold text-right text-emerald-600">计入账</th>
                        <th className="px-4 py-3 font-bold text-right">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {MOCK_FROZEN_RECORDS.filter(r => activeAccountTab === 'international' ? r.orderId.includes('INT') : !r.orderId.includes('INT')).map(record => (
                        <tr key={record.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-xs">{record.orderId}</td>
                          <td className="px-4 py-3 text-right font-bold">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.paid.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-bold text-purple-700">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.share.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-bold text-orange-700">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.fee.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-black text-emerald-700">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.actualRecorded.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 font-bold">{record.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeDetailModal === 'settled' && (
                <div className="space-y-6">
                  {MOCK_SETTLED_RECORDS.map((dayGroup, idx) => (
                    <div key={idx} className="bg-white border border-zinc-200">
                      <div className="bg-zinc-50 border-b border-zinc-200 p-4 flex justify-between items-center">
                        <div className="font-bold">{dayGroup.date} 结算汇总</div>
                        <div className="text-sm font-black text-emerald-600">已结算: {activeAccountTab === 'international' ? 'HK$' : '¥'}{dayGroup.totalSettled.toLocaleString()}</div>
                      </div>
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-zinc-100 text-[11px] text-zinc-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-4 py-2 font-bold">订单编号</th>
                            <th className="px-4 py-2 font-bold text-right">支付金额</th>
                            <th className="px-4 py-2 font-bold text-right text-purple-600">分账金额</th>
                            <th className="px-4 py-2 font-bold text-right text-orange-600">手续费</th>
                            <th className="px-4 py-2 font-bold text-right text-emerald-600">实际入账</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                          {dayGroup.orders.filter(r => activeAccountTab === 'international' ? r.orderId.includes('INT') : !r.orderId.includes('INT')).map(record => (
                            <tr key={record.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-4 py-2 font-mono font-bold text-xs">{record.orderId}</td>
                              <td className="px-4 py-2 text-right">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.paid.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right text-purple-700">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.share.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right text-orange-700">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.fee.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right font-bold text-emerald-700">{activeAccountTab === 'international' ? 'HK$' : '¥'} {record.actualRecorded.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
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
                <label className="block text-xs font-bold mb-2">充值金额 ({activeAccountTab === 'international' ? 'HK$' : '¥'})</label>
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
