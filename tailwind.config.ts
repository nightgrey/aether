import type { Config } from 'tailwindcss';
const amber = {
  '100': 'hsl(35,100%,8%)',
  '200': 'hsl(32,100%,10%)',
  '300': 'hsl(33,100%,15%)',
  '400': 'hsl(35,100%,17%)',
  '500': 'hsl(35,91%,22%)',
  '600': 'hsl(39,85%,49%)',
  '700': 'hsl(39,100%,57%)',
  '800': 'hsl(35,100%,52%)',
  '900': 'hsl(35,100%,52%)',
  '1000': 'hsl(40,94%,93%)',
};

/* 
    --ds-gray-100-value: 0,0%,10%;
    --ds-gray-200-value: 0,0%,12%;
    --ds-gray-300-value: 0,0%,16%;
    --ds-gray-400-value: 0,0%,18%;
    --ds-gray-500-value: 0,0%,27%;
    --ds-gray-600-value: 0,0%,53%;
    --ds-gray-700-value: 0,0%,56%;
    --ds-gray-800-value: 0,0%,49%;
    --ds-gray-900-value: 0,0%,63%;
    --ds-gray-1000-value: 0,0%,93%;
*/
const grey = {
  '50': 'hsl(240, 0%, 98%)',
  '100': 'hsl(240, 85.7%, 97.3%)',
  '200': 'hsl(240, 4.9%, 83.9%)',
  '300': 'hsl(240, 5%, 64.9%)',
  '350': 'hsl(240, 5%, 35%)',
  '400': 'hsl(240, 3.7%, 15.9%)',
  '500': 'hsl(240, 5.9%, 12%)',
  '600': 'hsl(240, 10%, 3.9%)',
};

const green = {
  '100': 'hsl(136,50%,9%)',
  '200': 'hsl(137,50%,12%)',
  '300': 'hsl(136,50%,14%)',
  '400': 'hsl(135,70%,16%)',
  '500': 'hsl(135,70%,23%)',
  '600': 'hsl(135,70%,34%)',
  '700': 'hsl(131,41%,46%)',
  '800': 'hsl(132,43%,39%)',
  '900': 'hsl(131,43%,57%)',
  '1000': 'hsl(136,73%,94%)',
};

const config = {
  darkMode: ['class'],
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    data: {
      selected: 'selected',
      value: 'value',
      'drop-target': 'drop-target',
      pressed: 'pressed',
      hovered: 'hovered',
      focused: 'focused',
      'focus-visible': 'focus-visible',
      disabled: 'disabled',
      readonly: 'readonly',
      invalid: 'invalid',
      required: 'required',
    },
    fontFamily: {
      sans: "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
      serif: ['Georgia', 'serif'],
      mono: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;",
    },
    extend: {
      screens: {
        pointer: { raw: '(pointer: fine)' },
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
      dropShadow: {
        glow: '0 0 60px rgba(255, 255, 255, 0.6)',
        'glow-xl': '0 0px 80px rgba(255, 255, 255, 1)',
      },
      backgroundColor: {
        'gradient-to-t': 'linear-gradient(to right, #fff, var(--line-color) 50%, transparent 0, transparent)',
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        spin: 'spin 0.45s linear infinite',
      },
      boxShadow: {
        border: `0 0 0 1px rgb(0 0 0 / 0.05)`,
      },
      borderWidth: {
        '1/2': '0.5px',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      transitionProperty: {
        border: 'border, border-color, border-width',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      colors: {
        black: 'hsl(0, 0%, 5.9%)',
        white: 'hsl(40, 12.5%, 93%)',
        grey,
        amber,
        green,
      },
    },
  },
} satisfies Config;

export default config;
