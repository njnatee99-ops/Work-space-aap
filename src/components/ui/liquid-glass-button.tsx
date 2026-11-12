"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-slate-200/65 text-[#14243A] hover:bg-slate-200/85 border border-white/95 shadow-xs backdrop-blur-xl",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
        cool: "bg-slate-200/70 border border-white text-[#14243A] shadow-sm backdrop-blur-xl hover:bg-white/90",
        outline:
          "border border-white/90 bg-slate-200/50 hover:bg-white/80 text-slate-800 shadow-xs backdrop-blur-xl",
        secondary:
          "bg-slate-200/60 text-slate-800 hover:bg-slate-200/80 backdrop-blur-xl",
        ghost: "hover:bg-slate-200/50 text-slate-700",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, liquidbuttonVariants, LiquidButton }

/**
 * Frosted Cloudy Liquid Glass Button ("พื้นหลังขุ่นๆ คลุมโทนฉากหลัง ไม่แปลกเพื่อน")
 * Uses a soft translucent frosted slate-white tint with 3D specular top rim and subtle bottom shadow
 * so it stands out with clear tactile depth against white/frosted cards while staying 100% harmonious.
 */
const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-slate-400 select-none backdrop-blur-2xl",
  {
    variants: {
      variant: {
        default:
          "bg-slate-200/60 hover:bg-slate-200/80 dark:bg-slate-800/75 dark:hover:bg-slate-800/95 text-[#14243A] dark:text-slate-100 font-bold border border-white/95 dark:border-slate-700 ring-1 ring-slate-300/65 dark:ring-slate-700 shadow-[0_6px_16px_-4px_rgba(15,23,42,0.10),inset_0_1.5px_2px_rgba(255,255,255,0.98),inset_0_-1.5px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.14),inset_0_1.5px_2px_rgba(255,255,255,1)] active:scale-[0.98]",
        glowing:
          "bg-slate-200/70 hover:bg-slate-200/90 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-[#14243A] dark:text-white font-bold border border-white dark:border-slate-600 ring-1 ring-slate-300/80 dark:ring-slate-600 shadow-[0_8px_20px_-4px_rgba(15,23,42,0.12),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(15,23,42,0.07)] hover:shadow-[0_10px_24px_-4px_rgba(15,23,42,0.16),inset_0_2px_3px_rgba(255,255,255,1)] active:scale-[0.98]",
        prism:
          "bg-slate-200/65 hover:bg-slate-200/85 dark:bg-slate-800/80 text-[#14243A] dark:text-white font-bold border border-white/95 dark:border-slate-700 ring-1 ring-slate-300/70 shadow-[0_6px_16px_-4px_rgba(15,23,42,0.10),inset_0_1.5px_2px_rgba(255,255,255,0.98)] active:scale-[0.98]",
        ocean:
          "bg-slate-200/65 hover:bg-slate-200/85 dark:bg-slate-800/80 text-[#14243A] dark:text-white font-bold border border-white/95 dark:border-slate-700 ring-1 ring-slate-300/70 shadow-[0_6px_16px_-4px_rgba(15,23,42,0.10),inset_0_1.5px_2px_rgba(255,255,255,0.98)] active:scale-[0.98]",
        gold:
          "bg-slate-200/65 hover:bg-slate-200/85 dark:bg-slate-800/80 text-[#14243A] dark:text-white font-bold border border-white/95 dark:border-slate-700 ring-1 ring-slate-300/70 shadow-[0_6px_16px_-4px_rgba(15,23,42,0.10),inset_0_1.5px_2px_rgba(255,255,255,0.98)] active:scale-[0.98]",
        emerald:
          "bg-slate-200/65 hover:bg-slate-200/85 dark:bg-slate-800/80 text-[#14243A] dark:text-white font-bold border border-white/95 dark:border-slate-700 ring-1 ring-slate-300/70 shadow-[0_6px_16px_-4px_rgba(15,23,42,0.10),inset_0_1.5px_2px_rgba(255,255,255,0.98)] active:scale-[0.98]",
        destructive:
          "bg-rose-500/85 text-white font-bold hover:bg-rose-600 focus-visible:ring-rose-400 shadow-md backdrop-blur-xl",
        outline:
          "border border-white/95 ring-1 ring-slate-300/70 bg-slate-200/50 hover:bg-slate-200/75 text-slate-800 font-bold shadow-xs",
        secondary:
          "bg-slate-200/60 text-slate-800 hover:bg-slate-200/80 border border-white/90 font-semibold",
        ghost: "hover:bg-slate-200/50 text-slate-700 font-medium",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 text-xs font-semibold",
        sm: "h-8 text-xs gap-1.5 px-3.5",
        lg: "h-11 rounded-full px-6 text-sm font-semibold",
        xl: "h-12 rounded-full px-8 text-sm font-bold tracking-tight",
        xxl: "h-14 rounded-full px-10 text-base font-bold",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LiquidButtonExtraProps {
  glow?: boolean;
  beacon?: boolean;
  beaconText?: string;
}

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  glow = false,
  beacon = false,
  beaconText,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> &
  LiquidButtonExtraProps & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(
          "relative overflow-hidden group",
          liquidbuttonVariants({ variant, size, className }),
          glow && "ring-1 ring-slate-300/90 shadow-[0_8px_22px_-4px_rgba(15,23,42,0.14),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(15,23,42,0.08)]"
        )}
        {...props}
      >
        {/* Frosted Cloudy Translucent Specular Sheen */}
        <div
          className="absolute inset-0 z-0 h-full w-full rounded-full pointer-events-none transition-all duration-300 group-hover:brightness-105"
          style={{
            background:
              "linear-gradient(-75deg, rgba(255,255,255,0.45), rgba(255,255,255,0.82), rgba(241,245,249,0.55))",
            boxShadow:
              "inset 0 1.5px 2px rgba(255,255,255,0.98), inset 0 -1.5px 2px rgba(15,23,42,0.06)",
          }}
        />
        <div
          className="absolute inset-0 isolate -z-10 h-full w-full overflow-hidden rounded-full opacity-55 group-hover:opacity-85 transition-opacity pointer-events-none"
          style={{ backdropFilter: 'url("#container-glass")' }}
        />

        <div className="pointer-events-none relative z-10 flex items-center justify-center gap-2">
          {beacon && (
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
          {children}
          {beaconText && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/85 text-slate-800 font-bold border border-slate-300/80">
              {beaconText}
            </span>
          )}
        </div>
        <GlassFilter />
      </Comp>
    </>
  )
}

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
          />
          <feGaussianBlur stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

type ColorVariant =
  | "default"
  | "primary"
  | "success"
  | "error"
  | "gold"
  | "bronze";
 
export interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
}
 
