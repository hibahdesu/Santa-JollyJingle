// app/api/child/[childId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongoose';
import Child from '../../../lib/models/Child';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { childId } = req.query;

  if (req.method === 'GET') {
    try {
      await connectToDatabase();

      const child = await Child.findById(childId);

      if (!child) {
        return res.status(404).json({ error: 'Child not found' });
      }

      res.status(200).json({ name: child.name, wishList: child.wishList });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
