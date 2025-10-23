import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FiUser, FiMapPin, FiPackage, FiEdit2, FiPlus, FiCalendar, FiTruck } from 'react-icons/fi'
import { BiSolidStar } from 'react-icons/bi'
import accountImage from '../../assets/account.jpg'
import '../../css/Account.css'
import { Address } from './Address'
import { Orders } from './Orders'
import { ViewDetailsModal } from './ViewDetailsModal'

export const Account = () => {
     const [isOpen,setIsOpen]=useState(false)
     console.log(isOpen);
     
  const [activeTab, setActiveTab] = useState('orders')
   const [addressList, setAddressList] = useState([])
   const [orders,setOrders]=useState([]);
   const [order,setOrder]=useState({});
  const { user } = useSelector((state) => state.auth)
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await fetch(process.env.REACT_APP_BASE_URL +`/shop/address/get/${user.id}`);
                const data = await res.json();
                console.log(data);
                setAddressList(data.data || []);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };
        const fetchOrders=async()=>{
          try{
            const res=await fetch(process.env.REACT_APP_BASE_URL +`/shop/order/list/${user.id}`);
            const data=await res.json();
            console.log(data);
            setOrders(data.data||[]);
            
          }
          catch(err){
            console.log(err);
            
          }
        }
        if (user?.id) {
            fetchOrders();
            fetchAddresses();
        }
    }, [user?.id])

  return (
    <div className="account-container">
      {/* Hero Section */}
      <div className="account-hero">
        <div className="hero-background">
          <img src={accountImage} alt="Account" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="user-profile">
            <div className="profile-avatar">
              <FiUser size={40} />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">Welcome back, {user?.userName || 'User'}!</h1>
              <p className="profile-email">{user?.email || 'user@example.com'}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{addressList.length}</span>
                  <span className="stat-label">Addresses</span>
                </div>
      
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="account-main">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiPackage />
            <span>My Orders</span>
            <div className="tab-badge">{orders.length}</div>
          </button>
          <button 
            className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <FiMapPin />
            <span>Addresses</span>
            <div className="tab-badge">{addressList.length}</div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'orders' && (
            <Orders orders={orders} setOrders={setOrders} setOrder={setOrder} setIsOpen={setIsOpen} isOpen={isOpen} />
          )}

          {activeTab === 'addresses' && <Address addressList={addressList} setAddressList={setAddressList} />}
        </div>
      </div>
          {isOpen && <ViewDetailsModal isOpen={isOpen} setIsOpen={setIsOpen}  orderDetails={order} />}
    </div>
  )
}
