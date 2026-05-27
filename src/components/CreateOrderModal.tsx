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
  const [customerSuggestions, setCustomerSuggestions] = useState<{ name: string; phone: string; address: string }[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string; address: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [shippingManual, setShippingManual] = useState<number | null>(null);
  const [selectedShippingRule, setSelectedShippingRule] = useState<string>('auto');

  // 模拟客户库
  const MOCK_CUSTOMERS = [
    { name: '张三', phone: '13800138000', address: '上海市浦东新区陆家嘴金融中心' },
    { name: '李四', phone: '13912345678', address: '北京市朝阳区国贸商圈' },
    { name: '王五', phone: '13788889999', address: '广州市天河区珠江新城' },
    { name: '赵六', phone: '13666667777', address: '深圳市南山区科技园' }
  ];

  // 运费模板按类目分
  const shippingTemplate = {
    shoes: 50,
    clothes: 30,
    bags: 80,
    other: 40
  };

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ phone: '', name: '' });

  const handleCustomerPhoneChange = (val: string) => {
    setCustomerPhone(val);
    if (val.length > 0) {
      const filtered = MOCK_CUSTOMERS.filter(c => c.phone.includes(val) || c.name.includes(val));
      setCustomerSuggestions(filtered);
      setShowCustomerDropdown(true);
    } else {
      setCustomerSuggestions([]);
      setShowCustomerDropdown(false);
    }
  };

  const selectCustomer = (customer: any) => {
    setCustomerInfo(customer);
    setCustomerPhone(customer.phone);
    setShowCustomerDropdown(false);
  };

  const handleCreateNewCustomer = () => {
    const newCustomer = {
      name: newCustomerForm.name || '新客户',
      phone: newCustomerForm.phone,
      address: '后台手动创建 (暂未录入地址)'
    };
    setCustomerInfo(newCustomer);
    setCustomerPhone(newCustomer.phone);
    setIsNewCustomerModalOpen(false);
    setNewCustomerForm({ phone: '', name: '' });
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
                    placeholder="输入手机号或客户名称匹配..." 
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-black outline-none font-bold"
                    value={customerPhone}
                    onChange={(e) => handleCustomerPhoneChange(e.target.value)}
                  />
                  
                  {/* Customer Suggestions Dropdown */}
                  {showCustomerDropdown && (
                    <div className="absolute top-full left-0 right-0 z-[110] bg-white border border-zinc-200 mt-1 shadow-xl max-h-60 overflow-y-auto">
                      {customerSuggestions.length > 0 ? (
                        customerSuggestions.map((c, i) => (
                          <div 
                            key={i} 
                            onClick={() => selectCustomer(c)}
                            className="p-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-0"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-black text-sm">{c.name}</span>
                              <span className="text-xs font-mono text-zinc-400">{c.phone}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate">{c.address}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-zinc-400 italic">未找到匹配客户</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {customerPhone.length > 0 && customerSuggestions.length === 0 && (
                   <button 
                     onClick={() => {
                       setNewCustomerForm({ ...newCustomerForm, phone: customerPhone });
                       setIsNewCustomerModalOpen(true);
                     }}
                     className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 flex items-center gap-2"
                   >
                     <Plus size={16} />
                     新建客户
                   </button>
                )}
              </div>

              {customerInfo && (
                <div className="p-4 bg-black text-white rounded-sm mb-4 relative group">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">已匹配客户</div>
                  <div className="flex justify-between">
                    <span className="font-bold">{customerInfo.name}</span>
                    <span className="font-mono">{customerInfo.phone}</span>
                  </div>
                  <div className="text-xs mt-1 opacity-80">{customerInfo.address}</div>
                  <button 
                    onClick={() => {setCustomerInfo(null); setCustomerPhone('');}}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="搜索商品名称、货号 SPU/SKU..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 focus:border-black outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={() => alert('批量上传 Excel 商品清单进行下单')}
                  className="bg-zinc-100 text-zinc-600 px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <Upload size={14} />
                  Excel 批量导入货单
                </button>
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
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-[10px]">运费设置</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {setSelectedShippingRule('auto'); setShippingManual(null);}}
                      className={`text-[9px] font-bold px-2 py-1 border ${selectedShippingRule === 'auto' ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-500'}`}
                    >
                      按类目规则
                    </button>
                    <button 
                      onClick={() => setSelectedShippingRule('manual')}
                      className={`text-[9px] font-bold px-2 py-1 border ${selectedShippingRule === 'manual' ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-500'}`}
                    >
                      手动输入
                    </button>
                  </div>
                </div>

                {selectedShippingRule === 'auto' ? (
                  <div className="p-3 bg-white border border-zinc-200">
                    <div className="text-[10px] text-zinc-400 mb-2 uppercase tracking-widest font-bold">已匹配运费规则</div>
                    <div className="space-y-1">
                      {Array.from(new Set(cart.map(i => i.category))).map(cat => {
                        const count = cart.filter(i => i.category === cat).reduce((s, i) => s + i.count, 0);
                        return (
                          <div key={cat} className="flex justify-between text-[10px] font-mono">
                            <span className="text-zinc-500">{cat === 'shoes' ? '鞋类' : cat === 'clothes' ? '衣物' : cat === 'bags' ? '箱包' : '其他'} (x{count})</span>
                            <span className="font-bold">¥{(shippingTemplate[cat as keyof typeof shippingTemplate] || 0) * count}</span>
                          </div>
                        );
                      })}
                      <div className="pt-2 mt-2 border-t border-zinc-100 flex justify-between font-bold text-xs">
                        <span>规则合计</span>
                        <span>¥{calculateAutoShipping()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">手动运费: ¥</span>
                    <input 
                      type="number" 
                      value={shippingManual || ''} 
                      onChange={(e) => setShippingManual(Number(e.target.value))}
                      placeholder="输入协商后的金额..."
                      className="w-full pl-24 pr-4 py-2 border border-zinc-200 focus:border-black outline-none font-mono text-sm" 
                    />
                  </div>
                )}
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
      {/* 新建客户子弹窗 */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsNewCustomerModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="text-xs font-black uppercase tracking-widest">录入新客户信息</h3>
              <button onClick={() => setIsNewCustomerModalOpen(false)} className="text-zinc-400 hover:text-black">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">客户手机号</label>
                <input 
                  type="text" 
                  value={newCustomerForm.phone}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  placeholder="请输入手机号..."
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-black outline-none font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">备注姓名 / 昵称</label>
                <input 
                  type="text" 
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="例如：张三 (VIP)..."
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-black outline-none text-sm font-bold"
                />
              </div>
              <div className="pt-4 flex gap-2">
                <button 
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold border border-zinc-200 hover:bg-zinc-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleCreateNewCustomer}
                  className="flex-1 py-2 bg-black text-white text-xs font-bold hover:bg-zinc-800"
                >
                  确认并导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { CheckCircle } from 'lucide-react';
