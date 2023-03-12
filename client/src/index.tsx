import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { loadStripe } from "@stripe/stripe-js";

import App from "./App";
import "./styles/index.css";
import { Elements } from "@stripe/react-stripe-js";

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

const stripePromise = loadStripe(
  process.env.REACT_APP_S_PUBLISHABLE_KEY as string
);

const options = {
  clientSecret:
    "sk_test_51LyWOlDxfGcC4t7WBZXNNzFW0UopYok8CpMhW8mSbEsByKRfr9QtcHKhww5ls2iV9AlUFXfOPbQt6YOGnBXQPsVM00VAoeSb4c",
};

root.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    {/* <Elements stripe={stripePromise} options={options}> */}
    <App />
    {/* </Elements> */}
  </ApolloProvider>
  // </React.StrictMode>
);
