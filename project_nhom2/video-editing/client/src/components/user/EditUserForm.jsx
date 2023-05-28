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
import { SnackbarProvider, useSnackbar } from "notistack";
import { useEffect } from "react";
import roleApi from "../../api/roles";
import { ROLE_ADMIN, ROLE_READ } from "./../../constants/index.js";

const getAllRolesNotAdmin = async () => {
  let roles = [];

  try {
    const res = await roleApi.getAll();
    roles = res.data;
  } catch (error) {
    console.log(error);
  }
  const rolesNotAdmin = roles.filter(
    (item) => item !== ROLE_ADMIN && item !== ROLE_READ
  );
  return rolesNotAdmin;
};

const rolesApi = await getAllRolesNotAdmin();

var rolesChecked = [];

const RoleCheckbox = ({ selectRole }) => {
  let roleCheckbox = [];
  selectRole = [];
  const handleChangeCheckbox = (event) => {
    console.log("checkbox change", event);
    if (event.target.checked) {
      rolesChecked.push(event.target.name);
      selectRole.push(event.target.name);
    } else {
      const index = rolesChecked.indexOf(event.target.name);
      if (index !== -1) {
        rolesChecked.splice(index, 1);
        selectRole.splice(index, 1);
      }
      // setRoles(roles.filter(role => role !== event.target.name));
    }
    console.log(rolesChecked);
  };

  rolesApi.forEach((roleName) => {
    const form = (
      <FormControlLabel
        control={
          <Checkbox
            onChange={handleChangeCheckbox}
            name={roleName}
            value={roleName}
          />
        }
        label={roleName}
        value={roleName}
        sx={{ color: "#000" }}
      />
    );
    roleCheckbox.push(form);
  });
  return roleCheckbox;
};

const UserForm = (props) => {
  const {
    data,
    openDialog,
    title,
    txtBtn,
    username,
    fullName,
    email,
    password,
    roles,
  } = props;
  let selectRole = [];
  // let formTitle = "Add User";
  // let formButtonText = "Add";..

  const formCancelButtonText = "Cancel";
  const wrongPassword = "Password does not match";
  // set Title:
  const [formTitle, setFormTitle] = React.useState(title);
  const [formButtonText, setFormButtonText] = React.useState(txtBtn);
  // const [username, setUsername] = React.useState(props.data?.userName | '');
  // const [fullName, setFullName] = React.useState();
  // const [email, setEmail] = React.useState();
  // const [roles, setRoles] = React.useState([]);
  const [viewer, setViewer] = React.useState(true);
  const [creator, setCreator] = React.useState(false);
  const [uploader, setUploader] = React.useState(false);

  // const [password, setPassword] = React.useState("");
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
    // setUsername("");
    // setFullName("");
    // setEmail("");
    // setPassword("");
    // setConfirmPassword("");
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
    // try {
    //   const response = await userApi.signUp(body);
    //   if (response.data) {
    //     await addRoles(response.data.id);
    //     enqueueSnackbar("Create a successful user", { variant: "success" });
    //   } else {
    //     if (response.description) {
    //       enqueueSnackbar(response.description, { variant: "error" });
    //     } else {
    //       enqueueSnackbar("Add User Faild", { variant: "error" });
    //     }
    //   }
    // } catch (error) {
    //   enqueueSnackbar(error.message, { variant: "error" });
    // }
    userApi
      .signUp(body)
      .then((res) => {
        if (res.data) {
          enqueueSnackbar("Create a successful user", { variant: "success" });
          setTimeout(() => {
            addRoles(res.data.id);
          }, 1500);
          props.setOpenDialog(false);
          window.location.reload(false);
        }
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      })
      .finally(() => {});
  };

  const addRoles = async (id) => {
    rolesChecked.forEach(async (role) => {
      setTimeout(async () => {
        // userApi
        //   .addRoles(id, role)
        //   .then((res) => {
        //     enqueueSnackbar(`Add ${role} Role Successfully`, {
        //       variant: "success",
        //     });
        //   })
        //   .catch((error) => {
        //     enqueueSnackbar(`Add ${role} Role Faild`, { variant: "error" });
        //   });
        try {
          const response = await userApi.addRoles(id, role);
          if (response.data) {
            enqueueSnackbar(`Add ${role} Role Successfully`, {
              variant: "success",
            });
          } else {
            enqueueSnackbar(`Add ${role} Role Faild`, { variant: "error" });
          }
        } catch (error) {
          enqueueSnackbar(`Add ${role} Role Faild`, { variant: "error" });
        }
      }, 1000);
    });
    rolesChecked = [];
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

  const init = () => {
    // setUsername(data?.userName | "");
    // setEmail(data?.userName | "");
    // setFullName(data?.userName | "");
    // setPassword(data?.password | "");
    // setConfirmPassword(data?.password | "");
  };

  useEffect(() => {
    console.log(props);
  }, []);

  console.log(data);
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
                // setObjEdit(value);
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
                // setFullName(value);
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
                const value = event.target.value;
                // setEmail(value);
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

            <FormLabel
              component="legend"
              className={(rolesError ? "textError" : "") + "mt-2"}
            >
              Pick Roles *
            </FormLabel>
            <FormGroup className="d-flex flex-row justify-content-evenly">
              <RoleCheckbox selectRole={selectRole} />
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
