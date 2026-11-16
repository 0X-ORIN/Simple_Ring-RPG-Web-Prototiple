function elById(id) {
	const el = document.getElementById(id);
	if (!el) console.error("[menu.js] elemento #" + id + " não encontrado no HTML.");
	return el;
}

const STATUS_ORDER = ["forca", "destreza", "velocidade", "constituicao", "inteligencia", "sabedoria", "carisma", "espirito", "sorte", "fe"];
const STATUS_INFO = {
	forca: { label: "Força", emoji: "💪" }, destreza: { label: "Destreza", emoji: "🎯" },
	velocidade: { label: "Velocidade", emoji: "🏃" }, constituicao: { label: "Constituição", emoji: "🛡️" },
	inteligencia: { label: "Inteligência", emoji: "🧠" }, sabedoria: { label: "Sabedoria", emoji: "📚" },
	carisma: { label: "Carisma", emoji: "💬" }, espirito: { label: "Espírito", emoji: "✨" },
	sorte: { label: "Sorte", emoji: "🍀" }, fe: { label: "Fé", emoji: "🙏" }
};

const EQUIP_SLOTS = [
	{ campo: "armaPrimaria", label: "Arma Principal", artefato: false },
	{ campo: "armaSecundaria", label: "Arma Secundária", artefato: false },
	{ campo: "armadura", label: "Armadura", artefato: false },
	{ campo: "cabeca", label: "Cabeça", artefato: true },
	{ campo: "pescoco", label: "Pescoço", artefato: true },
	{ campo: "bracoEsqA", label: "Braço Esq. 1", artefato: true },
	{ campo: "bracoEsqB", label: "Braço Esq. 2", artefato: true },
	{ campo: "bracoDirA", label: "Braço Dir. 1", artefato: true },
	{ campo: "bracoDirB", label: "Braço Dir. 2", artefato: true }
];

function abrirMenu() {
	if (!saveAtual) return;
	atualizarMenu();
	const overlay = elById("menuOverlay");
	if (overlay) overlay.classList.remove("hidden");
	Input.empurrar(camadaMenu);
}

function fecharMenu() {
	const overlay = elById("menuOverlay");
	if (overlay) overlay.classList.add("hidden");
	Input.remover("menu");
}

function mudarAbaMenu(delta) {
	const abas = Array.from(document.querySelectorAll(".menu-tab[data-tab]"));
	if (abas.length === 0) return;
	const atual = abas.findIndex(function (a) { return a.classList.contains("active"); });
	const novo = (atual + delta + abas.length) % abas.length;
	trocarAbaMenu(abas[novo].dataset.tab);
}

function rolarMenu(px) {
	const corpo = document.querySelector(".menu-body");
	if (corpo) corpo.scrollBy({ top: px, behavior: "smooth" });
}

const camadaMenu = {
	id: "menu",
	aoEsquerda: function () { mudarAbaMenu(-1); },
	aoDireita: function () { mudarAbaMenu(1); },
	aoCima: function () { rolarMenu(-90); },
	aoBaixo: function () { rolarMenu(90); },
	aoVoltar: function () { fecharMenu(); },
	aoMenu: function () { fecharMenu(); }
};

function trocarAbaMenu(nomeAba) {
	document.querySelectorAll(".menu-tab[data-tab]").forEach(function (btn) {
		btn.classList.toggle("active", btn.dataset.tab === nomeAba);
	});
	document.querySelectorAll(".menu-body .menu-panel").forEach(function (painel) {
		painel.classList.toggle("hidden", painel.dataset.panel !== nomeAba);
	});
}

function criarBarraStat(label, atual, max, corClasse) {
	const pct = Math.max(0, Math.min(100, (atual / max) * 100));
	const div = document.createElement("div");
	div.className = "stat-bar stat-bar--" + corClasse;
	div.innerHTML =
		'<div class="stat-bar-fill" style="width:' + pct + '%"></div>' +
		'<span class="stat-bar-text">' + label + " " + escaparHtml(atual) + "/" + escaparHtml(max) + "</span>";
	return div;
}

