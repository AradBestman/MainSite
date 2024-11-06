let linkApi =
  "https://api.open-meteo.com/v1/forecast?latitude=31.971&longitude=34.7894&hourly=temperature_2m,rain,snowfall,snow_depth&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,windgusts_10m_max&timezone=auto";

//Request with promise from the server...// /and Set a Global Variable for Api Link//
const promiseFunc = () => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onload = () => {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(error);
      }
    };
    request.open("GET", linkApi);
    request.send();
  });
};

const data = async () => {
  try {
    let data = await promiseFunc();
    // console.log(data);
    // console.log(data.results);
    transferJson(data);
  } catch (err) {
    console.log(err);
  }
};

const transferJson = (data) => {
  let dataObj = JSON.parse(data);
  console.log(dataObj);
  process(dataObj);
};

window.addEventListener("load", () => {
  data();
});

// Taking data from the Api link and do the process, by setting a parameter
const process = (dataObj) => {
  let Temp = document.getElementById("temperature");
  let hour = new Date();
  console.log(hour.getHours());
  Temp.innerHTML = dataObj.hourly.temperature_2m[hour.getHours()] + " &#8451";
  let time = document.getElementById("time");
  time.innerHTML = hour.getHours() + ":" + hour.getMinutes();
  let windspeed = document.getElementById("windspeed");
  windspeed.innerText =
    "min: " +
    dataObj.daily.windgusts_10m_max[0] +
    " max: " +
    dataObj.daily.windgusts_10m_max[dataObj.daily.windgusts_10m_max.length - 1];
  let ahoz = document.getElementById("ahoz");
  ahoz.innerText = dataObj.hourly.rain[0] + "%";
};

new Promise((resolve, reject) => {});
