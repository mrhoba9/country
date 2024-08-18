const pop_div_holder1 = document.getElementById("pop_div_holder1");
const countdown = document.getElementById("countdown");
const main_container_challenges = document.querySelector(".main-container-challenges");
const level_text_p = document.getElementById("level-text-p");
const rules_div = document.getElementById("rules-div");
const question_div = document.querySelector(".question-div");
const answer_div = document.querySelector(".answer-div");
const country_text_changer = document.getElementById("country_text_changer");
let true_wrong_divs_holder = document.getElementById("true-wrong-unsure-divs-holder");
const total_points = document.getElementById("total_points");
let pop_div_holder = document.getElementById("pop_div_holder");
let end_correct_answer_counter_value = JSON.parse(localStorage.getItem("end_correct_answer_counter_value"))? JSON.parse(localStorage.getItem("end_correct_answer_counter_value")): 0;
let end_wrong_answer_counter_value = JSON.parse(localStorage.getItem("end_wrong_answer_counter_value"))? JSON.parse(localStorage.getItem("end_wrong_answer_counter_value")): 0;
let total = JSON.parse(localStorage.getItem("pointGathered"))? JSON.parse(localStorage.getItem("pointGathered")): 0;
const buttons = document.querySelectorAll(".answer-button");
const stopWatch = document.getElementById("timer");
let flowover = true;

function challenge_level(id) {
	document.getElementById("pop_div_holder").style.display = "none";
	countdown.style.display = "flex";
	setTimeout(updateCountdown, 1000);
	level_text_p.innerHTML = `<b>Level: </b>${id}`;
	if (id === "easy") {
		quizFunc(id);
		timer(66,id);
	} else if (id === "medium") {
		quizFunc(id);
		timer(86,id);
	} else if (id === "hard") {
		quizFunc(id);
		timer(102,id);
	} else if (id === "impossible") {
		quizFunc(id);
		timer(132,id);
	}
}

/*main functions starts*/
async function quizFunc(level) {
	if (flowover) {
		const defaultArray = Array.from({ length: 29 }, (_, i) => i);

		let arrayNumbers = JSON.parse(localStorage.getItem("updatedArray")) || defaultArray;
		const randomIndex = Math.floor(Math.random() * arrayNumbers.length);
		const randomNumber = arrayNumbers[randomIndex];
		arrayNumbers.splice(randomIndex, 1);
		localStorage.setItem("updatedArray", JSON.stringify(arrayNumbers));

		const response = await fetch(`./${level}.json`);
		const data = await response.json();
		const correctAnswer = data[randomNumber].capital;
		country_text_changer.innerHTML = data[randomNumber].country;

		const wrongAnswers = data
			.filter(item => item.capital !== correctAnswer)
			.map(item => item.capital)
			.slice(0, 6);
		const wrongOptions = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);

		const answers = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

		buttons.forEach((button, index) => {
			button.innerHTML = answers[index];
			button.onclick = () => {
				if (button.innerHTML === correctAnswer) {
					true_wrong_divs_holder.innerHTML += `<div class="bg-green-500 h-5 w-5 rounded-full m-1 text-center text-sm font-bold">+1</div>`;
					total++;
					end_correct_answer_counter_value++;
					localStorage.setItem("end_correct_answer_counter_value", JSON.stringify(end_correct_answer_counter_value));
				} else {
					true_wrong_divs_holder.innerHTML += `<div class="bg-red-500 h-5 w-5 rounded-full m-1 text-center text-sm font-bold">-1</div>`;
					total--;
					end_wrong_answer_counter_value++;
					localStorage.setItem("end_wrong_answer_counter_value", JSON.stringify(end_wrong_answer_counter_value));
				}
				if (total >= 0) {
					total_points.style.color = "#48bb78";
				} else {
					total_points.style.color = "red";
				}
				total_points.innerHTML = `<b>${total} Points</b>`;
				localStorage.setItem("pointGathered", JSON.stringify(total));
				checkEndCondition(arrayNumbers,level);
				quizFunc(level);
			};
		});
	}
}
/*main functions ends*/

