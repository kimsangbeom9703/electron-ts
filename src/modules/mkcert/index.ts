import {exec} from 'child_process';
import {promises as fs} from 'fs';
import path from 'path';

async function generateCertificates(): Promise<void> {
    try {
        const mkcertPath: string = path.join(process.cwd(), '/mkcert');
        const sslPath: string = path.join(process.cwd(), '/ssl');
        console.log(mkcertPath)
        // mkcert 디렉터리로 이동
        process.chdir(mkcertPath);

        // mkcert 설치
        await executeCommand('powershell -ExecutionPolicy ByPass "./mkcert -install"');

        // SSL 키 및 인증서 생성
        await executeCommand('powershell -ExecutionPolicy ByPass "./mkcert -key-file localhost-key.pem -cert-file localhost-cert.pem localhost 127.0.0.1 ::1"');

        // 부모 디렉터리로 이동
        process.chdir(__dirname);

        // ssl 디렉터리로 이동
        process.chdir(sslPath);

        // 생성된 키 및 인증서 파일 이동
        await moveFiles(path.join(mkcertPath, 'localhost-cert.pem'), './localhost-cert.pem');
        await moveFiles(path.join(mkcertPath, 'localhost-key.pem'), './localhost-key.pem');

        console.log('Certificates generated and moved successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(command, {windowsHide: true}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({stdout, stderr});
            }
        });
    });
}

async function moveFiles(sourcePath: string, destinationPath: string): Promise<void> {
    await fs.rename(sourcePath, destinationPath);
}

export {generateCertificates};
