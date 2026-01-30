import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faBicycle,
  faPersonWalking,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import SaveRouteModal from "../Routes/SaveRouteModal";

function Controls({
  markers,
  setMarkers,
  routeType,
  setRouteType,
  transportation,
  setTransportation,
  handleOptimizeRoute,
  handleClear,
}) {
  const fileInputRef = useRef(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleImportCsv = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const latLngArray = results.data.map((row) => [
          parseFloat(row.Lat),
          parseFloat(row.Lng),
        ]);
        setMarkers(() => [...latLngArray]);
        console.log("Extracted:", latLngArray);
      },
    });
  };

  return (
    <>
      <div className="btn-group w-100 mb-3" role="group">
        <button
          type="button"
          className={`btn ${routeType === "round_trip" ? "btn-primary" : "btn-outline-primary"
            }`}
          onClick={() => setRouteType("round_trip")}
        >
          Round Trip
        </button>
        <button
          type="button"
          className={`btn ${routeType === "one_way" ? "btn-primary" : "btn-outline-primary"
            }`}
          onClick={() => setRouteType("one_way")}
        >
          One-Way Route
        </button>
      </div>

      <div className="btn-group w-100 mb-3" role="group">
        <button
          type="button"
          className={`btn ${transportation === "driving-car"
              ? "btn-primary"
              : "btn-outline-primary"
            }`}
          onClick={() => setTransportation("driving-car")}
        >
          <FontAwesomeIcon icon={faCar} />
        </button>
        <button
          type="button"
          className={`btn ${transportation === "cycling-regular"
              ? "btn-primary"
              : "btn-outline-primary"
            }`}
          onClick={() => setTransportation("cycling-regular")}
        >
          <FontAwesomeIcon icon={faBicycle} />
        </button>
        <button
          type="button"
          className={`btn ${transportation === "foot-walking"
              ? "btn-primary"
              : "btn-outline-primary"
            }`}
          onClick={() => setTransportation("foot-walking")}
        >
          <FontAwesomeIcon icon={faPersonWalking} />
        </button>
      </div>

      <button
        onClick={handleOptimizeRoute}
        className="btn btn-success w-100 mb-2"
      >
        Optimize Route
      </button>

      <button
        onClick={() => setShowSaveModal(true)}
        className="btn btn-info w-100 mb-2"
        disabled={markers.length < 2}
        title={markers.length < 2 ? "At least 2 markers are required to save a route" : "Save Route"}
      >
        <FontAwesomeIcon icon={faSave} className="me-2" />
        Save Route
      </button>

      <button onClick={handleClear} className="btn btn-danger w-100">
        Clear All Markers
      </button>

      <button
        onClick={handleImportCsv}
        className="btn btn-secondary w-100 mt-2"
      >
        Import CSV
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <SaveRouteModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        markers={markers}
        routeType={routeType}
        transportation={transportation}
      />
    </>
  );
}

export default Controls;
