import React from "react";
import HomeBanner from "./HomeBanner";
import Property_Filtering from "./Property_Filtering";

const HomePage = () => {
   return(
    <div>
        <HomeBanner></HomeBanner>
        <Property_Filtering></Property_Filtering>
    </div>
   )
}

export default HomePage;