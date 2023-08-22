import { Response } from "express";

interface Pagination {
  currentPage?: number;
  limit?: number;
  totalData?: number;
  totalPage?: number;
}

interface Result<T> {
  status?: number;
  statusCode?: number;
  data?: T;
  message?: string;
  pagination?: Pagination;
}

const responseHelper = <T>(
  res: Response,
  result: T,
  status: number,
  message?: string,
  pagination?: Pagination
): void => {
//   const statusCode = status.toString();
  const resultPrint: Result<T> = {
    // status: '',
    // statusCode: status,
    // data: result,
    // message: message || '',
    // pagination: pagination || {},
  };

  if (status) resultPrint.status = status;
  if (result) resultPrint.data = result;
  if (message) resultPrint.message = message;
  if (pagination) resultPrint.pagination = pagination;

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

export default responseHelper;
