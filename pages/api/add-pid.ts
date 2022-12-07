import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

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

            const client = await clientPromise

            // @ts-ignore
            await client.db('test').collection('users').findOneAndUpdate({_id: {$eq: id}}, {
                $set: {
                    pid: pid,
                    manage_inventory: inventory,
                    preview_mode: preview
                }
            })
            
            
            res.status(200).json({message: "pidObj added"})
        } catch (error: any) {
            res.status(400).json(error.message);
        }
        
    }
}