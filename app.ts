import express, { NextFunction, Request, Response } from 'express';
import graphqlHTTP from 'express-graphql';

import {schema} from './lib/gql/schema';

import {db} from './models'

import session from 'express-session';

import rateLimit from 'express-rate-limit';

import cors from 'cors';


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

var user_id = 2;

async function GetCurrentUser(req: any, res: Response, next: NextFunction) {

    // No need for a real login system for this demo API.
    // Just assign a user to each session on first visit...
    if (!req.session.user_id) {
        req.session.user_id = user_id;
        console.log("Assigned user ID", user_id);
        if (user_id == 50){
            user_id = 2;
        }
        else {
            user_id++;
        }
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

// Set up rate-limiting.
// We wouldn't want anyone brute-forcing password reset tokens!
const limiter = rateLimit({
    windowMs:60 * 1000, // one minute
    max: 100 // limit to 100 requests/minute
});
app.use(limiter);

app.get('/', (_req,res) => {
    return res.redirect('/graphql');
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(port, () => console.log("API started."));
