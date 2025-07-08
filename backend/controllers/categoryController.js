const Category = require('../models/Category');

// 🟩 Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// 🟩 Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const exists = await Category.findOne({ slug });

    if (exists) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({ name, slug, image });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// 🟩 Get single category by slug
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const deleted = await Category.findOneAndDelete({ slug });

    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
module.exports = {
  getAllCategories,
  createCategory,
  getCategoryBySlug,
  deleteCategory,
};
