import express, { NextFunction, Request, Response } from 'express';
import graphqlHTTP from 'express-graphql';

import {schema} from './lib/gql/schema';

import {db} from './models'

import session from 'express-session';


const app = express();
const port = 3000;

var user_id = 1;

async function GetCurrentUser(req: any, res: Response, next: NextFunction) {

    // don't actually use a login system for this demo. just pick an ID and go with it in the session
    if (!req.session.user_id) {
        req.session.user_id = user_id;
        console.log("Assigned user ID", user_id);
        user_id = (user_id % 50) + 1;
    }

    let user = await db.User.findByPk(req.session.user_id);
    req.user = user;
    next();
}

app.use(session(
    {
        secret: "a very good and secure secret",
        resave: false,
        saveUninitialized: false
    }
));
app.use(GetCurrentUser);

app.get('/', (_req,res) => {
    return res.redirect('/graphql');
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(port, () => console.log("API started."));