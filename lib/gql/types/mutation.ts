import {GraphQLObjectType} from 'graphql'

import {SecretMutation} from '../mutations/secret_mutation'
import { CreatePost } from '../mutations/create_post';
import { Register, Login, PasswordReset } from '../mutations/authentication';

export var MutationType = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        register: Register,
        login: Login,
        passwordReset: PasswordReset,

        createPost: CreatePost,
        superSecretPrivateMutation: SecretMutation
    }
});