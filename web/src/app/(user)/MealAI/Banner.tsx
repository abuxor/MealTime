import React from "react";
import { Card, CardHeader, CardHeaderProps } from "@/components/card";
import { SparklesIcon } from "@/components/icons";
export interface BannerProps extends CardHeaderProps {}

export function Banner({ children, ...props }: BannerProps) {
  return (
    <Card className="mb-2 bg-rose-100">
      <CardHeader
        leftSlot={<SparklesIcon className="w-16 h-16 text-green-500" />}
        {...props}
        textSize="xl"
      >
        {children}
      </CardHeader>
    </Card>
  );
}