function gerarRadarSVG(status) {
	const n = STATUS_ORDER.length;
	const valores = STATUS_ORDER.map(function (k) { return status[k] || 0; });
	const maxValor = Math.max.apply(null, valores.concat([1]));
	const cx = 110, cy = 110, raioMax = 78;

	function ponto(anguloDeg, raio) {
		const rad = (anguloDeg - 90) * Math.PI / 180;
		return { x: cx + raio * Math.cos(rad), y: cy + raio * Math.sin(rad) };
	}

	let svg = '<svg viewBox="0 0 220 220" class="radar-svg">';
	[0.25, 0.5, 0.75, 1].forEach(function (fracao) {
		let pontos = "";
		for (let i = 0; i < n; i++) { const p = ponto(i * (360 / n), raioMax * fracao); pontos += p.x + "," + p.y + " "; }
		svg += '<polygon points="' + pontos.trim() + '" class="radar-grid"/>';
	});

	for (let i = 0; i < n; i++) {
		const angulo = i * (360 / n);
		const pFim = ponto(angulo, raioMax);
		const pLabel = ponto(angulo, raioMax + 16);
		const chave = STATUS_ORDER[i];
		svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + pFim.x + '" y2="' + pFim.y + '" class="radar-axis"/>';
		svg += '<text x="' + pLabel.x + '" y="' + pLabel.y + '" class="radar-emoji" text-anchor="middle" dominant-baseline="middle">' + STATUS_INFO[chave].emoji + '</text>';
	}

	let pontosDados = "";
	for (let i = 0; i < n; i++) {
		const chave = STATUS_ORDER[i];
		const valor = status[chave] || 0;
		const raio = (valor / maxValor) * raioMax;
		const p = ponto(i * (360 / n), raio);
		pontosDados += p.x + "," + p.y + " ";
	}
	svg += '<polygon points="' + pontosDados.trim() + '" class="radar-data"/>';
	svg += "</svg>";
	return svg;
}

function criarPillAtributo(chave) {
	const info = STATUS_INFO[chave];
	const pontos = saveAtual.pontosAtributo || 0;
	const div = document.createElement("div");
	div.className = "atributo-pill";
	div.innerHTML =
		'<span class="atributo-emoji">' + info.emoji + "</span>" +
		'<span class="atributo-label">' + info.label + "</span>" +
		'<span class="atributo-valor">' + escaparHtml(saveAtual.status[chave]) + "</span>" +
		(pontos > 0 ? '<button class="atributo-add" type="button" data-chave="' + chave + '" title="Clique ou segure">➕</button>' : "");
	return div;
}

function distribuirPonto(chave) {
	if (!saveAtual || (saveAtual.pontosAtributo || 0) <= 0) return;
	saveAtual.status[chave]++;
	saveAtual.pontosAtributo--;
	recalcularAtributosDerivados(saveAtual);
	renderAtributos();
	atualizarHud();
}

function renderPontosBox() {
	const box = elById("menuPontosBox");
	if (!box || !saveAtual) return;
	const pontos = saveAtual.pontosAtributo || 0;
	box.textContent = pontos > 0
		? "✨ " + pontos + (pontos === 1 ? " ponto disponível" : " pontos disponíveis") + " pra distribuir"
		: "Sem pontos disponíveis no momento";
	box.classList.toggle("pontos-box--disponivel", pontos > 0);
}

function renderAtributos() {
	if (!saveAtual) return;
	const esq = elById("menuAtributosEsq");
	const dir = elById("menuAtributosDir");
	const metade = Math.ceil(STATUS_ORDER.length / 2);
	if (esq && dir) {
		esq.innerHTML = ""; dir.innerHTML = "";
		STATUS_ORDER.forEach(function (chave, i) { (i < metade ? esq : dir).appendChild(criarPillAtributo(chave)); });
	}
	const radar = elById("menuRadar");
	if (radar) radar.innerHTML = gerarRadarSVG(saveAtual.status);
	renderPontosBox();
}

function atualizarMenu() {
	if (!saveAtual) return;

	const nomeEl = elById("menuNome");
	if (nomeEl) nomeEl.textContent = saveAtual.nome;

	const tagRaca = elById("menuTagRaca"), tagClasse = elById("menuTagClasse"), tagSexo = elById("menuTagSexo");
	if (tagRaca) tagRaca.textContent = saveAtual.raca;
	if (tagClasse) tagClasse.textContent = saveAtual.classe;
	if (tagSexo) tagSexo.textContent = saveAtual.sexo;

	const nivelEl = elById("menuNivel");
	if (nivelEl) nivelEl.textContent = saveAtual.nivel;

	const xpEl = elById("menuXpCarregado");
	if (xpEl) xpEl.textContent = saveAtual.xp;

	const statBars = elById("menuStatBars");
	if (statBars) {
		statBars.innerHTML = "";
		statBars.appendChild(criarBarraStat("HP", saveAtual.hp.atual, saveAtual.hp.max, "hp"));
		statBars.appendChild(criarBarraStat("MP", saveAtual.mp.atual, saveAtual.mp.max, "mp"));
		statBars.appendChild(criarBarraStat("SP", saveAtual.sp.atual, saveAtual.sp.max, "sp"));
	}

	renderAtributos();
	renderEquipamento();
	renderInventario(filtroInventarioAtual);
	renderMissoes();
	renderStatusPasta();
	renderConfigSaveSlots();
	atualizarHud();
}

