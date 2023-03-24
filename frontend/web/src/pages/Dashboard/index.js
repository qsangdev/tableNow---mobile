import {
  AlertOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Image,
  Input,
  Layout,
  List,
  Space,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { getDashboard, getTimes } from "../../API";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    setLoading(true);
    getDashboard().then((res) => {
      setDataSource(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getTimes().then((res) => {
      setTimes(res);
      setLoading(false);
    });
  }, []);

  return (
    <Space direction="vertical">
      <Layout>
        <Typography.Title level={3}>Images</Typography.Title>

        <List
          loading={loading}
          dataSource={dataSource.images}
          grid={{
            xs: 1,
            sm: 1.5,
            md: 2,
            lg: 3,
            xl: 3.5,
            xxl: 4,
          }}
          renderItem={(e) => {
            return (
              <Card key={e.id} style={{ margin: 10 }}>
                <Image src={e.src}></Image>
              </Card>
            );
          }}
        ></List>
        <Upload>
          <Button>Click to Upload</Button>
        </Upload>
      </Layout>
      <Layout style={{ marginBottom: 20 }}>
        <Typography.Title level={3}>Infomation</Typography.Title>
        <Card
          title="Name"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Typography.Title level={4}>
            <AlertOutlined
              style={{
                color: "brown",
              }}
            />{" "}
            {dataSource.name}
          </Typography.Title>
        </Card>
        <Card
          title="Opening Time"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Typography.Title level={4}>
            <FieldTimeOutlined style={{ color: "brown" }} /> {times.open_time} -{" "}
            {times.close_time}
          </Typography.Title>
        </Card>
        <Card
          title="Location"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Typography.Title level={4}>
            <EnvironmentOutlined
              style={{
                color: "brown",
              }}
            />{" "}
            {dataSource.location}
          </Typography.Title>
        </Card>
        <Card
          title="Description"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Typography.Title level={4}>
            <InfoCircleOutlined
              style={{
                color: "brown",
              }}
            />{" "}
            {dataSource.description}
          </Typography.Title>
        </Card>
      </Layout>
    </Space>
  );
};

export default Dashboard;
