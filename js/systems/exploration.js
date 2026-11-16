const CUSTO_TEMPO_EXPLORAR = [5, 9];

function getEstadoExploracao(local) {
	if (!saveAtual.exploracao) saveAtual.exploracao = {};
	if (!saveAtual.exploracao[local.id]) {
		saveAtual.exploracao[local.id] = { chance: local.exploracao.chanceInicial || 0, vezes: 0, descobertos: [] };
	}
	return saveAtual.exploracao[local.id];
}

function caminhoDescoberto(local, caminhoId) {
	return getEstadoExploracao(local).descobertos.indexOf(caminhoId) !== -1;
}

function iniciarExploracao(local) {
	if (emTransicao) return;

	const cfg = local.exploracao;
	const estado = getEstadoExploracao(local);

	const faixa = cfg.custoTempo || CUSTO_TEMPO_EXPLORAR;
	avancarTempo(saveAtual, faixa[0] + Math.floor(Math.random() * (faixa[1] - faixa[0] + 1)));
	estado.vezes++;

	const naoDescobertos = (cfg.caminhos || []).filter(function (c) { return estado.descobertos.indexOf(c.id) === -1; });

	if (naoDescobertos.length > 0 && Math.random() * 100 < estado.chance) {
		mostrarEventoCaminhoEncontrado(local, naoDescobertos[Math.floor(Math.random() * naoDescobertos.length)]);
	} else {
		estado.chance = Math.min(100, estado.chance + cfg.incremento);
		mostrarExploracaoNormal(local);
	}

	atualizarHud();
}

function mostrarExploracaoNormal(local) {
	const cfg = local.exploracao;
	trocarBackground(escolherPorPeriodo(cfg.imagemNormal, cfg.imagemNormalTarde, cfg.imagemNormalNoite) || getBackgroundDoLocal(local));
	digitarTexto(document.getElementById("dialogueText"), local.exploracao.textoNormal || "Você explora os arredores, mas não encontra nada de novo dessa vez.");

	const choicesEl = document.getElementById("dialogueChoices");
	choicesEl.innerHTML = "";
	choicesEl.appendChild(criarBotaoEscolha("Continuar", function () { renderScene(local); }, "", true));
	choicesEl.appendChild(criarBotaoEscolha("Explorar de novo", function () { iniciarExploracao(local); }, "choice-btn--explore"));
}

function mostrarEventoCaminhoEncontrado(local, caminho) {
	trocarBackground(caminho.imagemEncontro || getBackgroundDoLocal(local));
	digitarTexto(document.getElementById("dialogueText"), caminho.textoEncontro);

	const choicesEl = document.getElementById("dialogueChoices");
	choicesEl.innerHTML = "";

	choicesEl.appendChild(criarBotaoEscolha(caminho.label, function () {
		getEstadoExploracao(local).descobertos.push(caminho.id);
		irPara(caminho.destino, false);
	}, "choice-btn--explore"));

	choicesEl.appendChild(criarBotaoEscolha("Continuar explorando", function () {
		const estado = getEstadoExploracao(local);
		estado.chance = Math.max(0, estado.chance - local.exploracao.penalidade);
		iniciarExploracao(local);
	}, "choice-btn--ignore"));
}