function getItemDoSlot(slotDef) {
	const itemId = slotDef.artefato ? saveAtual.equipamento.artefatos[slotDef.campo] : saveAtual.equipamento[slotDef.campo];
	return getItemDef(itemId);
}

function renderEquipamento() {
	if (!saveAtual) return;
	const grade = elById("equipGrid");
	if (!grade) return;
	grade.innerHTML = "";

	EQUIP_SLOTS.forEach(function (slotDef) {
		const item = getItemDoSlot(slotDef);
		const div = document.createElement("div");
		div.className = "equip-slot" + (item ? "" : " equip-slot--vazio");
		div.dataset.campo = slotDef.campo;
		div.innerHTML =
			'<span class="equip-slot-label">' + slotDef.label + ":</span>" +
			'<span class="equip-slot-nome">' + (item ? escaparHtml(item.nome) : "Nenhum") + "</span>";
		div.addEventListener("mouseenter", function () { mostrarDescricaoEquip(slotDef, div); });
		div.addEventListener("mouseleave", esconderDescricaoEquip);
		div.addEventListener("click", function () { mostrarDescricaoEquip(slotDef, div); });
		grade.appendChild(div);
	});
}

function mostrarDescricaoEquip(slotDef, slotEl) {
	const caixa = elById("equipDesc");
	if (!caixa || !saveAtual) return;
	document.querySelectorAll(".equip-slot").forEach(function (el) { el.classList.toggle("ativo", el === slotEl); });

	const item = getItemDoSlot(slotDef);
	if (!item) {
		caixa.innerHTML = "<strong>" + slotDef.label + "</strong><p>Nenhum item equipado.</p>";
	} else {
		let html = "<strong>" + escaparHtml(item.nome) + "</strong>";
		if (item.descricao) html += "<p>" + escaparHtml(item.descricao) + "</p>";
		if (typeof item.dano === "number") html += '<p class="tooltip-dano">Dano atual: ' + item.dano + "</p>";
		caixa.innerHTML = html;
	}
	caixa.classList.add("active");
}

function esconderDescricaoEquip() {
	const caixa = elById("equipDesc");
	if (caixa) caixa.classList.remove("active");
	document.querySelectorAll(".equip-slot.ativo").forEach(function (el) { el.classList.remove("ativo"); });
}

function atualizarHud() {
	if (!saveAtual) return;
	salvarSessaoViva();

	const hpFill = elById("hudHpFill"), mpFill = elById("hudMpFill"), spFill = elById("hudSpFill");
	if (hpFill) hpFill.style.width = (saveAtual.hp.atual / saveAtual.hp.max) * 100 + "%";
	if (mpFill) mpFill.style.width = (saveAtual.mp.atual / saveAtual.mp.max) * 100 + "%";
	if (spFill) spFill.style.width = (saveAtual.sp.atual / saveAtual.sp.max) * 100 + "%";

	const hpValue = elById("hudHpValue"), mpValue = elById("hudMpValue"), spValue = elById("hudSpValue");
	if (hpValue) hpValue.textContent = saveAtual.hp.atual + "/" + saveAtual.hp.max;
	if (mpValue) mpValue.textContent = saveAtual.mp.atual + "/" + saveAtual.mp.max;
	if (spValue) spValue.textContent = saveAtual.sp.atual + "/" + saveAtual.sp.max;

	const goldValue = elById("hudGoldValue");
	if (goldValue) goldValue.textContent = saveAtual.gold;

	const clockLabel = elById("hudClockLabel");
	if (clockLabel) clockLabel.textContent = getPeriodoDoTempo(saveAtual.tempo);

	atualizarRelogio();
}

let anguloRelogio = null;

function atualizarRelogio() {
	const img = elById("clockfaceImg");
	if (!img || saveAtual) return;
	
	const total = (saveAtual.ia - 1) * TEMPO_POR_DIA + saveAtual.tempo;
	const alvo = 90 - total * (360/ TEMPO_POR_DIA);

	if (anguloRelogio === null || Math.abs(alvo - anguloRelogio) > 120)
	{
		img.style.transition = "none";
		img.style.transform = "rotate(" + alvo + "deg)";
		void img.offsetWidth;
		img.style.transition = "";
	}
	else {
		img.style.transform = "rotate(" + alvo + "deg)";
	}
	anguloRelogio = alvo
}

let filtroInventarioAtual = "arma";

function renderInventario(filtro) {
	filtroInventarioAtual = filtro;
	document.querySelectorAll(".inv-filter").forEach(function (btn) { btn.classList.toggle("active", btn.dataset.filtro === filtro); });

	const lista = elById("inventoryList");
	if (!lista || !saveAtual) return;
	lista.innerHTML = "";

	const entradas = (saveAtual.inventario || []).filter(function (entrada) {
		const def = getItemDef(entrada.id);
		return def && def.tipo === filtro;
	});

	if (entradas.length === 0) { lista.innerHTML = '<p class="menu-empty">Nada aqui ainda.</p>'; return; }

	entradas.forEach(function (entrada) {
		const def = getItemDef(entrada.id);
		const equipado = itemEstaEquipado(saveAtual, entrada.id);
		const div = document.createElement("div");
		div.className = "inv-item";

		let acoesHtml = "";
		if (def.tipo === "consumivel" && def.efeito) {
			acoesHtml = '<button class="choice-btn choice-btn--small inv-acao" data-acao="usar" data-id="' + def.id + '" type="button">Usar</button>';
		} else if (def.tipo === "arma") {
			acoesHtml = equipado
				? '<button class="choice-btn choice-btn--small inv-acao" data-acao="desequipar" data-id="' + def.id + '" type="button">Desequipar</button>'
				: '<button class="choice-btn choice-btn--small inv-acao" data-acao="equipar-principal" data-id="' + def.id + '" type="button">Equipar (Principal)</button>' +
				  '<button class="choice-btn choice-btn--small inv-acao" data-acao="equipar-secundaria" data-id="' + def.id + '" type="button">Equipar (Secundária)</button>';
		} else if (def.tipo === "armadura") {
			acoesHtml = equipado
				? '<button class="choice-btn choice-btn--small inv-acao" data-acao="desequipar" data-id="' + def.id + '" type="button">Desequipar</button>'
				: '<button class="choice-btn choice-btn--small inv-acao" data-acao="equipar-armadura" data-id="' + def.id + '" type="button">Equipar</button>';
		} else if (def.tipo === "artefato") {
			if (equipado) {
				acoesHtml = '<button class="choice-btn choice-btn--small inv-acao" data-acao="desequipar" data-id="' + def.id + '" type="button">Desequipar</button>';
			} else {
				const opcoes = EQUIP_SLOTS.filter(function (s) { return s.artefato; })
					.map(function (s) { return '<option value="' + s.campo + '">' + s.label + "</option>"; }).join("");
				acoesHtml =
					'<select class="inv-select-slot" data-id="' + def.id + '">' + opcoes + "</select>" +
					'<button class="choice-btn choice-btn--small inv-acao" data-acao="equipar-artefato" data-id="' + def.id + '" type="button">Equipar</button>';
			}
		}

		div.innerHTML =
			'<div class="inv-item-info">' +
				'<span class="inv-item-nome">' + escaparHtml(def.nome) + "</span>" +
				(def.descricao ? '<span class="inv-item-desc">' + escaparHtml(def.descricao) + "</span>" : "") +
			"</div>" +
			'<div class="inv-item-side">' +
				(entrada.quantidade > 1 ? '<span class="inv-item-qtd">x' + escaparHtml(entrada.quantidade) + "</span>" : "") +
				(equipado ? '<span class="inv-item-equipado">Equipado</span>' : "") +
				'<div class="inv-item-acoes">' + acoesHtml + "</div>" +
			"</div>";

		lista.appendChild(div);
	});

	lista.querySelectorAll(".inv-acao").forEach(function (btn) {
		btn.addEventListener("click", function () { executarAcaoInventario(btn.dataset.acao, btn.dataset.id, lista); });
	});
}

