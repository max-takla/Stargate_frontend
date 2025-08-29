import React from 'react'
import ClubDashboard from '../ClubDashboard'
import { Box } from '@mui/material'
import SearchCards from '../../../Components/Club/Search player/SearchCards'

export default function SearchPlayer() {
  return (
    <ClubDashboard>
        <Box sx={{width:"100%"}}>
            <SearchCards/>
        </Box>
    </ClubDashboard>
  )
}
