
// Assign variables
var variables = {
    // Domain of Azure AD tenant
    azureAD: "tenantname.onmicrosoft.com",
    // ClientId of Azure AD application principal
    clientId: "11111111-1111-1111-1111-111111111111",
    // GUID of SharePoint list
    listId: "22222222-2222-2222-2222-222222222222",
    // Name of SharePoint tenant
    sharePointTenant: "tenantname"
}

// Assign variables
var sogetiDataConection = {
    // Domain of Azure AD tenant
    azureAD: "Sogeti350.onmicrosoft.com",
    // ClientId of Azure AD application principal
    clientId: "8d2bd676-c9b1-40d5-8e7f-e68b319a1389",
    // GUID of SharePoint list
    listId: "6eadeed3-85fe-48e3-b606-8df84436b67a",
    // Name of SharePoint tenant
    sharePointTenant: "Sogeti350.onmicrosoft.com "
}

// Create config and get AuthenticationContext
window.config = {
    tenant: variables.azureAD,
    clientId: variables.clientId,
    postLogoutRedirectUri: window.location.origin,
    endpoints: {
        graphApiUri: "https://graph.microsoft.com",
        sharePointUri: "https://" + variables.sharePointTenant + ".sharepoint.com",
    },
    cacheLocation: "localStorage"
};

var authContext = new AuthenticationContext(config);
