import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { ConfirmationProvider } from "./context/ConfirmationContext.tsx";
import { AppProvider } from "./context/AppProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme >
        <ConfirmationProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </ConfirmationProvider>
      </Theme>
    </Provider>
  </React.StrictMode>
);
