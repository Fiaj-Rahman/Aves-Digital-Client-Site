import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ErrorPage from "../Error/ErrorPage";
import HomePage from "../Home/HomePage";
import Login from "../Authentication/Login/Login";
import SignUp from "../Authentication/SignUp/SignUp";
import UserLayOut from "../UserDashboard/UserLayout/UserLayout";
import UserStatistic from "../UserDashboard/UserDashboardComponent/UserStatistic/UserStatistic"
import Add_Property from "../UserDashboard/UserDashboardComponent/Add-Property/Add_Property";
import PropertyDetails from "../Home/PropertyDetails";
import PrivateRoute from "../Authentication/PrivateRoute/PrivateRoute";


export const router = createBrowserRouter([
    {
        path:"/",
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children:[
            {
                path: "/",
                element: <HomePage></HomePage>,
            },
            {
                path: '/property/:id',
                element:<PrivateRoute><PropertyDetails></PropertyDetails></PrivateRoute>,
            },
            {
                path: "/login",
                element:<Login></Login>
            },
            {
                path:"/signUp",
                element:<SignUp></SignUp>
            }
        ]

    },



    // user dashboard 
    {
        path:'/dashboard',
        element:<PrivateRoute><UserLayOut></UserLayOut></PrivateRoute>,
        errorElement:<ErrorPage></ErrorPage>,
        children:[
            {
                path: "statistic",
                element: <UserStatistic></UserStatistic>
            },
            {
                path: "Add-Property",
                element:<Add_Property></Add_Property>
            }
            
           
        ]
    }
])