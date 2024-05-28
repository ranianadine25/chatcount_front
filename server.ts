import express, { Request, Response, NextFunction } from 'express';
import path from 'path';

const PORT = process.env['PORT'] || 4000;

const app = express();

app.use(express.static(path.join(__dirname, '/dist/chatcount-front/browser')));

app.get('/*', function(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, '/dist/chatcount-front/browser/index.html'));
});

app.use(function(req: Request, res: Response, next: NextFunction) {
  res.status(404).send("Sorry, can't find that!");
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
