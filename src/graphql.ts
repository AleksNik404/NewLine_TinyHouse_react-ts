import { listings } from "./listings";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
} from "graphql";

const Listing = new GraphQLObjectType({
  name: "Listing",
  fields: {
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
    numOfGuests: { type: new GraphQLNonNull(GraphQLInt) },
    numOfBeds: { type: new GraphQLNonNull(GraphQLInt) },
    numofBaths: { type: new GraphQLNonNull(GraphQLInt) },
    rating: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    listings: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Listing))),
      resolve: () => listings,
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    deleteListing: {
      type: new GraphQLNonNull(Listing),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_root, { id }, contextValue, info) => {
        const deleteIndex = listings.findIndex((item) => item.id === id);

        if (deleteIndex !== -1) {
          return listings.splice(deleteIndex, 1)[0];
        }
        throw new Error("failed to delete listing");
      },
    },
  },
});

export const schema = new GraphQLSchema({ query, mutation });

//[`GraphQLSchema`]используется для создания схемы GraphQL путем передачи корневого
//                 запроса и мутационных типов объектов GraphQL.

//[`GraphQLObjectType`]это самый основной компонент схемы GraphQL, который может быть
//использован для представления практически всех типов объектов GraphQL, начиная от
//корневых типов запросов и мутаций и заканчивая специфическими пользовательскими типами.
