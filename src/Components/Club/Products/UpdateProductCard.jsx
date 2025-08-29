import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { AppContext } from "../../../App";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Store } from "../../../Api/Club/Products/Store";
import { GetAllSports } from "../../../Api/Club/InfoApi/GetAllSports";
import { FetchCategories } from "../../../Api/Club/Products/FetchCategories";
import { FetchOneProduct } from "../../../Api/Club/Products/FetchOneProduct";
import { UpdateProductApi } from "../../../Api/Club/Products/UpdateProductApi";
const BASE_URL = "https://dashboard.stars-gate.com";
export default function UpdateProductCard(prop) {
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("product name is required"))
      .min(3, t("product name must have at least 3 letters"))
      .max(25, t("product name must have at most 30 letters")),
    description: Yup.string()
      .required(t("description is required"))
      .min(10, t("description must be at least 10 characters"))
      .max(500, t("description must be at most 500 characters")),
    sport_id: Yup.string().required(t("you must select your sport")),
    shop_name: Yup.string()
      .required(t("shop name is required"))
      .min(3, t("shop name must have at least 3 letters"))
      .max(25, t("shop name must have at most 30 letters")),
    image: Yup.mixed().test("fileType", t("unsupported file type"), (value) => {
      if (!value) return true;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      return allowedTypes.includes(value.type);
    }),
    url: Yup.string().required(t("product url is required")),
    category_id: Yup.string().required("you must select your category"),
  });
  const { mainColor, secondColor, input } = useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    image: null,
    sport_id: "",
    category_id: "",
    shop_name: "",
    shop_icon: "",
    url: "",
  });
  useEffect(() => {
    setProduct(prop.product);
  }, []);
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    setProduct((prev) => {
      let updated;

      if (files) {
        updated = {
          ...prev,
          [name]: files[0],
        };
      } else {
        updated = {
          ...prev,
          [name]: value,
        };
      }
      validationSchema
        .validateAt(name, updated)
        .then(() => setErrors((prev) => ({ ...prev, [name]: undefined })))
        .catch((error) =>
          setErrors((prev) => ({ ...prev, [name]: error.message }))
        );

      return updated;
    });
    console.log(product, "product information");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(product, { abortEarly: false });
      setErrors({});
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("shop_name", product.shop_name);
      formData.append("sport_id", product.sport_id);
      formData.append("category_id", product.category_id);
      formData.append("url", product.url);
      if (product.image) {
        formData.append("image", product.image);
      }
      const result = await UpdateProductApi(formData, prop.product.id);
      console.log("update product", result);
      if (result) {
        prop.onSuccess(); 
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
  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, SetLoadingCategories] = useState(false);
  useEffect(() => {
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
  }, []);
  useEffect(() => {
    const FetchProduct = async () => {
      setLoading(true);
      try {
        const response = await FetchOneProduct(prop.product.id);
        if (response?.data) {
          console.log("Success to fetch one product", response.data);
          setProduct(response.data);
        }
      } catch {
        console.log("Failed to fetch one product");
      } finally {
        setLoading(false);
      }
    };
    FetchProduct();
  }, [prop.product.id]);
  // input style
  const commonInputSx = {
    mb: 2,
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      background: "#F5F5F7",
    },
  };
  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      encType="multipart/form-data"
      sx={{
        p: { xs: 0, sm: 3, md: 5 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        width: { xs: "90%", sm: "80%", md: "900px", lg: "900px" },
        height: { xs: "450px" },
        maxWidth: "90%",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 900,
          fontSize: { xs: "14px", sm: "24px", md: "32px" },
        }}
      >
        {t("product information")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <label style={{ color: "#525252" }} htmlFor="name">
              Product Name
            </label>
            <TextField
              size="small"
              id="name"
              name="name"
              placeholder="Type"
              value={product.name}
              onChange={handleChange}
              sx={commonInputSx}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <label style={{ color: "#525252" }} htmlFor="url">
              Product URL
            </label>
            <TextField
              size="small"
              id="url"
              name="url"
              placeholder="Type"
              value={product.url}
              onChange={handleChange}
              sx={commonInputSx}
              error={Boolean(errors.url)}
              helperText={errors.url}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <label style={{ color: "#525252" }} htmlFor="sport">
              Sport
            </label>
            <TextField
              size="small"
              id="sport"
              sx={commonInputSx}
              select
              variant="outlined"
              onChange={handleChange}
              value={product.sport_id}
              name="sport_id"
              error={Boolean(errors.sport_id)}
              helperText={errors.sport_id}
            >
              <MenuItem value="" disabled>
                {t("choose your sport")}
              </MenuItem>
              {loadingSports ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  &nbsp; {t("loading...")}
                </MenuItem>
              ) : sports.length > 0 ? (
                sports.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>{t("no sports available")}</MenuItem>
              )}
            </TextField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <label style={{ color: "#525252" }} htmlFor="category">
              category
            </label>
            <TextField
              sx={commonInputSx}
              size="small"
              select
              id="category"
              variant="outlined"
              onChange={handleChange}
              value={product.category_id}
              name="category_id"
              error={Boolean(errors.category_id)}
              helperText={errors.category_id}
            >
              <MenuItem value="" disabled>
                {t("choose your catrgory")}
              </MenuItem>
              {loadingCategories ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  &nbsp; {t("loading...")}
                </MenuItem>
              ) : categories.length > 0 ? (
                categories.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>{t("no categories available")}</MenuItem>
              )}
            </TextField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <label style={{ color: "#525252" }} htmlFor="shop">
              Shop Name
            </label>
            <TextField
              sx={commonInputSx}
              size="small"
              id="shop"
              placeholder="Type"
              name="shop_name"
              variant="outlined"
              value={product.shop_name}
              onChange={handleChange}
              error={Boolean(errors.shop_name)}
              helperText={errors.shop_name}
            />
          </Box>
        </Box>
        <Box>
          <Box sx={{ flex: 1 }}>
            <label style={{ color: "#525252" }} htmlFor="description">
              Description
            </label>
            <TextField
              fullWidth
              multiline
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: "#F5F5F7",
                },
              }}
              rows={3}
              placeholder={t("Type Description")}
              name="description"
              id="description"
              variant="outlined"
              value={product.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
          </Box>

          <Box
            component="div"
            sx={{
              width: 150,
              height: 150,
              margin: "0 auto",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              border: "1px solid #ccc",
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {product.image instanceof File ? (
              <img
                src={URL.createObjectURL(product.image)}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : product.image ? (
              <img
                src={`${BASE_URL}/${product.image}`}
                alt="product"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 60%" },
                  background: "#F5F5F7",
                  padding: 4,
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  name="image"
                  id="fileInput"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                  style={{
                    display: "none",
                  }}
                />
                <Box
                  component="button"
                  onClick={() => document.getElementById("fileInput").click()}
                  sx={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      opacity: 0.8,
                    },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="70"
                    height="70"
                    viewBox="0 0 20 20"
                  >
                    <g fill="none">
                      <path
                        fill="url(#SVGpAhxubuz)"
                        d="M6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"
                      />
                      <path
                        fill="url(#SVG9oSeOcyx)"
                        d="m16.122 16.121l-5.238-5.237a1.25 1.25 0 0 0-1.768 0L3.88 16.12A3 3 0 0 0 6 17h8a3 3 0 0 0 2.122-.879"
                      />
                      <circle
                        cx="12.5"
                        cy="7.5"
                        r="1.5"
                        fill="url(#SVG3UbN1wRo)"
                      />
                      <defs>
                        <linearGradient
                          id="SVG9oSeOcyx"
                          x1="8.251"
                          x2="9.715"
                          y1="10.518"
                          y2="17.343"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#b3e0ff" />
                          <stop offset="1" stopColor="#8cd0ff" />
                        </linearGradient>
                        <linearGradient
                          id="SVG3UbN1wRo"
                          x1="11.9"
                          x2="12.996"
                          y1="5.667"
                          y2="9.612"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fdfdfd" />
                          <stop offset="1" stopColor="#b3e0ff" />
                        </linearGradient>
                        <radialGradient
                          id="SVGpAhxubuz"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="rotate(51.687 3.782 -5.018)scale(38.7123 35.2114)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset=".338" stopColor="#0fafff" />
                          <stop offset=".529" stopColor="#367af2" />
                        </radialGradient>
                      </defs>
                    </g>
                  </svg>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "12px", color: "#1669B6" }}
                >
                  {t("upload image")}
                </Typography>
                {errors.image && (
                  <Typography variant="caption" color="error">
                    {errors.image}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{
          background: mainColor,
          p: 1,
          fontWeight: "bold",
          width: isMobile ? "90px" : "100px",
          marginRight: 3,
          "&:hover": { opacity: 0.5 },
        }}
      >
        Update Product
      </Button>
    </Box>
  );
}
