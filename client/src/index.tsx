import { ApolloClient, ApolloProvider } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import React from "react";
import ReactDOM from "react-dom/client";
import { setContext } from "@apollo/client/link/context";

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// Пометки для сохранения
//
// const client = new ApolloClient({
//   uri: "/api",
//   cache: new InMemoryCache(),
//   headers: {
//     "X-CSRF-TOKEN": sessionStorage.getItem("token") || "",
//   },
// });

// request: async (operation) => {
//   const token = sessionStorage.getItem("token");
//   operation.setContext({
//     headers: {
//       "X-CSRF-TOKEN": sessionStorage.getItem("token") || "",
//     },
//   });
// },

// const setAuthorizationLink = setContext((request) => ({
//   headers: { authorization: "1234" },
// }));
