const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");
const Order = require("./models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");



require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Patikriname, ar įvesti abu duomenys
    if (!email || !password) {
      return res.status(400).json({
        message: "Įvesk el. paštą ir slaptažodį",
      });
    }

    // Patikriname slaptažodžio ilgį
    if (password.length < 8) {
      return res.status(400).json({
        message: "Slaptažodis turi būti bent 8 simbolių",
      });
    }

    // Patikriname, ar vartotojas jau registruotas
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Šis el. paštas jau užregistruotas",
      });
    }

    // Užšifruojame slaptažodį
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sukuriame vartotoją MongoDB duomenų bazėje
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Sukuriame prisijungimo žetoną
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Registracija sėkminga!",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registracijos klaida:", error);

    return res.status(500).json({
      message: "Įvyko serverio klaida",
    });
  }
});






mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB prisijungė");



    app.listen(process.env.PORT, () => {
      console.log(`Serveris veikia: http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB klaida:", error.message);


  });











app.post("/products", authMiddleware, async (req, res) => {

    console.log(req.body);
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// SUKURTI IR IŠSAUGOTI UŽSAKYMĄ
app.post("/orders", async (req, res) => {
  try {
    const { customer, address, items } = req.body

    // Patikriname pirkėjo duomenis
    if (
      !customer?.name?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.email?.trim() ||
      !address?.trim()
    ) {
      return res.status(400).json({
        message: "Užpildykite pirkėjo duomenis ir pristatymo adresą",
      })
    }

    // Patikriname užsakytas prekes
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Užsakymas turi turėti bent vieną prekę",
      })
    }

    const orderItems = []

    // Tikriname prekes MongoDB duomenų bazėje
    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Netinkami prekės duomenys arba kiekis",
        })
      }

      const product = await Product.findById(item.productId)

      if (!product) {
        return res.status(404).json({
          message: "Viena iš užsakytų prekių nerasta",
        })
      }

      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      })
    }

    // Apskaičiuojame sumą backend dalyje
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Išsaugome užsakymą MongoDB
    const order = await Order.create({
      customer,
      address,
      items: orderItems,
      total,
    })

    res.status(201).json({
      message: "Užsakymas sėkmingai išsaugotas!",
      order,
    })
  } catch (error) {
    console.error("Užsakymo klaida:", error)

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      })
    }

    res.status(500).json({
      message: "Nepavyko išsaugoti užsakymo",
    })
  }
})




app.get("/", (req, res) => {
  res.send("Mini Shop backend veikia!");
});

// GAUTI VISUS UŽSAKYMUS
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error("Užsakymų gavimo klaida:", error)

    res.status(500).json({
      message: "Nepavyko gauti užsakymų",
    })
  }
})

// GAUTI VIENĄ UŽSAKYMĄ PAGAL ID
app.get("/orders/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Neteisingas užsakymo ID",
      })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: "Užsakymas nerastas",
      })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({
      message: "Nepavyko gauti užsakymo",
    })
  }
})


// PAKEISTI UŽSAKYMO BŪSENĄ
app.put("/orders/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Neteisingas užsakymo ID",
      })
    }

    const { status } = req.body

    const allowedStatuses = ["Pending", "Confirmed", "Shipped"]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Neteisinga užsakymo būsena",
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({
        message: "Užsakymas nerastas",
      })
    }

    res.json({
      message: "Užsakymo būsena atnaujinta",
      order,
    })
  } catch (error) {
    console.error("Užsakymo atnaujinimo klaida:", error)

    res.status(500).json({
      message: "Nepavyko atnaujinti užsakymo",
    })
  }
})



app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Prekė nerasta" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/categories", async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/categories/seed", async (req, res) => {
  try {
    const categories = [
      "Tradiciniai aviliai",
      "Aukštiniai mediniai aviliai",
      "Aukštiniai polistireniniai aviliai",
      "Rėmeliai ir vaškuolės",
      "Avilių elementai",
      "Papildomos avilių dalys",
      "Bičių duonelės ir žiedadulkių tvarkymas",
      "Avilių pervežimo priemonės",
      "Spiečių tvarkymas",
      "Motinėlių priežiūra ir veisimas",
      "Įnagiai",
      "Dūminės",
      "Apranga",
      "Atakiavimas",
      "Medsukiai",
      "Medaus košimas",
      "Medaus tvarkymas",
      "Medaus išpilstymas",
      "Bičių stebėjimas",
      "Maitinimas",
      "Gydymo priemonės",
      "Vaško lydimas",
      "Literatūra",
      "Skanėstai",
      "Kūno priežiūra",
      "Suvenyrai",
      "Maisto papildai ir gydomieji preparatai",
      "Žvakių gamyba",
      "Vaškinės žvakės ir formos"
    ];





    for (const name of categories) {
      await Category.updateOne(
        { name: name },
        { $set: { name: name } },
        { upsert: true }
      );
    }

    res.json({
      message: "Visos kategorijos įkeltos",
      kiekis: categories.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});












app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

if (!product) {
      return res.status(404).json({ message: "Prekė nerasta" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});








app.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id
    });

    if (!category) {
      return res.status(404).json({
        message: "Kategorija nerasta"
      });
    }

    res.json({
      message: "Kategorija ištrinta",
      category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});








app.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Prekė nerasta"
      });
    }

    res.json({
      message: "Prekė ištrinta",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});









app.put("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Kategorija nerasta"
      });
    }

    res.json(category);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});










app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Įvesk el. paštą ir slaptažodį",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Neteisingas el. paštas arba slaptažodis",
      });
    }

    const passwordIsCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Neteisingas el. paštas arba slaptažodis",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Prisijungimas sėkmingas!",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Prisijungimo klaida:", error);

    return res.status(500).json({
      message: "Įvyko serverio klaida",
    });
  }
});


