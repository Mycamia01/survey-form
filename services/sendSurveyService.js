export async function sendSurveyNotification({ recipient, medium, surveyLink }) {
  const url = process.env.NEXT_PUBLIC_SEND_API; // Store in .env

  const payload = {
    name: recipient.name,
    email: recipient.email,
    phone: recipient.phone,
    medium, // "sms" | "email" | "whatsapp"
    surveyLink,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
