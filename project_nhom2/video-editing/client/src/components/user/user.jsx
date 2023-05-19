import * as React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UserTable from "./UserTable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LinkedStateMixin from 'react-addons-linked-state-mixin'; // ES6

import "./user.css";


const User = () => {
  const [open, setOpen] = React.useState(false);
  let formTitle = "Add User";
  let formButtonText = "Add";
  const formCancelButtonText = "Cancel";
  const helperText = 'Please Enter this field';
  
  let username;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = () => {
    console.log(username);
    handleClose();
  }

  return (
    <div className="container-fluid">
      <div className="row title">
        <div className="d-flex justify-content-between mb-4">
          <h2>User Manager</h2>
          <div className="list-btn">
            <Button
              variant="outlined"
              className="ms-3 button"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>

            <Button
              variant="contained"
              className="ms-3 button"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <UserTable></UserTable>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter information into input areas.
          </DialogContentText>

          <Box
            className="mt-3"
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="username"
              label="Username"
              type="text"
              value=""
              defaultValue=""
              variant="standard"
              valueLink={this.linkState('username')}
              required
            />
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{formCancelButtonText}</Button>
          <Button onClick={handleSubmit}>{formButtonText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default User;
