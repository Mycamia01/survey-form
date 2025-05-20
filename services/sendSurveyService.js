export async function sendSurveyNotification({ recipient, medium, surveyLink }) {
  const url = process.env.NEXT_PUBLIC_SEND_API;

  if (!url) {
    console.error("Error: Notification API URL is not defined in .env.local");
    throw new Error("Notification API URL missing");
  }

  const payload = {
    name: recipient.name,
    email: recipient.email,
    phone: recipient.phone,
    medium, // "email" | "sms" | "whatsapp"
    surveyLink,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");

    // Check if response is JSON
    if (!contentType || !contentType.includes("application/json")) {
      const rawText = await res.text();
      console.error("API returned non-JSON response:\n", rawText);
      throw new Error("API did not return JSON response");
    }

    const result = await res.json();

    if (!res.ok) {
      console.error("API error response:", result);
      throw new Error(result.message || "Failed to send survey notification");
    }

    console.log("Survey notification sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending survey notification:", error.message);
    throw error;
  }
}
