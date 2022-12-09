import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mangodb";
import { getSession } from "next-auth/react";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();
    res.json({ name: 'John Doe' })
}