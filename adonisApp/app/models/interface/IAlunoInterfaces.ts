import { DateTime } from 'luxon'

interface IAluno {
  nome: string
  email: string
  cpf: string
  senha: string
  dataNascimento: any
  createdAt?:any
  updatedAt?:any
}

interface IAlunoUpdated {
  nome?: string
  email?: string
  senha: string
  cpf: string
  dataNascimento?: any
}


export { IAluno, IAlunoUpdated }
