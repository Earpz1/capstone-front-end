import { CiBurger } from 'react-icons/ci'

const AccountNavBar = () => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center nav-container">
        <div className="d-flex align-items-center left-nav">
          <CiBurger className="burger-icon" />
          <span>DIG IN</span>
        </div>
      </div>
    </>
  )
}

export default AccountNavBar
