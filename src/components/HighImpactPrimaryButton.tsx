import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { backendGateway } from '../services/backendGateway';

interface HighImpactPrimaryButtonProps {
  children: React.ReactNode;
  actionName?: string;
  payload?: Record<string, unknown>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  className?: string;
  size?: 'md' | 'lg' | 'xl';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const HighImpactPrimaryButton: React.FC<HighImpactPrimaryButtonProps> = ({
  children,
  actionName,
  payload,
  onClick,
  className = '',
  size = 'lg',
  disabled = false,
  type = 'button',
  icon,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    if (onClick) {
      const result = onClick(e);
      if (result instanceof Promise) {
        setIsLoading(true);
        try {
          await result;
        } finally {
          setIsLoading(false);
        }
      }
      return;
    }

    // Default behavior if actionName is specified: dispatch to User Backend Gateway
    if (actionName) {
      setIsLoading(true);
      try {
        await backendGateway.dispatchAction(actionName, payload || { trigger: 'button_click', time: Date.now() });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sizeClasses = {
    md: 'py-2.5 px-6 text-sm',
    lg: 'py-3.5 px-8 text-base tracking-wide',
    xl: 'py-4 px-10 text-lg font-bold tracking-wide',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative group inline-flex items-center justify-center gap-3
        font-semibold text-slate-950
        rounded-2xl
        bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400
        bg-[length:200%_auto]
        hover:bg-right
        cursor-pointer
        select-none
        whitespace-nowrap shrink-0
        /* Multi-layered deep drop shadow */
        shadow-[0_12px_30px_-5px_rgba(6,182,212,0.48),0_4px_14px_rgba(6,182,212,0.28)]
        hover:shadow-[0_18px_38px_-4px_rgba(6,182,212,0.65),0_6px_20px_rgba(6,182,212,0.4)]
        /* Press collapse animation */
        active:scale-[0.96] active:translate-y-0.5 active:shadow-[0_6px_16px_rgba(6,182,212,0.35)]
        transition-all duration-200 ease-out
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        /* Glass reflection highlight on top edge */
        overflow-hidden
        before:absolute before:inset-x-0 before:top-0 before:h-[1.5px]
        before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent
        before:z-10
        /* Subtle inner gradient shimmer */
        after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-white/20 after:to-transparent after:pointer-events-none
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
      ) : icon ? (
        <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
