import AccountNavBar from '../Components/Layout/AccountNavBar'
import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import { userLogin } from '../fetches'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmail = (event) => {
    setEmail(event.target.value)
  }
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const loginUser = await userLogin(email, password)

    if (loginUser === 'success') {
      navigate('/')
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
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Login
