import React, { useEffect, useMemo, useState } from "react";
import MainDashboard from "../MainDashboard";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import UsersLists from "../../../Components/Main/Users/UsersLists";
import { useTranslation } from "react-i18next";
import PlayersLists from "../../../Components/Main/Users/PlayersLists";
import ClubsLists from "../../../Components/Main/Users/ClubsLists";
const USERS_TAB_KEY = "usersTab";
export default function ShowUsers() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [usersTab, setUsersTab] = useState(() => {
    const storedTab = localStorage.getItem(USERS_TAB_KEY);
    if (
      storedTab === "all" ||
      storedTab === "players" ||
      storedTab === "clubs"
    ) {
      return storedTab;
    }
    return "all";
  });
  useEffect(() => {
    localStorage.setItem(USERS_TAB_KEY, usersTab);
  }, [usersTab]);

  const handleTabChange = (type) => {
    setUsersTab(type);
  };
  const tabs = useMemo(
    () => [
      { key: "all", label: t("all") },
      { key: "players", label: t("players") },
      { key: "clubs", label: t("clubs") },
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
            display: "flex",
            gap: 2,
            justifyContent: "start",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
          }}
        >
          {tabs.map(({ key, label }) => (
            <Button
              key={key}
              role="tab"
              aria-selected={usersTab === key}
              onClick={() => handleTabChange(key)}
              sx={{
                textTransform: "capitalize",
                fontWeight: "bold",
                color: usersTab === key ? "white" : "#242424",
                backgroundImage:
                  usersTab === key
                    ? `linear-gradient(to bottom, #010052, #0E7187)`
                    : "none",
                backgroundColor: usersTab === key ? "transparent" : "#D1D5DB",
                "&:hover": {
                  color: "white",
                  backgroundImage: `linear-gradient(to bottom, #010052, #0E7187)`,
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
          {usersTab === "all" ? (
            <UsersLists />
          ) : usersTab === "players" ? (
            <PlayersLists />
          ) : (
            <ClubsLists />
          )}
        </Box>
      </Box>
    </MainDashboard>
  );
}
