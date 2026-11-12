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
    md: 'py-2.5 px-5 text-xs sm:text-sm font-semibold',
    lg: 'py-3.5 px-7 text-sm sm:text-base font-bold',
    xl: 'py-4 px-9 text-base sm:text-lg font-bold',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative group inline-flex items-center justify-center gap-2.5
        text-slate-950 font-bold
        rounded-2xl
        bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400
        hover:from-teal-300 hover:via-cyan-200 hover:to-teal-300
        cursor-pointer
        select-none
        whitespace-nowrap shrink-0
        shadow-[0_8px_25px_rgba(45,212,191,0.4)]
        hover:shadow-[0_12px_32px_rgba(45,212,191,0.55)]
        active:scale-[0.97] active:translate-y-0.5
        transition-all duration-150 ease-out
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
      ) : icon ? (
        <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</span>
      ) : null}
      <span className="relative z-10 drop-shadow-sm">{children}</span>
    </button>
  );
};
