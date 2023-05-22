import * as React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UserTable from "./UserTable";
import "./user.css";
import UserForm from "./UserForm";
import userApi from "../../api/user";
import { useEffect } from "react";

const User = () => {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const getUsers = async () => {
    try {
      await userApi.getAllUser().then((response) => {
        setUsers(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // GET TABLE USER
  useEffect(() => {
    getUsers();
  }, []);

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
        <UserTable data={users}></UserTable>
      </div>

      <UserForm openDialog={open} setOpenDialog={setOpen} />
    </div>
  );
};

export default User;
