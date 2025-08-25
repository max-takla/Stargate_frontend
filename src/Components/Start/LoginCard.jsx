import React, { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AppContext } from "../../App";
import { LoginApi } from "../../Api/Auth/LoginApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GetInformation } from "../../Api/Club/InfoApi/GetInformation";
export default function LoginCard() {
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("email is invalid"))
      .required(t("email is required")),
    password: Yup.string()
      .min(8, t("password should be at least 8 characters"))
      .required(t("password is required")),
  });
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState({});
  const [login, setLogin] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = useCallback(
    () => setShowPassword((show) => !show),
    []
  );

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = { ...login };
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      const result = await LoginApi(login);
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("userId", result.data.id);
      let redirectTo = "/main-dashboard";
      if (result.data.role === "club") {
        const response = await GetInformation(result.data.id);
        if (Object.keys(response.data).length > 0) {
          localStorage.setItem("clubName", response.data.name);
          localStorage.setItem("clubId", response.data.id);
          redirectTo = "/club-dashboard";
        } else {
          redirectTo = "/club-information";
        }
      }
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: secondColor,
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        navigate(redirectTo);
      });
    } catch (err) {
      console.error("Login Error:", err);
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err.result?.data?.message) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.response.data.message,
          confirmButtonColor: secondColor,
        });
        setErrors({ general: err.result.data.message });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "An unexpected error occurred. Please try again.",
          confirmButtonColor: secondColor,
        });
        setErrors({ general: "An unexpected error occurred" });
      }
    }
  };
  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      sx={{
        p: { xs: 3, sm: 5, md: 7 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: 8,
        background: "#FFFFFF80",
      }}
    >
      {errors.general && (
        <Typography color="error" sx={{ mt: 1 }}>
          {errors.general}
        </Typography>
      )}

      <TextField
        sx={{
          borderRadius: "8px",
          background: "#F5F5F7",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            background: "#F5F5F7",
          },
        }}
        placeholder={t("enter your email")}
        name="email"
        fullWidth
        variant="outlined"
        value={login.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <EmailIcon sx={{ color: "#242424" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        sx={{
          borderRadius: "8px",
          background: "#F5F5F7",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            background: "#F5F5F7",
          },
        }}
        placeholder={t("enter your password")}
        name="password"
        fullWidth
        variant="outlined"
        value={login.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOffIcon sx={{ color: "#242424" }} />
                ) : (
                  <VisibilityIcon sx={{ color: "#242424" }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          borderRadius: "8px",
          backgroundImage: `linear-gradient(
     ${mainColor},
     ${secondColor}
    )`,
          p: { xs: 1, sm: 1.5 },
          fontWeight: "bold",
          "&:hover": { background: hoverColor },
          fontSize: { xs: "16px", sm: "20px" },
          color: "white",
        }}
      >
        {t("login")}
      </Button>
    </Box>
  );
}
