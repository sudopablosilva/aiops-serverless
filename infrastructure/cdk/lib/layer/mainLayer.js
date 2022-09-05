"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayer = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const aws_cdk_lib_1 = require("aws-cdk-lib");
const resourceawarestack_1 = require("../resourceawarestack");
const securityLayer_1 = require("./securityLayer");
const configurationLayer_1 = require("./configurationLayer");
const storageLayer_1 = require("./storageLayer");
const databaseLayer_1 = require("./databaseLayer");
const ingestionConsumptionLayer_1 = require("./ingestionConsumptionLayer");
const processingLayer_1 = require("./processingLayer");
const websocketLayer_1 = require("./websocketLayer");
const contentDeliveryLayer_1 = require("./contentDeliveryLayer");
var DEPLOY_CDN = false;
var SESSION_PARAMETER = false;
class MainLayer extends resourceawarestack_1.ResourceAwareStack {
    constructor(scope, id, props) {
        super(scope, id, props);
        if (props && props.getParameter("deploycdn"))
            DEPLOY_CDN = true;
        if (props && props.getParameter("sessionparameter"))
            SESSION_PARAMETER = true;
        this.buildResources();
    }
    buildResources() {
        // security layer
        let securityLayer = new securityLayer_1.SecurityLayer(this, 'SecurityLayer', this.properties);
        // configuration layer
        let configLayerProps = new resourceawarestack_1.ParameterAwareProps(this.properties);
        let ssmProperties = new Map();
        ssmProperties.set("Region", this.region);
        ssmProperties.set("ClientId", securityLayer.getUserPoolClientId());
        ssmProperties.set("UserpoolId", securityLayer.getUserPoolId());
        ssmProperties.set("UserPoolURL", securityLayer.getUserPoolUrl());
        ssmProperties.set("IdentityPoolId", securityLayer.getIdentityPoolId());
        if (SESSION_PARAMETER)
            ssmProperties.set("Session", "null");
        configLayerProps.addParameter('ssmParameters', ssmProperties);
        let configLayer = new configurationLayer_1.ConfigurationLayer(this, 'ConfigurationLayer', configLayerProps);
        // storage layer
        let storageLayer = new storageLayer_1.StorageLayer(this, 'StorageStorage', this.properties);
        let cdnLayer = null;
        if (DEPLOY_CDN) {
            let cdnLayerProps = new resourceawarestack_1.ParameterAwareProps(this.properties);
            cdnLayerProps.addParameter('appbucket', storageLayer.getResource('appbucket'));
            cdnLayer = new contentDeliveryLayer_1.ContentDeliveryLayer(this, 'ContentDeliveryLayer', cdnLayerProps);
        }
        // database layer
        let databaseLayer = new databaseLayer_1.DatabaseLayer(this, 'DatabaseLayer', this.properties);
        // processing layer
        let processingLayerProps = new resourceawarestack_1.ParameterAwareProps(this.properties);
        if (SESSION_PARAMETER)
            processingLayerProps.addParameter('parameter.session', configLayer.getResource('parameter.session'));
        processingLayerProps.addParameter('table.sessionControl', databaseLayer.getResource('table.sessionControl'));
        processingLayerProps.addParameter('table.sessionTopX', databaseLayer.getResource('table.sessionTopX'));
        processingLayerProps.addParameter('table.session', databaseLayer.getResource('table.session'));
        let processingLayer = new processingLayer_1.ProcessingLayer(this, 'ProcessingLayer', processingLayerProps);
        // WebSocket Layer
        let webSocketLayerProps = new resourceawarestack_1.ParameterAwareProps(this.properties);
        webSocketLayerProps.addParameter('table.sessionControl', databaseLayer.getResource('table.sessionControl'));
        new websocketLayer_1.WebSocketLayer(this, 'WebSocketLayer', webSocketLayerProps);
        // Ingestion/consumption layer 
        let ingestionConsumptionLayerProps = new resourceawarestack_1.ParameterAwareProps(processingLayerProps);
        ingestionConsumptionLayerProps.addParameter('rawbucketarn', storageLayer.getRawDataBucketArn());
        ingestionConsumptionLayerProps.addParameter('userpool', securityLayer.getUserPoolArn());
        ingestionConsumptionLayerProps.addParameter('userpoolid', securityLayer.getUserPoolId());
        ingestionConsumptionLayerProps.addParameter('table.session', databaseLayer.getResource('table.session'));
        ingestionConsumptionLayerProps.addParameter('table.sessiontopx', databaseLayer.getResource('table.sessiontopx'));
        ingestionConsumptionLayerProps.addParameter('lambda.allocate', processingLayer.getAllocateFunctionRef());
        ingestionConsumptionLayerProps.addParameter('lambda.deallocate', processingLayer.getDeallocateFunctionArn());
        ingestionConsumptionLayerProps.addParameter('lambda.scoreboard', processingLayer.getScoreboardFunctionRef());
        ingestionConsumptionLayerProps.addParameter('security.playersrole', securityLayer.getResource('security.playersrole'));
        ingestionConsumptionLayerProps.addParameter('security.managersrole', securityLayer.getResource('security.managersrole'));
        let icl = new ingestionConsumptionLayer_1.IngestionConsumptionLayer(this, 'IngestionConsumptionLayer', ingestionConsumptionLayerProps);
        new aws_cdk_lib_1.CfnOutput(this, "apigtw", {
            description: "API Gateway URL",
            value: icl.getResource("apigtw.url"),
            exportName: this.properties.getApplicationName().toLocaleLowerCase() + ":apigtw"
        });
        new aws_cdk_lib_1.CfnOutput(this, "region", {
            description: "region",
            value: this.region,
            exportName: this.properties.getApplicationName().toLocaleLowerCase() + ":region"
        });
        new aws_cdk_lib_1.CfnOutput(this, "envname", {
            description: "Environment name",
            value: this.properties.getApplicationName(),
            exportName: this.properties.getApplicationName().toLocaleLowerCase() + ":envname"
        });
        if (cdnLayer) {
            new aws_cdk_lib_1.CfnOutput(this, "url", {
                description: "Cloudfront domain for the website (Cloudfront distribution)",
                value: cdnLayer.getResource("cdndomain"),
                exportName: this.properties.getApplicationName().toLocaleLowerCase() + ":url"
            }).node.addDependency(cdnLayer);
        }
    }
}
exports.MainLayer = MainLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbkxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbkxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUFxRTtBQUNyRSxpQ0FBaUM7QUFDakMsNkNBQTZDO0FBQzdDLDhEQUFzRztBQUV0RyxtREFBZ0Q7QUFDaEQsNkRBQTBEO0FBQzFELGlEQUE4QztBQUM5QyxtREFBZ0Q7QUFDaEQsMkVBQXdFO0FBQ3hFLHVEQUFvRDtBQUNwRCxxREFBa0Q7QUFFbEQsaUVBQThEO0FBRTlELElBQUksVUFBVSxHQUFhLEtBQUssQ0FBQztBQUNqQyxJQUFJLGlCQUFpQixHQUFhLEtBQUssQ0FBQztBQUd4QyxNQUFhLFNBQVUsU0FBUSx1Q0FBa0I7SUFFL0MsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1lBQUUsVUFBVSxHQUFHLElBQUksQ0FBQztRQUNoRSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO1lBQUUsaUJBQWlCLEdBQUMsSUFBSSxDQUFDO1FBQzVFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsY0FBYztRQUVaLGlCQUFpQjtRQUNqQixJQUFJLGFBQWEsR0FDZixJQUFJLDZCQUFhLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFNUQsc0JBQXNCO1FBQ3RCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSx3Q0FBbUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsSUFBSSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDOUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFDbkUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDL0QsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDakUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBRXZFLElBQUksaUJBQWlCO1lBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUQsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUU5RCxJQUFJLFdBQVcsR0FDYixJQUFJLHVDQUFrQixDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXZFLGdCQUFnQjtRQUNoQixJQUFJLFlBQVksR0FDZCxJQUFJLDJCQUFZLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU1RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLGFBQWEsR0FBRyxJQUFJLHdDQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3RCxhQUFhLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0UsUUFBUSxHQUFHLElBQUksMkNBQW9CLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ2xGO1FBR0QsaUJBQWlCO1FBQ2pCLElBQUksYUFBYSxHQUNmLElBQUksNkJBQWEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUc1RCxtQkFBbUI7UUFDbkIsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLHdDQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRSxJQUFJLGlCQUFpQjtZQUFFLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUUxSCxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDN0csb0JBQW9CLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQ3ZHLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLElBQUksZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUV6RixrQkFBa0I7UUFDbEIsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLHdDQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRSxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDNUcsSUFBSSwrQkFBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBRWhFLCtCQUErQjtRQUMvQixJQUFJLDhCQUE4QixHQUFHLElBQUksd0NBQW1CLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNuRiw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFDaEcsOEJBQThCLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBQyxhQUFhLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUN2Riw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLDhCQUE4QixDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ3hHLDhCQUE4QixDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBQyxhQUFhLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUNoSCw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztRQUN4Ryw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUMsZUFBZSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQztRQUM1Ryw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUMsZUFBZSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQztRQUM1Ryw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDdkgsOEJBQThCLENBQUMsWUFBWSxDQUFDLHVCQUF1QixFQUFFLGFBQWEsQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1FBQ3pILElBQUksR0FBRyxHQUFHLElBQUkscURBQXlCLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFDLDhCQUE4QixDQUFDLENBQUM7UUFFMUcsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDNUIsV0FBVyxFQUFHLGlCQUFpQjtZQUMvQixLQUFLLEVBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7WUFDckMsVUFBVSxFQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFDLFNBQVM7U0FDaEYsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDNUIsV0FBVyxFQUFHLFFBQVE7WUFDdEIsS0FBSyxFQUFHLElBQUksQ0FBQyxNQUFNO1lBQ25CLFVBQVUsRUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBQyxTQUFTO1NBQ2hGLENBQUMsQ0FBQztRQUVILElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzdCLFdBQVcsRUFBRyxrQkFBa0I7WUFDaEMsS0FBSyxFQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUU7WUFDNUMsVUFBVSxFQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFDLFVBQVU7U0FDakYsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtnQkFDekIsV0FBVyxFQUFHLDZEQUE2RDtnQkFDM0UsS0FBSyxFQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO2dCQUN6QyxVQUFVLEVBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEdBQUMsTUFBTTthQUM3RSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7Q0FDRjtBQXRHRCw4QkFzR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQtMFxuaW1wb3J0IHsgQXBwLCBDZm5PdXRwdXQgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJUGFyYW1ldGVyQXdhcmVQcm9wcywgUGFyYW1ldGVyQXdhcmVQcm9wcywgUmVzb3VyY2VBd2FyZVN0YWNrIH0gZnJvbSAnLi4vcmVzb3VyY2Vhd2FyZXN0YWNrJztcblxuaW1wb3J0IHsgU2VjdXJpdHlMYXllciB9IGZyb20gJy4vc2VjdXJpdHlMYXllcic7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uTGF5ZXIgfSBmcm9tICcuL2NvbmZpZ3VyYXRpb25MYXllcic7XG5pbXBvcnQgeyBTdG9yYWdlTGF5ZXIgfSBmcm9tICcuL3N0b3JhZ2VMYXllcic7XG5pbXBvcnQgeyBEYXRhYmFzZUxheWVyIH0gZnJvbSAnLi9kYXRhYmFzZUxheWVyJztcbmltcG9ydCB7IEluZ2VzdGlvbkNvbnN1bXB0aW9uTGF5ZXIgfSBmcm9tICcuL2luZ2VzdGlvbkNvbnN1bXB0aW9uTGF5ZXInO1xuaW1wb3J0IHsgUHJvY2Vzc2luZ0xheWVyIH0gZnJvbSAnLi9wcm9jZXNzaW5nTGF5ZXInO1xuaW1wb3J0IHsgV2ViU29ja2V0TGF5ZXIgfSBmcm9tICcuL3dlYnNvY2tldExheWVyJztcblxuaW1wb3J0IHsgQ29udGVudERlbGl2ZXJ5TGF5ZXIgfSBmcm9tICcuL2NvbnRlbnREZWxpdmVyeUxheWVyJztcblxudmFyIERFUExPWV9DRE4gOiBib29sZWFuID0gZmFsc2U7XG52YXIgU0VTU0lPTl9QQVJBTUVURVIgOiBib29sZWFuID0gZmFsc2U7XG5cblxuZXhwb3J0IGNsYXNzIE1haW5MYXllciBleHRlbmRzIFJlc291cmNlQXdhcmVTdGFjayB7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBJUGFyYW1ldGVyQXdhcmVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIGlmIChwcm9wcyAmJiBwcm9wcy5nZXRQYXJhbWV0ZXIoXCJkZXBsb3ljZG5cIikpIERFUExPWV9DRE4gPSB0cnVlO1xuICAgIGlmIChwcm9wcyAmJiBwcm9wcy5nZXRQYXJhbWV0ZXIoXCJzZXNzaW9ucGFyYW1ldGVyXCIpKSBTRVNTSU9OX1BBUkFNRVRFUj10cnVlO1xuICAgIHRoaXMuYnVpbGRSZXNvdXJjZXMoKTtcbiAgfVxuXG4gIGJ1aWxkUmVzb3VyY2VzKCkge1xuXG4gICAgLy8gc2VjdXJpdHkgbGF5ZXJcbiAgICBsZXQgc2VjdXJpdHlMYXllciA9XG4gICAgICBuZXcgU2VjdXJpdHlMYXllcih0aGlzLCAnU2VjdXJpdHlMYXllcicsIHRoaXMucHJvcGVydGllcyk7XG5cbiAgICAvLyBjb25maWd1cmF0aW9uIGxheWVyXG4gICAgbGV0IGNvbmZpZ0xheWVyUHJvcHMgPSBuZXcgUGFyYW1ldGVyQXdhcmVQcm9wcyh0aGlzLnByb3BlcnRpZXMpO1xuXG4gICAgbGV0IHNzbVByb3BlcnRpZXMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAgIHNzbVByb3BlcnRpZXMuc2V0KFwiUmVnaW9uXCIsIHRoaXMucmVnaW9uKTtcbiAgICBzc21Qcm9wZXJ0aWVzLnNldChcIkNsaWVudElkXCIsIHNlY3VyaXR5TGF5ZXIuZ2V0VXNlclBvb2xDbGllbnRJZCgpKTtcbiAgICBzc21Qcm9wZXJ0aWVzLnNldChcIlVzZXJwb29sSWRcIiwgc2VjdXJpdHlMYXllci5nZXRVc2VyUG9vbElkKCkpO1xuICAgIHNzbVByb3BlcnRpZXMuc2V0KFwiVXNlclBvb2xVUkxcIiwgc2VjdXJpdHlMYXllci5nZXRVc2VyUG9vbFVybCgpKTtcbiAgICBzc21Qcm9wZXJ0aWVzLnNldChcIklkZW50aXR5UG9vbElkXCIsIHNlY3VyaXR5TGF5ZXIuZ2V0SWRlbnRpdHlQb29sSWQoKSk7XG5cbiAgICBpZiAoU0VTU0lPTl9QQVJBTUVURVIpIHNzbVByb3BlcnRpZXMuc2V0KFwiU2Vzc2lvblwiLCBcIm51bGxcIik7XG4gICAgY29uZmlnTGF5ZXJQcm9wcy5hZGRQYXJhbWV0ZXIoJ3NzbVBhcmFtZXRlcnMnLCBzc21Qcm9wZXJ0aWVzKTtcblxuICAgIGxldCBjb25maWdMYXllciA9XG4gICAgICBuZXcgQ29uZmlndXJhdGlvbkxheWVyKHRoaXMsICdDb25maWd1cmF0aW9uTGF5ZXInLCBjb25maWdMYXllclByb3BzKTtcblxuICAgIC8vIHN0b3JhZ2UgbGF5ZXJcbiAgICBsZXQgc3RvcmFnZUxheWVyID1cbiAgICAgIG5ldyBTdG9yYWdlTGF5ZXIodGhpcywgJ1N0b3JhZ2VTdG9yYWdlJywgdGhpcy5wcm9wZXJ0aWVzKTtcblxuICAgIGxldCBjZG5MYXllciA9IG51bGw7XG4gICAgaWYgKERFUExPWV9DRE4pIHtcbiAgICAgIGxldCBjZG5MYXllclByb3BzID0gbmV3IFBhcmFtZXRlckF3YXJlUHJvcHModGhpcy5wcm9wZXJ0aWVzKTtcbiAgICAgIGNkbkxheWVyUHJvcHMuYWRkUGFyYW1ldGVyKCdhcHBidWNrZXQnLCBzdG9yYWdlTGF5ZXIuZ2V0UmVzb3VyY2UoJ2FwcGJ1Y2tldCcpKTtcbiAgICAgIGNkbkxheWVyID0gbmV3IENvbnRlbnREZWxpdmVyeUxheWVyKHRoaXMsICdDb250ZW50RGVsaXZlcnlMYXllcicsIGNkbkxheWVyUHJvcHMpO1xuICAgIH1cblxuXG4gICAgLy8gZGF0YWJhc2UgbGF5ZXJcbiAgICBsZXQgZGF0YWJhc2VMYXllciA9XG4gICAgICBuZXcgRGF0YWJhc2VMYXllcih0aGlzLCAnRGF0YWJhc2VMYXllcicsIHRoaXMucHJvcGVydGllcyk7XG4gICAgXG5cbiAgICAvLyBwcm9jZXNzaW5nIGxheWVyXG4gICAgbGV0IHByb2Nlc3NpbmdMYXllclByb3BzID0gbmV3IFBhcmFtZXRlckF3YXJlUHJvcHModGhpcy5wcm9wZXJ0aWVzKTtcbiAgICBpZiAoU0VTU0lPTl9QQVJBTUVURVIpIHByb2Nlc3NpbmdMYXllclByb3BzLmFkZFBhcmFtZXRlcigncGFyYW1ldGVyLnNlc3Npb24nLCBjb25maWdMYXllci5nZXRSZXNvdXJjZSgncGFyYW1ldGVyLnNlc3Npb24nKSk7XG4gICBcbiAgICAgIHByb2Nlc3NpbmdMYXllclByb3BzLmFkZFBhcmFtZXRlcigndGFibGUuc2Vzc2lvbkNvbnRyb2wnLCBkYXRhYmFzZUxheWVyLmdldFJlc291cmNlKCd0YWJsZS5zZXNzaW9uQ29udHJvbCcpKTtcbiAgICAgIHByb2Nlc3NpbmdMYXllclByb3BzLmFkZFBhcmFtZXRlcigndGFibGUuc2Vzc2lvblRvcFgnLCBkYXRhYmFzZUxheWVyLmdldFJlc291cmNlKCd0YWJsZS5zZXNzaW9uVG9wWCcpKTtcbiAgICAgIHByb2Nlc3NpbmdMYXllclByb3BzLmFkZFBhcmFtZXRlcigndGFibGUuc2Vzc2lvbicsIGRhdGFiYXNlTGF5ZXIuZ2V0UmVzb3VyY2UoJ3RhYmxlLnNlc3Npb24nKSk7XG4gICAgbGV0IHByb2Nlc3NpbmdMYXllciA9IG5ldyBQcm9jZXNzaW5nTGF5ZXIodGhpcywgJ1Byb2Nlc3NpbmdMYXllcicsIHByb2Nlc3NpbmdMYXllclByb3BzKTtcbiAgIFxuICAgIC8vIFdlYlNvY2tldCBMYXllclxuICAgIGxldCB3ZWJTb2NrZXRMYXllclByb3BzID0gbmV3IFBhcmFtZXRlckF3YXJlUHJvcHModGhpcy5wcm9wZXJ0aWVzKTtcbiAgICB3ZWJTb2NrZXRMYXllclByb3BzLmFkZFBhcmFtZXRlcigndGFibGUuc2Vzc2lvbkNvbnRyb2wnLCBkYXRhYmFzZUxheWVyLmdldFJlc291cmNlKCd0YWJsZS5zZXNzaW9uQ29udHJvbCcpKTtcbiAgICBuZXcgV2ViU29ja2V0TGF5ZXIodGhpcywgJ1dlYlNvY2tldExheWVyJywgd2ViU29ja2V0TGF5ZXJQcm9wcyk7XG5cbiAgICAvLyBJbmdlc3Rpb24vY29uc3VtcHRpb24gbGF5ZXIgXG4gICAgbGV0IGluZ2VzdGlvbkNvbnN1bXB0aW9uTGF5ZXJQcm9wcyA9IG5ldyBQYXJhbWV0ZXJBd2FyZVByb3BzKHByb2Nlc3NpbmdMYXllclByb3BzKTtcbiAgICBpbmdlc3Rpb25Db25zdW1wdGlvbkxheWVyUHJvcHMuYWRkUGFyYW1ldGVyKCdyYXdidWNrZXRhcm4nLCBzdG9yYWdlTGF5ZXIuZ2V0UmF3RGF0YUJ1Y2tldEFybigpKTtcbiAgICBpbmdlc3Rpb25Db25zdW1wdGlvbkxheWVyUHJvcHMuYWRkUGFyYW1ldGVyKCd1c2VycG9vbCcsc2VjdXJpdHlMYXllci5nZXRVc2VyUG9vbEFybigpKTtcbiAgICBpbmdlc3Rpb25Db25zdW1wdGlvbkxheWVyUHJvcHMuYWRkUGFyYW1ldGVyKCd1c2VycG9vbGlkJywgc2VjdXJpdHlMYXllci5nZXRVc2VyUG9vbElkKCkpO1xuICAgIGluZ2VzdGlvbkNvbnN1bXB0aW9uTGF5ZXJQcm9wcy5hZGRQYXJhbWV0ZXIoJ3RhYmxlLnNlc3Npb24nLGRhdGFiYXNlTGF5ZXIuZ2V0UmVzb3VyY2UoJ3RhYmxlLnNlc3Npb24nKSk7XG4gICAgaW5nZXN0aW9uQ29uc3VtcHRpb25MYXllclByb3BzLmFkZFBhcmFtZXRlcigndGFibGUuc2Vzc2lvbnRvcHgnLGRhdGFiYXNlTGF5ZXIuZ2V0UmVzb3VyY2UoJ3RhYmxlLnNlc3Npb250b3B4JykpO1xuICAgIGluZ2VzdGlvbkNvbnN1bXB0aW9uTGF5ZXJQcm9wcy5hZGRQYXJhbWV0ZXIoJ2xhbWJkYS5hbGxvY2F0ZScscHJvY2Vzc2luZ0xheWVyLmdldEFsbG9jYXRlRnVuY3Rpb25SZWYoKSk7XG4gICAgaW5nZXN0aW9uQ29uc3VtcHRpb25MYXllclByb3BzLmFkZFBhcmFtZXRlcignbGFtYmRhLmRlYWxsb2NhdGUnLHByb2Nlc3NpbmdMYXllci5nZXREZWFsbG9jYXRlRnVuY3Rpb25Bcm4oKSk7XG4gICAgaW5nZXN0aW9uQ29uc3VtcHRpb25MYXllclByb3BzLmFkZFBhcmFtZXRlcignbGFtYmRhLnNjb3JlYm9hcmQnLHByb2Nlc3NpbmdMYXllci5nZXRTY29yZWJvYXJkRnVuY3Rpb25SZWYoKSk7XG4gICAgaW5nZXN0aW9uQ29uc3VtcHRpb25MYXllclByb3BzLmFkZFBhcmFtZXRlcignc2VjdXJpdHkucGxheWVyc3JvbGUnLCBzZWN1cml0eUxheWVyLmdldFJlc291cmNlKCdzZWN1cml0eS5wbGF5ZXJzcm9sZScpKTtcbiAgICBpbmdlc3Rpb25Db25zdW1wdGlvbkxheWVyUHJvcHMuYWRkUGFyYW1ldGVyKCdzZWN1cml0eS5tYW5hZ2Vyc3JvbGUnLCBzZWN1cml0eUxheWVyLmdldFJlc291cmNlKCdzZWN1cml0eS5tYW5hZ2Vyc3JvbGUnKSk7XG4gICAgbGV0IGljbCA9IG5ldyBJbmdlc3Rpb25Db25zdW1wdGlvbkxheWVyKHRoaXMsICdJbmdlc3Rpb25Db25zdW1wdGlvbkxheWVyJyxpbmdlc3Rpb25Db25zdW1wdGlvbkxheWVyUHJvcHMpOyBcbiAgICBcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiYXBpZ3R3XCIsIHtcbiAgICAgIGRlc2NyaXB0aW9uIDogXCJBUEkgR2F0ZXdheSBVUkxcIixcbiAgICAgIHZhbHVlIDogaWNsLmdldFJlc291cmNlKFwiYXBpZ3R3LnVybFwiKSxcbiAgICAgIGV4cG9ydE5hbWUgOiB0aGlzLnByb3BlcnRpZXMuZ2V0QXBwbGljYXRpb25OYW1lKCkudG9Mb2NhbGVMb3dlckNhc2UoKStcIjphcGlndHdcIlxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcInJlZ2lvblwiLCB7XG4gICAgICBkZXNjcmlwdGlvbiA6IFwicmVnaW9uXCIsXG4gICAgICB2YWx1ZSA6IHRoaXMucmVnaW9uLFxuICAgICAgZXhwb3J0TmFtZSA6IHRoaXMucHJvcGVydGllcy5nZXRBcHBsaWNhdGlvbk5hbWUoKS50b0xvY2FsZUxvd2VyQ2FzZSgpK1wiOnJlZ2lvblwiXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiZW52bmFtZVwiLCB7XG4gICAgICBkZXNjcmlwdGlvbiA6IFwiRW52aXJvbm1lbnQgbmFtZVwiLFxuICAgICAgdmFsdWUgOiB0aGlzLnByb3BlcnRpZXMuZ2V0QXBwbGljYXRpb25OYW1lKCksXG4gICAgICBleHBvcnROYW1lIDogdGhpcy5wcm9wZXJ0aWVzLmdldEFwcGxpY2F0aW9uTmFtZSgpLnRvTG9jYWxlTG93ZXJDYXNlKCkrXCI6ZW52bmFtZVwiXG4gICAgfSk7XG5cbiAgICBpZiAoY2RuTGF5ZXIpIHtcbiAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJ1cmxcIiwge1xuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiQ2xvdWRmcm9udCBkb21haW4gZm9yIHRoZSB3ZWJzaXRlIChDbG91ZGZyb250IGRpc3RyaWJ1dGlvbilcIixcbiAgICAgICAgdmFsdWUgOiBjZG5MYXllci5nZXRSZXNvdXJjZShcImNkbmRvbWFpblwiKSxcbiAgICAgICAgZXhwb3J0TmFtZSA6IHRoaXMucHJvcGVydGllcy5nZXRBcHBsaWNhdGlvbk5hbWUoKS50b0xvY2FsZUxvd2VyQ2FzZSgpK1wiOnVybFwiXG4gICAgICB9KS5ub2RlLmFkZERlcGVuZGVuY3koY2RuTGF5ZXIpO1xuICAgIH0gIFxuICB9XG59Il19