import Professores from '../models/professores.js'
// import Salas from '../models/sala.js'
// import hash from '@adonisjs/core/services/hash'
import { accountValidator, loginValidator } from '../validators/validators.js'
import { insertFormat,crudFormat } from '../validators/helpers.js'

export default class ProfessoresController {
  public validator: any
  // RF05
  public async create({ request, response }: any) {
    const data = await request.validate({ schema: accountValidator });

    const professor = await insertFormat(data)
  

    await Professores.create(professor)
    return response.ok({ mensagem: 'Conta criada com sucesso!' });
   
  }

  // RF06
  async update({ request, response }: any) {
    const data = request.only(['cpf', 'senha', 'nomeprofessor', 'email', 'dataNascimento']);
    const professor = await Professores.findBy('cpf', data.cpf);

    if (!professor) return response.notFound({ error: 'Professor não encontrado' });
    this.validator = await request.validate({ schema: loginValidator });

    const format = await crudFormat(data,professor);
  
    professor.merge(format);
    await professor.save();

    return response.ok({ mensagem: 'Cadastro Atualizado com sucesso!' });
  }

  // RF07
  async delete({ request, response }: any) {
    const data = request.only(['cpf', 'senha']);
    const professor = await Professores.findBy('cpf', data.cpf);
   
    if (!professor) return response.notFound({ error: 'Professor não encontrado' });
    this.validator = await request.validate({ schema: loginValidator });

    const format = await crudFormat(data,professor);
  
    professor.merge(format);
    await professor.delete();

    return response.ok({ mensagem: `Professor ${professor.nome}, portador do Cpf:${professor.cpf} removido com sucesso!` });
  }


  // RF08
  async show({ request, response }: any) {
      const data = request.only(['nome', 'email', 'cpf', 'matricula', 'data_nascimento'])
  
      this.validator = await request.validate({ schema: loginValidator })
  
      const professor = await Professores.findBy('cpf', data.cpf)
  
      if (!professor) return response.notFound({ error: 'Professor não encontrado' })
  
  
      const { id, createdAt, updatedAt,  senha, ...rest } = professor.$attributes;
      
      rest.dataNascimento = rest.dataNascimento.toISOString().slice(0, 10);
  
      return rest;
    };
}
