import {GraphQLObjectType, GraphQLString} from 'graphql';

import {GetAllUsers, GetUserById, Me} from './user'
import { GetPostById, Search } from './post';

import axios from 'axios';

export const QueryType = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // query for the currently logged in user.
        me: Me,

        // get user information
        allUsers: GetAllUsers,
        user: GetUserById,

        // get all posts by
        post: GetPostById,
        search: Search,


        getAsset: {
            type: GraphQLString,
            args: {
                name: {
                    type: GraphQLString
                }
            },
            resolve: async (_root, args, _context) => {
                let filename = args.name;
                let results = await axios.get(`http://localhost:8081/assets/${filename}`);
                return results.data;
            }
        }
    }
})