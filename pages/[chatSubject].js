import Head from "next/head";
import Link from "next/link";
import {
  Typography,
  AppBar,
  Toolbar,
  TextField,
  Box,
  Menu,
  MenuItem,
  Button,
  Paper,
  Grid,
  Container,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { parseCookies } from "nookies";
import verifyCookie from "../fire/verifyCookie";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePageVisibility } from "react-page-visibility";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../fire/fireConfig";

import { useRouter } from "next/router";

const Chat = (props) => {
  const [chat, updateChat] = useState(JSON.parse(props.messages));
  const [currentMessage, setMessage] = useState("");
  const router = useRouter();
  const { chatSubject } = router.query;
  const isVisible = usePageVisibility();
  const [open, setOpen] = useState(false);

  const [chatPinged, changePinged] = useState();

  useEffect(() => {
    const docRef = doc(db, "messages", chatSubject);
    //real time update
    if (isVisible) {
      setTimeout(async () => {
        changePinged(await (await getDoc(docRef)).data().ping);
        updateChat(await (await getDoc(docRef)).data().chat);
      }, 5000);
    }
  }, [chat]);

  useEffect(() => {
    setTimeout(() => {
      window.location = "/";
    }, 900001);
  }, []);

  return (
    <>
      <Head>
        <title>Suite - {chatSubject} Chat</title>
      </Head>
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#fafafa" }} elevation={0}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, ml: "10%" }}>
              {" "}
              <Link href="/">
                <span
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Lexend Deca",
                    fontSize: "60px",
                    cursor: "pointer",
                  }}
                  id="vibrantIcon"
                >
                  suite.
                </span>
              </Link>
            </Box>
            <Button
              sx={{ mr: "10%" }}
              onClick={() => {
                setOpen(true);
                axios.post("/api/logout").then(
                  setTimeout(() => {
                    window.location = "/";
                  }, 500)
                );
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Container style={{ padding: "10px 10px 10px 10px" }}>
        <Box style={{ textAlign: "center" }}>
          <Typography
            style={{ fontWeight: "bold", margin: "10px 10px 10px 10px" }}
            variant="h5"
          >
            Welcome to {chatSubject} Chat!
          </Typography>
          <Typography style={{ margin: "10px 10px 10px 10px" }}>
            Refreshes every 5 seconds (slow mode). Stay on topic; help each
            other.{" "}
            <span style={{ fontWeight: "bold" }}>
              What you say cannot be deleted.
            </span>
          </Typography>
        </Box>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            style={{ width: "60%", marginTop: "5px" }}
            label="What would you like to say?"
            variant="filled"
            value={currentMessage}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button
            onClick={async () => {
              await setDoc(
                doc(db, "messages", chatSubject),
                {
                  chat: arrayUnion({
                    user: props.details.name,
                    message: currentMessage,
                    time: Timestamp.now(),
                    email: props.details.email,
                    isTeacher: props.details.isTeacher,
                  }),
                },
                { merge: true }
              );
              setMessage("");
            }}
            size="large"
            variant="contained"
            disabled={currentMessage == ""}
            style={{ margin: "5px 5px 5px 10px" }}
          >
            Submit
          </Button>
          {!props.details.isTeacher ? (
            <Button
              onClick={async () => {
                if (
                  confirm(
                    "Only ping teachers to report the chat, or if you have a pressing question in the chat. Your name/email will be recorded when you ping."
                  )
                ) {
                  setOpen(true);
                  await setDoc(
                    doc(db, "messages", chatSubject),
                    {
                      ping: {
                        name: props.details.name,
                        email: props.details.email,
                      },
                    },
                    { merge: true }
                  );
                  window.location.reload(false);
                }
              }}
              disabled={
                typeof chatPinged == "undefined" || !chatPinged.name == ""
              }
              style={{ margin: "5px 5px 5px 60px" }}
              variant="contained"
              size="large"
            >
              {typeof chatPinged == "undefined" || !chatPinged.name == "" ? (
                <>Already Pinged</>
              ) : (
                <>Ping Teachers </>
              )}
            </Button>
          ) : (
            <></>
          )}
        </Grid>
        <Paper
          style={{
            padding: "15px 15px 15px 15px",
            margin: "10px 10px 10px 10px",
            height: "60vh",
          }}
          elevation={2}
        >
          <Box
            style={{
              overflow: "auto",
              height: "55vh",
            }}
          >
            {chat
              .slice()
              .reverse()
              .map((d) => {
                return (
                  <>
                    <div style={{ paddingRight: "10px" }}>
                      {d.user != props.details.name ? (
                        <>
                          <Typography>
                            {d.isTeacher ? (
                              <>
                                {" "}
                                <span id="teacherIcon">
                                  [TEACHER] {d.user}:{" "}
                                </span>
                                {d.message}
                              </>
                            ) : (
                              <>
                                {" "}
                                <span id="vibrantIcon">
                                  {d.user} ({d.email}):{" "}
                                </span>
                                {d.message}
                              </>
                            )}
                          </Typography>
                          <Typography variant="overline">
                            {new Date(d.time.seconds * 1000).toLocaleString()}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Box style={{ textAlign: "right" }}>
                            <Typography>
                              {d.isTeacher ? (
                                <>
                                  {" "}
                                  <span id="teacherIcon">
                                    [TEACHER] {d.user}:{" "}
                                  </span>
                                  {d.message}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <span id="vibrantIcon">
                                    {d.user} ({d.email}):{" "}
                                  </span>
                                  {d.message}
                                </>
                              )}
                            </Typography>
                            <Typography variant="overline">
                              {new Date(d.time.seconds * 1000).toLocaleString()}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </div>
                  </>
                );
              })}
          </Box>
        </Paper>
      </Container>
      <Backdrop sx={{ color: "#fff" }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export async function getServerSideProps(context) {
  const { chatSubject } = context.query;
  if (
    !(
      chatSubject == "Math" ||
      chatSubject == "Physics" ||
      chatSubject == "Computer Science" ||
      chatSubject == "Piano"
    )
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let userDetails = {
    messages: {},
    details: {},
    uid: "",
  };

  const cookies = parseCookies(context);

  if (cookies.user) {
    const authentication = await verifyCookie(cookies.user);
    if (authentication.authenticated) {
      if (
        !(await (await getDoc(doc(db, "users", authentication.uid)))
          .data()
          .courses.includes(chatSubject))
      ) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      if (
        (await (await getDoc(doc(db, "users", authentication.uid))).data()
          .name) == "Unknown User"
      ) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      // authentication.uid
      userDetails.details = await (
        await getDoc(doc(db, "users", authentication.uid))
      ).data();
      userDetails.uid = authentication.uid;
      const docRef = doc(db, "messages", chatSubject);
      userDetails.messages = JSON.stringify(
        await (await getDoc(docRef)).data().chat
      );
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: userDetails, // will be passed to the page component as props
  };
}
export default Chat;
