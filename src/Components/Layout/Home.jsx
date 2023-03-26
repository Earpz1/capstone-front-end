import Navbar from '../Layout/Navbar'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { BiCurrentLocation } from 'react-icons/bi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'

const Home = () => {
  const apiKey = 'AIzaSyA4ItZzAACzaBIw0oRAc4qZ46LSA90-104'

  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = () => {
    navigate(`/search?city=${searchTerm}`)
  }

  //Write a function that console logs my longitude and latitude
  const showPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        getCityName(latitude, longitude)
      })
    }
  }

  //Given latitude and longitude, return the postal town
  const getCityName = async (latitude, longitude) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&type=locality`,
    )
    const data = await response.json()
    console.log(data)
    setSearchTerm(data.results[0].address_components[2].long_name)
  }

  return (
    <>
      <Navbar />

      <img src="hero.jpeg" className="hero-image d-none d-md-block" />

      <div className="d-flex flex-column align-items-center search-container d-none d-md-block">
        <div className="d-flex flex-column align-items-center w-100">
          <span className="search-title">DIG IN TO YOUR NEXT MEAL</span>
          <Form className="w-75">
            <InputGroup className=" mb-3 mt-3">
              <Form.Control
                placeholder="Enter your location"
                aria-describedby="search-location"
                onChange={(event) => handleSearchTerm(event)}
                value={searchTerm}
              />
              <InputGroup.Text id="search-location">
                <BiCurrentLocation onClick={showPosition} />
              </InputGroup.Text>
            </InputGroup>
            <Button
              type="submit"
              className="w-100"
              variant="danger"
              onClick={handleSearch}
            >
              Search
            </Button>
          </Form>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center search-container-mobile d-block d-md-none">
        <span className="search-title">DIG IN TO YOUR NEXT MEAL</span>
        <Form className="w-75">
          <InputGroup className=" mb-3 mt-3">
            <Form.Control
              placeholder="Enter your location"
              aria-describedby="search-location"
              onChange={(event) => handleSearchTerm(event)}
              value={searchTerm}
            />
            <InputGroup.Text id="search-location">
              <BiCurrentLocation onClick={showPosition} />
            </InputGroup.Text>
          </InputGroup>
          <Button
            type="submit"
            className="w-100"
            variant="danger"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Form>
      </div>

      <Footer />
    </>
  )
}

export default Home
