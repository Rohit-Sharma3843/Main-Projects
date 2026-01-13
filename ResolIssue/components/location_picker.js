"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
});

export default function LocationPicker() {
  const [location, setLocation] = useState("");
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const [suggestions, setSuggestions] = useState([]);

  const debounceRef = useRef(null);

  const handleMapSelect = (name, lat, lon) => {
    setLocation(name);
    setPosition([lat, lon]);
    setSuggestions([]);
  };

  const handleInputChange = (value) => {
    setLocation(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!value) {
        setSuggestions([]);
        return;
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}&limit=5`,
        {
          headers: { "User-Agent": "your-app-name" },
        }
      );

      const data = await res.json();
      setSuggestions(data);
    }, 1000);
  };

  const selectSuggestion = (item) => {
    setLocation(item.display_name);
    setPosition([parseFloat(item.lat), parseFloat(item.lon)]);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        value={location}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search location"
        className="border p-2 w-full"
      />

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #ccc",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              onClick={() => selectSuggestion(item)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}

      <MapPicker position={position} onSelect={handleMapSelect} />
    </div>
  );
}
