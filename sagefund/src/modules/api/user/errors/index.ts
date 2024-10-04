import { HttpException } from "@nestjs/common";

export class DuplicateUserException extends HttpException {
    name = "DuplicateUserException";
}

export class UserNotFoundException extends HttpException {
    name = "UserNotFoundException";
}

export class IncorrectPasswordException extends HttpException {
    name = "IncorrectPasswordException";
}

export class InvalidUserException extends HttpException {
    name = "InvalidUserException";
}

export class EmailAlreadyExistException extends HttpException {
    name = "EmailAlreadyExistException";
}

export class UserGenericException extends HttpException {
    name = "UserGenericException";
}

export class AccountDeletedException extends HttpException {
    name = "AccountDeletedException";
}
