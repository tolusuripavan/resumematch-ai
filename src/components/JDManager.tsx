import React, { useState } from 'react';
import { JobDescription } from '../types';
import { saveJobDescription, deleteJobDescription } from '../lib/storage';
import { Plus, Trash2, ChevronRight, FileText } from 'lucide-react';

interface JDManagerProps {
  jds: JobDescription[];
  onJdsChange: () => void;
  onSelectJd: (jd: JobDescription) => void;
}

export function JDManager({ jds, onJdsChange, onSelectJd }: JDManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    saveJobDescription({
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      createdAt: Date.now()
    });
    
    setTitle('');
    setContent('');
    setIsAdding(false);
    onJdsChange();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteJobDescription(id);
    onJdsChange();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Descriptions</h2>
          <p className="text-gray-500 mt-1">Manage your saved job descriptions to match against resumes.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New JD
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Job Description</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Save Job Description
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {jds.length === 0 && !isAdding ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Job Descriptions</h3>
            <p className="text-gray-500 mt-1">Add your first job description to start matching resumes.</p>
          </div>
        ) : (
          jds.map((jd) => (
            <div
              key={jd.id}
              onClick={() => onSelectJd(jd)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{jd.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{jd.content}</p>
                <p className="text-xs text-gray-400 mt-2">Added on {new Date(jd.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => handleDelete(jd.id, e)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
