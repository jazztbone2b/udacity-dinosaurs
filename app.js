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
const createDinos = function() {
    let index = 0;

    dinoData.Dinos.forEach(item => {
        dinoObjArr.push(
            new Dino(item.species, item.weight, item.height, item.diet, item.where, item.when, item.fact, index)
        );
        index ++;
    });

    const appendHere = document.getElementById('grid');
    let htmlToAppend = '';

    dinoObjArr.forEach(item => {
        htmlToAppend += generateTiles(item);
    });

    appendHere.innerHTML = htmlToAppend;
}

// function to generate a random fact
const generateRandomFact = function(dino) {
    const randomNum = Math.floor(Math.random() * 6);

    let fact;

    if (dino.species === 'Pigeon') {
        fact = dino.fact;
        return fact;
    }

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
    return fact;
}

// Create Human Object
function Human(name, feet, inches, height, weight, diet) {
    this.name = name;
    this.feet = feet;
    this.inches = inches;
    this.height = height;
    this.weight = weight;
    this.diet = diet;
}

let human;

// calculate human height from input
const calculateHumanHeight = function(formData) {
    let calcHeight;

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
    const form = document.getElementById('dinoCompare');
    form.remove();
}

// Set Human Data when clicking on the compare btn
const setHumanData = function() {
    const formEl = document.forms.dinoCompare;
    const formData = new FormData(formEl);

    const name = formData.get('name');
    const feet = formData.get('feet');
    const inches = formData.get('inches');
    const height = calculateHumanHeight(formData);
    const weight = formData.get('weight');
    const diet = formData.get('diet');

    human = new Human(name, feet, inches, height, weight, diet);

    removeForm();
    createDinos();
};

// function to toggle the cards
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

// Generate Tiles for each Dino in Array
const generateTiles = function(item) {
    const image = `${item.species.toLowerCase()}.png`;

    let html = `<div class="grid-item grid-${item.index}" style="display: block" onclick="toggleCard(${item.index})">
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

    if (item.index === 3) {
        const humanHtml = `<div class="grid-item grid-9" style="display: block" onclick="toggleCard(9)">
            <h3>${human.name}</h3>
            <img class="human-image" src="images/human.png" alt="${human.name}">
        </div>

        <div class="card-9" onclick="toggleCard(9)">
            <li>You weigh ${human.weight} pounds.</li>
            <li>You are ${human.feet}' ${human.inches}" tall.</li>
            <li>You are ${human.diet === 'Herbavor' || human.diet === 'Omnivor' ? 'an' : 'a'} ${human.diet}.</li>
        </div>`;

        html += humanHtml;
    }
    return html;
}
