import { GraphType, GroupByType } from '../types/Graph';
import { GraphDataActions } from './GraphDataActions';
import { MessageCenterActions } from './MessageCenterActions';
import { EdgeLabelMode } from '../types/GraphFilter';
import * as API from '../services/Api';
import { serverConfig } from '../config/ServerConfig';
import { PromisesRegistry } from '../utils/CancelablePromises';
var EMPTY_GRAPH_DATA = { nodes: [], edges: [] };
var promiseRegistry = new PromisesRegistry();
var setCurrentRequest = function (promise) {
    return promiseRegistry.register('CURRENT_REQUEST', promise);
};
var GraphDataThunkActions = {
    // action creator that performs the async request
    fetchGraphData: function (namespaces, duration, graphType, injectServiceNodes, edgeLabelMode, showSecurity, showUnusedNodes, node) {
        return function (dispatch, _getState) {
            if (namespaces.length === 0) {
                dispatch(GraphDataActions.getGraphDataWithoutNamespaces());
                return Promise.resolve();
            }
            dispatch(GraphDataActions.getGraphDataStart());
            var restParams = {
                duration: duration + 's',
                graphType: graphType,
                injectServiceNodes: injectServiceNodes
            };
            if (namespaces.find(function (namespace) { return namespace.name === serverConfig.istioNamespace; })) {
                restParams.includeIstio = true;
            }
            if (graphType === GraphType.APP || graphType === GraphType.VERSIONED_APP) {
                restParams.groupBy = GroupByType.APP;
            }
            // Some appenders are expensive so only specify an appender if needed.
            var appenders = 'deadNode,sidecarsCheck,serviceEntry,istio';
            if (!node && showUnusedNodes) {
                // note we only use the unusedNode appender if this is NOT a drilled-in node graph and
                // the user specifically requests to see unused nodes.
                appenders += ',unusedNode';
            }
            if (showSecurity) {
                appenders += ',securityPolicy';
            }
            switch (edgeLabelMode) {
                case EdgeLabelMode.RESPONSE_TIME_95TH_PERCENTILE:
                    appenders += ',responseTime';
                    break;
                case EdgeLabelMode.REQUESTS_PER_SECOND:
                case EdgeLabelMode.REQUESTS_PERCENTAGE:
                case EdgeLabelMode.NONE:
                default:
                    break;
            }
            restParams.appenders = appenders;
            if (node) {
                return setCurrentRequest(API.getNodeGraphElements(node, restParams)).then(function (response) {
                    var responseData = response.data;
                    var graphData = responseData && responseData.elements ? responseData.elements : EMPTY_GRAPH_DATA;
                    var timestamp = responseData && responseData.timestamp ? responseData.timestamp : 0;
                    var graphDuration = responseData && responseData.duration ? responseData.duration : 0;
                    dispatch(GraphDataActions.getGraphDataSuccess(timestamp, graphDuration, graphData));
                }, function (error) {
                    var emsg;
                    if (error.isCanceled) {
                        return;
                    }
                    if (error.response && error.response.data && error.response.data.error) {
                        emsg = 'Cannot load the graph: ' + error.response.data.error;
                    }
                    else {
                        emsg = 'Cannot load the graph: ' + error.toString();
                    }
                    dispatch(MessageCenterActions.addMessage(emsg));
                    dispatch(GraphDataActions.getGraphDataFailure(emsg));
                });
            }
            restParams.namespaces = namespaces.map(function (namespace) { return namespace.name; }).join(',');
            return setCurrentRequest(API.getGraphElements(restParams)).then(function (response) {
                var responseData = response.data;
                var graphData = responseData && responseData.elements ? responseData.elements : EMPTY_GRAPH_DATA;
                var timestamp = responseData && responseData.timestamp ? responseData.timestamp : 0;
                var graphDuration = responseData && responseData.duration ? responseData.duration : 0;
                dispatch(GraphDataActions.getGraphDataSuccess(timestamp, graphDuration, graphData));
            }, function (error) {
                var emsg;
                if (error.isCanceled) {
                    return;
                }
                if (error.response && error.response.data && error.response.data.error) {
                    emsg = 'Cannot load the graph: ' + error.response.data.error;
                }
                else {
                    emsg = 'Cannot load the graph: ' + error.toString();
                }
                dispatch(MessageCenterActions.addMessage(emsg));
                dispatch(GraphDataActions.getGraphDataFailure(emsg));
            });
        };
    }
};
export default GraphDataThunkActions;
//# sourceMappingURL=GraphDataThunkActions.js.map