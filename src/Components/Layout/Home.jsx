import Navbar from '../Layout/Navbar'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { BiCurrentLocation } from 'react-icons/bi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = () => {
    navigate(`/search?city=${searchTerm}`)
  }

  return (
    <>
      <Navbar />
      <img src="hero.jpeg" className="hero-image" />
      <div className=" d-flex flex-column align-items-center search-container">
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
              <BiCurrentLocation />
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
    </>
  )
}

export default Home
