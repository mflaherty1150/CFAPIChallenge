/* COVID Dashboard plan

    User will select a country from a dropdown/select list
    When selection is complete and button clicked, country info will populate
    Global comparison information will populate side-by-side with country info

*/

const baseURL = 'https://api.covid19api.com'

let countrySelector = document.getElementById('country-selector');
let countryButton = document.getElementById('country-button');
let countrySelect = document.getElementById('country-select');
let countryStats = document.getElementById('country-stats');
let worldComparison = document.getElementById('world-comparison');
let compareStats = document.getElementById('compare-stats');

let countryList = [];
let countryData = { Country : 0, Confirmed : 0, Deaths : 0, DeathRatePercent : 0};
let worldData = { TotalConfirmed : 0, TotalDeaths : 0, DeathRatePercent : 0};
let formattedNumber = 0;

// getCountryList();
// console.log(countryList);
// // countryList.sort( compare );
// countryList.sort((a,b) => (a.Country > b.Country) ? 1 : ((b.Country > a.Country) ? -1 : 0));
// console.log(countryList);
// buildCountrySelectList();

// Get country list and populate select dropdown
// let countryListURL = `${baseURL}/countries`;
fetch(`${baseURL}/countries`)
    .then(response => response.json())
    .then(jsonData => {
        for(let countryInfo of jsonData) {
            countryList.push(countryInfo);
            let countryEntry = document.createElement('option');
            countryEntry.value = `${countryInfo.Country}`;
            countryEntry.innerText = `${countryInfo.Country}`;
            if(countryInfo.Country == 'United States of America') {
                countryEntry.defaultSelected = 'selected';
            }
            countrySelect.appendChild(countryEntry);
        }
    });

// Get world data and populate world info section
fetch(`${baseURL}/world/total`)
.then(response => response.json())
.then(jsonData => {
    let worldHeader = document.createElement('h3');
    worldHeader.innerText = 'World';
    let worldCases = document.createElement('h4');
    worldData.TotalConfirmed = jsonData.TotalConfirmed;
    formattedNumber = formatNumber(worldData.TotalConfirmed);
    worldCases.innerText = `Total cases: ${formattedNumber}`;
    let worldDeaths = document.createElement('h4');
    worldData.TotalDeaths = jsonData.TotalDeaths;
    formattedNumber = formatNumber(worldData.TotalDeaths);
    worldDeaths.innerText = `Total deaths: ${formattedNumber}`;
    // worldData.Deaths = jsonData.TotalDeaths;
    let worldPercent = document.createElement('h5');
    worldData.DeathRatePercent = (jsonData.TotalDeaths / jsonData.TotalConfirmed * 100).toFixed(4);
    worldPercent.innerText = `Death rate percentage (deaths/cases) : ${worldData.DeathRatePercent} %`;
    worldComparison.appendChild(worldHeader);
    worldComparison.appendChild(worldCases);
    worldComparison.appendChild(worldDeaths);
    worldComparison.appendChild(worldPercent);
    let worldStats = {'TotalConfirmed' : jsonData.TotalConfirmed, 'TotalDeaths' : jsonData.TotalConfirmed, 'TotalRecovered' : jsonData.TotalRecovered, 'DeathRatePercent' : jsonData.TotalDeaths / jsonData.TotalConfirmed};
    // Working correctly to this point. (via console.log);
});

countryButton.addEventListener('click', () => {
    // console.log(`Select value: ${countryButton.value}`);
    let tempCountrySlug = getCountrySlugByName(countrySelect.value);
    getCountryData(tempCountrySlug);
});

function compare( a, b ) {
    if (a.Country < b.Country) return -1;
    if (a.Country > b.Country) return 1;
    return 0;
}
function getCountryList() {
    fetch(`${baseURL}/countries`)
    .then(response => response.json())
    .then(jsonData => {
        for(let countryInfo of jsonData) {
            countryList.push(countryInfo);
        }
    })};

        
function buildCountrySelectList() {
    for(let countryInfo of countryList) {
        let countryEntry = document.createElement('option');
        countryEntry.value = `${countryInfo.Country}`;
        countryEntry.innerText = `${countryInfo.Country}`;
        if(countryInfo.Country == 'United States of America') {
            countryEntry.defaultSelected = 'selected';
        }
        countrySelect.appendChild(countryEntry);
    }
}

