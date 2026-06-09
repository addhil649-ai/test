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
  Search,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  tenderCount: number;
  dueDiligenceCount: number;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ leads, tenderCount, dueDiligenceCount, onNavigate }: DashboardProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Calculate stats based on state
  const totalLeads = leads.length;
  const gradeALeads = leads.filter(l => l.leadGrade === 'A').length;
  const highRiskLeads = leads.filter(l => l.riskLevel === '高').length;
  const pendingFollowups = leads.filter(l => l.status === '待联系' || l.status === '已回复').length;

  // Potential transaction calculation: A-grade average $15k, B-grade $8k, C-grade $3k
  const totalPotentialValue = leads.reduce((acc, lead) => {
    if (lead.leadGrade === 'A') return acc + 18000;
    if (lead.leadGrade === 'B') return acc + 8000;
    if (lead.leadGrade === 'C') return acc + 3000;
    return acc;
  }, 0);

  // Distribution calculations
  const sourceCount = leads.reduce((acc: Record<string, number>, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const countryCount = leads.reduce((acc: Record<string, number>, lead) => {
    acc[lead.country] = (acc[lead.country] || 0) + 1;
    return acc;
  }, {});

  // Pre-configured top products demand values for visuals
  const productDemands = [
    { name: 'Acetonitrile (乙腈)', count: 18, percentage: 38, cas: '75-05-8', color: 'bg-indigo-500' },
    { name: 'Paracetamol (对乙酰氨基酚)', count: 12, percentage: 25, cas: '103-90-2', color: 'bg-sky-500' },
    { name: 'Methanol (甲醇)', count: 9, percentage: 19, cas: '67-56-1', color: 'bg-emerald-500' },
    { name: 'Acetone (丙酮)', count: 5, percentage: 11, cas: '67-64-1', color: 'bg-amber-500' },
    { name: 'DMF (二甲基甲酰胺)', count: 3, percentage: 7, cas: '68-12-2', color: 'bg-rose-500' },
  ];

  const recentLeads = [...leads].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#121214] to-[#151518] p-6 rounded-2xl border border-slate-800 text-white shadow-xl/10 gap-4">
        <div>
          <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
            AI TRADE GROWTH PORTAL v1.2
          </span>
          <h2 className="text-2xl font-serif italic mt-2 tracking-tight text-white">下午好！AI 正在为您搜寻全球化学品商机</h2>
          <p className="text-slate-400 text-xs mt-1.5 max-w-xl">
            系统已整合展会名录、前沿研究论坛、社媒公开询价与近期招投标公告，自动进行意向过滤与风险等级评估。
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button 
            id="dash-btn-scan"
            onClick={() => onNavigate('radar')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors px-4 py-2 text-xs font-semibold rounded-lg text-black font-sans cursor-pointer focus:outline-none"
          >
            <Radio className="w-4 h-4 animate-pulse text-black" />
            新建线索扫描
          </button>
          <button 
            id="dash-btn-tender"
            onClick={() => onNavigate('tender')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 transition-colors px-4 py-2 text-xs font-semibold rounded-lg text-slate-300 border border-slate-800 font-sans cursor-pointer focus:outline-none"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            进入招投标助手
          </button>
        </div>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-medium">今日新增线索</span>
            <span className="p-1.5 bg-slate-900 text-emerald-400 rounded-lg group-hover:bg-slate-800 transition-colors">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif tracking-tight text-white">{totalLeads * 8 + 4}</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1 font-mono">↑ 12% 较昨日</div>
          </div>
        </div>

        <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-medium">A类高价值线索</span>
            <span className="p-1.5 bg-slate-900 text-amber-500 rounded-lg group-hover:bg-slate-800 transition-colors">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif tracking-tight text-white">{gradeALeads}</div>
            <div className="text-[10px] text-amber-500 font-bold mt-1 font-sans">重点开发客群</div>
          </div>
        </div>

        <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-medium">近期招投标机会</span>
            <span className="p-1.5 bg-slate-900 text-sky-400 rounded-lg group-hover:bg-slate-800 transition-colors">
              <Briefcase className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif tracking-tight text-white">{tenderCount}</div>
            <div className="text-[10px] text-sky-400 font-medium mt-1">2条高匹配标讯</div>
          </div>
        </div>

        <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-medium">潜在推算成交额</span>
            <span className="p-1.5 bg-slate-900 text-emerald-400 rounded-lg group-hover:bg-slate-800 transition-colors">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-serif tracking-tight text-white font-medium">
              ${totalPotentialValue.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">智能客单预估</div>
          </div>
        </div>

        <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-medium">待跟进线索池</span>
            <span className="p-1.5 bg-slate-900 text-purple-400 rounded-lg group-hover:bg-slate-800 transition-colors">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif tracking-tight text-white">{pendingFollowups}</div>
            <div className="text-[10px] text-purple-400 font-medium mt-1">跟进池待触达</div>
          </div>
        </div>

        <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 hover:border-rose-950/40 transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-medium">安全风控预警</span>
            <span className={`p-1.5 rounded-lg transition-colors ${highRiskLeads > 0 ? 'bg-rose-950/40 text-rose-400 animate-pulse' : 'bg-slate-900 text-slate-500'}`}>
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif tracking-tight text-white">{highRiskLeads}</div>
            <div className={`text-[10px] font-medium mt-1 ${highRiskLeads > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              {highRiskLeads > 0 ? '建议深度排查' : '暂无高级别风险'}
            </div>
          </div>
        </div>
      </div>

      {/* Main visual distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Hot demanded Chemicals */}
        <div className="bg-[#0E0E10] p-6 rounded-xl border border-slate-800 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">热门需求产品 (Top Products)</h3>
              <p className="text-xs text-slate-500 mt-0.5">全球各渠道采购频次分布及CAS化学登记号关联度</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/20 py-1 px-2.5 rounded-md border border-emerald-905/30">
              数据源: AI 意向识别库
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
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">{prod.name}</span>
                    <span className="font-mono text-xs text-slate-550">CAS: {prod.cas}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{prod.count} 次提及</span>
                    <span className="font-bold text-white font-mono">{prod.percentage}%</span>
                  </div>
                </div>
                
                {/* Progress bar wrap */}
                <div className="w-full bg-[#151518] h-1.5 rounded-full overflow-hidden border border-slate-800">
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

          <div className="mt-6 p-4 rounded-lg bg-emerald-950/10 border border-emerald-900/30 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75 animate-duration-2000"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span><strong>智能决策建议:</strong> 乙腈(Acetonitrile) 与对乙酰氨基酚 (Paracetamol) 近期在欧洲和南亚询价量上涨，可向跟进池中处于 <code>待联系</code> 或 <code>已发送开发信</code> 状态的客群增加产品资料分发。</span>
            </div>
          </div>
        </div>

        {/* Right column: Sources & Countries Distributions */}
        <div className="bg-[#0E0E10] p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-4">线索多维分布 (Lead Channels)</h3>
            
            {/* Source channel distribution */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">来源渠道分布</h4>
              <div className="space-y-2.5">
                {Object.entries(sourceCount).map(([src, count], index) => {
                  const colors = ['bg-[#10b981]', 'bg-[#0ea5e9]', 'bg-[#14b8a6]', 'bg-[#f59e0b]'];
                  const color = colors[index % colors.length];
                  const percentage = Math.round((count / Math.max(1, totalLeads)) * 100);
                  return (
                    <div key={src} className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-xs font-semibold text-slate-400 w-24 truncate">{src}</span>
                      <div className="flex-1 bg-[#151518] h-1 rounded-full overflow-hidden border border-slate-800">
                        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="font-mono text-xs font-bold text-white">{count} 笔</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Region / Country distribution */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">目标国家 Top 3</h4>
              <div className="space-y-2">
                {Object.entries(countryCount).slice(0, 3).map(([cty, count], index) => {
                  const colors = ['border-l-[#10b981]', 'border-l-[#0ea5e9]', 'border-l-[#a855f7]'];
                  const borderL = colors[index % colors.length];
                  return (
                    <div key={cty} className={`flex justify-between items-center p-2 rounded bg-[#121214] border border-slate-800 border-l-2 ${borderL}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 w-5 h-5 flex items-center justify-center rounded border border-slate-800 font-mono">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{cty}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">{count} 条线索</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button 
            id="dash-btn-radar-all"
            onClick={() => onNavigate('radar')}
            className="w-full flex items-center justify-center gap-1 bg-[#121214] border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors py-2 text-xs font-semibold rounded-lg font-sans cursor-pointer mt-4"
          >
            查看全部线索
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Under Section: Recent New Leads Timeline */}
      <div className="bg-[#0E0E10] p-6 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">最新发现的高价值线索</h3>
            <p className="text-xs text-slate-500 mt-0.5">AI 最新扫描过滤结果，带有实时意向评析与下次跟进提示</p>
          </div>
          <button 
            id="dash-btn-view-pipeline"
            onClick={() => onNavigate('pipeline')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
          >
            管理我的跟进池
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-auto border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[10px] font-semibold uppercase font-sans tracking-wider">
                <th className="py-3 px-4">公司名称</th>
                <th className="py-3 px-4">国家</th>
                <th className="py-3 px-2">来源</th>
                <th className="py-3 px-4">采购目标 (CAS)</th>
                <th className="py-3 px-2 text-center">AI 评级</th>
                <th className="py-3 px-4">采购意向描述</th>
                <th className="py-3 px-4 text-right">跟进进度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#121214]/65 transition-colors group">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <div className="flex flex-col">
                      <span>{lead.companyName}</span>
                      <span className="text-[10px] font-normal text-slate-500 mt-0.5">{lead.contactName} ({lead.contactTitle})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-medium">{lead.country}</td>
                  <td className="py-3.5 px-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      lead.source === '展会雷达' 
                        ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900/30'
                        : lead.source === '社媒意向'
                        ? 'bg-sky-950/30 text-sky-400 border-sky-900/30'
                        : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30'
                    }`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-350">{lead.productKeywords}</span>
                      {lead.casNo && <span className="text-[10px] text-slate-500 mt-0.5">CAS: {lead.casNo}</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className={`inline-flex w-6 h-6 rounded items-center justify-center text-xs font-extrabold font-sans ${
                      lead.leadGrade === 'A' 
                        ? 'bg-amber-950 text-amber-400 border border-amber-900/50' 
                        : lead.leadGrade === 'B' 
                        ? 'bg-blue-950 text-blue-400 border border-blue-900/50' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {lead.leadGrade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-450 max-w-xs truncate" title={lead.intentDescription}>
                    {lead.intentDescription}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                      lead.status === '待联系' 
                        ? 'bg-slate-900 text-slate-400 border-slate-800'
                        : lead.status === '已发送开发信'
                        ? 'bg-blue-950/60 text-blue-400 border-blue-900/40'
                        : lead.status === '已回复'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900/40 animate-pulse'
                        : 'bg-purple-950/60 text-purple-400 border-purple-900/40'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
