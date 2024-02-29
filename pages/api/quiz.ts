// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { quiz } from "../quiz"



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === "GET") {

        const questions = quiz.map((q) => { return { question: q.question, options: q.options } })

        console.log("questions", questions)
        res.status(200).json(questions);
    } else {
        res.status(400).json({ message: "Error" });
    }
}
