import {
  FieldTimeOutlined,
  HomeOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Dashboard",
            icon: <HomeOutlined />,
            key: "/",
          },
          {
            label: "Menu",
            key: "/menu",
            icon: <MenuOutlined />,
          },
          {
            label: "Orders",
            key: "/orders",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Times",
            key: "/times",
            icon: <FieldTimeOutlined />,
          },
          {
            label: "Staffs",
            key: "/staffs",
            icon: <UsergroupAddOutlined />,
          },
          {
            label: "Ratings",
            key: "/ratings",
            icon: <StarOutlined />,
          },
        ]}
      ></Menu>
    </div>
  );
}
export default SideMenu;
