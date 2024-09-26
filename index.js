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
    const skip = value.skip ?? (pageNumber - 1) * limit; // Calcul automatique du skip
    const search = value.search ?? '';
    const sortBy = value.sortBy ?? 'id';
    const customSearch = Array.isArray(value.customSearch) ? value.customSearch : [];

    // Validation des types
    if (typeof limit !== 'number' || typeof pageNumber !== 'number' ||
        typeof skip !== 'number' || typeof search !== 'string' ||
        typeof sortBy !== 'string' || !Array.isArray(customSearch)) {
      throw new Error("Invalid pagination input.");
    }

    return {
      limit,
      pageNumber,
      skip,
      search,
      sortBy,
      customSearch
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
