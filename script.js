document.addEventListener('DOMContentLoaded', () => {
    quizdata = null;
    fetch('quiz-data.json').then(res => res.json())
        .then(data => {
            quizdata = data
            initsections();
        })
        .catch(e => console.error('Error occured', e))

    function initsections() {
        let sections = document.querySelectorAll('.section')
        sections.forEach(section => {
            section.addEventListener('click', function () {
                let currentsection = this.getAttribute('data-section')
                startQuiz(currentsection)
            })
        })
    }

    let maxScore = Number(localStorage.getItem('maxScore')) || 0;
    function startQuiz(index) {
        let currentquestion = quizdata.sections[index].questions
        let currentquestionindex = 0;
        let score = 0;
        let ansselected = false;
        document.querySelector('#quiz-container').style.display = 'none'
        document.querySelector('#question-container').style.display = 'block'
        document.querySelector('#question-container').innerHTML = `
        <p id="score">Score:0</p>
        <div id="question"></div>
        <div id="options"></div>
         <button id="next-button">Next</button>
        `


        showquestions()
        function showquestions() {

            let questionpresent = currentquestion[currentquestionindex];
            let questionelement = document.getElementById('question')
            let optionelement = document.getElementById('options');

            questionelement.textContent = questionpresent.question;
            optionelement.innerHTML = ' '

            if (questionpresent.questionType == 'mcq') {
                questionpresent.options.forEach((option, index) => {

                    let div = document.createElement('div');
                    div.textContent = option;


                    div.addEventListener('click', () => {
                        if (!ansselected) {
                            ansselected = true;
                            div.classList.add('selected')
                            checkans(option, questionpresent.answer)
                            console.log(option)
                        }
                    });

                    optionelement.appendChild(div);

                });
            } else {
                let inputelement = document.createElement('input')
                inputelement.type = questionpresent.questionType == 'number' ? 'number' : 'text'
                const submitbutton = document.createElement('button');
                submitbutton.className = 'submit-answer'
                submitbutton.textContent = 'SUBMIT'

                submitbutton.onclick = () => {
                    if (!ansselected) {
                        ansselected = true;
                        checkans(inputelement.value.toString(), questionpresent.answer.toString())

                    }
                }

                optionelement.appendChild(inputelement);
                optionelement.appendChild(submitbutton)


            }

        }
        function checkans(selectedans, originalans) {
            let feedbackelement = document.createElement('div')
            feedbackelement.id = 'feedback'
            if (selectedans === originalans || selectedans.toLowerCase() === originalans.toLowerCase()) {
                feedbackelement.textContent = 'CORRECT'
                feedbackelement.style.color = 'green'
                score++

            } else {
                feedbackelement.textContent = 'WRONG' + ' Correct Answer : ' + originalans
                feedbackelement.style.color = 'RED'
            }
            const optionselement = document.getElementById('options')
            optionselement.appendChild(feedbackelement);
            updatescore()

        }
        function updatescore() {
            let presentscore = document.getElementById('score')
            presentscore.textContent = 'Score:' + score

        }



        document.getElementById('next-button').addEventListener('click', function () {
            if (currentquestionindex < currentquestion.length - 1) {
                currentquestionindex++
                showquestions()
                ansselected = false;

            } else {
                endquiz()
            }
        });
        

        function endquiz() {

            let questionContainer = document.getElementById('question-container');
            let quizcontainer = document.getElementById('quiz-container')

            if (score > maxScore) {
            maxScore = score;
            localStorage.setItem('maxScore', maxScore);
            }

            questionContainer.innerHTML = `
             <h1>Quiz Completed </h1>
             <p>Your final score : ${score} / ${currentquestion.length}</p>
             <p>Max Score: ${maxScore}</p>
             <button id = 'home-button' >Home </button>


            `
            document.getElementById('home-button').addEventListener('click', () => {
                quizcontainer.style.display = 'grid';
                questionContainer.style.display = 'none'
            })
        }


    }




})