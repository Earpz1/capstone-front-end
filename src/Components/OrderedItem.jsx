const OrderedItem = ({ item }) => {
  return (
    <>
      <div className="orderedItem w-75 mb-3 p-3">
        {item.quantity} x {item.name}
      </div>
    </>
  )
}

export default OrderedItem
