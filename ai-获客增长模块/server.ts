/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Google GenAI SDK to avoid crash if env is missing
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Check API status
app.get("/api/health", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    status: "ok",
    aiEngine: hasKey ? "Gemini Live API" : "Intelligent Fallback Engine (No Key)",
    timestamp: new Date().toISOString()
  });
});

// Helper to generate quick random IDs
const genId = (prefix: string) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

// Mock data generator helper functions for both no-API-key and API-fail gracefully-degrade fallbacks
function getMockLeads(kw: string, src: string, cty: string, customerType?: string) {
  return [
    {
      id: genId("L"),
      source: src,
      companyName: `${cty} ${kw.replace(/[\d-]/g, '')} Solutions Ltd`,
      country: cty,
      region: cty === "China" || cty === "India" || cty === "Japan" ? "Asia" : "Europe/America",
      customerType: customerType || "分销商",
      contactName: `Mr. Marcus Sourcing`,
      contactTitle: "Senior Chemical Directory Buyer",
      email: `sourcing@${cty.toLowerCase().replace(/\s+/g, '')}chem-solutions.com`,
      phone: "+44 20 7946 0192",
      linkedin: "linkedin.com/company/sourcing-solutions",
      website: `www.${cty.toLowerCase().replace(/\s+/g, '')}chem-solutions.com`,
      productKeywords: kw,
      casNo: kw.includes("-") ? kw : "75-05-8",
      intentDescription: `正在对 ${kw} 进行新项目配方适配，需求纯度 ≥99.5%，计划第一阶段小试采购量 500kg，后续需求扩产。(智能备用引擎保障)`,
      intentScore: 84,
      leadScore: 89,
      leadGrade: "A",
      riskLevel: "低",
      recommendedAction: `发送带 HPLC 谱图的产品规格表 (COA) 与 MSDS，并告知常态港口海运价格`,
      status: "待联系",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    },
    {
      id: genId("L"),
      source: src,
      companyName: `Global Reagents & Bio LLC`,
      country: cty,
      region: "Global",
      customerType: "高校/科研所",
      contactName: `Dr. Elena Petrova`,
      contactTitle: "Head of Chemistry Sourcing Department",
      email: `elena.petrova@globalbioreagents.org`,
      phone: "+1 (555) 0192-332",
      linkedin: "linkedin.com/in/elena-petrova-bioreagents",
      website: "www.globalbioreagents.org",
      productKeywords: kw,
      casNo: "103-90-2",
      intentDescription: `在科研社区讨论对 ${kw} 进行生物分析需要高纯度、超低含水率的级份，希望厂商寄送 5L 样品进行比对测试。(智能备用引擎保障)`,
      intentScore: 71,
      leadScore: 75,
      leadGrade: "B",
      riskLevel: "低",
      recommendedAction: `提供 100ml 付费样品测试，同时寄送我司实验室专属的试剂彩页及出口许可证件复印件`,
      status: "待联系",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
  ];
}

function getMockTenders(prod: string, cas: string, reg: string, budget: string) {
  const budg = budget || "¥500,000";
  return [
    {
      id: genId("T"),
      title: `${reg}生态环境监测站2026年${prod}（分子级）及配套溶剂集中采购项目`,
      buyerName: `${reg}生态环境监测中心`,
      region: reg,
      publishDate: new Date().toISOString().substring(0, 10),
      deadline: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
      budget: budg.includes("¥") ? budg : `¥${budg}`,
      productName: prod,
      casNo: cas,
      specification: "HPLC / GC-MS级溶剂纯度≥99.98%, 含水量低至50ppm",
      contactName: "温主任",
      contactPhone: "0755-83210982",
      tenderUrl: "https://www.ccgp-guangdong.gov.cn/specTender/Tmock",
      matchScore: 94,
      difficulty: "中",
      winProbability: 75,
      requiredDocs: [
        "三证合一营业执照",
        "危险化学品经营许可证",
        "原厂盖章特约品牌授权书及规格COA认证",
        "符合中国药典或环保标准测试样本"
      ],
      recommendedAction: `该监测站重点偏向品质稳定性。由于我司自有品牌测试表现良好且价格比外资竞品低约25%，直接参与投标可凭价格分、技术参数全面匹配占得先机。(智能备用引擎保障)`
    },
    {
      id: genId("T"),
      title: `${reg}医科大学药学院新研发中心${prod}试剂耗材采购入围公开比选`,
      buyerName: `${reg}医科大学采购部`,
      region: reg,
      publishDate: new Date(Date.now() - 3 * 86400000).toISOString().substring(0, 10),
      deadline: new Date(Date.now() + 12 * 86400000).toISOString().substring(0, 10),
      budget: budg.includes("¥") ? budg : `¥${budg}`,
      productName: prod,
      casNo: cas,
      specification: "分析纯/色谱纯、实验室对照级别",
      contactName: "宋老师",
      contactPhone: "0755-81290382",
      tenderUrl: "http://www.shzfcg.gov.cn/project/mock",
      matchScore: 81,
      difficulty: "易",
      winProbability: 88,
      requiredDocs: [
        "普通商贸服务营业执照",
        "实验室化学试剂经销资质证书及COA谱图",
        "无重大违法记录信用承诺函"
      ],
      recommendedAction: `高校药学院比选要求宽松，我司可组织核心代理商或者销售经理以独立形式跟进，提早沟通获取指定样品的预测试优先权即可。(智能备用引擎保障)`
    }
  ];
}

function getMockReport(comp: string, cty: string, web: string) {
  return {
    id: genId("R"),
    companyName: comp,
    country: cty,
    website: web,
    businessScope: `${comp}主要经营化学品供应链代理、特纯实验室试剂、生物配方对照管线的分销配送，深耕南亚/本地终端高校约200余家网络。`,
    registrationStatus: `核查存续 (Active/Incorporated)。注册资金：约2500万当地货币。注册纳税号合法可信。`,
    tradeRecords: `根据历史进出口提单数据统计，发现该司每年有12-18批次集装箱货船提单记录，主要从中国华东口岸（宁波、上海、青岛）流向港口。主力进口产品正是本司对应的乙腈与通用无水试剂。`,
    negativeNews: `未检查到公开的反补贴倾销制裁、重大环境泄漏处罚或者欠款诉讼。但在海外地方法院有一起2024年的知识产权版权误标纠纷仲裁案，现已妥善终结。`,
    sanctionRisk: "低风险",
    websiteTrustScore: 88,
    emailTrustScore: 91,
    purchasePotentialScore: 84,
    creditRiskLevel: "低",
    paymentSuggestion: `对首单风险建议电汇 30% 到 50% 定金，发货前见提单复印件结清 (TT 30% Pre-paid + 70% against BL copia)。老客户可提单付或长期信用 L/C at Sight。`,
    recommendedProducts: [
      `色谱纯乙腈 (Acetonitrile HPLC Grade)`,
      `分析级甲醇 (Methanol AR)`,
      `无水乙醇 (Absolute Ethanol 99.9%)`
    ],
    summary: `${comp}是一家实力中上、资信良好的优秀本土经销商，未在官方黑名单之列，有强烈的中国高品质货源定制对接意愿，采购转化概率极高。(智能备用引擎保障)`,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
}

function getMockOutreach(comp: string, cnt: string, cty: string, prod: string, src: string, pain: string, t: string) {
  return {
    id: genId("O"),
    companyName: comp,
    contactName: cnt,
    channel: "email",
    subject: `Inquiry on high-purity ${prod} for ${comp} - Reagent Sourcing Opportunity`,
    message: `Dear Mr. ${cnt},\n\nI hope this email finds you well.\n\nWe learned through ${src} that ${comp} is seeking top-tier supply for ${prod} in ${cty}. We specialize in high-purity lab solvents and raw APIs designed to resolve critical pain points such as "${pain}".\n\nOur solvent delivers a guaranteed chromatographic purity of ≥99.98% with water residues ≤50ppm. This translates directly to exceptional chromatographic baselines for your clients' HPLC and GC-MS validations.\n\nWe would love to coordinate a custom FOB/CIF or CFR shipment with matched batch COAs. Could you let us know if we can forward a 500ml testing package to your Pune laboratory?\n\nSincerely,\n[Your Name]\n[Your Company Name] (智能备用保障文案)`,
    followUpMessage: `Hi ${cnt},\n\nHope your week is off to a solid start!\n\nJust following up on my previous note. We recently shipped a major batch of our ${prod} to diagnostic distributors in India and would be glad to combine a custom sample and a test spectrum graph for your team. Would love to schedule a quick 10-minute check next Tuesday.\n\nWarmly,\n[Your Name]`,
    linkedinMessage: `Hello ${cnt}, came across ${comp}'s reagent pipeline in ${cty}. We supply world-class chromatographic grades like ${prod} that ensure zero batch drift. Let's connect to share our REACH/COA specs!`,
    whatsappMessage: `Hi ${cnt}, this is [Your Name] from China Reagents. I received your contact information and target specs for ${prod}. We have fresh stock ready for shipping. Any interest in a direct quote?`,
    expoInvitationMessage: `Dear Mr. ${cnt},\n\nWe are excited to invite you to our Booth [No. 4022] in the upcoming CPHI Exhibition. We are unveiling our newest ultra-pure chromatographic solutions specially designed for custom laboratory applications.\n\nLooking forward to meeting you face-to-face!\n\nBest regards,\n[Your Company Name]`,
    tone: t,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
}

// 1. AI Lead Radial generation endpoint
app.post("/api/ai/scan-leads", async (req, res) => {
  const { source, keyword, country, customerType } = req.body;
  const kw = keyword || "Paracetamol";
  const src = source || "展会雷达";
  const cty = country || "Germany";

  const client = getGeminiClient();

  if (!client) {
    const mockLeads = getMockLeads(kw, src, cty, customerType);
    return res.json({ leads: mockLeads, simulated: true });
  }

  try {
    const prompt = `You are an AI Trade Intelligence system specifically crawling international chemicals & lab reagents data. 
    Analyze the follow query and generate exactly 2 highly realistic prospective customer leads for a chemical supplier:
    - Search Keyword: ${kw}
    - Lead Source Channel: ${src}
    - Target Country: ${cty}
    - Desired Customer Type: ${customerType || "Any"}
    
    Ensure the intentDescription relates perfectly to chemical sourcing, HPLC grades, USP grades, lab trials, or procurement specifications of ${kw}.
    Use the required schema fields. The output must be valid JSON matching the schema.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  companyName: { type: Type.STRING },
                  country: { type: Type.STRING },
                  region: { type: Type.STRING },
                  customerType: { type: Type.STRING },
                  contactName: { type: Type.STRING },
                  contactTitle: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  website: { type: Type.STRING },
                  productKeywords: { type: Type.STRING },
                  casNo: { type: Type.STRING },
                  intentDescription: { type: Type.STRING },
                  intentScore: { type: Type.INTEGER },
                  leadScore: { type: Type.INTEGER },
                  leadGrade: { type: Type.STRING },
                  riskLevel: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING },
                },
                required: [
                  "companyName", "country", "region", "customerType", "contactName", 
                  "email", "productKeywords", "intentDescription", "intentScore", 
                  "leadScore", "leadGrade", "riskLevel", "recommendedAction"
                ]
              }
            }
          },
          required: ["leads"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const withIds = (parsed.leads || []).map((lead: any) => ({
      ...lead,
      id: genId("L"),
      source: src,
      status: "待联系",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }));

    res.json({ leads: withIds, simulated: false });

  } catch (err: any) {
    console.warn("Gemini Scan Leads Error - falling back to simulated data:", err.message || err);
    const mockLeads = getMockLeads(kw, src, cty, customerType);
    res.json({ leads: mockLeads, simulated: true, errorFallback: true });
  }
});

// 2. AI Tender Helper analysis endpoint
app.post("/api/ai/analyze-tender", async (req, res) => {
  const { productName, casNo, region, budget } = req.body;
  const prod = productName || "色谱乙腈";
  const cas = casNo || "75-05-8";
  const reg = region || "广东省";
  const budg = budget || "¥500,000";

  const client = getGeminiClient();

  if (!client) {
    const mockTenders = getMockTenders(prod, cas, reg, budg);
    return res.json({ tenders: mockTenders, simulated: true });
  }

  try {
    const prompt = `You are a Chinese Public Procurement and Government Tender Analyst specialized in the laboratory chemical products industry.
    Generate exactly 2 highly realistic laboratory reagent / chemical public procurement tenders matching these parameters:
    - Product keyword: ${prod}
    - CAS No: ${cas}
    - Region/Province: ${reg}
    - Approximate budget: ${budg}
    
    Ensure names sound like official government procurement channels, environmental monitoring stations, university medical campuses, or public analysis hubs in China.
    Include matchScore, difficulty ("易", "中" or "难"), probability, structured lists of requiredDoc documents, and precise bidding suggestions based on domestic Chinese government bidding practices.
    Output must be valid JSON in Chinese matching the schema.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tenders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  buyerName: { type: Type.STRING },
                  region: { type: Type.STRING },
                  specification: { type: Type.STRING },
                  contactName: { type: Type.STRING },
                  contactPhone: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                  difficulty: { type: Type.STRING }, // 易, 中, 难
                  winProbability: { type: Type.INTEGER },
                  requiredDocs: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  recommendedAction: { type: Type.STRING }
                },
                required: ["title", "buyerName", "region", "specification", "matchScore", "difficulty", "winProbability", "requiredDocs", "recommendedAction"]
              }
            }
          },
          required: ["tenders"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const formatted = (parsed.tenders || []).map((t: any) => ({
      ...t,
      id: genId("T"),
      publishDate: new Date().toISOString().substring(0, 10),
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
      budget: budg.includes("¥") ? budg : `¥${budg}`,
      productName: prod,
      casNo: cas,
      tenderUrl: `https://www.zfcg.gov.cn/mock-tender-${genId("URL")}`,
      status: "待跟进",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }));

    res.json({ tenders: formatted, simulated: false });

  } catch (err: any) {
    console.warn("Gemini Analyze Tender Error - falling back to simulated data:", err.message || err);
    const mockTenders = getMockTenders(prod, cas, reg, budg);
    res.json({ tenders: mockTenders, simulated: true, errorFallback: true });
  }
});

