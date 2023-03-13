import AccountNavBar from './Layout/AccountNavBar'
import { Form, Button } from 'react-bootstrap'
import { registerUser } from '../fetches'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleFirstName = (event) => {
    setfirstName(event.target.value)
  }
  const handleLastName = (event) => {
    setlastName(event.target.value)
  }
  const handleEmail = (event) => {
    setEmail(event.target.value)
  }
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const newUser = await registerUser(firstName, lastName, email, password)

    if (newUser === 'success') {
      navigate('/home')
    }
  }

  return (
    <>
      <AccountNavBar />
      <div className="d-flex justify-content-center">
        <div className="d-flex flex-column align-items-center register-container">
          <span className="name">
            {' '}
            Welcome to <span className="name">DIG IN</span>
          </span>

          <Form className="w-75 register-form mt-5 d-flex flex-column align-items-center">
            <strong>First Name</strong>
            <Form.Control
              type="firstName"
              className="mb-4"
              value={firstName}
              onChange={(event) => handleFirstName(event)}
            />
            <strong>Last Name</strong>
            <Form.Control
              type="lastName"
              className="mb-4"
              value={lastName}
              onChange={(event) => handleLastName(event)}
            />
            <strong>Email</strong>
            <Form.Control
              type="email"
              className="mb-4"
              value={email}
              onChange={(event) => handleEmail(event)}
            />
            <strong>Password</strong>
            <Form.Control
              type="password"
              className="mb-3"
              value={password}
              onChange={(event) => handlePassword(event)}
            />
            <Button
              variant="danger"
              type="submit"
              className="w-50"
              onClick={handleSubmit}
            >
              Register Account
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Register
