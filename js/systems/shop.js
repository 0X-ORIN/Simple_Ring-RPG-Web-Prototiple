const TAXA_VENDA = 0.5;
const POSE_FALA_EXTRA_MS = 2200;
let timerPose = null;

const Loja = { aberta: false, modo: "comprar", indice: 0, local: null, vendedor: VENDEDOR_PADRAO };

function elLoja(id) { return document.getElementById(id); }

function sortearDaLista(lista) {
	return lista[Math.floor(Math.random() * lista.length)];
}

function precoDeCompra(def) { return typeof def.preco === "number" ? def.preco : 0; }
function precoDeVenda(def) { return Math.floor(precoDeCompra(def) * TAXA_VENDA); }
function formatarOuro(n) { return n > 0 ? n + " G" : "Grátis"; }

function definirPose(pose) {
	const img = elLoja("shopVendorImg");
	const sprites = Loja.vendedor.sprites;
	if (!img || !sprites) return;
	img.src = sprites[pose] || sprites.base;
}

function mostrarVendedor() {
	const caixa = elLoja("shopVendor");
	const sprites = Loja.vendedor.sprites;
	if (!sprites) { caixa.classList.add("hidden"); return; }

	Object.keys(sprites).forEach(function (k) { new Image().src = sprites[k]; });
	definirPose("base");
	caixa.classList.remove("hidden");
}

function poseDeRepouso() {
	return Loja.aberta && Loja.modo === "vender" ? "pensando" : "base";
}

function voltarPoseDepois(ms) {
	clearTimeout(timerPose);
	timerPose = setTimeout(function () { definirPose(poseDeRepouso()); }, ms);
}

function falar(texto, pose) {
	clearTimeout(timerPose);
	definirPose(pose || "falando");
	digitarTexto(elLoja("dialogueText"), texto, 18, function () {
		voltarPoseDepois(POSE_FALA_EXTRA_MS);
	});
}

function prepararLoja(local, choicesEl) {
	fecharLojaSilencioso();
	Loja.local = local;
	Loja.vendedor = (local.vendedor && VENDEDORES[local.vendedor]) || VENDEDOR_PADRAO;

	if (local.vendedor) {
		mostrarVendedor();
		definirPose("falando");
		const dialogo = elLoja("dialogueText");
		if (digitando) dialogo._aoTerminar = function () { voltarPoseDepois(POSE_FALA_EXTRA_MS); };
		else voltarPoseDepois(POSE_FALA_EXTRA_MS);
	} else {
		elLoja("shopVendor").classList.add("hidden");
	}

	if (!local.itensVenda || local.itensVenda.length === 0) return;

	const vender = criarBotaoEscolha("Vender", function () { abrirLoja("vender"); });
	const comprar = criarBotaoEscolha("Comprar", function () { abrirLoja("comprar"); });
	choicesEl.insertBefore(vender, choicesEl.firstChild);
	choicesEl.insertBefore(comprar, choicesEl.firstChild);
}

function abrirLoja(modo) {
	opcoesDaCena().forEach(function (el) { el.classList.remove("foco"); }); // só um destaque por vez
	Loja.aberta = true;
	Loja.modo = modo;
	Loja.indice = 0;
	elLoja("shopWindow").classList.remove("hidden");
	Input.empurrar(camadaLoja);
	renderLoja();

	if (modo === "vender" && itensParaVender().length === 0) falar(Loja.vendedor.falas.nadaPraVender, "pensando");
	else falar(modo === "comprar" ? Loja.vendedor.falas.comprar : Loja.vendedor.falas.vender, modo === "vender" ? "pensando" : "falando");
}

function fecharLoja() {
	if (!Loja.aberta) return;
	fecharLojaSilencioso();
	falar(Loja.vendedor.falas.voltar);
}

function fecharLojaSilencioso() {
	clearTimeout(timerPose);
	Loja.aberta = false;
	const janela = elLoja("shopWindow");
	if (janela) janela.classList.add("hidden");
	Input.remover("loja");
}

function trocarModoLoja(modo) {
	if (!Loja.aberta || Loja.modo === modo) return;
	Loja.modo = modo;
	Loja.indice = 0;
	renderLoja();
	if (modo === "vender" && itensParaVender().length === 0) falar(Loja.vendedor.falas.nadaPraVender, "pensando");
	else falar(modo === "comprar" ? Loja.vendedor.falas.comprar : Loja.vendedor.falas.vender, modo === "vender" ? "pensando" : "falando");
}

function itensParaComprar() {
	return (Loja.local.itensVenda || []).map(function (id) {
		const def = getItemDef(id);
		if (!def) return null;
		const preco = precoDeCompra(def);
		return { id: id, def: def, preco: preco, pode: saveAtual.gold >= preco, tem: getQuantidadeItem(saveAtual, id) };
	}).filter(Boolean);
}

function itensParaVender() {
	return (saveAtual.inventario || []).map(function (entrada) {
		const def = getItemDef(entrada.id);
		if (!def || def.tipo === "missao") return null;
		const equipado = itemEstaEquipado(saveAtual, entrada.id);
		const sobra = entrada.quantidade - (equipado ? 1 : 0);
		return { id: entrada.id, def: def, preco: precoDeVenda(def), pode: sobra >= 1, equipado: equipado, tem: entrada.quantidade };
	}).filter(Boolean);
}

function listaAtual() {
	return Loja.modo === "comprar" ? itensParaComprar() : itensParaVender();
}

