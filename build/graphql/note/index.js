"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notes = void 0;
const mutation_1 = require("./mutation");
const query_1 = require("./query");
const typedef_1 = require("./typedef");
const resolver_1 = require("./resolver");
exports.notes = { mutation: mutation_1.mutation, Query: query_1.Query, typedef: typedef_1.typedef, resolvers: resolver_1.resolvers };
