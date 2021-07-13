import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import "./index.css";
import "inter-ui/inter.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { StoreProvider } from "./components";

ReactDOM.render(
    <StoreProvider>
        <HashRouter>
            <App />
        </HashRouter>
    </StoreProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
