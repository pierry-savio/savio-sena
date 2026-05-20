async function ultimos10Mega() {
    // pega o concurso mais recente
    const latest = await fetch(
        "https://loteriascaixa-api.herokuapp.com/api/megasena/latest"
    ).then(r => r.json());

    const ultimoConcurso = latest.concurso;

    const requests = [];

    for (let i = 0; i < 10; i++) {
        requests.push(
            fetch(
                `https://loteriascaixa-api.herokuapp.com/api/megasena/${ultimoConcurso - i}`
            ).then(r => r.json())
        );
    }

    const resultados = await Promise.all(requests);

    console.log(resultados);
    return resultados;
}

ultimos10Mega()[0];