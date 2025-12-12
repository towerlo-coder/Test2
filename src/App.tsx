import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine, ComposedChart } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Anchor, Droplet, DollarSign, Activity, Truck, FileText, ArrowUpRight, ArrowDownRight, Minus, Ship, Database, Search, Calculator, ChevronLeft, Clock, CheckCircle, Navigation, LucideIcon } from 'lucide-react';

// --- Types & Interfaces ---

interface HistoricalDataPoint {
  month: string;
  ucoPrice: number;
  processingCost: number;
  logisticsCost: number;
  totalCost: number;
  safPrice: number;
  margin: number;
  type: 'actual' | 'forecast';
}

interface InventoryItem {
  location: string;
  type: string;
  volume: number;
  fill: string;
}

interface ContractItem {
  id: string;
  customer: string;
  product: string;
  volume: string;
  price: string;
  term: string;
  status: 'Confirmed' | 'Negotiating' | 'Draft';
}

interface Checkpoint {
  label: string;
  status: 'completed' | 'active' | 'alert' | 'pending';
  time: string;
}

interface Shipment {
  id: string;
  vessel: string;
  type: 'Vessel' | 'Truck';
  product: string;
  volume: string;
  origin: string;
  destination: string;
  eta: string;
  status: string;
  location: string;
  risk: 'High' | 'Low';
  riskReason?: string;
  checkpoints: Checkpoint[];
}

interface TickerData {
  label: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
}

// --- Mock Data ---

// Historical Data (Jan - Jun)
const historicalData: HistoricalDataPoint[] = [
  { month: 'Jan', ucoPrice: 850, processingCost: 300, logisticsCost: 150, totalCost: 1300, safPrice: 2100, margin: 800, type: 'actual' },
  { month: 'Feb', ucoPrice: 880, processingCost: 310, logisticsCost: 160, totalCost: 1350, safPrice: 2150, margin: 800, type: 'actual' },
  { month: 'Mar', ucoPrice: 920, processingCost: 300, logisticsCost: 150, totalCost: 1370, safPrice: 2050, margin: 680, type: 'actual' },
  { month: 'Apr', ucoPrice: 900, processingCost: 305, logisticsCost: 155, totalCost: 1360, safPrice: 2200, margin: 840, type: 'actual' },
  { month: 'May', ucoPrice: 870, processingCost: 290, logisticsCost: 140, totalCost: 1300, safPrice: 2300, margin: 1000, type: 'actual' },
  { month: 'Jun', ucoPrice: 850, processingCost: 300, logisticsCost: 150, totalCost: 1300, safPrice: 2250, margin: 950, type: 'actual' },
];

// Forecast Data (Jul - Dec) - AI Prediction
const forecastData: HistoricalDataPoint[] = [
  { month: 'Jul (F)', ucoPrice: 860, processingCost: 300, logisticsCost: 150, totalCost: 1310, safPrice: 2240, margin: 930, type: 'forecast' },
  { month: 'Aug (F)', ucoPrice: 890, processingCost: 310, logisticsCost: 155, totalCost: 1355, safPrice: 2220, margin: 865, type: 'forecast' },
  { month: 'Sep (F)', ucoPrice: 950, processingCost: 320, logisticsCost: 160, totalCost: 1430, safPrice: 2200, margin: 770, type: 'forecast' },
  { month: 'Oct (F)', ucoPrice: 1050, processingCost: 330, logisticsCost: 170, totalCost: 1550, safPrice: 2180, margin: 630, type: 'forecast' },
  { month: 'Nov (F)', ucoPrice: 1100, processingCost: 340, logisticsCost: 180, totalCost: 1620, safPrice: 2150, margin: 530, type: 'forecast' },
  { month: 'Dec (F)', ucoPrice: 1150, processingCost: 350, logisticsCost: 190, totalCost: 1690, safPrice: 2100, margin: 410, type: 'forecast' },
];

const combinedData = [...historicalData, ...forecastData];

const inventoryData: InventoryItem[] = [
  { location: 'China Tanks', type: 'UCO (Feedstock)', volume: 15000, fill: '#EF4444' },
  { location: 'MY Tanks', type: 'POME (Feedstock)', volume: 8000, fill: '#F59E0B' },
  { location: 'Floating (Ind Ocean)', type: 'HVO (Product)', volume: 12000, fill: '#3B82F6' },
  { location: 'EU Storage', type: 'SAF (Product)', volume: 4500, fill: '#10B981' },
];

