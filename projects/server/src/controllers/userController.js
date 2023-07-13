// const db = require("../models");
// const {
//   setFromFileNameToDBValueProduct,
//   getAbsolutePathPublicFileProduct,
//   getFileNameFromDbValue,
//   getAbsolutePathPublicFileProfile,
//   setFromFileNameToDBValueProfile,
// } = require("../helper");
// const fs = require("fs");

// module.exports = {
//   async getAllUserProduct(req, res) {
//     const pagination = {
//       page: Number(req.query.page) || 1,
//       perPage: 9,
//       search: req.query.search || undefined,
//       category: req.query.category || undefined,
//       sortAlphabet: req.query.sortAlphabet,
//       sortPrice: req.query.sortPrice,
//     };

//     try {
//       const where = {};
//       const order = [];

//       if (req.user.id) {
//         where.seller_id = req.user.id;
//       }

//       if (pagination.search) {
//         where.name = {
//           [db.Sequelize.Op.like]: `%${pagination.search}%`,
//         };
//       }

//       if (pagination.category) {
//         where.category_id = pagination.category;
//       }
//       if (pagination.sortAlphabet) {
//         if (pagination.sortAlphabet.toUpperCase() === "DESC") {
//           order.push(["name", "DESC"]);
//         } else {
//           order.push(["name", "ASC"]);
//         }
//       }

//       if (pagination.sortPrice) {
//         if (pagination.sortPrice.toUpperCase() === "DESC") {
//           order.push(["price", "DESC"]);
//         } else {
//           order.push(["price", "ASC"]);
//         }
//       }

//       const results = await db.Product.findAndCountAll({
//         where,
//         include: [
//           {
//             model: db.Category,
//           },
//         ],
//         limit: pagination.perPage,
//         offset: (pagination.page - 1) * pagination.perPage,
//         order,
//       });

//       const totalCount = results.count;
//       pagination.totalData = totalCount;

//       if (results.rows.length === 0) {
//         return res.status(200).send({
//           message: "No products found",
//         });
//       }

//       res.send({
//         message: "Successfully retrieved products",
//         pagination,
//         data: results.rows.map((product) => {
//           return {
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             description: product.description,
//             imgProduct: product.imgProduct,
//             stock: product.stock,
//             isActive: product.isActive,
//             createdAt: product.createdAt,
//             updatedAt: product.updatedAt,
//             category: {
//               id: product.Category.id,
//               name: product.Category.name,
//             },
//           };
//         }),
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         message: "Internal Server Error",
//         error: error.message,
//       });
//     }
//   },

//   async updateProduct(req, res) {
//     try {
//       const { name, price, category_id, description, stock } = req.body;

//       const updatedProduct = await db.Product.findOne({
//         where: {
//           id: parseInt(req.params.id),
//           seller_id: req.user.id,
//         },
//       });

//       if (!updatedProduct) {
//         return res.status(400).send({
//           message: "Product not found",
//         });
//       }

//       if (req.file) {
//         const realimgProduct = updatedProduct.getDataValue("imgProduct");
//         const oldFilename = getFileNameFromDbValue(realimgProduct);
//         if (oldFilename) {
//           fs.unlinkSync(getAbsolutePathPublicFileProduct(oldFilename));
//         }
//         updatedProduct.imgProduct = setFromFileNameToDBValueProduct(
//           req.file.filename
//         );
//       }

//       if (category_id !== undefined && category_id !== "") {
//         updatedProduct.category_id = parseInt(category_id);
//       }

//       if (name) {
//         updatedProduct.name = name;
//       }
//       if (price) {
//         updatedProduct.price = parseInt(price);
//       }
//       if (description) {
//         updatedProduct.description = description;
//       }
//       if (stock) {
//         updatedProduct.stock = parseInt(stock);
//       }

//       await updatedProduct.save();
//       return res.status(200).send(updatedProduct);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({
//         message: "Internal Server Error",
//       });
//     }
//   },

//   async getUserCategory(req, res) {
//     const user_id = req.user.id;
//     try {
//       const category = await db.Category.findAll({
//         where: {
//           user_id,
//         },
//         attributes: ["id", "name"],
//       });

//       return res
//         .status(200)
//         .send({ message: "Successfully get user categories", data: category });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({
//         message: "Internal Server Error",
//       });
//     }
//   },

//   async getUserDefaultCategory(req, res) {
//     const user_id = req.user.id;
//     try {
//       const category = await db.Category.findAll({
//         where: {
//           [db.Sequelize.Op.or]: [
//             { user_id: user_id },
//             { user_id: null },
//           ],
//         },
//         attributes: ["id", "name"],
//       });

