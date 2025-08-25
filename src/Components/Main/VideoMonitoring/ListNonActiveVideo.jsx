import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import { DeleteVideo } from "../../../Api/Main/Video/DeleteVideo";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { VideoStatus } from "../../../Api/Main/Video/VideoStatus";
import CloseIcon from "@mui/icons-material/Close";
import { ShowNonActiveVideo } from "../../../Api/Main/Video/ShowNonActiveVideo";
import DeleteIcon from "@mui/icons-material/Delete";
const BASE_URL = "https://dashboard.stars-gate.com";
export default function ListNonActiveVideo() {
  const { mainColor, secondColor } = useContext(AppContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const result = await ShowNonActiveVideo();
        if (result?.data?.info) {
          setCards(result.data.info);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);
  const [videoCard, setVideoCard] = useState(null);
  // handle with delete
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpen = (card) => {
    setVideoCard(card);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    if (!videoCard) return;
    await DeleteVideo(videoCard.id);
    const updated = await ShowNonActiveVideo();
    setCards(updated?.data?.info || []);
    setOpenDelete(false);
  };
  //handle with change status
  const handleStatus = async (card) => {
    const decision = card.status === "Active" ? "NonActive" : "Active";
    const updatedStatus = {
      video_id: card.id,
      decision,
    };

    try {
      await VideoStatus(updatedStatus);
      const result = await ShowNonActiveVideo();
      setCards(result?.data?.info || []);
      setVideoCard({ ...card, status: decision });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  return (
    <Box>
      {loading ? (
        <Typography sx={{ textAlign: "center" }}>{t("Loading...")}</Typography>
      ) : cards.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>
          {t("No videos available.")}
        </Typography>
      ) : (
        cards.map((card) => (
          <Box
            key={card.id}
            sx={{
              mb: 4,
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
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {card.title || "Untitled Video"}
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
                height: "100%",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />

            {/* Actions */}
            <Box
              sx={{ display: "flex", gap: 2, my: 2, justifyContent: "center" }}
            >
              <Button
                variant="outlined"
                onClick={() => handleStatus(card)}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: "80x",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  color: "#010052",
                  border: "2px solid",
                  borderImageSlice: 1,
                  borderImageSource: "linear-gradient(90deg, #010052, #0E7187)",
                  background: "linear-gradient(90deg, #010052, #0E7187)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                {card.status === "Active" ? (
                  <>
                    <CloseIcon /> {t("nonactive")}
                  </>
                ) : (
                  t("active")
                )}
              </Button>
              <Button
                onClick={() => handleOpen(card)}
                variant="outlined"
                sx={{
                  color: "#BF1B1B",
                  px: 4,
                  py: 1,
                  fontWeight: "bold",
                  borderColor: "#BF1B1B",
                  borderRadius: "8px",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <DeleteIcon sx={{ color: "#BF1B1B", mr: 1 }} />
                {t("delete")}
              </Button>
            </Box>
            {/* Delete Confirmation Modal */}
            <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
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
            </Modal>
          </Box>
        ))
      )}
    </Box>
  );
}
