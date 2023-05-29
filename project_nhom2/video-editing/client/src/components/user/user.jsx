import * as React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UserTable from "./UserTable";
import "./user.css";
import UserForm from "./UserForm";
import userApi from "../../api/user";
import { useEffect } from "react";
import { useCallback } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";

// data = getUsers();
// console.log(data);
export const UserContext = React.createContext();

let dataValue = [];
const User = () => {
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  // const [users, setUsers] = React.useState([
  //   {id: '2e306c1c-683d-4dae-ab12-74c1131786ae', userName: 'hautran', email: 'hautran@gmail.com', fullName: 'Tran Trung Hau',},
  //   {id: '956693da-b54f-49cc-9e25-3e17d6701592', userName: 'hautran02', email: 'hautran02@gmail.com', fullName: 'Tran Trung Hau'},
  //   ]);
  const [users, setUsers] = React.useState([]);
  const [fetchData, setFetchData] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const getUsers = async () => {
    let response = await userApi.getAllUser();
    dataValue = response.data;
    setUsers(dataValue);
  };
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickDelete = () => {
    enqueueSnackbar('This is a success message!', {variant:"warning"});
  }

  const handleClick = () => {
    enqueueSnackbar("I love snacks.");
  };

  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("This is a success message!", { variant });
  };

  // GET TABLE USER
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <UserContext.Provider value={{users, getUsers}} className="container-fluid">
      <div className="row title">
        <div className="d-flex justify-content-between mb-4">
          <h2>User Manager</h2>
          <div className="list-btn">
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
        <UserTable data={users}></UserTable>
      </div>

      <UserForm
        openDialog={open}
        setOpenDialog={setOpen}
        title="Add User"
        txtBtn="Add"
      />
    </UserContext.Provider>
  );
};

export default User;
