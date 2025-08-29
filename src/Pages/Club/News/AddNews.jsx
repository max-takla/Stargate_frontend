import { Box } from '@mui/material'
import React from 'react'
import AddNewsCard from '../../../Components/Club/News/AddNewsCard'

export default function AddNews(prop) {
  return (
    <Box>
      <AddNewsCard onSuccess={prop.onSuccess} />
    </Box>
  )
}
