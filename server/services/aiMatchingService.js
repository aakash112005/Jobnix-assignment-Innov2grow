/**
 * Lightweight AI Resume Matching engine.
 *
 * Scores how well a candidate's skill set matches a job's required skills
 * using normalized token overlap (Jaccard-style similarity), weighted so
 * that matching a larger share of the job's requirements scores higher.
 *
 * This is a deterministic, dependency-free heuristic that can be swapped
 * out for a real embeddings-based model (e.g. an LLM call) later without
 * changing the calling code - see matchResumeToJobAsync() for that seam.
 */
const normalize = (arr = []) =>
  arr.map((s) => String(s).trim().toLowerCase()).filter(Boolean);

const matchResumeToJob = (candidateSkills = [], jobSkills = []) => {
  const candidate = new Set(normalize(candidateSkills));
  const job = normalize(jobSkills);

  if (job.length === 0) return null;

  const matched = job.filter((skill) => candidate.has(skill));
  const score = Math.round((matched.length / job.length) * 100);

  return score;
};

/**
 * Returns a breakdown (matched/missing skills + score) for display in the
 * employer dashboard's applicant list.
 */
const matchBreakdown = (candidateSkills = [], jobSkills = []) => {
  const candidate = new Set(normalize(candidateSkills));
  const job = normalize(jobSkills);

  const matched = job.filter((skill) => candidate.has(skill));
  const missing = job.filter((skill) => !candidate.has(skill));
  const score = job.length ? Math.round((matched.length / job.length) * 100) : null;

  return { score, matched, missing };
};

// Async seam for a future real AI-model-backed implementation (e.g. calling
// the Anthropic API to semantically compare a resume against a JD).
const matchResumeToJobAsync = async (candidateSkills, jobSkills) =>
  matchResumeToJob(candidateSkills, jobSkills);

module.exports = { matchResumeToJob, matchBreakdown, matchResumeToJobAsync };
