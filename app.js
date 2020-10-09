// empty dinoData obj
let dinoData;

// fetch the dino data when page loads
(function getDinoData() {
    fetch('/dino.json')
    .then(res => res.json())
    .then(data => {
        dinoData = data;
    });
})();

// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact, index) {
    this.species = species;
    this.weight = compareWeight(weight, this.species);
    this.height = compareHeight(height, this.species);
    this.diet = compareDiet(diet, this.species);
    this.where = `The ${species} lived in ${where}.`;
    this.when = `The ${species} lived during the ${when} period.`;
    this.fact = fact;
    this.index = index;
}

// array for new dino objects
const dinoObjArr = [];

// Create Dino Objects
// map over the array of objs from dinoData
const createDinos = function() {
    // index to keep track of dinos
    let index = 0;

    dinoData.Dinos.forEach(item => {
        // create a new Dino obj for each item and push to array
        dinoObjArr.push(
            new Dino(item.species, item.weight, item.height, item.diet, item.where, item.when, item.fact, index)
        );

        // increment index by 1
        index += 1;
    });

    dinoObjArr.forEach(item => {
        // generate tiles for each dino
        generateTiles(item);
    });
}

// function to generate a random fact
const generateRandomFact = function(dino) {
    // set a number from 0-5
    const randomNum = Math.floor(Math.random() * 6);

    let fact;

    // only return the main fact for pigeon
    if (dino.species === 'Pigeon') {
        fact = dino.fact;
        return fact;
    }

    // switch statement to handle the random fact
    switch(randomNum) {
        case 0:
            fact = dino.weight;
            break;
        case 1:
            fact = dino.height;
            break;
        case 2:
            fact = dino.diet;
            break;
        case 3:
            fact = dino.where;
            break;
        case 4:
            fact = dino.when;
            break;
        case 5:
            fact = dino.fact;
            break;
    }

    // return the fact to use in the ui
    return fact;
}

// Create Human Object
const human = {}

// calculate human height from input
const calculateHumanHeight = function(formData) {
    let calcHeight;

    // handle the height from the form
    if (formData.get('feet') && formData.get('inches')) {
        calcHeight = (formData.get('feet') * 12) + parseInt(formData.get('inches'));
    } else if (formData.get('feet') && !formData.get('inches')) {
        calcHeight = (formData.get('feet') * 12);
    } else if (!formData.get('feet') && formData.get('inches')) {
        calcHeight = formData.get('inches');
    } else {
        calcHeight = 0;
    }
    return calcHeight;
}

// function to remove the form from the dom
const removeForm = function() {
    // get the form
    const form = document.getElementById('dinoCompare');

    // remove it from the ui
    form.remove();
}

// Set Human Data when clicking on the compare btn
const setHumanData = function() {
    // set up the form object from the ui
    const formEl = document.forms.dinoCompare;
    const formData = new FormData(formEl);

    // set the human properties
    human.name = formData.get('name');
    human.height = calculateHumanHeight(formData);
    human.feet = formData.get('feet');
    human.inches = formData.get('inches');
    human.diet = formData.get('diet');
    human.weight = formData.get('weight');

    // call function to remove form
    removeForm();

    // create the dinos
    createDinos();
};

// Generate Tiles for each Dino in Array
const generateTiles = function(item) {
     // create the image name
     const image = `${item.species.toLowerCase()}.png`;

     // form the html for each card
     const html = `<div class="grid-item grid-${item.index}" style="display: block" onclick="toggleCard(${item.index})">
             <h3>${item.species}</h3>
             <img class="dino-image" id="${item.index}" src="images/${image}" alt="${item.species}">
             <p>${generateRandomFact(item)}</p>
         </div>
         
         <div class="card-${item.index}" onclick="toggleCard(${item.index})">
            <li>${item.weight}</li>
            <li>${item.height}</li>
            <li>${item.diet}</li>
            <li>${item.where}</li>
            <li>${item.when}</li>
            <li>${item.fact}</li>
         </div>`;

    // Add tiles to DOM
     // append the html to the dom
     const appendHere = document.getElementById('grid');
     appendHere.innerHTML += html;

     // if the index is 3
     if (item.index === 3) {
         // create the html for the human card
         const humanHtml = `<div class="grid-item grid-9" style="display: block" onclick="toggleCard(9)">
                 <h3>${human.name}</h3>
                 <img class="human-image" src="images/human.png" alt="${human.name}">
             </div>

             <div class="card-9" onclick="toggleCard(9)">
                <li>You weigh ${human.weight} pounds.</li>
                <li>You are ${human.feet}' ${human.inches}" tall.</li>
                <li>You are ${human.diet === 'Herbavor' || human.diet === 'Omnivor' ? 'an' : 'a'} ${human.diet}.</li>
            </div>`;

         // append html to the dom (will be in the middle)
         appendHere.innerHTML += humanHtml;
     }
}

// toggle card function
const toggleCard = function(index) {
    const gridItem = document.getElementsByClassName(`grid-${index}`)[0];
    const cardItem = document.getElementsByClassName(`card-${index}`)[0];

    if (gridItem.style.display === 'block') {
        gridItem.style.display = 'none';
        cardItem.style.display = 'block';
    } else {
        gridItem.style.display = 'block';
        cardItem.style.display = 'none';
    }
}

// Dino Compare Method 1 - Diet
const compareDiet = function(dinoDiet, species) {
    const humanDiet = human.diet.toLowerCase();

    if (humanDiet !== dinoDiet) {
        return `You are ${humanDiet === 'herbavor' ? 'an' : 'a'} ${humanDiet} while the ${species} is ${dinoDiet === 'herbavor' ? 'an' : 'a'} ${dinoDiet}.`;
    } else {
        return `You and the ${species} are both ${dinoDiet}s.`;
    }
}

// Dino Compare Method 2 - Weight
const compareWeight = function(dinoWeight, species) {
    const humanWeight = human.weight;

    if (humanWeight === dinoWeight) {
        return `You and the ${species} both weigh ${dinoWeight} pounds.`;
    } else if (humanWeight < dinoWeight) {
        const calcWeight = dinoWeight - humanWeight;
        return `The ${species} weighs ${calcWeight} pounds more than you.`;
    } else if (humanWeight > dinoWeight) {
        const calcWeight = humanWeight - dinoWeight;
        return `You weigh ${calcWeight} pounds more than the ${species}`;
    }
}

// Dino Compare Method 3 - Height (in inches)
const compareHeight = function(dinoHeight, species) {
    const humanHeight = human.height;

    if (humanHeight === dinoHeight) {
        return `You and the ${species} are both the same height, standing at ${dinoHeight} inches tall.`;
    } else if (humanHeight < dinoHeight) {
        const calcHeight = dinoHeight - humanHeight;
        return `The ${species} is taller than you by ${calcHeight} inches.`;
    } else if (humanHeight > dinoHeight) {
        const calcHeight = humanHeight - dinoHeight;
        return `You are taller than the ${species} by ${calcHeight} inches.`;
    }
}
