import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Truck,
  ArrowRightLeft,
  Settings,
  FileText,
  Bell,
  Search,
  Menu,
  X,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Database,
  RefreshCw,
  MapPin,
  QrCode,
  FileSpreadsheet,
  Server,
} from 'lucide-react';

// --- Mock Data ---

const INVENTORY_DATA = [
  {
    id: 1,
    sku: 'SKU-9921-ERA',
    name: '高性能导电胶',
    qty: 5,
    warehouse: '上海总仓',
    bin: 'A-01-02',
    expiryDays: 5,
    tags: ['eRA', '危化品'],
  },
  {
    id: 2,
    sku: 'GLS-002-TW',
    name: '精密玻璃基板',
    qty: 120,
    warehouse: '北京分仓',
    bin: 'B-02-10',
    expiryDays: 365,
    tags: ['Glass', 'TW-Origin'],
  },
  {
    id: 3,
    sku: 'CPU-X86-INT',
    name: '工业控制芯片',
    qty: 500,
    warehouse: '深圳分仓',
    bin: 'A-05-11',
    expiryDays: 900,
    tags: ['高价值'],
  },
  {
    id: 4,
    sku: 'ASSET-001',
    name: '手持PDA终端',
    qty: 15,
    warehouse: '资产库',
    bin: 'Z-01',
    expiryDays: 9999,
    tags: ['固定资产'],
  },
];

const INBOUND_DATA = [
  {
    id: 'ASN-20251001',
    type: '国外进口',
    supplier: 'Samsung KR',
    items: 'OLED-Screen',
    qty: 500,
    status: 'pending',
    date: '2025-10-24 10:00',
  },
  {
    id: 'ASN-20251002',
    type: 'DOA销毁入库',
    supplier: '内部返修中心',
    items: 'Broken-PCB',
    qty: 20,
    status: 'exception',
    date: '2025-10-23 14:30',
    note: '质量异常: 包装破损',
  },
  {
    id: 'ASN-20251003',
    type: '好件返还',
    supplier: '客户A',
    items: 'CPU-X86',
    qty: 10,
    status: 'received',
    date: '2025-10-22 09:15',
  },
];

const OUTBOUND_DATA = [
  {
    id: 'SO-2025001',
    type: '销售订单',
    customer: '特斯拉上海',
    items: 'SKU-9921-ERA',
    qty: 5,
    priority: 'High',
    status: 'allocated',
  },
  {
    id: 'FOC-2025002',
    type: 'FOC订单',
    customer: '研发实验室',
    items: 'GLS-002-TW',
    qty: 10,
    priority: 'Normal',
    status: 'picked',
  },
  {
    id: 'ENG-2025003',
    type: '工程师订单',
    customer: '李工(Field)',
    items: 'PDA-Battery',
    qty: 2,
    priority: 'Normal',
    status: 'shipped',
  },
];

const API_LOGS = [
  {
    id: 1,
    time: '14:20:01',
    system: 'SAP ERP',
    action: 'Inbound Sync',
    status: 'Success',
    msg: 'Sync 4 orders',
  },
  {
    id: 2,
    time: '14:19:55',
    system: 'WMS Robot',
    action: 'Bin Allocation',
    status: 'Success',
    msg: 'Auto-slotting done',
  },
  {
    id: 3,
    time: '14:15:22',
    system: 'SF Express',
    action: 'Tracking Update',
    status: 'Error',
    msg: 'Timeout (Retry 1/3)',
  },
  {
    id: 4,
    time: '14:10:00',
    system: 'SMS Gateway',
    action: 'Alert Send',
    status: 'Success',
    msg: 'Sent to +86138...',
  },
];

// --- Components ---

