import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useEffect } from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { userApi } from "../../api";
import { Api } from "@mui/icons-material";
import UserForm from "./UserForm";
import EditUserForm from "./EditUserForm";
import { UserContext } from "./user";
import { SnackbarProvider, useSnackbar } from "notistack";
import Moment from "react-moment";

function converDateTime(currentTime) {
  const dateTime = new Date(currentTime);
  const readableDateTime = dateTime.toLocaleString();
  return readableDateTime;
}

const actionIcon = [<BorderColorIcon />];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "numbers",
    numeric: true,
    disablePadding: false,
    label: "#",
  },
  {
    id: "createdOn",
    numeric: false,
    disablePadding: false,
    label: "Created Time",
  },
  {
    id: "userName",
    numeric: false,
    disablePadding: false,
    label: "Username",
    direction: "asc",
  },
  {
    id: "fullName",
    numeric: false,
    disablePadding: false,
    label: "Full Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "roles",
    numeric: false,
    disablePadding: false,
    label: "Roles",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { enqueueSnackbar } = useSnackbar();

  const { numSelected, selected } = props;

  const handleDeleteAll = (event) => {
    if (selected) {
      selected.forEach((item) => {
        userApi.deleteUser(item.id);
      });
      enqueueSnackbar("Detele All Successfully", { variant: "success" });
      window.location.reload(false);
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          User Table
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={(event) => handleDeleteAll(event)}>
            <h6 className="mb-0 mr-2">Delete All</h6>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const { users, getUsers } = React.useContext(UserContext);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("userName");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [numbers, setNumbers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [objEdit, setObjEdit] = React.useState(() => {
    const obj = {
      userName: "",
      fullName: "",
      email: "",
      password: "",
      role: [],
    };
    return obj;
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = (obj, event) => {
    setOpen(true);
    setObjEdit(() => {
      const newObj = {
        userName: obj.userName,
        fullName: obj.fullName,
        email: obj.email,
        password: obj.password,
        role: obj.roles,
      };
      return newObj;
    });
  };

  const handleDelete = async (obj, event) => {
    const res = await userApi.deleteUser(obj.id);
    try {
      if (res.data) {
        enqueueSnackbar(res.data, { variant: "success" });
        await window.location.reload(false);
      } else {
        if (res.description) {
          enqueueSnackbar(res.description, { variant: "error" });
        } else {
          enqueueSnackbar("Delete Failed", { variant: "error" });
        }
      }
    } catch {
      enqueueSnackbar("Delete Failed, Try again", { variant: "error" });
    }
  };

  const handleAssnignRoles = (obj) => {
    console.log(obj);
  };

  // useEffect(() => {

  // }, [setNumbers, getNumbers])

  const init = React.useCallback(() => {
    const handleData = () => {
      users.forEach((row) => {
        if (row.roles.length > 0 && Array.isArray(row.roles)) {
          row.roles = row.roles.join(", ");
        }
      });

      const getNumbers = () => {
        let nbs = [];
        for (let i = 1; i <= users.length; i++) {
          nbs.push(i);
        }
        setNumbers(nbs);
      };

      handleData();
      getNumbers();
    };
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = users.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(users, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  init();
  useEffect(() => {});

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.userName}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                        onClick={(event) => handleClick(event, row)}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(event) => handleClick(event, row)}
                    >
                      {index}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(event) => handleClick(event, row)}
                    >
                      <Moment format="YYYY/MM/DD hh:mm">{row.createOn}</Moment>
                    </TableCell>
                    <TableCell
                      align="right"
                      component="th"
                      id={labelId}
                      scope="row"
                      direction="asc"
                      onClick={(event) => handleClick(event, row)}
                    >
                      {row.userName}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(event) => handleClick(event, row)}
                    >
                      {row.fullName}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(event) => handleClick(event, row)}
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(event) => handleClick(event, row)}
                    >
                      {row.roles}
                    </TableCell>
                    <TableCell
                      align="right"
                      hidden
                      onClick={(event) => handleClick(event, row)}
                    >
                      {row.password}
                    </TableCell>
                    <TableCell
                      align="right"
                      className="d-flex justify-content-end"
                    >
                      <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={(event) => handleDelete(row, event)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={(event) => handleEdit(row, event)}
                      >
                        <BorderColorIcon />
                      </IconButton>
                      <IconButton
                        aria-label="addRoles"
                        color="primary"
                        onClick={(event) => handleAssnignRoles(row, event)}
                      >
                        <AssignmentIndIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />

      <EditUserForm
        data={objEdit}
        setData={setObjEdit}
        openDialog={open}
        setOpenDialog={setOpen}
        title="Edit User"
        txtBtn="Edit"
        username={objEdit.userName}
        fullName={objEdit.fullName}
        email={objEdit.email}
        password={objEdit.password}
        roles={objEdit.roles}
      />
    </Box>
  );
}
