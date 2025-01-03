import {
  APIProvider,
  Map
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import apiClient, {authApiClient} from "../api/axios";
import Markers from "./Markers";
import PlaceModal from "./PlaceModal";
import SettlementSearch from "./SettlementSearch";
import PlaceEditingModal from "./PlaceEditingModal";

// Обмежуємося тільки Україною
const UkraineBounds = {
  north: 52.3350745713,
  south: 44.3614785833,
  east: 40.0807890155,
  west: 22.0856083513,
};

const center = {
  lat: 48.3794, // Центр карти (наприклад, Україна)
  lng: 31.1656,
};

const MODES = {
  // different modes for the map
  VIEWING: "VIEWING",
  ADDING: "ADDING",
  EDITING: "EDITING",
  CHOOSING_POINT: "CHOOSING_POINT",
};

async function urlToFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

export default function UkraineMap({user}) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false); // Для індикації завантаження даних
  const [chosenSettlement, setChosenSettlement] = useState(null);

  // used for viewing, adding or editing a place
  const [mode, setMode] = useState(undefined);
  const [selectedPlace, setSelectedPlace] = useState(null);
  // ONLY PLACES ADDED BY A USER CAN BE EDITED BY THE SAME USER
  // PLACES APPROVED FROM ADMIN CAN'T BE EDITED ANYMORE
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Функція для отримання деталей про місце
  const fetchPlaceDetails = (placeId) => {
    setLoading(true); // Почати завантаження
    authApiClient
      .get(`places/${placeId}/`) // Замініть на ваш API для деталей
      .then((response) => {
        setSelectedPlace(response.data); // Встановити вибране місце
        setLoading(false); // Завершити завантаження
      })
      .catch((error) => {
        console.error("Error fetching place details:", error);
        setLoading(false);
      });
  };

  // Функція для закриття модального вікна
  const closeViewingModal = () => {
    setSelectedPlace(null); // Очистити вибране місце
    setMode(undefined);
    setIsViewingModalOpen(false); // Закрити модальне вікно
  };

  const closeEditingModal = () => {
    setSelectedPlace(null); // Очистити вибране місце
    setMode(undefined);
    setIsEditingModalOpen(false); // Закрити модальне вікно
  };

  const handleChooseSettlement = (settlement) => {
    // get settlement bounds data in format {"northeast": {"lat": ..., "lng": ...}, "southwest": {"lat": ..., "lng": ...}}
    apiClient.get(`settlements/${settlement.id}/`).then((response) => {
      setChosenSettlement(response.data);
    });
    // get all the points for the settlement
  };

  const enableViewingPlace = (placeId) => {
    fetchPlaceDetails(placeId);
    setMode(MODES.VIEWING);
  };

  // choosing a point on the map to add a new place
  const enableAddingPlace = () => {
    setMode(MODES.CHOOSING_POINT);
    setMessage("Клацніть на карті, щоб додати нове місце.");
  };

  const enableEditingPlace = (placeId) => {
    // editing of places added by the current user are only allowed
    fetchPlaceDetails(placeId);
    setMode(MODES.EDITING);
    // setIsEditingModalOpen(true);
    // setMessage("");
  };

  useEffect(() => {
    if (selectedPlace) {
      if (mode === MODES.EDITING || mode === MODES.ADDING) {
        setIsEditingModalOpen(true);
        setMessage("");
      } else if (mode === MODES.VIEWING) {
        setIsViewingModalOpen(true);
        setMessage("");
      }
    }
    if (mode === undefined) {
      setIsViewingModalOpen(false);
      setIsEditingModalOpen(false);
      setMessage("");
      setSelectedPlace(null);
    }
  }, [selectedPlace, mode]);


  // const disableEditing = () => {
  //   setIsAddingPlace(false);
  //   setSelectedPlace(null);
  //   setMessage("");
  // };

  const handleMapClick = (e) => {
    if (mode !== MODES.CHOOSING_POINT) return;
    const newPlace = {
      id: null, // Temporary id
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
      name: "",
      photos: [],
    };
    setSelectedPlace(newPlace);
    setMode(MODES.ADDING);
  };

  const handleSavePlace = async (updatedPlace) => {
    const formData = new FormData();

    formData.append("name", updatedPlace.name);
    formData.append('lat', updatedPlace.lat);
    formData.append('lng', updatedPlace.lng);

    // Append photos to FormData
    for (let i = 0; i < updatedPlace.photos.length; i++) {
      // convert photo to the file
      const file = await urlToFile(updatedPlace.photos[i].photo, `photo_${i}.jpg`);
      formData.append("photos", file); // Make sure the backend accepts this key
    }

    try {
      if (updatedPlace.id) {
        // Edit existing place
        authApiClient.put(`places/${updatedPlace.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response) => {
          response.data.lat = parseFloat(response.data.lat);
          response.data.lng = parseFloat(response.data.lng);
          setPoints((prevPoints) => {
            return prevPoints.map((p) => (p.id === response.data.id ? response.data : p));
          });
          setMode(undefined);
        });
      } else {
        // Add new place
        authApiClient.post(`places/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response) => {
          response.data.lat = parseFloat(response.data.lat);
          response.data.lng = parseFloat(response.data.lng);
          setPoints((prevPoints) => [...prevPoints, response.data]);
          setMode(undefined);
        });
      }
      // onSave(updatedPlace);
    } catch (error) {
      console.error("Error saving place:", error);
    }
  };

  useEffect(() => {
    // Запит до сервера для отримання місць
    let url = 'places/';
    if (chosenSettlement) {
      url += `?settlement=${chosenSettlement.id}`;
    }
    authApiClient.get(url).then((response) => {
      let places = response.data;
      places.forEach((place) => {
        place.lat = parseFloat(place.geolocation.split(",")[0]);
        place.lng = parseFloat(place.geolocation.split(",")[1]);
      });
      setPoints(places);
    });
    // Приклад даних
    // setPoints([
    //   { id: 1, lat: 48.3794, lng: 31.1656 },
    //   { id: 2, lat: 48.3794, lng: 31.1656 },
    // ]);
  }, [chosenSettlement]);

  return (<>
    <APIProvider apiKey={"AIzaSyAKd2mJ5N4dhOs5j_LaW3UCtuCs-UZRoEE"}>
      <Map
        defaultCenter={center}
        defaultZoom={6}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        style={{ height: "100vh", width: "100vw" }}
        onClick={handleMapClick}
        options={{
          restriction: {
            latLngBounds: UkraineBounds,
            strictBounds: false,
          },
        }}
        mapId={"2a397be410520288"}
      >
        <Markers user={user} points={points} onMarkerClick={enableViewingPlace} onEditableMarkerClick={enableEditingPlace} settlement={chosenSettlement}/>
      </Map>
      
      <PlaceModal selectedPlace={selectedPlace} isModalOpen={isViewingModalOpen} closeModal={closeViewingModal} loading={loading} />
      
      <SettlementSearch settlementChosenCallback={handleChooseSettlement}/>
      
      {isEditingModalOpen && (
        <PlaceEditingModal
          place={selectedPlace}
          onSave={handleSavePlace}
          isModalOpen={isEditingModalOpen}
          onClose={closeEditingModal}
        />
      )}
      {message && (
          <div
            style={{
              position: "absolute",
              top: 60,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              background: "#fff",
              padding: "10px 20px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            {message}
          </div>
        )}
      { user && (
        <button
          onClick={enableAddingPlace}
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            zIndex: 1000,
            padding: "10px 20px",
            background: "green",
            color: "#fff",
            borderRadius: "5px",
          }}
        >
          Додати місце
        </button>
      )}
    </APIProvider>
  </>)
}

