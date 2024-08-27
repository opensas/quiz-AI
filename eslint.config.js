import js from '@eslint/js';

import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{ plugins: { 'simple-import-sort': simpleImportSort } },
	{
		rules: {
			// override/add rules settings here, such as:
			// 'svelte/rule-name': 'error'
			'svelte/sort-attributes': [
				'error',
				{
					order: [
						// `this` property.
						'this',
						// `bind:this` directive.
						'bind:this',
						// `id` attribute.
						'id',
						// `name` attribute.
						'name',
						// `value` attribute.
						['value', '/^bind:value:/u'],
						// `bind:` directives (other then `bind:this`)
						['/^bind:/u', '!bind:this'],
						// `slot` attribute.
						'slot',
						// `--style-props` (Alphabetical order within the same group.)
						{ match: '/^--/u', sort: 'alphabetical' },
						// `style` attribute, and `style:` directives.
						['style', '/^style:/u'],
						// `class` attribute.
						'class',
						// `class:` directives. (Alphabetical order within the same group.)
						{ match: '/^class:/u', sort: 'alphabetical' },
						// other attributes. (Alphabetical order within the same group.)
						{
							match: ['!/:/u', '!/^(?:this|id|name|style|class)$/u', '!/^--/u', '!/^on/u'],
							sort: 'alphabetical'
						},
						// on event handlers - properties starting with on
						{ match: '/^on/u', sort: 'alphabetical' },
						// `use:` directives. (Alphabetical order within the same group.)
						{ match: '/^use:/u', sort: 'alphabetical' },
						// `transition:` directive.
						{ match: '/^transition:/u', sort: 'alphabetical' },
						// `in:` directive.
						{ match: '/^in:/u', sort: 'alphabetical' },
						// `out:` directive.
						{ match: '/^out:/u', sort: 'alphabetical' },
						// `animate:` directive.
						{ match: '/^animate:/u', sort: 'alphabetical' },
						// `let:` directives. (Alphabetical order within the same group.)
						{ match: '/^let:/u', sort: 'alphabetical' }
					]
				}
			],
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// Style imports
						['^.+\\.s?css$'],
						// $lib imports
						['^\\$lib/types'],
						['^\\$lib/components'],
						['^\\$lib'],

						// svelte imports
						['^svelte'],

						// Packages starting with `@`
						['^@'],
						// Packages starting with `~`
						['^~'],
						// rest of the packages
						['^'],
						// Imports starting with `../`
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						// Imports starting with `./`
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						// Side effect imports
						['^\\u0000']
					]
				}
			]
		}
	},

	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	},
	{
		/* location of your components where you would like to apply these rules  */
		// see: https://www.shadcn-svelte.com/docs/installation#eslint-configuration
		files: ['**/components/ui/**/*.svelte'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off'
		}
	}
];
