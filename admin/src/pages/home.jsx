import React from 'react'
import { Link } from 'react-router-dom'

const home = () => {
  return (
    <div className='p-10 mt-2 flex gap-1'>
      <Link to={"/all-products"} className='py-11 px-10 bg-blue-600 rounded-md'>get all</Link>
      <Link to={"/new-product"} className='py-11 px-10 bg-blue-600 rounded-md'>Create new</Link>
    </div>
  )
}

export default home
