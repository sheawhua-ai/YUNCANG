import { useState } from 'react';
import { Search, Filter, Edit2, Check, X, FileText, Download, TrendingUp } from 'lucide-react';

type MajorType = 'self' | 'distributor';
type RegionType = 'all' | 'domestic' | 'overseas';

interface LedgerEntry {
  id: string;
  majorType: MajorType;
  region: RegionType;
  date: string;
  orderId: string;
  product: string;     // 商品
  principal: string;   // 主理人/归属
  supplier: string;    // 供货商
  inflow: number;      // 客户实付金额
  outflow: number;     // 采购成本 (可填)
  tax: number;         // 税费
  shipping: number;    // 运费
  currency: string;
  status: 'settled' | 'pending';
}

const MOCK_LEDGER: LedgerEntry[] = [
  { id: 'L-1', majorType: 'self', region: 'overseas', date: '2024-06-12 14:20', orderId: 'O-OS-001', product: 'Gucci Marmont 黑', principal: '官方直营', supplier: '意大利专柜', inflow: 12500, outflow: 9800, tax: 1200, shipping: 150, currency: '¥', status: 'settled' },
  { id: 'L-2', majorType: 'self', region: 'domestic', date: '2024-06-12 15:30', orderId: 'O-DM-002', product: 'Dior Saddle 老花', principal: '官方直营', supplier: '国内现货仓', inflow: 28000, outflow: 22000, tax: 0, shipping: 25, currency: '¥', status: 'settled' },
  { id: 'L-3', majorType: 'distributor', region: 'all', date: '2024-06-13 09:15', orderId: 'D-ORD-003', product: 'Prada Cleo 白', principal: '主理人A (小红书)', supplier: '欧洲表行', inflow: 15200, outflow: 0, tax: 0, shipping: 30, currency: '¥', status: 'pending' },
  { id: 'L-4', majorType: 'distributor', region: 'all', date: '2024-06-13 11:20', orderId: 'D-ORD-004', product: 'LV Neverfull', principal: '分销商大客', supplier: '香港免税店', inflow: 14500, outflow: 0, tax: 0, shipping: 80, currency: '¥', status: 'pending' },
];

