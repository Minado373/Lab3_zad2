const backendAPI = "http://localhost:3000/api";
const stationsButton = document.getElementById("stationsButton");
const stationsTable = document.getElementById("stationsTable");
const stationsBody = document.getElementById("stationsBody");
const resultMessage = document.getElementById("resultMessage");
const loader = document.getElementById("loader");

const displayMessage = (message, color = "black") => {
  resultMessage.style.visibility = "visible";
  resultMessage.style.color = color;
  resultMessage.textContent = message;
};

const handleTableVisibility = (mode) => {
  stationsTable.style.visibility = mode === "visible" ? "visible" : "hidden";
};

const changeLoaderDisplay = (mode) => {
  loader.style.display = mode === "block" ? "block" : "none";
};

const createStationRow = (station) => {
  const id = station.id;
  const name = station.name;
  const latitude = station.latitude;
  const longitude = station.longitude;

  const htmlRow = `<tr> 
    <td>${id}</td>
    <td>${name}</td>
    <td>${latitude}</td>
    <td>${longitude}</td>
  </tr>`;

  return htmlRow;
};

const renderStations = (stations) => {
  const rows = stations.map(createStationRow);
  for (const row of rows) {
    stationsBody.innerHTML += row;
  }
  resultMessage.style.visibility = "hidden";
  handleTableVisibility("visible");
};

const getStations = () => {
  try {
    changeLoaderDisplay("block");

    fetch(`${backendAPI}/stations`)
      .then((res) => res.json())
      .then((data) => {
        renderStations(data.results);
        changeLoaderDisplay("none");
      });
  } catch (error) {
    displayMessage(error.message, "red");
  }
};

const initApp = () => {
  displayMessage("Brak wyników");
  handleTableVisibility("hidden");
  stationsButton.addEventListener("click", getStations);
};

initApp();
