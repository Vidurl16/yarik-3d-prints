"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  hoverColor?: string;
  defaultColor?: string;
};

export default function HoverLink({ hoverColor, defaultColor, style, ...props }: Props) {
  return (
    <Link
      {...props}
      style={{ color: defaultColor, ...style }}
      onMouseOver={(e) => {
        if (hoverColor) e.currentTarget.style.color = hoverColor;
      }}
      onMouseOut={(e) => {
        if (defaultColor) e.currentTarget.style.color = defaultColor;
      }}
    />
  );
}
