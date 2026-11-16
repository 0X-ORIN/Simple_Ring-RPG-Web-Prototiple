function getItemDef(id) {
	return ITEMS[id] || null;
}

function getQuantidadeItem(save, id) {
	const entrada = (save.inventario || []).find(function (e) { return e.id === id; });
	return entrada ? entrada.quantidade : 0;
}

function adicionarItem(save, id, quantidade) {
	quantidade = quantidade || 1;
	if (!save.inventario) save.inventario = [];
	const entrada = save.inventario.find(function (e) { return e.id === id; });
	if (entrada) {
		entrada.quantidade += quantidade;
	} else {
		save.inventario.push({ id: id, quantidade: quantidade });
	}
}

function removerItem(save, id, quantidade) {
	quantidade = quantidade || 1;
	if (!save.inventario) return;
	const entrada = save.inventario.find(function (e) { return e.id === id; });
	if (!entrada) return;
	entrada.quantidade -= quantidade;
	if (entrada.quantidade <= 0) {
		save.inventario = save.inventario.filter(function (e) { return e.id !== id; });
	}
}

function itemEstaEquipado(save, id) {
	if (!save || !id || !save.equipamento) return false;
	const eq = save.equipamento;
	return eq.armaPrimaria === id || eq.armaSecundaria === id || eq.armadura === id ||
		Object.keys(eq.artefatos).some(function (k) { return eq.artefatos[k] === id; });
}

function desequiparPorId(save, id) {
	const eq = save.equipamento;
	if (eq.armaPrimaria === id) eq.armaPrimaria = null;
	if (eq.armaSecundaria === id) eq.armaSecundaria = null;
	if (eq.armadura === id) eq.armadura = null;
	Object.keys(eq.artefatos).forEach(function (k) {
		if (eq.artefatos[k] === id) eq.artefatos[k] = null;
	});
}

function equiparArma(save, id, slot) {
	desequiparPorId(save, id);
	save.equipamento[slot] = id;
}

function equiparArmadura(save, id) {
	desequiparPorId(save, id);
	save.equipamento.armadura = id;
}

function equiparArtefato(save, id, slotArtefato) {
	desequiparPorId(save, id);
	save.equipamento.artefatos[slotArtefato] = id;
}

function usarConsumivel(save, id) {
	const def = getItemDef(id);
	if (!def || !def.efeito || getQuantidadeItem(save, id) <= 0) return false;

	if (def.efeito.tipo === "cura") {
		save.hp.atual = Math.min(save.hp.max, save.hp.atual + def.efeito.valor);
	} else if (def.efeito.tipo === "mana") {
		save.mp.atual = Math.min(save.mp.max, save.mp.atual + def.efeito.valor);
	}

	removerItem(save, id, 1);
	return true;
}