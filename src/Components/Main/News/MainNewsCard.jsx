import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import { FetchNews } from "../../../Api/Main/News/FetchNews";
import { GetAllSports } from "../../../Api/Club/InfoApi/GetAllSports";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import { FetchClubs } from "../../../Api/Main/Club/FetchClubs";
const BASE_URL = "https://dashboard.stars-gate.com";
export default function MainNewsCard() {
  const { mainColor, secondColor } = useContext(AppContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [loadingClub, setLoadingClub] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      try {
        const result = await FetchNews();
        if (result?.data?.articles?.data) {
          setNews(result.data.articles.data);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    getNews();
    const getClubs = async () => {
      setLoadingClub(true);
      try {
        const result = await FetchClubs();
        if (result?.data) {
          console.log(result?.data);
          setClubs(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      } finally {
        setLoadingClub(false);
      }
    };
    getClubs();
    const getSports = async () => {
      setLoadingSports(true);
      try {
        const result = await GetAllSports();
        if (result?.data?.sports) {
          setSports(result.data.sports);
        }
      } catch (error) {
        console.error("Failed to fetch sports:", error);
      } finally {
        setLoadingSports(false);
      }
    };
    getSports();
  }, []);
  // handle with read more
  const [expandedNews, setExpandedNews] = useState({});

  return (
    <Box>
      {loading ? (
        <Typography sx={{ textAlign: "center" }}>{t("Loading...")}</Typography>
      ) : news.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>
          {t("No news available.")}
        </Typography>
      ) : (
        news.map((card) => (
          <Box
            key={card.id}
            sx={{
              my: 5,
              p: 2,
              borderBottom: "1px solid #D1D5DB",
              maxWidth: "800px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Avatar
                src={(() => {
                  const clubData = clubs.find((c) => c.name === card.club);
                  return clubData?.logo
                    ? `${BASE_URL}/${clubData.logo}`
                    : "/assest/images/img.jpg";
                })()}
                alt={card.title}
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="400">
                  {card.club || "Untitled news"}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight="200"
                  sx={{ color: "#525252" }}
                >
                  {card.title || "Untitled news"}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#525252",
                mb: 2,
                textAlign: isMobile ? "justify" : "left",
                display:"inline"
              }}
            >
              {expandedNews[card.id]
                ? card.content || "No content provided."
                : (card.content || "No content provided.").slice(0, 200) +
                  (card.content?.length > 200 ? "....." : "")}
            </Typography>

            {card.content?.length > 200 && (
              <Button
                variant="text"
                sx={{ color: "#3A8CD9",textTransform:"capitalize"}}
                onClick={() =>
                  setExpandedNews((prev) => ({
                    ...prev,
                    [card.id]: !prev[card.id],
                  }))
                }
              >
                {expandedNews[card.id] ? t("Read less") : t("Read more")}
              </Button>
            )}
            <img
              src={
                card.image
                  ? `${BASE_URL}/${card.image}`
                  : "/assest/images/img.jpg"
              }
              alt={card.title}
              sx={{
                width: "100%",
                maxHeight: isMobile ? 250 : 400,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          </Box>
        ))
      )}
    </Box>
  );
}
