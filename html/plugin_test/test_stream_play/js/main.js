window.VersionCheck = function (...args) {

}

window.preview_pluginLoaded = function() {
	var plugin = document.getElementById("preview");
	plugin.WndSequence({splitNum: 1, seqIndex: 0});

	plugin.StopStream({"ch": 1});
	plugin.PlayStream({
		"stremType": 1,
		"transProto": 1,
		"ch": 1,
		"ip": "10.3.209.211",
		"port": 554,
		"usrname": "admin",
		"pwd": null
	});

	var color = plugin.GetColor({ch:1});

	console.log(color);
}