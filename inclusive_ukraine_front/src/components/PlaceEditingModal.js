import React, { useState } from "react";
import Modal from "react-modal";

const PlaceEditingModal = ({ place, onSave, onClose }) => {
  const [formData, setFormData] = useState({ name: place.name || "", photos: place.photos || [] });

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const photoUrl = URL.createObjectURL(file); // Replace with actual upload API
    setFormData((prevData) => ({
      ...prevData,
      photos: [...prevData.photos, { photo: photoUrl }],
    }));
  };

  const handlePhotoRemove = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = () => {
    const updatedPlace = {
      ...place,
      ...formData,
    };
    onSave(updatedPlace);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Створення/редагування місця"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "400px",
        },
      }}
    >
      <h2>{place.id ? "Редагування місця" : "Створення місця"}</h2>
      <form>
        <div>
          <label>Назва:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prevData) => ({ ...prevData, name: e.target.value }))
            }
          />
        </div>
        <div>
          <label>Фото:</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {formData.photos.map((photo, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100px",
                  overflow: "hidden",
                  borderRadius: "5px",
                }}
              >
                <img
                  src={photo.photo}
                  alt="uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handlePhotoRemove(idx)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span>&times;</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={handleSubmit}>
          Зберегти
        </button>
        <button type="button" onClick={onClose}>
          Скасувати
        </button>
      </form>
    </Modal>
  );
};

export default PlaceEditingModal;
