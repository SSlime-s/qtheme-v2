import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/apollo/schema.graphql',
  // documents: 'src/apollo/**/*.graphql',
  generates: {
    'src/apollo/generated/graphql.ts': {
      plugins: [
        'typescript',
        // 'typescript-common',
        // 'typescript-client',
        // 'typescript-server',
        'typescript-resolvers',
        // 'typescript-react-apollo',
        // 'typescript-graphql-files-modules',
        // 'fragment-matcher',
      ],
      config: {
        enumsAsTypes: true,
        enumValues: {
          Visibility: {
            PUBLIC: 'public',
            PRIVATE: 'private',
            DRAFT: 'draft',
          },
          Type: {
            LIGHT: 'light',
            DARK: 'dark',
            OTHER: 'other',
          },
        },
      },
    },
  },
}
export default config
