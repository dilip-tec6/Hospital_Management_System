import { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("archzen-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("archzen-theme", theme);
  }, [theme]);

  return [theme, setTheme];
}