const TEMPO_POR_DIA = 200;
const VERSAO_TEMPO = 2;

const TIME_OF_DAY = {
	MORNING: { min: 0, max: 74, label: "Manhã" },
	AFTERNOON: { min: 75, max: 124, label: "Tarde" },
	NIGHT: { min: 125, max: 199, label: "Noite" }
};

function escaparHtml(valor) {
	return String(valor)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function getPeriodoDoTempo(tempo) {
	if (tempo <= TIME_OF_DAY.MORNING.max) return TIME_OF_DAY.MORNING.label;
	if (tempo <= TIME_OF_DAY.AFTERNOON.max) return TIME_OF_DAY.AFTERNOON.label;
	return TIME_OF_DAY.NIGHT.label;
}

function avancarTempo(save, quantidade) {
	if (!save || !quantidade) return;
	save.tempo += quantidade;
	while (save.tempo >= TEMPO_POR_DIA) {
		save.tempo -= TEMPO_POR_DIA;
		save.dia++;
	}
}

function clonarSave(save) {
	return save ? JSON.parse(JSON.stringify(save)) : save;
}

const STORAGE_KEY_SAVES = "simpleRingRPG_saves";
const STORAGE_KEY_SESSAO = "simpleRingRPG_sessao";

function recalcularAtributosDerivados(save) {
	const novoHpMax = save.status.constituicao * 10;
	const novoMpMax = 5 + save.status.sabedoria * 5;
	const novoSpMax = 10 + save.status.constituicao * 3 + save.status.espirito * 2;

	save.hp.atual = Math.max(0, Math.min(save.hp.max === 0 ? novoHpMax : save.hp.atual + (novoHpMax - save.hp.max), novoHpMax));
	save.mp.atual = Math.max(0, Math.min(save.mp.max === 0 ? novoMpMax : save.mp.atual + (novoMpMax - save.mp.max), novoMpMax));
	save.sp.atual = Math.max(0, Math.min(save.sp.max === 0 ? novoSpMax : save.sp.atual + (novoSpMax - save.sp.max), novoSpMax));

	save.hp.max = novoHpMax;
	save.mp.max = novoMpMax;
	save.sp.max = novoSpMax;
}

function criarNovoSave() {
	const save = {
		nome: "Novo Aventureiro",
		raca: "Humano", sexo: "Masculino", classe: "Herói",
		nivel: 1,
		hp: { atual: 0, max: 0 }, mp: { atual: 0, max: 0 }, sp: { atual: 0, max: 0 },
		xp: 0, gold: 0, dia: 1, tempo: 0, versaoTempo: VERSAO_TEMPO,
		local: "cidade_centro",
		status: {
			forca: 1, destreza: 1, velocidade: 1, constituicao: 1,
			inteligencia: 1, sabedoria: 1, carisma: 1, espirito: 1,
			sorte: 1, fe: 1
		},
		pontosAtributo: 5,
		habilidades: [], inventario: [], missoes: [], exploracao: {},
		equipamento: {
			armaPrimaria: null, armaSecundaria: null, armadura: null,
			artefatos: { cabeca: null, pescoco: null, bracoEsqA: null, bracoEsqB: null, bracoDirA: null, bracoDirB: null }
		}
	};

	recalcularAtributosDerivados(save);
	save.hp.atual = save.hp.max;
	save.mp.atual = save.mp.max;
	save.sp.atual = save.sp.max;

	return save;
}

function normalizarSave(save) {
	if (!save) return save;
	const molde = criarNovoSave();

	const resultado = { ...molde, ...save };

	if (save.versaoTempo !== VERSAO_TEMPO) {
		resultado.tempo = Math.round((save.tempo || 0) * 2);
		resultado.versaoTempo = VERSAO_TEMPO;
	}

	resultado.hp = { ...molde.hp, ...(save.hp || {}) };
	resultado.mp = { ...molde.mp, ...(save.mp || {}) };
	resultado.sp = { ...molde.sp, ...(save.sp || {}) };
	resultado.status = { ...molde.status, ...(save.status || {}) };
	resultado.habilidades = save.habilidades || [];
	resultado.missoes = save.missoes || [];
	resultado.exploracao = (save.exploracao && typeof save.exploracao === "object") ? save.exploracao : {};
	resultado.pontosAtributo = typeof save.pontosAtributo === "number" ? save.pontosAtributo : 0;

	if (typeof save.xp === "number") {
		resultado.xp = save.xp;
	} else if (save.xp && typeof save.xp === "object") {
		resultado.xp = save.xp.atual || 0;
	} else {
		resultado.xp = 0;
	}

	resultado.inventario = (save.inventario || []).map(function (entrada) {
		if (!entrada) return null;
		if (typeof entrada === "string") return { id: entrada, quantidade: 1 };
		return { id: entrada.id, quantidade: entrada.quantidade || 1 };
	}).filter(Boolean);

	resultado.equipamento = {
		...molde.equipamento,
		...(save.equipamento || {}),
		artefatos: { ...molde.equipamento.artefatos, ...((save.equipamento && save.equipamento.artefatos) || {}) }
	};

	return resultado;
}

let saveSlots = [null, null, null, null];

function salvarSlotsNoStorage() {
	localStorage.setItem(STORAGE_KEY_SAVES, JSON.stringify(saveSlots));
	if (typeof pastaSavesStatus !== "undefined" && pastaSavesStatus === "vinculada") {
		escreverTodosSlotsNaPasta().catch(function (err) { console.error("Falha ao sincronizar com a pasta de saves:", err); });
	}
}

function backupSlotAntesDeSobrescrever(index) {
	try {
		const dados = localStorage.getItem(STORAGE_KEY_SAVES);
		if (!dados) return;
		const atuais = JSON.parse(dados);
		if (atuais && atuais[index]) {
			localStorage.setItem(STORAGE_KEY_SAVES + "_backup_" + index, JSON.stringify(atuais[index]));
		}
	} catch (err) {
		console.error("Falha ao criar backup do slot:", err);
	}
}

function temBackupDoSlot(index) {
	return !!localStorage.getItem(STORAGE_KEY_SAVES + "_backup_" + index);
}

function desfazerUltimoSave(index) {
	const dados = localStorage.getItem(STORAGE_KEY_SAVES + "_backup_" + index);
	if (!dados) return;

	const anterior = normalizarSave(JSON.parse(dados));
	saveSlots[index] = anterior;
	if (slotAtualIndex === index) saveAtual = clonarSave(anterior);

	localStorage.removeItem(STORAGE_KEY_SAVES + "_backup_" + index);
	salvarSlotsNoStorage();
}

function carregarSlotsDoStorage() {
	const dados = localStorage.getItem(STORAGE_KEY_SAVES);
	if (!dados) return;
	try {
		const carregados = JSON.parse(dados);
		if (!Array.isArray(carregados)) throw new Error("Formato inválido");
		const novos = [];
		for (let i = 0; i < 4; i++) novos.push(normalizarSave(carregados[i] || null));
		saveSlots = novos;
	} catch (err) {
		console.error("Saves corrompidos, guardando cópia de segurança:", err);
		localStorage.setItem(STORAGE_KEY_SAVES + "_backup", dados);
	}
}

function salvarSessaoAtiva(slotIndex) { localStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify({ slotIndex: slotIndex })); }
function encerrarSessaoAtiva() {
	localStorage.removeItem(STORAGE_KEY_SESSAO);
	limparSessaoViva();
}
function getSessaoAtiva() {
	try {
		const dados = localStorage.getItem(STORAGE_KEY_SESSAO);
		return dados ? JSON.parse(dados) : null;
	} catch (err) {
		console.error("Sessão inválida:", err);
		return null;
	}
}

