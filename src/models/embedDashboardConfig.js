// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Configurations of the embedded reports
class PowerBiDashboardDetails {
    constructor(dashboardId, dashboardName, embedUrl) {
        this.dashboardId = dashboardId;
        this.dashboardName = dashboardName;
        this.embedUrl = embedUrl;
    }
}

module.exports = PowerBiDashboardDetails;