import { EncryptionConstant } from '@configs/constants/encryption';
import { ColorThemes } from '@configs/constants/themeConstant';
import { Theme, LayoutTheme, ThemeContextProps, ThemeContextProviderProps, SessionUser } from '@ctypes/contexts/themeContextTypes';
import { useLocalStorageState } from '@hooks/useLocalStorageState';
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext<ThemeContextProps | null>(null);

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [theme, setTheme] = useLocalStorageState<Theme>("pref-theme", { colorTheme: "Default", hasColorBg: false });
    const [layout, setLayout] = useLocalStorageState<LayoutTheme>("pref-layout", "sidebar");
    const [sessionUser, setSessionUser] = useLocalStorageState<SessionUser>("minfo", { name: "", staff_id: "" }, EncryptionConstant.secret);
    
    useEffect(() => {
        const allThemeKeys = Object.values(ColorThemes).map(theme => theme.key).filter(key => key !== "");
        document.documentElement.classList.remove(...allThemeKeys);

        const newTheme = ColorThemes[theme.colorTheme];
        if (newTheme && newTheme.key) {
            document.documentElement.classList.add(newTheme.key);
        }
      }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, layout, setLayout, sessionUser, setSessionUser }}>
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
