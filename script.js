let games_quantity = 5;

const title_sumary = document.getElementById("title-sumary");
title_sumary.textContent = `RESUMO - ÚLTIMOS ${games_quantity} JOGOS`;

const item_number = document.getElementById("item-number");
item_number.textContent = games_quantity;

async function lastMega(number) {
    // pega o concurso mais recente
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
        const contests = document.getElementById("contests");
        let contest = document.createElement('div');
        contest.classList.add("contest");

        let contest_number = games[i].concurso;
        let date = games[i].data;
        let numbers = games[i].dezenas;
        let even = 0;

        for (let i = 0; i<numbers.length; i++){
            if (numbers[i] % 2 === 0){
                even++;
            }
        }

        let odd = 6 - even;

        let skiped = "";

        if
        (
            numbers[0] > 1 || numbers[1] > 10 || numbers[2] > 10 ||
            numbers[3] > 10 || numbers[4] > 10 || numbers[5] > 10
        ){
            skiped += "1-10, ";
        }
        

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
    }
}

renderContests();
/*

<div class="contest">

    <div class="contest-title-date">
        <h4>Concurso 2780</h4>
        <p class="contest-date">14/05/2025</p>
    </div>

    <div class="contest-numbers">
        <p class="contest-number">04</p>
        <p class="contest-number">12</p>
        <p class="contest-number">23</p>
        <p class="contest-number">35</p>
        <p class="contest-number">48</p>
        <p class="contest-number">58</p>
    </div>

    <div class="contest-status">
        <p>3 pares</p>
        <p>3 ímpares</p>
        <p>Pulou 51-60</p>
    </div>

</div>

*/

