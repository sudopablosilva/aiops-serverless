"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceAwareConstruct = exports.ResourceAwareStack = exports.ParameterAwareProps = exports.ResourceBag = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const constructs_1 = require("constructs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class ResourceBag {
    constructor(resources) {
        if (resources && resources.getResources()) {
            if (!this.resources)
                this.resources = new Map();
            resources.getResources().forEach((v, k) => {
                this.resources.set(k.toLowerCase(), v);
            });
        }
        ;
    }
    getResources() {
        return this.resources;
    }
    ;
    addResources(resources) {
        if (resources) {
            if (!this.resources)
                this.resources = new Map();
            for (let resourceName of resources.keys()) {
                let name = resourceName.toLowerCase();
                this.resources.set(name, resources.get(name));
            }
        }
    }
    ;
    addResource(key, resource) {
        if (resource) {
            if (!this.resources)
                this.resources = new Map();
            this.resources.set(key.toLowerCase(), resource);
        }
    }
    getResource(key) {
        return this.resources.get(key.toLowerCase());
    }
    getResourcesNames() {
        if (this.resources)
            return this.resources.keys();
        else
            return [];
    }
}
exports.ResourceBag = ResourceBag;
class ParameterAwareProps {
    constructor(props) {
        this.applicationName = (props && props.applicationName && props.applicationName.length > 0) ? props.applicationName : ParameterAwareProps.defaultApplicationName;
        if (props) {
            this.region = props.region;
            this.accountId = props.accountId;
            if (props.getParameters())
                props.getParameters().forEach((v, k) => this.addParameter(k, v));
        }
    }
    setApplicationName(appName) {
        if (appName && appName.length > 0)
            this.applicationName = appName.toUpperCase();
    }
    getApplicationName() {
        let appName = this.applicationName ? this.applicationName : ParameterAwareProps.defaultApplicationName;
        return appName;
    }
    getParameters() {
        return this.parameters;
    }
    ;
    addParameters(parameters) {
        if (parameters) {
            if (!this.parameters)
                this.parameters = new Map();
            for (let parameterName of parameters.keys()) {
                this.parameters.set(parameterName.toLowerCase(), parameters.get(parameterName));
            }
        }
    }
    ;
    addParameter(key, parameter) {
        if (parameter) {
            if (!this.parameters)
                this.parameters = new Map();
            this.parameters.set(key.toLowerCase(), parameter);
        }
    }
    getParameter(key) {
        if (!this.parameters)
            this.parameters = new Map();
        return this.parameters.get(key.toLowerCase());
    }
}
exports.ParameterAwareProps = ParameterAwareProps;
// handling/defining the application name.
// Default is NRTA - Near Real-Time Application
ParameterAwareProps.defaultApplicationName = 'NRTA';
class ResourceAwareStack extends aws_cdk_lib_1.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        if (this.scope)
            this.scope = parent;
        if (!this.properties)
            this.properties = new ParameterAwareProps(props);
        if (!this.properties.accountId)
            this.properties.accountId = this.account;
        if (!this.properties.region)
            this.properties.region = this.region;
    }
    getResources() {
        return this.resources;
    }
    ;
    addResources(resources) {
        if (resources) {
            if (!this.resources)
                this.resources = new Map();
            for (let resourceName of resources.keys()) {
                let name = resourceName.toLowerCase();
                this.resources.set(name, resources.get(name));
            }
        }
    }
    ;
    addResource(key, resource) {
        if (resource) {
            if (!this.resources)
                this.resources = new Map();
            this.resources.set(key.toLowerCase(), resource);
        }
    }
    getResource(key) {
        if (!this.resources)
            this.resources = new Map();
        return this.resources.get(key.toLowerCase());
    }
    getResourcesNames() {
        if (this.resources)
            return this.resources.keys();
        else
            return [];
    }
    getProperties() {
        return this.properties;
    }
}
exports.ResourceAwareStack = ResourceAwareStack;
class ResourceAwareConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.properties = props;
    }
    getResources() {
        return this.resources;
    }
    ;
    addResources(resources) {
        if (resources) {
            if (!this.resources)
                this.resources = new Map();
            for (let resourceName of resources.keys()) {
                let name = resourceName.toLowerCase();
                this.resources.set(name, resources.get(name));
            }
        }
    }
    ;
    addResource(key, resource) {
        if (resource) {
            if (!this.resources)
                this.resources = new Map();
            this.resources.set(key.toLowerCase(), resource);
        }
    }
    getResource(key) {
        return this.resources.get(key.toLowerCase());
    }
    getResourcesNames() {
        if (this.resources)
            return this.resources.keys();
        else
            return [];
    }
    getProperties() {
        return this.properties;
    }
}
exports.ResourceAwareConstruct = ResourceAwareConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2Vhd2FyZXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVzb3VyY2Vhd2FyZXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUFxRTtBQUNyRSxpQ0FBaUM7QUFDakMsMkNBQXVDO0FBQ3ZDLDZDQUFnRDtBQTJCaEQsTUFBYSxXQUFXO0lBSXBCLFlBQVksU0FBMkI7UUFDbkMsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLFlBQVksRUFBRSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFjLENBQUM7WUFDNUQsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxDQUFBO1NBQ0w7UUFBQSxDQUFDO0lBQ04sQ0FBQztJQUVELFlBQVk7UUFDUixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUFBLENBQUM7SUFFRixZQUFZLENBQUMsU0FBMkI7UUFDcEMsSUFBSSxTQUFTLEVBQUU7WUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBYyxDQUFDO1lBQzVELEtBQUssSUFBSSxZQUFZLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUN2QyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDakQ7U0FDSjtJ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QztJQUVELGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBM0NELHdEQTJDQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInOyBcblxuZXhwb3J0IGludGVyZmFjZSBJRmxleE5hbWVBcHBsaWNhdGlvbiB7XG4gICAgYXBwbGljYXRpb25OYW1lPyA6IHN0cmluZyxcbiAgICBnZXRBcHBsaWNhdGlvbk5hbWUoKSA6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZXNvdXJjZUF3YXJlIHtcbiAgICBnZXRSZXNvdXJjZXMoKSA6IE1hcDxzdHJpbmcsYW55PjtcbiAgICBnZXRSZXNvdXJjZShyZXNvdXJjZU5hbWU6IHN0cmluZykgOiBhbnkgfCB1bmRlZmluZWQ7XG4gICAgYWRkUmVzb3VyY2VzKHJlc291cmNlcyA6IE1hcDxzdHJpbmcsYW55PikgOiB2b2lkO1xuICAgIGFkZFJlc291cmNlKG1hcDogc3RyaW5nLCByZXNvdXJjZTphbnkpIDogdm9pZDtcbiAgICBnZXRSZXNvdXJjZXNOYW1lcygpIDogSXRlcmFibGVJdGVyYXRvcjxzdHJpbmc+IHwgc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBhcmFtZXRlckF3YXJlIHtcbiAgICBnZXRQYXJhbWV0ZXJzKCkgOiBNYXA8c3RyaW5nLGFueT47XG4gICAgZ2V0UGFyYW1ldGVyKHBhcmFtZXRlck5hbWU6IHN0cmluZykgOiBhbnkgfCB1bmRlZmluZWQ7XG4gICAgYWRkUGFyYW1ldGVycyhwYXJhbWV0ZXJzIDogTWFwPHN0cmluZyxhbnk+KSA6IHZvaWQ7XG4gICAgYWRkUGFyYW1ldGVyKG1hcDogc3RyaW5nLCByZXNvdXJjZTphbnkpIDogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRGVwbG95bWVudFRhcmdldCB7XG4gICAgYWNjb3VudElkPyA6IHN0cmluZyxcbiAgICByZWdpb24/IDogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUJhZyBpbXBsZW1lbnRzIElSZXNvdXJjZUF3YXJlIHtcblxuICAgIHByaXZhdGUgcmVzb3VyY2VzIDogTWFwPHN0cmluZyxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocmVzb3VyY2VzPyA6IElSZXNvdXJjZUF3YXJlKSB7XG4gICAgICAgIGlmIChyZXNvdXJjZXMgJiYgcmVzb3VyY2VzLmdldFJlc291cmNlcygpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VzKSB0aGlzLnJlc291cmNlcyA9IG5ldyBNYXA8c3RyaW5nLGFueT4oKTtcbiAgICAgICAgICAgIHJlc291cmNlcy5nZXRSZXNvdXJjZXMoKS5mb3JFYWNoKCAodixrKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuc2V0KGsudG9Mb3dlckNhc2UoKSx2KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UmVzb3VyY2VzKCkgOiBNYXA8c3RyaW5nLGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXM7XG4gICAgfTtcbiAgICBcbiAgICBhZGRSZXNvdXJjZXMocmVzb3VyY2VzIDogTWFwPHN0cmluZyxhbnk+KSB7XG4gICAgICAgIGlmIChyZXNvdXJjZXMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXNvdXJjZXMpIHRoaXMucmVzb3VyY2VzID0gbmV3IE1hcDxzdHJpbmcsYW55PigpO1xuICAgICAgICAgICAgZm9yIChsZXQgcmVzb3VyY2VOYW1lIG9mIHJlc291cmNlcy5rZXlzKCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJlc291cmNlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnNldChuYW1lLCByZXNvdXJjZXMuZ2V0KG5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgYWRkUmVzb3VyY2Uoa2V5OiBzdHJpbmcsIHJlc291cmNlOmFueSkgOiB2b2lkIHtcbiAgICAgICAgaWYgKHJlc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VzKSB0aGlzLnJlc291cmNlcyA9IG5ldyBNYXA8c3RyaW5nLGFueT4oKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnNldChrZXkudG9Mb3dlckNhc2UoKSxyZXNvdXJjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRSZXNvdXJjZShrZXk6IHN0cmluZykgOiBhbnkgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMuZ2V0KGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICBnZXRSZXNvdXJjZXNOYW1lcygpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VzKSByZXR1cm4gdGhpcy5yZXNvdXJjZXMua2V5cygpO1xuICAgICAgICBlbHNlIHJldHVybiBbXTsgXG4gICAgfVxuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBhcmFtZXRlckF3YXJlUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzLCBJUGFyYW1ldGVyQXdhcmUsIElGbGV4TmFtZUFwcGxpY2F0aW9uLCBJRGVwbG95bWVudFRhcmdldCB7XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJBd2FyZVByb3BzIGltcGxlbWVudHMgSVBhcmFtZXRlckF3YXJlUHJvcHMge1xuXG4gICAgYWNjb3VudElkPyA6IHN0cmluZztcbiAgICByZWdpb24/IDogc3RyaW5nO1xuICAgIFxuICAgIFxuICAgIC8vIGhhbmRsaW5nL2RlZmluaW5nIHRoZSBhcHBsaWNhdGlvbiBuYW1lLlxuICAgIC8vIERlZmF1bHQgaXMgTlJUQSAtIE5lYXIgUmVhbC1UaW1lIEFwcGxpY2F0aW9uXG4gICAgc3RhdGljIGRlZmF1bHRBcHBsaWNhdGlvbk5hbWUgOiBzdHJpbmcgPSAnTlJUQSc7XG4gICAgYXBwbGljYXRpb25OYW1lPyA6IHN0cmluZztcbiAgICBzZXRBcHBsaWNhdGlvbk5hbWUoYXBwTmFtZSA6IHN0cmluZykge1xuICAgICAgICBpZiAoYXBwTmFtZSAmJiBhcHBOYW1lLmxlbmd0aD4wKSB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IGFwcE5hbWUudG9VcHBlckNhc2UoKTtcbiAgICB9XG4gICAgZ2V0QXBwbGljYXRpb25OYW1lKCkge1xuICAgICAgICBsZXQgYXBwTmFtZSA9IHRoaXMuYXBwbGljYXRpb25OYW1lID8gdGhpcy5hcHBsaWNhdGlvbk5hbWUgIDogUGFyYW1ldGVyQXdhcmVQcm9wcy5kZWZhdWx0QXBwbGljYXRpb25OYW1lO1xuICAgICAgICByZXR1cm4gYXBwTmFtZTtcbiAgICB9ICAgIFxuICAgIFxuICAgIHBhcmFtZXRlcnMgOiBNYXA8c3RyaW5nLGFueT47XG4gICAgXG4gICAgZ2V0UGFyYW1ldGVycygpIDogTWFwPHN0cmluZyxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1ldGVycztcbiAgICB9O1xuICAgIFxuICAgIGFkZFBhcmFtZXRlcnMocGFyYW1ldGVycyA6IE1hcDxzdHJpbmcsYW55Pikge1xuICAgICAgICBpZiAocGFyYW1ldGVycykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBhcmFtZXRlcnMpIHRoaXMucGFyYW1ldGVycyA9IG5ldyBNYXA8c3RyaW5nLGFueT4oKTtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcmFtZXRlck5hbWUgb2YgcGFyYW1ldGVycy5rZXlzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMuc2V0KHBhcmFtZXRlck5hbWUudG9Mb3dlckNhc2UoKSwgcGFyYW1ldGVycy5nZXQocGFyYW1ldGVyTmFtZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGFkZFBhcmFtZXRlcihrZXk6IHN0cmluZywgcGFyYW1ldGVyOmFueSkgOiB2b2lkIHtcbiAgICAgICAgaWYgKHBhcmFtZXRlcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBhcmFtZXRlcnMpIHRoaXMucGFyYW1ldGVycyA9IG5ldyBNYXA8c3RyaW5nLGFueT4oKTtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5zZXQoa2V5LnRvTG93ZXJDYXNlKCkscGFyYW1ldGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFBhcmFtZXRlcihrZXk6IHN0cmluZykgOiBhbnkgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAoIXRoaXMucGFyYW1ldGVycykgdGhpcy5wYXJhbWV0ZXJzID0gbmV3IE1hcDxzdHJpbmcsYW55PigpO1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbWV0ZXJzLmdldChrZXkudG9Mb3dlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBJUGFyYW1ldGVyQXdhcmVQcm9wcykge1xuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uTmFtZSA9IChwcm9wcyAmJiBwcm9wcy5hcHBsaWNhdGlvbk5hbWUgJiYgcHJvcHMuYXBwbGljYXRpb25OYW1lLmxlbmd0aCA+IDApID8gcHJvcHMuYXBwbGljYXRpb25OYW1lIDogUGFyYW1ldGVyQXdhcmVQcm9wcy5kZWZhdWx0QXBwbGljYXRpb25OYW1lO1xuICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaW9uID0gcHJvcHMucmVnaW9uO1xuICAgICAgICAgICAgdGhpcy5hY2NvdW50SWQgPSBwcm9wcy5hY2NvdW50SWQ7XG4gICAgICAgICAgICBpZiAocHJvcHMuZ2V0UGFyYW1ldGVycygpKSBwcm9wcy5nZXRQYXJhbWV0ZXJzKCkuZm9yRWFjaCggKHYsaykgPT4gdGhpcy5hZGRQYXJhbWV0ZXIoayx2KSApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUF3YXJlU3RhY2sgZXh0ZW5kcyBTdGFjayBpbXBsZW1lbnRzIElSZXNvdXJjZUF3YXJlIHtcblxuICAgIHByb3RlY3RlZCByZXNvdXJjZXMgOiBNYXA8c3RyaW5nLGFueT47XG4gICAgcHJvdGVjdGVkIHNjb3BlOiBDb25zdHJ1Y3QgfCB1bmRlZmluZWQ7XG4gICAgcHJvdGVjdGVkIHByb3BlcnRpZXMgOiBJUGFyYW1ldGVyQXdhcmVQcm9wcztcblxuICAgIGNvbnN0cnVjdG9yKHBhcmVudD86IENvbnN0cnVjdCwgbmFtZT86IHN0cmluZywgcHJvcHM/OiBJUGFyYW1ldGVyQXdhcmVQcm9wcykge1xuICAgICAgICBzdXBlcihwYXJlbnQsbmFtZSxwcm9wcyk7XG4gICAgICAgIGlmICh0aGlzLnNjb3BlKVxuICAgICAgICAgICAgdGhpcy5zY29wZSA9IHBhcmVudDtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BlcnRpZXMpIHRoaXMucHJvcGVydGllcyA9IG5ldyBQYXJhbWV0ZXJBd2FyZVByb3BzKHByb3BzKTtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BlcnRpZXMuYWNjb3VudElkKSB0aGlzLnByb3BlcnRpZXMuYWNjb3VudElkID0gdGhpcy5hY2NvdW50O1xuICAgICAgICBpZiAoIXRoaXMucHJvcGVydGllcy5yZWdpb24pIHRoaXMucHJvcGVydGllcy5yZWdpb24gPSB0aGlzLnJlZ2lvbjtcbiAgICB9XG4gICAgXG4gICAgZ2V0UmVzb3VyY2VzKCkgOiBNYXA8c3RyaW5nLGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXM7XG4gICAgfTtcbiAgICBcbiAgICBhZGRSZXNvdXJjZXMocmVzb3VyY2VzIDogTWFwPHN0cmluZyxhbnk+KSB7XG4gICAgICAgIGlmIChyZXNvdXJjZXMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXNvdXJjZXMpIHRoaXMucmVzb3VyY2VzID0gbmV3IE1hcDxzdHJpbmcsYW55PigpO1xuICAgICAgICAgICAgZm9yIChsZXQgcmVzb3VyY2VOYW1lIG9mIHJlc291cmNlcy5rZXlzKCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJlc291cmNlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnNldChuYW1lLCByZXNvdXJjZXMuZ2V0KG5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgYWRkUmVzb3VyY2Uoa2V5OiBzdHJpbmcsIHJlc291cmNlOmFueSkgOiB2b2lkIHtcbiAgICAgICAgaWYgKHJlc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VzKSB0aGlzLnJlc291cmNlcyA9IG5ldyBNYXA8c3RyaW5nLGFueT4oKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnNldChrZXkudG9Mb3dlckNhc2UoKSxyZXNvdXJjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRSZXNvdXJjZShrZXk6IHN0cmluZykgOiBhbnkgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAoIXRoaXMucmVzb3VyY2VzKSB0aGlzLnJlc291cmNlcyA9IG5ldyBNYXA8c3RyaW5nLGFueT4oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLmdldChrZXkudG9Mb3dlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgZ2V0UmVzb3VyY2VzTmFtZXMoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlcykgcmV0dXJuIHRoaXMucmVzb3VyY2VzLmtleXMoKTtcbiAgICAgICAgZWxzZSByZXR1cm4gW107IFxuICAgIH1cblxuICAgIGdldFByb3BlcnRpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXM7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUF3YXJlQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSVJlc291cmNlQXdhcmUge1xuXG4gICAgcmVzb3VyY2VzIDogTWFwPHN0cmluZyxhbnk+O1xuICAgIHByb3RlY3RlZCBwcm9wZXJ0aWVzIDogSVBhcmFtZXRlckF3YXJlUHJvcHM7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSVBhcmFtZXRlckF3YXJlUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsaWQpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wcztcbiAgICB9XG5cbiAgICBnZXRSZXNvdXJjZXMoKSA6IE1hcDxzdHJpbmcsYW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlcztcbiAgICB9O1xuICAgIFxuICAgIGFkZFJlc291cmNlcyhyZXNvdXJjZXMgOiBNYXA8c3RyaW5nLGFueT4pIHtcbiAgICAgICAgaWYgKHJlc291cmNlcykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJlc291cmNlcykgdGhpcy5yZXNvdXJjZXMgPSBuZXcgTWFwPHN0cmluZyxhbnk+KCk7XG4gICAgICAgICAgICBmb3IgKGxldCByZXNvdXJjZU5hbWUgb2YgcmVzb3VyY2VzLmtleXMoKSkge1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gcmVzb3VyY2VOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuc2V0KG5hbWUsIHJlc291cmNlcy5nZXQobmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBhZGRSZXNvdXJjZShrZXk6IHN0cmluZywgcmVzb3VyY2U6YW55KSA6IHZvaWQge1xuICAgICAgICBpZiAocmVzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXNvdXJjZXMpIHRoaXMucmVzb3VyY2VzID0gbmV3IE1hcDxzdHJpbmcsYW55PigpO1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuc2V0KGtleS50b0xvd2VyQ2FzZSgpLHJlc291cmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFJlc291cmNlKGtleTogc3RyaW5nKSA6IGFueSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5nZXQoa2V5LnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIGdldFJlc291cmNlc05hbWVzKCkge1xuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZXMpIHJldHVybiB0aGlzLnJlc291cmNlcy5rZXlzKCk7XG4gICAgICAgIGVsc2UgcmV0dXJuIFtdOyBcbiAgICB9XG5cbiAgICBnZXRQcm9wZXJ0aWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzO1xuICAgIH1cbn1cbiJdfQ==