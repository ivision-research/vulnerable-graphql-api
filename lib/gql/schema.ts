import {GraphQLSchema} from 'graphql';

import {QueryType} from './types/query';
import {MutationType} from './types/mutation'

export var schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});