const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    // Do the magic
    res.render("products", { productos: products, toThousand }); // toThousand(p.price)

    /**
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     */
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    const producto = products.find((p) => p.id == req.params.id);
    res.render("detail", { producto: producto });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

    console.log("///////////////////////////////");
    console.log(req.file);
    console.log("///////////////////////////////");
    // {
    //   fieldname: 'fotoProducto',
    //   originalname: 'img1.png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   destination: 'public/images/products',
    //   filename: '1662079258169img1.png',
    //   path: 'public\\images\\products\\1662079258169img1.png',
    //   size: 875190
    // }

    const productoNuevo = {
      id: Date.now(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount,
      category: req.body.category,
      image: "default-image.png",
    };

    /**
     * si hay file guardan el nombre de la imagen
     */
    if (req.file) {
      productoNuevo.image = req.file.filename;
    }

    products.push(productoNuevo);

    const data = JSON.stringify(products, null, " ");
    fs.writeFileSync(productsFilePath, data);
    res.redirect("/products");
  },

  // Update - Form to edit
  edit: (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    const producto = products.find((p) => p.id == req.params.id);

    res.render("product-edit-form", { productToEdit: producto });
  },
  // Update - Method to update
  update: (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    console.log(req.body);
    console.log(req.params.id);

    products.forEach((p) => {
      if (p.id == req.params.id) {
        p.name = req.body.name;
        p.price = req.body.price;
        p.discount = req.body.discount;
        p.description = req.body.description;
        p.category = req.body.category;

        if (req.file) {
          fs.unlinkSync("./public/images/products/" + p.image);
          p.image = req.file.filename;
        }
      }
    });

    /**
     *  indexof
     *  filter
     *  find
     */

    const data = JSON.stringify(products, null, " ");
    fs.writeFileSync(productsFilePath, data);

    res.redirect("/products/detail/" + req.params.id);
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    const producto = products.find((p) => p.id == req.params.id);

    products = products.filter((p) => p.id != req.params.id);

    if (producto && producto.image != "default-image.png") {
      fs.unlinkSync("./public/images/products/" + producto.image);
    }

    const data = JSON.stringify(products, null, " ");
    fs.writeFileSync(productsFilePath, data);
    res.redirect("/products");
  },
};

module.exports = controller;
