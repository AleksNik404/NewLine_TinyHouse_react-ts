import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Affix, Layout, Spin } from "antd";

import { Viewer } from "./lib/gql/graphql";
import { AppHeader, Home, Host, Listing, Stripe } from "./sections";
import { Listings, Login, NotFound, User } from "./sections";
import { useMutation } from "@apollo/client";
import { LOG_IN } from "./lib/graphql/mutations/Login";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState(initialViewer);
  const [logIn, { error }] = useMutation(LOG_IN, {
    // После запроса вытаскиваем данные пользователя
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else sessionStorage.removeItem("token");
      }
    },
  });

  const logInRef = useRef(logIn);

  // При рендеринге, авторизация с проверкой токена из куков или гугл сервис
  useEffect(() => {
    logInRef.current();
  }, []);

  // Пока идет запрос, отображать крутящийся спинер и шапку сайта
  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton" id="app">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Tinyhouse" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error && (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  );

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="host" element={<Host viewer={viewer} />} />
          <Route path="listing/:id" element={<Listing viewer={viewer} />} />

          <Route path="listings/:location?" element={<Listings />} />
          <Route path="login" element={<Login setViewer={setViewer} />} />
          <Route
            path="stripe"
            element={<Stripe viewer={viewer} setViewer={setViewer} />}
          />
          <Route
            path="user/:id"
            element={<User viewer={viewer} setViewer={setViewer} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
