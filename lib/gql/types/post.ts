import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLFieldConfig, GraphQLList } from 'graphql'
import { UserType } from './user';
import { db } from '../../../models';

async function resolveAuthor(root: any) {
    let user = await root.getUser();
    return user;
}

export var PostType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        content: {
            type: GraphQLString
        },
        public: {
            type: GraphQLBoolean
        },

        author: {
            type: UserType,
            resolve: resolveAuthor
        }
    })
});


export var GetPostById: GraphQLFieldConfig<any,any,any> = {
    type: PostType,
    args: {
        id: {
            type: GraphQLID
        }
    },
    resolve: async (_root, args, _info) => {
        let post = await db.Post.findByPk(args.id);
        return post;
    }
}

export var Search: GraphQLFieldConfig<any,any,any> = {
    type: new GraphQLList(PostType),
    args: {
        query: {
           type: GraphQLString 
        }
    },
    resolve: async (_root, args, _context) => {
        let arg = args.query;
        let query = `SELECT * FROM posts WHERE public=1 AND content LIKE '%${arg}%'`
        let posts = db.sequelize.query(query, {model: db.Post, mapToModel: true})
        return posts;
    }
}