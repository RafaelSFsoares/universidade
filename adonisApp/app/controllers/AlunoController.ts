import Aluno from '../models/aluno.js'
// import Salas from '../models/sala.js'
import hash from '@adonisjs/core/services/hash'
import { accountValidator, loginValidator } from '../validators/validators.js'

export default class AlunosController {
  public validator: any
 
  public async create({ request, response }: any) {
    const data = await request.validate({ schema: accountValidator })

    const cpfNumbers = data.cpf.replace(/\D/g, '')
    const matricula = cpfNumbers.substring(0, 5)
    const senhaHash = await hash.make(data.senha)

    const aluno = await Aluno.create({
      ...data,
      matricula,
      senha: senhaHash,
      dataNascimento: new Date(data.dataNascimento),
    })

    return response.ok({ mensagem: 'Conta criada com sucesso!' })
  }

  // RF02
  async update({ request, response }: any) {
    const data = request.only(['cpf', 'senha', 'nome', 'email', 'dataNascimento'])
    const aluno = await Aluno.findBy('cpf', data.cpf)

    this.validator = await request.validate({ schema: loginValidator })


    if (!aluno) return response.notFound({ error: 'Aluno não encontrado' })

    // Verifica se a senha atual está correta
    const senhaValida = await hash.verify(aluno.senha, data.senha)

    if (!senhaValida) {
      return response.unauthorized({ error: 'Senha atual incorreta' })
    }

    // Atualiza os outros campos
    const { cpf, senha, ...rest } = data;

    aluno.merge(rest);
    
    await aluno.save();
    return response.ok({ mensagem: 'Cadastro Atualizado com sucesso!' })
  }

  // RF03
  async delete({ request, response }: any) {
    const data = request.only(['cpf', 'senha'])
    this.validator = await request.validate({ schema: loginValidator })

    const aluno = await Aluno.findBy('cpf', data.cpf)

    if (!aluno) return response.notFound({ error: 'Aluno não encontrado' })

    // Verifica se a senha atual está correta
    const senhaValida = await hash.verify(aluno.senha, data.senha)

    if (!senhaValida) {
      return response.unauthorized({ error: 'Senha atual incorreta' })
    }

    await aluno.delete()
    return { message: `Aluno ${aluno.nome}, portador do Cpf:${aluno.cpf} removido com sucesso!` }
  }

  // RF04
  async show({ request, response }: any) {
    const data = request.only(['nome', 'email', 'cpf', 'matricula', 'data_nascimento'])

    this.validator = await request.validate({ schema: loginValidator })

    const aluno = await Aluno.findBy('cpf', data.cpf)

    if (!aluno) return response.notFound({ error: 'Aluno não encontrado' })


    const { id, createdAt, updatedAt,  senha, ...rest } = aluno.$attributes;
    
    rest.dataNascimento = rest.dataNascimento.toISOString().slice(0, 10);

    return rest;
  };

  //   // RF16
    async listarSalas({ request, response }:any) {
      const data = request.only(['nome', 'email', 'cpf', 'matricula', 'data_nascimento'])
      const aluno = await Aluno.query()
        .where('id', request.id)
        .preload('salas', (salaQuery) => {
          salaQuery.preload('professor')
        })
        .first()

      if (!aluno) return response.notFound({ error: 'Aluno não encontrado' })

      return {
        nome: aluno.nome,
        salas: aluno.salas.map((sala: { numero: any; professor: { nome: any } }) => ({
          numero: sala.numero,
          professor: sala.professor?.nome,
        })),
      }
    }
}
