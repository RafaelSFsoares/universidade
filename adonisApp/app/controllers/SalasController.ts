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

    return response.ok({ mensagem: `Sala ${data.numero} criada com sucesso!` })
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

    return response.ok({ mensagem: 'Sala editada com sucesso!' })
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

    return response.ok({ message: 'Sala removida com sucesso' })
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

    return resultado
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
      return response.forbidden({ error: 'Apenas o professor criador pode alocar alunos' })
    }

    //RN04: verifica capacidade da sala
    const [
      {
        $extras: { total },
      },
    ] = await sala.related('alunos').query().count('* as total')
    if (Number(total) >= sala.capacidade) {
      return response.badRequest({ error: 'Sala já atingiu a capacidade máxima' })
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

    return response.ok({ message: 'Aluno alocado com sucesso' })
  }

  //   // RF14
  //   async removerAluno({ params, request, response }:any) {
  //     const { alunoId, professorId } = request.only(['alunoId', 'professorId'])

  //     const sala = await Sala.find(params.id)
  //     if (!sala) return response.notFound({ error: 'Sala não encontrada' })

  //     if (sala.professorId !== professorId) {
  //       return response.forbidden({ error: 'Apenas o professor criador pode remover alunos' })
  //     }

  //     await sala.related('alunos').detach([alunoId])
  //     return { message: 'Aluno removido da sala com sucesso' }
  //   }

  //   // RF15
  //   async listarAlunos({ params, response }:any) {
  //     const sala = await Sala.query()
  //       .where('id', params.id)
  //       .preload('alunos')
  //       .first()

  //     if (!sala) return response.notFound({ error: 'Sala não encontrada' })

  //     return sala.alunos;
  //   }
}
