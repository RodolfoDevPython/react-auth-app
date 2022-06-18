### Contexto

Essa aplicação é um estudo sobre formas de autenticação.
Nessa aplicação precisamos de um back-end integrado para que forneça as funcionalidades de refresh token via jwt


### Sobre Armazenamento de Informações

#### SessionStorage : Conseguimos armezenar a informação somente se o usuario estiver com a aba do navegador aberta.

#### LocalStorage : Conseguimos recuperar essas informações somente no Client Side(Caso esteja usando somente o React tudo bem agora se usar o Next pode gerar um problema ao persistir esse dados)

#### Cookie : É uma forma de armazenamento mais antiga que conseguimos persistir os dados tanto no client quanto no server 

#### Obs: Nessa implementação estamos usando o nookies(Lib para armazenamento de informações no cookie)

#### Criação de Filas de Requisições no axios

Nessa aplicação como estamos trabalhando com autenticações precisamos criar um interceptor de requisições no axios para fazer a validação e a atualização dos tokens nas filas de requisições.

### Cookies
Nessa implementação estamos usando no nookies para trabalhar com cookies.

obs: Quando usamos o nookies nas funções de getServerSidePros... etc. Precisamos passar o contexto para as funções do nookies.


```jsx
export const getServerSideProps: GetServerSideProps = async ( ctx) => {

    //function para parsear os cookies
    const cookies = parseCookies(ctx);

    return {
        props: {}   
    }
}
```


### Verificação se o código está sendo executado pelo client ou pelo server

```jsx
if (process.browser) {
    signOut();
}
```
