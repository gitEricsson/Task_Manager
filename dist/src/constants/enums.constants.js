"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.TaskStatus = exports.OTPTypes = exports.NotificationList = exports.UserRoles = exports.EmailSubject = exports.UserRoleAbr = void 0;
var UserRoleAbr;
(function (UserRoleAbr) {
    UserRoleAbr["ADMIN"] = "AD";
    UserRoleAbr["USER"] = "US";
    UserRoleAbr["MANAGER"] = "MG";
})(UserRoleAbr || (exports.UserRoleAbr = UserRoleAbr = {}));
var EmailSubject;
(function (EmailSubject) {
    EmailSubject["SUCCESS"] = "";
    EmailSubject["FAILED"] = "";
    EmailSubject["SUBSCRIPTION_SUCCESS"] = "";
    EmailSubject["CANCELLED"] = "";
    EmailSubject["PENDING"] = "";
    EmailSubject["CARD_EXPIRATION"] = "";
    EmailSubject["SUBSCRIPTION_FAILED"] = "";
})(EmailSubject || (exports.EmailSubject = EmailSubject = {}));
var EHTTPMethods;
(function (EHTTPMethods) {
    EHTTPMethods["POST"] = "POST";
    EHTTPMethods["GET"] = "GET";
    EHTTPMethods["PATCH"] = "PATCH";
    EHTTPMethods["DELETE"] = "DELETE";
})(EHTTPMethods || (EHTTPMethods = {}));
var UserRoles;
(function (UserRoles) {
    UserRoles["ADMIN"] = "Admin";
    UserRoles["USER"] = "User";
    UserRoles["MANAGER"] = "Manager";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
var NotificationList;
(function (NotificationList) {
    NotificationList["EMAIL"] = "Email";
    NotificationList["PUSH"] = "Push";
    NotificationList["SMS"] = "Sms";
})(NotificationList || (exports.NotificationList = NotificationList = {}));
var OTPTypes;
(function (OTPTypes) {
    OTPTypes["Email"] = "emailOtp";
    OTPTypes["MFA"] = "2FAOtp";
    OTPTypes["ForgotPassword"] = "forgotPasswordOtp";
})(OTPTypes || (exports.OTPTypes = OTPTypes = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in-progress";
    TaskStatus["COMPLETED"] = "completed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["SUSPENDED"] = "Suspended";
    AccountStatus["ACTIVE"] = "Active";
    AccountStatus["INACTIVE"] = "Inactive";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
