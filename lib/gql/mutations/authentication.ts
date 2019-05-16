import { GraphQLFieldConfig, GraphQLString, GraphQLScalarType } from 'graphql'
import { UserType } from '../types/user';

import {db} from '../../../models'

export const Register: GraphQLFieldConfig<any,any,any> = {
    type: UserType,
    args: {
        username: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        lastName: {
            type: GraphQLString
        }
    },
    resolve: async (_root, args, context) => {
        let user = await db.User.create(args, {});
        return user;
    }
}

export const Login: GraphQLFieldConfig<any,any,any> = {
    type: UserType,
    args: {
        username: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        }
    },
    resolve: async(_root, args, context) => {
        let user = await db.User.findOne({where: args})
        if (user) {
            context.user = user;
            context.session.user_id = user.id;
        }
        return user;
    }
}
