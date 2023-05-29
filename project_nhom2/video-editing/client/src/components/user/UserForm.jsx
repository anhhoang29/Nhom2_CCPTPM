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
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
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
    roles = res.data.map((i) => i.name);
  } catch (error) {
    console.log(error);
  }
  const rolesNotAdmin = roles.filter((item) => item !== ROLE_ADMIN);
  return rolesNotAdmin;
};

const rolesApi = await getAllRolesNotAdmin();

var rolesChecked = [];

const UserForm = (props) => {
  const { openDialog, title, txtBtn } = props;
  const [selectRole, setSelectRole] = React.useState("");
  // let formTitle = "Add User";
  // let formButtonText = "Add";..

  const formCancelButtonText = "Cancel";
  const wrongPassword = "Password does not match";
  // set Title:
  const [formTitle, setFormTitle] = React.useState(title);
  const [formButtonText, setFormButtonText] = React.useState(txtBtn);
  const [username, setUsername] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [roles, setRoles] = React.useState([]);
  const [viewer, setViewer] = React.useState(true);
  const [creator, setCreator] = React.useState(false);
  const [uploader, setUploader] = React.useState(false);

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isPasswordNotMatch, setIsPasswordNotMatch] = React.useState(false);
  const strEmpty = "Empty field!";

  const [usernameError, setUsernameError] = React.useState(" ");
  const [fullNameError, setFullNameError] = React.useState(" ");
  const [emailError, setEmailError] = React.useState(" ");
  const [passwordError, setPasswordError] = React.useState(" ");
  const { enqueueSnackbar } = useSnackbar();

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
    console.log(event);
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

  const signUp = async (body) => {
    try {
      const response = await userApi.signUp(body);
      if (response.data) {
        await addRoles(response.data);
        enqueueSnackbar("Create a successful user", { variant: "success" });
        props.setOpenDialog(false);
        window.location.reload(false);
      } else {
        if (response.description) {
          enqueueSnackbar(response.description, { variant: "error" });
        } else {
          enqueueSnackbar("Add User Faild", { variant: "error" });
        }
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const addRoles = async (data) => {
    data.roles = selectRole;
    console.log(data);
    const obj = {
      id: data.id,
      username: data.userName,
      fullName: data.fullName,
      email: data.email,
      roles: [selectRole],
    };
    console.log(obj);
    try {
      const response = await userApi.update(obj.username, obj);
      if (response.data) {
        enqueueSnackbar(response.data, { variant: "success" });
        //       props.setOpenDialog(false);
        //       window.location.reload(false);
      } else {
        enqueueSnackbar("Add Roles Failed", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const addUser = async (event) => {
    const body = {
      username,
      fullName,
      email,
      password,
    };

    signUp(body);
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

  const handleSelectRole = (event) => {
    setSelectRole(event.target.value);
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

  useEffect(() => {}, []);

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
                  value={selectRole}
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
