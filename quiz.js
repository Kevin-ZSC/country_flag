import countries from './countries.json' with { type: 'json' };

// call the function when page is loaded
window.onload = function () {
    getRandomCountryFlag ()
    getCountryNameList();
}

const countryFlag = document.querySelector('.image');
const options = document.querySelector('#question');

let currentCountryName;

function getRandomCountryFlag() {
    const randomIndex = Math.floor(Math.random() * countries.length);
    currentCountryName = countries[randomIndex].Name;
    
    // Check if countryFlag exists before setting its src attribute
    if (countryFlag) {
        const flagSrc = '/flags/' + currentCountryName.replace(/ /g, '_') + '.png';
        countryFlag.setAttribute('src', flagSrc);
    } else {
        console.error('countryFlag element not found');
    }
}


function random () {
    return Math.floor(Math.random()*countries.length);
}

//Get the 4 options in the select list
function getCountryNameList () {
    let countriesName = ``; //set a empty string to store all country name
    let nameArray =[currentCountryName]; //push the right answer for the flag
    for(let j= 0; j <3; j++){
        nameArray.push(countries[random()].Name) ;//push other 3 random countries name;
    }   
    
    let randomCounName = [];
       // use array splice() to get random order of select country list
        let removeC = Math.random()*nameArray.length;
        randomCounName.push(nameArray.splice(removeC,1));
        removeC = Math.random()*nameArray.length;
        randomCounName.push(nameArray.splice(removeC,1));
        removeC = Math.random()*nameArray.length;
        randomCounName.push(nameArray.splice(removeC,1));
        removeC = Math.random()*nameArray.length;
        randomCounName.push(nameArray.splice(removeC,1));

    for (let i = 0; i < randomCounName.length; i++) {  
    countriesName += `\n <option value="${randomCounName[i]}">${randomCounName[i]}</option>`; 
    }
    options.innerHTML += countriesName; // change the html (add all countries option)
    
}  

let tryTimes = 10; //set up the total quiz number
let rightAnswer = 0;// create a variable to store the right answer

//add eventlister for the reset button
const reset = document.querySelector('.reset');
reset.addEventListener('click',()=> {
   location.reload(); // page will refrash when you click button
})

//add eventlister for the cancel button
const cancel = document.querySelector('.cancel');

cancel.addEventListener('click',()=> {
    window.close(); //page will close
})

//add event listener for play button
const play = document.querySelector('.play');
play.addEventListener('click', startQuiz);

//check the local storage use fetch style. 
if(localStorage.scoreStorage == null) {
    fetch('original_high_scores.json')
       .then(res => { //get response 
        if(!res.ok)  { //if response not ok 
            console.log(`not successful`); 
        } else {
            return res.json() //if response success, get the json file data
        }
    })
       .then(data => {
        localStorage.scoreStorage = JSON.stringify(data); //store the json data to localstoreage
        console.log(localStorage.scoreStorage)
        displayScore(); //display scores
       })  
} else {
    displayScore();
}

function displayScore() {
    let storedScore = JSON.parse(localStorage.scoreStorage);//transforms the data
    let tableContrainer = document.querySelector('.scoreTable');
    storedScore.sort((a, b) => b.Score - a.Score);//sort function can sort the highest value, if return 1, b>a; return 0 b=a; return -1 b<a, then decide the order.
    const topScores = storedScore.slice(0, 5);//slice function from 0 -to 5 get top 5 score
    storedScore= topScores;
    //create the new html for display socres which is table
    let new_html = "";
    new_html += '<h1>High Score</h1>';
    new_html += "<table>";
    new_html += "<thead>";
    new_html += "<tr>";
    new_html += "<th>Score</th>";
    new_html += "<th>User</th>";
    new_html += "<th>Timestamp</th>";
    new_html += "</tr>";
    new_html += "</thead>";
    new_html += "<tbody>";

    //store the new score user and timestamp
    for(let i=0; i<storedScore.length; i++){
        let currentScore = storedScore[i];
        new_html += "<tr>";
        new_html += `<td>${currentScore["Score"]}</td>`;
        new_html += `<td>${currentScore["User"]}</td>`;
        new_html += `<td>${currentScore["Timestamp"]}</td>`
        new_html += "</tr>";
    }
    
    new_html += "</tr>";
    new_html += "</tbody>";
    new_html += "</table>";

    tableContrainer.innerHTML = new_html; //update to the html 

}

function startQuiz() {
    let user = prompt('pls enter your name'); //ask user to put uesr name
    const submit = document.querySelector('.submit');
    submit.addEventListener('click',()=>{ //add eventlister for the submit button
        const answer = options.value; //get the selected country name
        tryTimes--; //eveytime i click submit button, trytime -1
        
        if(answer === currentCountryName) { //when you answer match 
            rightAnswer++; //rightanswer +1
        }
        let percentage = (rightAnswer/10)*100;
        document.querySelector('.rightOrwrong').innerHTML = `${rightAnswer} out of 10 (${percentage}% <br> ${tryTimes} chance left)`
        
        if(tryTimes === 0) {
            newRecord(user); //when out of the time, store the score
            displayScore();  
            
            let playAgain = confirm('wanna play again?')
    
            if(playAgain) {
                prompt('pls enter your name');
                tryTimes = 10; 
                rightAnswer = 0;
                getRandomCountryFlag();
                options.innerHTML = "";
                getCountryNameList();;
                } else {
                    location.reload()//refrash the web page
                }  
            } else {
                getRandomCountryFlag();
                options.innerHTML = "";
                getCountryNameList();
            }
    })        
}
//store the new record 
function newRecord(userName) {
    let storedScore = JSON.parse(localStorage.scoreStorage);
    let currentDate = new Date();
    let formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    let new_score_object = {
        "Score": rightAnswer,
        "User": userName,
        "Timestamp": formattedDate
    }
    
    storedScore.push(new_score_object);//push the new score user and time as object 
    localStorage.scoreStorage = JSON.stringify(storedScore); 
    displayScore(); 
}




