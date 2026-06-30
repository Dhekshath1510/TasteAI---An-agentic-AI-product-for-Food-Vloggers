import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: Partial<T> | any): Promise<T> {
    return this.model.create(item) as unknown as T;
  }

  async findById(id: string, select?: string, options?: QueryOptions): Promise<T | null> {
    const query = this.model.findById(id, {}, options);
    if (select) {
      return query.select(select).exec() as unknown as Promise<T | null>;
    }
    return query.exec() as unknown as Promise<T | null>;
  }

  async findOne(filter: FilterQuery<T>, select?: string, options?: QueryOptions): Promise<T | null> {
    const query = this.model.findOne(filter, {}, options);
    if (select) {
      return query.select(select).exec() as unknown as Promise<T | null>;
    }
    return query.exec() as unknown as Promise<T | null>;
  }

  async find(
    filter: FilterQuery<T>,
    select?: string,
    options?: QueryOptions
  ): Promise<T[]> {
    const query = this.model.find(filter, {}, options);
    if (select) {
      return query.select(select).exec() as unknown as Promise<T[]>;
    }
    return query.exec() as unknown as Promise<T[]>;
  }

  async update(id: string, update: UpdateQuery<T>, options: QueryOptions = { new: true }): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, options).exec() as unknown as Promise<T | null>;
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec() as unknown as Promise<T | null>;
  }

  async deleteMany(filter: FilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }

  async countDocuments(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec() as unknown as Promise<number>;
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const doc = await this.model.exists(filter);
    return !!doc;
  }
}
