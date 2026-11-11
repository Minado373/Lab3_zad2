const backendAPI = "http://localhost:3000/api";

const stationsButton = document.getElementById("stationsButton");
const locationsButton = document.getElementById("locationsButton");
const paramedButton = document.getElementById("paramedButton");

const table = document.getElementById("table");
const tableBody = document.getElementById("tableBody");
const tableHead = document.getElementById("tableHead");
const resultMessage = document.getElementById("resultMessage");
const loader = document.getElementById("loader");

const RESPONSE_TYPE = {
  stations: "stations",
  locations: "locations",
  paramedDataset: "paramedDataset",
};

const displayMessage = (message, color = "black") => {
  resultMessage.style.visibility = "visible";
  resultMessage.style.color = color;
  resultMessage.textContent = message;
};

const handleTableVisibility = (mode) => {
  table.style.visibility = mode === "visible" ? "visible" : "hidden";
};

const changeLoaderDisplay = (mode) => {
  loader.style.display = mode === "block" ? "block" : "none";
};

const clearTable = () => {
  while (tableHead.firstChild) {
    tableHead.removeChild(tableHead.firstChild);
  }
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
};

const createTableHead = (type) => {
  let headHTML = "";
  if (type === RESPONSE_TYPE.stations) {
    headHTML += `
    <th>Station ID</th>
    <th>Name</th>
    <th>Latitude</th>
    <th>Longitude</th>`;
  } else if (type === RESPONSE_TYPE.locations) {
    headHTML += `
    <th>Location ID</th>
    <th>Name</th>
    <th>Data Coverage</th>`;
  } else if (type === RESPONSE_TYPE.paramedDataset) {
    headHTML += `
      <th>Data Type</th>
      <th>Station</th>
      <th>Value</th>
    `;
  }

  tableHead.innerHTML += headHTML;
};

const createStationRow = (station) => {
  const id = station.id;
  const name = station.name;
  const latitude = station.latitude;
  const longitude = station.longitude;

  return `<tr> 
    <td>${id}</td>
    <td>${name}</td>
    <td>${latitude}</td>
    <td>${longitude}</td>
  </tr>`;
};

const createLocationRow = (location) => {
  const id = location.id;
  const name = location.name;
  const datacoverage = location.datacoverage;

  return `<tr> 
    <td>${id}</td>
    <td>${name}</td>
    <td>${datacoverage}</td>
  </tr>`;
};

const createParamedDatasetRow = (dataset) => {
  const datatype = dataset.datatype;
  const station = dataset.station;
  const value = dataset.value;

  return `<tr> 
    <td>${datatype}</td>
    <td>${station}</td>
    <td>${value}</td>
  </tr>`;
};

const fillTable = (rows) => {
  for (const row of rows) {
    tableBody.innerHTML += row;
  }
};

const render = (data, responseType) => {
  clearTable();
  let rows;

  if (responseType === RESPONSE_TYPE.stations) {
    createTableHead(responseType);
    rows = data.map(createStationRow);
  } else if (responseType === RESPONSE_TYPE.locations) {
    createTableHead(responseType);
    rows = data.map(createLocationRow);
  } else if (responseType === RESPONSE_TYPE.paramedDataset) {
    createTableHead(responseType);
    rows = data.map(createParamedDatasetRow);
  }
  fillTable(rows);

  resultMessage.style.visibility = "hidden";
  handleTableVisibility("visible");
};

const getData = async (url, responseType) => {
  try {
    changeLoaderDisplay("block");
    const response = await fetch(url);
    if (!response.ok) {
      displayMessage("Blad HTTP!", "red");
      return;
    }
    const data = await response.json();
    render(data.results, responseType);
  } catch (error) {
    displayMessage(error.message, "red");
  } finally {
    changeLoaderDisplay("none");
  }
};

const getStations = () => {
  getData(`${backendAPI}/stations`, RESPONSE_TYPE.stations);
};

const getLocations = () => {
  getData(`${backendAPI}/locations`, RESPONSE_TYPE.locations);
};

const getParamedDataset = () => {
  getData(`${backendAPI}/paramedDataset`, RESPONSE_TYPE.paramedDataset);
};

const initApp = () => {
  displayMessage("Brak wyników");
  handleTableVisibility("hidden");
  stationsButton.addEventListener("click", getStations);
  locationsButton.addEventListener("click", getLocations);
  paramedButton.addEventListener("click", getParamedDataset);
};

initApp();
