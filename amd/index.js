var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./BugView", "./withBugView", "./useBugView"], function (require, exports, BugView_1, withBugView_1, useBugView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useBugView = exports.withBugView = void 0;
    BugView_1 = __importDefault(BugView_1);
    withBugView_1 = __importDefault(withBugView_1);
    useBugView_1 = __importDefault(useBugView_1);
    exports.withBugView = withBugView_1.default;
    exports.useBugView = useBugView_1.default;
    exports.default = BugView_1.default;
});
