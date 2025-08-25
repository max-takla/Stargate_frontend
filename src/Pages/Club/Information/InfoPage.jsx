import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import InformationCard from "../../../Components/Club/Information/InformationCard";

export default function InfoPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        width:"100%"
      }}
    >
      {/* left side */}
      <Box
        sx={{
          position: "relative",
          flexBasis: { xs: "100%", md: "45%" },
          height: isMobile ? "400px" : "auto", // زيادة الطول على الموبايل
          minHeight: { xs: "400px", md: "auto" },
        }}
      >
        <div
          style={{
            background: "#3A8CD9",
            position: "absolute",
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
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            mt: { md: 2, xs: 0 },
            px: 2,
          }}
        >
          <img
            src="/assests/images/LOGO.png"
            alt="logo"
            style={{
              width: isMobile ? "80px" : "100px",
              height: isMobile ? "65px" : "80px",
              mb: 3,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: { xs: "24px", sm: "34px", md: "44px" },
            }}
          >
            Stargate
          </Typography>
        </Box>
        <Box
          component="img"
          src="/assests/images/clubInfo.png"
          alt="boy image"
          sx={{
            display: "block",
            height: { xs: "auto", md: "83vh" },
            maxWidth: "100%",
            position: { xs: "static", md: "absolute" },
            right: { md: "-90px" },
            zIndex: 1,
            mt: { xs: 3, md: 0 },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: "#fff",
            fontWeight: 500,
            fontSize: { xs: "16px", sm: "20px", md: "30px" },
            position: "absolute",
            zIndex: 2,
            bottom: { xs: "0", md: "20px" },
            left: "50%", 
            transform:"translateX(-50%)",
            textAlign: "center",
            whiteSpace: { md: "nowrap" },
          }}
        >
          {t("your future winning team")}
        </Typography>
      </Box>
      {/* right side */}
      <Box sx={{ flexBasis: { xs: "100%", md: "55%" }, p: { xs: 2, md: 4 } ,display:"flex",justifyContent:"center"}}>
        <InformationCard />
      </Box>
    </Box>
  );
}
