"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mutation_1 = require("./mutation");
const resolver_1 = require("./resolver");
const typedef_1 = require("./typedef");
const queries_1 = require("./queries");
exports.user = { mutations: mutation_1.mutations, resolvers: resolver_1.resolvers, typedefs: typedef_1.typedefs, queries: queries_1.queries };
