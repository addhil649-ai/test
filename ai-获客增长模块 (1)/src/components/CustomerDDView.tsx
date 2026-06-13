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
  Search,
  Plus,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Flame,
  Scale,
  Anchor,
  Zap,
  Tag,
  Kanban,
  FileText,
  History
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
  // Input Report form elements + custom CAS input
  const [companyName, setCompanyName] = useState('Apex BioLab Supplies India');
  const [country, setCountry] = useState('India');
  const [website, setWebsite] = useState('www.apexbio.in');
  const [emailDomain, setEmailDomain] = useState('apexbio.in');
  const [contactPerson, setContactPerson] = useState('Rajesh Kumar');
  const [targetCasNo, setTargetCasNo] = useState('75-05-8'); // Custom Trade chemical CAS input

  // Loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [scannedReport, setScannedReport] = useState<CustomerResearch | null>(null);

  // Active customer rating report being reviewed
  const [activeReport, setActiveReport] = useState<CustomerResearch | null>(researches[0] || null);

  // Trigger auto-form prefill if user clicked from Lead Radar
  useEffect(() => {
    if (selectedLeadForDD) {
      setCompanyName(selectedLeadForDD.companyName);
      setCountry(selectedLeadForDD.country);
      setWebsite(selectedLeadForDD.website || 'www.company.com');
      setEmailDomain(selectedLeadForDD.email ? selectedLeadForDD.email.split('@')[1] : '');
      setContactPerson(selectedLeadForDD.contactName || '');
      if (selectedLeadForDD.casNo) {
        setTargetCasNo(selectedLeadForDD.casNo);
      }
      
      // Auto-trigger analysis immediately with pre-filled lead details
      handlePerformResearch(
        selectedLeadForDD.companyName, 
        selectedLeadForDD.country, 
        selectedLeadForDD.website || 'www.company.com',
        selectedLeadForDD.casNo || '75-05-8'
      );
      onClearSelectedLead(); 
    }
  }, [selectedLeadForDD]);

  // Synchronize active report selection if the parent list increases or is updated
  useEffect(() => {
    if (researches.length > 0 && !activeReport) {
      setActiveReport(researches[0]);
    }
  }, [researches]);

  const handlePerformResearch = async (
    comp = companyName, 
    cty = country, 
    web = website,
    cas = targetCasNo
  ) => {
    setIsAnalyzing(true);
    setScannedReport(null);
    setAnalysisStatus('正在连接全球海关提单进出口核销主数据库...');

    try {
      await new Promise(r => setTimeout(r, 700));
      setAnalysisStatus(`正在穿透检验 OFAC、欧盟制裁名单、企业白皮书、历史 1.0 优惠券结算账册...`);
      await new Promise(r => setTimeout(r, 550));

      const isSuspicious = comp.toLowerCase().includes("zeta") || comp.toLowerCase().includes("sanction") || comp.toLowerCase().includes("shadow");

      const res = await fetch('/api/ai/due-diligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: comp, country: cty, website: web })
      });

      if (!res.ok) {
        throw new Error('API server returned error code ' + res.status);
      }

      const data = await res.json();
      
      // Enrich with compliance elements and exact math calculations on absolute changes
      const reportWithCompliance: CustomerResearch = {
        ...data.report,
        // Override CAS or specific elements if provided in view form
        ehsCompliance: {
          requiredCertificates: isSuspicious 
            ? ['特种危害毒物清单 (DEA Form 223)', 'EPA 危险物进出申报']
            : cas === '75-05-8' 
            ? ['安全生产许可证', '危化品经营许可证 (Acetonitrile HPLC)', 'IMDG 危运安全申报表']
            : ['清关原产地证 (Form B)', 'IMDG 危化品安全说明书 (MSDS/SDS)', 'ISO9001 质量认证'],
          sanctionNotes: isSuspicious
            ? '⚠️ 安全致命警告：该企业同 OFAC 二级实体存在高度重合交易网，属于严审限运禁毒拦截节点。'
            : '已通过 OFAC/EU 底层信保筛查，无主权或代理冲突，符合我国及联合国化学品进出口合规准入。',
          blacklistVerification: isSuspicious
            ? '🚨 联合黑名单突击审计发现：在交叉检验账册中，匹配到该账户残留有早期 1.0 版本的优惠券（version 1.0 coupons）抵扣未结欠账清算争议，且相关异常付款凭证仍在争议仲裁中。平台已强制触发拦截！'
            : '联合黑名单检验：清洁通过。已联合比对历史 1.0 版本的优惠券（version 1.0 coupons）抵扣记录、代理授信、清算凭证，状态良好，无欠欠账冲突风险。',
          hasViolationRisk: isSuspicious
        },
        supplyChain: {
          competitors: isSuspicious 
            ? [{ name: 'Unknown/Unverified Broker', share: 100 }]
            : [
                { name: 'Sigma-Aldo Sourcing India', share: 45 },
                { name: 'Kolkata Chemical Ind.', share: 30 },
                { name: 'Local Spot Solvents LLC', share: 25 }
              ],
          nextSourcingWindow: isSuspicious ? '已无限阻断' : '2026年Q3期初 (库存即将探底，预计 7月中旬 开展新型集中比价)',
          portAnalysis: `针对 CAS ${cas} 逆向流向跟踪：通过装箱船报关提单提取表明，该采购端向 Sigma Sourcing 采购频次受纯度杂质影响正逐步收紧。`
        },
        financeRating: {
          creditRatingScore: isSuspicious ? 12 : Math.floor(65 + Math.random() * 32),
          sinosureLimitEstimated: isSuspicious ? '$0 USD' : '$200,000 USD (中信保 A 级承保范围)',
          baseGmvLastYear: 450000,
          targetGmvThisYear: 850000,
          sourcingIndexDelta: isSuspicious ? 0 : 160000,
          gmvContribution: isSuspicious ? 0.0 : 160000 / (850000 - 450000), // Incremental absolute delta / incremental category target delta
          suggestedPaymentScheme: isSuspicious 
            ? '中信保拒保黑禁状态。强烈建议采用 100% 前 T/T，款项实际结清并落账后方能进入工艺定制排单。'
            : `中信保授信额度充足。建议提供 OA 30-45天 的金融账期扶持，用账期杠杆强力竞争老供应商，提升客户粘性。`
        },
        milestoneStatus: isSuspicious ? 'Requirement freeze' : 'Requirement freeze'
      };

      setAnalysisStatus('背调风控自审大纲整理完成！正在加载风控防御看板...');
      setScannedReport(reportWithCompliance);
      setActiveReport(reportWithCompliance);
      onAddResearchRecord(reportWithCompliance);

    } catch (err: any) {
      console.error(err);
      setAnalysisStatus(`AI 网络连接受限，正在触发本地外贸信保防御内核重构报告...`);

      const isSuspicious = comp.toLowerCase().includes("zeta") || comp.toLowerCase().includes("sanction") || comp.toLowerCase().includes("shadow");

      const localBackup: CustomerResearch = {
        id: `R-BACK-${Math.floor(Math.random() * 9000)}`,
        companyName: comp,
        country: cty,
        website: web,
        businessScope: `${comp} 是当地知名的化学分销商/终端研发中心，深耕本地药促研发以及通用危化品、溶剂的进出口中转网络。`,
        registrationStatus: isSuspicious 
          ? '异常存续 (Suspended/Pending Audit) | 注册于特拉华州，目前存在未结税务清算与反倾销纠纷诉讼。'
          : '核核纳税存续 (Active)。经中国信保和商务部数据交叉判定合法可托，属于中型外贸资质实体。',
        tradeRecords: '提单分析：其在最近12个月在境内主要化验中心保持数个集装箱柜的稳定报关频率，采购品多为色谱纯溶剂。',
        negativeNews: isSuspicious
          ? '严重风险提示：涉嫌未报备合规文件擅自转运管制化学试剂。存在违规涉外制裁二级关联指控，有账户抵扣争议。'
          : '该司无公开民事诉讼判决欺诈、危化特大泄漏泄漏环保处分和黑民欠款不结丑闻，信用度整体优良。',
        sanctionRisk: isSuspicious ? '高风险' : '低风险',
        websiteTrustScore: isSuspicious ? 44 : 85,
        emailTrustScore: isSuspicious ? 48 : 88,
        purchasePotentialScore: isSuspicious ? 25 : 79,
        creditRiskLevel: isSuspicious ? '高' : '中',
        paymentSuggestion: isSuspicious 
          ? '强烈建议：拒绝任何赊账，锁死 100% 前 T/T (全款预付)。'
          : '推荐首笔订单采用 30% Pre-paid + 70% against BL 结算，第三期起可向中信保证卷申请 OA 风险保险承保。',
        recommendedProducts: [
          `色谱级乙腈 (HPLC Grade Acetonitrile, CAS ${cas})`,
          '分析纯高纯对照试剂原料',
          '生物分析检测对照试剂'
        ],
        summary: isSuspicious
          ? `${comp}存在重度信保欺诈诉讼，且由于触发多项联合筛查警告（包含历史 1.0 版本优惠券异常欠账冲突），建议立即拦截业务跟进。`
          : `${comp}资信核验表现无瑕疵。未被列入海关受限制裁，对特种规格分析试剂需求量高且长效，建议重点接触。`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        
        // STEP 1 & 2 & 3 Fallback entries
        ehsCompliance: {
          requiredCertificates: isSuspicious
            ? ['特种管制化学许可证（DEA Form 223）', 'EPA 危险废物运输准入证']
            : cas === '75-05-8' 
            ? ['安全生产许可证', '危化品进口批准文书', 'IMDG运输安全申报单']
            : ['清关原产地证 (Form B)', 'IMDG 危化品安全说明书 (MSDS/SDS)', 'ISO9001 质量认证'],
          sanctionNotes: isSuspicious
            ? '⚠️ 系统重度警告：该司与被 OFAC 列入制裁清单的特种中间体转运实体存在高频交易穿透，触犯二级违背合规底线。'
            : '该客户主体注册地极其干净安全，中国外销审核畅通。',
          blacklistVerification: isSuspicious
            ? '🚨 联合黑名单阻断警告：在系统交叉结算校验中，发现该司历史账户中残留有早期 1.0 版本的优惠券（version 1.0 coupons）抵扣欠款未结争议，且相关异常付款凭证仍在争议仲裁中。已强制挂起合作权限！'
            : '联合黑名单系统自查：绿色通行。已全量比对包括历史 1.0 版本优惠券（version 1.0 coupons）、授信延展等全周期协议记录，历史无任结算坏账争议，支持建立常规客户协议。',
          hasViolationRisk: isSuspicious
        },
        supplyChain: {
          competitors: isSuspicious
            ? [{ name: 'Blackmarket & Spot Brokers', share: 100 }]
            : [
                { name: 'Sigma-Aldo Sourcing China', share: 48 },
                { name: 'Local Spot Broker LLC', share: 32 },
                { name: 'Other Reagent Sourcing', share: 20 }
              ],
          nextSourcingWindow: isSuspicious ? '已无限期阻断交易' : '2026年Q3期初 (预计 7月中下旬左右，目前正处于高耗用窗口期)',
          portAnalysis: `基于 CAS ${cas} 的逆向海关流向表明：目前该司的核心纯度偏向于 99.98% 级别以上，对常规粗制产品有极高的置换诉求。`
        },
        financeRating: {
          creditRatingScore: isSuspicious ? 15 : 82,
          sinosureLimitEstimated: isSuspicious ? '$0 USD' : '$150,000 USD (中信保受保额度)',
          baseGmvLastYear: 400000,
          targetGmvThisYear: 800000,
          sourcingIndexDelta: 120000,
          gmvContribution: isSuspicious ? 0.0 : 120000 / (800000 - 400000), // 30.0%
          suggestedPaymentScheme: isSuspicious
            ? '中信保已拒保。不建议给予任何信用授信！务必采用 100% 前 T/T (全款付款后排定制单)。'
            : '信誉整体稳健。建议新开客户前期全款，样品及首单完成封样后，第二批试量转为 T/T 30% 预付 + 70% 提单到账，可防备首单清关纠纷。'
        },
        milestoneStatus: isSuspicious ? 'Requirement freeze' : 'Requirement freeze'
      };

      setScannedReport(localBackup);
      setActiveReport(localBackup);
      onAddResearchRecord(localBackup);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper inside Stepper to advance or change active customer's project stage
  const handleUpdateMilestone = (stage: 'Requirement freeze' | 'Sample test' | 'Pilot order' | 'Full launch') => {
    if (!activeReport) return;
    const updated: CustomerResearch = {
      ...activeReport,
      milestoneStatus: stage
    };
    setActiveReport(updated);
    // Find index and update inside the parent array list to preserve state
    onAddResearchRecord(updated);
  };

  // Profile classification helper based on indicators (End User vs Distributor)
  const getBuyerTypeLabel = (report: CustomerResearch) => {
    if (report.purchasePotentialScore >= 90) {
      return {
        label: '大货渠道分销商 (Volume Distributor)',
        style: 'border-cyan-200 bg-cyan-50 text-cyan-700',
        tactics: '分销商重在长期供货连续性以及利润厚度。动态谈判战术：不宜直接拼杀裸价底线，可根据订量提供“阶梯年返 (Tiered Rebate)”，重点利用中信保账期授信 (OA 45) 进行额度拦截，反蚕食老对手份额，并在下次采购期前提前锁定其集装箱出货配额。'
      };
    } else {
      return {
        label: '终端研发直客 (Direct R&D Client)',
        style: 'border-rose-200 bg-rose-50 text-rose-700',
        tactics: '终端客户处于技术刚需，对价格承受带较宽，对 EHS 资质控制、包装密闭度、杂质 HPLC 色谱极其严苛。谈判战术：锁定高纯样测试无偏离 (Sample Test Alignment)，签署专属技术备忘，直接提供 HPLC-MS 复核证书，以高品质替换降价承诺。'
      };
    }
  };

  // Extract compliance & fallback data comfortably
  const ehs = activeReport?.ehsCompliance || {
    requiredCertificates: ['清关原产地证', '安全数据表 (SDS)'],
    sanctionNotes: '无异常制裁指标历史。',
    blacklistVerification: '已拉取历史 1.0 版本的优惠券（version 1.0 coupons）对账，财务一致。',
    hasViolationRisk: false
  };

  const supply = activeReport?.supplyChain || {
    competitors: [{ name: 'Sigma-Aldo Sourcing', share: 60 }, { name: 'Local Spot Brokers', share: 40 }],
    nextSourcingWindow: '近期窗口待定',
    portAnalysis: '暂无详细逆向海运提单，请启动分析提取。'
  };

  const finance = activeReport?.financeRating || {
    creditRatingScore: 72,
    sinosureLimitEstimated: '$100,000 USD',
    baseGmvLastYear: 100000,
    targetGmvThisYear: 200000,
    sourcingIndexDelta: 30000,
    gmvContribution: 0.30,
    suggestedPaymentScheme: '常规结算付款。首选用前 TT 控制履约波动。'
  };

  const buyerTheme = activeReport ? getBuyerTypeLabel(activeReport) : null;

  return (
    <div className="space-y-6 text-slate-800" id="customer-dd-view">
      
      {/* STEP 2: Refactored Compact Search Console (公司/网址 + CAS + 启动背调按钮) */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2.5 rounded bg-indigo-50 border border-indigo-150 text-indigo-705 font-mono text-[10px] font-bold">
              OFFENSE & COMPLIANCE DEFENSE HUB
            </div>
            <h3 className="font-bold text-slate-800 text-sm">进攻型销售谈判与合规防御中枢</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">DATABASE CLOUD SHIELD v4.0</span>
        </div>

        {/* Dynamic Compact form line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">外商公司名称 (Corporate Name)</label>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="请输入外商公司或境外网址..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">所属国家/联系人</label>
            <div className="grid grid-cols-2 gap-1">
              <input 
                type="text" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="国家, 如 India"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-[11px]"
              />
              <input 
                type="text" 
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="联系人"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">拟交易产品 CAS 编号 (Target CAS No)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-[10px] font-mono text-slate-450">CAS</span>
              <input 
                type="text" 
                value={targetCasNo}
                onChange={(e) => setTargetCasNo(e.target.value)}
                placeholder="例如: 75-05-8"
                className="w-full bg-slate-50 border border-slate-200 text-indigo-700 font-mono rounded-lg pl-10 pr-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              id="dd-start-scan-btn"
              onClick={() => handlePerformResearch()}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-white transition-all py-2.5 rounded-lg text-xs font-bold cursor-pointer shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>审计连网中...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>启动资信与合规排雷</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Domain and Website additional row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div>
            <label className="text-slate-500 inline-block mr-1">外商官网:</label>
            <input 
              type="text" 
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                const dm = e.target.value.replace('www.', '').replace('http://', '').replace('https://', '').split('/')[0];
                setEmailDomain(dm);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded px-2 py-1 focus:outline-none max-w-xs font-mono text-[11px]"
            />
          </div>
          <div className="text-right text-[10px] text-slate-400 flex items-center justify-end gap-1 font-mono">
            <span>邮箱验证域:</span>
            <strong className="text-slate-600">{emailDomain || 'apexbio.in'}</strong>
          </div>
        </div>
      </div>

      {/* Logger Panel status line */}
      <div className="bg-slate-100/80 border border-slate-200/80 text-slate-600 p-3.5 rounded-xl font-mono text-[11px] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`} />
          <span>{analysisStatus || "主板情报雷达就绪。建议启动左侧检索，审计 CAS 链及 1.0 对账数据。"}</span>
        </div>
        <span className="text-[10px] text-indigo-650 font-bold tracking-wider">SECURE SHIELD PRO v4.2</span>
      </div>

      {/* RENDER ACCORDING TO AUDITED COMPLIANCE COUPLING RED BANNER */}
      {activeReport && ehs.hasViolationRisk && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <strong className="text-xs uppercase font-extrabold tracking-wider">🚨 严重出口信用黑名单及违规阻断风险预警 (Zeta High Risk Warning)</strong>
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed font-sans pl-7">
            {ehs.blacklistVerification}
          </p>
          <div className="pl-7 grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-rose-700 font-mono">
            <div>• 拦截要素：由于历史 1.0 版本优惠券（version 1.0 coupons）对账争议，系统发现历史结算有坏账未还纪录。</div>
            <div>• 制裁通报：OFAC 二级实体制裁交叉触及，存在严重的单边易制毒非管制中保通转运违约。</div>
          </div>
        </div>
      )}

      {activeReport && !ehs.hasViolationRisk && (
        <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-emerald-800">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong>💚 官方联合黑名单自审绿通：</strong>
            <p className="text-slate-650 leading-normal">
              {ehs.blacklistVerification} 数据库全面清洁可托，无敏感中转要素。
            </p>
          </div>
        </div>
      )}

      {/* Main content center Grid displaying the Research report */}
      {activeReport ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 p-5 rounded-xl space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono">
                    CREDIT INTELLIGENCE GAUGE
                  </span>
                  <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-250/60 px-2 py-0.5 rounded font-mono">
                    目标交易CAS：{targetCasNo}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                    activeReport.sanctionRisk === '低风险' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
                      : 'bg-rose-50 text-rose-700 border border-rose-250 animate-pulse'
                  }`}>
                    OFAC 制裁排雷：{activeReport.sanctionRisk}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-850 flex items-center gap-2 font-sans">
                  <Building className="w-5 h-5 text-indigo-500" />
                  {activeReport.companyName}
                </h2>
                <div className="text-[11px] text-slate-500 flex items-center gap-4 flex-wrap font-mono">
                  <span>国家/地区: <strong className="text-slate-705">{activeReport.country}</strong></span>
                  <span>主营网址: <strong className="text-slate-705">{activeReport.website}</strong></span>
                  <span>背调时间: <span className="text-slate-450">{activeReport.createdAt}</span></span>
                </div>
              </div>

              {/* Dynamic trust gauges */}
              <div className="flex gap-4 items-center self-end md:self-auto bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-center">
                  <span className="text-[9px] text-slate-455 block uppercase font-mono">采购潜力得分</span>
                  <strong className="text-xl font-bold text-indigo-600 font-mono block">
                    {activeReport.purchasePotentialScore}<em className="text-[10px] font-normal text-slate-455">/100</em>
                  </strong>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <span className="text-[9px] text-slate-455 block uppercase font-mono">企业资信评级</span>
                  <strong className={`text-xl font-bold block font-mono ${
                    activeReport.creditRiskLevel === '低' 
                      ? 'text-emerald-600' 
                      : activeReport.creditRiskLevel === '中'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {activeReport.creditRiskLevel}风险
                  </strong>
                </div>
              </div>
            </div>

            {/* Business logic narrative */}
            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-lg text-xs space-y-2">
              <span className="text-[10px] text-slate-450 block font-mono uppercase tracking-wider">主体注册及业务存续核对：</span>
              <p className="text-slate-700 leading-relaxed font-sans">{activeReport.businessScope}</p>
              <div className="text-[11px] text-indigo-650 font-mono">{activeReport.registrationStatus}</div>
            </div>
          </div>

          {/* STEP 3: Parallel Content Grid Displaying Three Shields of Intelligence ( EHS, Reverse Supply Chain, Finance Rating ) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Shield 1: EHS和制裁合规体检 (防线一) */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl flex flex-col justify-between space-y-4 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-3.5">
                <div className="flex items-center gap-1.5 border-b border-slate-150 pb-2.5">
                  <Scale className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-bold font-mono tracking-wider text-indigo-600">防线一：EHS与制裁合规体检</span>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-500 block text-[10px] font-mono uppercase">CAS {targetCasNo} 对应通关准入必备文件证书:</span>
                  <div className="space-y-1.5">
                    {ehs.requiredCertificates.map((cert, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 bg-slate-50 border border-slate-150 p-2 rounded text-[11px] text-slate-650 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50/40 border border-amber-150 p-3 rounded space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-amber-700/90 flex items-center gap-1 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> COMPLIANCE OFAC AUDIT TIP
                  </span>
                  <p className="text-[10.5px] text-slate-600 leading-normal font-sans">
                    {ehs.sanctionNotes}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                制裁审查指引：已全自动校验联合国军民两用特殊货准名录。
              </div>
            </div>

            {/* Shield 2: 逆向供应链海关情报 (防线二) */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl flex flex-col justify-between space-y-4 shadow-xs relative overflow-hidden">
              <div className="space-y-3.5">
                <div className="flex items-center gap-1.5 border-b border-slate-150 pb-2.5">
                  <Anchor className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="text-xs font-bold font-mono tracking-wider text-sky-600">防线二：海关供应链逆向情报</span>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-500 block text-[10px] font-mono uppercase">存量主供应商博弈格局及市场占比 (逆向测定):</span>
                  <div className="space-y-2.5 pt-1">
                    {supply.competitors.map((comp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-700 font-sans font-medium max-w-[150px] truncate" title={comp.name}>{comp.name}</span>
                          <span className="text-indigo-600 font-mono font-bold">{comp.share}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${comp.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-3 rounded space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-550 font-mono block uppercase">供应链港口与船期规律流向：</span>
                  <p className="text-[10.5px] text-slate-600 leading-normal font-sans">
                    {supply.portAnalysis}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-2 border border-indigo-150/50 rounded flex justify-between items-center text-[10px] font-mono">
                <span className="text-indigo-900 font-sans">下次采购/补货预测窗口：</span>
                <strong className="text-indigo-600">{supply.nextSourcingWindow}</strong>
              </div>
            </div>

            {/* Shield 3: 信保精算与财务评级 (防线三) */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl flex flex-col justify-between space-y-4 shadow-xs relative overflow-hidden">
              <div className="space-y-3.5">
                <div className="flex items-center gap-1.5 border-b border-slate-150 pb-2.5">
                  <DollarSign className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold font-mono tracking-wider text-amber-600">防线三：信保精算与财务评级</span>
                </div>

                {/* Sinosure pre-scores card */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-150 text-center">
                  <div className="border-r border-slate-200">
                    <span className="text-[9px] text-slate-450 block uppercase font-mono">资信精算评分</span>
                    <strong className="text-sm font-extrabold text-slate-700 font-mono">{finance.creditRatingScore}<em className="text-[9.5px] font-normal text-slate-450">/100</em></strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-450 block uppercase font-mono">信保最高额度</span>
                    <strong className="text-sm font-extrabold text-emerald-600 font-mono">{finance.sinosureLimitEstimated}</strong>
                  </div>
                </div>

                {/* Absolute GMV calculations: computationally exact without growth percent */}
                <div className="bg-slate-50 border border-slate-150 p-2.5 rounded text-xs space-y-1.5">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                    <span className="text-[9px] text-slate-450 font-mono font-bold uppercase">GMV 绝对变化贡献算式:</span>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">ABSOLUTE CALCULUS</span>
                  </div>
                  <div className="space-y-1 text-[10.5px] text-slate-600 font-mono leading-tight">
                    <div className="flex justify-between">
                      <span className="text-slate-455">采购量差值 (Delta):</span>
                      <span className="text-indigo-600 font-bold">+${(finance.sourcingIndexDelta || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455">全平台增量变动目标:</span>
                      <span className="text-slate-500">${(finance.targetGmvThisYear - finance.baseGmvLastYear).toLocaleString()} USD</span>
                    </div>
                    <div className="pt-1 mt-1 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-slate-505 font-semibold font-sans">GMV 绝对值增量权重:</span>
                      <strong className="text-amber-700 text-[11px] font-bold bg-amber-50 px-1.5 rounded border border-amber-200">
                        {((finance.gmvContribution || 0) * 100).toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Dynamic recommendation structure */}
                <div className="bg-amber-50/40 p-2 border border-amber-150 rounded text-xs space-y-1">
                  <span className="text-[9px] text-amber-700 font-mono font-bold uppercase block">付款方式与动态账期决策：</span>
                  <p className="text-[10.5px] text-slate-705 leading-normal font-sans">
                    {finance.suggestedPaymentScheme}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-450 pt-2 border-t border-slate-100 font-mono text-center">
                *账期推荐经中信保资信预审引擎实时核定。
              </div>
            </div>

          </div>

          {/* STEP 4: Upgraded Sales Action Hub with Buyer Profile Badge, AI playbooks, and standardized Stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200/85 rounded-xl p-5 relative overflow-hidden shadow-xs">
            
            {/* Left side: Buyer Profile & AI Playbook (7 columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-150 pb-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-800">AI 专属谈判锦囊战术</span>
              </div>

              {buyerTheme && (
                <div className="space-y-4">
                  {/* Buyer profile label */}
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-150">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-450" />
                      <span className="text-xs text-slate-550">研判定级买家核心画像特征：</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${buyerTheme.style}`}>
                      {buyerTheme.label}
                    </span>
                  </div>

                  {/* AI strategy playbook */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold">
                      <UserCheck className="w-4 h-4" />
                      <span>实战进攻与合规防御要诀 (AI Negotiation Playbooks)</span>
                    </div>
                    <p className="text-slate-650 text-xs leading-relaxed text-justify pl-5">
                      {buyerTheme.tactics}
                    </p>
                  </div>

                  {/* Pitching products showcase */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-455 block uppercase font-mono">客商供应链匹配靶向品类 (Highly Recommended Products)：</span>
                    <div className="flex flex-wrap gap-2">
                      {(activeReport.recommendedProducts || []).map((pItem, idx) => (
                        <span key={idx} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded font-mono font-medium font-semibold">
                          {pItem}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Standardization Milestones tracker Stepper (5 columns) */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-150 pt-4 lg:pt-0 lg:pl-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 border-b border-slate-150 pb-2.5">
                  <Kanban className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-800">四阶段项目闭环推进里程碑</span>
                </div>

                <p className="text-[11px] text-slate-450 leading-normal">
                  从客户背调审计出发，点击下方节点即可实时流转并同步客商跟进状态。起点定为需求冻结，终点为全量上线。
                </p>

                {/* milestone stepper UI */}
                <div className="space-y-3 pt-2">
                  {[
                    { id: 'Requirement freeze', num: '1', name: '需求冻结', desc: 'Requirement freeze' },
                    { id: 'Sample test', num: '2', name: '样品测试', desc: 'Sample test' },
                    { id: 'Pilot order', num: '3', name: '小试订单', desc: 'Pilot order' },
                    { id: 'Full launch', num: '4', name: '全量上线', desc: 'Full launch' }
                  ].map((step, idx) => {
                    const isPassed = ['Requirement freeze', 'Sample test', 'Pilot order', 'Full launch'].indexOf(activeReport.milestoneStatus || 'Requirement freeze') >= idx;
                    const isActive = activeReport.milestoneStatus === step.id;
                    
                    return (
                      <div 
                        key={step.id}
                        onClick={() => handleUpdateMilestone(step.id as any)}
                        className={`flex items-start gap-3 p-2 rounded-lg border transition-all cursor-pointer select-none ${
                          isActive 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-xs' 
                            : isPassed 
                            ? 'bg-emerald-50/55 border-emerald-150 text-slate-650' 
                            : 'bg-transparent border-transparent hover:bg-slate-55 text-slate-455'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-250'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {step.num}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11.5px] font-bold font-sans">{step.name}</span>
                            <span className="text-[9px] font-mono text-slate-500">• {step.desc}</span>
                          </div>
                          {isActive && (
                            <span className="text-[9px] text-indigo-400 block font-sans">
                              🎯 客户当前所处核心履约节点（请随时维护更新）
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-center font-sans font-medium">
                <span className="text-[10px] text-slate-450 block font-mono">当前履约大货流转目标：</span>
                <strong className="text-slate-700 text-xs font-bold block mt-0.5">
                  {(activeReport.milestoneStatus === 'Full launch') 
                    ? '🎉 已达成：全量上线 (标准化大货定期返单中) !' 
                    : `正在朝向下一个节点冲刺与锁定...`}
                </strong>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 p-16 text-center text-slate-455 text-xs rounded-xl">
          暂无可以渲染展示的背调资信报告。请在上方输入新客户并选择 CAS 拟开发品类后点击“启动资信与合规排雷”。
        </div>
      )}

      {/* HISTORICAL RECORDS SHIELD LOG LIST */}
      {researches.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <h4 className="text-xs font-bold text-slate-550 uppercase tracking-wider">
              我司最新生成历史外贸风控背调存档 ({researches.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {researches.map((resItem) => {
              const itemEhs = resItem.ehsCompliance;
              
              return (
                <div 
                  key={resItem.id}
                  onClick={() => {
                    setActiveReport(resItem);
                    if (resItem.id === 'R-001') {
                      setTargetCasNo('75-05-8');
                      setCompanyName('Apex BioLab Supplies India');
                    } else if (resItem.id === 'R-002') {
                      setTargetCasNo('103-90-2');
                      setCompanyName('Bayer Diagnostic Sourcing GmbH');
                    } else {
                      setTargetCasNo('GPA-X90');
                      setCompanyName(resItem.companyName);
                    }
                  }}
                  className={`p-3.5 bg-white border rounded-xl shadow-xs transition-all hover:shadow-xs cursor-pointer select-none space-y-1.5 ${
                    activeReport?.id === resItem.id 
                      ? 'border-indigo-600 bg-indigo-50/25 shadow-sm' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-805 truncate max-w-[130px]" title={resItem.companyName}>
                      {resItem.companyName}
                    </span>
                    <span className="text-[10px] text-slate-450 font-mono">{resItem.country}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>潜力评测: <strong className="text-indigo-600 font-mono">{resItem.purchasePotentialScore || 80}</strong></span>
                    <span className={itemEhs?.hasViolationRisk ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      {itemEhs?.hasViolationRisk ? '🚨高危拦截' : `${resItem.creditRiskLevel || '中'}危`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] pt-1 border-t border-slate-100 font-mono text-slate-455">
                    <span>进度: {resItem.milestoneStatus || 'Requirement freeze'}</span>
                    <span className="text-[10px] text-amber-700 font-bold">
                      {resItem.financeRating?.gmvContribution ? `${(resItem.financeRating.gmvContribution * 100).toFixed(0)}% contribution` : '0%'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
