import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useSearchParams } from "react-router-dom";
import { Col, Layout, Row } from "antd";

import { USER } from "../../lib/graphql/queries/User";
import { Viewer } from "../../lib/gql/graphql";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import UserProfile from "./UserProfile";
import UserListings from "./UserListings";
import UserBookings from "./UserBookings";

const { Content } = Layout;
const PAGE_LIMIT = 4;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const User = ({ viewer, setViewer }: Props) => {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();

  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error, refetch } = useQuery(USER, {
    variables: {
      id,
      bookingsPage,
      listingsPage,
      limit: PAGE_LIMIT,
    },
  });

  const handleUserRefetch = async () => {
    await refetch();
  };

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === id;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const userProfileElement = user && (
    <UserProfile
      user={user}
      viewerIsUser={viewerIsUser}
      viewer={viewer}
      setViewer={setViewer}
      handleUserRefetch={handleUserRefetch}
    />
  );

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  ) : null;

  const userBookingsElement = userListings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const stripeError = searchParams.get("stripe_error");
  const stripeErrorBanner = stripeError ? (
    <ErrorBanner description="We had an issue connecting with Stripe. Please try again soon." />
  ) : null;

  if (loading)
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  if (error)
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we`ve encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );

  return (
    <Content className="user">
      {stripeErrorBanner}
      <Row gutter={12}>
        <Col xs={24}>{userProfileElement}</Col>
        {/* <Col xs={24}>
          {userListingsElement}
          {userBookingsElement}
        </Col> */}
        <Col xs={24}>{userListingsElement}</Col>
        <Col xs={24}>{userBookingsElement}</Col>
      </Row>
    </Content>
  );
};

export default User;
