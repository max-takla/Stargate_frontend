import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../App";
import { VideoApi } from "../../../Api/Club/Suggested/VideoApi";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Rating,
} from "@mui/material";
import { ShowAllVideos } from "../../../Api/Main/Video/ShowAllVideos";
import * as Yup from "yup";
import { RequestApi } from "../../../Api/Club/RequestToJoin/RequestApi";
import { GetRates } from "../../../Api/Club/Suggested/GetRates";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { IncreaseVideoViews } from "../../../Api/Club/Video/IncreaseVideoViews";
import { AddRates } from "../../../Api/Club/Suggested/AddRates";
const BASE_URL = "https://dashboard.stars-gate.com";

export default function SuggestionsVideosCard() {
  const { mainColor, secondColor} = useContext(AppContext);
  const { t } = useTranslation();

  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allvideoLoading, setAllVideoLoading] = useState(true);
  const [openVideo, setOpenVideo] = useState(false);
  const [videoCard, setVideoCard] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [openAllVideo, setOpenAllVideo] = useState(false);
  const [AllvideoCard, setAllVideoCard] = useState(null);
  const navigator = useNavigate();
  const [rate, setRate] = useState({
    rate: "",
    user_id: "",
    video_id: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const result = await VideoApi();
        if (result?.data?.result?.data) {
          const videos = result.data.result.data;

          const videosWithRates = await Promise.all(
            videos.map(async (video) => {
              try {
                const rateRes = await GetRates(video.id);
                return {
                  ...video,
                  rating: rateRes?.data?.averageRate || 0,
                };
              } catch (err) {
                console.error("Failed to fetch rate for video", video.id, err);
                return { ...video, rating: 0 };
              }
            })
          );

          setCards(videosWithRates);
        }
      } catch (error) {
        console.error("Failed to fetch VideoApi :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleOpenVideo = (card) => {
    console.log(card.id);
    setVideoCard(card);
    setOpenVideo(true);
    setVideoLoading(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
    setVideoCard(null);
  };

  const handleOpenAllVideo = (card) => {
    console.log(card.id);
    setAllVideoCard(card);
    setOpenAllVideo(true);
  };

  const handleCloseAllVideo = () => {
    setOpenAllVideo(false);
    setAllVideoCard(null);
  };
  // handle with open request to join
  const [errors, setErrors] = useState({});
  const [openRequest, setOpenRequest] = useState(false);
  const handleOpenRequest = async () => {
    setOpenRequest(true);
  };
  const handleCloseRequest = () => {
    setOpenRequest(false);
  };
  const [request, setRequest] = useState({
    player_id: "",
    club_id: "",
    details: [
      {
        price: "",
        duration: "",
      },
    ],
  });
  useEffect(() => {
    setRequest((prev) => ({
      ...prev,
      player_id: parseInt(localStorage.getItem("userId")),
      club_id: parseInt(localStorage.getItem("clubId")),
    }));
  }, []);
  const validationSchema = Yup.object().shape({
    details: Yup.array()
      .of(
        Yup.object().shape({
          price: Yup.string()
            .required("Price is required")
            .matches(/^\d+$/, "Price must be a number"),
          duration: Yup.string().required("Duration is required"),
        })
      )
      .min(1, "At least one detail is required"),
  });
  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "duration") {
      setRequest((prev) => {
        const updatedDetails = [...prev.details];
        updatedDetails[0][name] = value;
        return {
          ...prev,
          details: updatedDetails,
        };
      });
    }
    console.log(request, "request information");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(request, { abortEarly: false });
      setErrors({});
      const result = await RequestApi(request);
      console.log("request to join", result);
      if (result) {
        handleCloseRequest();
      }
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    }
  };
  //handle with filter
  const [filterText, setFilterText] = useState("");
  const filteredCards = useMemo(() => {
    if (!filterText.trim()) return cards;

    return cards.filter((card) =>
      Object.values(card).some((value) =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [cards, filterText]);
  // handle with click on player name
  const handlePlayerName = (id) => {
    navigator(`player-info/${id}`);
  };
  // handleIncreaseViews
  const handleIncreaseViews = async (videoId) => {
    try {
      await IncreaseVideoViews(videoId);

      setCards((prev) =>
        prev.map((c) =>
          c.id === videoId ? { ...c, views: (parseInt(c.views) || 0) + 1 } : c
        )
      );
    } catch (error) {
      console.error("Failed to increase views:", error);
    }
  };
  // handle with rate
  const handleRateVideo = async (videoId, newValue) => {
    const apiRate = (newValue / 5) * 0.9;
    try {
      await AddRates({
        rate: apiRate,
        video_id: videoId,
        user_id: localStorage.getItem("userId"),
      });

      setCards((prev) =>
        prev.map((c) =>
          c.id === videoId
            ? {
                ...c,
                rating: newValue, 
                apiRate, 
              }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to rate video:", error);
    }
  };
  return (
    <Box sx={{ mt: 5 }}>
      <Box>
        {" "}
        <TextField
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SearchIcon sx={{ fontSize: 18 }} />
              {t("search")}
            </Box>
          }
          variant="outlined"
          size="small"
          sx={{
            my: 2,
            alignSelf: "end",
            "& .MuiInputBase-input": {
              fontSize: isMobile ? "14px" : "16px",
              color: mainColor,
            },
            "& .MuiInputLabel-root": {
              color: mainColor,
            },
            "& .MuiOutlinedInput-root": {
              background: "#F5F5F7",
              borderRadius: "20px",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: secondColor,
              },
              "&.Mui-focused fieldset": {
                borderColor: secondColor,
              },
            },
          }}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Box>
      {loading ? (
        <Typography sx={{ textAlign: "center" }}>{t("loading...")}</Typography>
      ) : cards.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>
          {t("No videos available.")}
        </Typography>
      ) : (
        filteredCards.map((card) => (
          <Box
            key={card.id}
            sx={{
              my: 2,
              p: 2,
              borderBottom: "1px solid #D1D5DB",
              maxWidth: "600px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={`${BASE_URL}/${card.poster}`}
                alt={card.title}
                sx={{ mr: 2 }}
              />
              <Box
                onClick={() => handlePlayerName(card.player_id)}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {card.name || "Untitled Video"}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: "#525252", mb: 2 }}>
              {card.description || "No description provided."}
            </Typography>

            {/* Video */}
            <video
              src={`${BASE_URL}/${card.video}`}
              controls
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
              onPlay={() => handleIncreaseViews(card.id)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{ mt: 2, gap: 3, display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <VisibilityIcon sx={{ mr: 1 }} />
                  {card.views ? card.views : "0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <StarIcon sx={{ color: "#F59E0B", mr: 1 }} />
                  {card.overall_rating ? card.overall_rating : "0.0"}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  background: "#D1E5F8",
                  borderRadius: "24px",
                  p: 1,
                }}
              >
                <Rating
                  onChange={(e, newValue) => handleRateVideo(card.id, newValue)}
                  name={`rating-${card.id}`}
                  value={card.rating || 0}
                  precision={1}
                  sx={{
                    "& .MuiRating-iconEmpty": {
                      color: "#0B4B87",
                    },
                    "& .MuiRating-iconFilled": {
                      color: "#FFD700",
                    },
                  }}
                />
              </Box>
            </Box>
            {/*Confirmation Modal */}
            {/* <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
              <Box
                sx={{
                  margin: "100px auto",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  borderRadius: 8,
                  backgroundColor: "white",
                  border: `1px solid ${secondColor}`,
                  maxWidth: "600px",
                }}
              >
                <Typography variant="h6">
                  {t("Are you sure you want to delete this video?")}
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleDelete}
                    sx={{
                      background: mainColor,
                      fontWeight: "bold",
                      borderRadius: "10px",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    {t("yes")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenDelete(false)}
                    sx={{
                      color: mainColor,
                      border: `1px solid ${mainColor}`,
                      fontWeight: "bold",
                      borderRadius: "10px",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    {t("no")}
                  </Button>
                </Box>
              </Box>
            </Modal> */}
          </Box>
        ))
      )}
    </Box>
  );
}
