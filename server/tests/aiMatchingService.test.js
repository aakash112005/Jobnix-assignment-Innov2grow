const { matchResumeToJob, matchBreakdown } = require('../services/aiMatchingService');

describe('aiMatchingService.matchResumeToJob', () => {
  test('returns null when job has no required skills', () => {
    expect(matchResumeToJob(['react'], [])).toBeNull();
  });

  test('returns 100 when candidate has all required skills', () => {
    const score = matchResumeToJob(['React', 'Node.js', 'MongoDB'], ['react', 'node.js']);
    expect(score).toBe(100);
  });

  test('returns 0 when candidate has none of the required skills', () => {
    const score = matchResumeToJob(['Python', 'Django'], ['react', 'node.js']);
    expect(score).toBe(0);
  });

  test('returns partial score for partial overlap', () => {
    const score = matchResumeToJob(['React'], ['react', 'node.js', 'mongodb', 'graphql']);
    expect(score).toBe(25);
  });

  test('is case-insensitive and trims whitespace', () => {
    const score = matchResumeToJob([' React ', 'NODE.JS'], ['react', 'node.js']);
    expect(score).toBe(100);
  });
});

describe('aiMatchingService.matchBreakdown', () => {
  test('lists matched and missing skills separately', () => {
    const { score, matched, missing } = matchBreakdown(['React', 'CSS'], ['react', 'node.js']);
    expect(score).toBe(50);
    expect(matched).toEqual(['react']);
    expect(missing).toEqual(['node.js']);
  });
});
