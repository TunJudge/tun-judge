const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    '../../node_modules/tw-react-components/**/*.{tsx,jsx,js,html}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: 'height',
        width: 'width',
        maxWidth: 'max-width',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('tw-react-components/config'),
  ],
};
