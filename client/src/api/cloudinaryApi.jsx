// TODO: download contend in cloudinary

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
      // If the response is not ok, throw an error with the response message
      const errorData = await res.json();
      throw new Error(errorData.error.message || "Unknown error occurred during upload.");
    }

    const json = await res.json();
    return json.secure_url; // Return the secure URL if the upload is successful

  } catch (error) {
    // Handle the error here without blocking the program
    console.error("Upload failed:", error.message);
    return null; // Return null or any other value indicating failure
  }
}
export async function uploadToCloudinary(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "userPhoto");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dfnja74fz/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  return json.secure_url;
}

