import AccountSidebar from './Layout/AccountSidebar'
import Navbar from './Layout/Navbar'
import { Container, Button, ListGroup, Form, Table } from 'react-bootstrap'
import { getFoodCategories, getMenuItems } from '../fetches'
import { useQuery, useMutation } from 'react-query'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { getOwnersRestaurant } from '../fetches'

const ManageMenu = () => {
  const queryClient = useQueryClient()

  const [category, setCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [url, setURL] = useState('')
  const [menuItemName, setMenuItemName] = useState('')
  const [menuItemPrice, setMenuItemPrice] = useState('')
  const [menuItemCategory, setMenuItemCategory] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [itemID, setItemID] = useState('')
  const [restaurantID, setRestaurantID] = useState('')
  const [menu, setMenu] = useState([])

  const { data: OwnerRestaurant, isLoading: OwnerRestaurantLoading } = useQuery(
    ['OwnerRestaurant'],
    getOwnersRestaurant,
    {
      onSuccess: (OwnerRestaurant) => {
        setRestaurantID(OwnerRestaurant._id)
        console.log(OwnerRestaurant._id)
      },
      refetchOnWindowFocus: false,
    },
  )

  const { data: menuCategories, isLoading: menuCategoriesLoading } = useQuery(
    ['menuCategories'],
    getFoodCategories,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: menuItems, isLoading: menuItemsLoading } = useQuery(
    ['menuItems', restaurantID],
    ({ queryKey }) => getMenuItems(queryKey[1]),
    {
      enabled: OwnerRestaurantLoading === false,
      refetchOnWindowFocus: false,
      onSuccess: (menuItems) => {
        setMenu(menuItems)
      },
    },
  )

  const { mutate: updateMenuCategories } = useMutation(
    (postData) =>
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}restaurant/deleteMenuCategory/${url}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
          body: JSON.stringify(postData),
        },
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menuCategories')
        setCategory('')
        setNewCategory('')
        setURL('')
      },
    },
  )

  const { mutate: addMenuItem } = useMutation(
    (postData) =>
      fetch(`http://localhost:3001/menuItem/newItem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(postData),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menuItems')
      },
    },
  )

  const { mutate: deleteMenuItem } = useMutation(
    (postData) =>
      fetch(`http://localhost:3001/menuItem/deleteItem/${itemID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('menuItems')
      },
    },
  )

  const handleNewCategory = (event) => {
    setNewCategory(event.target.value)
    setURL(event.target.value)
  }

  const addCategory = (categoryName) => {
    setCategory(categoryName)

    setTimeout(() => {
      updateMenuCategories({
        foodCategory: newCategory,
      })
    }, 300)
  }

  const deleteCategory = (categoryName) => {
    setCategory(categoryName)
    setURL(categoryName)

    setTimeout(() => {
      updateMenuCategories({
        foodCategory: category,
      })
    }, 300)
  }

  const handleNameChange = (event) => {
    setMenuItemName(event.target.value)
  }

  const handlePriceChange = (event) => {
    setMenuItemPrice(event.target.value)
  }

  const handleCategroyChange = (event) => {
    setMenuItemCategory(event.target.value)
  }

  const addNewMenuItem = (event) => {
    event.preventDefault()

    addMenuItem({
      restaurantID: OwnerRestaurant._id,
      name: menuItemName,
      price: menuItemPrice,
      category: menuItemCategory,
    })
  }

  const showForm = () => {
    if (showAddItem === true) {
      setShowAddItem(false)
    } else {
      setShowAddItem(true)
    }
  }

  const showCategoryForm = () => {
    if (showAddCategory === true) {
      setShowAddCategory(false)
    } else {
      setShowAddCategory(true)
    }
  }

  const handleDeleteMenuItem = (itemID) => {
    setItemID(itemID)

    setTimeout(() => {
      deleteMenuItem()
    }, 500)
  }

  return (
    <>
      <Navbar />
      <Container className="d-flex">
        <AccountSidebar />
        <div className="account-content-container">
          <h1>Manage Menu</h1>
          <span>
            Manage your menu here. Add, edit or delete menu items and sort them
            into categories
          </span>
          <hr />

          <h4>Menu Categories</h4>
          <Button variant="danger" className="mb-3" onClick={showCategoryForm}>
            Add Category
          </Button>
          {showAddCategory && (
            <Form className=" w-50 d-flex flex-column mr-5">
              <Form.Control
                type="foodCategory"
                className="mb-4"
                placeholder="Category Name"
                value={newCategory}
                onChange={(event) => handleNewCategory(event)}
              />
              <Button
                variant="danger"
                className="mb-3"
                onClick={() => addCategory(category)}
              >
                Add
              </Button>
            </Form>
          )}

          <ListGroup className="d-flex flex-wrap" horizontal>
            {!menuCategoriesLoading &&
              menuCategories.map((category) => (
                <ListGroup.Item className="d-flex justify-content-end align-items-center">
                  {category}
                  <AiFillDelete onClick={() => deleteCategory(category)} />
                </ListGroup.Item>
              ))}
          </ListGroup>
          <h4 className="mt-4">Menu Items</h4>
          <Button variant="danger" className="mb-3 mt-4" onClick={showForm}>
            Add Menu Item
          </Button>
          {showAddItem && (
            <Form className=" w-50 d-flex flex-column mr-5">
              <Form.Control
                type="menuItemName"
                className="mb-4"
                placeholder="Name"
                onChange={(event) => handleNameChange(event)}
              />
              <Form.Control
                type="foodCategory"
                className="mb-4"
                onChange={(event) => handlePriceChange(event)}
                placeholder="Price"
              />
              <Form.Select
                onChange={(event) => handleCategroyChange(event)}
                size="sm"
              >
                <option>Choose Category...</option>
                {!menuCategoriesLoading &&
                  menuCategories.map((category) => (
                    <option> {category}</option>
                  ))}
              </Form.Select>
              <Button
                variant="danger"
                className="mb-3 mt-4"
                onClick={addNewMenuItem}
              >
                Add Menu Item
              </Button>
            </Form>
          )}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!menuItemsLoading &&
                menu.map((menuItem) => (
                  <tr>
                    <td>{menuItem.name}</td>
                    <td>{menuItem.price}</td>
                    <td>{menuItem.category}</td>
                    <td>
                      <AiFillEdit />{' '}
                      <AiFillDelete
                        onClick={() => handleDeleteMenuItem(menuItem._id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  )
}

export default ManageMenu
