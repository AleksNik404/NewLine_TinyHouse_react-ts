import { Collection, ObjectId } from "mongodb";

export interface Listing {
  _id: ObjectId;
  title: string;
  image: string;
  price: number;
  numOfGuests: number;
  numOfBed: number;
  rating: number;
}

export interface Database {
  listings: Collection<Listing>;
}
