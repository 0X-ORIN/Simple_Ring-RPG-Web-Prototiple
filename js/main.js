const slotMapping = [
	{ id: "slotLeft", index: 0 },
	{ id: "slotH1", index: 1 },
	{ id: "slotH2", index: 2 },
	{ id: "slotRight", index: 3 }
];

let indexParaApagar = null;

function renderSaveSlots() {
	slotMapping.forEach(({ id, index }) => renderSlot(id, saveSlots[index], index));
}

function renderSlot(elementId, save, index) {
	const el = document.getElementById(elementId);
	el.onclick = null;

	if (save) {
		el.classList.remove("slot--empty");
		el.classList.add("slot--filled");
		const periodo = getPeriodoDoTempo(save.tempo);
		el.innerHTML = `
			<div class="slot-name">${escaparHtml(save.nome)}</div>
			<div class="slot-info">
				Nível <span>${escaparHtml(save.nivel)}</span><br>
				Gold <span>${escaparHtml(save.gold)}</span><br>
				Dia <span>${escaparHtml(save.dia)}</span> — ${periodo}
			</div>
			<div class="slot-actions">
				<button class="btn-delete" type="button">Apagar</button>
			</div>
		`;

		el.onclick = () => carregarJogo(index);

		el.querySelector(".btn-delete").addEventListener("click", (e) => {
			e.stopPropagation();
			abrirConfirmacaoDelete(index);
		});
	} else {
		el.classList.remove("slot--filled");
		el.classList.add("slot--empty");
		el.innerHTML = `
			<div class="plus">+</div>
			<div class="slot-label">Novo jogo</div>
		`;
		el.onclick = () => novoJogo(index);
	}
}

function carregarJogo(index) {
	iniciarJogo(saveSlots[index], index);
}

function novoJogo(index) {
	const novoSave = criarNovoSave();
	saveSlots[index] = novoSave;
	salvarSlotsNoStorage();
	iniciarJogo(novoSave, index);
}

function abrirConfirmacaoDelete(index) {
	indexParaApagar = index;
	document.getElementById("confirmModal").classList.add("active");
}

function fecharConfirmacao() {
	indexParaApagar = null;
	document.getElementById("confirmModal").classList.remove("active");
}

function confirmarDelete() {
	if (indexParaApagar !== null) {
		saveSlots[indexParaApagar] = null;
		salvarSlotsNoStorage();
		renderSaveSlots();
	}
	fecharConfirmacao();
}

document.getElementById("modalCancel").addEventListener("click", fecharConfirmacao);
document.getElementById("modalConfirm").addEventListener("click", confirmarDelete);
document.getElementById("confirmModal").addEventListener("click", (e) => {
	if (e.target.id === "confirmModal") fecharConfirmacao();
});

async function iniciarApp() {
	carregarSlotsDoStorage();
	await tentarRestaurarPastaSaves();

	const sessaoViva = getSessaoViva();
	if (sessaoViva && sessaoViva.save) {
		iniciarJogo(sessaoViva.save, sessaoViva.slotIndex);
		return;
	}

	renderSaveSlots();
}

iniciarApp();