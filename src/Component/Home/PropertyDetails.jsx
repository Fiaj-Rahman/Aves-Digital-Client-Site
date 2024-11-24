import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PropertyDetail = () => {
    const { id } = useParams(); // Get the property ID from the URL
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPropertyDetail = async () => {
            try {
                const { data } = await axios.get(`https://avesdigital.vercel.app/property/${id}`);
                setProperty(data);
            } catch (error) {
                setError("Failed to fetch property details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetail();
    }, [id]);

    if (loading) return <div className="text-center py-8 text-lg text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-8 text-lg text-red-500">{error}</div>;

    return (
        <section className="p-8 bg-gray-50 text-gray-900">
            <div className="container mx-auto space-y-8 max-w-6xl">
                <h1 className="text-3xl font-semibold text-blue-600 text-center my-5">{property.title}</h1>
                <div className="flex flex-col lg:flex-row space-y-6 lg:space-x-8 lg:space-y-0">
                    <div className="w-full lg:w-1/2 ">
                        <img src={property.images[0]} alt="Property" className="w-full h-80 object-cover" />
                    </div>
                    <div className="w-full lg:w-1/2 bg-white p-6 shadow-lg rounded-lg space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">{property.propertyType}</h2>
                        <p className="text-gray-600">{property.description}</p>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Price:</strong> <span className="text-green-600">{property.price}</span></p>
                            <p><strong>Address:</strong> {property.address}</p>
                            <p><strong>Rental Status:</strong> {property.rentalStatus}</p>
                            <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                            <p><strong>Size:</strong> {property.size} sq.m</p>
                            <p><strong>Furnishing Status:</strong> {property.furnishingStatus}</p>
                            <p><strong>Phone:</strong> {property.phone}</p>
                            <p><strong>Date Listed:</strong> {property.dateListed}</p>
                            <p><strong>Available From:</strong> {property.availableFrom}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 shadow-lg rounded-lg space-y-4">
                    <h3 className="text-2xl font-medium text-gray-800">Features</h3>
                    <ul className="space-y-2 text-gray-600">
                        {property.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <span className="text-green-500">✔</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default PropertyDetail;