const contractData: ContractItem[] = [
  { id: 'BA-2025-06', customer: 'British Airways', product: 'SAF', volume: '5,000t', price: '$2,000/t', term: 'CIF London', status: 'Confirmed' },
  { id: 'SH-2025-07', customer: 'Shell Trading', product: 'HVO', volume: '12,000t', price: '$1,850/t', term: 'FOB Johor', status: 'Negotiating' },
  { id: 'LH-2025-08', customer: 'Lufthansa', product: 'SAF', volume: '3,500t', price: 'Floating', term: 'CIF Frankfurt', status: 'Draft' },
];

const shipmentData: Shipment[] = [
  {
    id: 'SH-101',
    vessel: 'Ever Green',
    type: 'Vessel',
    product: 'HVO (Product)',
    volume: '12,000t',
    origin: 'Johor, MY',
    destination: 'Rotterdam, NL',
    eta: '4 Days',
    status: 'In Transit',
    location: 'Indian Ocean (3.5°N, 95.2°E)',
    risk: 'Low',
    checkpoints: [
      { label: 'Loading (Johor)', status: 'completed', time: '10 Dec 08:00' },
      { label: 'Customs Clearance', status: 'completed', time: '10 Dec 14:30' },
      { label: 'Departure', status: 'completed', time: '10 Dec 18:00' },
      { label: 'Transit (Indian Ocean)', status: 'active', time: 'Now' },
      { label: 'Arrival (Rotterdam)', status: 'pending', time: '16 Dec 10:00' },
    ]
  },
  {
    id: 'TR-882',
    vessel: 'Fleet CN-882',
    type: 'Truck',
    product: 'UCO (Feedstock)',
    volume: '450t',
    origin: 'Henan Aggregator',
    destination: 'Jiangsu Refinery',
    eta: 'Delayed',
    status: 'Alert',
    location: 'Highway G25 (Stopped)',
    risk: 'High',
    riskReason: 'GPS Signal Lost > 2hrs',
    checkpoints: [
      { label: 'Pickup (Henan)', status: 'completed', time: '12 Dec 06:00' },
      { label: 'Weighbridge Check', status: 'completed', time: '12 Dec 07:15' },
      { label: 'Transit (G25)', status: 'alert', time: 'Last Signal: 10:00' },
      { label: 'Refinery Gate', status: 'pending', time: '12 Dec 16:00' },
    ]
  }
];

const tickerData: TickerData[] = [
  { label: 'UCO China', value: '850', unit: '$/t', change: '+2.1%', trend: 'up' },
  { label: 'UCO Indo', value: '835', unit: '$/t', change: '-0.5%', trend: 'down' },
  { label: 'SAF Rott', value: '2,100', unit: '$/t', change: '+1.5%', trend: 'up' },
  { label: 'UK RTFC', value: '0.15', unit: 'GBP', change: '+0.0%', trend: 'flat' },
  { label: 'NL HBE', value: '12.50', unit: 'EUR', change: '-1.2%', trend: 'down' },
  { label: 'USD/CNY', value: '7.24', unit: '', change: '+0.1%', trend: 'up' },
];

// --- Components ---

const TickerItem = ({ label, value, unit, change, trend }: TickerData) => (
  <div className="flex flex-col border-r border-gray-200 px-6 last:border-0 min-w-[140px]">
    <span className="text-xs font-semibold text-gray-500 uppercase">{label}</span>
    <div className="flex items-baseline gap-1 mt-1">
      <span className="text-lg font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{unit}</span>
    </div>
    <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
      {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowDownRight size={14} /> : <Minus size={14} />}
      <span className="ml-1">{change}</span>
    </div>
  </div>
);

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'flat';
  alertLevel?: 'high' | 'medium' | 'low';
}

