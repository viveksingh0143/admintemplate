import { Theme, ColorTheme, LayoutTheme, ThemeContextProps, ThemeContextProviderProps } from '@ctypes/contexts/themeContextTypes';
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext<ThemeContextProps | null>(null);

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [theme, setTheme] = useState<Theme>({ colorTheme: "Tropical Sunset", hasColorBg: false });
    const [layout, setLayout] = useState<LayoutTheme>("sidebar");


    useEffect(() => {
        document.documentElement.classList.remove("classic-corporate", "tropical-sunset", "gentle-breeze", "forest-green");
        if (theme.colorTheme === "Classic Corporate") {
            document.documentElement.classList.add('classic-corporate');
        } else if (theme.colorTheme === 'Tropical Sunset') {
            document.documentElement.classList.add('tropical-sunset');
        } else if (theme.colorTheme === 'Gentle Breeze') {
            document.documentElement.classList.add('gentle-breeze');
        } else if (theme.colorTheme === 'Forest Green') {
            document.documentElement.classList.add('forest-green');
        }
      }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, layout, setLayout }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeContextProvider");
    }
    return context;
}
