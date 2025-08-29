import { Box } from "@mui/material";
import AddProductsCard from "../../../Components/Club/Products/AddProductsCard";

export default function AddProducts(prop) {
  return (
      <Box>
        <AddProductsCard onSuccess={prop.onSuccess}/>
      </Box>
  );
}
