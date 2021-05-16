var stateInterval;

$(document).ready(function() {
    const owner = window.location.pathname.split("/")[2];
    if (owner) {
        ajaxRequest({
            type: 'GET',
            url: "api/list?owner=" + owner,
            success: appendServers
        });
    }
});

// TODO: set button text/color & state color
function appendServers(servers) {
    for (const server of servers) {
        $("#servers-div").append(`
            <div>
                <button id="server-btn-${server.id}" class="row-item" type="button"></button>
                <div id="server-state-div-${server.id}" class="row-item server-state-div"></div>
                <div class="row-item">${server.name}</div>
            </div>
        `);

        setStateDisplay(server.id, server.state);
        if (["starting", "stopping"].includes(server.state)) {
            stateInterval = setInterval(function() { trackState(server.id); }, 1000);
        }

        $(`#server-btn-${server.id}`).click(function() { sendCommand(server.id); });
    }
}

// TODO: prevent and allow button press
function setStateDisplay(serverId, serverState) {
    $(`#server-state-div-${serverId}`).html(serverState);

    switch(serverState) {
        case "stopped":
            $(`#server-btn-${serverId}`).html("Start");
            $(`#server-btn-${serverId}`).css("color", "black");
            $(`#server-state-div-${serverId}`).css("color", "gray");
            $(`#server-state-div-${serverId}`).removeClass("flashing");
            break;
        case "starting":
        case "stopping":
            $(`#server-btn-${serverId}`).html("Wait");
            $(`#server-btn-${serverId}`).css("color", "gray");
            $(`#server-state-div-${serverId}`).css("color", "gold");
            $(`#server-state-div-${serverId}`).addClass("flashing");
            break;
        case "running":
            $(`#server-btn-${serverId}`).html("Stop");
            $(`#server-btn-${serverId}`).css("color", "black");
            $(`#server-state-div-${serverId}`).css("color", "green");
            $(`#server-state-div-${serverId}`).removeClass("flashing");
            break;
        default:
            $(`#server-btn-${serverId}`).html("");
            $(`#server-state-div-${serverId}`).css("color", "red");
            $(`#server-state-div-${serverId}`).removeClass("flashing");
    }
}

function trackState(serverId) {
    ajaxRequest({
        type: 'GET',
        url: "api/state?server=" + serverId,
        success: function(server) {
            if (["stopped", "running"].includes(server.state)) {
                setStateDisplay(serverId, server.state);
                window.clearInterval(stateInterval);
            }
        }
    });
}

function sendCommand(serverId) {
    const serverCommand = $(`#server-btn-${serverId}`).html().toLowerCase();
    if (["start", "stop"].includes(serverCommand)) {
         ajaxRequest({
            type: 'GET',
            url: `api/${serverCommand}?server=${serverId}`,
            success: function() {
                const newState = serverCommand == "start" ? "starting" : "stopping";
                setStateDisplay(serverId, newState)
                stateInterval = setInterval(function() { trackState(serverId); }, 1000);
            }
        });
    }
}

function ajaxRequest(request, timeout) {
    $.ajax({
        ...request,
        timeout: 5000,
        error: function(data, state, error) {
            alert(`
                AJAX Failure: ${state}\n
                Error: ${error}\n
                Response: ${data.responseText}
            `);
        }
    });
}
