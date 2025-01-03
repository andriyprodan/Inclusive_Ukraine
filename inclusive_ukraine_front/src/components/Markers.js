import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
    AdvancedMarker,
    useMap
} from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

import CustomMarker from "./CustomMarker";


const Markers = ({ user, points, onMarkerClick, onEditableMarkerClick, settlement }) => {
    const map = useMap();
    const [markers, setMarkers] = useState({});
    const clusterer = useRef(null);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // useEffect(() => {
    //     clusterer.current?.clearMarkers();
    // }, [points]);

    // useEffect(() => {
    //     clusterer.current?.clearMarkers();
    //     clusterer.current?.addMarkers(Object.values(markers));
    // }, [markers]);

    useEffect(() => {
        // zoom to settlement bounds if settlement is changed
        if (!settlement) return;
        zoomSettlement();
    }, [settlement]);

    const zoomSettlement = () => {
        const bounds_data = settlement.bounds;
        if (!bounds_data) return;
        const bounds = new window.google.maps.LatLngBounds(
          { lat: bounds_data.southwest.lat, lng: bounds_data.southwest.lng },
          { lat: bounds_data.northeast.lat, lng: bounds_data.northeast.lng }
        );
        // якийсь баг, що треба викликати двічі
        map.fitBounds(bounds);
        map.fitBounds(bounds);
    };

    // const zoomToLargestCluster = () => {
    //     if (!clusterer.current || !map) return;

    //     const clusters = clusterer.current.clusters;
    //     if (clusters.length === 0) return;

    //     // Знайти найбільший кластер
    //     let largestCluster = clusters[0];
    //     clusters.forEach((cluster) => {
    //         if (cluster.count > largestCluster.count) {
    //             largestCluster = cluster;
    //         }
    //     });

    //     // Отримати межі найбільшого кластеру
    //     const bounds = largestCluster.getBounds();
    //     if (bounds) {
    //         map.fitBounds(bounds);
    //     }
    // };

    // const setMarkerRef = (marker, id) => {
    //     if (marker && markers[id]) return;
    //     if (!marker && !markers[id]) return;

    //     setMarkers(prev => {
    //         if (marker) {
    //             return { ...prev, [id]: marker };
    //         } else {
    //             const newMarkers = { ...prev };
    //             delete newMarkers[id];
    //             return newMarkers;
    //         }
    //     });
    // };

    return <>
        {points && points.map(point => (
            <CustomMarker
                user={user}
                point={point}
                key={point.id}
                clusterer={clusterer.current}
                // ref={marker => setMarkerRef(marker, point.id)}
                onReadonlyClickHandler={onMarkerClick}
                onEditableClickHandler={onEditableMarkerClick}
            ></CustomMarker>
        ))}
    </>;
}

export default Markers;