const Dashboard = ({ setMobileMode }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* 顶部KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm">库存总SKU</div>
          <div className="text-3xl font-bold text-gray-800">1,240</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-gray-500 text-sm">今日出库单</div>
          <div className="text-3xl font-bold text-gray-800">85</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="text-gray-500 text-sm">待处理入库</div>
          <div className="text-3xl font-bold text-gray-800">12</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="text-gray-500 text-sm">异常/预警</div>
          <div className="text-3xl font-bold text-red-600">3</div>
        </div>
      </div>

      {/* 系统公告与预警 */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="animate-bounce text-yellow-400" />
          <span className="font-bold text-yellow-400">系统公告:</span>
          <span className="animate-pulse">
            本周末将进行年度盘点，请提前处理加急订单。
          </span>
        </div>
        <div className="text-xs text-gray-400">2025-10-24 发布</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 报表 - 库存健康度 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" /> 库存健康度分析 (eRA/Glass)
          </h3>
          <div className="h-64 flex items-end justify-around border-b border-gray-200 pb-2">
            {[65, 40, 80, 55, 90, 70, 85].map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 group w-full"
              >
                <div className="w-8 bg-blue-100 rounded-t-lg relative h-full flex items-end overflow-hidden group-hover:bg-blue-200 transition-colors">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-blue-600 rounded-t-lg"
                  ></div>
                </div>
                <span className="text-xs text-gray-500">仓{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-sm text-gray-600 justify-center">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div> 正常库存
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 rounded"></div> 库容余量
            </span>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="font-bold text-lg mb-4">快速操作</h3>
          <button
            onClick={() => setMobileMode(true)}
            className="w-full py-3 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
          >
            <Smartphone /> 启动移动端演示
          </button>
          <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
            <FileSpreadsheet /> 导出月度盘点报告
          </button>
          <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
            <RefreshCw /> 同步 SAP 主数据
          </button>
        </div>
      </div>

      {/* 接口日志监控简略版 */}
      <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-sm shadow-lg overflow-hidden">
        <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
          <span className="font-bold flex items-center gap-2">
            <Server size={16} /> 实时接口监控 (API Gateway)
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>{' '}
            Online
          </span>
        </div>
        <div className="space-y-1">
          {API_LOGS.map((log) => (
            <div
              key={log.id}
              className="flex gap-4 opacity-80 hover:opacity-100"
            >
              <span className="text-gray-500">[{log.time}]</span>
              <span className="text-yellow-500 w-24">{log.system}</span>
              <span className="text-blue-400 w-32">{log.action}</span>
              <span
                className={
                  log.status === 'Error' ? 'text-red-500' : 'text-green-500'
                }
              >
                {log.status}
              </span>
              <span className="text-gray-400 truncate hidden md:block">
                - {log.msg}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Inventory View ---
const InventoryView = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Database className="text-blue-600" /> 库存管理中心
      </h2>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          盘点
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          库存调拨
        </button>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-gray-600">SKU / 产品名称</th>
            <th className="p-4 text-gray-600">属性标记 (4.4)</th>
            <th className="p-4 text-gray-600">仓库/库位</th>
            <th className="p-4 text-gray-600">数量</th>
            <th className="p-4 text-gray-600">效期状态</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {INVENTORY_DATA.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="p-4">
                <div className="font-bold text-gray-800">{item.sku}</div>
                <div className="text-sm text-gray-500">{item.name}</div>
              </td>
              <td className="p-4">
                <div className="flex gap-1 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded text-xs border ${
                        tag === 'eRA'
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : tag === 'Glass'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : tag === 'TW-Origin'
                          ? 'bg-orange-100 text-orange-700 border-orange-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4 text-sm">
                <div>{item.warehouse}</div>
                <code className="bg-gray-100 px-1 rounded text-xs">
                  {item.bin}
                </code>
              </td>
              <td className="p-4 font-mono font-bold">{item.qty}</td>
              <td className="p-4">
                {item.expiryDays < 30 ? (
                  <div className="flex items-center gap-1 text-red-600 text-sm font-bold">
                    <AlertTriangle size={14} /> 剩余 {item.expiryDays} 天
                  </div>
                ) : (
                  <div className="text-green-600 text-sm">正常</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Mobile Simulator ---
const MobileSimulator = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[375px] h-[700px] bg-gray-100 rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-900 flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl z-20"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white bg-gray-900/50 rounded-full p-1"
        >
          <X size={16} />
        </button>

        {/* Mobile Header */}
        <div className="bg-blue-600 text-white pt-12 pb-4 px-4 shadow-md z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">RDSL 移动工作台</h3>
            <Bell size={20} />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-white/20 p-2 rounded-lg text-center backdrop-blur-sm">
              <div className="text-xs opacity-80">待办</div>
              <div className="font-bold text-xl">12</div>
            </div>
            <div className="flex-1 bg-white/20 p-2 rounded-lg text-center backdrop-blur-sm">
              <div className="text-xs opacity-80">预警</div>
              <div className="font-bold text-xl text-yellow-300">3</div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-yellow-50 text-yellow-800 text-xs p-2 rounded border border-yellow-200 flex items-center gap-2">
            <Volume2Icon size={14} /> <span>本周末年度盘点通知...</span>
          </div>

          {/* 功能网格 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-blue-50">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <QrCode size={24} />
              </div>
              <span className="text-sm font-medium">扫码查询</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-blue-50">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <Package size={24} />
              </div>
              <span className="text-sm font-medium">快速入库</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-blue-50">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                <Truck size={24} />
              </div>
              <span className="text-sm font-medium">出库作业</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-blue-50">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <MapPin size={24} />
              </div>
              <span className="text-sm font-medium">路由追踪</span>
            </div>
          </div>

          {/* 快捷补单请求 */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-sm mb-2 text-gray-700">
              快捷补单请求
            </h4>
            <div className="flex gap-2">
              <input
                placeholder="输入SKU..."
                className="flex-1 bg-gray-100 border-none rounded text-sm px-3"
              />
              <button className="bg-blue-600 text-white px-4 rounded text-sm">
                提交
              </button>
            </div>
          </div>

          {/* 序列号追踪 */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-sm mb-2 text-gray-700">
              序列号追踪 (SN)
            </h4>
            <div className="text-xs text-gray-500 mb-2">
              输入 SN 追踪全生命周期状态
            </div>
            <div className="h-2 bg-gray-100 rounded overflow-hidden">
              <div className="w-2/3 h-full bg-green-500"></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>入库</span>
              <span>在库</span>
              <span className="text-blue-500 font-bold">出库中</span>
              <span>签收</span>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="bg-white border-t px-6 py-3 flex justify-between items-center pb-8">
          <Smartphone className="text-blue-600" size={24} />
          <Search className="text-gray-400" size={24} />
          <div className="bg-blue-600 text-white p-3 rounded-full -mt-8 shadow-lg border-4 border-gray-100">
            <QrCode size={24} />
          </div>
          <FileText className="text-gray-400" size={24} />
          <Settings className="text-gray-400" size={24} />
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMode, setMobileMode] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden">
      {mobileMode && <MobileSimulator onClose={() => setMobileMode(false)} />}

      {/* 侧边栏 */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wide text-blue-400">
            <Package /> RDSL System
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          <div className="text-xs text-gray-500 uppercase font-bold mt-4 mb-2 px-2">
            运营中心
          </div>
          <NavItem
            id="dashboard"
            icon={LayoutDashboard}
            label="运营大屏 (4.10)"
          />
          <NavItem id="inbound" icon={ArrowRightLeft} label="入库管理 (4.1)" />
          <NavItem id="outbound" icon={Truck} label="出库管理 (4.3)" />
          <NavItem id="inventory" icon={Database} label="库存/效期 (4.2)" />

          <div className="text-xs text-gray-500 uppercase font-bold mt-6 mb-2 px-2">
            追踪与分析
          </div>
          <NavItem id="tracking" icon={MapPin} label="物流/SN追踪 (4.6)" />
          <NavItem id="reports" icon={FileText} label="报表中心 (4.10)" />

          <div className="text-xs text-gray-500 uppercase font-bold mt-6 mb-2 px-2">
            系统设置
          </div>
          <NavItem id="system" icon={Settings} label="基础数据 (4.4)" />
          <NavItem id="logs" icon={Server} label="接口日志 (4.11)" />
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>
            <h1 className="font-bold text-lg text-gray-800">
              {activeTab === 'dashboard' && '运营监控大屏'}
              {activeTab === 'inventory' && '库存与效期管理'}
              {activeTab === 'inbound' && '入库数据管理'}
              {activeTab === 'outbound' && '出库订单处理'}
              {activeTab === 'logs' && '系统接口监控'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="text-sm text-right hidden md:block">
              <div className="font-bold">Admin (Role: Super User)</div>
              <div className="text-xs text-gray-500">上海总仓</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <Dashboard setMobileMode={setMobileMode} />
          )}
          {activeTab === 'inventory' && <InventoryView />}

          {activeTab === 'inbound' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold flex gap-2">
                <ArrowRightLeft className="text-orange-500" /> 入库任务
                (Inbound)
              </h2>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th>ID</th>
                      <th>类型 (4.1)</th>
                      <th>供应商</th>
                      <th>物品</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {INBOUND_DATA.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-4 font-mono">{o.id}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {o.type}
                          </span>
                        </td>
                        <td className="p-4">{o.supplier}</td>
                        <td className="p-4">{o.items}</td>
                        <td className="p-4">
                          {o.status === 'exception' ? (
                            <span className="text-red-600 flex items-center gap-1">
                              <AlertTriangle size={14} /> 异常
                            </span>
                          ) : (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle size={14} /> 正常
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-blue-600 cursor-pointer hover:underline">
                          处理
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'outbound' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold flex gap-2">
                <Truck className="text-green-500" /> 出库任务 (Outbound)
              </h2>
              <div className="grid gap-4">
                {OUTBOUND_DATA.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-lg">
                        {o.id}{' '}
                        <span className="text-xs font-normal bg-gray-100 px-2 py-0.5 rounded ml-2">
                          {o.type}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        客户: {o.customer} | 包含: {o.items}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${
                          o.priority === 'High'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {o.priority} Priority
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Status: {o.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="h-full bg-gray-900 text-green-400 p-6 rounded-xl font-mono overflow-auto">
              <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">
                系统接口日志 (System Integration Logs)
              </h3>
              {API_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="mb-2 border-b border-gray-800 pb-1"
                >
                  <span className="text-gray-500">[{log.time}]</span>
                  <span className="text-yellow-500 mx-2">{log.system}</span>
                  <span className="text-blue-400">{log.action}</span>
                  <span
                    className={`ml-4 ${
                      log.status === 'Error'
                        ? 'text-red-500 bg-red-900/30 px-1'
                        : 'text-green-500'
                    }`}
                  >
                    {log.status}
                  </span>
                  <div className="text-gray-400 ml-16 text-xs">{log.msg}</div>
                </div>
              ))}
              <div className="animate-pulse mt-4">_ 等待新的数据流...</div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// 简单的辅助图标
const Volume2Icon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);
