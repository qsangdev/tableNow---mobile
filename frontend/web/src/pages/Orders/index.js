import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Layout, Space, Statistic, Table, Typography, Spin } from "antd";
import { useEffect, useState } from "react";
import { getBills } from "../../API";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Orders() {
  const [orders, setOrders] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    await getBills().then((res) => {
      setOrders(res);
      setRevenue(res);
      setCustomers(res);
    });
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  function calculateSum(array, property) {
    const total = array.reduce((accumulator, object) => {
      return accumulator + object[property];
    }, 0);

    return total;
  }

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Orders</Typography.Title>
      {loading === true ? (
        <Spin />
      ) : (
        <Space direction="horizontal">
          <DashboardCard
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0,255,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  width: "52px",
                }}
              />
            }
            title={"Booked Tables"}
            value={orders.length}
          />

          <DashboardCard
            icon={
              <UserOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  width: "52px",
                }}
              />
            }
            title={"Customers"}
            value={calculateSum(customers, "people")}
          />
          <DashboardCard
            icon={
              <DollarCircleOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  width: "52px",
                }}
              />
            }
            title={"Revenue"}
            value={`$${calculateSum(revenue, "totalDiscounted")}`}
          />
        </Space>
      )}

      <Layout>
        <RecentOrders />
      </Layout>
      <DashboardChart />
    </Space>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBills().then((res) => {
      setDataSource(res.splice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Typography.Text>Recent Orders</Typography.Text>
      <Table
        columns={[
          {
            title: "Time",
            dataIndex: "time",
          },
          {
            title: "Peoples",
            dataIndex: "people",
          },
          {
            title: "Dish",
            dataIndex: "dish",
            render: (dish) => {
              return (
                <span style={{ flexDirection: "column", display: "flex" }}>
                  {dish.map((e) => (
                    <span>● {e.title}</span>
                  ))}
                </span>
              );
            },
          },
          {
            title: "Total Discounted",
            dataIndex: "totalDiscounted",
            render: (total) => {
              return <span>${total}</span>;
            },
          },
        ]}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
      ></Table>
    </>
  );
}

function DashboardChart() {
  const [reveneuData, setReveneuData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getBills().then((res) => {
      const labels = res.map((cart) => {
        return `User-${cart.id}`;
      });
      const data = res.map((cart) => {
        return cart.totalDiscounted;
      });

      const dataSource = {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: data,
            backgroundColor: "rgba(255, 0, 0, 1)",
          },
        ],
      };

      setReveneuData(dataSource);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Order Revenue",
      },
    },
  };

  return (
    <Card style={{ width: 600, height: 300, marginBottom: 20 }}>
      <Bar options={options} data={reveneuData} />
    </Card>
  );
}
export default Orders;
