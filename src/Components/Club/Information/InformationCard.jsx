import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import { AppContext } from "../../../App";
import { GetAllCountries } from "../../../../../../Star-Get/my-app/src/Api/Club/InfoApi/GetAllCountries";
import { GetAllLeagues } from "../../../../../../Star-Get/my-app/src/Api/Club/InfoApi/GetAllLeagues";
import { GetAllSports } from "../../../../../../Star-Get/my-app/src/Api/Club/InfoApi/GetAllSports";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { AddClubApi } from "../../../../../../Star-Get/my-app/src/Api/Club/AddClubApi";
import { useNavigate } from "react-router-dom";

export default function InformationCard() {
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("club name is required"))
      .min(3, t("club name must have at least 3 letters"))
      .max(25, t("club name must have at most 30 letters")),
    manager: Yup.string()
      .required(t("manager name is required"))
      .min(3, t("manager name must have at least 3 letters"))
      .max(25, t("manager name must have at most 30 letters")),
    president: Yup.string()
      .required(t("president name is required"))
      .min(3, t("president name must have at least 3 letters"))
      .max(25, t("president name must have at most 30 letters")),
    achievement: Yup.string()
      .required(t("achievement is required"))
      .test(
        "min-lines",
        t("enter at least 2 achievements on separate lines"),
        (value) => {
          if (!value) return false;
          const lines = value
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          return lines.length >= 2;
        }
      )
      .max(300, t("achievement must have at most 300 characters")),
    description: Yup.string()
      .required(t("description is required"))
      .min(10, t("description must be at least 10 characters"))
      .max(500, t("description must be at most 500 characters")),
    bio: Yup.string()
      .required(t("bio is required"))
      .min(10, t("bio must be at least 10 characters"))
      .max(200, t("bio must be at most 200 characters")),
    founding_date: Yup.date()
      .required(t("founding date is required"))
      .max(new Date(), t("founding date cannot be in the future")),
    league_name: Yup.string()
      .required(t("league name is required"))
      .min(3, t("league name must be at least 3 characters"))
      .max(50, t("league name must be at most 50 characters")),
    logo: Yup.mixed()
      .required(t("logo is required"))
      .test("fileType", t("unsupported file type"), (value) => {
        if (!value) return false;
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        return allowedTypes.includes(value.type);
      }),
    fav_country: Yup.array()
      .min(1, t("you must select at least one option"))
      .of(Yup.string().required("you must select your preferred country")),
    sport: Yup.array()
      .min(1, t("you must select at least one option"))
      .of(Yup.string().required("you must select your sport")),
    league_id: Yup.string().required("you must select your league"),
    images: Yup.array()
      .min(1, t("you must upload at least one image"))
      .test("fileType", t("unsupported file type"), (images) => {
        if (!Array.isArray(images) || images.length === 0) return false;

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        return images.every((file) => {
          return file instanceof File && allowedTypes.includes(file.type);
        });
      }),
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const steps = ["details", "preferred", "more info"];

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return [
          "name",
          "manager",
          "president",
          "founding_date",
          "logo",
          "images",
        ];
      case 1:
        return ["countryIds", "sportIds", "league_name", "league_id"];
      case 2:
        return ["bio", "description", "achievement"];
      default:
        return [];
    }
  };
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = async () => {
    try {
      const fields = getFieldsForStep(activeStep);
      await validationSchema.pick(fields).validate(info, { abortEarly: false });
      setErrors({});
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      const stepErrors = {};
      err.inner.forEach((e) => {
        stepErrors[e.path] = e.message;
      });
      setErrors(stepErrors);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  const [userId, setUserId] = useState(0);
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);
    setoInfo((prev) => ({
      ...prev,
      user_id: parseInt(storedId),
    }));
  }, []);
  const [errors, setErrors] = useState({});
  const [info, setoInfo] = useState({
    user_id: parseInt(userId),
    name: "",
    manager: "",
    president: "",
    achievement: "",
    description: "",
    bio: "",
    founding_date: "",
    status: "",
    league_name: "",
    logo: null,
    status: "active",
    preferences: "nothing",
    fav_country: [],
    sport: [],
    league_id: "",
    images: [],
  });
  //fetch data
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(false);
  useEffect(() => {
    const FetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const result = await GetAllCountries();
        if (result?.data?.countries) {
          console.log(result.data.countries, "successful in get all countries");
          setCountries(result.data.countries);
        }
      } catch (error) {
        console.log("faild in get all countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    const FetchLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const result = await GetAllLeagues();
        if (result?.data?.league) {
          console.log(result.data.league, "successful in get all leagues");
          setLeagues(result.data.league);
        }
      } catch (error) {
        console.log("faild in get all leagues:", error);
      } finally {
        setLoadingLeagues(false);
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
    FetchLeagues();
    FetchCountries();
    FetchSports();
  }, []);
  const handleMultiSelectChange = (name) => (e) => {
    const selected = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value];
    setoInfo((prev) => ({ ...prev, [name]: selected }));

    validationSchema
      .validateAt(name, { [name]: selected })
      .then(() => setErrors((prev) => ({ ...prev, [name]: undefined })))
      .catch((error) =>
        setErrors((prev) => ({ ...prev, [name]: error.message }))
      );
  };
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    setoInfo((prev) => {
      let updated;

      if (name === "images") {
        updated = {
          ...prev,
          images: [...prev.images, ...Array.from(files)],
        };
      } else if (files) {
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

      // Validate the updated field
      validationSchema
        .validateAt(name, updated)
        .then(() => setErrors((prev) => ({ ...prev, [name]: undefined })))
        .catch((error) =>
          setErrors((prev) => ({ ...prev, [name]: error.message }))
        );

      return updated;
    });
    console.log(info, "information");
  };
  const commonInputSx = {
    mb: 2,
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: "30px",
      background: "#F5F5F7",
    },
  };
  const renderStepForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <label style={{ color: "#525252" }} htmlFor="name">
                  Club Name
                </label>
                <TextField
                  id="name"
                  name="name"
                  placeholder="name"
                  value={info.name}
                  onChange={handleChange}
                  sx={commonInputSx}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <label htmlFor="manager" style={{ color: "#525252" }}>
                  {t("manager name")}
                </label>
                <TextField
                  id="manager"
                  name="manager"
                  placeholder="manager"
                  value={info.manager}
                  onChange={handleChange}
                  sx={commonInputSx}
                  error={Boolean(errors.manager)}
                  helperText={errors.manager}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <label htmlFor="president" style={{ color: "#525252" }}>
                  {t("president name")}
                </label>
                <TextField
                  id="president"
                  name="president"
                  placeholder={t("president name")}
                  value={info.president}
                  onChange={handleChange}
                  sx={commonInputSx}
                  error={Boolean(errors.president)}
                  helperText={errors.president}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <label htmlFor="founding_date" style={{ color: "#525252" }}>
                  {t("founding date")}
                </label>
                <TextField
                  id="founding_date"
                  type="date"
                  name="founding_date"
                  placeholder={t("founding date")}
                  value={info.founding_date}
                  onChange={handleChange}
                  sx={commonInputSx}
                  error={Boolean(errors.founding_date)}
                  helperText={errors.founding_date}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 40%" },
                  background: "#F5F5F7",
                  padding: 4,
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  name="logo"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                  id="logoInput"
                  style={{
                    display: "none",
                  }}
                />
                <Box
                  component="button"
                  onClick={() => document.getElementById("logoInput").click()}
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
                  {t("upload logo")}
                </Typography>
                {errors.logo && (
                  <Typography variant="caption" color="error">
                    {errors.logo}
                  </Typography>
                )}
              </Box>
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
                  name="images"
                  id="fileInput"
                  accept="image/png, image/jpeg"
                  multiple
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
                  {t("upload images")}
                </Typography>
                {errors.images && (
                  <Typography variant="caption" color="error">
                    {errors.images}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <>
            <FormControl sx={commonInputSx}>
              <br />
              <label id="fav-country-label">
                {t("choose your preferred country")}
              </label>
              <Select
                labelId="fav-country-label"
                multiple
                value={info.fav_country}
                name="fav_country"
                onChange={handleMultiSelectChange("fav_country")}
                error={Boolean(errors.fav_country)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const country = countries.find((c) => c.id === id);
                      return (
                        <Chip key={id} label={country ? country.name : id} />
                      );
                    })}
                  </Box>
                )}
              >
                {loadingCountries ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t("loading...")}
                  </MenuItem>
                ) : countries.length > 0 ? (
                  countries.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t("no countries available")}</MenuItem>
                )}
              </Select>
              {errors.fav_country && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.fav_country}
                </Typography>
              )}
            </FormControl>
            <FormControl sx={commonInputSx}>
              <label id="sport-label">{t("choose your sport field")}</label>
              <Select
                labelId="sport-label"
                multiple
                value={info.sport}
                name="sport"
                onChange={handleMultiSelectChange("sport")}
                error={Boolean(errors.sport)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const sport = sports.find((c) => c.id === id);
                      return <Chip key={id} label={sport ? sport.name : id} />;
                    })}
                  </Box>
                )}
              >
                {loadingSports ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t("loading...")}
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
              </Select>
              {errors.sport && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.sport}
                </Typography>
              )}
            </FormControl>
            <br />
            <label id="leagueId">{t("choose your league")}</label>
            <br />
            <TextField
              sx={commonInputSx}
              id="leagueId"
              select
              variant="outlined"
              onChange={handleChange}
              value={info.league_id}
              name="league_id"
              error={Boolean(errors.league_id)}
              helperText={errors.league_id}
            >
              <MenuItem value="" disabled>
                {t("choose your league")}
              </MenuItem>
              {loadingLeagues ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  &nbsp; {t("loading...")}
                </MenuItem>
              ) : leagues.length > 0 ? (
                leagues.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>{t("no leagues available")}</MenuItem>
              )}
            </TextField>
            <label id="leagueName">{t("type your league name")}</label>
            <TextField
              id="leagueName"
              sx={commonInputSx}
              placeholder={t("type")}
              name="league_name"
              variant="outlined"
              value={info.league_name}
              onChange={handleChange}
              error={Boolean(errors.league_name)}
              helperText={errors.league_name}
            />
          </>
        );
      case 2:
        return (
          <>
            <label htmlFor="achievement" style={{ color: "#525252" }}>
              {t("achievement")}
            </label>
            <TextField
              multiline
              rows={3}
              id="achievement"
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: "#F5F5F7",
                },
              }}
              placeholder={t("enter the club's achievements")}
              name="achievement"
              variant="outlined"
              value={info.achievement}
              onChange={handleChange}
              error={Boolean(errors.achievement)}
              helperText={errors.achievement}
            />
            <br />
            <label htmlFor="description" style={{ color: "#525252" }}>
              {t("description")}
            </label>
            <TextField
              multiline
              rows={3}
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: "#F5F5F7",
                },
              }}
              id="description"
              placeholder={t("enter the description")}
              name="description"
              variant="outlined"
              value={info.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
            <br />
            <label htmlFor="bio" style={{ color: "#525252" }}>
              {t("bio")}
            </label>
            <br />
            <TextField
              multiline
              rows={3}
              id="bio"
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  background: "#F5F5F7",
                },
              }}
              placeholder={t("‘‘enter the bio’’")}
              name="bio"
              variant="outlined"
              value={info.bio}
              onChange={handleChange}
              error={Boolean(errors.bio)}
              helperText={errors.bio}
            />
          </>
        );
      default:
        return null;
    }
  };
  // handle with submit
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await validationSchema.validate(info, { abortEarly: false });
      setErrors({});
      const formData = new FormData();
      //append normal data to formData
      formData.append("user_id", info.user_id);
      formData.append("name", info.name);
      formData.append("manager", info.manager);
      formData.append("president", info.president);
      formData.append("achievement", info.achievement);
      formData.append("description", info.description);
      formData.append("bio", info.bio);
      formData.append("founding_date", info.founding_date);
      formData.append("status", info.status);
      formData.append("league_name", info.league_name);
      formData.append("preferences", info.preferences);
      formData.append("league_id", info.league_id);
      //append arrays to formData
      formData.append("fav_country", JSON.stringify(info.fav_country));
      formData.append("sport", JSON.stringify(info.sport));
      //append file to formData
      if (info.logo) {
        formData.append("logo", info.logo);
      }
      // Append multiple image files
      if (info.images && info.images.length > 0) {
        info.images.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      const result = await AddClubApi(formData);
      console.log("club login", result);
      if (result) {
        localStorage.setItem("clubName", result.data.name);
        navigate("/club-dashboard");
        setActiveStep(0);
      }
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: "500",
          fontSize: { sm: "22px", md: "32px" },
        }}
      >
        {t("club information")}
      </Typography>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 2, mb: 1 }}>{renderStepForm()}</Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  mr: 1,
                  borderRadius: "8px",
                  backgroundImage: `linear-gradient(
      ${mainColor},
      ${secondColor}
    )`,
                  p: { xs: 1, sm: 1.5 },
                  width: "200px",
                  fontWeight: "400",
                  "&:hover": { background: hoverColor },
                  fontSize: { xs: "12px", sm: "16px" },
                  color: "white",
                  height: "30px",
                }}
              >
                <KeyboardDoubleArrowLeftIcon /> Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  sx={{
                    mr: 1,
                    borderRadius: "8px",
                    width: "200px",
                    backgroundImage: `linear-gradient(
      ${mainColor},
      ${secondColor}
    )`,
                    p: { xs: 1, sm: 1.5 },
                    fontWeight: "400",
                    "&:hover": { background: hoverColor },
                    fontSize: { xs: "12px", sm: "16px" },
                    color: "white",
                    height: "30px",
                  }}
                >
                  Next
                  <KeyboardDoubleArrowRightIcon />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  sx={{
                    mr: 1,
                    borderRadius: "8px",
                    width: "200px",
                    backgroundImage: `linear-gradient(
      ${mainColor},
      ${secondColor}
    )`,
                    p: { xs: 1, sm: 1.5 },
                    fontWeight: "400",
                    "&:hover": { background: hoverColor },
                    fontSize: { xs: "12px", sm: "16px" },
                    color: "white",
                    height: "30px",
                  }}
                >
                  Submit
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
