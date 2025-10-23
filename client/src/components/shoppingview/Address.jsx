import React, { useEffect, useState } from 'react'
import { FiMapPin, FiEdit2, FiPlus, FiX } from 'react-icons/fi'
import { addressFormControls } from '../../config'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify' 
const initialAddressData = {
  address: '',
  city: '',
  pincode: '',
  phone: '',
  notes: ''
}



const CommonForm = ({ formControls, formData, setFormData, onSubmit, buttonText }) => {
  return (
    <form onSubmit={onSubmit} className="address-form">
      {formControls.map((control) => (
        <div key={control.name} className="form-group">
          <label htmlFor={control.name}>{control.label}</label>
          {control.componentType === 'input' ? (
            <input
              type={control.type}
              id={control.name}
              name={control.name}
              placeholder={control.placeholder}
              value={formData[control.name]}
              onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
              required
            />
          ) : control.componentType === 'textarea' ? (
            <textarea
              id={control.name}
              name={control.name}
              placeholder={control.placeholder}
              value={formData[control.name]}
              onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
              rows={3}
              required={true}
            />
          ) : null}
        </div>
      ))}
      <button type="submit" className="btn-primary">
        {buttonText}
      </button>
    </form>
  )
}

export const Address = ({ addressList, setAddressList, isCheckout, selectedAddress, setSelectedAddress }) => {
    const {user}=useSelector((state)=>state.auth)

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    }

  const [showModal, setShowModal] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)
  const [formData, setFormData] = useState(initialAddressData)

  const handleAddAddress = () => {
    setFormData(initialAddressData)
    setCurrentEditId(null)
    setShowModal(true)
  }

  const handleEditAddress = (address) => {
    setFormData({
      address: address.address,
      city: address.city,
      pincode: address.zipcode || address.pincode,
      phone: address.phone,
      notes: address.notes || ''
    })
    setCurrentEditId(address._id || address.id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (currentEditId) {
        // Edit existing address
        const response = await fetch(`http://localhost:5000/api/shop/address/update/${user.id}/${currentEditId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const result = await response.json();
        if (result.success) {
          setAddressList(prev => prev.map(addr => 
            addr._id === currentEditId ? result.data : addr
          ));
        }
      } else {
        if(addressList.length==3){
          toast.error("You can only have up to 3 addresses.");
          return;
        }
        // Add new address
        const addressData = {
          userId: user.id,
          ...formData
        };
        
        const response = await fetch(`http://localhost:5000/api/shop/address/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData),
        });
        
        const result = await response.json();
        console.log(result);
        
        if (result.success) {
          setAddressList(prev => [...prev, result.data]);
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      // Fallback to local state management if backend is not available
      if (currentEditId) {
        setAddressList(prev => prev.map(addr => 
          addr.id === currentEditId 
            ? { 
                ...addr, 
                address: formData.address,
                city: formData.city,
                zipcode: formData.pincode,
                phone: formData.phone,
                notes: formData.notes
              }
            : addr
        ))
      } else {
        const newAddress = {
          id: Date.now(),
          type: formData.type || 'Home',
          name: user.name || 'John Doe',
          address: formData.address,
          city: formData.city,
          state: formData.state || 'NY',
          zipcode: formData.pincode,
          phone: formData.phone,
          notes: formData.notes,
          isDefault: false
        }
        setAddressList(prev => [...prev, newAddress])
      }
    }
    
    setShowModal(false)
    setFormData(initialAddressData)
    setCurrentEditId(null)
  }

  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shop/address/delete/${user.id}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        setAddressList(prev => prev.filter(addr => addr._id !== id));
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      // Fallback to local state management
      setAddressList(prev => prev.filter(addr => addr.id !== id));
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setFormData(initialAddressData)
    setCurrentEditId(null)
  }

  return( 
    <>
      <div className="addresses-section">
        <div className="section-header">
         {!isCheckout && <h2>Saved Addresses</h2>}
          <p>Manage your delivery addresses</p>
          <button className="add-address-btn" onClick={handleAddAddress}>
            <FiPlus />
            Add New Address
          </button>
        </div>
<div className="addresses-grid">
  {addressList.map((address) => (
    <div 
      key={address._id || address.id} 
      className="address-card"
      onClick={() => isCheckout && handleSelectAddress(address)} 
      style={{
        border: isCheckout && selectedAddress && selectedAddress._id === address._id ? '2px solid blue' : '1px solid #ccc', 
        cursor: isCheckout ? 'pointer' : 'default'
      }}
    >
      <div className="address-header">
        <div className="address-type">
          <FiMapPin />
          {address.type}
        </div>
        {address.isDefault && (
          <span className="default-badge">Default</span>
        )}
        <button className="edit-address-btn" onClick={() => handleEditAddress(address)}>
          <FiEdit2 size={16} />
        </button>
      </div>
      <div className="address-body">
        <h4 className="address-name">{address.name}</h4>
        <p className="address-line">{address.address}</p>
        <p className="address-city">{address.city}, {address.state} {address.zipcode}</p>
        <p className="address-phone">{address.phone}</p>
        {address.notes && <p className="address-notes">{address.notes}</p>}
      </div>
      <div className="address-actions">
        <button className="btn-secondary" onClick={() => handleEditAddress(address)}>Edit</button>
        <button className="btn-danger" onClick={() => handleDeleteAddress(address._id || address.id)}>Delete</button>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* Modal for Add/Edit Address */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentEditId ? 'Edit Address' : 'Add New Address'}</h3>
              <button className="modal-close" onClick={closeModal}>
                <FiX size={24} />
              </button>
            </div>
            <div className="modal-body">
              <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                buttonText={currentEditId ? 'Update Address' : 'Add Address'}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}