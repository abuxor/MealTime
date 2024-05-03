import { ReactNode } from "react";
import { BulbIcon } from "@/components/icons";
export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  textSize?: "sm" | "md" | "lg" | "xl" | "3xl";
  children?: ReactNode;
  leftSlot?: ReactNode;
}

export function CardHeader({
  title,
  leftSlot,
  subtitle,
  children,
  textSize = "md",
}: CardHeaderProps) {
  return (
    <header className="px-5 py-4 border-b border-slate-100">
      <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
        <div className="flex items-center gap-2 flex-row">
          {leftSlot}
          {title && (
            <div>
              <h2 className={`font-semibold text-slate-800 text-${textSize}`}>
                {title}
              </h2>
              {subtitle && <p className={`prose-sm`}>{subtitle}</p>}
            </div>
          )}
        </div>

        {children && (
          <div className={`w-full ${title ? "md:w-fit" : ""} `}>{children}</div>
        )}
      </div>
    </header>
  );
}
