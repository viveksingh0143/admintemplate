export type ColorTheme = 'dark' | 'light';
export type LayoutTheme = 'stacked' | 'sidebar';

export interface Theme {
    colorTheme: ColorTheme,
    layoutTheme: LayoutTheme
};

export type ThemeContextProps = {
    theme: Theme,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
};

export interface ThemeContextProviderProps {
    children: React.ReactNode
};
