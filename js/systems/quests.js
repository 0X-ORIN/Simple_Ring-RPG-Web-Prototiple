function getQuestDef(id) {
	return QUESTS[id] || null;
}

function possuiMissao(save, id) {
	return (save.missoes || []).some(function (m) { return m.id === id; });
}

function aceitarMissao(save, id) {
	if (!save.missoes) save.missoes = [];
	if (!possuiMissao(save, id)) save.missoes.push({ id: id, status: "ativa" });
}

function completarMissao(save, id) {
	const missao = (save.missoes || []).find(function (m) { return m.id === id; });
	if (missao) missao.status = "concluida";
}

function renderMissoes() {
	const lista = elById("missoesList");
	if (!lista || !saveAtual) return;
	lista.innerHTML = "";

	const missoes = saveAtual.missoes || [];
	if (missoes.length === 0) {
		lista.innerHTML = '<p class="menu-empty">Nenhuma missão aceita ainda.</p>';
		return;
	}

	missoes.forEach(function (missao) {
		const def = getQuestDef(missao.id);
		if (!def) return;

		const concluida = missao.status === "concluida";
		const div = document.createElement("div");
		div.className = "inv-item";
		div.innerHTML =
			'<div class="inv-item-info">' +
				'<span class="inv-item-nome">' + escaparHtml(def.titulo) + "</span>" +
				'<span class="inv-item-desc">' + escaparHtml(def.descricao) + "</span>" +
			"</div>" +
			'<div>' +
				'<span class="' + (concluida ? "inv-item-equipado" : "inv-item-pendente") + '">' +
					(concluida ? "Concluída" : "Em andamento") +
				"</span>" +
			"</div>";
		lista.appendChild(div);
	});
}