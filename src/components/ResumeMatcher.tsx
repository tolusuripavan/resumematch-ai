import React, { useState, useRef } from 'react';
import { JobDescription } from '../types';
import { extractTextFromFile } from '../lib/pdf';
import { analyzeResumes } from '../services/ai';
import { Upload, FileText, X, Loader2, AlertCircle, Key, Eye, EyeOff } from 'lucide-react';

const API_KEY_STORAGE = 'gemini_api_key';

interface ResumeMatcherProps {
  jds: JobDescription[];
  selectedJd: JobDescription | null;
  setSelectedJd: (jd: JobDescription | null) => void;
  onResults: (report: string) => void;
}

export function ResumeMatcher({ jds, selectedJd, setSelectedJd, onResults }: ResumeMatcherProps) {
  const [resumes, setResumes] = useState<{ name: string; text: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [showKey, setShowKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem(API_KEY_STORAGE, val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setError(null);
    const newResumes = [...resumes];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await extractTextFromFile(file);
        newResumes.push({ name: file.name, text });
      } catch (err) {
        setError(`Failed to read file: ${file.name}`);
      }
    }
    setResumes(newResumes);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeResume = (index: number) => {
    setResumes(resumes.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API Key.");
      return;
    }
    if (!selectedJd) {
      setError("Please select a Job Description first.");
      return;
    }
    if (resumes.length === 0) {
      setError("Please upload at least one resume.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const report = await analyzeResumes(
        selectedJd.content,
        resumes.map(r => r.text),
        apiKey.trim()
      );
      onResults(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Match Resumes</h2>
        <p className="text-gray-500 mt-1">Select a job description and upload candidate resumes to analyze.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

        {/* API Key Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-500" />
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Paste your Gemini API key here..."
              className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Get your free key at{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">
              aistudio.google.com
            </a>
            {' '}→ Key is saved in your browser only.
          </p>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Job Description</label>
          <select
            value={selectedJd?.id || ''}
            onChange={(e) => {
              const jd = jds.find(j => j.id === e.target.value);
              setSelectedJd(jd || null);
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="" disabled>-- Select a saved Job Description --</option>
            {jds.map(jd => (
              <option key={jd.id} value={jd.id}>{jd.title}</option>
            ))}
          </select>
          {jds.length === 0 && (
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              No Job Descriptions yet. Go to Job Descriptions tab to add one.
            </p>
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">2. Upload Candidate Resumes (PDF or Text)</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">Click to upload resumes</p>
            <p className="text-gray-500 text-sm mt-1">Supports .pdf, .txt</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.txt"
              className="hidden"
            />
          </div>

          {resumes.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Resumes ({resumes.length})</h4>
              <div className="grid gap-2">
                {resumes.map((resume, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">{resume.name}</span>
                    </div>
                    <button
                      onClick={() => removeResume(idx)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedJd || resumes.length === 0 || !apiKey.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Run Match Analysis'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
