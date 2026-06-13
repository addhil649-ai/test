/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead } from '../types';
import { 
  Building,
  User,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  XCircle,
  Sparkles,
  Link,
  ChevronRight,
  Mail,
  Edit2
} from 'lucide-react';

interface FollowUpPipelineViewProps {
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, newStatus: Lead['status']) => void;
  onUpdateLeadNotes: (leadId: string, notes: string) => void;
  onUpdateLeadFollowUpTime: (leadId: string, datestr: string) => void;
  onRemoveLead: (leadId: string) => void;
  onNavigateToOutreach: (lead: Lead) => void;
}

export default function FollowUpPipelineView({
  leads,
  onUpdateLeadStatus,
  onUpdateLeadNotes,
  onUpdateLeadFollowUpTime,
  onRemoveLead,
  onNavigateToOutreach
}: FollowUpPipelineViewProps) {
  
  // States categories
  const STATUSES: Lead['status'][] = [
    '待联系', 
    '已发送开发信', 
    '已回复', 
    '已转询盘', 
    '已报价', 
    '已成交', 
    '已放弃'
  ];

  const [activeTabStatus, setActiveTabStatus] = useState<Lead['status'] | 'all'>('all');
  const [pipelineSearch, setPipelineSearch] = useState('');

  // Editing notes popovers
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Filter leads based on state tab & search query
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = activeTabStatus === 'all' || lead.status === activeTabStatus;
    const matchesSearch = lead.companyName.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
                          lead.productKeywords.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
                          lead.contactName.toLowerCase().includes(pipelineSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeColor = (status: Lead['status']) => {
    switch (status) {
      case '待联系':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case '已发送开发信':
        return 'bg-indigo-50 text-indigo-700 border-indigo-150';
      case '已回复':
        return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case '已转询盘':
        return 'bg-sky-50 text-sky-700 border-sky-150';
      case '已报价':
        return 'bg-amber-50 text-amber-700 border-amber-150 animate-pulse';
      case '已成交':
        return 'bg-teal-500 text-white font-extrabold border-teal-500';
      case '已放弃':
        return 'bg-rose-50 text-rose-700 border-rose-250';
      default:
        return 'bg-slate-50 text-slate-500';
    }
  };

  const handleStartEditingNotes = (leadId: string, currentNotes: string) => {
    setEditingNotesId(leadId);
    setTempNotes(currentNotes);
  };

  const handleSaveNotes = (leadId: string) => {
    onUpdateLeadNotes(leadId, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6" id="followup-pipeline-view">
      
      {/* Upper sub tab indicators */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-4">
        
        {/* Search & generic count header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative flex-1 w-full">
            <input 
              type="text" 
              placeholder="快速搜索跟进中的化学品客商项目..."
              value={pipelineSearch}
              onChange={(e) => setPipelineSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
          </div>
          <span className="text-slate-450 text-xs shrink-0 font-medium font-sans">
            共有 <strong className="text-slate-900 font-bold">{leads.length}</strong> 户客户正在生命周期流中跟进
          </span>
        </div>

        {/* Categories toggler belt */}
        <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          <button 
            id="pipeline-tab-all"
            onClick={() => setActiveTabStatus('all')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTabStatus === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            全部 ({leads.length})
          </button>
          
          {STATUSES.map((stat) => {
            const count = leads.filter(l => l.status === stat).length;
            return (
              <button 
                key={stat}
                id={`pipeline-tab-${stat}`}
                onClick={() => setActiveTabStatus(stat)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeTabStatus === stat 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {stat} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Grid pipeline list */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-200 p-16 text-center text-xs text-slate-400">
            该阶段跟进池内暂无化学品线索。请通过“线索雷达”页面寻找有价值外商并点击“加入跟进池”，
            以此激活并跟踪其客户销售管道！
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative overflow-hidden"
            >
              
              {/* Left col: Title company and info card (4 cols) */}
              <div className="md:col-span-4 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    lead.leadGrade === 'A' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {lead.leadGrade} 级
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{lead.id}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 leading-snug">{lead.companyName}</h4>
                <div className="text-xs text-slate-500 space-y-0.5">
                  <p>国家/地区：<strong>{lead.country}</strong></p>
                  <p>主要联系：{lead.contactName} ({lead.contactTitle}) • <strong className="font-mono">{lead.email}</strong></p>
                </div>
              </div>

              {/* Middle col 1: Match chemicals products (3 cols) */}
              <div className="md:col-span-3 text-xs space-y-2">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-bold block uppercase tracking-tight text-[10px]">监控对接溶剂:</span>
                  <p className="font-semibold text-slate-800 font-mono italic">{lead.productKeywords}</p>
                  {lead.casNo && <p className="text-[10px] text-slate-400 font-mono">CAS: {lead.casNo}</p>}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">线索来源:</span>
                  <span className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                    {lead.source}
                  </span>
                </div>
              </div>

              {/* Middle col 2: Interactive Notes/Communication log (3 cols) */}
              <div className="md:col-span-3 text-xs space-y-2">
                <span className="text-slate-400 font-bold block uppercase tracking-tight text-[10px]">下次跟进备忘：</span>
                
                {editingNotesId === lead.id ? (
                  <div className="space-y-1.5">
                    <textarea 
                      rows={2}
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-1.5 rounded-md focus:outline-none text-[11px] leading-relaxed"
                    />
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleSaveNotes(lead.id)}
                        className="bg-emerald-600 text-white font-bold px-2 py-0.5 text-[10px] rounded cursor-pointer"
                      >
                        保存
                      </button>
                      <button 
                        onClick={() => setEditingNotesId(null)}
                        className="bg-slate-200 text-slate-600 px-2 py-0.5 text-[10px] rounded cursor-pointer"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative">
                    <p className="text-slate-600 font-medium leading-relaxed font-sans pr-6">
                      {lead.intentDescription || "暂无最新备忘录记录。"}
                    </p>
                    <button 
                      onClick={() => handleStartEditingNotes(lead.id, lead.intentDescription)}
                      className="absolute right-0 top-0.5 text-slate-400 hover:text-indigo-650 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-350" />
                  <span>添加：{lead.createdAt.substring(0, 10)}</span>
                </div>
              </div>

              {/* Right col: States toggler & CRM action triggers (2 cols) */}
              <div className="md:col-span-2 flex flex-col items-stretch gap-2.5">
                
                {/* State selector drop down */}
                <div className="space-y-1">
                  <span className="text-slate-450 text-[9px] font-bold block uppercase tracking-tight">生命周期阶段</span>
                  <select 
                    value={lead.status}
                    onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${getStatusBadgeColor(lead.status)}`}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Copilot redirect */}
                <button 
                  onClick={() => onNavigateToOutreach(lead)}
                  className="w-full flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 transition-all py-1.5 rounded-lg text-xs font-bold cursor-pointer font-sans"
                >
                  <Mail className="w-3.5 h-3.5" />
                  生成下一封信
                </button>

                <button 
                  onClick={() => {
                    if (confirm(`确定要将当前客户 "${lead.companyName}" 移出跟进列表吗？`)) {
                      onRemoveLead(lead.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 transition-colors text-[10px] text-center cursor-pointer font-semibold underline underline-offset-2"
                >
                  标记无效并移除
                </button>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
