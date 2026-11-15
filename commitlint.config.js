// Conventional commits: https://www.conventionalcommits.org
// `content` is a project-specific type for pattern and challenge changes.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Keep headers short and scannable (`type: subject`)
    'header-max-length': [2, 'always', 72],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'content',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
