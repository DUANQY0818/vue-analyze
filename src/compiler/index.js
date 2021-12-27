/* @flow */

import { parse } from "./parser/index";
import { optimize } from "./optimizer";
import { generate } from "./codegen/index";
import { createCompilerCreator } from "./create-compiler";

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options); // template -> AST
  if (options.optimize !== false) {
    optimize(ast, options); // AST -> 优化后的AST
  }
  const code = generate(ast, options); // 优化后的AST -> code.render
  return {
    ast,
    render: code.render, // 这个render 是 string， 使用时需要转化成function
    staticRenderFns: code.staticRenderFns, // 静态渲染函数，能得到一颗静态的VNode树
  };
});
