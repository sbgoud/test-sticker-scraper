import { createContext, FC } from "react";
import RootStore from "../store/RootStore";

export const store = new RootStore();

(window as any).rootStore = store;

export const StoreContext = createContext(store);

export const StoreProvider: FC = ({ children }) => (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
