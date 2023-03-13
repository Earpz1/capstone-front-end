import Navbar from './Layout/Navbar'
import { Container, Button, Alert } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { useState } from 'react'
import AccountSidebar from './Layout/AccountSidebar'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'

const ConvertAccount = () => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()
  const [convertSuccess, setConvertSuccess] = useState(false)

  const { mutate: createRestaurant } = useMutation((postData) =>
    fetch('http://localhost:3001/restaurant/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
      body: JSON.stringify(postData),
    }),
  )

  const { mutate: convertAccount } = useMutation(
    (postData) =>
      fetch('http://localhost:3001/users/editDetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(postData),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userDetails')
      },
    },
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    convertAccount({
      role: 'owner',
    })

    setTimeout(() => {
      createRestaurant({
        ownerID: '1',
        name: 'test',
        address: 'test',
        cuisine: 'test',
      })
    }, 500)
    navigate('/restaurantDetails')
  }

  return (
    <>
      <Navbar />
      <Container className="d-flex">
        <AccountSidebar />
        <div className="account-content-container">
          <h1>Convert Account</h1>
          <p>
            You can convert your account into an Owner account here. An owner
            account is able to list their restaurant, create menu items and
            accept orders from customers.
          </p>
          {convertSuccess ? (
            <Alert variant="success">Your account has been converted!</Alert>
          ) : (
            <Button
              variant="danger"
              className="mt-5 mb-3 w-25"
              onClick={handleSubmit}
            >
              Convert Account
            </Button>
          )}
        </div>
      </Container>
    </>
  )
}
export default ConvertAccount
