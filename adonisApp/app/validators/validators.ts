import { schema, rules } from '@adonisjs/validator'

export const accountValidator = schema.create({
  nome: schema.string({}, [rules.trim()]),
  email: schema.string({}, [rules.email()]),
  cpf: schema.string({}, [rules.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]),
  dataNascimento: schema.date(),
  senha: schema.string({}, [
    rules.minLength(6),
    rules.regex(/^(?=.*[A-Z])(?=.*[#\$&%@!]).*$/),
  ]),
})

export const loginValidator = schema.create({
  cpf: schema.string({}, [
    rules.minLength(11),
    rules.maxLength(14), // permite CPF com ou sem pontos
  ]),
  senha: schema.string.optional({}, [
    rules.minLength(6),
  ])
})