import * as React from 'react';
import { shallow } from 'enzyme';
import WorkloadDescription from '../WorkloadDescription';
import { shallowToJson } from 'enzyme-to-json';
var workload = {
    name: 'myworkload',
    type: 'Deployment',
    createdAt: '42',
    resourceVersion: '42',
    istioSidecar: false,
    labels: {},
    appLabel: false,
    versionLabel: false,
    replicas: 1,
    availableReplicas: 1,
    pods: [],
    services: [],
    runtimes: [
        {
            name: 'Vert.x',
            dashboardRefs: []
        },
        {
            name: '42',
            dashboardRefs: []
        }
    ]
};
describe('WorkloadDescription', function () {
    it('should render with runtimes', function () {
        var wrapper = shallow(React.createElement(WorkloadDescription, { workload: workload, namespace: 'my-namespace', istioEnabled: false }));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=WorkloadDescription.test.js.map