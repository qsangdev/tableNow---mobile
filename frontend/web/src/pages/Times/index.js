import { Layout, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getTimes } from "../../API";

const Times = () => {
  const [loading, setLoading] = useState(false);
  const [times, setTimes] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      await getTimes().then((res) => {
        setTimes(res.shift);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Space direction="vertical">
      <Typography.Title level={4}>Times</Typography.Title>
      <Table
        loading={loading}
        dataSource={times}
        columns={[
          {
            title: "Shift",
            dataIndex: "id",
          },
          {
            title: "Time Start",
            dataIndex: "timeStart",
          },
          {
            title: "Time End",
            dataIndex: "timeEnd",
          },
          {
            title: "Availables Tables",
            dataIndex: "tables",
            render: (tables) => {
              return (
                <span>
                  {tables.filter((e) => e.status === "available").length}/
                  {tables.length}
                </span>
              );
            },
          },
        ]}
      ></Table>
    </Space>
  );
};

export default Times;
