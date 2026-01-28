export const callDoctorAdvice = async (token, userInput) => {
    const response = await fetch("http://localhost:8080/api/aiDoctor/callGemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            conversationId: "default",
            userInputText: userInput,

        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return await response.json();
};
