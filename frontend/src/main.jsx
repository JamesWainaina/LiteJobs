import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./Router/Router";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);