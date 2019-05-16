import { GraphQLFieldConfig, GraphQLString, GraphQLBoolean } from "graphql";
import { PostType } from "../types/post";

import {db} from '../../../models';

export var CreatePost: GraphQLFieldConfig<any,any,any> = {
    type: PostType,
    args: {
        title: {
            type: GraphQLString,
        },
        content: {
            type: GraphQLString
        },
        public: {
            type: GraphQLBoolean,
            // default to making our posts public.
            defaultValue: true
        }
    },
    resolve: async (_root: any, args: any, context: any) => {
        let user_id = context.user.id;
        let post_data = {
            UserId: user_id,
            ...args
        };
        let post = await db.Post.create(post_data, {});
        return post;
    }
}