import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Authentication/AuthProvider/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Add_Property = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize useNavigate

    const [formData, setFormData] = useState({
        title: "",
        propertyType: "",
        address: "",
        description: "",
        price: "",
        rentalStatus: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        furnishingStatus: "",
        features: [],
        phone: "",
        dateListed: "",
        availableFrom: "",
        leaseTerms: "",
        images: [],
    });

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                setLoading(true);
                try {
                    const { data } = await axios.get("https://avesdigital.vercel.app/signup");
                    const matchedUser = data.find((u) => u.email === user.email);
                    setUserData(matchedUser || {});
                } catch (error) {
                    setError("Failed to fetch user data.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserData();
    }, [user]);



      // Update image preview on image selection
      const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setImagePreview(previewUrls);
        setFormData((prev) => ({
            ...prev,
            images: files,
        }));
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle checkbox for multi-select features
    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => {
            const updatedFeatures = checked
                ? [...prev[name], value]
                : prev[name].filter((feature) => feature !== value);
            return { ...prev, [name]: updatedFeatures };
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.title || !formData.price || !formData.propertyType) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            // Upload images to ImgBB
            const imageUrls = await Promise.all(
                formData.images.map(async (image) => {
                    const formData = new FormData();
                    formData.append("image", image);
                    const { data } = await axios.post(
                        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`,
                        formData
                    );
                    return data.data.display_url;
                })
            );

            // Submit property data
            const propertyData = {
                ...formData,
                images: imageUrls,
                userEmail: user?.email,
                userImage: userData?.image || "",
            };

            await axios.post("https://avesdigital.vercel.app/property", propertyData, {
                withCredentials: true,
            });

            
            setFormData({
                title: "",
                propertyType: "",
                address: "",
                description: "",
                price: "",
                rentalStatus: "",
                bedrooms: "",
                bathrooms: "",
                size: "",
                furnishingStatus: "",
                features: [],
                phone: "",
                dateListed: "",
                availableFrom: "",
                leaseTerms: "",
                images: [],
            });
            setImagePreview(null);
            navigate("/"); // Navigate to home page
            toast.success("Property added successfully!"); // Show success toast
        } catch (error) {
            toast.error("Failed to add property."); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="p-8 bg-gray-100 text-gray-800">
            <form onSubmit={handleSubmit} className="container mx-auto space-y-8 max-w-4xl">
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-lg">
                    <div>
                        <label htmlFor="propertyType" className="font-medium text-gray-700">Property Type</label>
                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        >
                            <option value="" disabled>Select Property Type</option>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Land">Land</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="title" className="font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter property title"
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                        <input
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter property address"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter property description"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="text-sm font-medium text-gray-700">Price</label>
                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter property price"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Rental Status */}
                    <div>
                        <label htmlFor="rentalStatus" className="text-sm font-medium text-gray-700">Rental Status</label>
                        <select
                            name="rentalStatus"
                            value={formData.rentalStatus}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="" disabled>Select Rental Status</option>
                            <option value="Available">Available</option>
                            <option value="Rented">Rented</option>
                        </select>
                    </div>
                    {/* Number of Bedrooms */}
                    <div>
                        <label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">Number of Bedrooms</label>
                        <input
                            name="bedrooms"
                            type="number"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            placeholder="Enter number of bedrooms"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Number of Bathrooms */}
                    <div>
                        <label htmlFor="bathrooms" className="text-sm font-medium text-gray-700">Number of Bathrooms</label>
                        <input
                            name="bathrooms"
                            type="number"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            placeholder="Enter number of bathrooms"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Size */}
                    <div>
                        <label htmlFor="size" className="text-sm font-medium text-gray-700">Size (in sq.m)</label>
                        <input
                            name="size"
                            type="number"
                            value={formData.size}
                            onChange={handleChange}
                            placeholder="Enter property size"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Furnishing Status */}
                    <div>
                        <label htmlFor="furnishingStatus" className="text-sm font-medium text-gray-700">Furnishing Status</label>
                        <select
                            name="furnishingStatus"
                            value={formData.furnishingStatus}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="" disabled>Select Furnishing Status</option>
                            <option value="Furnished">Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Semi-furnished">Semi-furnished</option>
                        </select>
                    </div>

                    {/* Features */}
                    <div>
                        <label htmlFor="features" className="text-sm font-medium text-gray-700">Features</label>
                        <div className="flex space-x-4">
                            <div>
                                <input
                                    type="checkbox"
                                    value="Swimming Pool"
                                    checked={formData.features.includes("Swimming Pool")}
                                    onChange={handleCheckboxChange}
                                    name="features"
                                />
                                <label className="text-sm font-medium text-gray-700">Swimming Pool</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    value="Garden"
                                    checked={formData.features.includes("Garden")}
                                    onChange={handleCheckboxChange}
                                    name="features"
                                />
                                <label className="text-sm font-medium text-gray-700">Garden</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    value="Parking"
                                    checked={formData.features.includes("Parking")}
                                    onChange={handleCheckboxChange}
                                    name="features"
                                />
                                <label className="text-sm font-medium text-gray-700">Parking</label>
                            </div>
                        </div>
                    </div>



                    {/* Property Images */}
                    <div>
                        <label htmlFor="images" className="text-sm font-medium text-gray-700">Property Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    images: [...formData.images, ...e.target.files],
                                });
                            }}
                            multiple
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>


                    {/* Contact */}
                    <div>
                        <label htmlFor="leaseTerms" className="text-sm font-medium text-gray-700">Phone Number)</label>
                        <textarea
                            name="phone"
                            type="number"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Date Listed */}
                    <div>
                        <label htmlFor="dateListed" className="text-sm font-medium text-gray-700">Date Listed</label>
                        <input
                            type="date"
                            name="dateListed"
                            value={formData.dateListed}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Available From */}
                    <div>
                        <label htmlFor="availableFrom" className="text-sm font-medium text-gray-700">Available From</label>
                        <input
                            type="date"
                            name="availableFrom"
                            value={formData.availableFrom}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>


                    {/* Lease Terms */}
                    <div>
                        <label htmlFor="leaseTerms" className="text-sm font-medium text-gray-700">Lease Terms (Optional)</label>
                        <textarea
                            name="leaseTerms"
                            value={formData.leaseTerms}
                            onChange={handleChange}
                            placeholder="Enter lease terms"
                            className="w-full mt-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                </fieldset>

                {imagePreview && (
                    <div className="flex flex-wrap gap-4">
                        {imagePreview.map((src, idx) => (
                            <img key={idx} src={src} alt="Preview" className="w-20 h-20 object-cover" />
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-500 rounded-lg"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Add Property"}
                </button>
            </form>
        </section>
    );
};

export default Add_Property;
