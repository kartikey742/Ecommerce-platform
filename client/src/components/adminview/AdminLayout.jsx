import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import '../../css/AdminView.css'

export const AdminLayout = ({order}) => {
  return (
    <div>
      <Header/>
      <Sidebar/>
      <div className="admin-main-content">
        <Outlet></Outlet>
      </div>
    </div>
  )
}