// 3. AI Due Diligence Report endpoint
app.post("/api/ai/due-diligence", async (req, res) => {
  const { companyName, country, website } = req.body;
  const comp = companyName || "Apex BioLab Supplies India";
  const cty = country || "India";
  const web = website || "www.apexbio.in";

  const client = getGeminiClient();

  if (!client) {
    const mockReport = getMockReport(comp, cty, web);
    return res.json({ report: mockReport, simulated: true });
  }

  try {
    const prompt = `You are an expert in chemical export risk assessment and global corporate credit bureau.
    Generate a detailed Due Diligence & Foreign Trade Risk Report for:
    - Company Name: ${comp}
    - Location: ${cty}
    - Corporate URL: ${web}
    
    The response must provide:
    1. businessScope: Brief review of business domain in chemicals.
    2. registrationStatus: Corporate status, tax ID registry note.
    3. tradeRecords: Customs bill-of-lading simulation analysis.
    4. negativeNews: Safety lawsuits, disputes, major tax issues.
    5. sanctionRisk: Sanction list check ("低风险", "中风险", "高风险").
    6. websiteTrustScore: Trust level of the website domain (0-100).
    7. emailTrustScore: Verification score of corporate emails (0-100).
    8. purchasePotentialScore: Demand capacity of chemicals (0-100).
    9. creditRiskLevel: Sourcing loan delinquency rating ("低", "中", "高").
    10. paymentSuggestion: Recommended payment methods (T/T, L/C, O/A).
    11. recommendedProducts: Array of 3 key reagents they likely import.
    12. summary: 2-sentence executive summary evaluation.
    
    Output in Chinese, but keep technical terms standard. The output must be valid JSON matching the schema.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessScope: { type: Type.STRING },
            registrationStatus: { type: Type.STRING },
            tradeRecords: { type: Type.STRING },
            negativeNews: { type: Type.STRING },
            sanctionRisk: { type: Type.STRING },
            websiteTrustScore: { type: Type.INTEGER },
            emailTrustScore: { type: Type.INTEGER },
            purchasePotentialScore: { type: Type.INTEGER },
            creditRiskLevel: { type: Type.STRING },
            paymentSuggestion: { type: Type.STRING },
            recommendedProducts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: { type: Type.STRING }
          },
          required: [
            "businessScope", "registrationStatus", "tradeRecords", "negativeNews", 
            "sanctionRisk", "websiteTrustScore", "emailTrustScore", "purchasePotentialScore", 
            "creditRiskLevel", "paymentSuggestion", "recommendedProducts", "summary"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const report = {
      ...parsed,
      id: genId("R"),
      companyName: comp,
      country: cty,
      website: web,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    res.json({ report, simulated: false });

  } catch (err: any) {
    console.warn("Gemini Due Diligence Error - falling back to simulated data:", err.message || err);
    const mockReport = getMockReport(comp, cty, web);
    res.json({ report: mockReport, simulated: true, errorFallback: true });
  }
});

// 4. AI Outreach Message generator endpoint
app.post("/api/ai/outreach", async (req, res) => {
  const { companyName, contactName, country, targetProduct, source, painPoint, tone } = req.body;
  const comp = companyName || "Apex BioLab Supplies India";
  const cnt = contactName || "Rajesh Kumar";
  const cty = country || "India";
  const prod = targetProduct || "Acetonitrile HPLC Grade";
  const src = source || "展会雷达";
  const pain = painPoint || "现有供应商供货不稳定，色谱杂质斑点高";
  const t = tone || "professional";

  const client = getGeminiClient();

  if (!client) {
    const mockOutreach = getMockOutreach(comp, cnt, cty, prod, src, pain, t);
    return res.json({ outreach: mockOutreach, simulated: true });
  }

  try {
    const prompt = `You are a professional chemical foreign trade conversion specialist.
    Create a complete set of highly professional outreach templates for a salesperson contacting:
    - Company: ${comp}
    - Recipient: ${cnt} (${cty})
    - Target Product: ${prod}
    - Information Source: ${src}
    - Identified Sourcing Pain Points: ${pain}
    - Tone style: ${t === "warm" ? "Warm & helpful" : t === "direct" ? "Brief & direct" : t === "creative" ? "Thought-provoking & unique" : "Formal & professional"}
    
    Generate output in JSON containing:
    1. subject: Seductive English email header (e.g. including CAS, grade or batch stability)
    2. message: Rich initial cold email (using placeholders like [Your Name], [Your Company Name]). Highlight how our quality defeats their pain point: "${pain}".
    3. followUpMessage: A follow-up email after 4-5 days, providing high value or test batch COA.
    4. linkedinMessage: LinkedIn connected request message (under 300 chars, elegant invitation).
    5. whatsappMessage: Extra short WhatsApp message (very personal, fast, casual).
    6. expoInvitationMessage: A friendly email invitation if they wish to meet at CPHI or similar chemical trade fairs.
    
    The output must strictly be in valid JSON conforming to this schema. Maintain excellent english punctuation.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            message: { type: Type.STRING },
            followUpMessage: { type: Type.STRING },
            linkedinMessage: { type: Type.STRING },
            whatsappMessage: { type: Type.STRING },
            expoInvitationMessage: { type: Type.STRING }
          },
          required: ["subject", "message", "followUpMessage", "linkedinMessage", "whatsappMessage", "expoInvitationMessage"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const outreach = {
      ...parsed,
      id: genId("O"),
      companyName: comp,
      contactName: cnt,
      tone: t,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    res.json({ outreach, simulated: false });

  } catch (err: any) {
    console.warn("Gemini Outreach Error - falling back to simulated data:", err.message || err);
    const mockOutreach = getMockOutreach(comp, cnt, cty, prod, src, pain, t);
    res.json({ outreach: mockOutreach, simulated: true, errorFallback: true });
  }
});

// Vite middleware setup if we are in development mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for all other routes (SPA fallback)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI Lead Gen Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
