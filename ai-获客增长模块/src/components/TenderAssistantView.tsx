/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tender } from '../types';
import { 
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Sparkles,
  Award,
  BookOpen,
  FileText,
  Percent,
  Plus,
  RefreshCw,
  CheckSquare
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
  // Bidding Search Criteria Inputs
  const [productName, setProductName] = useState('乙腈 HPLC色谱级');
  const [casNo, setCasNo] = useState('75-05-8');
  const [region, setRegion] = useState('广东省');
  const [budget, setBudget] = useState('¥500,000');
  const [specification, setSpecification] = useState('HPLC纯度≥99.9%');

  // Loading/AI states
  const [isSearching, setIsSearching] = useState(false);
  const [apiLog, setApiLog] = useState('');
  const [scannedTenders, setScannedTenders] = useState<Tender[]>([]);

  // Local table search limiters
  const [localSearch, setLocalSearch] = useState('');

  // Selected Tender for deep AI side panel inspection
  const [activeTender, setActiveTender] = useState<Tender | null>(tenders[0] || null);

  // Filter local tenders
  const searchedTenders = tenders.filter(t => 
    t.title.toLowerCase().includes(localSearch.toLowerCase()) ||
    t.buyerName.toLowerCase().includes(localSearch.toLowerCase()) ||
    t.productName.toLowerCase().includes(localSearch.toLowerCase())
  );

  // Fire live Tender search algorithm matching full stack API
  const handleTenderScan = async () => {
    setIsSearching(true);
    setScannedTenders([]);
    setApiLog('正在建立与省级政府采购公共源数据映射...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setApiLog(`正在调度 AI 色谱参数筛选器，查找关键词 "${productName}" - 属地 ${region} 相关的采购标的...`);

      const res = await fetch('/api/ai/analyze-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, casNo, region, budget })
      });

      if (!res.ok) {
        throw new Error('API server returned error code ' + res.status);
      }

      const data = await res.json();
      setApiLog(`检索成功！AI 已过滤解析出 ${data.tenders.length} 个高相关性国内正在公示招投标课题项目。`);
      setScannedTenders(data.tenders);

      // Auto-set the first scanned tender to active for illustration
      if (data.tenders.length > 0) {
        setActiveTender(data.tenders[0]);
      }

    } catch (err: any) {
      console.error(err);
      setApiLog(`AI 招标引擎暂时失效，开启本地危化试剂模拟招标池...`);
      
      const backupTender: Tender = {
        id: `T-BACK-${Math.floor(Math.random() * 9000)}`,
        title: `${region}生化重点实验室2026年度溶剂与分析试剂（乙腈、高效甲醇、高纯水）长期指定供应商选定协议`,
        buyerName: `${region}化学研究所重点科学中心`,
        region: region,
        publishDate: new Date().toISOString().substring(0, 10),
        deadline: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
        budget: budget.includes("¥") ? budget : `¥${budget}`,
        productName: productName,
        casNo: casNo,
        specification: specification,
        contactName: '梁主管',
        contactPhone: '0755-22831201',
        tenderUrl: 'https://zfcg.mock.gov.cn/spec',
        matchScore: 91,
        difficulty: '中',
        winProbability: 80,
        requiredDocs: [
          '危险化学品经营许可证/存储安防资质',
          '色谱纯度不低于 99.95% 的 COA 谱图对比报告',
          '本地服务1小时加急极速配送说明函',
          '原厂售后品质联合保障声明书'
        ],
        recommendedAction: '我司主推乙腈在环保、药理检测机构复购率极佳，资质100%覆盖。此次建议直接介入跟进。',
        status: '待跟进',
        createdAt: new Date().toISOString()
      };
      setScannedTenders([backupTender]);
      setActiveTender(backupTender);
    } finally {
      setIsSearching(false);
    }
  };

  const absorbNewTenders = () => {
    if (scannedTenders.length === 0) return;
    onBulkAddTenders(scannedTenders);
    setScannedTenders([]);
    alert('成功载入所有的 AI 新招标项至跟进面板！');
  };

  return (
    <div className="space-y-6" id="tender-assistant-view">
      
      {/* Intro section */}
      <div className="bg-[#121214] p-5 rounded-xl border border-slate-805">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          内贸公共采购与重点招投标商机雷达
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl font-sans">
          针对危险品、化学制剂、实验室耗材资质审核繁重、多属地散点招标寻找麻烦的痛点。
          该板块可通过 AI 模型解析近 30 天发布的公开学术及科研院所招标书，核算匹配难度，提供我司产品参数契合度分析。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left col: scanning filter & search (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
              抓取检索设置 (Chinese Tender Search)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-450 font-semibold mb-1">采购产品及目标别称</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="如: 色谱级乙腈、高纯甲醇"
                  className="w-full bg-[#121214] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-slate-700 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-450 font-semibold mb-1">CAS 登记号</label>
                  <input 
                    type="text" 
                    value={casNo}
                    onChange={(e) => setCasNo(e.target.value)}
                    placeholder="如: 75-05-8"
                    className="w-full bg-[#121214] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-450 font-semibold mb-1">规格/对照纯度</label>
                  <input 
                    type="text" 
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
                    placeholder="如: HPLC级"
                    className="w-full bg-[#121214] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-slate-700 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-450 font-semibold mb-1">目标省市/区域</label>
                  <input 
                    type="text" 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="如: 广东省"
                    className="w-full bg-[#121214] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-slate-700 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-450 font-semibold mb-1">预估招标预算</label>
                  <input 
                    type="text" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="不限, 或50万"
                    className="w-full bg-[#121214] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>

            <button 
              id="tender-scanhit-btn"
              onClick={handleTenderScan}
              disabled={isSearching}
              className="w-full flex items-center justify-center gap-2 bg-[#10b981] text-black hover:bg-emerald-450 disabled:bg-emerald-950/40 disabled:text-slate-500 transition-colors py-2.5 rounded-lg text-xs font-bold cursor-pointer font-sans"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  大数据抓取分析中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-black" />
                  扫描国内科研招投标项目
                </>
              )}
            </button>
          </div>

          <div className="bg-[#121214] text-slate-300 p-5 rounded-xl border border-slate-800 shadow-md text-xs space-y-3">
            <h4 className="font-bold flex items-center gap-1.5 text-emerald-400 font-sans">
              <Award className="w-4 h-4" />
              国内药企及高校投标小贴士
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans">
              内贸投标对<strong>危险化学品安全准入证明</strong>、产品批次 <strong>COA 色谱溯源纯度谱图</strong> 要求极高。
              若预算金额低于100万，通过我司已报备的高校经销商渠道借壳联合竞评，能极大规避异地清关及安防验收门槛。
            </p>
          </div>
        </div>

        {/* Center col: Tenders spreadsheet & logs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0E0E10] rounded-xl border border-slate-800 shadow-xs overflow-hidden">
            
            {/* Log monitoring stream */}
            <div className="bg-[#121214] text-slate-300 p-3.5 font-mono text-[10px] space-y-1 select-none border-b border-slate-850">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-bold">● AI 招投标实时雷达监控日志:</span>
              </div>
              <p className="text-slate-400 line-clamp-1">{apiLog || "正在监视省级政府采购、高校实验室基建、医疗对照采购平台更新..."}</p>
            </div>

            {/* Sub-header: scanned results import bar */}
            {scannedTenders.length > 0 && (
              <div className="bg-amber-950/40 p-3 flex justify-between items-center text-xs border-b border-amber-900/20 text-amber-300">
                <span>AI 成功发现 <strong>{scannedTenders.length}</strong> 宗高匹配的新招标项目！</span>
                <button 
                  onClick={absorbNewTenders}
                  className="bg-[#121214] hover:bg-slate-800 text-amber-400 font-bold border border-slate-800 px-2.5 py-1 rounded-md transition-all cursor-pointer focus:outline-none"
                >
                  一键同步入库
                </button>
              </div>
            )}

            <div className="p-4 border-b border-slate-800 flex items-center">
              <input 
                type="text" 
                placeholder="在此快速搜索已公示招标标书..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none font-sans"
              />
            </div>

            <div className="divide-y divide-slate-850 max-h-[480px] overflow-y-auto">
              {searchedTenders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  暂未找到符合该过滤条件的国内招投标单项。
                </div>
              ) : (
                searchedTenders.map((tender) => (
                  <div 
                    key={tender.id}
                    onClick={() => setActiveTender(tender)}
                    className={`p-4 transition-all duration-150 cursor-pointer text-xs space-y-2 select-none border-l-4 ${
                      activeTender?.id === tender.id 
                        ? 'bg-[#121214] border-[#10b981]' 
                        : 'border-transparent hover:bg-[#121214]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-bold text-white text-[13px] line-clamp-2 leading-tight flex-1">
                        {tender.title}
                      </h4>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        tender.difficulty === '易' 
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                          : tender.difficulty === '中'
                          ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30'
                          : 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                      }`}>
                        难度:{tender.difficulty}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[150px]">{tender.buyerName}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono font-semibold text-slate-300">
                        <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                        {tender.budget}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        截止：{tender.deadline}
                      </div>
                      <span className="text-emerald-400 font-bold bg-[#121214] px-1.5 py-0.5 rounded border border-slate-800">
                        匹配度 {tender.matchScore}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right col: Tender analysis and checklist (3 cols) */}
        <div className="lg:col-span-3">
          {activeTender ? (
            <div className="bg-[#0E0E10] p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
              
              {/* Analysis Header */}
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-900/30 font-sans">
                  AI 智能预测看板 (TENDER COGNITION)
                </span>
                <h4 className="text-base font-bold text-white mt-2 line-clamp-2 leading-tight">
                  {activeTender.title}
                </h4>
              </div>

              {/* Math stats rows */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/30 text-xs text-slate-300">
                  <span className="text-[10px] text-emerald-400 font-medium block">预计中标概率</span>
                  <div className="flex items-center justify-center gap-0.5 text-emerald-400 font-sans font-black text-lg mt-0.5">
                    <Percent className="w-4 h-4 text-emerald-400" />
                    {activeTender.winProbability}%
                  </div>
                </div>

                <div className="bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/30 text-xs text-slate-300">
                  <span className="text-[10px] text-indigo-400 font-medium block">产品规格匹配度</span>
                  <div className="text-indigo-400 font-sans font-black text-lg mt-0.5">
                    {activeTender.matchScore}%
                  </div>
                </div>
              </div>

              {/* Tender Specs */}
              <div className="text-xs space-y-2 bg-[#121214] p-3 rounded-lg border border-slate-850">
                <div className="flex justify-between">
                  <span className="text-slate-450 font-sans">采购产品范围:</span>
                  <strong className="text-white font-semibold">{activeTender.productName}</strong>
                </div>
                {activeTender.casNo && (
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-sans">对应 CAS 号:</span>
                    <strong className="text-white font-mono font-semibold">{activeTender.casNo}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-450 font-sans">纯度规格标准:</span>
                  <strong className="text-white leading-tight text-right w-1/2 block">{activeTender.specification}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 font-sans">官方招标联系人:</span>
                  <strong className="text-white font-mono font-semibold">{activeTender.contactName} ({activeTender.contactPhone})</strong>
                </div>
              </div>

              {/* Bidding advisory checklists */}
              <div className="space-y-2.5 text-xs">
                <span className="font-bold text-white flex items-center gap-1 font-sans">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  投标文件必备资料清单
                </span>
                <ul className="space-y-1.5">
                  {(activeTender.requiredDocs || []).map((doc, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-slate-300 leading-relaxed font-sans">
                      <span className="w-4 h-4 bg-slate-900 text-[10px] font-bold text-slate-400 flex items-center justify-center rounded-sm mt-0.5 border border-slate-800 font-mono">
                        {i + 1}
                      </span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Final AI advise & Save toCRM pipeline */}
              <div className="p-3 bg-[#121214] text-slate-300 font-sans rounded-lg border border-slate-800 text-[11px] leading-relaxed">
                <strong>💡 智能打标专家建议：</strong> {activeTender.recommendedAction}
              </div>

              <button 
                id="tender-crmsave-btn"
                onClick={() => {
                  onAddTenderToPipeline(activeTender);
                  alert(`成功将项目 "${activeTender.title.substring(0, 16)}..." 的投标流程安排保存至跟进模块！`);
                }}
                className="w-full flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-450 text-black transition-colors py-2 rounded-lg text-xs font-bold cursor-pointer font-sans"
              >
                <Plus className="w-4 h-4 text-black" />
                将此项目加入我的跟进池
              </button>

            </div>
          ) : (
            <div className="bg-[#0E0E10] p-6 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500 font-sans">
              请选择左侧任何招标项目，来展示深度的 AI 中标预核算。
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
