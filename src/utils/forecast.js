const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=db10ec7de18e3fdd3022c3c67c5d52a4&query=${latitude},${longitude}&units=f`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        `<img src="${body.current.weather_icons[0]}"><p><b>Local date/time:</b> ${body.location.localtime}. <b>Conditions:</b> ${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out, but it feels like it's ${body.current.feelslike} degrees out. The humidity is ${body.current.humidity} percent.</p>`
      );
    }
  });
};

module.exports = forecast;
