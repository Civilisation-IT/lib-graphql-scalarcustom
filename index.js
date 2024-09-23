import { GraphQLScalarType, Kind } from 'graphql';

const PaginationScalar = new GraphQLScalarType({
  name: 'Pagination',
  description: 'Pagination scalar type encapsulating pagination details',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (typeof value !== 'object') {
      throw new Error("Invalid pagination input: expected an object.");
    }
    // Valeurs par défaut
    const limit = value.limit ?? 10;
    const pageNumber = value.pageNumber ?? 1;
    const skip = value.skip ?? 0;
    const search = value.search ?? '';
    const sortBy = value.sortBy ?? 'id';

    // Validation des types
    if (typeof limit !== 'number' || typeof pageNumber !== 'number' || (skip && typeof skip !== 'number') ||
        (search && typeof search !== 'string') || (sortBy && typeof sortBy !== 'string')) {
      throw new Error("Invalid pagination input.");
    }

    return {
      limit,
      pageNumber,
      skip,
      search,
      sortBy
    };
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.OBJECT) {
      throw new Error("Invalid pagination input: expected an object.");
    }
    const value = {};
    ast.fields.forEach(field => {
      value[field.name.value] = field.value.value;
    });

    // Valeurs par défaut et validation
    return this.parseValue(value);
  }
});

export default PaginationScalar;
