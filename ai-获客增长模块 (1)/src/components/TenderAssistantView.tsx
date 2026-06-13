/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tender, TenderDoc } from '../types';
import { 
  Building, MapPin, Calendar, DollarSign, Search, Sparkles, Award, BookOpen, 
  Plus, RefreshCw, CheckSquare, Clock, ExternalLink, ShieldAlert, Download, 
  Check, Building2, TrendingDown, Info, Filter, AlertTriangle
} from 'lucide-react';

interface TenderAssistantProps {
  tenders: Tender[];
  onAddTenderToPipeline: (tender: Tender) => void;
  onBulkAddTenders: (newTenders: Tender[]) => void;
}

export default function TenderAssistantView({ 
  tenders, 
  onAddTenderToPipeline,
  onBulkAddTenders 
}: TenderAssistantProps) {
  // Navigation tabs
  const [mainTab, setMainTab] = useState<'public' | 'university' | 'enterprise'>('public');
  const [selectedChannel, setSelectedChannel] = useState<string>('全部');
  
  // Compact filters
  const [casSearch, setCasSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [localSearch, setLocalSearch] = useState('');
  const [activeChip, setActiveChip] = useState<'deadline' | 'budget' | 'advantage' | 'local' | null>(null);

  // States
  const [isSearching, setIsSearching] = useState(false);
  const [apiLog, setApiLog] = useState('');
  const [scannedTenders, setScannedTenders] = useState<Tender[]>([]);
  const [activeTender, setActiveTender] = useState<Tender | null>(null);
  
  // Design control state
  const [outlineGenerating, setOutlineGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<{
    tenderTitle: string;
    sections: { title: string; bullets: string[] }[];
  } | null>(null);

  const getRemainingDays = (deadlineStr: string) => {
    try {
      const today = new Date('2026-06-09');
      const deadline = new Date(deadlineStr);
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 5;
    }
  };

  const getTenderMainTab = (channel: string): 'public' | 'university' | 'enterprise' => {
    const chan = channel || '';
    if (chan === '中国政府采购网' || chan === '各省公共资源平台' || chan === '中国公共采购网') return 'public';
    if (chan === '喀斯玛商城' || chan === '丁香通' || chan === '高校资产管理网') return 'university';
    if (chan === '中石化/化工巨巨头' || chan === '中石化/化工巨头' || chan === '上市药企供应链') return 'enterprise';
    return 'public';
  };

  const handleMainTabChange = (tab: 'public' | 'university' | 'enterprise') => {
    setMainTab(tab);
    setSelectedChannel('全部');
  };

  // Filter tenders
  const filteredTenders = tenders.filter(t => {
    if (getTenderMainTab(t.channel) !== mainTab) return false;
    if (selectedChannel !== '全部' && t.channel !== selectedChannel) return false;
    if (casSearch && !t.casNo.toLowerCase().includes(casSearch.toLowerCase())) return false;
    
    if (budgetFilter !== 'all') {
      const num = parseInt(t.budget.replace(/[^0-9]/g, '')) || 0;
      if (budgetFilter === 'under50' && num >= 500000) return false;
      if (budgetFilter === '50to100' && (num < 500000 || num > 1000000)) return false;
      if (budgetFilter === 'over100' && num <= 1000000) return false;
    }

    if (localSearch) {
      const query = localSearch.toLowerCase();
      if (!t.title.toLowerCase().includes(query) && 
          !t.buyerName.toLowerCase().includes(query) && 
          !t.productName.toLowerCase().includes(query)) return false;
    }

    if (activeChip === 'deadline') {
      const days = getRemainingDays(t.deadline);
      return days >= 0 && days <= 12;
    }
    if (activeChip === 'budget') {
      const num = parseInt(t.budget.replace(/[^0-9]/g, '')) || 0;
      return num >= 1000000;
    }
    if (activeChip === 'advantage') {
      return t.productName.includes('乙腈') || t.productName.includes('甲醇') || t.productName.includes('对乙酰氨基酚');
    }
    if (activeChip === 'local') {
      return ['广东省', '浙江省', '上海市', '北京市'].includes(t.region);
    }

    return true;
  });

  // Keep first item of filtered list selected
  useEffect(() => {
    if (filteredTenders.length > 0) {
      if (!activeTender || !filteredTenders.some(t => t.id === activeTender.id)) {
        setActiveTender(filteredTenders[0]);
      }
    } else {
      setActiveTender(null);
    }
  }, [mainTab, selectedChannel, casSearch, budgetFilter, localSearch, activeChip]);

  const handleTenderScan = async () => {
    setIsSearching(true);
    setApiLog('正在建立与省级政府采购及喀斯玛集采网数据映射...');
    try {
      await new Promise(r => setTimeout(r, 600));
      setApiLog(`正在调度 AI 筛选器分析以匹配 ${casSearch || '高纯化学品'} ${localSearch}...`);
      
      const backupTender: Tender = {
        id: `T-BACK-${Math.floor(Math.random() * 9000)}`,
        title: `${localSearch || '化学研究所'}2026年质谱色谱高纯试剂指定年度框架供给比选招标`,
        buyerName: `${localSearch || '华东化学工程中心'}`,
        region: '广东省',
        publishDate: '2026-06-09',
        deadline: '2026-06-25',
        budget: '¥680,000',
        productName: '质谱级乙腈 / 高纯色谱甲醇',
        casNo: casSearch || '75-05-8',
        specification: '纯度指标 ≥99.98% 瓶装 4L',
        contactName: '梁处长',
        contactPhone: '020-62788812',
        tenderUrl: 'https://www.ccgp.gov.cn/specTender',
        matchScore: 94,
        difficulty: '中',
        winProbability: 82,
        requiredDocs: [
          { name: '危险化学品经营许可证 (品目覆盖乙腈/甲醇)', type: 'critical' },
          { name: '投标企业注册资金不低于500万整', type: 'critical' },
          { name: '原厂 HPLC 高残留比分析证书 (COA频谱图)', type: 'critical' },
          { name: '同类高校/检测研究院所10吨级合作绩效合同', type: 'bonus' }
        ],
        recommendedAction: '我司自主品牌高纯溶剂指标完全覆盖，喀斯玛库内在籍保障，价格竞争力高达35％。建议直入。',
        status: '待跟进',
        createdAt: '2026-06-09 12:00:00',
        timeline: {
          publishDate: '2026-06-09',
          buyBookDeadline: '2026-06-16',
          submitDeadline: '2026-06-25',
          openBidTime: '2026-06-25',
        },
        incumbentSupplier: '常州国药精细化学试剂厂 (国药试剂)',
        historicalPrice: '¥710,000 / 年',
        channel: mainTab === 'public' ? '中国政府采购网' : mainTab === 'university' ? '喀斯玛商城' : '上市药企供应链',
        qualifications: [
          { type: 'red', text: '必须具备危险化学品经营许可证，经营范围对应 CAS 目录' },
          { type: 'red', text: '投标商注册商户规模需不低于500万人民币' },
          { type: 'green', text: '提供质谱级产品质理化COA色谱图（纯度高于99.98%）' },
          { type: 'green', text: '提供原厂授权保障资质或许可销售质保书' }
        ],
        estimatedBottomPrice: '¥620,000'
      };
      setScannedTenders([backupTender]);
      setActiveTender(backupTender);
      setApiLog('AI 扫描成功，已拟合最适配的一单追加招采项！');
    } catch {
      setApiLog('AI 招标信息通道临时熔断，请在本地数据库检索。');
    } finally {
      setIsSearching(false);
    }
  };

  const absorbNewTenders = () => {
    if (scannedTenders.length === 0) return;
    onBulkAddTenders(scannedTenders);
    setScannedTenders([]);
    alert('已成功将 AI 扫描推荐的数据融入系统跟进池中！');
  };

  const handleGenerateOutline = () => {
    if (!activeTender) return;
    setOutlineGenerating(true);
    setTimeout(() => {
      let docTitle = activeTender.productName;
      setGeneratedOutline({
        tenderTitle: activeTender.title,
        sections: [
          {
            title: "一、《企业法入商务偏离及应标资格响应表》",
            bullets: [
              `【危险品执业标准】: 具备有效的危化品经营许可证，完全范围复盖核心 CAS: ${activeTender.casNo}，无经营风险反应。`,
              "【企业信用与资信证书】: 附加本年税务局出具的信用A级档案及银行出具无连带责任资信书审查件。",
              "【同类学术业绩履约卷】: 针对性合并装配三家以上国内三甲医疗实验室及省级以上检验所大额供货合同副本。"
            ]
          },
          {
            title: "二、《核心技术指标响应及高阶正偏离报告》",
            bullets: [
              `【核心纯度等级响应值】: 标讯红线要求纯度 ≥99.9%。我司原厂高洁净提纯可达 ≥99.98% 质谱级，构成【质量指标重大正偏离】。`,
              "【额外吸光度控制保证】: 在200-240nm谱段提供出厂紫外透过指标，极大提升色谱精度，以极客数据牢牢锁定制标权。"
            ]
          },
          {
            title: "三、《特急配送保障与冷链应急售后承诺》",
            bullets: [
              "【气力防爆包装】: 出厂采用HPLC专用棕色防爆瓶辅以双层抗震固形格挡箱，确保高危物流全程万无一失。",
              "【1小时应急响应圈承诺】: 只要收到故障反馈，本省仓储质检总师1小时内携带备原样上门协助于实验室当场复核。"
            ]
          }
        ]
      });
      setOutlineGenerating(false);
    }, 1000);
  };

  const getAIDeductionAdvice = (tender: Tender) => {
    if (tender.id === 'T-001') {
      return "该医院历史三年偏好常州国药的产品，对品质重现极苛刻。建议发掘我司大单直营30%毛利空间，将投标价压在¥81.25万元上下，以极致的质谱纯度形成绝对包夹。";
    }
    if (tender.id === 'T-004') {
      return "清华大学化学系对到货周期极其挑剔，泰坦科技常驻配送有区位优势。建议应标特意标明“北京冷链车组专车快线，到货＜24小时”，以应标速度拉开竞争身差。";
    }
    if (tender.id === 'T-007') {
      return "药明康德为CRO头部大厂，历来购买外资Honeywell的进样级溶剂。但我司自产乙腈能为其提供每年约30万元的长协费用节余。本次报价建议直攻底价¥312万元以打破高洋垄断。";
    }
    return `历史供货方为 ${tender.incumbentSupplier || '地方小微代理'}。建议本期竞标价瞄准【¥${tender.estimatedBottomPrice || '预算88折'}】，配合我司自主检测COA报告的技术正偏离打出攻势。`;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="tender-assistant-view">
      
      {outlineGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center shadow-xl max-w-sm space-y-4">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">正在进行 AI 投标规格比对建模...</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              比对纯度天花板、校准废标控制红线、自动生成特级正偏离底稿中...
            </p>
          </div>
        </div>
      )}

      {/* Intro section */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-sans font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            招投标雷达与控标拼装中心
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl font-sans">
            对齐顶层线索雷达，自动扫描政府公采、喀斯玛高校集采、药企长协。自动剖析资质排雷项，进行竞对价格历史解算，一键拼装出符合化学行业极高指标的技术规格正偏离底稿。
          </p>
        </div>
        
        <button 
          onClick={handleTenderScan}
          disabled={isSearching}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer font-sans shadow-sm"
        >
          {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" /> : <Search className="w-3.5 h-3.5 text-white" />}
          AI 搜索全网化学招采标讯
        </button>
      </div>

      {/* Step 2: Multi-channel Matrix Navigation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
        {/* Level 1: Main Tabs */}
        <div className="grid grid-cols-3 gap-2 border-b border-slate-150 pb-3">
          {(['public', 'university', 'enterprise'] as const).map((tab) => {
            const labels = {
              public: { label: '【公共政采与医疗】', icon: <Building2 className="w-4 h-4" /> },
              university: { label: '【高校与科研集采】', icon: <Award className="w-4 h-4" /> },
              enterprise: { label: '【大厂与药企私域】', icon: <Building className="w-4 h-4" /> }
            };
            return (
              <button
                key={tab}
                onClick={() => handleMainTabChange(tab)}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  mainTab === tab
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-700'
                }`}
              >
                {labels[tab].icon}
                {labels[tab].label}
              </button>
            );
          })}
        </div>

        {/* Level 2: Channel Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> 渠道子目筛选:
          </span>
          {mainTab === 'public' && ['全部', '中国政府采购网', '各省公共资源平台'].map(chan => (
            <button
              key={chan}
              onClick={() => setSelectedChannel(chan)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                selectedChannel === chan ? 'bg-indigo-600 text-white font-extrabold border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-205 text-slate-600 hover:border-slate-350 hover:bg-slate-100'
              }`}
            >
              {chan}
            </button>
          ))}
          {mainTab === 'university' && ['全部', '喀斯玛商城', '丁香通', '高校资产管理网'].map(chan => (
            <button
              key={chan}
              onClick={() => setSelectedChannel(chan)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                selectedChannel === chan ? 'bg-indigo-600 text-white font-extrabold border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-205 text-slate-600 hover:border-slate-350 hover:bg-slate-100'
              }`}
            >
              {chan}
            </button>
          ))}
          {mainTab === 'enterprise' && ['全部', '中石化/化工巨头', '上市药企供应链'].map(chan => (
            <button
              key={chan}
              onClick={() => setSelectedChannel(chan)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                selectedChannel === chan ? 'bg-indigo-600 text-white font-extrabold border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-205 text-slate-600 hover:border-slate-350 hover:bg-slate-100'
              }`}
            >
              {chan}
            </button>
          ))}
        </div>

        {/* Chemical Filter bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-slate-450 text-[10px] font-bold uppercase mb-1 font-mono">🔍 检索化学品名称 / 采购标题</label>
            <input 
              type="text"
              placeholder="如：乙腈, 甲醇..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 text-slate-805 placeholder-slate-400 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-505"
            />
          </div>
          <div>
            <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1 font-mono">🧪 精确 CAS 绑定过滤</label>
            <input 
              type="text"
              placeholder="输入 CAS. 例如 75-05-8"
              value={casSearch}
              onChange={(e) => setCasSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 text-indigo-750 font-bold placeholder-slate-400 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-505 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1 font-mono">🪙 预算额度区间</label>
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 text-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-505"
            >
              <option value="all">显示全部预算</option>
              <option value="under50">小微采购 (&lt;50万)</option>
              <option value="50to100">中型标讯 (50万 - 100万)</option>
              <option value="over100">大型采购 (&gt;100万)</option>
            </select>
          </div>
          <div className="flex items-end gap-1.5">
            {['deadline', 'budget', 'advantage', 'local'].map((chip) => {
              const chipLabels = {
                deadline: '⏳ 紧迫标',
                budget: '💎 万级以上',
                advantage: '✨ 优势品类',
                local: '📍 华东属地'
              };
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(activeChip === chip ? null : (chip as any))}
                  className={`flex-1 py-2 text-[10px] font-extrabold rounded-lg border text-center transition-all cursor-pointer ${
                    activeChip === chip 
                      ? 'bg-amber-50 text-amber-705 border-amber-200 shadow-xs' 
                      : 'bg-slate-50 border-slate-205 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {chipLabels[chip as keyof typeof chipLabels]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {apiLog && (
        <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-xl text-center flex items-center justify-center gap-2 font-mono text-[11px] text-emerald-805 select-none shadow-xs">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>应标自动化通道排查日志：{apiLog}</span>
          {scannedTenders.length > 0 && (
            <button 
              onClick={absorbNewTenders}
              className="bg-[#d97706] hover:bg-[#b45309] text-white ml-4 py-1 px-3 rounded-lg font-bold text-xs cursor-pointer shadow-sm transition-colors"
            >
              一键合并此标讯
            </button>
          )}
        </div>
      )}

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step 3: High Density Tenders Card list (Left 7 Columns) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 px-1 select-none">
            <span>找到 {filteredTenders.length} 宗符合条件的活动标讯</span>
            <span>当前属地系统：UTC 2026/06</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredTenders.length === 0 ? (
              <div className="bg-slate-50 p-10 border border-dashed border-slate-250 text-slate-400 rounded-2xl text-center text-xs">
                当前渠道和化学品过滤条下，无满足活动标讯。请清除过滤或点击“AI搜索”新增推荐。
              </div>
            ) : (
              filteredTenders.map(t => {
                const days = getRemainingDays(t.deadline);
                const isUrgent = days <= 12;
                const isSelected = activeTender?.id === t.id;
                
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTender(t)}
                    className={`bg-white p-4.5 rounded-xl border transition-all cursor-pointer space-y-3.5 ${
                      isSelected 
                        ? 'border-indigo-505 ring-1 ring-indigo-505/20 shadow-md shadow-indigo-100' 
                        : 'border-slate-200 hover:border-slate-350 hover:shadow-xs'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-slate-100 text-slate-700 font-bold text-[9px] uppercase font-mono border border-slate-200 px-2 py-0.5 rounded">
                            {t.channel}
                          </span>
                          <span className="text-slate-500 text-[10.5px]">
                            {t.region} • {t.buyerName}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug font-sans mt-1">
                          {t.title}
                        </h4>
                      </div>

                      <span className={`inline-flex shrink-0 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isUrgent 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-amber-50 text-amber-705 border-amber-200'
                      }`}>
                        ⏳ 倒计 {days} 天
                      </span>
                    </div>

                    {/* Step 3 highlights: High density spec display */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono block">🎯 化学标的 / 对应 CAS号：</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-800 text-[12.5px]">{t.productName}</span>
                          <span className="font-mono text-[10px] text-emerald-705 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                            CAS {t.casNo}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1 border-l border-slate-200 pl-4">
                        <span className="text-[10px] text-slate-400 font-mono block">📋 测样规格标准：</span>
                        <span className="font-bold text-slate-600 block truncate leading-tight mt-0.5" title={t.specification}>
                          {t.specification}
                        </span>
                      </div>
                    </div>

                    {/* Step 3 highlights: Red/Green Traffic lights qualification badge */}
                    {t.qualifications && t.qualifications.length > 0 && (
                      <div className="space-y-1.5 select-none">
                        <span className="text-[10px] text-slate-450 font-mono uppercase tracking-widest block">AI 提取准入资质排雷红绿灯:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {t.qualifications.map((q, idx) => {
                            const isRed = q.type === 'red';
                            return (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-sans font-bold border transition-all ${
                                  isRed
                                    ? 'bg-rose-50 text-rose-705 border-rose-150'
                                    : 'bg-emerald-50 text-emerald-705 border-emerald-150'
                                }`}
                                title={q.text}
                              >
                                {isRed ? (
                                  <ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
                                ) : (
                                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                )}
                                <span className="font-sans shrink-0">{isRed ? '🔴 废标线: ' : '🟢 商务加分: '}</span>
                                <span className="truncate max-w-[125px]">{q.text}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer stats line */}
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-150">
                      <div className="flex items-center gap-4">
                        <span className="font-mono flex items-center gap-1 select-none">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" /> 预算评价：
                          <strong className="text-emerald-700 font-sans font-extrabold">{t.budget}</strong>
                        </span>
                        <span className="text-slate-400 select-none">
                          匹配率 <strong className="text-emerald-700">{t.matchScore}%</strong>
                        </span>
                      </div>
                      <span className="text-[10.5px] text-indigo-705 font-bold flex items-center gap-1 hover:underline">
                        选中核算情报 <Clock className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Step 4: AI Intelligence Consol / Right Panel (Right 5 Columns) */}
        <div className="lg:col-span-12 xl:col-span-5 text-slate-800">
          {activeTender ? (
            <div className="space-y-4">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 font-sans text-xs">
                
                {/* Header Section */}
                <div className="border-b border-slate-150 pb-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[9px] font-bold text-indigo-705 bg-indigo-50 px-2 rounded-full border border-indigo-150 font-mono tracking-wider uppercase">
                      AI CONTROL PANEL
                    </span>
                    <a 
                      href={activeTender.tenderUrl} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-0.5 hover:underline font-mono"
                    >
                      官方标讯原文
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <h4 className="text-[13px] font-bold text-slate-900 mt-2.5 leading-snug">
                    {activeTender.title}
                  </h4>
                  <p className="text-[10.5px] text-slate-450 mt-1 font-mono">
                    平台：{activeTender.channel} | 发布日期：{activeTender.publishDate}
                  </p>
                </div>

                {/* 区块A [标的与规格确认] */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block font-mono">
                    区块A：标的与规格判定
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed">
                    <div>
                      <span className="text-slate-450 block">目标买方：</span>
                      <strong className="text-slate-800 font-bold truncate block">{activeTender.buyerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-455 block">采购预算：</span>
                      <strong className="text-emerald-700 font-mono font-bold block">{activeTender.budget}</strong>
                    </div>
                    <div>
                      <span className="text-slate-455 block">化学组分 CAS：</span>
                      <strong className="text-emerald-705 font-mono block">CAS {activeTender.casNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-455 block">剩余倒计时：</span>
                      <strong className="text-rose-600 font-bold block">剩 {getRemainingDays(activeTender.deadline)} 天</strong>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-600">
                    <span className="text-slate-500">招标纯度/规格：</span>
                    <strong className="text-slate-800 ml-1 font-mono">{activeTender.specification}</strong>
                  </div>
                </div>

                {/* 区块B [AI 资质排雷系统] */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block font-mono">
                      区块B：AI 资质自审查排雷系统
                    </span>
                    <span className="text-[9px] font-mono text-emerald-700 font-bold">QUAL-CLEAR V2.0</span>
                  </div>

                  <div className="space-y-3">
                    {/* 🔴 Critical exclusion checks */}
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-bold text-rose-600 flex items-center gap-1">
                        🔴 废标硬性壁垒 (不符在初审阶段即废标)
                      </span>
                      <ul className="space-y-1 pl-2">
                        {activeTender.qualifications?.filter(q => q.type === 'red').map((q, qidx) => (
                          <li key={qidx} className="text-[11px] text-slate-650 flex items-start gap-1 leading-normal">
                            <span className="text-rose-500 font-bold mt-0.5">•</span>
                            <span>{q.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 🟢 Bonus additive parameters */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-1">
                        🟢 一般商务及技术加分项 (拉开关键身差)
                      </span>
                      <ul className="space-y-1 pl-2">
                        {activeTender.qualifications?.filter(q => q.type === 'green').map((q, qidx) => (
                          <li key={qidx} className="text-[11px] text-slate-655 flex items-start gap-1 leading-normal">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span>{q.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 区块C [AI 竞对与底价推演] */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2.5">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block font-mono">
                      区块C：AI 竞对推演与历史底价测算
                    </span>
                    <span className="text-[9px] font-mono text-amber-700 font-bold flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3 text-amber-600" /> COMPETITORS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-1 border-b border-slate-200 text-[11px]">
                    <div className="space-y-0.5">
                      <span className="text-slate-455 block font-mono">原供货商/历史中标方:</span>
                      <strong className="text-slate-800 block truncate" title={activeTender.incumbentSupplier}>
                        {activeTender.incumbentSupplier || '首单采购/尚无历史'}
                      </strong>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200 pl-3">
                      <span className="text-slate-455 block font-mono">推算历史成交底价:</span>
                      <strong className="text-amber-705 block font-mono font-bold">
                        {activeTender.estimatedBottomPrice || '尚未披露'}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <span className="text-emerald-705 font-bold font-sans flex items-center gap-1 select-none">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> AI 应标博弈论建议：
                    </span>
                    <p className="text-slate-500 leading-relaxed font-sans">
                      {getAIDeductionAdvice(activeTender)}
                    </p>
                  </div>
                </div>

                {/* Footer Action buttons */}
                <div className="pt-3 border-t border-slate-150 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onAddTenderToPipeline(activeTender);
                      alert(`已将【${activeTender.title.substring(0, 15)}...】移入我的跟进池中，正在同步客户跟进管道。`);
                    }}
                    className="w-full bg-slate-50 border border-slate-250 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    加入我的跟进池
                  </button>

                  <button
                    onClick={handleGenerateOutline}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    配离比对大纲
                  </button>
                </div>

              </div>

              {/* OUTLINE RESULTS PANEL */}
              {generatedOutline && (
                <div className="bg-emerald-50/70 border border-emerald-150 p-4 rounded-xl space-y-3.5 animate-fade-in text-xs relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 right-0 py-0.5 px-2 bg-emerald-650 text-white text-[8px] font-bold font-mono tracking-wider">
                    SUCCESS
                  </div>
                  
                  <div className="space-y-1 block">
                    <span className="text-[10px] font-bold text-emerald-705 uppercase tracking-widest block flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      已生成技术规格响应与偏离表(初稿)
                    </span>
                    <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                      已由 AI 自动解算出 【大货规格标准 100% 完全响应】及【大限正偏离申报书】
                    </p>
                  </div>

                  <div className="space-y-3 bg-white p-3 rounded-lg border border-emerald-200 max-h-[180px] overflow-y-auto font-sans shadow-xs">
                    {generatedOutline.sections.map((sect, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <h5 className="font-bold text-slate-800 text-[11px] flex items-center gap-1 border-b border-slate-100 pb-1">
                          {sect.title}
                        </h5>
                        <ul className="space-y-1 text-[10px] leading-relaxed text-slate-550 pl-2">
                          {sect.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="list-disc ml-2 text-slate-550">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        let text = generatedOutline.sections.map(s => s.title + "\n" + s.bullets.join("\n")).join("\n\n");
                        navigator.clipboard.writeText(text);
                        alert("已将该技术响应大纲复制至系统剪贴板！可直接粘贴于应标文件撰写。");
                      }}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-50 text-emerald-755 text-[10px] font-bold rounded-lg text-center cursor-pointer border border-emerald-250 transition-colors shadow-xs"
                    >
                      复制大纲文本
                    </button>
                    <button 
                      onClick={() => alert("开始转换为 Microsoft Word (.docx) 并在后台为您加密生成... 配备全部商务佐证，下载已自动开始。")}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg text-center cursor-pointer flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                    >
                      <Download className="w-3 h-3 text-white" />
                      导出应标大纲.Word
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-50 p-6 border border-dashed border-slate-205 rounded-xl text-center text-xs text-slate-400 font-sans">
              请选择左侧任何标讯，以在 AI 控制台进行硬性排除与底价反演。
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
