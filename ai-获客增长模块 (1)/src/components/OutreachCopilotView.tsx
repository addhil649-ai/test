/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lead, ChannelType, ToneType, MilestoneStage } from '../types';
import { INITIAL_LEADS } from '../mockData';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  BookOpen, 
  FileCheck,
  Shield,
  Zap,
  FileText,
  AlertTriangle,
  Coins,
  Globe,
  Plus
} from 'lucide-react';

interface OutreachCopilotProps {
  selectedLeadForOutreach: Lead | null;
  onClearSelectedLead: () => void;
}

export default function OutreachCopilotView({ 
  selectedLeadForOutreach, 
  onClearSelectedLead 
}: OutreachCopilotProps) {
  // Leads Database for Bind Dropdown
  const [leadsList, setLeadsList] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('L-002'); // Default to Apex BioLab

  // Lead Sourcing Arguments
  const [companyName, setCompanyName] = useState('Apex BioLab Supplies India');
  const [contactName, setContactName] = useState('Rajesh Kumar');
  const [country, setCountry] = useState('India');
  const [targetProduct, setTargetProduct] = useState('Acetonitrile HPLC Grade');
  const [source, setSource] = useState('社媒意向');
  const [painPoint, setPainPoint] = useState('现有供应商批次稳定性不佳，HPLC 谱图上有杂质色谱峰，影响检测基线');
  const [intelligenceTags, setIntelligenceTags] = useState<string[]>(['急缺色谱级乙腈', '重金属残留超标痛点', '危化品资质合规']);

  // Core Parameters
  const [channelType, setChannelType] = useState<ChannelType>('邮件');
  const [toneType, setToneType] = useState<ToneType>('专家顾问风');
  const [milestoneStage, setMilestoneStage] = useState<MilestoneStage>('Requirement freeze');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  // Interactive Options
  const [includeExpansionCoupon, setIncludeExpansionCoupon] = useState<boolean>(false);
  const [customDraft, setCustomDraft] = useState<string>('');
  const [subjectDraft, setSubjectDraft] = useState<string>('');

  // AI Append Console state
  const [appendInput, setAppendInput] = useState<string>('');
  const [isAppending, setIsAppending] = useState<boolean>(false);

  // Blacklist Precheck (Global v1.0 Coupons and historical records protection)
  const [blacklistStatus, setBlacklistStatus] = useState<{ blocked: boolean; reason: string }>({
    blocked: false,
    reason: '安全：未检测到历史级 Version 1.0 Coupons 特权卡重叠，无营销推送冲突风险。'
  });

  // Action status logs
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('策略就绪。请设定目标客商环境。');
  const [copiedText, setCopiedText] = useState(false);

  // Blacklist Verification Function (Version 1.0 Coupons conflict check)
  const verifyBlacklist = (comp: string) => {
    const listMatches = ['Bayer Diagnostic Sourcing GmbH', 'South-Pharma Labs Brasil'];
    const matches = listMatches.some(c => comp.toLowerCase().includes(c.toLowerCase()));
    if (matches) {
      return {
        blocked: true,
        reason: '⚠️ 触发优惠拦截警告：该客商在全域底卷中存在上一版 Version 1.0 Coupons 的使用与申领特权记录。为防止重复推送活动引发客情冲突，已强制冷期风控阻断。'
      };
    }
    return {
      blocked: false,
      reason: '🛡️ 免排雷干扰过滤：未检测到历史 v1.0 coupons 或促销卡冲突，允许直接注入当前专属大货策略。'
    };
  };

  // Trigger State Filling based on Bind Selection
  const handleSelectLeadChange = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = leadsList.find(l => l.id === leadId);
    if (lead) {
      setCompanyName(lead.companyName);
      setContactName(lead.contactName || 'Sourcing Manager');
      setCountry(lead.country);
      setTargetProduct(lead.productKeywords);
      setSource(lead.source);
      setIncludeExpansionCoupon(false);
      
      const defaultPain = `针对高参数 ${lead.productKeywords} 核心采购，其极其关切重度杂质残留、出境批次色谱稳定度以及海事海运报关等合规保驾。`;
      setPainPoint(lead.intentDescription || defaultPain);
      setIntelligenceTags(lead.intelligenceTags || ['急缺危化现货', '清关合规要求高']);

      // Auto update blacklist status immediately
      const blackCheckResult = verifyBlacklist(lead.companyName);
      setBlacklistStatus(blackCheckResult);

      setStatusText(`线索 [${lead.companyName}] 绑定成功，已注入对应触达痛点。`);
    }
  };

  // Listen to outer triggers from Lead Radar
  useEffect(() => {
    if (selectedLeadForOutreach) {
      const exists = leadsList.some(l => l.id === selectedLeadForOutreach.id);
      if (!exists) {
        setLeadsList(prev => [selectedLeadForOutreach, ...prev]);
      }
      setSelectedLeadId(selectedLeadForOutreach.id);
      setCompanyName(selectedLeadForOutreach.companyName);
      setContactName(selectedLeadForOutreach.contactName || 'Sourcing Manager');
      setCountry(selectedLeadForOutreach.country);
      setTargetProduct(selectedLeadForOutreach.productKeywords);
      setSource(selectedLeadForOutreach.source);
      setIncludeExpansionCoupon(false);

      const computedPain = `极其高敏匹配：正在寻找高规格的 ${selectedLeadForOutreach.productKeywords}。当前对水分控制与重金属残留指标要求偏紧。`;
      setPainPoint(selectedLeadForOutreach.intentDescription || computedPain);
      setIntelligenceTags(selectedLeadForOutreach.intelligenceTags || ['急需大货配药', '展会高转化线索']);

      // Blacklist Verify
      const blackCheck = verifyBlacklist(selectedLeadForOutreach.companyName);
      setBlacklistStatus(blackCheck);
      
      setStatusText(`已捕捉到 [${selectedLeadForOutreach.companyName}] 一键挂载指令，话术自动调优中...`);
      onClearSelectedLead();
    }
  }, [selectedLeadForOutreach]);

  // Handle immediate local validation of company to securitize against conflict coupons
  useEffect(() => {
    setBlacklistStatus(verifyBlacklist(companyName));
  }, [companyName]);

  // Interactive core content generator engine with absolute GMV calculations
  useEffect(() => {
    // Sourcing metric absolute model
    const sourcingIndexDelta = 180000; // $180,000 USD
    const baseGmvLastYear = 500000;    // $500,000 USD
    const targetGmvThisYear = 950000;  // $950,000 USD
    const absoluteGapPool = targetGmvThisYear - baseGmvLastYear; // $450,000 USD
    const absoluteContributionRate = ((sourcingIndexDelta / absoluteGapPool) * 100).toFixed(1); // 40.0% contribution

    let generatedSubject = '';
    let generatedBody = '';

    if (language === 'zh') {
      // --- CHINESE TEMPLATES ---
      if (milestoneStage === 'Requirement freeze') {
        if (toneType === '专家顾问风') {
          generatedSubject = `关于 ${companyName} 引入高纯 ${targetProduct} 规格对齐及免费样品提案`;
          generatedBody = `尊敬的 ${contactName} 先生/女士，\n\n您好！\n\n我们自 ${source} 获悉贵司正在寻求高稳定性、高纯度级别的 ${targetProduct} 供应。我们充分理解这一原料在分子液相色谱精确定量中对基线波动的严苛要求。\n\n针对您的具体场景，我们化学工艺总工程师已详细评估了贵司的分子过滤需求，我们保证实现行业最高标准的杂质清除与超低水分控制。我们非常乐于优先投寄 100mL 免费测试小样至贵司，并提供附带 UHPLC 精细指纹图谱的 COA 分析报告，帮助贵司的检验部门进行快速规格对齐。请问是否可行？\n\n此致，\n高级采购与技术风控顾问`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `【现货锁仓】${targetProduct} 样品即日寄送 + 对应配额额度保留申请`;
          generatedBody = `你好 ${contactName}，\n\n关于您在 ${source} 发布的 ${targetProduct} 产品询价，目前我司针对该批次高纯大货的计划配额十分紧张。\n\n为了不延误贵司生产，我们本周已特批启动了即送样计划。100ml 测试装 and ISO 国家认证 COA 均已就绪，可以最快速度解决贵司质检对基线漂移和重金属残留的顾虑。请回复您的收货地址，我们即刻进行极速快递发运！`;
        } else {
          generatedSubject = `来自高纯试剂实验室的诚意问候：为 ${companyName} 专属备妥的 ${targetProduct} 精质样品包`;
          generatedBody = `亲爱的 ${contactName}，\n\n很高兴能够与您取得业务联系。我们非常关注贵司关于 ${targetProduct} 的工艺改进探讨。\n\n我们知道选择长期稳定的高规格原材料非常不易。为了向贵司表达最真挚的支持，我们特别在实验室中提前备妥了一套定制样品。祝愿能陪伴贵司在 ${country} 的分析团队共同实现更稳定的谱图基线。如有回复，深表感激！`;
        }
      } 
      else if (milestoneStage === 'Solution validation') {
        if (toneType === '专家顾问风') {
          generatedSubject = `【方案验证】${companyName} 专项专属 ${targetProduct} 制规 EHS 合规文件及 GMP 资质说明`;
          generatedBody = `尊敬的 ${contactName} 先生/女士，\n\n在双方稳步跨入 ${targetProduct} 方案准入与合规验证阶段之际，我司技术审查部已汇总整理了最完备的准入档案合规包。\n\n我们承诺所供原材料的水分控制严格在 <50ppm 的绝对临界内。随信附上的 GMP 资质、REACH 声明及完整的杂质分析底卷，将能够极大缩减贵司品控与海事部门的重复校对成本，实现绿通审批。`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `急送：${targetProduct} 主放行文件与 REACH/EHS 硬核技术底卷包`;
          generatedBody = `你好 ${contactName}，\n\n让我们一秒都不耽误，直接为您扫清方案验证障碍！我们已经将该批 ${targetProduct} 的危化合规、REACH 备案及完整的制备 EHS 安全文件打包整理好。\n\n请查看附件，让贵方质保部门优先予以放行，我们下周随时视频对接。`;
        } else {
          generatedSubject = `温馨呈递：${companyName} 新项目 ${targetProduct} 验证资质专属合规卷宗`;
          generatedBody = `亲爱的 ${contactName}，\n\n在双方全力配合进行 ${targetProduct} 方案验证的美好时刻，我们为您打包递送这份精细整理的合规手册。\n\n只要贵司在 ${country} 阶段需要任何技术调整，我们的售后团队均会24小时随时提供温馨服务，祝愿验证一切顺利！`;
        }
      } 
      else if (milestoneStage === 'Commercial negotiation') {
        if (toneType === '专家顾问风') {
          generatedSubject = `关于 ${companyName} 战略采购 ${targetProduct} 的总体 ROI 绝对资产增量贡献测算`;
          generatedBody = `尊敬的 ${contactName} 先生/女士，\n\n在成功克服技术规格的验证障碍后，为最大化支持贵司的长效经营决策，我们针对本次采购深度引入了绝对值投资回报剖析。\n\n经测算，我们两司本次客商采购规模变动绝对指标达到价值 $${sourcingIndexDelta.toLocaleString()} USD 的规模。这笔纯增量对弥补贵司年度战略大货缺口（上年度绝对值基数为 $${baseGmvLastYear.toLocaleString()} USD，本年度预期增长至 $${targetGmvThisYear.toLocaleString()} USD，绝对变动缺口为 $${absoluteGapPool.toLocaleString()} USD）起到了高达 ${absoluteContributionRate}% 的绝对高权重价值支撑。通过拒绝 speculative 百分比公式，用绝对美元贡献逻辑定价，我们给到极优 CFR bulk 阶梯对价 $45/kg，期待您的最终授权。`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `【底线财务增量测算】$${sourcingIndexDelta.toLocaleString()} 绝对值对 ${companyName} 年度目标的绝对价值锁定`;
          generatedBody = `你好 ${contactName}，\n\n别管虚无缥缈的营销话术了，我们直接用硬核财务数据说话：\n\n通过锁定本次 ${targetProduct} 直通采购渠道，我们将为您提供绝对变动规模达 $${sourcingIndexDelta.toLocaleString()} USD 的客商业务增值。该数额直接填补了贵司全年绝对目标跨越期缺口（$${absoluteGapPool.toLocaleString()} USD 全年绝对变动，即从去年的 $${baseGmvLastYear.toLocaleString()} USD 稳升至今年 $${targetGmvThisYear.toLocaleString()} USD 目标）的 ${absoluteContributionRate}% 绝对权重份额。不掺数的绝对值财务贡献是我们的最大诚意，商务报价直锁 CFR $45/kg，立即签发订单！`;
        } else {
          generatedSubject = `真诚致献：多维 GMV 绝对贡献测算及 ${companyName} 专属商务方案`;
          generatedBody = `亲爱的 ${contactName}，\n\n很高兴与您开启深入的商务定价磋商。我们始终认为，有说服力的客情源自于透明坚实的财务共赢。\n\n根据精细评估，本次合作对应的 $${sourcingIndexDelta.toLocaleString()} USD 业务量变动，将温暖支撑起贵司从 $${baseGmvLastYear.toLocaleString()} USD 跃升至 $${targetGmvThisYear.toLocaleString()} USD 所必需填充的 $${absoluteGapPool.toLocaleString()} USD 年度年度突破缺口的 ${absoluteContributionRate}% 绝对高权重变动。我们极度重视这个合作机会，愿意在满足极好付款账期的基础上，提供优质商务回馈。`;
        }
      } 
      else { // Full launch
        const hasPreapprovedSinosure = blacklistStatus.blocked ? '暂不可用（受制于 Version 1.0 Coupons 排雷警告）' : '$150,000 USD';
        if (toneType === '专家顾问风') {
          generatedSubject = `标准联合供应协议：月度量产常态发运保障及中信保专项授信支持`;
          generatedBody = `尊敬的 ${contactName} 先生/女士，\n\n祝贺双方合作正式挺进常态量产阶段！为绝对保障贵司全量产线的平稳流转，我们已建立 150 吨常态驻港现货特保周转仓。\n\n此外，中信保（Sinosure）信用额度复核已顺利批复，预授信额度高达 ${hasPreapprovedSinosure}，提供同业最佳低息赊销。请审核今日递交的主 SLA 框架草案，以便按期启动首月货运出航。`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `【全量发运开启】首期 150吨 现货锁仓 + 中信保 ${hasPreapprovedSinosure} 专属发货绿色通道`;
          generatedBody = `你好 ${contactName}，\n\n全量上线大货交付正式打响！针对高纯级 ${targetProduct}，我们已完成对首批发运仓库 150 吨的物理锁仓。中信保专项授信通道现已全部开通，批复授信上限达 ${hasPreapprovedSinosure}。\n\n一切全副武装，为了让货轮在下半月如期启航，请于 48小时 内签发主 SLA 框架备忘录，我们会立即在仓库安排打托装船！`;
        } else {
          generatedSubject = `热烈祝贺两司 ${targetProduct} 全量合作量产上线：携手谱写信保通途新篇章`;
          generatedBody = `亲爱的 ${contactName}，\n\n最热烈的祝贺呈送给贵我两司，我们的 ${targetProduct} 采购合作终于迎来了隆重的全量上线纪元！\n\n为确保稳健供货，我们承诺极好的月度货位倾斜，同时由中信保鼎力支持的 ${hasPreapprovedSinosure} 专属金融授信也已宣告就绪。您的信任是我们最高的勋章，期待与您紧密对接，迈向更加伟大的未来！`;
        }
      }

      // Add Expansion Coupon paragraph if switched on
      if (includeExpansionCoupon) {
        generatedBody += `\n\n[加签追加优惠 - 1.5倍采购额度膨胀券] \n如需加快此周期的合同落地，我们特此附带了 1.5倍大货年度采购额度膨胀凭证（可在此周期大单落地时，协助买家解锁多达 $15,000 USD 采购折扣让利），保障首单成本降到极致。`;
      }

      // Format output templates for Non-Email channels
      if (channelType === '微信/社群') {
        const orig = generatedBody;
        generatedBody = `📱 [微信/社群] 对接人: ${contactName}\n\n您好！目前我司针对 ${targetProduct} 开发项目，已正式进入「${milestoneStage === 'Requirement freeze' ? '需求冻结阶段' : milestoneStage === 'Solution validation' ? '规范方案验证阶段' : milestoneStage === 'Commercial negotiation' ? '商务绝对变动测算阶段' : '全量常态发运阶段'}」：\n\n${orig.substring(0, Math.min(orig.length, 245))}...\n\n👉 特色联动：已联络内部中信保锁定制单！${includeExpansionCoupon ? '（1.5x 额度放大凭证已成功入库生效）' : ''}`;
      } else if (channelType === '领英') {
        const orig = generatedBody;
        generatedBody = `🔗 [LinkedIn Message] \n\nHi ${contactName},\n\nRegarding high-reliability ${targetProduct} specifications for ${companyName} based on ${source}.\n\nOur project milestone: [${milestoneStage}] has been upgraded with absolute pricing calculus.\n\n${orig.substring(0, Math.min(orig.length, 215))}...\n\nLet's network to lock downstream logistics details!`;
      }

    } else {
      // --- ENGLISH TEMPLATES ---
      if (milestoneStage === 'Requirement freeze') {
        if (toneType === '专家顾问风') {
          generatedSubject = `Technical Specifications Alignment on High-Purity ${targetProduct} for ${companyName}`;
          generatedBody = `Dear Mr./Ms. ${contactName},\n\nI hope this message finds you well.\n\nWe noted your active inquiry regarding ${targetProduct} originating from ${source}.\n\nOur chemical engineers have reviewed your high purity parameters. To proactively align with your molecular chromatography demands, we would like to offer high-resolution test spectra (UHPLC baseline chromatogram logs) and submit 100mL complimentary test samples directly to your tech team in ${country}. Our process ensures complete elimination of metal residuals. Let us know if we can coordinate an initial spec review.\n\nSincerely,\nProcurement Integrity Advisor`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `RE: Instant sample batch & Locked Specs slots for ${targetProduct} - Urgent Dispatch`;
          generatedBody = `Hi ${contactName},\n\nRegarding your target supply for ${targetProduct} on ${source}, our production batch for this quarter is locking in quick.\n\nTo allow your QA lab in ${country} to test immediately, we are proactively dispatching a free 100ml sample complete with a validated ISO COA report. Send us your courier address right now so we can seal this batch slot for you!`;
        } else {
          generatedSubject = `Warm Greetings from China Chemical Labs: Special Sample Customization for ${companyName}`;
          generatedBody = `Dear ${contactName},\n\nHappy to establish contact with you. We followed your specific interest in ${targetProduct}.\n\nWe understand that selecting a stable chemical partner is highly demanding. To give you ultimate comfort, we would be pleased to post a custom complimentary sample pack with an official COA. Supporting your analytics team in ${country} to attain superior baseline stability is our primary wish. Let's arrange a brief, warm call to discuss further.`;
        }
      } 
      else if (milestoneStage === 'Solution validation') {
        if (toneType === '专家顾问风') {
          generatedSubject = `Solution Validation: Advanced Chemical Dossier & EHS Regulatory Compliance Pack for ${companyName}`;
          generatedBody = `Dear Mr. ${contactName},\n\nAs we advance into the Solution Validation stage for the supply of ${targetProduct}, we have compiled our complete EHS regulatory compliance files & GMP specification index.\n\nWe guarantee high-resolution batch synthesis logs alongside precise water parameter controls (<50ppm limit). Attached please find our certified ISO dossier with REACH declarations to help your QA team expedite standard audit approvals easily.`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `FAST Audit Dossiers inside: Validating Purity standards for ${targetProduct}`;
          generatedBody = `Hi ${contactName},\n\nLet's get your QA audit cleared with zero delays. We've compiled our top-tier manufacturing EHS credentials and REACH verification papers for ${targetProduct}.\n\nCheck our attached specifications dossier to secure rapid validation within your engineering team. Let's make this happen and schedule the test pipeline next week!`;
        } else {
          generatedSubject = `Sincere Cooperation: Solution Validation & Certified Documentation for ${companyName}`;
          generatedBody = `Dear ${contactName},\n\nIn our continuous effort to support ${companyName}'s growth, we are delighted to share our validated EHS files, compliance charts, and GMP certificates for our ${targetProduct} solution.\n\nour technical crew stands fully ready to tune any purification scales to fully conform with ${country}'s chemical safety policies. We look forward to a successful, safe validation together.`;
        }
      } 
      else if (milestoneStage === 'Commercial negotiation') {
        if (toneType === '专家顾问风') {
          generatedSubject = `Commercial Terms Proposal & Absolute ROI Sourcing Calculus for ${mediumProduct(targetProduct)}`;
          generatedSubject = `Commercial Terms Proposal & Absolute ROI Sourcing Calculus for ${targetProduct}`;
          generatedBody = `Dear Mr. ${contactName},\n\nFollowing our successful technical match, we have analyzed the overall margin contribution of our ${targetProduct} supply logic.\n\nBased on quantitative ROI logic, our modeled sourcing index delta of $${sourcingIndexDelta.toLocaleString()} USD contributes exactly ${absoluteContributionRate}% absolute value contribution toward filling your platform's annual GMV target gap ($${absoluteGapPool.toLocaleString()} USD, raising from last-year base of $${baseGmvLastYear.toLocaleString()} USD to this-year target of $${targetGmvThisYear.toLocaleString()} USD). By substituting speculative multiplier projections with computed absolute financial increments, we assure optimized CFR bulk pricing of $45/kg under our streamlined Sinosure compliance frameworks.`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `CRITICAL SAVINGS CALCULUS: High-yield absolute GMV contribution for ${companyName}`;
          generatedBody = `Hi ${contactName},\n\nLet's skip the marketing fluff and look at the absolute bottom line. By purchasing ${targetProduct} through our direct channel, we are locking in $${sourcingIndexDelta.toLocaleString()} USD in procurement index delta saving.\n\nThis translates directly to a computed ${absoluteContributionRate}% absolute value contribution toward satisfying your yearly growth deficit target ($${absoluteGapPool.toLocaleString()} USD absolute incremental gap from $${baseGmvLastYear.toLocaleString()} USD and target $${targetGmvThisYear.toLocaleString()} USD). We avoid inflated percentage estimates and give you straight dollar-matching margins. Reach out to secure our locked CFR bulk price of $45/kg immediately!`;
        } else {
          generatedSubject = `Tailored Financial Proposal: Sourcing Efficiencies & Mutual Growth for ${companyName}`;
          generatedBody = `Dear ${contactName},\n\nWe are pleased to introduce our special commercial quote for ${targetProduct}.\n\nOur pricing is engineered to assure that a procurement delta of $${sourcingIndexDelta.toLocaleString()} USD provides a very tangible ${absoluteContributionRate}% absolute value contribution to satisfying ${companyName}'s annual target growth deficit of $${absoluteGapPool.toLocaleString()} USD (with base transaction value of $${baseGmvLastYear.toLocaleString()} USD progressing to a target of $${targetGmvThisYear.toLocaleString()} USD). We believe in providing solid, transparent, absolute-growth-based partnership models to secure steady years of alliance.`;
        }
      } 
      else { // Full launch
        const hasPreapprovedSinosure = blacklistStatus.blocked ? 'N/A' : '$150,000 USD';
        if (toneType === '专家顾问风') {
          generatedSubject = `Standardized Supply Protocol: Volume Spot Stock Guarantee & Pre-approved Credit Lines`;
          generatedBody = `Dear Mr. ${contactName},\n\nWe are excited to step into the Full Launch stage! We are completely geared up to support your repeating volume rollouts of ${targetProduct} alongside priority spot reserves.\n\nOur credit pre-clearance has approved a credit limit of ${hasPreapprovedSinosure} under standard interest-free trade credits of Sinosure. Let's finalize the overarching master supply SLA to initiate the monthly continuous shipment protocol.`;
        } else if (toneType === '狼性现货风') {
          generatedSubject = `FULL LAUNCH ACTIVATED: Spot Stock Reserves & Confirmed Credit Support`;
          generatedBody = `Hi ${contactName},\n\nWe are officially live on massive rollout! For the Full Launch of ${targetProduct}, we are locking down dedicated spot stock reserves up to 150 tons to guarantee bulletproof delivery dispatch.\n\nWe've also coordinated with Sinosure to clear a transactions credit limit of ${hasPreapprovedSinosure} for ${companyName}. Let's secure this priority slot and authorize shipment routing this week!`;
        } else {
          generatedSubject = `Congratulations on Full Launch! Secure Monthly reserves & Flexible Credit terms`;
          generatedBody = `Dear ${contactName},\n\nHeartfelt congratulations to ${companyName} as we transition to our Full Launch phase of our mutual business.\n\nWe have priority-reserved steady monthly spot allocations of ${targetProduct} to give your operations 100% peace of mind. We have also secured a trade-backed credit limit of ${hasPreapprovedSinosure} to support your bulk imports smoothly. Thank you for this fruitful trust!`;
        }
      }

      // Add English Promo if active
      if (includeExpansionCoupon) {
        generatedBody += `\n\n[Promo Addendum - 1.5x Procurement Expansion Voucher]\nTo accelerate contract finalization, we are attach-enclosing our 1.5x Volume Expansion Credit Voucher (value credit offsetting up to $15,000 USD) to assist you in maximizing procurement ROI.`;
      }

      // Format output templates for Non-Email channels
      if (channelType === '微信/社群') {
        const orig = generatedBody;
        generatedBody = `📱 [WeChat Group] Contact: ${contactName}\n\nHi! Regarding ${targetProduct}, our timeline has successfully progressed to the [${milestoneStage}] phase:\n\n${orig.substring(0, Math.min(orig.length, 210))}...\n\n👉 Note: We have coordinated with our finance desk to secure trade credit clearance. ${includeExpansionCoupon ? '(1.5x Expansion Coupon has been applied)' : ''}`;
      } else if (channelType === '领英') {
        const orig = generatedBody;
        generatedBody = `🔗 [LinkedIn Message] \n\nHi ${contactName},\n\nRegarding high-reliability ${targetProduct} specifications for ${companyName} based on ${source}.\n\nOur project milestone: [${milestoneStage}] has been upgraded with absolute pricing calculus.\n\n${orig.substring(0, Math.min(orig.length, 210))}...\n\nLet's network to lock downstream logistics details!`;
      }
    }

    setSubjectDraft(generatedSubject);
    setCustomDraft(generatedBody);

  }, [companyName, contactName, country, targetProduct, source, painPoint, milestoneStage, channelType, toneType, includeExpansionCoupon, language, blacklistStatus.blocked]);

  // Handle manual / AI optimized rewrite post to backend API
  const handleDeepAIOptimization = async () => {
    setIsGenerating(true);
    setStatusText('连接大模型中，对齐重量及杂质消除参数，重新精写文本...');

    try {
      await new Promise(r => setTimeout(r, 600));
      const res = await fetch('/api/ai/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          country,
          targetProduct,
          source,
          painPoint,
          language,
          tone: toneType === '狼性现货风' ? 'direct' : toneType === '温和客情风' ? 'warm' : 'professional'
        })
      });

      if (!res.ok) {
        throw new Error('API Code error fallback');
      }

      const data = await res.json();
      const output = data.outreach;

      if (output) {
        let subject = output.subject || '';
        let body = '';

        if (channelType === '邮件') {
          if (milestoneStage === 'Full launch') {
            body = output.expoInvitationMessage || output.message;
          } else if (milestoneStage === 'Commercial negotiation') {
            body = output.followUpMessage || output.message;
          } else {
            body = output.message;
          }
        } else if (channelType === '微信/社群') {
          body = output.whatsappMessage || output.message;
        } else if (channelType === '领英') {
          body = output.linkedinMessage || output.message;
        }

        // Add Expansion Coupon paragraph if switched on
        if (includeExpansionCoupon) {
          if (language === 'zh') {
            body += `\n\n[加签追加优惠 - 1.5倍采购额度膨胀券] \n如需加快此周期的合同落地，我们特此附带了 1.5倍大货年度采购额度膨胀凭证（可在此周期大单落地时，协助买家解锁多达 $15,000 USD 采购折扣让利），保障首单成本降到极致。`;
          } else {
            body += `\n\n[Promo Addendum - 1.5x Procurement Expansion Voucher]\nTo accelerate contract finalization, we are attach-enclosing our 1.5x Volume Expansion Credit Voucher (value credit offsetting up to $15,000 USD) to assist you in maximizing procurement ROI.`;
          }
        }

        if (subject) {
          setSubjectDraft(subject);
        }
        setCustomDraft(body);
        setStatusText('AI 深度重写并调优成功！');
      }
    } catch (err: any) {
      console.error(err);
      setStatusText('API 优化失败，已退回到智能本地推荐模板。');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle append requests
  const handleAppendAI = async () => {
    if (!appendInput.trim()) return;
    setIsAppending(true);
    setStatusText('AI 实时润色与追加话术中...');

    try {
      await new Promise(r => setTimeout(r, 800));
      const textToAppend = appendInput.trim();
      let addition = '';
      
      if (language === 'zh') {
        addition = `\n\n【AI 追加保障及承诺】：关于您提到的「${textToAppend}」，我们承诺提供全套专属保驾，保障相关时效与合规流程，确保每一批大货以最优质的状态准时交付。`;
      } else {
        addition = `\n\n[AI Appendix Commitment]: Regard to your request on "${textToAppend}", we hereby confirm our full operational guarantee, assuring strict response SLAs and certified compliance pathways for pristine-batch delivery.`;
      }
      
      setCustomDraft(prev => prev + addition);
      setStatusText(`成功追加微调内容：${textToAppend}`);
      setAppendInput('');
    } catch (error) {
      console.error(error);
      setStatusText('追加修改失败。');
    } finally {
      setIsAppending(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = channelType === '邮件' 
      ? `Subject: ${subjectDraft}\n\n${customDraft}` 
      : customDraft;
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      setStatusText('开发文本已成功复制到剪贴板！');
    }
  };

  const getAttachmentsForStage = () => {
    switch (milestoneStage) {
      case 'Requirement freeze':
        return [
          { name: 'Apex_BioLab_A740_HPLC_Specification_Match_Draft.pdf', size: '1.4 MB' },
          { name: 'Chromatography_Acetonitrile_Standard_COA_Sample_v4.pdf', size: '820 KB' }
        ];
      case 'Solution validation':
        return [
          { name: 'Acetonitrile_HPLC_Grade_GMP_Certificate.pdf', size: '2.1 MB' },
          { name: 'REACH_Compliance_Registration_Dossier_2026.pdf', size: '1.8 MB' }
        ];
      case 'Commercial negotiation':
        return [
          { name: 'Commercial_SLA_Bulk_Pricing_ROI_Calculation.xlsx', size: '450 KB' },
          { name: 'Standard_Payment_Terms_Sinosure_Guidelines.pdf', size: '1.1 MB' }
        ];
      case 'Full launch':
      default:
        return [
          { name: 'Sinosure_Credit_Limit_Approval_Notice_Apex.pdf', size: '750 KB' },
          { name: 'Master_Supply_Agreement_SLA_Draft_Corporate.pdf', size: '2.4 MB' }
        ];
    }
  };

  function mediumProduct(p: string) {
    return p;
  }

  return (
    <div className="space-y-6 text-slate-700 bg-white p-6 rounded-xl border border-slate-200 shadow-sm font-sans" id="outreach-tactical-cockpit-v2">
      
      {/* Refined Minimalist Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            AI 触达及开发话术助手
            <span className="text-[10px] font-mono font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Copilot 2.0
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            针对外贸生命周期节点，自适应匹配双语模板与绝对 GMV 测算。包含防冲突排雷筛查。
          </p>
        </div>
        
        <button
          onClick={() => handleSelectLeadChange(selectedLeadId)}
          className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <RefreshCw className="w-3" />
          重置参数
        </button>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Column - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              线索挂载及规则设置
            </h3>
            
            {/* 1. Track Lead Bind */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 font-medium">
                1. 关联目标交易线索
              </label>
              <select
                id="outreach-lead-bind-select"
                value={selectedLeadId}
                onChange={(e) => handleSelectLeadChange(e.target.value)}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors shadow-xs"
              >
                {leadsList.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    [{lead.id}] {lead.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags preview */}
            <div className="space-y-1">
              <span className="block text-[10px] text-slate-500 font-medium">
                线索情报标签
              </span>
              <div className="flex flex-wrap gap-1">
                {intelligenceTags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9.5px] text-slate-600 font-mono shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Language Switcher */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 font-medium">
                2. 输出语言 (Language)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage('zh')}
                  className={`py-1 rounded text-xs transition-all cursor-pointer border ${
                    language === 'zh'
                      ? 'bg-slate-800 border-slate-800 text-white font-medium shadow-xs'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                  }`}
                >
                  中文
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-1 rounded text-xs transition-all cursor-pointer border ${
                    language === 'en'
                      ? 'bg-slate-800 border-slate-800 text-white font-medium shadow-xs'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* 3. Milestone Selection */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 font-medium">
                3. 里程碑阶段 (Milestone Stage)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Requirement freeze', 'Solution validation', 'Commercial negotiation', 'Full launch'] as const).map((stageItem) => {
                  const isActive = milestoneStage === stageItem;
                  const getDisplayName = (s: MilestoneStage) => {
                    if (s === 'Requirement freeze') return '需求对齐 (QA)';
                    if (s === 'Solution validation') return '资质方案 (Dossier)';
                    if (s === 'Commercial negotiation') return '商务定价 (ROI)';
                    return '量产交付 (Launch)';
                  };
                  return (
                    <button
                      key={stageItem}
                      type="button"
                      onClick={() => setMilestoneStage(stageItem)}
                      className={`p-1.5 rounded text-[10px] text-left transition-all cursor-pointer border ${
                        isActive 
                          ? 'bg-slate-800 border-slate-800 text-white font-medium shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
                      }`}
                    >
                      {getDisplayName(stageItem)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blacklist Pre-check (Quiet Informational Banner) */}
            <div className={`p-2.5 rounded-lg border text-[11px] space-y-0.5 transition-all ${
              blacklistStatus.blocked 
                ? 'bg-rose-50 border-rose-200 text-rose-800 font-medium' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-1.5 font-semibold">
                <Shield className={`w-3.5 h-3.5 ${blacklistStatus.blocked ? 'text-rose-500' : 'text-slate-400'}`} />
                <span>防冲突排雷筛查</span>
              </div>
              <p className={`text-[10px] leading-normal font-sans ${blacklistStatus.blocked ? 'text-rose-650' : 'text-slate-500'}`}>
                {blacklistStatus.reason}
              </p>
            </div>

            {/* 4. Channel and Tone (Tidy layout) */}
            <div className="space-y-2 pt-0.5">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-medium">
                  触达渠道
                </label>
                <div className="grid grid-cols-3 gap-1 p-0.5 bg-white rounded border border-slate-200">
                  {(['邮件', '微信/社群', '领英'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChannelType(ch)}
                      className={`py-1 rounded text-[10px] transition-all cursor-pointer ${
                        channelType === ch 
                          ? 'bg-slate-800 text-white font-medium shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800 border border-transparent'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-medium">
                  话术格调
                </label>
                <div className="grid grid-cols-3 gap-1 p-0.5 bg-white rounded border border-slate-200">
                  {(['专家顾问风', '狼性现货风', '温和客情风'] as const).map((tk) => (
                    <button
                      key={tk}
                      onClick={() => setToneType(tk)}
                      className={`py-1 rounded text-[10px] transition-all cursor-pointer ${
                        toneType === tk 
                          ? 'bg-slate-800 text-white font-medium shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800 border border-transparent'
                      }`}
                    >
                      {tk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleDeepAIOptimization}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-750 text-white transition-all py-2 rounded text-xs font-semibold cursor-pointer mt-4 shadow-xs h-9 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3 log-3 animate-spin text-white" />
                  智能生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 text-white" />
                  生成定制触达话术
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Content / Workspace Column - 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Status Tracer Banner */}
          <div className="bg-slate-50 border border-slate-200 p-2.5 px-3.5 rounded-lg text-xs flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="truncate">状态提示：{statusText}</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
              {channelType} • {toneType} • {language.toUpperCase()}
            </span>
          </div>

          {/* Unified Editor Card */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col min-h-[460px] shadow-xs">
            
            {/* Header */}
            <div className="flex bg-slate-50 border-b border-slate-200 px-4 py-2.5 items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-800">开发文本主面板</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-mono text-[11px] truncate max-w-[150px] sm:max-w-none">{companyName}</span>
              </div>
              
              <div className="text-[9px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase font-semibold">
                {milestoneStage === 'Requirement freeze' ? '需求阶段' : milestoneStage === 'Solution validation' ? '验证阶段' : milestoneStage === 'Commercial negotiation' ? '商务谈判' : '全量常态'}
              </div>
            </div>

            {/* Subject edit if Email */}
            {channelType === '邮件' && (
              <div className="bg-slate-50/50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-500 shrink-0">主题:</span>
                <input 
                  type="text"
                  value={subjectDraft}
                  onChange={(e) => setSubjectDraft(e.target.value)}
                  className="bg-transparent border-none text-slate-800 w-full focus:outline-none font-sans font-medium text-xs py-0.5"
                />
              </div>
            )}

            {/* Editor Textarea Area */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              
              <div className="space-y-1.5 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono uppercase tracking-wider">
                  <span>实时编辑草稿（可直接微调修改）</span>
                  {includeExpansionCoupon && (
                    <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-amber-200">
                      已挂载 1.5x 额度扩张券
                    </span>
                  )}
                </div>

                <textarea
                  id="outreach-output-box"
                  rows={13}
                  value={customDraft}
                  onChange={(e) => setCustomDraft(e.target.value)}
                  className="w-full flex-1 bg-slate-50 border border-slate-200 rounded p-4 font-mono text-[11.5px] leading-relaxed text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all whitespace-pre-wrap select-text resize-y"
                  placeholder="正在拉取目标商机特征，生成专业话术草稿..."
                />
              </div>

              {/* AI Append Field */}
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                  <span>AI 实时追加微调控制</span>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={appendInput}
                    onChange={(e) => setAppendInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAppendAI();
                    }}
                    placeholder={
                      language === 'zh' 
                        ? '例如：加上1小时时效承诺、质量双检保障...' 
                        : 'e.g. Add 1-hour fast reply commitment, double QA assurance...'
                    }
                    className="flex-1 bg-white border border-slate-200 rounded py-1.5 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={handleAppendAI}
                    disabled={isAppending || !appendInput.trim()}
                    className="bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-40 font-semibold rounded px-4 text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 border border-slate-700 shadow-xs h-8"
                  >
                    {isAppending ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-white" />
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-white" />
                        追加
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Coupons Switcher */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-805 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    附加首单「1.5倍采购额度膨胀券」活动权益
                  </span>
                  <p className="text-[10px] text-slate-500 max-w-lg leading-normal font-sans">
                    对高意愿/商务谈判期客商，一键附加 1.5x Volume Expansion Coupon (额度膨胀最高折合优惠 $15,000 USD)。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIncludeExpansionCoupon(prev => !prev);
                    setStatusText(!includeExpansionCoupon ? '已加签「1.5x大货膨胀券」凭证详情。' : '已移出膨胀券文本。');
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 border shadow-xs ${
                    includeExpansionCoupon 
                      ? 'bg-amber-50 border-amber-200 text-amber-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  {includeExpansionCoupon ? '已加签' : '一键加入话术'}
                </button>
              </div>

              {/* Copy & Footer Action Row */}
              <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>支持直接修改草稿，满意后一键复制开发材料。</span>
                </span>

                <button 
                  id="copilot-copy-btn"
                  onClick={copyToClipboard}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors self-end text-xs h-8"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      已复制！
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white" />
                      复制开发材料
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Smart Attachments recommended based on state */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-2xs">
            <h4 className="text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              随信匹配推荐辅助船检与资质物料 / Recommended Attachments
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {getAttachmentsForStage().map((doc, index) => (
                <div 
                  key={index}
                  className="bg-white hover:bg-slate-100/50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between transition-all shadow-2xs"
                >
                  <span className="text-slate-700 text-xs truncate pr-2 font-medium" title={doc.name}>
                    {doc.name}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-600 shrink-0 bg-emerald-55 px-1.5 py-0.5 rounded border border-emerald-100 font-semibold">
                    {doc.size}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SDR Follow Up Cadence workflow */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <h4 className="font-bold text-slate-500 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              SDR 客户跟进培育推荐推进节奏建议 / Follow-up Cadence
            </h4>
            <div className="grid grid-cols-5 text-center text-[9px] gap-2 pt-1 font-sans">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-700">Day 1</span>
                <span className="text-slate-500 mt-1 block">首封破冰</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-700">Day 3</span>
                <span className="text-slate-500 mt-1 block">领英背调</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-700">Day 5</span>
                <span className="text-slate-500 mt-1 block">二次催存</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-700">Day 8</span>
                <span className="text-slate-500 mt-1 block">方案跟进</span>
              </div>
              <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200">
                <span className="font-bold block text-indigo-700">Day 12</span>
                <span className="text-indigo-600 mt-1 block text-[8px] sm:text-[9px] font-medium">寄发定制样</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
