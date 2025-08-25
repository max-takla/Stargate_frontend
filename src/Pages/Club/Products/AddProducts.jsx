import React, { useCallback, useContext } from "react";
import { AppContext } from "../../../App";
import i18n from "../../../i18n";
import { Box, Button, Typography } from "@mui/material";
import ClubDashboard from "../ClubDashboard";
import AddProductsCard from "../../../Components/Club/Products/AddProductsCard";

export default function AddProducts() {
  const { en, setEn, secondColor, mainColor } = useContext(AppContext);
  //Translate
  const changeLanguage = useCallback(() => {
    setEn(!en);
    i18n.changeLanguage(en ? "en" : "ar");
  }, [en, setEn]);
  return (
      <Box>
        <AddProductsCard />
      </Box>
  );
}
