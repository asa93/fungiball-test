// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { quiz } from "../quiz";

import { BigNumber, ethers } from "ethers";

export interface IQuizVoucher {
    user: string;
}

const domain = {
    name: "Ether Mail",
    version: "1",
    chainId: 111,
    verifyingContract: process.env.VERIFYING_CONTRACT,
};
const types = {
    Voucher: [{ name: "user", type: "address" }],
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === "GET") {
        res.status(400).json({ message: "not supported" });
    } else {
        const quizDone = req.body;

        let count = 0;
        let success = true;
        for (let i = 0; i < quiz.length; i++) {
            if (quizDone[i]?.answer !== quiz[i].answer) {
                success = false;

            } else {
                count++
            }

        }
        res.status(200).json({ count, success });
        // GENERATE SIGNATURE FOR VOUCHER

        const privateKey = process?.env?.PRIV_KEY;

        //TODO: ISSUE with signer
        const signer = new ethers.Wallet(privateKey ?? "");

        const data: IQuizVoucher = {
            user: "0x0",
        };

        const signature = await signer.signTypedData(domain, types, { ...data });
        res.status(200).json({ sign: signature, dataSigned: data });
    }
}
