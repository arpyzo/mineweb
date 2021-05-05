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

function appendServers(servers) {
    success: $("#servers-div").append(servers);
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
