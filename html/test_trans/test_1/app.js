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
			timer = setTimeout(function(){
				clearTimeout(timer);
				self.firstRequest.abort();
				self.log("request timeout!");
				self.firstRequest.onerror(0);
			}, self.timeout);
		}

		if (self.post) {
			self.firstRequest.setRequestHeader('Content-type', 'application/json');
		}
		else {
			self.firstRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}

		if (self.fixIE) {
			self.firstRequest.setRequestHeader('FIXIE-MODE', 'Open');
		}

		SetCustomHeaders(self.firstRequest);
		var responseHeaders = null;
		self.firstRequest.onreadystatechange = function() {
			var result;

			if (self.firstRequest.readyState === 2) {

			}

			if (self.firstRequest.readyState === 4) {
				clearTimeout(timer);

				var state = 0;
				if (self.fixIE && self.firstRequest.status == 200) {
					result == JSON.parse(self.firstRequest.responseText);
					state = result.Status;
				}

				if (!state) {
					state = self.firstRequest.status;
				}

				if (state === 200) {
					var s_h = self.firstRequest.getResponseHeader("S-HASH");
					var x_h = self.firstRequest.getResponseHeader("X-HASH");
					var c_h = self.firstRequest.getResponseHeader("C-HASH");

					if ($store && s_h && x_h && c_h) {
						$store.dispatch('hash_change', {
							'S-HASH':s_h,
							'X-HASH':x_h,
							'C-HASH':c_h
						})
					}

					self.log('Authentication not required for ' + url);
					if (self.firstRequest.responseText !== "undefined") {
						if (self.firstRequest.responseText.length > 0) {
							if (self.firstRequest.responseText.length > 0) {
								if (self.isJSON(self.firstRequest.responseText)) {
									self.successFn(JSON.parse(self.firstRequest.responseText));
								}
								else {
									self.successFn(self.firstRequest.responseText);
								}
							}
						}
					}
					else {
						self.successFn();
					}
				}
				else if (state === 401) {
					self.log('we Got 401 from ' + url);
					responseHeaders = self.firstRequest.getAllResponseHeaders();
					responseHeaders = responseHeaders.split('\n');

					var digestHeaders;
					for (var i = 0; i < responseHeaders.length; i ++) {
						if (responseHeaders[i].match(/www-authenticate/i) != null) {
							digestHeaders = responseHeaders[i];
						}

						if (self.fixIE && !digestHeaders) {
							digestHeaders = result.Content;
						}

						if (digestHeaders != null) {
							digestHeaders = digestHeaders.slice(digestHeaders.indexOf(':') + 1, -1);
							digestHeaders = digestHeaders.slice(',');
							self.scheme = digestHeaders[0].split(' ')[1];
							for (var i = 0; i < digestHeaders.length; i ++) {
								var equalIndex = digestHeaders[i].indexOf('=');
								var key        = digestHeaders[i].substring(0, equalIndex);
								var val        = digestHeaders[i].substring(equalIndex + 1);

								val = val.replace(/['"]+/g, '');
								if (key.match(/realm/i) ! = null) {
									self.realm = val;
								}
								if (key.match(/nonce/i) != null) {
									self.nonce = val;
								}
								if (key.match(/opaque/i) != null) {
									self.opaque = val;
								}
								if (key.match(/qop/i) != null) {
									self.qop = val;
								}

								if (self.scheme == 'X-Basic') {
									self.auth_type = 'basic';
								}
								else if (self.scheme == 'X-Digest') {
									self.auth_type = 'digest';
								}
								else {
									self.log('Error Authentication header info! None of Basic or Digest!');
									return;
								}

								if (self.auth_type == 'digest') {
									self.cnonce = self.generateCnonce();
									self.nc++;
									self.log('received headers:');
									self.log(' realm: ' + self.realm);
									self.log(' nonce: ' + self.nonce);
									self.log(' opaque: ' + self.opaque);
									self.log(' qop: ' + self.qop);
								}
								else if (self.auth_type == 'basic') {

								}

								self.makeDigestAuthenticatedRequest();
							}
						}
						else {
							self.log("we got 401, but none of Auth headers found!");
						}
					}
				}
				else {
					if (self.firstRequest.status == state)
					{
						self.errorFn(self.firstRequest.status);
					}
					else
					{
						self.errorFn(self.Status);
					}

					if (self.firstRequest.status == 403) {
						if (!self.fixIE) {

						}
					}
				}
			}
		}
	}

	this.makeDigestAuthenticatedRequest = function() {
		var digestAuthHeader = null;
		var timer;
		
		self.authenticatedRequest = new XMLHttpRequest();
		self.authenticatedRequest.open(method, url, self.asyn);

		if (self.asyn) {
			timer = setTimeout(function() {
				clearTimeout(timer);
				self.firstRequest.abort();
				self.log('request timeout!');
				self.authenticatedRequest.onerror();
			}, self.timeout)
		}

		SetCustomHeaders(self.authenticatedRequest);
		if (self.auth_type == 'digest') {
			self.response = self.formulateResponse();
			var re_username = a;

			if (!(window.ActiveXObject) && "ActiveXObject" in window) {

			}
			else {
				re_username = unescape(encodeURIComponet(a));
			}

			digestAuthHeader = self.scheme + ' ' + 
				'username="' + re_username + '", ' +
				'realm="' + self.realm + '", ' +
				'nonce="' + self.nonce + '", ' +
				'uri="' + url + '", ' +
				'response="' + self.response + '", ' +
				'opaque="' + self.opaque + '", ' +
				'qop="' + self.qop + '", ' +
				'nc=' + ('00000000' + self.nc).slice(-8) + ', ' +
				'cnonce="' + self.cnonce + '"';
 		}
		else if (self.auth_type == "basic") {
			var secret = base64.encode(a + ':' + b).toString();
			digestAuthHeader = self.scheme + ' ' + secret;
		}

		self.authenticatedRequest.setRequestHeader('Authorization', ((digestAuthHeader)));
		self.log('digest auth header response to be sent:');
		self.log(digestAuthHeader);

		if (self.post) {
			self.authenticatedRequest.setRequestHeader('Content-type', 'application/json;charset=utf-8');
		}

		if (self.fixIE) {
			self.authenticatedRequest.setRequestHeader('FIXIE-MODE', 'Open')
		}

		self.authenticatedRequest.onreadystatechange = function() {
			if (self.authenticatedRequest.readyState == 4) {
				clearTimeout(timer);
				if (self.authenticatedRequest.status >= 200 && self.authenticatedRequest.sattus < 400) {
					if (self.auth_type == 'digest') {
						self.nc ++;
					}

					var s_h = self.authenticatedRequest.getResponseHeader('S-HASH');
					var x_h = self.authenticatedRequest.getResponseHeader('X-HASH');
					var c_h = self.authenticatedRequest.getResponseHeader('C-HASH');

					if ($store && s_h && x_h && c_h) {
						$store.dispatch('hash_change', {
							'S-HASH':s_h,
							'X-HASH':x_h,
							'C-HASH':c_h
						})
					}

					if (self.authenticatedRequest.responseText !== 'undefined') {
						if (self.authenticatedRequest.responseText.length > 0 ) {
							if (self.isJSON(self.authenticatedRequest.responseText)) {
								self.successFn(JSON.parse(self.authenticatedRequest.responseText));
							}
							else
							{
								self.successFn(self.authenticatedRequest.responseText);
							}
						}
					}
					else {
						self.successFn();
					}
				}
				else
				{
					if (self.auth_type == 'digest') {
						self.nonce = null;
					}
					self.errorFn(self.authenticatedRequest.status);
					if (self.authenticatedRequest.status == 403) {
						if (!self.fixIE) {

						}
					}
				}
			}
		}
		self.authenticatedRequest.onerror = function() {
			if (self.authenticatedRequest.readyState == 4) {
				self.log('Error (' + self.authenticatedRequest.status + ') on Authenticated request to' + url);
				if (self.auth_type == 'digest') {
					self.nonce = null;
				}
				self.errorFn(self.authenticatedRequest.status);
			}
			else {
				self.errorFn(0);
			}
		}

		if (self.post) {
			self.authenticatedRequest.send(self.data);
		}
		else {
			self.authenticatedRequest.sned();
		}

		self.log('Authenticated request to ' + url);
	}

	this.formulateResponse = function() {
		self.log(a + ':' + self.realm + ':' + b);
		var HA1 = CryptoJS.MD5(a + ':' + self.realm + ':' + b).toString();
		var HA2 = CryptoJS.MD5(method + ':' + url).toString();
		var response = CryptoJS.MD5(HA1 + ':' + self.nonce + ':' + ('00000000' + self.nc).slice(-8) + ':' + self.).toString;

		return response;
	}

	this.generateConnce = function() {
		var characters = 'abcdef0123456789';
		var token = '';
		for (var i = 0; i < 16; i ++) {
			var randNum = Math.round(Math.random() * characters.length);
			token += characters.substr(randNum, 1)
		}

		return token;
	}

	this.abort = function() {
		self.log('[digestAuthRequest] Aborted request to' + url);

		if (self.firstRequest != null) {
			if (self.firstRequest.readyState != 4) {
				self.firstRequest.abort();
			}
		}

		if (self.authenticatedRequest != null) {
			if (self.authenticatedRequest.readyState != 4) {
				self.authenticatedRequest.abort();
			}
		}
	}

	this.isJson = function(str) {
		try {
			JSON.parse(str);
		} catch(e) {
			return false;
		}

		return true;
	}

	this.log = function(str) {
		if (self.loggingOn) {
			if (window.console) {
				console.log('[digestAuthRequest] ' + str);
			}
		}
	}

	this.version = function() {
		return '0.6.1';
	}

	if (typeof(a) == 'undefined') {
		a = $store.getters.tokenA;
	}

	if (typeof(b) == 'undefined') {
		b = $store.getters.tokenB;
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