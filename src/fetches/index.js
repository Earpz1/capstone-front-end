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

  const fetchURL = 'http://localhost:3001/users/register'

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

  const fetchURL = 'http://localhost:3001/users/login'

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

  const fetchURL = 'http://localhost:3001/users/me'

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

  const fetchURL = 'http://localhost:3001/restaurant/getRestaurant'

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

  const fetchURL = 'http://localhost:3001/restaurant/getMenuCategories'

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

  const fetchURL = 'http://localhost:3001/users/editDetails'

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {}
}

//Get menu Items

export const getMenuItems = async () => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  }

  const fetchURL = 'http://localhost:3001/menuItem/getAllItems'

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      console.log(data)
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

  const fetchURL = `http://localhost:3001/restaurant/search/${city}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      console.log(data)
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

  const fetchURL = `http://localhost:3001/menuItem/${restaurantID}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      console.log(data)
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

  const fetchURL = `http://localhost:3001/restaurant/${restaurantID}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      console.log(data)
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

  const fetchURL = `http://localhost:3001/orders/${orderID}`

  try {
    let response = await fetch(fetchURL, options)
    if (response.ok) {
      let data = await response.json()
      console.log(data)
      return data
    }
  } catch (error) {}
}
