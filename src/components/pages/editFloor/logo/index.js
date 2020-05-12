import React, {useState} from "react";

const Logo = ({ values, setImageAsFile }) => {
    
    const [selectedImage, setSelectedImage] = useState(null);

    
    const handleImageAsFile = (e) => {
        const image = e.target.files[0];
        setImageAsFile(() => image);
        setSelectedImage(URL.createObjectURL(image));
    };
    
  return (
    <div className="edit-floor__section">
      <div className="edit-floor__section-title">Add your logo</div>
      <span>
        <label
          htmlFor="edit-floor-logo"
          className="new-floor-plan__image-container"
        >
          <img
            className="new-floor-plan__image-preview clickable"
            src={
              selectedImage ||
              (values && values.logo) ||
              "../../imgs/placeholder.jpg"
            }
            alt="Logo"
          />
        </label>
        <input
          id="edit-floor-logo"
          className="update-profile__upload"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleImageAsFile}
        />
      </span>
    </div>
  );
};

export default Logo;
