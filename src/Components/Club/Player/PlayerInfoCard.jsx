import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchOneUser } from "../../../Api/Main/Users/FetchOneUser";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import HeightIcon from "@mui/icons-material/Height";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import CakeIcon from "@mui/icons-material/Cake";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { GetInformation } from "../../../Api/Club/InfoApi/GetInformation";
import { FetchPlayerVideos } from "../../../Api/Club/Video/FetchPlayerVideos";

const BASE_URL = "https://dashboard.stars-gate.com";

export default function PlayerInfoCard() {
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const { t } = useTranslation();
  const { id } = useParams();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [currentClub, setCurrentClub] = useState();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await FetchOneUser({ player_id: id });
        if (result?.data?.player) {
          console.log("user", result.data.player);
          setUser(result.data.player[0]);
          try {
            const response = await GetInformation(
              result.data.player[0].club_id
            );
            if (response?.data) {
              console.log("currentclub", response.data);
              setCurrentClub(response.data);
            }
          } catch (error) {
            console.error("Failed to fetch club:", error);
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchVideos = async () => {
      setLoadingVideos(true);
      try {
        const result = await FetchPlayerVideos(id);
        if (result?.data) {
          console.log("videos", result.data.video);
          setVideos(result.data.video);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
    fetchUser();
  }, [id]);

  // birthday
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };
  const commonButtonStyle = {
    borderRadius: "8px",
    backgroundImage: `linear-gradient(${mainColor}, ${secondColor})`,
    p: { xs: 1, sm: 1.5 },
    fontWeight: "400",
    "&:hover": { background: hoverColor },
    fontSize: { xs: "16px", sm: "16px" },
    color: "white",
    minWidth: "100px",
    textTransform: "capitalize",
  };

  // handle with request to join
  const [open, setOpen] = useState(false);
  const handleOpen = () => {setOpen(true)};
  const handleClose = () => setOpen(false);
  const handleRequest = async () => {};
  const [request,setRequest]=useState({
    player_id:"",
    club_id:"",
     details: [
      {
        price: "",
        duration: "",
      },
    ],
  })
  return (
    <Box sx={{mt:6}}>
      {loading ? (
        <Typography sx={{ textAlign: "center" }}>{t("Loading...")}</Typography>
      ) : !user ? (
        <Typography sx={{ textAlign: "center", mt: 5 }}>
          No user found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mt: 5,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              mt: 5,
              flexDirection: "column",
              borderBottom: "1px solid #D1D5DB",
            }}
          >
            <Box
              sx={{
                my: 2,
                p: 2,
                maxWidth: "600px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={`${BASE_URL}/${user.images || user.image}`}
                  alt={user.player_name}
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.player_name || "Unnamed Player"}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="400">
                    {user.countries_name || "Unknown Player country"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ background: "#F5F5F7", borderRadius: "24px", p: 2 }}>
                  <Typography fontWeight="400">
                    <HeightIcon sx={{ mr: 1 }} />
                    {user.height
                      ? `${user.height} cm`
                      : "Unknown Player height"}
                  </Typography>
                </Box>

                <Box sx={{ background: "#F5F5F7", borderRadius: "24px", p: 2 }}>
                  <Typography fontWeight="400">
                    <MonitorWeightIcon sx={{ mr: 1 }} />
                    {user.weight
                      ? `${user.weight} kg`
                      : "Unknown Player weight"}
                  </Typography>
                </Box>

                <Box sx={{ background: "#F5F5F7", borderRadius: "24px", p: 2 }}>
                  <Typography fontWeight="400">
                    <CakeIcon sx={{ mr: 1 }} />
                    {calculateAge(user.birthdate) !== null
                      ? `${calculateAge(user.birthdate)} years`
                      : "Unknown age"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={`${BASE_URL}/${currentClub?.logo}`}
                  alt={user.clubs_name}
                  variant="rounded"
                  sx={{ mr: 2, borderRadius: "10px", width: 30, height: 30 }}
                />
                <Box>
                  <Typography fontWeight="bold" fontSize="0.8rem">
                    {currentClub?.name || "Unnamed club"}
                  </Typography>
                  <Typography fontWeight="400" fontSize="0.7rem">
                    {user.countries_name || "Unknown Player country"}
                  </Typography>
                </Box>
              </Box>

              <Typography fontWeight="400">
                <SportsSoccerIcon sx={{ mr: 1 }} />
                {user.sport || "Unknown sport"}
              </Typography>
            </Box>
          </Box>
          <Button
            type="button"
            variant="contained"
            sx={commonButtonStyle}
            onClick={handleOpen}
          >
            {t("request to join")}
          </Button>
        </Box>
      )}
      <Modal open={open} onClose={handleClose}>
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
          <Typography variant="h6" sx={{color:'#242424'}}>
             Are you interested in “{user?.player_name || "loading"}” ?
          </Typography>
          <Typography sx={{color:"#242424"}}>
            please enter these details and confirm your request
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleRequest}
              sx={commonButtonStyle}
            >
              {t("confirm")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={commonButtonStyle}
            >
              {t("cancle")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
