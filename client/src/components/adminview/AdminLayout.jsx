import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const AdminLayout = () => {
  return (
    <div>
      <Header/>
      <Sidebar/>
      <Outlet></Outlet>
    </div>
  )
}
