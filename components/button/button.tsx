'use client';

import { cn } from '@/lib/utils';
import { Button as HeadlessButton } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import Typography from '../typography/typography';

const baseClasses = cn(
  'flex flex-row items-center justify-center gap-2 ',
  'px-6 text-center',
  'rounded-lg',
  'cursor-pointer',
  'selection:bg-transparent',
  'focus:outline-none',
  'disabled:pointer-events-none',
);

const buttonVariants = cva(baseClasses, {
  variants: {
    variant: {
      white: [
        'border border-light-100 bg-white text-main-600',
        'hover:text-main-700',
        'focus-visible:text-main-800',
        'disabled:text-gray-200',
      ],
      ghost: ['bg-transparent', 'hover:bg-transparent', 'disabled:bg-transparent'],
      icon: ['p-2', 'hover:bg-light-100'],

      primary: [
        'bg-blue-600 fill-white text-white',
        'hover:bg-blue-700',
        'active:bg-blue-800',
        'disabled:bg-blue-200 disabled:fill-light-200 disabled:stroke-light-200 disabled:text-light-200',
      ],
      secondary: [
        'bg-main-100 fill-main-600 stroke-main-600 text-main-600',
        'hover:bg-main-200',
        'active:bg-main-300',
        'disabled:bg-main-50 disabled:fill-light-200 disabled:stroke-light-200 disabled:text-light-200',
      ],
      tertiary: [
        'border border-main-100 bg-white fill-[#120004] stroke-[#120004] text-[#120004]',
        'hover:bg-main-100 hover:fill-red-default hover:stroke-main-700 hover:text-main-700',
        'active::fill-main-800 active:stroke-main-800 active:text-main-800',
        'disabled:fill-light-200 disabled:stroke-light-200 disabled:text-light-200',
      ],
      danger: [
        'border border-system-red-light bg-white fill-system-red stroke-system-red text-system-red',
        'hover:fill-system-red-dark hover:stroke-system-red-dark hover:text-system-red-dark',
        'active:fill-system-red-super-dark active:stroke-system-red-super-dark active:text-system-red-super-dark',
        'disabled:fill-system-red-light disabled:stroke-system-red-light disabled:text-system-red-light',
      ],

      link: [
        'm-0 rounded-none border-none bg-transparent p-0 text-main-600',
        'hover:text-main-700',
        'active:text-main-700',
        'disabled:text-light-200',
      ],
    },
    size: {
      lg: 'py-3',
      icon: 'h-10 w-10',

      big: 'h-12 max-h-12 min-h-12',
      small: 'h-10.5 max-h-10.5 min-h-10.5',
    },
    typography: {
      label: [Typography.classes.label.default, Typography.classes.label.classnames],
      bodyMMedium: [Typography.classes.Body.default, Typography.classes.Body.classnames.mMedium],
      bodyMRegular: [Typography.classes.Body.default, Typography.classes.Body.classnames.mRegular],
    },
  },
  compoundVariants: [
    {
      variant: 'link',
      size: 'big',
      className: [Typography.classes.Body.default, Typography.classes.Body.classnames.mMedium],
    },
    {
      variant: 'link',
      size: 'small',
      class: [
        'w-fit border-b border-dashed border-main-600',
        Typography.classes.Body.default,
        Typography.classes.Body.classnames.mRegular,
      ],
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'big',
    typography: 'label',
  },
});
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  as?: 'button' | 'a';
  href?: string;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      disabled,
      as = 'button',
      type = 'button',
      typography,
      href,
      ...props
    },
    ref,
  ) => {
    if (href) {
      return (
        <HeadlessButton
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          as={Link}
          className={cn(buttonVariants({ variant, typography, size, className }))}
          href={href}
          {...props}
        />
      );
    }

    return (
      <HeadlessButton
        ref={ref}
        as={as}
        className={cn(buttonVariants({ variant, typography, size, className }))}
        disabled={disabled}
        type={type}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
export default Button;
export { Button, buttonVariants };
