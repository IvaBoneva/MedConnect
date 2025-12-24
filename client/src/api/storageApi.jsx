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
      return data; 
    } else {
      throw new Error("Failed to fetch files");
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error; 
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
        name: file.name, 
        size: file.size, 
        type: file.type, 
        dateOfUpload: file.dateOfUpload, 
        fileCloudinaryUrl: file.fileCloudinaryUrl, 
      }),
    });

    if (!response.ok) {
      throw new Error("Error saving file to the database");
    }
  } catch (error) {
    console.error("Failed to save file to the database", error);
    throw error; 
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

    return "File deleted successfully"; 
  } catch (error) {
    console.error("Error deleting the file:", error);
    throw error; 
  }
};
