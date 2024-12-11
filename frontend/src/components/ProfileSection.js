// ProfileSection.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';

const ProfileSection = ({ token }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePicture: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePicture: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
        setFormData({ name: data.name, email: data.email, password: '' });
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };
    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const updateProfileDetails = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/profile`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
    } catch (err) {
      setError('Failed to update profile details');
      setLoading(false);
    }
  };

  const updateProfilePicture = async () => {
    try {
      const uploadData = new FormData();
      uploadData.append('profilePicture', formData.profilePicture);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/profile-picture`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      setError('Failed to upload profile picture');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.name || formData.email || formData.password) {
      await updateProfileDetails();
    }
    if (formData.profilePicture) {
      await updateProfilePicture();
    }
    setIsEditing(false);

    // Refresh profile data
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data);
    } catch {
      setError('Failed to refresh profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-secondary rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-primary mb-6">Admin Profile</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="name" className="block text-lg font-semibold text-primary">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
            />
          </div>
          <div className="relative">
            <label htmlFor="email" className="block text-lg font-semibold text-primary">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-semibold text-primary">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="relative">
            <label htmlFor="profilePicture" className="block text-lg font-semibold text-primary mb-2">
              Profile Picture
            </label>
            <div
              className="relative border-2 border-dashed border-accent bg-secondary-light rounded-lg p-4 flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById('profilePicture').click()}
            >
              {formData.profilePicture ? (
                <img
                  src={URL.createObjectURL(formData.profilePicture)}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-center text-primary font-medium ">
                  Click to upload Profile Picture <FaCamera />
                </span>
              )}
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="flex items-center bg-accent hover:bg-highlight text-white px-5 py-3 rounded-lg transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? <PropagateLoader
                            color="#d97706"
                            size={20}
                            speedMultiplier={1}
                          /> : <FaSave className="mr-2" />} Save Changes
            </button>
            <button
              type="button"
              className="flex items-center text-primary px-5 py-3 bg-opacity-50 bg-background shadow-inner shadow-stone-950 hover:bg-red-700 rounded-lg transition-transform transform hover:scale-105"
              onClick={() => setIsEditing(false)}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <img
            src={
              profile.profilePicture
                ? `${process.env.REACT_APP_BACKEND_URL_STATIC}/UserFiles/${profile.profilePicture.replace(/\\/g, '/')}`
                : '/default-profile.png'
            }
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-accent shadow-md transition-transform transform hover:scale-110"
          />
          <p className="text-lg font-semibold text-primary">Name: {profile.name}</p>
          <p className="text-lg font-semibold text-primary">Email: {profile.email}</p>
          <button
            className="mt-4 flex items-center bg-accent text-white px-5 py-3 rounded-lg transition-transform transform hover:scale-105"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
