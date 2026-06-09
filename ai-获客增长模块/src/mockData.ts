/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, Tender, CustomerResearch, OutreachMessage } from './types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'L-001',
    source: '展会雷达',
    companyName: 'Bayer Diagnostic Sourcing GmbH',
    country: 'Germany',
    region: 'Europe',
    customerType: '终端工厂',
    contactName: 'Dr. Andreas Weber',
    contactTitle: 'Senior API Procurement Manager',
    email: 'a.weber@bayer-diagnostics.de',
    phone: '+49 214 30-14522',
    linkedin: 'linkedin.com/in/andreas-weber-bayer',
    website: 'www.bayer.com/en/diagnostics',
    productKeywords: 'Paracetamol, Acetaminophen USP',
    casNo: '103-90-2',
    intentDescription: '正在寻找符合欧洲药典 (EP/USP) 标准的对乙酰氨基酚稳定供应商，首期需求 50 吨/季度，要求提供 CEP/GMP 证书。',
    intentScore: 92,
    leadScore: 95,
    leadGrade: 'A',
    riskLevel: '低',
    recommendedAction: '展前主动预约面谈，并提供完整的 GMP、CEP 资质包及 1kg 的样品检测报告 (COA)',
    status: '待联系',
    createdAt: '2026-06-01 10:24:00'
  },
  {
    id: 'L-002',
    source: '社媒意向',
    companyName: 'Apex BioLab Supplies India',
    country: 'India',
    region: 'South Asia',
    customerType: '分销商',
    contactName: 'Rajesh Kumar',
    contactTitle: 'Director of Reagent Portfolio',
    email: 'rajesh@apexbio.in',
    phone: '+91 22 6542 8190',
    linkedin: 'linkedin.com/in/rajesh-kumar-apex-biolab',
    website: 'http://www.apexbio.in',
    productKeywords: 'Acetonitrile HPLC Grade, Methanol AR',
    casNo: '75-05-8',
    intentDescription: '在 LinkedIn 化学试剂供求小组发帖：Looking for reliable Chinese supplier for HPLC Grade Acetonitrile (CAS 75-05-8) and Methanol AR. Annual demand approx 4,000 cases.',
    intentScore: 85,
    leadScore: 88,
    leadGrade: 'A',
    riskLevel: '低',
    recommendedAction: '立即加 LinkedIn 好友并发送 WhatsApp 短消息首轮报价，附带 HPLC 分析谱图',
    status: '已发送开发信',
    createdAt: '2026-06-03 14:15:22'
  },
  {
    id: 'L-003',
    source: '展会雷达',
    companyName: 'Sigma-Tech Laboratory Solutions',
    country: 'United States',
    region: 'North America',
    customerType: '高校/科研所',
    contactName: 'Sarah Jenkins',
    contactTitle: 'Lab Sourcing Lead',
    email: 'sjenkins@sigmatechlabs.com',
    phone: '+1 617-555-0198',
    linkedin: 'linkedin.com/in/sjenkins-labsolutions',
    website: 'www.sigmatechlabs.com',
    productKeywords: 'Ultra-pure Acetonitrile, High-purity Methanol',
    casNo: '75-05-8',
    intentDescription: 'CPHI 展位意向登记。寻找用于生物大分子实验室分析的超纯乙腈与甲醇。月度采购量 200 瓶（4L），常态化现货采购。',
    intentScore: 78,
    leadScore: 74,
    leadGrade: 'B',
    riskLevel: '低',
    recommendedAction: '先进行完整外贸背调，确认其在美国本地的分销网络；然后寄送 4L/箱 小批测试装',
    status: '待联系',
    createdAt: '2026-06-04 09:12:00'
  },
  {
    id: 'L-004',
    source: '社媒意向',
    companyName: 'EuroChemi Distribution Services',
    country: 'Netherlands',
    region: 'Europe',
    customerType: '分销商',
    contactName: 'Bas de Jong',
    contactTitle: 'Chemical Sourcing Associate',
    email: 'bas.dejong@eurochemi-dist.nl',
    phone: '+31 20 882 1209',
    linkedin: 'linkedin.com/in/bas-dejong-eurochemi',
    website: 'www.eurochemi-dist.nl',
    productKeywords: 'Acetone, DMF CAS 68-12-2',
    casNo: '68-12-2',
    intentDescription: '在 Reddit /r/chemicalindustry 询价：Need DMF Bulk Supply ( Netherlands CFR Rotterdam). Need 80 drums. Lead time: within 30 days.',
    intentScore: 82,
    leadScore: 81,
    leadGrade: 'B',
    riskLevel: '中',
    recommendedAction: '核算危化品海运海事运费与出口资质（该司有一定清关滞期风险，需 TT 预付）',
    status: '已回复',
    createdAt: '2026-06-05 16:45:00'
  },
  {
    id: 'L-005',
    source: 'B2B平台',
    companyName: 'South-Pharma Labs Brasil',
    country: 'Brazil',
    region: 'Latin America',
    customerType: '其他',
    contactName: 'Mateo Santos',
    contactTitle: 'QA Inspector & Buyer',
    email: 'msantos@southpharmalabs.com.br',
    phone: '+55 11 98765-4321',
    linkedin: 'linkedin.com/in/mateo-santos-southpharma',
    website: 'www.southpharmalabs.com.br',
    productKeywords: 'Methanol, Active Pharmaceutical Ingredients',
    casNo: '67-56-1',
    intentDescription: 'Alibaba 询盘投递：寻求工业级、分析级甲醇长期供应伙伴，价格需含税送巴西桑托斯港。首单付款条件常要求 OA 60天。',
    intentScore: 60,
    leadScore: 55,
    leadGrade: 'C',
    riskLevel: '高',
    recommendedAction: '评估巴西海关高额进口反倾销风险与付款信用度，推荐只采用 100% 信用证 (L/C)',
    status: '已转询盘',
    createdAt: '2026-06-06 11:30:10'
  }
];

