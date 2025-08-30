import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeightIcon from "@mui/icons-material/Height";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import CakeIcon from "@mui/icons-material/Cake";
import CachedIcon from "@mui/icons-material/Cached";
import { FetchAllPlayer } from "../../../Api/Club/Player/FetchAllPlayer";
import { GetSkills } from "../../../Api/Club/InfoApi/GetSkills";

const BASE_URL = "https://dashboard.stars-gate.com";

export default function SearchCards() {
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [openAge, setOpenAge] = useState(false);
  const [ageRange, setAgeRange] = useState([0, 0]);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);

  const [openHeight, setOpenHeight] = useState(false);
  const [heightRange, setHeightRange] = useState([0, 0]);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);

  const [openWeight, setOpenWeight] = useState(false);
  const [weightRange, setWeightRange] = useState([0, 0]);
  const [minWeight, setMinWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(0);

  const [openSkills, setOpenSkills] = useState(false);

  const [filteredPlayersOnSearch, setFilteredPlayersOnSearch] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleChangeAge = (event, newValue) => {
    setAgeRange(newValue);
  };
  const handleChangeHeight = (event, newValue) => {
    setHeightRange(newValue);
  };
  const handleChangeWeight = (event, newValue) => {
    setWeightRange(newValue);
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return NaN;
    const birth = new Date(birthdate);
    if (isNaN(birth.getTime())) return NaN;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await FetchAllPlayer();
        if (result?.data?.info) {
          const players = result.data.info;

          // calc age
          const ages = players
            .map((p) => calculateAge(p.birthdate))
            .filter((age) => !isNaN(age));
          const minA = Math.min(...ages);
          const maxA = Math.max(...ages);
          setMinAge(minA);
          setMaxAge(maxA);
          setAgeRange([minA, maxA]);

          //calc height
          const heights = players
            .map((p) => parseFloat(p.height))
            .filter((h) => !isNaN(h));
          const minH = Math.min(...heights);
          const maxH = Math.max(...heights);
          setMinHeight(minH);
          setMaxHeight(maxH);
          setHeightRange([minH, maxH]);

          // calc weight
          const weights = players
            .map((p) => parseFloat(p.weight))
            .filter((w) => !isNaN(w));
          const minW = Math.min(...weights);
          const maxW = Math.max(...weights);
          setMinWeight(minW);
          setMaxWeight(maxW);
          setWeightRange([minW, maxW]);

          setUsers(
            players.map((p) => ({
              ...p,
              age: calculateAge(p.birthdate),
              heightValue: parseFloat(p.height),
              weightValue: parseFloat(p.weight),
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSkills = async () => {
      setLoadingSkills(true);
      try {
        const response = await GetSkills();
        if (response?.data?.skills) {
          setSkills(response?.data?.skills);
        }
      } catch (error) {
        console.log(error, "faild in fetch skills");
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
    fetchUsers();
  }, []);

  // handle search
  const handleSearch = () => {
    setSearched(true);
    const filtered = users.filter((p) => {
      const matchesAge =
        !isNaN(p.age) && p.age >= ageRange[0] && p.age <= ageRange[1];
      const matchesHeight =
        !isNaN(p.heightValue) &&
        p.heightValue >= heightRange[0] &&
        p.heightValue <= heightRange[1];
      const matchesWeight =
        !isNaN(p.weightValue) &&
        p.weightValue >= weightRange[0] &&
        p.weightValue <= weightRange[1];

      const matchesSkills =
        selectedSkills.length === 0 ||
        JSON.parse(p.skills)?.some((skill) => selectedSkills.includes(skill));

      return matchesAge && matchesHeight && matchesWeight && matchesSkills;
    });
    console.log("filtered", filtered);
    setFilteredPlayersOnSearch(filtered);
  };
  const commonButtonStyle = {
    borderRadius: "8px",
    backgroundImage: `linear-gradient(${mainColor}, ${secondColor})`,
    fontWeight: "400",
    "&:hover": { background: hoverColor },
    fontSize: { xs: "16px", sm: "16px" },
    color: "white",
    minWidth: "200px",
    textTransform: "capitalize",
  };

  return (
    <Box
      sx={{
        mt: 6,
        display: { xs: "block", md: "flex" },
        justifyContent: "space-between",
        p: { xs: 2, md: 3 },
        gap: { xs: 4, md: 2 },
      }}
    >
      {/* content after filter */}
      <Box sx={{ flex: 1 }}>
        {searched ? (
          filteredPlayersOnSearch.length > 0 ? (
            filteredPlayersOnSearch.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  mt: 5,
                  flexDirection: "column",
                  borderBottom: "1px solid #D1D5DB",
                }}
              >
                <Box sx={{ my: 2, p: 2, maxWidth: { xs: "100%", md: "600px" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 , flexWrap: "wrap", gap: 1 }}>
                    <Avatar
                      src={`${BASE_URL}/${user.image || ""}`}
                      alt={user.player_name}
                      sx={{ mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {user.player_name || "Unnamed Player"}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="400">
                        {user.countries_name || "Unknown Player country"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap"  }}>
                    <Box
                      sx={{ background: "#F5F5F7", borderRadius: "24px", p: 2 }}
                    >
                      <Typography fontWeight="400">
                        <HeightIcon sx={{ mr: 1 }} />
                        {user.heightValue
                          ? `${user.heightValue} cm`
                          : "Unknown Player height"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ background: "#F5F5F7", borderRadius: "24px", p: 2 }}
                    >
                      <Typography fontWeight="400">
                        <MonitorWeightIcon sx={{ mr: 1 }} />
                        {user.weight
                          ? `${user.weight} kg`
                          : "Unknown Player weight"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ background: "#F5F5F7", borderRadius: "24px", p: 2 }}
                    >
                      <Typography fontWeight="400">
                        <CakeIcon sx={{ mr: 1 }} />
                        {user.age ? `${user.age} years` : "Unknown age"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography mt={5} fontWeight="bold">
              No player match
            </Typography>
          )
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography mt={5} fontWeight="bold">
              Filter parameters to locate players
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 , mt: { xs: 4, md: 0 } }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <Button
            type="button"
            variant="contained"
            sx={commonButtonStyle}
            onClick={handleSearch}
          >
            <SearchIcon /> {t("search")}
          </Button>
          <CachedIcon fontSize="large" />
        </Box>
        {/* Age Slider */}
        <Box
          sx={{
             width: { xs: "100%", md: 350 },
            border: `1px solid ${secondColor}`,
            p: 5,
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
              transform: "translateY(-3px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              p: 1,
              borderRadius: 2,
              backgroundColor: "#F9FAFB",
            }}
            onClick={() => setOpenAge(!openAge)}
          >
            <Typography>
              Age Range: {ageRange[0]} - {ageRange[1]}
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: openAge ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.3s",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={openAge}>
            <Box sx={{ mt: 2 }}>
              <Slider
                value={ageRange}
                onChange={handleChangeAge}
                valueLabelDisplay="auto"
                min={minAge}
                max={maxAge}
                step={1}
                sx={{
                  height: 25,
                  color: "primary.main",
                  "& .MuiSlider-track": { border: "none" },
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  },
                  "& .MuiSlider-rail": {
                    opacity: 1,
                    backgroundColor: "#D1D5DB",
                  },
                }}
              />
            </Box>
          </Collapse>
        </Box>

        {/* Height Slider */}
        <Box
          sx={{
            width: { xs: "100%", md: 350 },
            border: `1px solid ${secondColor}`,
            p: 5,
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
              transform: "translateY(-3px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              p: 1,
              borderRadius: 2,
              backgroundColor: "#F9FAFB",
            }}
            onClick={() => setOpenHeight(!openHeight)}
          >
            <Typography>
              Height Range: {heightRange[0]} - {heightRange[1]} cm
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: openHeight ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.3s",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={openHeight}>
            <Box sx={{ mt: 2 }}>
              <Slider
                value={heightRange}
                onChange={handleChangeHeight}
                valueLabelDisplay="auto"
                min={minHeight}
                max={maxHeight}
                step={1}
                sx={{
                  height: 25,
                  color: "primary.main",
                  "& .MuiSlider-track": { border: "none" },
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  },
                  "& .MuiSlider-rail": {
                    opacity: 1,
                    backgroundColor: "#D1D5DB",
                  },
                }}
              />
            </Box>
          </Collapse>
        </Box>
        {/* Weight Slider */}
        <Box
          sx={{
             width: { xs: "100%", md: 350 },
            border: `1px solid ${secondColor}`,
            p: 5,
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
              transform: "translateY(-3px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              p: 1,
              borderRadius: 2,
              backgroundColor: "#F9FAFB",
            }}
            onClick={() => setOpenWeight(!openWeight)}
          >
            <Typography>
              Weight Range: {weightRange[0]} - {weightRange[1]} Kg
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: openWeight ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.3s",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={openWeight}>
            <Box sx={{ mt: 2 }}>
              <Slider
                value={weightRange}
                onChange={handleChangeWeight}
                valueLabelDisplay="auto"
                min={minWeight}
                max={maxWeight}
                step={1}
                sx={{
                  height: 25,
                  color: "primary.main",
                  "& .MuiSlider-track": { border: "none" },
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  },
                  "& .MuiSlider-rail": {
                    opacity: 1,
                    backgroundColor: "#D1D5DB",
                  },
                }}
              />
            </Box>
          </Collapse>
        </Box>
        {/* Skills Slider */}
        <Box
          sx={{
             width: { xs: "100%", md: 350 },
            border: `1px solid ${secondColor}`,
            p: 2,
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
              transform: "translateY(-3px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              p: 1,
              borderRadius: 2,
              backgroundColor: "#F9FAFB",
            }}
            onClick={() => setOpenSkills(!openSkills)}
          >
            <Typography>
              Skills:{" "}
              {selectedSkills.length > 0
                ? selectedSkills.join(", ")
                : "Select Skills"}
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: openSkills ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.3s",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={openSkills}>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
            >
              {skills.map((skill) => (
                <Box key={skill.id}>
                  <Checkbox
                    checked={selectedSkills.includes(skill.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSkills([...selectedSkills, skill.name]);
                      } else {
                        setSelectedSkills(
                          selectedSkills.filter((s) => s !== skill.name)
                        );
                      }
                    }}
                  />
                  <Typography component="span">{skill.name}</Typography>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}
