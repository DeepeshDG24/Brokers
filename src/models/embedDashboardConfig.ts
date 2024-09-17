// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Configurations of the embedded reports
class PowerBiDashboardDetails {
    dashboardId: any;
    dashboardName: any;
    embedUrl: any;

    constructor(dashboardId: any, dashboardName: any, embedUrl: any) {
        this.dashboardId = dashboardId;
        this.dashboardName = dashboardName;
        this.embedUrl = embedUrl;
    }
}

export default PowerBiDashboardDetails;