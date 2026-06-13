import { Package, Store, Share2, Settings, FileText, ChevronDown, ChevronRight, ShoppingBag, ReceiptText, Building2, Wallet } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['self_operated', 'distribution', 'manifest', 'infrastructure']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const menuGroups = [
    {
      id: 'self_operated',
      label: '自营业务管理',
      icon: Package,
      items: [
        { id: 'self_product', label: '商品管理' },
        { id: 'offer_to_marketplace', label: '出价到集市' },
        { id: 'self_order', label: '自营订单' },
      ]
    },
    {
      id: 'distribution',
      label: '分销业务管理',
      icon: Share2,
      items: [
        { id: 'markup_strategy', label: '配置加价策略' },
        { id: 'dist_mine', label: '我的选品' },
        { id: 'dist_order', label: '分销订单' },
      ]
    },
    {
      id: 'manifest',
      label: '货单业务管理',
      icon: FileText,
      items: [
        { id: 'manifest_campaign', label: '货单管理' },
        { id: 'manifest_order', label: '货单订单' },
        { id: 'manifest_confirmation', label: '确认单管理' },
      ]
    },
    {
      id: 'infrastructure',
      label: '基础设施',
      icon: Settings,
      items: [
        { id: 'warehouse', label: '仓库及运费' },
        { id: 'finance', label: '财务审核' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />
      )}
      
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 text-zinc-600 flex flex-col z-50 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 flex-shrink-0">
          <span className="text-lg font-black tracking-tighter uppercase text-black">商家管理后台</span>
        </div>
      
      <div className="p-6 border-b border-zinc-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80" alt="Service Provider" className="w-10 h-10 rounded-sm bg-zinc-100 object-cover grayscale border border-zinc-200" />
          <div>
            <div className="text-sm font-bold text-black leading-tight">极速云仓服务商</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">ID: SERVICE_HQ_7782</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-2 px-3">
        {menuGroups.map(group => (
          <div key={group.id} className="mb-2">
            <button 
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-zinc-600 hover:text-black transition-colors group"
            >
              <div className="flex items-center gap-3">
                <group.icon size={18} className="group-hover:text-black transition-colors" />
                <span className="text-sm font-bold">{group.label}</span>
              </div>
              {expandedGroups.includes(group.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {expandedGroups.includes(group.id) && (
              <div className="flex flex-col gap-1 mt-1 ml-7">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                      activeTab === item.id 
                        ? 'bg-zinc-100 text-black' 
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
    </>
  );
}
