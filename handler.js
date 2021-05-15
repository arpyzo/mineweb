const fs = require("fs");

const serverDir = __dirname + "/../servers"

function handle(request, response) {
    request.parseURL();

    // Required for relative link resolution
    if (request.url == "") {
        return response.redirect(301, "minecraft/");
    }

    if (request.url == null) {
        return response.return404();
    }

    if (/^(?:\/[a-z_]*)?$/.test(request.url)) {
        return response.returnAsset(__dirname + "/view/index.html");
    }

    if (/\.(?:html|css|js)$/.test(request.url)) {
        return response.returnAsset(__dirname + "/view" + request.url);
    }

    if (request.url == "/api/list") {
        const owner = request.params.get("owner");
        if (!owner) {
            return response.return400("Missing owner parameter");
        }
        return response.returnJSON(JSON.stringify(getServerList(owner)));
    }

    if (request.url == "/api/state") {
        const server = request.params.get("server");
        if (!server) {
            return response.return400("Missing server parameter");
        }
        return response.returnJSON(JSON.stringify({"state": getServerState(server)}));
    }

    if (request.url == "/api/start") {
        const server = request.params.get("server");
        if (!server) {
            return response.return400("Missing server parameter");
        }
        serverCommand("start", server);
        return response.return200();
    }

    if (request.url == "/api/stop") {
        const server = request.params.get("server");
        if (!server) {
            return response.return400("Missing server parameter");
        }
        serverCommand("stop", server);
        return response.return200();
    }

    return response.return404();
}

function getServerList(owner) {
    const servers = [];
    fs.readdirSync(serverDir, {withFileTypes: true}).forEach(function(serverDirEntry) {
        if (serverDirEntry.isDirectory()) {
            const serverMetadata = getServerMetadata(serverDirEntry.name);
            if (serverMetadata) {
                if (serverMetadata.owner == owner) {
                    serverMetadata.id = serverDirEntry.name;
                    serverMetadata.state = getServerState(serverDirEntry.name);
                    servers.push(serverMetadata);
                }
            }
        }
    });
    return servers;
}

function getServerMetadata(server) {
    try {
        return JSON.parse(fs.readFileSync(`${serverDir}/${server}/metadata.json`));
    } catch(error) {
        console.log(error);
        return null;
    }
}

function getServerState(server) {
    try {
        return fs.readFileSync(`${serverDir}/${server}/server_state`, {encoding: 'utf8'});
    } catch(error) {
        return "unknown";
    }
}

function serverCommand(command, server) {

}

exports.handle = handle;
