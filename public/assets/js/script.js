const contentCard = [
  ["A-1", "A-2", "A-3", "A-4", "A-5", "A-6", "A-7", "A-8", "A-9", "A-10", "A-11", "A-12", "A-13", "A-14", "A-15", "A-16", "A-17", "A-18", "A-19", "A-20", "A-21", "A-22"],
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"]
];

let totalCard = 6;
let endTime;
let listCard = [];
let currentCards = [];
let cardsShow = [];
let correctCount = 0;
let errorCount = 0;
let totalCorrectCount = 0;
let totalErrorCount = 0;
let totalAttempts = 0;
let totalScore = 1000;
let gameRunning = false;
let timer;
let timerRunning = false;

let finaltime = "0";
const containerCard = document.querySelector(".content_cards");
const correctCountElement = document.getElementById("correctCount");
const errorCountElement = document.getElementById("errorCount");
const totalCorrectCountElement = document.getElementById("totalCorrectCount");
const totalErrorCountElement = document.getElementById("totalErrorCount");
const startTimerButton = document.getElementById("startTimerButton");

function restarAll() {
  correctCount = 0;
  errorCount = 0;
  totalCorrectCount = 0;
  totalErrorCount = 0;
  totalAttempts = 0;
  totalScore = 1000;
  finaltime = "0";
  document.getElementById("totalscore").textContent = totalScore;
  correctCountElement.textContent = correctCount;
  errorCountElement.textContent = errorCount;
  totalCorrectCountElement.textContent = totalCorrectCount;
  totalErrorCountElement.textContent = totalErrorCount;
  updateCardCount();
}

function startTimer() {
  restarAll();
  containerCard.innerHTML = "";
  listCard = [];
  draw();
  clearInterval(timer);
  document.getElementById("timer").textContent = "00:00";
  let seconds = 0;
  let minutes = 0;
  startTime = new Date();
  timer = setInterval(() => {
    seconds++;
    totalScore -= 1;
    updateScoreDisplay();
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    const formattedTime = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    document.getElementById("timer").textContent = formattedTime;
  }, 1000);
  timerRunning = true;
  gameRunning = true;
}

function backTimer() {
  clearInterval(timer);
  timerRunning = false;
  document.getElementById("timer").textContent = "00:00";
  seconds = 0;
  minutes = 0;
  endTime = 0;
  resetGame();
  gameRunning = false;
}


startTimerButton.addEventListener("click", function () {
  if (!timerRunning) {
    startTimer();
  }
});

const soundGameWon = new Audio("./assets/sound/game_won.wav");
const soundCardFlip = new Audio("./assets/sound/card_flip.wav");
const soundCardHover = new Audio("./assets/sound/card_hover.wav");
const soundCorrect = new Audio("./assets/sound/correct_options.wav");
const soundError = new Audio("./assets/sound/error_options.wav");


function updateCardCount() {
  containerCard.innerHTML = "";
  listCard = [];
  draw();
  correctCount = 0;
  errorCount = 0;
  totalAttempts = 0;
  correctCountElement.textContent = correctCount;
  errorCountElement.textContent = errorCount;
  const columnWidth = 150;
  const totalColumns = Math.ceil(totalCard / 2);
  const containerWidth = totalColumns * columnWidth + (totalColumns - 1) * 10;
  containerCard.style.width = `${containerWidth}px`;
}

updateCardCount();

function draw() {
  createCard();
  cardListener(false);
}

function createCard() {
  // validamos que este bien las opciones de configuración
  if (totalCard > contentCard[0].length || totalCard % 2 != 0) {
    alert("mala configuracion");
    return;
  }
  let positionCard = Array(contentCard[0].length)
    .fill()
    .map((_, i) => i);
  positionCard.sort(() => Math.random() - 0.5);
  positionCard = positionCard.slice(0, totalCard / 2);
  positionCard.forEach((position) => {
    contentCard.forEach((row, indexRow) => {
      let card = document.createElement("div");
      let back = document.createElement("div");
      let front = document.createElement("div");
      if (indexRow === 0) {
        back.style.background = "radial-gradient(circle, #273a73 0%, #0b6eca 100%)";
      } else {
        back.style.background = "radial-gradient(circle, #273a73 0%, #eb0909 100%)";
      }
      front.innerHTML = row[position];
      front.className = "card__front";
      back.className = "card__back";
      card.appendChild(back);
      card.appendChild(front);
      card.className = "card";
      card.style.rotate = `${Math.random() * 20 - 10}deg`;
      card.id = `${indexRow}-${position}`;
      card.setAttribute("value", position);
      listCard.push(card);
    });
  });
  listCard.sort(() => Math.random() - 0.5);
  listCard.forEach((card) => {
    containerCard.appendChild(card);
  });
}


function showCard(event) {
  if (!gameRunning || currentCards.length >= 2 || event.target.classList.contains("card--active")) {
    return;
  }
  let card = event.target;
  card.removeEventListener("click", showCard);
  card.classList.add("card--active");
  soundCardFlip.play();
  currentCards.push(card); 
  if (currentCards.length === 2) {
    validateCurrentCard();
  }
}

