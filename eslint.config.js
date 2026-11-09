// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

// ---------------------------------------------------------------------------
// Architecture boundaries
// ---------------------------------------------------------------------------
// Template rule:
//   - features may import from core, shared, and layout;
//   - core, shared, and layout must NEVER import from features;
//   - a feature must NEVER import from another feature;
//   - boundaries between areas are crossed only through aliases.
const FEATURES = ['auth', 'account', 'admin', 'dashboard'];

const aliasOnly = {
  // only relative imports (./ or ../) that pass through an area segment.
  // npm packages like "@angular/core" don't start with a dot and are excluded.
  regex: '^\\.{1,2}/(?:.*/)?(?:core|shared|layout|features)(?:/|$)',
  message: 'Cross area boundaries only through aliases (@core, @shared, @layout, @features).',
};

const noFeatures = {
  group: ['@features', '@features/*'],
  message: 'core, shared, and layout must not depend on features.',
};

const restrict = (...extra) => ({
  'no-restricted-imports': ['error', { patterns: [aliasOnly, ...extra] }],
});

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },
  {
    files: ['src/app/{core,shared,layout}/**/*.ts'],
    rules: restrict(noFeatures),
  },
  ...FEATURES.map((name) => ({
    files: [`src/app/features/${name}/**/*.ts`],
    rules: restrict({
      group: FEATURES.filter((f) => f !== name).flatMap((f) => [
        `@features/${f}`,
        `@features/${f}/*`,
      ]),
      message: `Feature ${name} cannot import from another feature. Move the shared code to @shared or @core.`,
    }),
  })),
  {
    files: ['src/app/*.ts'],
    rules: restrict(),
  },
  prettier,
);
