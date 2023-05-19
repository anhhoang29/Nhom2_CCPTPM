import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import UserTable from "./UserTable";
import './user.css';

const User = () => {
  return (
    <div className="container-fluid">
      <div className="row title">
        <div className="d-flex justify-content-between">
          <h2>User Manager</h2>
          <div className="list-btn">
            <Button variant="outlined" className="ms-2 button" startIcon={<DeleteIcon />}>
              Delete
            </Button>

            <Button variant="contained" className="ms-2 button" startIcon={<AddIcon />}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <UserTable></UserTable>
      </div>
    </div>
  );
};

export default User;