const STORAGE_KEY_SESSAO_VIVA = "simpleRingRPG_sessaoViva";

function salvarSessaoViva() {
	if (!saveAtual) return;
	try {
		sessionStorage.setItem(STORAGE_KEY_SESSAO_VIVA, JSON.stringify({ slotIndex: slotAtualIndex, save: saveAtual }));
	} catch (err) {
		console.error("Falha ao salvar sessão viva:", err);
	}
}

function getSessaoViva() {
	try {
		const dados = sessionStorage.getItem(STORAGE_KEY_SESSAO_VIVA);
		if (!dados) return null;
		const parsed = JSON.parse(dados);
		return { slotIndex: parsed.slotIndex, save: normalizarSave(parsed.save) };
	} catch (err) {
		console.error("Sessão viva inválida:", err);
		return null;
	}
}

function limparSessaoViva() {
	sessionStorage.removeItem(STORAGE_KEY_SESSAO_VIVA);
}

function exportarSave(index) {
	const save = saveSlots[index];
	if (!save) return;
	const blob = new Blob([JSON.stringify(save, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = save.nome.replace(/\s+/g, "_") + "_save.json";
	a.click();
	setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function importarSave(file, index) {
	const reader = new FileReader();
	reader.onload = function (e) {
		try {
			const dados = JSON.parse(e.target.result);
			if (!dados || typeof dados !== "object" || Array.isArray(dados) || typeof dados.nome !== "string") {
				throw new Error("Estrutura de save inválida");
			}
			backupSlotAntesDeSobrescrever(index);
			const save = normalizarSave(dados);
			saveSlots[index] = save;
			salvarSlotsNoStorage();
			if (saveAtual && index === slotAtualIndex) { saveAtual = clonarSave(save); atualizarMenu(); }
			alert("Save importado com sucesso!");
		} catch (err) {
			console.error("Arquivo de save inválido:", err);
			alert("Não foi possível importar: o arquivo não é um save válido.");
		}
	};
	reader.readAsText(file);
}