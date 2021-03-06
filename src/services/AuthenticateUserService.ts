import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(' Email ou Senha errada');
    }

    const passwordMAtch = await compare(password, user.password);

    if (!passwordMAtch) {
      throw new Error(' Email ou Senha errada');
    }

    const { secret, expires } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expires,
    });
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
