// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Properties for embedding the report 
class EmbedConfig {
    type: any;
    reportsDetail: any;
    embedToken: any;

    constructor(type?: any, reportsDetail?: any, embedToken?: any) {
        this.type = type;
        this.reportsDetail = reportsDetail;
        this.embedToken = embedToken;
    }
}

export default EmbedConfig;