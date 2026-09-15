# Study Garden

Um painel pequeno para cultivar uma rotina de estudos. Ele permite registrar sessões de foco, acompanhar a meta diária de 60 minutos e guardar o progresso no navegador.

## Executar localmente

Como é uma aplicação estática, basta abrir `index.html` no navegador. Para rodar os testes:

```bash
npm test
```

Durante o desenvolvimento, um servidor local também pode ser usado:

```bash
python3 -m http.server 8000
```

Abra <http://localhost:8000> no navegador.

## O que foi praticado

- HTML semântico e CSS responsivo sem framework.
- Estado persistido com `localStorage`.
- Testes smoke com o test runner nativo do Node.js.
- Fluxo Git com branch de feature, commits pequenos, pull request e CI.
