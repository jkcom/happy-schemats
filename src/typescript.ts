/**
 * Generate typescript interface from table schema
 * Created by xiamx on 2016-08-10.
 */

import * as _ from 'lodash'

import { TableDefinition } from './schemaInterfaces'
import Options from './options'

function nameIsReservedKeyword (name: string): boolean {
    const reservedKeywords = [
        'string',
        'number',
        'package'
    ]
    return reservedKeywords.indexOf(name) !== -1
}

function normalizeName (name: string, options: Options, stripTrailingS:boolean=false): string {
    var nameTemp: string = 'I' + _.capitalize(name)
    if (stripTrailingS && nameTemp.charAt(nameTemp.length - 1) === 's') {
        nameTemp = nameTemp.substr(0, (name.length)) + 'Attr'
    }
    
    return nameTemp
    /*
    if (nameIsReservedKeyword(name)) {
        return name + '_'
    } else {
    }
    */
}

export function generateTableInterface (tableNameRaw: string, tableDefinition: TableDefinition, options: Options) {
    const tableName = options.transformTypeName(tableNameRaw)
    let members = ''
    const forcedOptionals = ['id', 'createdAt', 'updatedAt']
    Object.keys(tableDefinition).map(c => options.transformColumnName(c)).forEach((columnName) => {
        members += `${columnName}${forcedOptionals.indexOf(columnName)!==-1 ? '?': ''}: ${tableName}Fields.${normalizeName(columnName, options)};\n`
    })

    return `
        export interface ${normalizeName(tableName, options, true)} {
        ${members}
        }
    `
}

export function generateEnumType (enumObject: any, options: Options) {
    let enumString = ''
    for (let enumNameRaw in enumObject) {
        const enumName = options.transformTypeName(enumNameRaw)
        enumString += `export type ${enumName} = `
        enumString += enumObject[enumNameRaw].map((v: string) => `'${v}'`).join(' | ')
        enumString += ';\n'
    }
    return enumString
}

export function generateTableTypes (tableNameRaw: string, tableDefinition: TableDefinition, options: Options) {
    const tableName = options.transformTypeName(tableNameRaw)
    let fields = ''
    Object.keys(tableDefinition).forEach((columnNameRaw) => {
        let type = tableDefinition[columnNameRaw].tsType
        let nullable = tableDefinition[columnNameRaw].nullable ? '| null' : ''
        const columnName = options.transformColumnName(columnNameRaw)
        fields += `export type ${normalizeName(columnName, options)} = ${type}${nullable};\n`
    })

    return `
        export namespace ${tableName}Fields {
        ${fields}
        }
    `
}
