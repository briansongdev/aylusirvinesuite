import "../styles/globals.css";

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
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
