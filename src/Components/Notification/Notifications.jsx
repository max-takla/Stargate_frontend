import {
  Badge,
  IconButton,
  Tooltip,
  CircularProgress,
  MenuItem,
  Menu,
  Modal,
  Box,
  Typography,
  Button,
  Snackbar,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../App";
import { messaging, database } from "../../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { StoreToken } from "../../Api/Notification/StoreToken";
import { ref, update } from "firebase/database";
import { GetNote } from "../../Api/Notification/GetNote";
import { useTranslation } from "react-i18next";

export default function Notifications() {
  const { dark, mainColor, secondColor, hoverColor } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { t } = useTranslation();

  // Snack control
  const handleClick = () => setOpenSnack(true);
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnack(false);
  };

  // Open menu + mark notifications as read
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setOpen(true);
    const updates = {};
    allNotifications.forEach((notification) => {
      if (!notification.isRead) {
        updates[`/notifications/${notification.id}/isRead`] = true;
      }
    });
    if (Object.keys(updates).length > 0) {
      update(ref(database), updates);
    }
  };

  const handleClose = () => setOpen(false);

  // Get FCM token + foreground notifications
  useEffect(() => {
    const getAndStoreToken = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        const token = await getToken(messaging, {
          vapidKey:
            "BAHdebRJtMAfinc_bVORxeYDss1FCN3ysx4nJ7bSCqaOmikckurjis8Bad_FzgW2xDmtIMuSVJ0fZWiEfr8WW0M",
          serviceWorkerRegistration: registration,
        });

        if (token) {
          await StoreToken({ token });
        }

        onMessage(messaging, (payload) => {
          console.log("📩 Foreground message:", payload);
          setTitle(payload.notification.title);
          setBody(payload.notification.body);
          handleClick();
        });
      } catch (err) {
        console.error("Error getting FCM token:", err);
      }
    };

    getAndStoreToken();
  }, []);

  // fetch all notifications from DB
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await GetNote();
        if (response) {
          setAllNotifications(response.data);
          setNotificationsCount(response.data.length);
        }
      } catch (err) {
        console.log("error in fetch notification", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [body]);

  // Menu items
  let menuContent = [
    { id: "title", label: t("notifications"), isTitle: true },
  ];
  if (loading) {
    menuContent.push({
      id: "loading",
      label: <CircularProgress size={20} sx={{ color: "#F5F5F7" }} />,
    });
  } else if (error) {
    menuContent.push({ id: "error", label: `Error: ${error.message}` });
  } else if (allNotifications.length === 0) {
    menuContent.push({ id: "no-notifications", label: "No notifications" });
  } else {
    menuContent.push(
      ...allNotifications.map((notification) => ({
        id: notification.id,
        label: notification.title,
        body: notification.body,
      }))
    );
  }

  const tooltipTitle =
    notificationsCount > 0
      ? `You have ${notificationsCount} notifications!`
      : "No new notifications";

  const action = (
    <>
      <Button
        sx={{ color: dark ? "black" : "white" }}
        size="small"
        onClick={handleCloseSnack}
      >
        UNDO
      </Button>
      <IconButton size="small" color="inherit" onClick={handleCloseSnack}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Tooltip title={tooltipTitle}>
        <IconButton color="default" onClick={handleOpen}>
          <Badge badgeContent={notificationsCount} color="error">
            <NotificationsIcon
              sx={{
                color: mainColor,
                width: 30,
                height: 30,
                transition: "transform 1s ease, color 0.3s ease",
                transformStyle: "preserve-3d",
                "&:hover": {
                  color: hoverColor,
                  transform: "rotateY(180deg)",
                },
              }}
            />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menuContent.map((item) =>
          item.isTitle ? (
            <MenuItem
              key={item.id}
              disabled
              sx={{
                fontWeight: "bold",
                opacity: 1,
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              {item.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={item.id}
              onClick={() => {
                if (item.body) {
                  setSelectedNotification(item);
                  setModalOpen(true);
                }
                handleClose();
              }}
            >
              {item.label}
            </MenuItem>
          )
        )}
      </Menu>

      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        message={`${title} - ${body}`}
        action={action}
        ContentProps={{
          sx: {
            backgroundColor: mainColor,
            color: dark ? "black" : "white",
          },
        }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            margin: "100px auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.25)",
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.9)",
            border: `1px solid ${secondColor}`,
            height: "200px",
            maxWidth: "550px",
            position: "relative",
          }}
        >
          <CloseIcon
            sx={{
              cursor: "pointer",
              position: "absolute",
              right: "20px",
              top: "10px",
              color: mainColor,
              "&:hover": { color: hoverColor },
            }}
            onClick={() => setModalOpen(false)}
          />
          <Typography variant="h6" component="h2" gutterBottom>
            {selectedNotification?.label}
          </Typography>
          <Typography variant="body1">{selectedNotification?.body}</Typography>
        </Box>
      </Modal>
    </div>
  );
}
