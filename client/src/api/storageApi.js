

export const fetchFiles = async (userId, token) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/storage/getFiles/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data; // Return fetched data
    } else {
      throw new Error("Failed to fetch files");
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};

export const saveFileToDatabase = async (file, userId, token) => {
  try {
    const response = await fetch("http://localhost:8080/api/storage/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId,
        name: file.name, // File name
        size: file.size, // File size (MB or KB)
        type: file.type, // File type
        dateOfUpload: file.dateOfUpload, // Upload date
        fileCloudinaryUrl: file.fileCloudinaryUrl, // Cloudinary URL
      }),
    });

    if (!response.ok) {
      throw new Error("Error saving file to the database");
    }
  } catch (error) {
    console.error("Failed to save file to the database", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};


export const deleteFileFromDatabase = async (fileId, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/storage/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error deleting the file");
    }

    return "File deleted successfully"; // Return success message
  } catch (error) {
    console.error("Error deleting the file:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};
