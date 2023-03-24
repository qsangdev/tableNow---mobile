import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getMenu } from "../../API";

function Menu() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getMenu().then((res) => {
      setDataSource(res);
      setLoading(false);
    });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Menu</Typography.Title>
      <Table
        loading={loading}
        columns={[
          {
            title: "Image",
            dataIndex: "image",
            render: (link) => {
              return <Avatar size={70} src={link} />;
            },
          },
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => <span>${value}</span>,
          },
          {
            title: "Description",
            dataIndex: "description",
          },
          {
            title: "Discount",
            dataIndex: "discount",
            render: (value) => <span>{value}%</span>,
          },
        ]}
        dataSource={dataSource}
        pagination={{
          pageSize: 5,
        }}
      ></Table>
    </Space>
  );
}
export default Menu;
