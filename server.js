const express = require('express');
const app = express();
const port = 3000;

// Middleware para permitir que o servidor entenda JSON
app.use(express.json());

let usuarios = [];
let saldoUsuarios = {};
let estoque = [];
let compras = [];
let carrinho = {};


// Cadastro de Usuários
app.post('/usuarios', (req, res) => {
  const { id, nome, telefone, email } = req.body;
  usuarios.push({ id, nome, telefone, email });
  saldoUsuarios[id] = 0; // Saldo inicial
  res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id });
});

// Cadastro de Saldo do Usuário
app.post('/usuarios/saldo', (req, res) => {
    const { id, saldo } = req.body;
    if (!saldoUsuarios[id]) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
  
    // Verifica se o usuário existe no array de usuários
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

  });
  
  // Cadastro de produto de estoque
  app.post('/estoque', (req, res) => {
    const { id, nome, preco, quantidade } = req.body;
    estoque.push({ id, nome, preco, quantidade });
    res.status(201).json({ message: 'Produto cadastrado no estoque', produto: { id, nome, preco, quantidade } });
  });


  // Rota de carrinho
  app.post('/carrinho', (req, res) => {
    const { id, produtoId, quantidade } = req.body;

    // Verifica se o usuário existe
    if (!usuarios.find(u => u.id === id)) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Verifica se o produto existe no estoque
    const produto = estoque.find(p => p.id === produtoId);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado no estoque!' });
    }

    // Adiciona o item ao carrinho
    if (!carrinho[id]) {
      carrinho[id] = [];
    }
    carrinho[id].push({ produtoId, quantidade });
    res.status(201).json({ message: 'Item adicionado ao carrinho', carrinho });
  });

  // Visualizar o conteúdo do carrinho do usuário
  app.get('/carrinho/:id', (req, res) => {
    const id = req.params.id;

    // Verifica se o usuário existe
    if (!usuarios.find(u => u.id === id)) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Retorna o carrinho do usuário
    const carrinhoDoUsuario = carrinho[id];
    res.json(carrinhoDoUsuario);
  });

  app.delete('/carrinho/:id/:produtoId', (req, res) => {
    const id = req.params.id;
    const produtoId = req.params.produtoId;
  
    // Verifica se o usuário existe
    const carrinhoDoUsuario = carrinho[id];
    if (!carrinhoDoUsuario) {
      return res.status(404).json({ message: 'Carrinho não encontrado!' });
    }
  
    // Encontra o item no carrinho
    const itemIndex = carrinhoDoUsuario.findIndex(item => item.produtoId === produtoId);
  
    // Se o item não for encontrado, retorna erro
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item não encontrado no carrinho!' });
    }
  
    // Remove o item do carrinho
    carrinhoDoUsuario.splice(itemIndex, 1);
  
    // Retorna sucesso
    res.status(200).json({ message: 'Item removido do carrinho com sucesso!' });
  });

  // Rota principal - Página inicial
app.get('/', (req, res) => {
    res.send(' Bora Codar!');
  });



app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
 