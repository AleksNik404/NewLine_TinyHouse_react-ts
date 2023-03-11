import { Request } from "express";
import { Booking, BookingsIndex, Database, Listing } from "../../../lib/types";
import { CreateBookingArgs } from "./types";
import { authorize } from "../../../lib/utils/utils";
import { ObjectId } from "mongodb";
import { StripeAPI } from "../../../lib/api/Stripe";

const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  // ***************************************************
  // * Цикл на каждый день, с проверкой что день свободен.

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear();
    const m = dateCursor.getUTCMonth();
    const d = dateCursor.getUTCDate();

    if (!newBookingsIndex[y]) newBookingsIndex[y] = {};
    if (!newBookingsIndex[y][m]) newBookingsIndex[y][m] = {};
    if (!newBookingsIndex[y][m][d]) newBookingsIndex[y][m][d] = true;
    else {
      throw new Error(
        "selected dates can't overlap dates that have already been booked"
      );
    }

    dateCursor = new Date(dateCursor.getTime() + 86400000);
  }

  return newBookingsIndex;
};

export const bookingResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },

    listing: (
      booking: Booking,
      _args: never,
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },

    tenant: (booking: Booking, _args: unknown, { db }: { db: Database }) => {
      return db.users.findOne({ _id: booking.tenant });
    },
  },

  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {
      try {
        const { id, source, checkIn, checkOut } = input;

        // ***************************************************
        // * Проверка аутентификации пользователя

        const viewer = await authorize(db, req);
        if (!viewer) throw new Error("viewer cannot be found");

        // ***************************************************
        // * Проверка есть ли такой листинг в БД / и не свой ли зыказываем

        const listing = await db.listings.findOne({ _id: new ObjectId(id) });

        if (!listing) throw new Error("listing can't be found");
        if (listing.host === viewer._id)
          throw new Error("viewer can't book own listing");

        // ***************************************************
        // * Проверка что даты в нужном порядке

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
          throw new Error("check out date can't be before check in date");
        }

        // ***************************************************
        // * Проверка что даты допустимы

        const bookingsIndex = resolveBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );

        // ***************************************************
        // * Расчет общей стоимости между заездом и выездом на основе дней

        const totalPrice =
          listing.price *
          ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);

        // ***************************************************
        // * Поиск продавца в BD и подключен ли страйп

        const host = await db.users.findOne({
          _id: listing.host,
        });

        if (!host || !host.walletId) {
          throw new Error(
            "the host either can't be found or is not connected with Stripe"
          );
        }

        // ***************************************************
        // * Создать плату за аренду.

        await StripeAPI.charge(totalPrice, source, host.walletId);

        // ***************************************************
        // * Создаем заказ. В колекции заказов. И возвращаем его.

        const { insertedId } = await db.bookings.insertOne({
          _id: new ObjectId(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut,
        });

        const insertedBooking = await db.bookings.findOne({
          _id: insertedId,
        });

        if (!insertedBooking) throw new Error("It failed to create a charge");

        // ***************************************************
        // * обновить доход продавца

        await db.users.updateOne(
          {
            _id: host._id,
          },
          {
            $inc: { income: totalPrice },
          }
        );

        // ***************************************************
        // * обновить заказ у покупателя

        await db.users.updateOne(
          {
            _id: viewer._id,
          },
          {
            $push: { bookings: insertedBooking._id },
          }
        );

        // ***************************************************
        // * обновить заказ у покупателя

        await db.listings.updateOne(
          {
            _id: listing._id,
          },
          {
            $set: { bookingsIndex },
            $push: { bookings: insertedBooking._id },
          }
        );

        return insertedBooking;
      } catch (error) {
        throw new Error(`Failed to create a booking: ${error}`);
      }
    },
  },
};
