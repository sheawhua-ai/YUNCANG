import { useState } from 'react';
import { Search, Edit2, Check, X, FileText, Download, TrendingUp } from 'lucide-react';

type MajorType = 'self' | 'distributor';
type RegionType = 'domestic' | 'overseas';
type OrderStatus = 'all' | 'settled' | 'pending' | 'refunded' | 'refunding';

interface LedgerEntry {
  id: string;
  majorType: MajorType;
  region: 'domestic' | 'overseas';
  date: string;
  orderId: string;
  product: string;
  buyer: string;
  principal: string;
  distributor: string;
  supplier: string;
  status: OrderStatus;
  
  actualPaid: number;
  supplierPayment?: number; // 供货商货款 (for distributor)
  procurementCost: number;
  deliveryType?: 'direct' | 'pickup';
}

const MOCK_LEDGER: LedgerEntry[] = [
  { id: 'L-1', majorType: 'self', region: 'overseas', date: '2024-06-12 14:20', orderId: 'O-OS-001', product: 'Gucci Marmont 黑', buyer: '张曼玉', principal: '理查德', distributor: '', supplier: '意大利专柜', status: 'settled', actualPaid: 12500, procurementCost: 9800, deliveryType: 'direct' },
  { id: 'L-2', majorType: 'self', region: 'domestic', date: '2024-06-12 15:30', orderId: 'O-DM-002', product: 'Dior Saddle 老花', buyer: '林青霞', principal: '艾米丽', distributor: '', supplier: '国内现货仓', status: 'pending', actualPaid: 28000, procurementCost: 22000 },
  { id: 'L-3', majorType: 'distributor', region: 'domestic', date: '2024-06-13 09:15', orderId: 'D-DM-003', product: 'Prada Cleo 白', buyer: '王祖贤', principal: '', distributor: '小红书代购王', supplier: '国内表行', status: 'refunding', actualPaid: 15200, supplierPayment: 14000, procurementCost: 14000 },
  { id: 'L-4', majorType: 'distributor', region: 'overseas', date: '2024-06-13 11:20', orderId: 'D-OS-004', product: 'LV Neverfull', buyer: '邱淑贞', principal: '', distributor: '大客代购', supplier: '香港免税店', status: 'refunded', actualPaid: 14500, supplierPayment: 12000, procurementCost: 12000, deliveryType: 'direct' },
  { id: 'L-5', majorType: 'self', region: 'overseas', date: '2024-06-14 10:00', orderId: 'O-OS-005', product: 'Chanel CF 中号', buyer: '李嘉欣', principal: '理查德', distributor: '', supplier: '香港专柜', status: 'settled', actualPaid: 58000, procurementCost: 45000, deliveryType: 'pickup' },
  { id: 'L-6', majorType: 'self', region: 'overseas', date: '2024-06-14 16:30', orderId: 'O-OS-006', product: 'Hermes Birkin 25', buyer: '钟楚红', principal: '理查德', distributor: '', supplier: '欧洲买手', status: 'pending', actualPaid: 145000, procurementCost: 110000, deliveryType: 'pickup' },
  { id: 'L-7', majorType: 'distributor', region: 'overseas', date: '2024-06-15 09:45', orderId: 'D-OS-007', product: 'Celine Triomphe', buyer: '朱茵', principal: '', distributor: '香港代购小李', supplier: '海港城', status: 'settled', actualPaid: 24000, supplierPayment: 21000, procurementCost: 21000, deliveryType: 'direct' },
  { id: 'L-8', majorType: 'self', region: 'overseas', date: '2024-06-15 14:20', orderId: 'O-OS-008', product: 'YSL Niki', buyer: '周慧敏', principal: '艾米丽', distributor: '', supplier: '澳门免税店', status: 'settled', actualPaid: 18500, procurementCost: 15000, deliveryType: 'direct' },
  { id: 'L-9', majorType: 'distributor', region: 'overseas', date: '2024-06-16 11:10', orderId: 'D-OS-009', product: 'Loewe Puzzle', buyer: '关之琳', principal: '', distributor: '大客代购', supplier: '香港专柜', status: 'pending', actualPaid: 22000, supplierPayment: 19500, procurementCost: 19500, deliveryType: 'pickup' },
];

const STATUS_LABELS: Record<string, string> = {
  settled: '已结算',
  pending: '待结算',
  refunded: '已退款',
  refunding: '退款中',
};

const STATUS_CLASSES: Record<string, string> = {
  settled: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  pending: 'bg-orange-50 text-orange-600 border-orange-200',
  refunded: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  refunding: 'bg-red-50 text-red-600 border-red-200',
};

