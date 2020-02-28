import {GraphQLObjectType, GraphQLString} from 'graphql';

import {GetAllUsers, GetUserById, Me} from './user'
import { GetPostById, Search } from './post';

import axios from 'axios';

export const QueryType = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // Return information about the currently-logged-in user.
        me: Me,

        // Get a list of all users, or find them by their ID.
        allUsers: GetAllUsers,
        user: GetUserById,

        // Find a post, or search. 
        post: GetPostById,
        search: Search,

        // Resolve an asset stored on the external service.
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