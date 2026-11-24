const server = http.createServer((req, res) => {
  const { method } = req;
  const { pathname } = new URL(req.url);

  if (method === 'GET' && pathname === '/books') {
    sendJson(res, 200, books);
    return;
  }
  sendJson(res, 404, { error: 'Route not found' });
});


const port = process.env.port ?? 3000;


export function loadBooks(callback) {
  fs.readFile(file, 'utf8', (err, content) => {
    if (err) {
      callback(err);
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


if (method === 'GET' && pathname === '/books') {
  const books = loadBooks();
  sendJson(res, 200, books);
  return;
}

if (method === 'GET' && parts.length === 3 && parts[1] === 'books') {
  const id = parts[2];
  const books = await loadBooks();
  const book = books.find((b) => b.id === id);
  ...
}