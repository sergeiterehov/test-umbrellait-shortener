import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppShortener } from "./AppShortener";

const root = document.getElementById("app-shortener") as HTMLElement;

ReactDOM.render(<AppShortener />, root);
