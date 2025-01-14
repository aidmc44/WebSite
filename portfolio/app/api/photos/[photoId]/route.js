import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { photoId } = await params; // Await params to ensure it's resolved
  const sharedLinkKey =
    "34Z8qXJQDTJBOCTEqN_sjy9fYuWU0yeuhKoQHQtY7aOj73RtXZYyN70qk8G4Qnez37Y";
  const apiUrl = `https://immich.aidenmcdougald.com/api/assets/${photoId}/thumbnail?size=preview&key=${sharedLinkKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch photo: ${response.statusText}`);
    }

    // Return the image data
    const imageBlob = await response.blob();
    return new Response(imageBlob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type"),
      },
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json({ error: "Failed to fetch photo" }, { status: 500 });
  }
}