export const INITIAL_TENDERS: Tender[] = [
  {
    id: 'T-001',
    title: '广东省南方医科大学附属第一医院2026年度高纯试剂（乙腈、甲醇、丙酮）集中采购招标项目',
    buyerName: '南方医科大学附属第一医院',
    region: '广东省',
    publishDate: '2026-06-01',
    deadline: '2026-06-25',
    budget: '¥850,000',
    productName: '色谱乙腈/色谱甲醇/分析纯丙酮',
    casNo: '75-05-8, 67-56-1',
    specification: '色谱纯 HPLC Grade 4L/瓶 / 瓶装纯度 ≥99.9%',
    contactName: '刘主任',
    contactPhone: '020-62781234',
    tenderUrl: 'https://www.ccgp-guangdong.gov.cn/specTender/T001',
    matchScore: 95,
    difficulty: '中',
    winProbability: 78,
    requiredDocs: [
      '营业执照与三证合一代码',
      '危险化学品经营许可证/特别管理通道证明',
      '色谱级产品检验报告 (COA) 与第三方认证',
      '近三年三家以上三甲医院同类供货业绩合同'
    ],
    recommendedAction: '产品规格、纯度参数100%匹配我司产品线。主要关注南方医科大学的业绩门槛，可考虑通过有合作背景的高校贸易代理商进行联合投标，预计中标率高。',
    status: '待跟进',
    createdAt: '2026-06-01 15:00:00'
  },
  {
    id: 'T-002',
    title: '浙江省环境科学研究院2026年实验室耗材与特高纯有机溶剂公开比选项目',
    buyerName: '浙江省环境科学研究院',
    region: '浙江省',
    publishDate: '2026-06-04',
    deadline: '2026-06-18',
    budget: '¥480,000',
    productName: '超纯乙腈 (MS Grade), 分析纯正己烷',
    casNo: '75-05-8, 110-54-3',
    specification: '质谱级/色谱纯 4L * 4瓶/箱',
    contactName: '章建国',
    contactPhone: '0571-87998122',
    tenderUrl: 'https://zjzfcg.czt.zj.gov.cn/item/10921029',
    matchScore: 88,
    difficulty: '易',
    winProbability: 85,
    requiredDocs: [
      '企业资质及信用报告',
      '危化品安全标准化证书',
      'MSDS安全中文说明书',
      '原厂授权代理书/自主品牌说明'
    ],
    recommendedAction: '我司是质谱级乙腈的自主品牌工厂，价格相比进口牌子有30%优势，技术指标测试一致。可以直接以我司自主品牌直投，极易中标！',
    status: '待跟进',
    createdAt: '2026-06-04 11:22:00'
  },
  {
    id: 'T-003',
    title: '上海市食品药品检验研究院超高效液相色谱试剂和试剂盒补充采购项目',
    buyerName: '上海市食品药品检验研究院',
    region: '上海市',
    publishDate: '2026-06-07',
    deadline: '2026-06-30',
    budget: '¥1,200,000',
    productName: '高效液相试剂、超纯溶剂、标准对照品',
    casNo: '103-90-2, 75-05-8',
    specification: '医药级、光谱级、对照品',
    contactName: '徐老师',
    contactPhone: '021-38839000',
    tenderUrl: 'http://www.shzfcg.gov.cn/project/99210',
    matchScore: 72,
    difficulty: '难',
    winProbability: 45,
    requiredDocs: [
      '危险化学品经营许可证',
      '标准对照品专利所有权授权或一级报关证明',
      '通过欧加GLP体系认证',
      '本地化仓储危化库配送及1小时紧急响应承诺'
    ],
    recommendedAction: '由于本次采购涉及部分稀有标准对照品（非我司主打化学品），且要求上海本地一小时冷链配送，投标难度较高。建议尝试与上海本地龙头实验室商贸公司合作供货。',
    status: '待跟进',
    createdAt: '2026-06-07 16:30:00'
  }
];

