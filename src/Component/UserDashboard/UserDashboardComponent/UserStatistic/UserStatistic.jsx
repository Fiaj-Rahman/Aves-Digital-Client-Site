import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Authentication/AuthProvider/AuthProvider";
import axios from "axios";
import { FaUsers, FaBuilding, FaCheckCircle, FaSignOutAlt,FaCalendarAlt, FaArrowUp, FaHandHoldingUsd } from "react-icons/fa"; // Importing icons from react-icons
import { Pie } from "react-chartjs-2";  // Importing Pie chart from Chart.js
import { Card,
    CardBody,
    CardFooter,
    Typography,
    Progress ,
    Button, } from "@material-tailwind/react"; // Importing Material Tailwind components
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registering chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TABLE_HEAD = ["Property Name", "Price", "Location", "Status"];

const UserStatistic = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProperties, setTotalProperties] = useState(0);
    const [totalCheckIns, setTotalCheckIns] = useState(0);
    const [totalCheckOuts, setTotalCheckOuts] = useState(0);
    const [newProperties, setNewProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                setLoading(true);
                try {
                    // Fetch user data
                    const { data } = await axios.get("https://avesdigital.vercel.app/signup");
                    const matchedUser = data.find((u) => u.email === user.email);
                    setUserData(matchedUser || {});

                    // Fetch stats
                    const totalUsersData = await axios.get("https://avesdigital.vercel.app/signup");
                    setTotalUsers(totalUsersData.data.length);

                    const propertyData = await axios.get("https://avesdigital.vercel.app/property");
                    setTotalProperties(propertyData.data.length);

                    const checkIns = propertyData.data.filter(prop => prop.checkIn).length;
                    const checkOuts = propertyData.data.filter(prop => prop.checkOut).length;

                    setTotalCheckIns(checkIns);
                    setTotalCheckOuts(checkOuts);

                    // Fetch latest properties
                    setNewProperties(propertyData.data.slice(-5)); // Get the last 5 properties
                } catch (error) {
                    setError("Failed to fetch data.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) return <div className="text-center py-8 text-lg text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-8 text-lg text-red-500">{error}</div>;

    // Pie chart data
    const pieChartData = {
        labels: ['Users', 'Properties'],
        datasets: [
            {
                data: [totalUsers, totalProperties],
                backgroundColor: ['#36A2EB', '#FF6384'], // Blue for Users, Red for Properties
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto rounded-lg p-6 space-y-6 pb-10">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
                    {/* User Avatar and Greeting */}
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full w-16 h-16 bg-blue-200 overflow-hidden">
                            <img src={userData?.image || "/path/to/default/avatar.png"} alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-gray-800">Hi, {userData?.fullName}</p>
                            <p className="text-gray-600 text-lg">Good Morning</p>
                            <p className="text-gray-500">Here's an overview of your properties</p>
                        </div>
                    </div>

                    {/* Analytics and Time Period Selector */}
                    <div className="ml-auto flex items-center space-x-4">
                        {/* Time Period Dropdown */}
                        <select 
                            className="bg-gray-200 text-gray-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="timePeriod"
                            id="timePeriod"
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="lastWeek">Last Week</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="lastYear">Last Year</option>
                        </select>

                        {/* Analytics Button */}
                        <button className="bg-blue-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-blue-700 transition duration-300">
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
                    {/* Total Users */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-blue-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-blue-500">
                            <FaUsers className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">{totalUsers}</p>
                            <p className="capitalize">Total Users</p>
                        </div>
                    </div>

                    {/* Total Properties */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-green-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-green-500">
                            <FaBuilding className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">{totalProperties}</p>
                            <p className="capitalize">Total Properties</p>
                        </div>
                    </div>

                    {/* Total Check-Ins */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-yellow-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-yellow-500">
                            <FaCheckCircle className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">{totalCheckIns}</p>
                            <p className="capitalize">Total Check-Ins</p>
                        </div>
                    </div>

                    {/* Total Check-Outs */}
                    <div className="flex p-4 space-x-4 rounded-lg bg-red-600 text-white">
                        <div className="flex justify-center p-2 align-middle rounded-lg bg-red-500">
                            <FaSignOutAlt className="h-9 w-9" />
                        </div>
                        <div className="flex flex-col justify-center align-middle">
                            <p className="text-3xl font-semibold leading-none">{totalCheckOuts}</p>
                            <p className="capitalize">Total Check-Outs</p>
                        </div>
                    </div>
                </div>

                {/* New Activities Section */}
                <div className="space-y-6">
                    {/* Latest Booking Properties Table */}
                    <div className="bg-gray-100 p-3 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold my-10 text-center">Latest Properties</h2>
                        <Card className="h-full w-full overflow-scroll">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {newProperties.map((property) => (
                                        <tr key={property._id} className="even:bg-blue-gray-50/50">
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {property.title}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    ${property.price}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {property.address}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography as="a" href="#" variant="small" color="blue-gray" className="font-bold">
                                                    {property.rentalStatus}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>

                    {/* Pie Chart for Users and Properties */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center my-10">User and Property Statistics</h2>
                        <div className="w-full h-64 ">
                            <Pie className="mx-auto" data={pieChartData} />
                        </div>
                    </div>
                </div>




                {/* Your Next Steps  */}
                <div className="flex flex-col sm:flex-row gap-6">
        {/* First Card */}
        <div className="w-full sm:w-96">
          <Card className="mt-6 w-full">
            <CardBody className="flex flex-col items-center">
              <FaCalendarAlt className="mb-4 h-12 w-12 text-gray-900" /> {/* Calendar Icon */}
              <Typography variant="h5" color="blue-gray" className="mb-2 text-center">
                Set up your calendar
              </Typography>
            </CardBody>
            <CardFooter className="pt-0 text-center">
              <a href="#" className="inline-block">
                <Button size="sm" variant="text" className="flex items-center justify-center gap-2">
                  {/* Progress Bar */}
                  <progress className="progress progress-primary w-56" value="60" max="100"></progress>
                  <span className="ml-2">4/6</span>
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>

        {/* Second Card */}
        <div className="w-full sm:w-96">
          <Card className="mt-6 w-full">
            <CardBody className="flex flex-col items-center">
              <FaArrowUp className="mb-4 h-12 w-12 text-gray-900" /> {/* Arrow Up Icon */}
              <Typography variant="h5" color="blue-gray" className="mb-2 text-center">
                Increase your bookings
              </Typography>
            </CardBody>
            <CardFooter className="pt-0 text-center">
              <a href="#" className="inline-block">
                <Button size="sm" variant="text" className="flex items-center justify-center gap-2">
                  {/* Progress Bar */}
                  <progress className="progress progress-success w-56" value="40" max="100"></progress>
                  <span className="ml-2">3/6</span>
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>



            </div>
        </div>
    );
};

export default UserStatistic;
