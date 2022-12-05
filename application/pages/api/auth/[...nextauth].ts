import NextAuth from "next-auth/next";
import Github from "next-auth/providers/github";
import Email from "next-auth/providers/email";
const options = {
    providers: [
        Github({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        // Email({
        //     server: process.env.EMAIL_SERVER as string,
        //     from: process.env.EMAIL_FROM as string,
        // }),

    ]
}

export default (req:any, res:any) => NextAuth(req, res, options);