import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
  Button,
  Modal,
  Box,
  useTheme,
  useMediaQuery,
  TextField,
  List,
  ListItem,
  ListItemText,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Skeleton,
  Menu,
  MenuItem,
} from "@mui/material";
import { FetchProducts } from "../../../Api/Club/Products/FetchProducts";
import { FetchCategories } from "../../../Api/Club/Products/FetchCategories";
import { GetAllSports } from "../../../Api/Club/InfoApi/GetAllSports";
import { DeleteProduct } from "../../../Api/Club/Products/DeleteProduct";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import AddProducts from "../../../Pages/Club/Products/AddProducts";
const BASE_URL = "https://dashboard.stars-gate.com";
export default function ProductList() {
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [view, setView] = useState("list");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, SetLoadingCategories] = useState(false);
  useEffect(() => {
    const FetchProduct = async () => {
      setLoading(true);
      try {
        const result = await FetchProducts();
        if (result?.data?.products) {
          console.log("products", result.data.products);
          setCards(result.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    const FetchSports = async () => {
      setLoadingSports(true);
      try {
        const result = await GetAllSports();
        if (result?.data?.sports) {
          console.log(result.data.sports, "successful in get all sports");
          setSports(result.data.sports);
        }
      } catch (error) {
        console.log("faild in get all sports:", error);
      } finally {
        setLoadingSports(false);
      }
    };
    const FetchCategory = async () => {
      SetLoadingCategories(true);
      try {
        const result = await FetchCategories();
        if (result?.data?.category) {
          console.log(result.data.category, "successful in get all categories");
          setCategories(result.data.category);
        }
      } catch (error) {
        console.log("faild in get all categories:", error);
      } finally {
        SetLoadingCategories(false);
      }
    };
    FetchSports();
    FetchCategory();
    FetchProduct();
  }, []);
  const [loading, setLoading] = useState(true);
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
    const result = await DeleteProduct(indexDelete);
    if (result) {
      const updated = await FetchProducts();
      setRows(updated?.data?.products || []);
      handleCloseDelete();
      console.log("Product delete successfully!");
    } else {
      console.log("Failed to delete product.");
    }
  };
  //handle with update
  const navigate = useNavigate();
  const handleUpdate = (row) => {
    navigate(`/updateproduct/${row.id}`);
  };
  //handle with more information
  const [indexInfo, setIndexInfo] = useState(0);
  const [openInfo, setOpenInfo] = useState(false);
  const [product, setProduct] = useState({});
  const handleOpenMoreInfo = (card) => {
    setIndexInfo(card.id);
    setProduct({ ...card });
    setOpenInfo(true);
    console.log(card.id);
  };
  const handleCloseMoreInfo = () => setOpenInfo(false);
  // style button

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
  return (
    <>
      {view === "list" && (
        <Container className="read-item" sx={{ py: 2 }}>
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                mb: 2,
              }}
            >
              {" "}
              <TextField
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SearchIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
                    {t("search")}
                  </Box>
                }
                variant="outlined"
                size="small"
                fullWidth={isMobile}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: isMobile ? "14px" : "16px",
                    color: mainColor,
                  },
                  "& .MuiInputLabel-root": { color: mainColor },
                  "& .MuiOutlinedInput-root": {
                    background: "#F5F5F7",
                    borderRadius: "20px",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: secondColor },
                    "&.Mui-focused fieldset": { borderColor: secondColor },
                  },
                }}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => setView("add")}
                sx={commonButtonStyle}
              >
                {t("add product")}
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
            </Box>
            <Box
              sx={{
                width: "100%",
                mt: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 2,
                px: { xs: 1, sm: 2 },
              }}
            >
              {loading ? (
                <Typography sx={{ textAlign: "center" }}>
                  {t("loading...")}
                </Typography>
              ) : cards.length === 0 ? (
                <Typography sx={{ textAlign: "center" }}>
                  {t("No product available.")}
                </Typography>
              ) : (
                filteredCards.map((card) => (
                  <Card
                    key={card.id}
                    sx={{
                      width: "100%",
                      borderRadius: "12px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: 300,
                      position: "relative",
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
                    <CardMedia
                      component="img"
                      image={`${BASE_URL}/${card.image}`}
                      alt={card.title}
                      sx={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <CardContent
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: "#242424", fontWeight: "400" }}
                      >
                        {card.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: 1,
                        }}
                      >
                        {loadingCategories ? (
                          <Skeleton variant="rounded" width={80} height={30} />
                        ) : (
                          <Chip
                            label={
                              card.category_id && categories.length > 0
                                ? categories.find(
                                    (el) =>
                                      String(el.id) === String(card.category_id)
                                  )?.name || "unknown categories"
                                : "unknown categories"
                            }
                            sx={{
                              backgroundColor: "#D1D5DB",
                              borderRadius: "20px",
                              fontSize: "0.875rem",
                              fontWeight: 400,
                            }}
                          />
                        )}
                        {loadingSports ? (
                          <Skeleton variant="rounded" width={80} height={30} />
                        ) : (
                          <Chip
                            label={
                              card.sport_id && sports.length > 0
                                ? sports.find(
                                    (el) =>
                                      String(el.id) === String(card.sport_id)
                                  )?.name || "unknown sport"
                                : "unknown sport"
                            }
                            sx={{
                              backgroundColor: "#D1D5DB",
                              borderRadius: "20px",
                              fontSize: "0.875rem",
                              fontWeight: 400,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ color: "#525252", fontWeight: "400" }}
                      >
                        {card.shop_name}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
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
                  {t("are you sure you want to delete this product?")}
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
            <Modal open={openInfo} onClose={handleCloseMoreInfo}>
              <Box
                dir={i18n.dir()}
                sx={{
                  margin: "10px auto",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  borderRadius: 8,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.25)",
                  backgroundColor: "white",
                  border: `1px solid ${secondColor}`,
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <Typography
                  component="div"
                  variant="h5"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: secondColor,
                  }}
                >
                  {t("product information")}
                </Typography>

                {/* Product Image */}
                <Box
                  component="img"
                  src={`${BASE_URL}${
                    product?.image?.startsWith("/") ? "" : "/"
                  }${product?.image}`}
                  alt={product?.name || "Product"}
                  sx={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 1,
                    border: "1px solid #ccc",
                  }}
                />

                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {/* Name */}
                  <ListItem>
                    <ListItemText
                      primary={`${t("name")}:`}
                      secondary={product?.name || t("Unknown")}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: "bold",
                          color: secondColor,
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                    />
                  </ListItem>

                  {/* URL */}
                  <ListItem>
                    <ListItemText
                      primary={`${t("product url")}:`}
                      secondary={product?.url || t("Unknown")}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: "bold",
                          color: secondColor,
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                    />
                  </ListItem>

                  {/* Category */}
                  <ListItem>
                    <ListItemText
                      primary={`${t("category")}:`}
                      secondary={product?.category?.name || t("Unknown")}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: "bold",
                          color: secondColor,
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                    />
                  </ListItem>

                  {/* Sport */}
                  <ListItem>
                    <ListItemText
                      primary={`${t("sport")}:`}
                      secondary={product?.sport?.name || t("Unknown")}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: "bold",
                          color: secondColor,
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                    />
                  </ListItem>

                  {/* Shop Name */}
                  <ListItem>
                    <ListItemText
                      primary={`${t("shop name")}:`}
                      secondary={product?.shop_name || t("Unknown")}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: "bold",
                          color: secondColor,
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                    />
                  </ListItem>
                  {/* description */}
                  <ListItem>
                    <ListItemText
                      primary={`${t("description")}:`}
                      secondary={product?.description || t("Unknown")}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: "bold",
                          color: secondColor,
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          textAlign: i18n.dir() === "rtl" ? "right" : "left",
                        },
                      }}
                    />
                  </ListItem>
                </List>

                <Button
                  variant="outlined"
                  onClick={handleCloseMoreInfo}
                  sx={{
                    color: mainColor,
                    border: `1px solid ${mainColor}`,
                    fontWeight: "bold",
                    borderRadius: "10px",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  {t("close")}
                </Button>
              </Box>
            </Modal>
          </>
        </Container>
      )}
      {view === "add" && (
        <Box
          sx={{
            display:"flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <AddProducts onSuccess={() => setView("list")} />
          <Button
            variant="outlined"
            onClick={() => setView("list")}
            sx={ commonButtonStyle }
          >
            {t("back to products")}
          </Button>
        </Box>
      )}
    </>
  );
}
