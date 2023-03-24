import { Link } from 'react-router-dom'
import { getUserDetails } from '../../fetches'
import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'

const AccountSidebar = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  const { data: userData, isLoading: userDetailsLoaded } = useQuery(
    ['userDetails'],
    getUserDetails,
  )

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setLoggedIn(true)
    }
  })

  return (
    <div className="account-sidebar">
      <ul className="account-sidebar-nav">
        <h5>Account</h5>
        <Link to="/myDetails">
          <li>My Details</li>
        </Link>
        <Link to="/myOrders">
          <li>My Orders</li>
        </Link>
        <li>My Rewards</li>
        {loggedIn && !userDetailsLoaded && userData.role !== 'owner' && (
          <Link to="/convertAccount">
            <li>Convert account</li>
          </Link>
        )}
      </ul>

      {loggedIn && !userDetailsLoaded && userData.role === 'owner' && (
        <>
          <ul className="account-sidebar-nav">
            <h5>Restaurant Admin</h5>
            <Link to={`/dashboard?restaurantID=${userData.restaurantID}`}>
              <li>Restaurant Dashboard</li>
            </Link>
            <Link to="/restaurantDetails">
              <li>Restaurant Details</li>
            </Link>
            <li>History</li>
            <Link to="/manageMenu">
              <li>Menu</li>
            </Link>
            <li>Reviews</li>
          </ul>
        </>
      )}
    </div>
  )
}

export default AccountSidebar
