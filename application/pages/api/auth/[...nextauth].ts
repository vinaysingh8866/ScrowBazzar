import NextAuth from "next-auth/next";
import Github from "next-auth/providers/github";
import Email from "next-auth/providers/email";
const options = {
    providers: [
        Github({
            
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

    ]
    ,
    secret:"yCV2P4cvJ3NJMN7bGnXa9iWigdZRVZR4wHvHZ/8Pmq4="
}

export default (req:any, res:any) => NextAuth(req, res, options);