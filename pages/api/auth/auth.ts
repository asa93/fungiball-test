// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { ethers } from "ethers";

import jwt from "jsonwebtoken";

import { message, secret } from "../../config";

type Data = {
    message: string;
};

const verifyMessage = async ({ message, address, signature }) => {
    try {
        console.log("ethers");
        const signerAddr = await ethers.verifyMessage(message, signature);
        if (signerAddr !== address) {
            return false;
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "GET") {
        const { signature, message, address } = req.query;

        const isAuthentic = await verifyMessage({
            message: message,
            address: address,
            signature,
        });

        const data = {
            address: address,
        };

        if (isAuthentic) {
            const token = jwt.sign(data, secret, {
                expiresIn: "7 days",
            });

            res.status(200).json({ message: token });
        } else {
            res.status(200).json({ message: "signature not valid" });
        }
    } else {
        res.status(400).json({ message: "Error" });
    }
}
