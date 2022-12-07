import Head from 'next/head'
import Image from 'next/image'
import  Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';

import clientPromise from '../lib/mongodb'
import styles from '../styles/Home.module.css'
import { useContext, useState } from 'react';
import { ModalContext } from '../utils/ModalContext';
import Form from '../components/Form';

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


export default function Home({users}: any) {

  const { setModalOpen, modalOpen, setCurrentId } = useContext(ModalContext);


  const handleClick = (id: string) => {
    setModalOpen(true)
    setCurrentId(id)
  }
  

  console.log({users})
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
    const client = await clientPromise
     
    const users = await client.db('test').collection('users').find({}).toArray()

    return {
      props: {
        users: JSON.parse(JSON.stringify(users))
      }
    }
  } catch (e) {
    console.log(e)
  }
}