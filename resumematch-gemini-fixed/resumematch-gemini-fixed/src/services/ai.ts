export async function analyzeResumes(jobDescription: string, resumes: string[]): Promise<string> {
  const prompt = `TASK: Analyze the job description and compare every candidate resume against it. For each resume, identify exact matches, partial matches, gaps, strengths, and weaknesses using only the provided text.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUMES:
${resumes.map((r, i) => `--- Resume ${i + 1} ---\n${r}`).join('\n\n')}

INSTRUCTIONS:

1. Extract the 8-12 most important requirements from the job description (skills, experience, qualifications, education).
2. For each resume, map evidence directly to those requirements (quote or reference specific parts of the resume).
3. Be strictly objective - do not assume or invent information.
4. Use clean, responsive Markdown. Make the Comparison Table mobile-friendly.

OUTPUT FORMAT (follow exactly, no extra text before or after):

Key Job Requirements (bullet list of 8-12 items)

Comparison Table
| Candidate   | Overall Fit | Key Strengths | Key Gaps / Missing | Score (0-100) |
|-------------|-------------|---------------|--------------------|---------------|
| Resume 1    |             |               |                    |               |
[add rows as needed]

Detailed Analysis
* Resume 1: [2-4 sentences with direct evidence]
[add as needed]

Final Ranking & Recommendation
(Number candidates from best to worst fit + one-sentence hiring advice for top 1-2)`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err));
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from AI");

  return text;
}
