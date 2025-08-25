import React, { useContext } from "react";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ClubDashboard from "../ClubDashboard";
import ProductList from '../../../Components/Club/Products/ProductList'
export default function ShowProducts() {
  return (
    <ClubDashboard>
      <Box sx={{ width: "100%" ,mt:6}}>
        <ProductList/> 
      </Box>
    </ClubDashboard>
  );
}
