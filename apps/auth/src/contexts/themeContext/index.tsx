import { Theme, ThemeContextProps, ThemeContextProviderProps } from '@ctypes/contexts/themeContextTypes';
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext<ThemeContextProps | null>(null);

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [theme, setTheme] = useState<Theme>({
        colorTheme: 'light',
        layoutTheme: 'sidebar'
    })

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
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