//       return res
//         .status(200)
//         .send({ message: "Successfully get user categories", data: category });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({
//         message: "Internal Server Error",
//       });
//     }
//   },

//   async updateCategory(req, res) {
//     const user_id = req.user.id;
//     try {
//       const { name } = req.body;

//       const getCategory = await db.Category.findOne({
//         where: {
//           id: req.params.id,
//           user_id,
//         },
//       });

//       if (!getCategory) {
//         return res.status(404).send({ message: "Category not found" });
//       }

//       if (name) {
//         getCategory.name = name;
//       }

//       await getCategory.save();
//       return res.status(201).send({
//         message: "Successfully updated the category",
//         data: getCategory,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({
//         message: "Internal Server Error",
//       });
//     }
//   },

//   async userIncome(req, res) {
//     try {
//       const startDate = new Date(req.body.start);
//       const endDate = new Date(req.body.end);

//       if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         return res.status(400).json({
//           message: "Invalid start or end date provided",
//         });
//       }

//       const maxDateRange = 7;
//       const dateDifference = Math.floor(
//         (endDate - startDate) / (1000 * 60 * 60 * 24)
//       );

//       if (dateDifference > maxDateRange) {
//         return res.status(400).json({
//           message: "The date range cannot exceed 7 days.",
//         });
//       }

//       endDate.setDate(endDate.getDate() + 1);

//       const products = await db.Product.findAll({
//         where: { seller_id: req.user.id },
//         attributes: ["id", "price"],
//       });

//       const productIds = products.map((product) => product.id);
//       let totalIncome = 0;
//       let dailyIncome = {};

//       for (let i = 0; i < productIds.length; i++) {
//         const productId = productIds[i];
//         const productPrice = products[i].price;

//         const orderItems = await db.Order_item.findAll({
//           where: {
//             product_id: productId,
//             createdAt: {
//               [db.Sequelize.Op.between]: [startDate, endDate],
//             },
//           },
//           attributes: [
//             [db.Sequelize.fn("date", db.Sequelize.col("createdAt")), "date"],
//             [db.Sequelize.fn("sum", db.Sequelize.col("quantity")), "totalQuantity"],
//           ],
//           group: [db.Sequelize.fn("date", db.Sequelize.col("createdAt"))],
//         });

//         for (let item of orderItems) {
//           const date = item.getDataValue("date");
//           const count = item.getDataValue("totalQuantity");

//           if (!dailyIncome[date]) {
//             dailyIncome[date] = 0;
//           }

//           const income = productPrice * count;
//           dailyIncome[date] += income;
//           totalIncome += income;
//         }
//       }

//       res.status(200).json({
//         message: "Total and daily incomes calculated successfully",
//         totalIncome: totalIncome,
//         dailyIncome: dailyIncome,
//       });
//     } catch (error) {
//       console.error("Failed to calculate total and daily incomes:", error);
//       res.status(500).json({
//         message: "Failed to calculate total and daily incomes",
//         error: error.message,
//       });
//     }
//   },

//   async userPurchase(req, res) {
//     try {
//       const buyer_id = req.user.id;
//       const { startDate, endDate } = req.body;

//       const order_details = await db.Order_detail.findAll({
//         where: {
//           buyer_id,
//           createdAt: {
//             [db.Sequelize.Op.between]: [
//               new Date(startDate + "T00:00:00.000Z"),
//               new Date(endDate + "T23:59:59.999Z"),
//             ],
//           },
//         },
//       });

//       if (!order_details || order_details.length === 0) {
//         return res.status(404).json({ message: "Order detail not found" });
//       }

//       let purchases = [];

//       for (let order_detail of order_details) {
//         const order_items = await db.Order_item.findAll({
//           where: { orderDetail_id: order_detail.id },
//           include: [
//             {
//               model: db.Product,
//               as: "product",
//               attributes: ["id", "name", "price", "description", "imgProduct"],
//               include: [
//                 {
//                   model: db.Category,
//                   attributes: ["name"],
//                 },
//               ],
//             },
//           ],
//         });

//         if (!order_items || order_items.length === 0) {
//           return res.status(404).json({ message: "Order items not found" });
//         }

//         let order = {
//           orderDetail: order_detail,
//           items: [],
//         };

//         for (let order_item of order_items) {
//           order.items.push({
//             product: {
//               id: order_item.product.id,
//               name: order_item.product.name,
//               price: order_item.product.price,
//               description: order_item.product.description,
//               imgProduct: order_item.product.imgProduct,
//               category: order_item.product.Category.name,
//             },
//             quantity: order_item.quantity,
//           });
//         }

