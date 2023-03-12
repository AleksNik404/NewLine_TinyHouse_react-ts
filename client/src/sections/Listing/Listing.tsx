import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Content } from "antd/es/layout/layout";

import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries/Listing";
import ListingDetails from "./components/ListingDetails";
import { Col, Row } from "antd";
import { ListingBookings } from "./components/ListingBookings";
import { ListingCreateBooking } from "./components/ListingCreateBooking";
import { Dayjs } from "dayjs";
import { Viewer } from "../../lib/gql/graphql";
import ListingCreateBookingModal from "./components/ListingCreateBookingModal";

const PAGE_LIMIT = 3;

interface Props {
  viewer: Viewer;
}

const Listing = ({ viewer }: Props) => {
  const { id = "" } = useParams();
  const [bookingsPage, setBookingsPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);

  const { loading, data, error } = useQuery(LISTING, {
    variables: {
      id: id,
      bookingsPage,
      limit: PAGE_LIMIT,
    },
  });

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }
  if (error) {
    console.log(error);

    return (
      <Content className="listings">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing && <ListingDetails listing={listing} />;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const listingCreateBookingModalElement = listing &&
    checkInDate &&
    checkOutDate && (
      <ListingCreateBookingModal
        price={listing.price}
        modalVisible={modalVisible}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        setModalVisible={setModalVisible}
      />
    );

  const listingCreateBookingElement = listing && (
    <ListingCreateBooking
      viewer={viewer}
      host={listing.host}
      bookingsIndex={listing.bookingsIndex}
      price={listing.price}
      checkInDate={checkInDate}
      setCheckInDate={setCheckInDate}
      checkOutDate={checkOutDate}
      setCheckOutDate={setCheckOutDate}
      setModalVisible={setModalVisible}
    />
  );

  return (
    <Content className="listings">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
      {listingCreateBookingModalElement}
    </Content>
  );
};

export default Listing;
