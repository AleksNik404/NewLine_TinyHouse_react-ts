import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import {
  displayErrorMessage,
  formatListingPrice,
} from "../../../lib/utils/utils";
import dayjs, { Dayjs } from "dayjs";

const { Paragraph, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Dayjs | null;
  checkOutDate: Dayjs | null;
  setCheckInDate: (checkInDate: Dayjs | null) => void;
  setCheckOutDate: (checkOutDate: Dayjs | null) => void;
}

export const ListingCreateBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const disabledDate = (currentDate?: Dayjs) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(dayjs().endOf("day"));
      return dateIsBeforeEndOfDay;
    }
    return false;
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Dayjs | null) => {
    if (
      checkInDate &&
      selectedCheckOutDate &&
      dayjs(selectedCheckOutDate).isBefore(checkInDate, "days")
    ) {
      return displayErrorMessage(
        `You can't book date of check out to be prior to check in!`
      );
    }

    setCheckOutDate(selectedCheckOutDate);
  };

  const checkOutInputDisabled = !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              format={"YYYY/MM/DD"}
              showToday={false}
              onChange={(dateValue) => setCheckInDate(dateValue)}
              onOpenChange={() => setCheckOutDate(null)}
              disabledDate={disabledDate}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : undefined}
              format={"YYYY/MM/DD"}
              disabled={checkOutInputDisabled}
              showToday={false}
              onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
              disabledDate={disabledDate}
            />
          </div>
        </div>
        <Divider />
        <Button
          size="large"
          type="primary"
          className="listing-booking__card-cta"
          disabled={buttonDisabled}
        >
          Request to book!
        </Button>
      </Card>
    </div>
  );
};
