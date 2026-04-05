import React from 'react';
import { Briefcase, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: 'jds' | 'match';
  setActiveTab: (tab: 'jds' | 'match') => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="hidden md:block p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          ResumeMatch AI
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('jds')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            activeTab === 'jds' 
              ? "bg-indigo-50 text-indigo-700" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Briefcase className="w-5 h-5" />
          Job Descriptions
        </button>
        <button
          onClick={() => setActiveTab('match')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            activeTab === 'match' 
              ? "bg-indigo-50 text-indigo-700" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <FileText className="w-5 h-5" />
          Match Resumes
        </button>
      </nav>
    </aside>
  );
}
