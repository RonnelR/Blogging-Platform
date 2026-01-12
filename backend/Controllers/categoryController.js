import categoryModel from "../Models/categoryModel.js";
import slugify from 'slugify';
import mongoose from "mongoose";

// ✅ Get all categories
export const getCategoryController = async (req, res) => {
  try {
    const allCategories = await categoryModel.find({});
    res.status(200).json({
      success: true,
      message: "Category list fetched successfully",
      categories: allCategories, // 👈 return as `categories` for frontend
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// ✅ Create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
 
    // Check if category already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create new category with slug
    const newCategory = new categoryModel({ 
      name, 
      slug: slugify(name, { lower: true, strict: true }) 
    });

    await newCategory.save();

    res.status(200).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating category",
      error: error.message,
    });
  }
};


  // ✅ Delete category
  export const deleteCategoryController = async (req, res) => {
  try {

  const deletedCategory = await categoryModel.findByIdAndDelete(req.params.cId);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while deleting category",
      error: error.message,
    });
  }
};