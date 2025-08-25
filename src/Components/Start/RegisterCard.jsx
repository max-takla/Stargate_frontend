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
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { RegisterApi } from "../../Api/Auth/RegisterApi";
import Swal from "sweetalert2";
export default function RegisterCard() {
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("name is required"))
      .min(3, t("name must have at least 3 letters"))
      .max(25, t("name must have at most 30 letters")),
    email: Yup.string()
      .email(t("email is invalid"))
      .required(t("email is required")),
    password: Yup.string()
      .min(8, t("password should be at least 8 characters"))
      .required(t("password is required")),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwords must match"))
      .required(t("confirm password is required")),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, t("phone must be 10 numbers"))
      .required(t("phone is required")),
  });
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    role: "club",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setRegister((prev) => {
      const updatedState = { ...prev, [name]: value };
      validationSchema
        .validateAt(name, updatedState)
        .then(() => setErrors((prev) => ({ ...prev, [name]: undefined })))
        .catch((error) =>
          setErrors((prev) => ({ ...prev, [name]: error.message }))
        );

      return updatedState;
    });
  };
  useEffect(() => {
    if (register.password_confirmation) {
      validationSchema
        .validateAt("password_confirmation", register)
        .then(() =>
          setErrors((prev) => ({ ...prev, password_confirmation: undefined }))
        )
        .catch((error) =>
          setErrors((prev) => ({
            ...prev,
            password_confirmation: error.message,
          }))
        );
    }
  }, [register.password]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = { ...register };
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      console.log("Form Submitted:", values);
      const result = await RegisterApi(register);
      console.log("register", result);
      if (result)
        Swal.fire({
          icon: "success",
          title: "register Successful",
          text: "Welcome back!",
          confirmButtonColor: secondColor,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
    } catch (err) {
      const validationErrors = {};

      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err.response?.data?.message) {
        Swal.fire({
          icon: "error",
          title: t("registration failed"),
          text: err.response.data.message,
          confirmButtonColor: secondColor,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("registration failed"),
          text: t("something went wrong. please try again."),
          confirmButtonColor: secondColor,
        });
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
       <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", // Simpler responsive grid
          gap: 2,
          width: "100%",
        }}
      >
        <TextField
          sx={{
             background: "#F5F5F7",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
               background: "#F5F5F7",
            },
          }}
          placeholder={t("enter your name")}
          name="name"
          variant="outlined"
          value={register.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <PersonIcon sx={{ color: "#242424" }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          sx={{
            background: "#F5F5F7",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
               background: "#F5F5F7",
            },
          }}
          placeholder={t("enter your email")}
          name="email"
          variant="outlined"
          value={register.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <EmailIcon sx={{ color: "#242424" }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          sx={{
           background: "#F5F5F7",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
               background: "#F5F5F7",
            },
          }}
          placeholder={t("enter your password")}
          name="password"
          variant="outlined"
          value={register.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          type={showPassword ? "text" : "password"}
          slotProps={{
            input: {
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
            },
          }}
        />
        <TextField
          sx={{
            background: "#F5F5F7",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
               background: "#F5F5F7",
            },
          }}
          placeholder={t("enter confirm password")}
          name="password_confirmation"
          variant="outlined"
          value={register.password_confirmation}
          onChange={handleChange}
          error={Boolean(errors.password_confirmation)}
          helperText={errors.password_confirmation}
          type={showConfirmPassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon sx={{ color: "#242424" }} />
                    ) : (
                      <VisibilityIcon sx={{ color: "#242424" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          sx={{
           background: "#F5F5F7",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
               background: "#F5F5F7",
            },
            gridColumn: "1 / -1",
          }}
          placeholder={t("enter your phone number")}
          name="phone_number"
          variant="outlined"
          value={register.phone_number}
          onChange={handleChange}
          error={Boolean(errors.phone_number)}
          helperText={errors.phone_number}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <LocalPhoneIcon sx={{ color: "#242424" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
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
        {t("register")}
      </Button>
    </Box>
  );
}
