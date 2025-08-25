import React from 'react'
import { Box } from '@mui/material'
import MainDashboard from '../MainDashboard'
import RequestsList from '../../../Components/Main/RequestToJoin/RequestsList'

export default function Requests() {
  return (
    <MainDashboard>
       <Box sx={{ width: "100%",mt:6 }}>
        <RequestsList/>
       </Box>
    </MainDashboard>
  )
}
