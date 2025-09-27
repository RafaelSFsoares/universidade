import Aluno from '../models/aluno.js'
import Professores from '../models/professores.js'
import Sala from '../models/sala.js'
import hash from '@adonisjs/core/services/hash'
import SalaService from '../service.ts/salaService.js'

export default class SalasController {
   private salaService = new SalaService()
  // RF09
  async criaSala({ request, response }: any) {
    const data = request.only([
      'nomeProfessor',
      'descricao',
      'numero',
      'capacidade',
      'disponibilidade',
      'cpf',
      'senha',
    ])

     const sala = await this.salaService.insereSala(data)

    return response.ok({ data: `Sala ${data.numero} criada com sucesso!` })
  }

  // RF10
  async updateSala({ request, response }: any) {
    const data = request.only([
      'id',
      'numero',
      'professor',
      'capacidade',
      'descricao',
      'disponibilidade',
      'cpf',
      'senha',
    ])

    await this.salaService.atualizaSala(data)

    return response.ok({ data: 'Sala editada com sucesso!' })
  }

  // RF11
  async deleteSala({ request, response }: any) {
    const data = request.only(['id', 'cpf', 'senha'])
    
    await this.salaService.deleteSala(data)

    return response.ok({ data: 'Sala removida com sucesso' })
  }

  // RF12
  async consultaSala({ request, response }: any) {
    const { cpf } = request.only(['cpf'])

    // Busca o aluno pelo CPF e já preloads suas salas e professores
    const aluno = await Aluno.query()
      .where('cpf', cpf)
      .preload('salas', (sQuery) => {
        sQuery.select('id', 'numero', 'professorId').preload('professor', (pQuery: any) => {
          pQuery.select('id', 'nome')
        })
      })
      .firstOrFail()

    // Monta o resultado no formato RN06
    const resultado = {
      nome: aluno.nome,
      salas: aluno.salas.map((sala: any) => ({
        numero: sala.numero,
        nomeProfessor: sala.professor.nome,
      })),
    }

    return response.ok({ data: resultado })
  }

  // RF13
  public async alocarAluno({ request, response }: any) {
    const  data = request.only(['matricula_aluno', 'cpf', 'idSala'])

    const alocarAluno = await this.salaService.alocarAluno(data)    

    return response.ok({ data: 'Aluno alocado com sucesso' })
  }

  // RF14
  async removerAlunoSala({ request, response }: any) {
    const data = request.only([
      'id',
      'cpf',
      'senha',
      'idSala',
      'alunoId',
      'professorId',
    ])

    const alocarAluno = await this.salaService.removeAlunoSala(data) 
    
    return { data: `Aluno  removido da sala com sucesso` }
  }

  // RF15
  async listarAlunosSala({ request, response }: any) {
    const { id, cpf, idSala, senha } = request.only(['id', 'cpf', 'senha', 'idSala'])
    //Verifica professor
    const professor = await Professores.findBy('cpf', cpf)
    if (!professor) {
      return response.notFound({ error: `Professor não encontrado para o CPF: ${cpf}` })
    }

    // Busca a sala pelo ID e já preloads os alunos
    const sala = await Sala.query()
      .where('id', idSala)
      .preload('alunos', (aQuery) => {
        aQuery.select('id', 'nome', 'email', 'matricula', 'cpf', 'data_nascimento')
      })
      .firstOrFail()

    // Monta o resultado no formato desejado
    const resultado = {
      id: sala.id,
      numero: sala.numero,
      nomeProfessor: sala.nomeProfessor,
      descricao: sala.descricao,
      alunos: sala.alunos.map((aluno: any) => ({
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
        matricula: aluno.matricula,
        cpf: aluno.cpf,
        dataNascimento: aluno.dataNascimento, // já vem como Date/DateTime
      })),
    }

    if (!sala) return response.notFound({ error: 'Sala não encontrada' })

    return response.ok({ data: resultado })
  }
}
