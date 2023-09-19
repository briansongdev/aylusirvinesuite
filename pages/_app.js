import "../styles/globals.css";
import Head from "next/head";
import { AppBar, Toolbar, Box } from "@mui/material";
import { MobileView } from "react-device-detect";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false }
);

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
        <TopProgressBar />
        <MobileView>
          <AppBar position="static" sx={{ bgcolor: "#ffcccb" }} elevation={0}>
            <Toolbar>
              <Box sx={{ flexGrow: 1, ml: "10%" }}>
                <span
                  style={{
                    color: "red",
                    fontSize: "25px",
                  }}
                >
                  Use landscape (horizontal) mode or use a computer for best
                  experience. Thank you.
                </span>
              </Box>
            </Toolbar>
          </AppBar>
        </MobileView>
        <Component {...pageProps} />
        <br />
        <br />
        <br />
        <br />
        <p className="footer" style={{ textAlign: "right" }}>
          © AYLUS Irvine 2023.
        </p>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
