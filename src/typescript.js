"use strict";
/**
 * Generate typescript interface from table schema
 * Created by xiamx on 2016-08-10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function nameIsReservedKeyword(name) {
    var reservedKeywords = [
        'string',
        'number',
        'package'
    ];
    return reservedKeywords.indexOf(name) !== -1;
}
function normalizeName(name, options, stripTrailingS) {
    if (stripTrailingS === void 0) { stripTrailingS = false; }
    var nameTemp = 'I' + _.capitalize(name);
    if (stripTrailingS && nameTemp.charAt(nameTemp.length - 1) === 's') {
        nameTemp = nameTemp.substr(0, (name.length)) + 'Attr';
    }
    return nameTemp;
    /*
    if (nameIsReservedKeyword(name)) {
        return name + '_'
    } else {
    }
    */
}
function generateTableInterface(tableNameRaw, tableDefinition, options) {
    var tableName = options.transformTypeName(tableNameRaw);
    var members = '';
    var forcedOptionals = ['id', 'createdAt', 'updatedAt'];
    Object.keys(tableDefinition).map(function (c) { return options.transformColumnName(c); }).forEach(function (columnName) {
        members += "" + columnName + (forcedOptionals.indexOf(columnName) !== -1 ? '?' : '') + ": " + tableName + "Fields." + normalizeName(columnName, options) + ";\n";
    });
    return "\n        export interface " + normalizeName(tableName, options, true) + " {\n        " + members + "\n        }\n    ";
}
exports.generateTableInterface = generateTableInterface;
function generateEnumType(enumObject, options) {
    var enumString = '';
    for (var enumNameRaw in enumObject) {
        var enumName = options.transformTypeName(enumNameRaw);
        enumString += "export type " + enumName + " = ";
        enumString += enumObject[enumNameRaw].map(function (v) { return "'" + v + "'"; }).join(' | ');
        enumString += ';\n';
    }
    return enumString;
}
exports.generateEnumType = generateEnumType;
function generateTableTypes(tableNameRaw, tableDefinition, options) {
    var tableName = options.transformTypeName(tableNameRaw);
    var fields = '';
    Object.keys(tableDefinition).forEach(function (columnNameRaw) {
        var type = tableDefinition[columnNameRaw].tsType;
        var nullable = tableDefinition[columnNameRaw].nullable ? '| null' : '';
        var columnName = options.transformColumnName(columnNameRaw);
        fields += "export type " + normalizeName(columnName, options) + " = " + type + nullable + ";\n";
    });
    return "\n        export namespace " + tableName + "Fields {\n        " + fields + "\n        }\n    ";
}
exports.generateTableTypes = generateTableTypes;
//# sourceMappingURL=typescript.js.map