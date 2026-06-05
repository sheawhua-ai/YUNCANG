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
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceTailRule, setPriceTailRule] = useState('none');
  
  // Follow merchant preferences
  const [followMerchant1, setFollowMerchant1] = useState('1567');
  const [followChannel1, setFollowChannel1] = useState('mainland');
  const [followMerchant2, setFollowMerchant2] = useState('');
  const [followChannel2, setFollowChannel2] = useState('mainland');
  const [followMerchant3, setFollowMerchant3] = useState('');
  const [followChannel3, setFollowChannel3] = useState('mainland');

  // Filter states
  const [filterSearch, setFilterSearch] = useState('');
  const [filterMerchants, setFilterMerchants] = useState<string[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);

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
  ];

  const channels = [
    { value: 'auto', label: '智能对标 (大陆-大陆 / 香港-香港)' },
    { value: 'mainland', label: '强对标: 大陆零售价' },
    { value: 'hongkong', label: '强对标: 香港零售价' },
    { value: 'europe', label: '强对标: 欧洲零售价' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-8 gap-4">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">商家管理面板</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">选品与配置加价策略</h1>
          <p className="text-xs md:text-sm text-zinc-500">配置分销加价规则，并获取符合规则的商品至您的分销库</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            className="w-full sm:w-auto bg-white text-black border border-zinc-200 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            批量单品策略上传
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            新增策略
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-emerald-800 tracking-tight flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            已自动同步最新集市SPU总数: <span className="text-lg">15,234</span> 个
          </div>
          <div className="text-xs text-emerald-600 mt-1">每次进入时系统自动刷新。所有商品的分销价格已根据下方的具体策略自动计算并更新至您的选品库。</div>
        </div>
        <button onClick={() => setActiveTab && setActiveTab('dist_mine')} className="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-4 py-2 hover:bg-emerald-100 transition-colors shrink-0">
          前往我的选品查看全部
        </button>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-black uppercase tracking-widest mb-4">全局定价优先级与跟随商家策略</h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          <div className="flex-1 bg-zinc-50 border border-zinc-200 p-4">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">优先级 1</div>
            <div className="text-sm font-bold flex items-center justify-between">
              <span>单品特例价格</span>
              <span className="text-[9px] bg-blue-600 text-white px-1 py-0.5 rounded-sm">Highest</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">在「我的选品」或通过 Excel 批量设置的固定展现价。</div>
          </div>
          <div className="hidden md:flex items-center text-zinc-300">
            <ChevronRight size={20} />
          </div>
          <div className="flex-1 bg-zinc-50 border border-zinc-200 p-4 border-l-4 border-l-black">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">优先级 2</div>
            <div className="text-sm font-bold">跟随指定商家零售价</div>
            <div className="text-[10px] text-zinc-500 mt-1">若配置了跟随商家，将优先读取该商家的指导零售价。</div>
          </div>
          <div className="hidden md:flex items-center text-zinc-300">
            <ChevronRight size={20} />
          </div>
          <div className="flex-1 bg-zinc-50 border border-zinc-200 p-4">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">优先级 3</div>
            <div className="text-sm font-bold">加价策略计算</div>
            <div className="text-[10px] text-zinc-500 mt-1">若前置策略均未命中，按下方配置的顺加策略与尾数计算。</div>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-6">
          <h3 className="text-xs font-bold mb-3">配置跟随商家及价格渠道 (优先级递减)</h3>
          <div className="flex flex-col gap-4">
            {/* Slot 1 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center bg-zinc-50/50 p-3 rounded-sm border border-zinc-100">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-zinc-600 w-6">1. 商家</span>
                <SearchableCombobox
                  options={merchants}
                  value={followMerchant1}
                  onChange={setFollowMerchant1}
                  className="w-full md:w-48"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-zinc-600 w-12">对标渠道</span>
                <select 
                  value={followChannel1}
                  onChange={(e) => setFollowChannel1(e.target.value)}
                  className="h-[38px] w-full md:w-40 border border-zinc-200 bg-white px-3 text-xs font-bold outline-none focus:border-black"
                >
                  {channels.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Slot 2 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center bg-zinc-50/50 p-3 rounded-sm border border-zinc-100">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-zinc-600 w-6">2. 商家</span>
                <SearchableCombobox
                  options={merchants}
                  value={followMerchant2}
                  onChange={setFollowMerchant2}
                  className="w-full md:w-48"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-zinc-600 w-12">对标渠道</span>
                <select 
                  value={followChannel2}
                  onChange={(e) => setFollowChannel2(e.target.value)}
                  className="h-[38px] w-full md:w-40 border border-zinc-200 bg-white px-3 text-xs font-bold outline-none focus:border-black"
                >
                  {channels.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Slot 3 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center bg-zinc-50/50 p-3 rounded-sm border border-zinc-100">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-zinc-600 w-6">3. 商家</span>
                <SearchableCombobox
                  options={merchants}
                  value={followMerchant3}
                  onChange={setFollowMerchant3}
                  className="w-full md:w-48"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-zinc-600 w-12">对标渠道</span>
                <select 
                  value={followChannel3}
                  onChange={(e) => setFollowChannel3(e.target.value)}
                  className="h-[38px] w-full md:w-40 border border-zinc-200 bg-white px-3 text-xs font-bold outline-none focus:border-black"
                >
                  {channels.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex-1 text-right mt-2 md:mt-0">
                <button className="bg-black text-white px-8 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors h-[38px] w-full md:w-auto">保存并应用</button>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-zinc-500 mt-4 leading-relaxed bg-zinc-50 p-3 border-l-2 border-zinc-300">
            <span className="font-bold">计价逻辑说明：</span> 
            在前端展现商品价格时，系统将依序检查上述选择的商家是否在指定的价格渠道（如：大陆、香港）上提供了<span className="text-black font-bold">「零售指导价」</span>。
            <br />
            <span className="text-blue-600 font-bold">仓库-渠道自动映射：</span> 系统会将您的 SKU 所在仓库属性自动映射到对标商家的价格渠道。例如：位于「香港仓」的 SKU 将自动抓取对标商家的「香港零售价」进行跟随，无需逐个设置。
          </div>
        </div>
      </div>

      {/* Special Price Management Section */}
      <div className="mb-8 p-6 bg-white border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">单品特例价/特殊规则清单</h3>
            <p className="text-[10px] text-zinc-500 mt-1">当全局加价和商家跟随都不满足时，通过 Excel 或手动覆盖的价格项</p>
          </div>
          <div className="flex gap-2">
             <button className="bg-zinc-50 text-zinc-600 px-4 py-2 text-xs font-bold border border-zinc-200 hover:bg-zinc-100 transition-colors">导出清单</button>
             <button className="bg-zinc-50 text-red-600 px-4 py-2 text-xs font-bold border border-red-100 hover:bg-red-50 transition-colors">批量重置</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-50 p-4 border border-zinc-100">
            <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">正在生效特例</div>
            <div className="text-2xl font-black">128 <span className="text-xs text-zinc-400 font-normal">项</span></div>
          </div>
          <div className="bg-zinc-50 p-4 border border-zinc-100">
            <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">价格锁定中</div>
            <div className="text-2xl font-black">42 <span className="text-xs text-zinc-400 font-normal">项</span></div>
          </div>
          <div className="bg-zinc-50 p-4 border border-zinc-100">
            <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">异常预警 (亏损风险)</div>
            <div className="text-2xl font-black text-red-500">3 <span className="text-xs text-zinc-400 font-normal">项</span></div>
          </div>
          <div className="flex items-center justify-center border-2 border-dashed border-zinc-200 group hover:border-zinc-400 cursor-pointer transition-colors">
            <div className="text-xs font-bold text-zinc-400 group-hover:text-zinc-600 transition-colors flex items-center gap-2">
              <Plus size={14} /> 查看全部特例
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="搜索策略名称、ID..." 
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full border border-zinc-200 pl-10 pr-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white" 
          />
        </div>
        <div className="grid grid-cols-2 lg:flex gap-4">
          <div className="w-full lg:w-40">
            <MultiSelectDropdown 
              options={merchants} 
              selected={filterMerchants} 
              onChange={setFilterMerchants} 
              placeholder="全部商家" 
            />
          </div>
          <div className="w-full lg:w-40">
            <MultiSelectDropdown 
              options={ALL_BRANDS} 
              selected={filterBrands} 
              onChange={setFilterBrands} 
              placeholder="全部品牌" 
            />
          </div>
          <div className="w-full lg:w-48 col-span-2 lg:col-span-1">
            <CategoryMultiSelectDropdown 
              options={CATEGORY_HIERARCHY} 
              selected={filterCategories} 
              onChange={setFilterCategories} 
              placeholder="全部分类" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="border border-zinc-200 px-6 py-2 text-sm font-bold hover:bg-zinc-50 transition-colors bg-white">
            重置
          </button>
          <button className="bg-black text-white px-6 py-2 text-sm font-bold hover:bg-zinc-800 transition-colors">
            筛选
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div className="col-span-3">策略名称 (ID)</div>
          <div className="col-span-4">适用范围 (商家/分类/品牌)</div>
          <div className="col-span-3 text-center">加价规则 & 尾数处理</div>
          <div className="col-span-2 text-right">操作</div>
        </div>

        {/* Strategy Row 1 */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 border-b border-zinc-200 md:items-center hover:bg-zinc-50 transition-colors">
          <div className="md:col-span-3 flex justify-between items-start md:block">
            <div>
              <div className="text-sm font-bold">默认全局加价</div>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">ID: STR-DEFAULT</div>
            </div>
            <div className="md:hidden">
              <button className="text-xs font-bold text-zinc-500 hover:text-black transition-colors border border-zinc-200 px-3 py-1">编辑</button>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-wrap gap-1">
            <span className="bg-zinc-100 text-zinc-600 px-2 py-1 text-[10px] font-bold">全部商家</span>
            <span className="bg-zinc-100 text-zinc-600 px-2 py-1 text-[10px] font-bold">全部分类</span>
            <span className="bg-zinc-100 text-zinc-600 px-2 py-1 text-[10px] font-bold">全部品牌</span>
          </div>
          <div className="md:col-span-3 flex justify-between items-center md:block md:text-center mt-2 md:mt-0">
            <div className="text-xs text-zinc-500 md:hidden">加价规则</div>
            <div className="text-right md:text-center">
              <div className="text-sm font-bold text-emerald-600">+ 15%</div>
              <div className="text-[10px] text-zinc-400 mt-1">尾数: 以9结尾</div>
            </div>
          </div>
          <div className="hidden md:block col-span-2 text-right">
            <button className="text-xs font-bold text-zinc-500 hover:text-black transition-colors mr-4">编辑</button>
            <button className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50" disabled>删除</button>
          </div>
        </div>

        {/* Strategy Row 2 */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 border-b border-zinc-200 md:items-center hover:bg-zinc-50 transition-colors">
          <div className="md:col-span-3 flex justify-between items-start md:block">
            <div>
              <div className="text-sm font-bold">欧洲优选商家-腕表加价</div>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">ID: STR-8U72B</div>
            </div>
            <div className="md:hidden">
              <button className="text-xs font-bold text-zinc-500 hover:text-black transition-colors mr-3 border border-zinc-200 px-3 py-1">编辑</button>
              <button className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors border border-red-200 px-3 py-1 bg-red-50">删除</button>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-wrap gap-1">
            <span className="bg-blue-50 text-blue-600 px-2 py-1 text-[10px] font-bold">002 (14746)</span>
            <span className="bg-orange-50 text-orange-600 px-2 py-1 text-[10px] font-bold">腕表</span>
            <span className="bg-zinc-100 text-zinc-600 px-2 py-1 text-[10px] font-bold">Rolex</span>
          </div>
          <div className="md:col-span-3 flex justify-between items-center md:block md:text-center mt-2 md:mt-0">
            <div className="text-xs text-zinc-500 md:hidden">加价规则</div>
            <div className="text-right md:text-center">
              <div className="text-sm font-bold text-emerald-600">+ 8%</div>
              <div className="text-[10px] text-zinc-400 mt-1">尾数: 不处理</div>
            </div>
          </div>
          <div className="hidden md:block col-span-2 text-right">
            <button className="text-xs font-bold text-zinc-500 hover:text-black transition-colors mr-4">编辑</button>
            <button className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">删除</button>
          </div>
        </div>
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
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">策略名称</label>
                <input 
                  type="text" 
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder="例如：特定商家包袋加价" 
                  className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none" 
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <MultiSelectDropdown 
                  label="适用商家 (留空则适用全部)" 
                  options={merchants} 
                  selected={selectedMerchants} 
                  onChange={setSelectedMerchants} 
                  placeholder="全部商家" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryMultiSelectDropdown 
                  label="适用分类 (留空则适用全部)" 
                  options={CATEGORY_HIERARCHY} 
                  selected={selectedCategories} 
                  onChange={setSelectedCategories} 
                  placeholder="全部分类" 
                />
                <MultiSelectDropdown 
                  label="适用品牌 (留空则适用全部)" 
                  options={ALL_BRANDS} 
                  selected={selectedBrands} 
                  onChange={setSelectedBrands} 
                  placeholder="全部品牌" 
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
