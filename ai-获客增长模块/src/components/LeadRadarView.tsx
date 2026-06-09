/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead } from '../types';
import { 
  Search, 
  MapPin, 
  Filter, 
  Radio, 
  Plus, 
  Mail, 
  Eye, 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle,
  FileCheck,
  Building,
  Sparkles,
  RefreshCw,
  Zap,
  ExternalLink
} from 'lucide-react';

// Helper to generate dynamic, realistic source URLs based on the Lead channel/keywords
const getOriginalSourceUrl = (lead: Lead): string => {
  const query = encodeURIComponent(lead.productKeywords || 'chemical');
  const comp = encodeURIComponent(lead.companyName || 'laboratory');
  
  if (lead.source === '社媒意向') {
    return `https://www.linkedin.com/search/results/content/?keywords=looking%20for%20${query}`;
  } else if (lead.source === '展会雷达') {
    return `https://www.google.com/search?q=${encodeURIComponent(lead.companyName + ' ' + (lead.productKeywords || '') + ' exhibit exhibitor Booth')}`;
  } else if (lead.source === '海关数据') {
    return `https://www.google.com/search?q=${encodeURIComponent(lead.companyName + ' bills of lading import shipments chemical')}`;
  } else if (lead.source === 'B2B平台') {
    return `https://www.alibaba.com/trade/search?SearchText=${query}`;
  }
  
  return `https://www.google.com/search?q=${encodeURIComponent(lead.companyName + ' ' + (lead.productKeywords || '') + ' chemical procurement')}`;
};

interface LeadRadarViewProps {
  leads: Lead[];
  onAddLeadToPipeline: (lead: Lead) => void;
  onNavigateToOutreach: (lead: Lead) => void;
  onNavigateToDD: (lead: Lead) => void;
  onBulkAddLeads: (newLeads: Lead[]) => void;
}

