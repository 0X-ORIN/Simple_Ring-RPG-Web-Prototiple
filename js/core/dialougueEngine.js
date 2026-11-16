let digitando = false;

function digitarTexto(elemento, texto, velocidade = 18, aoTerminar) {
	clearInterval(elemento._typingInterval);
	elemento._textoCompleto = texto || "";
	elemento._aoTerminar = aoTerminar || null;
	elemento.textContent = "";

	if (!texto) {
		digitando = false;
		if (aoTerminar) aoTerminar();
		return;
	}

	digitando = true;
	const caracteres = Array.from(texto);
	let i = 0;

	elemento._typingInterval = setInterval(() => {
		i++;
		elemento.textContent = caracteres.slice(0, i).join("");
		if (i >= caracteres.length) {
			clearInterval(elemento._typingInterval);
			digitando = false;
			if (elemento._aoTerminar) elemento._aoTerminar();
		}
	}, velocidade);
}

function pularDigitacao() {
	const elemento = document.getElementById("dialogueText");
	if (digitando) {
		clearInterval(elemento._typingInterval);
		elemento.textContent = elemento._textoCompleto;
		digitando = false;
		if (elemento._aoTerminar) elemento._aoTerminar();
	}
}

function escolherPorPeriodo(dia, tarde, noite) {
	const periodo = saveAtual ? getPeriodoDoTempo(saveAtual.tempo) : TIME_OF_DAY.MORNING.label;
	if (periodo === TIME_OF_DAY.AFTERNOON.label && tarde) return tarde;
	if (periodo === TIME_OF_DAY.NIGHT.label && noite) return noite;
	return dia;
}

function getBackgroundDoLocal(local) {
	return escolherPorPeriodo(local.background, local.backgroundTarde, local.backgroundNoite);
}

function trocarBackground(src) {
	const bgSharp = document.getElementById("gameBackground");
	const bgBlur = document.getElementById("gameBackgroundBlur");

	if (src) {
		bgSharp.src = src;
		bgBlur.src = src;
		bgSharp.style.display = "block";
		bgBlur.style.display = "block";
	} else {
		bgSharp.style.display = "none";
		bgBlur.style.display = "none";
	}
}

function opcoesDaCena() {
	return Array.from(document.querySelectorAll("#dialogueChoices .choice-btn"));
}

function criarBotaoEscolha(label, aoClicar, classeExtra, ehVoltar) {
	const btn = document.createElement("button");
	btn.className = "choice-btn" + (classeExtra ? " " + classeExtra : "");
	btn.type = "button";
	btn.textContent = label;
	if (ehVoltar) btn.dataset.voltar = "1";
	btn.addEventListener("click", aoClicar);
	btn.addEventListener("mouseenter", function () {
		Input.definirFoco(opcoesDaCena(), btn);
	});
	return btn;
}

function renderScene(local) {
	trocarBackground(getBackgroundDoLocal(local));
	digitarTexto(document.getElementById("dialogueText"), local.texto);

	const choicesEl = document.getElementById("dialogueChoices");
	choicesEl.innerHTML = "";

	local.conexoes.forEach((conexao) => {
		const ehVoltar = /^(voltar\b|sair$)/i.test(conexao.label);
		choicesEl.appendChild(criarBotaoEscolha(conexao.label, () => irPara(conexao.id, false, conexao.custoTempo), "", ehVoltar));
	});

	if (local.exploracao) {
		(local.exploracao.caminhos || []).filter((c) => caminhoDescoberto(local, c.id)).forEach((caminho) => {
			choicesEl.appendChild(criarBotaoEscolha(caminho.label, () => irPara(caminho.destino, false)));
		});

		choicesEl.appendChild(criarBotaoEscolha("Explorar", () => iniciarExploracao(local), "choice-btn--explore"));
	}

	if (typeof prepararLoja === "function") prepararLoja(local, choicesEl);
}

Input.empurrar({
	id: "cena",
	ativa: function () { return !!saveAtual && !emTransicao; },
	aoCima: function () { Input.moverFoco(opcoesDaCena(), -1); },
	aoBaixo: function () { Input.moverFoco(opcoesDaCena(), 1); },
	aoConfirmar: function () {
		if (digitando) { pularDigitacao(); return; }
		const itens = opcoesDaCena();
		const focado = itens.find((el) => el.classList.contains("foco"));
		if (focado) focado.click();
		else Input.moverFoco(itens, 1);
	},
	aoVoltar: function () {
		const voltar = document.querySelector("#dialogueChoices .choice-btn[data-voltar]");
		if (voltar) voltar.click();
	},
	aoMenu: function () { abrirMenu(); }
});

document.getElementById("gameScreen").addEventListener("click", (e) => {
	if (e.target.closest(".choice-btn") || e.target.closest(".btn-menu") || e.target.closest(".shop-window")) return;
	pularDigitacao();
});