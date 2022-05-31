### Contexto

Essa aplicação é um estudo sobre formas de autenticação.
Nessa aplicação precisamos de um back-end integrado para que forneça as funcionalidades de refresh token via jwt


### Sobre Armazenamento de Informações

#### SessionStorage : Conseguimos armezenar a informação somente se o usuario estiver com a aba do navegador aberta.

#### LocalStorage : Conseguimos recuperar essas informações somente no Client Side(Caso esteja usando somente o React tudo bem agora se usar o Next pode gerar um problema ao persistir esse dados)

#### Cookie : É uma forma de armazenamento mais antiga que conseguimos persistir os dados tanto no client quanto no server 

#### Obs: Nessa implementação estamos usando o nookies(Lib para armazenamento de informações no cookie)