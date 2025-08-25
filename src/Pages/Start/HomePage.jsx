import React from "react";
import HomeCard from "../../Components/Start/HomeCard";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  return (
    <div>
      <img
        alt="home image"
        src="/assests/images/background.png"
        style={{
          position: "fixed",
          zIndex: "-2",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
        }}
      />
      <div
        style={{
          background: "rgba(58, 140, 217, 0.2)",
          position: "fixed",
          zIndex: "-1",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
        }}
      ></div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          textAlign: "center",
          minHeight: "100vh",
          position: "relative",
          gap:2,
          zIndex: 1,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <img
            src="/assests/images/LOGO.png"
            alt="logo"
          />
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: { sm: "24px", md: "64px" },
            }}
          >
            Stargate
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: { sm: "14px", md: "24px" },
            }}
          >
            {t("enter the world of sports")}
          </Typography>
        </Box>
        <HomeCard />
      </Box>
    </div>
  );
}
