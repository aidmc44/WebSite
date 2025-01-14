import { NextResponse } from "next/server";

export async function GET() {
    const sharedLinkKey =
    "34Z8qXJQDTJBOCTEqN_sjy9fYuWU0yeuhKoQHQtY7aOj73RtXZYyN70qk8G4Qnez37Y";
  const apiUrl = `https://immich.aidenmcdougald.com/api/shared-links/me?key=${sharedLinkKey}`;
  try { 
    const response = await fetch(apiUrl, {
        headers: {
            "Cache-Control": "no-cache",
        },
        });
    
        if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.statusText}`);
        }
    
        const data = await response.json();
        return NextResponse.json(data);      
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}