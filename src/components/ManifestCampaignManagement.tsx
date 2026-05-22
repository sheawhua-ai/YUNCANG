import { useState } from 'react';
import { Search, Plus, ChevronRight, X, Upload, Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const INITIAL_CAMPAIGNS = [
  {
    id: 'M-092-2024',
    name: '2024 秋季高奢皮具专场: LVMH 联名系列全球分发计划',
    warehouse: '欧洲仓 (MILAN CENTER)',
    currentItems: 1248,
    totalItems: 1400,
    remainingTime: '12 小时',
    deadline: '2024-11-20',
    status: 'active'
  },
  {
    id: 'M-093-2024',
    name: '瑞士钟表: 限量典藏系列 (Geneva Heritage) 二期入库审核',
    warehouse: '亚洲仓 (HONG KONG HUB)',
    currentItems: 225,
    totalItems: 500,
    remainingTime: '3天 8小时',
    deadline: '2024-11-23',
    status: 'active'
  }
];

const CAMPAIGN_DETAILS = {
  id: '3939948219939',
  name: '秋季系列合并采购单',
  status: '活动中',
  orderedValue: 2480000,
  orderedItems: 918,
  totalItems: 1240,
  remainingTime: '12 小时',
  deadline: '10月24日, 18:00',
  products: [
    {
      id: 'p1',
      name: 'MARGIELA GLAM SLAM MINI',
      spu: 'S56WG0108PR818',
      price: 9450.00,
      orderedStock: 124,
      remainingStock: 88,
      skus: [
        { id: 's1', name: '黑色 / 纳帕皮 / Mini', sku: 'T8013-BLK-MN', orderedStock: 82, remainingStock: 42, price: 9450.00 },
        { id: 's2', name: '白色 / 亮面 / Mini', sku: 'T1003-WHT-MN', orderedStock: 42, remainingStock: 42, price: 9450.00 }
      ]
    },
    {
      id: 'p2',
      name: 'AESTHETIQUE CHRONO NOIR',
      spu: 'AC-202-B',
      price: 34200.00,
      orderedStock: 18,
      remainingStock: 0,
      skus: []
    }
  ]
};

export function ManifestCampaignManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [expandedProducts, setExpandedProducts] = useState<string[]>(['p1']);
  const [campaignDetails, setCampaignDetails] = useState(CAMPAIGN_DETAILS);

  const handleSkuStockChange = (productId: string, skuId: string, newStock: number) => {
    setCampaignDetails(prev => {
      const newProducts = prev.products.map(p => {
        if (p.id === productId) {
          const newSkus = p.skus.map(s => s.id === skuId ? { ...s, remainingStock: newStock } : s);
          const totalRemaining = newSkus.reduce((sum, s) => sum + s.remainingStock, 0);
          return { ...p, skus: newSkus, remainingStock: totalRemaining };
        }
        return p;
      });
      return { ...prev, products: newProducts };
    });
  };

  const handleProductStockChange = (productId: string, newStock: number) => {
    setCampaignDetails(prev => {
      const newProducts = prev.products.map(p => {
        if (p.id === productId) {
          return { ...p, remainingStock: newStock };
        }
        return p;
      });
      return { ...prev, products: newProducts };
    });
  };

  const handleProductPriceChange = (productId: string, newPrice: number) => {
    setCampaignDetails(prev => {
      const newProducts = prev.products.map(p => {
        if (p.id === productId) {
          return { ...p, price: newPrice };
        }
        return p;
      });
      return { ...prev, products: newProducts };
    });
  };

  const handleSkuPriceChange = (productId: string, skuId: string, newPrice: number) => {
    setCampaignDetails(prev => {
      const newProducts = prev.products.map(p => {
        if (p.id === productId) {
          const newSkus = p.skus.map(s => s.id === skuId ? { ...s, price: newPrice } : s);
          return { ...p, skus: newSkus };
        }
        return p;
      });
      return { ...prev, products: newProducts };
    });
  };

  const handleSaveAndReturn = () => {
    // In a real app, you would save the campaignDetails to the backend here
    setSelectedCampaignId(null);
  };

  const [campaignName, setCampaignName] = useState('2024 秋季高奢皮具专场: LVMH 联名系列全球分发计划');
  const [selectionMode, setSelectionMode] = useState<'upload' | 'manual'>('upload');
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [manualCategory, setManualCategory] = useState('all');
  const [manualBrand, setManualBrand] = useState('all');

  const [matchedItems, setMatchedItems] = useState([
    {
      id: 'i1',
      brand: 'Rolex',
      name: 'Submariner Date',
      code: 'RLX-126610-LN',
      category: '手表 / 专业款',
      originalPrice: '€ 8,200.00',
      price: 67500.00,
      stock: 12,
      selected: true,
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=100&q=80',
      isTextPlaceholder: false
    },
    {
      id: 'i2',
      brand: 'Maison Margiela',
      name: 'GLAM SLAM MINI',
      code: 'S56WG0108PR818',
      category: '包袋 / 迷你包',
      originalPrice: '€ 1,200.00',
      price: 9450.00,
      stock: 124,
      selected: true,
      image: 'MAR',
      isTextPlaceholder: true
    }
  ]);

  const handleUpdateMatchedItem = (id: string, field: 'price' | 'stock', value: number) => {
    setMatchedItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleMatchedItemSelection = (id: string) => {
    setMatchedItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const toggleProduct = (id: string) => {
    setExpandedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  if (selectedCampaignId) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] pb-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-500">
            <button onClick={() => setSelectedCampaignId(null)} className="hover:text-black transition-colors">货单管理</button>
            <ChevronRight size={14} />
            <span className="text-black font-bold">货单详情</span>
          </div>
          <button 
            onClick={handleSaveAndReturn}
            className="bg-black text-white px-4 md:px-6 py-2 text-xs md:text-sm font-bold hover:bg-zinc-800 transition-colors"
          >
            保存并返回
          </button>
        </div>

        <div className="bg-white border border-zinc-200 shadow-sm p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter leading-tight">{campaignDetails.name}</h1>
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider w-fit">
              {campaignDetails.status}
            </span>
          </div>
          <div className="text-xs md:text-sm text-zinc-500 mb-6 md:mb-8 font-mono">货单编号: {campaignDetails.id}</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">已下单货值</div>
              <div className="text-2xl md:text-3xl font-black">¥{campaignDetails.orderedValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">剩余时间</div>
              <div className="text-2xl md:text-3xl font-black text-red-600">{campaignDetails.remainingTime}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">截止日期</div>
              <div className="text-2xl md:text-3xl font-black">{campaignDetails.deadline}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <div className="col-span-6">商品名称 / 规格 SKU</div>
            <div className="col-span-2 text-right">单价</div>
            <div className="col-span-2 text-center">已下单库存</div>
            <div className="col-span-2 text-center">剩余库存</div>
          </div>

          {campaignDetails.products.map(product => (
            <div key={product.id} className="border-b border-zinc-200 last:border-0">
              <div 
                className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-zinc-50 transition-colors cursor-pointer"
                onClick={() => toggleProduct(product.id)}
              >
                <div className="col-span-6 flex items-center gap-4">
                  <div className="w-6 flex justify-center text-zinc-400">
                    {product.skus.length > 0 && (
                      expandedProducts.includes(product.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </div>
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xs">
                    {product.spu.substring(0, 3)}
                  </div>
                  <div>
                    <div className="font-black text-sm uppercase tracking-tight">{product.name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">SPU: {product.spu}</div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                  <span className="font-bold mr-1">¥</span>
                  <input 
                    type="number" 
                    value={product.price}
                    onChange={(e) => handleProductPriceChange(product.id, Number(e.target.value) || 0)}
                    className="w-24 border border-zinc-200 px-2 py-1 text-right font-bold focus:border-black outline-none bg-white/50"
                  />
                </div>
                <div className="col-span-2 text-center font-black text-lg">{product.orderedStock}</div>
                <div className="col-span-2 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  {product.skus.length > 0 ? (
                    <span className="font-black text-lg text-zinc-400">{product.remainingStock}</span>
                  ) : (
                    <input 
                      type="number" 
                      value={product.remainingStock} 
                      onChange={(e) => handleProductStockChange(product.id, parseInt(e.target.value) || 0)}
                      className="w-20 border border-zinc-200 px-2 py-1 text-center font-black text-lg text-black focus:border-black outline-none" 
                    />
                  )}
                </div>
              </div>

              {expandedProducts.includes(product.id) && product.skus.length > 0 && (
                <div className="bg-zinc-50/50 border-t border-zinc-100">
                  {product.skus.map(sku => (
                    <div key={sku.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-zinc-100 last:border-0">
                      <div className="col-span-6 pl-14">
                        <div className="font-bold text-xs">{sku.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">SKU: {sku.sku}</div>
                      </div>
                      <div className="col-span-2 flex items-center justify-end text-zinc-600">
                        <span className="font-bold mr-1 text-xs">¥</span>
                        <input 
                          type="number" 
                          value={sku.price}
                          onChange={(e) => handleSkuPriceChange(product.id, sku.id, Number(e.target.value) || 0)}
                          className="w-20 border border-zinc-200 bg-white px-2 py-1 text-right text-xs font-bold focus:border-black outline-none" 
                        />
                      </div>
                      <div className="col-span-2 text-center font-bold">{sku.orderedStock}</div>
                      <div className="col-span-2 flex items-center justify-center">
                        <input 
                          type="number" 
                          value={sku.remainingStock} 
                          onChange={(e) => handleSkuStockChange(product.id, sku.id, parseInt(e.target.value) || 0)}
                          className="w-20 border border-zinc-200 bg-white px-2 py-1 text-center text-xs font-bold focus:border-black outline-none" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">货单管理</h1>
          <p className="text-sm text-zinc-500">监管全球供应链核心节点。精确控制、实时同步。</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-black text-white px-6 py-3 text-sm font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          新增货单活动
        </button>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="w-64">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">所属仓库</label>
          <select className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white">
            <option value="all">全部仓库</option>
            <option value="europe">欧洲仓 (MILAN CENTER)</option>
            <option value="asia">亚洲仓 (HONG KONG HUB)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">活动状态</label>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('all')} className={`px-6 py-2 text-sm font-bold border transition-colors ${activeTab === 'all' ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}>全部</button>
            <button onClick={() => setActiveTab('active')} className={`px-6 py-2 text-sm font-bold border transition-colors ${activeTab === 'active' ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}>活动中</button>
            <button onClick={() => setActiveTab('pending')} className={`px-6 py-2 text-sm font-bold border transition-colors ${activeTab === 'pending' ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}>待开始</button>
            <button onClick={() => setActiveTab('ended')} className={`px-6 py-2 text-sm font-bold border transition-colors ${activeTab === 'ended' ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'}`}>已结束</button>
            <div className="ml-auto">
              <button 
                disabled={selectedCampaigns.length === 0}
                className={`px-6 py-2 text-sm font-bold flex items-center gap-2 transition-colors ${selectedCampaigns.length > 0 ? 'bg-black text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
              >
                <FileText size={16} />
                合并生成采购单
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div className="col-span-6 flex items-center gap-4">
            <input 
              type="checkbox" 
              className="accent-black" 
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCampaigns(INITIAL_CAMPAIGNS.map(c => c.id));
                } else {
                  setSelectedCampaigns([]);
                }
              }}
              checked={selectedCampaigns.length === INITIAL_CAMPAIGNS.length && INITIAL_CAMPAIGNS.length > 0}
            />
            <span>货单详情 (ID / 名称 / 仓库)</span>
          </div>
          <div className="col-span-4">进展情况</div>
          <div className="col-span-2 text-right">操作</div>
        </div>

        {INITIAL_CAMPAIGNS.map(campaign => (
          <div key={campaign.id} className="grid grid-cols-12 gap-4 px-6 py-6 border-b border-zinc-200 items-center hover:bg-zinc-50 transition-colors">
            <div className="col-span-6 flex items-start gap-4">
              <input 
                type="checkbox" 
                className="accent-black mt-1" 
                checked={selectedCampaigns.includes(campaign.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                  } else {
                    setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                  }
                }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-zinc-400 font-mono">{campaign.id}</span>
                  <CopyIcon />
                </div>
                <div className="text-base font-black tracking-tight mb-2">{campaign.name}</div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <WarehouseIcon />
                  {campaign.warehouse}
                </div>
              </div>
            </div>
            <div className="col-span-4 pr-8 flex flex-col justify-center">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-bold text-red-600">剩余: {campaign.remainingTime}</span>
                <span className="text-zinc-500">截止: {campaign.deadline}</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                已选 {campaign.currentItems} / 总计 {campaign.totalItems} 件
              </div>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button className="bg-black text-white px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors">生成采购单</button>
              <button className="bg-white border border-zinc-200 text-black px-4 py-2 text-xs font-bold hover:border-black transition-colors">提前结束</button>
              <button 
                onClick={() => setSelectedCampaignId(campaign.id)}
                className="w-8 h-8 border border-zinc-200 flex items-center justify-center hover:border-black transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Campaign Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white w-[1000px] max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
              <h2 className="text-xl font-black uppercase tracking-tight">新增货单活动</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-8">
                {/* 1. Campaign Name & Cover Image */}
                <div className="flex gap-8">
                  <div className="w-48 flex-shrink-0">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">封面图 (5:4)</label>
                    <div className="w-full aspect-[5/4] border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 hover:border-black hover:text-black transition-colors cursor-pointer">
                      <Upload size={20} className="mb-2" />
                      <span className="text-[10px] font-bold">上传封面</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">货单活动名称</label>
                    <input 
                      type="text" 
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full border border-zinc-200 px-4 py-3 text-lg font-bold focus:border-black focus:ring-0 outline-none bg-white"
                    />
                  </div>
                </div>

                {/* 2. Global Rules & Limits */}
                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-12">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">全局定价规则与业务限制</label>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">汇率转化 (欧元汇率)</div>
                        <div className="relative">
                          <input type="text" defaultValue="7.85" className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">固定</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">批量加价</div>
                        <input type="text" defaultValue="+ 5.00%" className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">交货方式</div>
                        <input type="text" defaultValue="香港交货" className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">预付定金 (%)</div>
                        <input type="text" defaultValue="30" className="w-full border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">起订金额</div>
                        <input type="text" defaultValue="¥ 100,000" className="w-full border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">最小起订量</div>
                        <input type="text" defaultValue="20" className="w-full border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">开始日期</div>
                        <input type="text" placeholder="yyyy / mm / dd" className="w-full border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 mb-2">截止日期</div>
                        <input type="text" placeholder="yyyy / mm / dd" className="w-full border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm focus:border-black focus:ring-0 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Warehouse & Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">供货仓库与商品选择</label>
                  <div className="w-64 mb-6">
                    <select className="w-full border border-zinc-200 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none bg-zinc-50">
                      <option value="milan">米兰总仓</option>
                      <option value="paris">巴黎分仓</option>
                    </select>
                  </div>

                  <div className="flex border-b border-zinc-200 mb-6">
                    <button 
                      onClick={() => setSelectionMode('upload')}
                      className={`flex-1 pb-3 text-sm font-bold transition-colors ${selectionMode === 'upload' ? 'border-b-2 border-black text-black' : 'text-zinc-400 hover:text-black'}`}
                    >
                      上传货单文件
                    </button>
                    <button 
                      onClick={() => setSelectionMode('manual')}
                      className={`flex-1 pb-3 text-sm font-bold transition-colors ${selectionMode === 'manual' ? 'border-b-2 border-black text-black' : 'text-zinc-400 hover:text-black'}`}
                    >
                      手动选品
                    </button>
                  </div>

                  {selectionMode === 'upload' ? (
                    <div>
                      <div className="border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 flex flex-col items-center justify-center text-center mb-4 hover:border-black transition-colors cursor-pointer">
                        <Upload size={32} className="text-zinc-400 mb-4" />
                        <div className="text-sm font-bold mb-1">点击或拖拽 CSV / Excel</div>
                        <div className="text-[10px] text-zinc-500">系统将自动识别货号和库存</div>
                      </div>

                      <div className="bg-black text-white p-4 flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <FileText size={14} />
                          Q4_PRE_ORDER_LIST.CSV
                        </div>
                        <button className="text-zinc-400 hover:text-white transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                          <input 
                            type="text" 
                            placeholder="输入货号搜索，多个货号请用逗号隔开..." 
                            value={manualSearchQuery}
                            onChange={(e) => setManualSearchQuery(e.target.value)}
                            className="w-full border border-zinc-200 pl-10 pr-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white" 
                          />
                        </div>
                        <select 
                          className="border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white w-48"
                          value={manualCategory}
                          onChange={(e) => setManualCategory(e.target.value)}
                        >
                          <option value="all">全部分类</option>
                          <option value="bags">包袋</option>
                          <option value="watches">腕表</option>
                        </select>
                        <select 
                          className="border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none bg-white w-48"
                          value={manualBrand}
                          onChange={(e) => setManualBrand(e.target.value)}
                        >
                          <option value="all">全部品牌</option>
                          <option value="rolex">Rolex</option>
                          <option value="margiela">Maison Margiela</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Results Table */}
                <div className="mt-8">
                  <div className="flex justify-between items-end mb-4">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {selectionMode === 'upload' ? '解析结果与智能匹配' : '商品列表'}
                    </label>
                    <div className="text-xs font-bold">已匹配/选择: 18 <span className="text-zinc-400 ml-2">新增: 4</span></div>
                  </div>
                  
                  <div className="border border-zinc-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <tr>
                          <th className="p-4 w-10"><input type="checkbox" className="accent-black" /></th>
                          <th className="p-4">状态</th>
                          <th className="p-4">预览</th>
                          <th className="p-4">品牌</th>
                          <th className="p-4">名称/编号</th>
                          <th className="p-4">分类</th>
                          <th className="p-4 text-right">原价</th>
                          <th className="p-4 text-right">活动价</th>
                          <th className="p-4 text-center">库存</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {matchedItems.map(item => (
                          <tr key={item.id} className="hover:bg-zinc-50">
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                className="accent-black" 
                                checked={item.selected} 
                                onChange={() => toggleMatchedItemSelection(item.id)}
                              />
                            </td>
                            <td className="p-4">
                              <span className="bg-black text-white text-[10px] font-bold px-2 py-1">已匹配</span>
                            </td>
                            <td className="p-4">
                              {item.isTextPlaceholder ? (
                                <div className="w-10 h-10 bg-zinc-100 p-1 flex items-center justify-center font-bold text-white bg-black">
                                  {item.image}
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-zinc-100 p-1">
                                  <img src={item.image} className="w-full h-full object-contain mix-blend-multiply grayscale" />
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-bold">{item.brand}</td>
                            <td className="p-4">
                              <div className="font-bold text-xs">{item.name}</div>
                              <div className="text-[10px] text-zinc-400">{item.code}</div>
                            </td>
                            <td className="p-4 text-xs text-zinc-500">{item.category}</td>
                            <td className="p-4 text-right font-mono text-xs text-zinc-500">{item.originalPrice}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1 font-mono font-bold">
                                <span>¥</span>
                                <input 
                                  type="number" 
                                  value={item.price} 
                                  onChange={(e) => handleUpdateMatchedItem(item.id, 'price', Number(e.target.value) || 0)}
                                  className="w-24 border border-zinc-200 px-2 py-1 focus:border-black outline-none text-right placeholder-zinc-300"
                                />
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <input 
                                type="number" 
                                value={item.stock} 
                                onChange={(e) => handleUpdateMatchedItem(item.id, 'stock', Number(e.target.value) || 0)}
                                className="w-20 border border-zinc-200 px-2 py-1 focus:border-black outline-none text-center"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                草稿保存于 14:22
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="bg-white border border-zinc-200 text-black px-8 py-3 text-xs font-bold hover:border-black transition-colors">暂存草稿</button>
                <button onClick={() => setIsAddModalOpen(false)} className="bg-black text-white px-8 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors">保存并发布</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V9l9-5 9 5v12"></path>
      <path d="M9 21v-9h6v9"></path>
    </svg>
  );
}
