import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Search, Image as ImageIcon, Upload, History, FileText, Trash2 } from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { BatchApplyCommonProductModal } from './BatchApplyCommonProductModal';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { CategoryMultiSelectDropdown } from './CategoryMultiSelectDropdown';
import { CATEGORY_HIERARCHY, ALL_BRANDS } from '../lib/constants';

export function ProductManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [editingSpu, setEditingSpu] = useState<string | null>(null);
  const [activeWarehouseTab, setActiveWarehouseTab] = useState<'domestic' | 'overseas'>('domestic');
  const [activeListTab, setActiveListTab] = useState<'on_sale' | 'offline' | 'sold_out' | 'pending_mapping'>('on_sale');
  const [isBatchApplyModalOpen, setIsBatchApplyModalOpen] = useState(false);

  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterWarehouses, setFilterWarehouses] = useState<string[]>([]);
  const [filterMarketplaceStatus, setFilterMarketplaceStatus] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const allWarehouses = [
    { value: 'hk', label: '香港直邮仓' },
    { value: 'sz', label: '深圳保税仓' },
    { value: 'london', label: '伦敦海外仓' },
    { value: 'hz', label: '杭州国内仓' }
  ];

  const getCurrencySymbol = (warehouseName?: string) => {
    if (warehouseName?.includes('香港')) return 'HK$';
    if (warehouseName?.includes('欧') || warehouseName?.includes('Europe') || warehouseName?.includes('伦敦')) return '€';
    return '¥';
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-8 gap-4">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">商家管理面板</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">商品管理</h1>
          <p className="text-xs md:text-sm text-zinc-500">管理全球精品库存、规格及定价模式</p>
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-200 z-20 flex flex-wrap gap-2 md:static md:bg-transparent md:border-none md:p-0 md:flex-nowrap md:gap-3 items-center">
          <button 
            onClick={() => setIsLogOpen(true)}
            className="flex-1 md:flex-none justify-center bg-white border border-zinc-200 text-black px-4 md:px-6 py-3 flex items-center gap-2 font-bold hover:bg-zinc-50 transition-colors"
          >
            <History size={18} />
            <span className="hidden md:inline">操作记录</span>
          </button>
          <button 
            onClick={() => setIsBatchUploadOpen(true)}
            className="flex-1 md:flex-none justify-center bg-white border border-zinc-200 text-black px-4 md:px-6 py-3 flex items-center gap-2 font-bold hover:bg-zinc-50 transition-colors"
          >
            <Upload size={18} />
            <span className="hidden md:inline">批量新增</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto justify-center bg-black text-white px-4 md:px-6 py-3 flex items-center gap-2 font-bold hover:bg-zinc-800 transition-colors"
          >
            <Plus size={18} />
            新增商品
          </button>
        </div>
      </div>

      {/* Workflow Pipeline removed as per user request */}

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-8 border-b border-zinc-200 w-full md:max-w-2xl whitespace-nowrap">
            <button 
              onClick={() => setActiveListTab('on_sale')}
              className={`pb-3 text-xs font-bold transition-colors ${activeListTab === 'on_sale' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
            >
              出售中 / 待对标
            </button>
            <button 
              onClick={() => setActiveListTab('offline')}
              className={`pb-3 text-xs font-bold transition-colors ${activeListTab === 'offline' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
            >
              仓库中 / 已下架
            </button>
            <button 
              onClick={() => setActiveListTab('sold_out')}
              className={`pb-3 text-xs font-bold transition-colors ${activeListTab === 'sold_out' ? 'text-black border-b-2 border-black' : 'text-zinc-500 hover:text-black'}`}
            >
              已售罄
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-center bg-zinc-50 p-4 border border-zinc-200">
          <div className="w-full md:flex-1 flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2">
            <Search size={16} className="text-zinc-400 flex-shrink-0" />
            <input type="text" placeholder="搜索商品名称、货号..." className="w-full text-xs font-bold outline-none min-w-0" />
          </div>
          <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
            <div className="w-full md:w-32">
              <MultiSelectDropdown 
                options={ALL_BRANDS} 
                selected={filterBrands} 
                onChange={setFilterBrands} 
                placeholder="全部品牌" 
              />
            </div>
            <div className="w-full md:w-48">
              <CategoryMultiSelectDropdown 
                options={CATEGORY_HIERARCHY} 
                selected={filterCategories} 
                onChange={setFilterCategories} 
                placeholder="全部分类" 
              />
            </div>
            <div className="w-full md:w-32 col-span-2 md:col-span-1">
              <MultiSelectDropdown 
                options={allWarehouses} 
                selected={filterWarehouses} 
                onChange={setFilterWarehouses} 
                placeholder="全部仓库" 
              />
            </div>
            <div className="w-full md:w-32 col-span-2 md:col-span-1">
              <select 
                value={filterMarketplaceStatus}
                onChange={(e) => setFilterMarketplaceStatus(e.target.value)}
                className="w-full h-[36px] bg-white border border-zinc-200 px-3 text-xs font-bold outline-none"
              >
                <option value="all">集市状态: 全部</option>
                <option value="listed">已在集市在售</option>
                <option value="not_listed">未出价到集市</option>
                <option value="mapping">匹配处理中</option>
              </select>
            </div>
          </div>
          <button className="w-full md:w-auto bg-black text-white px-6 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors h-[36px]">
            查询
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm mt-4 p-4 border-b-0 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 border border-zinc-200">
          <input 
            type="checkbox" 
            className="accent-black w-4 h-4"
            checked={selectedProducts.length > 0}
            onChange={(e) => {
              if (e.target.checked) setSelectedProducts(['rolex', 'burberry', 'gucci', 'patek']);
              else setSelectedProducts([]);
            }}
          />
          <span className="text-[10px] font-bold">全选</span>
        </div>
        {activeListTab === 'pending_mapping' && (
          <button className="bg-black text-white px-4 py-2 text-[10px] font-bold hover:bg-zinc-800 transition-colors">
            批量申请新增公共库
          </button>
        )}
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest items-center">
          <div className="col-span-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              className="accent-black w-4 h-4 mr-2" 
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProducts(['rolex', 'burberry', 'gucci', 'patek']);
                } else {
                  setSelectedProducts([]);
                }
              }}
              checked={selectedProducts.length > 0}
            />
            商品信息 / SPU 名称
          </div>
          <div className="col-span-4 text-center">规格与仓库</div>
          <div className="col-span-2 text-center font-bold text-zinc-500 uppercase tracking-widest">集市状态</div>
          <div className="col-span-2 text-center">操作</div>
        </div>

        {activeListTab === 'on_sale' && (
          <>
            {/* Row 1 */}
            <div className="border-b border-zinc-200 group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 items-start md:items-center hover:bg-zinc-50 transition-colors">
                <div className="md:col-span-4 flex items-start md:items-center gap-4">
                  <input 
                    type="checkbox" 
                    className="accent-black w-4 h-4 mt-2 md:mt-0 shrink-0" 
                    checked={selectedProducts.includes('rolex')}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProducts([...selectedProducts, 'rolex']);
                      else setSelectedProducts(selectedProducts.filter(id => id !== 'rolex'));
                    }}
                  />
                  <div className="w-20 h-20 md:w-16 md:h-16 shrink-0 bg-zinc-100 flex items-center justify-center p-2">
                    <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80" alt="Rolex" className="w-full h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Rolex</div>
                    <div className="text-base font-black tracking-tight leading-none mb-2">Submariner Date</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-mono uppercase">RX-126610LN</span>
                      <span className="text-[10px] text-zinc-500">2 个 SKU 已上架</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex col-span-4 flex-col items-center justify-center gap-1">
                  <div className="text-xs font-bold">40mm, 41mm</div>
                  <div className="text-[10px] text-zinc-500">香港直邮仓</div>
                </div>

                <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                   <div className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm">已在集市在售</div>
                   <div className="text-[9px] text-zinc-400 mt-1 uppercase tracking-tighter tracking-widest font-bold">SPU 对标: 100%</div>
                </div>
                
                <div className="mt-2 md:mt-0 md:col-span-2 flex justify-end md:justify-center items-center gap-4 pt-4 md:pt-0 border-t border-zinc-100 md:border-none w-full md:w-auto">
                  <button className="text-xs font-bold text-zinc-600 hover:text-black transition-colors" onClick={() => setEditingSpu('rolex')}>详情</button>
                  <button className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">下架</button>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="border-b border-zinc-200 group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 items-start md:items-center hover:bg-zinc-50 transition-colors">
                <div className="md:col-span-4 flex items-start md:items-center gap-4">
                  <input 
                    type="checkbox" 
                    className="accent-black w-4 h-4 mt-2 md:mt-0 shrink-0" 
                    checked={selectedProducts.includes('burberry')}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProducts([...selectedProducts, 'burberry']);
                      else setSelectedProducts(selectedProducts.filter(id => id !== 'burberry'));
                    }}
                  />
                  <div className="w-20 h-20 md:w-16 md:h-16 shrink-0 bg-zinc-100 flex items-center justify-center p-2">
                    <img src="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=200&q=80" alt="Burberry" className="w-full h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Burberry</div>
                    <div className="text-base font-black tracking-tight leading-none mb-2">经典格纹纯棉衬衫</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-mono uppercase">BB-SHIRT-CHK</span>
                      <span className="text-[10px] text-zinc-500">4 个 SKU 已上架</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex col-span-4 flex-col items-center justify-center gap-1">
                  <div className="text-xs font-bold">S码, M码, L码</div>
                  <div className="text-[10px] text-zinc-500">深圳保税仓, 杭州国内仓</div>
                </div>

                <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                   <div className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-sm">未出价</div>
                   <div className="text-[9px] text-orange-500 mt-1 uppercase tracking-tighter tracking-widest font-bold">SPU 对标: 92%</div>
                </div>
                
                <div className="mt-2 md:mt-0 md:col-span-2 flex justify-end md:justify-center items-center gap-4 pt-4 md:pt-0 border-t border-zinc-100 md:border-none w-full md:w-auto">
                  <button className="text-xs font-bold text-zinc-600 hover:text-black transition-colors" onClick={() => setEditingSpu('burberry')}>详情</button>
                  <button className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">下架</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeListTab === 'pending_mapping' && (
          <div className="border-b border-zinc-200 p-12 flex flex-col items-center justify-center text-center bg-zinc-50/50">
            <div className="w-16 h-16 bg-white border border-zinc-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Search size={24} className="text-zinc-300" />
            </div>
            <h3 className="text-sm font-bold mb-2">暂无待补录商品</h3>
            <p className="text-xs text-zinc-400 max-w-sm mb-6">所有自营商品已完成公共库对标，或已在补录审核流程中。</p>
            <button className="bg-black text-white px-6 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors">
              手动触发资产扫描
            </button>
          </div>
        )}
        {(activeListTab === 'offline') && (
          <div className="border-b border-zinc-200 group">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 items-start md:items-center hover:bg-zinc-50 transition-colors">
              <div className="md:col-span-4 flex items-start md:items-center gap-4">
                <input 
                  type="checkbox" 
                  className="accent-black w-4 h-4 mt-2 md:mt-0 shrink-0" 
                  checked={selectedProducts.includes('gucci')}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedProducts([...selectedProducts, 'gucci']);
                    else setSelectedProducts(selectedProducts.filter(id => id !== 'gucci'));
                  }}
                />
                <div className="w-20 h-20 md:w-16 md:h-16 shrink-0 bg-zinc-100 flex items-center justify-center p-2 text-zinc-300">
                  <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=200&q=80" alt="Gucci" className="w-full h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Gucci</div>
                  <div className="text-base font-black tracking-tight leading-none mb-2">Ophidia GG 小号托特包</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-mono uppercase">GC-547551</span>
                    <span className="text-[10px] text-orange-500 font-medium bg-orange-50 px-1 rounded-sm">未映射公共库</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex col-span-4 flex-col items-center justify-center gap-1">
                <div className="text-xs font-bold">均码</div>
                <div className="text-[10px] text-zinc-500">香港直邮仓</div>
              </div>

              <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                 <div className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-sm uppercase">待新增公共库</div>
              </div>
              
              <div className="mt-2 md:mt-0 md:col-span-2 flex justify-end md:justify-center items-center gap-4 pt-4 md:pt-0 border-t border-zinc-100 md:border-none w-full md:w-auto">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors" onClick={() => setIsBatchApplyModalOpen(true)}>申请映射</button>
                <button className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">删除</button>
              </div>
            </div>
          </div>
        )}

        {activeListTab === 'offline' && (
          <div className="group opacity-75">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 md:py-6 items-start md:items-center hover:bg-zinc-50 transition-colors text-zinc-500">
              <div className="md:col-span-4 flex items-start md:items-center gap-4">
                <input 
                  type="checkbox" 
                  className="accent-black w-4 h-4 mt-2 md:mt-0 shrink-0" 
                  checked={selectedProducts.includes('patek')}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedProducts([...selectedProducts, 'patek']);
                    else setSelectedProducts(selectedProducts.filter(id => id !== 'patek'));
                  }}
                />
                <div className="w-20 h-20 md:w-16 md:h-16 shrink-0 bg-zinc-100 flex items-center justify-center p-2 opacity-50">
                  <img src="https://images.unsplash.com/photo-1548171915-e76a3a41117b?auto=format&fit=crop&w=200&q=80" alt="Patek" className="w-full h-full object-contain mix-blend-multiply grayscale transition-all" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Patek Philippe</div>
                  <div className="text-base font-black tracking-tight leading-none mb-2 text-zinc-400">Nautilus 5711/1A</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-zinc-300 text-zinc-600 text-[9px] px-1.5 py-0.5 font-mono uppercase">PP-5711-BLU</span>
                    <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1 rounded-sm">已下架</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex col-span-4 flex-col items-center justify-center gap-1 opacity-50">
                <div className="text-xs font-bold">均码</div>
                <div className="text-[10px] text-zinc-400">欧洲仓 (EU)</div>
              </div>

              <div className="hidden md:flex col-span-2 flex-col items-center justify-center opacity-50">
                 <div className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-sm">离线</div>
              </div>

              <div className="mt-2 md:mt-0 md:col-span-2 flex justify-end md:justify-center items-center gap-4 pt-4 md:pt-0 border-t border-zinc-100 md:border-none w-full md:w-auto">
                <button className="text-xs font-bold text-zinc-600 hover:text-black transition-colors" onClick={() => setEditingSpu('patek')}>详情</button>
                <button className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">删除</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">显示 1-10 条记录，共 1,284 个商品</div>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center border border-zinc-200 bg-white text-zinc-400 hover:text-black hover:border-black transition-colors"><ChevronLeft size={16} /></button>
          <button className="w-8 h-8 flex items-center justify-center bg-black text-white text-xs font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center border border-zinc-200 bg-white text-zinc-600 hover:border-black transition-colors text-xs font-bold">2</button>
          <button className="w-8 h-8 flex items-center justify-center border border-zinc-200 bg-white text-zinc-600 hover:border-black transition-colors text-xs font-bold">3</button>
          <button className="w-8 h-8 flex items-center justify-center border border-zinc-200 bg-white text-zinc-400 hover:text-black hover:border-black transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Batch Upload Modal */}
      {isBatchUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsBatchUploadOpen(false)}></div>
          <div className="relative bg-white w-[600px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
              <h2 className="text-xl font-black uppercase tracking-tight">批量新增商品</h2>
              <button onClick={() => setIsBatchUploadOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">目标仓库 (必选)</label>
                <select className="w-full border border-zinc-200 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none bg-zinc-50">
                  <option value="">请选择仓库...</option>
                  <option value="hk">香港直邮仓</option>
                  <option value="sz">深圳保税仓</option>
                  <option value="london">伦敦海外仓</option>
                  <option value="hz">杭州国内仓</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 flex flex-col items-center justify-center text-center mb-4 hover:border-black transition-colors cursor-pointer">
                <Upload size={32} className="text-zinc-400 mb-4" />
                <div className="text-sm font-bold mb-1">点击或拖拽 CSV / Excel</div>
                <div className="text-[10px] text-zinc-500">请先下载模板，按格式填写后上传</div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button className="text-xs font-bold text-black border-b border-black pb-0.5 hover:text-zinc-600 hover:border-zinc-600 transition-colors">下载导入模板</button>
                <button onClick={() => setIsBatchUploadOpen(false)} className="bg-black text-white px-8 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors">确认上传</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operation Log Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLogOpen(false)}></div>
          <div className="relative w-[600px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
              <h2 className="text-xl font-black uppercase tracking-tight">操作记录</h2>
              <button onClick={() => setIsLogOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-6">
                <div className="border-l-2 border-black pl-4 pb-6 relative">
                  <div className="absolute w-2.5 h-2.5 bg-black rounded-full -left-[6px] top-1"></div>
                  <div className="text-xs text-zinc-400 font-mono mb-1">2024-10-24 14:30:22</div>
                  <div className="text-sm font-bold mb-1">批量新增商品</div>
                  <div className="text-xs text-zinc-600">操作人: Admin</div>
                  <div className="text-xs text-zinc-600 mt-1">目标仓库: <span className="font-bold">香港直邮仓</span></div>
                  <div className="text-xs text-zinc-600 mt-1">结果: 成功导入 128 条记录</div>
                </div>
                
                <div className="border-l-2 border-zinc-200 pl-4 pb-6 relative">
                  <div className="absolute w-2.5 h-2.5 bg-zinc-200 rounded-full -left-[6px] top-1"></div>
                  <div className="text-xs text-zinc-400 font-mono mb-1">2024-10-23 09:15:00</div>
                  <div className="text-sm font-bold mb-1">修改商品库存</div>
                  <div className="text-xs text-zinc-600">操作人: System</div>
                  <div className="text-xs text-zinc-600 mt-1">目标仓库: <span className="font-bold">深圳保税仓</span></div>
                  <div className="text-xs text-zinc-600 mt-1">详情: SPU [BB-SHIRT-CHK] 扣减库存 5 件</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit SPU Drawer */}
      {editingSpu && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingSpu(null)}></div>
          <div className="relative w-[1100px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-1">编辑商品详情</h2>
                <div className="text-xs text-zinc-500 font-mono">SPU: BB-SHIRT-CHK</div>
              </div>
              <button onClick={() => setEditingSpu(null)} className="text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* SPU Info Section */}
              <div className="p-8 border-b border-zinc-100 bg-white">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6">SPU 基础信息</h3>
                
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">商品主图 (多图)</label>
                    <div className="flex gap-2">
                      <div className="w-20 h-20 bg-zinc-100 border border-zinc-200 flex items-center justify-center relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold">更换</div>
                      </div>
                      <div className="w-20 h-20 bg-zinc-100 border border-zinc-200 flex items-center justify-center relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold">更换</div>
                      </div>
                      <div className="w-20 h-20 bg-zinc-50 border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 hover:text-black hover:border-black cursor-pointer transition-colors">
                        <Plus size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">品牌</label>
                    <input type="text" defaultValue="Burberry" className="w-full border border-zinc-200 px-3 py-2 text-sm font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">分类</label>
                    <input type="text" defaultValue="服饰 / 衬衫" className="w-full border border-zinc-200 px-3 py-2 text-sm font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">商品名称</label>
                    <input type="text" defaultValue="经典格纹纯棉衬衫" className="w-full border border-zinc-200 px-3 py-2 text-sm font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">货号</label>
                    <input type="text" defaultValue="BB-SHIRT-CHK" disabled className="w-full border border-zinc-200 px-3 py-2 text-sm font-bold bg-zinc-50 text-zinc-500 focus:outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">大陆建议零售价 (¥)</label>
                    <div className="flex items-center border border-zinc-200 bg-blue-50/30 px-3 py-2">
                       <span className="text-xs font-bold mr-1">¥</span>
                       <input type="number" defaultValue={5900} className="w-full text-sm font-bold bg-transparent focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">香港建议零售价 (HK$)</label>
                    <div className="flex items-center border border-zinc-200 bg-orange-50/30 px-3 py-2">
                       <span className="text-xs font-bold mr-1">HK$</span>
                       <input type="number" defaultValue={6400} className="w-full text-sm font-bold bg-transparent focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">SPU 颜色</label>
                    <input type="text" defaultValue="经典卡其色" className="w-full border border-zinc-200 px-3 py-2 text-sm font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">品牌公价 (参考)</label>
                    <input type="text" defaultValue="EUR 750" className="w-full border border-zinc-200 px-3 py-2 text-sm font-bold bg-zinc-50 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* SKU Info Section */}
              <div className="p-8 bg-zinc-50/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black uppercase tracking-widest">SKU 规格与库存</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveWarehouseTab('domestic')}
                      className={`text-xs font-bold pb-1 transition-colors ${activeWarehouseTab === 'domestic' ? 'text-black border-b-2 border-black' : 'text-zinc-400 hover:text-black'}`}
                    >
                      境内仓
                    </button>
                    <button 
                      onClick={() => setActiveWarehouseTab('overseas')}
                      className={`text-xs font-bold pb-1 transition-colors ${activeWarehouseTab === 'overseas' ? 'text-black border-b-2 border-black' : 'text-zinc-400 hover:text-black'}`}
                    >
                      境外仓
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-4 mb-4 flex items-end gap-4 shadow-sm">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">批量修改零售价</label>
                    <input type="number" placeholder="输入金额" className="w-full border border-zinc-200 px-3 py-2 text-xs font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">批量修改零售库存</label>
                    <input type="number" placeholder="输入数量" className="w-full border border-zinc-200 px-3 py-2 text-xs font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">批量修改供货价</label>
                    <input type="number" placeholder="输入金额" className="w-full border border-zinc-200 px-3 py-2 text-xs font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">批量修改供货库存</label>
                    <input type="number" placeholder="输入数量" className="w-full border border-zinc-200 px-3 py-2 text-xs font-bold focus:border-black focus:ring-0 outline-none" />
                  </div>
                  <button className="bg-black text-white px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors h-[34px]">应用批量修改</button>
                </div>

                <div className="bg-white border border-zinc-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          <th className="p-4 font-bold">规格 (尺码)</th>
                          <th className="p-4 font-bold">所在仓库</th>
                          <th className="p-4 font-bold">条码 (Barcode)</th>
                          <th className="p-4 font-bold text-right bg-blue-50/30">大陆零售价 (CNY)</th>
                          <th className="p-4 font-bold text-right bg-orange-50/30">香港零售价 (HKD)</th>
                          <th className="p-4 font-bold text-right">零售库存</th>
                          <th className="p-4 font-bold text-right">供货价</th>
                          <th className="p-4 font-bold text-right">供货库存</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                      {activeWarehouseTab === 'domestic' ? (
                        <>
                          {/* SKU 1 - Shenzhen */}
                          <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="p-4 font-bold text-zinc-800">S码</td>
                            <td className="p-4"><span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">深圳保税仓</span></td>
                            <td className="p-4"><input type="text" defaultValue="5045621098711" className="w-full border border-zinc-200 px-2 py-1.5 text-xs font-mono focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={3500} className="w-24 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={3800} className="w-24 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={8} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={3100} className="w-24 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={5} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none text-blue-600" /></td>
                          </tr>
                          {/* SKU 2 - Shenzhen */}
                          <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="p-4 font-bold text-zinc-800">M码</td>
                            <td className="p-4"><span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">深圳保税仓</span></td>
                            <td className="p-4"><input type="text" defaultValue="5045621098712" className="w-full border border-zinc-200 px-2 py-1.5 text-xs font-mono focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={3500} className="w-24 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={3800} className="w-24 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={12} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={3100} className="w-24 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4"><input type="number" defaultValue={10} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none text-blue-600" /></td>
                          </tr>
                          {/* SKU 3 - Hangzhou */}
                          <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="p-4 font-bold text-zinc-800">L码</td>
                            <td className="p-4"><span className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">杭州国内仓</span></td>
                            <td className="p-4"><input type="text" defaultValue="5045621098736" className="w-full border border-zinc-200 px-2 py-1.5 text-xs font-mono focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4">
                              <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28 ml-auto">
                                <span className="text-xs text-zinc-400 mr-1">¥</span>
                                <input type="number" defaultValue={3600} className="w-full text-xs font-bold outline-none text-right" />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center border border-zinc-200 bg-zinc-50 px-2 py-1.5 w-28 ml-auto">
                                <span className="text-xs text-zinc-400 mr-1">HK$</span>
                                <input type="number" defaultValue={3900} className="w-full text-xs font-bold outline-none text-right" />
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={0} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none text-red-500" /></td>
                            <td className="p-4">
                              <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28 ml-auto">
                                <span className="text-xs text-zinc-400 mr-1">¥</span>
                                <input type="number" defaultValue={3200} className="w-full text-xs font-bold outline-none text-right" />
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={0} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none text-red-500" /></td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {/* SKU 1 - HK */}
                          <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="p-4 font-bold text-zinc-800">S码</td>
                            <td className="p-4"><span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">香港直邮仓</span></td>
                            <td className="p-4"><input type="text" defaultValue="5045621098711" className="w-full border border-zinc-200 px-2 py-1.5 text-xs font-mono focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">¥</span>
                                  <input type="number" defaultValue={3200} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">HK$</span>
                                  <input type="number" defaultValue={3450} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={25} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">HK$</span>
                                  <input type="number" defaultValue={3000} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                                <div className="text-[10px] text-zinc-400 mt-1">约 ¥2,800</div>
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={15} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none text-blue-600" /></td>
                          </tr>
                          {/* SKU 2 - HK */}
                          <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="p-4 font-bold text-zinc-800">M码</td>
                            <td className="p-4"><span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">香港直邮仓</span></td>
                            <td className="p-4"><input type="text" defaultValue="5045621098712" className="w-full border border-zinc-200 px-2 py-1.5 text-xs font-mono focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">¥</span>
                                  <input type="number" defaultValue={3200} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">HK$</span>
                                  <input type="number" defaultValue={3450} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={45} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">HK$</span>
                                  <input type="number" defaultValue={3000} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                                <div className="text-[10px] text-zinc-400 mt-1">约 ¥2,800</div>
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={30} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none text-blue-600" /></td>
                          </tr>
                          {/* SKU 3 - London */}
                          <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="p-4 font-bold text-zinc-800">L码</td>
                            <td className="p-4"><span className="bg-purple-50 text-purple-600 border border-purple-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">伦敦海外仓</span></td>
                            <td className="p-4"><input type="text" defaultValue="5045621098736" className="w-full border border-zinc-200 px-2 py-1.5 text-xs font-mono focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">¥</span>
                                  <input type="number" defaultValue={2900} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">HK$</span>
                                  <input type="number" defaultValue={3100} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={80} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none" /></td>
                            <td className="p-4">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center border border-zinc-200 bg-white px-2 py-1.5 w-28">
                                  <span className="text-xs text-zinc-400 mr-1">HK$</span>
                                  <input type="number" defaultValue={2700} className="w-full text-xs font-bold outline-none text-right" />
                                </div>
                                <div className="text-[10px] text-zinc-400 mt-1">约 ¥2,500</div>
                              </div>
                            </td>
                            <td className="p-4"><input type="number" defaultValue={50} className="w-20 ml-auto border border-zinc-200 px-2 py-1.5 text-xs font-bold text-right focus:border-black focus:ring-0 outline-none text-blue-600" /></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-zinc-200 bg-white flex justify-between items-center">
              <div className="text-xs text-zinc-500 italic">* 库存设置为 0 即自动下架该仓库的对应规格</div>
              <div className="flex gap-3">
                <button onClick={() => setEditingSpu(null)} className="px-6 py-3 text-xs font-bold text-zinc-600 hover:text-black transition-colors">取消</button>
                <button onClick={() => setEditingSpu(null)} className="bg-black text-white px-8 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors">保存更改</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isBatchApplyModalOpen && (
        <BatchApplyCommonProductModal 
          isOpen={isBatchApplyModalOpen}
          onClose={() => setIsBatchApplyModalOpen(false)}
          selectedIds={selectedProducts}
          onSuccess={() => {
            setIsBatchApplyModalOpen(false);
            setSelectedProducts([]);
          }}
        />
      )}
    </div>
  );
}
