import { Box } from '@mui/material'
import React from 'react'
import UpdateNewsCard from '../../../Components/Club/News/UpdateNewsCard'

export default function UpdateNews(prop) {
  return (
   <Box>
      <UpdateNewsCard article={prop.article} onSuccess={prop.onSuccess} />
    </Box>
  )
}
