// ProfileSection.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    // Fetch admin profile data
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
        setFormData({ name: data.name, email: data.email, password: '' });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append('name', formData.name);
    updatedData.append('email', formData.email);
    if (formData.password) {
      updatedData.append('password', formData.password);
    }
    if (formData.profilePicture) {
      updatedData.append('profilePicture', formData.profilePicture);
    }

    try {
      // Update profile
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Fetch the updated profile
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-semibold">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-lg font-semibold">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleInputChange}
              className="w-full p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-primary px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="ml-4 px-4 py-2 rounded-md border"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <div className="mb-4">
            <img
              src={
                profile.profilePicture
                  ? `${process.env.REACT_APP_BACKEND_URL_STATIC}/UserFiles/${profile.profilePicture.replace(/\\/g, '/')}`
                  : '/default-profile.png'
              }
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4"
            />
            <p className="text-lg font-semibold">Name: {profile.name}</p>
            <p className="text-lg font-semibold">Email: {profile.email}</p>
          </div>
          <button
            className="bg-accent text-primary px-4 py-2 rounded-md"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
