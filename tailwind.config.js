const defaultTheme = require( 'tailwindcss/defaultTheme' );

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./entrypoints/**/*.{html,ts,vue,js}',
		'./components/**/*.{html,ts,vue,js}',
		'./node_modules/flowbite/**/*.js',
	],
	theme:    {
		extend: {
			fontFamily: {
				sans:   [ 'Open Sans', ...defaultTheme.fontFamily.sans ],
				serif:  [ 'Libre Caslon Text', ...defaultTheme.fontFamily.serif ],
				script: [ 'La Belle Aurore', 'cursive' ],
			},
			colors:     {
				'link':     {
					DEFAULT: '#386ea0',
					dark:    '#121f3b'
				},
			}
		},
	},
	safelist: [],
	plugins:  [
		require( 'flowbite/plugin' ),
	],
}

