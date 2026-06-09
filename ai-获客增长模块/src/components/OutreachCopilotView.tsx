/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OutreachMessage, Lead } from '../types';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  ArrowRight,
  BookOpen, 
  HelpCircle,
  FileCheck,
  Building,
  User,
  ExternalLink
} from 'lucide-react';

interface OutreachCopilotProps {
  selectedLeadForOutreach: Lead | null;
  onClearSelectedLead: () => void;
}

export default function OutreachCopilotView({ 
  selectedLeadForOutreach, 
  onClearSelectedLead 
}: OutreachCopilotProps) {
  // Input arguments
  const [companyName, setCompanyName] = useState('Apex BioLab Supplies India');
  const [contactName, setContactName] = useState('Rajesh Kumar');
  const [country, setCountry] = useState('India');
  const [targetProduct, setTargetProduct] = useState('Acetonitrile HPLC Grade');
  const [source, setSource] = useState('社媒意向');
  const [painPoint, setPainPoint] = useState('现有供应商批次稳定性不佳，HPLC 谱图上有杂质色谱峰，影响检测基线');
  const [tone, setTone] = useState<'professional' | 'warm' | 'direct' | 'creative'>('professional');

  // Trigger auto form filling from Lead Radar
  useEffect(() => {
    if (selectedLeadForOutreach) {
      setCompanyName(selectedLeadForOutreach.companyName);
      setContactName(selectedLeadForOutreach.contactName || 'Sourcing Manager');
      setCountry(selectedLeadForOutreach.country);
      setTargetProduct(selectedLeadForOutreach.productKeywords);
      setSource(selectedLeadForOutreach.source);
      // Construct a tailored painpoint based on product keywords
      setPainPoint(`正在为其科研客户采购高参数 ${selectedLeadForOutreach.productKeywords}，极其关切重金属残留、批次色谱稳定度以及海事合规资料保障。`);
      
      // Fire AI email generator instantly for excellent UX!
      handleGenerateOutreach(
        selectedLeadForOutreach.companyName, 
        selectedLeadForOutreach.contactName || 'Sourcing Manager',
        selectedLeadForOutreach.country,
        selectedLeadForOutreach.productKeywords,
        selectedLeadForOutreach.source,
        `正在为其科研客户采购高参数 ${selectedLeadForOutreach.productKeywords}，极其关切重金属残留、批次色谱稳定度以及海事合规资料保障。`
      );
      onClearSelectedLead();
    }
  }, [selectedLeadForOutreach]);

  // Loading indicator / API output data
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  
  // Custom structured response
  const [subject, setSubject] = useState('Inquiry on high-purity Acetonitrile HPLC Grade Sourcing - Trial Reagents');
  const [mainEmail, setMainEmail] = useState('');
  const [followUpEmail, setFollowUpEmail] = useState('');
  const [linkedinMsg, setLinkedinMsg] = useState('');
  const [whatsappMsg, setWhatsappMsg] = useState('');
  const [expoInvitation, setExpoInvitation] = useState('');

  // active sub-channel tabs
  const [activeChannel, setActiveChannel] = useState<'email' | 'followup' | 'linkedin' | 'whatsapp' | 'expo'>('email');

  // Copy success status
  const [copiedText, setCopiedText] = useState(false);

  const handleGenerateOutreach = async (
    comp = companyName, 
    cnt = contactName, 
    cty = country, 
    prod = targetProduct, 
    src = source, 
    pain = painPoint
  ) => {
    setIsGenerating(true);
    setStatusText('正在召唤 AI 化学外贸触达专家模型...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setStatusText(`正在针对外商痛点 "${pain.substring(0, 20)}..." 编写最吸睛的销售开发策略...`);

      const res = await fetch('/api/ai/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: comp,
          contactName: cnt,
          country: cty,
          targetProduct: prod,
          source: src,
          painPoint: pain,
          tone: tone
        })
      });

      if (!res.ok) {
        throw new Error('API server returned error code ' + res.status);
      }

      const data = await res.json();
      const output = data.outreach;

      setSubject(output.subject || `Sourcing Opportunity on high-purity ${prod} - REAGENTS PITCH`);
      setMainEmail(output.message || '');
      setFollowUpEmail(output.followUpMessage || '');
      setLinkedinMsg(output.linkedinMessage || '');
      setWhatsappMsg(output.whatsappMessage || '');
      setExpoInvitation(output.expoInvitationMessage || '');

      setStatusText('高开转化话术文案生成完毕！可在右侧切换终端渠道直接复制跟进。');

    } catch (err: any) {
      console.error(err);
      setStatusText(`AI 话术生成失败。已接入智能预设危化品开发信逻辑...`);

      // Fallback structured generation
      setSubject(`RE: Quality ${prod} Reagent Sourcing Inquiry - ${comp}`);
      setMainEmail(`Dear Mr. ${cnt},\n\nI hope this message finds you well.\n\nWe learned through ${src} that your esteemed company ${comp} is currently evaluating target suppliers for ${prod} in ${cty}.\n\nWe understand that your primary engineering challenge is "${pain}". To address this, our molecularly refined solution achieves guaranteed purity bounds (purity ≥99.98%) alongside extremely low baseline ultraviolet noise. We would be pleased to airmail a 100ml batch testing sample directly to your lab to demonstrate consistency.\n\nI have attached our ISO certification package and REACH declarations for your review.\n\nBest regards,\n[Your Name]\n[Your Company]`);
      setFollowUpEmail(`Hi ${cnt},\n\nHope your week is off to a great start.\n\nFollowing up on my previous query. We have reserved a complimentary 500ml demo pack of ultra-pure ${prod} for ${comp}. Could you please let me know your preferred courier delivery address so we can coordinate immediate dispatch?\n\nSincerely,\n[Your Name]`);
      setLinkedinMsg(`Hi ${cnt}, noticed your active interest in high-performance ${prod} under ${comp}. We supply ISO-certified batch volumes resolving peak baseline baseline fluctuations. Let's align!`);
      setWhatsappMsg(`Hi ${cnt}, this is [Your Name] from China Chemical Labs. I came across your inquiry regarding ${prod}. We have fresh stock ready for express CFR port delivery. Any interest in a sample COA?`);
      setExpoInvitation(`Dear Mr. ${cnt},\n\nWe would be honored to invite you to our upcoming CPHI Chemical Exhibition Booth 4022. We are showcasing a brand new batch filtration line for ${prod} resolving impurities issues. Let's arrange a brief face-to-face talk!\n\nBest,\n[Your Company]`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run initial mock setup once if not triggered by Radar
  useEffect(() => {
    if (!selectedLeadForOutreach) {
      // Trigger default generation to avoid empty panels!
      handleGenerateOutreach();
    }
  }, []);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Get active text and label
  const getActiveTextAndLabel = () => {
    switch (activeChannel) {
      case 'followup':
        return { text: followUpEmail, label: '二次跟进邮件 (Follow-up)' };
      case 'linkedin':
        return { text: linkedinMsg, label: 'LinkedIn 简短私信' };
      case 'whatsapp':
        return { text: whatsappMsg, label: 'WhatsApp 便捷消息' };
      case 'expo':
        return { text: expoInvitation, label: '行业展会邀约邮件' };
      case 'email':
      default:
        return { text: `Subject: ${subject}\n\n${mainEmail}`, label: '首封开发信 (Cold Email)' };
    }
  };

  const activeSegment = getActiveTextAndLabel();

  return (
    <div className="space-y-6" id="outreach-copilot-view">
      
      {/* Visual Header */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          AI 多渠道开发信与触达文案协同工作室
        </h2>
        <p className="text-xs text-slate-550 mt-1 max-w-2xl">
          由 AI 融合买家痛点与化学品规格指标进行千人千面的开发文案设计。支持电联开发信、社交媒体轻推、WhatsApp瞬发、乃至线下行业展会邀约信。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left col: Argument inputs form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1.5 pb-2 border-b border-slate-150">
            <User className="w-4.5 h-4.5 text-slate-400" />
            买家背景与开发诉求配置
          </h3>

          <div className="space-y-3.5 text-xs">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">外商公司名称</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-505"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">采购决策人姓名</label>
                <input 
                  type="text" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">目标国家/城市</label>
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">线索监控来源</label>
                <input 
                  type="text" 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">目标匹配化学品 (及 CAS 号)</label>
              <input 
                type="text" 
                value={targetProduct}
                onChange={(e) => setTargetProduct(e.target.value)}
                placeholder="例如: Paracetamol USP CAS 103-90-2"
                className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">买家痛点及纯度诉求 (Painpoint Sourcing)</label>
              <textarea 
                rows={3}
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                placeholder="例如: 现有供货批次纯度不够, 售后慢, 国际合规资料不齐全"
                className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-505 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">AI 外贸文风语气风格 (Vibe Tone)</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {(['professional', 'warm', 'direct', 'creative'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-1 rounded text-[10px] font-bold transition-all capitalize cursor-pointer ${tone === t ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {t === 'professional' ? '严谨' : t === 'warm' ? '热情' : t === 'direct' ? '直出' : '创意'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <button 
            id="copilot-generate-btn"
            onClick={() => handleGenerateOutreach()}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-colors py-2.5 rounded-lg text-xs font-bold cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                正在智能匹配生成高转化话术...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                一键生成多渠道触达信
              </>
            )}
          </button>
        </div>

        {/* Right col: Multi-channel result visualizer & copier (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Status logs */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-350 text-xs font-mono">
            <strong>● 话术生成流追踪日志:</strong>
            <p className="text-slate-400 mt-1">{statusText || "就绪。点击左侧按钮，即可调动针对该产品的深度痛点转化逻辑。"}</p>
          </div>

          {/* Sifter channels tabs */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px]">
            <div className="flex bg-slate-50 border-b border-slate-100 divide-x divide-slate-100">
              <button 
                id="outreach-channel-email"
                onClick={() => setActiveChannel('email')}
                className={`flex-1 py-3 px-1.5 text-xs font-bold transition-all cursor-pointer ${activeChannel === 'email' ? 'bg-white text-indigo-700 font-extrabold border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                首封冷开信
              </button>
              <button 
                id="outreach-channel-followup"
                onClick={() => setActiveChannel('followup')}
                className={`flex-1 py-3 px-1.5 text-xs font-bold transition-all cursor-pointer ${activeChannel === 'followup' ? 'bg-white text-indigo-700 font-extrabold border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                二次跟进
              </button>
              <button 
                id="outreach-channel-linkedin"
                onClick={() => setActiveChannel('linkedin')}
                className={`flex-1 py-3 px-1.5 text-xs font-bold transition-all cursor-pointer ${activeChannel === 'linkedin' ? 'bg-white text-indigo-700 font-extrabold border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                领英私信
              </button>
              <button 
                id="outreach-channel-whatsapp"
                onClick={() => setActiveChannel('whatsapp')}
                className={`flex-1 py-3 px-1.5 text-xs font-bold transition-all cursor-pointer ${activeChannel === 'whatsapp' ? 'bg-white text-indigo-700 font-extrabold border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                WhatsApp
              </button>
              <button 
                id="outreach-channel-expo"
                onClick={() => setActiveChannel('expo')}
                className={`flex-1 py-3 px-1.5 text-xs font-bold transition-all cursor-pointer ${activeChannel === 'expo' ? 'bg-white text-indigo-700 font-extrabold border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                展前邀约
              </button>
            </div>

            {/* Inner text block */}
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                    {activeSegment.label}
                  </span>
                  {activeChannel === 'email' && (
                    <span className="text-slate-400">
                      语气：<strong className="text-indigo-600 capitalize">{tone}</strong>
                    </span>
                  )}
                </div>

                <div 
                  className="bg-white border border-slate-150 rounded-xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800 select-all min-h-[250px] shadow-xs"
                  id="outreach-output-box"
                >
                  {activeSegment.text || "正在抓取生成中..."}
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                <div className="text-slate-400 flex items-center gap-1">
                  <FileCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span>点击复制后，即可直接在 LinkedIn/邮箱 中快速发送。</span>
                </div>
                
                <button 
                  id="copilot-copy-btn"
                  onClick={() => copyToClipboard(activeSegment.text)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-4 h-4" />
                      已复制！
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      复制此开发信
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Follow up sequences guide card */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-xl border border-slate-800 space-y-3 shadow-md">
            <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              AI 推荐客户培育跟进规律 (Follow-up Cadence Advice)
            </h4>
            <div className="grid grid-cols-5 text-center text-[10px] gap-2 pt-1 font-sans">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <span className="font-bold block text-indigo-300">T + 1 天</span>
                <span className="text-slate-450 mt-1 block">发首封开发信</span>
              </div>
              <div className="bg-slate-850/60 p-2 rounded">
                <span className="font-bold block text-slate-400">T + 3 天</span>
                <span className="text-slate-500 mt-block">加领英发送简析</span>
              </div>
              <div className="bg-slate-850/60 p-2 rounded">
                <span className="font-bold block text-slate-400">T + 5 天</span>
                <span className="text-slate-500 mt-block">发二次跟进信</span>
              </div>
              <div className="bg-slate-850/60 p-2 rounded">
                <span className="font-bold block text-slate-400">T + 8 天</span>
                <span className="text-slate-500 mt-block">加 WhatsApp呼叫</span>
              </div>
              <div className="bg-indigo-900/40 p-2 rounded border border-indigo-500/30">
                <span className="font-bold block text-indigo-200">T + 12 天</span>
                <span className="text-indigo-300 font-medium mt-block">寄送COA纸质邮样</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
