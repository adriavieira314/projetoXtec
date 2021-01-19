# XTEC

### Start
Vai entrar na pasta do projeto
```sh
cd app
```
Vai gerar o Build da aplicação em angular
```sh
yarn build
```
Voltar para a raiz do projeto e executar:
```sh
yarn start
```

### Dependencias
Antes de fazer os passos acima é necessário dar o npm install dentro de ```app``` e também na pasta raíz do projeto.

### Obs.:
A aplicação faz uso de uma API que atualiza toda dia das 16 horas ás 4 horas. 
Há uma funçao que busca essa API todo dia as 5horas da manhã, o arquivo XML da API é convertido a json em que a aplicação faz uso.
Ao fazer o clone do projeto, sugiro fazer imediatamente o fetch da API para a aplicação inicializar com esses dados. Descomentando a linha de código abaixo no ```server``` e executar: ```npm start``` ou ```yarn start```
```sh
    // usar como inicio da aplicacao
    // saveXML();
```