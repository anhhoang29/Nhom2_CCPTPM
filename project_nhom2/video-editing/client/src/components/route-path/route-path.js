import React from "react";

import { Routes, Route } from "react-router-dom";

import ActionsManagement from "../new-action-labeling/actions-management/actions-management";
import ActionsLabeling from "../new-action-labeling/actions-labeling/actions-labeling";
import ModelManagement from "../model-management/model-management";
import ModelConfiguration from "../model-management/model-configuration/model-configuration";
import VideoManagement from "../video-analytics/videos-management/videos-management";
import Tournament from "../tournament/tournament";
import VideoInput from "../VideoInput/video-input";
import HighlightReview from "../highlight-review";
import Film from "../Film";
import HighlightFilter from "../HiglightFilter/highlight-filter";
import Gallery from "../Gallery";
import User from "../user/user";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";

const isAdmin = localStorage.getItem("isAdmin");

function RoutePath() {

  return isAdmin === true ? (
    <Routes>
      <Route path="/admin">
        <Route path="user" element={<User />} />
      </Route>
    </Routes>
  ) : (
    <Routes>
      <Route path="/">
        <Route path="/" element={<Tournament />} />
        <Route path="/actions-labeling" element={<ActionsLabeling />} />
        <Route path="/model" element={<ModelManagement />} />
        <Route path="/model/configuration" element={<ModelConfiguration />} />
        <Route path="/video" element={<VideoManagement />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/film" element={<Film />} />
        <Route path="/video-edit" element={<VideoInput />} />
        <Route path="/highlight-review" element={<HighlightReview />} />
        <Route path="/highlight" element={<HighlightFilter />} />
        <Route path="/gallery" element={<Gallery />} />
      </Route>
    </Routes>
  );
}

export default RoutePath;

// import React from "react";

// const RoutePath = () => (

// );

// export default RoutePath;
