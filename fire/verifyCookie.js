import { admin } from "./fireAdmin";

async function verifyCookie(cookie) {
  if (!admin) {
    return null;
  }

  var usermail = "";
  var bAuth = false;
  var uid = "";
  await admin
    .auth()
    .verifySessionCookie(cookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      bAuth = true;
      usermail = decodedClaims.email;
      uid = decodedClaims.uid;
    })
    .catch(() => {
      // Session cookie is unavailable or invalid. Force user to login.
      bAuth = false;
    });

  return {
    authenticated: bAuth,
    usermail: usermail,
    uid: uid,
  };
}

export default verifyCookie;
