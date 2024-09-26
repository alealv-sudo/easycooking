import spawn  from 'node:child_process';
import { log } from 'node:console';
const serverIACTRL = {}

function runPythonScript(scriptPath, args, callback) {
    const pythonProcess = spawn.spawn('python', [scriptPath].concat(args));
 
    let data = '';
    pythonProcess.stdout.on('data', (chunk) => {
        data += chunk.toString(); // Collect data from Python script
    });
 
    pythonProcess.stderr.on('data', (error) => {
        console.error(`stderr: ${error}`);
    });
 
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`);
            callback(`Error: Script exited with code ${code}`, null);
        } else {
            console.log('Python script executed successfully');
            callback(null, data);
        }
    });
}

serverIACTRL.executeIA = async (req, res) => {
    const number = req.params.id;
    "C:/Users/Lenovo/Desktop/easyCooking/ServerIA/serverIAControler/data_procesator.py"
    'C:/Users/franc/Desktop/Easy Cooking/easycooking/ServerIA/serverIAControler/data_procesator.py'
    'D:/Bibliotecas/Documentos/Codes/School/modular/easycooking/ServerIA/serverIAControler/data_procesator.py'
    runPythonScript('/vercel/path0/ServerIA/serverIAControler/data_procesator.py' , [number], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(`ExecuteIA of ${number} is ${result}`);
        }
    });
};
export default serverIACTRL
