import Head from "next/head";
import Link from "next/link";
import {
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Box,
  Button,
  Grid,
  Paper,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Avatar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { parseCookies } from "nookies";
import verifyCookie from "../fire/verifyCookie";
import { useState, useEffect } from "react";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../fire/fireConfig";

const AboutMe = (props) => {
  const gradeList = props.details.grades;

  const [usernameValue, changeUsernameValue] = useState("");
  const [currentQuiz, changeCurrentQuiz] = useState(0);
  const [openDialog, changeOpenStatus] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      window.location.reload(false);
    }, 1800001);
  }, []);

  function gradeCalc() {
    let totalNumCorrect = 0,
      totalNumTotal = 0;
    for (let i = 0; i < gradeList.length; i++) {
      totalNumCorrect += gradeList[i].numCorrect;
      totalNumTotal += gradeList[i].numTotal;
    }
    if (totalNumTotal == 0) return "N/A";
    return (100 * totalNumCorrect) / totalNumTotal;
  }

  return (
    <>
      <Head>
        <title>Suite by AYLUS Irvine</title>
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
            <>
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
            </>
          </Toolbar>
        </AppBar>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ paddingTop: "15px" }}
        >
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              alt="AYLUS Irvine"
              src="aylus.jpg"
              sx={{ width: 100, height: 100 }}
              style={{
                border: "0.1px solid lightgray",
              }}
            />
            <Typography variant="h2">
              <strong id="teacherIcon">Welcome, {props.details.name}!</strong>
            </Typography>
          </Stack>
          {props.details.name == "Unknown User" ? (
            <Paper elevation={3} style={{ textAlign: "center", width: "60%" }}>
              <Stack style={{ padding: "10px 10px 10px 10px" }}>
                <Typography>
                  Change your name to unlock the rest of your dashboard. You
                  cannot change this later.
                </Typography>
                <TextField
                  variant="filled"
                  label="Edit name here"
                  value={usernameValue}
                  onChange={(e) => {
                    changeUsernameValue(e.target.value);
                  }}
                />
                <Button
                  onClick={async () => {
                    setOpen(true);
                    await setDoc(
                      doc(db, "users", props.uid),
                      {
                        name: usernameValue,
                      },
                      { merge: true }
                    );
                    window.location.reload(false);
                  }}
                >
                  Edit name
                </Button>
              </Stack>
            </Paper>
          ) : (
            <>
              <Container>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  style={{ marginTop: "30px" }}
                >
                  <Stack direction="column">
                    <Typography variant="h2" id="vibrantIcon">
                      My stats
                    </Typography>
                    <Typography>
                      Currently enrolled in {props.details.courses.length}{" "}
                      classes:
                    </Typography>
                    {props.details.courses.map((e) => {
                      return <Typography>- {e}</Typography>;
                    })}
                    <br />
                    <Typography>
                      Registered email: <strong>{props.details.email}</strong>
                    </Typography>
                    <br />
                    <Typography>
                      Cumulative grade:{" "}
                      {gradeCalc() > 60 ? (
                        <strong style={{ color: "green" }}>
                          {gradeCalc()}%
                        </strong>
                      ) : (
                        <strong>{gradeCalc()}%</strong>
                      )}
                    </Typography>
                  </Stack>
                  <Stack direction="column">
                    <Typography variant="h3" id="vibrantIcon">
                      Quizzes Taken/Finished
                    </Typography>
                    <br />
                    {props.details.activeQuizzes.map((e) => {
                      return (
                        <Typography>
                          {e.quizSubject}: {e.quizTitle} started{" "}
                          {new Date(
                            JSON.parse(e.date).seconds * 1000
                          ).toLocaleString()}
                        </Typography>
                      );
                    })}
                    <br />
                    <Typography variant="h3" id="vibrantIcon">
                      Review Past Quizzes
                    </Typography>
                    <br />
                    {props.details.grades.map((e, index) => {
                      return (
                        <>
                          <Typography>
                            {e.nameOfQuiz} finished{" "}
                            {new Date(
                              JSON.parse(e.dateFinished).seconds * 1000
                            ).toLocaleString()}
                            .{" "}
                            <strong>
                              Score: {e.numCorrect} out of {e.numTotal}
                            </strong>
                          </Typography>
                          <Button
                            variant="outlined"
                            style={{
                              width: "50%",
                              margin: "7px 7px 7px 7px",
                            }}
                            onClick={() => {
                              // set currentQuiz state, and also open dialog
                              changeCurrentQuiz(index);
                              changeOpenStatus(true);
                            }}
                          >
                            Review this quiz
                          </Button>
                        </>
                      );
                    })}
                  </Stack>
                </Grid>
              </Container>
            </>
          )}
        </Grid>
      </Box>
      {gradeList.length > 0 ? (
        <Dialog open={openDialog}>
          <DialogTitle>
            Reviewing {gradeList[currentQuiz].nameOfQuiz}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Completed:{" "}
              {new Date(
                JSON.parse(gradeList[currentQuiz].dateFinished).seconds * 1000
              ).toLocaleString()}
            </DialogContentText>
            <DialogContentText>
              Score: {gradeList[currentQuiz].numCorrect} of{" "}
              {gradeList[currentQuiz].numTotal}
            </DialogContentText>
            <br />
            {gradeList[currentQuiz].questions.map((el, index) => {
              return (
                <Stack>
                  <Typography>
                    Question {index + 1}: {el}
                  </Typography>
                  <DialogContentText>
                    You chose: {gradeList[currentQuiz].userAnswers[index]}
                  </DialogContentText>
                  <DialogContentText>
                    Correct answer: {gradeList[currentQuiz].answers[index]}
                  </DialogContentText>
                  {gradeList[currentQuiz].userAnswers[index] ==
                  gradeList[currentQuiz].answers[index] ? (
                    <>
                      <Typography style={{ color: "green" }}>
                        Nice job! 👍
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography style={{ color: "red" }}>
                        Wrong answer. 😥
                      </Typography>
                    </>
                  )}
                  <br />
                </Stack>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                changeOpenStatus(false);
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
      <Backdrop sx={{ color: "#fff" }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export async function getServerSideProps(context) {
  let userDetails = {
    details: {},
    uid: "",
  };

  const cookies = parseCookies(context);

  if (cookies.user) {
    const authentication = await verifyCookie(cookies.user);
    if (authentication.authenticated) {
      if (
        await (await getDoc(doc(db, "users", authentication.uid))).data()
          .isTeacher
      ) {
        // redirect to teacher page
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      if (
        (await (await getDoc(doc(db, "users", authentication.uid))).data()
          .courses.length) == 0
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
export default AboutMe;
