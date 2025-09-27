import { DateTime } from 'luxon'

interface IProfessor {
  nome: string
  email: string
  cpf: string
  senha: string
  dataNascimento: any
  createdAt?:any
  updatedAt?:any
}

interface IProfessorUpdated {
  nome?: string
  email?: string
  senha: string
  cpf: string
  dataNascimento?: any
}


export { IProfessor, IProfessorUpdated }
