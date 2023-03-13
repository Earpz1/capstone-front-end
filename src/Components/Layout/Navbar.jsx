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
            <li className="nav-list-mobile">My Orders</li>
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
          <CiBurger className="burger-icon" />
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
            <li className="nav-list-desktop">My Orders</li>
            <li className="nav-list-desktop">My Rewards</li>
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
