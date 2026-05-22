import { useState } from 'react';
import { Search, X, Plus, AlertCircle, Clock, CheckCircle, Wallet, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const INITIAL_WORK_ORDERS = [
  {
    id: 'WO-2024-001',
    orderId: 'MAN-2024-0815-A1',
    customer: '李四 (139****5678)',
    type: 'deposit_adjustment',
    action: 'increase',
    amount: 5000,
    status: 'pending_audit',
    reason: '客户要求增加定金以锁定热门款式',
    creator: '系统管理员',
    createdAt: '2024-08-16 10:00'
  },
  {
    id: 'WO-2024-002',
    orderId: 'MAN-2024-0813-C1',
    customer: '王五 (138****1234)',
    type: 'final_payment_adjustment',
    action: 'decrease',
    amount: 1200,
    status: 'completed',
    reason: '物流延期赔付，冲抵尾款',
    creator: '销售 A',
    createdAt: '2024-08-15 15:30',
    auditor: '财务 B',
    auditAt: '2024-08-15 16:00'
  }
];

export function WorkOrderManagement() {
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Internal Adjustments</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">工单管理</h1>
          <p className="text-xs md:text-sm text-zinc-500">处理金额调整（增加/减少定金、尾款），需经过财务审核生效</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          新建调整工单
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-zinc-200 p-6 shadow-sm border-l-4 border-l-orange-500">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">待财务审核</div>
          <div className="text-3xl font-black">5</div>
          <div className="text-[10px] text-zinc-500 mt-1">涉及金额 ¥ 23,400.00</div>
        </div>
        <div className="bg-white border border-zinc-200 p-6 shadow-sm border-l-4 border-l-green-500">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">今日已结案</div>
          <div className="text-3xl font-black">12</div>
          <div className="text-[10px] text-zinc-500 mt-1">资金核销效率: 94%</div>
        </div>
        <div className="bg-white border border-zinc-200 p-6 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">本月累计流水变动</div>
          <div className="text-3xl font-black">¥ 145,200</div>
          <div className="text-[10px] text-zinc-500 mt-1">工单冲转总额</div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">工单 ID / 关联订单</th>
              <th className="px-6 py-4">客户信息</th>
              <th className="px-6 py-4">调整类型</th>
              <th className="px-6 py-4 text-right">金额变动</th>
              <th className="px-6 py-4 text-center">状态</th>
              <th className="px-6 py-4 text-right">创建时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {workOrders.map(wo => (
              <tr key={wo.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="font-bold text-black">{wo.id}</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1">{wo.orderId}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs font-bold">{wo.customer}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs font-medium text-zinc-600">
                    {wo.type === 'deposit_adjustment' ? '定金调整' : '尾款调整'}
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-mono font-bold">
                  <div className={`flex items-center justify-end gap-1 ${
                    wo.action === 'increase' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {wo.action === 'increase' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {wo.action === 'increase' ? '+' : '-'}¥ {wo.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`text-[9px] font-bold px-2 py-1 uppercase tracking-wider ${
                    wo.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {wo.status === 'completed' ? '审核通过' : '待财务审核'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right text-[10px] text-zinc-500 font-mono">
                  {wo.createdAt}
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-black hover:underline text-xs font-bold uppercase tracking-widest">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
               <h2 className="text-sm font-black uppercase tracking-widest">创建金额调整工单</h2>
               <button onClick={() => setIsCreateOpen(false)}><X size={20} /></button>
             </div>
             <div className="p-6 space-y-5">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">关联订单号</label>
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                   <input type="text" placeholder="输入并搜索货单订单号..." className="w-full pl-9 pr-4 py-2 border border-zinc-200 focus:border-black outline-none text-sm font-bold" />
                 </div>
               </div>

               <div className="flex gap-4">
                 <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">调整类型</label>
                   <select className="w-full px-3 py-2 border border-zinc-200 text-sm focus:border-black outline-none">
                     <option value="deposit">定金调整</option>
                     <option value="final">尾款 / 补款调整</option>
                   </select>
                 </div>
                 <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">动作</label>
                   <select className="w-full px-3 py-2 border border-zinc-200 text-sm focus:border-black outline-none">
                     <option value="increase">增加金额 (+)</option>
                     <option value="decrease">减少金额 (-)</option>
                   </select>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">变动金额 (¥)</label>
                 <input type="number" placeholder="0.00" className="w-full px-4 py-2 border border-zinc-200 focus:border-black outline-none font-mono font-bold" />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">调整原因说明</label>
                 <textarea rows={3} placeholder="简述调整原因，如：到货破损补偿、加定金锁定 SKU 等" className="w-full px-4 py-2 border border-zinc-200 focus:border-black outline-none text-sm resize-none" />
               </div>

               <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
                 <button onClick={() => setIsCreateOpen(false)} className="px-6 py-2 text-xs font-bold border border-zinc-200 hover:bg-zinc-50">取消</button>
                 <button onClick={() => { alert('工单已提交财务审核。财务确认后，订单金额变动将自动生效并通知客户。'); setIsCreateOpen(false); }} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest">提交财务审核</button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
