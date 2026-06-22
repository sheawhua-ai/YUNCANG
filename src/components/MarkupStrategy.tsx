import { useState, useRef, useEffect } from "react";
import { Plus, X, AlertCircle, ChevronDown, Search, ChevronRight, Upload } from "lucide-react";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { CategoryMultiSelectDropdown } from "./CategoryMultiSelectDropdown";
import { SearchableCombobox } from "./SearchableCombobox";
import { CATEGORY_HIERARCHY, ALL_BRANDS } from "../lib/constants";

interface MarkupStrategyProps {
  setActiveTab?: (tab: string) => void;
}

export function MarkupStrategy({ setActiveTab }: MarkupStrategyProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [markupRate, setMarkupRate] = useState('');
  const [globalMerchants, setGlobalMerchants] = useState<string[]>(['1567']);
  const [merchantSearch, setMerchantSearch] = useState('');
  const [retailFollowMerchant, setRetailFollowMerchant] = useState('1567');
  const [strategySelectedMerchants, setStrategySelectedMerchants] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceTailRule, setPriceTailRule] = useState('none');

  const markupValue = Number(markupRate) || 0;
  const isSaveDisabled = !strategyName || !markupRate;

  const supplyPrice = 100;
  let calculatedSellingPrice = supplyPrice * (1 + markupValue / 100);
  if (priceTailRule === '9') {
    calculatedSellingPrice = Math.floor(calculatedSellingPrice / 10) * 10 + 9;
  } else if (priceTailRule === '0') {
    calculatedSellingPrice = Math.floor(calculatedSellingPrice / 10) * 10;
  }
  
  const sellingPrice = markupValue ? calculatedSellingPrice.toFixed(2) : '0.00';
  const profit = markupValue ? (Number(sellingPrice) - supplyPrice).toFixed(2) : '0.00';
  const calculatedGrossMargin = markupValue && Number(sellingPrice) > 0 ? ((Number(profit) / Number(sellingPrice)) * 100).toFixed(2) : '0.00';

  const merchants = [
    { value: '1567', label: 'UNIBUY (1567)' },
    { value: '14746', label: '002 (14746)' },
    { value: '1795', label: 'HANNAH (1795)' },
    { value: '29813', label: '日本中古表 (29813)' },
    { value: '1001', label: '巴黎老佛爷代购 (1001)' },
    { value: '1002', label: '米兰精品专营 (1002)' },
    { value: '1003', label: '香港免税直邮 (1003)' },
    { value: '1004', label: '首尔东大门精选 (1004)' },
    { value: '1005', label: '纽约名品奥莱 (1005)' },
    { value: '1006', label: '东京银座贵妇 (1006)' },
    { value: '1007', label: '伦敦海德公园店 (1007)' },
    { value: '1008', label: '迪拜帆船中心 (1008)' },
    { value: '1009', label: '斯图加特表行 (1009)' },
    { value: '1010', label: '洛杉矶潮牌集合 (1010)' },
    { value: '1011', label: '日内瓦高定 (1011)' },
    { value: '1012', label: '苏黎世名门 (1012)' },
    { value: '1013', label: '慕尼黑奢饰 (1013)' },
    { value: '1014', label: '马德里皮具 (1014)' },
    { value: '1015', label: '巴塞罗那设计师 (1015)' },
  ];

  const selectedMerchantLabels = globalMerchants.length > 0 
    ? globalMerchants.map(id => merchants.find(m => m.value === id)?.label).join('、')
    : '未选择供应商';

  const filteredMerchants = merchants.filter(m => 
    m.label.toLowerCase().includes(merchantSearch.toLowerCase()) || 
    m.value.includes(merchantSearch)
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1">加价策略配置</h1>
          <p className="text-sm text-zinc-500">挑选需要同步的供应商集合，并在该范围内配置零售价跟随规则与商品顺加策略。</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. 基础配置 */}
        <div className="bg-white border border-zinc-200 shadow-sm p-6">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-lg font-bold mb-1">1. 策略基础配置</h2>
              <p className="text-xs text-zinc-500">挑选需要同步的供应商，并配置全局的零售价兜底跟随规则。</p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* 供应商集合 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold">同步的供应商集合</label>
                <div className="text-xs text-zinc-500 select-none">
                  已选 <span className="text-black font-bold">{globalMerchants.length}</span> 个供应商
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="w-full md:w-96">
                   <MultiSelectDropdown 
                     options={merchants}
                     selected={globalMerchants}
                     onChange={setGlobalMerchants}
                     placeholder="搜索并选择供应商..."
                   />
                </div>
                
                {/* 选中的展示 Tags */}
                {globalMerchants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                     {globalMerchants.map(id => {
                        const m = merchants.find(x => x.value === id);
                        if (!m) return null;
                        return (
                          <div key={id} className="flex items-center bg-zinc-100 border border-zinc-200 text-xs pl-3 pr-1 py-1 rounded-full">
                            <span className="mr-2 font-medium">{m.label}</span>
                            <button 
                              onClick={() => setGlobalMerchants(globalMerchants.filter(x => x !== id))}
                              className="text-zinc-400 hover:text-black hover:bg-zinc-200 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )
                     })}
                     <button 
                       onClick={() => setGlobalMerchants([])}
                       className="text-[10px] text-zinc-400 hover:text-black hover:underline px-2"
                     >
                       清空全部
                     </button>
                  </div>
                )}
              </div>
            </div>

            {/* 零售价跟随 */}
            <div className="pt-6 border-t border-zinc-100">
               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between">
                 <div className="flex-1">
                    <div className="text-sm font-bold">全局零售价跟随 (兜底推荐)</div>
                    <div className="text-xs text-zinc-500 mt-1 max-w-2xl">如果商品在以下指定的供应商范围内有官方指导价，系统将直接采用，以此作为终端售价基准。如果没有指导价，将沿用下方的顺加策略。</div>
                 </div>
                 
                 <div className="shrink-0 w-full md:w-64">
                    <div className="flex items-center bg-white border border-zinc-300 px-3 py-2 text-sm font-bold">
                      <select 
                        value={retailFollowMerchant}
                        onChange={(e) => setRetailFollowMerchant(e.target.value)}
                        className="w-full bg-transparent outline-none cursor-pointer"
                        disabled={globalMerchants.length === 0}
                      >
                         <option value="none">不跟随，沿用加价策略</option>
                         <option disabled>------------------------</option>
                         {globalMerchants.map(id => {
                            const m = merchants.find(x => x.value === id);
                            return <option key={id} value={id}>优先跟随: {m?.label}</option>
                         })}
                      </select>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {globalMerchants.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 p-8 flex items-center justify-center text-zinc-400 text-sm">
            请先在上方配置至少一个供应商
          </div>
        ) : (
          <>
            {/* 2. 商品加价策略 */}
            <div className="bg-white border border-zinc-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold">2. 商品加价策略</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors self-start sm:self-auto">
                  + 新增策略
                </button>
              </div>
              
              <div className="text-xs text-zinc-500 mb-4 bg-blue-50 p-3 border border-blue-100">
                当前策略作用域包含 <strong>{selectedMerchantLabels}</strong>。如果没有指导零售价，商品将按下方配置的顺加策略计算最终售卖价。未包含在策略内（且范围内）的商品，也将不会被同步到您的选品库。
              </div>

              <div className="border border-zinc-200 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
                  <thead className="bg-zinc-50 text-xs font-bold text-zinc-500 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">策略名称</th>
                      <th className="px-4 py-3 font-medium">应用供应商</th>
                      <th className="px-4 py-3 font-medium">分类限制</th>
                      <th className="px-4 py-3 font-medium">品牌限制</th>
                      <th className="px-4 py-3 font-medium text-right">加价规则</th>
                      <th className="px-4 py-3 font-medium text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    <tr className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-bold">默认加价 (主力)</td>
                      <td className="px-4 py-3"><span className="text-xs border border-zinc-200 px-1.5 py-0.5">无限制</span></td>
                      <td className="px-4 py-3 text-zinc-500">全部分类</td>
                      <td className="px-4 py-3 text-zinc-500">全部品牌</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-emerald-600">+15%</span>
                        <div className="text-[10px] text-zinc-400">尾数: 9</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-zinc-500 hover:text-black transition-colors px-2 py-1">编辑</button>
                      </td>
                    </tr>
                    {globalMerchants.includes('1567') && (
                      <tr className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 font-bold">特定品类加价</td>
                        <td className="px-4 py-3"><span className="text-xs border border-blue-200 bg-blue-50 text-blue-600 px-1.5 py-0.5">UNIBUY</span></td>
                        <td className="px-4 py-3 text-zinc-500">腕表/珠宝</td>
                        <td className="px-4 py-3 text-zinc-500">Rolex, Omega</td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold text-emerald-600">+8%</span>
                          <div className="text-[10px] text-zinc-400">尾数: 不处理</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-zinc-500 hover:text-black transition-colors px-2 py-1">编辑</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Strategy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[600px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <h2 className="text-base md:text-lg font-black uppercase tracking-tight">新增加价策略</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-4 md:p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">策略名称</label>
                  <input 
                    type="text" 
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    placeholder="例如：特定包袋加价" 
                    className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none" 
                  />
                </div>
                <div>
                  <MultiSelectDropdown 
                    label="应用供应商 (必须在此组内)" 
                    options={globalMerchants.map(id => merchants.find(m => m.value === id) || {value: id, label: id})} 
                    selected={strategySelectedMerchants} 
                    onChange={setStrategySelectedMerchants} 
                    placeholder="全不选则应用到选中集合全部供应商" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryMultiSelectDropdown 
                  label="限定分类 (可选)" 
                  options={CATEGORY_HIERARCHY} 
                  selected={selectedCategories} 
                  onChange={setSelectedCategories} 
                  placeholder="全不选则不限制" 
                />
                <MultiSelectDropdown 
                  label="限定品牌 (可选)" 
                  options={ALL_BRANDS} 
                  selected={selectedBrands} 
                  onChange={setSelectedBrands} 
                  placeholder="全不选则不限制" 
                />
              </div>

              <div className="border-t border-zinc-100 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">顺加加价率 (%)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="例如: 25" 
                        value={markupRate}
                        onChange={(e) => setMarkupRate(e.target.value)}
                        className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none" 
                      />
                      <span className="text-sm font-bold">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">展现价尾数规则</label>
                    <div className="relative">
                      <select 
                        value={priceTailRule}
                        onChange={(e) => setPriceTailRule(e.target.value)}
                        className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none appearance-none bg-white"
                      >
                        <option value="none">不处理 (精确到元)</option>
                        <option value="9">固定以 9 结尾</option>
                        <option value="0">固定以 0 结尾</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {markupRate && (
                  <div className="bg-zinc-50 p-4 border border-zinc-200 text-xs md:text-sm">
                    <div className="text-zinc-500 mb-2">示例: 假设集市供货价为 ¥100</div>
                    <div className="font-mono mb-1">
                      分销零售价计算 = ¥100 × (1 + {markupRate}%) = ¥{(100 * (1 + markupValue / 100)).toFixed(2)}
                    </div>
                    {priceTailRule !== 'none' && (
                      <div className="font-mono mb-1">
                        尾数处理 ({priceTailRule === '9' ? '结尾 9' : '结尾 0'}) = <span className="font-bold text-black">¥{sellingPrice}</span>
                      </div>
                    )}
                    <div className="font-mono mb-1 mt-2">
                      最终展现价 = <span className="font-bold text-black">¥{sellingPrice}</span>
                    </div>
                    <div className="font-mono mb-1">
                      预计利润 = 分销零售价 - 供货价 = <span className="font-bold text-emerald-600">¥{profit}</span>
                    </div>
                    <div className="font-mono text-zinc-500 text-xs mt-2 pt-2 border-t border-zinc-200">
                      折合毛利率 ≈ {calculatedGrossMargin}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-zinc-100 bg-zinc-50 flex flex-col md:flex-row justify-end gap-3 flex-shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors w-full md:w-auto text-center border border-zinc-200 bg-white md:bg-transparent md:border-none">取消</button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSaveDisabled}
                className={`w-full md:w-auto px-6 py-2 text-xs font-bold transition-colors ${
                  isSaveDisabled 
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                保存策略
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

