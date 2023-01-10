import { gql, Config } from 'apollo-server-micro'

export const typeDefs: Config['typeDefs'] = gql`
  enum Visibility {
    PUBLIC
    PRIVATE
    DRAFT
  }

  enum Type {
    LIGHT
    DARK
    OTHER
  }

  type Theme {
    id: ID!
    title: String!
    description: String!
    author: String!
    visibility: Visibility!
    type: Type!
    createdAt: String!
    theme: String!
    likes: Int!
    isLike: Boolean!
  }

  type Version {
    id: ID!
    version: String!
    createdAt: String!
    theme: String!
  }

  type ThemeWithVersions {
    theme: Theme!
    versions: [Version!]!
  }

  type Themes {
    themes: [Theme!]!
    total: Int!
  }

  type Query {
    getRandomTheme(visibility: Visibility, type: Type): Theme!
    getTheme(id: ID!): ThemeWithVersions
    getThemes(
      limit: Int
      offset: Int
      visibility: Visibility
      type: Type
      only_like: Boolean
      author: String
    ): Themes
  }

  type Mutation {
    createTheme(
      title: String!
      description: String!
      visibility: Visibility!
      type: Type!
      theme: String!
    ): Theme!
    updateTheme(
      id: ID!
      title: String!
      description: String!
      visibility: Visibility!
      type: Type!
      theme: String!
    ): Theme!
    deleteTheme(id: ID!): Boolean
    toggleLike(id: ID!, isLike: Boolean!): Theme!
  }
`