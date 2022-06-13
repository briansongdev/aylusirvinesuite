import Head from "next/head";
import Link from "next/link";
import {
  Stack,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Alert,
  AlertTitle,
  Container,
  Divider,
  Fab,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { parseCookies } from "nookies";
import verifyCookie from "../fire/verifyCookie";
import { useState, useEffect } from "react";
import axios from "axios";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../fire/fireConfig";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  fontSize: "26px",
  fontWeight: "bold",
}));

const Home = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [courses, setCourses] = useState(
    props.uid != "" ? props.details.courses : null
  );
  const [currentCourse, setCurrentCourse] = useState(
    props.uid != "" ? props.details.courses[0] : null
  );
  const [quizzes, changeQuizzes] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      window.location.reload(false);
    }, 3600001);
    if (props.uid != "") {
      const fetchData = async () => {
        changeAnnoucementList(
          await (await getDoc(doc(db, "messages", currentCourse))).data()
            .announcements
        );
        changeQuizzes(
          await (await getDoc(doc(db, "messages", currentCourse))).data()
            .quizzes
        );
      };

      fetchData();
    }
  }, [currentCourse]);

  const [announcementLists, changeAnnoucementList] = useState([]);
  let announcementList = null;
  if (props.uid != "") {
    announcementList = announcementLists.map((d) => (
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
  }
  let currentQuizzes = null;
  if (props.uid != "")
    currentQuizzes = quizzes.map((d, index) => (
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
          Created by <span id="teacherIcon">[TEACHER] {d.createdBy}.</span>
          {d.quizSynced ? (
            <>
              {" "}
              {d.isActive ? (
                <>
                  <Button
                    variant="outlined"
                    style={{ margin: "10px 10px 10px 10px" }}
                  >
                    Take Quiz (Unlocked)
                  </Button>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                style={{ margin: "10px 10px 10px 10px" }}
              >
                Take Quiz
              </Button>
            </>
          )}
        </Typography>
      </>
    ));
  let classItems = null;
  if (props.uid != "") {
    classItems = courses.map((d, index) => (
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
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
            {props.uid != "" ? (
              <>
                {" "}
                <Link href="/user" passHref>
                  <Button sx={{ mr: "1%" }}>About me</Button>
                </Link>
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
            ) : (
              <>
                <Button sx={{ mr: "1%" }}>Explore</Button>
                <IconButton
                  color="primary"
                  sx={{ mr: "10%" }}
                  onClick={handleMenu}
                  size="large"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Link href="/login" passHref>
                    <MenuItem>Login as a student</MenuItem>
                  </Link>

                  <Link href="/volunteers" passHref>
                    <MenuItem>Login as a volunteer</MenuItem>
                  </Link>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
        {props.uid == "" ? (
          <Stack>
            <Item>An all-in-one collection for everything AYLUS Irvine.</Item>
          </Stack>
        ) : (
          <Container>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ margin: "10px 5px 0px 5px" }}
            >
              <Typography
                style={{
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingRight: "20px",
                }}
              >
                Welcome <span id="vibrantIcon">{props.details.name}!</span>{" "}
                {props.details.name == "Unknown User" ? (
                  <>
                    Please set up your profile in "About Me" on the top right.
                  </>
                ) : (
                  <></>
                )}
              </Typography>{" "}
              <Fab
                variant="extended"
                color="secondary"
                size="medium"
                onClick={async () => {
                  if (
                    confirm(
                      "This will add back all possible courses. You can remove any as you please later."
                    )
                  ) {
                    await setDoc(
                      doc(db, "users", props.uid),
                      {
                        courses: [],
                      },
                      { merge: true }
                    );
                    window.location.reload(false);
                  }
                }}
              >
                <AddCircleOutlineIcon sx={{ mr: 1 }} />
                Add Courses
              </Fab>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              spacing={2}
              style={{ paddingTop: "20px" }}
            >
              <Grid item xs={4}>
                <Divider />
                <List>
                  <ListItem disablePadding>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography variant="h5" style={{ fontWeight: "bold" }}>
                          My Current Courses
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                  {classItems}
                </List>
              </Grid>
              <Grid item xs={8}>
                <AppBar position="static" elevation={0}>
                  <Toolbar>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ flexGrow: 1 }}
                    >
                      {currentCourse} Class: Chat
                    </Typography>
                    <Button
                      color="secondary"
                      onClick={async () => {
                        if (
                          confirm(
                            "Are you sure? Your data in the course will be saved, but you will not see it until you add the course back again."
                          )
                        ) {
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
                  <Grid item xs={5}>
                    <Link href={"/" + currentCourse}>
                      <a target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<OpenInNewIcon />}
                          style={{ margin: "0px 10px 10px 0px" }}
                        >
                          Open {currentCourse} Group Chat
                        </Button>
                      </a>
                    </Link>
                    <Typography variant="h4">Active quizzes:</Typography>
                    {currentQuizzes}
                  </Grid>{" "}
                  <Divider orientation="vertical" flexItem />
                  <Grid item xs={6}>
                    <Typography variant="h4">Announcements:</Typography>{" "}
                    {announcementList}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>
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
            destination: "/teachers/dashboard",
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
      let courseInfos = await (
        await getDoc(doc(db, "users", authentication.uid))
      ).data().courses;
      for (let i = 0; i < courseInfos.length; i++) {
        await setDoc(
          doc(db, "messages", courseInfos[i]),
          {
            students: arrayUnion(authentication.usermail),
          },
          { merge: true }
        );
      }

      // authentication.uid
      userDetails.details = await (
        await getDoc(doc(db, "users", authentication.uid))
      ).data();
      userDetails.uid = authentication.uid;
    }
  }

  return {
    props: userDetails, // will be passed to the page component as props
  };
}
export default Home;
