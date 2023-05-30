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
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import "./user.css";
import { userApi } from "../../api";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useEffect } from "react";
import roleApi from "../../api/roles";
import { ROLE_ADMIN, ROLE_READ } from "./../../constants/index.js";

const getAllRolesNotAdmin = async () => {
  let roles = [];

  try {
    const res = await roleApi.getAll();
    roles = res.data.map(i => i.name);
  } catch (error) {
    console.log(error);
  }
  const rolesNotAdmin = roles.filter(
    (item) => item !== ROLE_ADMIN
  );
  return rolesNotAdmin;
};

const rolesApi = await getAllRolesNotAdmin();

var rolesChecked = [];

const UserForm = (props) => {
  const {
    data,
    openDialog,
    title,
    txtBtn,
    username,
    fullName,
    email,
    role,
    setObjEdit,
    submitEdit
  } = props;

  const formCancelButtonText = "Cancel";
  const wrongPassword = "Password does not match";
  // set Title:
  const [formTitle, setFormTitle] = React.useState(title);
  const [formButtonText, setFormButtonText] = React.useState(txtBtn);


  const strEmpty = "Empty field!";

  const [usernameError, setUsernameError] = React.useState(" ");
  const [fullNameError, setFullNameError] = React.useState(" ");
  const [emailError, setEmailError] = React.useState(" ");
  const [passwordError, setPasswordError] = React.useState(" ");
  const { enqueueSnackbar } = useSnackbar();
  const [selectRole, setSelectRole] = React.useState([]);

  const [rolesError, setRolesError] = React.useState(false);

  const handleClose = () => {
    props.setOpenDialog(false);
  };

  const isEmpty = (str) => {
    return str.trim() === "" ? true : false;
  };

  const handleSubmit = (event) => {
    if (isValidate()) {
      console.log('isValidate');
      props.setObjEdit((preValue) => ({
        ...preValue,
        username,
        fullName,
        email,
        role: selectRole,
      }))
      props.submitEdit();
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

    if(role.length === 0) {
      isError = true;
      setRolesError(true);
    }

    return !isError;
  };

  const handleSelectRole = (event) => {
    const newRole = [event.target.value];
    setObjEdit((preValue) => ({
      ...preValue,
      role: newRole,
    }))
  };

  const FormControlLabelRoles = ({ selectRole }) => {
    let radios = [];
    rolesApi.forEach((role) => {
      const radio = (
        <FormControlLabel
          value={role}
          control={<Radio />}
          label={role}
          sx={{ color: "#000" }}
        />
      );
      radios.push(radio);
    });

    return radios;
  };

  useEffect(() => {
  }, []);

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
              disabled
              value={username}
              error={usernameError !== " "}
              helperText={usernameError}
              required
              fullWidth
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
                setObjEdit((preValue) => ({
                  ...preValue,
                  fullName: event.target.value,
                }))
              }}
            />

            <TextField
              id="email"
              label="Email"
              type="email"
              required
              fullWidth
              value={email}
              error={emailError !== " "}
              helperText={emailError}
              onChange={(event) => {
                setObjEdit((preValue) => ({
                  ...preValue,
                  email: event.target.value,
                }))
              }}
            />
{/* 
            <TextField
              id="password"
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              error={passwordError !== " "}
              helperText={passwordError}
              onChange={(event) => {
                const value = event.target.value;
                // setPassword(value);
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
            /> */}
            <FormGroup>
              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  className={(rolesError ? "textError" : "") + "mt-2"}
                >
                  Pick Role*
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={role}
                  onChange={handleSelectRole}
                  sx={{ color: "#000" }}
                  className="d-flex flex-row justify-content-evenly"
                >
                  <FormControlLabelRoles />
                </RadioGroup>
              </FormControl>
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

export default UserForm;
