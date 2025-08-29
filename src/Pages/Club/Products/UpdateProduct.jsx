
import { Box } from "@mui/material"
import UpdateProductCard from "../../../Components/Club/Products/UpdateProductCard";

export default function UpdateProduct(prop) {
  console.log("prop",prop.product)
  return (
    <Box>
        <UpdateProductCard onSuccess={prop.onSuccess}/>
      </Box>
  );
}
