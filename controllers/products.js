const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  /* const search = "a";
  //   throw new Error("testing package");
  const products = await Product.find({
    // featured: true,
    name: { $regex: search, $options: "i" },
  }).exec(); */

  // const products = await Product.find({}).sort("name price");
  /* const products = await Product.find({})
    .sort("name")
    .select("name price")
    .limit(10)
    .skip(2); */
  const products = await Product.find({
    price: { $gt: 30 },
  })
    .sort("price")
    .select("name price");
  res.status(200).json({ msg: products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numaricFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numaricFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(>|>=|=|<=|<)\b/g;
    let filters = numaricFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    // console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    // console.log(queryObject);
  }

  // console.log(queryObject);
  // let products = await Product.find(queryObject);
  let result = Product.find(queryObject);
  if (sort) {
    // console.log(sort);
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  // 23 items
  // 4 pages , then it will be divided as 7 7 7 2

  const products = await result;
  //   console.log(req.query);
  res.status(200).json({ msg: products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
