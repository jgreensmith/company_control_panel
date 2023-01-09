import { useContext, useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { Button, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Toolbar, Typography } from "@mui/material";

import { ModalContext } from "../utils/ModalContext";
import { FormBox, InputContainer } from "../utils/styles";


export default function Form ({users}: any) {
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        pid: '',
        manageInventory: '',
        previewMode: ''
    }); 
    //update posts
    const { setModalOpen, currentId, setCurrentId } = useContext(ModalContext);

    const currentUser = users.find((user: any) => user._id === currentId)

    useEffect(() => {
        setForm({
            pid: currentUser?.pid ? currentUser.pid : '',
            manageInventory: currentUser?.manage_inventory ? currentUser.manage_inventory : '',
            previewMode: currentUser?.preview_mode ? currentUser.preview_mode : ''
        })
    }, [currentUser])
 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        setForm({
            ...form,
            [e.target.name]: e.target.value        
        })
    }

    const clear = () => {
        setCurrentId(null);
        setForm({
            pid: '',
            manageInventory: '',
            previewMode: ''
        })
        setModalOpen(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/add-pid', {
            method: 'POST',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({id: currentId, pid: form.pid, inventory: form.manageInventory, preview: form.previewMode })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error) {
                setError(data.error)
            } else {
                clear()
            }
        })
        
    }


    return(
        <Paper  sx={{minWidth: "373px"}}>
            <DialogTitle sx={{m: 0, p: 2, display: "flex", justifyContent: "space-between"}}>
                <Typography variant="h6" align="center">{currentUser?.name}</Typography>
                <IconButton
                    aria-label="close"
                    onClick={clear}
                    sx={{ml: 2}}
                >
                    <VscChromeClose />
                </IconButton>
            </DialogTitle>

                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent dividers>
                    <InputContainer>
                        <TextField 
                            name="pid"
                            value={form.pid}
                            variant="outlined"
                            label="Pid"
                            fullWidth
                            sx={{m:2, pr:3}}
                            onChange={handleChange}
                            />
                    </InputContainer>
                    <InputContainer>
                        <TextField
                            name="manageInventory"
                            value={form.manageInventory}
                            variant="outlined"
                            label="Manage Inventory"
                            fullWidth
                            sx={{m:2, pr:3}}
                            onChange={handleChange}
                            />
                    </InputContainer>
                    <InputContainer>
                        <TextField
                            name="previewMode"
                            value={form.previewMode}
                            variant="outlined"
                            label="Preview Mode"
                            fullWidth
                            sx={{m:2, pr:3}}
                            onChange={handleChange}
                            />
                    </InputContainer>
                    
                  
                </DialogContent>
                <DialogActions>
                    {error && <Typography variant='body2' sx={{color: 'red'}}>Error: {error}</Typography>}
                    <Button  variant="contained" color="primary" size="large" type="submit" fullWidth sx={{p:2}}>Submit</Button>
                    <Button onClick={clear} variant="text" color="secondary" size="small"  fullWidth sx={{p:2}}>Clear</Button>
                </DialogActions>
                </form>
        </Paper>
    )
}