/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, Tender, CustomerResearch, OutreachMessage, LeadPipeline } from './types';

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
    urgencyLevel: '中',
    recommendedAction: '展前主动预约面谈，并提供完整的 GMP、CEP 资质包及 1kg 的样品检测报告 (COA)',
    status: '待联系',
    createdAt: '2026-06-01 10:24:00',
    intelligenceTags: ['急需色谱级对乙酰氨基酚', '重金属残留超标痛点', '配额资质不全痛点']
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
    urgencyLevel: '高',
    recommendedAction: '立即加 LinkedIn 好友并发送 WhatsApp 短消息首轮报价，附带 HPLC 分析谱图',
    status: '已发送开发信',
    createdAt: '2026-06-03 14:15:22',
    intelligenceTags: ['急缺色谱级乙腈', '重金属残留超标痛点', '危化品资质合规', '寻找首期4000箱年度现货']
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
    intentDescription: 'CPHI 展位意向登记。寻找用于生物大分子实验室 analysis的超纯乙腈与甲醇。月度采购量 200 瓶（4L），常态化现货采购。',
    intentScore: 78,
    leadScore: 74,
    leadGrade: 'B',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '先进行完整外贸背调，确认其在美国本地的分销网络；然后寄送 4L/箱 小批测试装',
    status: '待联系',
    createdAt: '2026-06-04 09:12:00',
    intelligenceTags: ['期待高纯乙腈样品测试', '包装密封防护要求极高', '常态现货对齐']
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
    urgencyLevel: '高',
    recommendedAction: '核算危化品海运海事运费与出口资质（该司有一定清关滞期风险，需 TT 预付）',
    status: '已回复',
    createdAt: '2026-06-05 16:45:00',
    intelligenceTags: ['DMF大货需求急切', '二甲基甲酰胺配额受限', '海关高危滞期排查']
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
    urgencyLevel: '低',
    recommendedAction: '评估巴西海关高额进口反倾销风险与付款信用度，推荐只采用 100% 信用证 (L/C)',
    status: '已转询盘',
    createdAt: '2026-06-06 11:30:10'
  },
  {
    id: 'L-006',
    source: '文献专利',
    companyName: 'Vance Biopharma Lab, University of Cambridge',
    country: 'United Kingdom',
    region: 'Europe',
    customerType: '高校/科研所',
    contactName: 'Prof. Dr. Alistair Vance',
    contactTitle: 'Principal Investigator',
    email: 'alistair.vance@cam.ac.uk',
    phone: '+44 1223 337733',
    linkedin: 'linkedin.com/in/alistair-vance',
    website: 'www.cambridge-biopharma.org.uk',
    productKeywords: 'Anhydrous Zinc Triflates',
    casNo: '54010-75-2',
    intentDescription: '研发文献发表：在 Methods 中发表关于无水三氟甲磺酸锌催化的新型合成路线，急寻纯度大于 99.5% 的吨级国内大货供应商，要求能提供极低的水分控制与独立色谱质谱检测谱图文件。',
    intentScore: 89,
    leadScore: 85,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '直接发送高纯无水级试样报告至其通讯邮箱，提供水分低于50ppm的工艺保证。',
    status: '待联系',
    createdAt: '2026-06-09 08:30:00',
    channelContext: {
      casVolume: '1.2 Tons/year',
      authorEmail: 'alistair.vance@cam.ac.uk',
      isUrgent: false
    }
  },
  {
    id: 'L-007',
    source: '医药注册',
    companyName: 'Aurobindo Sourcing Corp',
    country: 'India',
    region: 'South Asia',
    customerType: '终端工厂',
    contactName: 'Anil Pradhan',
    contactTitle: 'Global API DMF Integrity Specialist',
    email: 'a.pradhan@aurobindo-pharma.in',
    phone: '+91 40 6672 5000',
    linkedin: 'linkedin.com/in/anil-pradhan-aurobindo',
    website: 'www.aurobindo.com',
    productKeywords: 'Sacubitril Valsartan Sodium, 沙库巴曲缬沙坦钠',
    casNo: '936623-90-4',
    intentDescription: '印度制药巨头。针对美国 FDA 以及中国 FDA 申报新增注册来源，急需稳定的沙库巴曲缬沙坦钠中间体提供商，要求符合完整的 GMP 标准。',
    intentScore: 94,
    leadScore: 92,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '指派印度大客户经理上门拜访，发送我国已批准的 DMF A 状态登记包副件。',
    status: '待联系',
    createdAt: '2026-06-09 11:20:00',
    channelContext: {
      casVolume: '50 Tons/Year',
      isUrgent: false
    }
  },
  {
    id: 'L-008',
    source: '海关提单',
    companyName: 'Techem Industrial Solutions LLC',
    country: 'United States',
    region: 'North America',
    customerType: '终端工厂',
    contactName: 'John Doe',
    contactTitle: 'VP Sourcing',
    email: 'jdoe@techem-solutions.com',
    phone: '+1 212-345-6789',
    linkedin: 'linkedin.com/in/jdoe-techem',
    website: 'www.techem-solutions.com',
    productKeywords: 'Citric Acid Anhydrous, 无水柠檬酸',
    casNo: '77-92-9',
    intentDescription: '海关提单提货监测：历史原供应商为「巴斯夫化工法国分厂」，月进口额约 12 万美元。采购量大，账期一般。',
    intentScore: 75,
    leadScore: 80,
    leadGrade: 'B',
    riskLevel: '中',
    urgencyLevel: '中',
    recommendedAction: '以巴斯夫直接竞争性报价（含特种包装）进行切入。',
    status: '待联系',
    createdAt: '2026-06-08 14:00:00',
    channelContext: {
      casVolume: '200 Tons/Month',
      customsIncumbent: 'BASF France Factory',
      isUrgent: false
    }
  },
  {
    id: 'L-009',
    source: '垂直B2B',
    companyName: 'E-Chemical Trade Ltd',
    country: 'Japan',
    region: 'East Asia',
    customerType: '分销商',
    contactName: 'Keisuke Tanaka',
    contactTitle: 'General Sourcing Manager',
    email: 'tanaka@e-chemtrade.co.jp',
    phone: '+81 3-5555-0143',
    linkedin: 'linkedin.com/in/keisuke-tanaka',
    website: 'www.e-chemtrade.co.jp',
    productKeywords: 'Dimethyl Sulfoxide, DMSO 99.9%',
    casNo: '67-68-5',
    intentDescription: '在 ICIS 垂直分销交易平台留言：询盘符合医药级日本药典的 99.9% 纯度 DMSO，每次采购两个整柜（约 32 吨），对气味限制有极其严苛的要求。',
    intentScore: 88,
    leadScore: 86,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '提供高级无臭级医药规格说明书，支持寄送 200kg 铁桶样品作首次试料。',
    status: '待联系',
    createdAt: '2026-06-08 16:30:00',
    channelContext: {
      casVolume: '150 Tons/Year',
      isUrgent: true
    }
  },
  {
    id: 'L-010',
    source: '海外社媒',
    companyName: 'Loba Chemie Specialty Import',
    country: 'India',
    region: 'South Asia',
    customerType: '分销商',
    contactName: 'Ravi Patel',
    contactTitle: 'Director Sourcing',
    email: 'rpatal@lobachemie.co.id',
    phone: '+91 22 5555-0101',
    linkedin: 'linkedin.com/in/ravi-patel-loba',
    website: 'www.lobachemie.co.id',
    productKeywords: 'Tetrahydrofuran HPLC Grade, THF',
    casNo: '109-99-9',
    intentDescription: '在 LinkedIn Specialty Sourcing 联盟发布紧急求购：Need ultra-dry Tetrahydrofuran 99.99% for peptide synthesis. In stock preferred. Need 4 drums within 1 week.',
    intentScore: 92,
    leadScore: 90,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '直接通过 WhatsApp 确认该批特急需求。该司有多年进口实绩，资信良好。',
    status: '待联系',
    createdAt: '2026-06-07 10:15:00',
    channelContext: {
      casVolume: '4 Drums (Urgent)',
      isUrgent: true
    }
  },
  {
    id: 'L-011',
    source: '环评公示',
    companyName: '山东聚源华医药科技有限公司',
    country: 'China',
    region: '中国大陆',
    customerType: '终端工厂',
    contactName: '张向阳',
    contactTitle: '新建项目工程部处长',
    email: 'zhangxy@juyuanhuapharma.com',
    phone: '139-5310-9876',
    linkedin: '',
    website: 'www.juyuanhuapharma.com',
    productKeywords: '邻氯苯甲腈, 醋酸甲酯, 2,4-二氯苯酮',
    casNo: '88-24-4',
    intentDescription: '扩建项目环评公示提取。新建年产 150 吨高纯原料药项目，年最大消耗邻氯苯甲腈 85.0 吨，醋酸甲酯 120.0 吨，2,4-二氯苯酮 45.0 吨。车间配方中含有此类主材。',
    intentScore: 95,
    leadScore: 93,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '联系项目负责人提供原药厂级折扣，对邻氯苯甲腈进行年包投标洽谈。',
    status: '待联系',
    createdAt: '2026-06-07 15:15:00',
    channelContext: {
      casVolume: '120 Tons/year',
      eiaSpecs: '150吨原料药改扩建车间',
      isUrgent: false
    }
  },
  {
    id: 'L-012',
    source: 'CDE登记',
    companyName: '江苏瑞泰制药有限公司',
    country: 'China',
    region: '中国大陆',
    customerType: '终端工厂',
    contactName: '李工',
    contactTitle: '采购总监兼生产品控',
    email: 'purchasing@ruitaipharma.cn',
    phone: '0512-51234567',
    linkedin: '',
    website: 'www.ruitaipharma.cn',
    productKeywords: '沙库巴曲缬沙坦钠',
    casNo: '936623-90-4',
    intentDescription: 'CDE最新化学药品审评状态变更。沙库巴曲缬沙坦钠原料药登记状态变更为「A」(已批准)，即将进入高饱和商业化制剂投产，需大宗长约配套中间体采购。',
    intentScore: 96,
    leadScore: 94,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '速调样测试，该司为行业头部上市药企，商业化放量需求极其稳定。',
    status: '待联系',
    createdAt: '2026-06-06 09:20:00',
    channelContext: {
      casVolume: '85 Tons/year',
      isUrgent: false
    }
  },
  {
    id: 'L-013',
    source: '公共招投标',
    companyName: '广东省南方医科大学附属第一医院',
    country: 'China',
    region: '中国大陆',
    customerType: '高校/科研所',
    contactName: '刘主任',
    contactTitle: '医学部实验室采购组组长',
    email: 'liuj@smufh.com',
    phone: '020-62781234',
    linkedin: '',
    website: 'www.smufh.com',
    productKeywords: '色谱乙腈, 色谱甲醇',
    casNo: '75-05-8',
    intentDescription: '2026年度实验室高纯色谱试剂集中采购项目招标。预算高达 85 万人民币。包含色谱级乙腈、色谱级甲醇、分析纯丙酮，要求具备危化品经营许可证照以及前两年三甲业绩凭证。',
    intentScore: 91,
    leadScore: 89,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '组织投标筹备小组，核对危化品经营许可以及投标参数，于倒计时截止前递交完整标书。',
    status: '待联系',
    createdAt: '2026-06-05 15:45:00',
    channelContext: {
      casVolume: '4,000 cases/Year',
      tenderDeadline: '15天后截标',
      isUrgent: false
    }
  },
  {
    id: 'L-014',
    source: '本土B2B',
    companyName: '石家庄奥德精细化工有限公司',
    country: 'China',
    region: '中国大陆',
    customerType: '终端工厂',
    contactName: '侯建国',
    contactTitle: '供应链经理',
    email: 'houjianguo@sjzaodechem.com',
    phone: '0311-87654321',
    linkedin: '',
    website: 'www.sjzaodechem.com',
    productKeywords: '无水氯化锌',
    casNo: '7646-85-7',
    intentDescription: '诚化网/盖德化工留言：月购 15 吨无水氯化锌 (CAS 7646-85-7)，要求极低重金属含量，可开增值税专用发票，常年合作。',
    intentScore: 80,
    leadScore: 78,
    leadGrade: 'B',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '提供符合电子级标准的高纯无水级氯化锌规格书，并寄送 2kg 小样进行上机前试配。',
    status: '待联系',
    createdAt: '2026-06-04 11:10:00',
    channelContext: {
      casVolume: '180 Tons/year',
      isUrgent: false
    }
  },
  {
    id: 'L-015',
    source: '社群求购',
    companyName: '昆山申达贸易行',
    country: 'China',
    region: '中国大陆',
    customerType: '其他',
    contactName: '华东化工代理-张',
    contactTitle: '资深大宗采购',
    email: 'zhang.dazong@sdtrade.com',
    phone: '186-1212-3434',
    linkedin: '',
    website: '',
    productKeywords: '苯甲醇, Benzyl Alcohol 医药级',
    casNo: '100-51-6',
    intentDescription: '微信拼单群紧急呼叫：紧急求购符合 CP USP 标准的医药级苯甲醇 3 吨。要求在三天内送达昆山库，必须附带最新 COA 和实物高清照。试产急需，溢价接单。',
    intentScore: 98,
    leadScore: 95,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '直接与其语音电话联系，调用无锡保锡仓现货储备做一单特急配送。',
    status: '待联系',
    createdAt: '2026-06-03 10:15:00',
    channelContext: {
      casVolume: '3 Tons (特急)',
      isUrgent: true
    }
  },
  {
    id: 'L-016',
    source: '文献专利',
    companyName: 'Oka National Chemical Lab, Tokyo University',
    country: 'Japan',
    region: 'East Asia',
    customerType: '高校/科研所',
    contactName: 'Prof. Dr. Takashi Oka',
    contactTitle: 'Head Professor',
    email: 't.oka@tokyo-u.ac.jp',
    phone: '+81 3-5841-6000',
    linkedin: '',
    website: 'www.tokyo-u.ac.jp',
    productKeywords: 'Pyridine-2,6-dicarboxylic acid',
    casNo: '499-83-2',
    intentDescription: '在最新研究文献中有机半导体薄膜合成路线提及：急需寻找 99.8% 高气相沉积级吡啶-2,6-二羧酸，首期试剂级需求 500g 零单，后续中试预计 50kg。',
    intentScore: 84,
    leadScore: 82,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '发英文科研资助开发信，提供纯度高于 99.8% 的高纯分析测试色谱数据谱图。',
    status: '待联系',
    createdAt: '2026-06-09 17:35:00',
    channelContext: {
      casVolume: '500g (研发试剂级)',
      authorEmail: 't.oka@tokyo-u.ac.jp',
      isUrgent: false
    }
  },
  {
    id: 'L-017',
    source: '医药注册',
    companyName: 'Cipla Pharmaceuticals Ltd',
    country: 'India',
    region: 'South Asia',
    customerType: '终端工厂',
    contactName: 'Dr. Vikram Shah',
    contactTitle: 'Senior API Sourcing Director',
    email: 'vikram.shah@cipla.com',
    phone: '+91 22 2439 2000',
    linkedin: 'linkedin.com/in/vikram-shah-cipla',
    website: 'www.cipla.com',
    productKeywords: 'Atorvastatin Calcium, 阿托伐他汀钙',
    casNo: '134523-03-8',
    intentDescription: 'CDE/FDA 新型仿制药申报联动。Cipla 印度孟买工厂提交新增原料药主文件。需要稳定的阿托伐他汀钙核心高纯中间体，需要具备 COS/DMF A 级归档支持。',
    intentScore: 92,
    leadScore: 90,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '与该司印度分包商及总部的注册事务总监联系，寄送符合 EudraGDPR/COA 数据的高纯中试前样 5kg。',
    status: '待联系',
    createdAt: '2026-06-09 13:40:00',
    channelContext: {
      casVolume: '15 Tons/Year',
      isUrgent: false
    }
  },
  {
    id: 'L-018',
    source: '海关提单',
    companyName: 'Sino-US Chemical Trading LLC',
    country: 'United States',
    region: 'North America',
    customerType: '分销商',
    contactName: 'Robert Vance',
    contactTitle: 'Import Operations Officer',
    email: 'rvance@sinous-chem.com',
    phone: '+1 (415) 888-2931',
    linkedin: 'linkedin.com/in/rvance-sinous',
    website: 'www.sinous-chem.com',
    productKeywords: 'Tetrahydrofuran, 四氢呋喃',
    casNo: '109-99-9',
    intentDescription: '海关清关追踪数据：近期该司连续 4 个月由 LG Chem 釜山港进口四氢呋喃。近期由于韩国工厂停工检修，其正在寻觅中国高纯储罐现货供应商以弥补供应链缺口。',
    intentScore: 87,
    leadScore: 84,
    leadGrade: 'A',
    riskLevel: '中',
    urgencyLevel: '高',
    recommendedAction: '以保税区现货即期价格切入，承诺能在一周内出货到休斯顿港并完成报关。',
    status: '待联系',
    createdAt: '2026-06-08 09:20:00',
    channelContext: {
      casVolume: '180 Tons/Month',
      customsIncumbent: 'LG Chem Korea',
      isUrgent: true
    }
  },
  {
    id: 'L-019',
    source: '垂直B2B',
    companyName: 'Aventis Bio-Solutions Inc',
    country: 'Germany',
    region: 'Europe',
    customerType: '终端工厂',
    contactName: 'Hans Schmidt',
    contactTitle: 'Senior Chemical Sourcing Lead',
    email: 'h.schmidt@aventis-biosolutions.de',
    phone: '+49 89 2345 6789',
    linkedin: 'linkedin.com/in/hans-schmidt-aventis',
    website: 'www.aventis-biosolutions.de',
    productKeywords: 'Dimethylformamide, DMF 99.8%',
    casNo: '68-12-2',
    intentDescription: '在 ChemNet 垂直交易区紧急求购：需每月供应 60 吨高纯无游离胺 Dimethylformamide（DMF），限制含碳和水杂质极低，需附带全套 REACh 欧盟注册文件。',
    intentScore: 89,
    leadScore: 86,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '提供工厂的最新 REACh 注册编号资料，并附带色谱谱图，安排中欧班列铁路箱运送到汉堡。',
    status: '待联系',
    createdAt: '2026-06-08 11:30:00',
    channelContext: {
      casVolume: '60 Tons/Quarter',
      isUrgent: false
    }
  },
  {
    id: 'L-020',
    source: '海外社媒',
    companyName: 'Chemagility Sourcing Network',
    country: 'United Kingdom',
    region: 'Europe',
    customerType: '分销商',
    contactName: 'Alistair Miller',
    contactTitle: 'Specialty Sourcing Facilitator',
    email: 'amiller@chemagility-sourcing.co.uk',
    phone: '+44 20 7946 0192',
    linkedin: 'linkedin.com/in/alistair-miller-chemagility',
    website: 'www.chemagility.co.uk',
    productKeywords: 'Aniline, 苯胺',
    casNo: '62-53-3',
    intentDescription: '在 X 平台（Twitter）化工原料交易联盟发帖：Urgent chemical inquiry: Need aniline (CAS 62-53-3) high grade, 80 drums. In stock required, shipping immediately to Antwerp. Please PM me.',
    intentScore: 94,
    leadScore: 90,
    leadGrade: 'A',
    riskLevel: '中',
    urgencyLevel: '高',
    recommendedAction: '直接由外贸专员通过 WhatsApp 和 X 平台私聊锁定，沟通空运或快线船期报价。',
    status: '待联系',
    createdAt: '2026-06-07 16:50:00',
    channelContext: {
      casVolume: '80 Drums (Urgent)',
      isUrgent: true
    }
  },
  {
    id: 'L-021',
    source: '环评公示',
    companyName: '河北新隆泰制药有限公司',
    country: 'China',
    region: '中国大陆',
    customerType: '终端工厂',
    contactName: '梁主管',
    contactTitle: '扩建项目基建负责人',
    email: 'liangzg@xinlongtaipharma.com',
    phone: '135-2234-5678',
    linkedin: '',
    website: 'www.xinlongtaipharma.com',
    productKeywords: '2-甲基咪唑, 咪唑',
    casNo: '693-98-1',
    intentDescription: '河北石家庄重点工业改扩建环评公示：规划新建年产 300 吨头孢类核心医药侧链车间。由于配方工艺改进，满产年最大需要消耗「2-甲基咪唑」达 280.0 吨，原辅料库有扩容规划。',
    intentScore: 93,
    leadScore: 91,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '在项目开始采购招标前期，公关基建与设备组梁主管，提供我们厂大货全套工艺指标。',
    status: '待联系',
    createdAt: '2026-06-07 14:10:00',
    channelContext: {
      casVolume: '280 Tons/year',
      eiaSpecs: '年产300吨头孢类侧链扩产项目',
      isUrgent: false
    }
  },
  {
    id: 'L-022',
    source: 'CDE登记',
    companyName: '浙江华海药业股份有限公司',
    country: 'China',
    region: '中国大陆',
    customerType: '终端工厂',
    contactName: '王经理',
    contactTitle: '原料药采购部副部长',
    email: 'wang_pur@huahaipharm.com',
    phone: '0576-85991111',
    linkedin: '',
    website: 'www.huahaipharm.com',
    productKeywords: '沙库巴曲, 缬沙坦',
    casNo: '149709-62-6',
    intentDescription: '国家药监局 CDE 更新登记，沙库巴曲原料药新增规格获批。华海大规模增产沙库巴曲缬沙坦钠片（制剂），关联其对高纯沙库巴曲核心中间体（CAS 149709-62-6）的吨级配套。',
    intentScore: 97,
    leadScore: 95,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '指派台州大客户专班上门拜访，提供百公斤级大样支持，洽谈年度保供长期框架。',
    status: '待联系',
    createdAt: '2026-06-06 14:40:00',
    channelContext: {
      casVolume: '35 Tons/year',
      isUrgent: false
    }
  },
  {
    id: 'L-023',
    source: '公共招投标',
    companyName: '上海交通大学转化医学国家重大科技基础设施',
    country: 'China',
    region: '中国大陆',
    customerType: '高校/科研所',
    contactName: '张老师',
    contactTitle: '实验医学装备科采购组长',
    email: 'zhang_physics@sjtu.edu.cn',
    phone: '021-34206060',
    linkedin: '',
    website: 'www.sjtu.edu.cn',
    productKeywords: '色谱乙腈/色谱甲醇/分析纯正己烷',
    casNo: '75-05-8',
    intentDescription: '关于多功能质谱液相色谱平台年套高纯检测试剂盒及超纯溶剂公开招标采购。采购预算为 ¥650,000 元，要求满足 99.99% 的纯度指标，需具备完善的售后与危化品运输配送资质。',
    intentScore: 90,
    leadScore: 88,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '迅速对接华东试剂经销商，配合编制精细化投标说明书与纯度溯源说明。',
    status: '待联系',
    createdAt: '2026-06-05 13:12:00',
    channelContext: {
      casVolume: '3,000 cases/Year',
      tenderDeadline: '8天后截标',
      isUrgent: false
    }
  },
  {
    id: 'L-024',
    source: '本土B2B',
    companyName: '河南中原大昌化学试剂厂',
    country: 'China',
    region: '中国大陆',
    customerType: '终端工厂',
    contactName: '贺大昌',
    contactTitle: '老总兼采购总管',
    email: 'he_dachang@zydcchem.com',
    phone: '0371-67895432',
    linkedin: '',
    website: 'www.zydcchem.com',
    productKeywords: '无水碳酸钠, 纯碱',
    casNo: '497-19-8',
    intentDescription: '在化工行业盖德网/诚化网发布长协招标询价：常年稳定寻月度 35 吨高纯无水碳酸钠（纯度要求 ≥99.5%，含盐和重金属需极痕量级），常年包销。',
    intentScore: 82,
    leadScore: 80,
    leadGrade: 'B',
    riskLevel: '低',
    urgencyLevel: '中',
    recommendedAction: '提供大吨位优惠物流价与食品/分析级合格证，邀请贺总来厂里检查生产流水线。',
    status: '待联系',
    createdAt: '2026-06-04 15:30:00',
    channelContext: {
      casVolume: '420 Tons/year',
      isUrgent: false
    }
  },
  {
    id: 'L-025',
    source: '社群求购',
    companyName: '广州申宏精细化工有限公司',
    country: 'China',
    region: '中国大陆',
    customerType: '其他',
    contactName: '华南化工大盘商-李',
    contactTitle: '微信化工群主兼撮合总监',
    email: 'li_sourcing@shenhongtrade.com',
    phone: '133-9090-8888',
    linkedin: '',
    website: '',
    productKeywords: '乙二醇单丁醚, 防白水',
    casNo: '111-76-2',
    intentDescription: '大湾区供应链拼箱微信群急呼：紧急求购高纯防白水（乙二醇单丁醚） 5 吨。由于广州黄埔口岸货期延迟，现货严重告急。需在 48 小时以内送到江门厂区。承诺现款交易，绝不拖账，速报现货价。',
    intentScore: 99,
    leadScore: 94,
    leadGrade: 'A',
    riskLevel: '低',
    urgencyLevel: '高',
    recommendedAction: '直接去电话建联，从佛山货栈或东莞配给中心调派特急危险品槽车连夜直送。',
    status: '待联系',
    createdAt: '2026-06-03 14:50:00',
    channelContext: {
      casVolume: '5 Tons (特急)',
      isUrgent: true
    }
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
      { name: '企业营业执照与三证合一代码', type: 'critical' },
      { name: '危险化学品经营许可证 (含乙腈/甲醇品类)', type: 'critical' },
      { name: '色谱级产品原厂理化分析报告 (COA) / 纯度≥99.9% 证明', type: 'critical' },
      { name: '近三年三家以上三甲医院同类色谱溶剂供货业绩合同', type: 'bonus' },
      { name: '危险化学品安全标准化二级及以上证书', type: 'bonus' }
    ],
    recommendedAction: '产品规格、纯度参数100%匹配我司产品线。主要关注南方医科大学的业绩门槛，可考虑通过有合作背景的高校贸易代理商进行联合投标，预计中标率高。',
    status: '待跟进',
    createdAt: '2026-06-01 15:00:00',
    timeline: {
      publishDate: '2026-06-01',
      buyBookDeadline: '2026-06-12',
      submitDeadline: '2026-06-25',
      openBidTime: '2026-06-25'
    },
    incumbentSupplier: '常州国药精细化学试剂厂 (国药试剂)',
    historicalPrice: '¥892,000 / 年',
    channel: '中国政府采购网',
    qualifications: [
      { type: 'red', text: '必须具备危险化学品经营许可证，经营范围对应 CAS: 75-05-8 品目' },
      { type: 'red', text: '投标商注册资本需不低于500万人民币' },
      { type: 'green', text: '提供质谱/色谱级自主纯度检验报告（COA谱图高于99.9%）' },
      { type: 'green', text: '提供原药厂级代理授权书或大货直发质保函' }
    ],
    estimatedBottomPrice: '¥812,000'
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
      { name: '企业资质存续证明及第三方信用报告', type: 'critical' },
      { name: '危险化学品安全生产/经营许可标准化证书', type: 'critical' },
      { name: '中国危化分类规范 MSDS 安全中文说明书 (含一书一签)', type: 'critical' },
      { name: '质谱极自主品牌声明与色谱谱图重合度测试文件', type: 'bonus' },
      { name: '自主品牌厂家符合欧盟 REACH 高级标准审查声明', type: 'bonus' }
    ],
    recommendedAction: '我司是质谱级乙腈的自主品牌工厂，价格相比进口牌子有30%优势，技术指标测试一致。可以直接以我司自主品牌直投，极易中标！',
    status: '待跟进',
    createdAt: '2026-06-04 11:22:00',
    timeline: {
      publishDate: '2026-06-03',
      buyBookDeadline: '2026-06-10',
      submitDeadline: '2026-06-18',
      openBidTime: '2026-06-19'
    },
    incumbentSupplier: '上海谱丰纯化色谱技术有限公司 (泰坦科技)',
    historicalPrice: '¥512,000 / 年',
    channel: '各省公共资源平台',
    qualifications: [
      { type: 'red', text: '具有有效的危化品应急仓储备案（或本地危化专用运输车组）' },
      { type: 'red', text: '提供原药自主出厂检验合格MSDS（含中英文一书一签版）' },
      { type: 'green', text: '拥有 ISO14001 环境及绿色工业低碳评价证书' }
    ],
    estimatedBottomPrice: '¥435,000'
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
    specification: '医药级、光谱级、对照品及试剂盒',
    contactName: '徐老师',
    contactPhone: '021-38839000',
    tenderUrl: 'http://www.shzfcg.gov.cn/project/99210',
    matchScore: 72,
    difficulty: '难',
    winProbability: 45,
    requiredDocs: [
      { name: '高危化学品（易制毒、易制爆）经营及准寄许可证', type: 'critical' },
      { name: '标准对照品专利所有权授权或进口一级报关完税证明', type: 'critical' },
      { name: '通过欧盟药典 CEP / GLP 二方或三方体系质量认证', type: 'critical' },
      { name: '上海本地备品库仓储及1小时内全时紧急响应承诺书', type: 'bonus' },
      { name: '同行业知名检测院级（省级以上）供货实绩合同样本', type: 'bonus' }
    ],
    recommendedAction: '由于本次采购涉及部分稀有标准对照品（非我司主打化学品），且要求上海本地一小时冷链配送，投标难度较高。建议尝试与上海本地龙头实验室商贸公司合作供货。',
    status: '待跟进',
    createdAt: '2026-06-07 16:30:00',
    timeline: {
      publishDate: '2026-06-07',
      buyBookDeadline: '2026-06-20',
      submitDeadline: '2026-06-30',
      openBidTime: '2026-07-01'
    },
    incumbentSupplier: '德国默克 (Merck KGaA 代理商/泰坦科技)',
    historicalPrice: '¥1,180,005 / 年',
    channel: '中国政府采购网',
    qualifications: [
      { type: 'red', text: '非本地供应商必须签订符合上海辖区食品药品监督条例的1小时极速备极应收承诺' },
      { type: 'red', text: '必须提供对应高危试剂（易制毒、易制爆）的合法公安备案凭证' },
      { type: 'green', text: '拥有通过欧盟药典（CEP/EDQM）标准体系认证或对照品原产链合法授权书' }
    ],
    estimatedBottomPrice: '¥1,090,000'
  },
  {
    id: 'T-004',
    title: '清华大学化学系高纯溶剂及分析试剂集采项目',
    buyerName: '清华大学化学系',
    region: '北京市',
    publishDate: '2026-06-08',
    deadline: '2026-06-24',
    budget: '¥350,000',
    productName: 'HPLC级乙腈/无水乙醇',
    casNo: '75-05-8, 64-17-5',
    specification: '高纯色谱级 ≥99.98% 4L/瓶',
    contactName: '梁老师',
    contactPhone: '010-62785566',
    tenderUrl: 'https://www.casmart.com.cn/清华采购标讯',
    matchScore: 94,
    difficulty: '中',
    winProbability: 80,
    requiredDocs: [
      { name: '喀斯玛商城或高校网在库合作协议书', type: 'critical' },
      { name: '危险化学品安全标准资质认证', type: 'critical' }
    ],
    recommendedAction: '喀斯玛作为高校大型集采的主流线上平台。我们已是喀斯玛商城白名单供应商。应标时直接引用我司大网现货链接，并附送色谱纯度谱图直接通过，中标概率大。',
    status: '待跟进',
    createdAt: '2026-06-08 10:00:00',
    timeline: {
      publishDate: '2026-06-08',
      buyBookDeadline: '2026-06-15',
      submitDeadline: '2026-06-24',
      openBidTime: '2026-06-24'
    },
    incumbentSupplier: '北京泰坦科技化学部',
    historicalPrice: '¥365,000 / 次',
    channel: '喀斯玛商城',
    qualifications: [
      { type: 'red', text: '投标主体需为喀斯玛商城（Casmart）平台在编签约商户' },
      { type: 'red', text: '能提供北京本地高校点对点化学毒害品合规冷链物流专线' },
      { type: 'green', text: '提供自研纯化原产地证明以及高校科研资助减免方案' }
    ],
    estimatedBottomPrice: '¥315,000'
  },
  {
    id: 'T-005',
    title: '中国科学院大连化学物理研究所高纯载气与色谱级乙腈长期供求竞标',
    buyerName: '中国科学院大连化学物理研究所',
    region: '辽宁省',
    publishDate: '2026-06-06',
    deadline: '2026-06-22',
    budget: '¥620,000',
    productName: '色谱级乙腈 (Purity ≥99.98%)',
    casNo: '75-05-8',
    specification: '色谱高纯液相专用溶剂 4L/瓶 磨口棕色瓶包装',
    contactName: '何组长',
    contactPhone: '0411-84379000',
    tenderUrl: 'https://www.casmart.com.cn/dicpTender',
    matchScore: 92,
    difficulty: '中',
    winProbability: 76,
    requiredDocs: [
      { name: '入驻中国科学院科研仪器设备采购网合格记录', type: 'critical' },
      { name: '色谱分析设备检测指标响应表', type: 'critical' }
    ],
    recommendedAction: '大连化物所对色谱噪声有严苛的学术级指标要求，原供货商因批次质量波动受到扣分处罚。我们的高纯自净设备提纯出的HPLC乙腈杂质比他们低，这是切入良机。',
    status: '待跟进',
    createdAt: '2026-06-06 14:10:00',
    timeline: {
      publishDate: '2026-06-06',
      buyBookDeadline: '2026-06-14',
      submitDeadline: '2026-06-22',
      openBidTime: '2026-06-22'
    },
    incumbentSupplier: '国药集团化学试剂北京分公司 (国药试剂)',
    historicalPrice: '¥648,000 / 包',
    channel: '喀斯玛商城',
    qualifications: [
      { type: 'red', text: '需满足纯度 ≥ 99.98% / 电导率 ≤ 0.05μS/cm 学术指标硬性底线' },
      { type: 'red', text: '具备化学危爆物前置行政许可安全档案备案证明' },
      { type: 'green', text: '具备曾为国家重点实验室长期保供的历史评价证明' }
    ],
    estimatedBottomPrice: '¥580,000'
  },
  {
    id: 'T-006',
    title: '中山大学生命科学学院细胞级培养基与高纯分析溶剂推荐比选',
    buyerName: '中山大学生命科学学院',
    region: '广东省',
    publishDate: '2026-06-09',
    deadline: '2026-06-29',
    budget: '¥220,000',
    productName: '分析纯正己烷/超纯甲醇',
    casNo: '110-54-3, 67-56-1',
    specification: '生物/分析纯高稳定瓶装试剂',
    contactName: '钟助理',
    contactPhone: '020-84112233',
    tenderUrl: 'https://dingxiangtong.com/zsu-tender-202606',
    matchScore: 82,
    difficulty: '易',
    winProbability: 82,
    requiredDocs: [
      { name: '供货周期不超过7个工作日承诺函', type: 'critical' },
      { name: '产品原装无毒性环保内塞检验材料', type: 'bonus' }
    ],
    recommendedAction: '丁香通网络专属高频快投项目。本省珠海或广州有备品库，可以提供特快上门配货，竞争激烈但由于我们拥有价格直营优势，把握很大。',
    status: '待跟进',
    createdAt: '2026-06-09 11:45:00',
    timeline: {
      publishDate: '2026-06-09',
      buyBookDeadline: '2026-06-18',
      submitDeadline: '2026-06-29',
      openBidTime: '2026-06-30'
    },
    incumbentSupplier: '广州生物之星商贸有限公司 (泰坦科技)',
    historicalPrice: '¥240,000 / 年',
    channel: '丁香通',
    qualifications: [
      { type: 'red', text: '出具符合中大理学实验室无有害辅质残留之环评白皮书' },
      { type: 'green', text: '提供极速物流服务响应周期低于48小时的特别条款书' }
    ],
    estimatedBottomPrice: '¥198,000'
  },
  {
    id: 'T-007',
    title: '药明康德2000L大货高纯色谱乙腈及色谱甲醇框架采购协议',
    buyerName: '无锡药明康德新药开发股份有限公司',
    region: '江苏省',
    publishDate: '2026-06-03',
    deadline: '2026-06-28',
    budget: '¥3,500,000',
    productName: '液相高纯色谱级乙腈 (HPLC Grade)',
    casNo: '75-05-8',
    specification: '桶装 200L / 高端 HPLC 纯度、极低残留控制标准',
    contactName: '严总',
    contactPhone: '0510-85881111',
    tenderUrl: 'internal-portal://wuxichem.co.inc/api-supply',
    matchScore: 97,
    difficulty: '中',
    winProbability: 83,
    requiredDocs: [
      { name: '药明康德或药企供应链一级入库优质认证', type: 'critical' },
      { name: '批次重现控制高于99.95%的质量保障协议 (QAA)', type: 'critical' },
      { name: '大型槽车或吨桶（IBC）危化配送资质资质', type: 'critical' }
    ],
    recommendedAction: '头部药研合同外包巨头（CRO）。长协用量巨大且有极严格的质量追溯（QAA）。由于我司纯提路线和杂质分析领先，可申请进行年度长期战略伙伴竞价。',
    status: '待跟进',
    createdAt: '2026-06-03 16:50:00',
    timeline: {
      publishDate: '2026-06-03',
      buyBookDeadline: '2026-06-15',
      submitDeadline: '2026-06-28',
      openBidTime: '2026-06-29'
    },
    incumbentSupplier: '霍尼韦尔 (Honeywell B&J 试剂中国代理)',
    historicalPrice: '¥3,850,000 / 全期',
    channel: '上市药企供应链',
    qualifications: [
      { type: 'red', text: '拥有成熟的吨级IBC槽罐车高安全重载驳卸配套特化准入证书' },
      { type: 'red', text: '必须签订全天候不间断品质合规保供连带赔偿协议书 (QAA合同)' },
      { type: 'green', text: '提供曾有百万吨级高纯连续提纯工艺流水线及原厂ISO9001认证书' }
    ],
    estimatedBottomPrice: '¥3,120,000'
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
    summary: 'Apex 是印度孟买及浦那地区实力雄厚的中型本土经销商，拥有成熟的本地高校 and 药企零售分销链，回款和交易记录活跃。此客户有高价值采购潜力，建议作为A类客户重点开发。',
    createdAt: '2026-06-03 14:30:00',
    
    // STEP 1, 2, 3 Expanded Intelligence
    ehsCompliance: {
      requiredCertificates: ['清关原产地证 (Form B)', 'IMDG 危化品安全说明书 (MSDS/SDS)', 'ISO9001 质量管理认证书'],
      sanctionNotes: '经 OFAC 数据库和欧盟企业合规审查：无已知化学制裁指标。其注册地及运营节点完全安全。',
      blacklistVerification: '联合黑名单系统自查：绿色通行。已拉取历史 1.0 版本的优惠券（version 1.0 coupons）及其相关商业往来系统记录交叉验证，不存在未清偿余额或恶性欺诈纠纷。',
      hasViolationRisk: false
    },
    supplyChain: {
      competitors: [
        { name: 'Sigma-Aldo India Sourcing', share: 45 },
        { name: 'Kolkata Petro-solvents Co.', share: 30 },
        { name: 'Local Lab-Chem Traders', share: 25 }
      ],
      nextSourcingWindow: '2026年Q3期初 (预计7月中旬左右，库存即将探底)',
      portAnalysis: '逆向提单跟踪发现：过去12个月中该司向 Sigma-Aldo 采购量明显呈下降趋势，主要由于对方杂质偏高。近期急需寻找高纯度替代。'
    },
    financeRating: {
      creditRatingScore: 88,
      sinosureLimitEstimated: '$150,000 USD (中信保定级：A级)',
      baseGmvLastYear: 400000,
      targetGmvThisYear: 800000,
      sourcingIndexDelta: 120000,
      gmvContribution: 0.30, // 30.0% = 120000 / (800000 - 400000) (绝对值增量计算)
      suggestedPaymentScheme: '动态财险方案：建议首笔试样款前 TT，首期大货额度转为 OA 30天 (在中信保 $150K 限额内)，拉高对主力盘 Sigma 的进攻力！'
    },
    milestoneStatus: 'Requirement freeze' // 四阶段之一: 'Requirement freeze'
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
    createdAt: '2026-06-01 11:00:00',
    
    // STEP 1, 2, 3 Expanded Intelligence
    ehsCompliance: {
      requiredCertificates: ['欧盟 REACH 豁免/注册号', 'EPMB 医药辅料准入双签证书', 'CEP/GMP 联合认证报告'],
      sanctionNotes: '经联邦合规底册全面穿透，本级及二级合作人均为白名单，享有德中自贸直航绿通通关豁免。',
      blacklistVerification: '联合黑名单系统自查：安全通行。已全量比对包括历史 1.0 版本优惠券（version 1.0 coupons）、授信延展等全周期金融协议记录，交叉对账零差错。',
      hasViolationRisk: false
    },
    supplyChain: {
      competitors: [
        { name: 'Mallinckrodt Solvents US', share: 55 },
        { name: 'Spanish Pharm-Chem SA', share: 40 },
        { name: 'Other Spot Brokers', share: 5 }
      ],
      nextSourcingWindow: '2026年Q4初期 (常年长协锁定，正寻找中国第二备用货池)',
      portAnalysis: '供应链流向：勒沃库森中央港常态化保税库入库。该集团目前对于Mallinckrodt的非美依赖性进行去风险测试。'
    },
    financeRating: {
      creditRatingScore: 99,
      sinosureLimitEstimated: '$1,000,000 USD (中信保定级：AAA级极佳)',
      baseGmvLastYear: 1000000,
      targetGmvThisYear: 1500000,
      sourcingIndexDelta: 325000,
      gmvContribution: 0.65, // 65.0% = 325000 / (1500000 - 1000000) (绝对增量计算！)
      suggestedPaymentScheme: '由于其 AAA 评级和极低潜在拖欠率，强烈建议提供 OA 60天 清关结算，完全可以由中信保覆盖，是作为稳定大货长协开发的顶级王牌终端！'
    },
    milestoneStatus: 'Sample test' // 四阶段之一: 'Sample test'
  },
  {
    id: 'R-003',
    companyName: 'Zeta Chemical Logistics LLC',
    country: 'United States',
    website: 'www.zetachemlogistics.com',
    businessScope: '通用化学品进出口代理及北美仓储，对特种易制毒试剂有申报历史。',
    registrationStatus: '异常存续 (Suspended/Pending Audit) | 注册于特拉华州，目前存在未结税务清算行政诉讼。',
    tradeRecords: '海关逆向记录提示：过去6个月内发生过 2 起进口报关被扣留调查记录，涉嫌未报备合规文件擅自清关。',
    negativeNews: '安全诉讼风险核验：存在违规涉外制裁二级关联指控，在美存在多起尚未终审的小额供应商欠款违约。',
    sanctionRisk: '高风险',
    websiteTrustScore: 42,
    emailTrustScore: 50,
    purchasePotentialScore: 35,
    creditRiskLevel: '高',
    paymentSuggestion: '强烈建议：拒绝赊销！若交易必须采取 100% 前 T/T 预付。',
    recommendedProducts: [
      '工业级异丙醇 (Isopropyl Alcohol)',
      '丙酮试剂原料'
    ],
    summary: '该客户存在重大信贷欺诈诉讼，且由于触发多项联合筛查警告（包含历史 1.0 版本优惠券异常欠账清算冲突），列为禁运/不合作黑名单名单，建议立即斩断跟进。',
    createdAt: '2526-06-10 18:20:00',
    
    // STEP 1, 2, 3 Expanded Intelligence
    ehsCompliance: {
      requiredCertificates: ['特种易制毒剧毒化学品许可证 (DEA Form 223)', 'EPA 危险废物运输准入证'],
      sanctionNotes: '⚠️ 系统重度警告：该司与被 OFAC 列入制裁清单的某些特种中间体转运实体存在高频交易穿透，触犯二级违背合规底线。',
      blacklistVerification: '🚨 联合黑名单阻断警告：在系统交叉校验中，发现该司历史账户中残留有早期 1.0 版本的优惠券（version 1.0 coupons）抵扣欠款未结争议，且相关异常付款凭证仍在争议仲裁中。已触发出口联合黑名单防御机制拦截！',
      hasViolationRisk: true
    },
    supplyChain: {
      competitors: [
        { name: 'Blackmarket/Shadow Suppliers', share: 100 }
      ],
      nextSourcingWindow: '已锁定 (严禁交易)',
      portAnalysis: '逆向审计提示其试图通过非法中转、二次换单方式规避海关毒物局的自动稽查系统。'
    },
    financeRating: {
      creditRatingScore: 15,
      sinosureLimitEstimated: '$0 USD (中信保列入拒绝授信级别黑名单)',
      baseGmvLastYear: 100000,
      targetGmvThisYear: 200000,
      sourcingIndexDelta: 0,
      gmvContribution: 0.0,
      suggestedPaymentScheme: '无。中信保拒保。强烈建议采用 100% 前 T/T (全款到账后安排定制) 或直接予以退单/拒签风险拦截！'
    },
    milestoneStatus: 'Requirement freeze'
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

export const MOCK_PIPELINES: LeadPipeline[] = [
  {
    id: "PIPE-001",
    name: "国内环评公示扫描高通量过滤器",
    channelType: "环评公示雷达",
    status: "active",
    spiderMethod: "PDF文档批量解析",
    frequency: "每小时监测",
    aiPrompt: "提取环评报告PDF原辅料消耗清单中的CAS号与年消耗吨位",
    mockRawData: `【建设项目环境影响报告书 - 摘录】\n项目名称：年产 150 吨高纯原料药及医药化学中间体改扩建项目\n建设单位：山东聚源华医药科技有限公司\n本项目拟购入原辅材料清单及消耗指标：\n1. 邻氯苯甲腈（CAS号: 88-24-4），年最大消耗量为 85.0 吨，主要用于合成广谱抗菌药。\n2. 醋酸甲酯（CAS: 79-20-9），年消耗 120.0 吨，作通用有机溶剂使用。\n3. 2,4-二氯苯酮（CAS: 2234-16-4），无水条件下反应，年用量约 45.0 吨。\n4. 无水氯化锌（CAS: 7646-85-7），年用量 15.0 吨。\n废水经深度处理后达标排放，废气采用 RTO 蓄热燃烧装置。`,
    mockParsedJson: JSON.stringify({
      companyName: "山东聚源华医药科技有限公司",
      project: "年产 150 吨高纯原料药及医药化学中间体改扩建项目",
      region: "中国山东",
      materials: [
        { name: "邻氯苯甲腈", "casNo": "88-24-4", "annualTonnage": 85.0, "use": "合成广谱抗菌药" },
        { name: "醋酸甲酯", "casNo": "79-20-9", "annualTonnage": 120.0, "use": "通用有机溶剂" },
        { name: "2,4-二氯苯酮", "casNo": "2234-16-4", "annualTonnage": 45.0, "use": "无水合成反应" }
      ],
      estimatedLeadValue: "A"
    }, null, 2)
  },
  {
    id: "PIPE-002",
    name: "PubMed 海外前沿文献需求追踪器",
    channelType: "文献专利雷达",
    status: "active",
    spiderMethod: "API直连",
    frequency: "每日监测",
    aiPrompt: "提取Methods章节中的化学试剂纯度要求及通讯作者邮箱",
    mockRawData: `Title: Quantitative HPLC-MS research of amino acids using customized reagents.\nJournal: Journal of Medicinal Chemistry, June 2026.\nMaterials and Methods:\nAnalytical grade Acetonitrile (HPLC grade, purity >= 99.98%, CAS: 75-05-8) and Anhydrous Zinc Triflates (purity > 99.5%, CAS: 54010-75-2) were purchased from local suppliers. All bio-assays were conducted with high-purity compounds.\nCorresponding author: Prof. Dr. Alistair Vance, Vance Biopharma Lab, University of Cambridge. Email: a.vance@cambridge-biopharma.org.uk or alistair.vance@cam.ac.uk`,
    mockParsedJson: JSON.stringify({
      institution: "University of Cambridge (Vance Biopharma Lab)",
      contactName: "Prof. Dr. Alistair Vance",
      contactEmail: "a.vance@cambridge-biopharma.org.uk",
      requiredReagents: [
        { "chemicalName": "Acetonitrile HPLC Grade", "casNo": "75-05-8", "spec": "Purity >= 99.98%" },
        { "chemicalName": "Anhydrous Zinc Triflates", "casNo": "54010-75-2", "spec": "Purity > 99.5%" }
      ],
      country: "United Kingdom",
      urgency: "中",
      estimatedLeadValue: "B"
    }, null, 2)
  },
  {
    id: "PIPE-003",
    name: "CDE 国家药审中心新增 A 状态监控器",
    channelType: "医药注册雷达",
    status: "active",
    spiderMethod: "DOM爬虫",
    frequency: "每12小时监测",
    aiPrompt: "提取审评状态变更为A的制药企业及关联的原料药品种",
    mockRawData: `<table class="grid-table">\n  <tr>\n    <th>登记号</th><th>原料药名称</th><th>企业名称</th><th>包装规格</th><th>审查状态</th>\n  </tr>\n  <tr class="highlight-row">\n    <td>Y2026000109</td><td>沙库巴曲缬沙坦钠 (Sacubitril Valsartan Sodium)</td><td>江苏瑞泰制药有限公司</td><td>25kg/桶</td><td><span class="badge rounded bg-success">A (已批准)</span></td>\n  </tr>\n  <tr>\n    <td>Y2205001182</td><td>对乙酰氨基酚</td><td>石家庄化药四厂</td><td>50kg/纸板桶</td><td><span>I (在审评中)</span></td>\n  </tr>\n</table>`,
    mockParsedJson: JSON.stringify({
      updatedRegistrations: [
        {
          registrationNo: "Y2026000109",
          purityApi: "沙库巴曲缬沙坦钠",
          casNo: "936623-90-4",
          company: "江苏瑞泰制药有限公司",
          status: "A (已批准进行商业制剂生产)"
        }
      ],
      estimatedLeadValue: "A"
    }, null, 2)
  },
  {
    id: "PIPE-004",
    name: "微信/小红书交易现货需求监听器",
    channelType: "社媒意向",
    status: "paused",
    spiderMethod: "Headless动态渲染",
    frequency: "每10分钟监测",
    aiPrompt: "提取社媒文本中的紧急求购CAS号及急迫度",
    mockRawData: `[化工现货贸易拼单群 (853)]\n[上午10:15] 华东化工代理-张：\n“紧急求购：苯甲醇 (Benzyl Alcohol) CAS 100-51-6 医药级，现货求3吨，要求三天内送到昆山库，有货的大佬带 COA 和实物照片私聊，价格好说，加急！”\n[上午10:18] 供-石科技：\n“我们厂有工业级的，99.5%纯，可以吗？”\n[上午10:19] 华东化工代理-张：\n“不行不行，只要符合 CP/USP 的医药级，有杂质分析要求的。着急用于试产。”`,
    mockParsedJson: JSON.stringify({
      buyerName: "华东化工代理-张",
      inquiryChannel: "微信化工现货贸易拼单群",
      requirement: {
        chemicalName: "苯甲醇 (Benzyl Alcohol)",
        casNo: "100-51-6",
        grade: "医药级 (CP/USP)",
        quantity: "3吨",
        urgency: "极高 (3天内交货)",
        location: "昆山仓库"
      },
      estimatedLeadValue: "A"
    }, null, 2)
  }
];

