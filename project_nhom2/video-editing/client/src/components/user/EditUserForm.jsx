import * as React from "react";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import "./user.css";
import { userApi } from "../../api";

const checkData = (data) => {
    let obj = {};
    if(data) {
        obj.userName = data?.userName || '';
    }
    return obj
}

const EditUserForm = (props) => {
  const { openDialog, title, txtBtn, data, userName} = props;
  // let formTitle = "Add User";
  // let formButtonText = "Add";.

  const input = checkData(data);
  console.log(userName);

  const formCancelButtonText = "Cancel";
  const wrongPassword = "Password does not match";
  // set Title:

  const [formTitle, setFormTitle] = React.useState(title);
  const [formButtonText, setFormButtonText] = React.useState(txtBtn);
  const [username, setUsername] = React.useState(input.userName);
  const [fullName, setFullName] = React.useState(data?.fullName || '');
  const [email, setEmail] = React.useState(data?.email || '');
  const [viewer, setViewer] = React.useState(true);
  const [creator, setCreator] = React.useState(false);
  const [uploader, setUploader] = React.useState(false);

  const [password, setPassword] = React.useState(data?.password || '');
  const [confirmPassword, setConfirmPassword] = React.useState(data?.password || '');
  const [isPasswordNotMatch, setIsPasswordNotMatch] = React.useState(false);
  const strEmpty = "Empty field!";

  const [usernameError, setUsernameError] = React.useState(" ");
  const [fullNameError, setFullNameError] = React.useState(" ");
  const [emailError, setEmailError] = React.useState(" ");
  const [passwordError, setPasswordError] = React.useState(" ");

  // Role: start
  const handleViewerChange = (event) => {
    setViewer(event.target.checked);
  };

  const handleCreatorChange = (event) => {
    setCreator(event.target.checked);
  };

  const handleUploaderChange = (event) => {
    setUploader(event.target.checked);
  };

  const rolesError = [viewer, creator, uploader].filter((v) => v).length < 1;
  // Role: end

  const handleClose = () => {
    props.setOpenDialog(false);
    setIsPasswordNotMatch(false);
    setUsername("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const isEmpty = (str) => {
    return str.trim() === "" ? true : false;
  };

  const handleSubmit = (event) => {
    userApi.addRoles('2e306c1c-683d-4dae-ab12-74c1131786ae', 'Creator');

    if (isValidate()) {
      // handleClose();
      addUser(event);
    }
  };

  const isValidate = () => {
    let isError = false;

    if (isEmpty(username)) {
      setUsernameError(strEmpty);
      isError = true;
    }

    if (isEmpty(fullName)) {
      setFullNameError(strEmpty);
      isError = true;
    }

    if (isEmpty(email)) {
      setEmailError(strEmpty);
      isError = true;
    }

    const pwError = {
      message: " ",
    };
    if (!validatePassword(password, pwError)) {
      setPasswordError(pwError.message);
      isError = true;
    }

    return !isError;
  };

  const getRoles = () => {
    let rs = [];
    if (creator) {
      rs.push("Creator");
    }
    if (uploader) {
      rs.push("Uploader");
    }

    return rs;
  };

  const addUser = (event) => {
    event.preventDefault();
    const roles = getRoles();

    const body = {
      username,
      fullName,
      email,
      password,
    };

    const signUp = async () => {
      try {
        await userApi.signUp(body);
      } catch (error) {
        console.log(error);
      }
    };

    const addRoles = async() => {
      try {
        await userApi.addRoles(body);
      } catch (error){
        console.log(error);
      }
    }

    signUp();
    // addRoles();
  };

  const handleConfirmPassword = () => {
    if (password !== confirmPassword) {
      setIsPasswordNotMatch(true);
    } else {
      setIsPasswordNotMatch(false);
    }
  };

  function validatePassword(password, pwError) {
    // Check if the password is at least 8 characters long
    if (password.length < 8) {
      pwError.message = "Password must be at least 8 characters";
      return false;
    }

    // Check if the password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      pwError.message = "Password must contain uppercase letters";
      return false;
    }

    // Check if the password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      pwError.message = "Password must contain lowercase letters";
      return false;
    }

    // Check if the password contains at least one digit
    if (!/[0-9]/.test(password)) {
      pwError.message = "Password must contain numbers";
      return false;
    }

    // Check if the password contains at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      pwError.message = "Password must contain spacial characters";
      return false;
    }

    // All requirements are met
    return true;
  }

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
              error={fullNameError !== " "}
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
              value={email}
              required
              fullWidth
              error={emailError !== " "}
              helperText={emailError}
              onChange={(event) => {
                const value = event.target.value;
                setEmail(value);
              }}
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              required
              fullWidth
              error={passwordError !== " "}
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
              value={confirmPassword}
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

            <FormLabel
              component="legend"
              className={(rolesError ? "textError" : "") + "mt-2"}
            >
              Pick Roles *
            </FormLabel>
            <FormGroup className="d-flex flex-row justify-content-evenly">
              <FormControlLabel
                control={
                  <Checkbox onChange={handleViewerChange} defaultChecked />
                }
                label="Viewer"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleCreatorChange} />}
                label="Creator"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleUploaderChange} />}
                label="Uploader"
              />
            </FormGroup>
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

export default EditUserForm;
