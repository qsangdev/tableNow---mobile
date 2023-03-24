import { PoweroffOutlined } from "@ant-design/icons";
import { Button, Image, Space, Typography } from "antd";
import logo from "../../assets/logo.png";

function AppHeader() {
  return (
    <div className="AppHeader">
      <Image width={100} src={logo}></Image>
      <Typography.Title>Table Now</Typography.Title>
      <Space>
        <Button danger>
          <PoweroffOutlined />
          Sign Out
        </Button>
      </Space>
    </div>
  );
}
export default AppHeader;
