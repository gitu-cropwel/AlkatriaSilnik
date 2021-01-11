const gameSettings = {
	clientInfo: {
		host: window.server_host,
		token: window.player_token
	},
	serverCodes: {
		s1: 1,
		s2: "multi_code",
		s3: 2,
		s4: "new_mail",
		s5: "ping",
		s6: 99,
		s7: "reset_move",
		s8: "player_backpack",
		s9: 4,
		s10: 5,
		s11: "server_reboot",
		s12: "remove_auction",
		s13: 964,
		s14: "move_outfit",
		s15: 10,
		s16: 71,
		s17: 30,
		s18: 75,
		s19: "start_tutorial",
		s20: "skip_tutorial",
		s21: 1092,
		s22: 1020,
		s23: 1091,
		s24: 1090,
		s25: 1015,
		s26: 1001,
		s27: 100,
		s28: 101,
		s29: "quest_history",
		s30: 368,
		s31: 367,
		s32: 433,
		s33: 102,
		s34: 1094,
		s35: "move_me",
		s36: "postoffice_window",
		s37: "npc_messages",
		s38: "minimap",
		s39: "attack_speed",
		s40: 1051,
		s41: 1030,
		s42: "clan_payment",
		s43: 733,
		s44: 732,
		s45: 886,
		s46: "death",
		s47: "global_shop_window",
		s48: "shop_window",
		s49: "spell_effect",
		s50: "player_stats",
		s51: 1009,
		s52: "item",
		s53: "auction_window",
		s54: "casino_window",
		s55: "blacksmith_window",
		s56: 85,
		s57: "loot",
		s58: "friends",
		s59: 1052,
		s60: 1056,
		s61: 54,
		s62: 55,
		s63: "npc",
		s64: "mails",
		s65: "mail_send",
		s66: 78,
		s67: 8585,
		s68: 543,
		s69: 51,
		s70: 940,
		s71: "load_game",
		s72: "spells",
		s73: 1018,
		s74: 1471,
		s75: 941,
		s76: 939,
		s77: "small_window",
		s78: 1002,
		s79: "buy_items",
		s80: "sell_items",
		s81: 685,
		s82: 764,
		s83: 1016,
		s84: 1504,
		s85: "error",
		s86: "death",
		s87: "removeBackpack",
		s88: "reload",
		s89: "refresh",
		s90: 1004,
		s91: 1005,
		s92: 1007,
		s93: "depo_window",
		s94: "clans_list",
		s95: "clans",
		s96: 87877,
		s97: "post_send",
		s98: "alert",
		s99: "auction_bought",
		s100: "auction",
		s101: 84,
		s102: "my_clan",
		s103: "show_clan",
		s104: "cutscene",
		s105: "add_friend",
		s106: 1003,
		s107: "remove_friend",
		s108: 877,
		s109: 878,
		s110: 676,
		s111: 654,
		s112: "resize_window",
		s113: "show_tile",
		s114: "exhaust_tile",
		s115: "forge_window",
		s116: "customname_item_window",
		s117: "craft_details",
		s118: "crafting_window"
	},
	clientStorage: {
		pingTimeClient: 0,
		pingTimeServer: 0,
		stopGame: false
	},
	serverWS: `wss://alkatria.pl/${gameSettings.clientInfo.host}`,
	serverSocket: null
};

const gameLib = {
	axios: "https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.js"
};