function executarAcaoInventario(acao, id, listaEl) {
	if (!saveAtual) return;
	if (acao === "usar") usarConsumivel(saveAtual, id);
	else if (acao === "equipar-principal") equiparArma(saveAtual, id, "armaPrimaria");
	else if (acao === "equipar-secundaria") equiparArma(saveAtual, id, "armaSecundaria");
	else if (acao === "equipar-armadura") equiparArmadura(saveAtual, id);
	else if (acao === "equipar-artefato") {
		const select = listaEl.querySelector('.inv-select-slot[data-id="' + id + '"]');
		equiparArtefato(saveAtual, id, select ? select.value : "cabeca");
	} else if (acao === "desequipar") desequiparPorId(saveAtual, id);

	renderInventario(filtroInventarioAtual);
	renderEquipamento();
	atualizarHud();
}

function renderStatusPasta() {
	const statusEl = elById("pastaSavesStatus");
	const btnVincular = elById("btnVincularPasta");
	const btnReconectar = elById("btnReconectarPasta");
	if (!statusEl) return;

	if (!suportaFileSystem) {
		statusEl.textContent = "Seu navegador não suporta pasta de saves real (use Chrome ou Edge).";
		statusEl.className = "pasta-status pasta-status--indisponivel";
		if (btnVincular) btnVincular.classList.add("hidden");
		if (btnReconectar) btnReconectar.classList.add("hidden");
		return;
	}

	if (pastaSavesStatus === "vinculada") {
		statusEl.textContent = "✓ Pasta vinculada — seus saves são arquivos .json reais nela.";
		statusEl.className = "pasta-status pasta-status--ok";
		if (btnVincular) { btnVincular.textContent = "🔄 Trocar pasta"; btnVincular.classList.remove("hidden"); }
		if (btnReconectar) btnReconectar.classList.add("hidden");
	} else if (pastaSavesStatus === "precisaPermissao") {
		statusEl.textContent = "⚠ Pasta vinculada, mas o navegador precisa que você confirme o acesso de novo.";
		statusEl.className = "pasta-status pasta-status--atencao";
		if (btnVincular) btnVincular.classList.add("hidden");
		if (btnReconectar) btnReconectar.classList.remove("hidden");
	} else {
		statusEl.textContent = "Nenhuma pasta vinculada — os saves ficam só no navegador (localStorage).";
		statusEl.className = "pasta-status pasta-status--off";
		if (btnVincular) { btnVincular.textContent = "📁 Selecionar assets/Saves"; btnVincular.classList.remove("hidden"); }
		if (btnReconectar) btnReconectar.classList.add("hidden");
	}
}

function renderConfigSaveSlots() {
	const grid = elById("configSlotsGrid");
	if (!grid) return;
	grid.innerHTML = "";

	for (let i = 0; i < 4; i++) {
		const save = saveSlots[i];
		const isAtual = i === slotAtualIndex;
		const div = document.createElement("div");
		div.className = "config-slot" + (save ? "" : " config-slot--vazio") + (isAtual ? " config-slot--atual" : "");

		let acoes = '<button class="choice-btn choice-btn--small" data-acao="salvar" data-index="' + i + '" type="button">💾 Salvar aqui</button>';
		if (save && !isAtual) acoes += '<button class="choice-btn choice-btn--small" data-acao="carregar" data-index="' + i + '" type="button">📂 Carregar</button>';
		if (temBackupDoSlot(i)) acoes += '<button class="choice-btn choice-btn--small choice-btn--undo" data-acao="desfazer" data-index="' + i + '" type="button">↩ Desfazer último save</button>';

		if (save) {
			div.innerHTML =
				'<div class="config-slot-nome">' + escaparHtml(save.nome) + (isAtual ? ' <span class="config-slot-tag">atual</span>' : "") + "</div>" +
				'<div class="config-slot-info">Nível ' + escaparHtml(save.nivel) + " · Dia " + escaparHtml(save.dia) + "</div>" +
				'<div class="config-slot-actions">' + acoes + "</div>";
		} else {
			div.innerHTML =
				'<div class="config-slot-nome config-slot-nome--vazio">Slot vazio</div>' +
				'<div class="config-slot-actions">' + acoes + "</div>";
		}
		grid.appendChild(div);
	}

	grid.querySelectorAll("[data-acao='salvar']").forEach(function (btn) {
		btn.addEventListener("click", function () { salvarEmSlot(parseInt(btn.dataset.index, 10), btn); });
	});
	grid.querySelectorAll("[data-acao='carregar']").forEach(function (btn) {
		btn.addEventListener("click", function () { carregarSlotApartirDoMenu(parseInt(btn.dataset.index, 10)); });
	});
	grid.querySelectorAll("[data-acao='desfazer']").forEach(function (btn) {
		btn.addEventListener("click", function () {
			const index = parseInt(btn.dataset.index, 10);
			if (confirm("Restaurar a versão anterior desse slot? Isso descarta o save mais recente dele.")) {
				desfazerUltimoSave(index);
				renderConfigSaveSlots();
				if (index === slotAtualIndex) atualizarMenu();
			}
		});
	});
}

