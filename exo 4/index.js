import http from 'node:http';
import fs from 'node:fs';

// Chemin du fichier JSON, relatif à ce fichier (marche peu importe d'où on lance node)
const file = new URL('./books.json', import.meta.url);

// Envoie une réponse JSON avec le bon code et le bon en-tête
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

// Lit le fichier des livres puis appelle callback(err, books)
export function loadBooks(callback) {
  fs.readFile(file, 'utf8', (err, content) => {
    if (err) {
      callback(err);
      return; // on s'arrête ici, sinon le code continue avec un contenu vide
    }

    let books;
    try {
      books = JSON.parse(content);
    } catch (parseError) {
      callback(parseError);
      return;
    }
    callback(null, books);
  });
}

const server = http.createServer((req, res) => {
  const { method } = req;
  // req.url ne contient que le chemin (/books), il faut donc donner une base
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  // '/books/2' -> ['', 'books', '2']
  const parts = pathname.split('/');

  // GET /books -> tous les livres
  if (method === 'GET' && pathname === '/books') {
    loadBooks((err, books) => {
      if (err) {
        sendJson(res, 500, { error: 'Impossible de lire les livres' });
        return;
      }
      sendJson(res, 200, books);
    });
    return;
  }

  // GET /books/:id -> un seul livre
  if (method === 'GET' && parts.length === 3 && parts[1] === 'books') {
    const id = parts[2];
    loadBooks((err, books) => {
      if (err) {
        sendJson(res, 500, { error: 'Impossible de lire les livres' });
        return;
      }
      // l'id de l'URL est du texte : on compare en texte
      const book = books.find((b) => String(b.id) === id);
      if (!book) {
        sendJson(res, 404, { error: 'Book not found' });
        return;
      }
      sendJson(res, 200, book);
    });
    return;
  }

  sendJson(res, 404, { error: 'Route not found' });
});

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
