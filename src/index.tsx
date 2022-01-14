import "inter-ui/inter.css";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { StoreProvider } from "./components";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
    <StoreProvider>
        <HashRouter>
            <DndProvider options={HTML5toTouch}>
                <App />
            </DndProvider>
        </HashRouter>
    </StoreProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
