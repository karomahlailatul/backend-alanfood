"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromGoogleDrive = exports.uploadToGoogleDrive = exports.authenticateGoogle = void 0;
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const authenticateGoogle = () => {
    const privateKeys = process.env.CLOUD_SERVICE_ACCOUNT_PRIVATE_KEY_FULL;
    if (!privateKeys)
        throw new Error("Private key is not found");
    const clientEmail = process.env.CLOUD_SERVICE_ACCOUNT_CLIENT_EMAIL;
    if (!clientEmail)
        throw new Error("Client email is not found");
    const clientId = process.env.CLOUD_SERVICE_ACCOUNT_CLIENT_ID;
    if (!clientId)
        throw new Error("Client id is not found");
    const auth = new googleapis_1.google.auth.GoogleAuth({
        credentials: {
            type: "service_account",
            private_key: privateKeys,
            client_email: clientEmail,
            client_id: clientId,
        },
        scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
};
exports.authenticateGoogle = authenticateGoogle;
const uploadToGoogleDrive = async (file, auth) => {
    const parentFolderId = process.env.CLOUD_SERVICE_ACCOUNT_PARENT_FOLDER_DRIVE;
    if (!file)
        throw new Error("File is not found");
    if (!parentFolderId)
        throw new Error("Parent folder id is not found");
    const fileMetadata = {
        name: new Date().getTime() + "-" + file.originalname.replace(/ /g, "-"),
        parents: [parentFolderId], // Change it according to your desired parent folder id
    };
    const media = {
        mimeType: file.mimetype,
        body: fs_1.default.createReadStream(file.path),
    };
    const driveService = googleapis_1.google.drive({ version: "v3", auth });
    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
    return response;
};
exports.uploadToGoogleDrive = uploadToGoogleDrive;
const deleteFromGoogleDrive = async (fileId, auth) => {
    const fileIdAfterSlice = fileId.slice(38, 71);
    const driveService = googleapis_1.google.drive({ version: "v3", auth });
    const response = await driveService.files.delete({
        fileId: fileIdAfterSlice,
    });
    return response;
};
exports.deleteFromGoogleDrive = deleteFromGoogleDrive;
