import React from 'react'
import { Box } from '@mui/material'
import MainDashboard from '../MainDashboard'
import MainNewsCard from '../../../Components/Main/News/MainNewsCard'

export default function ShowNews() {
  return (
    <MainDashboard> 
      <Box sx={{width:"100%"}}>
        <MainNewsCard/>
      </Box>
    </MainDashboard>
  )
}