function getCountryData(countrySlug) {
    // console.log(getCountryNameBySlug(countrySlug), countryData);
    clearAllChildElements(countryStats); // Clear all child elements of 
    countryData.Confirmed = 0;
    countryData.Deaths = 0;

    fetch(`${baseURL}/live/country/${countrySlug}`)
    .then(response => response.json())
    .then(jsonData => {
        for(let country of jsonData) {  // Array of country data objects
                if(country.Date == getMostRecentDate()) {
                    countryData.Country = country.Country;
                    countryData.Confirmed += country.Confirmed;
                    countryData.Deaths += country.Deaths;
                }
            }
        countryData.DeathRatePercent = (countryData.Deaths / countryData.Confirmed * 100).toFixed(4);
        // console.log(countryData);
        let countryCases = document.createElement('h4');
        // console.log(`countryCases confirmed: ${countryData.Confirmed}`);
        formattedNumber = formatNumber(countryData.Confirmed);
        countryCases.innerText = `Total cases: ${formattedNumber}`;
        let countryDeaths = document.createElement('h4');
        formattedNumber = formatNumber(countryData.Deaths);
        countryDeaths.innerText = `Total deaths: ${formattedNumber}`;
        let countryPercent = document.createElement('h5');
        countryPercent.innerText = `Death rate percentage: ${countryData.DeathRatePercent}%`;
        let countryHeader = document.createElement('h3');
        countryHeader.innerText = countryData.Country;
        countryStats.appendChild(countryHeader);
        countryStats.appendChild(countryCases);
        countryStats.appendChild(countryDeaths);
        countryStats.appendChild(countryPercent);

        compareStatistics(countryData, worldData);
        });
}

function compareStatistics(countryData, worldData) {
    clearAllChildElements(compareStats);

    // let confirmedDifference = worldData.Confirmed - countryData.Confirmed;
    console.log(countryData.Confirmed, worldData.TotalConfirmed);
    let percentConfirmedCases = (countryData.Confirmed / worldData.TotalConfirmed * 100).toFixed(2);
    // let deathsDifference = worldData.Deaths - countryData.Deaths;
    let percentDeathsDifference = (countryData.Deaths / worldData.TotalDeaths * 100).toFixed(2);
    let deathRatePercentDifference = (countryData.DeathRatePercent - worldData.DeathRatePercent).toFixed(4);
    let deathRatePercentPercentDifference = (countryData.DeathRatePercent / worldData.DeathRatePercent * 100).toFixed(4);

    let compHeader = document.createElement('h3');
    compHeader.innerText = `${countryData.Country} vs the World`;
    let compConfirmed = document.createElement('h5');
    compConfirmed.innerText = `${countryData.Country} has ${percentConfirmedCases}% of the worlds confirmed cases.`;
    let compDeaths = document.createElement('h5');
    compDeaths.innerText = `${countryData.Country} has ${percentDeathsDifference}% of the world deaths.`;
    let compPercent = document.createElement('h5');
    compPercent.innerText = `${countryData.Country} is ${deathRatePercentDifference} different from the world in death rate percentage.\n That is ${deathRatePercentPercentDifference}% that of the world rate.`;
    compareStats.appendChild(compHeader);
    compareStats.appendChild(compConfirmed);
    compareStats.appendChild(compDeaths);
    compareStats.appendChild(compPercent);
}

function getCountrySlugByName(countryName) {
    for(let country of countryList) {
        if(country.Country == countryName) {
            // console.log(country.Slug);
            return country.Slug;
        }
    }
}

function getCountryNameBySlug(countrySlug) {
    for(let country of countryList) {
        console.log(country, country.Country, countrySlug);
        if(country.Slug == countrySlug) {
            return country.Country;
        }
    }
}

function clearAllChildElements(parentElement) {
    if(parentElement.firstChild != null) {
        while(parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    }
}

function formatNumber(number)
{
    number = number.toFixed() + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function getMostRecentDate()
{
    let mostRecentDate = new Date();
    let dd = String(mostRecentDate.getDate() - 1).padStart(2, '0');
    let mm = String(mostRecentDate.getMonth() + 1).padStart(2, '0');
    let yyyy = mostRecentDate.getFullYear();

    today = yyyy + '-' + mm + '-' + dd + 'T00:00:00Z';
    console.log(`Most recent date: ${today}`);
    return today;
}