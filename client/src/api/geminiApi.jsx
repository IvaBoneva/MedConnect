const DOCTOR_ADVICE_URL = `${process.env.REACT_APP_API_URL}/api/aiDoctor/callGemini`;

export const callDoctorAdvice = async (token, userInput) => {
  const response = await fetch(`${DOCTOR_ADVICE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userInputText: userInput,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};
