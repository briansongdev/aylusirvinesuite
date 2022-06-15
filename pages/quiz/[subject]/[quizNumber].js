import Head from "next/head";
import Link from "next/link";
import {
  Stack,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Grid,
  Alert,
  Container,
  Backdrop,
  CircularProgress,
  Paper,
} from "@mui/material";
import { parseCookies } from "nookies";
import verifyCookie from "../../../fire/verifyCookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../../../fire/fireConfig";
import PageVisibility from "react-page-visibility";

const TakeQuiz = (props) => {
  const [confirmation, setConfirmation] = useState(false);
  const router = useRouter();
  const { subject, quizNumber } = router.query;

  const [quizContent, setContent] = useState([]);

  const [finishedGetQuestions, updateStatus] = useState(false);

  const [studentAnswers, changeStudentAnswers] = useState([]);

  const [open, setOpen] = useState(false);

  const [isRecording, setRecording] = useState(false);

  const handleChange = (isVisible) => {
    if (isRecording) {
      if (!isVisible) {
        gradePaper();
      }
    }
  };

  async function gradePaper() {
    setOpen(true);
    let correctPoints = 0,
      answerArray = [],
      questionArray = [];
    for (let k = 0; k < studentAnswers.length; k++) {
      if (studentAnswers[k] == quizContent[k].answer) {
        correctPoints += 1;
      }
      answerArray.push(quizContent[k].answer);
      questionArray.push(quizContent[k].content);
    }
    await setDoc(
      doc(db, "users", props.uid),
      {
        grades: arrayUnion({
          nameOfQuiz: props.quizName,
          questions: questionArray,
          answers: answerArray,
          userAnswers: studentAnswers,
          numCorrect: correctPoints,
          numTotal: studentAnswers.length,
          dateFinished: JSON.stringify(Timestamp.now()),
        }),
      },
      { merge: true }
    );
    router.push("/user");
  }

  useEffect(() => {
    if (!finishedGetQuestions) {
      const fetchData = async () => {
        setContent(
          await (await getDoc(doc(db, "messages", subject))).data().quizzes[
            quizNumber
          ].content
        );
        let studentAnswerArray = [];
        for (
          let i = 0;
          i <
          (await (await getDoc(doc(db, "messages", subject))).data().quizzes[
            quizNumber
          ].content.length);
          i++
        ) {
          studentAnswerArray.push("");
        }
        changeStudentAnswers(studentAnswerArray);
        updateStatus(true);
      };
      fetchData();
    }
    const fetchTaken = async () => {
      if (
        (await (await getDoc(doc(db, "messages", subject))).data().quizzes[
          quizNumber
        ].quizSynced) &&
        !(await (await getDoc(doc(db, "messages", subject))).data().quizzes[
          quizNumber
        ].isActive)
      ) {
        await gradePaper();
      }
    };
    fetchTaken();
  }, [JSON.stringify(studentAnswers)]);

  const listQuizQuestions = quizContent.map((d, index) => {
    return (
      <Stack key={index}>
        <Typography variant="h6">
          <strong>
            Question {index + 1}: {d.content}
          </strong>
        </Typography>{" "}
        <Stack direction="row" key={index} spacing={2}>
          {d.choices.map((e, asdad) => {
            return (
              <Paper
                key={asdad}
                elevation={3}
                style={{
                  width: "250px",
                  overflow: "auto",
                  height: "100px",
                  margin: "15px 15px 15px 15px",
                }}
              >
                <IconButton
                  style={{ borderRadius: 0, width: "100%", height: "100%" }}
                  onClick={() => {
                    let newArr = studentAnswers.slice();
                    newArr[index] = e;
                    changeStudentAnswers(newArr.slice());
                  }}
                  color={studentAnswers[index] == e ? "primary" : "inherit"}
                >
                  <Typography style={{ padding: "10px 10px 10px 10px" }}>
                    <strong>{e}</strong>
                  </Typography>
                </IconButton>
              </Paper>
            );
          })}{" "}
        </Stack>
      </Stack>
    );
  });

  return (
    <>
      <PageVisibility onChange={handleChange}>
        <>
          <Head>
            <title>Taking quiz in {subject} - Suite</title>
          </Head>
          <Box>
            <AppBar position="static" sx={{ bgcolor: "#fafafa" }} elevation={0}>
              <Toolbar>
                <Box sx={{ flexGrow: 1, ml: "10%" }}>
                  {" "}
                  <Link href="/">
                    <p>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontFamily: "Barlow Condensed",
                          fontSize: "60px",
                          cursor: "pointer",
                        }}
                        id="vibrantIcon"
                      >
                        AYLUS Irvine{" "}
                      </span>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontFamily: "Lexend Deca",
                          fontSize: "30px",
                          cursor: "pointer",
                        }}
                        id="vibrantIcon"
                      >
                        suite.
                      </span>
                    </p>
                  </Link>
                </Box>
              </Toolbar>
            </AppBar>

            <Container>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ margin: "10px 5px 0px 5px" }}
              >
                <Typography>Taking: {props.quizName}</Typography>
                {!confirmation ? (
                  <>
                    <Alert
                      severity="warning"
                      style={{ width: "50%", margin: "5px 5px 5px 5px" }}
                    >
                      <strong>
                        Once you start this quiz, you will not be able to leave
                        the tab, go back to Zoom, or pause and return later.
                        <br />
                        <br /> If you leave, you will be redirected to the
                        homepage, and your score will be immediately graded.{" "}
                        <br />
                        <br />
                        <span style={{ textDecoration: "underline" }}>
                          Again, you won&apos;t be able to return later.
                        </span>
                      </strong>{" "}
                      <br />
                      <br />
                      For synchronous quizzes, if the teacher stops the quiz,
                      your answers will all be saved AND submitted.{" "}
                      <strong>Good luck!</strong>
                    </Alert>
                    <Button
                      onClick={async () => {
                        setRecording(true);
                        setConfirmation(true);
                        await setDoc(
                          doc(db, "users", props.uid),
                          {
                            activeQuizzes: arrayUnion({
                              quizSubject: subject,
                              quizNumber: quizNumber,
                              quizTitle: props.quizName,
                              date: JSON.stringify(Timestamp.now()),
                            }),
                          },
                          { merge: true }
                        );
                      }}
                      variant="outlined"
                      style={{ margin: "15px 15px 15px 15px" }}
                      size="large"
                    >
                      Confirm and start
                    </Button>
                  </>
                ) : (
                  <>
                    <Alert
                      severity="error"
                      style={{ width: "50%", margin: "5px 5px 5px 5px" }}
                    >
                      Do not refresh this page, close or leave the tab, or
                      return to Zoom. Your progress will be lost, and you
                      won&apos;t be able to return.{" "}
                      <span style={{ color: "green" }}>Good luck!</span>
                    </Alert>
                    <Container>{listQuizQuestions}</Container>
                    <Button
                      variant="outlined"
                      style={{ margin: "15px 15px 15px 15px" }}
                      size="large"
                      color="secondary"
                      onClick={async () => {
                        await gradePaper();
                      }}
                    >
                      Submit Quiz
                    </Button>
                  </>
                )}
              </Grid>
            </Container>
          </Box>
          <Backdrop sx={{ color: "#fff" }} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>{" "}
        </>
      </PageVisibility>
    </>
  );
};
export async function getServerSideProps(context) {
  const { subject, quizNumber } = context.query;
  if (
    !(
      subject == "Math" ||
      subject == "Physics" ||
      subject == "Computer Science" ||
      subject == "Piano"
    )
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (
    await (await getDoc(doc(db, "messages", subject))).data().quizzes[
      quizNumber
    ]
  ) {
    if (
      (await (await getDoc(doc(db, "messages", subject))).data().quizzes[
        quizNumber
      ].quizSynced) &&
      !(await (await getDoc(doc(db, "messages", subject))).data().quizzes[
        quizNumber
      ].isActive)
    ) {
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

  let userDetails = {
    details: {},
    quizName: "",
    uid: "",
  };

  const cookies = parseCookies(context);

  if (cookies.user) {
    const authentication = await verifyCookie(cookies.user);
    if (authentication.authenticated) {
      // authentication.uid

      // check if quiz was already started/taken

      let arrOfActiveQuizzes = await (
        await getDoc(doc(db, "users", authentication.uid))
      ).data().activeQuizzes;
      for (let i = 0; i < arrOfActiveQuizzes.length; i++) {
        if (
          arrOfActiveQuizzes[i].quizSubject == subject &&
          arrOfActiveQuizzes[i].quizNumber == quizNumber
        ) {
          return {
            redirect: {
              destination: "/user",
              permanent: false,
            },
          };
        }
      }

      userDetails.details = await (
        await getDoc(doc(db, "users", authentication.uid))
      ).data();
      userDetails.uid = authentication.uid;
      userDetails.quizName = await (
        await getDoc(doc(db, "messages", subject))
      ).data().quizzes[quizNumber].title;
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
export default TakeQuiz;
