import { makeAutoObservable } from "mobx";

const STORAGE_KEY = "theme";

type ThemeVariants = "dark" | "light";

let initColor: ThemeVariants = "light";

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    initColor = "dark";
}

const savedColor = localStorage.getItem(STORAGE_KEY);

if (savedColor) {
    initColor = savedColor as ThemeVariants;
}

export default class ThemeStore {
    currentTheme = initColor;
    setTheme(theme: ThemeVariants) {
        this.currentTheme = theme;
        localStorage.setItem(STORAGE_KEY, theme);
    }
    constructor() {
        makeAutoObservable(this);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === "dark" ? "light" : "dark";
        this.setTheme(newTheme);
    }
}
