import React from 'react'
import ClubDashboard from '../ClubDashboard'
import { Box } from '@mui/material'
import PlayerInfoCard from '../../../Components/Club/Player/PlayerInfoCard'

export default function PlayerInfo() {
  return (
    <ClubDashboard>
         <Box sx={{ width: "100%" }}>
           <PlayerInfoCard />
         </Box>
       </ClubDashboard>
  )
}
