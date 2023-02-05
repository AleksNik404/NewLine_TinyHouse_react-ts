import { Layout } from "antd";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Home,
  Host,
  Listing,
  Listings,
  Login,
  NotFound,
  User,
} from "./sections";

const App = () => {
  return (
    <Router>
      <Layout id="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="listings/:location?" element={<Listings />} />
          <Route path="/login" element={<Login />} />
          <Route path="user/:id" element={<User />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
