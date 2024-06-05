import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload ,message } from 'antd';


const UploadTest = () => {

  const [uploading, setUploading] = useState(false);
        
    const [files, setFiles] = useState([]);

    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

const { fileList } = state;

  const props = {
    onRemove: (file) => {
        setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },

    beforeUpload: (file) => {
        if (state.fileList.length >= 1) {
            message.error('Solo puedes subir un archivo a la vez');
            setState((state) => {
              const index = state.fileList.indexOf(file);
              const newFileList = state.fileList.slice();
              newFileList.splice(index, 1);
              return {
                fileList: newFileList,
              };
            });
            return false || Upload.LIST_IGNORE;
        }
      // Check that the file is pdf
  const isFile = file.type === 'application/pdf' 
        || file.type === 'image/png' 
        || file.type === 'image/jpg'
        || file.type === 'image/jpeg'
    ;
      // If it isn't pdf then delete the file
      if (!isFile) {
        message.error('Solo puedes subir archivos PDF');
          setState((state) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList,
            };
          });
          return false;
        }
      setState((state) => ({
        fileList: [...state.fileList, file],
      }));
      return false;
    },
    fileList
  };

  const handleUpload = () => {
    const { fileList } = state;
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("myFiles", file, '-' + file.name);
    });

  
    setUploading(true);

    axios.post(process.env.REACT_APP_API_URL + "google/upload/", formData)
      .then(res => {

        console.log("ID", res);
        setState({
          fileList: [],
        });
        setUploading(false);

        message.success("Archivo subido con exito.");
     })
      .catch((error) => {
        console.error(error);
        setState({
          uploading: false,
        });
        message.error("Error al subir el archivo.");
    });
    
  };

  /* const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });

    setUploading(true);

    console.log(fileList);

    setUploading(false);

  }; */

    return(
      <>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>

        <Button
          type="primary"
          onClick={handleUpload}
          //disabled={fileList.length === 0}
          loading={uploading}
          style={{
            marginTop: 16,
          }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </>
    )
}

export default UploadTest