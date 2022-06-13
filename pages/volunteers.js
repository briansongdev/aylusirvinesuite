import React, { useEffect, useState } from "react";
import { Box, AppBar, Toolbar, Stack, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

const Volunteers = () => {
  const [info, changeInfo] = useState({});

  const updateData = React.useCallback(
    (e) => {
      const data = e.data;
      const newData = JSON.parse(data);
      changeInfo(newData);
    },
    [info]
  );

  useEffect(() => {
    window.addEventListener("message", updateData);
    return () => {
      window.removeEventListener("message", updateData);
    };
  }, [updateData]);
  return (
    <>
      <Head>
        <title>Volunteers by AYLUS Irvine</title>
      </Head>
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#fafafa" }} elevation={0}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, ml: "10%" }}>
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
          </Toolbar>
        </AppBar>
        <Stack style={{ textAlign: "center", height: "100vh" }}>
          <Typography variant="overline">
            Outside normal hours, the webapp may take up to 30 seconds to load.
          </Typography>
          <iframe
            style={{ width: "100%", height: "80%" }}
            src="https://aylus.herokuapp.com"
          ></iframe>
        </Stack>
      </Box>
    </>
  );
};
export default Volunteers;
