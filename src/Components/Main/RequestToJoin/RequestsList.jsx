import React, { useContext, useEffect, useState } from "react";
import { ShowRequests } from "../../../Api/Main/RequestToJoin/ShowRequests";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../App";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { FetchAllUsers } from "../../../Api/Main/Users/FetchAllUsers";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { FetchClubs } from "../../../Api/Main/Club/FetchClubs";
const BASE_URL = "https://dashboard.stars-gate.com";

export default function RequestsList() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const { mainColor, secondColor } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { t } = useTranslation();
    const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const result = await ShowRequests();
        if (result?.data) {
          console.log("requests", result.data);
          setCards(result.data?.["request join"] || []);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const result = await FetchAllUsers();
        if (result?.data) {
          console.log("Users", result.data.Users);
          setUsers(result.data?.Users || []);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
    fetchUsers();
    fetchRequest();
  }, []);
  return (
    <Box>
      {loading ? (
        <Typography sx={{ textAlign: "center" }}>{t("Loading...")}</Typography>
      ) : cards.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>
          {t("no data available")}
        </Typography>
      ) : (
        cards.map((card) => (
          <Box
            key={card.id}
            sx={{
              mb: 4,
              p: 3,
              background: "#F5F5F7",
              borderRadius: "20px",
              maxWidth: "600px",
            }}
          >
            <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={`${BASE_URL}/${card.club.logo}`}
                // alt={card.title}
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {card.club.name || "Untitled request"}
                </Typography>
                <Typography variant="subtitle2" fontWeight="200">
                  {card.club.bio || "Untitled request"}
                </Typography>
              </Box>
            </Box>
            </Box>
            <Typography variant="body2" sx={{ color: "#525252", mb: 2 }}>
              {card.club.achievement || "No achievement provided."}
            </Typography>
            {/* player info */}
            <Box
              key={card.id}
              sx={{
                mb: 4,
                p: 3,
                background: "#ffffff",
                borderRadius: "20px",
                maxWidth: { xs: "100%", sm: "500px" },
                mx: "auto",
              }}
            >
              {loadingUsers ? (
                <Typography sx={{ textAlign: "center" }}>
                  {t("Loading...")}
                </Typography>
              ) : (
                (() => {
                  const player = users.find(
                    (u) => u.user_id === card.player.user_id
                  );

                  if (!player) {
                    return (
                      <Typography sx={{ textAlign: "center" }}>
                        {t("player not found")}
                      </Typography>
                    );
                  }

                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" }, // عمود بالموبايل، صف بالكمبيوتر
                        alignItems: { xs: "center", sm: "flex-start" },
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: { xs: 2, sm: 0 },
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        <Avatar
                          src={`${BASE_URL}/${player.image}`}
                          sx={{
                            mr: { xs: 0, sm: 2 },
                            mb: { xs: 1, sm: 0 },
                            width: 64,
                            height: 64,
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="400"
                          sx={{color:"#242424"}}>
                            {player.name || "Unnamed Player"}
                          </Typography>
                          <Box sx={{display:"flex",gap:1}}>
                            <Typography variant="subtitle2" fontWeight="400" sx={{color:"#525252"}}>
                            {card.player.city || "Unknown city"}{" "}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight="200" sx={{color:"#242424"}}>
                            {card.player.sport || "Unknown sport"}
                          </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "center", sm: "flex-end" },
                            color: "#525252",
                            background:"#D1D5DB",
                            p:1,
                            borderRadius:"20px",mb:1
                          }}
                        >
                          <PhoneInTalkIcon sx={{ color: "#1669B6", mr: 1 }} />{" "}
                          {player.phone_number || "Unknown phone_number"}
                        </Typography>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "center", sm: "flex-end" },
                            color: "#525252",
                            background:"#D1D5DB",
                            p:1,
                             borderRadius:"20px",
                          }}
                        >
                          <MailOutlineIcon sx={{ color: "#1669B6", mr: 1 }} />{" "}
                          {player.email || "Unknown email"}{" "}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })()
              )}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}
