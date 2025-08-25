import React, { useContext, useState } from "react";
import { AppContext } from "../../App";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

export default function HomeCard() {
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      className="at-item"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 5,
        borderRadius: 8,
        backgroundColor: "transparent",
        backdropFilter: "blur(10px)",
        height: "auto" ,
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{ style: { display: "none" } }}
      >
        <Tab
          label={t("sign in")}
          sx={{
            mr: 2,
            width:"150px",
            color: "#242424",
            "&:hover": {
              background: "white",
              borderRadius: "20px",
              color: "#1669B6",
            },
            "&.Mui-selected": {
              background: "white",
              borderRadius: "20px",
              color: "#1669B6",
            },
          }}
        />
        <Tab
          label={t("sign up")}
          sx={{
            color: "#242424",
            width:"150px",
            "&:hover": {
              background: "white",
              borderRadius: "20px",
              color: "#1669B6",
            },
            "&.Mui-selected": {
              background: "white",
              borderRadius: "20px",
              color: "#1669B6",
            },
          }}
        />
      </Tabs>

      {value === 0 && (
        <Box sx={{ width: "99%"}}>
          <LoginCard />
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ width: "99%"}}>
          <RegisterCard />
        </Box>
      )}
    </Box>
  );
}
