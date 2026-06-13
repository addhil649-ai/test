import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
  Play, 
  CheckCircle, 
  Server, 
  FileText, 
  Cpu, 
  Database,
  ArrowDown, 
  Clock, 
  Layers, 
  Settings, 
  Activity, 
  RefreshCw, 
  ChevronRight, 
  Flame, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { MOCK_PIPELINES } from '../mockData';
import { LeadPipeline, SpiderMethod } from '../types';

export function PipelineConfigView() {
  const [pipelines, setPipelines] = useState<LeadPipeline[]>(MOCK_PIPELINES);
  const [selectedId, setSelectedId] = useState<string>(MOCK_PIPELINES[0].id);
  
  // Find currently active editing pipeline
  const currentPipeline = pipelines.find(p => p.id === selectedId) || pipelines[0];

  // Forms state
  const [editedName, setEditedName] = useState(currentPipeline.name);
  const [editedSpider, setEditedSpider] = useState<SpiderMethod>(currentPipeline.spiderMethod);
  const [editedFrequency, setEditedFrequency] = useState(currentPipeline.frequency);
  const [editedPrompt, setEditedPrompt] = useState(currentPipeline.aiPrompt);
  const [editedStatus, setEditedStatus] = useState<'active' | 'paused'>(currentPipeline.status);

  // Synchronize when pipeline selection changes
  useEffect(() => {
    setEditedName(currentPipeline.name);
    setEditedSpider(currentPipeline.spiderMethod);
    setEditedFrequency(currentPipeline.frequency);
    setEditedPrompt(currentPipeline.aiPrompt);
    setEditedStatus(currentPipeline.status);
    
    // Reset simulation board when changing pipeline
    setSimState('idle');
    setSimLogs([]);
  }, [selectedId, currentPipeline]);

  // Simulation runner states
  // 'idle' | 'spidering' | 'raw_harvest' | 'ai_analyzing' | 'crm_routing' | 'done'
  const [simState, setSimState] = useState<string>('idle');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleSavePipeline = () => {
    setPipelines(prev => prev.map(p => {
      if (p.id === selectedId) {
        return {
          ...p,
          name: editedName,
          spiderMethod: editedSpider,
          frequency: editedFrequency,
          aiPrompt: editedPrompt,
          status: editedStatus
        };
      }
      return p;
    }));
    
    // Show a simple inline flash indicator (simulated logging)
    addLog(`⚙️ 管道 [${editedName}] 配置已保存并热加载更新成功。`);
  };

  const addLog = (msg: string) => {
    setSimLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runPipelineSimulation = () => {
    setSimState('spidering');
    setSimLogs([]);
    setProgress(15);
    
    addLog(`🚀 启动管道测试，目标：${editedName}`);
    addLog(`🔍 当前激活算子：${editedSpider} (调度频率: ${editedFrequency})`);

    // Step 1: Crawler Scheduler
    setTimeout(() => {
      setSimState('raw_harvest');
      setProgress(40);
      addLog(`📡 [调度器] 正常握手。正根据爬取规则抓取网络介质与资源...`);
      addLog(`📄 [原始池] 成功注入临时脏缓冲区。总计拉取 ${Math.floor(Math.random() * 800) + 200} 字节未处理文本块。`);
    }, 1200);

    // Step 2: Extracting raw text
    setTimeout(() => {
      setSimState('ai_analyzing');
      setProgress(70);
      addLog(`🧠 [解析芯片] 调取本地高级化学语言大模型服务...`);
      addLog(`🔍 [解析芯片] 正在依自定义 Prompt 处理数据：「${editedPrompt}」`);
    }, 2500);

    // Step 3: AI Json structured
    setTimeout(() => {
      setSimState('crm_routing');
      setProgress(90);
      addLog(`⚡ [大模型] 结构化成功！输出 valid_json.schema.`);
      addLog(`📂 [CRM微路由] 适配映射字段... 识别到高匹配CAS，正拟合生成高还原度真实周期线索。`);
    }, 4000);

    // Step 4: Done & Saved
    setTimeout(() => {
      setSimState('done');
      setProgress(100);
      addLog(`✅ [测试完毕] 管道清洗完成。成功存盘！1 个外贸意向客户已正式路由至 CRM 等待分配。`);
    }, 5200);
  };

  // Helper to get formatted parsed JSON object safely
  const getParsedJsonData = () => {
    try {
      return JSON.parse(currentPipeline.mockParsedJson);
    } catch {
      return {};
    }
  };

  const parsedData = getParsedJsonData();

  return (
    <div className="space-y-6" id="pipeline-configurator">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-blue-500/10 text-blue-400">
              <Workflow size={20} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">外销线索获取管道配置引擎</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            将互联网海量异构数据（环评报告、学术文献、注册公告、社媒求购）通过「定制爬虫 + AI语义清洗」流式洗净为标准的 CRM 采购意向案。
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto bg-[#1b1b22] px-3 py-1.5 rounded-lg border border-slate-800">
          <Activity size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">
            活动引擎管道：{pipelines.filter(p => p.status === 'active').length} 在线 / {pipelines.length} 个
          </span>
        </div>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Pipeline Config Workspace (33% width / col-span-4) */}
        <div className="lg:col-span-4 bg-[#121217] border border-slate-800 rounded-xl p-5 space-y-5" id="pipeline-form-pane">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase flex items-center gap-1.5">
              <Settings size={14} className="text-slate-400" />
              管道规则配置
            </h2>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/40 px-2 py-0.5 rounded-full">
              Workspace v1.2
            </span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400">行业数据管道场景</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-[#1b1b22] border border-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {pipelines.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status === 'active' ? '🟢 监控中' : '⚪ 已暂停'})
                </option>
              ))}
            </select>
          </div>

          <hr className="border-slate-800/60" />

          {/* Configuration Form */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-medium text-slate-400">管道名称</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full bg-[#1b1b22] border border-slate-800 text-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-medium text-slate-400">抓取调度算子</label>
                <select
                  value={editedSpider}
                  onChange={(e) => setEditedSpider(e.target.value as SpiderMethod)}
                  className="w-full bg-[#1b1b22] border border-slate-800 text-slate-200 rounded px-2.5 py-2 outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="API直连">🔌 API直连</option>
                  <option value="DOM爬虫">🕸️ DOM爬虫</option>
                  <option value="Headless动态渲染">🎭 Headless</option>
                  <option value="PDF文档批量解析">📄 PDF解析</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-slate-400">监测频率</label>
                <input
                  type="text"
                  value={editedFrequency}
                  onChange={(e) => setEditedFrequency(e.target.value)}
                  placeholder="如: 每小时"
                  className="w-full bg-[#1b1b22] border border-slate-800 text-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-slate-400">监控状态</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={editedStatus === 'active'}
                    onChange={() => setEditedStatus('active')}
                    className="accent-indigo-500"
                  />
                  <span>启动监控</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={editedStatus === 'paused'}
                    onChange={() => setEditedStatus('paused')}
                    className="accent-indigo-500"
                  />
                  <span>暂停</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-medium text-slate-400 flex items-center gap-1 text-[11px]">
                  <Sparkles size={11} className="text-amber-400 font-bold" />
                  AI 专属解析 Prompt 指令
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Gemini Ultra Engine</span>
              </div>
              <textarea
                rows={4}
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                placeholder="在此编写给 AI 化学大模型的特征清洗提示词..."
                className="w-full bg-[#1b1b22] border border-slate-800 text-slate-250 rounded p-2.5 outline-none focus:border-indigo-500 transition-all leading-relaxed font-mono resize-none text-[11px]"
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleSavePipeline}
                className="flex-1 bg-[#1d1d26] hover:bg-[#252531] border border-slate-700 text-slate-200 hover:text-white py-2 px-3 rounded text-xs font-medium transition-all"
              >
                💾 保存并发布配置
              </button>
            </div>
          </div>

          <hr className="border-slate-800/60" />

          {/* Execution Button */}
          <div className="pt-2">
            <button
              onClick={runPipelineSimulation}
              disabled={simState !== 'idle' && simState !== 'done'}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
                simState !== 'idle' && simState !== 'done'
                  ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 hover:translate-y-[-1px]'
              }`}
            >
              {simState !== 'idle' && simState !== 'done' ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>自动化管道演练中...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>▶ 运行管道模拟测试</span>
                </>
              )}
            </button>
          </div>

          {/* Mini active pipeline monitoring list */}
          <div className="bg-[#0b0b0e] p-3 rounded-lg border border-slate-800/80 space-y-2">
            <span className="text-[10px] tracking-wide font-semibold text-slate-500 block uppercase">
              管道实时状态总览
            </span>
            <div className="space-y-1.5 text-[11px]">
              {pipelines.map(p => (
                <div key={p.id} className="flex justify-between items-center text-slate-400">
                  <span className="truncate max-w-[150px] font-sans text-slate-300">{p.name}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[10px] text-slate-500 bg-[#16161c] px-1.5 py-0.5 rounded">
                      {p.spiderMethod}
                    </span>
                    {p.status === 'active' ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Active Sandbox Visual Board (67% width / col-span-8) */}
        <div className="lg:col-span-8 space-y-6" id="pipeline-sandbox-pane">
          
          {/* Top Panel: Execution Progress or Status */}
          <div className="bg-[#121217] border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
                  <Activity size={15} className="text-indigo-400" />
                  管道沙盘演练区 (Sandbox Sandbox Area)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  自动化运行测试以验证规则、抓取效、大模型映射情况和 CRM 数据归档契合度。
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">进度: {progress}%</span>
                <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Simulated Live Action Logs */}
            {simLogs.length > 0 && (
              <div className="mt-4 bg-[#08080a] border border-slate-900 rounded-lg p-3 max-h-[110px] overflow-y-auto font-mono text-[11px] text-emerald-400 leading-relaxed space-y-1">
                {simLogs.map((log, index) => (
                  <p key={index} className="opacity-90">{log}</p>
                ))}
              </div>
            )}
          </div>

          {/* Sequential 4-Step Pipeline Flow Nodes */}
          <div className="relative space-y-8 pl-4 sm:pl-8">
            
            {/* Visual connector centerline */}
            <div className="absolute top-4 bottom-4 left-6 sm:left-10 w-[2px] bg-slate-800" />

            {/* NODE 1: Crawler Scheduler */}
            <div 
              className={`relative bg-[#121217] border rounded-xl p-5 transition-all duration-500 ${
                simState === 'spidering' 
                  ? 'border-indigo-500 shadow-lg shadow-indigo-950/20 scale-[1.01]' 
                  : simState !== 'idle' 
                    ? 'border-emerald-950/60 opacity-95' 
                    : 'border-slate-800 opacity-60'
              }`}
            >
              {/* Left dot anchor */}
              <div className={`absolute top-6 -left-6 sm:-left-10 h-6 w-6 rounded-full border flex items-center justify-center transition-colors duration-500 ${
                simState === 'spidering'
                  ? 'bg-indigo-600 border-indigo-400 animate-pulse text-white'
                  : simState !== 'idle'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {simState !== 'idle' && simState !== 'spidering' ? (
                  <CheckCircle size={12} />
                ) : (
                  <span className="text-[10px] font-bold font-mono">1</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/55 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-slate-800 text-sky-400">
                    <Server size={14} />
                  </span>
                  <span className="text-xs font-bold text-slate-200">Node 1: 爬虫调度器 (Crawler Scheduler)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    算子: {editedSpider}
                  </span>
                  {simState === 'spidering' && (
                    <span className="text-[10px] text-indigo-400 font-mono animate-pulse flex items-center gap-1">
                      <RefreshCw size={10} className="animate-spin" /> 执行中...
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-400 font-sans">
                  已根据目标设定自动部署调度。模拟从特定渠道拉取元数据：
                </p>
                <div className="bg-[#0b0b0e] p-2.5 rounded border border-slate-900 font-mono text-[11px] text-slate-350 space-y-1">
                  <div>🌐 <span className="text-slate-500">Target Channel:</span> {currentPipeline.channelType}</div>
                  <div>📡 <span className="text-slate-500">Method Strategy:</span> {editedSpider}</div>
                  <div>⏰ <span className="text-slate-500">Crontab Trigger:</span> {editedFrequency} 密集循环</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    🚀 Status Code: <span className="text-emerald-500">200 Handshake OK</span> | Agent: ChemPipelineBot/1.4
                  </div>
                </div>
              </div>
            </div>

            {/* NODE 2: Raw Buffer Pool */}
            <div 
              className={`relative bg-[#121217] border rounded-xl p-5 transition-all duration-500 ${
                simState === 'raw_harvest' 
                  ? 'border-indigo-500 shadow-lg shadow-indigo-950/20 scale-[1.01]' 
                  : simState !== 'idle' && simState !== 'spidering'
                    ? 'border-emerald-950/60 opacity-95' 
                    : 'border-slate-800 opacity-50'
              }`}
            >
              {/* Left dot anchor */}
              <div className={`absolute top-6 -left-6 sm:-left-10 h-6 w-6 rounded-full border flex items-center justify-center transition-colors duration-500 ${
                simState === 'raw_harvest'
                  ? 'bg-indigo-600 border-indigo-400 animate-pulse text-white'
                  : simState !== 'idle' && simState !== 'spidering'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {simState !== 'idle' && simState !== 'spidering' && simState !== 'raw_harvest' ? (
                  <CheckCircle size={12} />
                ) : (
                  <span className="text-[10px] font-bold font-mono">2</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/55 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-slate-800 text-orange-400">
                    <FileText size={14} />
                  </span>
                  <span className="text-xs font-bold text-slate-200">Node 2: 原始异构缓冲区 (Raw Data Buffer Pool)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    未过滤杂乱原案
                  </span>
                  {simState === 'raw_harvest' && (
                    <span className="text-[10px] text-indigo-400 animate-pulse flex items-center gap-1 font-mono">
                      <RefreshCw size={10} className="animate-spin" /> 数据沉淀中...
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  这是抓取回来的非结构化数据片段 (含有行业特有噪音、排版标记或多余的冗余文本)：
                </p>
                <div className="bg-[#0b0b0e] border border-slate-900 rounded p-3 text-[11px] font-mono text-slate-400 leading-relaxed max-h-[140px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono select-all">
                    {currentPipeline.mockRawData}
                  </pre>
                </div>
              </div>
            </div>

            {/* NODE 3: AI Semantic Analyzer */}
            <div 
              className={`relative bg-[#121217] border rounded-xl p-5 transition-all duration-500 ${
                simState === 'ai_analyzing' 
                  ? 'border-indigo-500 shadow-lg shadow-indigo-950/20 scale-[1.01]' 
                  : simState === 'crm_routing' || simState === 'done'
                    ? 'border-emerald-950/60 opacity-95' 
                    : 'border-slate-800 opacity-40'
              }`}
            >
              {/* Left dot anchor */}
              <div className={`absolute top-6 -left-6 sm:-left-10 h-6 w-6 rounded-full border flex items-center justify-center transition-colors duration-500 ${
                simState === 'ai_analyzing'
                  ? 'bg-indigo-600 border-indigo-400 animate-pulse text-white'
                  : simState === 'crm_routing' || simState === 'done'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {simState === 'done' || simState === 'crm_routing' ? (
                  <CheckCircle size={12} />
                ) : (
                  <span className="text-[10px] font-bold font-mono">3</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/55 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-slate-800 text-yellow-400">
                    <Cpu size={14} />
                  </span>
                  <span className="text-xs font-bold text-slate-200">Node 3: AI 化工语言清洗器 (AI Cleansing Pipeline)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-amber-500 font-mono bg-amber-950/20 border border-amber-900/30 px-2 py-0.5 rounded">
                    Prompt 响应驱动
                  </span>
                  {simState === 'ai_analyzing' && (
                    <span className="text-[10px] text-indigo-400 animate-pulse flex items-center gap-1 font-mono">
                      <RefreshCw size={10} className="animate-spin" /> 大模型精细推理...
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  配合您的 Prompt 约束，Gemini 智能对异构文书执行实体提取，导出标准的行业标准化意向 JSON：
                </p>
                
                {simState === 'idle' || simState === 'spidering' || simState === 'raw_harvest' ? (
                  <div className="bg-[#0b0b0e]/50 border border-dashed border-slate-800 p-8 rounded text-center text-xs text-slate-600">
                    ⏳ 等待前置 Node 数据就绪流转...
                  </div>
                ) : (
                  <div className="bg-[#050507] border border-slate-950 rounded p-3 text-[11px] font-mono text-indigo-300 max-h-[160px] overflow-y-auto">
                    <pre className="whitespace-pre">{currentPipeline.mockParsedJson}</pre>
                  </div>
                )}
              </div>
            </div>

            {/* NODE 4: CRM Routing Storage */}
            <div 
              className={`relative bg-[#121217] border rounded-xl p-5 transition-all duration-500 ${
                simState === 'crm_routing' || simState === 'done'
                  ? 'border-emerald-500 shadow-lg shadow-emerald-950/10 scale-[1.01]' 
                  : 'border-slate-800 opacity-30'
              }`}
            >
              {/* Left dot anchor */}
              <div className={`absolute top-6 -left-6 sm:-left-10 h-6 w-6 rounded-full border flex items-center justify-center transition-colors duration-500 ${
                simState === 'done'
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : simState === 'crm_routing' 
                    ? 'bg-indigo-600 border-indigo-400 animate-pulse text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {simState === 'done' ? (
                  <CheckCircle size={12} />
                ) : (
                  <span className="text-[10px] font-bold font-mono">4</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/55 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-slate-800 text-emerald-400">
                    <Database size={14} />
                  </span>
                  <span className="text-xs font-bold text-slate-200">Node 4: CRM 意向分配路由 (CRM Routing Engine)</span>
                </div>
                <div>
                  {simState === 'crm_routing' && (
                    <span className="text-[10px] text-indigo-400 animate-pulse flex items-center gap-1 font-mono">
                      <RefreshCw size={10} className="animate-spin" /> CRM分配引擎适配中...
                    </span>
                  )}
                  {simState === 'done' && (
                    <span className="text-[10px] text-emerald-450 font-bold font-sans bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded">
                      🎉 已存盘 待指派
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  清洗后，系统在 CRM 数据库中生成的规范高价值线索快照：
                </p>

                {simState !== 'crm_routing' && simState !== 'done' ? (
                  <div className="bg-[#0b0b0e]/50 border border-dashed border-slate-800 p-8 rounded text-center text-xs text-slate-600">
                    ⏳ 待 AI 实体解析生成后一键路由入库...
                  </div>
                ) : (
                  <div className="bg-[#050507] border border-emerald-950/30 p-4 rounded-xl space-y-3">
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-100">
                            {parsedData.companyName || parsedData.institution || "江苏瑞泰制药有限公司"}
                          </h4>
                          <span className="text-[9px] bg-indigo-950/60 text-indigo-300 px-1.5 py-0.2 select-none border border-indigo-900/40 rounded font-mono">
                            {currentPipeline.channelType}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          源头管道: {currentPipeline.name}
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded select-none ${
                          (parsedData.estimatedLeadValue || 'A') === 'A' 
                            ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50' 
                            : 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
                        }`}>
                          级别 {(parsedData.estimatedLeadValue || 'A')} (重点跟进)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans border-t border-slate-800/60 pt-3">
                      <div className="space-y-1">
                        <div className="text-slate-500">🌍 对应地区 / 国家</div>
                        <div className="text-slate-300 font-medium">
                          {parsedData.region || parsedData.country || "中国江苏"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-slate-500">📧 关联联系方式</div>
                        <div className="text-slate-300 font-mono break-all font-medium">
                          {parsedData.contactEmail || "sourcing@ruitaipharma.cn (模拟提取)"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0e0e13] p-2.5 rounded border border-slate-800/60 text-[10px] space-y-1.5">
                      <div className="font-semibold text-slate-400 uppercase tracking-wider text-[9px]">
                        核心获取意向化学品/原料药
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedData.materials ? (
                          parsedData.materials.map((m: any, idx: number) => (
                            <span key={idx} className="bg-[#1b1b26] text-indigo-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                              {m.name} ({m.casNo}) - {m.annualTonnage}吨/年
                            </span>
                          ))
                        ) : parsedData.requiredReagents ? (
                          parsedData.requiredReagents.map((r: any, idx: number) => (
                            <span key={idx} className="bg-[#1b1b26] text-indigo-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                              {r.chemicalName} ({r.casNo}) - {r.spec}
                            </span>
                          ))
                        ) : parsedData.updatedRegistrations ? (
                          parsedData.updatedRegistrations.map((ur: any, idx: number) => (
                            <span key={idx} className="bg-[#1b1b26] text-indigo-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                              {ur.purityApi} (CAS No: {ur.casNo}) - {ur.status}
                            </span>
                          ))
                        ) : parsedData.requirement ? (
                          <span className="bg-[#1b1b26] text-indigo-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                            {parsedData.requirement.chemicalName} ({parsedData.requirement.casNo}) - 需求 {parsedData.requirement.quantity}
                          </span>
                        ) : (
                          <span className="bg-[#1b1b26] text-indigo-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                            高效精密原料药
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
