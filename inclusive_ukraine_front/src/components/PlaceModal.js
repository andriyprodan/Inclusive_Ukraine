import Modal from "react-modal";


export default function PlaceModal({selectedPlace, isModalOpen, closeModal, loading}) {
    return <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Place Information"
        style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fff",
              maxWidth: "400px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              zIndex: 1010,
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 1005,
            },
          }}
    >
        {loading ? (
        <p>Завантаження...</p>
        ) : selectedPlace ? (
        <div>
            <h2>{selectedPlace.name}</h2>
            <p><strong>Адреса:</strong> {selectedPlace.address}</p>
            <p><strong>Опис:</strong> {selectedPlace.description}</p>

            {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px", marginTop: "20px" }}>
                {selectedPlace.photos.map((photo, index) => (
                    <a key={index} href={photo.photo} target="_blank" rel="noopener noreferrer">
                    <img
                        src={photo.photo}
                        alt={`Photo ${index + 1}`}
                        style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                    />
                    </a>
                ))}
                </div>
            ) : (
                <p>Фото відсутні.</p>
            )}

            <button onClick={closeModal}>Закрити</button>
        </div>
        ) : (
        <p>Помилка завантаження даних про місце.</p>
        )}
    </Modal>;
}