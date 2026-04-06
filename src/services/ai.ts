import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResumes(jobDescription: string, resumes: string[]): Promise<string> {
  const prompt = `TASK: Analyze the job description and compare every candidate resume against it. For each resume, identify exact matches, partial matches, gaps, strengths, and weaknesses using only the provided text.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUMES:
${resumes.map((r, i) => `--- Resume ${i + 1} ---\n${r}`).join('\n\n')}

INSTRUCTIONS:

1. Extract the 8–12 most important requirements from the job description (skills, experience, qualifications, education).
2. For each resume, map evidence directly to those requirements (quote or reference specific parts of the resume).
3. Be strictly objective — do not assume or invent information.
4. The user may be viewing this on any device (mobile phone, tablet, Chrome browser, desktop, etc.). Automatically optimize the entire output for the best viewing experience on the user’s device. Use clean, responsive Markdown. Make the Comparison Table mobile-friendly (horizontal scroll on small screens if needed, easy to read on phones).

OUTPUT FORMAT (follow exactly, no extra text before or after):

Key Job Requirements (bullet list of 8–12 items)

Comparison Table
| Candidate   | Overall Fit          | Key Strengths                  | Key Gaps / Missing             | Score (0–100) |
|-------------|----------------------|--------------------------------|--------------------------------|---------------|
| Resume 1    |                      |                                |                                |               |
| Resume 2    |                      |                                |                                |               |
[add rows as needed]

Detailed Analysis

* Resume 1: [2–4 sentences with direct evidence]
* Resume 2: [2–4 sentences with direct evidence]
  [add as needed]

Final Ranking & Recommendation
(Number the candidates from best to worst fit + one-sentence hiring advice for the top 1–2)`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return text;
}
