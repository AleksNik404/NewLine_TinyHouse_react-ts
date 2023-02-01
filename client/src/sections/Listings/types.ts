type Listings = {
  id: string;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
};

export interface ListingsData {
  listings: Listings[];
}

export interface DeleteListingData {
  deleteListing: Listings;
}

export interface DeleteListingVariables {
  id: string;
}