export const INITIAL_RESEARCHES: CustomerResearch[] = [
  {
    id: 'R-001',
    companyName: 'Apex BioLab Supplies India',
    country: 'India',
    website: 'www.apexbio.in',
    businessScope: '实验室常规试剂、化学原料药分销、高端色谱试剂盒代理进口。',
    registrationStatus: '注册存续 (Active) | 注册号 IN-2015-882190. 注册资本 5000 万卢比。',
    tradeRecords: '通过印度海关进出口记录显示，该司每月均稳定从中国（上海、青岛口岸）整柜进口乙腈、丙酮等通用桶装试剂。过去12个月累计进口额 320 万美元，主力供应商为国内两家中型化工厂。',
    negativeNews: '暂无重大安全事故、污染停产整顿及商业欺诈司法记录。其在孟买因一笔本地税法延期缴纳受过小额行政罚款，已按期付清，无实质信用损害。',
    sanctionRisk: '低风险',
    websiteTrustScore: 92,
    emailTrustScore: 89,
    purchasePotentialScore: 86,
    creditRiskLevel: '低',
    paymentSuggestion: '支持前两单 TT 50% 预付款 + 50% 发货前结清，第三单起可转为 100% 即期海运信用证 (L/C at Sight)，利于大单开发。',
    recommendedProducts: [
      '色谱级乙腈 (Acetonitrile HPLC Grade)',
      '分析纯丙酮 (Acetone AR)',
      '高纯色谱甲醇 (Methanol HPLC)'
    ],
    summary: 'Apex 是印度孟买及浦那地区实力雄厚的中型本土经销商，拥有成熟的本地高校和药企零售分销链，回款和交易记录活跃。此客户有高价值采购潜力，建议作为A类客户重点开发。',
    createdAt: '2026-06-03 14:30:00'
  },
  {
    id: 'R-002',
    companyName: 'Bayer Diagnostic Sourcing GmbH',
    country: 'Germany',
    website: 'www.bayer.com/en/diagnostics',
    businessScope: '跨国医药诊断集团旗下采购事业部，主要负责核心诊断试剂、医用高纯对照基础原材料采购。',
    registrationStatus: '注册存续 (Active) | 注册于德国勒沃库森地方法院，商业信用评级 AAA（德国信用局超凡记录）。',
    tradeRecords: '具备极为庞大的海关往来。对对乙酰氨基酚等原料药年进口量超 400 吨，全球供应链覆盖中国、印度、西班牙。对我方高质谱级别产品有长期适配和试样诉求。',
    negativeNews: '无。符合欧盟 REACH 与 GDPR 极严合规审查。',
    sanctionRisk: '低风险',
    websiteTrustScore: 99,
    emailTrustScore: 98,
    purchasePotentialScore: 95,
    creditRiskLevel: '低',
    paymentSuggestion: '由于其采购地位极强，常规开立 30-60 天企业信用证(OA), 坏账概率接近 0。需核细价格并申请出口信用保险 (信保)。',
    recommendedProducts: [
      '对乙酰氨基酚 (Paracetamol USP/EP)',
      '无水级乙醇 (Absolute Ethanol Reagent)',
      '高纯生化反应缓冲试剂'
    ],
    summary: '德国拜耳旗下全资采购网，极其重质量合规、证书（REACH, CEP, FDA GMP）。一旦通过其长达 6-12 个月的供应商体系认证，将获得极为稳定的千万级年销量。',
    createdAt: '2026-06-01 11:00:00'
  }
];

