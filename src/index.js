import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faChevronLeft,
  faTrashAlt,
  faCheckDouble
} from "@fortawesome/free-solid-svg-icons";
import "typeface-roboto";
import App from "./App";

library.add(faPlus, faChevronLeft, faTrashAlt, faCheckDouble);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
