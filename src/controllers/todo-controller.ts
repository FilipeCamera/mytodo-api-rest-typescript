import { Request, Response } from 'express';
import { StatusCode } from '../enums/status-code';
import { NotFound } from '../helpers/errors';
import { UserService } from '../services';
import { TodoService } from '../services';

export default class TodoController {
  constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService
  ) {}

  async create(req: Request, res: Response) {
    const { user_id } = req;
    const { text } = req.body;

    const user = await this.userService.findById(user_id);

    if (!user) throw new NotFound('User not found');

    const todo = await this.todoService.createAndSave(text, user);

    return res.status(StatusCode.CREATED).json(todo);
  }

  async read(req: Request, res: Response) {
    const { user_id } = req;

    const todos = await this.todoService.findAllByUserId(user_id);

    if (!todos) throw new NotFound('Todos not found!');

    return res.status(StatusCode.OK).json(todos);
  }
}
