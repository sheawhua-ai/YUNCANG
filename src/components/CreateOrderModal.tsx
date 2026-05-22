import { useState } from 'react';
import { Search, X, Plus, Trash2, Download, Upload, Wallet } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  itemNo: string; // 货号
  price: number;
  count: number;
  category: 'shoes' | 'clothes' | 'bags' | 'other';
  image: string;
}

export function CreateOrderModal({ isOpen, onClose, onFinish }: { isOpen: boolean; onClose: () => void; onFinish: (order: any) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string; address: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [shippingManual, setShippingManual] = useState<number | null>(null);

  // 运费模板按类目分
  const shippingTemplate = {
    shoes: 50,
    clothes: 30,
    bags: 80,
    other: 40
  };

  const calculateAutoShipping = () => {
    return cart.reduce((sum, item) => sum + (shippingTemplate[item.category] || 0) * item.count, 0);
  };

  const totalShipping = shippingManual !== null ? shippingManual : calculateAutoShipping();
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.count, 0);

  const searchCustomer = () => {
    if (customerPhone.length >= 11) {
      setCustomerInfo({
        name: '张三 (系统匹配已认证)',
        phone: customerPhone,
        address: '上海市浦东新区陆家嘴金融中心'
      });
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, { ...product, count: 1 }]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleFinish = () => {
    const newOrder = {
      id: `ADMIN-${Date.now()}`,
      customer: customerInfo,
      items: cart,
      totalAmount,
      totalShipping,
      depositAmount,
      status: 'pending_deposit',
      date: new Date().toISOString()
    };
    onFinish(newOrder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col rounded-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-100 bg-zinc-50">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">管理员后台代下单</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">PC Backend Admin Order Creation</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-black"><X size={24} /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Product Selection and Search */}
          <div className="flex-1 flex flex-col border-r border-zinc-100 overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="输入客户手机号进行匹配..." 
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-black outline-none font-bold"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    onBlur={searchCustomer}
                  />
                </div>
                <button 
                  className="bg-white border border-zinc-200 px-6 py-2 text-xs font-bold uppercase hover:border-black flex items-center gap-2"
                  onClick={() => alert('Excel 导入客户订单功能：请上传确认过的 Excel')}
                >
                  <Upload size={16} />
                  Excel 导入
                </button>
              </div>

              {customerInfo && (
                <div className="p-4 bg-black text-white rounded-sm mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">已匹配客户</div>
                  <div className="flex justify-between">
                    <span className="font-bold">{customerInfo.name}</span>
                    <span className="font-mono">{customerInfo.phone}</span>
                  </div>
                  <div className="text-xs mt-1 opacity-80">{customerInfo.address}</div>
                </div>
              )}

              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="搜索商品名称、货号 SPU/SKU..." 
                   className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 focus:border-black outline-none text-sm"
                 />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
              {[
                { id: '1', name: 'Rolex Submariner 126610LN', itemNo: 'RLX-126610', price: 67500, category: 'other', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=100&q=80' },
                { id: '2', name: 'Maison Margiela Glam Slam', itemNo: 'MM-GS-001', price: 9450, category: 'bags', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80' },
                { id: '3', name: 'Jordan 1 Retro High', itemNo: 'AJ1-555088-001', price: 3500, category: 'shoes', image: 'https://images.unsplash.com/photo-1552346154-21d328109bf1?auto=format&fit=crop&w=100&q=80' }
              ].map(prod => (
                <div key={prod.id} className="border border-zinc-100 p-4 hover:border-black transition-colors group">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-zinc-50 flex-shrink-0">
                      <img src={prod.image} className="w-full h-full object-contain mix-blend-multiply grayscale" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold line-clamp-1">{prod.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">货号: {prod.itemNo}</div>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-sm font-black">¥{prod.price.toLocaleString()}</span>
                        <button 
                          onClick={() => addToCart(prod)}
                          className="w-8 h-8 bg-zinc-50 text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Order Summary & Cart */}
          <div className="w-96 flex flex-col bg-zinc-50 overflow-hidden">
            <div className="p-6 border-b border-zinc-200">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">待生成订单列表</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {cart.length === 0 && (
                  <div className="text-center py-12 text-zinc-400 text-xs italic">购物车为空</div>
                )}
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 bg-white p-2 border border-zinc-100 items-center">
                    <div className="w-10 h-10 bg-zinc-50 p-1">
                      <img src={item.image} className="w-full h-full object-contain mix-blend-multiply grayscale" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-zinc-400">¥{item.price.toLocaleString()} x {item.count}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-300 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-[10px]">定金比例 (当前设置)</span>
                  <div className="flex gap-2">
                    {[0, 30, 50, 100].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setDepositAmount(Math.round(totalAmount * (p / 100)))}
                        className={`text-[10px] font-bold px-2 py-1 border transition-colors ${depositAmount === Math.round(totalAmount * (p/100)) ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-500'}`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">定金金额: ¥</span>
                  <input 
                    type="number" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full pl-20 pr-4 py-2 border border-zinc-200 focus:border-black outline-none font-mono text-sm" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-[10px]">运费设置 (多类目汇总)</span>
                  <span className="text-[10px] text-zinc-400 italic">模板合计: ¥{calculateAutoShipping()}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">{shippingManual !== null ? '手动运费: ¥' : '自动运费: ¥'}</span>
                  <input 
                    type="number" 
                    value={totalShipping} 
                    onChange={(e) => setShippingManual(Number(e.target.value))}
                    placeholder="留空则按分类件数自动计算"
                    className="w-full pl-24 pr-4 py-2 border border-zinc-200 focus:border-black outline-none font-mono text-sm" 
                  />
                  {shippingManual !== null && (
                    <button onClick={() => setShippingManual(null)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-600 hover:underline">重置为模板</button>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>商品小计</span>
                  <span>¥{totalAmount.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-500">
                  <span>运费</span>
                  <span>¥{totalShipping.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2">
                  <span>订单总额</span>
                  <span>¥{(totalAmount + totalShipping).toLocaleString()}.00</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
               <button 
                 disabled={!customerInfo || cart.length === 0}
                 onClick={handleFinish}
                 className="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-zinc-200 disabled:cursor-not-allowed flex items-center justify-center gap-3"
               >
                 <CheckCircle size={18} />
                 生成待支付定金订单
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle } from 'lucide-react';
