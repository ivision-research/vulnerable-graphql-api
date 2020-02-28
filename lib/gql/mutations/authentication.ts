import { GraphQLFieldConfig, GraphQLString } from 'graphql'
import { GraphQLJSON } from 'graphql-type-json'

import { UserType } from '../types/user';

import {db} from '../../../models'
import { AnySoaRecord } from 'dns';

import argon2 from 'argon2';
import faker from 'faker';

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
        let token = faker.random.number(99999).toString().padStart(5, '0');
        let hash = await argon2.hash(args.password);
        let user = await db.User.create({
            username: args.username,
            password: hash,
            firstName: args.firstName,
            lastName: args.lastName,
            resetToken: token
        }, {});
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
        if (args.username === undefined || args.password === undefined) {
            throw new Error("`username` and `password` must be given.");
        }
        let user = await db.User.findOne({where: {username: args.username}})
        if (user) {
            if (!await argon2.verify(user.password, args.password)) {
                throw new Error("Incorrect username or password.")
            }
            context.user = user;
            context.session.user_id = user.id;
        }
        throw new Error("Given username does not exist.");
    }
}

export const PasswordReset: GraphQLFieldConfig<any,any,any> = {
    type: UserType,
    args: {
        input: {
            type: GraphQLJSON
        },
    },
    resolve: async(_root, args, context) => {
        console.log(args);
        if (args.input.username === undefined || args.input.reset_token === undefined || args.input.new_password === undefined) {
            throw new Error("Must provide username, new_password, and reset_token.")
        }
        let user = await db.User.findOne({where: {username: args.input.username, resetToken: args.input.reset_token}})
        if (user) {
            // Update the user in the database first.
            user.password = await argon2.hash(args.input.new_password);
            user.save();

            // Now, return it.
            context.user = user;
            context.session.user_id = user.id;
            return user;
        }
        else {
            throw new Error('The password reset token you submitted was incorrect.')
        }
    }
}
