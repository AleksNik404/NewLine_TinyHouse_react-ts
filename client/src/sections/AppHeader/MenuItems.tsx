import React from "react";
import { Menu, Button, MenuProps, Avatar } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Viewer } from "../../lib/gql/graphql";
import { useMutation } from "@apollo/client";
import { LOG_OUT } from "../../lib/graphql/mutations/LogOut";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils/utils";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut, { loading, error }] = useMutation(LOG_OUT, {
    onCompleted: (data) => {
      if (data?.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You`ve successfully logged out!");
      }
    },
    onError: (data) => {
      displayErrorMessage(
        "Sorry, We weren`t able to log you out. Please try again later!"
      );
    },
  });

  const handleLogOut: MenuProps["onClick"] = (e) => {
    if (e.key !== "/logout") return;
    logOut();
  };

  const items = viewer?.avatar
    ? [
        getItem(<Link to="/host">Host</Link>, "/host", <HomeOutlined />),
        getItem(<Avatar src={viewer.avatar} />, "SubMenu", null, [
          getItem(
            <Link to={`/user/${viewer.id}`}>Profile</Link>,
            "/user",
            <UserOutlined />
          ),
          getItem("Log out", "/logout", <LogoutOutlined />),
        ]),
      ]
    : [
        getItem(<Link to="/host">Host</Link>, "/host", <HomeOutlined />),
        getItem(
          <Link to="/login">
            <Button type="primary">Sign In</Button>
          </Link>,
          "/login"
        ),
      ];

  return (
    <Menu
      mode="horizontal"
      onClick={handleLogOut}
      selectable={false}
      className="menu"
      items={items}
    />
  );
};

export default MenuItems;

// const subMenuLogin =
//   viewer.id && viewer.avatar ? (
//     <SubMenu title={<Avatar src={viewer.avatar} />}>
//       <Item key="/user">
//         <Link to={`/user/${viewer.id}`}>
//           <UserOutlined />
//           Profile
//         </Link>
//       </Item>
//       <Item key="/logout">
//         <div onClick={handleLogOut}>
//           <LogoutOutlined />
//           Log out
//         </div>
//       </Item>
//     </SubMenu>
//   ) : (
//     <Item key="login">
//       <Link to="/login">
//         <Button type="primary">Sign In</Button>
//       </Link>
//     </Item>
//   );

// return (
//   <Menu mode="horizontal" selectable={false} className="menu">
//     <Item key="/host">
//       <Link to="/host">
//         <HomeOutlined />
//         Host
//       </Link>
//     </Item>
//     {subMenuLogin}
//   </Menu>
// );
