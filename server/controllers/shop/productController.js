const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "Price: Low to High" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "Price: Low to High":
        sort.price = 1;

        break;
      case "Price: High to Low":
        sort.price = -1;

        break;
      case "Title: A to Z":
        sort.title = 1;

        break;

      case "Title: Z to A":
        sort.title = -1;

        break;

      default:
        sort.price = 1; 
        break; 
    }

   const products = await Product.aggregate([
  { $match: filters },
  {
    $addFields: {
      effectivePrice: {
        $cond: [
          { $gt: ["$salePrice", 0] }, 
          "$salePrice",              
          "$price"                  
        ]
      }
    }
  },
  {
    $sort: sortBy === "Price: Low to High"
      ? { effectivePrice: 1 }
      : sortBy === "Price: High to Low"
      ? { effectivePrice: -1 }
      : sortBy === "Title: A to Z"
      ? { title: 1 }
      : sortBy === "Title: Z to A"
      ? { title: -1 }
      : { effectivePrice: 1 } // default
  }
]);


    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,  
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };