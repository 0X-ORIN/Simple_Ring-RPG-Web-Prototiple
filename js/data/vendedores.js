const VENDEDOR_PADRAO = {
	nome: "Vendedor",
	sprites: null,
	falas: {
		comprar: "Dê uma olhada, sem pressa.",
		vender: "Hm... vamos ver o que você tem aí.",
		comprou: ["Negócio fechado!"],
		vendeu: ["Combinado."],
		semOuro: "Parece que falta ouro no seu bolso.",
		nadaPraVender: "Você não tem nada que eu possa comprar agora.",
		equipado: "Isso você ainda está usando. Tire do equipamento primeiro.",
		voltar: "Precisa de mais alguma coisa?"
	}
};

const VENDEDORES = {
	ferreiro: {
		nome: "Ferreiro",
		sprites: {
			base: "assets/characters/Drawmore/VendedorFerreiroBase.png",
			falando: "assets/characters/Drawmore/VendedorFerreiroGesticulando.png",
			pensando: "assets/characters/Drawmore/VendedorFerreiroPensando.png"
		},
		falas: {
			comprar: "Está a procura e algo? Não é muito mas tenho alguns equipamentos uteis.",
			vender: "Quer vender algo? Bem, geralmente não sou eu quem compra, mas não acho que tenha problema.",
			comprou: ["Achou alguma coisa interessante? Pode ficar, é seu.", "Escolhendo algo assim hum? Espero que lhe seja util."],
			vendeu: ["Posso usar isso, certo! Negócio fechado.", "Parece que você tem coisas uteis meu amigo, haha, vou tentar pagar um preço justo."],
			semOuro: "Desculpe mas eu não vendo fiado, mas eu posso guardar para você haha, claro espero nos vermos bastante, o que acha? posso segurar algum item até você ter dinheiro.",
			nadaPraVender: "Aho que não vejo nada que me interesse consigo meu amigo.",
			equipado: "Pretende vender até as roupas do seu corpo e as armas em suas mãos? Haha sou corajoso, mas não pretendo arrancar de você em uma batalha, poderia retirar primeiro?",
			voltar: "Precisa de mais alguma coisa?"
		}
	},

	alquimista: {
		nome: "Alquimista",
		sprites: {
			base: "assets/characters/Drawmore/VendedorAlquimistaBase.png",
			falando: "assets/characters/Drawmore/VendedorAlquimistaGesticulando.png",
			pensando: "assets/characters/Drawmore/VendedorAlquimistaPensando.png"
		},
		falas: {
			comprar: "Fique à vontade, está tudo testado... quase tudo.",
			vender: "Hm, deixe-me ver o que você trouxe. Não costumo comprar, mas abro uma exceção.",
			comprou: ["Boa escolha. Não aceito devolução se não gostar do gosto.", "Use com sabedoria... ou não, hehe."],
			vendeu: ["Interessante. Posso aproveitar isso nos meus experimentos.", "Negócio feito."],
			semOuro: "Sem ouro, sem poção. Alquimia não é caridade.",
			nadaPraVender: "Você não tem nada que me interesse.",
			equipado: "Isso ainda está em uso. Tire do equipamento primeiro.",
			voltar: "Precisa de mais alguma coisa?"
		}
	},

	mago: {
		nome: "Mago",
		sprites: {
			base: "assets/characters/Drawmore/VendedorMagicoBase.png",
			falando: "assets/characters/Drawmore/VendedorMagicoFalando.png",
			pensando: "assets/characters/Drawmore/VendedorMagicoPensando.png"
		},
		falas: {
			comprar: "Hm? Ah, um cliente... fique à vontade, sem pressa.",
			vender: "Vender? Bem... deixe-me ver isso. *bocejo*",
			comprou: ["Boa escolha... acho. Perdão, cochilei um pouco.", "Leve com cuidado, tem mais magia nisso do que parece."],
			vendeu: ["Hmm, isso pode ser útil. Fechado.", "Aceito... só não me deixe dormir antes de pagar."],
			semOuro: "Falta ouro... acho. Conte de novo, estou meio sonolento.",
			nadaPraVender: "Nada aqui me interessa... *bocejo*",
			equipado: "Isso você ainda está usando. Tire primeiro, por favor.",
			voltar: "Mais alguma coisa? ...Perdão, me distraí."
		}
	}
};