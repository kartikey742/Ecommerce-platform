import { useState ,useEffect,useRef} from "react";
import { addProductFormElements } from "../../../config"; 
import ImageUpload from "./ImageUpload";
import { IoAdd } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { MdSave } from "react-icons/md";
import '../../../css/AdminView.css';

export default function AddProductModal({ editingProduct,fetchProducts,setEditingProduct }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({});
const [uploading, setUploading] = useState(false);
const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    console.log(editingProduct);
    
    if (editingProduct) {
      setFormData(editingProduct);
      setOpen(true); 
    }
  }, [editingProduct]);
 
 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Product Data:", formData);
let url=`${process.env.REACT_APP_BASE_URL}/admin/products/add`;
let method="POST";
if(editingProduct){
    url=`${process.env.REACT_APP_BASE_URL}/admin/products/edit/${editingProduct._id}`;
method="PUT";    
}
    const res = await fetch(
      url,
      {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      fetchProducts(); // refresh list
      setOpen(false); // close modal
      setEditingProduct(null);
      setFormData({});
      setPreview(null);
      
      // clear only file input
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

   return (
    <div className="add-product-wrapper">
      <button className="add-product-open-btn" onClick={() =>{ setOpen(true) 
        }}>
         <IoAdd className="add-product-btn-icon" />
         Add Product
      </button>
 
      {open && (
        <div
          className="add-product-overlay"
          onClick={() => setOpen(false)}
        >
          <div 
            className={`add-product-modal ${open ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
        <div className="add-product-header">
          <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
          <button
          disabled={uploading}
            className="add-product-close-btn"
            onClick={() => {
                setOpen(false);
                setEditingProduct(null);
                setFormData({});
                setPreview(null);
                if (fileRef.current) {
                  fileRef.current.value = "";
                }
            }}
          >
            <MdClose />
          </button>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
      <ImageUpload
        name="productImage"
        setFormData={setFormData}
        setOpen={setOpen}
        uploading={uploading}
        setUploading={setUploading}
        formData={formData}
        editingProduct={editingProduct}
        fileRef={fileRef}
        preview={preview}
        setPreview={setPreview}
      />
          {addProductFormElements.map((field) => (
            <div key={field.name} className="add-product-form-group">
              <label htmlFor={field.name}>{field.label}</label>

              {field.componentType === "input" && (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  required={field.name !== "salePrice"}
                    value={formData[field.name] || ""}
                />
              )}

              {field.componentType === "textarea" && (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  required
                    value={formData[field.name] || ""}
                ></textarea>
              )}

              {field.componentType === "select" && (
                <select name={field.name} onChange={handleChange} required value={formData[field.name] || ""}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button type="submit" className="add-product-submit-btn" disabled={uploading}>
            {uploading ? (
              "Uploading Image to cloudinary..."
            ) : (
              <>
                {editingProduct ? <MdSave className="add-product-btn-icon" /> : <IoAdd className="add-product-btn-icon" />}
                {editingProduct ? "Save Changes" : "Add Product"}
              </>
            )}
          </button>
        </form>
          </div>
        </div>
      )}
    </div>
  );
}
