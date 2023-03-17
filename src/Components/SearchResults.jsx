import { Rating } from 'react-simple-star-rating'

import { SearchCity } from '../fetches'
import Navbar from './Layout/Navbar'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Container, Row } from 'react-bootstrap'

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
        <Row>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column align-items-center">
              <img
                src="https://picsum.photos/200/100"
                className="filter-image"
              />
              <p>Indian</p>
            </div>
            <div className="d-flex flex-column align-items-center">
              <img
                src="https://picsum.photos/200/100"
                className="filter-image"
              />
              <p>Pizza</p>
            </div>
            <div className="d-flex flex-column align-items-center">
              <img
                src="https://picsum.photos/200/100"
                className="filter-image"
              />
              <p>Burgers</p>
            </div>
            <div className="d-flex flex-column align-items-center">
              <img
                src="https://picsum.photos/200/100"
                className="filter-image"
              />
              <p>Desserts</p>
            </div>
            <div className="d-flex flex-column align-items-center">
              <img
                src="https://picsum.photos/200/100"
                className="filter-image"
              />
              <p>Sandwiches</p>
            </div>
          </div>
        </Row>

        {!searchResultsLoading &&
          searchResults.map((result) => (
            <>
              <Link
                to={`/menu?restaurant=${result._id}`}
                className="search-link"
              >
                <div className="search-result-card mt-5 d-flex">
                  <img
                    src="https://picsum.photos/300/150"
                    className="search-card-image"
                  />
                  <div className="d-flex flex-column align-items-center w-75">
                    <h1 className="mt-1">{result.name}</h1>
                    <div className="d-flex justify-content-between w-50">
                      <p>{result.cuisine}</p>
                      <div className="d-flex">
                        <Rating size={30} readonly={true} initialValue="5" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between w-50">
                      <p>Minimum Order: £15</p>
                      <p>Delivery: 50-60 Mins</p>
                    </div>
                  </div>
                </div>
              </Link>
            </>
          ))}
      </Container>
    </>
  )
}

export default SearchResults
