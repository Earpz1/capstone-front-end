//Register

export const registerUser = async (firstName, lastName, email, password) => {
  const userDetails = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(userDetails),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}users/register`

  try {
    let response = await fetch(fetchURL, options)

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      return 'success'
    } else {
      return response.status
    }
  } catch (error) {}
}

//Login

export const userLogin = async (email, password) => {
  const enteredDetails = {
    email: email,
    password: password,
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(enteredDetails),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}users/login`

  try {
    let response = await fetch(fetchURL, options)

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      return 'success'
    } else {
      return response.status
    }
  } catch (error) {}
}

//After loggin in, get user details from the token
export const getUserDetails = async () => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}users/me`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

export const getOwnersRestaurant = async () => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}restaurant/getRestaurant`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get a list of all the categories in the menu
export const getFoodCategories = async () => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}restaurant/getMenuCategories`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Edit a user
export const updateUserDetails = async (postData) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
    body: JSON.stringify(postData),
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}users/editDetails`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get menu Items

export const getMenuItems = async (restaurantID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}menuItem/${restaurantID}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get all restaurants from a city
export const SearchCity = async (city) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}restaurant/search/${city}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get all menu items for a restaurant
export const getMenuForRestaurant = async (restaurantID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}menuItem/${restaurantID}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get menu items from a specific category
export const getMenuItemsFromCategory = async (restaurantID, category) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}menuItem/${restaurantID}/${category}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get restaurant Details
export const getRestaurantDetails = async (restaurantID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}restaurant/${restaurantID}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()

      return data
    }
  } catch (error) {}
}

//Get specfic order
export const getOrder = async (orderID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}orders/${orderID}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()

      return data
    }
  } catch (error) {}
}

//Get orders that are pending
export const getPendingOrders = async (restaurantID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}orders/${restaurantID}/pending`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get orders that have been completed
export const getCompletedOrders = async (restaurantID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}orders/${restaurantID}/delivered`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get orders that are in progress
export const inProgressOrders = async (restaurantID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}orders/${restaurantID}/inProgress`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get the clientKey
export const clientKey = async (orderID) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}orders/${orderID}/secret`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()

      return data.client_secret
    }
  } catch (error) {}
}

//Get all orders from a customer
export const getMyOrders = async (limit) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = `${process.env.REACT_APP_BACKEND_URL}orders/myOrders?limit=${limit}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()

      return data
    }
  } catch (error) {}
}