function renderLoja() {
	if (!Loja.aberta || !saveAtual) return;

	document.querySelectorAll(".shop-tab").forEach(function (t) {
		t.classList.toggle("active", t.dataset.modo === Loja.modo);
	});
	elLoja("shopGold").textContent = saveAtual.gold;

	const itens = listaAtual();
	if (Loja.indice >= itens.length) Loja.indice = Math.max(0, itens.length - 1);

	const lista = elLoja("shopList");
	lista.innerHTML = "";

	if (itens.length === 0) {
		const vazio = document.createElement("p");
		vazio.className = "shop-vazio";
		vazio.textContent = Loja.modo === "comprar" ? "Nada à venda." : "Nada para vender.";
		lista.appendChild(vazio);
		elLoja("shopDetail").innerHTML = "";
		return;
	}

	itens.forEach(function (item, i) {
		const row = document.createElement("div");
		row.className = "shop-row" + (item.pode ? "" : " shop-row--off") + (i === Loja.indice ? " foco" : "");
		row.dataset.i = i;

		const nome = document.createElement("span");
		nome.className = "shop-row-nome";
		nome.textContent = item.def.nome;

		const extra = document.createElement("span");
		extra.className = "shop-row-extra";
		extra.textContent = item.equipado ? "Equipado" : (item.tem > 0 ? "x" + item.tem : "");

		const preco = document.createElement("span");
		preco.className = "shop-row-preco";
		preco.textContent = Loja.modo === "comprar" ? formatarOuro(item.preco) : item.preco + " G";

		row.append(nome, extra, preco);
		row.addEventListener("mouseenter", function () { Loja.indice = i; marcarFocoLoja(); });
		row.addEventListener("click", function () { Loja.indice = i; marcarFocoLoja(); confirmarLoja(); });
		lista.appendChild(row);
	});

	renderDetalheLoja(itens[Loja.indice]);
	const focada = lista.querySelector(".foco");
	if (focada) focada.scrollIntoView({ block: "nearest" });
}

function marcarFocoLoja() {
	document.querySelectorAll("#shopList .shop-row").forEach(function (r, i) {
		r.classList.toggle("foco", i === Loja.indice);
	});
	renderDetalheLoja(listaAtual()[Loja.indice]);
}

function renderDetalheLoja(item) {
	const caixa = elLoja("shopDetail");
	if (!item) { caixa.innerHTML = ""; return; }

	const def = item.def;
	caixa.innerHTML = "";

	const titulo = document.createElement("strong");
	titulo.textContent = def.nome;
	caixa.appendChild(titulo);

	if (def.descricao) {
		const p = document.createElement("p");
		p.textContent = def.descricao;
		caixa.appendChild(p);
	}

	const stats = [];
	if (typeof def.dano === "number") stats.push("Dano: " + def.dano);
	if (def.efeito && def.efeito.tipo === "cura") stats.push("Cura " + def.efeito.valor + " HP");
	if (def.efeito && def.efeito.tipo === "mana") stats.push("Restaura " + def.efeito.valor + " MP");
	stats.push("Você tem: " + getQuantidadeItem(saveAtual, item.id));
	if (Loja.modo === "vender") stats.push("Venda: " + item.preco + " G");

	const s = document.createElement("p");
	s.className = "shop-detail-stats";
	s.textContent = stats.join(" · ");
	caixa.appendChild(s);
}

function confirmarLoja() {
	const itens = listaAtual();
	const item = itens[Loja.indice];
	if (!item) return;
	const falas = Loja.vendedor.falas;

	if (Loja.modo === "comprar") {
		if (!item.pode) { falar(falas.semOuro, "pensando"); return; }
		saveAtual.gold -= item.preco;
		adicionarItem(saveAtual, item.id, 1);
		falar(sortearDaLista(falas.comprou), "falando");
	} else {
		if (!item.pode) { falar(falas.equipado, "pensando"); return; }
		removerItem(saveAtual, item.id, 1);
		saveAtual.gold += item.preco;
		falar(sortearDaLista(falas.vendeu), "falando");
	}

	atualizarHud();
	renderLoja();
}

function moverSelecaoLoja(delta) {
	const total = listaAtual().length;
	if (total === 0) return;
	Loja.indice = (Loja.indice + delta + total) % total;
	marcarFocoLoja();
	const focada = document.querySelector("#shopList .shop-row.foco");
	if (focada) focada.scrollIntoView({ block: "nearest" });
}

const camadaLoja = {
	id: "loja",
	aoCima: function () { moverSelecaoLoja(-1); },
	aoBaixo: function () { moverSelecaoLoja(1); },
	aoEsquerda: function () { trocarModoLoja("comprar"); },
	aoDireita: function () { trocarModoLoja("vender"); },
	aoConfirmar: function () { confirmarLoja(); },
	aoVoltar: function () { fecharLoja(); }
};

const btnFecharLoja = document.createElement("button");
btnFecharLoja.type = "button";
btnFecharLoja.className = "shop-close";
btnFecharLoja.setAttribute("aria-label", "Fechar loja");
btnFecharLoja.textContent = "✕";
btnFecharLoja.addEventListener("click", function () { fecharLoja(); });
document.querySelector("#shopWindow .shop-top").appendChild(btnFecharLoja);

document.querySelectorAll(".shop-tab").forEach(function (t) {
	t.addEventListener("click", function () { trocarModoLoja(t.dataset.modo); });
});