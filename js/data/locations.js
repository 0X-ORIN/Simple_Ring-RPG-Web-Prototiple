const locations = {
	cidade_centro: {
		id: "cidade_centro",
		nome: "Centro de Drawmore",
		background: "assets/backgrounds/CidadeDrawmore/CidadeCentro.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/CentroPordoSol.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/CidadeCentroNoite.png",
		texto: "Você chega ao centro de Drawmore, o coração da cidade fronteiriça. Vendedores e cidadãos caminham pelas ruas, alguns armados, guardas patrulham as ruas de pedra.",
		conexoes: [
			{ id: "cidade_parque", label: "Ir ao Parque" },
			{ id: "cidade_comercio", label: "Ir ao Comércio" },
			{ id: "cidade_guilda", label: "Ir à Guilda" },
			{ id: "cidade_igreja", label: "Ir à Igreja" },
			{ id: "cidade_forja", label: "Ir à Forja" },
			{ id: "pousada", label: "Ir à Pousada" },
			{ id: "praca_execucao", label: "Ir à Praça da Execução" },
			{ id: "cidade_exterior", label: "Sair da cidade", custoTempo: [2, 3] }
		]
	},

	cidade_parque: {
		id: "cidade_parque", nome: "Parque de Drawmore",
		background: "assets/backgrounds/CidadeDrawmore/CidadeParque.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/ParqueCrepuculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/CidadeParqueNoite.png",
		texto: "Um pequeno parque verde no meio da cidade. Mesmo tão perto do território demoníaco, ainda é possível encontrar locais pacíficos assim, talvez você possa descansar à beira do lago.",
		conexoes: [{ id: "cidade_centro", label: "Voltar ao Centro" }]
	},

	cidade_comercio: {
		id: "cidade_comercio", nome: "Distrito Comercial",
		background: "assets/backgrounds/CidadeDrawmore/CidadeComercio.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/CidadeComercioCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/CidadeComercioNoite.png",
		texto: "Lojas e barracas se espalham pelas ruas. O cheiro de pão fresco se mistura com o de metal forjado. Uma variedade de itens se mostra à sua visão, escolheria você se aproximar de alguma delas?.",
		conexoes: [
			{ id: "loja_armeiro", label: "Visitar o Armeiro" },
			{ id: "loja_ferreiro", label: "Visitar o Ferreiro" },
			{ id: "loja_armaduras", label: "Visitar o Vendedor de Armaduras" },
			{ id: "loja_magia", label: "Visitar a Loja de Magia" },
			{ id: "loja_pocoes", label: "Visitar a Loja de Poções" },
			{ id: "loja_geral", label: "Visitar a Loja Geral" },
			{ id: "cidade_centro", label: "Voltar ao Centro" }
		]
	},

	loja_armeiro: {
		id: "loja_armeiro", nome: "Armeiro",
		background: "assets/backgrounds/CidadeDrawmore/ComercioArmeiroBarraca.png",
		texto: "O armeiro ajeita lâminas numa bancada cheia de rebarbas de madeira. \"Precisa de alguma coisa amigo?\"",
		itensVenda: ["espada_curta", "espada_longa"],
		conexoes: [{ id: "cidade_comercio", label: "Voltar ao Comércio" }]
	},

	loja_ferreiro: {
		id: "loja_ferreiro", nome: "Ferreiro",
		background: "assets/backgrounds/CidadeDrawmore/ComercioForjaBarraca.png",
		texto: "Os Sons das Batidas de metal atraiu a sua atenção, um ferreiro? não, ele parece um pouco jovem, ainda sim deve sonseguir concertar suas armas. \"Ah, olá, gostaria de tentar reforçar ou concertar algum equipamento? Estou cobrando barato.\"",
		vendedor: "ferreiro",
		itensVenda: ["escudo_madeira"],
		conexoes: [{ id: "cidade_comercio", label: "Voltar ao Comércio" }]
	},

	loja_armaduras: {
		id: "loja_armaduras", nome: "Vendedor de Armaduras",
		background: "assets/backgrounds/CidadeDrawmore/CidadeComercio.png",
		texto: "Caminhando pelas ruas do comercio você então avista. Peças de couro e metal penduradas em manequins de madeira. \"Olá Viagante~ estaria interessado em alguma proteção extra?.\"",
		itensVenda: ["armadura_couro"],
		conexoes: [{ id: "cidade_comercio", label: "Voltar ao Comércio" }]
	},

	loja_magia: {
		id: "loja_magia", nome: "Loja de Magia",
		background: "assets/backgrounds/CidadeDrawmore/ComercioMagiaBarraca.png",
		texto: "Prateleiras cheias de cristais, amuletos e pergaminhos, fica claro que tipo de loja é essa, seu dono parece simpatico, porem sonolento. O ar cheira levemente a ozônio, estaria você interessado nos mistérios do mundo?.",
		vendedor: "mago",
		itensVenda: ["amuleto_sorte", "cristal_protecao"],
		conexoes: [{ id: "cidade_comercio", label: "Voltar ao Comércio" }]
	},

	loja_pocoes: {
		id: "loja_pocoes", nome: "Loja de Poções",
		background: "assets/backgrounds/CidadeDrawmore/ComercioBarracaAlquimia.png",
		texto: "Frascos coloridos se alinham em prateleiras de ponta a ponta. O cheiro é uma mistura confusa de ervas e algo adocicado, você já viu alguns alquimistas, mas deveria confiar em uma tão suspeita? Que tipo de poções ela poderia lhe vender?.",
		vendedor: "alquimista",
		itensVenda: ["pocao_vida", "pocao_mana"],
		conexoes: [{ id: "cidade_comercio", label: "Voltar ao Comércio" }]
	},

	loja_geral: {
		id: "loja_geral", nome: "Loja Geral",
		background: "assets/backgrounds/CidadeDrawmore/CidadeComercio.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/LojaGeralCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/LojaGeralNoite.png",
		texto: "Um pouco de tudo, empilhado sem muita ordem ainda sim aconchegante, um comerciante sentado sobre alguns de seus próprios itens lhe comprimenta com a cabeça.",
		itensVenda: ["pocao_vida", "escudo_madeira", "amuleto_sorte"],
		conexoes: [{ id: "cidade_comercio", label: "Voltar ao Comércio" }]
	},

	cidade_guilda: {
		id: "cidade_guilda", nome: "Guilda dos Aventureiros",
		background: "assets/backgrounds/CidadeDrawmore/CidadeGuilda.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/GuildaCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/CidadeGuildaNoite.png",
		texto: "A fachada da Guilda dos Aventureiros, com seu estandarte balançando no vento. seria interessante se aproximar do quadro de missões, mas, por que ele fica do lado de fora da guila?",
		conexoes: [
			{ id: "cidade_guilda_interior", label: "Entrar" },
			{ id: "cidade_centro", label: "Voltar ao Centro" }
		]
	},

	cidade_guilda_interior: {
		id: "cidade_guilda_interior", nome: "Salão da Guilda",
		background: "assets/backgrounds/CidadeDrawmore/InteriorGuilda.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/InteriorGuildaCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/InteriorGuildaNoite.png",
		texto: "O salão da guilda está cheio de aventureiros como você, entretanto ninguem como você, trocando histórias e bebendo um pouco antes da próxima missão. Um segundo mural de quadros de missões fica perto da entrada, ele parece diferente, gostaria de dar uma olhada.",
		conexoes: [{ id: "cidade_guilda", label: "Sair" }]
	},

	cidade_igreja: {
		id: "cidade_igreja", nome: "Igreja de Drawmore",
		background: "assets/backgrounds/CidadeDrawmore/CidadeIgreja.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/IgrejaCrepusculo.png",
		texto: "Uma igreja de pedra clara, com vitrais altos que filtram a luz do dia em cores suaves.",
		conexoes: [
			{ id: "cidade_igreja_interior", label: "Entrar" },
			{ id: "cidade_centro", label: "Voltar ao Centro" }
		]
	},

	cidade_igreja_interior: {
		id: "cidade_igreja_interior", nome: "Interior da Igreja",
		background: "assets/backgrounds/CidadeDrawmore/IgrejaInterior.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/IgrejaInteriorCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/IgrejaInteriorNoite.png",
		texto: "O silêncio aqui dentro é quase pesado. Velas acesas marcam o caminho até o altar.",
		conexoes: [{ id: "cidade_igreja", label: "Sair" }]
	},

	cidade_forja: {
		id: "cidade_forja", nome: "Forja Principal",
		background: "assets/backgrounds/CidadeDrawmore/CidadeForja.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/ForjaCrepusculo.png",
		texto: "A forja principal da cidade, de onde saem as melhores armas de Drawmore. O barulho de martelo contra metal nunca para.",
		conexoes: [{ id: "cidade_centro", label: "Voltar ao Centro" }]
	},

	praca_execucao: {
		id: "praca_execucao", nome: "Praça da Execução",
		background: "assets/backgrounds/CidadeDrawmore/PracaExecucao.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/PracadeExecucaoCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/PracaExecucaoNoite.png",
		texto: "Uma praça silenciosa, quase vazia. As pedras do chão guardam histórias que ninguém gosta de contar.",
		conexoes: [{ id: "cidade_centro", label: "Voltar ao Centro" }]
	},

	pousada: {
		id: "pousada", nome: "Pousada",
		background: "assets/backgrounds/CidadeDrawmore/PousadaLobby.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/PousadaLobbyCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/PousadaLobbyNoite.png",
		texto: "O lobby da pousada é aconchegante, com uma lareira acesa e o cheiro de comida vindo da cozinha.",
		conexoes: [
			{ id: "pousada_quarto", label: "Ir ao Quarto" },
			{ id: "cidade_centro", label: "Voltar ao Centro" }
		]
	},

	pousada_quarto: {
		id: "pousada_quarto", nome: "Quarto da Pousada",
		background: "assets/backgrounds/CidadeDrawmore/PusadaQuarto.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/PousadaQuartoCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/PousadaQuartoNoite.png",
		texto: "Um quarto simples, mas limpo. A cama parece convidativa depois de um dia caminhando pela cidade.",
		conexoes: [{ id: "pousada", label: "Voltar ao Lobby" }]
	},

	cidade_exterior: {
		id: "cidade_exterior", nome: "Muros de Drawmore",
		background: "assets/backgrounds/CidadeDrawmore/CidadeExterior.png",
		backgroundTarde: "assets/backgrounds/CidadeDrawmore/CidadeExteriorCrepusculo.png",
		backgroundNoite: "assets/backgrounds/CidadeDrawmore/CidadeExteriorNoite.png",
		texto: "Você passa pelos portões da cidade. Daqui, consegue ver onde Drawmore termina e a Dark Florest começa, uma linha escura no horizonte.",
		conexoes: [
			{ id: "dark_florest_1", label: "Entrar na Dark Florest", custoTempo: [3, 5] },
			{ id: "cidade_centro", label: "Voltar para dentro dos muros", custoTempo: [2, 3] }
		],
		exploracao: {
			incremento: 3,
			penalidade: 20,
			imagemNormal: "assets/backgrounds/CidadeDrawmore/ExteriorCidadeExplorar.png",
			imagemNormalTarde: "assets/backgrounds/CidadeDrawmore/ExteriorCidadeExplorarCrepusculo.png",
			imagemNormalNoite: "assets/backgrounds/CidadeDrawmore/ExteriorCidadeExplorarNoite.png",
			textoNormal: "Você percorre as planícies ao redor de Drawmore, mas não encontra nada de interessante dessa vez.",
			caminhos: []
		}
	},

	dark_florest_1: {
		id: "dark_florest_1", nome: "Dark Florest",
		background: "assets/backgrounds/DarkFlorest/DarkFlorest.png",
		texto: "As árvores se fecham ao seu redor e a luz do sol mal chega até o chão.",
		conexoes: [{ id: "cidade_exterior", label: "Voltar para os muros", custoTempo: [3, 5] }],
		exploracao: {
			discoveryChance: 0,
			timesExplored: 0,
			incremento: 3,
			penalidade: 20,
			imagemNormal: "assets/backgrounds/DarkFlorest/ExplorandoDarkFlorest1.png",
			caminhos: [
				{
					id: "passagem_deep_florest",
					label: "Atravessar a vegetação densa",
					destino: "deep_florest_1",
					textoEncontro: "Enquanto andava, você vê uma parte da vegetação densa que parece possível atravessar. Será uma boa ideia descobrir aonde ela dá?",
					imagemEncontro: "assets/backgrounds/DarkFlorest/ExplorandoDarkFlorest2.png"
				}
			]
		}
	},

	deep_florest_1: {
		id: "deep_florest_1", nome: "Deep Florest",
		background: "assets/backgrounds/DeepFlorest/DeepFlorest1.png",
		texto: "A vegetação aqui é ainda mais densa. O ar é úmido e pesado, e os sons da Dark Florest parecem distantes agora.",
		conexoes: [{ id: "dark_florest_1", label: "Voltar pela vegetação" }],
		exploracao: {
			discoveryChance: 0,
			timesExplored: 0,
			incremento: 3,
			penalidade: 20,
			imagemNormal: "assets/backgrounds/DeepFlorest/DeepFlorestExplorar.png",
			caminhos: []
		}
	}
};