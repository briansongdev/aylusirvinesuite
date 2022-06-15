import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Container,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  AlertTitle,
  Backdrop,
  CircularProgress,
  Badge,
} from "@mui/material";
import { parseCookies } from "nookies";
import verifyCookie from "../../fire/verifyCookie";
import { useState, useEffect } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import axios from "axios";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  arrayRemove,
  arrayUnion,
  Timestamp,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../fire/fireConfig";
import Linkify from "react-linkify";

const Dashboard = (props) => {
  const router = useRouter();

  const [usernameValue, changeUsernameValue] = useState("");
  const [courses, setCourses] = useState(props.details.courses);
  const [currentCourse, setCurrentCourse] = useState(props.details.courses[0]);

  const [openAnnouncement, setOpenAnnouncement] = useState(false);
  const [titleOfAnn, changeTitleAnn] = useState("");
  const [contentOfAnn, changeContentAnn] = useState("");
  const [urgencyBoolean, changeUrgency] = useState(false);

  const [announcementLists, changeAnnoucementList] = useState([]);

  const [openQuiz, setOpenQuiz] = useState(false);
  const [titleOfQuiz, changeTitleQuiz] = useState("");
  const [contentOfQuiz, changeContentQuiz] = useState([]);
  const [syncOption, changeSyncOption] = useState(false);

  const [draftQuestion, changeDraftQuestion] = useState("");
  const [totalChoices, changeTotalChoices] = useState([]);
  const [draftChoices, changeDraftChoices] = useState("");
  const [draftAnswer, changeDraftAnswer] = useState();

  const [students, changeStudents] = useState([]);
  const [quizzes, changeQuizzes] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const [pingedCourse, changePing] = useState();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      window.location.reload(false);
    }, 1800001);
    const fetchData = async () => {
      changeStudents(
        await (await getDoc(doc(db, "messages", currentCourse))).data().students
      );
      changeQuizzes(
        await (await getDoc(doc(db, "messages", currentCourse))).data().quizzes
      );
      changeAnnoucementList(
        await (await getDoc(doc(db, "messages", currentCourse))).data()
          .announcements
      );
      changePing(
        await (await getDoc(doc(db, "messages", currentCourse))).data().ping
      );
    };
    fetchData();
  }, [currentCourse]);

  let totalChoicesSoFar = totalChoices.map((d) => (
    <>
      <Typography>{d}</Typography>
    </>
  ));

  let announcementList = announcementLists
    .slice()
    .reverse()
    .map((d) => (
      <>
        {d.isUrgent ? (
          <Alert severity="error" style={{ margin: "5px 5px 5px 5px" }}>
            <AlertTitle>
              <strong>IMPORTANT - {d.title}</strong>
            </AlertTitle>
            {d.content}
            <br />
            <Typography variant="overline">
              <strong>[TEACHER]</strong> {d.name} -{" "}
              {new Date(d.time.seconds * 1000).toLocaleString()}
            </Typography>
          </Alert>
        ) : (
          <Alert
            severity="info"
            style={{ margin: "5px 5px 5px 5px" }}
            variant="outlined"
          >
            <AlertTitle>
              <strong>{d.title}</strong>
            </AlertTitle>
            {d.content}
            <br />
            <Typography variant="overline">
              <strong>[TEACHER]</strong> {d.name} -{" "}
              {new Date(d.time.seconds * 1000).toLocaleString()}
            </Typography>
          </Alert>
        )}
      </>
    ));

  let quizQuestions = contentOfQuiz.map((d, index) => (
    <>
      <Typography style={{ fontWeight: "bold" }}>
        Question {index + 1}: {d.content}
      </Typography>
      <Typography>Choices: {JSON.stringify(d.choices)}</Typography>
      <Typography>Answer: {d.answer}</Typography>
    </>
  ));

  let currentQuizzes = quizzes.map((d, index) => (
    <>
      <Typography
        style={{
          paddingLeft: "20px",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <span id="vibrantIcon">
          {" "}
          Quiz {index + 1}: {d.title} (
          {d.quizSynced ? "Synchronous" : "Asynchronous"})
        </span>{" "}
        Created by {d.createdBy} at{" "}
        {new Date(d.time.seconds * 1000).toLocaleString()}
        {d.quizSynced && !d.isActive ? (
          <Button
            onClick={async () => {
              setOpen(true);
              let arrToChange = await (
                await getDoc(doc(db, "messages", currentCourse))
              ).data().quizzes;
              arrToChange[index].isActive = true;
              await updateDoc(doc(db, "messages", currentCourse), {
                quizzes: arrToChange,
              });
              window.location.reload(false);
            }}
          >
            Unlock Synced Quiz
          </Button>
        ) : (
          <></>
        )}
        {d.quizSynced && d.isActive ? (
          <Button
            onClick={async () => {
              setOpen(true);
              let arrToChange = await (
                await getDoc(doc(db, "messages", currentCourse))
              ).data().quizzes;
              arrToChange[index].isActive = false;
              await updateDoc(doc(db, "messages", currentCourse), {
                quizzes: arrToChange,
              });
              window.location.reload(false);
            }}
          >
            Lock Synced Quiz
          </Button>
        ) : (
          <></>
        )}
      </Typography>
    </>
  ));

  let currentStudents = students.map((d) => (
    <>
      <Typography
        style={{
          paddingLeft: "20px",
          paddingTop: "10px",
        }}
      >
        {d.name} - {d.email}
      </Typography>
    </>
  ));

  let classItems = courses.map((d, index) => (
    <>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          selected={selectedIndex === index}
          onClick={(e) => {
            setCurrentCourse(d);
            handleListItemClick(e, index);
          }}
        >
          <ListItemText primary={d} />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  ));

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
            <>
              <Button
                sx={{ mr: "10%" }}
                onClick={async () => {
                  setOpen(true);
                  await axios.post("/api/logout").then(
                    setTimeout(() => {
                      window.location.reload(false);
                    }, 1000)
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
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Stack style={{ padding: "10px 5px 0px 5px" }}>
              <Typography variant="h5">
                Welcome to <span id="vibrantIcon">suite.</span>
              </Typography>
            </Stack>

            {props.details.courses.length > 2 ? (
              <Typography
                style={{ paddingTop: "10px", textDecoration: "underline" }}
              >
                By default, all courses are assigned to you as a teacher. You
                have <strong>{courses.length}</strong> currently. Please remove
                the ones you are not teaching.{" "}
              </Typography>
            ) : (
              <></>
            )}
            {props.details.name == "Unknown Teacher" ? (
              <Paper
                elevation={3}
                style={{ textAlign: "center", width: "20%" }}
              >
                <Stack style={{ padding: "10px 10px 10px 10px" }}>
                  <Typography>
                    Change to your first name to unlock the rest of the
                    dashboard.
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
                {" "}
                <Container>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    spacing={2}
                    style={{ paddingTop: "20px" }}
                  >
                    <Grid item xs={2}>
                      {" "}
                      <Divider />
                      <List>
                        <ListItem disablePadding>
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography
                                variant="h5"
                                style={{ fontWeight: "bold" }}
                              >
                                Courses I am Teaching
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider />
                        {classItems}
                      </List>
                    </Grid>
                    <Grid item xs={10}>
                      <AppBar position="static" elevation={0}>
                        <Toolbar>
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, fontWeight: "bold" }}
                          >
                            {currentCourse} Class
                          </Typography>
                          <Button
                            color="inherit"
                            onClick={() => {
                              setOpenAnnouncement(true);
                            }}
                          >
                            Create an Announcement
                          </Button>
                          <Button
                            color="inherit"
                            onClick={() => {
                              setOpenQuiz(true);
                            }}
                          >
                            Create a Quiz
                          </Button>
                          <Button
                            color="secondary"
                            onClick={async () => {
                              if (
                                confirm(
                                  "Confirm remove? To add back this course, you'll need to contact Brian."
                                )
                              ) {
                                setOpen(true);
                                await setDoc(
                                  doc(db, "users", props.uid),
                                  {
                                    courses: arrayRemove(currentCourse),
                                  },
                                  { merge: true }
                                );
                                window.location.reload(false);
                              }
                            }}
                          >
                            Remove Course
                          </Button>
                        </Toolbar>
                      </AppBar>
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        spacing={2}
                        style={{ paddingTop: "20px" }}
                      >
                        {" "}
                        <Grid item xs={7}>
                          {typeof pingedCourse != "undefined" &&
                          pingedCourse.name != "" ? (
                            <>
                              {" "}
                              <Badge color="secondary" badgeContent={1}>
                                <PriorityHighIcon />
                              </Badge>{" "}
                              <span
                                style={{
                                  paddingRight: "5px",
                                  paddingLeft: "5px",
                                  color: "red",
                                  textDecoration: "underline",
                                }}
                              >
                                {" "}
                                {pingedCourse.name}/{pingedCourse.email}{" "}
                                chat-pinged you.
                              </span>{" "}
                            </>
                          ) : (
                            <></>
                          )}{" "}
                          <Button
                            variant="contained"
                            color="secondary"
                            endIcon={<OpenInNewIcon />}
                            style={{ margin: "0px 10px 10px 0px" }}
                            onClick={async () => {
                              await setDoc(
                                doc(db, "messages", currentCourse),
                                {
                                  ping: {
                                    name: "",
                                    email: "",
                                  },
                                },
                                { merge: true }
                              );
                              window.open("/" + currentCourse, "_blank");
                              window.location.reload(false);
                            }}
                          >
                            Open Chat
                          </Button>
                          <Paper
                            style={{ margin: "3px 3px 3px 3px" }}
                            elevation={2}
                          >
                            <div style={{ padding: "5px 5px 5px 5px" }}>
                              <Typography variant="h4">
                                Active quizzes:
                              </Typography>
                              {currentQuizzes}
                              <Typography variant="h4">
                                Student list:
                              </Typography>
                              {currentStudents}
                              <br />
                              <Alert style={{ margin: "5px 5px 5px 5px" }}>
                                You can ask Brian for a weekly report of their
                                grades. Students will be able to view past
                                quizzes and what they missed on their own, as
                                well. You should remind them of this during
                                class.
                              </Alert>
                            </div>
                          </Paper>
                        </Grid>{" "}
                        <Divider orientation="vertical" flexItem />
                        <Grid item xs={4}>
                          <Typography variant="h4">Announcements:</Typography>
                          <Linkify
                            componentDecorator={(
                              decoratedHref,
                              decoratedText,
                              key
                            ) => (
                              <a
                                target="blank"
                                href={decoratedHref}
                                key={key}
                                style={{ color: "#66ff00" }}
                              >
                                {decoratedText}
                              </a>
                            )}
                          >
                            {" "}
                            {announcementList}
                          </Linkify>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
      <Dialog open={openAnnouncement}>
        <DialogTitle>Create Announcement for {currentCourse} Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter title and content. Include links! It will recognize them. Once
            published, information cannot be deleted.
          </DialogContentText>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={urgencyBoolean}
                  color="secondary"
                  onChange={(e) => {
                    changeUrgency(e.target.checked);
                  }}
                />
              }
              label={
                urgencyBoolean ? "Important/Urgent" : "Not Important/Urgent"
              }
            />
          </FormGroup>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={titleOfAnn}
            onChange={(e) => {
              changeTitleAnn(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            label="Content"
            multiline
            fullWidth
            variant="outlined"
            rows={5}
            value={contentOfAnn}
            onChange={(e) => {
              changeContentAnn(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenAnnouncement(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (
                confirm(
                  "Publish announcement? This cannot be undone. Your name and timestamp will be recorded on the message to students."
                )
              ) {
                // collect timestamp AND email/username
                setOpen(true);
                await setDoc(
                  doc(db, "messages", currentCourse),
                  {
                    announcements: arrayUnion({
                      title: titleOfAnn,
                      content: contentOfAnn,
                      name: props.details.name,
                      isUrgent: urgencyBoolean,
                      time: Timestamp.now(),
                    }),
                  },
                  { merge: true }
                );
                window.location.reload(false);
              }
            }}
            disabled={titleOfAnn == "" || contentOfAnn == ""}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openQuiz} fullWidth maxWidth="lg">
        <DialogTitle>Create Quiz for {currentCourse} Class</DialogTitle>
        <DialogContent style={{ height: "80vh" }}>
          <DialogContentText>
            Choose between asynchronous (take anytime) or synchronous (better
            for in-class quizzes, lock and unlock available). Max. 4 choices per
            question.
          </DialogContentText>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={syncOption}
                  color="secondary"
                  onChange={(e) => {
                    changeSyncOption(e.target.checked);
                  }}
                />
              }
              label={syncOption ? "Synchronous" : "Asynchronous"}
            />
          </FormGroup>
          <TextField
            autoFocus
            margin="dense"
            label="Title of Quiz"
            fullWidth
            variant="outlined"
            value={titleOfQuiz}
            onChange={(e) => {
              changeTitleQuiz(e.target.value);
            }}
            style={{ marginBottom: "10px" }}
          />
          <Divider />
          <Typography variant="h4">Create a Question</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Question Content"
            fullWidth
            variant="outlined"
            value={draftQuestion}
            onChange={(e) => {
              changeDraftQuestion(e.target.value);
            }}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Choices"
            fullWidth
            variant="outlined"
            value={draftChoices}
            onChange={(e) => {
              changeDraftChoices(e.target.value);
            }}
            style={{ marginBottom: "10px" }}
          />
          <Button
            variant="outlined"
            style={{ marginBottom: "5px" }}
            onClick={() => {
              changeTotalChoices((totalChoices) => [
                ...totalChoices,
                draftChoices,
              ]);
              // reset draftChoices
              changeDraftChoices("");
            }}
            disabled={
              draftChoices == "" ||
              draftQuestion == "" ||
              totalChoices.length >= 4
            }
          >
            Add another choice
          </Button>
          <Typography style={{ fontWeight: "bold" }}>
            Current answer choices:{" "}
          </Typography>
          {totalChoicesSoFar}
          <TextField
            autoFocus
            margin="dense"
            label="Answer (case sensitive)"
            fullWidth
            variant="outlined"
            value={draftAnswer}
            onChange={(e) => {
              changeDraftAnswer(e.target.value);
            }}
            style={{ marginBottom: "10px" }}
          />
          <Button
            disabled={totalChoices.length == 0 || draftAnswer == ""}
            variant="outlined"
            color="secondary"
            style={{ marginBottom: "10px" }}
            onClick={() => {
              changeContentQuiz((contentOfQuiz) => [
                ...contentOfQuiz,
                {
                  content: draftQuestion,
                  choices: totalChoices,
                  answer: draftAnswer,
                },
              ]);
              // resets question fields
              changeDraftQuestion("");
              changeDraftAnswer("");
              changeDraftChoices("");
              changeTotalChoices([]);
            }}
          >
            Add Entire Question to Quiz
          </Button>
          <Divider />
          <Typography variant="h4">Preview of Questions</Typography>
          {quizQuestions}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenQuiz(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setOpen(true);
              if (confirm("Create quiz? This cannot be undone.")) {
                // collect timestamp AND email/username
                await setDoc(
                  doc(db, "messages", currentCourse),
                  {
                    quizzes: arrayUnion({
                      title: titleOfQuiz,
                      content: contentOfQuiz,
                      createdBy: props.details.name,
                      quizSynced: syncOption,
                      isActive: false,
                      time: Timestamp.now(),
                    }),
                  },
                  { merge: true }
                );
                window.location.reload(false);
              }
            }}
            disabled={titleOfQuiz == "" || contentOfQuiz.length == 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
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
        !(await (await getDoc(doc(db, "users", authentication.uid))).data()
          .isTeacher)
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
        await setDoc(
          doc(db, "users", authentication.uid),
          {
            courses: ["Math", "Physics", "Computer Science", "Piano"],
          },
          { merge: true }
        );
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
export default Dashboard;
