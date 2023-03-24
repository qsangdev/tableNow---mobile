import { Avatar, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getStaffs } from "../../API";

function Staffs() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getStaffs().then((res) => {
      setDataSource(res);
      setLoading(false);
    });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Staffs</Typography.Title>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "Photo",
            dataIndex: "photo",
            render: (link) => {
              return <Avatar size={70} src={link} />;
            },
          },
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Phone",
            dataIndex: "phone",
          },
          {
            title: "User Name",
            dataIndex: "userName",
          },
          {
            title: "Password",
            dataIndex: "password",
          },
        ]}
      ></Table>
    </Space>
  );
}
export default Staffs;
