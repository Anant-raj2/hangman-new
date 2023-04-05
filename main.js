import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://ookvhdrgehkrqelrgmlr.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9va3ZoZHJnZWhrcnFlbHJnbWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk0MTU5MTIsImV4cCI6MTk5NDk5MTkxMn0.OkeROd9gv_iDvRRUgRCK_ywS4UY1WhWuNOiwJ_pSGuE"
const supabase = createClient(supabaseUrl,supabaseKey);

// async function insertData(){
//   const { data, error } = await supabase
// .from('countries')
// .upsert({ id: 1, name: 'Albania' })
// .select()
// }

async function addData(name, score){
    const { data, error } = await supabase
  .from('data')
  .insert({name: name, score: score })
}

async function getData(){
  const { data, error } = await supabase
  .from('data')
  .select()
}
async function start() {
  //setup

  //Calling all of the elements from the index.html
  let txtEl = document.querySelector("#blankArr");
  let winEl = document.querySelector("#win");
  let imgEl = document.querySelector("#img");
  let guess = document.querySelector("#guesses");
  let guessNote = document.querySelector("#guessNote");
  let btn = document.querySelector("#btn");
  let btnWord = document.querySelector("#btn-word");
  let highEl = document.querySelector("#high");
  let letterElem = document.querySelector("#letter");

  //making a mistakes variable to keep track of number of mistakes made
  let mistake = 0;
  
  //setting the secret word
  let secret = await getRandomWord();
  console.log(secret)
  let secretArr = secret.toLowerCase().split("");

  //making the blank arr that holds the guessed guesses.
  let guesses = [];

  //making the blank arr that holds the guessed guesses.
  let blankArr = [];


  //setting "_" according to the number of letters in the secret
  for (let i = 0; i < secret.length; i++) {
    blankArr[i] = "_";
  }

  //printing blank arr onto the screen
  txtEl.innerHTML = blankArr.join(" ");

  //making a reset button, that reloads the page when pressed.
  btn.addEventListener("click", () => {
    location.reload();
  });


  //defining the win function
  function win(){

      //sets off a prompt that asks about your name
      let name = prompt("What is your name?")

      //Changes the text to "YOU WIN"
      winEl.innerHTML = "YOU WIN";

      //Disbales the text field
      letterElem.disabled = true;

      //checks to see if the highscore already has a value in it
      if(localStorage.getItem("Highscore") == null){

        addData(name, mistake)
        //asks for the name and sets the name to localStorage
        // localStorage.setItem("Name", name);
        
        // //sets the highscore to no. of mistakes
        // localStorage.setItem("Highscore", mistake);
        

      }else if(localStorage.getItem("Highscore") > mistake){   //if there is already a highscore it checks if the current no. of mistakes is lower than the previos highscore and replaces it.

        localStorage.setItem("Name", name);
        localStorage.setItem("Highscore", mistake);
    
      }

      //checks if there is no score
      if(localStorage.getItem("Highscore") == null){
        highEl.innerHTML = "No Score Yet"
      }else{
              //prints out the highscore from the localstorage

        highEl.innerHTML = "HIGHSCORE: " + localStorage.getItem("Highscore") + " [" + localStorage.getItem("Name") + "]"

      }
  
  }
  

  //defining a lose() funtion
function lose(){
  //Changes the winEl to "YOU LOSE"
  winEl.innerHTML = "You Lose";

  letterElem.disabled = true;

  //changes the image to a sad pic of Mr.Hust
  imgEl.src = "./hangman_images/DaveHustSad.jpg";
}

//Guess Word button
  btnWord.addEventListener('click', ()=>{
    let wordBox = prompt("Please enter your guess.");
    //checks to see if word guessed is equal to secret
    if(wordBox == secretArr.join("")){
      win();
    }else{
      lose()
    }
  })



  window.addEventListener('load', ()=>{
    //checks if there is no score
    if(localStorage.getItem("Highscore") == null){
      highEl.innerHTML = "No Score Yet"
    }else{
      highEl.innerHTML = "HIGHSCORE: " + localStorage.getItem("Highscore") + " [" + localStorage.getItem("Name") + "]"
    }
  })
  



  // Playing the game

  //waits for some key to be pressed on the input
  window.addEventListener("keydown", (event) => {

    //checks to see if the key pressed was the enter key.
    if (event.key == "Enter") {
      guessNote.innerHTML = ""
      //checks to see if the secret arr includes letterElem
      if (
        secretArr.includes(letterElem.value)
      ) {

        //whatever letter was inputed, is then checked to see if the letter was supposed to be placed in any of the blank arr areas
        for (let i = 0; i < secretArr.length; i++) {
          if (secretArr[i] == letterElem.value) {
            blankArr[i] = secretArr[i];
          }
        }


        //checks to see if blankarr is equal to the secret word, or in other words, a win condition
        if (secretArr.join(" ") == blankArr.join(" ")) {
          win();

        }

        //adds the correct word on the screen
        txtEl.innerHTML = blankArr.join(" ");
        letterElem.value = ""
      } else if(letterElem.value == "" || letterElem.value == " "){
        guess.innerHTML = "Guess a real word"
      }else if (mistake < 6) {

        if (guesses.includes(letterElem.value) == true) {

          guessNote.innerHTML = "Guessed already";
        }else{
          //counting mistakes
          mistake += 1;

          //using mistakes to print out the correct image
          imgEl.src = "./hangman_images/hangman" + mistake + ".png";
          //push the guess to guess[]
          guesses.push(letterElem.value);
          //printing the existing guesses
          guess.innerHTML = guesses.join(" , ");
        }


        

      }  else if (mistake > 5) {
        lose();

        //checks to see if it was guessed again
      }
    }
  });
}

async function getRandomWord() {
  //fetches a random word
  const wordsGit = await fetch(
    "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt"
  );

  //changes the word fetched to text
  let wordsTxt = await wordsGit.text();
  //splits it into an array containing all of them
  const wordsList = wordsTxt.split("\n");

  console.log(wordsList);

  //defining a array for the filteredWord
  let filteredWord = [];

  //loops throught the array
  for (let i = 0; i < wordsList.length; i++) {
    let word = wordsList[i];
    //filters the words looped through
    if (word.length >= 5 && word.length <= 8) {
      filteredWord.push(word);
    }
  }
  console.log(filteredWord);
  //rounds the number down, this will be used to select a random word
  let randomNum = Math.floor(Math.random() * filteredWord.length);
  const randomWord = filteredWord[randomNum];
  //returns a random word
  return randomWord;
}


start();