export const INITIAL_OUTREACH: OutreachMessage[] = [
  {
    id: 'O-001',
    leadId: 'L-002',
    companyName: 'Apex BioLab Supplies India',
    contactName: 'Rajesh Kumar',
    channel: 'email',
    subject: 'HPLC Grade Acetonitrile Sourcing (CAS 75-05-8) - Supplier Sourcing India',
    message: `Dear Mr. Rajesh Kumar,

I noticed your posting on the chemical procurement forum Sourcing Reagents regarding your requirement for HPLC Grade Acetonitrile (CAS 75-05-8) and analytical grade chemicals.

As a leading Chinese manufacturer certified with ISO 9001 and strictly compliant with HPLC & ultra-pure standards, we are pleased to introduce our flagship high-purity Acetonitrile:
- Purity: ≥ 99.98%
- Water Content: ≤ 0.005%
- UV Transmittance: > 98% at 200nm, > 99% at 210nm-250nm
- Packaging: 4L HPLC brown bottles, or customized drums.

We currently export regular 20ft containers of solvent solutions to Mumbai and Chennai ports monthly. We have a robust distribution framework in South Asia and can offer competitive pricing alongside matching HPLC chromatogram proofs for batch audits.

Would it be possible to arrange a brief 5-minute call or share your strict quality limits so we can prepare a formal CFR Mumbai quote alongside free 1L testing samples for your laboratory?

Best regards,

[Your Name]
Senior Sourcing Specialist
[Your Company Name]`,
    followUpMessage: `Subject: Re: HPLC Grade Acetonitrile Sourcing - CAS 75-05-8 - Rajesh / Apex BioLab

Dear Rajesh,

I hope you are having a productive week.

I'm following up on our previous inquiry regarding HPLC Grade Acetonitrile supply. We understand Apex BioLab distributes to key pharmaceutical institutes in Pune and Mumbai, where batch-to-batch solvent reliability is crucial.

Our factory has recently upgraded its purification line, bringing ultraviolet residue to less than 1ppm. I have attached our latest May 2026 batch COA for your review.

Please let me know if you would like me to ship a 500ml trial sample directly to your lab. No shipping charges required.

Best regards,

[Your Name]`,
    tone: 'professional',
    createdAt: '2026-06-03 15:10:00'
  }
];
