# k121
Kenoby's Software Engineer position test.
Amigo Secreto.

# Instruções:
- Avise antes quais e-mails de usuãrios serâo usados para receber o amigo secreto (mailgun pede autorização de cada um antes para poder enviar e-maisl a eles).
- Por simplicidade, crie o pimeiro usuãrio e seu domínimo (admin) via npm run test-creations - retire os comentários apenas das respectivas funções - para entâo fazer login e adicionar os participantes.
- Use um mongodb local ou entâo crie uma conta gratuita em www.mongodb/cloud
- crie o arquivo de configurações apropriado configs.txt:

`{
    "secret": "senha para o hash",
    "mongoUrl": "mongodb://localhost:27017/k121",
    "MAILGUN_ACTIVE_API_KEY": "api key do mailgun",
    "MAILGUN_DOMAIN": "sandboxc4a0182f1ca643b7b9f247a5268d8806.mailgun.org"
}`

- Execute npm install nos dois projetos, k121/ e k121/frontend

# Testes Unitários
- Execute npm run test-others para outras funções