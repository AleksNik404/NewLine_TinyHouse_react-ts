import React from "react";
import { List, Typography } from "antd";
import { ListingCard } from "../../../lib/components";
import { QueryQuery } from "../../../lib/gql/graphql";

interface Props {
  title: string;
  listings: QueryQuery["listings"]["result"];
}

const { Title } = Typography;

export const HomeListings = ({ title, listings }: Props) => {
  return (
    <div className="home-listings">
      <Title level={4} className="home-listings__title">
        {title}
      </Title>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          xl: 3,
          xxl: 4,
        }}
        dataSource={listings}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  );
};
