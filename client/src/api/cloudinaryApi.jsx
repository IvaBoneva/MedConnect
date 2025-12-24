export async function uploadToCloudinary(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "userPhoto");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfnja74fz/raw/upload",
      {
        method: "POST",
        body: data,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error.message || "Unknown error occurred during upload.");
    }

    const json = await res.json();
    return json.secure_url; 

  } catch (error) {
    console.error("Upload failed:", error.message);
    return null; 
  }
}


