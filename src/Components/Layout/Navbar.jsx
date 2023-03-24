import { CiBurger } from 'react-icons/ci'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Offcanvas } from 'react-bootstrap'
import { getUserDetails } from '../../fetches'
import { useQuery } from 'react-query'

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const {
    data: userData,
    isLoading: userDetailsLoaded,
    refetch: fetchUserData,
  } = useQuery(['userDetails'], getUserDetails, {
    enabled: false,
  })

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setLoggedIn(true)
      fetchUserData()
    }
  }, [])

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span className="sidebar-header">DIG IN</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="d-flex flex-column nav-list">
            <div>
              <Link to="/">
                <li className="nav-list-mobile">Home</li>
              </Link>
            </div>
            <Link to="/myOrders">
              <li className="nav-list-mobile">My Orders</li>
            </Link>
            <li className="nav-list-mobile">My Rewards</li>
            {loggedIn ? (
              <Link to="/myDetails">
                <li className="nav-list-mobile">My Account</li>
              </Link>
            ) : (
              <Link to="/Login">
                <li className="nav-list-mobile">Log in</li>
              </Link>
            )}
            {loggedIn && !userDetailsLoaded && (
              <Link to="/manageRestaurant">
                <li className="nav-list-mobile">Manage Restaurant</li>
              </Link>
            )}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-flex justify-content-between align-items-center nav-container">
        <div className="d-flex align-items-center left-nav d-none d-lg-block">
          <img src="logo.png" width="60" className="mb-2" />
          <span>DIG IN</span>
        </div>

        <div className="d-flex align-items-center left-nav d-block d-lg-none">
          <CiBurger className="burger-icon" />
          <span>DIG IN</span>
        </div>

        <div className="align-items-center right-nav d-none d-lg-block">
          <ul className="d-flex nav-list">
            <Link to="/">
              <li className="nav-list-desktop">Home</li>
            </Link>
            <Link to="/myOrders">
              <li className="nav-list-desktop">My Orders</li>
            </Link>
            <Link to="/">
              <li className="nav-list-desktop">My Rewards</li>
            </Link>
            {loggedIn ? (
              <Link to="/myDetails">
                <li className="nav-list-desktop">My Account</li>
              </Link>
            ) : (
              <Link to="/Login">
                <li className="nav-list-desktop">Log in</li>
              </Link>
            )}
          </ul>
        </div>

        <div className="align-items-center right-nav d-block d-lg-none">
          <GiHamburgerMenu className="burger-menu" onClick={handleShow} />
        </div>
      </div>
    </>
  )
}

export default Navbar