const colorVariants: Record<
  ColorVariant,
  {
    outer: string;
    inner: string;
    button: string;
    textColor: string;
    textShadow: string;
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-white to-slate-300/90",
    inner: "bg-gradient-to-b from-white via-slate-100 to-slate-200/90",
    button: "bg-slate-200/75 backdrop-blur-xl",
    textColor: "text-[#14243A]",
    textShadow: "none",
  },
  primary: {
    outer: "bg-gradient-to-b from-white to-slate-300/90",
    inner: "bg-gradient-to-b from-white via-slate-100 to-slate-200/90",
    button: "bg-slate-200/75 backdrop-blur-xl",
    textColor: "text-[#14243A]",
    textShadow: "none",
  },
  success: {
    outer: "bg-gradient-to-b from-white to-emerald-200/90",
    inner: "bg-gradient-to-b from-white via-emerald-50 to-emerald-100/90",
    button: "bg-emerald-100/75 backdrop-blur-xl",
    textColor: "text-emerald-950",
    textShadow: "none",
  },
  error: {
    outer: "bg-gradient-to-b from-white to-rose-200/90",
    inner: "bg-gradient-to-b from-white via-rose-50 to-rose-100/90",
    button: "bg-rose-100/75 backdrop-blur-xl",
    textColor: "text-rose-950",
    textShadow: "none",
  },
  gold: {
    outer: "bg-gradient-to-b from-white to-amber-200/90",
    inner: "bg-gradient-to-b from-white via-amber-50 to-amber-100/90",
    button: "bg-amber-100/75 backdrop-blur-xl",
    textColor: "text-amber-950",
    textShadow: "none",
  },
  bronze: {
    outer: "bg-gradient-to-b from-white to-orange-200/90",
    inner: "bg-gradient-to-b from-white via-orange-50 to-orange-100/90",
    button: "bg-orange-100/75 backdrop-blur-xl",
    textColor: "text-orange-950",
    textShadow: "none",
  },
};
 
