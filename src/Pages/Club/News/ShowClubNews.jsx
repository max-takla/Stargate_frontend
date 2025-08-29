import React from 'react'
import ClubDashboard from '../ClubDashboard'
import { Box } from '@mui/material'
import ClubNewsCard from '../../../Components/Club/News/ClubNewsCard'

export default function ShowClubNews() {
  return (
 <ClubDashboard> 
      <Box>
        <ClubNewsCard/>
      </Box>
    </ClubDashboard>
  )
}
