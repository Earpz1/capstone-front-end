import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'normalize.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import Home from './Components/Layout/Home'
import MyAccount from './Components/MyAccount'
import { QueryClient, QueryClientProvider } from 'react-query'
import ConvertAccount from './Components/ConvertAccount'
import RestaurantDetails from './Components/RestaurantDetails'
import SearchResults from './Components/SearchResults'
import ManageMenu from './Components/ManageMenu'
import Menu from './Components/Menu'
import Checkout from './Components/Checkout'
import Dashboard from './Components/Dashboard'

function App() {
  const client = new QueryClient()

  return (
    <QueryClientProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myDetails" element={<MyAccount />} />
          <Route path="/convertAccount" element={<ConvertAccount />} />
          <Route path="/restaurantDetails" element={<RestaurantDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/manageMenu" element={<ManageMenu />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