const metalButtonVariants = (
  variant: ColorVariant = "default",
  isPressed: boolean,
  isHovered: boolean,
  isTouchDevice: boolean,
) => {
  const colors = colorVariants[variant];
  const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";
 
  return {
    wrapper: cn(
      "relative inline-flex transform-gpu rounded-full p-[1.5px] will-change-transform",
      colors.outer,
    ),
    wrapperStyle: {
      transform: isPressed
        ? "translateY(1px) scale(0.98)"
        : "translateY(0) scale(1)",
      boxShadow: isPressed
        ? "0 1px 2px rgba(15, 23, 42, 0.08)"
        : isHovered && !isTouchDevice
          ? "0 8px 20px -4px rgba(15, 23, 42, 0.14)"
          : "0 6px 14px -4px rgba(15, 23, 42, 0.10)",
      transition: transitionStyle,
      transformOrigin: "center center",
    },
    inner: cn(
      "absolute inset-[1px] transform-gpu rounded-full will-change-transform",
      colors.inner,
    ),
    innerStyle: {
      transition: transitionStyle,
      transformOrigin: "center center",
      filter:
        isHovered && !isPressed && !isTouchDevice ? "brightness(1.03)" : "none",
    },
    button: cn(
      "relative z-10 m-[1px] rounded-full inline-flex h-10 transform-gpu cursor-pointer items-center justify-center overflow-hidden px-5 py-2 text-xs sm:text-sm font-bold will-change-transform outline-none select-none",
      colors.button,
      colors.textColor,
      colors.textShadow,
    ),
    buttonStyle: {
      transform: isPressed ? "scale(0.98)" : "scale(1)",
      transition: transitionStyle,
      transformOrigin: "center center",
    },
  };
};
 
const ShineEffect = ({ isPressed }: { isPressed: boolean }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300 rounded-full",
        isPressed ? "opacity-25" : "opacity-0",
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
};
 
export const MetalButton = React.forwardRef<
  HTMLButtonElement,
  MetalButtonProps
>(({ children, className, variant = "default", ...props }, ref) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
 
  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
 
  const buttonText = children || "Button";
  const variants = metalButtonVariants(
    variant,
    isPressed,
    isHovered,
    isTouchDevice,
  );
 
  return (
    <div className={variants.wrapper} style={variants.wrapperStyle}>
      <div className={variants.inner} style={variants.innerStyle}></div>
      <button
        ref={ref}
        className={cn(variants.button, className)}
        style={variants.buttonStyle}
        {...props}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsPressed(false);
          setIsHovered(false);
        }}
        onMouseEnter={() => {
          if (!isTouchDevice) setIsHovered(true);
        }}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
      >
        <ShineEffect isPressed={isPressed} />
        {buttonText}
        {isHovered && !isPressed && !isTouchDevice && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t rounded-full from-transparent to-white/25" />
        )}
      </button>
    </div>
  );
});
 
MetalButton.displayName = "MetalButton";
