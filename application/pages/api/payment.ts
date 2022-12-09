import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mangodb";
import { getSession } from "next-auth/react";
export default async function handlePayment(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });
    if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }else{
        
        console.log(session.user);
    }
    
    res.json({ name: 'John Doe' })

}