export function FinanceProfitLedger() {
  const [majorTab, setMajorTab] = useState<MajorType>('self');
  const [regionFilter, setRegionFilter] = useState<RegionType>('overseas');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  
  // Additional Filters
  const [dateFilter, setDateFilter] = useState('');
  const [principalFilter, setPrincipalFilter] = useState('');
  const [distributorFilter, setDistributorFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  
  const [entries, setEntries] = useState<LedgerEntry[]>(MOCK_LEDGER);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOutflow, setEditOutflow] = useState<string>('');
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter(e => {
    if (e.majorType !== majorTab) return false;
    if (e.region !== regionFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    
    if (dateFilter && !e.date.startsWith(dateFilter)) return false;
    if (principalFilter && !e.principal.includes(principalFilter)) return false;
    if (distributorFilter && !e.distributor.includes(distributorFilter)) return false;
    if (supplierFilter && !e.supplier.includes(supplierFilter)) return false;
    
    if (searchQuery) {
      const qs = searchQuery.toLowerCase();
      const matchOrder = e.orderId.toLowerCase().includes(qs) || `pay-${e.orderId.substring(6)}-2024`.toLowerCase().includes(qs);
      if (!matchOrder) return false;
    }
    
    return true;
  });

  const getFinancials = (entry: LedgerEntry) => {
    const isOverseas = entry.region === 'overseas';
    const isDirectMail = entry.deliveryType === 'direct';
    const currency = isOverseas ? 'HK$' : '¥';
    const feeRate = isOverseas ? 0.015 : 0.01;
    const taxRate = isOverseas && isDirectMail ? 0.091 : 0;
    const shipping = isOverseas && isDirectMail ? 30 : 0;

    const actualPaid = entry.actualPaid;
    const creditedAmount = actualPaid * (1 - feeRate);
    const tax = creditedAmount * taxRate; // Using credited amount for tax est
    const cost = entry.procurementCost;
    
    let supplierPayment = 0;
    let myCommission = 0;
    let profit = 0;
    let margin = 0;

    if (entry.majorType === 'distributor') {
      supplierPayment = entry.supplierPayment || cost;
      myCommission = actualPaid - supplierPayment;
      // Tax and shipping are separated into margin account.
      // Profit is my commission minus any over-cost we bore (cost - supplierPayment).
      profit = myCommission - (cost - supplierPayment); 
      margin = actualPaid > 0 ? (profit / actualPaid) * 100 : 0;
    } else {
      profit = creditedAmount - cost - tax - shipping;
      margin = creditedAmount > 0 ? (profit / creditedAmount) * 100 : 0;
    }

    return {
      currency,
      actualPaid,
      creditedAmount,
      tax,
      shipping,
      cost,
      supplierPayment,
      myCommission,
      profit,
      margin
    };
  };

  const handleEditClick = (entry: LedgerEntry) => {
    setEditingId(entry.id);
    setEditOutflow(entry.procurementCost.toString());
  };

  const handleSaveOutflow = (id: string) => {
    const val = parseFloat(editOutflow);
    if (!isNaN(val) && val >= 0) {
      setEntries(prev => prev.map(e => e.id === id ? { ...e, procurementCost: val } : e));
    }
    setEditingId(null);
  };

  // Aggregates for summary cards
  let totalReceived = 0;
  let totalCost = 0;
  let totalTax = 0;
  let totalShipping = 0;
  let totalProfit = 0;

  filteredEntries.forEach(e => {
    const fn = getFinancials(e);
    totalReceived += fn.actualPaid;
    totalCost += fn.cost;
    totalTax += fn.tax;
    totalShipping += fn.shipping;
    totalProfit += fn.profit;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Filters and Tabs */}
      <div className="bg-white border border-zinc-200 p-4 shadow-sm flex flex-col gap-4">
        {/* Top row Tabs */}
        <div className="flex gap-4 border-b border-zinc-200 pb-2">
          <button 
            onClick={() => { setMajorTab('self'); setRegionFilter('overseas'); }} 
            className={`pb-2 text-sm font-bold transition-colors border-b-2 ${majorTab === 'self' ? 'text-black border-black' : 'text-zinc-500 border-transparent hover:text-black'}`}
          >
            自营对账单
          </button>
          <button 
            onClick={() => { setMajorTab('distributor'); setRegionFilter('overseas'); }} 
            className={`pb-2 text-sm font-bold transition-colors border-b-2 ${majorTab === 'distributor' ? 'text-black border-black' : 'text-zinc-500 border-transparent hover:text-black'}`}
          >
            分销对账单
          </button>
        </div>

        {/* Second row secondary tabs & status */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            {(['overseas', 'domestic'] as RegionType[]).map(r => (
              <button 
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1.5 text-xs font-bold border transition-colors ${regionFilter === r ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}
              >
                {r === 'domestic' ? '国内订单' : '国际订单'}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {(['all', 'settled', 'pending', 'refunded', 'refunding'] as OrderStatus[]).map(s => (
              <button 
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-bold border transition-colors ${statusFilter === s ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}
              >
                {s === 'all' ? '全部状态' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Third row intricate filters */}
        <div className="flex flex-wrap gap-3 items-center pt-2">
          <input 
            type="date" 
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border border-zinc-200 px-3 py-2 text-xs focus:border-black outline-none"
          />
          {majorTab === 'self' && (
            <>
              <input 
                type="text" 
                placeholder="筛选主理人..."
                value={principalFilter}
                onChange={e => setPrincipalFilter(e.target.value)}
                className="border border-zinc-200 px-3 py-2 text-xs focus:border-black outline-none w-32"
              />
              <input 
                type="text" 
                placeholder="筛选分销商..."
                value={distributorFilter}
                onChange={e => setDistributorFilter(e.target.value)}
                className="border border-zinc-200 px-3 py-2 text-xs focus:border-black outline-none w-32"
              />
            </>
          )}
          {majorTab === 'distributor' && (
            <>
              <input 
                type="text" 
                placeholder="筛选主理人..."
                value={distributorFilter}
                onChange={e => setDistributorFilter(e.target.value)}
                className="border border-zinc-200 px-3 py-2 text-xs focus:border-black outline-none w-32"
              />
              <input 
                type="text" 
                placeholder="筛选供货商..."
                value={supplierFilter}
                onChange={e => setSupplierFilter(e.target.value)}
                className="border border-zinc-200 px-3 py-2 text-xs focus:border-black outline-none w-32"
              />
            </>
          )}
          
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="搜索单号..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-zinc-200 pl-9 pr-3 py-2 text-xs focus:border-black outline-none"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shrink-0">
            <Download size={14} />
            导出表格
          </button>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(() => {
          const aggrCcy = regionFilter === 'overseas' ? 'HK$' : '¥';
          return (
            <>
              <div className="bg-zinc-50 border border-zinc-200 p-4">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">总流水收款</div>
                <div className="text-xl font-black">{aggrCcy} {totalReceived.toLocaleString()}</div>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-4">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">总采购成本</div>
                <div className="text-xl font-black text-rose-600">{aggrCcy} {totalCost.toLocaleString()}</div>
              </div>
              {regionFilter === 'overseas' && (
                <>
                  <div className="bg-zinc-50 border border-zinc-200 p-4">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">税费预估总额</div>
                    <div className="text-xl font-black text-orange-600">{aggrCcy} {totalTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-4">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">运费预估总额</div>
                    <div className="text-xl font-black text-blue-600">{aggrCcy} {totalShipping.toLocaleString()}</div>
                  </div>
                </>
              )}
              <div className={`bg-white border-2 border-black p-4 md:col-span-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${regionFilter === 'overseas' ? 'col-span-2' : 'col-span-2 md:col-span-2 md:col-start-4'}`}>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <TrendingUp size={12} />
                  净毛利润汇总
                </div>
                <div className="text-2xl font-black text-green-600">{aggrCcy} {totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1400px]">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] text-zinc-500 uppercase tracking-widest">
            <tr>
              <th className="px-4 py-4 font-bold">订单 / 状态</th>
              <th className="px-4 py-4 font-bold">
                {majorTab === 'self' ? '业务归属 (主理人/分销商)' : '主理人 / 供货商'}
              </th>
              <th className="px-4 py-4 font-bold text-right">实付收款</th>
              {majorTab === 'self' ? (
                <th className="px-4 py-4 font-bold text-right text-emerald-700">实际入账 (扣手续费)</th>
              ) : (
                <>
                  <th className="px-4 py-4 font-bold text-right text-rose-600">供货商货款</th>
                  <th className="px-4 py-4 font-bold text-right text-emerald-700">我方分账 (佣金)</th>
                </>
              )}
              <th className="px-4 py-4 font-bold text-right text-rose-600">实际采购成本</th>
              {majorTab === 'self' && regionFilter === 'overseas' && (
                <>
                  <th className="px-4 py-4 font-bold text-right text-orange-600">税费预估</th>
                  <th className="px-4 py-4 font-bold text-right text-blue-600">运费预估</th>
                </>
              )}
              <th className="px-4 py-4 font-bold text-right text-green-600">毛利净收</th>
              {majorTab === 'self' && <th className="px-4 py-4 font-bold text-right text-green-600">毛利率</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={majorTab === 'self' ? 10 : 9} className="px-4 py-12 text-center text-zinc-500 text-xs">
                  暂无匹配的订单流水记录
                </td>
              </tr>
            ) : (
              filteredEntries.map(entry => {
                const fn = getFinancials(entry);
                const hasCost = fn.cost > 0;
                const statusClass = STATUS_CLASSES[entry.status];
                const statusLabel = STATUS_LABELS[entry.status];
                
                return (
                  <tr key={entry.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="font-bold flex items-center gap-1 text-[10px]">
                          <span className="text-zinc-500 font-normal shrink-0">主单号:</span>
                          <span className="font-mono">{entry.orderId}</span>
                        </div>
                        <div className="font-bold flex items-center gap-1 text-[10px]">
                          <span className="text-zinc-500 font-normal shrink-0">支付单:</span>
                          <span className="font-mono">PAY-{entry.orderId.substring(6)}-2024</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase ${statusClass}`}>
                            {statusLabel}
                          </span>
                          {entry.region === 'overseas' && (
                            <span className={`text-[9px] px-1.5 py-0.5 border font-bold ${entry.deliveryType === 'direct' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                              {entry.deliveryType === 'direct' ? '直邮' : '自提'}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400">{entry.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       {majorTab === 'self' ? (
                         <div className="flex flex-col gap-2">
                           {entry.principal && (
                             <div className="text-xs px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-blue-700 w-max flex items-center gap-1">
                               <span className="font-bold text-[10px]">主理人:</span> {entry.principal}
                             </div>
                           )}
                           {entry.distributor && (
                             <div className="text-xs px-2 py-0.5 bg-purple-50 border border-purple-100 rounded text-purple-700 w-max flex items-center gap-1">
                               <span className="font-bold text-[10px]">分销商:</span> {entry.distributor}
                             </div>
                           )}
                           {!entry.principal && !entry.distributor && <span className="text-zinc-400 text-xs">--</span>}
                         </div>
                       ) : (
                         <>
                           <div className="text-xs px-2 py-0.5 bg-zinc-100 rounded text-zinc-700 w-max mb-1">
                             {entry.distributor || entry.principal || '--'}
                           </div>
                           <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                             <span className="font-bold">供货:</span> {entry.supplier}
                           </div>
                         </>
                       )}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-zinc-800 text-sm">
                      {fn.currency} {fn.actualPaid.toLocaleString()}
                    </td>
                    
                    {majorTab === 'self' ? (
                      <td className="px-4 py-4 text-right font-bold text-emerald-700 text-sm">
                        {fn.currency} {fn.creditedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-4 text-right font-bold text-rose-600 text-sm">
                          {fn.currency} {fn.supplierPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-emerald-700 text-sm">
                          {fn.currency} {fn.myCommission.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                      </>
                    )}

                    <td className="px-4 py-4 text-right">
                      {editingId === entry.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs text-zinc-500">{fn.currency}</span>
                          <input 
                            type="number" 
                            className="border border-zinc-300 w-20 px-2 py-1 text-xs text-right focus:outline-none focus:border-black bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={editOutflow}
                            onChange={e => setEditOutflow(e.target.value)}
                            autoFocus
                          />
                          <button onClick={() => handleSaveOutflow(entry.id)} className="p-1 text-green-600 hover:bg-zinc-200 rounded"><Check size={14} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-zinc-200 rounded"><X size={14} /></button>
                        </div>
                      ) : (
                        <div className="flex justify-end items-center gap-1 group cursor-pointer" onClick={() => handleEditClick(entry)}>
                          <span className="font-bold text-rose-600 text-sm">
                            {!hasCost 
                              ? <span className="text-[10px] text-rose-400 font-normal border-b border-dashed border-rose-300">点击填写成本</span>
                              : `${fn.currency} ${fn.cost.toLocaleString()}`
                            }
                          </span>
                          <Edit2 size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                    {majorTab === 'self' && regionFilter === 'overseas' && (
                      <>
                        <td className="px-4 py-4 text-right">
                           <span className="font-bold text-orange-600 text-sm">
                             {fn.tax > 0 ? `${fn.currency} ${fn.tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : <span className="text-zinc-300">-</span>}
                           </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                           <span className="font-bold text-blue-600 text-sm">
                             {fn.shipping > 0 ? `${fn.currency} ${fn.shipping.toLocaleString()}` : <span className="text-zinc-300">-</span>}
                           </span>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-4 text-right">
                      <span className={`font-black text-sm ${fn.profit > 0 ? 'text-green-600' : fn.profit < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {hasCost ? `${fn.currency} ${fn.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : <span className="text-zinc-300">-</span>}
                      </span>
                    </td>
                    {majorTab === 'self' && (
                      <td className="px-4 py-4 text-right">
                        <span className={`font-bold text-xs ${fn.margin > 0 ? 'text-green-600' : fn.margin < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                          {hasCost ? `${fn.margin.toFixed(1)}%` : <span className="text-zinc-300">-</span>}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

