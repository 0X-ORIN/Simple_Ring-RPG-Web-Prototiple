const CUSTO_TEMPO_MOVER = [1, 1];

let saveAtual = null;
let emTransicao = false;
let slotAtualIndex = null;

function iniciarJogo(save, index) {
	saveAtual = clonarSave(save);
	slotAtualIndex = index;
	salvarSessaoAtiva(index);

	document.querySelector(".title-wrap").classList.add("hidden");
	document.querySelector(".stage").classList.add("hidden");
	document.getElementById("gameScreen").classList.remove("hidden");

	const destino = locations[saveAtual.local] ? saveAtual.local : "cidade_centro";
	irPara(destino, true);
	atualizarHud();
}

function irPara(idLocal, semTransicao, custoTempo) {
	if (emTransicao) return;

	const local = locations[idLocal];
	if (!local) {
		console.error("Local não encontrado:", idLocal);
		return;
	}

	const trocarCena = () => {
		if (!semTransicao) {
			const [min, max] = custoTempo || CUSTO_TEMPO_MOVER;
			const custo = min + Math.floor(Math.random() * (max - min + 1));
			avancarTempo(saveAtual, custo);
		}
		saveAtual.local = idLocal;
		renderScene(local);
		if (typeof atualizarHud === "function") atualizarHud();
	};

	if (semTransicao) { trocarCena(); return; }

	emTransicao = true;
	const overlay = document.getElementById("fadeOverlay");
	overlay.classList.add("active");

	setTimeout(() => {
		trocarCena();
		setTimeout(() => { overlay.classList.remove("active"); emTransicao = false; }, 30);
	}, 350);
}

function voltarAoMenu() {
	if (typeof fecharLojaSilencioso === "function") fecharLojaSilencioso();
	encerrarSessaoAtiva();
	saveAtual = null;
	slotAtualIndex = null;

	document.getElementById("gameScreen").classList.add("hidden");
	document.querySelector(".title-wrap").classList.remove("hidden");
	document.querySelector(".stage").classList.remove("hidden");

	renderSaveSlots();
}