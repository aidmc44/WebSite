"use client";

import styles from "./photography.module.css";
import { useState, useEffect } from "react";

async function fetchPhotos() {
  const sharedLinkKey =
  "34Z8qXJQDTJBOCTEqN_sjy9fYuWU0yeuhKoQHQtY7aOj73RtXZYyN70qk8G4Qnez37Y";

  try {
    const response = await fetch("/api/photos", {
      headers: {
        "Cache-Control": "no-cache", // Ensure fresh data
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch photos");
    }

    const data = await response.json();
    return data.assets.map((asset) => ({
      id: asset.id,
      url: `https://immich.aidenmcdougald.com/api/assets/${asset.id}/thumbnail?size=thumbnail&key=${sharedLinkKey}`,
      fullUrl: `https://immich.aidenmcdougald.com/api/assets/${asset.id}?key=${sharedLinkKey}`,
      alt: asset.description || "Photo",
    }));
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}

export default function Photography() {
  const [photos, setPhotos] = useState([]);
  const [popup, setPopup] = useState({ isOpen: false, photo: null });

  useEffect(() => {
    const loadPhotos = async () => {
      const fetchedPhotos = await fetchPhotos();
      setPhotos(fetchedPhotos);
    };
    loadPhotos();
  }, []);

  const openPopup = (photo) => {
    const proxiedFullUrl = `/api/photos/${photo.id}`; // Proxy full-size photo request
    setPopup({ isOpen: true, photo: { ...photo, fullUrl: proxiedFullUrl } });
  };
  
  const closePopup = () => {
    setPopup({ isOpen: false, photo: null });
  };

  return (
    <div
      style={{
        overflow: "auto",
        height: "100%",
      }}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Photography Portfolio</h1>
        <div className={styles.grid}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={styles.card}
              onClick={() => openPopup(photo)}
            >
              <img
                src={photo.url}
                alt={photo.alt || "Photo"}
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </div>

      {popup.isOpen && (
        <div className={styles.popupOverlay} onClick={closePopup}>
            <img
              src={popup.photo.fullUrl}
              alt={popup.photo.alt}
              className={styles.popupImage}
            />
        </div>
      )}
    </div>
  );
}
