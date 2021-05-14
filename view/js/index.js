var statusInterval;

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

// TODO: set button text/color & status color
function appendServers(servers) {
    for (const server of servers) {
        $("#servers-div").append(`
            <div>
                <button id="server-btn-${server.id}" class="row-item" type="button"></button>
                <div id="server-status-div-${server.id}" class="row-item server-status-div"></div>
                <div class="row-item">${server.name}</div>
            </div>
        `);

        setStatusDisplay(server.id, server.status);

        if (["starting", "stopping"].includes(server.status)) {
            statusInterval = setInterval(function() { trackStatus(server.id); }, 1000);
        }
    }
}

// TODO: prevent and allow button press
function setStatusDisplay(serverId, serverStatus) {
    $(`#server-status-div-${serverId}`).html(serverStatus);

    switch(serverStatus) {
        case "stopped":
            $(`#server-btn-${serverId}`).html("Start");
            $(`#server-btn-${serverId}`).css("color", "black");
            $(`#server-status-div-${serverId}`).css("color", "gray");
            $(`#server-status-div-${serverId}`).removeClass("flashing");
            break;
        case "starting":
        case "stopping":
            $(`#server-btn-${serverId}`).html("Wait");
            $(`#server-btn-${serverId}`).css("color", "gray");
            $(`#server-status-div-${serverId}`).css("color", "gold");
            $(`#server-status-div-${serverId}`).addClass("flashing");
            break;
        case "running":
            $(`#server-btn-${serverId}`).html("Stop");
            $(`#server-btn-${serverId}`).css("color", "black");
            $(`#server-status-div-${serverId}`).css("color", "green");
            $(`#server-status-div-${serverId}`).removeClass("flashing");
            break;
        default:
            $(`#server-btn-${serverId}`).html("");
            $(`#server-status-div-${serverId}`).css("color", "red");
            $(`#server-status-div-${serverId}`).removeClass("flashing");
    }
}

function trackStatus(serverId) {
    ajaxRequest({
        type: 'GET',
        url: "api/status?server=" + serverId,
        success: function(server) {
            if (["stopped", "running"].includes(server.status)) {
                setStatusDisplay(serverId, server.status);
                window.clearInterval(statusInterval);
            }
        }
    });
}

function ajaxRequest(request, timeout) {
    $.ajax({
        ...request,
        timeout: 5000,
        error: function(data, status, error) {
            alert(`
                AJAX Failure: ${status}\n
                Error: ${error}\n
                Response: ${data.responseText}
            `);
        }
    });
}
