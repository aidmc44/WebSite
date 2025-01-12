import styles from "./photography.module.css";

async function fetchPhotos() {
  const sharedLinkKey =
    "34Z8qXJQDTJBOCTEqN_sjy9fYuWU0yeuhKoQHQtY7aOj73RtXZYyN70qk8G4Qnez37Y";
  const apiUrl = `https://immich.aidenmcdougald.com/api/shared-links/me?key=${sharedLinkKey}`;
  try {
    const response = await fetch(apiUrl, { next: { revalidate: 60 } }); // Cache for 60 seconds
    if (!response.ok) {
      throw new Error("Failed to fetch photos");
    }
    const data = await response.json();
    return data.assets.map((asset) => ({
      id: asset.id,
      url: `https://immich.aidenmcdougald.com/api/assets/${asset.id}/thumbnail?size=preview&key=${sharedLinkKey}`, // Adjust as needed
      alt: asset.description || "Photo",
    }));
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}

export default async function Photography() {
  const photos = await fetchPhotos();

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
            <div key={photo.id} className={styles.card}>
              <img
                src={photo.url}
                alt={photo.alt || "Photo"}
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
