import Aluno from '../models/aluno.js'
import Professores from '../models/professores.js'
import Sala from '../models/sala.js'
import hash from '@adonisjs/core/services/hash'

export default class SalasController {
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

    const professor = await Professores.findBy('cpf', data.cpf)

    if (!professor) return response.badRequest({ error: 'Professor não encontrado!' })

    // Verifica se a senha  está correta
    const senhaValida = await hash.verify(professor.senha, data.senha)

    if (!senhaValida) return response.badRequest({ error: 'Senha incorreta!' })

    const { cpf, senha, ...rest } = data

    rest.professorId = professor.id

    const sala = await Sala.create(rest)

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

    const professor = await Professores.findBy('cpf', data.cpf)

    if (!professor)
      return response.notFound({ error: `Registro não encontrado para o CPF:${data.cpf}` })

    const sala = await Sala.findBy('id', data.id)
    if (!sala) return response.notFound({ error: 'Sala não encontrada' })

    // RN05: só o professor criador pode alocar
    if (sala.professorId !== professor.id) {
      return response.forbidden({
        error: 'Apenas o professor criador pode atualizar dados da sala',
      })
    }

    const { cpf, senha, ...rest } = data

    sala.merge(rest)
    await sala.save()

    return response.ok({ data: 'Sala editada com sucesso!' })
  }

  // RF11
  async deleteSala({ request, response }: any) {
    const data = request.only(['id', 'cpf', 'senha'])

    const professor = await Professores.findBy('cpf', data.cpf)

    if (!professor)
      return response.notFound({ error: `Registro não encontrado para o CPF:${data.cpf}` })

    const sala = await Sala.findBy('id', data.id)
    if (!sala) return response.notFound({ error: 'Sala não encontrada' })

    // RN05: só o professor criador pode alocar
    if (sala.professorId !== professor.id) {
      return response.forbidden({ error: 'Apenas o professor criador pode excluir a sala!' })
    }

    const { cpf, senha, ...rest } = data

    sala.merge(rest)
    await sala.delete()

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
    const { matricula_aluno, cpf, idSala } = request.only(['matricula_aluno', 'cpf', 'idSala'])

    //Verifica professor
    const professor = await Professores.findBy('cpf', cpf)
    if (!professor) {
      return response.notFound({ error: `Professor não encontrado para o CPF: ${cpf}` })
    }

    //Busca sala vinculada ao professor
    const sala = await Sala.query().where('id', idSala).firstOrFail()

    if (!sala) {
      return response.notFound({ error: 'Sala não encontrada' })
    }

    //RN05: apenas o professor criador pode alocar
    if (sala.nomeProfessor !== professor.nome) {
      return response.forbidden({ error: 'Apenas o professor responsável pela sala pode alocar alunos' })
    }

    //RN04: verifica capacidade da sala
    const [
      {
        $extras: { total },
      },
    ] = await sala.related('alunos').query().count('* as total')
    if (Number(total) >= sala.capacidade || !sala.disponibilidade) {
      return response.badRequest({
        error:
          Number(total) >= sala.capacidade
            ? 'Sala já atingiu a capacidade máxima'
            : 'Sala indisponível para alocação de alunos',
      })
    }

    //Verifica aluno
    const aluno = await Aluno.findBy('matricula', matricula_aluno)
    if (!aluno) {
      return response.notFound({
        error: `Aluno não encontrado para a matrícula: ${matricula_aluno}`,
      })
    }

    //RN03: evita duplicidade
    const alunoJaAlocado = await sala
      .related('alunos')
      .query()
      .where('sala_id', idSala) // apenas na sala específica
      .andWhere('aluno_id', aluno.id)
      .first()

    if (alunoJaAlocado) {
      return response.badRequest({ error: 'Aluno já alocado nesta sala' })
    }

    //Aloca aluno
    await sala.related('alunos').attach([aluno.id])

    return response.ok({ data: 'Aluno alocado com sucesso' })
  }

  // RF14
  async removerAlunoSala({ request, response }: any) {
    const { id, cpf, idSala, senha, alunoId, professorId } = request.only([
      'id',
      'cpf',
      'senha',
      'idSala',
      'alunoId',
      'professorId',
    ])

    //Verifica professor
    const professor = await Professores.findBy('cpf', cpf)
    if (!professor) {
      return response.notFound({ error: `Professor não encontrado para o CPF: ${cpf}` })
    }

    const sala = await Sala.find(idSala)
    if (!sala) return response.notFound({ error: 'Sala não encontrada' })

    if (sala.professorId !== professorId) {
      return response.forbidden({ error: 'Apenas o professor criador pode remover alunos' })
    }

    await sala.related('alunos').detach([alunoId])
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
