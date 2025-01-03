import React from 'react';
import {
    AdvancedMarker,
    useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";

const CustomMarker = ({ user, point, clusterer, onReadonlyClickHandler, onEditableClickHandler }) => {
  // Marker Ref
  const [refCallback, marker] = useAdvancedMarkerRef();

  React.useEffect(() => {
    if (!clusterer || !marker) return;
    clusterer.addMarker(marker);

    return () => {
      clusterer.removeMarker(marker);
    };
  }, [clusterer, marker]);

   // user is the owner of the point and the point is not confirmed yet
  if (user && !point.is_confirmed && user.id == point.creator_id) {
    return (
      <AdvancedMarker
        position={{ lat: parseFloat(point.lat), lng: parseFloat(point.lng) }}
        key={point.id}
        ref={refCallback}
        gmpClickable
        onClick={() => onEditableClickHandler(point.id)}
      >
          <span style={{ fontSize: "2rem" }}>❓</span>
      </AdvancedMarker>
    );
  } 

  return (
    <AdvancedMarker
      position={{ lat: parseFloat(point.lat), lng: parseFloat(point.lng) }}
      key={point.id}
      ref={refCallback}
      gmpClickable
      onClick={() => onReadonlyClickHandler(point.id)}
    >
        <span style={{ fontSize: "2rem" }}>👍</span>
    </AdvancedMarker>
  );
};

export default CustomMarker;