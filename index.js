// https://opentdb.com/api.php?amount=10
// https://opentdb.com/api.php?amount=1
const _question = document.getElementById("question");
const _option = document.querySelector(".quiz-options");
const _correctScore = document.getElementById("correct-score");
const _totalQuestion = document.getElementById("total-question");
const _checkBtn = document.getElementById("check-answer");
const _playAgainBtn = document.getElementById("play-again");
const _result = document.getElementById("result")
let correct_answer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10;

// event Listener
function eventListeners(){
    _checkBtn.addEventListener('click',checkAnswer);
    _playAgainBtn.addEventListener('click',restartQuiz);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  eventListeners();

  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  const APIUrl = "https://opentdb.com/api.php?amount=1";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  _result.innerHTML = "";
  // console.log(data)
  showQuestion(data.results[0]);
}
function showQuestion(data) {
    _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  _option.innerHTML = `
        ${optionsList
          .map(
            (option, index) => `
        <li>${index + 1}. <span> ${option}</span></li>
        `
          )
          .join("")}
     `;
  selectOptions();
}

// Options Selection
function selectOptions() {
  _option.querySelectorAll('li').forEach((option) => {
    option.addEventListener("click", () => {
      if (_option.querySelector(".selected")) {
        const activeOption = _option.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
  console.log(correctAnswer);
}

// Answer Checking

function checkAnswer(){
    _checkBtn.disabled = true;
    if(_option.querySelector(".selected")){
        let selectedAnswer = _option.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>CorrectAnswer </p>`;
        }else{
            _result.innerHTML = `<p> <i class = "fas fa-times"></i>Incorrect Answer!</p> <p><samll><b> Correct Answer:</b>${correctAnswer}</samll></p>`;
        }
        checkCount();
    }else{
        _result.innerHTML = `<p> <i class = 'fas fa-question'></i>Please select an Option ! </p>`;
        _checkBtn.disabled = false;
    }
}
function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString,"text/html");
    return doc.documentElement.textContent;

}
function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        _result.innerHTML = `<p> Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";

    }else{
        setTimeout(()=>{
            loadQuestion();
        },300)
    }
}
function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}
function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}