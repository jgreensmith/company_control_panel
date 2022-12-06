import { useContext, useEffect, useState } from "react";

import { Button, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Toolbar, Typography } from "@mui/material";

import { ModalContext } from "../utils/ModalContext";
import { FormBox, InputContainer } from "../utils/styles";


export default function Form() {
    //const [dateValue, setDateValue] = useState(new Date());

    const [form, setForm] = useState({
        title: '',
        message: '',
        pals: 0,
        date: new Date()
    }); 
    //update posts
    const { setModalOpen, currentId, setCurrentId } = useContext(ModalContext);


    const handleChange = (e: any) => {
        const target = e.target
        const value = target.value
        const name = target.name
        setForm({
            ...form,
            [name]: value
        })
    }

    const clear = () => {
        setCurrentId(null);
        setForm({
            title: '',
            message: '',
            pals: 0,
            date: new Date()
        })
        setModalOpen(false);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        clear();
    }


    return(
        <Paper  sx={{minWidth: "373px"}}>
            <DialogTitle sx={{m: 0, p: 2, display: "flex", justifyContent: "space-between"}}>
                <Typography variant="h6" align="center">Find some Pals for your Project</Typography>
                <IconButton
                    aria-label="close"
                    onClick={clear}
                    sx={{ml: 2}}
                >
                    close
                </IconButton>
            </DialogTitle>

                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent dividers>
                    <InputContainer>
                        <TextField 
                            name="title"
                            value={form.title}
                            variant="outlined"
                            label="Title"
                            fullWidth
                            sx={{m:2, pr:3}}
                            onChange={handleChange}
                            />
                    </InputContainer>
                    <InputContainer>
                        <TextField
                            name="message"
                            value={form.message}
                            variant="outlined"
                            label="Message"
                            fullWidth
                            sx={{m:2, pr:3}}
                            onChange={handleChange}
                            />
                    </InputContainer>
                    
                  
                </DialogContent>
                <DialogActions>
                    <Button  variant="contained" color="primary" size="large" type="submit" fullWidth sx={{p:2}}>Submit</Button>
                    <Button onClick={clear} variant="text" color="secondary" size="small"  fullWidth sx={{p:2}}>Clear</Button>
                </DialogActions>
                </form>
        </Paper>
    )
}