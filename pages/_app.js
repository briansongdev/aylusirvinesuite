import "../styles/globals.css";
import Head from "next/head";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Inter",
    button: {
      fontFamily: "Roboto",
    },
  },
  palette: {
    primary: {
      // main: "#fb8c00",
      main: "#ffcd38",
    },
    secondary: {
      main: "#f73378",
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      {" "}
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <br />
        <br />
        <br />
        <br />
        <p className="footer" style={{ textAlign: "right" }}>
          © AYLUS Irvine 2022.
        </p>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
