import { useEffect, useState } from "react"
import "./App.css"
import Header from "./components/Header"
import Cart from "./components/Cart"
import Footer from "./components/Footer"
import About from "./pages/About"
import Contacts from "./pages/Contacts"
import Favorites from "./pages/Favorites"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Checkout from "./pages/Checkout"
import Payment from "./pages/Payment"





function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites")
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  function toggleFavorite(productId) {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    )
  }

  const [products, setProducts] = useState([])
const [currentPage, setCurrentPage] = useState(1)
const productsPerPage = 6



  const [searchText, setSearchText] = useState("")
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  const [showAbout, setShowAbout] = useState(false)
  const [showContacts, setShowContacts] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("")

  const [showProductsMenu, setShowProductsMenu] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

const [showPayment, setShowPayment] = useState(false)
const [selectedPayment, setSelectedPayment] = useState("")



  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
      })
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data)
      })
  }, [])

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id)

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }


const increaseQuantity = (productId) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item._id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  )
}


const decreaseQuantity = (productId) => {
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  )
}

  

  const total = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  )

  const filteredProducts = products
    .filter((product) => {
      const nameMatch = product.title
        .toLowerCase()
        .includes(searchText.toLowerCase())

      const categoryMatch =
        !selectedCategory || product.category === selectedCategory

      const priceMatch =
        (!minPrice || product.price >= Number(minPrice)) &&
        (!maxPrice || product.price <= Number(maxPrice))

      return nameMatch && categoryMatch && priceMatch
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price
      }

      if (sortBy === "price-desc") {
        return b.price - a.price
      }

   
      return 0
    })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const startIndex = (currentPage - 1) * productsPerPage

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  )

 


  return (
    <div>

      

      {showPayment ? (
  <Payment
    selectedPayment={selectedPayment}
    onBack={() => {
      setShowPayment(false)
      setShowCheckout(true)
    }}
  />

   ) : showCheckout ? (
  <Checkout
    onBack={() => setShowCheckout(false)}
    onContinue={(paymentMethod) => {
      setSelectedPayment(paymentMethod)
      setShowCheckout(false)
      setShowPayment(true)
    }}
      />



      ) : showFavorites ? (
        <Favorites
          products={products}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onClose={() => setShowFavorites(false)}
        />


     


           ) : showCart ? (
        <Cart
          cart={cart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          total={total}
          setShowCheckout={setShowCheckout}
          setShowCart={setShowCart}
        />
      ) : (
        <>



                    <Header
            searchText={searchText}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
            favorites={favorites}
            setShowFavorites={setShowFavorites}
            showFavorites={showFavorites}
            setShowCart={setShowCart}
            total={total}
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            showRegister={showRegister}
            setShowRegister={setShowRegister}
            categories={categories}
            showProductsMenu={showProductsMenu}
            setShowProductsMenu={setShowProductsMenu}
            setSelectedCategory={setSelectedCategory}
            setShowProducts={setShowProducts}
            setShowAbout={setShowAbout}
            setShowContacts={setShowContacts}
            setSelectedProduct={setSelectedProduct}
            setShowCheckout={setShowCheckout}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />

          {showContacts ? (
            <Contacts
              onBack={() => {
                setShowContacts(false)
                setShowAbout(false)
              }}
            />
          ) : showAbout ? (
            <About onBack={() => setShowAbout(false)} />
          ) : showProducts ? (
            <Products
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              currentProducts={currentProducts}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
            />
          ) : (
            <Home onOpenProducts={() => setShowProducts(true)} />
          )}
              </>
      )}

      <Footer />
    </div>
  )
}

export default App

