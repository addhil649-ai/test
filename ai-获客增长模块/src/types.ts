/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Line types for persistent/shared state

export interface Lead {
  id: string;
  source: '展会雷达' | '社媒意向' | 'B2B平台' | '海关数据' | '手动录入';
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
  recommendedAction: string;
  status: '待联系' | '已发送开发信' | '已回复' | '已转询盘' | '已报价' | '已成交' | '已放弃';
  createdAt: string;
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
  requiredDocs: string[];
  recommendedAction: string;
  status: '待跟进' | '已报名' | '编写标书中' | '已投递' | '已中标' | '未中标' | '已放弃';
  createdAt: string;
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
