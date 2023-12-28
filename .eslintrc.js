module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'standard-with-typescript',
		'plugin:react/recommended',
		'plugin:import/errors',
		'plugin:import/warning',
		'plugin:import/typescript',
		'plugin:prettier/recommended',
		'prettier',
		'prettier/react',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint', 'prettier'],
	rules: {
		semi: ['error', 'never'],
		indent: ['error', 2],
		quotes: ['error', 'single'],
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'no-console': 'warn',
	},
};
