import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import {
    Alert,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "./bg.jpg";
import Cookies from "js-cookie";
import { userApi } from "../../api";

const style = {
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    flexFlow: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
};

function ForgotPassword() {
    var pattern = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    );

    const [err, setErr] = useState(false);
    let navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setErr(false);
    };

    const toastMessage = (status, title, text) => {
        Swal.fire({
            icon: status,
            title: title,
            text: text
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const forgotPassword = async () => {
            try {
                if (pattern.test(password)) {
                    if (password === confirmPassword) {
                        const body = {
                            username,
                            password,
                            confirmPassword
                        };
                        var response = await userApi.forgotPassword(body);
                        setLoading(false);
                        toastMessage('success', 'Password and Confirm Password are ready to use', 'Everything ok');
                    } else {
                        toastMessage('error', 'Password and Confirm Password must be the same', 'Something went wrong!');
                    }
                } else {
                    toastMessage('error', 'Password should have uppercase, lowercase letters, numbers and special characters', 'Something went wrong!');
                }
            } catch (error) {
                setLoading(false);
                setErr(true);
                setMessage(error.response.data.description);
            }
        };
        forgotPassword();
    };

    return (
        <div style={style}>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={err}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>

            <Paper
                sx={{
                    padding: "40px",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "30px",
                }}
            >
                <Typography
                    sx={{
                        color: "#408DBA",
                        textAlign: "center",
                    }}
                    variant="h5"
                    component="h1"
                >
                    <b>Video App</b>
                </Typography>

                <Grid
                    sx={{
                        mt: "20px",
                        width: "18vw",
                        minWidth: "300px",
                    }}
                    container
                    spacing={2}
                    component="form"
                    onSubmit={handleSubmit}
                    autoComplete="false"
                >

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username or Email"
                            variant="outlined"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            required
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                // <-- This is where the toggle button is added.
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            fullWidth
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                                // <-- This is where the toggle button is added.
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownConfirmPassword}
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        mt={3}
                        alignItems="center"
                        display="flex"
                        position="relative"
                    >
                        <Button
                            variant="contained"
                            sx={{
                                paddingLeft: "70px",
                                paddingRight: "70px",
                                margin: "auto",
                                backgroundColor: "#408DBA",
                            }}
                            disabled={loading}
                            type="submit"
                        >
                            Reset Password
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={25}
                                sx={{
                                    color: "blue",
                                    position: "absolute",
                                    top: "40%",
                                    left: "50%",
                                }}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <div
                            style={{
                                textAlign: "center",
                                color: "#408DBA",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/signUp")}
                        >
                            Don't have account! Sign Up Now!
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default ForgotPassword;
