import { accountValidator, loginValidator } from '../validators/validators.js'
import ProfessorService from '../service.ts/professorService.js'

export default class ProfessoresController {
  public validator: any
  private professorService = new ProfessorService()
  // RF05
  public async create({ request, response }: any) {
    const data = await request.validate({ schema: accountValidator })

    const professor = await this.professorService.insereProfessor(data)

    return response.ok({ data: 'Conta criada com sucesso!' })
  }

  // RF06
  async update({ request, response }: any) {
    const data = request.only(['cpf', 'senha', 'nome', 'email', 'dataNascimento'])

    this.validator = await request.validate({ schema: loginValidator })

    const professor = await this.professorService.atualizaProfessor(data)

    return response.ok({ data: 'Cadastro Atualizado com sucesso!' })
  }

  // RF07
  async delete({ request, response }: any) {
    const data = request.only(['cpf', 'senha'])
    this.validator = await request.validate({ schema: loginValidator })
    
    const professor = await this.professorService.deleteProfessor(data)

    return response.ok({
      data: `Professor removido com sucesso!`,
    })
  }

  // RF08
  async show({ request, response }: any) {
    const data = request.only(['cpf'])

    this.validator = await request.validate({ schema: loginValidator })

    return await this.professorService.listar(data)
  }
}
