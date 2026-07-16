import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const PayloadValidationPipe = new ValidationPipe({
  whitelist: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const formattedErrors = errors.reduce(
      (acc, err) => {
        acc[err.property] = Object.values(err.constraints ?? {})[0];
        return acc;
      },
      {} as Record<string, string>,
    );

    return new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: formattedErrors,
    });
  },
});
