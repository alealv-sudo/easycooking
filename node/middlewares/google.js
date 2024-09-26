import { google } from "googleapis";
import  fs  from "fs";

const google_Ctrl = {};
//const credentials = require("./credentials.json");
//import credentials from './easycookingCredentials.json'  assert  { type: "json" }; 
//import  file  from "googleapis/build/src/apis/file";

const recipesID = "1v-Q_3LzdTfinD3bq51YaWg0VA1vymj1b";
const profileID = "1VTuf7vltW-AFEO2NkhYtdCgISH9zsezu";

const credentials = {
    /* type: "service_account",
    project_id: "easycooking-423220",
    private_key_id: "80bf11b7280bd038d46099f369ca9c4fe2e292eb",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCOpEbAIADcjiiy\nzSjGnOfsyG03l9OQf4SKSmEEXI/F8vtihE5iJnGdT52cYHY8JFnBDckii1Ahl+uM\nzrraz21jYYBfzq3a8lZ/KDGyBc30KvViAliJ7CO/Ieunu4Pp4n/hVLQJ+ft/5TQ+\nemjwPKfNanvLgWnxwJVkfeF1+8PWivlvTmpbPQxMd+4kfKE5AWHr9IR8Ie/F6h8t\nuRTR30T8xBp0qXgpDoreTgRHCl4UHkBgGU4KmsjfZtvfSgDVXVx/EKIgM7PDT8yM\nKTxKui2z5YpNPHyd7nIy1vLJR+5qk5IrI/rz8XLtfH6hyI6ExVo06/qmOfgWEZHJ\nIHh0APNhAgMBAAECggEAFTR5YBkMh701HP+VeZEx2T13ybVEZPglV/mer+tNZFFZ\nla0INLHKX2cf4x4OoE+MbZVYZU5DPKXnr9MRFsjnVh1/MWmkPCbykjdYy+zuT8dj\nGzgwuVrletssEToLGOXsZNnBZLTznRu8cd1ODwi1WWWPFGh0u3+0YHAQ6F05ISzm\n/WiD5S2vISyI5MsJEGO2cKOIskCagk1n+9jbWX676o14VDvCrpaoq4ML8TDV07K5\nOqf81DcwL5F2iNsqD+oBJxMmGTeTjaXj5S61Ubbn0z6ARB0yEk1cxldc/lJrFSPJ\nLlOcQ4VqVANyxpbmM4yWx0B+tqnXxtNIpTj3Ux/ckQKBgQDB8DGGx5nOXAe21T+S\nggFnf0tIbJlzLr+ofuLdgp6v5ZkxcnCjMLlOVBv7LYfWVt08WtgY+vFSjxrSnYf7\n8FuI0NjQt1k97aMIBHBXbdEPOiSufeDletQIvy7JHuIQTJ7/ZpeGn96VS5KCKvrd\niUEQTsFCmHyI+xoT8GbIQRoWrwKBgQC8ScSIIEvbWJIlREZCBWM6UaHgkpl+Xvjd\nO3Hct7TlbT85i0+rCqfwNjloP4mQIjXHuWg/6qom/gbbZ8LadNvSLkM+W8bAHIwu\nAnN+g8+btDNUnJa97xdaZQI4TQudqhbznmjuV75HJ7NdEmJtwZnPGx+qllyIjuML\njKhC9Sga7wKBgF/U0KRI/Td7QlSWC1PZ6de6jvi6sRi5gPtBt9i9Mqy4R3qnkgER\nkn+iEDGNzhGb2rZ4LVAqsBSboiVwskFMA+8XRAvejbqMMoNDrj+FhEiB8p5GlVrP\n1vZ7giLfn9VuByMtDrL3TIV5Umv/0PanW/8y60x9DQyjB7/SivdpM/sBAoGBAIlE\n8n4XpZYFbY6zxtDtIplq2CxkVHk3/hEz/F/gooY87kIimXNmMmdC8PlakQy+lBzG\nxAUNLP1+Zztf20PuvC/wQF/fAvgeF+iXKuJKcHnglyeRfah8/baOO18WdGh+j3sO\nuwtAdt1jSTWKaK4B3gOKj7yLIG0CVu6dnjIqjxGLAoGAVVGiql9rxnPt/MdQ081q\npBn3sXkvG7D23y1+GreFZP9ZBPC9MENDZO3IHThgLIxmEYJM6+JSYSylNC6S/hmb\nVFjcdKCqGYq8wx6Pq9jtVXK7wTauZIeMkzzmDonEf2HTGgjsq5Ae6Bdr8iGLfCRO\ny+Cry0qeRD0pEQB216R+CBo=\n-----END PRIVATE KEY-----\n",
    client_email: "easycookingdrive@easycooking-423220.iam.gserviceaccount.com",
    client_id: "103968058290127864625",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/easycookingdrive%40easycooking-423220.iam.gserviceaccount.com",
    universe_domain: "googleapis.com" */
}
  
//const backupId = "1MpIbGA2F5yAmGcMibp7z-spOsDsOH7de";

const scopes = [
  "https://www.googleapis.com/auth/drive",
];

const auth = new google.auth.JWT(
  /* credentials.client_email,
  null,
  credentials.private_key,
  scopes */
);

const drive = google.drive({ version: "v3", auth });

google_Ctrl.getFiles = async (req, res) => {
  let Google = await drive.files.list({
    fields: "files(name, webViewLink, id)",
    orderBy: "createdTime desc",
  });
  res.status(200).json(Google.data.files);
};

google_Ctrl.deleteFile = async function (fileID, res) {

  try {
    const Google = await drive.files.delete({
      'fileId': fileID.params.id
    });
    return {message: "Documento eliminado correctamente"};
  } catch (error) {
    res.json({message: error.message}) 
  } 
  
};

google_Ctrl.uploadFile = async function (myFiles, res) {

 // Authenticating drive API
  const drive = google.drive({ version: "v3", auth });
  var files = myFiles.files.myFiles;
  var folderId = myFiles.body.folderId
  var response = "";

  if (files !== null && folderId !== null) {

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
  
        await drive.files.create({ resource: fileMetadata, media: media })
          .then(function (file) {
            response += file.data.id + ",";
          });
      }
  
      response = response.substr(0, response.length - 1); 
      
    };
    await multipleFiles();
    
    res.json(response)
  }

};


google_Ctrl.editFile = async function (myFiles, folderID,fileID) {
  const folderId = folderID;

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

    // return ({files: response});
  };
  await multipleFiles();
  
  return { files: response };
};

google_Ctrl.uploadPP = async function (myFiles, folderID) {
  const folderId = profileID;
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

  };
  await multipleFiles();
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
  let Google = await drive.files.get({
    fileId: req.params.id,
  });
  res.status(200).json(Google.data);
};

google_Ctrl.getDownload = async (req, res) => {

  try {
    let Google = await drive.files
    .get({ fileId: req.params.id, alt: "media" }, { responseType: "stream" })
    .then((request) => {
      const fileType = request.headers["content-type"];
      const fileName = "file" + "." + fileType;
      const fileData = request.data;
      // res.set(request.headers)
      res.set("Content-Type", fileType);
      res.set("Content-Disposition", "attachment; filename='archivo.png'");
      fileData.pipe(res);
  });
  } catch (error) {
      res.json({message: error.message}) 
  } 
  
};

google_Ctrl.addFolder = async function (folderName) {
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
