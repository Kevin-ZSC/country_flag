import countries from './countries.json' assert { type: 'json' }; //use import statement for mudule to get local json file.

let countriesName = "";
let worldPopulation = CalculateTotalWorldPopulation();
//loop through countries and get all the countries names
for (let i = 0; i < countries.length; i++) {
    countriesName += `\n <option value="${countries[i].Name}">${countries[i].Name}</option>`;
}

const selectElement = document.querySelector('#countries');
selectElement.innerHTML += countriesName;//insert those names to the select option list

// Function to display country data
function DisplayCountryData(selectCountryData) {
    // create all the variable
    const flagCountry = document.querySelector('#countryFlag');
    const countryPopulation = document.querySelector('#population');
    const countrySize = document.querySelector('#size');
    const wiki = document.querySelector('.btn');
    const quiz = document.querySelector('#quiz');
    countryPopulation.value = selectCountryData.Population; //get the select country population
    countrySize.value = selectCountryData.Area; //get the select country size
    flagCountry.setAttribute('src', 'https://github.com/Kevin-ZSC/country_flag/edit/main/flags/' + selectCountryData.Name.replaceAll(' ', '_') + '.png');//give the img src attribute to get matched country flag
    
    //add eventlister for the country size select element
    const countryS = document.querySelector('#sizeCountry');
    countryS.addEventListener('change', () => {
        countrySize.value = CalculateAreaInKM(selectCountryData.Area, countryS.value);
        DisplayPopulationData(selectCountryData.Population, worldPopulation);
    });
    
    //add eventlister for wiki button
    wiki.addEventListener('click', () => {
        const wikipediaURL = `https://en.wikipedia.org/wiki/${selectCountryData.Name}`;
        window.open(wikipediaURL, '_blank'); //open the new window for country wiki
    });
    
    //add eventlister for quiz button
    quiz.addEventListener('click', () => {
         let url = `quiz.html`
        window.open(url, '_blank'); //open new window for quiz
    });
}

// Function to display population data 
function DisplayPopulationData(countryPopulation, worldPopulation) {
    const countrySize = document.querySelector('#size');
    const perSmsqure = document.querySelector('#sm');
    const perKmsqure = document.querySelector('#km');
    document.querySelector('#sq').value = (parseFloat(countryPopulation) / parseFloat(countrySize.value)).toFixed(2);
    perSmsqure.addEventListener('click', () => {
        document.querySelector('#sq').value = (parseFloat(countryPopulation) / parseFloat(countrySize.value)).toFixed(2);
    });

    perKmsqure.addEventListener('click', () => {
        document.querySelector('#sq').value = (parseFloat(countryPopulation) / parseFloat(countrySize.value) * 2.59).toFixed(2);
    }); // addeventlister for the option about sq/km if i choose km, the number will change

    document.querySelector('.percentageOfWorld').value = ((parseFloat(countryPopulation) / worldPopulation) * 100).toFixed(3) + '%';
}

//addeventlistener for the select element
selectElement.addEventListener('change', function () { 
    const selectCountryName = this.value;//get the selected country name
    document.querySelector('.name').innerHTML = selectCountryName; 
    const selectCountryData = countries.find(country => country.Name === selectCountryName);  //use array find method to find certain object 's key
    
    // if chose the country then call functions
    if (selectCountryData) {
        DisplayCountryData(selectCountryData);
        DisplayPopulationData(selectCountryData.Population, worldPopulation);
    }
});

// Function to calculate total world population
function CalculateTotalWorldPopulation() {
    let totalPopulation = 0;
    for (let i = 0; i < countries.length; i++) {
        totalPopulation += countries[i].Population;
    }
    return totalPopulation;
}

// Function to calculate area in square kilometers
function CalculateAreaInKM(countryAreaInMiles, unit) {
    return unit === 'km' ? (countryAreaInMiles * 2.59).toFixed(2) : countryAreaInMiles;//uses the ternary operator (condition ? expr1 : expr2) to determine the conversion if unit equal km return countryAreaInMiles * 2.59 otherwise return countryAreaInMiles
}


