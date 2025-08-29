import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { GetAllSports } from "../../../Api/Club/InfoApi/GetAllSports";
import { UpdateNewsApi } from "../../../Api/Club/News/UpdateNewsApi";
const BASE_URL = "https://dashboard.stars-gate.com";
export default function UpdateNewsCard(prop) {
  const [news, setNews] = useState({});
  useEffect(() => {
    setNews(prop.article);
  }, []);
  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(false);
  const { mainColor, secondColor,hoverColor } = useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    content: Yup.string().required(t("content is required")),
    title: Yup.string()
      .required(t("title is required"))
      .min(3, t("title must have at least 3 letters"))
      .max(500, t("title must be at most 500 characters")),
    sport_id: Yup.string().required(t("you must select your sport")),
    image: Yup.mixed()
      .required(t("article image is required"))
      .test("fileType", t("unsupported file type"), (value) => {
        if (!value) return false;
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        return allowedTypes.includes(value.type);
      }),
  });
  useEffect(() => {
    const getSports = async () => {
      setLoadingSports(true);
      try {
        const result = await GetAllSports();
        if (result?.data?.sports) {
          setSports(result.data.sports);
          console.log("sports:", result.data.sports);
        }
      } catch (error) {
        console.error("Failed to fetch sports:", error);
      } finally {
        setLoadingSports(false);
      }
    };
    getSports();
  }, []);
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    setNews((prev) => {
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
    console.log(news, "news information");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(news, { abortEarly: false });
      setErrors({});
      const formData = new FormData();
      formData.append("title", news.title);
      formData.append("content", news.content);
      formData.append("club_id", news.club_id);
      formData.append("sport_id", news.sport_id);
      if (news.image) {
        formData.append("image", news.image);
      }
      const result = await UpdateNewsApi(formData);
      console.log("update news", result);
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
        News Information
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ flex: 1 }}>
            <label style={{ color: "#525252" }} htmlFor="title">
              News Title
            </label>
            <TextField
              size="small"
              id="title"
              name="title"
              placeholder="Type"
              value={news.title}
              onChange={handleChange}
              sx={commonInputSx}
              error={Boolean(errors.title)}
              helperText={errors.title}
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
              value={news.sport_id || ""}
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
            <label style={{ color: "#525252" }} htmlFor="content">
              News Content
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
              placeholder={t("Type content")}
              name="content"
              id="content"
              variant="outlined"
              value={news.content}
              onChange={handleChange}
              error={Boolean(errors.content)}
              helperText={errors.content}
            />
          </Box>
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
          {news.image instanceof File ? (
            <img
              src={URL.createObjectURL(news.image)}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : news.image ? (
            <img
              src={`${BASE_URL}/${news.image}`}
              alt="news"
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
      <Button
        type="submit"
        variant="contained"
        sx={{
          background: mainColor,
          p: 1,
          fontWeight: "bold",
          width: isMobile ? "100%" : "200px",
          marginRight: 3,
          "&:hover": { background:hoverColor},
        }}
      >
        Update News
      </Button>
    </Box>
  );
}
