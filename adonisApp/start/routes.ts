import AlunoController from '#controllers/AlunoController'
import router from '@adonisjs/core/services/router'
import ProfessorController from '#controllers/ProfessoresController'
import SalasController from '#controllers/SalasController'

router.get('/api', async () => {
  return {
    status:200,
    api: 'Api server',
  }
})

router
  .group(() => {
    //ALUNOS
    router.post('aluno/consultaAluno', [AlunoController, 'show'])
    router.post('aluno/cadastraAluno', [AlunoController, 'create'])
    router.put('aluno/updateAluno', [AlunoController, 'update'])
    router.delete('aluno/deleteAluno', [AlunoController, 'delete'])
    // router.post('aluno/listarAlunosSala', [AlunoController, 'listarSalas'])
    
    //PROFESSOR
    router.post('professor/consultaProfessor', [ProfessorController, 'show'])
    router.post('professor/cadastraProfessor', [ProfessorController, 'create'])
    router.put('professor/updateProfessor', [ProfessorController, 'update'])
    router.delete('professor/deleteProfessor', [ProfessorController, 'delete'])

    //SALAS
    router.post('salas/AlunoConsultaSala', [SalasController, 'consultaSala'])
    router.post('salas/criaSala', [SalasController, 'criaSala'])
    router.post('salas/alocarAluno', [SalasController, 'alocarAluno'])
    router.put('salas/updateSala', [SalasController, 'updateSala'])
    router.delete('salas/deleteSala', [SalasController, 'deleteSala'])
    router.delete('salas/removerAlunoSala', [SalasController, 'removerAlunoSala'])
    router.post('salas/listarAlunosSala', [SalasController, 'listarAlunosSala'])
  })
  .prefix('/api')
