import eslintCore from '@eslint/js'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import { browser as browserGlobals } from 'globals'

export default [
  {
    ignores: ['dist']
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        ecmaFeatures: {
          jsx: true
        }
      },
      ecmaVersion: 2022,
      globals: browserGlobals
    },
    plugins: {
      hooks: reactHooksPlugin,
      refresh: reactRefreshPlugin
    },
    rules: {
      ...eslintCore.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true
        }
      ]
    }
  }
]
