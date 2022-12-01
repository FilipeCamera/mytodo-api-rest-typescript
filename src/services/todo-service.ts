import { Todo, User } from '../models';
import { TodoRepository } from '../repositories';

export default class TodoService {
  private readonly todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async createAndSave(text: string, user: User): Promise<Todo> {
    const todo = this.todoRepository.create({ text, user });

    return await this.todoRepository.save(todo);
  }

  async findAllByUserId(id: string): Promise<Array<Todo>> {
    return await this.todoRepository.find({ where: { user: { id } } });
  }
}
