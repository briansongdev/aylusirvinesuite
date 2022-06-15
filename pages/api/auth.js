import { serialize } from "cookie";
import { admin } from "../../fire/fireAdmin";
import { db } from "../../fire/fireConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default async function auth(req, res) {
  const expiresIn = 60 * 60 * 1000 * 6;
  if (req.method === "POST") {
    var idToken = req.body.token;

    const cookie = await admin
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedIdToken) => {
        // Only process if the user just signed in in the last 5 minutes.

        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 60 * 60) {
          // Create session cookie and set it.

          const docRef = doc(db, "users", decodedIdToken.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            if (
              decodedIdToken.email == "asherding2012@gmail.com" ||
              decodedIdToken.email == "claylandlee@gmail.com" ||
              decodedIdToken.email == "brians3476@gmail.com" ||
              decodedIdToken.email == "tim.cai0928@gmail.com" ||
              decodedIdToken.email == "dingandrew23@gmail.com"
            ) {
              await setDoc(docRef, {
                email: decodedIdToken.email,
                name: "Unknown Teacher",
                posts: {},
                grades: [],
                activeQuizzes: [],
                courses: ["Math", "Physics", "Computer Science", "Piano"],
                isTeacher: true,
              });
            } else {
              await setDoc(docRef, {
                email: decodedIdToken.email,
                name: "Unknown User",
                posts: {},
                grades: [],
                activeQuizzes: [],
                courses: ["Math", "Physics", "Computer Science", "Piano"],
                isTeacher: false,
              });
            }
          }
          return admin.auth().createSessionCookie(idToken, { expiresIn });
        }
        // A user that was not recently signed in is trying to set a session cookie.
        // To guard against ID token theft, require re-authentication.
        res.status(401).send("Recent sign in required!");
      });

    if (cookie) {
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        path: "/",
      };
      res.setHeader("Set-Cookie", serialize("user", cookie, options));
      res
        .status(200)
        .end(JSON.stringify({ response: "Successfully logged in" }));
    } else {
      res.status(401).send("Invalid authentication");
    }
  }
}
