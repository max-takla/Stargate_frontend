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
import { useParams } from "react-router-dom";
import { FetchOneProduct } from "../../../Api/Club/Products/FetchOneProduct";
import { UpdateProductApi } from "../../../Api/Club/Products/UpdateProductApi";

export default function UpdateProductCard() {
  const { id } = useParams();
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
      const result = await UpdateProductApi(formData, id);
      console.log("update product", result);
      if (result) {
        navigate("/products");
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
        const response = await FetchOneProduct(id);
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
  }, [id]);
  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      encType="multipart/form-data"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        alignItems: "center",
        p: { xs: 0, sm: 3, md: 5 },
        gap: 2,
        display: "flex",
        flexDirection: "column",
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
        {t("update product")}
      </Typography>
      <Box
        sx={{
          width: "100%",
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "2fr 2fr",
          },
          px: { xs: 2, sm: 3 },
          gap: 3,
        }}
      >
        <TextField
          sx={{ background: input }}
          placeholder={t("enter the product name")}
          name="name"
          variant="outlined"
          value={product.name || ""}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          sx={{ background: input }}
          placeholder={t("enter the product url")}
          name="url"
          variant="outlined"
          value={product.url || ""}
          onChange={handleChange}
          error={Boolean(errors.url)}
          helperText={errors.url}
        />
        {!loadingSports &&
        sports.some((sport) => sport.id === Number(news.sport_id)) ? (
          <TextField
            sx={{ background: input }}
            label={t("choose your sport")}
            select
            variant="outlined"
            onChange={handleChange}
            value={news.sport_id || ""}
            name="sport_id"
            error={Boolean(errors.sport_id)}
            helperText={errors.sport_id}
          >
            <MenuItem value="" disabled>
              {t("choose your sport")}
            </MenuItem>
            {sports.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {el.name}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            sx={{ background: input }}
            label={t("choose your sport")}
            select
            variant="outlined"
            onChange={handleChange}
            value=""
            name="sport_id"
            error={Boolean(errors.sport_id)}
            helperText={errors.sport_id}
          >
            <MenuItem value="" disabled>
              {loadingSports ? t("loading...") : t("no sports available")}
            </MenuItem>
          </TextField>
        )}
        <TextField
          sx={{ background: input }}
          label={t("choose your catrgory")}
          select
          variant="outlined"
          onChange={handleChange}
          value={product.category_id || ""}
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
        <TextField
          sx={{ background: input }}
          placeholder={t("enter the shop name")}
          name="shop_name"
          variant="outlined"
          value={product.shop_name || ""}
          onChange={handleChange}
          error={Boolean(errors.shop_name)}
          helperText={errors.shop_name}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          sx={{ background: input }}
          placeholder={t("enter the description")}
          name="description"
          variant="outlined"
          value={product.description || ""}
          onChange={handleChange}
          error={Boolean(errors.description)}
          helperText={errors.description}
        />
        <Box>
          <Typography variant="body1" sx={{ textAlign: "start", mb: 1 }}>
            {t("upload the product image")}
          </Typography>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleChange}
            style={{
              background: input,
              border: errors.image ? "1px solid red" : "1px solid #ccc",
              padding: "8px",
              borderRadius: "6px",
              width: "100%",
            }}
          />
          {errors.image && (
            <Typography variant="caption" color="error">
              {errors.image}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
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
          {t("update")}
        </Button>
        <Button
          onClick={() => navigate("/products")}
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
          {t("back")}
        </Button>
      </Box>
    </Box>
  );
}
