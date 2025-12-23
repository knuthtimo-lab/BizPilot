
import React, { useState } from 'react';
import { JobPosting } from '../types';
import { ICONS } from '../constants';
import { generateJobDescription } from '../services/geminiService';
import { marked } from 'marked';

interface HiringProps {
  jobs: JobPosting[];
  onAddJob: (job: JobPosting) => void;
  onRemoveJob: (id: string) => void;
  isDarkMode: boolean;
}

const Hiring: React.FC<HiringProps> = ({ jobs, onAddJob, onRemoveJob, isDarkMode }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewJob, setPreviewJob] = useState<Partial<JobPosting> | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    seniority: 'Senior',
    skills: '',
    companyInfo: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setPreviewJob(null);

    try {
      const skillsArr = formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const result = await generateJobDescription(formData.title, formData.seniority, skillsArr, formData.companyInfo || 'A modern high-growth enterprise.');
      
      setPreviewJob({
        title: formData.title,
        seniority: formData.seniority,
        skills: skillsArr,
        content: result.content || '',
        interviewQuestions: result.interviewQuestions || [],
        createdAt: new Date().toISOString().split('T')[0]
      });
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!previewJob) return;
    
    const newJob: JobPosting = {
      id: Math.random().toString(36).substr(2, 9),
      title: previewJob.title || 'Untitled Role',
      seniority: previewJob.seniority || 'Mid-Level',
      skills: previewJob.skills || [],
      content: previewJob.content || '',
      interviewQuestions: previewJob.interviewQuestions || [],
      createdAt: previewJob.createdAt || new Date().toISOString().split('T')[0]
    };

    onAddJob(newJob);
    setPreviewJob(null);
    setFormData({ title: '', seniority: 'Senior', skills: '', companyInfo: '' });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Growth & Talent</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-lg mt-1 font-medium italic`}>Scale your organization with AI-synthesized playbooks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-4">
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-[2.5rem] p-8 shadow-sm sticky top-32`}>
            <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-8 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-200 dark:shadow-blue-900/40">1</div>
              Role Parameters
            </h3>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead System Architect"
                  className={`w-full px-5 py-3 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600`}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Seniority</label>
                <select 
                  className={`w-full px-5 py-3 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm`}
                  value={formData.seniority}
                  onChange={(e) => setFormData({...formData, seniority: e.target.value})}
                >
                  <option>Junior</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                  <option>Lead / Director</option>
                  <option>VP / Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Technical Skills (CSV)</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Kubernetes, Leadership"
                  className={`w-full px-5 py-3 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600`}
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Organizational Context</label>
                <textarea
                  rows={4}
                  placeholder="Brief context about your team/company..."
                  className={`w-full px-5 py-3 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600`}
                  value={formData.companyInfo}
                  onChange={(e) => setFormData({...formData, companyInfo: e.target.value})}
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating || !formData.title}
                className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 dark:shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Synthesizing...
                  </>
                ) : 'Craft Role Draft'}
              </button>
            </form>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* New Preview Section */}
          {previewJob && (
            <div className="bg-indigo-600 rounded-[3rem] p-1 shadow-[0_30px_60px_-12px_rgba(79,70,229,0.3)] animate-in zoom-in-95 duration-500">
               <div className="px-10 py-6 text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Synthesis Preview</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setPreviewJob(null)}
                      className="px-5 py-2 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={handleSaveDraft}
                      className="px-7 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                    >
                      Library Save
                    </button>
                  </div>
               </div>
               <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-[2.8rem] p-12 overflow-hidden`}>
                 <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-slate'} max-w-none mb-12`}
                    dangerouslySetInnerHTML={{ __html: marked.parse(previewJob.content || '') }}
                 />
                 <div className={`mt-12 pt-12 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h5 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.3em]">Interview Starter Pack</h5>
                    <div className="grid grid-cols-1 gap-4">
                        {previewJob.interviewQuestions?.map((q, i) => (
                           <div key={i} className={`text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'} p-6 rounded-[2rem] border font-bold leading-relaxed shadow-sm`}>
                              <span className="text-indigo-600 mr-3 text-lg font-black">Q{i+1}</span>
                              {q}
                           </div>
                        ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-3 pt-4`}>
            <div className={`w-8 h-8 ${isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-500'} border rounded-xl flex items-center justify-center text-[10px] font-black`}>2</div>
            Active Role Library ({jobs.length})
          </h3>
          
          {jobs.length === 0 && !previewJob && !isGenerating ? (
            <div className={`border-2 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} rounded-[3rem] p-24 text-center`}>
              <div className={`w-20 h-20 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'} rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border shadow-sm`}>
                <ICONS.Hiring className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <p className="text-slate-400 font-bold text-lg italic tracking-tight">Library clear. Scale with intent.</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Craft your first JD using the synthesis engine.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {jobs.map((job) => (
                <div key={job.id} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-[3rem] overflow-hidden shadow-sm transition-all hover:shadow-xl group`}>
                  <div className={`p-10 border-b ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-50 bg-slate-50/50'} flex items-center justify-between`}>
                    <div className="overflow-hidden pr-4">
                      <h4 className="text-2xl font-black tracking-tight leading-none mb-2 group-hover:text-blue-600 transition-colors truncate">{job.title}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{job.seniority} • Active since {job.createdAt}</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button 
                        onClick={() => {
                          const blob = new Blob([job.content], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${job.title.replace(/\s+/g, '_')}_JD.md`;
                          a.click();
                        }}
                        className={`p-3 ${isDarkMode ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-white text-slate-400 border-slate-200'} hover:text-blue-600 transition-all border rounded-2xl shadow-sm hover:-translate-y-1`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                      <button 
                        onClick={() => onRemoveJob(job.id)}
                        className={`p-3 ${isDarkMode ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-white text-slate-400 border-slate-200'} hover:text-red-500 transition-all border rounded-2xl shadow-sm hover:-translate-y-1`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-12">
                    <div 
                      className={`prose ${isDarkMode ? 'prose-invert' : 'prose-slate'} max-w-none text-slate-600 mb-12`}
                      dangerouslySetInnerHTML={{ __html: marked.parse(job.content) }}
                    />
                    
                    <div className={`mt-12 pt-12 border-t ${isDarkMode ? 'border-slate-700 bg-slate-900/30' : 'border-slate-100 bg-slate-50/30'} -mx-12 -mb-12 p-12`}>
                      <h5 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                         <div className="w-5 h-5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         </div>
                         Interview Playbook
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {job.interviewQuestions.map((q, i) => (
                          <div key={i} className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-700'} text-sm p-6 rounded-[2rem] border shadow-sm leading-relaxed font-bold border-l-4 border-l-blue-500`}>
                            <span className="text-blue-600 font-black mr-2">#{i+1}</span>
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hiring;