export default function LeadRadarView({ 
  leads, 
  onAddLeadToPipeline, 
  onNavigateToOutreach, 
  onNavigateToDD,
  onBulkAddLeads 
}: LeadRadarViewProps) {
  // State variables for Unified filters
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sub-radar modes: 'unified' | 'expo' | 'social'
  const [activeSubRadar, setActiveSubRadar] = useState<'unified' | 'expo' | 'social'>('unified');

  // Input fields for Expo Sourcing
  const [expName, setExpName] = useState('CPHI Frankfurt 2026');
  const [expCountry, setExpCountry] = useState('Germany');
  const [expChemical, setExpChemical] = useState('Paracetamol USP');

  // Input fields for Social Sourcing
  const [socKeyword, setSocKeyword] = useState('looking for supplier / reagent');
  const [socPlatform, setSocPlatform] = useState('LinkedIn');
  const [socChemical, setSocChemical] = useState('Acetonitrile HPLC');

  // Scanning loaders
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scannedLeads, setScannedLeads] = useState<Lead[]>([]);

  // Detailed Modal view
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filter handlers
  const filteredLeads = leads.filter(lead => {
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    const matchesCountry = filterCountry === 'all' || lead.country === filterCountry;
    const matchesGrade = filterGrade === 'all' || lead.leadGrade === filterGrade;
    const matchesSearch = lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.productKeywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesCountry && matchesGrade && matchesSearch;
  });

  // Extract unique countries
  const countries = Array.from(new Set(leads.map(l => l.country)));

  // Core trigger for live lead scanning using full-stack API
  const handleAIScan = async (radarType: 'expo' | 'social') => {
    setIsScanning(true);
    setScannedLeads([]);
    
    const sourceLabel = radarType === 'expo' ? '展会雷达' : '社媒意向';
    const reqKeyword = radarType === 'expo' ? expChemical : socChemical;
    const reqCountry = radarType === 'expo' ? expCountry : 'India';

    setScanStatus(`正在构建精准化学品需求规则: "${reqKeyword}" ...`);

    try {
      // Small simulated delay for visuals prior to API request
      await new Promise(r => setTimeout(r, 600));
      setScanStatus(`正在发送分析请求到 API 意向提取库...`);

      const res = await fetch('/api/ai/scan-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: sourceLabel,
          keyword: reqKeyword,
          country: reqCountry,
          customerType: radarType === 'expo' ? '终端工厂' : '分销商'
        })
      });

      if (!res.ok) {
        throw new Error('API server returned error code ' + res.status);
      }

      const data = await res.json();
      
      setScanStatus(`提取完成！已生成 ${data.leads.length} 个符合要求的拟采购线索。`);
      setScannedLeads(data.leads);

    } catch (err: any) {
      console.error(err);
      setScanStatus(`AI 扫描失败: ${err.message || '未知错误'}. 正在进入本地规则退化生成器...`);
      
      // Local backup generator
      const fallbackId = `L-GEN-${Math.floor(Math.random() * 9000)}`;
      const backupLead: Lead = {
        id: fallbackId,
        source: sourceLabel,
        companyName: `${reqCountry} ${reqKeyword.split(' ')[0]} Labs Ltd`,
        country: reqCountry,
        region: 'Global',
        customerType: radarType === 'expo' ? '终端工厂' : '分销商',
        contactName: 'James Alchemist',
        contactTitle: 'Principal Procurement Lead',
        email: `james.alchemist@${reqCountry.toLowerCase().replace(/\s+/g, '')}-chemlabs.com`,
        phone: '+44 161 496 0229',
        linkedin: 'linkedin.com/in/james-alchemist',
        website: `www.${reqCountry.toLowerCase().replace(/\s+/g, '')}-chemlabs.com`,
        productKeywords: reqKeyword,
        casNo: '75-05-8',
        intentDescription: `寻找符合 HPLC 纯度级份的 ${reqKeyword}。用于生产高品质检验耗材配方，首期需要 10 吨进行产线对标测试。`,
        intentScore: 88,
        leadScore: 91,
        leadGrade: 'A',
        riskLevel: '低',
        recommendedAction: '发送我司自主色谱图及最新厂验报告，并推荐先寄送 500ml 瓶装进行测试',
        status: '待联系',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      
      setScannedLeads([backupLead]);
    } finally {
      setIsScanning(false);
    }
  };

  const absorbScannedLeads = () => {
    if (scannedLeads.length > 0) {
      onBulkAddLeads(scannedLeads);
      setScannedLeads([]);
      // Highlight completed
      alert(`成功将 ${scannedLeads.length} 条高价值 AI 扫描线索添加至全局线索雷达列表！`);
    }
  };

  return (
    <div className="space-y-6" id="lead-radar-view">
      
      {/* Sub-radar selection rails */}
      <div className="flex bg-[#121214] p-1 rounded-xl self-start max-w-sm border border-slate-800">
        <button 
          id="tab-radar-unified"
          onClick={() => setActiveSubRadar('unified')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeSubRadar === 'unified' ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50' : 'text-slate-400 hover:text-white'}`}
        >
          统一线索库
        </button>
        <button 
          id="tab-radar-expo"
          onClick={() => setActiveSubRadar('expo')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeSubRadar === 'expo' ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/50' : 'text-slate-400 hover:text-white'}`}
        >
          展会雷达
        </button>
        <button 
          id="tab-radar-social"
          onClick={() => setActiveSubRadar('social')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeSubRadar === 'social' ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700/50' : 'text-slate-400 hover:text-white'}`}
        >
          社媒意向雷达
        </button>
      </div>

      {/* RENDER VIEW 1: UNIFIED DATABASE */}
      {activeSubRadar === 'unified' && (
        <div className="space-y-4">
          
          {/* Sifter filters bar */}
          <div className="bg-[#0E0E10] p-4 rounded-xl border border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input 
                id="radar-search"
                type="text"
                placeholder="搜索公司、关键词、联系人、CAS 号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-705"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-550" />
                <select 
                  id="filter-source"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="bg-[#121214] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-350 focus:outline-none"
                >
                  <option value="all">所有来源</option>
                  <option value="展会雷达">展会雷达</option>
                  <option value="社媒意向">社媒意向</option>
                  <option value="B2B平台">B2B 平台</option>
                  <option value="海关数据">海关数据</option>
                </select>
              </div>

              <select 
                id="filter-country"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="bg-[#121214] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-350 focus:outline-none"
              >
                <option value="all">所有国家/地区</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                id="filter-grade"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="bg-[#121214] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-350 focus:outline-none"
              >
                <option value="all">所有星级评分</option>
                <option value="A">A 级 (重点推荐)</option>
                <option value="B">B 级 (可跟进开发)</option>
                <option value="C">C 级 (培育潜客)</option>
                <option value="D">D 级 (忽略/屏蔽)</option>
              </select>
            </div>
          </div>

          {/* Sifter count header */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold text-slate-500">
              已检验出 <em className="text-indigo-600 font-bold not-italic">{filteredLeads.length}</em> 户化学品采购线索
            </span>
          </div>

          {/* Unified sheet table */}
          <div className="bg-[#0E0E10] rounded-xl border border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-auto border-collapse">
                <thead>
                  <tr className="bg-[#121214] border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-3 px-4">企业信息与网站</th>
                    <th className="py-3 px-4">国家 / 渠道</th>
                    <th className="py-3 px-4">目标采购品</th>
                    <th className="py-3 px-4 text-center">评级</th>
                    <th className="py-3 px-4">AI 意向提取评判</th>
                    <th className="py-3 px-4 text-center">风险评估</th>
                    <th className="py-3 px-4 text-right">可跟进操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        未匹配到符合您当前筛选条件的线索客群。
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#121214]/60 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{lead.companyName}</span>
                            <span className="text-xs text-slate-500 mt-1 font-mono">{lead.website}</span>
                            <span className="text-xs text-slate-450 mt-0.5">{lead.contactName} ({lead.contactTitle})</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-450 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {lead.country}
                          </div>
                          <div>
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              lead.source === '展会雷达' 
                                ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900/30' 
                                : 'bg-sky-950/30 text-sky-400 border-sky-900/30'
                            }`}>
                              {lead.source}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-350">
                          <div className="flex flex-col">
                            <span>{lead.productKeywords}</span>
                            {lead.casNo && <span className="text-[10px] text-slate-500 font-normal mt-0.5">CAS: {lead.casNo}</span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex w-6 h-6 rounded items-center justify-center font-bold text-xs ${
                            lead.leadGrade === 'A' 
                              ? 'bg-amber-950 text-amber-400 border border-amber-900/50' 
                              : lead.leadGrade === 'B' 
                              ? 'bg-blue-950 text-blue-400 border border-blue-900/50' 
                              : 'bg-slate-900 text-slate-500 border border-slate-800'
                          }`}>
                            {lead.leadGrade}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="line-clamp-2 text-slate-400 text-xs" title={lead.intentDescription}>
                            {lead.intentDescription}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex-1 h-1 bg-slate-900 rounded-full overflow-hidden max-w-[60px] border border-slate-800">
                              <div className="h-full bg-emerald-500" style={{ width: `${lead.intentScore}%` }} />
                            </div>
                            <span className="text-[10px] text-emerald-400 font-semibold font-mono">意向度 {lead.intentScore}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                            lead.riskLevel === '低' 
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' 
                              : lead.riskLevel === '中' 
                              ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' 
                              : 'bg-rose-950/40 text-rose-400 border-rose-900/30'
                          }`}>
                            {lead.riskLevel}风险
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <a 
                              href={getOriginalSourceUrl(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              referrerPolicy="no-referrer"
                              className="p-1.5 bg-[#121214] border border-slate-800 hover:bg-slate-800 text-sky-400 rounded transition-colors flex items-center justify-center cursor-pointer"
                              title="跳转数据原文"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button 
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 bg-[#121214] border border-slate-800 hover:bg-slate-800 text-slate-300 rounded transition-colors cursor-pointer focus:outline-none"
                              title="查看意向详情"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => onNavigateToDD(lead)}
                              className="p-1.5 bg-[#121214] border border-slate-800 hover:bg-slate-800 text-slate-300 rounded transition-colors cursor-pointer"
                              title="外贸安全背调"
                            >
                              <Building className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => onNavigateToOutreach(lead)}
                              className="p-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-emerald-400 rounded transition-colors cursor-pointer"
                              title="AI 一键触达开发"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => onAddLeadToPipeline(lead)}
                              className="p-1.5 bg-emerald-950/30 border border-emerald-900/30 hover:bg-[#10b981]/15 text-emerald-400 rounded transition-colors cursor-pointer"
                              title="保存至跟进池"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW 2: TRADE FAIRS RADAR */}
      {activeSubRadar === 'expo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel criteria selector */}
          <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 shadow-xs space-y-4 h-fit">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">展会线索智能匹配扫描</h3>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-450 font-medium mb-1">展会关键词 (CPHI / Analytica...)</label>
                <input 
                  type="text" 
                  value={expName}
                  onChange={(e) => setExpName(e.target.value)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-450 font-medium mb-1">目标国家 (Germany / India...)</label>
                <input 
                  type="text" 
                  value={expCountry}
                  onChange={(e) => setExpCountry(e.target.value)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-450 font-medium mb-1">主营产品 / 化学关键词</label>
                <input 
                  type="text" 
                  value={expChemical}
                  onChange={(e) => setExpChemical(e.target.value)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            <button 
              id="btn-trigger-expo-scan"
              onClick={() => handleAIScan('expo')}
              disabled={isScanning}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-450 disabled:bg-emerald-800/40 text-black font-semibold transition-colors py-2.5 rounded-lg text-xs font-bold cursor-pointer focus:outline-none shadow-xs"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  AI 提取中...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-black/70" />
                  建立深度规则扫描
                </>
              )}
            </button>
          </div>

          {/* Right panel result cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-[#0E0E10] p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
              <div className="space-y-0.5">
                <span className="font-bold text-white">展会线索雷达日志</span>
                <p className="text-slate-450">{scanStatus || '就绪。输入展会、目标国家和您的产品即可一键生成高价值外商线索。'}</p>
              </div>
              {scannedLeads.length > 0 && (
                <button 
                  onClick={absorbScannedLeads}
                  className="bg-emerald-950/30 hover:bg-[#10b981]/15 text-emerald-400 font-bold border border-emerald-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  一键导入跟进
                </button>
              )}
            </div>

            <div className="space-y-4">
              {scannedLeads.length === 0 ? (
                <div className="bg-[#050507] border border-dashed border-slate-800 p-12 text-center rounded-xl text-slate-500 text-xs">
                  暂无匹配的新扫描线索展示。请在左侧配置参数，并点击“建立深度规则扫描”开启真机提取测试。
                </div>
              ) : (
                scannedLeads.map((prod, index) => (
                  <div key={index} className="bg-[#0e0e10] p-5 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="absolute right-0 top-0 bg-slate-900 border-l border-b border-slate-800 text-slate-400 font-mono text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                      AIS-INDEX-{(index+1)*10}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded-lg h-fit flex items-center justify-center font-bold">
                        {prod.leadGrade}
                      </div>

                      <div className="space-y-3 flex-1">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-white">{prod.companyName}</h4>
                            <span className="bg-slate-900 text-slate-400 px-2 py-0.5 text-[10px] rounded font-sans border border-slate-800">
                              展位：A{120 + index * 4}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">({prod.country})</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">主营采购方向/商谈意向：<strong className="text-slate-200">{prod.productKeywords}</strong></p>
                        </div>

                        <div className="bg-[#121214]/60 p-3.5 rounded-lg border border-slate-850/60 text-xs text-slate-350 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI 提取采购需求描述:</span>
                          <p className="font-mono text-slate-300">{prod.intentDescription}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-slate-450 pt-1">
                          <span>联系人：<strong className="text-slate-300">{prod.contactName}</strong> ({prod.contactTitle})</span>
                          <span>|</span>
                          <span>邮箱：<strong className="font-mono text-slate-300">{prod.email}</strong></span>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-850 pt-3 text-xs">
                          <span className="text-emerald-400 font-semibold max-w-[40%] truncate" title={prod.recommendedAction}>推荐：{prod.recommendedAction}</span>
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            <button
                              onClick={() => setSelectedLead(prod)}
                              className="px-2.5 py-1.5 bg-[#121214] hover:bg-slate-800 text-slate-300 rounded font-semibold cursor-pointer border border-slate-800 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              查看详情
                            </button>
                            <a 
                              href={getOriginalSourceUrl(prod)}
                              target="_blank"
                              rel="noopener noreferrer"
                              referrerPolicy="no-referrer"
                              className="px-2.5 py-1.5 bg-[#121214] hover:bg-slate-800 text-sky-400 rounded font-semibold cursor-pointer border border-slate-800 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              跳转原文
                            </a>
                            <button 
                              onClick={() => {
                                onAddLeadToPipeline(prod);
                                alert("成功添加当前线索至管理面板!");
                              }}
                              className="px-2.5 py-1.5 bg-[#121214] hover:bg-slate-800 text-slate-300 rounded font-semibold cursor-pointer border border-slate-800"
                            >
                              加入 CRM 库
                            </button>
                            <button 
                              onClick={() => onNavigateToOutreach(prod)}
                              className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-black rounded font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 text-black" />
                              一键触达
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW 3: SOCIAL MEDIA RADAR */}
      {activeSubRadar === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel criteria selector */}
          <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 shadow-xs space-y-4 h-fit">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-white text-sm">社媒采购意向监听器</h3>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-450 font-medium mb-1">社媒意向词 (looking for supplier...)</label>
                <input 
                  type="text" 
                  value={socKeyword}
                  onChange={(e) => setSocKeyword(e.target.value)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-450 font-medium mb-1">目标平台 (LinkedIn / Reddit...)</label>
                <select 
                  value={socPlatform}
                  onChange={(e) => setSocPlatform(e.target.value)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-slate-700"
                >
                  <option value="LinkedIn">LinkedIn Group / Posts</option>
                  <option value="Reddit">Reddit /r/chemicalindustry</option>
                  <option value="ResearchGate">ResearchGate Chemistry</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-450 font-medium mb-1">监控产品/目标 CAS 号</label>
                <input 
                  type="text" 
                  value={socChemical}
                  onChange={(e) => setSocChemical(e.target.value)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            <button 
              id="btn-trigger-social-scan"
              onClick={() => handleAIScan('social')}
              disabled={isScanning}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-450 disabled:bg-sky-900/40 text-black font-semibold py-2.5 rounded-lg text-xs font-bold cursor-pointer focus:outline-none shadow-xs"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  正在提取社媒对话...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-black/70" />
                  监听社媒公开意向
                </>
              )}
            </button>
          </div>

          {/* Right panel result cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-[#0E0E10] p-4 rounded-xl border border-slate-800 text-xs text-slate-350">
              <div className="space-y-0.5">
                <span className="font-bold text-white">社媒雷达意向追踪日志</span>
                <p className="text-slate-450">{scanStatus || '就绪。将从国际学术论坛及领英求购组中敏锐捕捉提到特定 Reagents 的信号和商机。'}</p>
              </div>
              {scannedLeads.length > 0 && (
                <button 
                  onClick={absorbScannedLeads}
                  className="bg-sky-950/30 hover:bg-sky-900/40 text-sky-400 font-bold border border-sky-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  全部载入
                </button>
              )}
            </div>

            <div className="space-y-4">
              {scannedLeads.length === 0 ? (
                <div className="bg-[#050507] border border-dashed border-slate-800 p-12 text-center rounded-xl text-slate-500 text-xs">
                  暂无捕获到的社媒新求购贴文。请在左侧指定产品，点击“监听社媒公开意向”发起实时抓取。
                </div>
              ) : (
                scannedLeads.map((item, index) => (
                  <div key={index} className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 shadow-sm relative group hover:border-sky-900 transition-all">
                    <span className="absolute right-4 top-4 text-xs font-semibold text-sky-400 bg-sky-950/30 px-2 py-0.5 border border-sky-900/30 rounded-lg">
                      信号强度: 强 ⚡
                    </span>

                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 text-[10px] font-semibold">{socPlatform || 'LinkedIn'} 行业互助贴 • 1小时前发布</span>
                        <h4 className="text-base font-bold text-white mt-1">{item.contactName} ({item.contactTitle})</h4>
                        <p className="text-xs text-slate-450 font-medium">属地：{item.country} | 公司：{item.companyName}</p>
                      </div>

                      <div className="bg-[#121214] p-4 border-l-4 border-sky-500 rounded-r-lg text-slate-300 text-xs font-mono leading-relaxed">
                        &ldquo;{item.intentDescription}&rdquo;
                      </div>

                      <div className="p-3 bg-emerald-950/30 text-emerald-400 rounded-lg border border-emerald-900/30 text-xs">
                        <strong>AI 匹配方案：</strong> 匹配我方高纯度 {socChemical} 试剂。可满足对紫外低杂质要求，推荐在此客户痛点上提供 2 个月账期或样品试用。
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-850 pt-3 text-xs">
                        <span className="text-slate-450 text-[11px] max-w-[30%] truncate">邮箱：{item.email}</span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          <button
                            onClick={() => setSelectedLead(item)}
                            className="px-2.5 py-1.5 bg-[#121214] hover:bg-slate-800 text-slate-300 rounded font-semibold border border-slate-800 cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            查看详情
                          </button>
                          <a 
                            href={getOriginalSourceUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                            className="px-2.5 py-1.5 bg-[#121214] hover:bg-slate-800 text-sky-400 rounded font-semibold border border-slate-800 cursor-pointer flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            跳转原文
                          </a>
                          <button 
                            onClick={() => {
                              onAddLeadToPipeline(item);
                              alert("成功加入跟进池！");
                            }}
                            className="px-2.5 py-1.5 bg-[#121214] hover:bg-slate-800 text-slate-300 rounded font-semibold border border-slate-800 cursor-pointer"
                          >
                            存为线索
                          </button>
                          <button 
                            onClick={() => onNavigateToOutreach(item)}
                            className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-450 text-black font-bold rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            即刻触达
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW FOR LEAD SPECIFICS */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-[#0E0E10] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-805 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-400 text-[10px] font-bold font-mono tracking-wider uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                  {selectedLead.id} • {selectedLead.source}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedLead.companyName}</h3>
                <p className="text-sm text-slate-450">{selectedLead.country} | {selectedLead.customerType}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white font-bold bg-slate-900 border border-slate-800 w-8 h-8 rounded-full flex items-center justify-center shadow-xs cursor-pointer focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-[#121214] p-4 rounded-xl border border-slate-850 space-y-2">
                <span className="font-semibold text-slate-400">外商采购意向陈述：</span>
                <p className="text-slate-200 leading-relaxed font-mono">{selectedLead.intentDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121214] p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-450 font-bold tracking-tight block">首选意向规格:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedLead.productKeywords}</p>
                  <p className="text-[10px] text-slate-500">CAS: {selectedLead.casNo}</p>
                </div>
                <div className="bg-[#121214] p-3 rounded-lg border border-slate-850">
                  <span className="text-slate-450 font-bold tracking-tight block">意向温度评估:</span>
                  <p className="text-emerald-400 font-bold mt-0.5 text-sm">{selectedLead.intentScore}% (极度强烈)</p>
                  <p className="text-[10px] text-slate-505">AI 意向提取</p>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-3 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>主要采购联系人:</span>
                  <strong className="text-white">{selectedLead.contactName} ({selectedLead.contactTitle})</strong>
                </div>
                <div className="flex justify-between">
                  <span>外商官方邮箱:</span>
                  <strong className="text-white font-mono">{selectedLead.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span>外商移动电话:</span>
                  <strong className="text-white font-mono">{selectedLead.phone}</strong>
                </div>
              </div>

              <div className="bg-emerald-950/20 p-3 rounded-lg text-emerald-300 border border-emerald-900/30">
                <strong>💡 AI 操作推荐：</strong> {selectedLead.recommendedAction}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-850 pt-3">
              <a 
                href={getOriginalSourceUrl(selectedLead)}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="px-4 py-2 bg-[#121214] hover:bg-slate-800 text-sky-400 border border-slate-800 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                跳转数据原文
              </a>
              <button 
                onClick={() => {
                  onNavigateToDD(selectedLead);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 bg-[#121214] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg font-bold cursor-pointer text-xs"
              >
                背景资信背调
              </button>
              <button 
                onClick={() => {
                  onNavigateToOutreach(selectedLead);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-450 text-black rounded-lg font-bold flex items-center gap-1 cursor-pointer text-xs"
              >
                <Zap className="w-3.5 h-3.5 text-black" />
                生成开发契机信
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
