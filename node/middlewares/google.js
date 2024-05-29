import { google } from "googleapis";
import  fs  from "fs";

const google_Ctrl = {};
//const credentials = require("./credentials.json");
import credentials from './credentials.json'  assert  { type: "json" }; 
//import  file  from "googleapis/build/src/apis/file";

const folderId = "1v-Q_3LzdTfinD3bq51YaWg0VA1vymj1b";
const profileID = "1VTuf7vltW-AFEO2NkhYtdCgISH9zsezu";

//const backupId = "1MpIbGA2F5yAmGcMibp7z-spOsDsOH7de";

const scopes = [
  "https://www.googleapis.com/auth/drive",
];

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);

const drive = google.drive({ version: "v3", auth });


google_Ctrl.getFiles = async (req, res) => {
  let Google = await drive.files.list({
    fields: "files(name, webViewLink, id)",
    orderBy: "createdTime desc",
  });
  res.status(200).json(Google.data.files);
};

google_Ctrl.deleteFile = async function (fileID) {
  let Google = await drive.files.delete({
    'fileId': fileID
  });
  return {message: "Documento eliminado correctamente"};
};

google_Ctrl.uploadFile = async function (myFiles, folderID) {

  console.log(myFiles);

  /* const folderId = folderID;
  // console.log(folderId)
  // console.log(req.files);
  // Authenticating drive API
  const drive = google.drive({ version: "v3", auth });
  var files = myFiles;
  var response = "";

  const multipleFiles = async (_) => {
    if (files.name) files = [files];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      var fileMetadata = {
        name: file.name, // file name that will be saved in google drive
        parents: [folderId],
      };
      var media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.tempFilePath), // Reading the file from our server
      };
      await drive.files
        .create({ resource: fileMetadata, media: media })
        .then(function (file) {
          response += file.data.id + ",";
        });
    }

    response = response.substr(0, response.length - 1);
    console.log(response, "el response");
    console.log("END");

    // return ({files: response});
  };
  await multipleFiles();
  // console.log(response);
  return { files: response }; */
};

google_Ctrl.editFile = async function (myFiles, folderID,fileID) {
  const folderId = folderID;

  const drive = google.drive({ version: "v3", auth });

  var files = myFiles;
  var response = "";

  const multipleFiles = async (_) => {
    // console.log(files.length);
    if (files.name) files = [files];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      var fileMetadata = {
        name: file.name, // file name that will be saved in google drive
        parents: [folderId],
      };
      var media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.tempFilePath), // Reading the file from our server
      };
      console.log({ fileMetadata }, { media }, "***");
      await drive.files
        .create({ resource: fileMetadata, media: media })
        .then(function (file) {
          response += file.data.id + ",";
        });
    }

    response = response.substr(0, response.length - 1);

    // return ({files: response});
  };
  await multipleFiles();
  
  return { files: response };
};

google_Ctrl.uploadPP = async function (myFiles, folderID) {
  const folderId = profileID;
  // console.log(folderId)
  // console.log(req.files);
  // Authenticating drive API
  const drive = google.drive({ version: "v3", auth });
  var files = myFiles;
  var response = "";

  const multipleFiles = async (_) => {
    console.log("START");
    // console.log(files.length);
    if (files.name) files = [files];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      var fileMetadata = {
        name: file.name, // file name that will be saved in google drive
        parents: [folderId],
      };
      var media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.tempFilePath), // Reading the file from our server
      };
      await drive.files
        .create({ resource: fileMetadata, media: media })
        .then(function (file) {
          response += file.data.id + ",";
        });
    }

    response = response.substr(0, response.length - 1);
    console.log("END");

    // return ({files: response});
  };
  await multipleFiles();
  // console.log(response);
  return { picture: response };
};

google_Ctrl.uploadBackup = async function (myBackup) {
  const folderId = backupId;
  const drive = google.drive({ version: "v3", auth });
  var response = "";
  const multipleFiles = async () => {
    var fileMetadata = {
      name: myBackup,
      parents: [folderId],
    };
    var media = {
      mimeType: "application/sql",
      body: fs.createReadStream(`./${myBackup}`), // Reading the file from our server
    };
    await drive.files
      .create({ resource: fileMetadata, media: media })
      .then(function (file) {
        response = file.data.id;
      });
  };
  await multipleFiles();
  return { file: response };
};

google_Ctrl.getFileByID = async (req, res) => {
  console.log(req.params);
  let Google = await drive.files.get({
    fileId: req.params.id,
  });
  res.status(200).json(Google.data);
};

google_Ctrl.getDownload = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  let Google = await drive.files
    .get({ fileId: req.params.id, alt: "media" }, { responseType: "stream" })
    .then((request) => {
      console.log(request);
      fileType = request.headers["content-type"];
      fileName = "file" + "." + fileType;
      fileData = request.data;
      // res.set(request.headers)
      console.log(fileType);
      res.set("Content-Type", fileType);
      res.set("Content-Disposition", "attachment; filename='archivo.png'");
      fileData.pipe(res);
    });
};

google_Ctrl.addFolder = async function (folderName) {
  console.log(folderName);
  var fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: [folderId],
  };

  try {
    const Folder = await await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    return Folder.data.id;
  } catch {
    return res.json({ message: "Invalid" });
  }
};


export default google_Ctrl
