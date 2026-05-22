import { useState } from 'react';
import { Plus, Download, Edit, Trash, CheckCircle, PackageOpen, Truck, X, ShoppingBag, ListChecks, Search } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'ORD-2024-001',
    customer: '张三 (VIP会员)',
    saleName: '李四',
    totalPrice: 15000,
    paymentStatus: '定金',
    unpaidAmount: 5000,
    type: 'spot', // 现货
    status: 'pending_audit',
    time: '2026-05-18 10:20:00'
  }
];

export function PurchaseSales() {
  const [activeTab, setActiveTab] = useState<'orders' | 'picking' | 'shipping'>('orders');
  const [orderType, setOrderType] = useState<'futures' | 'spot'>('spot');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);

  return (
    <div className="h-full flex flex-col bg-zinc-50/50">
      <div className="p-4 md:p-8 border-b border-zinc-200 bg-white">
         <div className="flex items-center gap-3 mb-2">
            <PackageOpen className="text-zinc-400" size={24} />
            <h1 className="text-2xl font-black tracking-tight">WMS 行邮出库预处理</h1>
         </div>
        <p className="text-sm text-zinc-500">处理前端订单接入、全款/定金财务审核，并流转至出库波次和发货打包作业。</p>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col">

        {/* WMS Outbound Process Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-200 bg-white mb-6">
          <div 
            onClick={() => setActiveTab('orders')}
            className={`p-6 border-b md:border-b-0 md:border-r border-zinc-200 cursor-pointer transition-colors ${activeTab === 'orders' ? 'bg-zinc-50 shadow-[inset_0_2px_0_black]' : 'hover:bg-zinc-50/50'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage 1</span>
              <ShoppingBag size={16} className={activeTab === 'orders' ? 'text-black' : 'text-zinc-300'} />
            </div>
            <div className={`text-base font-black mb-1 ${activeTab === 'orders' ? 'text-black' : 'text-zinc-500'}`}>销售订单汇聚 (Orders)</div>
            <div className="text-xs text-zinc-500">新增现货/期货订单，处理全款、定金与尾款核销。</div>
          </div>

          <div 
            onClick={() => setActiveTab('picking')}
            className={`p-6 border-b md:border-b-0 md:border-r border-zinc-200 cursor-pointer transition-colors ${activeTab === 'picking' ? 'bg-zinc-50 shadow-[inset_0_2px_0_black]' : 'hover:bg-zinc-50/50'}`}
          >
             <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage 2</span>
              <ListChecks size={16} className={activeTab === 'picking' ? 'text-black' : 'text-zinc-300'} />
            </div>
            <div className={`text-base font-black mb-1 ${activeTab === 'picking' ? 'text-black' : 'text-zinc-500'}`}>总拣作业 (Wave Picking) </div>
            <div className="text-xs text-zinc-500">根据已审核订单生成拣货单，指导库内找货动作。</div>
          </div>

          <div 
            onClick={() => setActiveTab('shipping')}
            className={`p-6 cursor-pointer transition-colors ${activeTab === 'shipping' ? 'bg-zinc-50 shadow-[inset_0_2px_0_black]' : 'hover:bg-zinc-50/50'}`}
          >
             <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage 3</span>
              <Truck size={16} className={activeTab === 'shipping' ? 'text-black' : 'text-zinc-300'} />
            </div>
            <div className={`text-base font-black mb-1 ${activeTab === 'shipping' ? 'text-black' : 'text-zinc-500'}`}>打包与发货 (Shipping)</div>
            <div className="text-xs text-zinc-500">复核实物，扫码装箱，生成快递面单并正式扣减库存。</div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 flex-1 flex flex-col overflow-hidden">
          {activeTab === 'orders' && (
            <>
              <div className="flex gap-8 border-b border-zinc-200 px-6 bg-zinc-50/50">
                <button 
                  onClick={() => setOrderType('spot')} 
                  className={`py-4 text-sm font-bold transition-colors mb-[-1px] ${orderType === 'spot' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
                >
                  现货销售订单
                </button>
                <button 
                  onClick={() => setOrderType('futures')} 
                  className={`py-4 text-sm font-bold transition-colors mb-[-1px] ${orderType === 'futures' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
                >
                  期货销售订单
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col overflow-hidden">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
                  <input type="text" placeholder="客户名称" className="px-3 py-2 text-sm border border-zinc-200 focus:border-black outline-none" />
                  <input type="text" placeholder="订单编号" className="px-3 py-2 text-sm border border-zinc-200 focus:border-black outline-none" />
                  <select className="px-3 py-2 text-sm border border-zinc-200 focus:border-black outline-none bg-white">
                    <option value="">付款状态</option>
                  </select>
                  <select className="px-3 py-2 text-sm border border-zinc-200 focus:border-black outline-none bg-white">
                    <option value="">是否结算</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mb-6 shrink-0">
                  <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 text-sm font-bold hover:bg-blue-100 transition-colors">
                    <Plus size={16} /> 新增订单
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 text-sm font-bold hover:bg-zinc-50 transition-colors">
                    <Edit size={16} /> 修改
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors">
                    <Trash size={16} /> 删除
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 text-sm font-bold hover:bg-zinc-50 transition-colors ml-auto">
                    <Download size={16} /> 导出
                  </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-y-auto border border-zinc-200">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">订单单号</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">客户名称</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">销售名称</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">付款状态</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">总金额</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">待补尾款</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">审核状态</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.filter(o => o.type === orderType).map(ord => (
                        <tr key={ord.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="px-4 py-4 text-xs font-mono text-blue-600 hover:underline cursor-pointer">{ord.id}</td>
                          <td className="px-4 py-4 text-xs">{ord.customer}</td>
                          <td className="px-4 py-4 text-xs">{ord.saleName}</td>
                          <td className="px-4 py-4 text-xs">
                            <span className={`px-2 py-1 font-bold ${ord.paymentStatus === '定金' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs font-mono text-right font-black">¥{ord.totalPrice}</td>
                          <td className="px-4 py-4 text-xs font-mono text-right text-red-500 font-bold">{ord.unpaidAmount > 0 ? `¥${ord.unpaidAmount}` : '-'}</td>
                          <td className="px-4 py-4 text-xs">
                            <span className="text-red-500 font-bold">待审核</span>
                          </td>
                          <td className="px-4 py-4 text-xs text-zinc-500 font-mono">{ord.time}</td>
                        </tr>
                      ))}
                      {MOCK_ORDERS.filter(o => o.type === orderType).length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-zinc-400 text-sm">此分类暂无订单数据</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'orders' && (
            <div className="flex-1 flex items-center justify-center flex-col text-center p-6 text-zinc-500">
               <PackageOpen size={48} className="mb-4 text-zinc-300" />
               <h3 className="text-lg font-bold text-zinc-800 mb-2">作业区无活动任务</h3>
               <p className="text-sm max-w-sm">
                 当前没有待进行的{activeTab === 'picking' ? "拣货池" : "打包/复核"}任务。所有工作会由订单状态审核通过后自动流转进入作业池。
               </p>
               {activeTab === 'picking' && (
                 <button className="mt-4 px-6 py-2 border border-zinc-200 text-sm font-bold text-black hover:bg-zinc-50 bg-white">手动生成拣货波次</button>
               )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl border border-zinc-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-black">销售订单草稿 ({orderType === 'spot' ? '现货' : '期货'})</h2>
                <div className="text-[10px] text-zinc-500 mt-1">请填写客户与财务信息并关联出库商品</div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-black transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 border-b border-zinc-100 pb-6">
                <div>
                  <label className="block text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">* 客户会员</label>
                  <select className="w-full px-3 py-2 border border-zinc-200 text-sm focus:border-black outline-none bg-white">
                    <option>请选择会员档案</option>
                    <option>张三 (VIP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">* 销售负责人</label>
                  <input type="text" placeholder="内部销售姓名" className="w-full px-3 py-2 border border-zinc-200 text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">渠道来源</label>
                  <select className="w-full px-3 py-2 border border-zinc-200 text-sm focus:border-black outline-none bg-white">
                    <option>官方小红书</option>
                    <option>微信私域</option>
                    <option>淘宝店铺</option>
                  </select>
                </div>
                <div />

                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">* 货款结算方式</label>
                  <select 
                    className="w-full px-3 py-2 border border-orange-200 bg-orange-50 text-orange-900 text-sm focus:border-orange-500 outline-none transition-colors"
                    onChange={(e) => setIsDeposit(e.target.value === 'deposit')}
                  >
                    <option value="full">全款结清</option>
                    <option value="deposit">定金模式</option>
                  </select>
                </div>
                {isDeposit && (
                  <div className="animate-in slide-in-from-top-2 pt-2">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">待补尾款预估 (系统自动计算)</label>
                    <div className="w-full px-3 py-2 border border-zinc-200 text-sm bg-zinc-50 text-zinc-500 font-mono flex items-center justify-between">
                       <span>¥0.00</span>
                       <span className="text-[10px]">保存时核算</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-2 flex items-center justify-between">
                 <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">出库商品明细</div>
              </div>
              
              <div className="border border-zinc-200 bg-zinc-50 min-h-[120px] flex items-center justify-center relative overflow-hidden group hover:border-black transition-colors cursor-pointer" onClick={() => {}}>
                <div className="text-center">
                   <div className="w-10 h-10 bg-white border border-zinc-200 flex items-center justify-center mx-auto mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-zinc-400 group-hover:text-black group-hover:bg-zinc-100 transition-colors">
                     <Search size={18} />
                   </div>
                   <div className="text-sm font-bold text-black group-hover:underline">从公共库 / 采购台账中检索商品</div>
                   <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">Click to browse inventory</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50">
               <button onClick={() => setShowAddModal(false)} className="px-6 py-2 border border-zinc-200 text-sm font-bold bg-white hover:bg-zinc-50 transition-colors">放弃编辑</button>
               <button className="px-6 py-2 bg-black text-white text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors">生成单据并提交财务审核</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
