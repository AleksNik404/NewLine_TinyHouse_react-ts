import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Layout } from "antd";

import logo from "./assets/tinyhouse-logo.png";
import MenuItems from "./MenuItems";
import { Viewer } from "../../lib/gql/graphql";
import { displayErrorMessage } from "../../lib/utils/utils";

const { Search } = Input;
const { Header } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const AppHeader = ({ viewer, setViewer }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const { pathname } = location;
    const allPaths = pathname.split("/");

    if (!pathname.includes("/listings")) {
      setSearch("");
    }

    if (pathname.includes("listings/") && allPaths.length === 3) {
      setSearch(allPaths[2]);
      return;
    }

    return () => {};
  }, [location]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      navigate(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="App header" />
          </Link>
        </div>
        <div className="app-header__search-input">
          <Search
            placeholder="Search 'San Fransisco'"
            enterButton
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
          />
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};

export default AppHeader;
