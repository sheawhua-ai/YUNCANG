import { Search, Edit, Trash2, X, Truck, Building, Plus } from "lucide-react";
import { useState } from "react";

const INITIAL_WAREHOUSES = [
  { id: '1', name: 'UNIBUY香港', code: '1567-001', location: 'hk', currency: 'HKD', dropshipping: true, autoConfirmStock: false, skuCount: 5128 },
  { id: '2', name: 'UNIBUY大陆', code: '1567-002', location: 'cn', currency: 'CNY', dropshipping: true, autoConfirmStock: true, skuCount: 0 },
];

const INITIAL_SHIPPING_RULES = [
  { id: '1', warehouseId: '1', category: 'shoes', destination: 'Mainland China', fee: 50 },
  { id: '2', warehouseId: '1', category: 'clothes', destination: 'Mainland China', fee: 30 },
  { id: '3', warehouseId: '2', category: 'shoes', destination: 'Mainland China', fee: 15 },
  { id: '4', warehouseId: '2', category: 'clothes', destination: 'Mainland China', fee: 10 },
];

export function WarehouseManagement() {
  const [activeSubTab, setActiveSubTab] = useState<'warehouse' | 'shipping'>('warehouse');
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [shippingRules, setShippingRules] = useState(INITIAL_SHIPPING_RULES);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);

  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  
  // Add Modal State
  const [addName, setAddName] = useState('');
  const [addLocation, setAddLocation] = useState('');
  const [addDropshipping, setAddDropshipping] = useState(true);
  const [addAutoConfirmStock, setAddAutoConfirmStock] = useState(false);

  // Edit Modal State
  const [editDropshipping, setEditDropshipping] = useState(false);
  const [editAutoConfirmStock, setEditAutoConfirmStock] = useState(false);
  const [editName, setEditName] = useState('');

  // Shipping Rule State
  const [newRule, setNewRule] = useState({
    warehouseId: '',
    category: 'shoes',
    destination: 'Mainland China',
    fee: 0
  });

  const handleAddWarehouse = () => {
    if (!addName || !addLocation) {
      alert('请填写必填项');
      return;
    }
    const newWarehouse = {
      id: Date.now().toString(),
      name: addName,
      code: `1567-00${warehouses.length + 1}`,
      location: addLocation,
      currency: addLocation === 'hk' ? 'HKD' : 'CNY',
      dropshipping: addLocation === 'bonded' ? true : addDropshipping,
      autoConfirmStock: addAutoConfirmStock,
      skuCount: 0
    };
    setWarehouses([...warehouses, newWarehouse]);
    setIsAddModalOpen(false);
    setAddName('');
    setAddLocation('');
    setAddDropshipping(true);
    setAddAutoConfirmStock(false);
  };

  const openEditModal = (warehouse: any) => {
    setEditingWarehouse(warehouse);
    setEditDropshipping(warehouse.location === 'bonded' ? true : warehouse.dropshipping);
    setEditAutoConfirmStock(warehouse.autoConfirmStock || false);
    setEditName(warehouse.name);
    setIsEditModalOpen(true);
  };

  const handleEditWarehouse = () => {
    if (!editName) {
      alert('请填写仓库名称');
      return;
    }
    setWarehouses(warehouses.map(w => 
      w.id === editingWarehouse.id ? { ...w, dropshipping: w.location === 'bonded' ? true : editDropshipping, autoConfirmStock: editAutoConfirmStock, name: editName } : w
    ));
    setIsEditModalOpen(false);
    setEditingWarehouse(null);
  };

  const handleAddRule = () => {
    if (!newRule.warehouseId) {
      alert('请选择仓库');
      return;
    }
    setShippingRules([...shippingRules, { ...newRule, id: Date.now().toString() }]);
    setIsAddRuleModalOpen(false);
    setNewRule({ warehouseId: '', category: 'shoes', destination: 'Mainland China', fee: 0 });
  };

  const deleteRule = (id: string) => {
    setShippingRules(shippingRules.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] pb-12 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-8 gap-4">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Infrastructure</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">仓库及运费配置</h1>
          <p className="text-xs md:text-sm text-zinc-500">管理发货仓库、代发配置及不同地域的运费规则</p>
        </div>
      </div>

      <div className="flex border-b border-zinc-200 mb-6 gap-8 text-[10px] font-bold uppercase tracking-widest">
        <button 
          onClick={() => setActiveSubTab('warehouse')}
          className={`pb-4 transition-colors relative ${activeSubTab === 'warehouse' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          仓库列表
          {activeSubTab === 'warehouse' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
        </button>
        <button 
          onClick={() => setActiveSubTab('shipping')}
          className={`pb-4 transition-colors relative ${activeSubTab === 'shipping' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          运费规则配置
          {activeSubTab === 'shipping' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
        </button>
      </div>

      {activeSubTab === 'warehouse' ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 border border-zinc-200 shadow-sm gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="请输入仓库名称" 
              className="w-full border border-zinc-200 px-4 py-2 text-sm focus:border-black focus:ring-0 outline-none max-w-full" 
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-black text-white text-sm px-6 py-2 hover:bg-zinc-800 transition-colors font-bold">
              查询
            </button>
            <button className="flex-1 md:flex-none bg-white border border-zinc-200 text-zinc-600 text-sm px-6 py-2 hover:border-black hover:text-black transition-colors font-bold">
              重置
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto bg-black text-white text-sm px-6 py-2 hover:bg-zinc-800 transition-colors font-bold shrink-0 mt-2 md:mt-0 max-w-full"
        >
          新增仓库
        </button>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <div className="md:hidden p-4 text-xs font-bold text-zinc-500 bg-zinc-50 border-b border-zinc-200 text-center w-full min-w-[800px]">向右滑动查看更多列</div>
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="p-4 font-bold text-left">仓库名称</th>
                <th className="p-4 font-bold text-left">仓库编码</th>
                <th className="p-4 font-bold text-center">币种</th>
                <th className="p-4 font-bold text-center">支持订单代发</th>
                <th className="p-4 font-bold text-center">自动确认有货</th>
                <th className="p-4 font-bold text-center">SKU数量</th>
                <th className="p-4 font-bold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {warehouses.map(warehouse => (
                <tr key={warehouse.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4 text-left font-bold">{warehouse.name}</td>
                  <td className="p-4 text-left font-mono text-xs">{warehouse.code}</td>
                  <td className="p-4 text-center font-bold text-xs">{warehouse.currency}</td>
                  <td className="p-4 text-center">
                    {warehouse.dropshipping ? (
                      <span className="text-black border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">支持</span>
                    ) : (
                      <span className="text-zinc-400 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">不支持</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {warehouse.autoConfirmStock ? (
                      <span className="text-black border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">开启</span>
                    ) : (
                      <span className="text-zinc-400 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">关闭</span>
                    )}
                  </td>
                  <td className="p-4 text-center font-bold">{warehouse.skuCount}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-black font-bold text-xs">
                      <button onClick={() => openEditModal(warehouse)} className="hover:text-zinc-500 transition-colors">修改</button>
                      <button className="hover:text-zinc-500 transition-colors">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-zinc-200 flex flex-col md:flex-row justify-between md:items-center text-xs md:text-sm text-zinc-500 bg-zinc-50 gap-4">
          <div>共 {warehouses.length} 条</div>
          <div className="flex flex-wrap items-center gap-4">
            <select className="border border-zinc-200 px-2 py-1 bg-white outline-none font-bold">
              <option>20条/页</option>
              <option>50条/页</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="text-zinc-400 hover:text-black">&lt;</button>
              <span className="text-black font-bold">1</span>
              <button className="text-zinc-400 hover:text-black">&gt;</button>
            </div>
          </div>
        </div>
      </div>
      </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 border border-zinc-200 shadow-sm gap-4">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">配置从仓库到各目的地的分类运费规则</p>
            <button 
              onClick={() => setIsAddRuleModalOpen(true)}
              className="bg-black text-white text-sm px-6 py-2 hover:bg-zinc-800 transition-colors font-bold flex items-center gap-2"
            >
              <Plus size={16} />
              添加运费规则
            </button>
          </div>

          <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden min-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <tr>
                  <th className="p-4">发货仓库</th>
                  <th className="p-4">商品类目</th>
                  <th className="p-4">目的地</th>
                  <th className="p-4 text-center">每件运费 (CNY)</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {shippingRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-zinc-50">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <Building size={14} className="text-zinc-400" />
                      {warehouses.find(w => w.id === rule.warehouseId)?.name || '未知仓库'}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        {rule.category === 'shoes' ? '鞋类' : rule.category === 'clothes' ? '衣物' : rule.category === 'bags' ? '箱包' : '其他'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-zinc-600 italic">
                      {rule.destination === 'Mainland China' ? '中国大陆' : rule.destination === 'HK' ? '香港' : '其他地区'}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-lg">
                      ¥{rule.fee}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => deleteRule(rule.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {shippingRules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-zinc-400 italic">暂无运费规则，请点击右上方按钮添加</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative w-[600px] bg-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="text-lg font-medium">添加仓库</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-bold"><span className="text-red-500 mr-1">*</span>仓库名称</label>
                <input 
                  type="text" 
                  placeholder="请输入仓库名称" 
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="flex-1 border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" 
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-bold"><span className="text-red-500 mr-1">*</span>所在地</label>
                <select 
                  value={addLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddLocation(val);
                    if (val === 'bonded') {
                      setAddDropshipping(true);
                    } else if (val !== '') {
                      // Optionally reset to false or leave it, but bonded forces true.
                      setAddDropshipping(false);
                    }
                  }}
                  className="flex-1 border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-zinc-500"
                >
                  <option value="">请选择所在地</option>
                  <option value="hk">香港</option>
                  <option value="cn">中国大陆</option>
                  <option value="bonded">保税区</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-bold"><span className="text-red-500 mr-1">*</span>币种</label>
                <input 
                  type="text" 
                  placeholder="选择所在地后自动填充" 
                  value={addLocation === 'hk' ? 'HKD' : (addLocation === 'cn' || addLocation === 'bonded') ? 'CNY' : ''}
                  disabled 
                  className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none text-zinc-400" 
                />
              </div>
              <div className="flex items-start gap-4">
                <label className="w-24 text-right text-sm font-bold mt-0.5">支持订单代发</label>
                <div className="flex-1">
                  <div className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${addLocation === 'bonded' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input 
                      type="checkbox" 
                      id="add-toggle" 
                      checked={addLocation === 'bonded' ? true : addDropshipping}
                      disabled={addLocation === 'bonded'}
                      onChange={(e) => setAddDropshipping(e.target.checked)}
                      className={`toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none transition-transform duration-200 ease-in-out ${(addLocation === 'bonded' || addDropshipping) ? 'translate-x-5 border-black' : 'translate-x-0 border-zinc-300'} ${addLocation === 'bonded' ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                      style={{ top: '2px', left: '2px' }}
                    />
                    <label 
                      htmlFor="add-toggle" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full ${(addLocation === 'bonded' || addDropshipping) ? 'bg-black' : 'bg-zinc-300'} ${addLocation === 'bonded' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    ></label>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">下游同步开启后，允许获取最终买家信息，并由我直发。</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <label className="w-24 text-right text-sm font-bold mt-0.5">自动确认有货</label>
                <div className="flex-1">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      id="add-auto-confirm-toggle" 
                      checked={addAutoConfirmStock}
                      onChange={(e) => setAddAutoConfirmStock(e.target.checked)}
                      className={`toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${addAutoConfirmStock ? 'translate-x-5 border-black' : 'translate-x-0 border-zinc-300'}`} 
                      style={{ top: '2px', left: '2px' }}
                    />
                    <label 
                      htmlFor="add-auto-confirm-toggle" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${addAutoConfirmStock ? 'bg-black' : 'bg-zinc-300'}`}
                    ></label>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">开启后，下游订单生成时将自动确认库存，无需人工二次确认。</div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50">
              <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 border border-zinc-200 text-sm font-bold hover:border-black transition-colors bg-white">取消</button>
              <button onClick={handleAddWarehouse} className="px-6 py-2 bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors">确定</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingWarehouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-[600px] bg-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="text-lg font-medium">修改仓库</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-bold"><span className="text-red-500 mr-1">*</span>仓库名称</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" 
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-bold">仓库编码</label>
                <input type="text" value={editingWarehouse.code} disabled className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none text-zinc-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-bold">币种</label>
                <input type="text" value={editingWarehouse.currency} disabled className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none text-zinc-400" />
              </div>
              <div className="flex items-start gap-4">
                <label className="w-24 text-right text-sm font-bold mt-0.5">支持订单代发</label>
                <div className="flex-1">
                  <div className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${editingWarehouse.location === 'bonded' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input 
                      type="checkbox" 
                      id="edit-toggle" 
                      checked={editingWarehouse.location === 'bonded' ? true : editDropshipping}
                      disabled={editingWarehouse.location === 'bonded'}
                      onChange={(e) => setEditDropshipping(e.target.checked)}
                      className={`toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none transition-transform duration-200 ease-in-out ${(editingWarehouse.location === 'bonded' || editDropshipping) ? 'translate-x-5 border-black' : 'translate-x-0 border-zinc-300'} ${editingWarehouse.location === 'bonded' ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                      style={{ top: '2px', left: '2px' }}
                    />
                    <label 
                      htmlFor="edit-toggle" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full ${(editingWarehouse.location === 'bonded' || editDropshipping) ? 'bg-black' : 'bg-zinc-300'} ${editingWarehouse.location === 'bonded' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    ></label>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">下游同步开启后，允许获取最终买家信息，并由我直发。</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <label className="w-24 text-right text-sm font-bold mt-0.5">自动确认有货</label>
                <div className="flex-1">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      id="edit-auto-confirm-toggle" 
                      checked={editAutoConfirmStock}
                      onChange={(e) => setEditAutoConfirmStock(e.target.checked)}
                      className={`toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${editAutoConfirmStock ? 'translate-x-5 border-black' : 'translate-x-0 border-zinc-300'}`} 
                      style={{ top: '2px', left: '2px' }}
                    />
                    <label 
                      htmlFor="edit-auto-confirm-toggle" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${editAutoConfirmStock ? 'bg-black' : 'bg-zinc-300'}`}
                    ></label>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">开启后，下游订单生成时将自动确认库存，无需人工二次确认。</div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50">
              <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 border border-zinc-200 text-sm font-bold hover:border-black transition-colors bg-white">取消</button>
              <button onClick={handleEditWarehouse} className="px-6 py-2 bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors">确定</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {isAddRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddRuleModalOpen(false)}></div>
          <div className="relative w-[500px] bg-white shadow-2xl rounded-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 uppercase tracking-widest text-xs font-black">
              <h2>添加运费规则</h2>
              <button onClick={() => setIsAddRuleModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-xs font-bold uppercase text-zinc-400">发货仓库</label>
                <select 
                  value={newRule.warehouseId}
                  onChange={(e) => setNewRule({ ...newRule, warehouseId: e.target.value })}
                  className="flex-1 border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black bg-white"
                >
                  <option value="">选择源头仓库</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-xs font-bold uppercase text-zinc-400">商品类目</label>
                <select 
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                  className="flex-1 border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black bg-white"
                >
                  <option value="shoes">鞋类</option>
                  <option value="clothes">衣物</option>
                  <option value="bags">箱包</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-xs font-bold uppercase text-zinc-400">目的地</label>
                <select 
                  value={newRule.destination}
                  onChange={(e) => setNewRule({ ...newRule, destination: e.target.value })}
                  className="flex-1 border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black bg-white"
                >
                  <option value="Mainland China">中国大陆</option>
                  <option value="HK">香港</option>
                  <option value="Overseas">海外</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-xs font-bold uppercase text-zinc-400">单件运费</label>
                <div className="flex-1 relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold">¥</span>
                   <input 
                      type="number" 
                      value={newRule.fee}
                      onChange={(e) => setNewRule({ ...newRule, fee: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-zinc-200 outline-none focus:border-black font-mono text-sm"
                   />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50">
              <button onClick={() => setIsAddRuleModalOpen(false)} className="px-6 py-2 border border-zinc-200 text-xs font-bold uppercase tracking-widest bg-white">取消</button>
              <button onClick={handleAddRule} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest">保存规则</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
