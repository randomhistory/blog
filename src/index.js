const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.get('/', (req, res) => {
  const articlesDir = path.join(__dirname, '../data/articles');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  const articles = files.map(f => ({
    id: f.replace('.md', ''),
    title: f.replace('.md', '').replace(/-/g, ' ').toUpperCase(),
    file: f
  }));
  
  res.render('index', { articles });
});

app.get('/article/:id', (req, res) => {
  const articlePath = path.join(__dirname, `../data/articles/${req.params.id}.md`);
  if (fs.existsSync(articlePath)) {
    const content = fs.readFileSync(articlePath, 'utf-8');
    res.render('article', { id: req.params.id, content });
  } else {
    res.status(404).render('404');
  }
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Blog server running at http://localhost:${PORT}`);
});
