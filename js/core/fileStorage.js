const suportaFileSystem = "showDirectoryPicker" in window;
let pastaSavesHandle = null;
let pastaSavesStatus = "desvinculada";

const FS_DB_NAME = "simpleRingRPG_fs";
const FS_DB_STORE = "handles";

function abrirFsDb() {
	return new Promise(function (resolve, reject) {
		const req = indexedDB.open(FS_DB_NAME, 1);
		req.onupgradeneeded = function () { req.result.createObjectStore(FS_DB_STORE); };
		req.onsuccess = function () { resolve(req.result); };
		req.onerror = function () { reject(req.error); };
	});
}

async function salvarHandleFolderNoDb(handle) {
	const db = await abrirFsDb();
	return new Promise(function (resolve, reject) {
		const tx = db.transaction(FS_DB_STORE, "readwrite");
		tx.objectStore(FS_DB_STORE).put(handle, "pastaSaves");
		tx.oncomplete = function () { resolve(); };
		tx.onerror = function () { reject(tx.error); };
	});
}

async function carregarHandleFolderDoDb() {
	const db = await abrirFsDb();
	return new Promise(function (resolve, reject) {
		const tx = db.transaction(FS_DB_STORE, "readonly");
		const req = tx.objectStore(FS_DB_STORE).get("pastaSaves");
		req.onsuccess = function () { resolve(req.result || null); };
		req.onerror = function () { reject(req.error); };
	});
}

async function vincularPastaSaves() {
	if (!suportaFileSystem) {
		alert("Seu navegador não suporta vincular uma pasta real de arquivos. Use Chrome ou Edge pra essa função.");
		return false;
	}
	try {
		const handle = await window.showDirectoryPicker();
		const permissao = await handle.requestPermission({ mode: "readwrite" });
		if (permissao !== "granted") return false;

		pastaSavesHandle = handle;
		pastaSavesStatus = "vinculada";
		await salvarHandleFolderNoDb(handle);
		await escreverTodosSlotsNaPasta();
		return true;
	} catch (err) {
		console.log("Seleção de pasta cancelada ou falhou:", err);
		return false;
	}
}

async function reconectarPastaSaves() {
	if (!pastaSavesHandle) return false;
	try {
		const permissao = await pastaSavesHandle.requestPermission({ mode: "readwrite" });
		if (permissao === "granted") {
			pastaSavesStatus = "vinculada";
			await lerTodosSlotsDaPasta();
			return true;
		}
	} catch (err) {
		console.error("Falha ao reconectar pasta:", err);
	}
	return false;
}

async function tentarRestaurarPastaSaves() {
	if (!suportaFileSystem) return;

	let handle = null;
	try {
		handle = await carregarHandleFolderDoDb();
	} catch (err) {
		console.error("Falha ao ler pasta salva do IndexedDB:", err);
	}
	if (!handle) return;

	pastaSavesHandle = handle;
	try {
		const permissao = await handle.queryPermission({ mode: "readwrite" });
		if (permissao === "granted") {
			pastaSavesStatus = "vinculada";
			await lerTodosSlotsDaPasta();
		} else {
			pastaSavesStatus = "precisaPermissao";
		}
	} catch (err) {
		console.error("Falha ao checar permissão da pasta:", err);
		pastaSavesStatus = "precisaPermissao";
	}
}

async function escreverSlotNaPasta(index) {
	if (pastaSavesStatus !== "vinculada" || !pastaSavesHandle) return;
	const nomeArquivo = "save_slot_" + index + ".json";
	const save = saveSlots[index];

	try {
		if (!save) {
			try { await pastaSavesHandle.removeEntry(nomeArquivo); } catch (e) { /* já não existia, tudo bem */ }
			return;
		}
		const fileHandle = await pastaSavesHandle.getFileHandle(nomeArquivo, { create: true });
		const writable = await fileHandle.createWritable();
		await writable.write(JSON.stringify(save, null, 2));
		await writable.close();
	} catch (err) {
		console.error("Falha ao escrever " + nomeArquivo + ":", err);
	}
}

async function escreverTodosSlotsNaPasta() {
	for (let i = 0; i < 4; i++) await escreverSlotNaPasta(i);
}

async function lerTodosSlotsDaPasta() {
	if (!pastaSavesHandle) return;
	const novos = [];

	for (let i = 0; i < 4; i++) {
		const nomeArquivo = "save_slot_" + i + ".json";
		try {
			const fileHandle = await pastaSavesHandle.getFileHandle(nomeArquivo);
			const file = await fileHandle.getFile();
			const texto = await file.text();
			novos.push(normalizarSave(JSON.parse(texto)));
		} catch (err) {
			novos.push(null);
		}
	}

	saveSlots = novos;
	localStorage.setItem(STORAGE_KEY_SAVES, JSON.stringify(saveSlots)); // espelha no cache local, sem re-disparar a escrita na pasta
}