//         purchases.push(order);
//       }

//       res.status(200).json({
//         message: "Purchase history retrieved successfully",
//         purchases: purchases,
//       });
//     } catch (error) {
//       console.error("Failed to get user purchases:", error);
//       res.status(500).json({
//         message: "Failed to get user purchases",
//         error: error.message,
//       });
//     }
//   },

//   async userTransaction(req, res) {
//     const { startDate, endDate } = req.body;
//     try {
//       const orderItem = await db.Order_item.findAll({
//         where: {
//           createdAt: {
//             [db.Sequelize.Op.between]: [
//               new Date(startDate + "T00:00:00.000Z"),
//               new Date(endDate + "T23:59:59.999Z"),
//             ],
//           },
//         },
//         include: {
//           model: db.Product,
//           as: "product",
//           where: {
//             seller_id: req.user.id,
//           },
//         },
//       });

//       const groupedOrderItems = {};
//       orderItem.forEach((orderItem) => {
//         const orderDetailId = orderItem.orderDetail_id;
//         if (!(orderDetailId in groupedOrderItems)) {
//           groupedOrderItems[orderDetailId] = {
//             orderDetail_id: orderDetailId,
//             product: [],
//           };
//         }
//         groupedOrderItems[orderDetailId].product.push(orderItem);
//       });

//       const groupedOrderItemsArray = Object.values(groupedOrderItems);

//       res.status(200).send(groupedOrderItemsArray);
//     } catch (error) {
//       console.error("Failed to get user purchases:", error);
//       res.status(500).json({
//         message: "Failed to get user purchases",
//         error: error.message,
//       });
//     }
//   },

//   async getUserProfile(req, res) {
//     try {
//       const userProfile = await db.User.findOne({
//         where: {
//           id: req.user.id,
//         },
//         attributes: { exclude: ["password"] },
//       });

//       if (!userProfile) {
//         return res.status(400).send({
//           message: "User profile not found",
//         });
//       }

//       return res.status(200).send({
//         message: "Successfully retrieved user profile",
//         data: userProfile,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({
//         message: "Internal Server Error",
//       });
//     }
//   },

//   async updateImageProfile(req, res) {
//     try {
//       const userProfile = await db.User.findOne({
//         where: {
//           id: req.user.id,
//         },
//         attributes: { exclude: ["password"] },
//       });

//       if (!userProfile) {
//         return res.status(400).send({
//           message: "User not Found",
//         });
//       }

//       if (req.file) {
//         const realimgProduct = userProfile.getDataValue("imgProfile"); //   /public/IMG-16871930921482142001.jpeg
//         console.log(realimgProduct);
//         const oldFilename = getFileNameFromDbValue(realimgProduct); //   IMG-16871930921482142001.jpeg
//         console.log(oldFilename);
//         if (oldFilename) {
//           fs.unlinkSync(getAbsolutePathPublicFileProfile(oldFilename));
//         }
//         userProfile.imgProfile = setFromFileNameToDBValueProfile(
//           req.file.filename
//         );
//       }

//       await userProfile.save();
//       return res
//         .status(200)
//         .send({ message: "Successfully changed image profile" });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({
//         message: "Internal Server Error",
//       });
//     }
//   },

//   async getTopSellingProducts(req, res) {
//     try {
//       const categoryId = req.body.categoryId;
//       const sellerId = req.user.id;

//       let productInclude = {
//         model: db.Product,
//         as: "product",
//         where: { seller_id: sellerId },
//         include: {
//           model: db.Category,
//           where: categoryId ? { id: categoryId } : {},
//           attributes: ["name"],
//         },
//       };

//       const topSellingProducts = await db.Order_item.findAll({
//         include: [productInclude],
//         group: ["product_id"],
//         attributes: [
//           "product_id",
//           [
//             db.sequelize.fn("SUM", db.sequelize.col("quantity")),
//             "total_quantity",
//           ],
//         ],
//         order: [[db.sequelize.fn("SUM", db.sequelize.col("quantity")), "DESC"]],
//         limit: 6, 
//       });

//       if (topSellingProducts.length === 0) {
//         return res.status(400).send({
//           message: "No products found",
//         });
//       }

//       return res.status(200).send({
//         message: "Successfully retrieved top-selling products",
//         data: topSellingProducts,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({
//         message: "Internal Server Error",
//       });
//     }
//   },
// };
