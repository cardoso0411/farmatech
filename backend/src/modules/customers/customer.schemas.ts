import { z } from 'zod';

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const createCustomerSchema = z
  .object({
    personType: z.enum(['INDIVIDUAL', 'COMPANY']).default('INDIVIDUAL'),
    customerTypeId: z.string().optional(),
    fullName: optionalTrimmedString(255),
    tradeName: optionalTrimmedString(255),
    legalName: optionalTrimmedString(255),
    cpf: optionalTrimmedString(20),
    rg: optionalTrimmedString(20),
    cnpj: optionalTrimmedString(20),
    stateRegistration: optionalTrimmedString(30),
    phone: optionalTrimmedString(20),
    mobilePhone: optionalTrimmedString(20),
    email: z
      .string()
      .trim()
      .email('E-mail inválido.')
      .optional()
      .or(z.literal(''))
      .transform((value) => (value ? value : undefined)),
    address: optionalTrimmedString(255),
    addressNumber: optionalTrimmedString(20),
    district: optionalTrimmedString(120),
    zipCode: optionalTrimmedString(20),
    city: optionalTrimmedString(120),
    state: optionalTrimmedString(120),
    birthDate: z.string().datetime().optional(),
    spcDate: z.string().datetime().optional(),
    isBlocked: z.boolean().default(false),
    hasSubscription: z.boolean().default(false),
    classification: z.enum(['GOOD', 'MEDIUM', 'BAD']).default('GOOD'),
    sellerId: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
    isSupplier: z.boolean().default(false),
    insuranceOnly: z.boolean().default(false),
    insurance: optionalTrimmedString(120),
    notes: optionalTrimmedString(1000),
  })
  .superRefine((data, context) => {
    if (data.personType === 'INDIVIDUAL') {
      if (!data.fullName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fullName'],
          message: 'Nome completo é obrigatório.',
        });
      }

      if (!data.cpf) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cpf'],
          message: 'CPF é obrigatório.',
        });
      }

      if (!data.rg) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rg'],
          message: 'RG é obrigatório.',
        });
      }
    }

    if (data.personType === 'COMPANY') {
      if (!data.cnpj) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cnpj'],
          message: 'CNPJ é obrigatório.',
        });
      }

      if (!data.stateRegistration) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['stateRegistration'],
          message: 'Inscrição Estadual é obrigatória.',
        });
      }

      if (!data.tradeName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tradeName'],
          message: 'Nome fantasia é obrigatório.',
        });
      }

      if (!data.legalName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['legalName'],
          message: 'Razão social é obrigatória.',
        });
      }
    }
  });
