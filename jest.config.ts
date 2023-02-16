import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  preset: 'ts-jest',
  testEnvironment: 'node'
}

export default jestConfig
