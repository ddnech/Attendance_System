const db = require("../models");


module.exports = {
  async clockIn(req, res) {
    try{

    
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async clockOut(req, res) {
    try {
      const { name, price, category_id, description, stock } = req.body;

      const updatedProduct = await db.Product.findOne({
        where: {
          id: parseInt(req.params.id),
          seller_id: req.user.id,
        },
      });

      if (!updatedProduct) {
        return res.status(400).send({
          message: "Product not found",
        });
      }

      if (req.file) {
        const realimgProduct = updatedProduct.getDataValue("imgProduct");
        const oldFilename = getFileNameFromDbValue(realimgProduct);
        if (oldFilename) {
          fs.unlinkSync(getAbsolutePathPublicFileProduct(oldFilename));
        }
        updatedProduct.imgProduct = setFromFileNameToDBValueProduct(
          req.file.filename
        );
      }

      if (category_id !== undefined && category_id !== "") {
        updatedProduct.category_id = parseInt(category_id);
      }

      if (name) {
        updatedProduct.name = name;
      }
      if (price) {
        updatedProduct.price = parseInt(price);
      }
      if (description) {
        updatedProduct.description = description;
      }
      if (stock) {
        updatedProduct.stock = parseInt(stock);
      }

      await updatedProduct.save();
      return res.status(200).send(updatedProduct);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  
};
