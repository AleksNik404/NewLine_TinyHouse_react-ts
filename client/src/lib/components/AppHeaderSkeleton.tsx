import React from "react";
import { Header } from "antd/es/layout/layout";

import logo from "./assets/tinyhouse-logo.png";

const AppHeaderSkeleton = () => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <img src={logo} alt="App header" />
        </div>
      </div>
    </Header>
  );
};

export default AppHeaderSkeleton;
