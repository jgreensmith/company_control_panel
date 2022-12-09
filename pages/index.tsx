import Head from 'next/head'
import Image from 'next/image'
import { createCipheriv, createDecipheriv, createECDH, randomBytes } from 'crypto';
import  Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';

import styles from '../styles/Home.module.css'
import { useContext, useState } from 'react';
import { ModalContext } from '../utils/ModalContext';
import Form from '../components/Form';
import dbConnect from '../lib/dbConnect';
import User from '../model/User';

interface User {
  _id: string,
  name: string,
  email: string,
  hashedPassword: string,
  customerId?: string,
  connectedAccount?: string,
  orders?: Array<object>,
  holidayMode?: boolean,
  canceled?: boolean,
  pid?: string,
  manage_inventory?: string,
  preview_mode?: string
}

interface ApiKeyObj {
  iv: string,
  encryptedData: string,
  authTag: string
}


export default function Home({users}: any) {

  const { setModalOpen, modalOpen, setCurrentId } = useContext(ModalContext);


  const handleClick = (id: string) => {
    setModalOpen(true)
    setCurrentId(id)
  }
  
  // const plop = createECDH('secp256k1')
  // plop.generateKeys();
  // const plopped64 = plop.getPublicKey().toString('base64')

  // const plopped = plop.computeSecret(plopped64, 'base64', 'hex')
   console.log(users)

  const IV = randomBytes(16);

  const key = process.env.NEXT_PUBLIC_API_CIPHER_KEY

  const encrypt = (apiKey: string) => {
    //@ts-ignore
    let cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), IV)
    let encrypted = cipher.update(apiKey)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    const authTag = cipher.getAuthTag()
    return {
      iv: IV.toString('hex'), 
      encryptedData: encrypted.toString('hex'),   
      authTag: authTag.toString('hex')
    }
  }
  const secretPoop = encrypt("poopoo420")
  console.log(secretPoop)

  const decrypt = (apiKeyObj: ApiKeyObj) => {
    let iv = Buffer.from(apiKeyObj.iv, 'hex')
    let encryptedData = Buffer.from(apiKeyObj.encryptedData, 'hex')
    //@ts-ignore
    let decipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv)
    decipher.setAuthTag(Buffer.from(apiKeyObj.authTag, 'hex'))
    const decrypted = decipher.update(encryptedData)
    const decryptedly = Buffer.concat([decrypted, decipher.final()])
    return  decryptedly.toString('utf-8')
   }

   console.log(decrypt(secretPoop))


  return (
    <div className={styles.container}>
      <Head>
        <title>Control Panel</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Control <a href="https://en.wikipedia.org/wiki/Panel">Panel</a>
        </h1>
        <Container sx={{width: '100%', pt: 2}}>
        <TableContainer >
            <Table sx={{ minWidth: { vs: 450 } }} >
                <TableHead>
                    <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Connected Account</TableCell>
                    <TableCell align="right">Customer Id</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {users.map((user: User) => (
                    <TableRow
                      hover
                      onClick={() => handleClick(user._id)}
                      key={user._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                    >
                        <TableCell component="th" scope="row">
                        {user.email}
                        </TableCell>
                        <TableCell align="right">{user.name}</TableCell>
                        <TableCell align="right">{user.connectedAccount}</TableCell>
                        <TableCell align="right">{user.customerId}</TableCell>

                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Container>
        <Dialog 
        open={modalOpen}
        //fullScreen={fullScreen}
        onClose={() => setModalOpen(false)}
       
        >
          <Form users={users} />
        </Dialog>           
       
      </main>

      <footer className={styles.footer}>
        
          Powered by me
       
      </footer>
    </div>
  )
}

export const getServerSideProps = async () => {
  try {
    await dbConnect()
     
    const users = await User.find()

    return {
      props: {
        users: JSON.parse(JSON.stringify(users))
      }
    }
  } catch (e) {
    console.log(e)
  }
}