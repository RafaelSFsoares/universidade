import hash from '@adonisjs/core/services/hash'

async function insertFormat(data:any):Promise<any> {
    const cpfNumbers = data.cpf.replace(/\D/g, '');
    const matricula = cpfNumbers.substring(0, 5);
    const senhaHash =  await hash.make(data.senha);
    console.log(senhaHash + ' >>>> senhaHash')

    return {
      ...data,
      matricula,
      senha: senhaHash,
      dataNascimento: new Date(data.dataNascimento),
    };
};



async function crudFormat(data:any,param:any) {

    // Verifica se a senha atual está correta
    const senhaValida = await hash.verify(param.senha, data.senha)
  console.log(senhaValida)
    if (!senhaValida) {
      throw new Error ('Senha atual incorreta');
    }

    // Atualiza os outros campos
    const { cpf, senha, ...rest } = data;

    return rest;
}

export {
    insertFormat,
    crudFormat
}


