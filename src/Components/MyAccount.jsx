import Navbar from './Layout/Navbar'
import { Container, Form, Button } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getUserDetails } from '../fetches'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AccountSidebar from './Layout/AccountSidebar'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import Footer from './Layout/Footer'

const MyAccount = () => {
  const apiKey = 'AIzaSyA4ItZzAACzaBIw0oRAc4qZ46LSA90-104'
  const queryClient = useQueryClient()

  const { data: userData, isLoading: userDetailsLoaded } = useQuery(
    ['userDetails'],
    getUserDetails,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { mutate: updateUserDetails } = useMutation(
    (postData) =>
      fetch(`${process.env.REACT_APP_BACKEND_URL}users/editDetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(postData),
      }),
    {
      onSuccess: async (data) => {
        const accessKey = await data.json()

        localStorage.setItem('accessToken', accessKey.accessToken)
      },
    },
  )

  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)

  useEffect(() => {
    if (!userDetailsLoaded) {
      setTimeout(() => {
        setfirstName(userData.firstName)
        setlastName(userData.lastName)
        setEmail(userData.email)
      }, 300)
    }
  }, [userData])

  const handleFirstName = (event) => {
    setfirstName(event.target.value)
  }

  const handleLastName = (event) => {
    setlastName(event.target.value)
  }

  const handleEmail = (event) => {
    setEmail(event.target.value)
  }

  const showAddAddress = () => {
    setShowAddressForm(true)
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    console.log(address)

    updateUserDetails({
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address.label,
    })
  }

  return (
    <>
      <Navbar />
      <Container fluid className=" w-75 d-flex">
        <AccountSidebar />
        <div className="account-content-container w-100">
          <h1>My Details</h1>
          <span>View & edit your personal details</span>
          <Form className="register-form w-100 mt-5 d-flex flex-column align-items-xs-center align-items-md-start">
            <strong>First Name</strong>
            <Form.Control
              type="firstName"
              className="w-100 mb-3"
              value={!userDetailsLoaded && firstName}
              onChange={(event) => handleFirstName(event)}
            />
            <strong>Last Name</strong>
            <Form.Control
              type="lastName"
              className="w-100 mb-4"
              value={!userDetailsLoaded && lastName}
              onChange={(event) => handleLastName(event)}
            />
            <strong>Email</strong>
            <Form.Control
              type="email"
              className="w-100 mb-4"
              value={!userDetailsLoaded && email}
              onChange={(event) => handleEmail(event)}
            />
            <strong>Delivery Address</strong>
            <div className="w-100">
              <GooglePlacesAutocomplete
                apiKey={apiKey}
                selectProps={{ address, onChange: setAddress }}
              />
            </div>
          </Form>
          <Button
            variant="danger"
            className="mt-5 mb-3 w-100"
            onClick={handleSubmit}
          >
            Save Details
          </Button>
        </div>
      </Container>
    </>
  )
}
export default MyAccount
