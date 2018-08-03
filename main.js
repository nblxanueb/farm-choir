$(function(){

  let $body = $('.body');
  let $images = $('.images');
  let $sound = $('.sound');
  let $tryAgain = $('.try-again');
  let $next = $('.next');
  let $reset = $('.reset');
  let $choirSize = $('.choir-size');
  let $scoreValue = $('.score-value');
  let $username = $('.username');
  let $nameUser = $('.nameUser');
  let $continue = $('.continue');
  let $rules = $('.rules');
  let animals = ['bird', 'cat', 'chicken', 'cow', 'dog', 'duck', 'horse', 'pig', 'rooster', 'sheep'];
  let randomSong = [];
  let userInput = [];
  let clickCount = 0;
  let songCount = 3;
  let score = 0;
  let newUser = '';

  $choirSize.html(songCount);
  $scoreValue.html(score);

  // plays background sound
  backgroundAudio = new Audio('sounds/background.m4a');
  backgroundAudio.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
  }, false);
  backgroundAudio.volume = 0.1;
  backgroundAudio.play();

  // disables button click
  function disable(i) {
    i.prop("disabled", true);
    i.removeClass('button-enabled');
  }

  //enables button click
  function enable(i) {
    i.prop("disabled", false);
    i.addClass('button-enabled');
  }

  $continue.click(function() {
    if (!newUser.length) event.preventDefault();
  });

  // let soundInterval = 6000;

  $username.click(function () {
    newUser = prompt ('Please enter username:');
    $username.html(newUser);
    localStorage.gameUsername = newUser;
  });

  $nameUser.html(localStorage.gameUsername);

  function soundToggle() {
    $sound.addClass("sound-playing");
    window.setInterval(() => {
      $sound.removeClass("sound-playing");
    }, 500);
  }

  soundToggle();

  disable($next);
  disable($tryAgain);

  mainFunction();

  // used to randomize animals array to create a randomSong
  let randomizeArray = function () {
    for (let i = 0; i < songCount; i++) {
      let randomNum = (Math.floor(Math.random() * animals.length));
      randomSong.push(animals[randomNum]);
    }
  };

  // clicking any animal image on page will call playAnimalSound function
  $('.images').on('click', '*', function () {
    playAnimalSound(this);
    clickCount++;
    // console.log(`click count is ${clickCount}`);
  });

  // depending on the animal clicked, plays corresponding song
  // grabs animal class and uses it in the audio file path to locate the correct audio file
  function playAnimalSound (animal) {
    let audio = new Audio();
    audio.src = `sounds/${$(animal).attr('class')}.mp3`;
    audio.play();
    userInput.push($(animal).attr('class'));
    // console.log(userInput);
  }

  // starts the round; on click, a random array is generated; user need to click on the animals in the right order
  // after the right amount of clicks, either 'next' or 'reset' buttons are displayed

  function mainFunction () {

    $sound.one('click', function() {

      $sound.addClass("sound-playing");
      randomizeArray();
      console.log(randomSong);
      playRandomSong();

      window.setInterval(() => {
        $sound.removeClass("sound-playing");

        if (clickCount == songCount) {
          clickCount++;
          // console.log(clickCount);
          checkWinner(userInput, randomSong);
          // console.log(clickCount);
        }
      }, 1000);

    });
  }

  // compares the values of randomSong and userInput arrays to see if the user selected animals in correct order  .
  let checkWinner = function (array1, array2) {

    setTimeout(() => {

      for (let i = 0; i <= array1.length - 1; i++) {
        if (array1[i] !== array2[i]) {
          enable($tryAgain);
          disable($next);
          let losing = new Audio();
          losing.src = `sounds/losing.mp3`;
          losing.play();

        } else {

          enable($next);
          disable($tryAgain);
          let winning = new Audio();
          winning.src = `sounds/winning.mp3`;
          winning.play();

        }
      }
    }, 2500);
  };


  // grabs elements of randomSong array, passes values to playSound to output corresponding audio files
  function playRandomSong() {

    // console.log('playrandomsong was called');
    randomSong.forEach((sound, i) => {

      const delay = i * 2000;
      setTimeout(() => {
        playSound(sound);
      }, delay);
    });

  }

  // plays sounds corresponding to the animal values generated in the randomSong array
  let playSound = function (filename) {

    let audio = new Audio();
    audio.src = `sounds/${filename}.mp3`;
    audio.play();

  };


  // reset button used to clear randomSong and userInput arrays
  $tryAgain.click(function () {

    randomSong = [];
    userInput = [];
    clickCount = 0;
    // console.log('reset was pressed');
    // console.log(userInput);
    // console.log(randomSong);
    disable($tryAgain);
    disable($next);
    soundToggle();
    mainFunction();

  });

  // next button used to proceed to the next level
  $next.click(function () {

    clickCount = 0;
    songCount += 2;
    randomSong = [];
    userInput = [];
    score++;
    disable($tryAgain);
    disable($next);
    console.log(`user score is ${score}`);
    soundToggle();
    mainFunction();
    $choirSize.html(songCount);
    $scoreValue.html(score);

  });

  $reset.click(function() {

    userInput = [];
    clickCount = 0;
    console.log(userInput);
    console.log(clickCount);

  });

});    //opening ({})
