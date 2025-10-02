import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // default to dark if nothing saved
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("aiops_theme") || "dark";
        } catch (e) {
            return "dark";
        }
    });

    useEffect(() => {
        const cls = theme === "dark" ? "theme-dark" : "theme-neon";
        // remove both known classes, then add the chosen
        document.body.classList.remove("theme-dark", "theme-neon");
        document.body.classList.add(cls);

        try {
            localStorage.setItem("aiops_theme", theme);
        } catch (e) {
            // ignore localStorage errors
        }

        console.log("✅ Theme applied:", cls);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