const MetricCard = ({ title, value, subtext, icon: Icon, trend, alertLevel }: MetricCardProps) => (
  <div className={`bg-white p-4 rounded-xl shadow-sm border ${alertLevel === 'high' ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-sm font-medium ${alertLevel === 'high' ? 'text-red-700' : 'text-gray-500'}`}>{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${alertLevel === 'high' ? 'text-red-900' : 'text-gray-800'}`}>{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${alertLevel === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-2 flex items-center text-sm">
      {trend === 'up' ? <TrendingUp size={14} className="text-green-500 mr-1" /> : trend === 'down' ? <TrendingDown size={14} className="text-red-500 mr-1" /> : null}
      <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}>
        {subtext}
      </span>
    </div>
  </div>
);

interface ShipmentCardProps {
  shipment: Shipment;
  onClick: (s: Shipment) => void;
}

const ShipmentCard = ({ shipment, onClick }: ShipmentCardProps) => (
  <div onClick={() => onClick(shipment)} className="bg-white p-3 rounded-lg border border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        {shipment.type === 'Vessel' ? <Ship size={16} className="text-blue-600" /> : <Truck size={16} className="text-orange-600" />}
        <span className="font-bold text-sm text-gray-900">{shipment.vessel}</span>
      </div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${shipment.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {shipment.status}
      </span>
    </div>
    <div className="flex justify-between items-end">
      <div className="text-xs text-gray-500">
        <p>{shipment.product}</p>
        <p className="mt-0.5">{shipment.origin} → {shipment.destination}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-gray-800">{shipment.volume}</p>
        <p className="text-[10px] text-blue-600 font-medium group-hover:underline">Track &gt;</p>
      </div>
    </div>
  </div>
);

interface ShipmentDetailProps {
  shipment: Shipment;
  onBack: () => void;
}

const ShipmentDetail = ({ shipment, onBack }: ShipmentDetailProps) => (
  <div className="bg-white rounded-xl h-full flex flex-col">
    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
      <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
        <ChevronLeft size={20} className="text-gray-500"/>
      </button>
      <h3 className="font-bold text-gray-800">Tracking: {shipment.id}</h3>
    </div>
    
    <div className="p-4 flex-1 overflow-y-auto">
      {/* Risk Banner */}
      {shipment.risk === 'High' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-800 uppercase">Risk Alert</p>
            <p className="text-sm text-red-700">{shipment.riskReason}</p>
          </div>
        </div>
      )}

      {/* Location Map Placeholder */}
      <div className="bg-blue-50 h-32 rounded-lg mb-4 flex flex-col items-center justify-center border border-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <Navigation size={32} className="text-blue-500 mb-2" />
        <p className="text-sm font-bold text-blue-900">{shipment.location}</p>
        <p className="text-xs text-blue-600">ETA: {shipment.eta}</p>
      </div>

      {/* Checkpoints */}
      <div className="space-y-4 relative pl-2">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
        
        {shipment.checkpoints.map((cp, idx) => (
          <div key={idx} className="relative flex items-start gap-3">
            <div className={`z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
              cp.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' :
              cp.status === 'active' ? 'bg-blue-100 border-blue-500 text-blue-600 animate-pulse' :
              cp.status === 'alert' ? 'bg-red-100 border-red-500 text-red-600' :
              'bg-white border-gray-300 text-gray-300'
            }`}>
              {cp.status === 'completed' ? <CheckCircle size={14} /> : 
               cp.status === 'alert' ? <AlertTriangle size={14} /> :
               <div className="w-2 h-2 bg-current rounded-full" />}
            </div>
            <div className="flex-1 pt-0.5">
              <p className={`text-xs font-bold ${cp.status === 'alert' ? 'text-red-700' : 'text-gray-800'}`}>{cp.label}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                <Clock size={10} /> {cp.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'forecast'>('overview');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Top Ticker Bar */}
      <div className="bg-white border-b border-gray-200 py-3 overflow-x-auto">
        <div className="flex container mx-auto px-6">
          <div className="flex items-center text-blue-900 font-bold mr-6 text-sm whitespace-nowrap">
            <Activity className="mr-2" size={18}/> MARKET DATA
          </div>
          <div className="flex">
            {tickerData.map((item, idx) => (
              <TickerItem key={idx} {...item} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commercial Cockpit</h1>
            <p className="text-gray-500 mt-1">Trading, Risk & Logistics Overview | <span className="text-blue-600 font-medium">ABC. Co.</span></p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <FileText size={16}/> Download Report
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm">
              New Contract
            </button>
          </div>
        </header>

        {/* Risk Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Mark-to-Market (M2M)" 
            value="$42.5M" 
            subtext="Liquidation Value (Today)" 
            icon={DollarSign} 
            trend="up" 
          />
          <MetricCard 
            title="Value at Risk (VaR)" 
            value="$1.2M" 
            subtext="Max 1-Day Loss (95% Conf.)" 
            icon={AlertTriangle} 
            trend="flat"
            alertLevel="high"
          />
          <MetricCard 
            title="Crush Margin (SAF-UCO)" 
            value="$1,400/t" 
            subtext="Spread widening (Buy Signal)" 
            icon={Activity} 
            trend="up" 
          />
          <MetricCard 
            title="Open Position (Long)" 
            value="15k Tonnes" 
            subtext="Unhedged UCO Inventory" 
            icon={Database} 
            trend="down" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Deep Dive Margin Analyzer (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Expanded Margin Analyzer */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Search className="text-blue-600" size={20}/>
                    Margin Analyzer & Breakdown
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {viewMode === 'overview' 
                      ? 'Historical Margin Performance (Click to Forecast)' 
                      : 'AI Forecast: 6-Month Projected Cost & Revenue'}
                  </p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode('overview')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'overview' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Historical
                  </button>
                  <button 
                    onClick={() => setViewMode('forecast')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'forecast' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Forecast & Plan
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-80 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart 
                    data={viewMode === 'overview' ? historicalData : combinedData} 
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} domain={[0, 2600]} />
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'}}
                      labelStyle={{color: '#374151', fontWeight: 'bold', marginBottom: '5px'}}
                    />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                    
                    {/* The 3 Critical Lines */}
                    <Line 
                      type="monotone" 
                      dataKey="safPrice" 
                      stroke="#2563EB" 
                      strokeWidth={3} 
                      dot={true} 
                      name="Revenue (Market Price)" 
                      strokeDasharray={viewMode === 'forecast' ? "5 5" : ""} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalCost" 
                      stroke="#DC2626" 
                      strokeWidth={2} 
                      dot={true} 
                      name="Total Cost (Breakeven)" 
                      strokeDasharray={viewMode === 'forecast' ? "5 5" : ""} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ucoPrice" 
                      stroke="#9CA3AF" 
                      strokeWidth={2} 
                      dot={false} 
                      name="Raw Material Cost (UCO)" 
                      strokeDasharray={viewMode === 'forecast' ? "3 3" : ""} 
                    />

                    {viewMode === 'forecast' && (
                      <ReferenceLine x="Jun" stroke="#10B981" strokeDasharray="3 3" label={{ position: 'top',  value: 'Today', fill: '#10B981', fontSize: 12 }} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Recommendation Panel (Only visible in Forecast Mode) */}
              {viewMode === 'forecast' && (
                <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                      <Calculator size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">AI Recommendation (Oct Target)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Predicted Total Cost rises to <span className="font-semibold text-red-600">$1,550/t</span> due to Q4 feedstock squeeze.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 border-l border-purple-200 pl-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Min Selling Price</p>
                      <p className="text-xs text-gray-400">(Zero Margin)</p>
                      <p className="text-lg font-bold text-gray-700">$1,550/t</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600 uppercase font-bold">Recommended Price</p>
                      <p className="text-xs text-green-500">(+15% Target Margin)</p>
                      <p className="text-2xl font-bold text-green-700">$1,782/t</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inventory & Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inventory Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Physical Inventory</h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="location" type="category" width={100} tick={{fill: '#4B5563', fontSize: 11}} />
                      <Tooltip cursor={{fill: '#F3F4F6'}} />
                      <Bar dataKey="volume" radius={[0, 4, 4, 0]} barSize={24} name="Volume (t)">
                        {inventoryData.map((entry, index) => (
                          <rect key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Inventory Tracking (Interactive) */}
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-blue-800">
                  <Ship size={20} />
                  <h2 className="font-bold">Inventory Tracking</h2>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {selectedShipment ? (
                    <ShipmentDetail 
                      shipment={selectedShipment} 
                      onBack={() => setSelectedShipment(null)} 
                    />
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {shipmentData.map(shipment => (
                        <ShipmentCard 
                          key={shipment.id} 
                          shipment={shipment} 
                          onClick={setSelectedShipment} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contracts & Alerts (1/3 width) */}
          <div className="space-y-8">
            
            {/* The Book (Contract Data) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">The Book (Open Deals)</h2>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">3 Active</span>
              </div>
              <div className="space-y-3">
                {contractData.map((deal) => (
                  <div key={deal.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900">{deal.customer}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${deal.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {deal.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                      <div><span className="text-gray-400">Vol:</span> {deal.volume}</div>
                      <div><span className="text-gray-400">Prod:</span> {deal.product}</div>
                      <div><span className="text-gray-400">Price:</span> {deal.price}</div>
                      <div><span className="text-gray-400">Term:</span> {deal.term}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-blue-600 font-medium hover:underline">View All Contracts</button>
            </div>

            {/* Risk & Quality Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
              <div className="flex items-center gap-2 mb-4 text-red-700">
                <AlertTriangle size={20} />
                <h2 className="text-lg font-bold">Action Required</h2>
              </div>
              
              <div className="space-y-3">
                {/* Quality Spec Alert */}
                <div className="p-3 bg-red-50 rounded-md border border-red-100">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Droplet size={12}/> Quality Spec Alert
                  </p>
                  <p className="text-sm text-gray-800 font-medium">Batch #405 (Johor Tank)</p>
                  <p className="text-sm text-gray-600 mt-1">High Acidity (FFA 5.2%). Too acidic to refine directly.</p>
                  <div className="mt-2 flex gap-2">
                    <button className="text-xs bg-white border border-red-200 px-2 py-1 rounded text-red-700 font-medium">Hold</button>
                    <button className="text-xs text-red-600 underline">Notify Lab</button>
                  </div>
                </div>

                {/* Exposure Alert */}
                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
                  <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">VaR Breach Warning</p>
                  <p className="text-sm text-gray-700">Open Long Position on UCO exceeds daily limit.</p>
                  <button className="mt-2 text-xs font-medium text-yellow-700 hover:text-yellow-900 underline">Execute Hedge</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
