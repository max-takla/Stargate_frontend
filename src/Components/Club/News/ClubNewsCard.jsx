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
  Menu,
  MenuItem,
} from "@mui/material";
import { FetchClubs } from "../../../Api/Main/Club/FetchClubs";
import { FetchOurNews } from "../../../Api/Club/News/FetchOurNews";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddNews from "../../../Pages/Club/News/AddNews";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteNews } from "../../../Api/Main/News/DeleteNews";
import UpdateNews from "../../../Pages/Club/News/UpdateNews";
const BASE_URL = "https://dashboard.stars-gate.com";
export default function ClubNewsCard() {
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [loadingClub, setLoadingClub] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = useState("list");
  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      try {
        const result = await FetchOurNews(localStorage.getItem("clubId"));
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

  const commonButtonStyle = {
    borderRadius: "8px",
    backgroundImage: `linear-gradient(${mainColor}, ${secondColor})`,
    fontWeight: "400",
    "&:hover": { background: hoverColor },
    fontSize: { xs: "12", sm: "16px" },
    color: "white",
    px: 4,
    maxHeight: "40px",
    textTransform: "capitalize",
  };
  // handle with open modal
  const [selectedCard, setSelectedCard] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event, card) => {
    setAnchorEl(event.currentTarget);
    setSelectedCard(card);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  //handle with delete
  const [indexDelete, setIndexDelete] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = (row) => {
    setOpenDelete(true);
    setIndexDelete(row.id);
    console.log(row.id);
  };
  const handleCloseDelete = () => setOpenDelete(false);
  const handleDelete = async () => {
    const result = await DeleteNews(indexDelete);
    if (result) {
      const updated = await FetchOurNews(localStorage.getItem("clubId"));
      setNews(updated?.data?.articles?.data || []);
      handleCloseDelete();
    } else {
      console.error("Failed to delete news.");
    }
  };
  //handle with update
  const [article, setArticls] = useState({});
  const handleUpdate = (row) => {
    setView("update");
    setArticls(row);
  };
  return (
    <>
      {view === "list" && (
        <Box
          sx={{
            mt: 6,
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1, sm: 2 },
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{ ...commonButtonStyle, alignSelf: { md: "end" } }}
            onClick={() => setView("add")}
          >
            {t("add news")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 16 16"
              style={{ marginLeft: 8 }}
            >
              <path
                fill="currentColor"
                d="M8 15c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6"
              />
              <path
                fill="currentColor"
                d="M8 11.5c-.28 0-.5-.22-.5-.5V5c0-.28.22-.5.5-.5s.5.22.5.5v6c0 .28-.22.5-.5.5"
              />
              <path
                fill="currentColor"
                d="M11 8.5H5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h6c.28 0 .5.22.5.5s-.22.5-.5.5"
              />
            </svg>
          </Button>
          {loading ? (
            <Typography sx={{ textAlign: "center" }}>
              {t("Loading...")}
            </Typography>
          ) : news.length === 0 ? (
            <Typography sx={{ textAlign: "center" }}>
              {t("No news available.")}
            </Typography>
          ) : (
            news.map((card) => (
              <Box
                key={card.id}
                sx={{
                  position: "relative",
                  my: 5,
                  p: 2,
                  borderBottom: "1px solid #D1D5DB",
                  maxWidth: "800px",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    zIndex: 10,
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleMenuOpen(e, card)}
                >
                  <MoreVertIcon />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      borderRadius: "8px",
                      minWidth: 150,
                      p: 1,
                    },
                  }}
                >
                  <MenuItem
                    sx={{ borderBottom: "1px solid #D1D5DB" }}
                    onClick={() => {
                      handleUpdate(selectedCard);
                      handleMenuClose();
                    }}
                  >
                    <EditSquareIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleOpenDelete(selectedCard);
                      handleMenuClose();
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                  </MenuItem>
                </Menu>
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
                    display: "inline",
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
                    sx={{ color: "#3A8CD9", textTransform: "capitalize" }}
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
                <Box
                  component="img"
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
                    display: "block",
                  }}
                />
              </Box>
            ))
          )}
        </Box>
      )}
      {view === "add" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
            mt: 6,
          }}
        >
          <AddNews onSuccess={() => setView("list")} />
          <Button
            variant="outlined"
            onClick={() => setView("list")}
            sx={commonButtonStyle}
          >
            {t("back to news")}
          </Button>
        </Box>
      )}
      {view === "update" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { sm: "space-between" },
            gap: { xs: 1, sm: 2 },
            mt:6
          }}
        >
          <UpdateNews article={article} onSuccess={() => setView("list")} />
          <Button
            variant="outlined"
            onClick={() => setView("list")}
            sx={commonButtonStyle}
          >
            {t("back to products")}
          </Button>
        </Box>
      )}
      {/* Delete Confirmation Modal */}
      <Modal open={openDelete} onClose={handleCloseDelete}>
        <Box
          sx={{
            margin: "100px auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            borderRadius: 8,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.25)",
            backgroundColor: "white",
            border: `1px solid ${secondColor}`,
            maxWidth: "600px",
          }}
        >
          <Typography variant="h6">
            {t("are you sure you want to delete this article?")}
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
    </>
  );
}
