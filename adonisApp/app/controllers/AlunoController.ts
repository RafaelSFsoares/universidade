import { accountValidator, loginValidator } from '../validators/validators.js'
import AlunoService from '../service.ts/alunoService.js'

export default class AlunosController {
  public validator: any
  private alunoService = new AlunoService()

  public async create({ request, response }: any) {
    const data = await request.validate({ schema: accountValidator })

    const aluno = await this.alunoService.insereAluno(data)

    return response.ok({ data: 'Conta criada com sucesso!' })
  }

  // RF02
  async update({ request, response }: any) {
    const data = request.only(['cpf', 'senha', 'nome', 'email', 'dataNascimento'])

    this.validator = await request.validate({ schema: loginValidator })
    const aluno = await this.alunoService.atualizaAluno(data)
    if (!aluno) return response.badRequest({ Error: 'Erro ao atualizar aluno!' })
    return response.ok({ data: 'Cadastro Atualizado com sucesso!' })
  }

  // RF03
  async delete({ request, response }: any) {
    const data = request.only(['cpf', 'senha'])
    this.validator = await request.validate({ schema: loginValidator })

    const aluno = await this.alunoService.deleteAluno(data)
    return { data: `Aluno removido com sucesso!` }
  }

  // RF04
  async show({ request, response }: any) {
    const data = request.only(['nome', 'email', 'cpf', 'matricula', 'data_nascimento'])

    this.validator = await request.validate({ schema: loginValidator })

    const aluno = await this.alunoService.listarAluno(data)

    return { data: aluno }
  }

  //   //   // RF16
  //   async listarSalas({ request, response }: any) {
  //     const data = request.only([ 'cpf'])
  //     console.log('passou aqui')
  //     const aluno = await this.alunoService.listarAlunoSalas(data);

  //     return aluno;
  //   }
}
