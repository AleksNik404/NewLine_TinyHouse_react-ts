import { useQuery } from "@apollo/client";
import { Layout, List, Typography } from "antd";

import { ListingsFilter } from "../../lib/gql/graphql";
import { LISTINGS } from "../../lib/graphql/queries/Listings";
import { ListingCard } from "../../lib/components";
import { Link, useParams } from "react-router-dom";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 8;

const Listings = () => {
  const { location } = useParams();
  const { data } = useQuery(LISTINGS, {
    variables: {
      // location,
      filter: ListingsFilter.PriceLowToHigh,
      limit: PAGE_LIMIT,
      page: 1,
    },
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <List
        grid={{
          gutter: 8,

          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={listings.result}
        renderItem={(listing) => (
          <List.Item style={{ padding: "2px 4px" }}>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    ) : (
      <div>
        <Paragraph>
          It appears that no listings have yet been created for{" "}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to create a{" "}
          <Link to="/host">listing in this area</Link>!
        </Paragraph>
      </div>
    );

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Title>
  ) : null;

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};

export default Listings;
