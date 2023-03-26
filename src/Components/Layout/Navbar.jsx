import { CiBurger } from 'react-icons/ci'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Offcanvas, Accordion } from 'react-bootstrap'
import { getUserDetails } from '../../fetches'
import { useQuery } from 'react-query'

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [show, setShow] = useState(false)
  const [showAccountLinks, setShowAccountLinks] = useState(false)
  const [showRestaurantLinks, setShowRestaurantLinks] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleShowAccountLinks = () => setShowAccountLinks(!showAccountLinks)
  const handleShowRestaurantLinks = () =>
    setShowRestaurantLinks(!showRestaurantLinks)

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
              <li className="nav-list-mobile">Orders</li>
            </Link>
            <li className="nav-list-mobile">Rewards</li>
            {loggedIn ? (
              <>
                <li className="nav-list" onClick={handleShowAccountLinks}>
                  Account {showAccountLinks ? '-' : '+'}
                </li>
                {showAccountLinks && (
                  <ul className="account-sub-menu">
                    <Link to="/myDetails">
                      <li>My Details</li>
                    </Link>

                    <li>My Rewards</li>
                    {loggedIn &&
                      !userDetailsLoaded &&
                      userData.role !== 'owner' && (
                        <Link to="/convertAccount">
                          <li>Convert account</li>
                        </Link>
                      )}
                  </ul>
                )}
                {loggedIn && !userDetailsLoaded && userData.role === 'owner' && (
                  <>
                    <li
                      className="nav-list mt-4"
                      onClick={handleShowRestaurantLinks}
                    >
                      Restaurant Admin {showRestaurantLinks ? '-' : '+'}
                    </li>
                    {showRestaurantLinks && (
                      <ul className="account-sub-menu">
                        <Link
                          to={`/dashboard?restaurantID=${userData.restaurantID}`}
                        >
                          <li>Restaurant Dashboard</li>
                        </Link>
                        <Link to="/restaurantDetails">
                          <li>Restaurant Details</li>
                        </Link>
                        <Link to="/manageMenu">
                          <li>Menu</li>
                        </Link>
                        <li>Reviews</li>
                      </ul>
                    )}
                  </>
                )}
              </>
            ) : (
              <Link to="/Login">
                <li className="nav-list-mobile">Log in</li>
              </Link>
            )}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-flex justify-content-between w-100 align-items-center nav-container">
        <div className="d-flex justify-content-between left-nav d-none d-lg-block w-100">
          <img src="logo.png" width="60" className="mb-2" />
          <span>DIG IN</span>
        </div>

        <div className="d-flex justify-content-start left-nav d-block d-lg-none">
          <span>DIG IN</span>
        </div>

        <div className="align-items-center right-nav d-none d-lg-block">
          <ul className="d-flex nav-list justify-content-center">
            <Link to="/">
              <li className="nav-list-desktop">Home</li>
            </Link>
            <Link to="/myOrders">
              <li className="nav-list-desktop">Orders</li>
            </Link>
            <Link to="/">
              <li className="nav-list-desktop">Rewards</li>
            </Link>
            {loggedIn ? (
              <Link to="/myDetails">
                <li className="nav-list-desktop">Account</li>
              </Link>
            ) : (
              <Link to="/Login">
                <li className="nav-list-desktop">Log in</li>
              </Link>
            )}
          </ul>
        </div>

        <div className="align-items-end right-nav d-block d-lg-none">
          <GiHamburgerMenu className="burger-menu" onClick={handleShow} />
        </div>
      </div>
    </>
  )
}

export default Navbar
