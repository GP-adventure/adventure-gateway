/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty.pb";
import { Struct } from "./google/protobuf/struct.pb";

export const protobufPackage = "auth";

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export interface GenericResponse {
  data?: { [key: string]: any } | undefined;
  error?: ErrorResponse | undefined;
}

export interface ValidateRequest {
  token: string;
}

export interface ValidateResponse {
  data?: LoginResult | undefined;
  error?: ErrorResponse | undefined;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResult {
  email: string;
  username: string;
  id: number;
}

export interface RegisterResponse {
  data?: RegisterResult | undefined;
  error?: ErrorResponse | undefined;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  email: string;
  username: string;
  id: number;
  isEmailConfirmed: boolean;
  token: string;
}

export interface LoginResponse {
  data?: LoginResult | undefined;
  error?: ErrorResponse | undefined;
}

export interface LogoutResult {
  token: string;
}

export interface LogoutResponse {
  data?: LogoutResult | undefined;
  error?: ErrorResponse | undefined;
}

export interface ConfirmRequest {
  token: string;
}

export interface ConfirmResponse {
  error?: ErrorResponse | undefined;
}

export interface ResendResponse {
  error?: ErrorResponse | undefined;
}

export interface WhoAmIRequest {
  token: string;
}

export interface WhoAmIResult {
  id: number;
  email: string;
  username: string;
  isEmailConfirmed: boolean;
}

export interface WhoAmIResponse {
  data?: WhoAmIResult | undefined;
  error?: ErrorResponse | undefined;
}

export const AUTH_PACKAGE_NAME = "auth";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface AuthServiceClient {
  register(request: RegisterRequest): Observable<RegisterResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  logout(request: Empty): Observable<LogoutResponse>;

  confirm(request: ConfirmRequest): Observable<ConfirmResponse>;

  resend(request: Empty): Observable<ResendResponse>;

  whoAmI(request: WhoAmIRequest): Observable<WhoAmIResponse>;
}

export interface AuthServiceController {
  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  logout(request: Empty): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;

  confirm(request: ConfirmRequest): Promise<ConfirmResponse> | Observable<ConfirmResponse> | ConfirmResponse;

  resend(request: Empty): Promise<ResendResponse> | Observable<ResendResponse> | ResendResponse;

  whoAmI(request: WhoAmIRequest): Promise<WhoAmIResponse> | Observable<WhoAmIResponse> | WhoAmIResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["register", "login", "logout", "confirm", "resend", "whoAmI"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
