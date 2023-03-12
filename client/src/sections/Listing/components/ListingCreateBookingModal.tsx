import React from "react";
import { Button, Divider, Modal, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { formatListingPrice } from "../../../lib/utils/utils";
import { KeyOutlined } from "@ant-design/icons";
import { CardElement, useStripe } from "@stripe/react-stripe-js";

interface Props {
  price: number;
  modalVisible: boolean;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
  price,
  modalVisible,
  checkInDate,
  checkOutDate,
  setModalVisible,
}: Props) => {
  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const listingPrice = price * daysBooked;

  // const stripe = useStripe();

  // const handleCreateBooking = async () => {
  //   if (!stripe) {
  //     return;
  //   }

  //   // let { token: stripeToken } = await stripe.createToken(StripeCard);
  //   // console.log(stripeToken);
  // };

  return (
    <Modal
      open={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-boooking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title level={3} className="listing-boooking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{" "}
            <Text mark strong>
              {dayjs(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
            and{" "}
            <Text mark strong>
              {dayjs(checkOutDate).format("MMMM Do YYYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          {/* <CardElement className="listing-booking-modal__stripe-card" /> */}
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            // onClick={handleCreateBooking}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ListingCreateBookingModal;
