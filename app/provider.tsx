"use client";

import { Provider } from "react-redux";
import { PersistGate } from "reduxjs-toolkit-persist/integration/react";
// import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "../store/store";
// import NavBar from "./NavBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        // loading={<h1>Loading</h1>}
      >
        {/* {() => <body className="bg-stone-200 h-[100%]">{children}</body>} */}
        {() => children}
      </PersistGate>
    </Provider>
  );
}
