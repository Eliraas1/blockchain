import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { deleteJob } from "@/lib/services/jobs.service";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "DELETE") {
    try {
      const userId = req.headers["x-header"] || "";
      const jobId = req.body.jobId;

      if (!userId) return res.status(401).json("not Authorized");
      if (!jobId) return res.status(400).json("jobId must be sent in body");
      const data = await deleteJob(jobId as string);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({ error: error.message });
    }
  }
  res.setHeader("Allow", ["DELETE"]);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;
