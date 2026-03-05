"use client";

import { createContext, useContext } from "react";
import type { ThemeId, ThemeTokens } from "./themes";
import { THEMES } from "./themes";

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: "dexarium",
  theme: THEMES.dexarium,
});

export function ThemeProvider({
  themeId,
  children,
}: {
  themeId: ThemeId;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={{ themeId, theme: THEMES[themeId] }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook — consume inside client components to read current theme tokens */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
