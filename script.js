let games_quantity = 3;

//Constests painel number
const item_number = document.getElementById("item-number");
item_number.textContent = 0;

//Analysis painel
const analysis_percent = document.getElementById("analysis_percent");
analysis_percent.textContent = "0%";

renderHighNumbers();
renderContests();

//Sumary dinamic title
const title_sumary = document.getElementById("title-sumary");
title_sumary.textContent = `RESUMO - ÚLTIMOS ${games_quantity} JOGOS`;

async function renderHighNumbers(){
    //Variable
    const highNumbers = await getNumbersHigh();

    //Elements n
    let n1 = document.getElementById("n1");
    const n2 = document.getElementById("n2");
    const n3 = document.getElementById("n3");
    const n4 = document.getElementById("n4");
    const n5 = document.getElementById("n5");
    const n6 = document.getElementById("n6");

    if (highNumbers[0].h_number > 9){
        n1.textContent = highNumbers[0].h_number;
    }
    else{
        n1.textContent = "0"+highNumbers[0].h_number;
    }

    if (highNumbers[1].h_number > 9){
        n2.textContent = highNumbers[1].h_number;
    }
    else{
        n2.textContent = "0"+highNumbers[1].h_number;
    }

    if (highNumbers[2].h_number > 9){
        n3.textContent = highNumbers[2].h_number;
    }
    else{
        n3.textContent = "0"+highNumbers[2].h_number;
    }

    if (highNumbers[3].h_number > 9){
        n4.textContent = highNumbers[3].h_number;
    }
    else{
        n4.textContent = "0"+highNumbers[3].h_number;
    }

    if (highNumbers[4].h_number > 9){
        n4.textContent = highNumbers[4].h_number;
    }
    else{
        n4.textContent = "0"+highNumbers[4].h_number;
    }

    if (highNumbers[5].h_number > 9){
        n4.textContent = highNumbers[5].h_number;
    }
    else{
        n4.textContent = "0"+highNumbers[5].h_number;
    }

    //Elements n_reps
    n1_reps = document.getElementById("n1_reps");
    n2_reps = document.getElementById("n2_reps");
    n3_reps = document.getElementById("n3_reps");
    n4_reps = document.getElementById("n4_reps");
    n5_reps = document.getElementById("n5_reps");
    n6_reps = document.getElementById("n6_reps");
    n1_reps.textContent = highNumbers[0].times + "x";
    n2_reps.textContent = highNumbers[1].times + "x";
    n3_reps.textContent = highNumbers[2].times + "x";
    n4_reps.textContent = highNumbers[3].times + "x";
    n5_reps.textContent = highNumbers[4].times + "x";
    n6_reps.textContent = highNumbers[5].times + "x";

}

async function getNumbersHigh() {
    const games = await lastMega(games_quantity);
    let numb = [];

    for (let i = 0; i < games_quantity; i++) {
        for (let j = 0; j < 6; j++) {
            numb.push(games[i].dezenas[j]);
        }
    }

    // Conta repetições
    let count = {};

    for (let num of numb) {
        count[num] = (count[num] || 0) + 1;
    }

    // Pega os 6 que mais repetem + quantidade
    let topN = Object.entries(count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([h_number, times]) => ({
            h_number: Number(h_number),
            times: times
        }));

    return topN;
}

async function lastMega(number) {
    const latest = await fetch(
        "https://loteriascaixa-api.herokuapp.com/api/megasena/latest"
    ).then(r => r.json());

    const lastContest = latest.concurso;
    const requests = [];

    for (let i = 0; i < number; i++) {
        requests.push(
            fetch(
                `https://loteriascaixa-api.herokuapp.com/api/megasena/${lastContest - i}`
            ).then(r => r.json())
        );
    }
    return await Promise.all(requests);
}

async function renderContests() {

    const games = await lastMega(games_quantity);
    console.log(games);

    for (let i = 0; i < games_quantity; i++){

        //Father
        const contests = document.getElementById("contests");

        //Contest
        let contest = document.createElement('div');
        contest.classList.add("contest");

        //Variables
        let contest_number = games[i].concurso;
        let date = games[i].data;
        let numbers = games[i].dezenas;
        let even = getEven(numbers);
        let odd = getOdd(numbers);
        let skiped = getSkipedTen(numbers);

        contest.innerHTML = 
        `
            <div class="contest-title-date">
                <h4>Concurso ${contest_number}</h4>
                <p class="contest-date">${date}</p>
            </div>

            <div class="contest-numbers">
                <p class="contest-number">${numbers[0]}</p>
                <p class="contest-number">${numbers[1]}</p>
                <p class="contest-number">${numbers[2]}</p>
                <p class="contest-number">${numbers[3]}</p>
                <p class="contest-number">${numbers[4]}</p>
                <p class="contest-number">${numbers[5]}</p>
            </div>

            <div class="contest-status">
                <p>${even} pares</p>
                <p>${odd} ímpares</p>
                <p>Pulou ${skiped}</p>
            </div>
        `;
        contests.appendChild(contest);

        analysis_percent.textContent = "100%";
        item_number.textContent = games_quantity;
    }
}

function getOdd(numbers){
    let odd = 0;

    for (let i = 0; i<numbers.length; i++){
        if (numbers[i] % 2 !== 0){
            odd++;
        }
    }

    return odd;
}

function getEven(numbers){
    let even = 0;

    for (let i = 0; i<numbers.length; i++){
        if (numbers[i] % 2 === 0){
            even++;
        }
    }

    return even;
}

function getSkipedTen(numbers){

    let skiped = [];

    for (let start = 1; start <= 60; start += 10) {
        let end = start + 9;

        // verifica se existe algum número dentro da dezena
        let hasNumber = numbers.some(n => n >= start && n <= end);

        // se não existir, adiciona o final da dezena
        if (!hasNumber) {
            skiped.push(end);
        }
    }
    return skiped.join(", ");
}