function salvarEmSlot(index, botao) {
	if (index !== slotAtualIndex && saveSlots[index]) {
		if (!confirm("Já existe um save nesse slot. Sobrescrever com o jogo atual?")) return;
	}
	backupSlotAntesDeSobrescrever(index);
	saveSlots[index] = clonarSave(saveAtual);
	slotAtualIndex = index;
	salvarSessaoAtiva(index);
	salvarSlotsNoStorage();
	renderConfigSaveSlots();

	if (botao) {
		const original = botao.textContent;
		botao.textContent = "✓ Salvo!";
		setTimeout(function () { botao.textContent = original; }, 1200);
	}
}

function carregarSlotApartirDoMenu(index) {
	const save = saveSlots[index];
	if (!save) return;
	saveAtual = clonarSave(save);
	slotAtualIndex = index;
	salvarSessaoAtiva(index);
	irPara(saveAtual.local, true);
	atualizarMenu();
	fecharMenu();
}

const btnMenu = elById("btnMenu");
if (btnMenu) btnMenu.addEventListener("click", abrirMenu);

const btnFecharMenu = elById("btnFecharMenu");
if (btnFecharMenu) btnFecharMenu.addEventListener("click", fecharMenu);

document.querySelectorAll(".menu-tab[data-tab]").forEach(function (btn) {
	btn.addEventListener("click", function () { trocarAbaMenu(btn.dataset.tab); });
});

const btnExportarSave = elById("btnExportarSave");
if (btnExportarSave) btnExportarSave.addEventListener("click", function () { exportarSave(slotAtualIndex); });

const inputImportarSave = elById("inputImportarSave");
if (inputImportarSave) {
	inputImportarSave.addEventListener("change", function (e) {
		const file = e.target.files[0];
		if (file) importarSave(file, slotAtualIndex);
		e.target.value = "";
	});
}

const btnVoltarTitulo = elById("btnVoltarTitulo");
if (btnVoltarTitulo) btnVoltarTitulo.addEventListener("click", function () { fecharMenu(); voltarAoMenu(); });

document.querySelectorAll(".inv-filter").forEach(function (btn) {
	btn.addEventListener("click", function () { renderInventario(btn.dataset.filtro); });
});

const btnSalvarRapido = elById("btnSalvarRapido");
if (btnSalvarRapido) btnSalvarRapido.addEventListener("click", function () { salvarEmSlot(slotAtualIndex, btnSalvarRapido); });

const btnDebugReload = elById("btnDebugReload");
if (btnDebugReload) btnDebugReload.addEventListener("click", function () { encerrarSessaoAtiva(); location.reload(); });

const btnVincularPasta = elById("btnVincularPasta");
if (btnVincularPasta) {
	btnVincularPasta.addEventListener("click", async function () {
		const ok = await vincularPastaSaves();
		renderStatusPasta();
		if (ok) renderConfigSaveSlots();
	});
}

const btnReconectarPasta = elById("btnReconectarPasta");
if (btnReconectarPasta) {
	btnReconectarPasta.addEventListener("click", async function () {
		const ok = await reconectarPastaSaves();
		renderStatusPasta();
		if (ok) { renderConfigSaveSlots(); atualizarMenu(); }
	});
}

let holdTimeoutId = null;
let holdIntervalId = null;

function pararHoldAtributo() {
	clearTimeout(holdTimeoutId);
	clearInterval(holdIntervalId);
	holdTimeoutId = null;
	holdIntervalId = null;
}

document.addEventListener("pointerdown", function (e) {
	const btn = e.target.closest(".atributo-add");
	if (!btn) return;
	const chave = btn.dataset.chave;
	distribuirPonto(chave);

	holdTimeoutId = setTimeout(function () {
		holdIntervalId = setInterval(function () {
			if (!saveAtual || (saveAtual.pontosAtributo || 0) <= 0) { pararHoldAtributo(); return; }
			distribuirPonto(chave);
		}, 100);
	}, 400);
});

["pointerup", "pointerleave", "pointercancel"].forEach(function (evt) {
	document.addEventListener(evt, pararHoldAtributo);
});

