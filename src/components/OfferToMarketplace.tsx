import { useState } from "react";
import { Check } from "lucide-react";

interface OfferToMarketplaceProps {
  setActiveTab?: (tab: string) => void;
}

export function OfferToMarketplace({ setActiveTab }: OfferToMarketplaceProps) {
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [incrementalCount, setIncrementalCount] = useState(128);

  const handleIncrementalMatch = () => {
    setIsAutoMatching(true);
    setTimeout(() => {
      setIncrementalCount(0);
      setIsAutoMatching(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">商家管理面板</div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">出价到集市</h1>
          <p className="text-sm text-zinc-500">通过 AI 自动化将自有资产同步至全球集市</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white border border-zinc-200 text-black px-6 py-3 text-sm font-bold hover:bg-zinc-50 transition-colors uppercase tracking-tight">
            查看同步日志
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-zinc-900 text-white p-8 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">增量同步资产池</div>
            <div className="text-5xl font-black mb-2 tracking-tighter">{incrementalCount} <span className="text-xs text-zinc-500 uppercase font-bold">items detected</span></div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">系统已实时探测到仓库中存在新增资产。点击启动 AI 匹配引擎，系统将自动针对全球集市进行规格对标、库存同步及动态加价策略应用。</p>
          </div>
          <button 
            onClick={handleIncrementalMatch}
            className="w-full md:w-auto bg-white text-black px-12 py-4 text-sm font-black hover:bg-zinc-100 transition-all active:scale-95 shadow-lg shadow-white/5 uppercase tracking-widest shrink-0"
          >
            {isAutoMatching ? '正在执行 AI 对标与同步...' : '立即同步至集市'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm">
        <div className="p-4 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between bg-zinc-50 gap-4">
          <div>
            <h3 className="font-black text-lg">对标处理中心</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">匹配与出价工作台</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
            <select className="border border-zinc-200 px-4 py-2 text-xs font-bold focus:outline-none bg-white">
              <option>匹配状态: 全部待处理</option>
              <option>仅看 SPU 匹配 &gt; 85%</option>
              <option>待处理 SKU 差异</option>
            </select>
            <div className="flex w-full">
              <input 
                type="text" 
                placeholder="搜索商家货号/SPU名称" 
                className="border border-zinc-200 px-4 py-2 text-sm focus:outline-none w-full sm:w-64"
              />
              <button className="bg-black text-white px-6 py-2 text-sm font-bold hover:bg-zinc-800 transition-colors shrink-0">
                查询
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div className="col-span-4">商家商品信息</div>
          <div className="col-span-4">公共库对标 SPU</div>
          <div className="col-span-1 text-center">SPU 匹配度</div>
          <div className="col-span-2 text-center">系统检测结果</div>
          <div className="col-span-1 text-center">操作</div>
        </div>

        {/* Row 1: Perfect match */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 border-b border-zinc-200 items-start md:items-center hover:bg-zinc-50 transition-colors">
          <div className="flex md:col-span-4 gap-4 items-start md:items-center w-full">
            <div className="w-16 h-16 bg-zinc-100 p-1 shrink-0">
              <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div>
              <div className="text-sm font-bold mb-1 leading-tight">Rolex Submariner 126610LN</div>
              <div className="text-[10px] text-zinc-400">商家货号: RX-SUB-BLACK</div>
            </div>
          </div>
          <div className="flex md:col-span-4 gap-4 items-start md:items-center w-full border-t border-zinc-100 md:border-t-0 pt-4 md:pt-0">
            <div className="w-16 h-16 bg-zinc-100 p-1 shrink-0">
              <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div>
              <div className="text-sm font-bold mb-1 leading-tight">劳力士潜航者日历型 126610LN</div>
              <div className="text-[10px] text-zinc-400">公共货号: RX-126610LN</div>
            </div>
          </div>
          <div className="hidden md:block col-span-1 text-center font-bold text-green-600">100%</div>
          <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
            <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">已匹配</div>
            <div className="text-[9px] text-zinc-400 mt-1">属性完全对齐</div>
          </div>
          <div className="md:col-span-1 text-center flex justify-end md:block mt-2 md:mt-0 w-full md:w-auto">
            <div className="flex flex-col items-center">
              <button className="bg-black text-white px-4 py-2 text-[10px] font-bold hover:bg-zinc-800 transition-colors w-full md:w-auto">一键出价</button>
            </div>
          </div>
        </div>
      </div>

          </div>
  );
}
