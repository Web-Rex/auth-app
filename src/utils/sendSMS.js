const config = require("../config/config.json");
const Vonage = require("@vonage/server-sdk");

const sendSMS = async (options) => {
  const vonage = new Vonage(
    {
      apiKey: config.SMS_API_KEY,
      apiSecret: config.SMS_SECRET,
    },
    { debug: true }
  );

  vonage.message.sendSms(
    config.SMS_FROM,
    options.number,
    options.text,
    (err, responseData) => {
      if (err) {
        return(err.message);
      } else {
        if (responseData.messages[0]["status"] === "0") {
            return("Message sent successfully.");
        } else {
            return(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    }
  );

};

module.exports = sendSMS