const gameEngine = {
	loadScript: (url) => {
		const scriptElement = document.createElement("script");
		scriptElement.src = url;
		document.getElementsByTagName("head")[0].appendChild(scriptElement);
	},
	axiosRequest: (url, data, async, type) => {
	    if(typeof type === "undefined") const type = "POST";
		if(type == "POST") data["token"] = gameSettings.clientInfo.token;
		const axiosRes = axios({
			method: type,
			url: `https://alkatria.pl${url}`,
			data: data,
		});
        return axiosRes;
	},
	loadingBar: (percent) => {
		const width = (821 * (percent / 100));
		document.querySelector(".loading-percent").innerText = `${percent}%`;
		document.querySelector(".loading-status").style.width = `${width}px`;
	},
	isLocked: () => {
		return false; // tia ja tez nie wiem po co to.
	},
	init: () => {
		loadScript(gameLib.axios);
		document.querySelector(".opacity-full").classList.add("hidden");
		document.querySelector(".loading-info").innerText = "Ładowanie gry...";
		try {
			gameSettings.serverSocket = new WebSocket(gameSettings.serverWS);
			gameSettings.serverSocket.onopen = (msg) => {
				gameSettings.serverSocket.send(JSON.stringify({code: 1, window: [window.innerWidth, window.innerHeight], token: player_token}));
			}
			gameSettings.serverSocket.onmessage = (msg) => {
				var message = JSON.parse(msg.data);
				if (message.code === "json") {
					message = gameEngine.axiosRequest(`/json.php?token=${data.hash}`, {}, false, 'GET');
				}
				game.parseServerPacket(message.data);
			}
			gameSettings.serverSocket.onclose = (msg) => {
				document.querySelector(".opacity-full").classList.remove("hidden");
				document.querySelector(".loading-percent").innerText = "Trwa łączenie z serwerem...");
				setTimeout(() => {
					gameEngine.init();
				}, 1000);
			}
		} catch(err) {
			console.log(err);
		}
	},
	sendPacket: (code, data) => {
		if (gameSettings.serverSocket.readyState === 1) gameSettings.serverSocket.send(JSON.stringify({code: code, data: data}));
	},
	singlePacket: (code, action) => {
		gameEngine.sendPacket(code, { action: action });
	},
	itemPacket: (code, action, item) => {
		gameEngine.sendPacket(code, { action: action, item: item });
	},
	chatMessage: (data) => {
		const msg = data.message;
		msg.replace(/(http.:\/\/[^\s]+)/gi, "<a href='$1' target='_blank'>$1</a>");
		if (data.player !== undefined) {
			this.msgSend = `${data.time} <span class="player-chat" data-name="${data.name}">${data.player}</span>: ${msg}`
		} else if (data.time === undefined) {
			this.msgSend = msg;
		} else {
			this.msgSend = `${data.time}: ${msg}`;
		}

		if (data.color !== undefined) {
			document.querySelector(`.chat-messages-${data.channel}`).append(fromHTML(`<span title=${data.date} style="color: ${data.color}">${this.msgSend}</span><br>`));
		} else {
			document.querySelector(`.chat-messages-${data.channel}`).append(fromHTML(`<span title=${data.date}>${this.msgSend}</span><br>`));
		}
		
		if (this.channel !== data.channel) {
			document.querySelector(`.channel-${data.channel}`).classList.add('new-message');
		}
		
		document.getElementById(`chat-messages-${data.channel}`).scrollTop = document.getElementById(`chat-messages-${data.channel}`).scrollHeight;
	},
	ping: (ping) => {
		if (ping == undefined) ping = "start";

		gameSettings.clientStorage.pingTimeServer = Date.now();
		gameEngine.sendPacket("ping", {ping: ping});
	},
	refresh: () => {
		gameSettings.clientStorage.stopGame = false;
		gameEngine.sendPacket("refresh", {});
	},
	parseServerPacket: (data) => {
		if (gameSettings.clientStorage.stopGame && data.code < 3) return;
		switch (data.code) {
			case s1:
				gameEngine.chatMessage(data);
				break;
			case s2:
				data.items.forEach((serverInfo) => {
					if (typeof serverInfo !== "object") serverInfo = JSON.parse(serverInfo);
					if (serverInfo.code === "json") {
						serverInfo = gameEngine.axiosRequest(`/json.php?token=${data.hash}`, {}, false, "GET");
					}
					game.parseServerPacket(serverInfo.data);
				});
			case s3:
				map.update(data);
				break;
			case s4:
				if (document.querySelector(".icon-count").length > 0) {
					let mailsCount = parseInt(document.querySelector(".icon-count").innerText);
					mailsCount = mailsCount++;
					document.querySelector(".icon-count").innerText = mailsCount;
				} else {
					document.querySelector(".icon-mail").append(fromHTML("<div class='icon-count'>1</div>"));
				}
			case s5:
				gameSettings.clientStorage.pingTimeClient = Date.now() - gameSettings.clientStorage.pingTimeServer;
				document.querySelector(".game-ping").innerText = `${gameSettings.clientStorage.pingTimeClient}ms`;
				setTimeout((ping) => {
					gameEngine.ping(ping);
				}, 1000, gameSettings.clientStorage.pingTimeClient);
				break;
		}
	}
}
