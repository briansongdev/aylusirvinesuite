var admin = require("firebase-admin");

var serviceAccount = require("./aylusirvinesuite-firebase-adminsdk-4faen-0b3353b98d.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