function calculateGrade(totalScore) {
  const average = (totalScore / 1300) * 100;
  const scoreGrade = (average * 5) / 100;
  return Math.round(scoreGrade * 100) / 100;
}

function validateCurrentCard() {
  if (currentCards.length > 1) {
    let [cardOne, cardTwo] = currentCards;
    totalAttempts++;
    if (cardOne.getAttribute("value") === cardTwo.getAttribute("value")) {
      soundCorrect.play();
      correctCount++;
      totalCorrectCount++;
      totalScore += 20;
      updateScoreDisplay();
      totalCorrectCountElement.textContent = totalCorrectCount;
      correctCountElement.textContent = correctCount;
      currentCards.forEach((card) => {
        card.classList.add("card--good");
        removeCard(card);
      });
      currentCards = [];
      cardListener(false);
      if (correctCount === totalCard / 2) {
        soundGameWon.play();
        setTimeout(() => {
          nextLevel();
        }, 500);
      }
    } else {
      soundError.play();
      errorCount++;
      totalErrorCount++;
      totalScore -= 10;
      updateScoreDisplay();
      totalErrorCountElement.textContent = totalErrorCount;
      errorCountElement.textContent = errorCount;
      cardListener(true);
      currentCards.forEach((card) => card.classList.add("card--bad"));
      setTimeout(() => {
        hideCurrentCard();
      }, 1000 * 2);
    }
  }
}

function hideCurrentCard() {
  currentCards.forEach((card) => {
    card.classList.remove("card--active");
    card.classList.remove("card--bad");
    soundCardFlip.play();
  });
  currentCards = [];
  cardListener(false);
}

function cardListener(remove) {
  if (remove) {
    listCard.forEach((card) => card.removeEventListener("click", showCard));
  } else {
    listCard.forEach((card) => card.addEventListener("click", showCard));
    listCard.forEach((card) => card.addEventListener("mouseover", () => soundCardHover.play()));
  }
}

function removeCard(card) {
  listCard.splice(
    listCard.findIndex((item) => card.id == item.id),
    1
  );
}

function alerts(){
  if(totalCard<=10){
    Swal.fire({
      title: '¡Enhorabuena!',
      text: '¡Has ganado! \nContinua al siguiente nivel',
      icon: 'success',
      confirmButtonText: 'Next'
    })
  }
  else{
    Swal.fire({
      title: '¡Felicidades! Has completado todos los niveles.',
      text: 'Su nota es: '+ scoreGrade ,
      footer: 'Tiempo total:' + finaltime + ', Puntaje total:' + totalScore,
      icon: 'success',
      confirmButtonText: 'Next'
    })
  }
}

function nextLevel() {
  if (totalCard === 6) {
    alerts();
    totalCard = 10;
  } else if (totalCard === 10) {
    alerts();
    totalCard = 14;
  } else {
    const completionTime = calculateCompletionTime(startTime, new Date());
    finaltime = completionTime;
    clearInterval(timer);
    timerRunning = false;
    scoreGrade = calculateGrade(totalScore);
    alerts();
    document.getElementById("player-info").style.display = "block";
    document.getElementById("content").style.display = "none";
    document.getElementById("playerForm").addEventListener("submit", function(event) {
      event.preventDefault();
      document.getElementById("player-info").style.display = "none";
      document.getElementById("content").style.display = "flex";
      resetGame();
      backTimer();
    });
    return;
  }
  updateCardCount();
}

function calculateCompletionTime(startTime, endTime) {
  const completionTimeInSeconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(completionTimeInSeconds / 60);
  const seconds = completionTimeInSeconds % 60;
  return `${minutes} minutos ${seconds} segundos`;
}

function resetGame() {
  totalCard = 6;
  restarAll();
  containerCard.innerHTML = "";
  listCard = [];
  draw();
}

document.getElementById("backTimerButton").addEventListener("click", function () {
  backTimer();
  resetGame();
  updateCardCount();
});

function updateScoreDisplay() {
  document.getElementById("totalscore").textContent = totalScore;
}

document.getElementById("playerForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const grade = document.getElementById("grade").value; 
  const school = document.getElementById("school").value;
  const gameData = {
    name: name,
    age: age,
    grade: grade,
    school: school,
    score: totalScore,
    time: finaltime,
  };

  axios.post('http://localhost:3000/api/game/createGame', gameData)
    .then(response => {
      console.log('Respuesta de la API:', response.data);
    })
    .catch(error => {
      console.error('Error al crear el juego:', error);
    });
  console.log("Colegio:", school);
  console.log("Nombre:", name);
  console.log("Edad:", age);
  console.log("Grado:", grade);
  console.log("Aciertos:", totalCorrectCount);
  console.log("Errores:", totalErrorCount);
  console.log("Puntuacion:",totalScore);
  console.log("Tiempo:", finaltime);
});
