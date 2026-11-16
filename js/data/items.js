const ITEMS = {
	espada_curta: {
		id: "espada_curta",
		nome: "Espada Curta",
		tipo: "arma",
		descricao: "Uma arma básica de todos os heróis. Pode ser aprimorada até o +99 com muita, muita sorte.",
		dano: 8
	},
	escudo_madeira: {
		id: "escudo_madeira",
		nome: "Escudo de Madeira",
		tipo: "arma",
		descricao: "Um escudo simples de madeira reforçada. Serve pra bloquear e, na pior das hipóteses, pra bater também.",
		dano: 3
	},
	amuleto_sorte: {
		id: "amuleto_sorte",
		nome: "Amuleto da Sorte",
		tipo: "artefato",
		descricao: "Um pingente antigo. Dizem que aumenta levemente a sorte de quem o carrega."
	},
	chave_guilda: {
		id: "chave_guilda",
		nome: "Chave da Guilda",
		tipo: "missao",
		descricao: "Uma chave de ferro entregue pela Guilda. Provavelmente abre algo importante."
	},
	espada_longa: {
		id: "espada_longa", 
		nome: "Espada Longa", 
		tipo: "arma", 
		descricao: "Mais pesada que a curta, exige mais força mas acerta mais forte.", 
		dano: 12,
		preco: 0 
	},
	escudo_madeira: {
		id: "escudo_madeira",
		nome: "Escudo de Madeira",
		tipo: "arma",
		descricao: "Um escudo simples de madeira reforçada. Serve pra bloquear e, na pior das hipóteses, pra bater também.",
		dano: 3,
		preco: 0
	},
	armadura_couro: {
		id: "armadura_couro",
		nome: "Armadura de Couro",
		tipo: "armadura",
		descricao: "Armadura leve feita de couro curtido. Proteção básica sem pesar.",
		preco: 0
	},
	pocao_vida: {
		id: "pocao_vida",
		nome: "Poção de Vida",
		tipo: "consumivel",
		descricao: "Restaura uma quantidade moderada de HP ao ser consumida.",
		efeito: { tipo: "cura", valor: 15 },
		preco: 0
	},
	pocao_mana: {
		id: "pocao_mana",
		nome: "Poção de Mana",
		tipo: "consumivel",
		descricao: "Restaura uma quantidade moderada de MP ao ser consumida.",
		efeito: { tipo: "mana", valor: 10 },
		preco: 0
	},
	cristal_protecao: {
		id: "cristal_protecao",
		nome: "Cristal de Proteção",
		tipo: "artefato",
		descricao: "Um cristal que emite uma aura fraca de proteção mágica.",
		preco: 0
	}
};