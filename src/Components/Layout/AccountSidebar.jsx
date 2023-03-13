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
        <li>My Orders</li>
        <li>My Rewards</li>
        <li>Payment Details</li>
        {loggedIn && !userDetailsLoaded && userData.role !== 'owner' && (
          <Link to="/convertAccount">
            <li>Convert account</li>
          </Link>
        )}
      </ul>

      {loggedIn && !userDetailsLoaded && userData.role === 'owner' && (
        <>
          <ul className="account-sidebar-nav">
            <h5>Restaurant Dashboard</h5>
            <Link to="/restaurantDetails">
              <li>Restaurant Details</li>
            </Link>
            <li>Orders</li>
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
