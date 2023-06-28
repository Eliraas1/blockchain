import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { getJobById } from "@/lib/services/jobs.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  //TODO: check the method with body
  if (req.method === "GET") {
    try {
      const userId = req.headers["x-header"] || "";
      const { jobId } = req.body;

      if (!userId) return res.status(401).json("not Authorized");
      if (!jobId) return res.status(400).json("jobId not satisfied");
      const data = await getJobById(jobId as string);
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
