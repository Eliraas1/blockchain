import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { createJob } from "@/lib/services/jobs.service";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "POST") {
    try {
      const job = req.body;
      // const data = JSON.parse(req.body);
      const userId = req.headers["x-header"] || "";
      if (!userId) return res.status(401).json("not Authorized");
      const data = await createJob(userId as string, job);
      console.log(job);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({ error: error.message });
    }
  }
  res.setHeader("Allow", ["POST"]);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;
