// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Configurations of the embedded reports
class PowerBiReportDetails {
    reportId: any;
    reportName: any;
    embedUrl: any;

    constructor(reportId: any, reportName: any, embedUrl: any) {
        this.reportId = reportId;
        this.reportName = reportName;
        this.embedUrl = embedUrl;
    }
}

export default PowerBiReportDetails;