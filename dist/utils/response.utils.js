"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper = (res, result, status, message, pagination) => {
    //   const statusCode = status.toString();
    const resultPrint = {
    // status: '',
    // statusCode: status,
    // data: result,
    // message: message || '',
    // pagination: pagination || {},
    };
    if (status)
        resultPrint.status = status;
    if (result)
        resultPrint.data = result;
    if (message)
        resultPrint.message = message;
    if (pagination)
        resultPrint.pagination = pagination;
    //   const checkStatus = status.toString();
    //   if (checkStatus.match(/^20\d/)) {
    //     resultPrint.status = "Success";
    //   } else if (checkStatus.match(/^40\d/)) {
    //     resultPrint.status = "Client Error";
    //   } else if (checkStatus.match(/^50\d/)) {
    //     resultPrint.status = "Server Error";
    //   }
    res.status(status).json(resultPrint);
};
exports.default = responseHelper;
