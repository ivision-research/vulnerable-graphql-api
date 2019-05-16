import { GraphQLObjectType, GraphQLString, GraphQLFieldConfig, GraphQLList, GraphQLID } from 'graphql';

import { db } from '../../../models'
import { PostType } from './post';

async function resolvePosts(root: any, _args: any, context: any) {
    var posts;

    // check authorization
    if (root.id == context.user.id) {
        // we're getting our own posts, get all of them (including private posts)
        posts = await root.getPosts();
    }
    else {
        // this is someone else.
        posts = await root.getPosts({ where: { public: true } });
    }
    return posts;
}

export var UserType: GraphQLObjectType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        username: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        lastName: {
            type: GraphQLString
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve: resolvePosts
        }
    })
})


export var GetAllUsers: GraphQLFieldConfig<any, any, any> = {
    type: new GraphQLList(UserType),
    resolve: async () => {
        let users = await db.User.findAll();
        return users;
    }
}

export var GetUserById: GraphQLFieldConfig<any, any, any> = {
    type: UserType,
    args: {
        id: {
            type: GraphQLID
        }
    },
    resolve: async (_root, args, _context) => {
        let user = await db.User.findByPk(args.id);
        return user;
    }
}

export var Me: GraphQLFieldConfig<any, any, any> = {
    type: UserType,
    resolve: async (_root, _args, context) => {
        // pull the current user out of the context
        return context.user;
    }
}