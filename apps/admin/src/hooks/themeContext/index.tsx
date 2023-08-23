import { EncryptionConstant } from '@configs/constants/encryption';
import { ColorThemes } from '@configs/constants/themeConstant';
import { Theme, LayoutTheme, ThemeContextProps, ThemeContextProviderProps } from '@ctypes/contexts/themeContextTypes';
import { useEncryptedState } from '@hooks/useEncryptedState';
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext<ThemeContextProps | null>(null);

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [theme, setTheme] = useEncryptedState<Theme>("pref-theme", { colorTheme: "Default", hasColorBg: false }, EncryptionConstant.secret);
    const [layout, setLayout] = useEncryptedState<LayoutTheme>("pref-layout", "sidebar", EncryptionConstant.secret);
    
    useEffect(() => {
        const allThemeKeys = Object.values(ColorThemes).map(theme => theme.key).filter(key => key !== "");
        document.documentElement.classList.remove(...allThemeKeys);

        const newTheme = ColorThemes[theme.colorTheme];
        if (newTheme && newTheme.key) {
            document.documentElement.classList.add(newTheme.key);
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
