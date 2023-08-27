import { ColorThemes } from "@configs/constants/themeConstant";

export type ColorTheme = keyof typeof ColorThemes;
  
// export type ColorTheme = "Root" | "Classic Corporate" | "Tropical Sunset" | "Gentle Breeze" | "Forest Green";
export type LayoutTheme = 'stacked' | 'sidebar';

export interface SessionUser {
    name: string;
    staff_id: string;
}

export type Theme = {
    colorTheme: ColorTheme;
    hasColorBg: Boolean;
};

export type ThemeContextProps = {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
    layout: LayoutTheme;
    setLayout: React.Dispatch<React.SetStateAction<LayoutTheme>>;
    sessionUser: SessionUser;
    setSessionUser: React.Dispatch<React.SetStateAction<SessionUser>>;
};

export interface ThemeContextProviderProps {
    children: React.ReactNode
};
