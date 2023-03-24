import { StarFilled } from "@ant-design/icons";
import { Card, Layout, List, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getRating } from "../../API";

const Ratings = () => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      await getRating().then((res) => {
        setRating(res);
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
      <Typography.Title level={3}>Rating</Typography.Title>
      <List
        grid={{
          xs: 1,
          sm: 1.5,
          md: 2,
          lg: 3,
          xl: 3.5,
          xxl: 4,
        }}
        loading={loading}
        dataSource={rating}
        renderItem={(e) => {
          return (
            <Card
              size="small"
              title={e.name}
              key={e.id}
              style={{ margin: 10, width: "200px", height: "180px" }}
            >
              <p
                style={{
                  backgroundColor: "#F5F5F5",
                  textAlign: "center",
                  fontSize: 20,
                  borderRadius: 10,
                }}
              >
                {e.star === 5 && (
                  <>
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                  </>
                )}
                {e.star === 4 && (
                  <>
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                  </>
                )}
                {e.star === 3 && (
                  <>
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                  </>
                )}
                {e.star === 2 && (
                  <>
                    <StarFilled style={{ color: "#FFD700" }} />
                    <StarFilled style={{ color: "#FFD700" }} />
                  </>
                )}
                {e.star === 1 && (
                  <>
                    <StarFilled style={{ color: "#FFD700" }} />
                  </>
                )}
              </p>
              <p>{e.comment}</p>
            </Card>
          );
        }}
      ></List>
    </Space>
  );
};

export default Ratings;
