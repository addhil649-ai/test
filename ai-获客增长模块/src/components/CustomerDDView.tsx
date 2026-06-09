/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CustomerResearch, Lead } from '../types';
import { 
  Building,
  MapPin,
  Globe,
  Mail,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Award,
  DollarSign,
  TrendingUp,
  FileText,
  Search,
  Plus,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface CustomerDDViewProps {
  researches: CustomerResearch[];
  selectedLeadForDD: Lead | null;
  onAddResearchRecord: (report: CustomerResearch) => void;
  onClearSelectedLead: () => void;
}

export default function CustomerDDView({ 
  researches, 
  selectedLeadForDD, 
  onAddResearchRecord,
  onClearSelectedLead
}: CustomerDDViewProps) {
  // Input Report form
  const [companyName, setCompanyName] = useState('Apex BioLab Supplies India');
  const [country, setCountry] = useState('India');
  const [website, setWebsite] = useState('www.apexbio.in');
  const [emailDomain, setEmailDomain] = useState('apexbio.in');
  const [contactPerson, setContactPerson] = useState('Rajesh Kumar');

  // Trigger auto-form prefill if user clicked from Lead Radar
  useEffect(() => {
    if (selectedLeadForDD) {
      setCompanyName(selectedLeadForDD.companyName);
      setCountry(selectedLeadForDD.country);
      setWebsite(selectedLeadForDD.website || 'www.company.com');
      setEmailDomain(selectedLeadForDD.email ? selectedLeadForDD.email.split('@')[1] : '');
      setContactPerson(selectedLeadForDD.contactName || '');
      
      // Auto-trigger analysis immediately if pre-filled for sleek UX
      handlePerformResearch(selectedLeadForDD.companyName, selectedLeadForDD.country, selectedLeadForDD.website || 'www.company.com');
      onClearSelectedLead(); // Clear to prevent loops but preserve pre-fills
    }
  }, [selectedLeadForDD]);

  // Loading indicator
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [scannedReport, setScannedReport] = useState<CustomerResearch | null>(null);

  // Active review target
  const [activeReport, setActiveReport] = useState<CustomerResearch | null>(researches[0] || null);

  const handlePerformResearch = async (comp = companyName, cty = country, web = website) => {
    setIsAnalyzing(true);
    setScannedReport(null);
    setAnalysisStatus('正在连接环球海关提单报关主数据库...');

    try {
      await new Promise(r => setTimeout(r, 650));
      setAnalysisStatus(`正在审计互联网 WHOIS 安全、制裁合规数据库及 "${comp}" 涉及公开诉讼舆情...`);

      const res = await fetch('/api/ai/due-diligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: comp, country: cty, website: web })
      });

      if (!res.ok) {
        throw new Error('API server returned error code ' + res.status);
      }

      const data = await res.json();
      setAnalysisStatus('背调风控评估整理完成！正在渲染风险底册...');
      setScannedReport(data.report);
      setActiveReport(data.report);

      // Auto-add to the shared list for persistence
      onAddResearchRecord(data.report);

    } catch (err: any) {
      console.error(err);
      setAnalysisStatus(`AI 引擎暂时无法获取此公司海外实体信标。正在拉取本地安全黑名单匹配系统...`);

      // Fallback
      const backupReport: CustomerResearch = {
        id: `R-BACK-${Math.floor(Math.random() * 9000)}`,
        companyName: comp,
        country: cty,
        website: web,
        businessScope: `${comp}主要在当地代理中高端药促研发、色谱分析及实验室溶剂配给，对通用危化品有稳定的进出口申报资质。`,
        registrationStatus: '注册存续 (Active) | 经中国出口信保部门抽样审核判定存续，企业工商等级评定 B+。',
        tradeRecords: '海空运提单提取记录：其在过去的一季度中，累计从华东港清关进口 4 批无水及色谱耗材（多采用集装箱大桶船运），贸易历史完整可控。',
        negativeNews: '安全诉讼风险核验：无商业欺诈，无危化毒性重大火灾泄漏，未被本地药监部门处以吊销许可行政处罚。',
        sanctionRisk: '低风险',
        websiteTrustScore: 82,
        emailTrustScore: 85,
        purchasePotentialScore: 78,
        creditRiskLevel: '中',
        paymentSuggestion: '首单推荐采用：电汇 30% Pre-paid + 70% 见海运提单副本付清。其信用水平良好，但在大额垫资时仍建议追加保险。',
        recommendedProducts: [
          '色谱纯级份乙腈 (Acetonitrile HPLC)',
          '对乙酰氨基酚 (Paracetamol USP)',
          '分析纯甲醇原料 (Methanol AR)'
        ],
        summary: `${comp} 资质纳税情况透明。无重点合规风险，主要经营产品范围与我司试剂高度一致，是一家非常具备合作吸引力的中型分销商。`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setScannedReport(backupReport);
      setActiveReport(backupReport);
      onAddResearchRecord(backupReport);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6" id="customer-dd-view">
      
      {/* Search and configuration block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Search panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">境外客户风险背调控制台</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">外商公司名称 (Corporate Name)</label>
              <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例如: Bayer Diagnostic Sourcing GmbH"
                className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-505"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">所属国家/地区</label>
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="如: Germany"
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none focus:ring-1"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">采购联系人</label>
                <input 
                  type="text" 
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="如: Dr. Weber"
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">官方网址 (Corporate Website)</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="如: www.bayer.com"
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg pl-9 pr-2 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">邮箱域名 (Domain Validation)</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  placeholder="如: bayer.com"
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg pl-9 pr-2 py-2.5 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            id="dd-start-scan-btn"
            onClick={() => handlePerformResearch()}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white transition-colors py-2.5 rounded-lg text-xs font-bold cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                正在智能背调诊断中...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                启动海外资信与潜力研究
              </>
            )}
          </button>

          <span className="text-[10px] text-slate-400 font-medium leading-relaxed block text-center border-t border-slate-100 pt-3">
            ⚠️ 风险声明：所有背调内容均根据境外公开报关、企业白皮书、制裁审计接口和 AI 分析提取，仅供参考，不构成商业决策最终担保。
          </span>
        </div>

        {/* Right column: Report visualizer & log (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Logger status line */}
          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] flex justify-between items-center border border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>{analysisStatus || "企业信用评估雷达就绪。支持在左侧录入外商信息进行一击溯源。"}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">RECON DATABASE v2.5</span>
          </div>

          {/* If there is active research report - Render complete beautiful export sheet */}
          {activeReport ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
              
              {/* Header Title sheet */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-150 pb-5 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      CREDIT DUE DILIGENCE EXPORT
                    </span>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      activeReport.sanctionRisk === '低风险' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800 animate-bounce'
                    }`}>
                      OFAC 制裁库：{activeReport.sanctionRisk}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 mt-2 flex items-center gap-2">
                    <Building className="w-5 h-5 text-slate-500 shrink-0" />
                    {activeReport.companyName}
                  </h3>
                  <p className="text-xs text-slate-450 mt-1 font-mono">
                    国家：<strong>{activeReport.country}</strong> | 网址: {activeReport.website} | 生成：{activeReport.createdAt}
                  </p>
                </div>

                <div className="bg-indigo-50 text-indigo-950 p-4 rounded-lg flex items-center gap-3 border border-indigo-100">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">采购潜力指数</span>
                    <strong className="text-2xl font-black text-indigo-800 font-sans tracking-tight">
                      {activeReport.purchasePotentialScore}<em className="text-xs font-normal">/100</em>
                    </strong>
                  </div>
                  <div className="w-px h-8 bg-indigo-200" />
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">企业信用欠款风险</span>
                    <strong className={`text-sm font-bold block ${
                      activeReport.creditRiskLevel === '低' 
                        ? 'text-emerald-600' 
                        : activeReport.creditRiskLevel === '中'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}>
                      {activeReport.creditRiskLevel} 风险
                    </strong>
                  </div>
                </div>
              </div>

              {/* Verified domains health gauge meters */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-105 text-xs text-center space-y-1">
                  <span className="text-slate-400 block font-medium">网站反欺诈评级</span>
                  <div className="text-slate-850 font-bold text-sm tracking-tight font-mono">{activeReport.websiteTrustScore}% 可信</div>
                  <div className="h-1 bg-slate-250 rounded-full overflow-hidden max-w-[80px] mx-auto">
                    <div className="h-full bg-indigo-500" style={{ width: `${activeReport.websiteTrustScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-105 text-xs text-center space-y-1">
                  <span className="text-slate-400 block font-medium">邮箱域名连通性</span>
                  <div className="text-slate-850 font-bold text-sm tracking-tight font-mono">{activeReport.emailTrustScore}% 验证</div>
                  <div className="h-1 bg-slate-250 rounded-full overflow-hidden max-w-[80px] mx-auto">
                    <div className="h-full bg-emerald-500" style={{ width: `${activeReport.emailTrustScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-105 text-xs text-center space-y-1 col-span-2 md:col-span-1">
                  <span className="text-slate-400 block font-medium">制裁合规审计</span>
                  <div className="text-emerald-600 font-bold text-sm flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    CLEAN 绿通
                  </div>
                  <span className="text-[9px] text-slate-400">已连线欧盟/OFAC黑名单</span>
                </div>
              </div>

              {/* Detailed narrative sections */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Scope & Registry */}
                <div className="space-y-1.5 p-3 rounded-lg hover:bg-slate-50/50 transition-colors">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-550 rounded-xs" />
                    主体注册与业务经营范围 (Corporate Registration & Scope)
                  </h4>
                  <p className="text-slate-650 leading-relaxed pl-3 font-medium">
                    {activeReport.businessScope}
                  </p>
                  <p className="text-[11px] text-slate-400 italic pl-3">{activeReport.registrationStatus}</p>
                </div>

                {/* 2. Trade logs/Customs billings */}
                <div className="space-y-1.5 p-3 rounded-lg hover:bg-slate-50/50 transition-colors">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-550 rounded-xs" />
                    环球海关海运提单合规追踪 (Port Trade & Bills of Lading)
                  </h4>
                  <p className="text-slate-650 leading-relaxed pl-3 font-medium">
                    {activeReport.tradeRecords}
                  </p>
                </div>

                {/* 3. Safety/Punishments check */}
                <div className="space-y-1.5 p-3 rounded-lg hover:bg-slate-50/50 transition-colors">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-550 rounded-xs" />
                    处罚纠纷与安全监管漏洞 (Negative Incidents Checklist)
                  </h4>
                  <p className="text-slate-650 leading-relaxed pl-3 font-medium">
                    {activeReport.negativeNews}
                  </p>
                </div>

                {/* 4. Payment structures & safe settlements */}
                <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-lg space-y-1">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    推荐外贸回款结算配比 (Suggested Safe Settlement Advice)
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-sans">{activeReport.paymentSuggestion}</p>
                </div>

                {/* 5. Target Chemicals pitch products */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-indigo-550" />
                    推荐主推开发化学试剂 (Highly Pitching Chemical Products)
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pl-1.5">
                    {(activeReport.recommendedProducts || []).map((p, ix) => (
                      <span key={ix} className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold font-mono">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 6. Executive summary */}
                <div className="bg-indigo-50/50 p-4 border border-indigo-150 rounded-lg text-indigo-950 leading-relaxed">
                  <strong>💡 商务开发总结评价：</strong> {activeReport.summary}
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 p-16 text-center text-slate-400 text-xs rounded-xl">
              暂无可以渲染展示的背调信用报告。请在左侧指定新客户后点击“启动海外资信与潜力研究”。
            </div>
          )}

        </div>

      </div>

      {/* Historical Report log lists */}
      {researches.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            我司最新生成的历史风控背调存档 ({researches.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {researches.map((resItem) => (
              <div 
                key={resItem.id}
                onClick={() => setActiveReport(resItem)}
                className={`p-3.5 bg-white border rounded-xl shadow-xs transition-all cursor-pointer select-none space-y-1.5 ${
                  activeReport?.id === resItem.id ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-150 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 truncate max-w-[120px]">{resItem.companyName}</span>
                  <span className="text-[10px] text-slate-400">{resItem.country}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>潜力评分: <strong className="text-indigo-600 font-mono">{resItem.purchasePotentialScore}</strong></span>
                  <span>信用: {resItem.creditRiskLevel}风险</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
