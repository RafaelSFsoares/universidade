import AlunoController from '#controllers/AlunoController'
import router from '@adonisjs/core/services/router'
import ProfessorController from '#controllers/ProfessoresController'
import SalasController from '#controllers/SalasController'

router.get('/', async () => {
  return {
    hello: 'world',
  }
});

router
  .group(() => {
    //ALUNOS
    router.post('consultaAluno', [AlunoController, 'show']);
    router.post('cadastraAluno', [AlunoController, 'create']);
    router.put('updateAluno', [AlunoController, 'update']);
    router.delete('deleteAluno', [AlunoController, 'delete']);

    //PROFESSOR
    router.post('consultaProfessor', [ProfessorController, 'show']);
    router.post('cadastraProfessor', [ProfessorController, 'create']);
    router.put('updateProfessor', [ProfessorController, 'update']);
    router.delete('deleteProfessor', [ProfessorController, 'delete'])

    //SALAS
    router.post('salas/consultaSala', [SalasController, 'consultaSala']);
    router.post('salas/criaSala', [SalasController, 'criaSala']);
    router.post('salas/alocarAluno', [SalasController, 'alocarAluno']);
    router.put('salas/updateSala', [SalasController, 'updateSala']);
    router.delete('salas/deleteSala', [SalasController, 'deleteSala']);
  })
  .prefix('/api')
