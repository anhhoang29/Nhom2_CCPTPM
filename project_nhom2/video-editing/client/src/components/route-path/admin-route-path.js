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

function AdminRoutePath() {
  return (
    <Routes>
      <Route path="/" element={<User />} >
        <Route path="/user" element={<User />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutePath;

// import React from "react";

// const RoutePath = () => (

// );

// export default RoutePath;
