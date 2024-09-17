import React, { useState } from 'react';
import './ImageUploaderComponent.css';

const ImageUploaderComponent = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // Pozivamo callback funkciju koja će biti zadužena za rad sa odabranom slikom
    onImageUpload(file);
  };

  return (
    <div className="image-uploader-container">
      <input type="file" accept="image/*" onChange={handleImageChange} className="file-input"/>
      {selectedImage && (
        <div className="preview-container">
          <p><b>Odabrana slika:</b> {selectedImage.name}</p>
          <img src={URL.createObjectURL(selectedImage)} alt="Odabrana slika" className="image-preview"/>
        </div>
      )}
    </div>
  );
};

export default ImageUploaderComponent;