export function FinanceProfitLedger() {
  const [majorTab, setMajorTab] = useState<MajorType>('self');
  const [regionFilter, setRegionFilter] = useState<RegionType>('all');
  const [entries, setEntries] = useState<LedgerEntry[]>(MOCK_LEDGER);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOutflow, setEditOutflow] = useState<string>('');

  const filteredEntries = entries.filter(e => {
    if (e.majorType !== majorTab) return false;
    if (majorTab === 'self' && regionFilter !== 'all' && e.region !== regionFilter) return false;
    return true;
  });

  const calculateProfit = (entry: LedgerEntry) => {
    return entry.inflow - entry.outflow - entry.tax - entry.shipping;
  };

  const calculateMargin = (entry: LedgerEntry) => {
    const profit = calculateProfit(entry);
    if (entry.inflow === 0) return 0;
    return (profit / entry.inflow) * 100;
  };

  const handleEditClick = (entry: LedgerEntry) => {
    setEditingId(entry.id);
    setEditOutflow(entry.outflow.toString());
  };

  const handleSaveOutflow = (id: string) => {
    const val = parseFloat(editOutflow);
    if (!isNaN(val) && val >= 0) {
      setEntries(prev => prev.map(e => e.id === id ? { ...e, outflow: val } : e));
    }
    setEditingId(null);
  };

  const totalInflow = filteredEntries.reduce((acc, curr) => acc + curr.inflow, 0);
  const totalOutflow = filteredEntries.reduce((acc, curr) => acc + curr.outflow, 0);
  const totalTax = filteredEntries.reduce((acc, curr) => acc + curr.tax, 0);
  const totalShipping = filteredEntries.reduce((acc, curr) => acc + curr.shipping, 0);
  const totalProfit = totalInflow - totalOutflow - totalTax - totalShipping;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 border-b border-zinc-200">
            <button 
              onClick={() => { setMajorTab('self'); setRegionFilter('all'); }} 
              className={`pb-3 text-sm font-bold transition-colors ${majorTab === 'self' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
            >
              自营对账
            </button>
            <button 
              onClick={() => { setMajorTab('distributor'); setRegionFilter('all'); }} 
              className={`pb-3 text-sm font-bold transition-colors ${majorTab === 'distributor' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
            >
              分销对账
            </button>
          </div>
          
          {majorTab === 'self' && (
            <div className="flex gap-2">
              <button 
                onClick={() => setRegionFilter('all')}
                className={`px-3 py-1 text-xs border ${regionFilter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}
              >
                全部
              </button>
              <button 
                onClick={() => setRegionFilter('domestic')}
                className={`px-3 py-1 text-xs border ${regionFilter === 'domestic' ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}
              >
                大陆单
              </button>
              <button 
                onClick={() => setRegionFilter('overseas')}
                className={`px-3 py-1 text-xs border ${regionFilter === 'overseas' ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}
              >
                海外跨境单
              </button>
            </div>
          )}
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-xs font-bold hover:border-black transition-colors shrink-0">
          <Download size={14} />
          导出对账单
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">总实收金额</div>
          <div className="text-xl font-black">¥ {totalInflow.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">总采购成本</div>
          <div className="text-xl font-black text-rose-600">¥ {totalOutflow.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">总税费预估</div>
          <div className="text-xl font-black text-orange-600">¥ {totalTax.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">总运费预估</div>
          <div className="text-xl font-black text-blue-600">¥ {totalShipping.toLocaleString()}</div>
        </div>
        <div className="bg-white border-2 border-black p-4 col-span-2 md:col-span-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
            <TrendingUp size={12} />
            净毛利润
          </div>
          <div className="text-2xl font-black text-green-600">¥ {totalProfit.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1200px]">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] text-zinc-500 uppercase tracking-widest">
            <tr>
              <th className="px-4 py-4 font-bold">订单流水号</th>
              <th className="px-4 py-4 font-bold">商品信息</th>
              <th className="px-4 py-4 font-bold">主理人/销售</th>
              <th className="px-4 py-4 font-bold">供货商</th>
              <th className="px-4 py-4 font-bold text-right">实付入账</th>
              <th className="px-4 py-4 font-bold text-right text-rose-600">采购成本 (可填)</th>
              <th className="px-4 py-4 font-bold text-right text-orange-600">税费</th>
              <th className="px-4 py-4 font-bold text-right text-blue-600">运费</th>
              <th className="px-4 py-4 font-bold text-right text-green-600">毛利净收</th>
              <th className="px-4 py-4 font-bold text-right text-green-600">毛利率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-zinc-500 text-xs">
                  暂无匹配的订单流水记录
                </td>
              </tr>
            ) : (
              filteredEntries.map(entry => {
                const profit = calculateProfit(entry);
                const margin = calculateMargin(entry);
                const hasCost = entry.outflow > 0;
                
                return (
                  <tr key={entry.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold flex items-center gap-1 text-xs">
                        <FileText size={12} className="text-zinc-400" />
                        {entry.orderId}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1">{entry.date}</div>
                    </td>
                    <td className="px-4 py-4">
                       <span className="font-bold text-xs">{entry.product}</span>
                    </td>
                    <td className="px-4 py-4">
                       <span className="text-xs px-2 py-1 bg-zinc-100 rounded text-zinc-700">{entry.principal}</span>
                    </td>
                    <td className="px-4 py-4">
                       <span className="text-xs text-zinc-600">{entry.supplier}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-zinc-800 text-sm">
                      {entry.currency} {entry.inflow.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {editingId === entry.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs text-zinc-500">{entry.currency}</span>
                          <input 
                            type="number" 
                            className="border border-zinc-300 w-20 px-2 py-1 text-xs text-right focus:outline-none focus:border-black"
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
                              : `${entry.currency} ${entry.outflow.toLocaleString()}`
                            }
                          </span>
                          <Edit2 size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                       <span className="font-bold text-orange-600 text-sm">
                         {entry.tax > 0 ? `${entry.currency} ${entry.tax.toLocaleString()}` : <span className="text-zinc-300">-</span>}
                       </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                       <span className="font-bold text-blue-600 text-sm">
                         {entry.shipping > 0 ? `${entry.currency} ${entry.shipping.toLocaleString()}` : <span className="text-zinc-300">-</span>}
                       </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-black text-sm ${profit > 0 ? 'text-green-600' : profit < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {hasCost ? `${entry.currency} ${profit.toLocaleString()}` : <span className="text-zinc-300">-</span>}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-bold text-xs ${margin > 0 ? 'text-green-600' : margin < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {hasCost ? `${margin.toFixed(1)}%` : <span className="text-zinc-300">-</span>}
                      </span>
                    </td>
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

