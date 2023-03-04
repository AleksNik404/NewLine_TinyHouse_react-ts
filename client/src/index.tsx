import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";

import App from "./App";
import "./styles/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
  headers: {
    "X-CSRF-TOKEN": sessionStorage.getItem("token") || "",
  },
});

root.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  // </React.StrictMode>
);
