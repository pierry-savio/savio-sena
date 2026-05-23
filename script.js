let games_quantity = 10;

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
    const highNumbers = await getNumbersHigh(6);

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
        n5.textContent = highNumbers[4].h_number;
    }
    else{
        n5.textContent = "0"+highNumbers[4].h_number;
    }

    if (highNumbers[5].h_number > 9){
        n6.textContent = highNumbers[5].h_number;
    }
    else{
        n6.textContent = "0"+highNumbers[5].h_number;
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

async function getNumbersHigh(quantity) {
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
        .slice(0, quantity)
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

// GAME GENERATION
const games_quantity_p = document.getElementById("games_quantity_p");
const games_quantity_minus = document.getElementById("games_quantity_minus");
const games_quantity_plus = document.getElementById("games_quantity_plus");

games_quantity_minus.addEventListener('click', () =>{
    if (Number(games_quantity_p.textContent) > 1){
        games_quantity_p.textContent = Number(games_quantity_p.textContent) - 1;
    }
});

games_quantity_plus.addEventListener('click', () =>{
    games_quantity_p.textContent = Number(games_quantity_p.textContent) + 1;
});

//Odd and even
const eop_even_n = document.getElementById("eop-even-n");
const eop_odd_n = document.getElementById("eop-odd-n");

const eop_even_minus = document.getElementById("eop-even-minus");
const eop_even_plus = document.getElementById("eop-even-plus");
const eop_odd_minus = document.getElementById("eop-odd-minus");
const eop_odd_plus = document.getElementById("eop-odd-plus");

eop_even_minus.addEventListener('click', () => {
    eop_even_n.textContent = Number(eop_even_n.textContent) - 1;
    eop_odd_n.textContent = Number(eop_odd_n.textContent) + 1;
});

eop_even_plus.addEventListener('click', () => {
    eop_even_n.textContent = Number(eop_even_n.textContent) + 1;
    eop_odd_n.textContent = Number(eop_odd_n.textContent) - 1;
});

eop_odd_minus.addEventListener('click', () => {
    eop_odd_n.textContent = Number(eop_odd_n.textContent) - 1;
    eop_even_n.textContent = Number(eop_even_n.textContent) + 1;
});

eop_odd_plus.addEventListener('click', () => {
    eop_odd_n.textContent = Number(eop_odd_n.textContent) + 1;
    eop_even_n.textContent = Number(eop_even_n.textContent) - 1;
});

//Skip tens
const ten1 = document.getElementById("ten1");
const ten2 = document.getElementById("ten2");
const ten3 = document.getElementById("ten3");
const ten4 = document.getElementById("ten4");
const ten5 = document.getElementById("ten5");
const ten6 = document.getElementById("ten6");

ten1.addEventListener('click', () => {
    if (ten1.classList.contains("select")){
        ten1.classList.remove("select");
    }
    else{
        if (getSkipedTensQuantity() < 5){
            ten1.classList.add("select");
        }
    }
});

ten2.addEventListener('click', () => {
    if (ten2.classList.contains("select")){
        ten2.classList.remove("select");
    }
    else{
        if (getSkipedTensQuantity() < 5){
            ten2.classList.add("select");
        }
    }
});

ten3.addEventListener('click', () => {
    if (ten3.classList.contains("select")){
        ten3.classList.remove("select");
    }
    else{
        if (getSkipedTensQuantity() < 5){
            ten3.classList.add("select");
        }
    }
});

ten4.addEventListener('click', () => {
    if (ten4.classList.contains("select")){
        ten4.classList.remove("select");
    }
    else{
        if (getSkipedTensQuantity() < 5){
            ten4.classList.add("select");
        }
    }
});

ten5.addEventListener('click', () => {
    if (ten5.classList.contains("select")){
        ten5.classList.remove("select");
    }
    else{
        if (getSkipedTensQuantity() < 5){
            ten5.classList.add("select");
        }
    }
});

ten6.addEventListener('click', () => {
    if (ten6.classList.contains("select")){
        ten6.classList.remove("select");
    }
    else{
        if (getSkipedTensQuantity() < 5){
            ten6.classList.add("select");
        }
    }
});


function getSkipedTensQuantity(){
    let skipedTensQuantity = 0;

    if (ten1.classList.contains("select")){
        skipedTensQuantity++;
    }

    if (ten2.classList.contains("select")){
        skipedTensQuantity++;
    }

    if (ten3.classList.contains("select")){
        skipedTensQuantity++;
    }

    if (ten4.classList.contains("select")){
        skipedTensQuantity++;
    }

    if (ten5.classList.contains("select")){
        skipedTensQuantity++;
    }

    if (ten6.classList.contains("select")){
        skipedTensQuantity++;
    }

    console.log(skipedTensQuantity);
    return skipedTensQuantity;
}

//TODO - Lógica de gerar os jogos - Botão de gerar jogos abaixo 👇
const generate_button = document.getElementById("generate-button");

generate_button.addEventListener('click', () => {
    //lógica aqui
});
