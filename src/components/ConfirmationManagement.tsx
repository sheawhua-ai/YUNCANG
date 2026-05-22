import { useState } from 'react';
import { Search, ChevronDown, CheckCircle, FileText, TrendingUp, User, Clock, AlertCircle, Upload, Download } from 'lucide-react';

const INITIAL_CONFIRMATIONS = [
  {
    id: 'CONF-2024-001',
    upstreamName: 'LVMH Group Official Supplier',
    orderId: 'MAN-2024-0815-A1',
    status: 'arrived', // pending, arriving, arrived, stockout
    paymentStatus: 'paid', // unpaid, partially_paid, paid
    totalAmount: 145000,
    profit: 61000,
    itemCount: 3,
    arrivalDate: '2024-08-18',
    remarks: '批次确认无误，已入香港直邮仓',
    items: [
      { name: 'Hermès Birkin 25', confirmed: 1, stockout: 0, purchasePrice: 110000, salePrice: 156000 },
      { name: 'Hermès Twilly', confirmed: 2, stockout: 0, purchasePrice: 17500, salePrice: 25000 }
    ]
  },
  {
    id: 'CONF-2024-002',
    upstreamName: 'Rolex Official Distributor',
    orderId: 'MAN-2024-0813-C1',
    status: 'arrived',
    paymentStatus: 'paid',
    totalAmount: 48000,
    profit: 20000,
    itemCount: 1,
    arrivalDate: '2024-08-16',
    remarks: '确认单号：RX-88219',
    items: [
      { name: 'Rolex Submariner', confirmed: 1, stockout: 0, purchasePrice: 48000, salePrice: 68000 }
    ]
  }
];

export function ConfirmationManagement() {
  const [confirmations, setConfirmations] = useState(INITIAL_CONFIRMATIONS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Upstream Confirmations</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">确认单管理</h1>
          <p className="text-xs md:text-sm text-zinc-500">同步上游采购确认信息，自动计算货单利润与到货状态</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <Upload size={16} />
            回传采购确认单 (Excel/PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: '总确认金额', value: '¥ 193,000', sub: '本月累计已确认', icon: CheckCircle },
          { label: '预估利润合计', value: '¥ 81,000', sub: '平均利润率: 42%', icon: TrendingUp },
          { label: '待处理到货', value: '12', sub: '预计今日抵达', icon: Clock },
          { label: '异常缺货项', value: '3', sub: '需处理退款/售后', icon: AlertCircle },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
              <stat.icon className="text-zinc-300" size={18} />
            </div>
            <div className="text-2xl font-black tracking-tight">{stat.value}</div>
            <div className="text-[10px] text-zinc-500 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">确认单 ID / 货单号</th>
              <th className="px-6 py-4">供货商信息</th>
              <th className="px-6 py-4 text-right">确认总额</th>
              <th className="px-6 py-4 text-right">产生利润</th>
              <th className="px-6 py-4 text-center">状态</th>
              <th className="px-6 py-4 text-center">付款</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {confirmations.map(conf => (
              <tr key={conf.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="font-bold text-black">{conf.id}</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1">关联: {conf.orderId}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs font-bold italic">
                    <User size={12} className="text-zinc-400" />
                    {conf.upstreamName}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">到货日期: {conf.arrivalDate}</div>
                </td>
                <td className="px-6 py-5 text-right font-mono font-bold text-black">
                  ¥ {conf.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right font-mono font-bold text-blue-600">
                  +¥ {conf.profit.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`text-[9px] font-bold px-2 py-1 uppercase tracking-wider ${
                    conf.status === 'arrived' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {conf.status === 'arrived' ? '已入库' : '在途'}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                   <span className={`text-[9px] font-bold px-2 py-1 border ${
                    conf.paymentStatus === 'paid' ? 'border-green-200 text-green-600 bg-green-50' : 'border-zinc-200 text-zinc-400'
                  }`}>
                    {conf.paymentStatus === 'paid' ? '已支付' : '待结算'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-black hover:underline text-xs font-bold uppercase tracking-widest">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUploadOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-sm font-black uppercase tracking-widest">上传上游采购确认单</h2>
            </div>
            <div className="p-8">
              <div className="border-2 border-dashed border-zinc-200 p-12 text-center rounded-sm">
                <Upload className="mx-auto text-zinc-300 mb-4" size={48} />
                <div className="text-sm font-bold text-black mb-1 text-center">拖拽 Excel/PDF 文件至此</div>
                <div className="text-xs text-zinc-500 text-center">支持从上游供应商导出的确认清册，系统将自动对碰货单</div>
                <button className="mt-6 bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest">选择文件</button>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-100">
                  <Clock size={16} className="text-zinc-400" />
                  <div className="text-[10px] text-zinc-500">历史上传: <span className="font-bold text-black">Supplier_Confirm_Aug15.xlsx</span> (2024-08-15 14:00)</div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-zinc-100">
                 <button onClick={() => setIsUploadOpen(false)} className="px-6 py-2 text-xs font-bold border border-zinc-200 hover:bg-zinc-50">取消</button>
                 <button onClick={() => { alert('解析成功：共匹配 12 个订单项，产生 ¥4,500 利润变动'); setIsUploadOpen(false); }} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest">解析并同步</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
