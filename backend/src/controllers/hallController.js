// src/controllers/hallController.js  
import Hall from '../models/Hall.js';  
import asyncHandler from 'express-async-handler';  

// @desc Create a new hall  
// @route POST /api/halls  
// @access Private/Admin  
export const createHall = asyncHandler(async (req, res) => {  
  const { name, capacity, is3D, type, Seatlayout} = req.body;  

  const hallExists = await Hall.findOne({ name });  
  if (hallExists) {  
    res.status(400);  
    throw new Error('Hall with this name already exists');  
  }  

  const hall = new Hall({  
    name,  
    capacity,  
    is3D,  
    type,
    Seatlayout,  
  });  

  const createdHall = await hall.save();  
  res.status(201).json(createdHall);  
});  

// @desc Get all halls  
// @route GET /api/halls  
// @access Public  
export const getAllHalls = asyncHandler(async (req, res) => {  
  const halls = await Hall.find({});  
  res.json(halls);  
});  

// @desc Get hall by ID  
// @route GET /api/halls/:id  
// @access Public  
export const getHallById = asyncHandler(async (req, res) => {  
  const hall = await Hall.findById(req.params.id);  
  if (!hall) {  
    res.status(404);  
    throw new Error('Hall not found');  
  }  
  res.json(hall);  
});  

// @desc Update a hall  
// @route PUT /api/halls/:id  
// @access Private/Admin  
export const updateHall = asyncHandler(async (req, res) => {  
  const { name, capacity, is3D, type, Seatlayout } = req.body;  

  const hall = await Hall.findById(req.params.id);  
  if (!hall) {  
    res.status(404);  
    throw new Error('Hall not found');  
  }  

  hall.name = name || hall.name;  
  hall.capacity = capacity || hall.capacity;  
  hall.is3D = is3D !== undefined ? is3D : hall.is3D;  
  hall.type = type || hall.type;
  hall.Seatlayout = Seatlayout || hall.Seatlayout;

  const updatedHall = await hall.save();  
  res.json(updatedHall);  
});  

// @desc Delete a hall  
// @route DELETE /api/halls/:id  
// @access Private/Admin  
export const deleteHall = asyncHandler(async (req, res) => {  
    
  try {
    const hall = await Hall.findByIdAndDelete(req.params.id);  
    if (!hall) {  
      res.status(404);  
      throw new Error('Hall not found');  
    }  
    res.json({ message: 'Hall removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }  
});  

// @desc Get all available halls  
// @route GET /api/halls/available  
// @access Public  
export const getAvailableHalls = asyncHandler(async (req, res) => {  
  const availableHalls = await Hall.find({ isAvailable: true });  
  if (!availableHalls.length) {  
    res.status(404);  
    throw new Error('No available halls found');  
  }  
  res.json(availableHalls);  
});  
