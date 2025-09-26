import Aluno from '../models/aluno.js'
import AlunoRepository from '../repository/alunoRepository.js'
import hash from '@adonisjs/core/services/hash'
import { IAluno, IAlunoUpdated } from '../models/interface/IAlunoInterfaces.js'
export default class AlunoService {
  private alunoRepo = new AlunoRepository()
  async listarAluno(data: IAluno) {
    const aluno = await this.alunoRepo.listar(data)
    if (!aluno) return { error: 'Aluno não encontrado' }

    const { id, createdAt, updatedAt, senha, ...rest } = aluno.$attributes

    rest.dataNascimento = rest.dataNascimento.toISOString().slice(0, 10)

    return rest
  }

  async insereAluno(data: IAluno) {
    const cpfNumbers = data.cpf.replace(/\D/g, '')
    const matricula = cpfNumbers.substring(0, 5)
    const senhaHash = await hash.make(data.senha)
    const dataAniversario = new Date(data.dataNascimento)
    const body = {
      ...data,
      matricula,
      senha: senhaHash,
      dataNascimento: dataAniversario,
    }

    return await this.alunoRepo.criar(body)
  }

  async atualizaAluno(data: IAlunoUpdated) {
    const aluno = await this.alunoRepo.listar(data)

    if (!aluno) return { error: 'Aluno não encontrado' }

    // Verifica se a senha atual está correta
    const senhaValida = await hash.verify(aluno.senha, data.senha)

    if (!senhaValida) {
      return { error: 'Senha atual incorreta' }
    }

    // Atualiza os outros campos
    const { cpf, senha, ...rest } = data

    return await this.alunoRepo.atualizar(rest, aluno)
  }


  async deleteAluno(data: IAlunoUpdated) {
    const aluno = await Aluno.findBy('cpf', data.cpf)

    if (!aluno) return { error: 'Aluno não encontrado' }

    // Verifica se a senha atual está correta
    const senhaValida = await hash.verify(aluno.senha, data.senha)

    if (!senhaValida) {
      return { error: 'Senha atual incorreta' }
    }

    await this.alunoRepo.remover(data, aluno)

    return { data: `Aluno removido com sucesso!` }
  }


//   async listarAlunoSalas(data:any){

//     const aluno = await Aluno.query()
//           .where('id', data.id)
//           .preload('salas', (salaQuery) => {
//             salaQuery.preload('professor')
//           })
//           .first()
    
//         if (!aluno) return ({ error: 'Aluno não encontrado' })
    
//         return {
//           data: {
//             nome: aluno.nome,
//             salas: aluno.salas.map((sala: { numero: any; professor: { nome: any } }) => ({
//               numero: sala.numero,
//               professor: sala.professor?.nome,
//             })),
//           },
//         }
//   }
}
