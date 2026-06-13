/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Line types for persistent/shared state

export interface Lead {
  id: string;
  source: '展会雷达' | '社媒意向' | 'B2B平台' | '海关数据' | '手动录入' | '文献专利雷达' | '医药注册雷达' | '公共招投标' | '环评公示雷达' | '文献专利' | '医药注册' | '海关提单' | '垂直B2B' | '海外社媒' | '环评公示' | 'CDE登记' | '本土B2B' | '社群求购' | '统一线索池';
  companyName: string;
  country: string;
  region: string;
  customerType: '分销商' | '终端工厂' | '高校/科研所' | '检测机构' | '其他';
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  productKeywords: string;
  casNo: string;
  intentDescription: string;
  intentScore: number; // 0 - 100
  leadScore: number; // 0 - 100
  leadGrade: 'A' | 'B' | 'C' | 'D'; // A: 重点跟进, B: 可开发, C: 长期培育, D: 忽略/风险
  riskLevel: '低' | '中' | '高';
  urgencyLevel: '高' | '中' | '低';
  recommendedAction: string;
  status: '待联系' | '已发送开发信' | '已回复' | '已转询盘' | '已报价' | '已成交' | '已放弃';
  createdAt: string;
  channelContext?: {
    casVolume?: string; // 需求量级，如：乙腈 (10吨/年)
    authorEmail?: string; // 通讯作者邮箱
    eiaSpecs?: string; // 环评新建车间规格
    customsIncumbent?: string; // 海关原供应商
    tenderDeadline?: string; // 截标倒计时
    isUrgent?: boolean; // 是否紧急现货
  };
  intelligenceTags?: string[];
}

export type ChannelType = '邮件' | '微信/社群' | '领英';
export type ToneType = '专家顾问风' | '狼性现货风' | '温和客情风';
export type MilestoneStage = 'Requirement freeze' | 'Solution validation' | 'Commercial negotiation' | 'Full launch';

export interface TenderDoc {
  name: string;
  type: 'critical' | 'bonus'; // critical: 🔴 硬性废标项, bonus: 🟢 一般加分项
}

export interface Tender {
  id: string;
  title: string;
  buyerName: string;
  region: string;
  publishDate: string;
  deadline: string;
  budget: string; // e.g. "¥450,000" or numeric
  productName: string;
  casNo: string;
  specification: string;
  contactName: string;
  contactPhone: string;
  tenderUrl: string;
  matchScore: number; // 0 - 100
  difficulty: '易' | '中' | '难';
  winProbability: number; // Percentage e.g. 75
  requiredDocs: TenderDoc[];
  recommendedAction: string;
  status: '待跟进' | '已报名' | '编写标书中' | '已投递' | '已中标' | '未中标' | '已放弃';
  createdAt: string;
  timeline?: {
    publishDate: string;
    buyBookDeadline: string;
    submitDeadline: string;
    openBidTime: string;
  };
  incumbentSupplier?: string;
  historicalPrice?: string;
  channel: string;
  qualifications: { type: 'red' | 'green'; text: string }[];
  estimatedBottomPrice?: string;
}

export interface CustomerResearch {
  id: string;
  companyName: string;
  country: string;
  website: string;
  businessScope: string;
  registrationStatus: string;
  tradeRecords: string; // Description or bullet points
  negativeNews: string;
  sanctionRisk: '低风险' | '中风险' | '高风险';
  websiteTrustScore: number; // 0-100
  emailTrustScore: number; // 0-100
  purchasePotentialScore: number; // 0-100
  creditRiskLevel: '低' | '中' | '高';
  paymentSuggestion: string;
  recommendedProducts: string[];
  summary: string;
  createdAt: string;

  // STEP 1 Expansion: Offense and Defense Intelligence Hub
  ehsCompliance?: {
    requiredCertificates: string[]; // 清关或准入必备文件证书
    sanctionNotes: string; // 制裁风险细化底稿提示
    blacklistVerification: string; // 包含历史 1.0 优惠券记录的联合黑名单校验记录
    hasViolationRisk: boolean; // 是否处于严重违规或黑名单阻断
  };
  supplyChain?: {
    competitors: { name: string; share: number }[]; // 逆向对手榜单及份额
    nextSourcingWindow: string; // 预测下次采购/补货窗口期
    portAnalysis: string; // 供应链流向分析
  };
  financeRating?: {
    creditRatingScore: number; // 资信评级分 (0-100)
    sinosureLimitEstimated: string; // 中信保预估最高授信限额 (如 "$200K USD")
    baseGmvLastYear: number; // 上一年度基础交易绝对额 (USD)
    targetGmvThisYear: number; // 本年度预期大货交易绝对额 (USD)
    sourcingIndexDelta: number; // 客商采购量增量绝对值指标数值 (USD, 例如当前客户指标变化绝对值 $150K)
    gmvContribution: number; // GMV 绝对增量贡献权重 (sourcingIndexDelta / (targetGmvThisYear - baseGmvLastYear) 绝对比例)
    suggestedPaymentScheme: string; // 动态账期推荐决策方案 (OA 60天 / 100% 前 T/T)
  };
  milestoneStatus?: 'Requirement freeze' | 'Sample test' | 'Pilot order' | 'Full launch'; // 项目里程碑四阶段：起于 需求冻结，止于 全量上线
}

export interface OutreachTemplateInput {
  companyName: string;
  contactName: string;
  country: string;
  targetProduct: string;
  source: string;
  painPoint: string;
  tone: 'professional' | 'warm' | 'direct' | 'creative';
}

export interface OutreachMessage {
  id: string;
  leadId?: string;
  companyName: string;
  contactName: string;
  channel: 'email' | 'linkedin' | 'whatsapp' | 'expo_invitation' | 'followup_email';
  subject: string;
  message: string;
  followUpMessage?: string;
  tone: string;
  createdAt: string;
}

export type SpiderMethod = 'API直连' | 'DOM爬虫' | 'Headless动态渲染' | 'PDF文档批量解析';

export interface LeadPipeline {
  id: string;
  name: string;
  channelType: string;
  status: 'active' | 'paused';
  spiderMethod: SpiderMethod;
  frequency: string;
  aiPrompt: string;
  mockRawData: string;
  mockParsedJson: string;
}

