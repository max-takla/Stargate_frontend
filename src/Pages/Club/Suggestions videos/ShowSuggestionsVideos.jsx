import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import SuggestionsVideosCard from "../../../components/Club/Suggestions videos/SuggestionsVideosCard";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import { Star } from "@mui/icons-material";
import { styled, keyframes } from "@mui/system";
import ClubDashboard from "../ClubDashboard";
const spin = keyframes`
  0% { transform: rotate(0deg) scale(1); opacity: 0.7; }
  50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
  100% { transform: rotate(360deg) scale(1); opacity: 0.7; }
`;

const AnimatedStar = styled(Star)(({ theme }) => ({
  animation: `${spin} 2s infinite ease-in-out`,
  fontSize: 32,
}));
export default function ShowSuggestionsVideos() {
  const { mainColor, en } = useContext(AppContext);
  const { t } = useTranslation();
  return (
    <ClubDashboard>
      <Box sx={{ width: "100%" }}>
        <SuggestionsVideosCard />
      </Box>
    </ClubDashboard>
  );
}
