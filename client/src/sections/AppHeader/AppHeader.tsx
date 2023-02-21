import React from "react";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

import logo from "./assets/tinyhouse-logo.png";
import MenuItems from "./MenuItems";
import { Viewer } from "../../lib/gql/graphql";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const AppHeader = ({ viewer, setViewer }: Props) => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="App header" />
          </Link>
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};

export default AppHeader;
