import { useState } from 'react';
import { Search, ChevronDown, Plus, Download, Upload, Edit, User, Trash, Check, X, Package, CheckCircle, ArrowRight, ArrowRightLeft, Warehouse, ArrowDownToLine, CheckSquare, Building2, Eye, ShieldCheck, Box } from 'lucide-react';

const MOCK_WMS_ASN = [
  {
    asnId: 'ASN-20260518-01',
    poId: 'PO-000346',
    supplier: '欧洲表行/nick',
    type: 'spot', // 现货
    expectedTime: '2026-05-20',
    totalExpected: 4,
    status: 'pending_receipt', // 待收货
    items: [
      {
        id: 'ITEM-01',
        imageUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=100',
        brand: 'MONCLER',
        skuCode: 'L10918C00032829H83P0-XXL',
        size: 'XXL',
        name: '短袖三件套',
        expectedQty: 1,
        receivedQty: 0,
        unitPrice: 2897.98,
        costEur: 2634.53,
        arrived: false
      }
    ]
  }
];

export function PurchaseManagement() {
  const [activeTab, setActiveTab] = useState<'asn' | 'receiving' | 'putaway'>('receiving');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showItemMatchModal, setShowItemMatchModal] = useState(false);

  return (
    <div className="h-full flex flex-col bg-zinc-50/50">
      <div className="p-4 md:p-8 border-b border-zinc-200 bg-white">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Warehouse className="text-zinc-400" size={24} />
            <h1 className="text-2xl font-black tracking-tight">WMS 采购入库作业</h1>
          </div>
          <p className="text-sm text-zinc-500">按照标准化仓储流程，管理采购单到货预报、清点验收与上架入库。</p>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col">
        {/* WMS Process Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-200 bg-white mb-6">
          <div 
            onClick={() => setActiveTab('asn')}
            className={`p-6 border-b md:border-b-0 md:border-r border-zinc-200 cursor-pointer transition-colors ${activeTab === 'asn' ? 'bg-zinc-50 shadow-[inset_0_2px_0_black]' : 'hover:bg-zinc-50/50'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage 1</span>
              <ArrowDownToLine size={16} className={activeTab === 'asn' ? 'text-black' : 'text-zinc-300'} />
            </div>
            <div className={`text-base font-black mb-1 ${activeTab === 'asn' ? 'text-black' : 'text-zinc-500'}`}>入库预报 (ASN) / 采购单</div>
            <div className="text-xs text-zinc-500">同步采购单，创建待入库预报任务。</div>
          </div>

          <div 
            onClick={() => setActiveTab('receiving')}
            className={`p-6 border-b md:border-b-0 md:border-r border-zinc-200 cursor-pointer transition-colors ${activeTab === 'receiving' ? 'bg-zinc-50 shadow-[inset_0_2px_0_black]' : 'hover:bg-zinc-50/50'}`}
          >
             <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage 2</span>
              <ShieldCheck size={16} className={activeTab === 'receiving' ? 'text-black' : 'text-zinc-300'} />
            </div>
            <div className={`text-base font-black mb-1 ${activeTab === 'receiving' ? 'text-black' : 'text-zinc-500'}`}>到货清点 & 品控 </div>
            <div className="text-xs text-zinc-500">实物签收、录入批次、匹配公共库商品、质检。</div>
          </div>

          <div 
            onClick={() => setActiveTab('putaway')}
            className={`p-6 cursor-pointer transition-colors ${activeTab === 'putaway' ? 'bg-zinc-50 shadow-[inset_0_2px_0_black]' : 'hover:bg-zinc-50/50'}`}
          >
             <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage 3</span>
              <Box size={16} className={activeTab === 'putaway' ? 'text-black' : 'text-zinc-300'} />
            </div>
            <div className={`text-base font-black mb-1 ${activeTab === 'putaway' ? 'text-black' : 'text-zinc-500'}`}>上架动作 (Putaway)</div>
            <div className="text-xs text-zinc-500">将已验收商品分配库位，转为真实可用库存。</div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-zinc-200 flex-1 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4">
             <div className="flex items-center gap-2 flex-1">
                <input type="text" placeholder={activeTab === 'asn' ? "搜索预报单号/采购单号" : activeTab === 'receiving' ? "扫码/搜索 SKU" : "搜索批次或库位"} className="w-full max-w-xs px-3 py-2 text-sm border border-zinc-200 focus:border-black outline-none" />
                <button className="px-4 py-2 bg-zinc-100 text-zinc-600 text-sm font-bold hover:bg-zinc-200 transition-colors">筛选</button>
             </div>
             <div className="flex items-center gap-2">
                {activeTab === 'receiving' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors" onClick={() => setSelectedTask(MOCK_WMS_ASN[0])}>
                    <CheckSquare size={16} /> 开始清点作业
                  </button>
                )}
                {activeTab === 'asn' && (
                  <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 text-zinc-600 text-sm font-bold hover:bg-zinc-50 transition-colors">
                    <Download size={16} /> 导入外部采购单
                  </button>
                )}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
             <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0">
                  {activeTab === 'asn' && (
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">预报单号 (ASN)</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">源采购单 (PO)</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">供应商</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">预计到货日</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">预计件数</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">状态</th>
                    </tr>
                  )}
                  {activeTab === 'receiving' && (
                    <tr>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-12">图片</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">预报/采购单</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">商品型号 / 规格</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">应收</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">实收</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">清点作业</th>
                    </tr>
                  )}
                  {activeTab === 'putaway' && (
                    <tr>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">批次号 / SKU</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">商品状态</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">质检结果</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">待上架数量</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">推荐库位</th>
                       <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">操作</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {activeTab === 'asn' && MOCK_WMS_ASN.map(asn => (
                    <tr key={asn.asnId} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                      <td className="px-6 py-4 text-xs font-mono font-bold">{asn.asnId}</td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-500 hover:text-black cursor-pointer underline underline-offset-2">{asn.poId}</td>
                      <td className="px-6 py-4 text-xs">{asn.supplier}</td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{asn.expectedTime}</td>
                      <td className="px-6 py-4 text-xs font-mono text-right">{asn.totalExpected}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1">待收货</span>
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'receiving' && MOCK_WMS_ASN[0].items.map(item => (
                    <tr key={item.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover bg-zinc-100" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono text-zinc-500">ASN: {MOCK_WMS_ASN[0].asnId}</div>
                        <div className="text-xs font-mono text-zinc-400 mt-1">PO: {MOCK_WMS_ASN[0].poId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono font-bold text-zinc-800">{item.skuCode}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">{item.brand} | {item.size}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-right text-zinc-500">{item.expectedQty}</td>
                      <td className="px-6 py-4 text-xs font-mono text-right font-black">{item.receivedQty}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setSelectedTask(MOCK_WMS_ASN[0])} className="text-xs font-bold px-3 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors">去清点</button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'putaway' && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Box size={32} className="mx-auto text-zinc-200 mb-3" />
                        <div className="text-sm font-bold text-zinc-400">暂无待上架任务</div>
                        <div className="text-xs text-zinc-400 mt-1">请先完成收货清点作业</div>
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      </div>

       {/* Receiving Task Form */}
       {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full md:w-[800px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-l-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck size={20} />
                  收货清点作业单
                </h2>
                <div className="text-xs text-zinc-500 font-mono mt-1">ASN Task: {selectedTask.asnId} (PO: {selectedTask.poId})</div>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="border border-zinc-200 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">本次应收总数</div>
                    <div className="text-2xl font-black font-mono">4</div>
                 </div>
                 <div className="border border-zinc-200 p-4 bg-orange-50 border-orange-200">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1">当前已清点</div>
                    <div className="text-2xl font-black font-mono text-orange-600">0</div>
                 </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest">货品清点明细</h3>
                <button onClick={() => setShowItemMatchModal(true)} className="text-xs font-bold px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-blue-600 flex items-center gap-1 transition-colors">
                  <ArrowRightLeft size={14} /> 全局库商品匹配建款
                </button>
              </div>

              <div className="space-y-4">
                {selectedTask.items.map((item: any) => (
                  <div key={item.id} className="border border-zinc-200 p-4 flex gap-4">
                    <img src={item.imageUrl} alt="" className="w-16 h-16 object-cover bg-zinc-100 border border-zinc-200" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-mono font-bold">{item.skuCode}</div>
                          <div className="text-xs text-zinc-500 mt-1">{item.brand} | {item.size}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-zinc-500 mb-1">到货量录入</div>
                          <div className="flex items-center gap-2">
                             <input type="number" defaultValue="0" className="w-20 text-center font-mono font-bold px-2 py-1 border border-zinc-300 focus:border-black outline-none" />
                             <span className="text-xs text-zinc-500">/ {item.expectedQty} 预报</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-100 flex gap-4">
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input type="checkbox" className="accent-black w-3 h-3" />
                           <span className="text-xs font-bold text-zinc-600">外观无损</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input type="checkbox" className="accent-black w-3 h-3" />
                           <span className="text-xs font-bold text-zinc-600">标签完整</span>
                         </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50">
               <button onClick={() => setSelectedTask(null)} className="px-6 py-2 border border-zinc-200 text-sm font-bold bg-white hover:bg-zinc-50 transition-colors">挂起任务</button>
               <button className="px-6 py-2 bg-black text-white text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2">
                 生成上架任务单 <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Matching / Creation Modal */}
      {showItemMatchModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl border border-zinc-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <h2 className="text-sm font-black uppercase tracking-widest">公共库商品匹配关联</h2>
               <button onClick={() => setShowItemMatchModal(false)} className="text-zinc-400 hover:text-black">
                 <X size={18} />
               </button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                 <input type="text" placeholder="扫码录入货款编号自动查找库内商品..." className="flex-1 px-3 py-2 text-sm border border-zinc-200 focus:border-black outline-none font-mono" defaultValue="L10918C00032829H83P0" autoFocus />
                 <button className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors">验证匹配</button>
              </div>

              <div className="border border-green-200 bg-green-50 p-6 text-center text-sm flex flex-col items-center">
                 <CheckCircle size={32} className="text-green-500 mb-3" />
                 <div className="font-bold text-green-800 mb-1">成功匹配到平台公共库商品</div>
                 <div className="text-green-600">MONCLER / 短袖三件套</div>
                 <button className="mt-6 px-6 py-2 bg-white border border-green-300 text-sm font-bold text-black hover:bg-zinc-50 shadow-sm transition-colors" onClick={() => setShowItemMatchModal(false)}>
                   快速导入基础数据建库 / 关联
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
