import React from 'react'
import ClubDashboard from '../ClubDashboard'
import { Box } from '@mui/material'
import AllNewsCards from '../../../Components/Club/News/AllNewsCards'

export default function ShowAllNews() {
  return (
     <ClubDashboard> 
      <Box>
        <AllNewsCards/>
      </Box>
    </ClubDashboard>
  )
}
