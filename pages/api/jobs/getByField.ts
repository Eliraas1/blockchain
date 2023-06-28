import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { getJobByField } from "@/lib/services/jobs.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const userId = req.headers["x-header"] || "";
      const query = req.query;
      if (!userId) return res.status(401).json("not Authorized");
      // if (!query) return res.status(400).json("query must be sent to body");
      console.log({ query });
      const data = await getJobByField(query);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({ error: error.message });
    }
  }
  res.setHeader("Allow", ["GET"]);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;
