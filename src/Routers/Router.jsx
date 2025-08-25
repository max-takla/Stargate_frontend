import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/Start/HomePage";
import InfoPage from "../Pages/Club/Information/InfoPage";
import MainDashboard from "../Pages/Main/MainDashboard";
import ListVideo from "../Pages/Main/VideoMonitoring/ListVideo";
import ShowNews from "../Pages/Main/News/ShowNews";
import ShowUsers from "../Pages/Main/Users/ShowUsers";
import ShowUserProfile from "../Pages/Main/Users/Profile/ShowUserProfile";
import Requests from "../Pages/Main/RequestToJoin/Requests";
import ClubDashboard from "../Pages/Club/ClubDashboard";
import ShowSuggestionsVideos from "../Pages/Club/Suggestions videos/ShowSuggestionsVideos";
import PlayerInfo from "../Pages/Club/Player/PlayerInfo";
import ShowProducts from "../Pages/Club/Products/ShowProducts";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* main */}
        <Route path="main-dashboard" element={<MainDashboard/>}/>
        <Route path="video-monitoring" element={<ListVideo/>}/>
        <Route path="main-news" element={<ShowNews/>}/>
        <Route path="users" element={<ShowUsers/>}/>
        <Route path="user-profile/:id" element={<ShowUserProfile/>}/>
        <Route path="join-requests" element={<Requests/>}/>
        {/* club */}
        <Route path="club-information" element={<InfoPage/>}/>
        <Route path="club-dashboard" element={<ClubDashboard/>}/>
        <Route path="suggested-videos" element={<ShowSuggestionsVideos/>}/>
        <Route path="/suggested-videos/player-info/:id" element={<PlayerInfo/>}/>
        <Route path="product" element={<ShowProducts/>}/>
      </Routes>
    </BrowserRouter>
  );
}
