import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import { Link } from "react-router-dom";

const PropertyFiltering = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6); // Properties per page

  useEffect(() => {
    // Fetch all properties
    axios
      .get("https://avesdigital.vercel.app/property")
      .then((response) => {
        setProperties(response.data);
        setFilteredProperties(response.data); // Set all properties for the "All" tab initially
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

  useEffect(() => {
    // Filter properties based on the active tab
    if (activeTab === "All") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(
        (property) => property.propertyType === activeTab
      );
      setFilteredProperties(filtered);
    }
  }, [activeTab, properties]);

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  // Extract unique property types for tabs
  const propertyTypes = ["All", ...new Set(properties.map((prop) => prop.propertyType))];

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="p-6">
      <h1 className="text-3xl text-blue-900 my-5 font-bold mb-6 text-center">PROPERTY</h1>
      <Tabs value={activeTab}>
        {/* Tabs Header */}
        <TabsHeader>
          {propertyTypes.map((type) => (
            <Tab key={type} value={type} onClick={() => setActiveTab(type)}>
              {type}
            </Tab>
          ))}
        </TabsHeader>
        {/* Tabs Body */}
        <TabsBody>
          {propertyTypes.map((type) => (
            <TabPanel key={type} value={type}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProperties.length > 0 ? (
                  currentProperties.map((property) => (
                    <Card key={property._id} className="w-full mt-10">
                      <CardHeader color="blue-gray" className="relative h-56">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </CardHeader>
                      <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                          {property.title}
                        </Typography>
                        <Typography>{property.description.slice(0, 100)}...</Typography>
                      </CardBody>
                      <CardFooter className="pt-0 flex justify-between items-center">
                        <Typography className="font-bold">${property.price}</Typography>
                        <Link to={`/property/${property._id}`} className="text-blue-500">Read more</Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Typography>No properties available in this category.</Typography>
                )}
              </div>
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
      
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded"
        >
          Prev
        </button>
        <div className="flex items-center">
          <Typography className="px-2">{`Page ${currentPage} of ${totalPages}`}</Typography>
        </div>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertyFiltering;
