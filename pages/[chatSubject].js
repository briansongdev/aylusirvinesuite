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
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { parseCookies } from "nookies";
import verifyCookie from "../fire/verifyCookie";
import { useState, useEffect } from "react";
import axios from "axios";
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

  useEffect(() => {
    const docRef = doc(db, "messages", chatSubject);
    //real time update
    setTimeout(async () => {
      updateChat(await (await getDoc(docRef)).data().chat);
    }, 5000);
    setTimeout(() => {
      window.location = "/";
    }, 900001);
  }, [chat]);

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
            Refreshes every 5 seconds (slow mode). Help each other; be nice.{" "}
            <span style={{ fontWeight: "bold" }}>
              What you say cannot be deleted.
            </span>
          </Typography>
        </Box>
        <Paper
          style={{ padding: "15px 15px 15px 15px", height: "65vh" }}
          elevation={2}
        >
          {chat.map((d) => {
            return (
              <>
                {d.user != props.details.name ? (
                  <>
                    <Typography>
                      {d.isTeacher ? (
                        <>
                          {" "}
                          <span id="teacherIcon">[TEACHER] {d.user}: </span>
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
                            <span id="teacherIcon">[TEACHER] {d.user}: </span>
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
              </>
            );
          })}
        </Paper>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            style={{ width: "80%", marginTop: "5px" }}
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
            disabled={currentMessage == ""}
          >
            Submit
          </Button>
        </Grid>
      </Container>
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
