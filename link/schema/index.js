import { __extends } from "tslib";
import { execute } from 'graphql/execution/execute';
import { ApolloLink } from "../core/index.js";
import { Observable } from "../../utilities/index.js";
var SchemaLink = (function (_super) {
    __extends(SchemaLink, _super);
    function SchemaLink(options) {
        var _this = _super.call(this) || this;
        _this.schema = options.schema;
        _this.rootValue = options.rootValue;
        _this.context = options.context;
        return _this;
    }
    SchemaLink.prototype.request = function (operation) {
        var _this = this;
        return new Observable(function (observer) {
            new Promise(function (resolve) { return resolve(typeof _this.context === 'function'
                ? _this.context(operation)
                : _this.context); }).then(function (context) { return execute(_this.schema, operation.query, _this.rootValue, context, operation.variables, operation.operationName); }).then(function (data) {
                if (!observer.closed) {
                    observer.next(data);
                    observer.complete();
                }
            }).catch(function (error) {
                if (!observer.closed) {
                    observer.error(error);
                }
            });
        });
    };
    return SchemaLink;
}(ApolloLink));
export { SchemaLink };
//# sourceMappingURL=index.js.map