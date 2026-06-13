/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lead, Tender, CustomerResearch } from './types';
import { 
  INITIAL_LEADS, 
  INITIAL_TENDERS, 
  INITIAL_RESEARCHES 
} from './mockData';

// Modular view components
import DashboardView from './components/DashboardView';
import LeadRadarView from './components/LeadRadarView';
import TenderAssistantView from './components/TenderAssistantView';
import CustomerDDView from './components/CustomerDDView';
import OutreachCopilotView from './components/OutreachCopilotView';
import FollowUpPipelineView from './components/FollowUpPipelineView';
import { PipelineConfigView } from './components/PipelineConfigView';

// Nav icons
import { 
  LayoutDashboard, 
  Radio, 
  FileSearch, 
  ShieldCheck, 
  MessageSquare, 
  Users, 
  Compass, 
  Zap,
  Globe,
  Settings,
  Workflow
} from 'lucide-react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Shared application states managed reactively
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [researches, setResearches] = useState<CustomerResearch[]>([]);

  // Jump pointers (allows crossing context, like clicking "Outreach" in radar filling values in outreach)
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);
  const [selectedLeadForDD, setSelectedLeadForDD] = useState<Lead | null>(null);

  // Connection health indicator
  const [apiEngine, setApiEngine] = useState('Initializing...');

  // 1. Initial State Loading from LocalStorage or Seeds
  useEffect(() => {
    // 1. Leads
    const storedLeads = localStorage.getItem('CHEM_AI_LEADS');
    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch (e) {
        setLeads(INITIAL_LEADS);
      }
    } else {
      setLeads(INITIAL_LEADS);
      localStorage.setItem('CHEM_AI_LEADS', JSON.stringify(INITIAL_LEADS));
    }

    // 2. Tenders
    const storedTenders = localStorage.getItem('CHEM_AI_TENDERS');
    if (storedTenders) {
      try {
        setTenders(JSON.parse(storedTenders));
      } catch (e) {
        setTenders(INITIAL_TENDERS);
      }
    } else {
      setTenders(INITIAL_TENDERS);
      localStorage.setItem('CHEM_AI_TENDERS', JSON.stringify(INITIAL_TENDERS));
    }

    // 3. Researches
    const storedReports = localStorage.getItem('CHEM_AI_RESEARCHES');
    if (storedReports) {
      try {
        setResearches(JSON.parse(storedReports));
      } catch (e) {
        setResearches(INITIAL_RESEARCHES);
      }
    } else {
      setResearches(INITIAL_RESEARCHES);
      localStorage.setItem('CHEM_AI_RESEARCHES', JSON.stringify(INITIAL_RESEARCHES));
    }

    // 4. Test connectivity
    fetch('/api/health')
      .then(r => r.json())
      .then(data => {
        setApiEngine(data.aiEngine || 'AI Active');
      })
      .catch(() => {
        setApiEngine('Intelligent Offline Engine');
      });
  }, []);

  // Utility to persist state helper
  const saveLeadsToStorage = (updated: Lead[]) => {
    setLeads(updated);
    localStorage.setItem('CHEM_AI_LEADS', JSON.stringify(updated));
  };

  const saveTendersToStorage = (updated: Tender[]) => {
    setTenders(updated);
    localStorage.setItem('CHEM_AI_TENDERS', JSON.stringify(updated));
  };

  const saveResearchesToStorage = (updated: CustomerResearch[]) => {
    setResearches(updated);
    localStorage.setItem('CHEM_AI_RESEARCHES', JSON.stringify(updated));
  };

  // State mutation actions
  const handleAddLeadToPipeline = (lead: Lead) => {
    const exists = leads.find(l => l.id === lead.id || l.companyName === lead.companyName);
    if (exists) {
      // Just alert, but promote status to Pending Touch
      const updated = leads.map(l => l.id === exists.id ? { ...l, status: '待联系' as const } : l);
      saveLeadsToStorage(updated);
    } else {
      const updated = [{ ...lead, status: '待联系' as const }, ...leads];
      saveLeadsToStorage(updated);
    }
    setActiveTab('pipeline');
  };

  // Tender-specific crm importer
  const handleAddTenderToPipeline = (tender: Tender) => {
    // Generate a matching Lead item to persist in Follow-up Pipeline CRM Flow
    const correspondingLead: Lead = {
      id: `L-${tender.id}`,
      source: '展会雷达', // Placeholder representation
      companyName: tender.buyerName,
      country: '中国',
      region: tender.region,
      customerType: '高校/科研所',
      contactName: tender.contactName,
      contactTitle: '招投标授权科长',
      email: 'bid-query@buyer.cb',
      phone: tender.contactPhone,
      linkedin: '',
      website: tender.tenderUrl,
      productKeywords: tender.productName,
      casNo: tender.casNo,
      intentDescription: `投产参与比选项目："${tender.title}"。预算数：${tender.budget} | 目前正推进标书撰写及资质审计。`,
      intentScore: tender.winProbability,
      leadScore: tender.matchScore,
      leadGrade: tender.matchScore > 85 ? 'A' : 'B',
      riskLevel: '低',
      urgencyLevel: '高',
      recommendedAction: tender.recommendedAction,
      status: '待联系',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const exists = leads.find(l => l.companyName === tender.buyerName);
    if (!exists) {
      saveLeadsToStorage([correspondingLead, ...leads]);
    }
    setActiveTab('pipeline');
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const updated = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    saveLeadsToStorage(updated);
  };

  const handleUpdateLeadNotes = (leadId: string, notes: string) => {
    const updated = leads.map(l => l.id === leadId ? { ...l, intentDescription: notes } : l);
    saveLeadsToStorage(updated);
  };

  const handleUpdateLeadFollowUpTime = (leadId: string, datestr: string) => {
    // We could store custom tags if needed
  };

  const handleRemoveLead = (leadId: string) => {
    const updated = leads.filter(l => l.id !== leadId);
    saveLeadsToStorage(updated);
  };

  const handleBulkAddLeads = (newLeads: Lead[]) => {
    // Prevent duplicate entries
    const cleanNew = newLeads.filter(nl => !leads.find(ol => ol.companyName === nl.companyName));
    const updated = [...cleanNew, ...leads];
    saveLeadsToStorage(updated);
  };

  const handleBulkAddTenders = (newTenders: Tender[]) => {
    const cleanNew = newTenders.filter(nt => !tenders.find(ot => ot.title === nt.title));
    const updated = [...cleanNew, ...tenders];
    saveTendersToStorage(updated);
  };

  const handleAddResearchRecord = (report: CustomerResearch) => {
    const exists = researches.find(r => r.companyName === report.companyName);
    if (!exists) {
      saveResearchesToStorage([report, ...researches]);
    }
  };

  // Smooth Context Trimming jumps
  const handleNavigateToOutreach = (lead: Lead) => {
    setSelectedLeadForOutreach(lead);
    setActiveTab('outreach');
  };

  const handleNavigateToDD = (lead: Lead) => {
    setSelectedLeadForDD(lead);
    setActiveTab('due-diligence');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-700" id="app-root">
      
      {/* Top micro status bar */}
      <div className="bg-white text-emerald-600 text-[11px] py-2 px-6 flex justify-between items-center border-b border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-medium tracking-tight text-slate-600">AI 智能获客增长系统 • 简约轻量版 (Status: Scanning Global Markets)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-50 text-emerald-650 py-0.5 px-2 rounded-md font-semibold border border-slate-150">
            引擎：{apiEngine}
          </span>
          <span className="hidden sm:inline text-slate-400 font-mono">2026.06.08 实时在线</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* Left Side navigation column (desktop) / Drawer on mobile */}
        <aside className="w-full md:w-60 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0 shadow-[1px_0_10px_rgba(0,0,0,0.015)]">
          <div className="space-y-6">
            
            {/* SaaS Brand representation */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-150">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs border border-emerald-200/30">
                <Compass className="w-4.5 h-4.5 animate-spin text-emerald-650" style={{ animationDuration: '12s' }} />
              </div>
              <div>
                <h1 className="text-sm font-sans font-extrabold text-slate-950 tracking-tight flex items-center gap-1">
                  ChemGrowth
                  <span className="text-[10px] text-emerald-600 font-sans uppercase font-bold">AI</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sourcing Suite</p>
              </div>
            </div>

            {/* Navigation Menus */}
            <nav className="space-y-1">
              <button 
                id="nav-btn-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-xs border border-indigo-150/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-450" />
                <span className="opacity-70 tracking-widest text-[9px] mr-0.5">01</span> 获客总览 Dashboard
              </button>

              <button 
                id="nav-btn-radar"
                onClick={() => setActiveTab('radar')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'radar'
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-xs border border-indigo-150/60'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Radio className="w-4 h-4 text-slate-450" />
                <span className="opacity-70 tracking-widest text-[9px] mr-0.5">02</span> 线索雷达 Radar
              </button>

              <button 
                id="nav-btn-tender"
                onClick={() => setActiveTab('tender')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tender'
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-xs border border-indigo-150/60'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileSearch className="w-4 h-4 text-slate-450" />
                <span className="opacity-70 tracking-widest text-[9px] mr-0.5">03</span> 内贸招投标助手
              </button>

              <button 
                id="nav-btn-due-diligence"
                onClick={() => setActiveTab('due-diligence')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'due-diligence'
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-xs border border-indigo-150/60'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-slate-450" />
                <span className="opacity-70 tracking-widest text-[9px] mr-0.5">04</span> 外贸客户背调
              </button>

              <button 
                id="nav-btn-outreach"
                onClick={() => setActiveTab('outreach')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'outreach'
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-xs border border-indigo-150/60'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-slate-450" />
                <span className="opacity-70 tracking-widest text-[9px] mr-0.5">05</span> AI 开发话术助手
              </button>

              <button 
                id="nav-btn-pipeline"
                onClick={() => setActiveTab('pipeline')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pipeline'
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-xs border border-indigo-150/60'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-slate-450" />
                <span className="opacity-70 tracking-widest text-[9px] mr-0.5">06</span> 跟进池 Pipeline
              </button>

              <button 
                id="nav-btn-pipeline-configurator"
                onClick={() => setActiveTab('pipeline-configurator')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pipeline-configurator'
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-xs border border-indigo-150/60'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Workflow className="w-4 h-4 text-slate-450" />
                <span className="opacity-70 tracking-widest text-[9px] mr-0.5">07</span> 渠道规则引擎
              </button>
            </nav>
          </div>

          <div className="space-y-4">
            {/* AI Credits section */}
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-150 rounded-lg hidden md:block">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-extrabold">AI 诊断额度 (Credits)</p>
                <span className="text-[10px] font-mono text-emerald-650">75%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-150 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4"></div>
              </div>
              <p className="text-[9px] mt-1.5 text-slate-450 font-mono">7,540 / 10,000 PINGS</p>
            </div>

            {/* Under footer profile info */}
            <div className="pt-4 border-t border-slate-150 hidden md:block">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-150">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 font-serif">
                  W
                </div>
                <div className="truncate flex-1">
                  <span className="font-bold text-slate-800 block">张伟 (Zhang Wei)</span>
                  <span className="text-[10px] text-slate-450 truncate block">manager_sp@chemgrowth.com</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main interactive window viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full transition-all duration-350">
          
          {/* Dashboard views Switch statement */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              leads={leads}
              tenderCount={tenders.length}
              dueDiligenceCount={researches.length}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'radar' && (
            <LeadRadarView 
              leads={leads}
              onAddLeadToPipeline={handleAddLeadToPipeline}
              onNavigateToOutreach={handleNavigateToOutreach}
              onNavigateToDD={handleNavigateToDD}
              onBulkAddLeads={handleBulkAddLeads}
            />
          )}

          {activeTab === 'tender' && (
            <TenderAssistantView 
              tenders={tenders}
              onAddTenderToPipeline={handleAddTenderToPipeline}
              onBulkAddTenders={handleBulkAddTenders}
            />
          )}

          {activeTab === 'due-diligence' && (
            <CustomerDDView 
              researches={researches}
              selectedLeadForDD={selectedLeadForDD}
              onAddResearchRecord={handleAddResearchRecord}
              onClearSelectedLead={() => setSelectedLeadForDD(null)}
            />
          )}

          {activeTab === 'outreach' && (
            <OutreachCopilotView 
              selectedLeadForOutreach={selectedLeadForOutreach}
              onClearSelectedLead={() => setSelectedLeadForOutreach(null)}
            />
          )}

          {activeTab === 'pipeline' && (
            <FollowUpPipelineView 
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onUpdateLeadNotes={handleUpdateLeadNotes}
              onUpdateLeadFollowUpTime={handleUpdateLeadFollowUpTime}
              onRemoveLead={handleRemoveLead}
              onNavigateToOutreach={handleNavigateToOutreach}
            />
          )}

          {activeTab === 'pipeline-configurator' && (
            <PipelineConfigView />
          )}

        </main>
      </div>

    </div>
  );
}
