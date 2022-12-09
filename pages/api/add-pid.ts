import { createCipheriv, randomBytes } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";

const validatePid = (pid: string): boolean => {
    const regEx = /^[A-Za-z0-9]{8}$/
    return regEx.test(pid)
}
const validateToken = (tkn: string): boolean => {
    const regEx = /^[A-Za-z0-9]{180}$/
    return regEx.test(tkn)
}

const validateForm = (pid: string, inventory: string, preview: string) => {
if (!validatePid(pid)) {
    return {error: 'invalid pid'}
}
if (!validateToken(inventory)) {
    return {error: 'invalid inventory token'}
}
if (!validateToken(preview)) {
    return {error: 'invalid preview token'}
}
}

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {id, pid, inventory, preview } = req.body

            const errorMessage = validateForm(pid, inventory, preview)
            if(errorMessage) {
                return res.status(400).json(errorMessage)
            }

            //encryption of manage_inventory key
            const IV = randomBytes(16);

            const key = process.env.NEXT_PUBLIC_API_CIPHER_KEY

            //@ts-ignore
            let cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), IV)
            let encrypted = cipher.update(inventory)
            encrypted = Buffer.concat([encrypted, cipher.final()])
            const authTag = cipher.getAuthTag()
                

            await dbConnect()

            // @ts-ignore
            await User.findByIdAndUpdate({_id: id}, {
                $set: {
                    pid: pid,
                    preview_mode: preview,
                    encrypted_manage_inventory: encrypted.toString('hex'),
                    iv: IV.toString('hex'),
                    auth_tag: authTag.toString('hex')

                }
            })
            
            
            res.status(200).json({message: "encrypted pidObj added"})
        } catch (error: any) {
            res.status(400).json(error.message);
        }
        
    }
}