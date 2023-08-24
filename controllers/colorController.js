const colorModel = require("../models/colorModel");
const Color = require("../models/colorModel")


const createColor = async (req, res) => {
    try {
      const newColor = await colorModel.create(req.body);
      res.json(newColor);
    } catch (error) {
      res.json(error.message)
    }
  };


  const updateColor = async (req, res) => {
    const { id } = req.params;
    //validateMongoDbId(id);
    try {
      const updatedColor = await colorModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedColor);
    } catch (error) {
        res.json(error.message)
    }
  };
  

  
const deleteColor = async (req, res) => {
    const { id } = req.params;
    //validateMongoDbId(id);
    try {
      const deletedColor = await colorModel.findByIdAndDelete(id);
      res.json(deletedColor);
    } catch (error) {
      res.json(error.message)
    }
  };

  const getColor = async (req, res) => {
    const { id } = req.params;
    //validateMongoDbId(id);
    try {
      const getaColor = await colorModel.findById(id);
      res.json(getaColor);
    } catch (error) {
        res.json(error.message)
    }
  };

  const getallColor = async (req, res) => {
    try {
      const getallColor = await colorModel.find();
      res.json(getallColor);
    } catch (error) {
        res.json(error.message)
    }
  };

  module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getallColor,
  };
