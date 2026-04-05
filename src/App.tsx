/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { JDManager } from './components/JDManager';
import { ResumeMatcher } from './components/ResumeMatcher';
import { Results } from './components/Results';
import { JobDescription } from './types';
import { getJobDescriptions } from './lib/storage';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'jds' | 'match'>('jds');
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [selectedJd, setSelectedJd] = useState<JobDescription | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setJds(getJobDescriptions());
  }, []);

  const handleJdsChange = () => {
    setJds(getJobDescriptions());
  };

  const handleSelectJd = (jd: JobDescription) => {
    setSelectedJd(jd);
    setActiveTab('match');
    setReport(null);
    setIsMobileMenuOpen(false);
  };

  const handleTabChange = (tab: 'jds' | 'match') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">ResumeMatch AI</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block z-10 absolute md:relative w-full md:w-64 h-[calc(100vh-65px)] md:h-screen bg-white shadow-lg md:shadow-none`}>
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'jds' && (
            <JDManager jds={jds} onJdsChange={handleJdsChange} onSelectJd={handleSelectJd} />
          )}
          {activeTab === 'match' && !report && (
            <ResumeMatcher 
              jds={jds} 
              selectedJd={selectedJd} 
              setSelectedJd={setSelectedJd} 
              onResults={setReport} 
            />
          )}
          {activeTab === 'match' && report && (
            <Results report={report} onBack={() => setReport(null)} />
          )}
        </div>
      </main>
    </div>
  );
}

