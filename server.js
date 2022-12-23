const express = require('express')
const app = express()
const port = 3000
const fs = require("fs");
const bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get("/cadastraTarefa", (_req, res) => {
    var form = "<form action='/tarefa' method='POST'>";
    form += "<fieldset> <legend>ADICIONE UMA NOVA TAREFA</legend><br>";
    form += "<label>Nome da Tarefa: </label><input type='text' name='nome' required><br><p>";
    form += "<label>Data da Solicitação: </label><input type='text' name='data' required placeholder=' Ex.: 00/00/0000'><p>";
    form += "<label>Perfil da tarefa:</label>&nbsp&nbsp&nbsp";
    form += "<label for='status1'>Pessoal</label><input type='radio' value='Pessoal' name='status' required>&nbsp&nbsp&nbsp";
    form += "<label for='status2'>Profissional</label><input type='radio' value='Profissional' name='status' required><br><p>";
    form += "<textarea name='texto' rows='10' cols='50' placeholder='Informações Adicionais'></textarea><br><p>"
    form += "<button>Cadastrar</button></form><br>";
    res.send("<br>" + form);
  });

  app.get("/buscaTarefa", (_req, res) => {
    var form = "<form action='/tarefa' method='GET'>";
    form += "<fieldset> <legend>BUSCAR TAREFA</legend><br>";
    form += "<label>Nome da Tarefa: </label><input type='text' name='nome'><br><p>";
    form += "<label>Data da Solicitação: </label><input type='text' name='data' placeholder=' Ex.: 00/00/0000'><p>";
    form += "<label>Perfil da tarefa:</label>&nbsp&nbsp&nbsp";
    form += "<label for='status1'>Pessoal</label><input type='radio' value='Pessoal' name='status'>&nbsp&nbsp&nbsp";
    form += "<label for='status2'>Profissional</label><input type='radio' value='Profissional' name='status'><br><p>";    
    form += "<button>Buscar</button></form><br>";
    res.send("<br>" + form);
  });

  app.post("/tarefa", urlEncodedParser, (req, res) => {

    var nome = req.body.nome;
    var data = req.body.data;
    var status = req.body.status;
    var texto = req.body.texto
       
    fs.readFile("meuBD.json", "utf8", (erro, text) => {
      if (erro) 
        throw "Deu algum erro: " + erro;
  
      var meuBD = JSON.parse(text);
            
      var codigo = (meuBD.tarefas.length + 1);

      var novaTarefa = {codigo: codigo, nome: nome, data: data, status: status, texto: texto};
      meuBD.tarefas.push(novaTarefa);
  
      var meuBDString = JSON.stringify(meuBD);
      console.log(meuBDString);
  
      fs.writeFile("meuBD.json", meuBDString, (erro) => {
        if (erro) {
          throw "Deu algum erro: " + erro;
        } else {
          res.sendFile(__dirname + '/cadastro.html');
        }
      });
    });
  });

  app.get("/tarefa", urlEncodedParser, (req, res) => {
    
    var nome = req.body.nome;
    var data = req.body.data;
    var status = req.body.status;
        
    console.log(req.query);

          
    fs.readFile("meuBD.json", "utf8", (erro, texto) => {
      if (erro) throw "Deu algum erro: " + erro;
      var meuBD = JSON.parse(texto);
      console.log(meuBD.tarefas.length)

      var tabela = '';
      
      if ((nome != '') || (data != '') || (status != '')){  
        tabela += "<table style='border:1px solid black'>";
        tabela += "<tr style='border:1px solid black' ><th>Código</th><th>Tarefa</th><th>Data</th><th>Status</th><th>Texto</th>";
        for (var i = 0; i < meuBD.tarefas.length; i++){
          console.log(meuBD.tarefas[i].nome)
          if ((nome == meuBD.tarefas[i].nome) || (data == meuBD.tarefas[i].data) || (status == meuBD.tarefas[i].status)){
            console.log(meuBD.tarefas[i].status)
            tabela += `<tr><td style='text-align:center';'border: 1px solid black'>${meuBD.tarefas[i].codigo}</td><td style='text-align:center'>${meuBD.tarefas[i].nome}</td><td style='text-align:center'>${meuBD.tarefas[i].data}</td><td style='text-align:center'>${meuBD.tarefas[i].status}</td><td style='text-align:center'>${meuBD.tarefas[i].texto}</td></tr>`;
          }                
      };     
        //tabela+= "</table>"   
    };    
      res.send(tabela)
   
      
     /* var encontrado = meuBD.tarefas.filter(
        (task) => task.nome == nome || task.data == data || task.status == status); 
      
      console.log(encontrado)

      var exibicao = "";
  
      for (var i = 0; i < encontrado.length; i++) {
        //exibicao += "<a href='/detalhe/" + encontrado[i].codigo + "'>";
        //exibicao += "<b>Codigo: </b> " + meuBD.tarefas.codigo[i] + "<br><li>";
        exibicao += "<b>Nome:</b> " + encontrado[i].nome + "<br><li>";
        exibicao += "<b>Data: </b> " + encontrado[i].data + "<br><li>";
        exibicao += "<b>Status: </b> " + encontrado[i].status + "<br><li>";
        //exibicao += "<b>Texto: </b> " + meuBD.tarefas.texto[i] + "<br>";
        exibicao += "<br>";
      }
  
      res.send(exibicao);
    });
  });*/
    });
  });

  app.listen(port, () => {
    console.log(`Esta aplicação está na a porta ${port}`)
})