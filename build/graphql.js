import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";
const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "hello from the query",
        },
    },
});
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "hello from the Mutation",
        },
    },
});
export const schema = new GraphQLSchema({ query, mutation });
//[`GraphQLSchema`]используется для создания схемы GraphQL путем передачи корневого
//                 запроса и мутационных типов объектов GraphQL.
//[`GraphQLObjectType`]это самый основной компонент схемы GraphQL, который может быть
//использован для представления практически всех типов объектов GraphQL, начиная от
//корневых типов запросов и мутаций и заканчивая специфическими пользовательскими типами.
