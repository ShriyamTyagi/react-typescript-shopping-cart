import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
// Components
import Drawer from "@mui/material/Drawer";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Item from "./item/Item"
// Styles
import { Wrapper, StyledButton } from "./App.styles"
import Cart from "./cart/Cart";
// types
export type CartItemType = {
  id: number,
  category: string,
  description: string,
  image: string,
  price: number,
  title: string,
  amount: number
}

const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch('https://fakestoreapi.com/products')).json();
}

const App = () => {

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[])

  const { isLoading, error, data } = useQuery<CartItemType[]>('products', getProducts)

  const getTotalItems = (items: CartItemType[]) => {
    let total = 0;
    items.map((item) => total += item.amount);

    return total
  }

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === clickedItem.id);

      if(itemExists) {
        return prevItems.map((item) => 
          item.id === clickedItem.id ? {...item, amount: item.amount + 1} : item
      )}
      else {
        return [...prevItems,{...clickedItem, amount: 1}]
      }
    })
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prevItems => 
      prevItems.reduce((accumulator, item) => {
        if(item.id === id) {
          if(item.amount === 1) return accumulator;
          else return [...accumulator, {...item, amount: item.amount - 1}];
        }
        else {
          return [...accumulator, item]
        }
      }, [] as CartItemType[])
    )
  }

  if(isLoading) return <LinearProgress />

  if(error) return <div>Something Went Wrong...</div>

  return (
    <Wrapper>
      <Drawer anchor='right' open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <Cart 
          cartItems={cartItems} 
          addToCart={handleAddToCart} 
          removeFromCart={handleRemoveFromCart} 
        />
      </Drawer>
      <StyledButton onClick={() => setIsCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
          {data?.map((item: CartItemType) => 
             <Grid item key={item.id} xs={12} sm={4}>
                <Item item={item} handleAddToCart={handleAddToCart}/>
             </Grid>
          )}
      </Grid>
    </Wrapper>
  );
}

export default App;
