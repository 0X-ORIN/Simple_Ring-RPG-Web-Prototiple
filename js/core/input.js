const Input = (function () {
	const camadas = [];

	const ACOES = {
		ArrowUp: "aoCima", ArrowDown: "aoBaixo", ArrowLeft: "aoEsquerda", ArrowRight: "aoDireita",
		z: "aoConfirmar", Z: "aoConfirmar", Enter: "aoConfirmar", " ": "aoConfirmar",
		x: "aoVoltar", X: "aoVoltar", Escape: "aoVoltar",
		m: "aoMenu", M: "aoMenu"
	};

	function empurrar(camada) {
		remover(camada.id);
		camadas.push(camada);
	}

	function remover(id) {
		const i = camadas.findIndex(function (c) { return c.id === id; });
		if (i >= 0) camadas.splice(i, 1);
	}

	function topo() {
		for (let i = camadas.length - 1; i >= 0; i--) {
			if (!camadas[i].ativa || camadas[i].ativa()) return camadas[i];
		}
		return null;
	}

	function moverFoco(itens, delta) {
		if (!itens || itens.length === 0) return -1;
		const atual = itens.findIndex(function (el) { return el.classList.contains("foco"); });
		const novo = atual === -1
			? (delta > 0 ? 0 : itens.length - 1)
			: (atual + delta + itens.length) % itens.length;
		itens.forEach(function (el, i) { el.classList.toggle("foco", i === novo); });
		itens[novo].scrollIntoView({ block: "nearest" });
		return novo;
	}

	function definirFoco(itens, alvo) {
		itens.forEach(function (el) { el.classList.toggle("foco", el === alvo); });
	}

	document.addEventListener("keydown", function (e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.target && e.target.matches && e.target.matches("input, textarea, select")) return;

		const nomeAcao = ACOES[e.key];
		if (!nomeAcao) return;

		const camada = topo();
		if (!camada || typeof camada[nomeAcao] !== "function") return;

		const ehSeta = nomeAcao === "aoCima" || nomeAcao === "aoBaixo" || nomeAcao === "aoEsquerda" || nomeAcao === "aoDireita";
		e.preventDefault();
		if (e.repeat && !ehSeta) return;

		camada[nomeAcao]();
	});

	document.addEventListener("keyup", function (e) {
		if (e.key === " " && topo() && !(e.target && e.target.matches && e.target.matches("input, textarea, select"))) {
			e.preventDefault();
		}
	});

	return { empurrar: empurrar, remover: remover, topo: topo, moverFoco: moverFoco, definirFoco: definirFoco };
})();