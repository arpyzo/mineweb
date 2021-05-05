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
        return response.returnText(getServerList(owner).join("<br>\n"));
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

    return response.return404();
}

function getServerList(owner) {
    const servers = [];
    fs.readdirSync(serverDir, { withFileTypes: true}).forEach(function(serverDirEntry) {
        if (serverDirEntry.isDirectory()) {
            const serverMetadata = getServerMetadata(serverDirEntry.name);
            if (serverMetadata) {
                if (serverMetadata.owner == owner) {
                    serverMetadata.status = getServerStatus(serverDirEntry.name);
                    servers.push(serverDirEntry.name);
                }
            }
            console.log(serverMetadata);
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

function getServerStatus(server) {
    try {
        return fs.readFileSync(`${serverDir}/${server}/server_state`, {encoding: 'utf8'});
    } catch(error) {
        return "stopped";
    }
}

exports.handle = handle;
