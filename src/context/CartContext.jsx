import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('creaparty_cart');
    const savedDate = localStorage.getItem('creaparty_event_date');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }

    if (savedDate) {
      setSelectedDate(savedDate);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('creaparty_cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('creaparty_cart');
    }
  }, [cartItems]);

  // Guardar fecha en localStorage cuando cambie
  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem('creaparty_event_date', selectedDate);
    } else {
      localStorage.removeItem('creaparty_event_date');
    }
  }, [selectedDate]);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      updateQuantity(product.id, existingItem.cantidad + quantity);
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          cantidad: quantity,
          stockDisponible: product.stock,
        },
      ]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = cartItems.find((item) => item.id === productId);

    if (!product) return;

    const maxStock = product.stockDisponible !== undefined ? product.stockDisponible : product.stock;

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > maxStock) {
      alert(`Solo hay ${maxStock} unidades disponibles para esta fecha`);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedDate('');
    localStorage.removeItem('creaparty_cart');
    localStorage.removeItem('creaparty_event_date');
  };

  const updateStockAvailability = (productId, availableStock) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, stockDisponible: availableStock } : item
      )
    );
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.precio * item.cantidad;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.cantidad : 0;
  };

  const value = {
    cartItems,
    selectedDate,
    setSelectedDate,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    updateStockAvailability,
    getTotal,
    getTotalItems,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
