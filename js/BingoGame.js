(function(){
  'use strict';

	const RUN_TIME_OUT = 20; // RUN_TIME_OUT * RUN_REF_RATE
	const RUN_REF_RATE = 150;
	const AUDIO_PATH = 'audio/';

	// ++++++++++++Global var++++++++++++++++
	var BingoNums = [];

	//var btnStop = document.getElementById('btnStop');
    var btnRun = document.getElementById('btnRun');

    var digitOnes = document.getElementById('digitOnes');
    var digitTens = document.getElementById('digitTens');
	
	var audioRun = document.getElementById('audioRun');
	var audioStop = document.getElementById('audioStop');
	
	var input = document.getElementById("myInput");

	var mapBingoNumClass = new Map([['0' , 'digit digZero'], 
		['1', 'digit digOne'],
		['2', 'digit digTwo'],
		['3', 'digit digThree'],
		['4', 'digit digFour'],
		['5', 'digit digFive'],
		['6', 'digit digSix'],
		['7', 'digit digSeven'],
		['8', 'digit digEight'],
		['9', 'digit digNine']]);

	var musics = ['until_you.mp3',
		'that_girl.mp3',
		'love_paradise.mp3',
		'my_way.mp3',
		'im_yours.mp3'];

	var curHitBingoNumIdx = 0;
	var timer = null;
	var isRunning = false;

	//++++++++++++Main process++++++++++++++++
	createBingoList();

	createHitSeq();

	// Danger! Conflict with button enter event
	//document.addEventListener('keypress', function(event) {
	//	if ( event.which == 13 ) {
	//		clickBtn();
	//	}
    //});

	btnRun.addEventListener('click', function() {
		clickBtn();
    });

    var timer = null;
	var timerCounter=0;
    var isPlaying = false;

	//++++++++++++Function region++++++++++++++++
	function clickBtn() {
		if(!isRunning) {
			startRunning();
		} else {
			stopRunning();
		}
	}

	function startRunning() {
		btnRun.innerHTML = "STOP";
		isRunning = true;

		//pickMusicRandom();
		playSound(audioRun);

		// At the end of the show - music only
		if(BingoNums.length === 0) {
			return;
		}

		timer = setInterval(function(){
            curHitBingoNumIdx = Math.floor(Math.random() * BingoNums.length);
            displayBingoNum(digitTens,BingoNums[curHitBingoNumIdx].substr(0, 1));
			displayBingoNum(digitOnes,BingoNums[curHitBingoNumIdx].substr(1, 2));
			timerCounter += 1;
			if(timerCounter === RUN_TIME_OUT) {
				stopRunning();
			}
        }, RUN_REF_RATE);
	}

	function pickMusicRandom() {
		var rndIdx = Math.floor(Math.random() * musics.length);
		//console.log(rndIdx);
		audioRun.src = AUDIO_PATH.concat(musics[rndIdx]);
		//console.log(AUDIO_PATH.concat(musics[rndIdx]));
	}

	function stopRunning() {
		stopSound(audioRun);
		playSound(audioStop);

		clearInterval(timer);
		timer = null;
		timerCounter = 0;

		if(BingoNums.length > 0) {
			// Remove current hit bingo number of the candidate list
			var curHitBingoNum = Number(BingoNums[curHitBingoNumIdx]);
			BingoNums.splice(curHitBingoNumIdx, 1);

			// Light it up at hit sequence area
			var hitSeq = document.querySelectorAll(".hit-number");
			hitSeq[curHitBingoNum - 1].className = "hit-number selected";
		}

		isRunning = false;
		btnRun.innerHTML = "START";
	}

	function createBingoList() {
		for (var i = 1; i <= 75; i++) {
			BingoNums.push(pad2Digits(i));
		}
	}

	function pad2Digits(num) {
		return ("00" + num).substr(-2,2);
	}

	function createHitSeq() {
		var hitseq = document.getElementById("hitseq");
        var fragment = document.createDocumentFragment();
        var divWrapper;
        BingoNums.forEach(function(elem, index){
            if( index % 15 === 0 ){
                divWrapper = fragment.appendChild(document.createElement("div"));
				divWrapper.className = "br-div";
            }
            var numDiv = divWrapper.appendChild(document.createElement("div"));
            numDiv.className = "hit-number";
            numDiv.innerHTML = elem;
        });

        hitseq.appendChild(fragment);
    };
	
	function displayBingoNum(digit, value) {
		digit.className = mapBingoNumClass.get(value);
	}
	
	function playSound(aud) {
		if(aud == null){
			return;
		}
		aud.currentTime = 0;
		aud.play();
	}

	function stopSound(aud){
		if(aud == null){
			return;
		}
		aud.pause();
	}

})();