const connection = {
  getRepository: jest.fn().mockReturnValue({
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    }),
  }),
};

const ConnectionManager = {
  getInstance: jest.fn().mockResolvedValue(connection),
};

export default ConnectionManager;
