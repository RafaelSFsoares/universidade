
interface ISala {
    numero:string
	capacidade: number
	disponibilidade:boolean
	nomeProfessor:string
	descricao:string
	cpf:string
	senha: string
}

interface ISalaUpdated {
	id: number,
	capacidade: number,
	cpf: string,
	senha: string 
}


interface IAlocarSala{
	matricula_aluno?: string
	cpf:string,
	senha: string,
	idSala: number
    nomeProfessor?:string
}

interface IDeleteSala{
	professorId: number,
	idSala: number,
	cpf: string,
	senha: string,
	alunoId:number
}



export { ISala, ISalaUpdated, IAlocarSala, IDeleteSala}
