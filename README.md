# *API-RESTful-Marvel*

## Com o intuito de iniciar o banco de dados utilizando MongoDb, por favor realizar os seguintes comandos em um terminal:

### docker:
####	~docker ps -a (verificar se existe algum container utilizando imagem mongo, caso não tenha seguir para "new terminal")
####	~docker stop -container (caso exista algum container utilizando imagem mongo, para sua execução")
####	~docker rm -container (após parar sua execução, deletar esse conainer")
####	~mongod --dbpath API-RESTful-Marvel/data/ (iniciar servidor mongo utilizando diretório contendo aplicação)

### new terminal: (executar esses comandos em outro terminal)
####	~mongo (inicializa novo servidor mongo em localhost:27017)
####	~use API-RESTful-Marvel (redireciona para localhost:3000)

## Comandos úteis:

####	~db.users.insert() (adiciona novos dados diretamente no banco de dados)
####	~db.users.find().pretty(lista dados no banco de dados)
####	~db.dropDatabase(apaga todos os dados do banco de dados)
