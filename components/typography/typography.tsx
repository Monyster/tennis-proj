import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';

const familyMainFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const fonts = {
  familyMainFont,
};

const textColorsClasses = {
  50: 'text-[#FFFFFF]',
  100: 'text-[#CED4DA]',
  200: 'text-[#ADB5BD]',
  300: 'text-[#6C757D]',
  400: 'text-[#343A40]',
  500: 'text-[#0B0E11]',
};

type TextColorShade = keyof typeof textColorsClasses;

interface TypographyProps {
  readonly children?: ReactNode;
  readonly variant?: number;
  readonly className?: string;
  readonly colorShade?: TextColorShade;
}

const typographyClasses = {
  Title: {
    default: `${fonts.familyMainFont.className} tracking-[0px] capitalize after:tracking-[0px] after:capitalize after:font-[var(--font-inter)]`,
    classnames: {
      h1: 'text-[42px]/[50px] font-bold',
      h2: 'text-[32px]/[42px] font-semibold',
      h3: 'text-[28px]/[38px] font-semibold',
      h4: 'text-[22px]/[32px] font-semibold',
      h5: 'text-[18px]/[28px] font-semibold',
      title: 'text-[16px]/[24px] font-bold',
      subTitle: 'text-[14px]/[20px] font-semibold',
      tableTitleS:
        'text-[12px]/[20px] font-medium tracking-[1px] uppercase after:text-[12px]/[20px] after:font-medium after:tracking-[1px] after:uppercase',
      tableTitleXS: 'text-[10px]/[16px] font-medium tracking-[1px] uppercase',
    },
  },
  Body: {
    default: `${fonts.familyMainFont.className} font-medium tracking-[0px] normal-case`,
    classnames: {
      l: 'text-[16px]/[24px]',
      mMedium: 'text-[14px]/[20px]',
      mRegular: 'text-[14px]/[20px] font-normal',
      sMedium: 'text-[12px]/[16px]',
      sRegular: 'text-[12px]/[16px] font-normal',
      xs: 'text-[10px]/[12px]',
    },
  },
  label: {
    default: `${fonts.familyMainFont.className} tracking-[0px] normal-case`,
    classnames: {
      label: 'text-[14px]/[20px] font-bold',
    },
  },
};

function Typography({ children }: TypographyProps) {
  return <div>{children}</div>;
}

function H1({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <h1
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.h1,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </h1>
  );
}

function H2({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <h2
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.h2,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </h2>
  );
}

function H3({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <h3
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.h3,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </h3>
  );
}

function H4({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <h4
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.h4,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </h4>
  );
}

function H5({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <h5
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.h5,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </h5>
  );
}

function Title({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.title,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function SubTitle({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.subTitle,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function TableTitleS({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.tableTitleS,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function TableTitleXS({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Title.default,
        typographyClasses.Title.classnames.tableTitleXS,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function BodyL({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Body.default,
        typographyClasses.Body.classnames.l,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function BodyMMedium({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Body.default,
        typographyClasses.Body.classnames.mMedium,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function BodyMRegular({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Body.default,
        typographyClasses.Body.classnames.mRegular,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function BodySMedium({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Body.default,
        typographyClasses.Body.classnames.sMedium,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function BodySRegular({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Body.default,
        typographyClasses.Body.classnames.sRegular,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function BodyXS({ children, colorShade = 500, className = '' }: TypographyProps) {
  return (
    <p
      className={cn(
        typographyClasses.Body.default,
        typographyClasses.Body.classnames.xs,
        textColorsClasses[colorShade],
        className,
      )}
    >
      {children}
    </p>
  );
}

function Label({
  children,
  colorShade = 500,
  className = '',
  htmlFor,
}: TypographyProps & { htmlFor: string }) {
  return (
    <label
      className={cn(
        typographyClasses.label.default,
        typographyClasses.label.classnames.label,
        textColorsClasses[colorShade],
        className,
      )}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

Typography.H1 = H1;
Typography.H2 = H2;
Typography.H3 = H3;
Typography.H4 = H4;
Typography.H5 = H5;
Typography.Title = Title;
Typography.SubTitle = SubTitle;
Typography.TableTitleS = TableTitleS;
Typography.TableTitleXS = TableTitleXS;
Typography.BodyL = BodyL;
Typography.BodyMMedium = BodyMMedium;
Typography.BodyMRegular = BodyMRegular;
Typography.BodySMedium = BodySMedium;
Typography.BodySRegular = BodySRegular;
Typography.BodyXS = BodyXS;
Typography.Label = Label;

Typography.classes = typographyClasses;

export default Typography;