/*end popUp starts */
function checkEndCondition(arrayNumbers = [],level) {
	if (
		arrayNumbers.length === 0 ||
		stopWatch.innerHTML === "<b>Time's up!</b>"
	) {
		flowover = false;
		level_text_p.style.display = "none";
		rules_div.style.display = "none";
		question_div.style.display = "none";
		answer_div.style.display = "none";
		total_points.innerHTML = `${total}<b> Points</b>`;
		buttons.forEach((button) => {
			button.style.display = "none";
		});

		pop_div_holder.style.display = "block";
		pop_div_holder.innerHTML = `
			<div class="fixed h-96 w-96 text-white flex justify-evenly items-center flex-col pop-up-div">
				<p class="text-3xl font-bold uppercase font-rubic-scribble congratulations">congratulations</p>
				<p class="capitalize">Level: ${level}</p>
				<div class="w-full bg-transparent flex justify-evenly h-72 flex-col  relative  items-center">
					<p class="text-xl font-dm-serif font-semibold text-slate-300" id="end_answer_counter">Your Score Is: ${total}</p>
					<p class="text-xl font-dm-serif font-semibold text-green-700" id="end_correct_answer_counter">Correct Answers: ${end_correct_answer_counter_value} </p>
					<p class="text-xl font-dm-serif font-semibold text-red-700" id="end_wrong_answer_counter">Wrong Answers: ${end_wrong_answer_counter_value}</p>
					<i class="material-symbols-outlined fixed right-3 bottom-6 cursor-pointer" id="repeat_the_game" onclick="repeatTheGame()">
						replay
					</i>
				</div>
			</div>
		`;
	}
}
/*end popUp starts */



/*animation 3,2,1 starts*/
const countdownText = document.getElementById("countdown-text");
const countdownNumbers = ["Ready!", "Steady!", "Go!", "NaN"];

let index = 0;
function updateCountdown() {
	countdownText.innerText = countdownNumbers[index];

	// Restart the animation
	countdownText.style.animation = "none";
	countdownText.offsetHeight;
	countdownText.style.animation = "";

	index++;
	if (index < countdownNumbers.length) {
		setTimeout(updateCountdown, 2000);
	} else {
		countdown.style.display = "none";
		level_text_p.style.display = "block";
		rules_div.style.display = "flex";
		question_div.style.display = "flex";
		answer_div.style.display = "flex";
	}
}
/*animation 3,2,1 ends*/



/*timer starts */
function timer(cooo,level) {
	let timeLeft = cooo;

	const intervalId = setInterval(() => {
		stopWatch.innerHTML = `${timeLeft}<b>s Time Left</b>`;
		timeLeft--;

		if (timeLeft < 0) {
			clearInterval(intervalId);
			stopWatch.innerHTML = `<b class="bebas-neue-regular">Time Left</b>`;
			checkEndCondition([],level);
		}
	}, 1000);
}
/*timer ends */

/*repeat the game starts */
function repeatTheGame() {
	window.location.reload();
	localStorage.clear();
	pop_div_holder.innerHTML = `
            <div class="fixed h-96 w-96 text-white flex justify-evenly items-center flex-col pop-up-div">
				<p class="text-xl font-semibold">Choose Level To Start Challanges</p>
				<div class="w-full bg-slate-800 flex justify-evenly h-10">
					<button class="font-semibold transition-all ease-linear hover:text-green-900 text-green-500 uppercase" onclick="challenge_level(this.id)" id="easy">Easy </button>
					<button class="font-semibold transition-all ease-linear hover:text-yellow-900 text-yellow-500 uppercase" onclick="challenge_level(this.id)" id="medium">medium </button>
					<button class="font-semibold transition-all ease-linear hover:text-red-900 text-red-500 uppercase" onclick="challenge_level(this.id)" id="hard">Hard </button>
					<button class="font-semibold transition-all ease-linear hover:text-purple-900 text-purple-500 uppercase" onclick="challenge_level(this.id)" id="impossible">Impossible </button>
				</div>
			</div>
    `;
}
/*repeat the game ends */


window.onload = () => {
	localStorage.clear();
};
