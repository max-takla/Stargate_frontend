import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import ListVideoCards from "../../../Components/Main/VideoMonitoring/ListVideoCards";
import ListNonActiveVideo from "../../../Components/Main/VideoMonitoring/ListNonActiveVideo";
import MainDashboard from "../MainDashboard";

const VIDEO_TAB_KEY = "videoTab";

export default function ListVideo() {
  const { mainColor, en } = useContext(AppContext);
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [videoTab, setVideoTab] = useState(() => {
    const storedTab = localStorage.getItem(VIDEO_TAB_KEY);
    return storedTab === "active" ? "active" : "NonActive";
  });

  useEffect(() => {
    localStorage.setItem(VIDEO_TAB_KEY, videoTab);
  }, [videoTab]);

  const handleTabChange = (type) => {
    setVideoTab(type);
  };

  const tabs = useMemo(
    () => [
      { key: "NonActive", label: t("non active") },
      { key: "active", label: t("active") },
    ],
    [t]
  );

  return (
    <MainDashboard>
      <Box sx={{ width: "100%" }}>
        <Box
          role="tablist"
          aria-label="Video Monitoring Tabs"
          sx={{
            mt: 6,
            background: "#7676801F",
            borderRadius: "100px",
            display: "flex",
            gap: 2,
            p: 1,
            justifyContent: "start",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            width: "50%",
            flexWrap: "wrap",
          }}
        >
          {tabs.map(({ key, label }) => (
            <Button
              key={key}
              role="tab"
              aria-selected={videoTab === key}
              onClick={() => handleTabChange(key)}
              sx={{
                textTransform: "capitalize",
                flex: 1,
                fontWeight: "bold",
                width: { xs: "100%", sm: "auto" },
                color: videoTab === key ? "#1669B6" : "black",
                background: videoTab === key ? "white" : "none",
                "&:hover": {
                  color: "#1669B6",
                  background: "white",
                },
                transition: "background-color .3s, color .3s",
                fontSize: isSmallScreen ? "0.8rem" : "1rem",
                borderRadius: "20px",
                minHeight: "30px",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Box sx={{ width: "100%", mt: 3 }}>
          {videoTab === "active" ? <ListVideoCards /> : <ListNonActiveVideo />}
        </Box>
      </Box>
    </MainDashboard>
  );
}
