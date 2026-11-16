// Ferramenta de desenvolvimento. Não é carregada automaticamente pelo jogo.
// Pra usar: abra o Console (F12), cole o conteúdo desse arquivo, dê Enter,
// depois digite criarSaveExemplo() e Enter.
function criarSaveExemplo() {
	const save = criarNovoSave();
	save.nome = "Aventura de Teste";
	save.nivel = 7;
	save.hp = { atual: 54, max: 60 };
	save.mp = { atual: 18, max: 24 };
	save.sp = { atual: 8, max: 12 };
	save.xp = { atual: 340, max: 800 };
	save.gold = 340;
	save.dia = 3;
	save.tempo = 62;
	save.status = {
		forca: 8, destreza: 12, velocidade: 11, constituicao: 8,
		inteligencia: 1, sabedoria: 1, carisma: 1, espirito: 1,
		sorte: 1, fe: 1
	};

	save.inventario = [
		{ id: "espada_curta", quantidade: 1 },
		{ id: "escudo_madeira", quantidade: 1 },
		{ id: "pocao_vida", quantidade: 3 },
		{ id: "amuleto_sorte", quantidade: 1 },
		{ id: "chave_guilda", quantidade: 1 }
	];

	save.equipamento.armaPrimaria = "espada_curta";
	save.equipamento.armaSecundaria = "escudo_madeira";
	save.equipamento.artefatos.pescoco = "amuleto_sorte";

	save.missoes = [{ id: "entrega_guilda", status: "ativa" }];

	saveSlots[0] = save;
	salvarSlotsNoStorage();
	renderSaveSlots();
	console.log("Save de teste criado no slot 1.");
}