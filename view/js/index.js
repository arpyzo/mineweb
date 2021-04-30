$(document).ready(function() {
    ajaxRequest({
        type: 'GET',
        url: "api/list",
        success: appendServers
    });
});

/*function ajaxJSONRequest(type, url, data, success) {
    ajaxRequest({
        type: type,
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: success
    });
}*/

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
