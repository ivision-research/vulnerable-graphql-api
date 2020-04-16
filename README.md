# GraphQL - Demo Vulnerable API

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
