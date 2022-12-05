import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mangodb";
import { getSession } from "next-auth/react";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });
    console.log(session);
    res.json({ name: 'John Doe' })

}