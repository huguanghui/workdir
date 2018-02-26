function digestAuthRequest(method, url, a, b, asyn, timeout) {
	var self = this;

	if (!CryptoJS) {
		CryptoJS = window.CryptoJS;
	}

	this.scheme = null;
	this.nonce = null;
	this.realm = null;
	this.qop = null;
	this.response = null;
	this.opaque = null;
	this.nc = 1;
	this.cnonce = null;
	this.basic_auth = null;
	this.auth_type = null;
	this.fixIE = false;

	this.timeout = timeout || 30000;
	this.loggingOn = false;
	this.asyn = asyn;
	this.post = false;

	if (method.toLowerCase() === "post" || method.toLowerCase() === "put") {
		this.post = true;
	}

	function SetCustomHeaders(req) {
		if ($store) {
			var vec = ["S-HASH", "X-HASH", "C-HASH"];
			var hash = $store.getters.hash;

			for (var i = 0; i < vec.length; i ++) {
				var val = hash[vec[i]];
				if (val) {
					req.setRequestHeader(vec[i], val);
				}
			}
		}
	}

	this.request = function(successFn, errorFn, data, fixIE) {
		if (data) {
			self.data = (data);
		}
		self.successFn = successFn;
		self.errorFn = errorFn;
		self.fixIE = fixIE;

		self.makeUnauthenicatedRequest(self.data);
	}

	this.makeUnauthenicatedRequest = function(data) {
		self.firstRequest = new XMLHttpRequest();
		self.firstRequest.open(method, url, self.asyn);
		var timer;
		if (self.asyn) {
			timer = 
		}
	}
}

function http({method, url, data, async, auth_type, username, pwd, successCb, errorCb, timeout} = {}) {
	data = data || null;
	
	if (typeof async == "undefined") {
		async = true;
	}

	if (auth_type) {
		url = url.replace("goform", auth_type);
	}

	let fixIEMode = false;
	var plain_url = window.location.href;
	var start = plain_url.lastIndexOf("/");
	var end = plain_url.lastIndexOf("?");
	
	plain_url = plain_url.substring(start, end == -1?plain_url.length:end);
	
	if (plain_url.indexOf('cruise.asp') != -1 ||
		plain_url.indexOf('alarm.asp') != -1 ||
		plain_url.indexOf('download.asp') != -1 ||
		plain_url.indexOf('head.asp')) {
		fixIEMode = true;
	}
	else {
		fixIEMode = false;
	}

	method = method || 'GET'
	var postReq = new digestAuthRequest(method, url, username, pwd, async, timeout);
	postReq.request(successCb, errorCb, data, fixIEMode);
}