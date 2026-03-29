const sendPushNotification = async (pushToken, title, body) => {
  if (!pushToken) return;

  const message = {
    to: pushToken,
    sound: "default",
    title,
    body,
    data: {},
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(message),
  });
};

export default sendPushNotification;
