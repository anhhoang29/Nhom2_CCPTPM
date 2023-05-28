import { useEffect, useRef, useState } from "react";

import {
  TextField,
  Card,
  Button,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  Autocomplete,
} from "@mui/material";
import videoEditingApi from "../../api/video-editing";
import AddIcon from "@mui/icons-material/Add";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
//import "./tournament.styles.scss";
import { ConfirmDialog, CustomDatePicker } from "../flugin";
import { useNavigate } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import TableTournament from "./TableTournament";
import { DesktopDatePicker } from "@mui/lab";
import AuthDialog from "../dialog/auth-dialog";
import { ROLE_EXCUTE, ROLE_WRITE } from "../../constants";
import { SnackbarProvider, useSnackbar } from "notistack";

const Tournament = () => {
  const [opendialog, setOpenDialog] = useState(false);
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [tournamentName, setTournamentName] = useState();
  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = useRef(null);
  const [uploadId, setUploadId] = useState();
  const [tournament, setTournament] = useState();
  const [matchName, setMatchName] = useState();
  const [time, setTime] = useState(new Date());
  const [channel, setChannel] = useState();
  const [ip, setIp] = useState();
  const [openDConfirm, setOpenDConfirm] = useState(false);
  const [rowDelete, setRowDelete] = useState();

  const [port, setPort] = useState();

  const [hidden, setHidden] = useState(true);
  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const [file, setFile] = useState(null);
  const [authDialog, setAuthDialog] = useState({
    open: false,
    content: false,
  });

  const authRoles = localStorage.getItem('roles');

  let navigate = useNavigate();

  const handleDateChange = (date) => {
    setTime(date);
  };

  const handleTournamentChange = (e, value) => {
    setTournament(value);
  };

  const getMatches = async () => {
    try {
      const response = await videoEditingApi.getMatches();
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(authRoles.includes(ROLE_WRITE)){
      var a = hidden ? tournament.id : null;
      var b = hidden ? null : tournamentName;
      const payload = {
        tournamentId: a,
        tournametName: b,
        matchName: matchName,
        mactchTime: `${time
          .toLocaleString("sv", { timeZoneName: "short" })
          .substring(0, 10)}T${("0" + time.getHours()).slice(-2)}:${(
          "0" + time.getMinutes()
        ).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}.000Z`,
        channel: channel,
        ip: ip,
        port: port,
      };
  
      const addTournament = async () => {
        try {
          const response = await videoEditingApi.addMatch(payload);
          if (response.status === 200 && response.data === "Succeed") {
            setNoti(true);
            getMatches();
            enqueueSnackbar('Add Match Successfully', {variant: 'success'});
          }
        } catch (error) {
          setNoti(true);
          enqueueSnackbar('Add Match Faild', {variant: 'error'});
          setTypeNoti("error");
          console.log(error);
        }
      };
      addTournament();
    } else {
      setAuthDialog({open: true});
    }
  };

  const handleUploadClick = () => {
    const UploadFile = async () => {
      try {
        const formdata = new FormData();
        formdata.append("jsonfile", file);
        await videoEditingApi.uploadJsonFile(uploadId, formdata);
        setNoti(true);
        setMessage("Saved");
        setTypeNoti("success");
        getMatches();
        setOpenDialog(false);
      } catch (error) {
        setNoti(true);
        setMessage(error.response.description);
        setTypeNoti("error");
        console.log(error);
      }
    };
    if (file === null) {
      setNoti(true);
      setMessage("Please select file");
      setTypeNoti("error");
    } else {
      UploadFile();
    }
  };

  const handleIconUploadClick = (match) => {
    if(authRoles.includes(ROLE_EXCUTE)){
      setUploadId(match.id);
      setFile(null);
      setOpenDialog(true);
    } else {
      setAuthDialog({open: true});
    }
  };

  const handleIconDeleteClick = (match) => {
    if(authRoles.includes(ROLE_WRITE)){
      setOpenDConfirm(true);
      setRowDelete(match);
    } else {
      setAuthDialog({open: true});
    }
  };

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const response = await videoEditingApi.getTournaments();
        setTournaments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMatches();
    getTournaments();
  }, []);

  const handleResultClick = (e, row) => {
    e.preventDefault();
    navigate("/video-edit", { state: { row } });
    console.log(row);
  };

  const handleDeleteClick = () => {
    const deleteMatch = async () => {
      try {
        await videoEditingApi.deleteMatch(rowDelete.id);
        setNoti(true);
        setMessage("Delete Succeed");
        setTypeNoti("success");
        getMatches();
      } catch (error) {
        console.log(error);
      }
    };
    deleteMatch();
  };
  const handleClose = () => {
    setOpenDialog(false);
    setOpenDConfirm(false);
  };
  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleConfirmClick = () => {
    handleDeleteClick();
    setOpenDConfirm(false);
  };
  return (
    <>
      <ConfirmDialog
        title="Confirm"
        description="Are you sure to delete the record?"
        onClose={handleClose}
        onConfirm={handleConfirmClick}
        open={openDConfirm}
      />
      <Dialog open={opendialog} onClose={handleClose} scroll={scroll}>
        <DialogTitle
          sx={{
            backgroundColor: "#CEEBF9",
            fontSize: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          id="scroll-dialog-title"
        >
          <h4>Upload json file</h4>
          <Button variant="contained" onClick={handleUploadClick}>
            Upload
          </Button>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <FileUploader
              handleChange={handleFileChange}
              name="file"
              types={["JSON"]}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={noti}
        autoHideDuration={5000}
        onClose={() => setNoti(false)}
      >
        <Alert
          onClose={() => setNoti(false)}
          severity={typeNoti}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Card
        sx={{
          width: "50%",
          padding: 5,
          margin: "auto",
          marginBottom: 3,
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center" }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid item xs={3}>
            League Name
          </Grid>

          <Grid item xs={9}>
            <div hidden={!hidden}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* <Tooltip title="Add new option for Tournament" placement="top"> */}
                <IconButton color="primary" onClick={() => setHidden(!hidden)}>
                  <AddIcon />
                </IconButton>
                {/* </Tooltip> */}
                <Autocomplete
                  options={tournaments ? tournaments : []}
                  size="small"
                  value={tournament || null}
                  fullWidth
                  getOptionLabel={(option) => option["name"] || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select league name"
                      variant="standard"
                      required={hidden}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                  onChange={handleTournamentChange}
                />
              </div>
            </div>
            <div hidden={hidden}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* <Tooltip title="Back to select Tournament" placement="top"> */}
                <IconButton color="primary" onClick={() => setHidden(!hidden)}>
                  <ArrowLeftIcon />
                </IconButton>
                {/* </Tooltip> */}
                <TextField
                  value={tournamentName}
                  variant="standard"
                  size="small"
                  onChange={(e) => setTournamentName(e.target.value)}
                  fullWidth
                  required={!hidden}
                  placeholder="Enter league name"
                />
              </div>
            </div>
          </Grid>
          {/* <Grid item xs={0.5}>
            
          </Grid> */}
          <Grid item xs={3}>
            Match Name
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={matchName}
              variant="standard"
              size="small"
              onChange={(e) => setMatchName(e.target.value)}
              fullWidth
              required
              placeholder="Enter match name"
            />
          </Grid>

          <Grid item xs={3}>
            Time
          </Grid>
          <Grid item xs={9}>
            <CustomDatePicker
              variant="standard"
              value={time}
              onChange={handleDateChange}
            />
          </Grid>

          <Grid item xs={3}>
            Channel
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={channel}
              variant="standard"
              size="small"
              onChange={(e) => setChannel(e.target.value)}
              fullWidth
              required
              placeholder="Enter Channel Name"
            />
          </Grid>
          <Grid item xs={1}>
            IP
          </Grid>
          <Grid item xs={5}>
            <TextField
              value={ip}
              variant="standard"
              size="small"
              onChange={(e) => setIp(e.target.value)}
              fullWidth
              required
              placeholder="Enter IP"
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2}>
            Port
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={port}
              variant="standard"
              size="small"
              onChange={(e) => setPort(e.target.value)}
              fullWidth
              required
              placeholder="Enter Port"
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>

      <TableTournament
        data={matches}
        titleSearch={tournaments}
        handleResultClick={handleResultClick}
        handleIconUploadClick={handleIconUploadClick}
        handleIconDeleteClick={handleIconDeleteClick}
        openAuthDialog={authDialog.open}
        setOpenAuthDialog = {setAuthDialog}
        content={authDialog.content}
      />

      <AuthDialog open={authDialog.open} setOpen={setAuthDialog} content={authDialog.content}/>
    </>
  );
};

export default Tournament;
