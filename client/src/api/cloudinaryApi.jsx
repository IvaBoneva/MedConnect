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
            },
        );
        const json = await res.json();

        if (!res.ok) {
            throw new Error(
                json.error?.message || "Unknown error occurred during upload.",
            );
        }

        return json.secure_url;
    } catch (error) {
        console.error("Upload failed:", error.message);
        return null;
    }
}


