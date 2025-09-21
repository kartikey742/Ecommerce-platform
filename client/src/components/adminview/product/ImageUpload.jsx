
import { useState ,useEffect} from "react";


export default function ImageUpload({ fileRef,name,setFormData,setPreview,preview,uploading,setUploading, formData ,editingProduct}) {
    
    
 useEffect(() => {

    console.log(formData);
    
    if (formData[name]) {
        
      setPreview(formData[name]);
    }
    else
        setPreview(null);
  }, [formData[name]]);

  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    if (!file) return;
        setPreview(URL.createObjectURL(file));
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); 
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME); 

try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      console.log(result);
     setFormData(prev => ({ ...prev, [name]: result.secure_url }));
     
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
       
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-wrapper">
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={handleFileChange}
        required={editingProduct?false:true}
        disabled={uploading}
         ref={fileRef}   
      />
      {preview && <img src={preview} alt="preview" style={{ maxHeight: "200px" }} />}
    </div>
  );
}
