import { Rating } from 'react-simple-star-rating'
import { SlRating } from '@shoelace-style/shoelace/dist/react'
import { SearchCity } from '../fetches'
import Navbar from './Layout/Navbar'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Container, Col } from 'react-bootstrap'
import Footer from './Layout/Footer'

const SearchResults = () => {
  const params = useLocation()
  const searchParams = new URLSearchParams(params.search)
  const location = searchParams.get('city')

  const { data: searchResults, isLoading: searchResultsLoading } = useQuery(
    ['searchResults', location],
    ({ queryKey }) => SearchCity(queryKey[1]),
    {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 59916,
    },
  )

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        {!searchResultsLoading &&
          searchResults.map((result) => (
            <>
              <Link
                to={`/menu?restaurant=${result._id}`}
                className="search-link"
                key={result._id}
              >
                <Col className="search-result-card mt-5 d-flex">
                  <img
                    src={result.imageURL}
                    className="search-card-image d-none d-md-block"
                    width="300px"
                    height="150px"
                  />
                  <div className="d-flex flex-column align-items-center w-100">
                    <h1 className="mt-1">{result.name}</h1>
                    <div className="d-flex justify-content-md-between justify-content-center w-50">
                      <p>{result.cuisine}</p>
                      <div className="d-flex">
                        <SlRating
                          label="Rating"
                          readonly
                          value={3}
                          style={{ '--symbol-size': '1.5rem' }}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between w-50">
                      <p>Minimum Order: £{result.minimumOrder}</p>
                      <p>£{result.deliveryFee} delivery fee</p>
                    </div>
                  </div>
                </Col>
              </Link>
            </>
          ))}
      </Container>
      <Footer />
    </>
  )
}

export default SearchResults
