const fs = require("fs");

function handle(request, response) {
    request.parseURL();
    if (!request.url) {
        return response.return404();
    }

    if (request.headers["content-type"] && request.headers["content-type"] == "application/json") {
        try {
            request.parseJSONData();
        } catch(error) {
            return response.return400(error);
        }
    }

    // Required for relative link resolution
    //if (request.url == "") {
    //    return response.redirect(301, request.app + "/");
    //}

    if (/\.(?:html|css|js)$/.test(request.url)) {
        return response.returnAsset(__dirname + "/view" + request.url);
    }

    if (request.url == "/api/list") {
        return response.returnText(getServerList().join("\n"));
    }

    if (request.url == "/api/start") {
        //return response.returnText("");
    }

    if (request.url == "/api/stop") {
        //return response.returnText("");
    }

    if (request.url == "/api/running") {
        //return response.returnText("");
    }
}

function getServerList() {
    servers = [];
    fs.readdirSync(__dirname + "/../servers", { withFileTypes: true}).forEach(function(serverDirEntry) {
        if (serverDirEntry.isDirectory()) {
            servers.push(serverDirEntry.name);
        }
    });
    return servers;
}

exports.handle = handle;
