/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LogInInput = {
  code: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  logIn: Viewer;
  logOut?: Maybe<Viewer>;
};

export type MutationLogInArgs = {
  input?: InputMaybe<LogInInput>;
};

export type Query = {
  __typename?: "Query";
  authUrl: Scalars["String"];
};

export type Viewer = {
  __typename?: "Viewer";
  avatar?: Maybe<Scalars["String"]>;
  didRequest: Scalars["Boolean"];
  hasWallet?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["ID"]>;
  token?: Maybe<Scalars["String"]>;
};

export type LogOutMutationVariables = Exact<{ [key: string]: never }>;

export type LogOutMutation = {
  __typename?: "Mutation";
  logOut?: {
    __typename?: "Viewer";
    id?: string | null;
    token?: string | null;
    avatar?: string | null;
    hasWallet?: boolean | null;
    didRequest: boolean;
  } | null;
};

export type LogInMutationVariables = Exact<{
  input?: InputMaybe<LogInInput>;
}>;

export type LogInMutation = {
  __typename?: "Mutation";
  logIn: {
    __typename?: "Viewer";
    id?: string | null;
    token?: string | null;
    avatar?: string | null;
    hasWallet?: boolean | null;
    didRequest: boolean;
  };
};

export type AuthUqlQueryVariables = Exact<{ [key: string]: never }>;

export type AuthUqlQuery = { __typename?: "Query"; authUrl: string };

export const LogOutDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "LogOut" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "logOut" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "token" } },
                { kind: "Field", name: { kind: "Name", value: "avatar" } },
                { kind: "Field", name: { kind: "Name", value: "hasWallet" } },
                { kind: "Field", name: { kind: "Name", value: "didRequest" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>;
export const LogInDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "LogIn" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "LogInInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "logIn" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "token" } },
                { kind: "Field", name: { kind: "Name", value: "avatar" } },
                { kind: "Field", name: { kind: "Name", value: "hasWallet" } },
                { kind: "Field", name: { kind: "Name", value: "didRequest" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LogInMutation, LogInMutationVariables>;
export const AuthUqlDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AuthUql" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "authUrl" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AuthUqlQuery, AuthUqlQueryVariables>;
