import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:9000/api",
  documents: "src/**/*.ts",
  generates: {
    "src/lib/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
