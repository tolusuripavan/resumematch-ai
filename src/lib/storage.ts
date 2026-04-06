import { JobDescription } from "../types";

const STORAGE_KEY = "resume_match_jds";

export function getJobDescriptions(): JobDescription[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveJobDescription(jd: JobDescription) {
  const jds = getJobDescriptions();
  jds.push(jd);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jds));
}

export function deleteJobDescription(id: string) {
  const jds = getJobDescriptions();
  const filtered = jds.filter((jd) => jd.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
