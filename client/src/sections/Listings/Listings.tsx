import React from "react";
import { useQuery } from "@apollo/client";
import { Affix, Layout, List, Typography } from "antd";

import { ListingsFilter } from "../../lib/gql/graphql";
import { LISTINGS } from "../../lib/graphql/queries/Listings";
import { ErrorBanner, ListingCard } from "../../lib/components";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ListingsFilters,
  ListingsPagination,
  ListingsSkeleton,
} from "./components";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 8;

const Listings = () => {
  const [filter, setFilter] = useState(ListingsFilter.PriceLowToHigh);
  const [page, setPage] = useState(1);

  const { location } = useParams();
  const locationRef = React.useRef(location);

  const { data, loading, error } = useQuery(LISTINGS, {
    // У нас 2 запроса при смене url и сброса страницы. (Судя по курсу, но не dev тулсу)
    // Мы скипаем запрос, если изменился url и страница не 1. Ибо Сработает useEffect на сброс тсраницы
    skip: locationRef.current !== location && page !== 1,
    variables: {
      //Отключено ибо не сделан Google geo функционал. Там подписка.
      // location,
      filter,
      limit: PAGE_LIMIT,
      page,
    },
    // fetchPolicy: "no-cache",
  });

  useEffect(() => {
    setPage(1);
    locationRef.current = location;
  }, [location]);

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords." />
        <ListingsSkeleton />
      </Content>
    );
  }

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <div>
            <ListingsPagination
              total={listings.total}
              page={page}
              limit={PAGE_LIMIT}
              setPage={setPage}
            />
            <ListingsFilters filter={filter} setFilter={setFilter} />
          </div>
        </Affix>
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
      </div>
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
