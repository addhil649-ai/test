/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead } from '../types';
import { 
  TrendingUp, 
  Users, 
  Layers, 
  Briefcase, 
  DollarSign, 
  ShieldAlert, 
  Radio, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  CheckCircle,
  FileText,
  Mail,
  Send,
  MessageSquare,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Building2,
  Globe,
  Sliders
} from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  tenderCount: number;
  dueDiligenceCount: number;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ leads, tenderCount, dueDiligenceCount, onNavigate }: DashboardProps) {
  // Global Time Filter State
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'q3'>('month');
  
  // Hover & selection states
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeAlertIndex, setActiveAlertIndex] = useState<number>(0);
  
  // State for interactive modals/drawers triggered from To-Do or Leads Actions
  const [selectedActionModal, setSelectedActionModal] = useState<{
    title: string;
    description: string;
    leadName?: string;
    product?: string;
    templateText?: string;
    type: 'whatsapp' | 'coa' | 'inquiry' | 'bid';
  } | null>(null);

  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Time Filter factor to calculate dynamic metrics representation
  const filterFactor = {
    today: 0.12,
    week: 0.45,
    month: 1.0,
    q3: 2.85
  }[timeFilter];

  // Raw calculations based on shared leads
  const totalLeads = leads.length;
  const gradeALeads = leads.filter(l => l.leadGrade === 'A').length;
  const highRiskLeads = leads.filter(l => l.riskLevel === '高').length;
  const pendingFollowups = leads.filter(l => l.status === '待联系' || l.status === '已回复').length;

  const totalPotentialValue = leads.reduce((acc, lead) => {
    if (lead.leadGrade === 'A') return acc + 18000;
    if (lead.leadGrade === 'B') return acc + 8000;
    if (lead.leadGrade === 'C') return acc + 3000;
    return acc;
  }, 0);

  // Pre-configured top products demand values for visuals
  const productDemands = [
    { name: 'Acetonitrile (乙腈)', count: Math.round(18 * filterFactor), percentage: 38, cas: '75-05-8', color: 'bg-indigo-500' },
    { name: 'Paracetamol (对乙酰氨基酚)', count: Math.round(12 * filterFactor), percentage: 25, cas: '103-90-2', color: 'bg-sky-500' },
    { name: 'Methanol (甲醇)', count: Math.round(9 * filterFactor), percentage: 19, cas: '67-56-1', color: 'bg-emerald-500' },
    { name: 'Acetone (丙酮)', count: Math.round(5 * filterFactor), percentage: 11, cas: '67-64-1', color: 'bg-amber-500' },
    { name: 'DMF (二甲基甲酰胺)', count: Math.round(3 * filterFactor), percentage: 7, cas: '68-12-2', color: 'bg-rose-500' },
  ];

  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  // Trend Alerts dynamic ticker notifications
  const trendAlerts = [
    {
      id: 1, 
      badge: '📈 市场动向', 
      text: '乙腈 (CAS: 75-05-8) 本周欧洲区社媒询盘量飙升 35%，海运排舱偏紧。',
      style: 'text-emerald-400 border-emerald-900 bg-emerald-950/20'
    },
    {
      id: 2, 
      badge: '⚠️ 付款预警', 
      text: '预警：某德国大型跨国买家企业信用评级发生变动，付款路径风险上升，请注意提单。',
      style: 'text-amber-400 border-amber-900 bg-amber-950/20'
    },
    {
      id: 3, 
      badge: '🔬 现货热销', 
      text: '对乙酰氨基酚 (CAS: 103-90-2) 南亚港口最新成交均价周环比上涨 4.2%，欧洲低端现货紧缺。',
      style: 'text-sky-400 border-sky-900 bg-sky-950/20'
    }
  ];

  // Helper to handle interactive copies
  const triggerCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6" id="dashboard-view">
      
      {/* 1. TOP HEADER & TIME FILTER CONTROL PANEL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200/60 font-bold">
                ChemGrowth AI Suite v1.3 • 工作状态：全网商机捕获中
              </span>
            </div>
            <h2 className="text-2xl font-sans font-extrabold mt-2 tracking-tight text-slate-900 animate-fade-in">下午好！AI 正在为您搜寻全球化学品商机</h2>
            <p className="text-slate-500 text-xs mt-1 max-w-xl leading-relaxed">
              系统当前已深度整合国际展会意向包、专业原料药社媒论坛及全球海关到港数据，自动拦截意向风险。
            </p>
          </div>
          
          {/* Segmented Time Filter */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">全局数据汇总范围</span>
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex gap-1">
              {(['today', 'week', 'month', 'q3'] as const).map((t) => {
                const labels = { today: '今日', week: '本周', month: '本月', q3: 'Q3季度' };
                const isActive = timeFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white text-indigo-700 font-bold border border-slate-200 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {labels[t]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Trend Alert Ticker */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
          <div className="flex items-center gap-2.5 flex-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${trendAlerts[activeAlertIndex].style}`}>
              {trendAlerts[activeAlertIndex].badge}
            </span>
            <span className="text-xs text-slate-600 font-medium tracking-wide">
              {trendAlerts[activeAlertIndex].text}
            </span>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {trendAlerts.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveAlertIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${activeAlertIndex === i ? 'bg-emerald-500 scale-125' : 'bg-slate-300 hover:bg-slate-400'}`}
                title={`预警项 ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. AI SMART NEXT-BEST-ACTION HUB (待办中心) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-emerald-50 rounded-md border border-emerald-200/60">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">AI 智能待办工作台 (Smart To-Dos)</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">优先级算法：商机临界点 & 意向衰退概率</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Apex BioLab */}
          <div className="bg-white p-4 rounded-xl border border-rose-100 hover:border-rose-200 hover:bg-rose-50/10 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xs">
            <span className="absolute top-0 right-0 py-0.5 px-2.5 bg-rose-50 text-rose-600 border-l border-b border-rose-100 text-[9px] font-bold tracking-widest font-mono uppercase">
              🔥 紧急测样
            </span>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-slate-800 font-mono">India Apex BioLab</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                发往孟买的 HPLC 色谱乙腈样品已抵达买方实验室，质检测试预计今日下午开始，需立即建联获取指标反馈。
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedActionModal({
                  title: "一键生成 WhatsApp 测样跟踪问候",
                  description: "系统已自动调取该批次 2L HPLC Acetonitrile 样品的分析色谱 COA 与 MSDS 批次匹配信息，并为您生成了高精度的 WhatsApp 跟踪话术。",
                  leadName: "Dr. Rajesh K. (Lab Principal)",
                  product: "Acetonitrile / CAS: 75-05-8",
                  templateText: "Hi Dr. Rajesh, this is Zhang from ChemGrowth. Our logistics API tracker indicates the 2L HPLC grade Acetonitrile test sample is arriving today at Apex BioLab. I sent the matching HPLC certificate of analysis (COA) and specs to your email (dr.rajesh@apexbiolab.in) this morning. Please let me know if you require any chromatographic baseline parameters or trial assistance during your validation testing! Looking forward to hearing from you. Cheers!",
                  type: 'whatsapp'
                })}
                className="w-full py-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors rounded-lg text-xs font-bold font-sans cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                一键生成 WhatsApp 问候
              </button>
            </div>
          </div>

          {/* Card 2: Bayer Inquiry */}
          <div className="bg-white p-4 rounded-xl border border-amber-100 hover:border-amber-200 hover:bg-amber-50/10 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xs">
            <span className="absolute top-0 right-0 py-0.5 px-2.5 bg-amber-50 text-amber-700 border-l border-b border-amber-100 text-[9px] font-bold tracking-widest font-mono uppercase">
              ⏰ 定向解答
            </span>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <span className="text-xs font-bold text-slate-800 font-mono">Bayer AG (Germany)</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                关于对乙酰氨基酚 (Paracetamol USP) 的专属杂质检验问询已在 CRM 搁置 48 小时，买家可能正在流失。
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button 
                onClick={() => {
                  setSelectedActionModal({
                    title: "去处理定向问询 - 编写杂质限量批件",
                    description: "买方重点关注 Paracetamol (对乙酰氨基酚) 原料中的 p-Aminophenol (对氨基酚) 痕量杂质限制（标准为不超过 50ppm）。请将我司专属的 HPLC 质检分析谱包、重金属限量 COA 以及符合欧盟药典 (EP) 标准的手册组合发送：",
                    leadName: "Bayer Sourcing Dept",
                    product: "Paracetamol / CAS: 103-90-2",
                    templateText: "Dear Bayer Sourcing Specialist,\n\nIn response to your query regarding the p-aminophenol impurity limit in our Paracetamol USP, we confidently guarantee a maximum range of < 25ppm (well beneath the standard 50ppm USP limit). \n\nI have compiled our GC-MS spectrum analyses, the raw chromatography reports, and CEP / DMF certificate files. Let us finalize our dispatch parameters.\n\nBest regards,\nChemGrowth Sourcing Team",
                    type: 'inquiry'
                  });
                }}
                className="w-full py-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 transition-colors rounded-lg text-xs font-bold font-sans cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                立即解答并发送谱图
              </button>
            </div>
          </div>

          {/* Card 3: Zhejiang Tender */}
          <div className="bg-white p-4 rounded-xl border border-sky-100 hover:border-sky-200 hover:bg-sky-50/10 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xs">
            <span className="absolute top-0 right-0 py-0.5 px-2.5 bg-sky-50 text-sky-600 border-l border-b border-sky-100 text-[9px] font-bold tracking-widest font-mono uppercase">
              📄 内贸竞标
            </span>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-400 rounded-full" />
                <span className="text-xs font-bold text-slate-800 font-mono">浙江省环境科学研究院</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                色谱级分析试剂 (DMF、甲醇等) 15吨标书交递截止日期仅剩下 3 天，标书内涉原料等级认证及安全资质包装未完成。
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button 
                onClick={() => onNavigate('tender')}
                className="w-full py-2 bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-100 hover:text-sky-800 transition-colors rounded-lg text-xs font-bold font-sans cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                查看标书筹备进度
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. CHEMICAL-SPECIFIC SALES FUNNEL (大货销售转化漏斗) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>B2B 化学原料药/大货销售转化漏斗 (Bulk Sales Funnel)</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono border border-emerald-200 font-bold">
                以品质复测 (Sample Tech Check) 为核心
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              各交易生命周期中的客群实时归档，化学品贸易通常 80% 的成交概率决定于小样检测 (Sample Validation)。
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" />正常</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />核心节点</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />目标产出</span>
          </div>
        </div>

        {/* Funnel Chevron / Card Chain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Stage 1: All Scan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100/50 hover:border-slate-300 transition-all text-center flex flex-col justify-between h-36 shadow-xs select-none">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">阶段 01 • SOURCING</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">全网扫描 / Lead</h4>
            </div>
            <div className="my-2">
              <span className="text-2xl font-sans tracking-tight text-slate-900 font-extrabold font-bold">
                {Math.round(180 * filterFactor)} <span className="text-xs font-sans font-normal text-slate-500">家</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 leading-relaxed">展会、海关、社媒多源抓取</span>
            </div>
          </div>

          {/* Stage 2: Contact */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100/50 hover:border-slate-300 transition-all text-center flex flex-col justify-between h-36 shadow-xs select-none">
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                <span>阶段 02</span>
                <span className="text-sky-600 font-semibold">78.4%</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mt-1">建联触达 / Contact</h4>
            </div>
            <div className="my-2">
              <span className="text-2xl font-sans tracking-tight text-slate-900 font-extrabold font-bold">
                {Math.round(141 * filterFactor)} <span className="text-xs font-sans font-normal text-slate-500">家</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 leading-relaxed">开发信投递与社媒建联</span>
            </div>
          </div>

          {/* Stage 3: COA Sent */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-slate-100/50 hover:border-slate-300 transition-all text-center flex flex-col justify-between h-36 shadow-xs select-none">
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                <span>阶段 03</span>
                <span className="text-emerald-600 font-semibold">57.1%</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mt-1">谱图确认 / COA Sent</h4>
            </div>
            <div className="my-2">
              <span className="text-2xl font-sans tracking-tight text-slate-900 font-extrabold font-bold">
                {Math.round(81 * filterFactor)} <span className="text-xs font-sans font-normal text-slate-500">家</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 leading-relaxed">HPLC、CEP等质量材料审计</span>
            </div>
          </div>

          {/* Stage 4: Sample Testing (Highlighted Key Node) */}
          <div className="bg-amber-50/45 p-4 rounded-xl border border-amber-200 hover:border-amber-300 hover:bg-amber-50/70 transition-all text-center flex flex-col justify-between h-36 relative overflow-hidden ring-1 ring-amber-500/10 shadow-xs select-none">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500 shadow-xs" />
            <div>
              <div className="flex justify-between items-center text-[10px] text-amber-700 font-bold uppercase tracking-wider font-mono">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  核心验证首关
                </span>
                <span>43.5%</span>
              </div>
              <h4 className="text-xs font-bold text-amber-800 mt-1">小样寄送与测样 / Sample</h4>
            </div>
            <div className="my-2">
              <span className="text-2xl font-sans tracking-tight text-amber-800 font-extrabold font-bold">
                {Math.round(35 * filterFactor)} <span className="text-xs font-sans font-normal text-amber-600">批次</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-amber-750 font-medium font-sans leading-relaxed">品质过检确定 80% 大货成交</span>
            </div>
          </div>

          {/* Stage 5: Bulk Deal */}
          <div className="bg-emerald-50/45 p-4 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/75 transition-all text-center flex flex-col justify-between h-36 relative overflow-hidden shadow-xs select-none">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500" />
            <div>
              <div className="flex justify-between items-center text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">
                <span>终期产出</span>
                <span>总体 6.2%</span>
              </div>
              <h4 className="text-xs font-bold text-emerald-800 mt-1">大货成交 / Bulk Deal</h4>
            </div>
            <div className="my-2">
              <span className="text-2xl font-sans tracking-tight text-emerald-800 font-extrabold font-bold">
                {Math.round(11 * filterFactor)} <span className="text-xs font-sans font-normal text-emerald-600">笔签单</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 font-bold font-mono leading-relaxed">货款安全及定点排舱首载</span>
            </div>
          </div>

        </div>

        {/* Funnel quick conversion analytical insights */}
        <div className="mt-5 p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">
              <strong>诊断分析</strong>: 当前跟进池中，共有 <strong>{Math.round(35 * filterFactor)}</strong> 家客户处于寄样测试反馈期，<strong>“小样检测 / Sample Testing”</strong> 阶段成交突破率提升 10% 可直接拉升大货成交额外收益 <strong>${Math.round(180000 * filterFactor).toLocaleString()} USD</strong>。建议立即利用 [发送图谱] 或 WhatsApp 话术向该节点客户进行二次品质加推。
            </span>
          </div>
          <button 
            onClick={() => onNavigate('pipeline')}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 shrink-0 border-b border-emerald-200 hover:border-emerald-500 pb-0.5 transition-all text-right uppercase tracking-wider cursor-pointer font-sans"
          >
            去往 CRM 跟进池跟进小样
          </button>
        </div>
      </div>

      {/* 4. MAIN STATISTICAL VISUALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left component: Top products demands with CAS info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">热门品类采购偏好 (Top Demands)</h3>
              <p className="text-xs text-slate-500 mt-0.5">多维渠道提及偏好趋势与化学登记号对应</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 py-1 px-2.5 rounded-md border border-emerald-150">
              数据周期：实时运算
            </span>
          </div>

          <div className="space-y-4">
            {productDemands.map((prod) => (
              <div 
                key={prod.name} 
                className="group relative"
                onMouseEnter={() => setHoveredProduct(prod.name)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{prod.name}</span>
                    <span className="font-mono text-[10px] bg-slate-50 px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded">CAS: {prod.cas}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono">{prod.count} 次提及</span>
                    <span className="font-bold text-slate-800 font-mono">{prod.percentage}%</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`${prod.color} h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${prod.percentage}%`,
                      filter: hoveredProduct && hoveredProduct !== prod.name ? 'opacity(40%)' : 'none'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right component: Sources Distribution & quick CRM links */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">客群画像分布 (CRM Profiles)</h3>
            
            {/* Source channel distribution */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">来源渠道分布</h4>
              <div className="space-y-2.5">
                {Object.entries(
                  leads.reduce((acc: Record<string, number>, lead) => {
                    acc[lead.source] = (acc[lead.source] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([src, count], index) => {
                  const colors = ['bg-[#10b981]', 'bg-[#0ea5e9]', 'bg-[#14b8a6]', 'bg-[#f59e0b]'];
                  const color = colors[index % colors.length];
                  const percentage = Math.round((count / Math.max(1, totalLeads)) * 100);
                  return (
                    <div key={src} className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-xs font-semibold text-slate-600 w-24 truncate">{src}</span>
                      <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-200">
                        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-800 shrink-0">{count} 份</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Geographical profiles */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">热点采购国家 Top 3</h4>
              <div className="space-y-2">
                {Object.entries(
                  leads.reduce((acc: Record<string, number>, lead) => {
                    acc[lead.country] = (acc[lead.country] || 0) + 1;
                    return acc;
                  }, {})
                ).slice(0, 3).map(([cty, count], index) => {
                  const borderL = ['border-l-[#10b981]', 'border-l-[#0ea5e9]', 'border-l-[#a855f7]'][index % 3];
                  return (
                    <div key={cty} className={`flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200 border-l-2 ${borderL}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 bg-white w-5 h-5 flex items-center justify-center rounded border border-slate-200 font-mono">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{cty}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">{count} 条记录</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button 
            id="dash-btn-radar-all"
            onClick={() => onNavigate('radar')}
            className="w-full flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700 transition-colors py-2 text-xs font-semibold rounded-lg font-sans cursor-pointer mt-5"
          >
            进入意向雷达库
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 5. LEADS TABLE TIMELINE UPGRADE: "快捷处理工作台" (Quick Action Workspace) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>快捷处理工作台 (Inquiry Quick-Action Panel)</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 py-0.5 px-2 rounded font-mono font-bold">
                最新高意向线索
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              可在此直接为买方匹配谱图、发送邮件、或生成 WhatsApp 开发文书快速建联。
            </p>
          </div>
          <button 
            id="dash-btn-view-pipeline"
            onClick={() => onNavigate('pipeline')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 shadow-xs"
          >
            跟进池 CRM 视图
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-auto border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">公司信息 / Lead Profile</th>
                <th className="py-3 px-4">急迫度 / Urgency</th>
                <th className="py-3 px-4">采购目标 (CAS)</th>
                <th className="py-3 px-4">核心需求 / Pain Points</th>
                <th className="py-3 px-4 text-center">AI 估值</th>
                <th className="py-3 px-4 text-center">当前进度</th>
                <th className="py-3 px-4 text-right">快捷协同 / Quick Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition-all group">
                  
                  {/* Company and contacts info */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {lead.companyName}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {lead.country} • {lead.contactName || '采购主管'} ({lead.contactTitle || 'Purchase Head'})
                      </span>
                    </div>
                  </td>
                  
                  {/* Urgency Level Tag */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      lead.urgencyLevel === '高' 
                        ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                        : lead.urgencyLevel === '中'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200/60'
                    }`}>
                      {lead.urgencyLevel === '高' ? '⚡ 高 • 急单' : lead.urgencyLevel === '中' ? '中 • 关注' : '低'}
                    </span>
                  </td>

                  {/* CAS & Chem Item */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-xs">{lead.productKeywords}</span>
                      {lead.casNo && (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1 border border-slate-200 rounded w-fit select-all mt-0.5">
                          CAS: {lead.casNo}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Pain Points / Intents */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 max-w-[220px] truncate" title={lead.intentDescription}>
                    {lead.intentDescription}
                  </td>

                  {/* AI Valuation (Matching intent score matrix) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-xs font-bold text-emerald-700">${(lead.leadGrade === 'A' ? 18000 : lead.leadGrade === 'B' ? 8000 : 3000).toLocaleString()}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">等级：{lead.leadGrade}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                      lead.status === '待联系' 
                        ? 'bg-slate-50 text-slate-500 border-slate-200'
                        : lead.status === '已发送开发信'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : lead.status === '已回复'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                        : 'bg-purple-50 text-purple-650 border-purple-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>

                  {/* Quick operations */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Match & send COA package */}
                      <button
                        onClick={() => setSelectedActionModal({
                          title: `品质配对：一键匹配并生成 ${lead.productKeywords} 质检包`,
                          description: `正在为 ${lead.companyName} 动态计算原料检测报告。已抓取我司分析中心最匹配该特定询单指标的 GC-MS 精细气相谱图、ICP重金属无机杂质残留包，并满足欧盟EP / 美国USP限量标准。`,
                          leadName: lead.contactName || "Purchase Head",
                          product: `${lead.productKeywords} (CAS: ${lead.casNo})`,
                          templateText: `Hello ${lead.contactName || 'Sir/Madam'},\n\nFollowing your dynamic chemical specification inquiry, we have processed the sample specifications from batch #P-${lead.id}.\n\nAttached are our signature raw HPLC and GC assay reports confirming purity above the requested standard. The MSDS safety packet and ISO registration have also been sent.\n\nLet me know your feedback on this batch.`,
                          type: 'coa'
                        })}
                        className="py-1 px-2 text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/60 hover:text-emerald-800 transition-colors rounded cursor-pointer font-sans font-bold"
                        title="发送品质图谱色谱检测包 (COA)"
                      >
                        发送图谱
                      </button>

                      {/* Reach via template Copilot */}
                      <button
                        onClick={() => {
                          // Copy draft and trigger context-tab jump!
                          triggerCopy(`Hi ${lead.contactName || 'Friend'}, standard specification package for bulk ${lead.productKeywords} (CAS: ${lead.casNo}) is loaded on ChemGrowth.`);
                          alert("基础开发话术已自动复制到剪贴板！正在为您跳转至 [开发话术助手] 深度润色邮件与邮件渠道投递。");
                          onNavigate('outreach');
                        }}
                        className="py-1 px-2 text-[11px] bg-slate-50 border border-slate-200 text-sky-700 hover:bg-slate-100 transition-colors rounded cursor-pointer font-sans font-bold"
                        title="复制快捷句段并跳转 AI 开发助手"
                      >
                        一键触达
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. GLASSMORPHISM DETAIL MODAL / WORKBENCH DRAWER */}
      {selectedActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-700 relative overflow-hidden transition-all duration-300 my-auto">
            <span className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-500" />
            
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                {selectedActionModal.title}
              </h4>
              <button 
                onClick={() => {
                  setSelectedActionModal(null);
                  setCopiedText(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedActionModal.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 animation-none">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">目标客户：</span>
                  <span className="text-slate-700 font-bold">{selectedActionModal.leadName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">匹配药品级产品：</span>
                  <span className="text-emerald-700 font-mono text-[10px]">{selectedActionModal.product}</span>
                </div>
                {selectedActionModal.type === 'coa' && (
                  <div className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1.5 rounded border border-emerald-100 font-medium">
                    🗃️ 匹配资源：3份 PDF (HPLC Chrom-Chart.pdf, COA-Purity.pdf, Material-MSDS_Sina.pdf)
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    自动化推荐话术 / Draft content
                  </label>
                  {selectedActionModal.templateText && (
                    <button
                      onClick={() => triggerCopy(selectedActionModal.templateText || "")}
                      className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                          已成功复制!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          复制代码
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <textarea
                  readOnly
                  value={selectedActionModal.templateText}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 rounded-lg focus:outline-none focus:border-slate-300 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3.5 pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSelectedActionModal(null);
                    setCopiedText(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200"
                >
                  取消/关闭
                </button>
                <button
                  onClick={() => {
                    if (selectedActionModal.templateText) {
                      triggerCopy(selectedActionModal.templateText);
                    }
                    alert("开发包已发送/准备完毕！正在跳转开发助手，可搭配邮件自动完成发送...");
                    setSelectedActionModal(null);
                    onNavigate('outreach');
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-450 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  复制并进入开发助手发送
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
