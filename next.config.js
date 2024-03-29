/** @type {import('next').NextConfig} */
require("dotenv").config();

module.exports = {
  env: {
    A1: process.env.A1,
    A2: process.env.A2,
    A3: process.env.A3,
    A4: process.env.A4,
    A5: process.env.A5,
    A6: process.env.A6,
    PROJECT_ID: process.env.PROJECT_ID,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  },
};
