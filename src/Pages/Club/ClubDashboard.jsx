import MuiAppBar from "@mui/material/AppBar";
import { useLocation, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "react-i18next";
import { LogoutApi } from "../../Api/Auth/LogoutApi";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCallback, useContext, useEffect, useState } from "react";
import TheatersIcon from "@mui/icons-material/Theaters";
import { AppContext } from "../../App";
import Notifications from "../../Components/Notification/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SearchDropdown from "../../Components/Search/SearchDropdown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FetchAllUsers } from "../../Api/Main/Users/FetchAllUsers";
import WidgetsIcon from "@mui/icons-material/Widgets";
import FeedIcon from '@mui/icons-material/Feed';
import ArticleIcon from '@mui/icons-material/Article';
const drawerWidth = 240;
const miniDrawerWidth = 70;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, drawerOpen }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    // marginLeft: drawerOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: drawerOpen
        ? theme.transitions.easing.easeOut
        : theme.transitions.easing.sharp,
      duration: drawerOpen
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
    width: "100%",
    boxSizing: "border-box",
  })
);

export default function ClubDashboard(props) {
  const navigator = useNavigate();
  const { t } = useTranslation();
  const { mainColor, en, secondColor, hoverColor } = useContext(AppContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const location = useLocation();
  const [user, setUser] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("drawerOpen");
    setDrawerOpen(saved ? JSON.parse(saved) : true);
    const getUsers = async () => {
      try {
        const result = await FetchAllUsers();
        if (result?.data?.Users) {
          const foundUser = result.data.Users.find(
            (el) => el.user_id === localStorage.getItem("userId")
          );
          if (foundUser) {
            setUser(foundUser);
            console.log("current user", foundUser);
          } else console.log("error");
        }
      } catch (error) {
        console.log(error, "error in get users");
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("drawerOpen", JSON.stringify(drawerOpen));
  }, [drawerOpen]);

  useEffect(() => {
    if (isSmallScreen || isMediumScreen) {
      setDrawerOpen(false);
    }
  }, [isSmallScreen, isMediumScreen]);

  const [activeTitle, setActiveTitle] = useState("");
  const menuItems = [
    { text: t("dashboard"), path: "/club-dashboard", icon: <DashboardIcon /> },
    {
      text: t("suggested videos"),
      path: "/suggested-videos",
      icon: <TheatersIcon />,
    },
    {
      text: t("product"),
      path: "/product",
      icon: <WidgetsIcon />,
    },
    {
      text: t("search players"),
      path: "/search-players",
      icon: <SearchIcon />,
    },
     {
      text: t("news"),
      path: "/all-news",
      icon: <FeedIcon />,
    },
     {
      text: t("club news"),
      path: "/club-news",
      icon: <ArticleIcon />,
    },
  ];

  // ⬅️ breadcrumb logic
  const pathParts = location.pathname.split("/").filter(Boolean);

  const breadcrumbTitles = pathParts.map((part) => {
    const matchedItem = menuItems.find((item) => item.path.includes(part));
    return matchedItem ? matchedItem.text : t(part); // يترجم إذا عندك key بالـ i18n
  });

  const currentTitle = breadcrumbTitles.join(" >> ") || t("dashboard");

  const sampleData = [
    "Dashboard",
    "Suggested Videos",
    "Products",
    "Searsh Players",
    "News",
    "Club News"
  ];

  // notification
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const handleOpenMenu = (e) => {
    setAnchorElMenu(e.currentTarget);
    setOpenMenu(true);
  };

  //handle with logout
  const [openLogOut, setOpenLogOut] = useState(false);
  const handleLogOut = useCallback(async () => {
    try {
      const result = await LogoutApi();
      if (result) {
        handleCloseLogOut();
        navigator("/");
        console.log("Successfully logged out");
      }
    } catch (error) {
      console.error("Error in logout:", error);
    }
  }, []);
  const handleOpenLogOut = () => {
    setOpenLogOut(true);
  };
  const handleCloseLogOut = useCallback(() => {
    setOpenLogOut(false);
  }, [navigator]);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            height: "100vh",
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            backgroundImage: `linear-gradient(to bottom, ${mainColor}, ${secondColor})`,
            color: "white",
            pt: 2,
            direction: en ? "ltr" : "rtl",
            position: "fixed",
            top: 0,
            left: 0,
            borderRadius: "25px",
            ml: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: en ? 8 : "auto",
            left: en ? "auto" : 8,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ color: "white" }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: drawerOpen ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            mt: 4,
          }}
        >
          <Box
            component="img"
            src="/assests/images/LOGO.png"
            alt="Logo"
            sx={{
              width: drawerOpen ? 100 : 40,
              height: drawerOpen ? "auto" : 40,
              transition: "all 0.3s",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              fontWeight: "500",
              fontSize: drawerOpen ? "24px" : "14px",
            }}
          >
            Stargate
          </Typography>
        </Box>

        <List sx={{ mt: 1 }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname.includes(item.path);

            return (
              <Tooltip
                key={item.text}
                title={!drawerOpen ? item.text : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  key={item.text}
                  onClick={() => {
                    setActiveIndex(index);
                    setActiveTitle(item.text);
                    navigator(item.path);
                  }}
                  selected={isActive}
                  sx={{
                    mb: 1,
                    mx: 1,
                    borderRadius: "8px",
                    justifyContent: drawerOpen ? "initial" : "center",
                    backgroundColor: isActive ? "#247ACA" : "transparent",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "#247ACA",
                      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 2 : "auto",
                      justifyContent: "center",
                      transition: "color 0.3s",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {drawerOpen && (
                    <ListItemText
                      primary={item.text}
                      sx={{ textAlign: "left" }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            marginLeft: drawerOpen
              ? `${drawerWidth}px`
              : `${miniDrawerWidth}px`,
            width: `calc(100% - ${
              drawerOpen ? drawerWidth : miniDrawerWidth
            }px)`,
            backgroundColor: scrolled ? "rgba(255,255,255,0.8)" : "transparent",
            backdropFilter: scrolled ? "blur(6px)" : "none",
            boxShadow: scrolled ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
            borderBottom: "1px solid #D1D5DB",
            transition: "width 0.3s ease, margin 0.3s ease",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "400",
                  color: "#242424",
                }}
              >
                {currentTitle}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <SearchDropdown data={sampleData} />

                <Notifications
                  anchorEl={anchorElMenu}
                  onClick={handleOpenMenu}
                  className="animation"
                />
                <Avatar
                  src="/assests/images/defaultAvatar.jpg"
                  alt="User Avatar"
                  sx={{
                    transition: "transform 1s ease",
                    transformStyle: "preserve-3d",
                    width: 40,
                    height: 40,
                    ml: 2,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "rotateY(180deg)",
                    },
                  }}
                />
                <IconButton onClick={handleOpenLogOut}>
                  <ExpandMoreIcon
                    sx={{
                      color: mainColor,
                      transition: "transform 1s ease",
                      transformStyle: "preserve-3d",
                      "&:hover": {
                        color: hoverColor,
                        transform: "rotateY(180deg)",
                      },
                    }}
                  />
                </IconButton>
                <Modal
                  open={openLogOut}
                  onClose={handleCloseLogOut}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      right: 10,
                      top: 30,
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      borderRadius: 2,
                      p: 4,
                      minWidth: 300,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar
                        src="/assests/images/defaultAvatar.jpg"
                        alt="User Avatar"
                        sx={{
                          width: 50,
                          height: 50,
                          ml: 2,
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="h6" component="h2">
                          {user?.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {user?.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      onClick={handleLogOut}
                      sx={{
                        background: "#F5F5F7",
                        borderRadius: "16px",
                        width: "100%",
                        mt: 3,
                        color: "#242424",
                        textTransform: "capitalize",
                        "&:hover": {
                          color: "#1669B6",
                          background: "white",
                        },
                      }}
                    >
                      <LogoutIcon />
                      <Typography sx={{ ml: 2 }}>{t("logout")}</Typography>
                    </Button>
                  </Box>
                </Modal>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Main open={drawerOpen}>{props.children}</Main>
    </Box>
  );
}
