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
    constructor() {
        makeAutoObservable(this);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === "dark" ? "light" : "dark";
        this.currentTheme = newTheme;
        localStorage.setItem(STORAGE_KEY, newTheme);
    }
}
