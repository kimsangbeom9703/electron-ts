import express, {Request, Response, NextFunction} from 'express';
import fs from 'fs';
import https from 'https';

const app = express();
const port = 443;
// HTTPS 옵션 설정
const options = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost-cert.pem')
};

https.createServer(options, app).listen(port, () => {
    console.log(`Example app listening on port ${port} over HTTPS`);
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('typescript - express!!!!');
});

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.send('test');
});
/*app.listen(3000, () => {
    console.log(`Server listening on port: 3000`);
});*/
