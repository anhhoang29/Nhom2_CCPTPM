import * as React from "react";
import { Button } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const UserForm = (props) => {
  const { openDialog } = props;

  const [username, setUsername] = React.useState("");
  const [fullName, setFullName] = React.useState(" ");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isPasswordNotMatch, setIsPasswordNotMatch] = React.useState(false);
  const strEmpty = 'Empty field!';

  const [usernameError, setUsernameError] = React.useState(' ');
  const [fullNameError, setFullNameError] = React.useState(' ');
  const [emailError, setEmailError] = React.useState(' ');
  const [passwordError, setPasswordError] = React.useState(' ');
  const [roleError, setRoleError] = React.useState(' ');

  const handleClose = () => {
    props.setOpenDialog(false);
    setIsPasswordNotMatch(false);
    setUsername("");
    setFullName("");
    setEmail("");
    setRole("");
    setPassword("");
    setConfirmPassword("");
  };

  const isEmpty = (str) => {
    return str.trim() === '' ? true : false;
  }

  const handleSubmit = (event) => {
    console.log(username);
    console.log(fullName);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    if(isValidate()){
      handleClose();
      addUser(event);
    }
  };

  const isValidate = () => {
    let isError = false;

    if(isEmpty(username)){
      setUsernameError(strEmpty);
      isError = true;
    }

    if(isEmpty(fullName)){
      setFullNameError(strEmpty);
      isError = true;
    }

    if(isEmpty(email)){
      setEmailError(strEmpty);
      isError = true;
    }

    if(isEmpty(password)){
      setPasswordError(strEmpty);
      isError = true;
    }

    if(isEmpty(role)){
      setRoleError(strEmpty);
      isError = true;
    }

    return !isError;
  }

  const addUser = (event) => {
    event.preventDefault();
  }

  let formTitle = "Add User";
  let formButtonText = "Add";
  const formCancelButtonText = "Cancel";
  const wrongPassword = "Password does not match";

  const handleConfirmPassword = () => {
    if (password !== confirmPassword) {
      setIsPasswordNotMatch(true);
    } else {
      setIsPasswordNotMatch(false);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{formTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter information into input areas.
          </DialogContentText>

          <Box
            className="mt-3"
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, minwidth: "50ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="username"
              label="Username"
              type="text"
              value={username}
              error={usernameError !== " "}
              helperText={usernameError}
              required
              fullWidth
              onChange={(event) => {
                const value = event.target.value;
                setUsername(value);
              }}
            />

            <TextField
              id="fullName"
              label="Full Name"
              type="text"
              required
              value={fullName}
              fullWidth
              error={fullNameError !== ' '}
              helperText={fullNameError}
              onChange={(event) => {
                const value = event.target.value;
                setFullName(value);
              }}
            />

            <TextField
              id="email"
              label="Email"
              type="email"
              required
              fullWidth
              error={emailError !== " "}
              helperText={ emailError }
              onChange={(event) => {
                const value = event.target.value;
                setEmail(value);
              }}
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              required
              fullWidth
              error={ passwordError !== ' '}
              helperText={passwordError}
              onChange={(event) => {
                const value = event.target.value;
                setPassword(value);
              }}
            />

            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              error={isPasswordNotMatch}
              required
              fullWidth
              helperText={(isPasswordNotMatch && wrongPassword) || " "}
              onChange={(event) => {
                const value = event.target.value;
                setConfirmPassword(value);
                handleConfirmPassword();
              }}
              onFocus={handleConfirmPassword}
            />

            <TextField
              id="role"
              label="Role"
              type="text"
              required
              fullWidth
              onChange={(event) => {
                const value = event.target.value;
                setRole(value);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{formCancelButtonText}</Button>
          <Button onClick={handleSubmit}>{formButtonText}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserForm;
