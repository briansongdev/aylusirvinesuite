import React, { useState } from "react";
import {
  Container,
  TextField,
  Backdrop,
  CircularProgress,
  Grid,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import Head from "next/head";
import signIn from "../hooks/useAuth";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// We need to detect if user entered wrong passcode (not router push) or if user is logged in already

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const isDisabled = email === "" || password === "";
  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpen(true);
    await signIn(email, password)
      .then(() => {
        window.location = "/";
      })
      .catch((e) => {
        setOpen(false);
        alert(e.toString().replace(/^([^ ]+ ){2}/, ""));
      });
  };
  return (
    <>
      <Container style={{ width: "35vw", minWidth: "300px" }}>
        <Head>
          <title>Login to Suite</title>
        </Head>
        <br />
        <span
          style={{
            fontWeight: "bold",
            fontFamily: "Lexend Deca",
            fontSize: "60px",
          }}
          id="vibrantIcon"
        >
          suite.
        </span>
        <br />
        <br />
        <Grid justify="center" alignItems="center">
          <form onSubmit={handleSubmit}>
            <Grid item>
              <TextField
                label="Email address"
                variant="outlined"
                onChange={(v) => setEmail(v.target.value)}
                helperText="Use the email from when you signed up through the Google Form."
                style={{ width: "100%" }}
              />
            </Grid>
            <br />
            <Grid item>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                onChange={(v) => setPassword(v.target.value)}
                helperText="Enter your password here."
                style={{ width: "100%" }}
              />
            </Grid>
            <br />
            <Button
              variant="contained"
              type="submit"
              disabled={isDisabled}
              color="primary"
              style={{ width: "100%", height: "50px" }}
            >
              Log in!
            </Button>
          </form>
        </Grid>
        <br />
        <Alert severity="success">
          Avoid using VPNs to access our network and do not access the same
          account from different devices. Data mismatch and overflow may result.
        </Alert>
        <br />
        <Grid container justify="center">
          <Grid item>
            <Link href="/">
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </Link>
          </Grid>
        </Grid>
      </Container>{" "}
      <Backdrop sx={{ color: "#fff" }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export default SignIn;
