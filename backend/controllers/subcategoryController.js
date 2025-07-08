const Subcategory = require('../models/SubCategory');
const Category = require('../models/Category');

const createSubcategory = async (req, res) => {
  try {
    const { name, image, categoryName } = req.body;

    if (!name || !categoryName) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ error: 'Parent category does not exist' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const exists = await Subcategory.findOne({ slug });

    if (exists) {
      return res.status(400).json({ error: 'Subcategory already exists' });
    }

    const subcategory = new Subcategory({
      name,
      slug,
      image,
      category: category._id,
    });

    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
};

const getSubcategoriesByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subcategories = await Subcategory.find({ category: category._id });
    res.status(200).json(subcategories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};
const deleteSubcategory = async (req, res) => {
  try {
    const slug = req.params.slug;
    const deleted = await Subcategory.findOneAndDelete({ slug });

    if (!deleted) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
};

module.exports = {
  createSubcategory,
  getSubcategoriesByCategory,
  deleteSubcategory,
};
