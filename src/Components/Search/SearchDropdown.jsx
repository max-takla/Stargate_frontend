import React, { useContext, useState } from "react";
import { IconButton, TextField, Menu, MenuItem, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AppContext } from "../../App";

export default function SearchDropdown({ data }) {
      const { mainColor, en, secondColor, hoverColor } = useContext(AppContext);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value) {
      const results = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(results);
      setAnchorEl(e.currentTarget);
    } else {
      setFilteredResults([]);
      setAnchorEl(null);
    }
  };

  const handleSelect = (item) => {
    setSearchText(item);
    setAnchorEl(null);
    setFilteredResults([]);
    console.log("Selected:", item);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        value={searchText}
        onChange={handleChange}
        placeholder="Search..."
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            color: mainColor,
            "&:hover fieldset": { borderColor: hoverColor },
          },
        }}
      />
      <IconButton>
        <SearchIcon
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
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && filteredResults.length > 0}
        onClose={() => setAnchorEl(null)}
        sx={{ mt: 1 }}
      >
        {filteredResults.map((item, index) => (
          <MenuItem key={index} onClick={() => handleSelect(item)}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
