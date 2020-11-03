import { __assign, __spreadArrays } from "tslib";
export function concatPagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        merge: function (existing, incoming) {
            return existing ? __spreadArrays(existing, incoming) : incoming;
        },
    };
}
export function offsetLimitPagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        merge: function (existing, incoming, _a) {
            var args = _a.args;
            var merged = existing ? existing.slice(0) : [];
            var start = args ? args.offset : merged.length;
            var end = start + incoming.length;
            for (var i = start; i < end; ++i) {
                merged[i] = incoming[i - start];
            }
            return merged;
        },
    };
}
export function relayStylePagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        read: function (existing, _a) {
            var canRead = _a.canRead;
            if (!existing)
                return;
            var edges = existing.edges.filter(function (edge) { return canRead(edge.node); });
            return __assign(__assign({}, existing), { edges: edges, pageInfo: __assign(__assign({}, existing.pageInfo), { startCursor: cursorFromEdge(edges, 0), endCursor: cursorFromEdge(edges, -1) }) });
        },
        merge: function (existing, incoming, _a) {
            if (existing === void 0) { existing = makeEmptyData(); }
            var args = _a.args;
            var incomingEdges = incoming.edges ? incoming.edges.slice(0) : [];
            if (incoming.pageInfo) {
                updateCursor(incomingEdges, 0, incoming.pageInfo.startCursor);
                updateCursor(incomingEdges, -1, incoming.pageInfo.endCursor);
            }
            var prefix = existing.edges;
            var suffix = [];
            if (args && args.after) {
                var index = prefix.findIndex(function (edge) { return edge.cursor === args.after; });
                if (index >= 0) {
                    prefix = prefix.slice(0, index + 1);
                }
            }
            else if (args && args.before) {
                var index = prefix.findIndex(function (edge) { return edge.cursor === args.before; });
                suffix = index < 0 ? prefix : prefix.slice(index);
                prefix = [];
            }
            else if (incoming.edges) {
                prefix = [];
            }
            var edges = __spreadArrays(prefix, incomingEdges, suffix);
            var pageInfo = __assign(__assign(__assign({}, (incoming.pageInfo || {})), existing.pageInfo), { startCursor: cursorFromEdge(edges, 0), endCursor: cursorFromEdge(edges, -1) });
            var updatePageInfo = function (name) {
                var value = incoming.pageInfo && incoming.pageInfo[name];
                if (value !== void 0) {
                    pageInfo[name] = value;
                }
            };
            if (!prefix.length)
                updatePageInfo("hasPreviousPage");
            if (!suffix.length)
                updatePageInfo("hasNextPage");
            return __assign(__assign(__assign({}, existing), incoming), { edges: edges,
                pageInfo: pageInfo });
        },
    };
}
function makeEmptyData() {
    return {
        edges: [],
        pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: "",
            endCursor: "",
        },
    };
}
function cursorFromEdge(edges, index) {
    if (index < 0)
        index += edges.length;
    var edge = edges[index];
    return edge && edge.cursor || "";
}
function updateCursor(edges, index, cursor) {
    if (index < 0)
        index += edges.length;
    var edge = edges[index];
    if (cursor && edge && cursor !== edge.cursor) {
        edges[index] = __assign(__assign({}, edge), { cursor: cursor });
    }
}
//# sourceMappingURL=pagination.js.map