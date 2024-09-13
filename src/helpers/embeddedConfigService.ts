// const auth = require(__dirname + "/authentication.js");
const utils = require(__dirname + "/../controllers/utils.js");

const PowerBiReportDetails = require(__dirname + "/../models/embedReportConfig.js");
const PowerBiDashboardDetails = require(__dirname + "/../models/embedDashboardConfig.js");
const EmbedConfig = require(__dirname + "/../models/embedConfig.js");
import config from "../../config/config.json";

const getAccessToken = async function () {

    // Use ADAL.js for authentication
    let adal = require("adal-node");

    let AuthenticationContext = adal.AuthenticationContext;
    let authorityUrl = config.authorityUri;

    // Check for the MasterUser Authentication
    // if (config.authenticationMode.toLowerCase() === "masteruser") {
    //     let context = new AuthenticationContext(authorityUrl);

    //     return new Promise(
    //         (resolve, reject) => {
    //             context.acquireTokenWithUsernamePassword(config.scope, config.pbiUsername, config.pbiPassword, config.clientId, function (err: any, tokenResponse: any) {

    //                 // Function returns error object in tokenResponse
    //                 // Invalid Username will return empty tokenResponse, thus err is used
    //                 if (err) {
    //                     reject(tokenResponse == null ? err : tokenResponse);
    //                 }
    //                 resolve(tokenResponse);
    //             })
    //         }
    //     );

    //     // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    // } else if (config.authenticationMode.toLowerCase() === "serviceprincipal") {
        authorityUrl = authorityUrl.replace("common", config.tenantId);
        let context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithClientCredentials(config.scope, config.clientId, config.clientSecret, function (err: any, tokenResponse: any) {

                    // Function returns error object in tokenResponse
                    // Invalid Username will return empty tokenResponse, thus err is used
                    if (err) {
                        reject(tokenResponse == null ? err : tokenResponse);
                    }
                    resolve(tokenResponse);
                })
            }
        );
    // }
}

async function getRequestHeader() {

    // Store authentication token
    let tokenResponse: any;

    // Store the error thrown while getting authentication token
    let errorResponse;

    // Get the response from the authentication request
    try {
        tokenResponse = await getAccessToken();
    } catch (err: any) {
        if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
            errorResponse = err.error_description;
        } else {

            // Invalid PowerBI Username provided
            errorResponse = err.toString();
        }
        return {
            'status': 401,
            'error': errorResponse
        };
    }

    // Extract AccessToken from the response
    const token = tokenResponse.accessToken;
    return {
        'Content-Type': "application/json",
        'Authorization': utils.getAuthHeader(token)
    };
}

async function getEmbedTokenForSingleReportSingleWorkspace(reportId: any, datasetIds: any, targetWorkspaceId: any) {

    try{
    // Add report id in the request
    let formData: any = {
        'reports': [{
            'id': reportId
        }]
    };

    // Add dataset ids in the request
    formData["datasets"] = [];
    for (const datasetId of datasetIds) {
        formData['datasets'].push({
            'id': datasetId
        })
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
        formData['targetWorkspaces'] = [];
        formData['targetWorkspaces'].push({
            'id': targetWorkspaceId
        })
    }

    formData['identities'] = [{
        "username": config.username,
        "roles": config.roles,
        "datasets": datasetIds
    }]
    
    const embedTokenApi = `https://api.powerbi.com/v1.0/myorg/GenerateToken`;
    const headers: any = await getRequestHeader();

    // Generate Embed token for single report, workspace, and multiple datasets. Refer https://aka.ms/MultiResourceEmbedToken
    const result = await fetch(embedTokenApi, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    });


    if (!result.ok){
        const errorBody = await result.text();
        console.log('Error body:', errorBody);
        throw new Error(`API Error: ${result.statusText} (${result.status})`);
        throw result;
    }else {
        return result.json();
    }
    } catch(error){
        console.log(error)
    }
}


export async function getEmbedParamsForSingleReport(workspaceId: any, reportId: any, additionalDatasetId?: any) {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers: any = await getRequestHeader();

    // Get report info by calling the PowerBI REST API
    const result = await fetch(reportInGroupApi, {
        method: 'GET',
        headers: headers,
    })

    if (!result.ok) {
        throw result;
    }

    // Convert result in json to retrieve values
    const resultJson = await result.json();

    // Add report data for embedding
    const reportDetails = new PowerBiReportDetails(resultJson.id, resultJson.name, resultJson.embedUrl);
    const reportEmbedConfig = new EmbedConfig();

    // Create mapping for report and Embed URL
    reportEmbedConfig.reportsDetail = [reportDetails];

    // Create list of datasets
    let datasetIds = [resultJson.datasetId];

    // Append additional dataset to the list to achieve dynamic binding later
    if (additionalDatasetId) {
        datasetIds.push(additionalDatasetId);
    }

    // Get Embed token multiple resources
    reportEmbedConfig.embedToken = await getEmbedTokenForSingleReportSingleWorkspace(reportId, datasetIds, workspaceId);
    // console.log('abbabababababa',reportEmbedConfig.embedToken )

    return reportEmbedConfig;
}