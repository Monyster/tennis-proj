import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        '2xs': '365px',
        xs: '376px',
        l: '576px',
      },
      spacing: {
        10.5: '2.625rem',
      },
      colors: {
        background: {
          default: '#ffffff',
        },
        foreground: {
          default: '#111827',
        },

        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },

        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },

        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          900: '#111827',
        },

        success: {
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
        },

        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      const parseColorMix = (value: string, themeColors: Record<string, unknown>): string => {
        const parts = value.split(',').map((s) => s.trim());

        let color1: string | undefined,
          color2: string | undefined,
          percent1: string | undefined,
          percent2: string | undefined;

        if (parts.length === 2) {
          // bg-mix-[main.600,light.300]
          color1 = parts[0];
          color2 = parts[1];
          percent1 = '50%';
        } else if (parts.length === 3) {
          // bg-mix-[main.600,light.300,70%]
          color1 = parts[0];
          color2 = parts[1];
          percent1 = parts[2];
        } else if (parts.length === 4) {
          // bg-mix-[main.600,25%,light.300,60%]
          color1 = parts[0];
          percent1 = parts[1];
          color2 = parts[2];
          percent2 = parts[3];
        } else {
          return value;
        }

        // Resolve theme colors
        const resolveColor = (color: string | undefined): string | undefined => {
          if (!color) return color;

          // Handle "main.600" or "light.300"
          if (color.includes('.')) {
            const pathParts = color.split('.');
            let result: any = themeColors;

            for (const part of pathParts) {
              result = result?.[part];
              if (!result) return color; // Fallback to original if not found
            }

            return result as string;
          }

          // Handle "default" like "red.default" -> "red"
          if (themeColors[color]?.default) {
            return themeColors[color].default;
          }

          return color;
        };

        color1 = resolveColor(color1);
        color2 = resolveColor(color2);

        // Build color-mix string
        if (percent2) {
          return `color-mix(in oklab, ${color1} ${percent1}, ${color2} ${percent2})`;
        } else {
          return `color-mix(in oklab, ${color1} ${percent1}, ${color2})`;
        }
      };

      const colors = theme('colors');

      const createMixUtility = (property: string) => {
        const cssProperty =
          {
            bg: 'backgroundColor',
            text: 'color',
            border: 'borderColor',
            ring: '--tw-ring-color',
            shadow: '--tw-shadow-color',
            outline: 'outlineColor',
            fill: 'fill',
            stroke: 'stroke',
          }[property] || property;

        return matchUtilities(
          {
            [`${property}-mix`]: (value: string) => ({
              [cssProperty]: parseColorMix(value, colors || {}),
            }),
          },
          {
            values: {
              // Predefined mixes using your custom colors
              'main-dark': 'main.600,25%,main.800,75%',
              'main-light': 'main.300,60%,light.50,40%',
              'light-dark': 'light.300,50%,light.500,50%',
              '[main.600,light.300]': 'main.600,light.300',
              '[main.600,light.300,70%]': 'main.600,light.300,70%',
              '[main.600,25%,light.300,60%]': 'main.600,25%,light.300,60%',
            },
          },
        );
      };

      // Create utilities for all properties
      ['bg', 'text', 'border', 'ring', 'shadow', 'outline', 'fill', 'stroke'].forEach((prop) => {
        createMixUtility(prop);
      });
    }),
  ],
};

export default config;
