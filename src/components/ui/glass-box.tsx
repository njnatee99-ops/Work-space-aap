import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'frosted' | 'subtle';
  interactive?: boolean;
  className?: string;
}

/**
 * GlassBox — กล่องข้อความและการ์ดคอนเทนเนอร์ 3D Liquid Prismatic Glass
 * ดัดแปลงจากเทคนิค Conic-Gradient Specular Rim, Ambient Shadow และ Frosted Blur
 * ตามสเปกที่ผู้ใช้ส่งมา เพื่อสร้างกล่องการ์ดและเมนูที่มีมิติ ไม่แบน และไม่กลืนกับปุ่ม
 */
export const GlassBox = React.forwardRef<HTMLDivElement, GlassBoxProps>(
  ({ children, variant = 'default', interactive = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-box-wrap relative rounded-3xl transition-all duration-300",
          interactive && "hover:-translate-y-1 cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Soft Depth Ambient Shadow underneath */}
        <div
          className={cn(
            "glass-box-shadow absolute inset-0 rounded-3xl pointer-events-none -z-10 transition-all duration-300",
            variant === 'highlight'
              ? "shadow-[0_20px_50px_-10px_rgba(37,99,235,0.22),0_8px_20px_-4px_rgba(20,50,90,0.1)]"
              : "shadow-[0_16px_40px_-12px_rgba(20,40,80,0.08),0_4px_12px_-2px_rgba(20,40,80,0.03)]"
          )}
        />

        {/* The Main Prismatic Glass Container */}
        <div
          className={cn(
            "glass-box relative rounded-3xl overflow-hidden backdrop-blur-2xl transition-all duration-300",
            // Variant styling
            variant === 'default' && "bg-white/85 dark:bg-slate-900/85 border border-white/95 dark:border-slate-800 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.03)]",
            variant === 'highlight' && "bg-white/90 dark:bg-slate-900/90 border-2 border-blue-400/80 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_0_28px_rgba(59,130,246,0.18)] ring-1 ring-blue-300/40",
            variant === 'frosted' && "bg-white/75 dark:bg-slate-900/75 border border-white/80 dark:border-slate-800 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95)]",
            variant === 'subtle' && "bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800"
          )}
        >
          {/* Prismatic Specular Sheen Layer */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl opacity-60 mix-blend-overlay"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.4) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

GlassBox.displayName = "GlassBox";
export default GlassBox;
